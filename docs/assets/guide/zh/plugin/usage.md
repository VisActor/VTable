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


## 插件列表
| 插件名称 | 插件描述 |适用对象|
| --- | --- | --- |
| `AddRowColumnPlugin` | 添加行和列 | `ListTable` |
| `ColumnSeriesPlugin` | 列序号插件，可以指定表格列数，并定义生成列序号的函数 | `ListTable` |
| `RowSeriesPlugin` | 行序号插件,可以指定表格行数，并定义生成空号对应数据的函数 | `ListTable` |
| `HighlightHeaderWhenSelectCellPlugin` | 高亮选中单元格 | `ListTable`,`PivotTable` |
| `ExcelEditCellKeyboardPlugin` | Excel编辑单元格键盘插件 | `ListTable`,`PivotTable` |
| `TableCarouselAnimationPlugin` | 表格轮播动画插件 | `ListTable`,`PivotTable` |
| `RotateTablePlugin` | 表格旋转插件 | `ListTable`,`PivotTable` |