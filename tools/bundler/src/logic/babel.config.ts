import type { PluginItem } from '@babel/core';

export type BabelPlugins = {
  presets: PluginItem[];
  plugins: PluginItem[];
};
export function getBabelPlugins(packageName: string, es5 = true): BabelPlugins {
  const plugins = [
    require.resolve('@babel/plugin-proposal-export-default-from'),
    // require.resolve('@babel/plugin-transform-runtime'),
    require.resolve('@babel/plugin-proposal-class-properties'),
    [
      require.resolve('babel-plugin-import'),
      {
        style: true,
        libraryName: packageName,
        libraryDirectory: 'es',
        camel2DashComponentName: false
      }
    ]
  ];

  if (es5) {
    plugins.push(require.resolve('@babel/plugin-transform-runtime'));
  }

  const presets = [
    require.resolve('@babel/preset-react'),
    // require.resolve('@babel/preset-env'),
    require.resolve('@babel/preset-typescript')
  ];

  if (es5) {
    presets.push(require.resolve('@babel/preset-env'));
  }

  return {
    presets,
    plugins
  };
}
