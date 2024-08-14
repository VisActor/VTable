import type * as VTable from '@visactor/vtable';

type IVTable = VTable.ListTable | VTable.PivotTable | VTable.PivotChart;
type CellRange = VTable.TYPES.CellRange;

const newLine = '\r\n';
const separator = ',';

export function exportVTableToCsv(tableInstance: IVTable): string {
  const minRow = 0;
  const maxRow = tableInstance.rowCount - 1;
  const minCol = 0;
  const maxCol = tableInstance.colCount - 1;

  let copyValue = '';
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      const copyCellValue = getCopyCellValue(col, row, tableInstance);
      if (typeof Promise !== 'undefined' && copyCellValue instanceof Promise) {
        // not support async
      } else {
        const strCellValue = `${copyCellValue}`;
        if (/^\[object .*\]$/.exec(strCellValue)) {
          // ignore object
        } else {
          copyValue += strCellValue;
        }
      }
      copyValue += separator;
    }
    copyValue += newLine;
  }
  return copyValue;
}

function getCopyCellValue(col: number, row: number, tableInstance: IVTable): string | Promise<string> | void {
  const cellRange: CellRange = tableInstance.getCellRange(col, row);
  const copyStartCol = cellRange.start.col;
  const copyStartRow = cellRange.start.row;

  if (copyStartCol !== col || copyStartRow !== row) {
    return '';
  }

  const value = tableInstance.getCellValue(col, row);
  return value;
}
