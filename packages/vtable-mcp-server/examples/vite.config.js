const path = require('path');

module.exports = {
  server: {
    host: '0.0.0.0',
    port: 3001
  },
  define: {
    __DEV__: true,
    __VERSION__: JSON.stringify(require('../package.json').version)
  },
  resolve: {
    alias: {
      // 重要：使用本仓库源码，避免依赖外部路径
      '@visactor/vtable-mcp': path.resolve(__dirname, '../../vtable-mcp/src'),
      '@visactor/vtable': path.resolve(__dirname, '../../vtable/src/index.ts'),
      '@visactor/vtable-plugins': path.resolve(__dirname, '../../vtable-plugins/src/index.ts'),

      // 对齐 packages/vtable/examples/vite.config.js：vtable 源码内部会用到这些别名
      '@src': path.resolve(__dirname, '../../vtable/src/'),
      '@vutils-extension': path.resolve(__dirname, '../../vtable/src/vutil-extension-temp'),
      '@visactor/vtable/es': path.resolve(__dirname, '../../vtable/src/')
    }
  }
};


