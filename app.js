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
let pendingQuizResult=null;
const MEMBERSHIP_KEY='yks2027-membership-v1';
function isPremium(){const membership=window.YKS2027_MEMBERSHIP||safeStoredJson(MEMBERSHIP_KEY,{});return membership.plan==='premium'&&membership.verified===true;}
function openPremium(){const modal=document.getElementById('resultUpsellModal');if(modal)modal.classList.remove('show');activateScreen('premium');}
function renderMembership(){const premium=isPremium();const lock=document.getElementById('premiumReportsLock');const tools=document.getElementById('premiumReportTools');if(lock)lock.hidden=premium;if(tools)tools.hidden=!premium;const button=document.getElementById('premiumBtn');if(button)button.textContent=premium?'PREMIUM ✓':'PREMIUM';if(premium)renderParentPanel();}
function save(){localStorage.setItem('yks2027-simple-stats',JSON.stringify(stats));renderReports();}
function activateScreen(name){screens.forEach(function(s){s.classList.toggle('active',s.dataset.screen===name);});document.querySelectorAll('.nav-btn').forEach(function(b){b.classList.toggle('active',b.dataset.target===name);});document.querySelector('.main-content').scrollTop=0;if(name==='reports'){renderReports();renderMembership();}if(name==='program')renderProgram();}
document.querySelectorAll('[data-target]').forEach(function(btn){btn.addEventListener('click',function(){activateScreen(btn.dataset.target);});});
enterBtn.addEventListener('click',function(){entryGate.classList.add('hide');setTimeout(function(){entryGate.style.display='none';},260);});
function countdown(date,id){const el=document.getElementById(id);if(!el)return;let d=new Date(date)-new Date();if(d<=0){el.textContent='Başladı';return;}const days=Math.floor(d/86400000);d%=86400000;const h=Math.floor(d/3600000);d%=3600000;const m=Math.floor(d/60000);const s=Math.floor((d%60000)/1000);el.textContent=days+' gün '+h+' saat '+m+' dk '+s+' sn';}
function updateCountdowns(){countdown('2027-06-19T10:15:00+03:00','tytCount');countdown('2027-06-20T10:15:00+03:00','aytCount');}
updateCountdowns();setInterval(updateCountdowns,1000);
const BENCHMARK_QUESTIONS=100;
const FREE_DAILY_TARGET_LIMIT=50;
const BENCHMARK_HOURS=3;
function normalizeQuestionTarget(value,premium){const target=Math.round(Number(value));if(!target||target<1)return premium?BENCHMARK_QUESTIONS:FREE_DAILY_TARGET_LIMIT;return premium?target:Math.min(target,FREE_DAILY_TARGET_LIMIT);}
const WEEK_PROGRAM=[
 {day:'Pazartesi',topics:['Türkçe • Paragraf','TYT Matematik • Temel Kavramlar','Tarih • Temel Bilgiler']},
 {day:'Salı',topics:['TYT Matematik • Problemler','Fizik • Hareket ve Kuvvet','Türkçe • Dil Bilgisi']},
 {day:'Çarşamba',topics:['Türkçe • Paragraf','Geometri • Üçgenler','Coğrafya • Harita Bilgisi']},
 {day:'Perşembe',topics:['AYT Matematik • Fonksiyonlar','Kimya • Atom ve Periyodik Sistem','Edebiyat • Dönem ve Eserler']},
 {day:'Cuma',topics:['TYT Matematik • Karma','Biyoloji • Hücre ve Organeller','Türkçe • Paragraf']},
 {day:'Cumartesi',topics:['TYT • Karma Deneme','Matematik • Yanlış Tamamlama','Fen • Eksik Konular']},
 {day:'Pazar',topics:['AYT • Branş Denemesi','AYT Matematik • Karma','Edebiyat/Fen • Alan Tekrarı']}
];
function loadProgramPrefs(){try{return JSON.parse(localStorage.getItem('yks2027-program-prefs')||'{}');}catch(_){return {};}}
let programPrefs=loadProgramPrefs();
const storedQuestionTarget=programPrefs.questionTarget;
programPrefs.questionTarget=normalizeQuestionTarget(programPrefs.questionTarget,isPremium());
if(Number(storedQuestionTarget)!==programPrefs.questionTarget)saveProgramPrefs();
if(typeof programPrefs.wantsRest!=='boolean')programPrefs.wantsRest=null;
if(!programPrefs.restDay)programPrefs.restDay='';
let pendingTarget=null;
let pendingTargetSource='program';
function saveProgramPrefs(){localStorage.setItem('yks2027-program-prefs',JSON.stringify(programPrefs));}
function effectiveQuestionTarget(){return normalizeQuestionTarget(programPrefs.questionTarget,isPremium());}
function taskCounts(total){const first=Math.floor(total*.40);const second=Math.floor(total*.35);return [first,second,total-first-second];}
function balancedProgram(){const target=effectiveQuestionTarget();const plan=WEEK_PROGRAM.map(function(item){return {day:item.day,topics:item.topics.slice(),total:target,rest:false};});if(!isPremium()||!programPrefs.wantsRest||!programPrefs.restDay)return plan;const restIndex=plan.findIndex(function(item){return item.day===programPrefs.restDay;});if(restIndex<0)return plan;plan[restIndex].total=0;plan[restIndex].rest=true;const active=plan.filter(function(_,index){return index!==restIndex;});const extraBase=Math.floor(target/active.length);const extraRemainder=target%active.length;active.forEach(function(item,index){item.total+=extraBase+(index<extraRemainder?1:0);});return plan;}
function syncTargetInputs(){const target=effectiveQuestionTarget();programPrefs.questionTarget=target;['questionTarget','settingsQuestionTarget'].forEach(function(id){const input=document.getElementById(id);input.value=target;if(isPremium())input.removeAttribute('max');else input.max=FREE_DAILY_TARGET_LIMIT;});}
function commitQuestionTarget(target,source){target=normalizeQuestionTarget(target,isPremium());programPrefs.questionTarget=target;saveProgramPrefs();syncTargetInputs();document.getElementById('targetConfirmModal').classList.remove('show');document.getElementById('targetSummary').textContent='Günlük hedefin '+target+' soru.'+(isPremium()?' Premium üyelikte üst sınır yok.':' Ücretsiz üyelikte günlük üst sınır '+FREE_DAILY_TARGET_LIMIT+' sorudur.');document.getElementById('settingsTargetStatus').textContent='Günlük hedef '+target+' soru olarak güncellendi.';pendingTarget=null;renderProgram();if(source==='settings')document.getElementById('settingsQuestionTarget').focus();}
function requestQuestionTarget(value,source){const target=Math.round(Number(value));const feedback=source==='settings'?document.getElementById('settingsTargetStatus'):document.getElementById('targetSummary');if(!target||target<1){feedback.textContent='En az 1 soruluk geçerli bir hedef gir.';return;}if(!isPremium()&&target>FREE_DAILY_TARGET_LIMIT){commitQuestionTarget(FREE_DAILY_TARGET_LIMIT,source);feedback.textContent='Ücretsiz üyelikte günlük hedef en fazla '+FREE_DAILY_TARGET_LIMIT+' sorudur. Hedefin 50 olarak kaydedildi.';return;}const reference=isPremium()?BENCHMARK_QUESTIONS:FREE_DAILY_TARGET_LIMIT;if(target<reference){pendingTarget=target;pendingTargetSource=source;document.getElementById('targetConfirmText').textContent='Günlük '+target+' soru, '+reference+' soruluk '+(isPremium()?'başlangıç':'ücretsiz plan')+' referansının altında. Çalışma programınız seçtiğiniz şartlara göre oluşturuluyor. Emin misiniz?';document.getElementById('targetConfirmModal').classList.add('show');return;}commitQuestionTarget(target,source);}
function renderProgram(){
  const list=document.getElementById('programList');
  const status=document.getElementById('programStatus');
  const wrap=document.getElementById('restDayWrap');
  const select=document.getElementById('restDay');
  const personalizeLock=document.getElementById('programPersonalizeLock');
  const personalizeBody=document.getElementById('restPlannerBody');
  if(!list)return;
  const premium=isPremium();
  syncTargetInputs();
  const target=effectiveQuestionTarget();
  document.getElementById('targetSummary').textContent='Günlük hedefin '+target+' soru • Haftalık ölçüm '+(target*7)+' soru • '+(premium?'Üst sınır yok.':'Ücretsiz üst sınır '+FREE_DAILY_TARGET_LIMIT+' soru.');
  if(personalizeLock)personalizeLock.hidden=premium;
  if(personalizeBody){personalizeBody.classList.toggle('locked',!premium);personalizeBody.setAttribute('aria-hidden',String(!premium));}
  ['restYes','restNo','restDay','applyRestDay'].forEach(function(id){const control=document.getElementById(id);if(control)control.disabled=!premium;});
  wrap.hidden=!premium||programPrefs.wantsRest!==true;
  select.value=programPrefs.restDay||'';
  document.getElementById('restYes').classList.toggle('selected-choice',premium&&programPrefs.wantsRest===true);
  document.getElementById('restNo').classList.toggle('selected-choice',premium&&programPrefs.wantsRest===false);
  if(!premium){status.textContent='Boş gün seçimi ve programın diğer günlere dengeli dağıtılması Premium üyelikte açılır.';}
  else if(programPrefs.wantsRest&&programPrefs.restDay){status.textContent=programPrefs.restDay+' dinlenme günü. O günün '+target+' soruluk hedefi haftanın diğer günlerine dengeli dağıtıldı.';}
  else if(programPrefs.wantsRest){status.textContent='Dinlenmek istediğin günü seç ve planı dengele.';}
  else{status.textContent='Program yedi güne dengeli olarak devam ediyor.';}
  list.innerHTML=balancedProgram().map(function(item,index){const counts=taskCounts(item.total);return '<article class="schedule-day'+(item.rest?' rest-day':'')+'"><div class="schedule-head"><span>'+(index+1)+'</span><div><h3>'+item.day+'</h3><small>'+(item.rest?'Yenilenme günü':item.total+' soru hedefi • en az '+BENCHMARK_HOURS+' net saat')+'</small></div></div>'+(item.rest?'<div class="rest-message">Bugün dinlen, enerjini yenile. Haftalık soru hedefin diğer günlere dağıtıldı.</div>':'<ul>'+item.topics.map(function(topic,topicIndex){return '<li>'+topic+' • <b>'+counts[topicIndex]+' soru</b></li>';}).join('')+'</ul>')+'</article>';}).join('');
  renderTodayFocus();
}
function renderTodayFocus(){const focus=document.getElementById('todayFocus');if(!focus)return;const dayNames=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];const today=dayNames[new Date().getDay()];const item=balancedProgram().find(function(entry){return entry.day===today;});if(!item)return;focus.textContent=item.rest?'Bugün dinlenme günün — yarına enerji topla':item.topics[0]+' • '+taskCounts(item.total)[0]+' soru';}
document.getElementById('saveQuestionTarget').addEventListener('click',function(){requestQuestionTarget(document.getElementById('questionTarget').value,'program');});
document.getElementById('settingsSaveTarget').addEventListener('click',function(){requestQuestionTarget(document.getElementById('settingsQuestionTarget').value,'settings');});
document.getElementById('confirmLowTarget').addEventListener('click',function(){if(pendingTarget)commitQuestionTarget(pendingTarget,pendingTargetSource);});
document.getElementById('editLowTarget').addEventListener('click',function(){document.getElementById('targetConfirmModal').classList.remove('show');const id=pendingTargetSource==='settings'?'settingsQuestionTarget':'questionTarget';pendingTarget=null;document.getElementById(id).focus();});
document.getElementById('restYes').addEventListener('click',function(){if(!isPremium()){openPremium();return;}programPrefs.wantsRest=true;saveProgramPrefs();renderProgram();});
document.getElementById('restNo').addEventListener('click',function(){if(!isPremium()){openPremium();return;}programPrefs.wantsRest=false;programPrefs.restDay='';saveProgramPrefs();renderProgram();});
document.getElementById('applyRestDay').addEventListener('click',function(){if(!isPremium()){openPremium();return;}const day=document.getElementById('restDay').value;if(!day){document.getElementById('programStatus').textContent='Önce boş gününü seç.';return;}programPrefs.wantsRest=true;programPrefs.restDay=day;saveProgramPrefs();renderProgram();});
renderProgram();
function startQuiz(exam){exam=exam||'ALL';quiz.list=QUESTIONS.filter(function(q){return exam==='ALL'||q.exam===exam;}).sort(function(){return Math.random()-.5;});quiz.i=0;quiz.answers=[];quiz.locked=false;activateScreen('arena');renderQuestion();}
function renderQuestion(){const box=document.getElementById('quizBox');const q=quiz.list[quiz.i];if(!q){box.innerHTML='<div class="info-card"><h3>Bir sınav turu başlat</h3><p>TYT, AYT veya karışık tur seç.</p></div>';return;}box.innerHTML='<div class="quiz-card"><div>'+q.exam+' • '+q.subject+' • '+(quiz.i+1)+'/'+quiz.list.length+'</div><h3>'+q.q+'</h3><div class="quiz-options">'+q.o.map(function(x,i){return '<button data-choice="'+i+'"><b>'+('ABCDE'[i])+')</b> '+x+'</button>';}).join('')+'</div><p>Cevabın kaydedildi. Doğru/yanlış ve çözüm tur sonunda gösterilecek.</p></div>';box.querySelectorAll('[data-choice]').forEach(function(b){b.addEventListener('click',function(){answer(Number(b.dataset.choice),b);});});}
function answer(choice,btn){if(quiz.locked)return;quiz.locked=true;quiz.answers.push({q:quiz.list[quiz.i],choice:choice});btn.classList.add('selected');document.querySelectorAll('[data-choice]').forEach(function(x){x.disabled=true;});setTimeout(function(){quiz.i++;quiz.locked=false;if(quiz.i>=quiz.list.length)finishQuiz();else renderQuestion();},350);}
function finishQuiz(){const correct=quiz.answers.filter(function(x){return x.choice===x.q.a;}).length;pendingQuizResult={total:quiz.answers.length,correct:correct,wrong:quiz.answers.length-correct,rawPoints:correct*10};stats.answered+=pendingQuizResult.total;stats.correct+=correct;stats.points+=pendingQuizResult.rawPoints;save();document.getElementById('quizBox').innerHTML='<div class="info-card"><h3>Deneme tamamlandı</h3><p>Sonucun hazır. Devam seçimini ekrandaki kutudan yap.</p></div>';if(isPremium())showSimpleQuizResult();else document.getElementById('resultUpsellModal').classList.add('show');}
function showSimpleQuizResult(){document.getElementById('resultUpsellModal').classList.remove('show');if(!pendingQuizResult)return;document.getElementById('quizBox').innerHTML='<div class="info-card simple-result-card"><span class="eyebrow">DENEME SONUCU</span><h3>Ham Arena puanın: '+pendingQuizResult.rawPoints+'</h3><p>'+pendingQuizResult.total+' soru • '+pendingQuizResult.correct+' doğru • '+pendingQuizResult.wrong+' yanlış</p><button class="primary-btn" id="seeResults">CEVAPLARI GÖR</button></div>';document.getElementById('seeResults').addEventListener('click',function(){renderReview();activateScreen('reports');});}
function renderReview(){document.getElementById('reviewBox').innerHTML=quiz.answers.map(function(x,i){return '<div class="review-row"><b>'+(i+1)+'. '+x.q.subject+'</b><br><span>'+(x.choice===x.q.a?'DOĞRU':'YANLIŞ')+'</span><br><small>Senin cevabın: '+('ABCDE'[x.choice])+' • Doğru cevap: '+('ABCDE'[x.q.a])+'</small></div>';}).join('');}
function renderReports(){const acc=stats.answered?Math.round(stats.correct/stats.answered*100):0;document.getElementById('statAnswered').textContent=stats.answered;document.getElementById('statAccuracy').textContent='%'+acc;document.getElementById('statPoints').textContent=stats.points;renderParentPanel();}
const REPORT_PROFILE_KEY='yks2027-report-profile-v1';
const REPORT_COMPARE_KEY='yks2027-placement-compare-v1';
const GRADE_IDS=['grade9','grade10','grade11','grade12'];
const SCHOOL_EXAM_IDS=['schoolExam1','schoolExam2','schoolExam3','schoolExam4'];
let placementDataPromise=null;
function safeStoredJson(key,fallback){try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}catch(_){return fallback;}}
function numericValue(id){const el=document.getElementById(id);if(!el||el.value==='')return null;const value=Number(String(el.value).replace(',','.'));return Number.isFinite(value)?value:null;}
function validGrade(value){return value!==null&&value>=0&&value<=100;}
function mean(values){return values.reduce(function(total,value){return total+value;},0)/values.length;}
function formatNumber(value,digits){return Number(value).toLocaleString('tr-TR',{minimumFractionDigits:digits,maximumFractionDigits:digits});}
function escapeHtml(value){return String(value).replace(/[&<>'"]/g,function(char){return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char];});}
function collectReportProfile(){const profile={stage:document.getElementById('studentStage').value,previousPlaced:document.getElementById('previousPlaced').checked};GRADE_IDS.concat(SCHOOL_EXAM_IDS).forEach(function(id){profile[id]=document.getElementById(id).value;});return profile;}
function saveReportProfile(){localStorage.setItem(REPORT_PROFILE_KEY,JSON.stringify(collectReportProfile()));}
function updateReportFields(){const stage=document.getElementById('studentStage').value;const maxYear=stage==='graduate'?12:Number(stage);GRADE_IDS.forEach(function(id){const year=Number(id.replace('grade',''));const input=document.getElementById(id);input.disabled=year>maxYear;input.closest('.field').classList.toggle('disabled-field',year>maxYear);});document.getElementById('schoolExamWrap').hidden=stage!=='12';document.getElementById('grade12Wrap').hidden=maxYear<12;}
function showObpError(message){document.getElementById('obpResult').innerHTML='<p class="error-text">'+escapeHtml(message)+'</p>';}
function calculateObp(showErrors){if(typeof showErrors==='undefined')showErrors=true;const stage=document.getElementById('studentStage').value;const maxYear=stage==='graduate'?12:Number(stage);const yearGrades=[];let usedExamEstimate=false;let invalid=false;[9,10,11,12].forEach(function(year){if(year>maxYear)return;const value=numericValue('grade'+year);if(value!==null&&!validGrade(value))invalid=true;if(validGrade(value))yearGrades.push({year:year,value:value,estimated:false});});const schoolExams=SCHOOL_EXAM_IDS.map(numericValue).filter(function(value){return value!==null;});if(schoolExams.some(function(value){return !validGrade(value);}))invalid=true;if(invalid){if(showErrors)showObpError('Tüm karne ve okul sınavı notları 0 ile 100 arasında olmalıdır.');return null;}const hasGrade12=yearGrades.some(function(item){return item.year===12;});if(stage==='12'&&!hasGrade12&&schoolExams.length){yearGrades.push({year:12,value:mean(schoolExams),estimated:true});usedExamEstimate=true;}if(!yearGrades.length){if(showErrors)showObpError('En az bir yıl sonu başarı puanı gir. 12. sınıftaysan okul sınav notların da geçici tahmin için kullanılabilir.');return null;}const diplomaForecast=mean(yearGrades.map(function(item){return item.value;}));const obp=Math.max(50,diplomaForecast)*5;const coefficient=document.getElementById('previousPlaced').checked ? 0.06 : 0.12;const contribution=obp*coefficient;const expectedYears=stage==='graduate'?4:Math.max(1,maxYear-8);const complete=yearGrades.length>=expectedYears&&!usedExamEstimate;const result={diploma:diplomaForecast,obp:obp,coefficient:coefficient,contribution:contribution,complete:complete,usedExamEstimate:usedExamEstimate,knownYears:yearGrades.length,expectedYears:expectedYears};saveReportProfile();document.getElementById('obpResult').innerHTML='<div class="obp-metrics"><div><span>Tahmini diploma puanı</span><strong>'+formatNumber(result.diploma,2)+'</strong></div><div><span>Tahmini OBP</span><strong>'+formatNumber(result.obp,2)+'</strong></div><div><span>Yerleştirme katkısı</span><strong>+'+formatNumber(result.contribution,2)+'</strong></div></div><p><strong>'+(complete?'Kayıt tamamlandı.':'Geçici tahmin.')+'</strong> '+result.knownYears+'/'+result.expectedYears+' sınıf değeri kullanıldı'+(usedExamEstimate?'; 12. sınıf değeri okul sınavlarının basit ortalamasıdır':'')+'. Katsayı '+formatNumber(coefficient,2)+' olarak uygulandı.</p>'+(diplomaForecast<50?'<p class="warning-text">ÖSYM kuralı gereği 50 altındaki diploma notu OBP hesabında 50 kabul edildi.</p>':'');return result;}
function hydrateReportProfile(){const profile=safeStoredJson(REPORT_PROFILE_KEY,{stage:'12'});document.getElementById('studentStage').value=profile.stage||'12';document.getElementById('previousPlaced').checked=Boolean(profile.previousPlaced);GRADE_IDS.concat(SCHOOL_EXAM_IDS).forEach(function(id){if(profile[id]!==undefined)document.getElementById(id).value=profile[id];});updateReportFields();if(GRADE_IDS.concat(SCHOOL_EXAM_IDS).some(function(id){return document.getElementById(id).value!=='';}))calculateObp(false);}
function loadPlacementData(){if(!placementDataPromise){placementDataPromise=fetch('./data/placements-2025.json?v=20260824-05').then(function(response){if(!response.ok)throw new Error('Yerleştirme verisi yüklenemedi.');return response.json();});}return placementDataPromise;}
function hydratePlacementCompare(){const saved=safeStoredJson(REPORT_COMPARE_KEY,{});['mockScoreType','mockScoreMode','mockScore','programLevel','universityType'].forEach(function(id){if(saved[id]!==undefined)document.getElementById(id).value=saved[id];});}
function savePlacementCompare(){const value={};['mockScoreType','mockScoreMode','mockScore','programLevel','universityType'].forEach(function(id){value[id]=document.getElementById(id).value;});localStorage.setItem(REPORT_COMPARE_KEY,JSON.stringify(value));}
function placementCard(row,placementScore){const difference=placementScore-row[5];return '<article class="placement-card"><div class="placement-score"><span>2025 taban</span><strong>'+formatNumber(row[5],3)+'</strong><small>Fark +'+formatNumber(difference,3)+'</small></div><div><span class="eyebrow">TEBRİKLER</span><h4>'+escapeHtml(row[2])+' • '+escapeHtml(row[3])+'</h4><p>2025 yılında tercih etseydiniz bu program için puanınız yeterli olabilirdi.</p><small>'+escapeHtml(row[0])+' • '+escapeHtml(row[1])+' • '+(row[7]===4?'Lisans':'Ön lisans')+'</small></div></article>';}
async function comparePrograms(){const button=document.getElementById('comparePrograms');const summary=document.getElementById('placementSummary');const results=document.getElementById('placementResults');const entered=numericValue('mockScore');if(entered===null||entered<100||entered>560){summary.innerHTML='<p class="error-text">100 ile 560 arasında geçerli bir deneme puanı gir.</p>';results.innerHTML='';return;}const scoreMode=document.getElementById('mockScoreMode').value;let placementScore=entered;let contribution=0;if(scoreMode==='exam'){const obpResult=calculateObp(false);if(!obpResult){summary.innerHTML='<p class="error-text">OBP hariç puanı karşılaştırmak için önce karne notlarından OBP tahminini oluştur.</p>';results.innerHTML='';return;}contribution=obpResult.contribution;placementScore+=contribution;}button.disabled=true;button.textContent='RESMÎ VERİ YÜKLENİYOR…';summary.innerHTML='<p>2025 yerleştirme tablosu hazırlanıyor.</p>';try{const data=await loadPlacementData();const scoreType=document.getElementById('mockScoreType').value;const level=document.getElementById('programLevel').value;const universityType=document.getElementById('universityType').value;const matches=data.programs.filter(function(row){return row[4]===scoreType&&row[5]<=placementScore&&(level==='all'||row[7]===Number(level))&&(universityType==='all'||row[1]===universityType);}).sort(function(a,b){return b[5]-a[5];});savePlacementCompare();summary.innerHTML='<div class="placement-total"><span>Tahmini yerleştirme puanı</span><strong>'+formatNumber(placementScore,3)+'</strong></div><p>'+formatNumber(entered,3)+(scoreMode==='exam'?' deneme puanı + '+formatNumber(contribution,2)+' tahmini OBP katkısı':' OBP dahil yerleştirme puanı')+'. 2025 genel kontenjan tablosunda filtrelerine uyan <strong>'+matches.length+'</strong> program bulundu; puanına en yakın sonuçlar gösteriliyor.</p>';results.innerHTML=matches.length?matches.slice(0,8).map(function(row){return placementCard(row,placementScore);}).join(''):'<div class="result-panel"><p>Bu puan türü ve filtrelerle 2025 taban puanı eşleşmesi bulunamadı. Filtreyi genişletebilir veya hedef puanını yükseltebilirsin.</p></div>';}catch(_){placementDataPromise=null;summary.innerHTML='<p class="error-text">2025 ÖSYM yerleştirme verisi yüklenemedi. İnternet bağlantını kontrol edip yeniden dene.</p>';results.innerHTML='';}finally{button.disabled=false;button.textContent='2025 BÖLÜMLERİNİ GÖSTER';}}
document.getElementById('studentStage').addEventListener('change',function(){updateReportFields();saveReportProfile();});
GRADE_IDS.concat(SCHOOL_EXAM_IDS).forEach(function(id){document.getElementById(id).addEventListener('change',saveReportProfile);});
document.getElementById('previousPlaced').addEventListener('change',saveReportProfile);
document.getElementById('calculateObp').addEventListener('click',function(){if(!isPremium()){openPremium();return;}calculateObp(true);});
document.getElementById('comparePrograms').addEventListener('click',function(){if(!isPremium()){openPremium();return;}comparePrograms();});
hydrateReportProfile();
hydratePlacementCompare();
function renderParentPanel(){const goal=document.getElementById('parentWeeklyGoal');if(!goal)return;const accuracy=stats.answered?Math.round(stats.correct/stats.answered*100):0;goal.textContent=effectiveQuestionTarget()*7;document.getElementById('parentAnswered').textContent=stats.answered;document.getElementById('parentAccuracy').textContent='%'+accuracy;const saved=safeStoredJson('yks2027-parent-panel-v1',{});if(document.activeElement!==document.getElementById('parentNote'))document.getElementById('parentNote').value=saved.note||'';}
document.getElementById('premiumBtn').addEventListener('click',openPremium);
document.querySelectorAll('.open-premium').forEach(function(button){button.addEventListener('click',openPremium);});
document.getElementById('parentPanelEntry').addEventListener('click',function(){if(!isPremium()){openPremium();return;}activateScreen('reports');setTimeout(function(){document.getElementById('parentPanelCard').scrollIntoView({behavior:'smooth',block:'start'});},50);});
document.getElementById('resultPremiumYes').addEventListener('click',openPremium);
document.getElementById('resultPremiumNo').addEventListener('click',showSimpleQuizResult);
document.getElementById('premiumStart').addEventListener('click',function(){document.getElementById('premiumCheckoutStatus').innerHTML='<strong>Üyelik geçişi hazır.</strong> Güvenli ödeme sağlayıcısı ve kullanıcı hesabı bağlantısı tanımlandığında ödeme adımı burada açılacaktır.';});
document.getElementById('saveParentNote').addEventListener('click',function(){if(!isPremium()){openPremium();return;}localStorage.setItem('yks2027-parent-panel-v1',JSON.stringify({note:document.getElementById('parentNote').value,updatedAt:new Date().toISOString()}));document.getElementById('parentPanelStatus').textContent='Veli notu bu cihazda kaydedildi.';});
renderMembership();
document.querySelectorAll('[data-quiz]').forEach(function(b){b.addEventListener('click',function(){startQuiz(b.dataset.quiz);});});
function detectPlatform(){const ua=navigator.userAgent||'';const m=ua.match(/Android\s([0-9]+)/i);const deviceInfo=document.getElementById('deviceInfo');const supportInfo=document.getElementById('supportInfo');if(m){const v=Number(m[1]);deviceInfo.textContent='Android '+v;supportInfo.textContent=v>=10?'Desteklenen sistem':'Android 10 altı: bazı özellikler düzgün çalışmayabilir';}else if(/iPhone|iPad|iPod/i.test(ua)){deviceInfo.textContent='iOS / iPadOS';supportInfo.textContent='Web üzerinden açılabilir; Android sürümü ana optimizasyon hedefidir.';}else{deviceInfo.textContent='Web tarayıcısı';supportInfo.textContent='Güncel Chrome önerilir.';}}
settingsBtn.addEventListener('click',function(){detectPlatform();syncTargetInputs();document.getElementById('settingsTargetStatus').textContent='Mevcut günlük hedef: '+effectiveQuestionTarget()+' soru.'+(isPremium()?'':' Ücretsiz üyelik üst sınırı 50 sorudur.');settingsModal.classList.add('show');});settingsClose.addEventListener('click',function(){settingsModal.classList.remove('show');});settingsModal.addEventListener('click',function(e){if(e.target===settingsModal)settingsModal.classList.remove('show');});
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferredPrompt=e;installBtn.hidden=false;});installBtn.addEventListener('click',async function(){if(!deferredPrompt)return;deferredPrompt.prompt();try{await deferredPrompt.userChoice;}catch(_){}deferredPrompt=null;installBtn.hidden=true;});
if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('./sw.js?v=20260824-05').catch(function(){});});}
renderReports();
