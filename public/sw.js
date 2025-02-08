/**
 * For now just enough to make the app installable.
 * app is so small cache is not needed I'd say and it just complicates debugging.
 */

const CACHE_NAME = 'gmaps-exporter-v1';

// const urlsToCache = [
//   '/',
//   '/index.html',
//   '/manifest.json',
//   '/src/main.tsx',
//   '/src/App.tsx',
//   '/src/index.css'
// ];

self.addEventListener('install', (event) => {
  // event.waitUntil(
  //   caches.open(CACHE_NAME)
  //     .then((cache) => cache.addAll(urlsToCache))
  // );
});

self.addEventListener('activate', (event) => {
  // ...
});

self.addEventListener(
  'fetch',
  (event) => {
    // if (event.request.url.includes('/share-target')) {
    //   event.respondWith(
    //     Response.redirect('/?url=' + encodeURIComponent(event.request.url))
    //   );
    //   return;
    // }
    // event.respondWith(
    //   caches.match(event.request)
    //     .then((response) => response || fetch(event.request))
    // );
  },
  { once: true }
); // yes, act as a dummy for now!
