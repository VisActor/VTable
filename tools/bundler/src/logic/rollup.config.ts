import type { RollupOptions, Plugin } from 'rollup';
import type { RawPackageJson } from './package';
import type { BabelPlugins } from './babel.config';
// import type { RollupBabelInputPluginOptions } from '@rollup/plugin-babel';

import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
// import typescript from '@rollup/plugin-typescript';
// import typescript2 from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import url from '@rollup/plugin-url';
import Alias from '@rollup/plugin-alias';
import postcss from 'rollup-plugin-postcss';
import strip from '@rollup/plugin-strip';
import vue from '@vitejs/plugin-vue';
import * as ts from 'typescript';
import * as path from 'path';
import { Config } from './config';

const useTypescriptPlugin2 = process.env.USE_TYPESCRIPT2 === 'true';
const typescript1 = require('@rollup/plugin-typescript');
const typescript2 = require('rollup-plugin-typescript2');

function transpileVueTsSfc(): Plugin {
  return {
    name: 'transpile-vue-ts-sfc',
    transform(code, id) {
      if (!id.includes('?vue')) {
        return null;
      }
      if (!id.includes('&lang.ts') && !id.includes('&lang.tsx')) {
        return null;
      }
      const result = ts.transpileModule(code, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2017,
          module: ts.ModuleKind.ESNext,
          jsx: ts.JsxEmit.Preserve,
          sourceMap: true
        },
        fileName: id
      });
      return {
        code: result.outputText,
        map: result.sourceMapText ? JSON.parse(result.sourceMapText) : null
      };
    }
  };
}

function transpileTsForRollup(): Plugin {
  return {
    name: 'transpile-ts-for-rollup',
    transform(code, id) {
      if (id.endsWith('.d.ts')) {
        return null;
      }
      const isTsLike = id.endsWith('.ts') || id.endsWith('.tsx') || id.includes('&lang.ts') || id.includes('&lang.tsx');
      if (!isTsLike) {
        return null;
      }
      const result = ts.transpileModule(code, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2017,
          module: ts.ModuleKind.ESNext,
          jsx: ts.JsxEmit.Preserve,
          sourceMap: true
        },
        fileName: id
      });
      return {
        code: result.outputText,
        map: result.sourceMapText ? JSON.parse(result.sourceMapText) : null
      };
    }
  };
}

function getExternal(
  rawPackageJson: RawPackageJson,
  userExternal: string[] | ((rawPackageJson: RawPackageJson) => string[])
): string[] {
  if (typeof userExternal === 'function') {
    return userExternal(rawPackageJson);
  }
  if (Array.isArray(userExternal) && userExternal.length) {
    return userExternal;
  }
  return Object.keys(rawPackageJson.peerDependencies || {});
}

export function getRollupOptions(
  projectRoot: string,
  entry: string,
  rawPackageJson: RawPackageJson,
  babelPlugins: BabelPlugins,
  config: Config,
  tsconfigOverride?: Record<string, unknown>
): RollupOptions {
  const tsconfigPath = path.resolve(projectRoot, config.tsconfig);
  const typescriptPlugin: Plugin = useTypescriptPlugin2
    ? typescript2(tsconfigOverride ? { tsconfig: tsconfigPath, tsconfigOverride } : { tsconfig: tsconfigPath })
    : typescript1({ tsconfig: tsconfigPath });
  return {
    input: entry,
    external: getExternal(rawPackageJson, config.external),
    ...config.rollupOptions,
    plugins: [
      resolve({
        extensions: ['.mjs', '.js', '.jsx', '.json', '.node', '.ts', '.tsx', '.mts', '.cts', '.vue']
      }),
      commonjs(),
      vue(),
      // typescript(),
      replace({ ...config.envs, preventAssignment: true }),
      transpileVueTsSfc(),
      typescriptPlugin,
      ...(useTypescriptPlugin2 ? [transpileTsForRollup()] : []),
      babel({ ...babelPlugins, babelHelpers: 'bundled' }),
      postcss({
        extensions: ['.css']
      }),
      strip({
        // set this to `false` if you don't want to
        // remove debugger statements
        debugger: true,
        include: ['**/*.js', '**/*.ts'],

        // defaults to `[ 'console.*', 'assert.*' ]`
        functions: ['console.*', 'assert.*'],
        labels: ['unittest'],

        // set this to `false` if you're not using sourcemaps –
        // defaults to `true`
        sourceMap: true
      }),
      url({
        limit: 8192, // 小于 8kb 的图片将被转换为 base64
        include: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
        fileName: 'static/media/[name].[hash:8].[ext]',
        publicPath: '/',
        destDir: path.resolve(projectRoot, config.outputDir.umd!)
      }),
      Alias({ entries: config.alias }),
      ...(config.minify ? [terser()] : []),
      ...((config.rollupOptions.plugins as Plugin[]) || [])
    ]
  };
}
