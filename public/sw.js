/* AmericanAirlines service worker.
 *
 * Deliberately dependency-free and conservative:
 *  - the app shell is precached so the app opens offline
 *  - hashed build assets are served cache-first and refreshed in the background
 *  - cross-origin traffic (Supabase, analytics) is never intercepted, so data
 *    is always fetched live rather than served stale
 *
 * Bump VERSION to invalidate every cache after changing the strategy.
 */
const VERSION = "v1";
const SHELL_CACHE = `AmericanAirlines-shell-${VERSION}`;
const RUNTIME_CACHE = `AmericanAirlines-runtime-${VERSION}`;

const SHELL_ASSETS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      // Cache each entry independently: one missing file must not fail the
      // whole install, which would leave the app without a worker at all.
      .then((cache) => Promise.all(SHELL_ASSETS.map((asset) => cache.add(asset).catch(() => undefined))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== SHELL_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

const isCacheableAsset = (pathname) =>
  pathname.startsWith("/assets/") || pathname.startsWith("/icons/");

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never touch other origins: Supabase reads and analytics must stay live.
  if (url.origin !== self.location.origin) return;

  // SPA navigations: prefer fresh HTML, fall back to the cached shell offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put("/index.html", copy));
          return response;
        })
        .catch(() =>
          caches.match("/index.html").then((cached) => cached || caches.match("/"))
        )
    );
    return;
  }

  if (!isCacheableAsset(url.pathname)) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const fromNetwork = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || fromNetwork;
    })
  );
});
