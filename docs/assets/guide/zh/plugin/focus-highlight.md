# 聚焦高亮插件

VTable 提供聚焦高亮插件，支持聚焦高亮指定区域。

<div style="display: flex; justify-content: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/invert-highlight.png" style="flex: 0 0 50%; padding: 10px;">
</div>

## 聚焦高亮插件配置项

- `FocusHighlightPlugin`  聚焦高亮插件，可以配置以下参数：
  - `fill` 聚焦高亮背景色
  - `opacity` 反选高亮透明度

```
export interface FocusHighlightPluginOptions {
  fill?: string;
  opacity?: number;
}
```

## 使用示例：
```js

  const highlightPlugin = new FocusHighlightPlugin({
    fill: '#000',
    opacity: 0.5
  });
  
  const option: VTable.ListTableConstructorOptions = {
    records,
    columns,
    theme: VTable.themes.DARK,
    plugins: [highlightPlugin]
  };
```

具体使用参考[demo](../../demo/interaction/head-highlight)

## 反选高亮插件 API

### setInvertHighlightRange

设置反选高亮范围。

```ts
setInvertHighlightRange(range: {
  start: {
    col: number;
    row: number;
  };
  end: {
    col: number;
    row: number;
  };
}): void;
```