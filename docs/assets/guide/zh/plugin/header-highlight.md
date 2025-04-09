# 表头高亮插件

VTable 提供表头高亮插件，支持选中单元格后，高亮对应的表头（行头和列头）。

<div style="display: flex; justify-content: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/head-highlight.png" style="flex: 0 0 50%; padding: 10px;">
</div>

## 表头高亮插件配置项

- `HeaderHighlightPlugin`  表头高亮插件，可以配置以下参数：
  - `columnHighlight` 是否高亮列头
  - `rowHighlight` 是否高亮行头
  - `colHighlightBGColor` 列头高亮背景色
  - `rowHighlightBGColor` 行头高亮背景色
  - `colHighlightColor` 列头高亮字体色
  - `rowHighlightColor` 行头高亮字体色
 
插件参数类型：
```
interface IHeaderHighlightPluginOptions {
  rowHighlight?: boolean;
  colHighlight?: boolean;
  colHighlightBGColor?: string;
  colHighlightColor?: string;
  rowHighlightBGColor?: string;
  rowHighlightColor?: string;
}
```

## 使用示例：
```js
  const highlightPlugin = new HighlightHeaderPlugin({
    colHighlight: true,
    rowHighlight: true
  });
  const option: VTable.ListTableConstructorOptions = {
    records,
    columns,
    select: {
      outsideClickDeselect: true,
      headerSelectMode: 'body'
    },
    plugins: [highlightPlugin]
  };
```

具体使用参考[demo](../../demo/interaction/head-highlight)
