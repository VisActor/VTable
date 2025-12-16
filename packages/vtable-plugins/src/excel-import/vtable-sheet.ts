import type { ExcelImportOptions, MultiSheetImportResult, SheetData } from './types';

/**
 * 将导入的 Excel 数据应用到 VTableSheet 实例
 * @param vtableSheetInstance VTableSheet 实例
 * @param result 导入结果
 * @param options 导入选项
 */
export function applyImportToVTableSheet(
  vtableSheetInstance: any,
  result: MultiSheetImportResult,
  options?: ExcelImportOptions
): void {
  const clearExisting = options?.clearExisting !== false; // 默认 true（替换模式）

  if (result.sheets.length === 0) {
    return;
  }

  // 验证实例是否有必要的方法
  if (typeof vtableSheetInstance.addSheet !== 'function') {
    throw new Error('VTableSheet 实例方法不完整');
  }

  // 记录现有的 sheets（用于替换模式）
  const existingSheets = clearExisting ? [...vtableSheetInstance.getAllSheets()] : [];
  const existingSheetKeys = existingSheets.map((s: { sheetKey: string }) => s.sheetKey);

  // 转换并添加导入的 sheets
  const importedSheetKeys: string[] = [];
  for (let i = 0; i < result.sheets.length; i++) {
    const sheetData = result.sheets[i];

    // 确保 sheetKey 唯一
    let sheetKey = sheetData.sheetKey;
    let suffix = 1;
    while (vtableSheetInstance.getSheet(sheetKey) || importedSheetKeys.includes(sheetKey)) {
      sheetKey = `${sheetData.sheetKey}_${suffix}`;
      suffix++;
    }

    // 创建 sheet 定义
    const sheetDefine = {
      sheetKey: sheetKey,
      sheetTitle: sheetData.sheetTitle,
      data: sheetData.data,
      rowCount: Math.max(sheetData.rowCount, 100),
      columnCount: Math.max(sheetData.columnCount, 26),
      cellMerge: sheetData.cellMerge,
      active: false // 稍后统一激活
    };

    // 添加 sheet
    vtableSheetInstance.addSheet(sheetDefine);
    importedSheetKeys.push(sheetKey);
  }

  // 替换模式：移除所有旧的 sheets
  if (clearExisting && existingSheetKeys.length > 0) {
    for (const oldSheetKey of existingSheetKeys) {
      // 跳过新添加的 sheet，只删除旧的
      if (importedSheetKeys.includes(oldSheetKey)) {
        continue;
      }
      // 检查是否还存在且可以安全删除
      if (vtableSheetInstance.getSheet(oldSheetKey) && vtableSheetInstance.getSheetCount() > 1) {
        vtableSheetInstance.removeSheet(oldSheetKey);
      }
    }
  }

  // 激活第一个导入的 sheet
  if (importedSheetKeys.length > 0) {
    vtableSheetInstance.activateSheet(importedSheetKeys[0]);
  }
}

/**
 * 为 VTableSheet 导入 Excel 文件（直接传入 VTableSheet 实例）
 * @param vtableSheetInstance VTableSheet 实例
 * @param file Excel 文件
 * @param options 导入选项
 * @returns Promise<MultiSheetImportResult>
 */
export async function importExcelFileForVTableSheet(
  vtableSheetInstance: any,
  file: File,
  options?: ExcelImportOptions
): Promise<MultiSheetImportResult> {
  const { importExcelMultipleSheets } = await import('./excel');
  const result = await importExcelMultipleSheets(file, options);

  // 自动更新 VTable-sheet
  if (options?.autoTable !== false && result.sheets.length > 0) {
    applyImportToVTableSheet(vtableSheetInstance, result, options);
  }

  return result;
}

/**
 * 为 VTableSheet 导入文件（支持 Excel 和 CSV）
 * @param vtableSheetInstance VTableSheet 实例
 * @param file 文件（Excel 或 CSV）
 * @param options 导入选项
 * @returns Promise<MultiSheetImportResult>
 */
export async function importFileForVTableSheet(
  vtableSheetInstance: any,
  file: File,
  options?: ExcelImportOptions
): Promise<MultiSheetImportResult> {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  let result: MultiSheetImportResult;

  if (fileExtension === 'csv' || fileExtension === 'txt') {
    // CSV 导入
    const { importCsvFile } = await import('./excel');
    result = await importCsvFile(file, options);
  } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
    // Excel 导入
    const { importExcelMultipleSheets } = await import('./excel');
    result = await importExcelMultipleSheets(file, options);
  } else {
    throw new Error(`不支持的文件类型: ${fileExtension}，仅支持 Excel (.xlsx, .xls) 和 CSV (.csv, .txt)`);
  }

  // 自动更新 VTable-sheet
  if (options?.autoTable !== false && result.sheets.length > 0) {
    applyImportToVTableSheet(vtableSheetInstance, result, options);
  }

  return result;
}
