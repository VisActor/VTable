/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
const resolve = require('rollup-plugin-node-resolve');

module.exports = {
  formats: ['cjs', 'es', 'umd'],
  noEmitOnError: false,
  copy: ['css'],
  name: 'VTable.calendar',
  umdOutputFilename: 'vtable-calendar',
  rollupOptions: {
    treeshake: true,
    plugins: [resolve({ browser: true })]
  },
  globals: {
    '@visactor/vtable': 'VTable'
  },
  external: ['@visactor/vtable']
};
