/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
const alias = require('@rollup/plugin-alias');

const path = require('path');

module.exports = {
  formats: ['cjs', 'es', 'umd'],
  noEmitOnError: false,
  copy: ['css'],
  name: 'VTable.gantt',
  umdOutputFilename: 'vtable-gantt',
  rollupOptions: {
    treeshake: true,
    plugins: [
      alias({
        entries: [
          { find: '@visactor/vtable/es/vrender', replacement: path.resolve(__dirname, '../vtable/es/vrender') }
        ]
      }),
      // 其他插件
    ]
  },
  globals: {
  },
  external: [
  ]
};
