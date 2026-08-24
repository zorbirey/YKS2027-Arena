(function(){
  'use strict';

  const BUILD_ID='20260824-09';
  const DAILY_KEY='yks2027-daily-access-v1';
  const PROFILE_KEY='yks2027-student-profile-v1';
  const REFERRAL_STATUS_KEY='yks2027-referral-status-v1';
  const INCOMING_REF_KEY='yks2027-incoming-referral-v1';
  const CLOCK_KEY='yks2027-trusted-clock-v1';
  const DEMO_REWARD_SECONDS=8;
  const CLOCK_REFRESH_MS=5*60*1000;
  const QUESTION_LIMIT=50;
  const QUESTION_GATE=10;
  const REWARDED_AD_LIMIT=6;
  const FREE_NOTE_LIMIT=0;
  const HOUR=3600000;
  let questionBankPromise=null;
  let pendingReward=null;
  let readerState={courseIndex:-1,unitIndex:-1,page:0};
  let activeCourseFilter='ALL';
  let trustedClockEpoch=0;
  let trustedClockPerf=0;
  let trustedClockVerified=false;
  let clockSyncPromise=null;
  let demoRewardSession=null;

  function parseStored(key,fallback){
    try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}
    catch(_){return fallback;}
  }
  function monotonicNow(){return window.performance&&typeof window.performance.now==='function'?window.performance.now():Date.now();}
  function storedTrustedNow(){const state=parseStored(CLOCK_KEY,{});return Math.max(0,Number(state.lastServerEpoch)||0);}
  function trustedNow(){
    if(trustedClockVerified&&trustedClockEpoch>0)return trustedClockEpoch+Math.max(0,monotonicNow()-trustedClockPerf);
    return storedTrustedNow();
  }
  function accessNow(){return trustedNow()||Date.now();}
  function syncTrustedClock(){
    if(clockSyncPromise)return clockSyncPromise;
    const url='./manifest.webmanifest?clock-check='+encodeURIComponent(BUILD_ID)+'&nonce='+Math.random().toString(36).slice(2);
    clockSyncPromise=fetch(url,{cache:'no-store',credentials:'same-origin'}).then(function(response){
      if(!response.ok)throw new Error('Saat doğrulama yanıtı alınamadı.');
      const header=response.headers&&typeof response.headers.get==='function'?response.headers.get('Date'):'';
      const ageHeader=response.headers&&typeof response.headers.get==='function'?response.headers.get('Age'):'';
      const ageSeconds=Math.max(0,Number(ageHeader)||0);
      const serverEpoch=Date.parse(header||'')+ageSeconds*1000;
      if(!Number.isFinite(serverEpoch)||serverEpoch<=0)throw new Error('Sunucu zamanı okunamadı.');
      const safeEpoch=serverEpoch;
      trustedClockEpoch=safeEpoch;
      trustedClockPerf=monotonicNow();
      trustedClockVerified=true;
      localStorage.setItem(CLOCK_KEY,JSON.stringify({lastServerEpoch:safeEpoch,verifiedAt:new Date(safeEpoch).toISOString(),buildId:BUILD_ID}));
      return true;
    }).catch(function(){return false;}).finally(function(){clockSyncPromise=null;});
    return clockSyncPromise;
  }
  function istanbulCycle(now){
    return new Date((Number(now)||accessNow())-5*HOUR).toISOString().slice(0,10);
  }
  function nextIstanbulReset(now){
    const time=Number(now)||accessNow();
    const local=new Date(time+3*HOUR);
    return Date.UTC(local.getUTCFullYear(),local.getUTCMonth(),local.getUTCDate()+1,5,0,0,0);
  }
  function freshDaily(now){
    const time=Number(now)||accessNow();
    return {cycle:istanbulCycle(time),questions:0,ads:0,notesSeen:[],questionGatePending:false,locked:false,lockReason:'',unlockAt:'',clockVerificationRequired:false,updatedAt:new Date(time).toISOString()};
  }
  function dailyState(){
    let state=parseStored(DAILY_KEY,null);
    if(!state)state=freshDaily();
    const now=trustedNow();
    const canTrustTime=trustedClockVerified&&now>0;
    if(!state.cycle)state.cycle=istanbulCycle(now||Date.now());
    if(canTrustTime){
      const currentCycle=istanbulCycle(now);
      const unlockTime=state.unlockAt?new Date(state.unlockAt).getTime():0;
      const lockExpired=state.locked===true&&unlockTime>0&&unlockTime<=now;
      const cycleChanged=state.locked!==true&&state.cycle!==currentCycle;
      if(lockExpired||cycleChanged){state=freshDaily(now);localStorage.setItem(DAILY_KEY,JSON.stringify(state));}
    }
    if(!Array.isArray(state.notesSeen))state.notesSeen=[];
    state.questions=Math.max(0,Number(state.questions)||0);
    state.ads=Math.max(0,Number(state.ads)||0);
    state.questionGatePending=Boolean(state.questionGatePending);
    state.clockVerificationRequired=Boolean(state.locked);
    return state;
  }
  function saveDaily(state){
    state.updatedAt=new Date(accessNow()).toISOString();
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
    return Boolean(status.passExpiresAt&&new Date(status.passExpiresAt).getTime()>accessNow());
  }
  function hasUnlimitedAccess(){
    const reward=parseStored('yks2027-achievement-v1',{}),until=Date.parse(reward.adFreeUntil||'');return isPremium()||hasUnlimitedFreePass()||(trustedClockVerified&&Number.isFinite(until)&&until>accessNow());
  }
  function lockReasonText(reason){
    if(reason==='questions')return 'Bugünkü 50 soruluk ücretsiz kullanım hakkın tamamlandı.';
    if(reason==='ads')return 'Bugünkü 6 ödüllü reklam kullanım hakkın tamamlandı.';
    return 'Bugünkü ücretsiz kullanım kotan tamamlandı.';
  }
  function markLocked(state,reason){
    state.locked=true;
    state.lockReason=reason||state.lockReason||'quota';
    state.clockVerificationRequired=true;
    const unlockTime=state.unlockAt?new Date(state.unlockAt).getTime():0;
    if(!unlockTime)state.unlockAt=new Date(nextIstanbulReset(accessNow())).toISOString();
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
    abortDemoRewardCountdown();
    pendingReward=null;
    activateScreen('premium');
    const status=document.getElementById('premiumCheckoutStatus');
    if(status&&source==='locked')status.innerHTML='<strong>Günlük ücretsiz kullanım kotan doldu.</strong> Kesintisiz devam etmek için güvenli üyelik bağlantısı bu alanda açılacaktır.';
  }
  function setClockStatus(message,state){
    const element=document.getElementById('dailyLockClockStatus');
    if(!element)return;
    element.className='clock-verification '+(state||'checking');
    element.textContent=message;
  }
  function verifyLockedClock(){
    setClockStatus('Kilit süresi sunucu saatinden doğrulanıyor…','checking');
    return syncTrustedClock().then(function(ok){
      const state=dailyState();
      if(!state.locked){hideModal('dailyLockModal');renderUsage();return true;}
      if(ok)setClockStatus('Sunucu saati doğrulandı. Cihaz saatini değiştirmek kilidi kaldırmaz.','verified');
      else setClockStatus('Sunucu zamanı doğrulanamadı. Güvenlik nedeniyle kilit açık kalır; internet bağlantını kontrol et.','failed');
      const until=document.getElementById('dailyLockUntil');
      if(until)until.textContent='Ücretsiz erişim '+resetLabel()+' tarihinde, sunucu zamanı doğrulandıktan sonra yeniden açılır.';
      return ok;
    });
  }
  function showDailyLock(reason){
    const state=dailyState();
    markLocked(state,reason);
    saveDaily(state);
    hideModal('rewardModal');
    hideModal('lessonChoiceModal');
    abortDemoRewardCountdown();
    pendingReward=null;
    const text=document.getElementById('dailyLockText');
    const until=document.getElementById('dailyLockUntil');
    if(text)text.textContent=lockReasonText(state.lockReason);
    if(until)until.textContent='Ücretsiz erişim '+resetLabel()+' tarihinde, sunucu zamanı doğrulandıktan sonra yeniden açılır.';
    showModal('dailyLockModal');
    const banner=document.getElementById('dailyLockBanner');
    if(banner){banner.hidden=false;banner.innerHTML='<strong>GÜNLÜK ÜCRETSİZ KULLANIM KOTANIZ DOLDU</strong>'+lockReasonText(state.lockReason)+' Sabah 08.00’e kadar ücretsiz alanlar kilitli. Açılış sunucu saatiyle doğrulanır.';}
    verifyLockedClock();
  }
  function renderUsage(){
    const state=dailyState();
    const unlimited=hasUnlimitedAccess();
    const qText=unlimited?'Sınırsız':state.questions+' / '+QUESTION_LIMIT;
    const adText=unlimited?'Reklamsız':state.ads+' / '+REWARDED_AD_LIMIT;
    ['freeQuestionCount','arenaQuestionUsage'].forEach(function(id){const el=document.getElementById(id);if(el)el.textContent=qText;});
    ['freeAdCount','arenaAdUsage'].forEach(function(id){const el=document.getElementById(id);if(el)el.textContent=adText;});
    const notes=document.getElementById('notesUsage');
    if(notes)notes.textContent=unlimited?'Sınırsız ders özeti':'Bugün '+state.notesSeen.length+' ders özeti açıldı';
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
  function resetDemoRewardUi(){
    const panel=document.getElementById('rewardCountdown');
    const count=document.getElementById('rewardCountdownNumber');
    const bar=document.getElementById('rewardCountdownBar');
    if(panel){panel.hidden=true;panel.classList.remove('complete');}
    if(count)count.textContent=String(DEMO_REWARD_SECONDS);
    if(bar)bar.style.width='0%';
    const cancel=document.getElementById('rewardCancel');
    const premium=document.getElementById('rewardPremium');
    if(cancel)cancel.disabled=false;
    if(premium)premium.disabled=false;
  }
  function abortDemoRewardCountdown(){
    if(!demoRewardSession)return;
    clearInterval(demoRewardSession.timer);
    const resolve=demoRewardSession.resolve;
    demoRewardSession=null;
    resetDemoRewardUi();
    resolve({completed:false,granted:false,cancelled:true});
  }
  function runDemoRewardCountdown(){
    return new Promise(function(resolve){
      if(demoRewardSession){resolve({completed:false,granted:false});return;}
      const panel=document.getElementById('rewardCountdown');
      const count=document.getElementById('rewardCountdownNumber');
      const bar=document.getElementById('rewardCountdownBar');
      const watch=document.getElementById('rewardWatch');
      const status=document.getElementById('rewardStatus');
      const cancel=document.getElementById('rewardCancel');
      const premium=document.getElementById('rewardPremium');
      const total=DEMO_REWARD_SECONDS*1000;
      let remaining=total;
      let last=monotonicNow();
      if(panel)panel.hidden=false;
      if(cancel)cancel.disabled=false;
      if(premium)premium.disabled=true;
      watch.disabled=true;
      watch.textContent='REKLAM DEVAM EDİYOR';
      function draw(){
        const seconds=Math.max(0,Math.ceil(remaining/1000));
        if(count)count.textContent=String(seconds);
        if(bar)bar.style.width=Math.min(100,Math.round((total-remaining)/total*100))+'%';
        status.textContent=seconds>0?seconds+' saniye sonra devam hakkın açılacak. Uygulamadan ayrılırsan sayaç durur.':'Reklam tamamlandı. Devam hakkın açılıyor…';
      }
      draw();
      const timer=setInterval(function(){
        const now=monotonicNow();
        const elapsed=Math.max(0,Math.min(250,now-last));
        last=now;
        if(document.hidden){draw();return;}
        remaining-=elapsed;
        draw();
        if(remaining<=0){
          clearInterval(timer);
          demoRewardSession=null;
          if(panel)panel.classList.add('complete');
          if(cancel)cancel.disabled=false;
          if(premium)premium.disabled=false;
          resolve({completed:true,granted:true,demo:true});
        }
      },100);
      demoRewardSession={timer:timer,resolve:resolve};
    });
  }
  function showRewardGate(){
    if(!pendingReward)return;
    const state=dailyState();
    const watch=document.getElementById('rewardWatch');
    const status=document.getElementById('rewardStatus');
    resetDemoRewardUi();
    document.getElementById('rewardText').textContent=rewardCopy(pendingReward.context);
    document.getElementById('rewardQuota').textContent='Bugünkü ödüllü reklam: '+state.ads+' / '+REWARDED_AD_LIMIT;
    const liveProvider=Boolean(provider());
    watch.disabled=false;
    watch.textContent=liveProvider?'ÖDÜLLÜ REKLAMI İZLE':'8 SANİYELİK REKLAMI İZLE';
    status.className='reward-status';
    status.textContent=liveProvider?'Reklam kapatılırsa veya ödül sinyali gelmezse sonraki aşama açılmaz.':'Geçici demo reklam sekiz saniye boyunca ekranda kaldığında sonraki aşama açılır.';
    showModal('rewardModal');
  }
  function requestReward(context,onGranted){
    if(hasUnlimitedAccess()){onGranted();return;}
    if(isDailyLocked()){openPremiumRoute('locked');return;}
    pendingReward={context:context,onGranted:onGranted};
    showRewardGate();
  }
  async function watchReward(){
    if(!pendingReward||demoRewardSession)return;
    const activeProvider=provider();
    const watch=document.getElementById('rewardWatch');
    const status=document.getElementById('rewardStatus');
    watch.disabled=true;
    status.className='reward-status';
    status.textContent=activeProvider?'Reklam hazırlanıyor. Tamamlanmadan bu ekranı kapatmayın.':'Sekiz saniyelik geçici reklam başlatılıyor…';
    let result;
    try{
      result=activeProvider?await activeProvider.show({placement:pendingReward.context,buildId:BUILD_ID}):await runDemoRewardCountdown();
    }catch(error){
      result={completed:false,granted:false,error:error&&error.message};
    }
    if(!result||result.completed!==true||result.granted!==true){
      watch.disabled=false;
      watch.textContent=activeProvider?'ÖDÜLLÜ REKLAMI TEKRAR DENE':'8 SANİYELİK REKLAMI TEKRARLA';
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
    resetDemoRewardUi();
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
      return {id:item.id,exam:item.exam,subject:item.subject,topic:item.topic||'',difficulty:item.difficulty||'Orta',q:item.question,o:item.options,a:item.correctIndex,explanation:item.explanation||''};
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
    window.dispatchEvent(new CustomEvent('yksarena:quiz-finished',{detail:{answers:quiz.answers}}));
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
      const questionCount=examQuestions(course,item).length;const pageCount=5+(questionCount?1:0);
      return '<button class="unit-card" data-unit-index="'+index+'" type="button"><strong>'+(index+1)+'. '+escapeHtml(item.title)+'</strong><small>'+pageCount+' sayfa • sınav rehberi • '+(questionCount?'5 seviyeli soru paketi':'soru tipleri ve çeldiriciler')+'</small></button>';
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
    open();
  }
  function richLibrary(){return window.YKS2027_COURSE_DETAILS||{details:{},sources:{},checklists:{}};}
  function examLibrary(){return window.YKS2027_EXAM_GUIDE||{profiles:{},sources:[],difficultyOrder:[]};}
  function examProfile(course,current){return examLibrary().profiles[course.title+'|'+current.title]||null;}
  function examQuestions(course,current){
    const sets=window.YKS2027_EXAM_QUESTION_SETS||examLibrary().questions||{};
    return sets[course.title+'|'+current.title]||[];
  }
  function examList(items,className){
    return '<ul class="'+className+'">'+(items||[]).map(function(item){return '<li>'+escapeHtml(item)+'</li>';}).join('')+'</ul>';
  }
  function renderExamGuide(profile){
    if(!profile)return '<div class="verification-note">Bu ünitenin soru biçimi rehberi hazırlanıyor.</div>';
    return '<div class="exam-guide-intro"><strong>Soru kökünü tanı, çeldiriciyi yakala</strong><p>Bu rehber resmî materyallerde tekrarlanan ölçme biçimlerinden hareketle hazırlanmıştır; bir çıkmış soru sıklık istatistiği değildir.</p></div>'+
      '<div class="exam-guide-grid"><section><h4>Sık karşılaşılan soru biçimleri</h4>'+examList(profile.questionTypes,'exam-type-list')+'</section><section class="distractor-panel"><h4>Çeldiriciler</h4>'+examList(profile.distractors,'exam-distractor-list')+'</section></div>'+
      '<section class="attention-panel"><h4>Nelere dikkat etmelisin?</h4>'+examList(profile.cautions,'exam-attention-list')+'</section>'+
      '<section class="exam-use-panel"><span class="eyebrow">SINAV SORULARINDA NASIL KULLANILIR?</span><p>'+escapeHtml(profile.examUse)+'</p></section>';
  }
  function renderExamQuestion(question,index){
    const letters=['A','B','C','D','E'];
    const classes={'Kolay':'kolay','Orta':'orta','Orta Üst':'orta-ust','Zor':'zor','Efsane':'efsane'};
    const optionRows=question.options.map(function(option,optionIndex){return '<li><b>'+letters[optionIndex]+'</b><span>'+escapeHtml(option)+'</span></li>';}).join('');
    const distractors=(question.distractorNotes||[]).map(function(note){return '<li>'+escapeHtml(note)+'</li>';}).join('');
    return '<details class="exam-question-card"><summary><span class="difficulty-badge '+(classes[question.difficulty]||'orta')+'">'+escapeHtml(question.difficulty)+'</span><strong>Soru '+(index+1)+'</strong><small>'+escapeHtml(question.id)+'</small></summary><div class="exam-question-body"><p class="exam-stem">'+escapeHtml(question.stem)+'</p><ol class="exam-options">'+optionRows+'</ol><details class="answer-reveal"><summary>Cevap ve çeldirici analizini göster</summary><div><p class="correct-answer"><b>Doğru cevap: '+letters[question.answer]+'</b> — '+escapeHtml(question.options[question.answer])+'</p><p>'+escapeHtml(question.explanation)+'</p><h5>Çeldirici analizi</h5><ul>'+distractors+'</ul><p class="attention-callout"><strong>Dikkat:</strong> '+escapeHtml(question.attention)+'</p><small>'+escapeHtml(question.sourceBasis)+'</small></div></details></div></details>';
  }
  function renderQuestionLab(questionSet){
    return '<div class="question-lab-head"><strong>Beş basamaklı çalışma</strong><p>Kolaydan efsaneye ilerle; her soruda cevabı açmadan önce çeldiriciyi neden eleyeceğini söyle.</p></div><div class="question-lab">'+questionSet.map(renderExamQuestion).join('')+'</div>';
  }
  function richDetail(course,current){
    const found=richLibrary().details[course.title+'|'+current.title];
    return found||{
      explanation:current.summary,
      concepts:['Ana fikir|'+current.summary],
      example:'Bu ünitenin temel kavramını kendi cümlenle açıkla.',
      solution:['Kavramın tanımını belirle.','Sorudaki ipucuyla ilişkilendir.','Sonucu temel ilkeyle kontrol et.'],
      mistake:'Kavramı bağlamdan kopuk ezberlemek yerine neden-sonuç ilişkisini kur.',
      visual:{type:'flow',title:'Konu çalışma akışı',items:['Tanım','İlişki','Uygulama']}
    };
  }
  function richSources(course){
    const library=richLibrary();
    return (library.sources.common||[]).concat(library.sources[course.title]||[]);
  }
  function conceptCard(value){
    const split=String(value).split('|');
    const label=split.shift();
    return '<div class="concept-card"><strong>'+escapeHtml(label)+'</strong><span>'+escapeHtml(split.join('|'))+'</span></div>';
  }
  function renderLessonVisual(visual){
    if(!visual||!Array.isArray(visual.items))return '';
    const title=escapeHtml(visual.title||'Konu şeması');
    const items=visual.items.map(function(item){return escapeHtml(item);});
    if(visual.type==='curve'){
      return '<figure class="lesson-visual lesson-curve"><figcaption>'+title+' <small>Şematik gösterim</small></figcaption><svg viewBox="0 0 320 170" role="img" aria-label="'+title+'"><line x1="25" y1="140" x2="305" y2="140"/><line x1="45" y1="155" x2="45" y2="15"/><path d="M32 126 C78 118 105 102 140 78 S222 33 295 24"/><path class="visual-path-alt" d="M55 150 C78 124 106 102 140 84 S225 50 294 42"/><circle cx="140" cy="78" r="5"/></svg><div class="visual-legend">'+items.map(function(item){return '<span>'+item+'</span>';}).join('')+'</div></figure>';
    }
    if(visual.type==='bars'){
      const numeric=visual.items.map(function(item){const match=String(item).match(/-?\d+(?:[.,]\d+)?/);return match?Number(match[0].replace(',','.')):NaN;});
      const usable=numeric.every(Number.isFinite);const max=usable?Math.max.apply(null,numeric):1;
      return '<figure class="lesson-visual"><figcaption>'+title+' <small>Şematik karşılaştırma</small></figcaption><div class="visual-bars">'+items.map(function(item,index){const width=usable?Math.max(14,Math.round(numeric[index]/max*100)):Math.max(28,100-index*18);return '<div class="visual-bar-row"><span>'+item+'</span><i style="width:'+width+'%"></i></div>';}).join('')+'</div></figure>';
    }
    if(visual.type==='timeline'){
      return '<figure class="lesson-visual"><figcaption>'+title+'</figcaption><ol class="visual-timeline">'+items.map(function(item){return '<li><span></span><b>'+item+'</b></li>';}).join('')+'</ol></figure>';
    }
    if(visual.type==='compare'){
      return '<figure class="lesson-visual"><figcaption>'+title+'</figcaption><div class="visual-compare">'+items.map(function(item){return '<div>'+item+'</div>';}).join('')+'</div></figure>';
    }
    const cycleClass=visual.type==='cycle'?' visual-cycle':'';
    return '<figure class="lesson-visual"><figcaption>'+title+'</figcaption><div class="visual-flow'+cycleClass+'">'+items.map(function(item,index){return '<span>'+item+'</span>'+(index<items.length-1?'<b aria-hidden="true">→</b>':'');}).join('')+'</div></figure>';
  }
  function lessonPages(course,current){
    const detail=richDetail(course,current);
    const checklist=richLibrary().checklists[course.title]||['Ana kavramı belirledim.','Örneği adım adım çözdüm.','Sonucu temel ilkeyle kontrol ettim.'];
    const sources=richSources(course);
    const profile=examProfile(course,current);
    const questionSet=examQuestions(course,current);
    const pages=[
      '<section class="lesson-section"><span class="eyebrow">1 • KONU ANLATIMI</span><h4>Konunun çerçevesi</h4><p>'+escapeHtml(current.summary)+'</p><h4>Derinlemesine öğren</h4><p>'+escapeHtml(detail.explanation)+'</p><div class="verification-note">Bu anlatım MEB ünite kapsamı temel alınarak özgün yazıldı; aşağıdaki kaynaklarla kavramsal olarak doğrulandı.</div></section>',
      '<section class="lesson-section"><span class="eyebrow">2 • KAVRAMLAR VE ŞEMA</span>'+renderLessonVisual(detail.visual)+'<h4>Temel kavramlar</h4><div class="concept-grid">'+detail.concepts.map(conceptCard).join('')+'</div></section>',
      '<section class="lesson-section"><span class="eyebrow">3 • ÇÖZÜMLÜ ÖRNEK</span><div class="worked-example"><strong>Soru / Uygulama</strong><p>'+escapeHtml(detail.example)+'</p></div><h4>Adım adım çözüm</h4><ol class="solution-steps">'+detail.solution.map(function(step){return '<li>'+escapeHtml(step)+'</li>';}).join('')+'</ol></section>',
      '<section class="lesson-section"><span class="eyebrow">4 • AKILLI NOT VE KAYNAK</span><div class="smart-note"><span class="eyebrow">AKILLI NOT</span><p>'+escapeHtml(current.note)+'</p></div><div class="mistake-box"><strong>Sık yapılan hata</strong><p>'+escapeHtml(detail.mistake)+'</p></div><h4>Ünite kontrol listesi</h4><ul class="lesson-checklist">'+checklist.map(function(item){return '<li>'+escapeHtml(item)+'</li>';}).join('')+'</ul><h4>Doğrulama kaynakları</h4><ul class="lesson-source-list">'+sources.map(function(source){return '<li><a href="'+escapeHtml(source.url)+'" target="_blank" rel="noopener noreferrer">'+escapeHtml(source.label)+'</a><small>'+escapeHtml(source.note)+'</small></li>';}).join('')+'</ul><small class="source-method-note">Kaynaklar doğrulama amacıyla kullanılmıştır; metinler ve uygulama içi şemalar YKS2027 Arena için özgün hazırlanmıştır.</small></section>',
      '<section class="lesson-section exam-guide-page"><span class="eyebrow">5 • SORU TİPLERİ VE ÇELDİRİCİLER</span>'+renderExamGuide(profile)+'</section>'
    ];
    if(questionSet.length)pages.push('<section class="lesson-section exam-lab-page"><span class="eyebrow">6 • SEVİYELİ SORU LABORATUVARI</span>'+renderQuestionLab(questionSet)+'</section>');
    return pages;
  }
  function renderReader(){
    const course=courseData().courses[readerState.courseIndex];
    const current=course&&course.units[readerState.unitIndex];
    if(!current)return;
    const pages=lessonPages(course,current);
    if(readerState.page>=pages.length)readerState.page=pages.length-1;
    document.getElementById('readerProgress').textContent='SAYFA '+(readerState.page+1)+' / '+pages.length+' • '+course.title;
    document.getElementById('readerTitle').textContent=current.title;
    document.getElementById('readerBody').innerHTML=pages[readerState.page];
    const next=document.getElementById('readerNext');
    next.textContent=readerState.page===pages.length-1?'ÜNİTELERE DÖN':'SONRAKİ SAYFA';
  }
  function requestNextReaderPage(){
    const course=courseData().courses[readerState.courseIndex];
    const current=course&&course.units[readerState.unitIndex];
    if(!current)return;
    const pages=lessonPages(course,current);
    if(readerState.page>=pages.length-1){showCourse(readerState.courseIndex);return;}
    const proceed=function(){readerState.page+=1;renderReader();document.querySelector('.main-content').scrollTop=0;};
    if(hasUnlimitedAccess()){proceed();return;}
    document.getElementById('lessonChoiceText').textContent='Sonraki ders sayfasına geçmek için ödüllü reklamı tamamen izle veya Premium üyeliği görüntüle.';
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

  document.addEventListener('visibilitychange',function(){if(!document.hidden)syncTrustedClock().then(function(){renderUsage();});});
  registerIncomingReferral();
  renderCourses();
  renderProfile();
  renderUsage();
  syncTrustedClock().then(function(ok){
    renderUsage();
    const state=dailyState();
    if(state.locked){
      if(ok)setClockStatus('Sunucu saati doğrulandı. Cihaz saatini değiştirmek kilidi kaldırmaz.','verified');
      else setClockStatus('Sunucu zamanı doğrulanamadı. Güvenlik nedeniyle kilit açık kalır; internet bağlantını kontrol et.','failed');
    }
  });
  setInterval(renderUsage,60000);
  setInterval(function(){syncTrustedClock().then(function(){renderUsage();});},CLOCK_REFRESH_MS);
  window.YKS2027_ENGAGEMENT=Object.freeze({trustedNow:accessNow,clockVerified:function(){return trustedClockVerified;},hasUnlimitedAccess:hasUnlimitedAccess,buildId:BUILD_ID});
})();
