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
    // 如果umd打包想要排除vrender的依赖，可以注放开下面注释的代码
    // '@visactor/vrender-core': 'VRender',
    // '@visactor/vrender-components': 'VRender',
    // '@visactor/vrender-kits': 'VRender',
    // '@visactor/vrender-animate': 'VRender',
  },
  external: [
    //如果umd打包想要排除vrender的依赖，可以注放开下面注释的代码
    // '@visactor/vrender-core',
    // '@visactor/vrender-components',
    // '@visactor/vrender-kits',
    // '@visactor/vrender-animate',
  ]
};
