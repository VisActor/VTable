import ExcelJS from 'exceljs';
import { encodeCellAddress } from '../util/encode';
import type { CellStyle, IVTable } from '../util/type';

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

      const cell = worksheet.getCell(encodeCellAddress(col, row));
      cell.value = cellValue;
      cell.font = getCellFont(cellStyle);
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

function getCellFont(cellStyle: CellStyle): Partial<ExcelJS.Font> {
  return {
    // name: cellStyle.fontFamily || 'Arial', // only one font familt name
    name: 'Arial',
    size: cellStyle.fontSize || 10,
    bold: cellStyle.fontWeight === 'bold', // only bold or not
    italic: cellStyle.fontStyle === 'italic', // only italic or not
    color: getColor('#000000'),
    underline: cellStyle.underline
  };
}

function getCellFill(cellStyle: CellStyle): ExcelJS.Fill {
  return {
    type: 'pattern',
    pattern: 'solid',
    fgColor: getColor(cellStyle.bgColor)
  };
}

function getCellBorder(cellStyle: CellStyle): Partial<ExcelJS.Borders> {
  return {
    top: {
      style: 'medium',
      color: getColor(cellStyle.borderColor)
    },
    left: {
      style: 'medium',
      color: getColor(cellStyle.borderColor)
    },
    bottom: {
      style: 'medium',
      color: getColor(cellStyle.borderColor)
    },
    right: {
      style: 'medium',
      color: getColor(cellStyle.borderColor)
    }
  };
}

function getCellAlignment(cellStyle: CellStyle): Partial<ExcelJS.Alignment> {
  return {
    horizontal: cellStyle.textAlign || 'left',
    vertical: cellStyle.textBaseline,
    wrapText: cellStyle.autoWrapText || false
  };
}

function getColor(color: string) {
  return {
    argb: 'FF' + color.substring(1).toUpperCase()
  };
}
