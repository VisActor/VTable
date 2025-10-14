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

### cdn引入

由于底层vrender的环境限制导致无法直接引入vtable-plugins的umd包！！！

且需要同时引入vrender和vtable的umd包，才能正常使用。

其中vtable的umd包也不能直接使用unpkg平台的，需要用户fork先vtable的源码，自己打包一份vtable的umd包！！！

打包之前需要注意要将下图所示[打包配置](https://github.com/VisActor/VTable/blob/develop/packages/vtable/bundler.config.js)中关于vrender的注释的代码放开。运行命令`cd packages/vtable && rushx build`得到dist目录下的vtable.js文件。
<div style="display: flex; justify-content: center;  width: 50%;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/sheet-build-umd.png"  style="width: 100%; object-fit: contain; padding: 10px;">
</div>
具体引用方式如下：

```html
<script src="https://unpkg.com/@visactor/vrender@latest/dist/index.js"></script>
<script src="vtable.js"></script>
<script src="https://unpkg.com/@visactor/vtable-plugins@latest/dist/vtable-plugins.js"></script>
```

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
| `TableExportPlugin` | 表格导出插件 | `ListTable`,`PivotTable` |
| `ExcelImportPlugin` | 导入execl，csv，json，html到表格中 | `ListTable` |
| `ContextMenuPlugin` | 右键菜单插件 | `ListTable` |
| `TableSeriesNumberPlugin` | 表格序号插件 | `ListTable` |

<br>

甘特图VTabe-Gantt组件目前支持的插件有：

| 插件名称 | 插件描述 | 适用对象 |
| --- | --- | --- |
| `ExportGanttPlugin` | 实现全量导出甘特图,可以自适应甘特图的大小 | `Gantt` |
| `ExcelImportPlugin` | 导入execl，csv，json，html到表格中 | `ListTable` |

## 插件事件

插件可以触发事件到表格，其他插件可以监听该类型事件。

如某个插件需要在内部处理逻辑中触发右键事件到表格，其他插件可以监听该类型事件。

```ts
const tableInstance =new ListTable(options);

const {
    PLUGIN_EVENT
} = VTable.ListTable.EVENT_TYPE;

tableInstance.fireListeners(VTable.TABLE_EVENT_TYPE.PLUGIN_EVENT, {
  plugin: this,
  event: nativeEvent,
   pluginEventInfo: {
     eventType: 'rightclick',
     colIndex: colIndex,
     ...
  } 
});
```
