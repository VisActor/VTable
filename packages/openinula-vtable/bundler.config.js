/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
module.exports = {
  formats: ['cjs', 'es', 'umd'],
  noEmitOnError: false,
  copy: ['css'],
  name: 'ReactVTable',
  umdOutputFilename: 'openinula-vtable',
  rollupOptions: {
    treeshake: true
  },
  globals: {
    '@visactor/vtable': 'VTable'
  },
  external: ['@visactor/vtable'],
  alias: {
    react: 'openinula', // 新增
    'react-dom': 'openinula', // 新增
    'react-is': 'openinula' // 新增
  }
};
