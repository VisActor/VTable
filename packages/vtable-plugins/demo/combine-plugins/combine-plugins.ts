import * as VTable from '@visactor/vtable';
import { bindDebugTool } from '@visactor/vtable/es/scenegraph/debug-tool';
import { AddRowColumnPlugin, ColumnSeriesPlugin, RowSeriesPlugin } from '../../src';
import { InputEditor } from '@visactor/vtable-editors';
const CONTAINER_ID = 'vTable';
const input_editor = new InputEditor({});
VTable.register.editor('input', input_editor);

export function createTable() {
  const addRowColumn = new AddRowColumnPlugin({
    addColumnCallback: col => {
      columnSeries.resetColumnCount(columnSeries.pluginOptions.columnCount + 1);
    }
  });

  const columnSeries = new ColumnSeriesPlugin({
    columnCount: 100
  });
  const rowSeries = new RowSeriesPlugin({
    rowCount: 100
  });
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records: [],
    columns: [],
    padding: 30,
    editor: 'input',
    editCellTrigger: 'click',
    select: {
      disableSelect: true
    },
    plugins: [addRowColumn, columnSeries, rowSeries]
  };
  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });
}
