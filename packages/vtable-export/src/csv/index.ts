import type * as VTable from '@visactor/vtable';
import type { CellInfo } from '../excel';
import { handlePaginationExport } from '../util/pagination';

type IVTable = VTable.ListTable | VTable.PivotTable | VTable.PivotChart;
type CellRange = VTable.TYPES.CellRange;

const newLine = '\r\n';
const separator = ',';

export type ExportVTableToCsvOptions = {
  formatExportOutput?: (cellInfo: CellInfo) => string | undefined;
  escape?: boolean;
  exportAllData?: boolean;
};

export function exportVTableToCsv(tableInstance: IVTable, option?: ExportVTableToCsvOptions): string {
  const exportAllData = !!option?.exportAllData;
  const { handleRowCount, reset } = handlePaginationExport(tableInstance, exportAllData);
  const minRow = 0;
  const maxRow = handleRowCount();
  const minCol = 0;
  const maxCol = tableInstance.colCount - 1;

  let copyValue = '';
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      const copyCellValue = getCopyCellValue(col, row, tableInstance, option);
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
  // 恢复透视表的pagination配置
  reset();
  return copyValue;
}

function getCopyCellValue(
  col: number,
  row: number,
  tableInstance: IVTable,
  option?: ExportVTableToCsvOptions
): string | Promise<string> | void {
  const rawRecord = tableInstance.getCellRawRecord(col, row);
  const cellValue = (rawRecord && rawRecord.vtableMergeName) ?? tableInstance.getCellValue(col, row, false);

  if (option?.formatExportOutput) {
    const cellType = tableInstance.getCellType(col, row);
    const cellInfo = { cellType, cellValue, table: tableInstance, col, row };
    const formattedValue = option.formatExportOutput(cellInfo);
    if (formattedValue !== undefined) {
      if (typeof formattedValue === 'string') {
        return '"' + formattedValue + '"';
      }
      return formattedValue;
    }
  }
  const cellRange: CellRange = tableInstance.getCellRange(col, row);
  const copyStartCol = cellRange.start.col;
  const copyStartRow = cellRange.start.row;

  if (copyStartCol !== col || copyStartRow !== row) {
    return '';
  }

  let value = cellValue;
  if (option?.escape) {
    value = escapeForCSV(value);
  } else if (typeof value === 'string') {
    value = '"' + value + '"';
  }
  return value;
}

/**
 * 将字符串中的特殊符号进行转义，以避免干扰CSV解析
 * @param {string} str - 需要处理的字符串
 * @return {string} - 已处理的字符串
 */
function escapeForCSV(str: any) {
  if (typeof str !== 'string') {
    return str;
  }

  // 替换双引号为两个双引号
  let escapedStr = str.replace(/"/g, '""');

  // 如果字符串中包含逗号、换行符或双引号，则需要用双引号包裹
  if (/[,"\r\n]/.test(escapedStr)) {
    escapedStr = `"${escapedStr}"`;
  }

  return escapedStr;
}
