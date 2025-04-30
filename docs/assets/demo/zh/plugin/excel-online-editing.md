---
category: examples
group: plugin
title: 类Excel在线编辑
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/excel-online-editing.gif
link: plugin/usage
option: plugins
---

# 类Excel在线编辑

基于VTable的插件机制，实现类Excel在线编辑功能。

在本示例中我们组合运用了以下插件：
- `AddRowColumnPlugin`：添加行和列；
- `ColumnSeriesPlugin`：列系列插件；
- `RowSeriesPlugin`：行系列插件；
- `HighlightHeaderWhenSelectCellPlugin`：高亮选中单元格；
- `ExcelEditCellKeyboardPlugin`：Excel编辑单元格键盘插件；

需要注意的是插件之间存在一定的依赖关系，如在新增行列插件`AddRowColumnPlugin`中，我们调用了`columnSeries.resetColumnCount`方法，重置列数，以确保新增列后，列数与列系列插件`ColumnSeriesPlugin`中的列数一致。

## 关键配置

- `editCellTrigger`: 编辑单元格触发方式
- `editor`: 编辑器类型
- `plugins`: 插件列表


## 代码演示

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
    columnCount: 26,
    autoExtendColumnTriggerKeys: ['ArrowRight', 'Tab']
  });
  const rowSeries = new VTablePlugins.RowSeriesPlugin({
    rowCount: 100,
    autoExtendRowTriggerKeys: ['ArrowDown', 'Enter'],
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
    frozenColCount: 1,
    defaultRowHeight: 30,
    keyboardOptions: {
      moveFocusCellOnEnter: true
    },
    plugins: [addRowColumn, columnSeries, rowSeries, highlightPlugin, excelEditCellKeyboardPlugin]
  };
  const tableInstance = new VTable.ListTable( document.getElementById(CONTAINER_ID),option);
  window.tableInstance = tableInstance;
  
```