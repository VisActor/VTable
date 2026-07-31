import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const react19Root = path.resolve(__dirname, '../../../.react19-deps/node_modules');

export default defineConfig({
  plugins: [react({ fastRefresh: false })] as any,
  define: {
    __DEV__: true,
    __VERSION__: JSON.stringify(require('../../vtable/package.json').version)
  },
  server: {
    host: '0.0.0.0',
    port: 3102
  },
  resolve: {
    alias: [
      { find: /^react$/, replacement: path.resolve(react19Root, 'react/index.js') },
      { find: /^react\/jsx-runtime(\.js)?$/, replacement: path.resolve(react19Root, 'react/jsx-runtime.js') },
      { find: /^react\/jsx-dev-runtime(\.js)?$/, replacement: path.resolve(react19Root, 'react/jsx-dev-runtime.js') },
      { find: /^react-dom$/, replacement: path.resolve(react19Root, 'react-dom/index.js') },
      { find: /^react-dom\/client(\.js)?$/, replacement: path.resolve(react19Root, 'react-dom/client.js') },
      { find: '@visactor/vtable/es/vrender', replacement: path.resolve(__dirname, '../../vtable/src/vrender.ts') },
      { find: '@visactor/vtable/es', replacement: path.resolve(__dirname, '../../vtable/src/') },
      { find: '@visactor/vtable', replacement: path.resolve(__dirname, '../../vtable/src/index.ts') },
      { find: '@visactor/vtable-plugins', replacement: path.resolve(__dirname, '../../vtable-plugins/src/index.ts') },
      { find: '@src', replacement: path.resolve(__dirname, '../../vtable/src/') },
      { find: '@vutils-extension', replacement: path.resolve(__dirname, '../../vtable/src/vutil-extension-temp') }
    ]
  }
});
