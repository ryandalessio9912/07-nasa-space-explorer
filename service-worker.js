
const STATIC_CACHE = "nasa-static-v5";
const API_CACHE = "nasa-api-v1";

// Files needed to run the app offline
const APP_SHELL = [
    "./",
    "./index.html",
    "./style.css",
    "./manifest.json",
    "./js/script.js",
    "./js/dateRange.js",
    "./js/pwa.js",
    "./img/image1.png",
    "./img/image2.png",
    "./img/nasa-worm-logo.png"
];

// Install service worker and cache app files
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            return cache.addAll(APP_SHELL);
        })
    );

    self.skipWaiting();
});

// Remove outdated caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) =>
                        key !== STATIC_CACHE &&
                        key !== API_CACHE
                    )
                    .map((key) => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// Handle network requests
self.addEventListener("fetch", (event) => {
    const request = event.request;

    if (request.method !== "GET") return;

    const url = new URL(request.url);

    // NASA API: Network-first strategy
    if (
        url.hostname === "science.nasa.gov" &&
        url.pathname.includes("/wp-json/wp/v2/apod-basic")
    ) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.ok) {
                        const copy = response.clone();

                        event.waitUntil(
                            caches.open(API_CACHE).then(
                                (cache) => cache.put(request, copy)
                            )
                        );
                    }

                    return response;
                })
                .catch(async () => {
                    const cached = await caches.match(request);

                    return cached || new Response(
                        JSON.stringify([]),
                        {
                            status: 200,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    );
                })
        );

        return;
    }

    // App files: Cache-first strategy
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(request).then((cached) => {
                return cached || fetch(request);
            })
        );
    }
});
