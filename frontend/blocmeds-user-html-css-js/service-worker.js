self.addEventListener('install', (e) => {
  console.log('Service Worker: Installing');
  e.waitUntil(
    caches.open('blocmeds').then(cache => {
      console.log('Service Worker: Caching files');
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/script.js',
        '/manifest.json',
        '/icon-192.png',
        '/icon-512.png'
      ]);
    })
  );
});

self.addEventListener('activate', (e) => {
  console.log('Service Worker: Activated');
});

self.addEventListener('fetch', (e) => {
  console.log('Service Worker: Fetching', e.request.url);
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});