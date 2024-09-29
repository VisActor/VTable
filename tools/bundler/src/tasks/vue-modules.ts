import { rollup } from 'rollup';
import * as path from 'path';
import type { OutputOptions, RollupBuild } from 'rollup';
import type { RawPackageJson } from '../logic/package';
import type { Config } from '../logic/config';
import { getBabelPlugins } from '../logic/babel.config';
import { getRollupOptions } from '../logic/rollup.config';
import { DebugConfig } from '../logic/debug';

async function generateOutputs(bundle: RollupBuild, outputOptionsList: OutputOptions[]) {
  for (const outputOptions of outputOptionsList) {
    await bundle.write(outputOptions);
  }
}

export async function buildVue(
  config: Config,
  projectRoot: string,
  rawPackageJson: RawPackageJson,
  minify: boolean,
  tsCompilerOptions: Record<string, unknown>
) {
  const babelPlugins = getBabelPlugins(rawPackageJson.name);
  const entry = path.resolve(
    projectRoot,
    config.sourceDir,
    typeof config.input === 'string' ? config.input : config.input.es!
  );
  const rollupOptions = getRollupOptions(
    projectRoot,
    entry,
    rawPackageJson,
    babelPlugins,
    { ...config, minify },
    { compilerOptions: tsCompilerOptions }
  );

  (rollupOptions.external as any).push(...Object.keys(rawPackageJson.dependencies));
  (rollupOptions.external as any).push(...Object.keys(rawPackageJson.devDependencies));
  DebugConfig('RollupOptions', JSON.stringify(rollupOptions));
  const bundle = await rollup(rollupOptions);

  // const dest = path.resolve(projectRoot, 'es');
  await generateOutputs(bundle, [
    // {
    //   format,
    //   dir: format + '/',
    //   exports: format === 'cjs' ? 'auto' : undefined,
    //   preserveModules: true,
    // },
    {
      format: 'es',
      dir: 'es/',
      preserveModules: true
    },
    {
      format: 'cjs',
      dir: 'cjs/',
      exports: 'auto',
      preserveModules: true
    }
  ]);

  if (bundle) {
    await bundle.close();
  }
}
