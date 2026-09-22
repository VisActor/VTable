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
  output: {
    footer: '/* follow me on Twitter! @rich_harris */'
  }
};
