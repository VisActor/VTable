/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
module.exports = {
  formats: ['cjs', 'es', 'umd'],
  noEmitOnError: false,
  copy: ['css'],
  name: 'VTable',
  umdOutputFilename: 'react-vtable',
  rollupOptions: {
    treeshake: true
  },
  globals: {
    '@visactor/vtable': 'VTable',
  },
  external: [
    '@visactor/vtable'
  ]
};
