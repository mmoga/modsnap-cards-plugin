const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
  ...defaultConfig,
  entry: {
    'modsnap-cards-block': './js/ms-cards-block.js',
  },
  output: {
    path: path.join(__dirname, './build/js/'),
    filename: '[name].js',
  },
};
