
//const pathBrowserify = require('path-browserify');
const WorkboxPlugin = require('workbox-webpack-plugin');
const path = require('path');


// Ya no se utilizar porque con solo power el service-worker.js empezo a funcionar y por eso me decia que yo llamaba dos veces
//const {GenerateSW} = require('workbox-webpack-plugin');



module.exports = function override(config) {
  if(process.env.NODE_ENV == "production"){
    config.devtool = false; // Desactiva los mapas de origen globalmente
  }
  // Agregar alias
 
    config.resolve.alias = {
      ...config.resolve.alias,
      "@components": path.resolve(__dirname, "src/components"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@db": path.resolve(__dirname, "src/db"),
      "@repositories": path.resolve(__dirname, "src/repositories"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@services": path.resolve(__dirname, "src/services"),
    };
  

    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs:false,
      "path": false,
      "crypto": false
    }
    // Agregar fallbacks para módulos de Node.js
    config.resolve.fallback = {
      fs: false, // No necesitas fs en el navegador
      path: require.resolve('path-browserify'), // Usar path-browserify como string
      crypto: require.resolve('crypto-browserify'), // Usar crypto-browserify
      buffer: require.resolve("buffer/"),
      stream: require.resolve("stream-browserify"),
      vm: require.resolve("vm-browserify"),
    };
  

  // Aquí puedes agregar la configuración de Workbox como un plugin de Webpack
  if(process.env.NODE_ENV == "production"){
  //NetworkFirst  
    config.plugins.push(
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: '/index.html', // Fallback para todas las rutas no encontradas
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate', // Cachea todas las páginas
            handler: 'StaleWhileRevalidate', // Intenta primero la red, luego el caché
            options: {
              cacheName: 'pages-cache',
              expiration: {
                maxEntries: 50, // Máximo número de entradas en el caché
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
              },
            },
          },
          {
            urlPattern: /\.(?:js|css|html|json)$/, // Cachea archivos estáticos
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
            },
          },
          {
            // Cachea imágenes
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'StaleWhileRevalidate', // Usa el caché primero
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100, // Máximo número de imágenes en el caché
                maxAgeSeconds: 60 * 24 * 60 * 60, // 60 días
              },
            },
          },
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // Aumenta el límite a 5 MB
      })
    );
  }

  


  return config;
};
