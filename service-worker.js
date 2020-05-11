const cacheName = 'criptosearch';

const staticAssets = [
    './',
    './app.js',
    './styles.css',
    './neterr.json',
    './images/fetch-dog.jpg'
];

self.addEventListener('install', async function() {
    const cache = await caches.open(cacheName);
    cache.addAll(staticAssets);
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    if (url.origin === location.origin) {
        event.respondWith(prioritizeCache(request));
    } else {
        event.respondWith(prioritizeNetwork(request));
    }
});

async function prioritizeCache(request) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || fetch(request);
}

async function prioritizeNetwork(request) {
    const dynamicCache = await caches.open('dynamic-cache');
    try {
        const networkResponse = await fetch(request);
        if (request.method != "POST") {
            dynamicCache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (err) {
        const cachedResponse = await dynamicCache.match(request);
        return cachedResponse || await caches.match('./neterr.json');
    }
}