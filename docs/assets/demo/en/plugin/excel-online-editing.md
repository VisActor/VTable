---
category: examples
group: plugin
title: Excel-like Online Editing
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/excel-online-editing.gif
link: plugin/usage
option: plugins
---

# Excel-like Online Editing

Based on VTable's plugin mechanism, this example implements Excel-like online editing functionality.

In this example, we use the following plugins in combination:
- `AddRowColumnPlugin`: Add rows and columns
- `PastedAddRowColumnPlugin`: Add new rows or columns when there are not enough rows or columns when pasting
- `ColumnSeriesPlugin`: Column series plugin
- `RowSeriesPlugin`: Row series plugin
- `HighlightHeaderWhenSelectCellPlugin`: Highlight selected cells
- `ExcelEditCellKeyboardPlugin`: Excel-style cell editing keyboard plugin

It's important to note that there are dependencies between plugins. For example, in the `AddRowColumnPlugin`, we call the `columnSeries.resetColumnCount` method to reset the column count, ensuring that after adding columns, the count remains consistent with the column count in the `ColumnSeriesPlugin`.

## Key Configuration

- `editCellTrigger`: Cell editing trigger method
- `editor`: Editor type
- `plugins`: Plugin list


## Code Demo

```javascript livedemo template=vtable
//  import * as VTable from '@visactor/vtable';
// 使用时需要引入插件包@visactor/vtable-plugins
// import * as VTablePlugins from '@visactor/vtable-plugins';
// 正常使用方式 const columnSeries = new VTable.plugins.ColumnSeriesPlugin({});
// 官网编辑器中将 VTable.plugins重命名成了VTablePlugins

// 注册编辑器
const input_editor = new VTable_editors.InputEditor();
VTable.register.editor('input', input_editor);

// 注册插件
  const addRowColumn = new VTablePlugins.AddRowColumnPlugin({
    addColumnCallback: col => {
      // 新增列时，重置列数
      columnSeries.resetColumnCount(columnSeries.pluginOptions.columnCount + 1);
      // 将table实例中的数据源records每一个数组中新增一个空字符串，对应新增的列
      const newRecords = tableInstance.records.map(record => {
        if (Array.isArray(record)) {
          record.splice(col - 1, 0, '');
        }
        return record;
      });
      tableInstance.setRecords(newRecords);
    },
    addRowCallback: row => {
      // 新增行时，填充空行数据
      tableInstance.addRecord([], row - tableInstance.columnHeaderLevelCount);
    }
  });

  const columnSeries = new VTablePlugins.ColumnSeriesPlugin({
    columnCount: 26
  });
  const rowSeries = new VTablePlugins.RowSeriesPlugin({
    rowCount: 100,
    //records数据以外 填充空行数据
    fillRowRecord: (index) => {
      return [];
    },
    rowSeriesNumber: {
      width: 'auto'
    }
  });
  const highlightPlugin = new VTablePlugins.HighlightHeaderWhenSelectCellPlugin({
    colHighlight: true,
    rowHighlight: true
  });
  const excelEditCellKeyboardPlugin = new VTablePlugins.ExcelEditCellKeyboardPlugin();
  const option = {
    // 二维数组的数据 和excel的行列一致
    records: [
      ['姓名', '年龄', '地址'],
      ['张三', 18, '北京'],
      ['李四', 20, '上海'],
      ['王五', 22, '广州'],
      ['赵六', 24, '深圳'],
      ['孙七', 26, '成都']
    ],

    padding: 30,
    editor: 'input',
    editCellTrigger: ['api', 'keydown', 'doubleclick'],// 编辑单元格触发方式
    select: {
      cornerHeaderSelectMode: 'body',
      headerSelectMode: 'body'
    },
    theme: VTable.themes.DEFAULT.extends({
      defaultStyle: {
        textAlign: 'left',
        padding: [2, 6, 2, 6]
      },
      headerStyle: {
        textAlign: 'center'
      }
    }),
    defaultRowHeight: 30,
    plugins: [addRowColumn, columnSeries, rowSeries, highlightPlugin, excelEditCellKeyboardPlugin]
  };
  const tableInstance = new VTable.ListTable( document.getElementById(CONTAINER_ID),option);
  window.tableInstance = tableInstance;
  
```