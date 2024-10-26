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
  };

  return config;
};
