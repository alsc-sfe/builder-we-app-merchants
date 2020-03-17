'use strict';
const getBabel = require('./getBabel');

module.exports = function (config, entry) {

  config.module = config.module || {};
  config.module.rules = config.module.rules || [];


  let babelModuleRule = {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: [
      require.resolve('thread-loader'),
      require.resolve('cache-loader'),
      getBabel(entry),
    ]
  };

  config.module.rules.push(babelModuleRule);
};
