/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
module.exports = {
  formats: ['cjs', 'es', 'umd'],
  noEmitOnError: false,
  copy: ['css'],
  name: 'VTable.editors',
  umdOutputFilename: 'vtable-editors',
  rollupOptions: {
    treeshake: true
  }
};
