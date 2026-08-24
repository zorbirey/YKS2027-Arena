(function(){
  'use strict';
  const BUILD_ID='20260824-09';
  const STATE_KEY='yks2027-review-prompt-v1';
  const ACTIVE_TIME_REQUIRED_MS=15*60*1000;
  const MEANINGFUL_ACTIONS_REQUIRED=3;
  const ASK_LATER_DELAY_MS=60*24*60*60*1000;
  const REVIEW_OPENED_DELAY_MS=365*24*60*60*1000;
  const TICK_MS=5000;
  const ACTION_COOLDOWN_MS=750;
  const ACTION_SELECTOR='[data-choice],[data-unit-index],#readerNext,#saveQuestionTarget,#settingsSaveTarget,[data-quiz],#applyRestDay';
  let sessionEntered=false;
  let lastTick=monotonicNow();

  function monotonicNow(){return window.performance&&typeof window.performance.now==='function'?window.performance.now():Date.now();}
  function parseState(){
    try{return Object.assign({activeMs:0,actionCount:0,lastActionAt:0,lastPromptAt:0,nextEligibleAt:0,reviewOpenedAt:0,dismissedForever:false},JSON.parse(localStorage.getItem(STATE_KEY)||'{}'));}
    catch(_){return {activeMs:0,actionCount:0,lastActionAt:0,lastPromptAt:0,nextEligibleAt:0,reviewOpenedAt:0,dismissedForever:false};}
  }
  function saveState(state){state.buildId=BUILD_ID;localStorage.setItem(STATE_KEY,JSON.stringify(state));}
  function configuredReviewUrl(){
    const config=window.YKS2027_STORE_CONFIG||{};
    const value=String(config.googlePlayReviewUrl||'').trim();
    if(!value)return '';
    try{
      const url=new URL(value);
      if(url.protocol!=='https:'||url.hostname!=='play.google.com'||url.pathname!=='/store/apps/details'||!url.searchParams.get('id'))return '';
      return url.toString();
    }catch(_){return '';}
  }
  function modal(){return document.getElementById('reviewPromptModal');}
  function hidePrompt(){const element=modal();if(element)element.classList.remove('show');}
  function showPrompt(){
    const element=modal();
    if(!element||element.classList.contains('show'))return false;
    element.classList.add('show');
    const button=document.getElementById('reviewOpenPlay');
    if(button)button.focus();
    return true;
  }
  function anotherModalOpen(){
    if(typeof document.querySelector!=='function')return false;
    const openModal=document.querySelector('.settings-modal.show');
    return Boolean(openModal&&openModal.id!=='reviewPromptModal');
  }
  function eligible(state){
    return sessionEntered&&!document.hidden&&!anotherModalOpen()&&!state.dismissedForever&&configuredReviewUrl()&&state.activeMs>=ACTIVE_TIME_REQUIRED_MS&&state.actionCount>=MEANINGFUL_ACTIONS_REQUIRED&&Date.now()>=Number(state.nextEligibleAt||0);
  }
  function maybeShow(){
    const state=parseState();
    if(!eligible(state))return false;
    if(!showPrompt())return false;
    state.lastPromptAt=Date.now();
    state.nextEligibleAt=state.lastPromptAt+ASK_LATER_DELAY_MS;
    saveState(state);
    return true;
  }
  function recordMeaningfulAction(){
    if(!sessionEntered)return;
    const state=parseState();
    const current=Date.now();
    if(current-Number(state.lastActionAt||0)<ACTION_COOLDOWN_MS)return;
    state.lastActionAt=current;
    state.actionCount=Math.min(1000,Math.max(0,Number(state.actionCount)||0)+1);
    saveState(state);
    maybeShow();
  }
  function startSession(){sessionEntered=true;lastTick=monotonicNow();maybeShow();}
  function tick(){
    const current=monotonicNow();
    const elapsed=Math.max(0,Math.min(TICK_MS*2,current-lastTick));
    lastTick=current;
    if(!sessionEntered||document.hidden)return;
    const state=parseState();
    state.activeMs=Math.min(1000*60*60*1000,Math.max(0,Number(state.activeMs)||0)+elapsed);
    saveState(state);
    maybeShow();
  }
  function openPlayReview(){
    const url=configuredReviewUrl();
    if(!url)return false;
    const state=parseState();
    state.reviewOpenedAt=Date.now();
    state.nextEligibleAt=state.reviewOpenedAt+REVIEW_OPENED_DELAY_MS;
    saveState(state);
    hidePrompt();
    window.open(url,'_blank','noopener,noreferrer');
    return true;
  }
  function askLater(){hidePrompt();}
  function dismissForever(){const state=parseState();state.dismissedForever=true;saveState(state);hidePrompt();}

  const enterButton=document.getElementById('enterBtn');
  if(enterButton)enterButton.addEventListener('click',startSession);
  document.addEventListener('click',function(event){
    const target=event.target&&typeof event.target.closest==='function'?event.target.closest(ACTION_SELECTOR):null;
    if(target)recordMeaningfulAction();
  });
  document.addEventListener('visibilitychange',function(){lastTick=monotonicNow();});
  const reviewButton=document.getElementById('reviewOpenPlay');
  const laterButton=document.getElementById('reviewAskLater');
  const neverButton=document.getElementById('reviewNeverAsk');
  if(reviewButton)reviewButton.addEventListener('click',openPlayReview);
  if(laterButton)laterButton.addEventListener('click',askLater);
  if(neverButton)neverButton.addEventListener('click',dismissForever);
  setInterval(tick,TICK_MS);

  window.YKS2027_REVIEW_PROMPT={
    buildId:BUILD_ID,
    startSession:startSession,
    recordMeaningfulAction:recordMeaningfulAction,
    maybeShow:maybeShow,
    openPlayReview:openPlayReview,
    configuredReviewUrl:configuredReviewUrl,
    getState:parseState
  };
})();
