/**
 * 图片loader配置
 * @param {json} config - webpack配置文件
 */

'use strict';

module.exports = function (config) {
  config.module = config.module || {};
  config.module.rules = config.module.rules || [];

  let imageModuleRule = [{
    test: /\.(png|jpe?g|gif|svg|eot|ttf|woff)(\?.*)?$/,
    oneOf: [
      {
        loader: 'url-loader',
        options: {
          limit: 1024 * 20, // 20kb
        },
      },
      {
        loader: 'file-loader',
      },
    ],
  }];

  config.module.rules = config.module.rules.concat(imageModuleRule);
};
