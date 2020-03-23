const { resolve } = require;
const { CSS_SCOPE } = require('../util/const');

module.exports = (config) => {
  let pageBabelPlugins = [
    resolve('babel-plugin-add-module-exports'),
    resolve('@babel/plugin-transform-modules-commonjs'),
  ];
  if (config.entry['app-config']) {
    pageBabelPlugins = [];
  }

  return {
    loader: resolve('babel-loader'),
    options: {
      compact: false,
      presets: [
        resolve('@babel/preset-react'),
        [
          resolve('@babel/preset-env'),
          {
            targets: {
              browsers: [
                'last 2 versions',
                'Firefox ESR',
                '> 1%',
                'ie >= 8',
                'iOS >= 8',
                'Android >= 4',
              ],
            },
          },
        ],
      ],
      plugins: [
        resolve('@babel/plugin-proposal-object-rest-spread'),
        [
          resolve('@babel/plugin-proposal-decorators'),
          {
            legacy: true,
          },
        ],
        ...pageBabelPlugins,
        resolve('@babel/plugin-proposal-class-properties'),
        resolve('@babel/plugin-proposal-function-bind'),
        resolve('@babel/plugin-proposal-export-default-from'),
        resolve('@babel/plugin-proposal-export-namespace-from'),
        resolve('babel-plugin-syntax-dynamic-import'),
        [resolve('babel-plugin-import'), {
          libraryName: 'choice-cbm',
          libraryDirectory: 'es',
          style: true,
        }, 'choice-cbm'],
        // resolve('@saasfe/babel-plugin-react-css-module-transformer'),
        // [resolve('babel-plugin-react-css-modules'), {
        //   context: 'src',
        //   generateScopedName: `${CSS_SCOPE}_[path][local]_[hash:base64:5]`,
        //   webpackHotModuleReloading: true,
        //   handleMissingStyleName: 'warn',
        //   filetypes: {
        //     ".less": {
        //       "syntax": "postcss-less"
        //     }
        //   },
        //   autoResolveMultipleImports: true
        // }]
      ],
    }
  };
}
