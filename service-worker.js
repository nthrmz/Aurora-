const CACHE_NAME = 'aurora-cache-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/lecturas.html',
  '/carrito.html',
  '/foro.html',
  '/agenda.html',
  '/sobre.html',
  '/contacto.html',
  '/offline.html',
  '/assets/css/estilos.css',
  '/assets/js/main.js',
  '/assets/js/carrito.js',
  '/assets/js/foro.js',
  '/assets/js/agenda.js',
  '/assets/js/home.js',
  '/assets/js/lecturas.js',
  '/assets/img/logo-aurora.svg',
  '/assets/img/card-moon.svg',
  '/assets/img/card-star.svg',
  '/assets/img/card-sun.svg',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CORE_ASSETS).catch(err => {
        console.error('Error al cachear assets:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.status === 200 && response.type === 'basic') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then(response => {
            return response || caches.match('/offline.html');
          });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) {
        return cached;
      }
      return fetch(request).then(response => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseClone);
        });
        return response;
      });
    }).catch(() => {
      return new Response('Offline - No hay conexión', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'text/plain'
        })
      });
    })
  );
});
