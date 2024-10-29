const CACHE_NAME = 'gestao-viagens-cache-v1';
const urlsToCache = [
    '/',
    '/css/styles.css',
    '/js/app.js',
    '/manifest.json',
    '/image/budget.png',
    '/image/favicon.ico'
];

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('../../service-worker.js').then(registration => {
            console.log('Service Worker registrado com sucesso:', registration);
        }).catch(error => {
            console.log('Falha ao registrar o Service Worker:', error);
        });
    });
}

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Erro ao abrir o cache:', error);
            })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.url.startsWith('http')) { // Certifique-se de que a solicitação é HTTP/HTTPS
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request).then(fetchResponse => {
                        return caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, fetchResponse.clone());
                            return fetchResponse;
                        });
                    });
                })
                .catch(error => {
                    console.error('Erro na solicitação fetch:', error);
                    throw error;
                })
        );
    }
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).catch(error => {
            console.error('Erro ao ativar o service worker:', error);
        })
    );
});