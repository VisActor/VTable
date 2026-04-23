import { rollup } from 'rollup';
import * as path from 'path';
import * as fs from 'fs';
import type { OutputOptions, RollupBuild } from 'rollup';
import * as ts from 'typescript';
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

function formatDiagnostics(diagnostics: readonly ts.Diagnostic[]) {
  return ts.formatDiagnostics(diagnostics, {
    getCanonicalFileName: fileName => fileName,
    getCurrentDirectory: () => process.cwd(),
    getNewLine: () => ts.sys.newLine
  });
}

async function ensureDir(filePath: string) {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
}

async function copyDeclarationSources(fileNames: string[], sourceRoot: string, outputRoot: string) {
  const declarationFiles = fileNames.filter(fileName => fileName.endsWith('.d.ts'));
  await Promise.all(
    declarationFiles.map(async fileName => {
      const relativePath = path.relative(sourceRoot, fileName);
      if (relativePath.startsWith('..')) {
        return;
      }
      const outputPath = path.resolve(outputRoot, relativePath);
      await ensureDir(outputPath);
      await fs.promises.copyFile(fileName, outputPath);
    })
  );
}

async function emitVueSfcDeclarationFiles(sourceRoot: string, outputRoot: string) {
  const queue = [sourceRoot];
  const vueComponentDeclaration = `import type { DefineComponent } from 'vue';

declare const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>;
export default component;
`;

  while (queue.length) {
    const currentDir = queue.pop();
    if (!currentDir) {
      continue;
    }
    const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
    await Promise.all(
      entries.map(async entry => {
        const absolutePath = path.resolve(currentDir, entry.name);
        if (entry.isDirectory()) {
          queue.push(absolutePath);
          return;
        }
        if (!entry.isFile() || !entry.name.endsWith('.vue')) {
          return;
        }
        const relativePath = path.relative(sourceRoot, absolutePath);
        const outputPath = path.resolve(outputRoot, `${relativePath}.d.ts`);
        await ensureDir(outputPath);
        await fs.promises.writeFile(outputPath, vueComponentDeclaration, 'utf8');
      })
    );
  }
}

async function emitVueDeclarations(
  config: Config,
  projectRoot: string,
  tsCompilerOptions: Record<string, unknown>,
  outputRoot: string
) {
  const tsconfigPath = path.resolve(projectRoot, config.tsconfig);
  const readResult = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
  if (readResult.error) {
    throw new Error(formatDiagnostics([readResult.error]));
  }

  const convertedCompilerOptions = ts.convertCompilerOptionsFromJson(tsCompilerOptions, projectRoot, tsconfigPath);
  if (convertedCompilerOptions.errors.length) {
    throw new Error(formatDiagnostics(convertedCompilerOptions.errors));
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
    readResult.config,
    ts.sys,
    projectRoot,
    {
      ...convertedCompilerOptions.options,
      declaration: true,
      emitDeclarationOnly: true,
      noEmit: false,
      outDir: outputRoot
    },
    tsconfigPath
  );

  if (parsedConfig.errors.length) {
    throw new Error(formatDiagnostics(parsedConfig.errors));
  }

  const sourceRoot = path.resolve(projectRoot, config.sourceDir);
  const sourceFiles = parsedConfig.fileNames.filter(fileName => !fileName.endsWith('.vue'));
  const program = ts.createProgram(sourceFiles, parsedConfig.options);
  const emitResult = program.emit(undefined, undefined, undefined, true);
  const diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

  if (diagnostics.length) {
    throw new Error(formatDiagnostics(diagnostics));
  }

  await copyDeclarationSources(parsedConfig.fileNames, sourceRoot, outputRoot);
  await emitVueSfcDeclarationFiles(sourceRoot, outputRoot);
}

export async function buildVue(
  config: Config,
  projectRoot: string,
  rawPackageJson: RawPackageJson,
  minify: boolean,
  tsCompilerOptions: Record<string, unknown>
) {
  const babelPlugins = getBabelPlugins(rawPackageJson.name);
  const input = typeof config.input === 'string' ? config.input : config.input.es || 'index.ts';
  const entry = path.resolve(projectRoot, config.sourceDir, input);
  const rollupOptions = getRollupOptions(
    projectRoot,
    entry,
    rawPackageJson,
    babelPlugins,
    { ...config, minify },
    { compilerOptions: tsCompilerOptions }
  );

  const external = rollupOptions.external as string[];
  external.push(...Object.keys(rawPackageJson.dependencies));
  external.push(...Object.keys(rawPackageJson.devDependencies));
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

  await emitVueDeclarations(config, projectRoot, tsCompilerOptions, path.resolve(projectRoot, 'es'));

  if (bundle) {
    await bundle.close();
  }
}
