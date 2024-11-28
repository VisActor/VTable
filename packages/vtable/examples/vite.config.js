const { plugin: mdPlugin, Mode } = require('vite-plugin-markdown');
const react = require('@vitejs/plugin-react');
const path = require('path');
module.exports = {
  server: {
    host: '0.0.0.0',
    port: 3003,
    https: !!process.env.HTTPS
  },
  define: {
    __DEV__: true,
    __VERSION__: JSON.stringify(require('../package.json').version)
  },
  resolve: {
    alias: {
      '@visactor/vtable-editors': path.resolve(__dirname, '../../vtable-editors/src/index.ts'),
      '@visactor/vtable-plugins': path.resolve(__dirname, '../../vtable-plugins/src/index.ts'),
      '@src': path.resolve(__dirname, '../src/'),
      '@vutils-extension': path.resolve(__dirname, '../src/vutil-extension-temp'),
      '@visactor/vtable/es': path.resolve(__dirname, '../src/')
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
