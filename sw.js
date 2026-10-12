// Service worker — l'app s'ouvre même sans réseau (les données viennent du cache localStorage)
const CACHE = "hk-patron-v14";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon.png", "./logo.png", "./logo-full.png", "./logo-mark.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  // Jamais de cache sur les appels Make (POST d'envoi, GET des données)
  if (e.request.method !== "GET") return;
  if (e.request.url.indexOf("hook.eu1.make.com") > -1) return;
  if (ASSETS.some((a) => e.request.url.endsWith(a.replace("./", "")))) {
    e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
  }
});
