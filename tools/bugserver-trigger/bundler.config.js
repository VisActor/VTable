/**
 * @type {Partial<import('@internal/bundler').Config>}
 */

const alias = require('@rollup/plugin-alias');

const path = require('path');

module.exports = {
  formats: ['umd'],
  // name: 'VTable',

  umdOutputFilename: 'index',
  minify: false,
  envs: {
    __DEV__: JSON.stringify(false),
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  output: {
    footer: '/* follow me on Twitter! @rich_harris */'
  }
};
