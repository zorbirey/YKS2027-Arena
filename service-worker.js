const CACHE_NAME='yks-2027-arena-pwa-v0.9-verified-zeus';
const APP_SHELL=[
  './','./index.html','./styles.css','./yks-v09-zeus.css','./data.js','./app.js','./privacy-fix.js','./manifest.webmanifest','./assets/icon.svg',
  './assets/arena-cover.webp','./assets/zeus-watermark.webp','./assets/zeus-real-v09.webp','./assets/zeus-watermark-v09.webp'
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
    if(!response||response.status!==200||response.type==='opaque') return response;
    const copy=response.clone();
    caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));
    return response;
  })));
});
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting();});
