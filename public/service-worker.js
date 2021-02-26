const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE =[
    '/',
    '/index.html',
    '/styles.css',
    '/db.js'
];

//install
self.addEventListener("install", function (evt) {
    //pre cache transaction data
    evt.waitUntil(
        caches.open(DATA_CACHE_NAME).then((cache) => cache.add("/api/transaction"))
        );
       //pre cache all static assets
        evt.waitUntil(
            caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
        );

         //tell browswer to activate this service worker immediately once it finished installing
         self.skipWaiting();
        });

        self.addEventListener("activate", function(evt) {
            evt.waitUntil(
                caches.keys().then(keyList => {
                    return Promise.all(
                        keyList.map(key => {
                            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                                console.log("Removing old cache data", key);
                                return caches.delete(key);
                            }
                        })
                    );
                })
            );
            self.clients.claim();
});

//fetch
self.addEventListener("fetch", function (evt) {
    //cache handle requests here
    if (evt.request.url.includes("/api/")) {
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request)
                .then(response => {
                    if (response.status === 200) {
                        cache.put(evt.request.url, response.clone());
                    }
                    return response;
                })
                .catch(err => {
                    return cache.match(evt.request);
                });
            }).catch(err => console.log(err))
        );
        return;
    }

    evt.respondWith(
        caches.match(evt.request).then(function (response) {
            return response || fetch(evt.request);
        })
    );
});