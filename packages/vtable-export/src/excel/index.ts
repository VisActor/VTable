import ExcelJS from 'exceljs';
import { encodeCellAddress } from '../util/encode';
import type { CellType, IVTable } from '../util/type';
import { getCellAlignment, getCellBorder, getCellFill, getCellFont } from './style';

export async function exportVTableToExcel(tableInstance: IVTable) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('sheet1');

  const columns = [];
  const minRow = 0;
  const maxRow = tableInstance.rowCount - 1;
  const minCol = 0;
  const maxCol = tableInstance.colCount - 1;
  const mergeCells = [];
  const mergeCellSet = new Set();

  for (let col = minCol; col <= maxCol; col++) {
    const colWith = tableInstance.getColWidth(col);
    columns[col] = { width: colWith / 7 };
    for (let row = minRow; row <= maxRow; row++) {
      if (col === minCol) {
        const rowHeight = tableInstance.getRowHeight(row);
        const worksheetRow = worksheet.getRow(row + 1);
        worksheetRow.height = rowHeight * 0.75;
      }

      const cellValue = tableInstance.getCellValue(col, row);
      const cellStyle = tableInstance.getCellStyle(col, row);
      const cellType = tableInstance.getCellType(col, row);

      const cell = worksheet.getCell(encodeCellAddress(col, row));
      cell.value = getCellValue(cellValue, cellType);
      cell.font = getCellFont(cellStyle, cellType);
      cell.fill = getCellFill(cellStyle);
      cell.border = getCellBorder(cellStyle);
      cell.alignment = getCellAlignment(cellStyle);

      const cellRange = tableInstance.getCellRange(col, row);
      if (cellRange.start.col !== cellRange.end.col || cellRange.start.row !== cellRange.end.row) {
        const key = `${cellRange.start.col},${cellRange.start.row}:${cellRange.end.col},${cellRange.end.row}}`;
        if (!mergeCellSet.has(key)) {
          mergeCellSet.add(key);
          mergeCells.push(cellRange);
        }
      }
    }
  }

  worksheet.columns = columns;
  mergeCells.forEach(mergeCell => {
    worksheet.mergeCells(
      mergeCell.start.row + 1,
      mergeCell.start.col + 1,
      mergeCell.end.row + 1,
      mergeCell.end.col + 1
    );
  });
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

function getCellValue(cellValue: string, cellType: CellType) {
  if (cellType === 'link') {
    return {
      text: cellValue,
      hyperlink: cellValue,
      tooltip: cellValue
    };
  }
  return cellValue;
}
