/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
const { visualizer } = require("rollup-plugin-visualizer");

module.exports = {
  formats: ['umd'],
  noEmitOnError: false,
  copy: ['css'],
  name: 'VTable',
  umdOutputFilename: 'vtable',
  rollupOptions: {
    treeshake: true,
    plugins: [
      visualizer({
        filename: 'report.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
    })
    ]
  },
  globals: {
    // '@visactor/vtable-editors': 'VTable.editors'
  },
  external: [
    // '@visactor/vtable-editors'
  ]
};
