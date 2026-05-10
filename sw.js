const CACHE_NAME = 'life-os-pwa-v8';

const APP_ASSETS = [
  './manifest.webmanifest',
  './assets/icons/life-os-icon.svg',
  './assets/icons/life-os-icon-180.png',
  './assets/icons/life-os-icon-192.png',
  './assets/icons/life-os-icon-512.png',
  './src/data.jsx',
  './src/v2/theme.jsx',
  './src/v2/data.jsx',
  './src/v2/icons.jsx',
  './src/v2/primitives.jsx',
  './src/v2/modals.jsx',
  './src/v2/shell.jsx',
  './src/v2/home.jsx',
  './src/v2/tasks.jsx',
  './src/v2/finance.jsx',
  './src/v2/family.jsx',
  './src/v2/learn.jsx',
  './src/v2/mobile.jsx',
  './src/v2/tweaks.jsx',
  './src/v2/app.jsx',
];

const RUNTIME_ASSETS = [
  'https://unpkg.com/react@18.3.1/umd/react.development.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    cacheAssets().then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.map((key) => key !== CACHE_NAME ? caches.delete(key) : undefined)
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  // CDN assets — cache first
  if (RUNTIME_ASSETS.includes(event.request.url)) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetchAndCache(event.request))
    );
    return;
  }

  if (requestUrl.origin !== self.location.origin) return;

  // Navigation — always network first, fall back to cached index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Everything else — cache first, fall back to network
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetchAndCache(event.request))
  );
});

function fetchAndCache(request) {
  return fetch(request).then((response) => {
    if (response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
    }
    return response;
  });
}

// Cache each asset individually — one failure won't abort the whole install
function cacheAssets() {
  return caches.open(CACHE_NAME).then((cache) =>
    Promise.allSettled([
      ...APP_ASSETS.map((url) =>
        fetch(url).then((r) => { if (r.ok) return cache.put(url, r); })
      ),
      ...RUNTIME_ASSETS.map((url) =>
        fetch(url, { mode: 'cors' }).then((r) => { if (r.ok) return cache.put(url, r); })
      ),
    ])
  );
}
