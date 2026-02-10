import { VTableSheet, TYPES, VTable } from '../../src/index';
import * as VTablePlugins from '@visactor/vtable-plugins';
import { VTableSheetEventType } from '../../src/ts-types/spreadsheet-events';
const CONTAINER_ID = 'vTable';
export function createTable() {
  // 清理之前的实例（如果存在）
  if ((window as any).sheetInstance) {
    (window as any).sheetInstance.release();
    (window as any).sheetInstance = null;
  }

  const sheetInstance = new VTableSheet(document.getElementById(CONTAINER_ID)!, {
    showSheetTab: true,
    // defaultRowHeight: 25,
    // defaultColWidth: 100,
    sheets: [
      {
        rowCount: 200,
        columnCount: 10,
        sheetKey: 'sheet1',
        sheetTitle: 'sheet1',
        filter: true,
        columns: [
          {
            title: '名称',
            sort: true,
            width: 100
          }
        ],
        data: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12], ['放到', '个', '哦'], [], [null, null, 30]],
        formulas: {
          C8: '=sum(C2:C5)'
        },
        active: true
      }
    ]
  });
  window.sheetInstance = sheetInstance;
  //删除第3行数据
  sheetInstance.getActiveSheet().tableInstance?.deleteRecords([2]);
  // const tableInstance = sheetInstance.getActiveSheet().tableInstance;

  // sheetInstance.formulaManager.setCellContent({ sheet: 'sheet1', row: 7, col: 3 }, '=SUM(C2:C5)');
  // const result = sheetInstance.formulaManager.getCellValue({
  //   sheet: 'sheet1',
  //   row: 7,
  //   col: 3
  // });
  // sheetInstance
  //   .getActiveSheet()
  //   .tableInstance?.changeCellValue(3, 7, result.error ? '#ERROR!' : result.value, false, false);
  //删除第3行数据
  // sheetInstance.getActiveSheet().tableInstance?.deleteRecords([2]);
  // debugger;
  // sheetInstance.getActiveSheet().tableInstance?.startEditCell(3, 6);

  // bindDebugTool(sheetInstance.activeWorkSheet.scenegraph.stage as any, {
  //   customGrapicKeys: ['role', '_updateTag']
  // });
}
