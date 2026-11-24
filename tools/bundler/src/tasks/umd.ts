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

// esbuild 合并入口依赖，再由 Rollup 保留 CommonJS、AMD 和浏览器全局三种 UMD 入口。
async function bundleEntry(config: Config, projectRoot: string, pkg: RawPackageJson, input: string) {
  const external = getExternal(pkg, config.external);
  const result = await build({
    absWorkingDir: projectRoot,
    entryPoints: [input],
    bundle: true,
    format: 'esm',
    platform: config.browserUmd ? 'browser' : 'neutral',
    // ExcelJS 的浏览器入口包含异步生成器；发布包仍使用原来的解析顺序和目标。
    mainFields: config.browserUmd ? ['browser', 'module', 'main'] : ['module', 'main'],
    target: config.browserUmd ? 'es2018' : 'es2016',
    ...(config.browserUmd && { tsconfig: path.resolve(projectRoot, config.tsconfig), define: config.envs }),
    // esbuild 会把包名形式的 external 扩展到子路径，这里沿用 Rollup 的精确匹配。
    plugins: external.length
      ? [
          {
            name: 'exact-externals',
            setup(builder) {
              builder.onResolve({ filter: /./ }, ({ path: id }) =>
                external.includes(id) ? { path: id, external: true } : null
              );
            }
          }
        ]
      : [],
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

  // React 的 reconciler 通过 CommonJS 延迟加载 React，须由 Rollup 处理这个外部引用。
  const useSourceRollup = rawPackageJson.name === '@visactor/react-vtable';
  const useCompiledEntry = fromEs && !useSourceRollup;
  const input = useCompiledEntry
    ? path.resolve(projectRoot, config.outputDir.es!, entry.replace(/\.(tsx?|jsx)$/, '.js'))
    : path.resolve(projectRoot, config.sourceDir, entry);
  DebugConfig('UMD entry', entry, { fromEs: useCompiledEntry });
  const bundle =
    !useSourceRollup && (useCompiledEntry || config.browserUmd)
      ? await bundleEntry(config, projectRoot, rawPackageJson, input)
      : await rollup(
          getRollupOptions(projectRoot, input, rawPackageJson, getBabelPlugins(rawPackageJson.name), config)
        );
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
