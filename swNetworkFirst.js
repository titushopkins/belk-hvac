self.addEventListener('fetch', (event) => {
    if (event.request.method === 'GET' && event.request.url.startsWith('http')) {
        // Check if the request URL contains '/opportunities'
        if (event.request.url.includes('/opportunities') || event.request.url.includes('/rhdiStats')) {
            // If it does, respond with the network request directly without caching
            event.respondWith(fetch(event.request));
        } else {
            event.respondWith(
                caches.match(event.request).then((cachedResponse) => {
                    const fetchPromise = fetch(event.request).then((networkResponse) => {
                        // Clone the network response before consuming it
                        const clonedResponse = networkResponse.clone();

                        // If the network request is successful, update the cache
                        caches.open('user-data-cache').then((cache) => {
                            cache.put(event.request, clonedResponse);
                        });
                        return networkResponse;
                    }).catch(() => {
                        // If the network request fails, return the cached response (if available)
                        return cachedResponse;
                    });

                    // Return the cached response immediately if available, or the network response if not
                    return cachedResponse || fetchPromise;
                })
            );
        }
    }
});
