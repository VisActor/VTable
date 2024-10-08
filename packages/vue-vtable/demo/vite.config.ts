import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// let localConf: UserConfig = {};

// try {
//   localConf = require('./vite.config.local').default;
// } catch (e) {
//   console.warn('vite.config.local.ts not found', e);
// }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    __DEV__: true,
    __VERSION__: JSON.stringify(require('../../vtable/package.json').version)
  },
  optimizeDeps: {},
  server: {
    host: '0.0.0.0',
    port: 3100
    // port: localConf.server?.port || 3100
  },
  resolve: {
    alias: {
      '@visactor/vtable/es/vrender': path.resolve(__dirname, '../../vtable/src/vrender.ts'),
      '@visactor/vtable': path.resolve(__dirname, '../../vtable/src/index.ts'),
      '@visactor/vue-vtable': path.resolve(__dirname, '../src/index.ts'),
      '@src': path.resolve(__dirname, '../../vtable/src/'),
      '@vutils-extension': path.resolve(__dirname, '../../vtable/src/vutil-extension-temp')
      // ...localConf.resolve?.alias
    }
  }
});
