const CACHE_NAME='yks-2027-arena-final-v13';
const APP_SHELL=[
  './',
  './index.html',
  './styles.css?v=13',
  './yks-v09-zeus.css?v=13',
  './pwa-shell-v12.css?v=13',
  './final-pwa-v13.css?v=13',
  './data.js?v=13',
  './app.js?v=13',
  './privacy-fix.js?v=13',
  './pwa.js?v=13',
  './manifest.webmanifest?v=13',
  './assets/icon.svg',
  './assets/zeus-cover-inline.webp',
  './assets/arena-cover.webp',
  './assets/zeus-real-v09.webp',
  './assets/zeus-watermark-inline.webp',
  './assets/zeus-watermark-v09.webp'
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;

  if(req.mode==='navigate'){
    event.respondWith(
      fetch(req,{cache:'no-store'}).then(res=>{
        const copy=res.clone();
        caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy));
        return res;
      }).catch(()=>caches.match('./index.html'))
    );
    return;
  }

  const url=new URL(req.url);
  const isCore=/\.(?:js|css|webmanifest)$/i.test(url.pathname);
  if(isCore){
    event.respondWith(
      fetch(req,{cache:'no-store'}).then(res=>{
        if(res&&res.ok){const copy=res.clone();caches.open(CACHE_NAME).then(cache=>cache.put(req,copy));}
        return res;
      }).catch(()=>caches.match(req))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached=>cached||fetch(req).then(res=>{
      if(res&&res.ok){const copy=res.clone();caches.open(CACHE_NAME).then(cache=>cache.put(req,copy));}
      return res;
    }))
  );
});

self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting();});