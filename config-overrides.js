
const pathBrowserify = require('path-browserify');

// Ya no se utilizar porque con solo power el service-worker.js empezo a funcionar y por eso me decia que yo llamaba dos veces
//const {GenerateSW} = require('workbox-webpack-plugin');



module.exports = function override(config, env) {
  if(process.env.NODE_ENV == "production"){
    config.devtool = false; // Desactiva los mapas de origen globalmente
  }
  // Agregar alias
 
    config.resolve.alias = {
      ...config.resolve.alias,
      "@components": pathBrowserify.resolve(__dirname, "src/components"),
      "@utils": pathBrowserify.resolve(__dirname, "src/utils"),
      "@db": pathBrowserify.resolve(__dirname, "src/db"),
      "@repositories": pathBrowserify.resolve(__dirname, "src/repositories"),
      "@hooks": pathBrowserify.resolve(__dirname, "src/hooks"),
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
  

  // Aquí puedes agregar la configuración de Workbox como un plugin de Webpack
  if(process.env.NODE_ENV == "production"){
    const WorkboxPlugin = require('workbox-webpack-plugin');
    config.plugins.push(
      new WorkboxPlugin.InjectManifest({
        swSrc: './src/sw.js', // Fuente de tu archivo sw.js //service-worker.js
        swDest: 'build/sw.js', // Destino donde se generará el archivo sw.js
        //globDirectory: 'build', // Directorio donde buscar los archivos a cachear
        mode: 'production',       // You can specify 'development' or 'production'
      })
    );
  }

  


  return config;
};
