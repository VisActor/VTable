import type { IVTable } from '../util/type';
import type XLSX from 'xlsx-js-style';
import type * as VTable from '@visactor/vtable';

export function getCellStyle(col: number, row: number, tableInstance: IVTable): XLSX.CellStyle {
  const cellStyle = tableInstance.getCellStyle(col, row);
  return {
    alignment: getCellAlignment(col, row, cellStyle),
    border: getCellBorder(col, row, cellStyle),
    fill: getCellFill(col, row, cellStyle),
    font: getCellFont(col, row, cellStyle)
  };
}

function getCellAlignment(col: number, row: number, cellStyle: VTable.TYPES.CellStyle): XLSX.CellStyle['alignment'] {
  return {
    horizontal: cellStyle.textAlign || 'left',
    vertical: 'center', // no middle, use center
    wrapText: cellStyle.autoWrapText || false
  };
}

function getCellBorder(col: number, row: number, cellStyle: VTable.TYPES.CellStyle): XLSX.CellStyle['border'] {
  return {
    top: { color: getColor(cellStyle.borderColor) },
    left: { color: getColor(cellStyle.borderColor) },
    bottom: { color: getColor(cellStyle.borderColor) },
    right: { color: getColor(cellStyle.borderColor) }
  };
}

function getCellFill(col: number, row: number, cellStyle: VTable.TYPES.CellStyle): XLSX.CellStyle['fill'] {
  return {
    fgColor: getColor(cellStyle.bgColor)
  };
}

function getCellFont(col: number, row: number, cellStyle: VTable.TYPES.CellStyle): XLSX.CellStyle['font'] {
  return {
    name: cellStyle.fontFamily || 'Arial', // only one font familt name
    sz: cellStyle.fontSize || 10,
    bold: cellStyle.fontWeight === 'bold', // only bold or not
    italic: cellStyle.fontStyle === 'italic', // only italic or not
    color: getColor(cellStyle.color),
    underline: cellStyle.underline
  };
}

function getColor(color: string) {
  return {
    rgb: color.substring(1)
  };
}
