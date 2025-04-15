# Plugin Usage

Get the plugin package

```bash
npm install @visactor/vtable-plugins
```
Import plugins

```ts
import { TableCarouselAnimationPlugin } from '@visactor/vtable-plugins';
```

Use the plugin  

```ts
const tableCarouselAnimationPlugin = new TableCarouselAnimationPlugin({
  ...
});
```

Add the plugin to the plugin list

```ts
const option: VTable.ListTableConstructorOptions = {
  ...
  plugins: [tableCarouselAnimationPlugin]
};
```

Combining multiple plugins

```ts
const option: VTable.ListTableConstructorOptions = {
  ...
  plugins: [tableCarouselAnimationPlugin, ...]
};
```

The order of plugin usage generally has no special requirements. Please carefully read the documentation for each plugin to understand its execution timing, and if necessary, refer to the plugin's source code.

If you encounter issues with plugin usage, please provide feedback promptly.