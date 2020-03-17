/**
 * dev配置文件
 */
process.env.NODE_ENV = 'production';
const applyEntryConfig = require('./config/entry');
const applyResolveConfig = require('./config/resolve');
const applyHtmlConfig = require('./config/html');
const applySystemModuleConfig = require('./config/system-module');
const applyImageConfig = require('./config/image');
const applyStyleConfig = require('./config/style');
const applyExternalConfig = require('./config/externals');
const applyOptimizationConfig = require('./config/optimization');
const applyUflifyConfig = require('./config/uglify');
const applyOtherConfig = require('./config/other');
const resolveAppConfig = require('./util/resolveAppConfig');
const applyTsConfig = require('./config/typescript');
const applyJsConfig = require('./config/javascript');

// webpack 基础配置
const getWebpackBase = require('./webpack.base.config');

const entries = require('./config/getEntries')();
const configs = entries.map((config) => {
  let baseConfig = getWebpackBase(config);

  // js入口
  // applyEntryConfig(baseConfig);
  // webpack.resolve
  applyResolveConfig(baseConfig);
  // system module
  applySystemModuleConfig(baseConfig, config);
  // ts/tsx
  applyTsConfig(baseConfig, config);
  // js/jsx
  applyJsConfig(baseConfig, config);
  // html模板替换
  applyHtmlConfig(baseConfig);
  // 图片 loader
  applyImageConfig(baseConfig);
  // css样式
  applyStyleConfig(baseConfig);
  // 外部引用类库
  applyExternalConfig(baseConfig);
  // common文件
  // applyOptimizationConfig(baseConfig);
  // uglify
  // applyUflifyConfig(baseConfig);
  // other
  applyOtherConfig(baseConfig);

  // 业务自定义配置
  baseConfig = resolveAppConfig(baseConfig);
});

module.exports = configs;
