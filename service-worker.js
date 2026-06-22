const CACHE_NAME = "ops-console-v1";
const ASSETS = ["./index.html", "./manifest.json", "./icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
});

// 앱 셸(정적 파일)만 캐시. Home Assistant API 호출은 항상 네트워크로 직접 요청.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const isAppShell = ASSETS.some((a) => url.pathname.endsWith(a.replace("./", "/")));
  if (!isAppShell) return; // API 등 외부 요청은 그대로 통과

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
