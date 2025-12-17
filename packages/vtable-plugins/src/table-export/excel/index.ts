import ExcelJS from 'exceljs';
import { encodeCellAddress } from '../util/encode';
import type { CellType, IVTable } from '../util/type';
import { getCellAlignment, getCellBorder, getCellFill, getCellFont } from './style';
import { updateCell, renderChart, graphicUtil } from '@visactor/vtable';
import { isArray, isFunction } from '@visactor/vutils';
import type {
  BaseTableAPI,
  CellRange,
  ColumnDefine,
  IRowSeriesNumber,
  LinkColumnDefine
} from '@visactor/vtable/es/ts-types';
import { getHierarchyOffset } from '../util/indent';
import { isPromise } from '../util/promise';
import { handlePaginationExport } from '../util/pagination';

export type CellInfo = {
  cellType: string;
  cellValue: string;
  table: IVTable;
  col: number;
  row: number;
};

export type SkipImageExportCellType =
  | 'image'
  | 'video'
  | 'progressbar'
  | 'sparkline'
  | 'chart'
  | 'custom'
  | 'textWithIcon';

export type ExportVTableToExcelOptions = {
  ignoreIcon?: boolean;
  exportAllData?: boolean;
  formatExportOutput?: (cellInfo: CellInfo) => string | undefined;
  formatExcelJSCell?: (cellInfo: CellInfo, cellInExcelJS: ExcelJS.Cell) => ExcelJS.Cell;
  excelJSWorksheetCallback?: (worksheet: ExcelJS.Worksheet) => void;
  skipImageExportCellType?: SkipImageExportCellType[];
  downloadFile?: boolean;
  fileName?: string;
};

function requestIdleCallbackPromise(options?: IdleRequestOptions) {
  return new Promise<IdleDeadline>(resolve => {
    requestIdleCallback(deadline => {
      resolve(deadline);
    }, options);
  });
}

export async function exportVTableToExcel(
  tableInstance: IVTable,
  options?: ExportVTableToExcelOptions,
  optimization = false
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('sheet1');
  await renderTableToWorksheet(tableInstance, worksheet, workbook, options, optimization);
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

export async function exportMultipleVTablesToExcel(
  tables: Array<{ table: IVTable; name?: string }>,
  options?: ExportVTableToExcelOptions,
  optimization = false
) {
  const workbook = new ExcelJS.Workbook();
  const usedWorksheetNames = new Set<string>();
  for (let i = 0; i < tables.length; i++) {
    const { table, name } = tables[i];
    const safeName = getUniqueWorksheetName(name || `sheet${i + 1}`, usedWorksheetNames);
    usedWorksheetNames.add(safeName);
    const worksheet = workbook.addWorksheet(safeName);
    await renderTableToWorksheet(table, worksheet, workbook, options, optimization);
  }
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

async function renderTableToWorksheet(
  tableInstance: IVTable,
  worksheet: ExcelJS.Worksheet,
  workbook: ExcelJS.Workbook,
  options?: ExportVTableToExcelOptions,
  optimization = false
): Promise<void> {
  const exportAllData = !!options?.exportAllData;
  const { handleRowCount, reset } = handlePaginationExport(tableInstance, exportAllData);
  try {
    const minRow = 0;
    const maxRow = handleRowCount();
    const minCol = 0;
    const maxCol = tableInstance.colCount - 1;

    worksheet.properties.defaultRowHeight = 40;
    const columns: { width: number }[] = [];
    const mergeCells: CellRange[] = [];
    const mergeCellSet = new Set<string>();

    const SLICE_SIZE = 100;
    let currentRow = minRow;

    const processSlice = async (deadline?: IdleDeadline): Promise<void> => {
      while (currentRow <= maxRow && (!optimization || deadline?.timeRemaining() > 0)) {
        const endRow = Math.min(currentRow + SLICE_SIZE - 1, maxRow);
        for (let col = minCol; col <= maxCol; col++) {
          const colWidth = tableInstance.getColWidth(col);
          if (columns[col] === undefined) {
            columns[col] = { width: colWidth / 6 };
          }
          for (let row = currentRow; row <= endRow; row++) {
            if (col === minCol) {
              const rowHeight = tableInstance.getRowHeight(row);
              const worksheetRow = worksheet.getRow(row + 1);
              worksheetRow.height = rowHeight;
            }

            await addCell(col, row, tableInstance, worksheet, workbook, options);

            const cellRange = tableInstance.getCellRange(col, row);
            if (cellRange.start.col !== cellRange.end.col || cellRange.start.row !== cellRange.end.row) {
              const key = `${cellRange.start.col},${cellRange.start.row}:${cellRange.end.col},${cellRange.end.row}`;
              if (!mergeCellSet.has(key)) {
                mergeCellSet.add(key);
                mergeCells.push(cellRange);
              }
            }
          }
        }
        currentRow = endRow + 1;
      }

      if (currentRow <= maxRow) {
        const nextDeadline = optimization ? await requestIdleCallbackPromise() : undefined;
        await processSlice(nextDeadline);
      }
    };

    if (optimization) {
      const deadline = await requestIdleCallbackPromise();
      await processSlice(deadline);
    } else {
      await processSlice();
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

    const frozenView: ExcelJS.WorksheetViewFrozen[] = [];
    if (tableInstance.frozenRowCount > 0) {
      frozenView.push({
        state: 'frozen',
        ySplit: tableInstance.frozenRowCount,
        topLeftCell: encodeCellAddress(0, tableInstance.frozenRowCount)
      });
    }
    if (tableInstance.frozenColCount > 0) {
      frozenView.push({
        state: 'frozen',
        xSplit: tableInstance.frozenColCount,
        topLeftCell: encodeCellAddress(tableInstance.frozenColCount, 0)
      });
    }
    worksheet.views = frozenView;

    if (options?.excelJSWorksheetCallback) {
      options.excelJSWorksheetCallback(worksheet);
    }
  } finally {
    // 恢复透视表的pagination配置
    reset();
  }
}

function getUniqueWorksheetName(rawName: string, used: Set<string>) {
  // Excel sheet name constraints:
  // - max 31 chars
  // - cannot contain: : \ / ? * [ ]
  // - cannot be empty
  // ExcelJS will throw on invalid/duplicate names, so we guard here.
  const cleanedBase = sanitizeWorksheetName(rawName) || 'sheet';
  if (!used.has(cleanedBase)) {
    return cleanedBase;
  }
  for (let n = 2; n < 10000; n++) {
    const suffix = `-${n}`;
    const baseMax = 31 - suffix.length;
    const base = cleanedBase.length > baseMax ? cleanedBase.slice(0, baseMax) : cleanedBase;
    const candidate = `${base}${suffix}`;
    if (!used.has(candidate)) {
      return candidate;
    }
  }
  // Fallback: extremely unlikely; still ensure non-empty + <=31
  return `${cleanedBase.slice(0, 31 - 6)}-${Date.now().toString().slice(-5)}`;
}

function sanitizeWorksheetName(name: string) {
  const trimmed = (name ?? '').toString().trim();
  // Replace invalid characters with space, then collapse spaces.
  const noInvalidChars = trimmed
    .replace(/[:\\\/\?\*\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  // Excel doesn't allow empty names
  const nonEmpty = noInvalidChars || 'sheet';
  // Excel max length is 31
  return nonEmpty.length > 31 ? nonEmpty.slice(0, 31) : nonEmpty;
}

async function addCell(
  col: number,
  row: number,
  tableInstance: IVTable,
  worksheet: ExcelJS.Worksheet,
  workbook: ExcelJS.Workbook,
  options?: ExportVTableToExcelOptions
) {
  const { layoutMap } = tableInstance.internalProps;
  const cellType = tableInstance.getCellType(col, row);
  const rawRecord = tableInstance.getCellRawRecord(col, row);
  let cellValue = (rawRecord && rawRecord.vtableMergeName) ?? tableInstance.getCellValue(col, row, false);
  if (isPromise(cellValue)) {
    cellValue = await cellValue;
  }

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
      let cell = worksheet.getCell(encodeCellAddress(col, row));
      cell.value = formattedValue;
      cell.font = getCellFont(cellStyle, cellType);
      cell.fill = getCellFill(cellStyle);
      cell.border = getCellBorder(cellStyle);
      const offset = getHierarchyOffset(col, row, tableInstance as any);
      cell.alignment = getCellAlignment(cellStyle, Math.ceil(offset / cell.font.size));

      if (cell && options?.formatExcelJSCell) {
        const formatedCell = options.formatExcelJSCell({ cellType, cellValue, table: tableInstance, col, row }, cell);
        if (formatedCell) {
          cell = formatedCell;
        }
      }
      return cell;
    }
  }

  let cell;
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
    if (
      !needCellImageExport(
        cellType,
        layoutMap.isAxisCell(col, row),
        !!customRender || !!customLayout,
        !!(!options?.ignoreIcon && isArray(icons) && icons.length),
        options
      )
    ) {
      cell = worksheet.getCell(encodeCellAddress(col, row));
    } else {
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
    }
  } else if (cellType === 'text' || cellType === 'link') {
    cell = worksheet.getCell(encodeCellAddress(col, row));
    let linkUrl: string;
    if (cellType === 'link') {
      const templateLink = (define as LinkColumnDefine).templateLink;
      if (templateLink) {
        // 如果有模板链接，使用模板
        const rowData = tableInstance.getCellOriginRecord(col, row);
        if (rowData && rowData.vtableMerge) {
          // group title
          // return;
        } else {
          const cellOriginValue = tableInstance.getCellOriginValue(col, row);
          const data = Object.assign(
            {
              __value: cellValue,
              __dataValue: cellOriginValue
            },
            rowData
          );
          if (isFunction(templateLink)) {
            linkUrl = templateLink(data, col, row, tableInstance as BaseTableAPI);
          } else {
            const re = /\{\s*(\S+?)\s*\}/g;
            linkUrl = templateLink.replace(re, (matchs: string, key: string) => {
              matchs;
              return (data as any)[key];
            });
          }
        }
      }
    }
    cell.value = getCellValue(cellValue, cellType, linkUrl);
    cell.font = getCellFont(cellStyle, cellType);
    cell.fill = getCellFill(cellStyle);
    cell.border = getCellBorder(cellStyle);
    const offset = getHierarchyOffset(col, row, tableInstance as any);
    cell.alignment = getCellAlignment(cellStyle, Math.ceil(offset / cell.font.size));
  } else if (cellType === 'chart') {
    if (!needCellImageExport('chart', false, false, false, options)) {
      cell = worksheet.getCell(encodeCellAddress(col, row));
    } else {
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

  if (cell && options?.formatExcelJSCell) {
    const formatedCell = options.formatExcelJSCell({ cellType, cellValue, table: tableInstance, col, row }, cell);
    if (formatedCell) {
      cell = formatedCell;
    }
  }
  return cell;
}

function getCellValue(cellValue: string, cellType: CellType, linkUrl?: string) {
  if (cellType === 'link') {
    return {
      text: cellValue,
      hyperlink: linkUrl || cellValue,
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

    // fix dirtyBounds auto update error in drawGraphicToCanvas()
    cellGroup.stage.dirtyBounds.set(-Infinity, -Infinity, Infinity, Infinity);
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

function needCellImageExport(
  cellType: CellType,
  isAxisCell: boolean,
  isCustomCell: boolean,
  isTextWithIcon: boolean,
  options?: ExportVTableToExcelOptions
) {
  if (!options?.skipImageExportCellType) {
    return true;
  }

  if (
    cellType === 'image' ||
    cellType === 'video' ||
    cellType === 'progressbar' ||
    cellType === 'sparkline' ||
    cellType === 'chart'
  ) {
    return !options.skipImageExportCellType.includes(cellType);
  } else if (isAxisCell) {
    return !options.skipImageExportCellType.includes('chart');
  } else if (isCustomCell) {
    return !options.skipImageExportCellType.includes('custom');
  } else if (isTextWithIcon) {
    return !options.skipImageExportCellType.includes('textWithIcon');
  }
  return true;
}
