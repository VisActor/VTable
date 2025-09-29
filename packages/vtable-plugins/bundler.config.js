/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
const resolve = require('rollup-plugin-node-resolve');

module.exports = {
  formats: ['cjs', 'es', 'umd'],
  noEmitOnError: false,
  copy: ['css'],
  name: 'VTable.plugins',
  umdOutputFilename: 'vtable-plugins',
  rollupOptions: {
    treeshake: true,
    plugins: [resolve({ browser: true })]
  },
  globals: {
    '@visactor/vtable': 'VTable',
    '@visactor/vtable/es/vrender': 'VRender',
    '@visactor/vtable-gantt': 'VTableGantt',
    roughjs: 'Rough'
  },
  external: [
    // ...其他外部依赖
    '@visactor/vtable',
    '@visactor/vtable/es/vrender',
    '@visactor/vtable-gantt',
    'roughjs'
  ]
};
