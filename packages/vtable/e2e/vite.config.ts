import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    __DEV__: true,
    __VERSION__: JSON.stringify('e2e')
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, '../src'),
      '@vutils-extension': path.resolve(__dirname, '../src/vutil-extension-temp')
    }
  }
});
