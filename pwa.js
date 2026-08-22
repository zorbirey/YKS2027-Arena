(() => {
  'use strict';

  const WATERMARK = './assets/zeus-watermark-inline.webp?v=12';
  let deferredPrompt = null;

  function ensureWatermark(){
    const app=document.querySelector('.app');
    if(!app) return;
    let img=document.getElementById('globalZeusWatermark');
    if(!img){
      img=document.createElement('img');
      img.id='globalZeusWatermark';
      img.className='global-zeus-watermark';
      img.alt='';
      img.setAttribute('aria-hidden','true');
      app.prepend(img);
    }
    img.src=WATERMARK;
  }

  function standalone(){
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone===true;
  }

  function updateConnection(){
    const online=navigator.onLine;
    const status=document.getElementById('pwaStatus');
    const note=document.getElementById('offlineNote');
    if(status){
      status.textContent=online?'Çevrimiçi':'Çevrimdışı';
      status.classList.toggle('offline',!online);
    }
    if(note) note.classList.toggle('show',!online);
  }

  function installButton(){
    const btn=document.getElementById('pwaInstall');
    if(!btn) return;
    if(standalone()){
      btn.hidden=true;
      return;
    }
    btn.hidden=!deferredPrompt;
    btn.onclick=async()=>{
      if(!deferredPrompt) return;
      const prompt=deferredPrompt;
      deferredPrompt=null;
      btn.hidden=true;
      await prompt.prompt();
      try{ await prompt.userChoice; }catch(_){ }
    };
  }

  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    deferredPrompt=event;
    installButton();
  });
  window.addEventListener('appinstalled',()=>{
    deferredPrompt=null;
    installButton();
  });
  window.addEventListener('online',updateConnection);
  window.addEventListener('offline',updateConnection);

  ensureWatermark();
  updateConnection();
  installButton();
  window.addEventListener('DOMContentLoaded',()=>{
    ensureWatermark();
    updateConnection();
    installButton();
  },{once:true});

  if('serviceWorker' in navigator && location.protocol!=='file:'){
    window.addEventListener('load',()=>{
      navigator.serviceWorker.register('./service-worker.js?v=12')
        .then(reg=>{
          reg.update().catch(()=>{});
          if(reg.waiting) reg.waiting.postMessage('SKIP_WAITING');
          reg.addEventListener('updatefound',()=>{
            const worker=reg.installing;
            if(!worker) return;
            worker.addEventListener('statechange',()=>{
              if(worker.state==='installed' && navigator.serviceWorker.controller){
                worker.postMessage('SKIP_WAITING');
              }
            });
          });
        })
        .catch(()=>{});
    },{once:true});
  }

  window.YksArenaPWA={ensureWatermark,updateConnection,standalone};
})();