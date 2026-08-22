let deferredPrompt=null;
const screens=[...document.querySelectorAll('.screen')];
const entryGate=document.getElementById('entryGate');
const enterBtn=document.getElementById('enterBtn');
const installBtn=document.getElementById('installBtn');
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
let stats=JSON.parse(localStorage.getItem('yks2027-final-stats')||'{"answered":0,"correct":0,"points":0}');
function save(){localStorage.setItem('yks2027-final-stats',JSON.stringify(stats));renderReports();}
function activateScreen(name){screens.forEach(s=>s.classList.toggle('active',s.dataset.screen===name));document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.target===name));document.querySelector('.main-content').scrollTop=0;if(name==='reports')renderReports();}
document.querySelectorAll('[data-target]').forEach(btn=>btn.addEventListener('click',()=>activateScreen(btn.dataset.target)));
enterBtn.addEventListener('click',()=>{entryGate.classList.add('hide');setTimeout(()=>entryGate.style.display='none',300);});
function countdown(date,id){const el=document.getElementById(id);if(!el)return;let d=new Date(date)-new Date();if(d<=0){el.textContent='Başladı';return;}const days=Math.floor(d/86400000);d%=86400000;const h=Math.floor(d/3600000);d%=3600000;const m=Math.floor(d/60000);const s=Math.floor((d%60000)/1000);el.textContent=`${days} gün ${h} saat ${m} dk ${s} sn`;}
function updateCountdowns(){countdown('2027-06-19T10:15:00+03:00','tytCount');countdown('2027-06-20T10:15:00+03:00','aytCount');}
updateCountdowns();setInterval(updateCountdowns,1000);
function startQuiz(exam='ALL'){quiz.list=QUESTIONS.filter(q=>exam==='ALL'||q.exam===exam).sort(()=>Math.random()-.5);quiz.i=0;quiz.answers=[];quiz.locked=false;activateScreen('arena');renderQuestion();}
function renderQuestion(){const box=document.getElementById('quizBox');if(!box)return;const q=quiz.list[quiz.i];if(!q){box.innerHTML='<div class="info-card"><h3>Bir tur başlat</h3><p>TYT, AYT veya karışık tur seç.</p></div>';return;}box.innerHTML=`<div class="quiz-card"><div class="quiz-meta">${q.exam} • ${q.subject} • ${quiz.i+1}/${quiz.list.length}</div><h3>${q.q}</h3><div class="quiz-options">${q.o.map((x,i)=>`<button data-choice="${i}"><b>${'ABCDE'[i]}</b>${x}</button>`).join('')}</div><div class="neutral-note">Cevabını seç. Doğru/yanlış bilgisi tur sonunda gösterilecek.</div></div>`;box.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>answer(+b.dataset.choice,b)));}
function answer(choice,btn){if(quiz.locked)return;quiz.locked=true;quiz.answers.push({q:quiz.list[quiz.i],choice});btn.classList.add('selected');document.querySelectorAll('[data-choice]').forEach(x=>x.disabled=true);setTimeout(()=>{quiz.i++;quiz.locked=false;if(quiz.i>=quiz.list.length)finishQuiz();else renderQuestion();},400);}
function finishQuiz(){const correct=quiz.answers.filter(x=>x.choice===x.q.a).length;stats.answered+=quiz.answers.length;stats.correct+=correct;stats.points+=correct*10;save();const box=document.getElementById('quizBox');box.innerHTML=`<div class="info-card"><h3>Tur tamamlandı</h3><p>${quiz.answers.length} soru • ${correct} doğru • ${quiz.answers.length-correct} yanlış</p><button class="primary-btn" id="seeResults">SONUÇLARI GÖR</button></div>`;document.getElementById('seeResults').onclick=()=>{renderReview();activateScreen('reports');};}
function renderReview(){const box=document.getElementById('reviewBox');if(!box)return;box.innerHTML=quiz.answers.map((x,i)=>`<div class="review-row"><b>${i+1}. ${x.q.subject}</b><span class="${x.choice===x.q.a?'ok':'bad'}">${x.choice===x.q.a?'DOĞRU':'YANLIŞ'}</span><small>Senin cevabın: ${'ABCDE'[x.choice]} • Doğru cevap: ${'ABCDE'[x.q.a]}</small></div>`).join('');}
function renderReports(){const acc=stats.answered?Math.round(stats.correct/stats.answered*100):0;document.getElementById('statAnswered').textContent=stats.answered;document.getElementById('statAccuracy').textContent=`%${acc}`;document.getElementById('statPoints').textContent=stats.points;}
document.querySelectorAll('[data-quiz]').forEach(b=>b.addEventListener('click',()=>startQuiz(b.dataset.quiz)));
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;if(installBtn)installBtn.hidden=false;});
installBtn?.addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;installBtn.hidden=true;});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js?v=live3'));
renderReports();