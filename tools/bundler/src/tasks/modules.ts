import gulp from 'gulp';
import * as ts from 'typescript';
import gulpSourceMaps from 'gulp-sourcemaps';
import gulpTS, { Settings } from 'gulp-typescript';
import gulpReplace from 'gulp-replace';
import fs from 'fs';
import merge from 'merge2';
import through2 from 'through2';
import { minify } from 'terser';
import gulpIF from 'gulp-if';
import gulpMatch from 'gulp-match';
import { DebugCompile, DebugConfig } from '../logic/debug';
import { alias } from '../logic/alias';

export function getTSCompilerOptions(
  moduleKind: 'esnext' | 'commonjs',
  userTSCompilerOptions: Record<string, unknown> = {},
  noEmitOnError: boolean
): Settings {
  delete userTSCompilerOptions['outDir'];
  return {
    moduleResolution: 'node',
    target: 'es2016',
    ...userTSCompilerOptions,
    noEmit: false,
    emitDeclarationOnly: false,
    declaration: true,
    isolatedModules: false,
    allowSyntheticDefaultImports: true,
    module: moduleKind,
    skipLibCheck: true,
    noEmitOnError: noEmitOnError
  };
}

// getTSCompilerOptions(ModuleKind.ESNext)

export function readUserTsconfig(absTsConfigPath: string): {
  extends: string;
  compilerOptions: Record<string, unknown>;
} {
  const configJson = ts.readConfigFile(absTsConfigPath, path => fs.readFileSync(path, { encoding: 'utf-8' }));

  if (configJson.error) {
    throw new Error(ts.formatDiagnostics([configJson.error], ts.createCompilerHost(ts.getDefaultCompilerOptions())));
  }
  return configJson.config;
}

export function cssInjection(content: string) {
  return content
    .replace(/\/style\/?'/g, "/style/css'")
    .replace(/\/style\/?"/g, '/style/css"')
    .replace(/\.less/g, '.css');
}

export function compile(
  sources: string[],
  tsCompilerOptions: Settings,
  envs: Record<string, string>,
  outputPath: string,
  absTsConfigPath: string,
  projectRoot: string,
  noEmitOnError: boolean,
  sourceMap: boolean
) {
  DebugConfig('tsCompilerOptions', tsCompilerOptions);

  const tsProject = gulpTS.createProject(absTsConfigPath, tsCompilerOptions);
  const hasAlias = Object.keys(tsProject.config.compilerOptions?.paths || {}).length > 0;

  return new Promise((resolve, reject) => {
    let sourcesStream = gulp.src(sources);
    for (const [key, value] of Object.entries(envs)) {
      sourcesStream = sourcesStream
        .pipe(
          through2.obj(function _z(file, _encoding, cb) {
            if (!gulpMatch(file, '**/*.d.ts')) {
              this.push(file);
            }
            return cb();
          })
        )
        .pipe(gulpReplace(key, value));
    }

    const tsResult = sourcesStream
      .pipe(
        gulpIF(
          hasAlias,
          alias({
            paths: tsProject.config.compilerOptions.paths,
            cwd: projectRoot
          })
        )
      )
      .pipe(gulpIF(sourceMap, gulpSourceMaps.init()))
      .pipe(tsProject(gulpTS.reporter.longReporter()));

    // 监听编译错误，输出完整的 TypeScript 诊断信息
    let errorOccurred = false;
    tsResult.on('error', function _err(err) {
      errorOccurred = true;
      // 尝试从多个地方获取诊断信息
      const diagnostics = (tsResult as any).diagnostics || (tsProject as any).diagnostics || [];

      // 输出原始错误信息
      // eslint-disable-next-line no-console
      console.error('\n========================================');
      // eslint-disable-next-line no-console
      console.error('=== TypeScript Compilation Failed ===');
      // eslint-disable-next-line no-console
      console.error('========================================\n');

      if (diagnostics.length > 0) {
        // eslint-disable-next-line no-console
        console.error('TypeScript Diagnostics:');
        // eslint-disable-next-line no-console
        console.error('----------------------------------------');
        // eslint-disable-next-line no-console
        console.error(ts.formatDiagnostics(diagnostics, ts.createCompilerHost(ts.getDefaultCompilerOptions())));
        // eslint-disable-next-line no-console
        console.error('----------------------------------------\n');
      } else {
        // eslint-disable-next-line no-console
        console.error('Error details:');
        // eslint-disable-next-line no-console
        console.error('----------------------------------------');
        // eslint-disable-next-line no-console
        console.error(err);
        if (err && (err as Error).stack) {
          // eslint-disable-next-line no-console
          console.error('\nStack trace:');
          // eslint-disable-next-line no-console
          console.error((err as Error).stack);
        }
        // eslint-disable-next-line no-console
        console.error('----------------------------------------\n');
      }

      if (noEmitOnError) {
        reject(err);
        process.exit(1);
      } else {
        // @ts-ignore
        (this as NodeJS.ReadWriteStream).emit('end');
      }
    });

    merge([
      tsResult.js
        .pipe(
          through2.obj(async function z(file, encoding, next) {
            // only remove dead code
            const _contents = await minify(file.contents.toString(encoding), {
              compress: {
                unused: true,
                drop_debugger: true,
                drop_console: true,
                dead_code: true,
                global_defs: {},
                passes: 1
              },
              mangle: false,
              format: {
                beautify: true,
                comments: 'all'
              }
            });
            if (_contents.code) {
              file.contents = Buffer.from(_contents.code);
              this.push(file);
            } else {
              DebugCompile('UnRemove dead code for', file.path);
            }
            next();
          })
        )
        .pipe(
          through2.obj(function z(file, encoding, next) {
            this.push(file.clone());
            if (file.path.match(/(\/|\\)style(\/|\\)index\.js/)) {
              DebugCompile('CSS inject for', file.path);

              const content = file.contents.toString(encoding);

              file.contents = Buffer.from(cssInjection(content));
              file.path = file.path.replace(/index\.js/, 'css.js');

              this.push(file);
            }

            next();
          })
        )
        .pipe(gulp.dest(outputPath)),
      tsResult.js.pipe(gulpIF(sourceMap, gulpSourceMaps.write('.'))).pipe(gulp.dest(outputPath)),
      tsResult.dts.pipe(gulp.dest(outputPath))
    ])
      .on('finish', () => {
        // 检查是否有编译错误（在 finish 时检查，因为有些错误可能不会触发 error 事件）
        const diagnostics = (tsResult as any).diagnostics || (tsProject as any).diagnostics || [];
        if (diagnostics.length > 0 && !errorOccurred) {
          // eslint-disable-next-line no-console
          console.error('\n========================================');
          // eslint-disable-next-line no-console
          console.error('=== TypeScript Compilation Errors (detected on finish) ===');
          // eslint-disable-next-line no-console
          console.error('========================================\n');
          // eslint-disable-next-line no-console
          console.error(ts.formatDiagnostics(diagnostics, ts.createCompilerHost(ts.getDefaultCompilerOptions())));
          // eslint-disable-next-line no-console
          console.error('\n');

          if (noEmitOnError) {
            const error = new Error(`TypeScript compilation failed with ${diagnostics.length} error(s)`);
            reject(error);
            process.exit(1);
          }
        }
        if (diagnostics.length === 0 || !noEmitOnError) {
          resolve(undefined);
        }
      })
      .on('error', err => {
        // eslint-disable-next-line no-console
        console.error('\n=== Merge Stream Error ===');
        // eslint-disable-next-line no-console
        console.error(err);
        if (err && (err as Error).stack) {
          // eslint-disable-next-line no-console
          console.error((err as Error).stack);
        }
        reject(err);
      });
  });
}
