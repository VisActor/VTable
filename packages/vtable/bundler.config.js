/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
module.exports = {
  formats: ['cjs', 'es', 'umd'],
  noEmitOnError: false,
  copy: ['css'],
  name: 'VTable',
  umdOutputFilename: 'vtable',
  rollupOptions: {
    treeshake: false
  }
};
