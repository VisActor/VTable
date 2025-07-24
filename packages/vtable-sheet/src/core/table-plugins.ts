import type * as VTable from '@visactor/vtable';
import * as VTablePlugins from '@visactor/vtable-plugins';
export function getTablePlugins() {
  // 注册插件
  const addRowColumn = new VTablePlugins.AddRowColumnPlugin({
    // addColumnCallback: (col: number, tableInstance: VTable.ListTable) => {
    //   // 新增列时，重置列数
    //   columnSeries.resetColumnCount(columnSeries.pluginOptions.columnCount + 1);
    //   // 将table实例中的数据源records每一个数组中新增一个空字符串，对应新增的列
    //   const newRecords = tableInstance.records.map(record => {
    //     if (Array.isArray(record)) {
    //       record.splice(col - 1, 0, '');
    //     }
    //     return record;
    //   });
    //   tableInstance.setRecords(newRecords);
    // },
    addRowCallback: (row: number, tableInstance: VTable.ListTable) => {
      // 新增行时，填充空行数据
      tableInstance.addRecord([], row - tableInstance.columnHeaderLevelCount);
    }
  });

  // const columnSeries = new VTablePlugins.ColumnSeriesPlugin({
  //   columnCount: 26,
  //   autoExtendColumnTriggerKeys: ['ArrowRight', 'Tab']
  // });
  // const rowSeries = new VTablePlugins.RowSeriesPlugin({
  //   rowCount: 100,
  //   autoExtendRowTriggerKeys: ['ArrowDown', 'Enter'],
  //   //records数据以外 填充空行数据
  //   fillRowRecord: (index: number) => {
  //     return [];
  //   },
  //   rowSeriesNumber: {
  //     width: 'auto'
  //   }
  // });
  const tableSeriesNumberPlugin = new VTablePlugins.TableSeriesNumber({
    rowCount: 100,
    colCount: 100,
    rowSeriesNumberWidth: 30,
    colSeriesNumberHeight: 30
  });
  const highlightPlugin = new VTablePlugins.HighlightHeaderWhenSelectCellPlugin({
    colHighlight: true,
    rowHighlight: true
  });
  const contextMenuPlugin = new VTablePlugins.ContextMenuPlugin({});
  const excelEditCellKeyboardPlugin = new VTablePlugins.ExcelEditCellKeyboardPlugin();
  return [addRowColumn, highlightPlugin, excelEditCellKeyboardPlugin, tableSeriesNumberPlugin, contextMenuPlugin];
}
