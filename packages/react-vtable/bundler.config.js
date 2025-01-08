/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
module.exports = {
  formats: ['cjs', 'es', 'umd'],
  noEmitOnError: false,
  copy: ['css'],
  name: 'ReactVTable',
  umdOutputFilename: 'react-vtable',
  envs: {
    'process.env.NODE_ENV': '"production"'
  },
  rollupOptions: {
    treeshake: true
  },
  globals: {
    '@visactor/vtable': 'VTable'
  },
  external: ['@visactor/vtable', 'react'],
  alias: {
    '@visactor/vtable/es/vrender': '@visactor/vtable/es/vrender.js'
  }
};
