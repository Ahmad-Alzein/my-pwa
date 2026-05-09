const CACHE_NAME = 'life-os-pwa-v7';

const APP_ASSETS = [
  './',
  './index.html',
  './Life OS v2.html',
  './manifest.webmanifest',
  './assets/icons/life-os-icon.svg',
  './assets/icons/life-os-icon-180.png',
  './assets/icons/life-os-icon-192.png',
  './assets/icons/life-os-icon-512.png',
  './src/data.jsx',
  './src/frames/ios-frame.jsx',
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
    cacheAppAssets().then(cacheRuntimeAssets).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
        return undefined;
      })))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  if (event.request.method !== 'GET') return;

  if (RUNTIME_ASSETS.includes(event.request.url)) {
    event.respondWith(
      caches.match(event.request)
        .then((cached) => cached || fetch(event.request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        }))
    );
    return;
  }

  if (requestUrl.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cached) => cached || fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      }))
  );
});

function cacheAppAssets() {
  return caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS));
}

function cacheRuntimeAssets() {
  return caches.open(CACHE_NAME)
    .then((cache) => Promise.allSettled(
      RUNTIME_ASSETS.map((asset) => fetch(asset, { mode: 'cors' })
        .then((response) => {
          if (response.ok) return cache.put(asset, response);
          return undefined;
        }))
    ));
}
