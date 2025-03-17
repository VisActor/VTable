/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
module.exports = {
  formats: ['vue', 'umd'],
  noEmitOnError: false,
  copy: ['css'],
  name: 'VueVTable',
  umdOutputFilename: 'vue-vtable',
  rollupOptions: {
    treeshake: true,
    output: {
      // 路径映射
      paths: {
        '@visactor/vtable/es/vrender': 'VTable.vrender'
      }
    }
  },
  globals: {
    '@visactor/vtable': 'VTable',
    'vue': 'Vue',
    '@visactor/vutils': 'VUtils',
    '@visactor/vtable/es/vrender': 'VTable.vrender'
  },
  external: [
    '@visactor/vtable',
    'vue',
    '@visactor/vtable/es/vrender'
  ],
  alias: {
    '@visactor/vtable/es/vrender': '@visactor/vtable/es/vrender.js'
  }
};
