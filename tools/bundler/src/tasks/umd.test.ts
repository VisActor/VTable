import { mkdtemp, mkdir, readFile, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import { runInNewContext } from 'vm';
import { expect, it, vi } from 'vitest';
import { getDefaultConfig } from '../logic/config';
import { buildUmd } from './umd';

// 该路径只处理已编译的 JS，不加载源码构建使用的 Vue 插件。
vi.mock('@vitejs/plugin-vue', () => ({
  default: () => {
    throw new Error('Unexpected Vue transform for a compiled JS entry');
  }
}));

it('exposes the compiled ESM exports through both UMD files', async () => {
  // 仅提供编译后的入口，避免回退到源码时测试仍然通过。
  const root = await mkdtemp(path.join(tmpdir(), 'bundler-umd-'));
  try {
    await mkdir(path.join(root, 'es'));
    await writeFile(path.join(root, 'es/value.js'), 'export const value = 42;');
    await writeFile(path.join(root, 'es/browser.js'), "export { value } from './value';");
    const config = { ...getDefaultConfig(), input: 'browser.ts', name: 'Example', umdOutputFilename: 'example' };
    await buildUmd(config, root, { name: 'example', version: '1.0.0' }, true);
    for (const file of ['example.js', 'example.min.js']) {
      const code = await readFile(path.join(root, 'dist', file), 'utf8');
      const browser = { Example: {} };
      const commonjs = { module: {}, exports: {} };
      runInNewContext(code, browser);
      runInNewContext(code, commonjs);
      expect(browser.Example).toEqual({ value: 42 });
      expect(commonjs.exports).toEqual({ value: 42 });
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
