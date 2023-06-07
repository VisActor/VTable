const { plugin: mdPlugin, Mode } = require('vite-plugin-markdown');

module.exports = {
  optimizeDeps: {
    exclude: ['@visactor/vrender', '@visactor/vscale', '@visactor/vutils', '@visactor/vrender-components']
  },
  server: {
    host: '0.0.0.0',
    port: 3003,
    https: !!process.env.HTTPS
  },
  define: {
    __DEV__: true,
    __VERSION__: JSON.stringify(require('../package.json').version)
  },
  resolve: {},
  plugins: [mdPlugin({ mode: [Mode.HTML, Mode.MARKDOWN, Mode.TOC, Mode.REACT] })]
};
