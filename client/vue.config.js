const path = require('path');

module.exports = {
  outputDir: path.resolve(__dirname, '../deploy/pvw/www'),
  chainWebpack: (config) => {
    // Add project name as alias
    config.resolve.alias.set('parflow-web', __dirname);
  },
};
