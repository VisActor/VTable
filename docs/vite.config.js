import pkg from '../packages/vtable/package.json';
import * as path from 'path';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';

export default {
  optimizeDeps: {},
  server: {
    host: '0.0.0.0',
    port: 3020,
    https: !!process.env.HTTPS,
    open: true
  },
  define: {
    __DEV__: true,
    __VERSION__: JSON.stringify(pkg.version)
  },
  resolve: {
    alias: {
      '@visactor/vtable/es/vrender': path.resolve('../packages/vtable/src/vrender.ts'),
      '@visactor/vtable/es': path.resolve(__dirname, '../packages/vtable/src/'),
      '@visactor/vtable': path.resolve('../packages/vtable/src/index.ts'),
      '@visactor/vtable-gantt': path.resolve('../packages/vtable-gantt/src/index.ts'),
      '@visactor/vtable-calendar': path.resolve('../packages/vtable-calendar/src/index.ts'),
      '@visactor/vtable-editors': path.resolve('../packages/vtable-editors/src/index.ts'),
      '@visactor/vtable-export': path.resolve('../packages/vtable-export/src/index.ts'),
      '@visactor/vtable-search': path.resolve('../packages/vtable-search/src/index.ts'),
      '@visactor/vtable-plugins': path.resolve('../packages/vtable-plugins/src/index.ts'),
      '@visactor/react-vtable': path.resolve('../packages/react-vtable/src/index.ts'),
      '@visactor/vue-vtable': path.resolve('../packages/vue-vtable/src/index.ts'),
      '@visactor/openinula-vtable': path.resolve('../packages/openinula-vtable/src/index.ts'),
      '@vutils-extension': path.resolve(__dirname, '../packages/vtable/src/vutil-extension-temp'),
      '@src': path.resolve(__dirname, '../packages/vtable/src/'),

      'vue': 'vue/dist/vue.esm-bundler.js' 

      // react: 'openinula', // 新增
      // 'react-dom': 'openinula', // 新增
      // 'react/jsx-dev-runtime': 'openinula/jsx-dev-runtime'
    }
  },
  plugins: [react(), vue()]
};
