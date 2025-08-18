self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('wa7edkora-v1').then((cache) => cache.addAll([
      './',
      './index.html',
      './style.css',
      './script.js',
      './assets/images/logo.png'
    ]))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});