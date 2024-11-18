const WorkboxPlugin = require('workbox-webpack-plugin');
const pathBrowserify = require('path-browserify');




module.exports = function override(config, env) {
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

  // Add Workbox plugin to the configuration
  config.plugins.push(new WorkboxPlugin.GenerateSW({
    clientsClaim: true,
    skipWaiting: true,
    // Other Workbox configurations can be added here
  }));


  return config;
};
