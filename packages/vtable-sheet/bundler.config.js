/**
 * @type {Partial<import('@internal/bundler').Config>}
 */

module.exports = {
  formats: ['cjs', 'es', 'umd'],
  noEmitOnError: false,
  name: 'VTableSheet',
  umdOutputFilename: 'vtable-sheet',
  rollupOptions: {
    treeshake: true
  },
  globals: {
  },
  external: [
  ]
};
