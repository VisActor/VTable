# 插件使用

获取插件包

```bash
npm install @visactor/vtable-plugins
```
引入插件

```ts
import { TableCarouselAnimationPlugin } from '@visactor/vtable-plugins';
```

使用插件  

```ts
const tableCarouselAnimationPlugin = new TableCarouselAnimationPlugin({
  ...
});
```

在插件列表中添加插件

```ts
const option: VTable.ListTableConstructorOptions = {
  ...
  plugins: [tableCarouselAnimationPlugin]
};
```

插件组合使用

```ts
const option: VTable.ListTableConstructorOptions = {
  ...
  plugins: [tableCarouselAnimationPlugin, ...]
};
```

插件使用顺序一般情况没有特殊要求，请详细阅读每个插件的文档，了解插件的执行时机，如果必要可阅读插件的源码。

如果你发现使用插件上存在问题，请及时反馈。