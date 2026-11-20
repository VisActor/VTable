/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
const resolve = require('rollup-plugin-node-resolve');

module.exports = {
  formats: ['cjs', 'es', 'umd'],
  noEmitOnError: false,
  copy: ['css'],
  name: 'VTableCalendar',
  umdOutputFilename: 'vtable-calendar',
  umdCompress: false,
  umdFromEs: true,
  rollupOptions: {
    treeshake: true
  },
  globals: {
    '@visactor/vtable': 'VTable'
  }
  // external: ['roughjs']
};
