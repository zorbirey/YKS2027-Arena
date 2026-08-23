const CACHE_NAME='yks2027-arena-core2';
const ASSETS=[
  './',
  './index.html',
  './styles.css?v=core2',
  './app.js?v=core2',
  './manifest.webmanifest?v=core2',
  './assets/icon.svg',
  './assets/zeus-hero.svg',
  './assets/zeus-home.svg',
  './assets/zeus-coach.svg',
  './assets/zeus-notes.svg',
  './assets/zeus-quiz.svg',
  './assets/zeus-reports.svg'
];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE_NAME).then(function(c){return c.addAll(ASSETS);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(k){return k!==CACHE_NAME;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){if(e.request.method!=='GET')return;if(e.request.mode==='navigate'){e.respondWith(fetch(e.request,{cache:'no-store'}).then(function(res){const copy=res.clone();caches.open(CACHE_NAME).then(function(c){c.put('./index.html',copy);});return res;}).catch(function(){return caches.match('./index.html');}));return;}e.respondWith(caches.match(e.request).then(function(cached){return cached||fetch(e.request).then(function(res){if(res&&res.ok){const copy=res.clone();caches.open(CACHE_NAME).then(function(c){c.put(e.request,copy);});}return res;});}));});