const CACHE_NAME='yks-2027-arena-pwa-v1.0-zeus-lgs-verified';
const APP_SHELL=[
  './','./index.html','./styles.css','./yks-v09-zeus.css?v=10','./data.js','./app.js','./privacy-fix.js','./pwa.js?v=10','./manifest.webmanifest','./assets/icon.svg'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET') return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy));
      return response;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{
    if(!response) return response;
    // Aynı origin dosyalarını cache'le; harici doğrulanmış Zeus görseli ağdan güncel gelsin.
    if(response.status===200 && response.type!=='opaque'){
      const copy=response.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));
    }
    return response;
  })));
});
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting();});
