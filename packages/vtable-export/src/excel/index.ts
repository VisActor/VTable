import ExcelJS from 'exceljs';
import { encodeCellAddress } from '../util/encode';
import type { CellType, IVTable } from '../util/type';
import { getCellAlignment, getCellBorder, getCellFill, getCellFont } from './style';
import { updateCell, renderChart, graphicUtil } from '@visactor/vtable';
import { isArray } from '@visactor/vutils';
import type { ColumnDefine, IRowSeriesNumber } from '@visactor/vtable/src/ts-types';

export type CellInfo = {
  cellType: string;
  cellValue: string;
  table: IVTable;
  col: number;
  row: number;
};

export type ExportVTableToExcelOptions = {
  ignoreIcon?: boolean;
  formatExportOutput?: (cellInfo: CellInfo) => string | undefined;
};

export async function exportVTableToExcel(tableInstance: IVTable, options?: ExportVTableToExcelOptions) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('sheet1');
  worksheet.properties.defaultRowHeight = 40;

  const columns = [];
  const minRow = 0;
  const maxRow = tableInstance.rowCount - 1;
  const minCol = 0;
  const maxCol = tableInstance.colCount - 1;
  const mergeCells = [];
  const mergeCellSet = new Set();

  for (let col = minCol; col <= maxCol; col++) {
    const colWith = tableInstance.getColWidth(col);
    columns[col] = { width: colWith / 6 };
    for (let row = minRow; row <= maxRow; row++) {
      if (col === minCol) {
        const rowHeight = tableInstance.getRowHeight(row);
        const worksheetRow = worksheet.getRow(row + 1);
        // worksheetRow.height = rowHeight * 0.75;
        worksheetRow.height = rowHeight;
      }

      addCell(col, row, tableInstance, worksheet, workbook, options);

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

  // frozen
  const frozenView: ExcelJS.WorksheetViewFrozen[] = [];
  // top frozen
  if (tableInstance.frozenRowCount > 0) {
    frozenView.push({
      state: 'frozen',
      ySplit: tableInstance.frozenRowCount,
      // activeCell: 'A1',
      topLeftCell: encodeCellAddress(0, tableInstance.frozenRowCount)
    });
  }
  // left frozen
  if (tableInstance.frozenColCount > 0) {
    frozenView.push({
      state: 'frozen',
      xSplit: tableInstance.frozenColCount,
      // activeCell: 'A1',
      topLeftCell: encodeCellAddress(tableInstance.frozenColCount, 0)
    });
  }
  // not support bottom&right frozen
  worksheet.views = frozenView;

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

function addCell(
  col: number,
  row: number,
  tableInstance: IVTable,
  worksheet: ExcelJS.Worksheet,
  workbook: ExcelJS.Workbook,
  options?: ExportVTableToExcelOptions
) {
  const { layoutMap } = tableInstance.internalProps;
  const cellType = tableInstance.getCellType(col, row);
  const cellValue = tableInstance.getCellValue(col, row);
  const cellStyle = tableInstance.getCellStyle(col, row);

  const cellLocation = tableInstance.getCellLocation(col, row);
  const define =
    cellLocation !== 'body' ? tableInstance.getHeaderDefine(col, row) : tableInstance.getBodyColumnDefine(col, row);
  const mayHaveIcon =
    cellLocation !== 'body'
      ? true
      : (define as IRowSeriesNumber)?.dragOrder || !!define?.icon || !!(define as ColumnDefine)?.tree;
  let icons;
  if (mayHaveIcon) {
    icons = tableInstance.getCellIcons(col, row);
  }
  let customRender;
  let customLayout;
  if (cellLocation !== 'body') {
    customRender = (define as ColumnDefine)?.headerCustomRender;
    customLayout = (define as ColumnDefine)?.headerCustomLayout;
  } else {
    customRender = (define as ColumnDefine)?.customRender || tableInstance.customRender;
    customLayout = (define as ColumnDefine)?.customLayout;
  }

  if (options?.formatExportOutput) {
    const cellInfo = { cellType, cellValue, table: tableInstance, col, row };
    const formattedValue = options.formatExportOutput(cellInfo);
    if (formattedValue !== undefined) {
      const cell = worksheet.getCell(encodeCellAddress(col, row));
      cell.value = formattedValue;
      cell.font = getCellFont(cellStyle, cellType);
      cell.fill = getCellFill(cellStyle);
      cell.border = getCellBorder(cellStyle);
      cell.alignment = getCellAlignment(cellStyle);
      return;
    }
  }

  if (
    cellType === 'image' ||
    cellType === 'video' ||
    cellType === 'progressbar' ||
    cellType === 'sparkline' ||
    layoutMap.isAxisCell(col, row) ||
    (!options?.ignoreIcon && isArray(icons) && icons.length) ||
    customRender ||
    customLayout
  ) {
    const cellImageBase64 = exportCellImg(col, row, tableInstance);
    const imageId = workbook.addImage({
      base64: cellImageBase64,
      extension: 'png'
    });
    worksheet.addImage(imageId, {
      tl: { col: col + 1 / 80, row: row + 1 / 120 } as any, // ~1px
      br: { col: col + 1, row: row + 1 } as any,
      editAs: 'oneCell'
      // ext: { width: tableInstance.getColWidth(col), height: tableInstance.getRowHeight(row) }
    });
  } else if (cellType === 'text' || cellType === 'link') {
    const cell = worksheet.getCell(encodeCellAddress(col, row));
    cell.value = getCellValue(cellValue, cellType);
    cell.font = getCellFont(cellStyle, cellType);
    cell.fill = getCellFill(cellStyle);
    cell.border = getCellBorder(cellStyle);
    cell.alignment = getCellAlignment(cellStyle);
  } else if (cellType === 'chart') {
    const cellGroup = tableInstance.scenegraph.getCell(col, row);
    renderChart(cellGroup.firstChild as any); // render chart first
    const cellImageBase64 = exportCellImg(col, row, tableInstance);
    const imageId = workbook.addImage({
      base64: cellImageBase64,
      extension: 'png'
    });
    worksheet.addImage(imageId, {
      tl: { col: col + 1 / 80, row: row + 1 / 120 } as any, // ~1px
      br: { col: col + 1, row: row + 1 } as any,
      editAs: 'oneCell'
      // ext: { width: tableInstance.getColWidth(col), height: tableInstance.getRowHeight(row) }
    });
    tableInstance.scenegraph.updateNextFrame(); // rerender chart to avoid display error
  }
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

function exportCellImg(col: number, row: number, tableInstance: IVTable) {
  let cellGroup = tableInstance.scenegraph.getCell(col, row);
  let needRemove = false;
  if (cellGroup.role === 'empty') {
    cellGroup = updateCell(col, row, tableInstance as any, true);
    cellGroup.setStage(tableInstance.scenegraph.stage);
    needRemove = true;
  }
  const oldStroke = cellGroup.attribute.stroke;
  cellGroup.attribute.stroke = false;
  const canvas = graphicUtil.drawGraphicToCanvas(cellGroup as any, tableInstance.scenegraph.stage) as HTMLCanvasElement;
  cellGroup.attribute.stroke = oldStroke;
  if (needRemove) {
    cellGroup.parent?.removeChild(cellGroup);
  }
  return canvas.toDataURL();
}
