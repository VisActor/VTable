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

it('builds a browser test entry with the browser dependency and package version', async () => {
  // Node 入口无法用于浏览器，测试会捕获 browser 解析和版本替换的回归。
  const root = await mkdtemp(path.join(tmpdir(), 'bundler-browser-'));
  try {
    const dependency = path.join(root, 'node_modules', 'example-dep');
    await mkdir(dependency, { recursive: true });
    await mkdir(path.join(root, 'src'));
    await writeFile(path.join(root, 'tsconfig.json'), '{}');
    await writeFile(path.join(dependency, 'package.json'), '{"main":"node.js","browser":"web.js"}');
    await writeFile(path.join(dependency, 'node.js'), "module.exports = require('fs');");
    await writeFile(path.join(dependency, 'web.js'), "export const value = 'browser';");
    await writeFile(
      path.join(root, 'src/index.ts'),
      "export { value } from 'example-dep'; export const version: string = __VERSION__;"
    );
    const config = {
      ...getDefaultConfig(),
      browserUmd: true,
      minify: false,
      name: 'Example',
      envs: { __VERSION__: '"1.2.3"' }
    };
    await buildUmd(config, root, { name: 'example', version: '1.2.3' });
    const globals = { Example: {} };
    runInNewContext(await readFile(path.join(root, 'dist/example.js'), 'utf8'), globals);
    expect(globals.Example).toEqual({ value: 'browser', version: '1.2.3' });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

it('keeps the package root external but bundles its subpath', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'bundler-externals-'));
  try {
    const dependency = path.join(root, 'node_modules/@example/library');
    await mkdir(dependency, { recursive: true });
    await mkdir(path.join(root, 'src'));
    await writeFile(path.join(root, 'tsconfig.json'), '{}');
    await writeFile(path.join(dependency, 'feature.js'), "export const feature = '-bundled';");
    await writeFile(
      path.join(root, 'src/index.ts'),
      [
        "import { prefix } from '@example/library';",
        "import { feature } from '@example/library/feature.js';",
        'export const value = prefix + feature;'
      ].join('\n')
    );
    const config = {
      ...getDefaultConfig(),
      browserUmd: true,
      minify: false,
      name: 'Example',
      external: ['@example/library'],
      globals: { '@example/library': 'ExampleLibrary' }
    };
    await buildUmd(config, root, { name: 'example', version: '1.0.0' });
    const globals = { Example: {}, ExampleLibrary: { prefix: 'browser' } };
    runInNewContext(await readFile(path.join(root, 'dist/example.js'), 'utf8'), globals);
    expect(globals.Example).toEqual({ value: 'browser-bundled' });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
