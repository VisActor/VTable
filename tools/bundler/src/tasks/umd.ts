import { rollup } from 'rollup';
import terser from '@rollup/plugin-terser';
import * as path from 'path';
import type { OutputOptions } from 'rollup';
import type { RawPackageJson } from '../logic/package';
import type { Config } from '../logic/config';
import { getBabelPlugins } from '../logic/babel.config';
import { getRollupOptions } from '../logic/rollup.config';
import { DebugConfig } from '../logic/debug';

function packageNameToPath(name: string) {
  return name.replace('@', '').replace('/', '_');
}

// 普通和压缩 UMD 共用同一个 Rollup 构建，压缩仅在写入 .min.js 时执行。
export async function buildUmd(config: Config, projectRoot: string, rawPackageJson: RawPackageJson) {
  const babelPlugins = getBabelPlugins(rawPackageJson.name);
  const entry = path.resolve(
    projectRoot,
    config.sourceDir,
    typeof config.input === 'string' ? config.input : config.input.umd!
  );
  const rollupOptions = getRollupOptions(projectRoot, entry, rawPackageJson, babelPlugins, config);
  DebugConfig('RollupOptions', JSON.stringify(rollupOptions));

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

  const bundle = await rollup(rollupOptions);
  try {
    await bundle.write(output);
    if (config.minify) {
      await bundle.write({ ...output, file: path.join(dest, `${filename}.min.js`), plugins: [terser()] });
    }
  } finally {
    await bundle.close();
  }
}
