import { rollup } from 'rollup';
import terser from '@rollup/plugin-terser';
import strip from '@rollup/plugin-strip';
import { build } from 'esbuild';
import * as path from 'path';
import type { OutputOptions } from 'rollup';
import type { RawPackageJson } from '../logic/package';
import type { Config } from '../logic/config';
import { getBabelPlugins } from '../logic/babel.config';
import { getExternal, getRollupOptions } from '../logic/rollup.config';
import { DebugConfig } from '../logic/debug';

function packageNameToPath(name: string) {
  return name.replace('@', '').replace('/', '_');
}

// esbuild 合并已编译的模块，再由 Rollup 保留 CommonJS、AMD 和浏览器全局三种 UMD 入口。
async function bundleEsEntry(config: Config, projectRoot: string, pkg: RawPackageJson, entry: string) {
  const input = path.resolve(projectRoot, config.outputDir.es!, entry.replace(/\.(tsx?|jsx)$/, '.js'));
  const external = getExternal(pkg, config.external);
  const result = await build({
    absWorkingDir: projectRoot,
    entryPoints: [input],
    bundle: true,
    format: 'esm',
    platform: 'browser',
    mainFields: ['module', 'main'],
    target: 'es2016',
    external,
    write: false
  });
  return rollup({
    ...config.rollupOptions,
    input,
    external,
    plugins: [
      { name: 'bundled-es-entry', load: id => (id === input ? result.outputFiles[0]!.text : null) },
      strip({ labels: ['unittest'] })
    ]
  });
}

// 普通和压缩 UMD 共用同一个 Rollup 构建，压缩仅在写入 .min.js 时执行。
export async function buildUmd(config: Config, projectRoot: string, rawPackageJson: RawPackageJson, fromEs = false) {
  const entry = typeof config.input === 'string' ? config.input : config.input.umd!;
  const dest = path.resolve(projectRoot, config.outputDir.umd!);
  const filename = config.umdOutputFilename || packageNameToPath(rawPackageJson.name);
  const output: OutputOptions = {
    format: 'umd',
    name: config.name || packageNameToPath(rawPackageJson.name),
    file: path.join(dest, `${filename}.js`),
    inlineDynamicImports: true,
    exports: 'named',
    globals: { react: 'React', ...config.globals }
  };

  const source = path.resolve(projectRoot, config.sourceDir, entry);
  DebugConfig('UMD entry', entry, { fromEs });
  const bundle = fromEs
    ? await bundleEsEntry(config, projectRoot, rawPackageJson, entry)
    : await rollup(getRollupOptions(projectRoot, source, rawPackageJson, getBabelPlugins(rawPackageJson.name), config));
  try {
    await bundle.write(output);
    if (config.minify) {
      await bundle.write({
        ...output,
        file: path.join(dest, `${filename}.min.js`),
        plugins: [terser(config.umdCompress === false ? { compress: false } : undefined)]
      });
    }
  } finally {
    await bundle.close();
  }
}
