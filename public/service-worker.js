self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  clients.claim();
});

self.addEventListener("fetch", () => {
  // Aurora's PWA does not need offline caching
  // This keeps everything simple & clean.
});
