const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE =[
    '/',
    '/index.html',
    '/styles.css',
    '/db.js'
];

//install
self.addEventListener("install", fucntion (evt) {
    //pre cache transaction data
    evt.waitUntil(
        caches.open(DATA_CACHE_NAME).then((cache) => cache.add("/api/transaction"))
        );
       //pre cache all static assets
        evt.waitUntil(
            caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
        );

         //tell browswer to activate this service worker immediately once it finished installing
    )
})