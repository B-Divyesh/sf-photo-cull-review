const CACHE = 'photo-cull-shell-v8';
const SHELL = [
  '/', '/index.html', '/offline.html', '/404.html', '/manifest.webmanifest', '/assets/app-v7.js', '/assets/app-v7.css',
  '/icons/icon.svg', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/icon-maskable-512.png',
  '/assets/newsreader-latin.woff2', '/assets/archive-room.webp', '/assets/archive-room-mobile.webp',
  '/samples/picnic-wide.svg', '/samples/sparklers-close.svg', '/samples/sparklers-wide.svg',
  '/privacy/', '/terms/'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.hostname.endsWith('sociobot.in') && url.pathname.includes('/api/')) {
    event.respondWith(fetch(request).catch(() => new Response(JSON.stringify({ valid: false, reason: 'offline' }), { status: 503, headers: { 'content-type': 'application/json' } })));
    return;
  }
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then((response) => {
      const copy = response.clone(); caches.open(CACHE).then((cache) => cache.put(request, copy)); return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match('/index.html')) || (await caches.match('/offline.html'))));
    return;
  }
  if (url.origin === self.location.origin) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) { const copy = response.clone(); caches.open(CACHE).then((cache) => cache.put(request, copy)); }
      return response;
    })));
  }
});
