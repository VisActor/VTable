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
      '@visactor/vtable': path.resolve(__dirname, '../../vtable/src/index.ts'),
      '@src': path.resolve(__dirname, '../../vtable/src/'),
      '@vutils-extension': path.resolve(__dirname, '../../vtable/src/vutil-extension-temp')
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
