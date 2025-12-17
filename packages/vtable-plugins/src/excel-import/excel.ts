import ExcelJS from 'exceljs';
import type { ExcelImportOptions, SheetData, MultiSheetImportResult } from './types';

/**
 * 解析 CSV 文件为 SheetData 格式
 * @param file CSV 文件
 * @param options 导入选项
 * @returns Promise<MultiSheetImportResult>
 */
export async function importCsvFile(file: File, options?: ExcelImportOptions): Promise<MultiSheetImportResult> {
  const text = await file.text();
  const delimiter = options?.delimiter || ',';
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);

  if (lines.length === 0) {
    throw new Error('CSV 文件为空');
  }

  // 解析 CSV 数据
  const data: unknown[][] = [];
  for (const line of lines) {
    const row = parseCsvLine(line, delimiter);
    data.push(row);
  }

  // 确定行列数
  const rowCount = data.length;
  const columnCount = Math.max(...data.map(row => row.length), 0);

  // 生成 sheet 信息
  const sheetTitle = file.name.replace(/\.(csv|txt)$/i, '') || 'Sheet1';
  const sheetKey = `sheet_${Date.now()}_0`;

  const sheetData: SheetData = {
    sheetTitle,
    sheetKey,
    data,
    columnCount,
    rowCount
  };

  return {
    sheets: [sheetData]
  };
}

/**
 * 解析 CSV 行（处理引号内的分隔符）
 * @param line CSV 行
 * @param delimiter 分隔符
 * @returns 解析后的单元格值数组
 */
function parseCsvLine(line: string, delimiter: string): unknown[] {
  const result: unknown[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // 转义的双引号
        current += '"';
        i++; // 跳过下一个引号
      } else {
        // 切换引号状态
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      // 分隔符（不在引号内）
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // 添加最后一个字段
  result.push(current.trim());

  return result;
}

/**
 * 解析 Excel 文件的多个 sheet
 * @param file Excel 文件
 * @param options 导入选项
 * @returns Promise<MultiSheetImportResult>
 */
export async function importExcelMultipleSheets(
  file: File,
  options?: ExcelImportOptions
): Promise<MultiSheetImportResult> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());

  if (!workbook.worksheets || workbook.worksheets.length === 0) {
    throw new Error('Excel 文件无有效工作表');
  }

  // 确定要导入的 sheet 索引
  let sheetIndices: number[];
  if (options?.sheetIndices && options.sheetIndices.length > 0) {
    // 使用指定的 sheet 索引
    sheetIndices = options.sheetIndices.filter(index => index >= 0 && index < workbook.worksheets.length);
  } else {
    // 导入所有 sheet
    sheetIndices = Array.from({ length: workbook.worksheets.length }, (_, i) => i);
  }

  const sheets: SheetData[] = [];

  // 处理每个 sheet
  for (const sheetIndex of sheetIndices) {
    const worksheet = workbook.worksheets[sheetIndex];
    if (!worksheet) {
      continue;
    }

    try {
      const sheetData = await parseWorksheetToSheetData(worksheet, sheetIndex, options);
      sheets.push(sheetData);
    } catch (error) {
      console.error(`解析 sheet "${worksheet.name}" 时出错:`, error);
      // 继续处理其他 sheet
    }
  }

  if (sheets.length === 0) {
    throw new Error('没有成功解析任何工作表');
  }

  return { sheets };
}

/**
 * 解析单个 worksheet 为 SheetData 格式
 * @param worksheet ExcelJS worksheet 对象
 * @param sheetIndex sheet 索引
 * @param options 导入选项
 * @returns Promise<SheetData>
 */
export async function parseWorksheetToSheetData(
  worksheet: ExcelJS.Worksheet,
  sheetIndex: number,
  options?: ExcelImportOptions
): Promise<SheetData> {
  const sheetTitle = worksheet.name || `Sheet${sheetIndex + 1}`;
  const sheetKey = `sheet_${Date.now()}_${sheetIndex}`;

  // 获取实际数据范围
  const rowCount = worksheet.actualRowCount || 0;
  const columnCount = worksheet.actualColumnCount || 0;

  if (rowCount === 0 || columnCount === 0) {
    // 空 sheet，但仍需要解析合并单元格信息（可能只有合并单元格没有数据）
    const cellMerge = parseMergedCells(worksheet, []);
    return {
      sheetTitle,
      sheetKey,
      data: [],
      columnCount: 0,
      rowCount: 0,
      ...(cellMerge.length > 0 ? { cellMerge } : {})
    };
  }

  // 提取所有数据（包括表头）为二维数组
  const data: unknown[][] = [];

  for (let rowNumber = 1; rowNumber <= rowCount; rowNumber++) {
    const row = worksheet.getRow(rowNumber);
    const rowData: unknown[] = [];

    for (let colNumber = 1; colNumber <= columnCount; colNumber++) {
      const cell = row.getCell(colNumber);
      let cellValue: unknown = cell.value;

      // 处理特殊的单元格值类型
      if (cellValue && typeof cellValue === 'object') {
        // 处理富文本
        if ('richText' in cellValue) {
          cellValue = (cellValue as { richText: { text: string }[] }).richText
            .map((rt: { text: string }) => rt.text)
            .join('');
        }
        // 处理公式
        else if ('result' in cellValue) {
          cellValue = (cellValue as { result: unknown }).result;
        }
        // 处理超链接
        else if ('text' in cellValue && 'hyperlink' in cellValue) {
          cellValue = (cellValue as { text: string }).text;
        }
        // 处理日期
        else if (cellValue instanceof Date) {
          cellValue = cellValue.toISOString();
        }
      }

      rowData.push(cellValue ?? null);
    }

    data.push(rowData);
  }

  // 解析合并单元格信息
  const cellMerge = parseMergedCells(worksheet, data);

  return {
    sheetTitle,
    sheetKey,
    data,
    columnCount,
    rowCount,
    ...(cellMerge.length > 0 ? { cellMerge } : {})
  };
}

/**
 * 解析 Excel 合并单元格信息
 * @param worksheet ExcelJS worksheet 对象
 * @param data 已解析的数据数组
 * @returns 合并单元格信息数组
 */
export function parseMergedCells(
  worksheet: ExcelJS.Worksheet,
  data: unknown[][]
): Array<{
  text?: string;
  range: {
    start: { col: number; row: number };
    end: { col: number; row: number };
    isCustom?: boolean;
  };
}> {
  const cellMerge: Array<{
    text?: string;
    range: {
      start: { col: number; row: number };
      end: { col: number; row: number };
      isCustom?: boolean;
    };
  }> = [];

  try {
    // ExcelJS 中合并单元格信息存储在 worksheet.model.merges 中
    // 格式: { 'A1': { tl: 'A1', br: 'B2' }, ... }
    // 注意：ExcelJS 的类型定义可能不完整，使用 unknown 进行类型转换
    const worksheetAny = worksheet as unknown as {
      model?: { merges?: Record<string, unknown> };
      _merges?: Record<string, unknown>;
    };
    const merges: Record<string, unknown> =
      (worksheetAny.model?.merges as Record<string, unknown>) ||
      (worksheetAny._merges as Record<string, unknown>) ||
      {};

    for (const [masterCell, range] of Object.entries(merges)) {
      try {
        let startCol: number;
        let startRow: number;
        let endCol: number;
        let endRow: number;

        // 检查 range 的类型
        if (typeof range === 'string') {
          // range 是地址范围字符串，如 'A1:B3'
          const rangeMatch = range.match(/^([A-Z]+\d+):([A-Z]+\d+)$/i);
          if (!rangeMatch) {
            continue;
          }

          const startAddr = parseCellAddress(rangeMatch[1]);
          const endAddr = parseCellAddress(rangeMatch[2]);
          if (!startAddr || !endAddr) {
            continue;
          }

          startCol = startAddr.col;
          startRow = startAddr.row;
          endCol = endAddr.col;
          endRow = endAddr.row;
        } else if (typeof range === 'object' && range !== null) {
          // range 是对象格式
          const rangeObj = range as {
            tl?: string;
            br?: string;
            top?: number;
            left?: number;
            bottom?: number;
            right?: number;
          };

          if (rangeObj.tl && rangeObj.br) {
            // 使用地址字符串格式 (如 'A1', 'B2')
            const startAddr = parseCellAddress(rangeObj.tl);
            const endAddr = parseCellAddress(rangeObj.br);
            if (!startAddr || !endAddr) {
              continue;
            }

            startCol = startAddr.col;
            startRow = startAddr.row;
            endCol = endAddr.col;
            endRow = endAddr.row;
          } else if (
            typeof rangeObj.top === 'number' &&
            typeof rangeObj.left === 'number' &&
            typeof rangeObj.bottom === 'number' &&
            typeof rangeObj.right === 'number'
          ) {
            // 使用行列索引格式（ExcelJS 内部格式，1-based）
            startRow = rangeObj.top - 1; // 转换为 0-based
            startCol = rangeObj.left - 1; // 转换为 0-based
            endRow = rangeObj.bottom - 1; // 转换为 0-based
            endCol = rangeObj.right - 1; // 转换为 0-based
          } else {
            continue;
          }
        } else {
          continue;
        }

        // 获取合并单元格的文本内容（从主单元格）
        let text: string | undefined;
        if (startRow >= 0 && startRow < data.length && startCol >= 0 && startCol < data[startRow].length) {
          const cellValue = data[startRow][startCol];
          if (cellValue !== null && cellValue !== undefined) {
            text = String(cellValue);
          }
        }

        cellMerge.push({
          text,
          range: {
            start: {
              col: startCol,
              row: startRow
            },
            end: {
              col: endCol,
              row: endRow
            },
            isCustom: true
          }
        });
      } catch (error) {
        console.warn(`解析合并单元格 ${masterCell} 时出错:`, error);
        // 继续处理其他合并单元格
      }
    }
  } catch (error) {
    console.warn('解析合并单元格信息时出错:', error);
  }

  return cellMerge;
}

/**
 * 解析单元格地址（如 'A1'）为行列索引（0-based）
 * @param address 单元格地址字符串
 * @returns 行列索引对象，解析失败返回 null
 */
export function parseCellAddress(address: string): { col: number; row: number } | null {
  try {
    // 匹配格式：列字母 + 行号，如 'A1', 'B2', 'AA10'
    const match = address.match(/^([A-Z]+)(\d+)$/i);
    if (!match) {
      return null;
    }

    const colLetters = match[1].toUpperCase();
    const rowNumber = parseInt(match[2], 10);

    // 转换列字母为索引 (A=0, B=1, ..., Z=25, AA=26, etc.)
    // Excel 列是 26 进制，但特殊的是没有 0，A=1, Z=26, AA=27
    let col = 0;
    for (let i = 0; i < colLetters.length; i++) {
      col = col * 26 + (colLetters.charCodeAt(i) - 64); // 'A' = 65, 所以 -64 得到 1
    }
    col = col - 1; // 转换为 0-based (A=1->0, B=2->1, ..., AA=27->26)

    // 行号转换为 0-based（Excel 使用 1-based）
    const row = rowNumber - 1;

    return { col, row };
  } catch (error) {
    console.warn(`解析单元格地址 "${address}" 时出错:`, error);
    return null;
  }
}
