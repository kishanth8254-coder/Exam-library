const CACHE_NAME = 'exam-library-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/firebase-applet-config.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Return from cache
        }
        // If not in cache, fetch from network
        return fetch(event.request).catch(() => {
          // Fallback if network fails and resource is not in cache
          if (event.request.mode === 'navigate') {
             return caches.match('/index.html');
          }
        });
      })
  );
});
