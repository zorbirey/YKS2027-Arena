(()=>{
  'use strict';
  const BUILD_ID='20260824-09',KEY='yks2027-review-prompt-v1',THREE_DAYS=3*86400000,LATER=120*86400000,REWARD_KEY='yks2027-achievement-v1';
  function state(){try{return Object.assign({firstUseAt:Date.now(),completedSessions:0,promptCount:0,lastPromptAt:0,dismissedForever:false,solvedIds:[]},JSON.parse(localStorage.getItem(KEY)||'{}'))}catch{return {firstUseAt:Date.now(),completedSessions:0,promptCount:0,lastPromptAt:0,dismissedForever:false,solvedIds:[]}}}
  function save(value){value.buildId=BUILD_ID;localStorage.setItem(KEY,JSON.stringify(value))}
  function reviewUrl(){const value=String(window.YKS2027_STORE_CONFIG?.googlePlayReviewUrl||'').trim();try{const url=new URL(value);return url.protocol==='https:'&&url.hostname==='play.google.com'&&url.pathname==='/store/apps/details'&&url.searchParams.get('id')?url.toString():''}catch{return ''}}
  function answered(){try{return Number(JSON.parse(localStorage.getItem('yks2027-simple-stats')||'{}').answered)||0}catch{return 0}}
  function eligible(value){const now=Date.now();return Boolean(reviewUrl())&&!value.dismissedForever&&value.promptCount<2&&value.completedSessions>=3&&answered()>=50&&now-Number(value.firstUseAt||now)>=THREE_DAYS&&(!value.lastPromptAt||now-value.lastPromptAt>=LATER)}
  function show(){const value=state();if(!eligible(value)||document.querySelector('.settings-modal.show'))return false;const modal=document.getElementById('reviewPromptModal');if(!modal)return false;value.promptCount++;value.lastPromptAt=Date.now();save(value);modal.classList.add('show');return true}
  function recordSession(answers){const value=state();value.completedSessions++;(answers||[]).forEach(item=>{const id=item.q?.id;if(id&&!value.solvedIds.includes(id))value.solvedIds.push(id)});value.solvedIds=value.solvedIds.slice(-2000);save(value);const clock=window.YKS2027_ENGAGEMENT;if(value.solvedIds.length>=100&&clock?.clockVerified?.()){const reward=JSON.parse(localStorage.getItem(REWARD_KEY)||'{}');if(!reward.granted){const now=clock.trustedNow();localStorage.setItem(REWARD_KEY,JSON.stringify({granted:true,grantedAt:new Date(now).toISOString(),adFreeUntil:new Date(now+8*3600000).toISOString()}));window.dispatchEvent(new CustomEvent('yksarena:achievement-reward'))}}setTimeout(show,1200)}
  function hide(){document.getElementById('reviewPromptModal')?.classList.remove('show')}
  function open(){const url=reviewUrl();if(!url)return;hide();window.open(url,'_blank','noopener,noreferrer')}
  function never(){const value=state();value.dismissedForever=true;save(value);hide()}
  function init(){const value=state();if(!value.firstUseAt)value.firstUseAt=Date.now();save(value);document.getElementById('reviewOpenPlay')?.addEventListener('click',open);document.getElementById('reviewAskLater')?.addEventListener('click',hide);document.getElementById('reviewNeverAsk')?.addEventListener('click',never);window.addEventListener('yksarena:quiz-finished',event=>recordSession(event.detail?.answers));document.getElementById('enterBtn')?.addEventListener('click',()=>setTimeout(show,1500))}
  window.YKS2027_REVIEW_PROMPT={buildId:BUILD_ID,recordSession,maybeShow:show,configuredReviewUrl:reviewUrl,getState:state};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
