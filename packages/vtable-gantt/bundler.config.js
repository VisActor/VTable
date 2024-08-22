/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
const alias = require('@rollup/plugin-alias');

const path = require('path');

module.exports = {
  formats: ['cjs', 'es', 'umd'],
  noEmitOnError: false,
  copy: ['css'],
  name: 'VTableGantt',
  umdOutputFilename: 'vtable-gantt',
  rollupOptions: {
    treeshake: true
  },
  globals: {
  },
  external: [
  ]
};
