let deferredPrompt=null;
const screens=Array.from(document.querySelectorAll('.screen'));
const entryGate=document.getElementById('entryGate');
const enterBtn=document.getElementById('enterBtn');
const installBtn=document.getElementById('installBtn');
const settingsBtn=document.getElementById('settingsBtn');
const settingsModal=document.getElementById('settingsModal');
const settingsClose=document.getElementById('settingsClose');

const QUESTIONS=[
 {exam:'TYT',subject:'Türkçe',q:'Bu cümlede “olduğu gibi” sözü hangi anlamda kullanılmıştır?',o:['Nesnel biçimde','Ayrıntılı biçimde','Eleştirel biçimde','Sanatsal biçimde','Özetleyerek'],a:0},
 {exam:'TYT',subject:'Matematik',q:'3x + 5 = 26 olduğuna göre x kaçtır?',o:['5','6','7','8','9'],a:2},
 {exam:'TYT',subject:'Fizik',q:'Sabit süratle hareket eden bir aracın eşit zamanlarda aldığı yollar için hangisi doğrudur?',o:['Azalır','Artar','Eşittir','Sıfırdır','Belirsizdir'],a:2},
 {exam:'TYT',subject:'Tarih',q:'Türkiye Cumhuriyeti hangi yıl ilan edilmiştir?',o:['1919','1920','1921','1923','1924'],a:3},
 {exam:'AYT',subject:'Matematik',q:'f(x)=2x+1 ise f(3) kaçtır?',o:['5','6','7','8','9'],a:2},
 {exam:'AYT',subject:'Edebiyat',q:'Divan edebiyatında beyitlerle yazılan uzun olay şiirlerine ne ad verilir?',o:['Gazel','Kaside','Mesnevi','Rubai','Şarkı'],a:2},
 {exam:'AYT',subject:'Biyoloji',q:'DNA’nın yapı birimi aşağıdakilerden hangisidir?',o:['Amino asit','Nükleotit','Yağ asidi','Glikoz','Enzim'],a:1},
 {exam:'AYT',subject:'Kimya',q:'pH değeri 7 olan sulu çözelti için hangisi doğrudur?',o:['Asidik','Bazik','Nötr','Doymuş','Tampon'],a:2},
 {exam:'AYT',subject:'Fizik',q:'Bir cismin momentumunun birimi aşağıdakilerden hangisidir?',o:['N','J','kg·m/s','W','Pa'],a:2},
 {exam:'TYT',subject:'Coğrafya',q:'Türkiye hangi yarım kürelerde yer alır?',o:['Kuzey-Batı','Güney-Doğu','Kuzey-Doğu','Güney-Batı','Ekvator üzerinde'],a:2}
];

let quiz={list:[],i:0,answers:[],locked:false};
let stats=JSON.parse(localStorage.getItem('yks2027-simple-stats')||'{"answered":0,"correct":0,"points":0}');

function save(){localStorage.setItem('yks2027-simple-stats',JSON.stringify(stats));renderReports();}
function activateScreen(name){
  screens.forEach(function(s){s.classList.toggle('active',s.dataset.screen===name);});
  document.querySelectorAll('.nav-btn').forEach(function(b){b.classList.toggle('active',b.dataset.target===name);});
  document.querySelector('.main-content').scrollTop=0;
  if(name==='reports')renderReports();
}

document.querySelectorAll('[data-target]').forEach(function(btn){btn.addEventListener('click',function(){activateScreen(btn.dataset.target);});});
enterBtn.addEventListener('click',function(){entryGate.classList.add('hide');setTimeout(function(){entryGate.style.display='none';},260);});

function countdown(date,id){
  const el=document.getElementById(id); if(!el)return;
  let d=new Date(date)-new Date();
  if(d<=0){el.textContent='Başladı';return;}
  const days=Math.floor(d/86400000); d%=86400000;
  const h=Math.floor(d/3600000); d%=3600000;
  const m=Math.floor(d/60000); const s=Math.floor((d%60000)/1000);
  el.textContent=days+' gün '+h+' saat '+m+' dk '+s+' sn';
}
function updateCountdowns(){countdown('2027-06-19T10:15:00+03:00','tytCount');countdown('2027-06-20T10:15:00+03:00','aytCount');}
updateCountdowns();setInterval(updateCountdowns,1000);

function startQuiz(exam){
  exam=exam||'ALL';
  quiz.list=QUESTIONS.filter(function(q){return exam==='ALL'||q.exam===exam;}).sort(function(){return Math.random()-.5;});
  quiz.i=0;quiz.answers=[];quiz.locked=false;activateScreen('arena');renderQuestion();
}
function renderQuestion(){
  const box=document.getElementById('quizBox'); const q=quiz.list[quiz.i];
  if(!q){box.innerHTML='<div class="info-card"><h3>Bir tur başlat</h3><p>TYT, AYT veya karışık tur seç.</p></div>';return;}
  box.innerHTML='<div class="quiz-card"><div>'+q.exam+' • '+q.subject+' • '+(quiz.i+1)+'/'+quiz.list.length+'</div><h3>'+q.q+'</h3><div class="quiz-options">'+q.o.map(function(x,i){return '<button data-choice="'+i+'"><b>'+('ABCDE'[i])+')</b> '+x+'</button>';}).join('')+'</div><p>Doğru/yanlış bilgisi tur sonunda gösterilecek.</p></div>';
  box.querySelectorAll('[data-choice]').forEach(function(b){b.addEventListener('click',function(){answer(Number(b.dataset.choice),b);});});
}
function answer(choice,btn){
  if(quiz.locked)return; quiz.locked=true;
  quiz.answers.push({q:quiz.list[quiz.i],choice:choice}); btn.classList.add('selected');
  document.querySelectorAll('[data-choice]').forEach(function(x){x.disabled=true;});
  setTimeout(function(){quiz.i++;quiz.locked=false;if(quiz.i>=quiz.list.length)finishQuiz();else renderQuestion();},350);
}
function finishQuiz(){
  const correct=quiz.answers.filter(function(x){return x.choice===x.q.a;}).length;
  stats.answered+=quiz.answers.length;stats.correct+=correct;stats.points+=correct*10;save();
  document.getElementById('quizBox').innerHTML='<div class="info-card"><h3>Tur tamamlandı</h3><p>'+quiz.answers.length+' soru • '+correct+' doğru • '+(quiz.answers.length-correct)+' yanlış</p><button class="primary-btn" id="seeResults">SONUÇLARI GÖR</button></div>';
  document.getElementById('seeResults').addEventListener('click',function(){renderReview();activateScreen('reports');});
}
function renderReview(){
  document.getElementById('reviewBox').innerHTML=quiz.answers.map(function(x,i){return '<div class="review-row"><b>'+(i+1)+'. '+x.q.subject+'</b><br><span>'+(x.choice===x.q.a?'DOĞRU':'YANLIŞ')+'</span><br><small>Senin cevabın: '+('ABCDE'[x.choice])+' • Doğru cevap: '+('ABCDE'[x.q.a])+'</small></div>';}).join('');
}
function renderReports(){
  const acc=stats.answered?Math.round(stats.correct/stats.answered*100):0;
  document.getElementById('statAnswered').textContent=stats.answered;
  document.getElementById('statAccuracy').textContent='%'+acc;
  document.getElementById('statPoints').textContent=stats.points;
}
document.querySelectorAll('[data-quiz]').forEach(function(b){b.addEventListener('click',function(){startQuiz(b.dataset.quiz);});});

function detectPlatform(){
  const ua=navigator.userAgent||'';
  const m=ua.match(/Android\s([0-9]+)/i);
  const deviceInfo=document.getElementById('deviceInfo');
  const supportInfo=document.getElementById('supportInfo');
  if(m){
    const v=Number(m[1]);deviceInfo.textContent='Android '+v;
    supportInfo.textContent=v>=10?'Desteklenen sistem':'Android 10 altı: bazı özellikler düzgün çalışmayabilir';
  }else if(/iPhone|iPad|iPod/i.test(ua)){
    deviceInfo.textContent='iOS / iPadOS';supportInfo.textContent='Web üzerinden açılabilir; Android sürümü ana optimizasyon hedefidir.';
  }else{deviceInfo.textContent='Web tarayıcısı';supportInfo.textContent='Güncel Chrome önerilir.';}
}
settingsBtn.addEventListener('click',function(){detectPlatform();settingsModal.classList.add('show');});
settingsClose.addEventListener('click',function(){settingsModal.classList.remove('show');});
settingsModal.addEventListener('click',function(e){if(e.target===settingsModal)settingsModal.classList.remove('show');});

window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferredPrompt=e;installBtn.hidden=false;});
installBtn.addEventListener('click',async function(){if(!deferredPrompt)return;deferredPrompt.prompt();try{await deferredPrompt.userChoice;}catch(_){ }deferredPrompt=null;installBtn.hidden=true;});

if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('./sw.js?v=simple1').catch(function(){});});}
renderReports();
