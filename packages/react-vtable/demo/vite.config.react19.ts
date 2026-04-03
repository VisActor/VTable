import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const react19Root = path.resolve(__dirname, '../../../.react19-deps/node_modules');
const react19Entries = {
  /**
   * React19 Demo 运行机制：
   * - 仓库默认依赖树以 React18 为主（包括 react-reconciler 版本），用于构建/发包。
   * - React19 Demo 通过 Vite resolve.alias + esbuild prebundle 插件，将 React/ReactDOM/ReactReconciler 等强制指向 .react19-deps，
   *   避免与默认依赖树混用导致 “A React Element from an older version of React was rendered”。
   *
   * 另外，alias 同时覆盖了 `react-dom/client(.js)?`、`react/jsx-runtime(.js)?` 等带 .js 的路径，
   * 用来兜住部分依赖会显式导入 `.js` 文件从而绕过 alias 的情况。
   */
  react: path.resolve(react19Root, 'react/index.js'),
  reactJsxRuntime: path.resolve(react19Root, 'react/jsx-runtime.js'),
  reactJsxDevRuntime: path.resolve(react19Root, 'react/jsx-dev-runtime.js'),
  reactDom: path.resolve(react19Root, 'react-dom/index.js'),
  reactDomClient: path.resolve(react19Root, 'react-dom/client.js'),
  reactIs: path.resolve(react19Root, 'react-is/index.js'),
  reactReconciler: path.resolve(react19Root, 'react-reconciler/index.js'),
  reactReconcilerConstants: path.resolve(react19Root, 'react-reconciler/constants.js')
};

export default defineConfig({
  plugins: [react({ fastRefresh: false })] as any,
  define: {
    __DEV__: true,
    __VERSION__: JSON.stringify(require('../../vtable/package.json').version)
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'react19-alias',
          setup(build) {
            build.onResolve({ filter: /^react$/ }, () => ({ path: react19Entries.react }));
            build.onResolve({ filter: /^react\/jsx-runtime(\.js)?$/ }, () => ({
              path: react19Entries.reactJsxRuntime
            }));
            build.onResolve({ filter: /^react\/jsx-dev-runtime(\.js)?$/ }, () => ({
              path: react19Entries.reactJsxDevRuntime
            }));
            build.onResolve({ filter: /^react-dom$/ }, () => ({ path: react19Entries.reactDom }));
            build.onResolve({ filter: /^react-dom\/client(\.js)?$/ }, () => ({
              path: react19Entries.reactDomClient
            }));
            build.onResolve({ filter: /^react-is$/ }, () => ({ path: react19Entries.reactIs }));
            build.onResolve({ filter: /^react-reconciler$/ }, () => ({ path: react19Entries.reactReconciler }));
            build.onResolve({ filter: /^react-reconciler\/constants(\.js)?$/ }, () => ({
              path: react19Entries.reactReconcilerConstants
            }));
          }
        }
      ]
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3101
  },
  resolve: {
    alias: [
      { find: /^react$/, replacement: react19Entries.react },
      { find: /^react\/jsx-runtime(\.js)?$/, replacement: react19Entries.reactJsxRuntime },
      { find: /^react\/jsx-dev-runtime(\.js)?$/, replacement: react19Entries.reactJsxDevRuntime },
      { find: /^react-dom$/, replacement: react19Entries.reactDom },
      { find: /^react-dom\/client(\.js)?$/, replacement: react19Entries.reactDomClient },
      { find: /^react-is$/, replacement: react19Entries.reactIs },
      { find: /^react-reconciler$/, replacement: react19Entries.reactReconciler },
      { find: /^react-reconciler\/constants(\.js)?$/, replacement: react19Entries.reactReconcilerConstants },
      { find: '@visactor/vtable/es/vrender', replacement: path.resolve(__dirname, '../../vtable/src/vrender.ts') },
      { find: '@visactor/vtable/es', replacement: path.resolve(__dirname, '../../vtable/src/') },
      { find: '@visactor/vtable', replacement: path.resolve(__dirname, '../../vtable/src/index.ts') },
      { find: '@visactor/vtable-plugins', replacement: path.resolve(__dirname, '../../vtable-plugins/src/index.ts') },
      { find: '@src', replacement: path.resolve(__dirname, '../../vtable/src/') },
      { find: '@vutils-extension', replacement: path.resolve(__dirname, '../../vtable/src/vutil-extension-temp') }
    ]
  }
});
