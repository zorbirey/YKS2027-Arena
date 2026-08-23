const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {webcrypto}=require('node:crypto');

const coursesCode=fs.readFileSync('courses-v1.js','utf8');
const engagementCode=fs.readFileSync('engagement-v1.js','utf8');

function cycle(){return new Date(Date.now()-5*3600000).toISOString().slice(0,10);}
function makeElement(id){
  const classes=new Set();
  return {
    id:id,hidden:false,disabled:false,value:'',textContent:'',innerHTML:'',style:{},dataset:{},listeners:{},
    classList:{
      add:function(name){classes.add(name);},
      remove:function(name){classes.delete(name);},
      toggle:function(name,force){if(force===undefined){if(classes.has(name))classes.delete(name);else classes.add(name);}else if(force)classes.add(name);else classes.delete(name);},
      contains:function(name){return classes.has(name);}
    },
    addEventListener:function(type,handler){(this.listeners[type]||(this.listeners[type]=[])).push(handler);},
    scrollIntoView:function(){},
    focus:function(){}
  };
}
function clickTarget(dataset){
  return {closest:function(){return {dataset:dataset};}};
}
function harness(options){
  options=options||{};
  const elements=new Map();
  const get=function(id){if(!elements.has(id))elements.set(id,makeElement(id));return elements.get(id);};
  const filters=['ALL','TYT','AYT'].map(function(value){const el=makeElement('filter-'+value);el.dataset.courseFilter=value;return el;});
  const referralSteps=[makeElement('ref-1'),makeElement('ref-2'),makeElement('ref-3')];
  const main=makeElement('main');
  const document={
    activeElement:null,
    getElementById:get,
    querySelector:function(selector){if(selector==='.main-content')return main;return makeElement(selector);},
    querySelectorAll:function(selector){
      if(selector==='.course-filter')return filters;
      if(selector==='.referral-step')return referralSteps;
      return [];
    },
    addEventListener:function(){}
  };
  const store=new Map(Object.entries(options.storage||{}));
  const localStorage={
    getItem:function(key){return store.has(key)?store.get(key):null;},
    setItem:function(key,value){store.set(key,String(value));},
    removeItem:function(key){store.delete(key);}
  };
  const events={};
  const context={
    console:console,document:document,localStorage:localStorage,crypto:webcrypto,URL:URL,URLSearchParams:URLSearchParams,Intl:Intl,Date:Date,Math:Math,JSON:JSON,
    location:new URL('http://127.0.0.1:8765/'),
    navigator:{clipboard:{writeText:async function(){}},share:null},
    setTimeout:function(fn){fn();return 1;},clearTimeout:function(){},setInterval:function(){return 1;},clearInterval:function(){},
    addEventListener:function(type,handler){(events[type]||(events[type]=[])).push(handler);},
    matchMedia:function(){return {matches:false};},
    fetch:async function(){return {ok:false,json:async function(){return {};}};},
    isPremium:function(){return Boolean(options.premium);},
    entryGate:get('entryGate'),enterBtn:get('enterBtn'),settingsBtn:get('settingsBtn'),settingsModal:get('settingsModal'),
    activateScreen:function(name){context.lastScreen=name;},
    QUESTIONS:[{exam:'TYT',subject:'Test',q:'Soru',o:['A','B','C','D','E'],a:0}],
    quiz:{list:[],i:0,answers:[],locked:false},stats:{answered:0,correct:0,points:0},
    save:function(){},renderQuestion:function(){context.renderCount=(context.renderCount||0)+1;},
    pendingQuizResult:null,showSimpleQuizResult:function(){},escapeHtml:function(value){return String(value).replace(/[&<>"']/g,'');}
  };
  context.window=context;
  if(options.provider)context.YKS2027_REWARDED_AD_PROVIDER=options.provider;
  vm.createContext(context);
  vm.runInContext(coursesCode,context,{filename:'courses-v1.js'});
  vm.runInContext(engagementCode,context,{filename:'engagement-v1.js'});
  return {context:context,elements:elements,store:store,filters:filters};
}
function stateFor(values){
  return JSON.stringify(Object.assign({cycle:cycle(),questions:0,ads:0,notesSeen:[],questionGatePending:false,locked:false,lockReason:'',unlockAt:'',updatedAt:new Date().toISOString()},values||{}));
}
function button(){const el=makeElement('choice');return el;}

(async function(){
  const first=harness();
  first.context.quiz.list=Array.from({length:11},function(){return {exam:'TYT',subject:'Test',q:'Soru',o:['A','B','C','D','E'],a:0};});
  for(let i=0;i<10;i++)first.context.answer(0,button());
  let daily=JSON.parse(first.store.get('yks2027-daily-access-v1'));
  assert.equal(daily.questions,10);
  assert.equal(daily.questionGatePending,true);
  assert.equal(first.elements.get('rewardModal').classList.contains('show'),true);
  assert.equal(first.elements.get('rewardWatch').disabled,true);
  assert.match(first.elements.get('rewardStatus').textContent,/sağlayıcısı/);

  first.context.YKS2027_REWARDED_AD_PROVIDER={show:async function(){return {completed:false,granted:true};}};
  await first.elements.get('rewardWatch').listeners.click[0]();
  daily=JSON.parse(first.store.get('yks2027-daily-access-v1'));
  assert.equal(daily.ads,0);
  assert.match(first.elements.get('rewardStatus').textContent,/tamamlanmadı/);

  first.context.YKS2027_REWARDED_AD_PROVIDER={show:async function(){return {completed:true,granted:true};}};
  await first.elements.get('rewardWatch').listeners.click[0]();
  daily=JSON.parse(first.store.get('yks2027-daily-access-v1'));
  assert.equal(daily.ads,1);
  assert.equal(daily.questionGatePending,false);
  assert.equal(first.context.renderCount,10);

  const bypass=harness({storage:{'yks2027-daily-access-v1':stateFor({questions:10,questionGatePending:true})}});
  await bypass.context.startQuiz('TYT');
  assert.equal(bypass.elements.get('rewardModal').classList.contains('show'),true);
  assert.equal(bypass.context.quiz.list.length,0);

  const fifty=harness({storage:{'yks2027-daily-access-v1':stateFor({questions:49})}});
  fifty.context.quiz.list=[{exam:'TYT',subject:'Test',q:'Son',o:['A','B','C','D','E'],a:0}];
  fifty.context.answer(0,button());
  daily=JSON.parse(fifty.store.get('yks2027-daily-access-v1'));
  assert.equal(daily.questions,50);
  assert.equal(daily.locked,true);
  assert.equal(daily.lockReason,'questions');
  assert.ok(new Date(daily.unlockAt).getTime()>Date.now());
  assert.equal(fifty.elements.get('dailyLockModal').classList.contains('show'),true);

  const sixth=harness({provider:{show:async function(){return {completed:true,granted:true};}},storage:{'yks2027-daily-access-v1':stateFor({questions:9,ads:5})}});
  sixth.context.quiz.list=Array.from({length:2},function(){return {exam:'TYT',subject:'Test',q:'Soru',o:['A','B','C','D','E'],a:0};});
  sixth.context.answer(0,button());
  await sixth.elements.get('rewardWatch').listeners.click[0]();
  daily=JSON.parse(sixth.store.get('yks2027-daily-access-v1'));
  assert.equal(daily.ads,6);
  assert.equal(daily.locked,true);
  assert.equal(daily.lockReason,'ads');
  assert.ok(new Date(daily.unlockAt).getTime()>Date.now());

  const notes=harness({storage:{'yks2027-daily-access-v1':stateFor({notesSeen:['x1','x2','x3','x4','x5']})}});
  notes.elements.get('courseCatalog').listeners.click[0]({target:clickTarget({courseIndex:'0'})});
  notes.elements.get('unitList').listeners.click[0]({target:clickTarget({unitIndex:'0'})});
  assert.equal(notes.elements.get('rewardModal').classList.contains('show'),true);
  assert.match(notes.elements.get('rewardText').textContent,/Beş ücretsiz/);

  const referral=harness({storage:{
    'yks2027-daily-access-v1':stateFor({questions:50,locked:true,lockReason:'questions'}),
    'yks2027-referral-status-v1':JSON.stringify({verifiedByServer:true,verifiedFriends:1,passExpiresAt:new Date(Date.now()+86400000).toISOString()})
  }});
  referral.context.activateScreen('notes');
  assert.equal(referral.context.lastScreen,'notes');

  console.log('Engagement smoke tests OK: persistent 10-question gate, strict reward, 50-question lock, 6-ad lock, 5-note gate, verified referral pass.');
})().catch(function(error){console.error(error);process.exitCode=1;});
