/**
 * dev配置文件
 */
process.env.NODE_ENV = 'development';
const applyEntryConfig = require('./config/entry');
const applyResolveConfig = require('./config/resolve');
const applyHtmlConfig = require('./config/html');
const applySystemModuleConfig = require('./config/system-module');
const applyImageConfig = require('./config/image');
const applyStyleConfig = require('./config/style');
const applyExternalConfig = require('./config/externals');
// const applyOptimizationConfig = require('./config/optimization');
const applyDebugConfig = require('./config/debug');
const resolveAppConfig = require('./util/resolveAppConfig');
const applyOtherConfig = require('./config/other');
const applyTsConfig = require('./config/typescript');
const applyJsConfig = require('./config/javascript');


// webpack 基础配置
const getWebpackBase = require('./webpack.base.config');

const getEntries = require('./config/getEntries');

function getWebpackDevConfig(startupParam) {
  const entries = getEntries(startupParam);
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
    // optimizationConfig
    // applyOptimizationConfig(baseConfig);
    // 调试选项
    applyDebugConfig(baseConfig);
    // other
    applyOtherConfig(baseConfig);
    // 业务自定义配置
    baseConfig = resolveAppConfig(baseConfig);
    return baseConfig;
  });
  return configs;
}

module.exports = getWebpackDevConfig;
