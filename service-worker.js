const CACHE_NAME = 'aurora-cache-v1';
const CORE_ASSETS = [
  './', './index.html', './lecturas.html', './carrito.html', './foro.html', './agenda.html', './sobre.html', './contacto.html',
  './assets/css/estilos.css', './assets/js/main.js', './assets/js/carrito.js', './assets/js/foro.js', './assets/js/agenda.js', './assets/js/home.js', './assets/js/lecturas.js',
  './assets/img/logo-aurora.svg', './assets/img/card-moon.svg', './assets/img/card-star.svg', './assets/img/card-sun.svg', './offline.html'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))));
});
self.addEventListener('fetch', event => {
  if(event.request.mode === 'navigate'){
    event.respondWith(fetch(event.request).catch(() => caches.match('./offline.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
