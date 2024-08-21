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
  rollupOptions: {
    treeshake: true,
    plugins: [
      alias({
        entries: [
          { find: '@visactor/vtable/es/vrender', replacement: path.resolve(__dirname, '../../packages/vtable/es/vrender') }
        ]
      }),
      // 其他插件
    ]
  },
  output: {
    footer: '/* follow me on Twitter! @rich_harris */'
  }
};
