// Service Worker for Performance Caching
const CACHE_NAME = 'codeacademy-pro-v1';
const STATIC_CACHE = 'static-v1';
const API_CACHE = 'api-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== API_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip service worker for ALL Vite dev server files (development)
  // This includes src/, node_modules/, @vite/, and HMR files
  if (url.pathname.startsWith('/src/') || 
      url.pathname.startsWith('/@') ||
      url.pathname.startsWith('/node_modules/') ||
      url.hostname === 'localhost' ||
      url.hostname === '127.0.0.1') {
    return; // Let browser handle it normally - don't intercept
  }

  // Skip service worker for HMR (Hot Module Replacement) - any file with query params
  if (url.search && (url.searchParams.has('import') || url.searchParams.has('t') || url.searchParams.has('v'))) {
    return; // Let browser handle it normally
  }

  // Cache API responses (stale-while-revalidate)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(API_CACHE).then((cache) => {
        return fetch(request)
          .then((response) => {
            // Cache successful GET requests
            if (request.method === 'GET' && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => {
            // Return cached response if network fails
            return cache.match(request);
          });
      })
    );
    return;
  }

  // Cache static assets (cache-first) - only for production assets
  if (request.method === 'GET' && (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/) ||
    url.pathname.startsWith('/assets/')
  )) {
    // Skip if it's a Vite dev server file
    if (url.pathname.startsWith('/src/') || url.pathname.startsWith('/@')) {
      return;
    }
    
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        }).catch((error) => {
          // If fetch fails, return error (don't cache errors)
          console.error('Service Worker fetch error:', error);
          throw error;
        });
      })
    );
    return;
  }

  // Network-first for HTML pages
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

