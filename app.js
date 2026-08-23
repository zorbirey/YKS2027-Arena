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
function activateScreen(name){screens.forEach(function(s){s.classList.toggle('active',s.dataset.screen===name);});document.querySelectorAll('.nav-btn').forEach(function(b){b.classList.toggle('active',b.dataset.target===name);});document.querySelector('.main-content').scrollTop=0;if(name==='reports')renderReports();if(name==='program')renderProgram();}
document.querySelectorAll('[data-target]').forEach(function(btn){btn.addEventListener('click',function(){activateScreen(btn.dataset.target);});});
enterBtn.addEventListener('click',function(){entryGate.classList.add('hide');setTimeout(function(){entryGate.style.display='none';},260);});
function countdown(date,id){const el=document.getElementById(id);if(!el)return;let d=new Date(date)-new Date();if(d<=0){el.textContent='Başladı';return;}const days=Math.floor(d/86400000);d%=86400000;const h=Math.floor(d/3600000);d%=3600000;const m=Math.floor(d/60000);const s=Math.floor((d%60000)/1000);el.textContent=days+' gün '+h+' saat '+m+' dk '+s+' sn';}
function updateCountdowns(){countdown('2027-06-19T10:15:00+03:00','tytCount');countdown('2027-06-20T10:15:00+03:00','aytCount');}
updateCountdowns();setInterval(updateCountdowns,1000);
const WEEK_PROGRAM=[
 {day:'Pazartesi',tasks:['Türkçe • 30 paragraf sorusu','Matematik • 25 temel kavram sorusu','Tarih • 20 dk konu tekrarı']},
 {day:'Salı',tasks:['Matematik • Problem çalışması','Fizik • Hareket ve kuvvet','Akıllı Notlar • 15 dk tekrar']},
 {day:'Çarşamba',tasks:['Türkçe • Dil bilgisi turu','Geometri • Üçgenler','Coğrafya • Harita bilgisi']},
 {day:'Perşembe',tasks:['AYT Matematik • Fonksiyonlar','Kimya • Atom ve periyodik sistem','Edebiyat • Dönem-eser kartları']},
 {day:'Cuma',tasks:['TYT Matematik • 30 soru','Biyoloji • Hücre ve organeller','Sınav Arenası • TYT mini tur']},
 {day:'Cumartesi',tasks:['TYT denemesi • 60 soru','Yanlış analizi • 30 dk','Eksik konu • Hızlı tekrar']},
 {day:'Pazar',tasks:['AYT branş denemesi','Haftalık yanlış defteri','Yeni hafta hedeflerini belirle']}
];
let programPrefs=JSON.parse(localStorage.getItem('yks2027-program-prefs')||'{"wantsRest":null,"restDay":""}');
function saveProgramPrefs(){localStorage.setItem('yks2027-program-prefs',JSON.stringify(programPrefs));}
function balancedProgram(){const plan=WEEK_PROGRAM.map(function(item){return {day:item.day,tasks:item.tasks.slice(),rest:false};});if(!programPrefs.wantsRest||!programPrefs.restDay)return plan;const restIndex=plan.findIndex(function(item){return item.day===programPrefs.restDay;});if(restIndex<0)return plan;const moved=plan[restIndex].tasks.slice();plan[restIndex].tasks=[];plan[restIndex].rest=true;const targets=plan.filter(function(_,index){return index!==restIndex;});moved.forEach(function(task,index){targets[index%targets.length].tasks.push(task+' • '+programPrefs.restDay+' gününden');});return plan;}
function renderProgram(){const list=document.getElementById('programList');const status=document.getElementById('programStatus');const wrap=document.getElementById('restDayWrap');const select=document.getElementById('restDay');if(!list)return;wrap.hidden=programPrefs.wantsRest!==true;select.value=programPrefs.restDay||'';document.getElementById('restYes').classList.toggle('selected-choice',programPrefs.wantsRest===true);document.getElementById('restNo').classList.toggle('selected-choice',programPrefs.wantsRest===false);if(programPrefs.wantsRest&&programPrefs.restDay){status.textContent=programPrefs.restDay+' dinlenme günü. O günün 3 görevi haftanın diğer günlerine dengeli dağıtıldı.';}else if(programPrefs.wantsRest){status.textContent='Dinlenmek istediğin günü seç ve planı dengele.';}else{status.textContent='Program yedi güne dengeli olarak devam ediyor.';}list.innerHTML=balancedProgram().map(function(item,index){return '<article class="schedule-day'+(item.rest?' rest-day':'')+'"><div class="schedule-head"><span>'+(index+1)+'</span><div><h3>'+item.day+'</h3><small>'+(item.rest?'Yenilenme günü':item.tasks.length+' odak görevi')+'</small></div></div>'+(item.rest?'<div class="rest-message">Bugün dinlen, enerjini yenile. Programın güvende.</div>':'<ul>'+item.tasks.map(function(task){return '<li>'+task+'</li>';}).join('')+'</ul>')+'</article>';}).join('');renderTodayFocus();}
function renderTodayFocus(){const focus=document.getElementById('todayFocus');if(!focus)return;const dayNames=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];const today=dayNames[new Date().getDay()];const item=balancedProgram().find(function(entry){return entry.day===today;});if(!item)return;focus.textContent=item.rest?'Bugün dinlenme günün — yarına enerji topla':item.tasks[0];}
document.getElementById('restYes').addEventListener('click',function(){programPrefs.wantsRest=true;saveProgramPrefs();renderProgram();});
document.getElementById('restNo').addEventListener('click',function(){programPrefs.wantsRest=false;programPrefs.restDay='';saveProgramPrefs();renderProgram();});
document.getElementById('applyRestDay').addEventListener('click',function(){const day=document.getElementById('restDay').value;if(!day){document.getElementById('programStatus').textContent='Önce boş gününü seç.';return;}programPrefs.wantsRest=true;programPrefs.restDay=day;saveProgramPrefs();renderProgram();});
renderProgram();
function startQuiz(exam){exam=exam||'ALL';quiz.list=QUESTIONS.filter(function(q){return exam==='ALL'||q.exam===exam;}).sort(function(){return Math.random()-.5;});quiz.i=0;quiz.answers=[];quiz.locked=false;activateScreen('arena');renderQuestion();}
function renderQuestion(){const box=document.getElementById('quizBox');const q=quiz.list[quiz.i];if(!q){box.innerHTML='<div class="info-card"><h3>Bir sınav turu başlat</h3><p>TYT, AYT veya karışık tur seç.</p></div>';return;}box.innerHTML='<div class="quiz-card"><div>'+q.exam+' • '+q.subject+' • '+(quiz.i+1)+'/'+quiz.list.length+'</div><h3>'+q.q+'</h3><div class="quiz-options">'+q.o.map(function(x,i){return '<button data-choice="'+i+'"><b>'+('ABCDE'[i])+')</b> '+x+'</button>';}).join('')+'</div><p>Cevabın kaydedildi. Doğru/yanlış ve çözüm tur sonunda gösterilecek.</p></div>';box.querySelectorAll('[data-choice]').forEach(function(b){b.addEventListener('click',function(){answer(Number(b.dataset.choice),b);});});}
function answer(choice,btn){if(quiz.locked)return;quiz.locked=true;quiz.answers.push({q:quiz.list[quiz.i],choice:choice});btn.classList.add('selected');document.querySelectorAll('[data-choice]').forEach(function(x){x.disabled=true;});setTimeout(function(){quiz.i++;quiz.locked=false;if(quiz.i>=quiz.list.length)finishQuiz();else renderQuestion();},350);}
function finishQuiz(){const correct=quiz.answers.filter(function(x){return x.choice===x.q.a;}).length;stats.answered+=quiz.answers.length;stats.correct+=correct;stats.points+=correct*10;save();document.getElementById('quizBox').innerHTML='<div class="info-card"><h3>Tur tamamlandı</h3><p>'+quiz.answers.length+' soru • '+correct+' doğru • '+(quiz.answers.length-correct)+' yanlış</p><button class="primary-btn" id="seeResults">SONUÇLARI GÖR</button></div>';document.getElementById('seeResults').addEventListener('click',function(){renderReview();activateScreen('reports');});}
function renderReview(){document.getElementById('reviewBox').innerHTML=quiz.answers.map(function(x,i){return '<div class="review-row"><b>'+(i+1)+'. '+x.q.subject+'</b><br><span>'+(x.choice===x.q.a?'DOĞRU':'YANLIŞ')+'</span><br><small>Senin cevabın: '+('ABCDE'[x.choice])+' • Doğru cevap: '+('ABCDE'[x.q.a])+'</small></div>';}).join('');}
function renderReports(){const acc=stats.answered?Math.round(stats.correct/stats.answered*100):0;document.getElementById('statAnswered').textContent=stats.answered;document.getElementById('statAccuracy').textContent='%'+acc;document.getElementById('statPoints').textContent=stats.points;}
document.querySelectorAll('[data-quiz]').forEach(function(b){b.addEventListener('click',function(){startQuiz(b.dataset.quiz);});});
function detectPlatform(){const ua=navigator.userAgent||'';const m=ua.match(/Android\s([0-9]+)/i);const deviceInfo=document.getElementById('deviceInfo');const supportInfo=document.getElementById('supportInfo');if(m){const v=Number(m[1]);deviceInfo.textContent='Android '+v;supportInfo.textContent=v>=10?'Desteklenen sistem':'Android 10 altı: bazı özellikler düzgün çalışmayabilir';}else if(/iPhone|iPad|iPod/i.test(ua)){deviceInfo.textContent='iOS / iPadOS';supportInfo.textContent='Web üzerinden açılabilir; Android sürümü ana optimizasyon hedefidir.';}else{deviceInfo.textContent='Web tarayıcısı';supportInfo.textContent='Güncel Chrome önerilir.';}}
settingsBtn.addEventListener('click',function(){detectPlatform();settingsModal.classList.add('show');});settingsClose.addEventListener('click',function(){settingsModal.classList.remove('show');});settingsModal.addEventListener('click',function(e){if(e.target===settingsModal)settingsModal.classList.remove('show');});
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferredPrompt=e;installBtn.hidden=false;});installBtn.addEventListener('click',async function(){if(!deferredPrompt)return;deferredPrompt.prompt();try{await deferredPrompt.userChoice;}catch(_){}deferredPrompt=null;installBtn.hidden=true;});
if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('./sw.js?v=20260823-02').catch(function(){});});}
renderReports();
