'use strict';

const path = require('path');
const fs = require('fs');
const get = require('lodash/get');
const nunjucks = require('nunjucks');
const { ROOT_PATH, SAAS_CONFIG, SRC_PATH, PUBLISH_ENV, ASSETS_URL } = require('../util/const');

const microAppName = get(SAAS_CONFIG, 'microAppName', '');
const basename = get(SAAS_CONFIG, 'basename', '');

const plugins = require('../util/resolvePlugins')();
const { resolveEntry } = plugins;

nunjucks.configure('*', {
  autoescape: false,
});

const filterPage = (pages) => {
  if (!Array.isArray(pages)) {
    return Object.keys(pages).map(item => ({
      ...pages[item],
      module: item,
    }));
  }
  return pages;
};

const { host, port } = get(SAAS_CONFIG, 'webpack.devServer', {
  host: 'localhost',
  port: '8000',
});

module.exports = function (startupParam) {
  const entries = [];
  let pages = get(SAAS_CONFIG, 'page', {});
  pages = filterPage(pages);

  // entry 去重
  const entrys = Array.from(new Set(pages.map(item => item.module)));
  entrys.forEach(chunkName => {
    const entryValue = [];
    const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';

    //每个页面的index.jsx入口文件
    const jsEntryFile = path.join(SRC_PATH, chunkName, 'index');
    // development下使用热更新
    if (process.env.NODE_ENV === 'development') {
      entryValue.push(hotMiddlewareScript, jsEntryFile);
    } else {
      entryValue.push(jsEntryFile);
    }

    const config = {
      entry: {
        [chunkName]: resolveEntry.concat(entryValue),
      },
      output: {
        library: `__weapp__${microAppName.replace(/-/g, '_')}__${chunkName}`,
      },
    };

    entries.push(config);
  });

  const pagesNew = [];
  let num = 1;
  const version = PUBLISH_ENV === 'daily' ? (+ new Date()) : '';

  const localPort = startupParam ? startupParam.port : port;
  const PUBLIC_PATH = PUBLISH_ENV === 'local' ? `//${host}:${localPort || '8000'}/` : ASSETS_URL;

  pages.forEach(item => {
    const page = {
      ...item,
      name: item.module,
      path: item.route,
    };

    if (pagesNew.findIndex(itemInner => itemInner.module === item.module) > -1) {
      page.name = `${item.module}-${num}`;

      num++;
    }

    const filePath = `${PUBLIC_PATH}${item.module}`;
    if (version) {
      page.url = [`${filePath}.js?t=${version}`, `${filePath}.css?t=${version}`];
    } else {
      page.url = [`${filePath}.js`, `${filePath}.css`];
    }

    pagesNew.push(page);
  });

  fs.writeFileSync(
    path.join(ROOT_PATH, '.micro_app_config.js'),
    nunjucks.renderString(fs.readFileSync(path.join(__dirname, '../dynamic/micro_app_config.nunjucks')).toString(), {
      appName: microAppName,
      basename,
      modules: JSON.stringify(pagesNew),
      version: PUBLISH_ENV === 'daily' ? (+ new Date()) : '',
    }),
  );

  // micro app config file
  const config = {
    entry: {
      'app-config': path.join(ROOT_PATH, '.micro_app_config.js'),
    },
    output: {},
  };

  entries.push(config);

  return entries;
}
