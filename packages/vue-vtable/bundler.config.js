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
    treeshake: true
  },
  globals: {
    '@visactor/vtable': 'VTable',
    'vue': 'Vue',
    '@visactor/vutils': 'VUtils'
  },
  external: ['@visactor/vtable', 'vue', '@visactor/vtable/es/vrender'],
  alias: {
    '@visactor/vtable/es/vrender': '@visactor/vtable/es/vrender.js'
  }
};
