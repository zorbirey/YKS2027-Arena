const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const code=fs.readFileSync('review-prompt-v1.js','utf8');
function element(id){
  const classes=new Set();
  return {id,focused:false,listeners:{},classList:{add:(name)=>classes.add(name),remove:(name)=>classes.delete(name),contains:(name)=>classes.has(name)},addEventListener(type,handler){this.listeners[type]=handler;},focus(){this.focused=true;}};
}
function harness(url){
  const elements=new Map();
  const get=(id)=>{if(!elements.has(id))elements.set(id,element(id));return elements.get(id);};
  const store=new Map();
  store.set('yks2027-review-prompt-v1',JSON.stringify({activeMs:15*60*1000,actionCount:3,nextEligibleAt:0}));
  const document={hidden:false,getElementById:get,addEventListener(){}};
  const opened=[];
  const context={window:null,document,localStorage:{getItem:(key)=>store.get(key)||null,setItem:(key,value)=>store.set(key,String(value))},URL,Date,JSON,Math,performance:{now:()=>0},setInterval(){return 1;},YKS2027_STORE_CONFIG:{googlePlayReviewUrl:url},open:(...args)=>opened.push(args)};
  context.window=context;
  vm.createContext(context);
  vm.runInContext(code,context,{filename:'review-prompt-v1.js'});
  return {context,elements,store,opened};
}

const valid=harness('https://play.google.com/store/apps/details?id=com.example.yks2027');
valid.context.YKS2027_REVIEW_PROMPT.startSession();
assert.equal(valid.elements.get('reviewPromptModal').classList.contains('show'),true);
assert.equal(valid.context.YKS2027_REVIEW_PROMPT.maybeShow(),false,'Açık pencere ikinci kez gösterilmemeli.');
assert.equal(valid.elements.get('reviewPromptModal').classList.contains('show'),true);
assert.equal(valid.elements.get('reviewOpenPlay').focused,true);
assert.equal(valid.context.YKS2027_REVIEW_PROMPT.openPlayReview(),true);
assert.equal(valid.opened.length,1);
assert.match(valid.opened[0][0],/^https:\/\/play\.google\.com\/store\/apps\/details\?id=/);
const saved=JSON.parse(valid.store.get('yks2027-review-prompt-v1'));
assert.ok(saved.reviewOpenedAt>0);
assert.ok(saved.nextEligibleAt-saved.reviewOpenedAt>=365*24*60*60*1000);

const missing=harness('');
missing.context.YKS2027_REVIEW_PROMPT.startSession();
assert.equal(missing.context.YKS2027_REVIEW_PROMPT.maybeShow(),false,'Mağaza ürünü yokken kullanıcıya çalışmayan istek gösterilmemeli.');
const invalid=harness('https://example.com/fake');
assert.equal(invalid.context.YKS2027_REVIEW_PROMPT.configuredReviewUrl(),'');

assert.match(code,/ACTIVE_TIME_REQUIRED_MS=15\*60\*1000/);
assert.match(code,/ASK_LATER_DELAY_MS=60\*24\*60\*60\*1000/);
assert.doesNotMatch(code,/5 yıldız|8 saat|reklamsız/i);
const html=fs.readFileSync('index.html','utf8');
assert.match(html,/YKS2027 Arena deneyiminizi Google Play’de değerlendirebilirsiniz\./);
assert.match(html,/dürüst görüş/);
assert.doesNotMatch(html,/5 yıldız[^<]{0,80}reklamsız/i);

assert.match(code,/const BUILD_ID='20260824-08'/);
assert.match(code,/if\(!sessionEntered\|\|document\.hidden\)return/);
assert.match(code,/anotherModalOpen/);
const sw=fs.readFileSync('sw.js','utf8');
for(const asset of ['review-prompt-v1.css','store-config-v1.js','review-prompt-v1.js'])assert.match(sw,new RegExp(asset.replaceAll('.','\\.')));
assert.ok(html.indexOf('store-config-v1.js')<html.indexOf('review-prompt-v1.js'));

console.log('Review prompt smoke tests OK: neutral prompt, 15 active minutes, 3 actions, 60-day cooldown, no incentives.');
