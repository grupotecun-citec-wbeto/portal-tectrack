import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { precacheAndRoute } from 'workbox-precaching';


if (process.env.NODE_ENV === 'production') {
  // Declara self.__WB_MANIFEST (inyectado automáticamente por Workbox)
  precacheAndRoute(self.__WB_MANIFEST);
}else{
  precacheAndRoute(self.__WB_MANIFEST);
}


registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);



// Cache JavaScript files with StaleWhileRevalidate strategy
registerRoute(
    ({ request }) => request.destination === 'script',
    new StaleWhileRevalidate({
      cacheName: 'js-cache',
      plugins: [
        new ExpirationPlugin({   
  
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
);

// Cache documents and navigate with StaleWhileRevalidate strategy
registerRoute(
    ({ request }) => request.destination === 'document' && request.mode === 'navigate',
    new StaleWhileRevalidate({
      cacheName: 'pages',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 20,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
        }),
      ],
    })
);

registerRoute(
    ({ url }) => url.origin === 'https://sql.js.org' && url.pathname.startsWith('/dist/'), // Target URLs from /dist directory
    new StaleWhileRevalidate({
      cacheName: 'sqljs-cache', // Dedicated cache name
      plugins: [
        new ExpirationPlugin({
          maxEntries: 60, // Cache a maximum of 60 entries
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
      ],
    })
);

// Other routes and strategies can be added here