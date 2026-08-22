(() => {
  'use strict';
  function lockReportsForNewSession(){
    if(typeof window.startSession!=='function'||window.startSession.__arenaPrivacyWrapped)return;
    const original=window.startSession;
    const wrapped=function(){
      const review=document.getElementById('review');
      if(review){
        review.dataset.unlocked='0';
        review.innerHTML='<div class="small">Tur tamamlandığında cevapların burada gösterilir.</div>';
      }
      return original.apply(this,arguments);
    };
    wrapped.__arenaPrivacyWrapped=true;
    window.startSession=wrapped;
  }
  lockReportsForNewSession();
  window.addEventListener('DOMContentLoaded',lockReportsForNewSession,{once:true});
})();