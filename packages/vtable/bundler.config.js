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
    treeshake: true
  },
  globals: {
    '@visactor/vrender': 'VRender',
    '@visactor/vrender-core': 'VRenderCore',
    '@visactor/vrender-kits': 'VRenderKits',
    '@visactor/vrender-components': 'VRenderComponents',
  },
  external: [
    '@visactor/vrender',
    '@visactor/vrender-core',
    '@visactor/vrender-kits',
    '@visactor/vrender-components',
  ],
};
