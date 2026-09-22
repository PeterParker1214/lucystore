/* Offline cache. Bump V whenever index.html or vendor/ changes. */
var V = 'lucystore-v16';
var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './vendor/zxing.min.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/icon-180.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(V).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.map(function (k) { return k === V ? null : caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET') return;

  // Pages: try the network so updates land, fall back to the cached app offline.
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).catch(function () { return caches.match('./index.html'); }));
    return;
  }

  // Everything else: cache first, then network, and keep what we fetch.
  e.respondWith(caches.match(r).then(function (hit) {
    return hit || fetch(r).then(function (res) {
      if (res && res.ok && res.type === 'basic') {
        var copy = res.clone();
        caches.open(V).then(function (c) { c.put(r, copy); });
      }
      return res;
    });
  }));
});
