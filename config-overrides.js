
const pathBrowserify = require('path-browserify');

/* Ya no se utilizar porque con solo power el service-worker.js empezo a funcionar y por eso me decia que yo llamaba dos veces
//const {GenerateSW} = require('workbox-webpack-plugin');*/


module.exports = function override(config, env) {
  config.devtool = false; // Desactiva los mapas de origen globalmente
  // Agregar alias
  config.resolve.alias = {
    ...config.resolve.alias,
    "@components": pathBrowserify.resolve(__dirname, "src/components"),
    "@utils": pathBrowserify.resolve(__dirname, "src/utils"),
  };

  // Agregar fallbacks para módulos de Node.js
  config.resolve.fallback = {
    fs: false, // No necesitas fs en el navegador
    path: require.resolve('path-browserify'), // Usar path-browserify como string
    crypto: require.resolve('crypto-browserify'), // Usar crypto-browserify
    buffer: require.resolve("buffer/"),
    stream: require.resolve("stream-browserify"),
    vm: require.resolve("vm-browserify"),
  };


  return config;
};
