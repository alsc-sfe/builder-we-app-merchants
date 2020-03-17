'use strict';

module.exports = function (config, entryConfig) {
  if (!entryConfig.entry['app-config']) {
    return;
  }

  config.output.libraryTarget = 'system';

  config.module = config.module || {};
  config.module.rules = config.module.rules || [];

  // If building code using the System global in Webpack, the following config is needed to avoid rewriting
  const systemModuleRule = { parser: { system: false } };

  config.module.rules.push(systemModuleRule);
};
