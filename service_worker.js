const version = "1.0";
const cacheName = `TapTap-v${version}`;

self.addEventListener("install", (event) => {
  const files_to_cache = [
    "./favicon.ico",
    "./script.js",
    "./style.css",
    "./manifest.json",
  ];

  event.waitUntil(initCache(files_to_cache));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCache());
});

addEventListener("fetch", (event) => {
  event.respondWith(fetchFromCache(event.request));
});

async function initCache(files) {
  const cache = await caches.open(cacheName);
  cache.addAll(files);
}

async function deleteOldCache() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames
      .filter((name) => name != cacheName)
      .map((name) => caches.delete(name))
  );
}

async function fetchFromCache(request) {
  let response = await caches.match(request);
  if (!response) {
    response = await fetch(request);
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}
