import type { RollupOptions, Plugin } from 'rollup';
import type { RawPackageJson } from './package';
import type { BabelPlugins } from './babel.config';
import type { Alias as IAlias } from '@rollup/plugin-alias';
// import type { RollupBabelInputPluginOptions } from '@rollup/plugin-babel';

import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import url from '@rollup/plugin-url';
import Alias from '@rollup/plugin-alias';
import postcss from 'rollup-plugin-postcss';

export function getRollupOptions(
  entry: string,
  rawPackageJson: RawPackageJson,
  babelPlugins: BabelPlugins,
  envs: Record<string, string>,
  tsconfigFile: string,
  userRollupOptions: Omit<RollupOptions, 'output'>,
  minify: boolean,
  destDir: string,
  alias: Array<IAlias>,
  es5 = true
): RollupOptions {
  return {
    input: entry,
    external: Object.keys(rawPackageJson.peerDependencies || {}),
    ...userRollupOptions,
    plugins: [
      resolve(),
      commonjs(),
      babel({ ...babelPlugins, babelHelpers: es5 ? 'runtime' : 'bundled' }),
      replace({ ...envs, preventAssignment: true }),
      typescript({
        tsconfig: tsconfigFile,
        compilerOptions: {
          declaration: false
        }
      }),
      postcss({
        extensions: ['.css']
      }),
      url({
        limit: 8192, // 小于 8kb 的图片将被转换为 base64
        include: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
        fileName: 'static/media/[name].[hash:8].[ext]',
        publicPath: '/',
        destDir: destDir
      }),
      Alias({ entries: alias }),
      minify && terser(),
      ...((userRollupOptions.plugins as Plugin[]) || [])
    ]
  };
}
