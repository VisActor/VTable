import XLSX from 'xlsx-js-style';
import { getCellStyle } from './style-xlsx-js';
import type { CellRange, IVTable } from '../util/type';

export function exportVTableToExcel(tableInstance: IVTable) {
  const workSheet = exportVTableToWorkSheet(tableInstance);
  const workBook = createWorkBook(workSheet);

  const workBookExport = XLSX.write(workBook, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  });

  return workBookExport;
}

function createWorkBook(workSheet: any, name: string = 'sheet') {
  const workBook = { SheetNames: [] as any, Sheets: {} };

  workBook.SheetNames.push(name);
  workBook.Sheets[name] = workSheet;

  return workBook;
}

function exportVTableToWorkSheet(tableInstance: IVTable) {
  const minRow = 0;
  const maxRow = tableInstance.rowCount - 1;
  const minCol = 0;
  const maxCol = tableInstance.colCount - 1;

  const workSheet = {};
  const mergeCells = [];
  const mergeCellSet = new Set();
  const columnsWidth = [];
  const rowsWidth = [];

  for (let col = minCol; col <= maxCol; col++) {
    const colWith = tableInstance.getColWidth(col);
    columnsWidth[col] = { wpx: colWith };
    for (let row = minRow; row <= maxRow; row++) {
      if (!rowsWidth[row]) {
        const rowHeight = tableInstance.getRowHeight(row);
        rowsWidth[row] = { hpx: rowHeight };
      }

      const cellValue = tableInstance.getCellValue(col, row);
      const cell: XLSX.CellObject = {
        v: cellValue,
        t: typeof cellValue === 'number' ? 'n' : 's'
      };
      if (cellValue) {
        cell.s = getCellStyle(col, row, tableInstance);
      }
      workSheet[encodeCellAddress(col, row)] = cell;

      const cellRange = tableInstance.getCellRange(col, row);
      if (cellRange.start.col !== cellRange.end.col || cellRange.start.row !== cellRange.end.row) {
        const key = `${cellRange.start.col},${cellRange.start.row}:${cellRange.end.col},${cellRange.end.row}}`;
        if (!mergeCellSet.has(key)) {
          mergeCellSet.add(key);
          mergeCells.push({
            s: { c: cellRange.start.col, r: cellRange.start.row },
            e: { c: cellRange.end.col, r: cellRange.end.row }
          });
        }
      }
    }
  }

  const tableRange = encodeCellRange({
    start: {
      col: 0,
      row: 0
    },
    end: {
      col: tableInstance.colCount - 1,
      row: tableInstance.rowCount - 1
    }
  });

  workSheet['!ref'] = tableRange;
  workSheet['!merges'] = mergeCells;
  workSheet['!cols'] = columnsWidth;
  workSheet['!rows'] = rowsWidth;

  return workSheet;
}

/**
 * @description: comvert cell range to code
 * @param {CellRange} cellRange
 * @return {*}
 */
function encodeCellRange(cellRange: CellRange) {
  const start = encodeCellAddress(cellRange.start.col, cellRange.start.row);
  const end = encodeCellAddress(cellRange.end.col, cellRange.end.row);
  return `${start}:${end}`;
}

/**
 * @description: convert cell address to code
 * @param {number} col
 * @param {number} row
 * @return {*}
 */
function encodeCellAddress(col: number, row: number) {
  let s = '';
  for (let column = col + 1; column > 0; column = Math.floor((column - 1) / 26)) {
    s = String.fromCharCode(((column - 1) % 26) + 65) + s;
  }
  return s + (row + 1);
}
