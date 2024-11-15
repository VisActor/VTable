/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
const resolve = require('rollup-plugin-node-resolve');

module.exports = {
  formats: ['cjs', 'es', 'umd'],
  noEmitOnError: false,
  copy: ['css'],
  name: 'VTable.export',
  umdOutputFilename: 'vtable-export',
  rollupOptions: {},
  globals: {
    '@visactor/vtable': 'VTable'
  },
  external: ['@visactor/vtable']
};
