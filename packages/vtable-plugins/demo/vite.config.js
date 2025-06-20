const { plugin: mdPlugin, Mode } = require('vite-plugin-markdown');
const react = require('@vitejs/plugin-react');
const path = require('path');
module.exports = {
  server: {
    host: '0.0.0.0',
    port: 3013,
    https: !!process.env.HTTPS
  },
  define: {
    __DEV__: true,
    __VERSION__: JSON.stringify(require('../package.json').version)
  },
  resolve: {
    alias: {
      '@visactor/vtable/es': path.resolve(__dirname, '../../vtable/src/'),
      '@visactor/vtable': path.resolve(__dirname, '../../vtable/src/index.ts'),
      '@src': path.resolve(__dirname, '../../vtable/src/'),
      '@vutils-extension': path.resolve(__dirname, '../../vtable/src/vutil-extension-temp'),
      '@visactor/vrender-components': '/Users/bytedance/VisActor/VRender/packages/vrender-components/src/index.ts',
      '@visactor/vrender-core': '/Users/bytedance/VisActor/VRender/packages/vrender-core/src/index.ts',
      '@visactor/vrender-kits': '/Users/bytedance/VisActor/VRender/packages/vrender-kits/src/index.ts'
    }
  },
  plugins: [
    mdPlugin({ mode: [Mode.HTML, Mode.MARKDOWN, Mode.TOC, Mode.REACT] }),
    react({
      babel: {
        plugins: [
          [
            '@babel/plugin-transform-react-jsx',
            {
              pragma: 'jsx',
              pragmaFrag: 'Fragment'
            }
          ]
        ]
      }
    })
  ]
};
