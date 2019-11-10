// next.config.js
const withCSS = require('@zeit/next-css');
module.exports = withCSS({
    webpack(config, { dev }) {
      if (dev) {
        config.devtool = 'cheap-module-source-map';
      }
      return config;
    }
  });
