# Highlight Header When Cell Selected Plugin

VTable provides a plugin to highlight the corresponding headers when a cell is selected, supporting highlighting of row and column headers.

<div style="display: flex; justify-content: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/head-highlight.png" style="flex: 0 0 50%; padding: 10px;">
</div>

## Header Highlight Plugin Configuration Options

- `HighlightHeaderWhenSelectCellPlugin` Header highlight when cell selected plugin, can be configured with the following parameters:
  - `columnHighlight` Whether to highlight column headers
  - `rowHighlight` Whether to highlight row headers
  - `colHighlightBGColor` Column header highlight background color
  - `rowHighlightBGColor` Row header highlight background color
  - `colHighlightColor` Column header highlight font color
  - `rowHighlightColor` Row header highlight font color
 
Plugin parameter types:
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

## Usage Example:


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

For specific usage, refer to the [demo](../../demo/interaction/head-highlight)
