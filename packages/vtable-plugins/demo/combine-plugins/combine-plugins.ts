import * as VTable from '@visactor/vtable';
import { bindDebugTool } from '@visactor/vtable/es/scenegraph/debug-tool';
import {
  TableSeriesNumber,
  AddRowColumnPlugin,
  ColumnSeriesPlugin,
  ExcelEditCellKeyboardPlugin,
  HighlightHeaderWhenSelectCellPlugin,
  RowSeriesPlugin
} from '../../src';
import { InputEditor } from '@visactor/vtable-editors';
import { table } from 'console';
const CONTAINER_ID = 'vTable';
const input_editor = new InputEditor({});
VTable.register.editor('input', input_editor);

export function createTable() {
  const tableSeriesNumberPlugin = new TableSeriesNumber({
    rowCount: 1000,
    colCount: 100,
    rowHeight: 30,
    colWidth: 50
  });
  const addRowColumn = new AddRowColumnPlugin({
    addColumnCallback: col => {
      columnSeries.resetColumnCount(columnSeries.pluginOptions.columnCount + 1);
      const newRecords = tableInstance.records.map(record => {
        if (Array.isArray(record)) {
          record.splice(col - 1, 0, '');
        }
        return record;
      });
      tableInstance.setRecords(newRecords);
    },
    addRowCallback: row => {
      tableInstance.addRecord([], row - tableInstance.columnHeaderLevelCount);
    }
  });

  const columnSeries = new ColumnSeriesPlugin({
    columnCount: 26,
    autoExtendColumnTriggerKeys: ['ArrowRight', 'Tab']
  });
  const rowSeries = new RowSeriesPlugin({
    rowCount: 100,
    autoExtendRowTriggerKeys: ['ArrowDown', 'Enter'],
    fillRowRecord: (index: number) => {
      return [];
    },
    rowSeriesNumber: {
      width: 'auto'
    }
  });
  const highlightPlugin = new HighlightHeaderWhenSelectCellPlugin({
    colHighlight: true,
    rowHighlight: true
  });
  const excelEditCellKeyboardPlugin = new ExcelEditCellKeyboardPlugin();
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
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
    editCellTrigger: ['api', 'keydown', 'doubleclick'],
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
      // editCellOnEnter: false
    },
    plugins: [
      tableSeriesNumberPlugin,
      addRowColumn,
      columnSeries,
      rowSeries,
      highlightPlugin,
      excelEditCellKeyboardPlugin
    ]
  };
  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });
}
