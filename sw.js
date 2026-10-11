const CACHE_NAME = 'pocket-tracker-v1';

// app ku thevaiyana ella files um cache pannuvom
const FILES = [
  './',
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

// INSTALL: files ah cache la store pannum
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES)));
});

// FETCH: internet illaana cache la irundhu kaatum
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});