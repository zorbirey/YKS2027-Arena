(function(){
  'use strict';

  const BUILD_ID='20260824-01';
  const DAILY_KEY='yks2027-daily-access-v1';
  const PROFILE_KEY='yks2027-student-profile-v1';
  const REFERRAL_STATUS_KEY='yks2027-referral-status-v1';
  const INCOMING_REF_KEY='yks2027-incoming-referral-v1';
  const QUESTION_LIMIT=50;
  const QUESTION_GATE=10;
  const REWARDED_AD_LIMIT=6;
  const FREE_NOTE_LIMIT=5;
  const HOUR=3600000;
  let questionBankPromise=null;
  let pendingReward=null;
  let readerState={courseIndex:-1,unitIndex:-1,page:0};
  let activeCourseFilter='ALL';

  function parseStored(key,fallback){
    try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}
    catch(_){return fallback;}
  }
  function istanbulCycle(now){
    return new Date((now||Date.now())-5*HOUR).toISOString().slice(0,10);
  }
  function nextIstanbulReset(now){
    const time=now||Date.now();
    const local=new Date(time+3*HOUR);
    return Date.UTC(local.getUTCFullYear(),local.getUTCMonth(),local.getUTCDate()+1,5,0,0,0);
  }
  function freshDaily(){
    return {cycle:istanbulCycle(),questions:0,ads:0,notesSeen:[],questionGatePending:false,locked:false,lockReason:'',unlockAt:'',updatedAt:new Date().toISOString()};
  }
  function dailyState(){
    let state=parseStored(DAILY_KEY,freshDaily());
    const now=Date.now();
    const currentCycle=istanbulCycle(now);
    const unlockTime=state.unlockAt?new Date(state.unlockAt).getTime():0;
    const lockedUntilFuture=state.locked===true&&unlockTime>now;
    if((state.locked===true&&unlockTime>0&&unlockTime<=now)||(state.cycle!==currentCycle&&!lockedUntilFuture)){
      state=freshDaily();
      localStorage.setItem(DAILY_KEY,JSON.stringify(state));
    }
    if(!Array.isArray(state.notesSeen))state.notesSeen=[];
    state.questions=Math.max(0,Number(state.questions)||0);
    state.ads=Math.max(0,Number(state.ads)||0);
    state.questionGatePending=Boolean(state.questionGatePending);
    return state;
  }
  function saveDaily(state){
    state.updatedAt=new Date().toISOString();
    localStorage.setItem(DAILY_KEY,JSON.stringify(state));
    renderUsage();
  }
  function verifiedReferralStatus(){
    const remote=window.YKS2027_REFERRAL_STATUS;
    const stored=parseStored(REFERRAL_STATUS_KEY,{});
    const status=remote&&remote.verifiedByServer===true?remote:stored;
    return status&&status.verifiedByServer===true?status:{};
  }
  function hasUnlimitedFreePass(){
    const status=verifiedReferralStatus();
    return Boolean(status.passExpiresAt&&new Date(status.passExpiresAt).getTime()>Date.now());
  }
  function hasUnlimitedAccess(){
    return isPremium()||hasUnlimitedFreePass();
  }
  function lockReasonText(reason){
    if(reason==='questions')return 'Bugünkü 50 soruluk ücretsiz kullanım hakkın tamamlandı.';
    if(reason==='ads')return 'Bugünkü 6 ödüllü reklam kullanım hakkın tamamlandı.';
    return 'Bugünkü ücretsiz kullanım kotan tamamlandı.';
  }
  function markLocked(state,reason){
    state.locked=true;
    state.lockReason=reason||state.lockReason||'quota';
    const unlockTime=state.unlockAt?new Date(state.unlockAt).getTime():0;
    if(!unlockTime||unlockTime<=Date.now())state.unlockAt=new Date(nextIstanbulReset()).toISOString();
  }
  function isDailyLocked(){
    if(hasUnlimitedAccess())return false;
    const state=dailyState();
    let changed=false;
    if(state.questions>=QUESTION_LIMIT&&!state.locked){markLocked(state,'questions');changed=true;}
    if(state.ads>=REWARDED_AD_LIMIT&&!state.locked){markLocked(state,'ads');changed=true;}
    if(changed)saveDaily(state);
    return state.locked===true;
  }
  function resetLabel(){
    const state=dailyState();
    const value=state.unlockAt?new Date(state.unlockAt):new Date(nextIstanbulReset());
    return new Intl.DateTimeFormat('tr-TR',{timeZone:'Europe/Istanbul',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).format(value);
  }
  function hideEntry(){
    entryGate.classList.add('hide');
    setTimeout(function(){entryGate.style.display='none';},260);
  }
  function hideModal(id){
    const modal=document.getElementById(id);
    if(modal)modal.classList.remove('show');
  }
  function showModal(id){
    const modal=document.getElementById(id);
    if(modal)modal.classList.add('show');
  }
  function openPremiumRoute(source){
    hideModal('rewardModal');
    hideModal('lessonChoiceModal');
    hideModal('dailyLockModal');
    hideEntry();
    pendingReward=null;
    activateScreen('premium');
    const status=document.getElementById('premiumCheckoutStatus');
    if(status&&source==='locked')status.innerHTML='<strong>Günlük ücretsiz kullanım kotan doldu.</strong> Kesintisiz devam etmek için güvenli üyelik bağlantısı bu alanda açılacaktır.';
  }
  function showDailyLock(reason){
    const state=dailyState();
    markLocked(state,reason);
    saveDaily(state);
    hideModal('rewardModal');
    hideModal('lessonChoiceModal');
    pendingReward=null;
    const text=document.getElementById('dailyLockText');
    const until=document.getElementById('dailyLockUntil');
    if(text)text.textContent=lockReasonText(state.lockReason);
    if(until)until.textContent='Ücretsiz erişim '+resetLabel()+' tarihinde yeniden açılır.';
    showModal('dailyLockModal');
    const banner=document.getElementById('dailyLockBanner');
    if(banner){banner.hidden=false;banner.innerHTML='<strong>GÜNLÜK ÜCRETSİZ KULLANIM KOTANIZ DOLDU</strong>'+lockReasonText(state.lockReason)+' Sabah 08.00’e kadar ücretsiz alanlar kilitli.';}
  }
  function renderUsage(){
    const state=dailyState();
    const unlimited=hasUnlimitedAccess();
    const qText=unlimited?'Sınırsız':state.questions+' / '+QUESTION_LIMIT;
    const adText=unlimited?'Reklamsız':state.ads+' / '+REWARDED_AD_LIMIT;
    ['freeQuestionCount','arenaQuestionUsage'].forEach(function(id){const el=document.getElementById(id);if(el)el.textContent=qText;});
    ['freeAdCount','arenaAdUsage'].forEach(function(id){const el=document.getElementById(id);if(el)el.textContent=adText;});
    const notes=document.getElementById('notesUsage');
    if(notes)notes.textContent=unlimited?'Sınırsız not':'Bugün '+state.notesSeen.length+' akıllı not açıldı';
    const banner=document.getElementById('dailyLockBanner');
    if(banner&&!isDailyLocked())banner.hidden=true;
    renderReferralStatus();
  }
  function provider(){
    const value=window.YKS2027_REWARDED_AD_PROVIDER;
    return value&&typeof value.show==='function'?value:null;
  }
  function rewardCopy(context){
    if(context==='question')return '10 soruluk adımı tamamladın. Sonraki soruya geçmek için ödüllü reklamın tamamının izlenmesi gerekir.';
    if(context==='note-five')return 'Beş ücretsiz akıllı notu tamamladın. Yeni notu açmak için ödüllü reklamı tamamen izle.';
    return 'Ders özetinin sonraki sayfasını açmak için ödüllü reklamı tamamen izle veya Premium üyeliğe geç.';
  }
  function showRewardGate(){
    if(!pendingReward)return;
    const state=dailyState();
    const watch=document.getElementById('rewardWatch');
    const status=document.getElementById('rewardStatus');
    document.getElementById('rewardText').textContent=rewardCopy(pendingReward.context);
    document.getElementById('rewardQuota').textContent='Bugünkü ödüllü reklam: '+state.ads+' / '+REWARDED_AD_LIMIT;
    const available=Boolean(provider());
    watch.disabled=!available;
    watch.textContent=available?'ÖDÜLLÜ REKLAMI İZLE':'REKLAM HENÜZ HAZIR DEĞİL';
    status.className='reward-status'+(available?'':' provider-missing');
    status.textContent=available?'Reklam kapatılırsa veya ödül sinyali gelmezse sonraki aşama açılmaz.':'Canlı reklam sağlayıcısı ve reklam birimi tanımlanmadığı için ücretsiz geçiş açılamıyor.';
    showModal('rewardModal');
  }
  function requestReward(context,onGranted){
    if(hasUnlimitedAccess()){onGranted();return;}
    if(isDailyLocked()){openPremiumRoute('locked');return;}
    pendingReward={context:context,onGranted:onGranted};
    showRewardGate();
  }
  async function watchReward(){
    if(!pendingReward)return;
    const activeProvider=provider();
    if(!activeProvider){showRewardGate();return;}
    const watch=document.getElementById('rewardWatch');
    const status=document.getElementById('rewardStatus');
    watch.disabled=true;
    status.className='reward-status';
    status.textContent='Reklam hazırlanıyor. Tamamlanmadan bu ekranı kapatmayın.';
    let result;
    try{
      result=await activeProvider.show({placement:pendingReward.context,buildId:BUILD_ID});
    }catch(error){
      result={completed:false,granted:false,error:error&&error.message};
    }
    if(!result||result.completed!==true||result.granted!==true){
      watch.disabled=false;
      status.className='reward-status provider-missing';
      status.textContent='Reklam tamamlanmadı veya doğrulanmış ödül alınamadı. Sonraki aşama kilitli kaldı.';
      return;
    }
    const continuation=pendingReward.onGranted;
    const rewardContext=pendingReward.context;
    pendingReward=null;
    const state=dailyState();
    if(rewardContext==='question')state.questionGatePending=false;
    state.ads+=1;
    saveDaily(state);
    hideModal('rewardModal');
    if(state.ads>=REWARDED_AD_LIMIT){showDailyLock('ads');return;}
    continuation();
  }
  function cancelReward(){
    if(!pendingReward){hideModal('rewardModal');return;}
    if(pendingReward.context==='question'){
      const box=document.getElementById('quizBox');
      box.innerHTML='<article class="info-card"><span class="eyebrow">DEVAM KİLİTLİ</span><h3>Ödüllü reklam tamamlanmalı</h3><p>Sonraki soruya geçmek için reklamın tam izlenmesi veya Premium üyelik gerekir.</p><button id="resumeReward" class="primary-btn wide-btn" type="button">DEVAM SEÇENEKLERİNİ AÇ</button></article>';
      document.getElementById('resumeReward').addEventListener('click',showRewardGate);
    }else{
      pendingReward=null;
    }
    hideModal('rewardModal');
  }

  function mapQuestionBank(payload){
    if(!payload||!Array.isArray(payload.questions))return QUESTIONS.slice();
    return payload.questions.map(function(item){
      return {exam:item.exam,subject:item.subject,q:item.question,o:item.options,a:item.correctIndex,explanation:item.explanation||''};
    });
  }
  function loadQuestionBank(){
    if(!questionBankPromise){
      questionBankPromise=fetch('./data/verified/mixed_core_v15_50.json?v='+BUILD_ID)
        .then(function(response){if(!response.ok)throw new Error('Soru havuzu yüklenemedi.');return response.json();})
        .then(mapQuestionBank)
        .catch(function(){return QUESTIONS.slice();});
    }
    return questionBankPromise;
  }
  function shuffled(list){
    const copy=list.slice();
    for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const item=copy[i];copy[i]=copy[j];copy[j]=item;}
    return copy;
  }

  const baseActivateScreen=activateScreen;
  activateScreen=function(name){
    if(name!=='premium'&&isDailyLocked()){baseActivateScreen('premium');renderUsage();return;}
    baseActivateScreen(name);
    if(name==='notes')renderCourses();
    renderUsage();
  };
  startQuiz=async function(exam){
    if(isDailyLocked()){openPremiumRoute('locked');return;}
    const state=dailyState();
    if(!hasUnlimitedAccess()&&state.questionGatePending){requestReward('question',function(){startQuiz(exam);});return;}
    const remaining=hasUnlimitedAccess()?25:Math.max(0,QUESTION_LIMIT-state.questions);
    if(!remaining){showDailyLock('questions');return;}
    const box=document.getElementById('quizBox');
    box.innerHTML='<div class="info-card"><h3>Sorular hazırlanıyor</h3><p>Doğrulanmış soru havuzu yükleniyor.</p></div>';
    const all=await loadQuestionBank();
    const filtered=all.filter(function(question){return !exam||exam==='ALL'||question.exam===exam;});
    quiz.list=shuffled(filtered).slice(0,Math.min(25,remaining));
    quiz.i=0;
    quiz.answers=[];
    quiz.locked=false;
    pendingReward=null;
    baseActivateScreen('arena');
    renderQuestion();
    renderUsage();
  };
  answer=function(choice,btn){
    if(quiz.locked||isDailyLocked())return;
    quiz.locked=true;
    const question=quiz.list[quiz.i];
    quiz.answers.push({q:question,choice:choice});
    btn.classList.add('selected');
    document.querySelectorAll('[data-choice]').forEach(function(option){option.disabled=true;});
    stats.answered+=1;
    if(choice===question.a){stats.correct+=1;stats.points+=10;}
    save();
    const state=dailyState();
    if(!hasUnlimitedAccess()){
      state.questions+=1;
      if(state.questions<QUESTION_LIMIT&&state.questions%QUESTION_GATE===0)state.questionGatePending=true;
      saveDaily(state);
    }
    setTimeout(function(){
      quiz.i+=1;
      quiz.locked=false;
      if(!hasUnlimitedAccess()&&state.questions>=QUESTION_LIMIT){showDailyLock('questions');return;}
      const continueQuiz=function(){if(quiz.i>=quiz.list.length)finishQuiz();else renderQuestion();};
      if(!hasUnlimitedAccess()&&state.questionGatePending){requestReward('question',continueQuiz);}
      else continueQuiz();
    },350);
  };
  finishQuiz=function(){
    const correct=quiz.answers.filter(function(item){return item.choice===item.q.a;}).length;
    pendingQuizResult={total:quiz.answers.length,correct:correct,wrong:quiz.answers.length-correct,rawPoints:correct*10};
    document.getElementById('quizBox').innerHTML='<div class="info-card"><h3>Deneme tamamlandı</h3><p>Sonucun hazır. Devam seçimini ekrandaki kutudan yap.</p></div>';
    if(isPremium())showSimpleQuizResult();
    else document.getElementById('resultUpsellModal').classList.add('show');
    renderUsage();
  };

  function courseData(){return window.YKS2027_COURSES||{courses:[],scope:{}};}
  function renderCourses(){
    const data=courseData();
    const catalog=document.getElementById('courseCatalog');
    if(!catalog)return;
    const courses=data.courses.filter(function(item){return activeCourseFilter==='ALL'||item.exam.indexOf(activeCourseFilter)>=0;});
    catalog.innerHTML=courses.map(function(item){
      const index=data.courses.indexOf(item);
      return '<button class="course-card" data-course-index="'+index+'" type="button"><span class="course-icon">'+escapeHtml(item.icon)+'</span><span><strong>'+escapeHtml(item.title)+'</strong><small>'+escapeHtml(item.exam)+' • '+item.units.length+' ünite özeti</small></span></button>';
    }).join('');
    document.querySelectorAll('.course-filter').forEach(function(button){button.classList.toggle('active',button.dataset.courseFilter===activeCourseFilter);});
    renderUsage();
  }
  function showCourse(courseIndex){
    if(isDailyLocked()){openPremiumRoute('locked');return;}
    const course=courseData().courses[courseIndex];
    if(!course)return;
    readerState={courseIndex:courseIndex,unitIndex:-1,page:0};
    document.getElementById('courseCatalogWrap').hidden=true;
    document.getElementById('lessonReader').hidden=true;
    const detail=document.getElementById('courseDetail');
    detail.hidden=false;
    document.getElementById('courseDetailTitle').textContent=course.title;
    document.getElementById('courseDetailMeta').textContent=course.exam+' • 12. sınıf YKS çalışma özetleri';
    document.getElementById('unitList').innerHTML=course.units.map(function(item,index){
      return '<button class="unit-card" data-unit-index="'+index+'" type="button"><strong>'+(index+1)+'. '+escapeHtml(item.title)+'</strong><small>Özet + akıllı not • 2 sayfa</small></button>';
    }).join('');
    document.querySelector('.main-content').scrollTop=0;
  }
  function noteKey(courseIndex,unitIndex){return courseIndex+'-'+unitIndex;}
  function openUnit(courseIndex,unitIndex){
    if(isDailyLocked()){openPremiumRoute('locked');return;}
    const state=dailyState();
    const key=noteKey(courseIndex,unitIndex);
    const isNew=state.notesSeen.indexOf(key)<0;
    const open=function(){
      const current=dailyState();
      if(isNew&&current.notesSeen.indexOf(key)<0){current.notesSeen.push(key);saveDaily(current);}
      readerState={courseIndex:courseIndex,unitIndex:unitIndex,page:0};
      document.getElementById('courseDetail').hidden=true;
      document.getElementById('lessonReader').hidden=false;
      renderReader();
      document.querySelector('.main-content').scrollTop=0;
    };
    if(!hasUnlimitedAccess()&&isNew&&state.notesSeen.length>=FREE_NOTE_LIMIT)requestReward('note-five',open);
    else open();
  }
  function renderReader(){
    const course=courseData().courses[readerState.courseIndex];
    const current=course&&course.units[readerState.unitIndex];
    if(!current)return;
    const isSummary=readerState.page===0;
    document.getElementById('readerProgress').textContent='SAYFA '+(readerState.page+1)+' / 2 • '+course.title;
    document.getElementById('readerTitle').textContent=current.title;
    document.getElementById('readerBody').innerHTML=isSummary?'<p>'+escapeHtml(current.summary)+'</p>':'<div class="smart-note"><span class="eyebrow">AKILLI NOT</span><p>'+escapeHtml(current.note)+'</p></div>';
    const next=document.getElementById('readerNext');
    next.textContent=isSummary?'SONRAKİ SAYFA':'ÜNİTELERE DÖN';
  }
  function requestNextReaderPage(){
    if(readerState.page===1){showCourse(readerState.courseIndex);return;}
    const proceed=function(){readerState.page=1;renderReader();document.querySelector('.main-content').scrollTop=0;};
    if(hasUnlimitedAccess()){proceed();return;}
    document.getElementById('lessonChoiceText').textContent='Akıllı not sayfasına geçmek için ödüllü reklamı tamamen izle veya Premium üyeliği görüntüle.';
    document.getElementById('lessonAdChoice').onclick=function(){hideModal('lessonChoiceModal');requestReward('lesson-page',proceed);};
    showModal('lessonChoiceModal');
  }

  function cryptoDigits(){
    const values=new Uint32Array(1);
    crypto.getRandomValues(values);
    return String(100000+(values[0]%900000));
  }
  function referralCode(){
    const profile=parseStored(PROFILE_KEY,{});
    if(profile.referralCode)return profile.referralCode;
    const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const values=new Uint32Array(6);
    crypto.getRandomValues(values);
    let code='YKS-';
    for(let i=0;i<6;i++)code+=alphabet[values[i]%alphabet.length];
    profile.referralCode=code;
    localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));
    return code;
  }
  function renderProfile(){
    const profile=parseStored(PROFILE_KEY,{});
    const name=document.getElementById('studentName');
    if(name&&document.activeElement!==name)name.value=profile.name||'';
    const referral=document.getElementById('referralCode');
    if(referral)referral.textContent=referralCode();
    const parent=document.getElementById('parentAccessCode');
    if(parent)parent.textContent=isPremium()?(profile.parentCode||'KOD OLUŞTUR'):'PREMIUM';
    const parentStatus=document.getElementById('parentCodeStatus');
    if(parentStatus&&!isPremium())parentStatus.textContent='6 haneli veli giriş kodu yalnızca doğrulanmış Premium üyelikte oluşturulur.';
    renderReferralStatus();
  }
  function renderReferralStatus(){
    const status=verifiedReferralStatus();
    const count=Math.max(0,Math.min(3,Number(status.verifiedFriends)||0));
    const countEl=document.getElementById('verifiedReferralCount');
    if(countEl)countEl.textContent=count+' / 3 doğrulanmış arkadaş';
    document.querySelectorAll('.referral-step').forEach(function(step,index){step.classList.toggle('verified',index<count);});
    const pass=document.getElementById('referralPassStatus');
    if(pass){
      if(hasUnlimitedFreePass())pass.textContent='Reklamsız ücretsiz kullanım hakkın '+new Intl.DateTimeFormat('tr-TR',{dateStyle:'medium',timeStyle:'short',timeZone:'Europe/Istanbul'}).format(new Date(status.passExpiresAt))+' tarihine kadar aktif.';
      else pass.textContent='1. arkadaş +1 gün, 2. arkadaş +2 gün, 3. arkadaş +3 gün reklamsız ücretsiz kullanım kazandırır.';
    }
  }
  function saveProfile(){
    const profile=parseStored(PROFILE_KEY,{});
    profile.name=document.getElementById('studentName').value.trim();
    profile.referralCode=profile.referralCode||referralCode();
    localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));
    document.getElementById('profileStatus').textContent=profile.name?'Profil kaydedildi: '+profile.name:'Profil kaydedildi.';
  }
  async function generateParentCode(){
    if(!isPremium()){settingsModal.classList.remove('show');openPremiumRoute('parent-code');return;}
    const profile=parseStored(PROFILE_KEY,{});
    const api=window.YKS2027_PARENT_API;
    let code='';
    let verified=false;
    if(api&&typeof api.createCode==='function'){
      try{
        const result=await api.createCode({studentName:profile.name||'',buildId:BUILD_ID});
        if(result&&/^\d{6}$/.test(String(result.code))){code=String(result.code);verified=result.verified===true;}
      }catch(_){}
    }
    if(!code)code=cryptoDigits();
    profile.parentCode=code;
    profile.parentCodeExpiresAt=new Date(Date.now()+10*60*1000).toISOString();
    profile.parentCodeVerified=verified;
    localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));
    document.getElementById('parentAccessCode').textContent=code;
    document.getElementById('parentCodeStatus').textContent=verified?'Kod üyelik sunucusunda doğrulandı; 10 dakika geçerli.':'6 haneli kod oluşturuldu. Cihazlar arası veli girişi için üyelik sunucusu bağlantısı gereklidir.';
  }
  async function copyText(value,statusId){
    try{await navigator.clipboard.writeText(value);document.getElementById(statusId).textContent='Panoya kopyalandı.';}
    catch(_){document.getElementById(statusId).textContent='Kopyalama izni verilmedi. Kodu elle kopyalayabilirsin.';}
  }
  async function shareReferral(){
    const code=referralCode();
    const url=new URL(location.href);
    url.search='';
    url.hash='';
    url.searchParams.set('ref',code);
    const shareData={title:'YKS2027 Arena',text:'YKS2027 Arena çalışma uygulamasına katıl. Davet kodum: '+code,url:url.toString()};
    if(navigator.share){try{await navigator.share(shareData);return;}catch(_){}}
    await copyText(shareData.text+' '+shareData.url,'referralShareStatus');
  }
  function registerIncomingReferral(){
    const incoming=new URLSearchParams(location.search).get('ref');
    if(!incoming)return;
    localStorage.setItem(INCOMING_REF_KEY,JSON.stringify({code:incoming,firstSeenAt:new Date().toISOString(),buildId:BUILD_ID}));
    const api=window.YKS2027_REFERRAL_API;
    if(api&&typeof api.registerUse==='function')api.registerUse({code:incoming,installed:window.matchMedia('(display-mode: standalone)').matches,buildId:BUILD_ID}).catch(function(){});
  }

  document.getElementById('entryParentBtn').addEventListener('click',function(){hideEntry();openPremiumRoute('entry-parent');});
  enterBtn.addEventListener('click',function(event){
    if(isDailyLocked()){event.preventDefault();event.stopImmediatePropagation();hideEntry();openPremiumRoute('locked');}
  },true);
  document.querySelectorAll('[data-premium-route]').forEach(function(button){button.addEventListener('click',function(){openPremiumRoute(button.dataset.premiumRoute||'feature');});});
  document.getElementById('rewardWatch').addEventListener('click',watchReward);
  document.getElementById('rewardPremium').addEventListener('click',function(){openPremiumRoute('reward');});
  document.getElementById('rewardCancel').addEventListener('click',cancelReward);
  document.getElementById('dailyLockPremium').addEventListener('click',function(){openPremiumRoute('locked');});
  document.getElementById('lessonPremiumChoice').addEventListener('click',function(){hideModal('lessonChoiceModal');openPremiumRoute('lesson');});
  document.getElementById('lessonChoiceCancel').addEventListener('click',function(){hideModal('lessonChoiceModal');});
  document.getElementById('courseCatalog').addEventListener('click',function(event){const button=event.target.closest('[data-course-index]');if(button)showCourse(Number(button.dataset.courseIndex));});
  document.getElementById('unitList').addEventListener('click',function(event){const button=event.target.closest('[data-unit-index]');if(button)openUnit(readerState.courseIndex,Number(button.dataset.unitIndex));});
  document.getElementById('courseBack').addEventListener('click',function(){document.getElementById('courseDetail').hidden=true;document.getElementById('courseCatalogWrap').hidden=false;renderCourses();});
  document.getElementById('readerBack').addEventListener('click',function(){showCourse(readerState.courseIndex);});
  document.getElementById('readerNext').addEventListener('click',requestNextReaderPage);
  document.querySelectorAll('.course-filter').forEach(function(button){button.addEventListener('click',function(){activeCourseFilter=button.dataset.courseFilter;renderCourses();});});
  document.getElementById('profileSave').addEventListener('click',saveProfile);
  document.getElementById('parentCodeCreate').addEventListener('click',generateParentCode);
  document.getElementById('parentCodeCopy').addEventListener('click',function(){const value=document.getElementById('parentAccessCode').textContent;if(/^\d{6}$/.test(value))copyText(value,'parentCodeStatus');});
  document.getElementById('referralShare').addEventListener('click',shareReferral);
  settingsBtn.addEventListener('click',renderProfile);
  document.addEventListener('click',function(event){
    if(!isDailyLocked())return;
    const allowed=event.target.closest('#premiumBtn,#premiumStart,#dailyLockPremium,.open-premium,[data-premium-route],[data-lock-allowed]');
    if(allowed)return;
    const action=event.target.closest('button,a');
    if(action){event.preventDefault();event.stopImmediatePropagation();openPremiumRoute('locked');}
  },true);
  window.addEventListener('appinstalled',function(){
    const incoming=parseStored(INCOMING_REF_KEY,null);
    const api=window.YKS2027_REFERRAL_API;
    if(incoming&&api&&typeof api.registerInstall==='function')api.registerInstall({code:incoming.code,buildId:BUILD_ID}).catch(function(){});
  });

  registerIncomingReferral();
  renderCourses();
  renderProfile();
  renderUsage();
  setInterval(renderUsage,60000);
})();
