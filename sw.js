const CACHE = 'wa7edkora-v2';
const ASSETS = [
  './',
  './index.html',
  './matches.html',
  './news.html',
  './style.css',
  './script.js',
  './manifest.webmanifest',
  './assets/images/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // تجاوز ملفات البيانات لتُجلب دومًا من الشبكة أولاً
  if (url.pathname.includes('/assets/data/')) {
    event.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  // صفحات HTML: شبكة أولاً ثم تخزين النسخة
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // ملفات ثابتة أخرى: كاش أولاً ثم شبكة مع تخزين
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(cache => cache.put(req, clone));
        return res;
      });
    })
  );
});