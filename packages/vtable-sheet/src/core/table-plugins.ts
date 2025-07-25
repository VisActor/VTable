import type * as VTable from '@visactor/vtable';
import * as VTablePlugins from '@visactor/vtable-plugins';
export function getTablePlugins() {
  // 注册插件
  const addRowColumn = new VTablePlugins.AddRowColumnPlugin({
    addRowCallback: (row: number, tableInstance: VTable.ListTable) => {
      // 新增行时，填充空行数据
      tableInstance.addRecord([], row - tableInstance.columnHeaderLevelCount);
    }
  });

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
