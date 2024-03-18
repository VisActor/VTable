/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
module.exports = {
  formats: ['cjs', 'es'],
  noEmitOnError: false,
  copy: ['css'],
  name: 'InulaVTable',
  umdOutputFilename: 'openinula-vtable',
  rollupOptions: {
    treeshake: true
  },
  globals: {
    '@visactor/vtable': 'VTable'
  },
  external: ['@visactor/vtable', 'openinula'],
  alias: {
    react: 'openinula', // 新增
    'react-dom': 'openinula', // 新增
    'react-is': 'openinula' // 新增
  }
};
