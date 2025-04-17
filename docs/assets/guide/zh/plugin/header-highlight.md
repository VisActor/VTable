# 选中单元格对应表头高亮插件

VTable 提供选中单元格对应表头高亮插件，支持选中单元格后，高亮对应的表头（行头和列头）。

<div style="display: flex; justify-content: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/head-highlight.png" style="flex: 0 0 50%; padding: 10px;">
</div>

## 表头高亮插件配置项

- `HighlightHeaderWhenSelectCellPlugin` 选中单元格对应表头高亮插件，可以配置以下参数：
  - `columnHighlight` 是否高亮列头
  - `rowHighlight` 是否高亮行头
  - `colHighlightBGColor` 列头高亮背景色
  - `rowHighlightBGColor` 行头高亮背景色
  - `colHighlightColor` 列头高亮字体色
  - `rowHighlightColor` 行头高亮字体色
 
插件参数类型：
```
interface IHighlightHeaderWhenSelectCellPluginOptions {
  rowHighlight?: boolean;
  colHighlight?: boolean;
  colHighlightBGColor?: string;
  colHighlightColor?: string;
  rowHighlightBGColor?: string;
  rowHighlightColor?: string;
}
```

## 使用示例：


```javascript livedemo template=vtable
//  import * as VTable from '@visactor/vtable';
// 使用时需要引入插件包@visactor/vtable-plugins
// import * as VTablePlugins from '@visactor/vtable-plugins';
// 正常使用方式 const columnSeries = new VTable.plugins.ColumnSeriesPlugin({});
// 官网编辑器中将 VTable.plugins重命名成了VTablePlugins

const generatePersons = count => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `小明${i + 1}`,
    lastName: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' + (i + 1) : 'front-end engineer' + (i + 1),
    city: 'beijing',
    image:
      '<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M34 10V4H8V38L14 35" stroke="#f5a623" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 44V10H40V44L27 37.7273L14 44Z" fill="#f5a623" stroke="#f5a623" stroke-width="1" stroke-linejoin="round"/></svg>'
  }));
};

  const highlightPlugin = new VTablePlugins.HighlightHeaderWhenSelectCellPlugin({
    colHighlight: true,
    rowHighlight: true
  });
  const option = {
    records: generatePersons(20),
    rowSeriesNumber: {},
    columns:[
    {
      field: 'email1',
      title: 'email',
      width: 200,
      sort: true,
      style: {
        underline: true,
        underlineDash: [2, 0],
        underlineOffset: 3
      }
    },

        {
          field: 'name',
          title: 'First Name',
          width: 200
        },
        {
          field: 'name',
          title: 'Last Name',
          width: 200
        },

    {
      field: 'date1',
      title: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      title: 'sex',
      width: 100
    }
  ],

    plugins: [highlightPlugin]
  };
  const tableInstance = new VTable.ListTable( document.getElementById(CONTAINER_ID),option);
  window.tableInstance = tableInstance;
```

具体使用参考[demo](../../demo/interaction/head-highlight)
