const CACHE_NAME = 'yks2027-arena-20260824-01';
const APP_SHELL = [
  './',
  './index.html',
  './styles.css?v=20260824-01',
  './reports-v1.css?v=20260824-01',
  './engagement-v1.css?v=20260824-01',
  './app.js?v=20260824-01',
  './courses-v1.js?v=20260824-01',
  './engagement-v1.js?v=20260824-01',
  './manifest.webmanifest?v=20260824-01',
  './data/verified/mixed_core_v15_50.json?v=20260824-01',
  './assets/visual-v1/icon-192-v1.png',
  './assets/visual-v1/icon-512-v1.png',
  './assets/visual-v1/icon-maskable-512-v1.png',
  './assets/visual-v1/entry-mobile-v1.webp',
  './assets/visual-v1/home-hero-v1.webp',
  './assets/visual-v1/section-hero-v1.webp',
  './assets/visual-v1/zeus-watermark-v1.webp'
];
self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function (cache) { return cache.addAll(APP_SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) { return key !== CACHE_NAME; }).map(function (key) { return caches.delete(key); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(function (response) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(function (cache) { cache.put('./index.html', copy); });
      return response;
    }).catch(function () { return caches.match('./index.html'); }));
    return;
  }
  event.respondWith(caches.match(event.request).then(function (cached) {
    return cached || fetch(event.request).then(function (response) {
      if (response && response.ok && new URL(event.request.url).origin === self.location.origin) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
      }
      return response;
    });
  }));
});
