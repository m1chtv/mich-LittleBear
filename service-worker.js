const CACHE_NAME = "kherskoochooloo-v12";

const urlsToCache = [
  "/",
  "/index.html",
  "/assets/mich.css",
  "/assets/bootstrap.rtl.min.css",
  "/assets/bootstrap-icons.css",
  "/assets/notyf.min.css",
  "/assets/mich.js",
  "/assets/chart.js",
  "/assets/notyf.min.js",
  "/manifest.json",
  "/assets/zizi.gif",
  "/assets/zizi.png",
  "/assets/zizi-192.png",
  "/assets/zizi-512.png",
  "/fonts/FontHaq1.woff2",
  "/fonts/FontHaq4.woff2"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        urlsToCache.map(url => {
          return fetch(url)
            .then(response => {
              if (!response.ok) throw new Error(`${url} failed`);
              return cache.put(url, response.clone());
            })
            .catch(err => console.warn("Cache failed for", url, err));
        })
      );
    })
  );
  self.skipWaiting();
});


self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            event.request.method === "GET"
          ) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return cachedResponse || new Response("آفلاینی 📴", {
            status: 503,
            statusText: "Offline"
          });
        });

      return cachedResponse || fetchPromise;
    })
  );
});
