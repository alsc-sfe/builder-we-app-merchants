'use strict';
const { resolve } = require;
const getBabel = require('./getBabel');

module.exports = function (config, entry) {

  config.module = config.module || {};
  config.module.rules = config.module.rules || [];


  let tsModuleRule = {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    // exclude: /node_modules[\\/](?!(saas-biz-pc)[\\/]).*/,
    use: [
      getBabel(entry),
      {
        loader: resolve('ts-loader'),
        options: { transpileOnly: true }
      }
    ]
  };

  config.module.rules.push(tsModuleRule);
};
