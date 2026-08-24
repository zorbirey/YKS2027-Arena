(() => {
  'use strict';
  let deferredPrompt=null;
  const installBtn=document.getElementById('pwaInstall');
  const statusEl=document.getElementById('pwaStatus');

  function updateStatus(){
    if(!statusEl)return;
    statusEl.textContent=navigator.onLine?'Çevrimiçi':'Çevrimdışı';
    statusEl.dataset.online=navigator.onLine?'1':'0';
  }
  window.addEventListener('online',updateStatus);
  window.addEventListener('offline',updateStatus);
  updateStatus();

  window.addEventListener('beforeinstallprompt',e=>{
    e.preventDefault();
    deferredPrompt=e;
    if(installBtn)installBtn.hidden=false;
  });

  if(installBtn){
    installBtn.addEventListener('click',async()=>{
      if(!deferredPrompt)return;
      deferredPrompt.prompt();
      try{await deferredPrompt.userChoice}catch(_){ }
      deferredPrompt=null;
      installBtn.hidden=true;
    });
  }

  window.addEventListener('appinstalled',()=>{
    deferredPrompt=null;
    if(installBtn)installBtn.hidden=true;
  });

  if('serviceWorker' in navigator && location.protocol!=='file:'){
    window.addEventListener('load',()=>{
      navigator.serviceWorker.register('./service-worker.js?v=20260824-09',{scope:'./',updateViaCache:'none'})
        .then(reg=>{
          reg.update().catch(()=>{});
          if(reg.waiting)reg.waiting.postMessage('SKIP_WAITING');
        })
        .catch(()=>{});
    },{once:true});
  }
})();