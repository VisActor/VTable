import type { ListTable, pluginsDefinition, ColumnsDefine } from '@visactor/vtable';
import { TABLE_EVENT_TYPE } from '@visactor/vtable';
import ExcelJS from 'exceljs';
import { importExcelMultipleSheets, importCsvFile } from './excel-import/excel';
import {
  importExcelFileForVTableSheet,
  importFileForVTableSheet,
  applyImportToVTableSheet
} from './excel-import/vtable-sheet';
import type { ExcelImportOptions, ImportResult, MultiSheetImportResult } from './excel-import/types';

export type { ExcelImportOptions, ImportResult, MultiSheetImportResult, SheetData } from './excel-import/types';
export { importExcelMultipleSheets } from './excel-import/excel';

/**
 * Excel 导入插件
 * 提供 Excel 文件导入功能，支持单 sheet 和多 sheet 导入
 */
export class ExcelImportPlugin implements pluginsDefinition.IVTablePlugin {
  id: string = `excel-import-plugin`;
  name = 'ExcelImportPlugin';
  runTime = [TABLE_EVENT_TYPE.INITIALIZED];
  private options: ExcelImportOptions;
  private table: ListTable | null = null;

  constructor(options?: ExcelImportOptions) {
    this.options = {
      autoTable: true,
      autoColumns: true,
      delimiter: ',',
      exportData: false,
      batchSize: 1000,
      enableBatchProcessing: true,
      asyncDelay: 5,
      importAllSheets: false, // 默认不导入所有 sheets
      clearExisting: true, // 默认替换模式
      ...options
    };
    if (options?.id) {
      this.id = options.id;
    }
  }

  /**
   * 插件初始化方法
   * @param args 插件参数
   */
  run(...args: any[]) {
    const runTime = args[1];
    if (runTime === TABLE_EVENT_TYPE.INITIALIZED) {
      this.table = args[2];

      // 为表格实例添加 importFile 方法
      (this.table as any).importFile = () => {
        this.import('file');
      };

      // 如果是 VTableSheet，给 VTableSheet 实例添加导入方法
      if ((this.table as any).__vtableSheet) {
        const vtableSheet = (this.table as any).__vtableSheet;
        if (!(vtableSheet as any)._importFile) {
          // 绑定文件选择并导入的方法
          (vtableSheet as any)._importFile = async (options?: Partial<ExcelImportOptions>) => {
            const mergedOptions = { ...this.options, ...options };
            return this._importFileFromDialogForVTableSheet(vtableSheet, mergedOptions);
          };
        }
      }
    }
  }

  /**
   * 导入文件（自动检测类型）
   * @param options 导入选项
   * @returns Promise<ImportResult | MultiSheetImportResult>
   */
  private async _importFile(options?: Partial<ExcelImportOptions>): Promise<ImportResult | MultiSheetImportResult> {
    if (!this.table) {
      throw new Error('表格实例不存在或已销毁，无法导入数据！');
    }

    const mergedOptions = { ...this.options, ...options };
    const isVTableSheet = this._detectVTableSheet(this.table);

    if (isVTableSheet) {
      // VTableSheet 使用多 sheet 导入
      return this._importMultipleSheetsFromFileDialog({
        ...mergedOptions,
        importAllSheets: true
      });
    }
    // ListTable 使用单 sheet 导入（保留原有逻辑）
    // TODO: 可以进一步重构，将单 sheet 导入逻辑也拆分出去
    throw new Error('ListTable 单 sheet 导入功能需要进一步重构');
  }

  /**
   * 打开文件选择对话框并获取文件（公共方法）
   * @param accept 接受的文件类型
   * @returns Promise<File>
   */
  private _selectFile(accept: string = '.xlsx,.xls,.csv,.txt,.json,.html,.htm'): Promise<File> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;
      input.style.display = 'none';
      document.body.appendChild(input);

      input.addEventListener('change', () => {
        try {
          const file = (input as HTMLInputElement).files?.[0];
          if (!file) {
            document.body.removeChild(input);
            reject(new Error('未选择文件'));
            return;
          }

          // 清理
          input.value = '';
          document.body.removeChild(input);

          resolve(file);
        } catch (error) {
          document.body.removeChild(input);
          reject(error);
        }
      });

      input.click();
    });
  }

  /**
   * 从文件对话框导入文件到 VTableSheet（支持 Excel 和 CSV）
   * @param vtableSheetInstance VTableSheet 实例
   * @param options 导入选项
   * @returns Promise<MultiSheetImportResult>
   */
  private async _importFileFromDialogForVTableSheet(
    vtableSheetInstance: any,
    options: ExcelImportOptions
  ): Promise<MultiSheetImportResult> {
    try {
      const file = await this._selectFile('.xlsx,.xls,.csv,.txt');
      const fileExtension = this._getFileExtension(file.name).toLowerCase();
      let result: MultiSheetImportResult;

      if (fileExtension === 'csv' || fileExtension === 'txt') {
        result = await importCsvFile(file, options);
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        result = await importExcelMultipleSheets(file, options);
      } else {
        throw new Error('不支持的文件类型，仅支持 Excel (.xlsx, .xls) 和 CSV (.csv, .txt)');
      }

      // 自动应用导入结果到 VTableSheet
      if (options.autoTable !== false && result.sheets.length > 0) {
        applyImportToVTableSheet(vtableSheetInstance, result, options);
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 从文件对话框导入（多个sheet）- 用于 VTableSheet
   */
  private async _importMultipleSheetsFromFileDialog(options: ExcelImportOptions): Promise<MultiSheetImportResult> {
    try {
      const file = await this._selectFile('.xlsx,.xls,.csv,.txt');
      const fileExtension = this._getFileExtension(file.name).toLowerCase();
      let result: MultiSheetImportResult;

      if (fileExtension === 'csv' || fileExtension === 'txt') {
        result = await importCsvFile(file, options);
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        result = await importExcelMultipleSheets(file, options);
      } else {
        throw new Error('不支持的文件类型，仅支持 Excel (.xlsx, .xls) 和 CSV (.csv, .txt)');
      }

      // 如果是 VTableSheet 且 autoTable 为 true，自动应用导入结果
      if (options.autoTable !== false && this.table && this._detectVTableSheet(this.table)) {
        const vtableSheet = (this.table as any).__vtableSheet;
        if (vtableSheet) {
          applyImportToVTableSheet(vtableSheet, result, options);
        }
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 检测是否为 VTable-sheet 实例
   */
  private _detectVTableSheet(instance: ListTable): boolean {
    // 通过检查实例的特征来判断是否为 VTable-sheet
    const inst = instance as unknown as Record<string, unknown>;
    return !!(
      inst &&
      typeof inst.updateOption === 'function' &&
      inst.options &&
      typeof inst.options === 'object' &&
      inst.options !== null &&
      Array.isArray((inst.options as Record<string, unknown>).sheets)
    );
  }

  /**
   * 获取文件扩展名
   */
  private _getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  }

  /**
   * 插件销毁方法
   * 清理挂载到表格实例的方法
   */
  release() {
    if (this.table) {
      delete (this.table as any).importFile;
      this.table = null;
    }
  }

  /**
   * 统一的导入方法（用于 ListTable）
   * @param type 导入类型: "file" | "csv" | "json" | "html"
   * @param source 数据源: 文件选择器 | 字符串数据 | 对象数据
   * @param options 导入选项
   * @returns Promise<ImportResult>
   */
  async import(
    type: 'file' | 'csv' | 'json' | 'html',
    source?: string | object,
    options?: Partial<ExcelImportOptions>
  ): Promise<ImportResult | MultiSheetImportResult> {
    if (!this.table) {
      throw new Error('表格实例不存在或已销毁，无法导入数据！');
    }

    const mergedOptions = { ...this.options, ...options };
    const isVTableSheet = this._detectVTableSheet(this.table);

    // VTableSheet 使用多 sheet 导入逻辑
    if (isVTableSheet && type === 'file') {
      return this._importMultipleSheetsFromFileDialog({
        ...mergedOptions,
        importAllSheets: true
      });
    }

    // ListTable 使用单 sheet 导入逻辑
    if (type === 'file') {
      return this._importFromFileDialog(mergedOptions);
    }
    if (typeof source === 'string') {
      return this._importFromString(type as 'csv' | 'json' | 'html', source, mergedOptions);
    }
    if (Array.isArray(source) || typeof source === 'object') {
      if (type !== 'json') {
        throw new Error('只有JSON格式支持从对象导入');
      }
      return this._importFromData('json', source, mergedOptions);
    }
    throw new Error('Invalid import source');
  }

  /**
   * 从文件对话框导入（用于 ListTable）
   */
  private async _importFromFileDialog(options: ExcelImportOptions): Promise<ImportResult> {
    if (!this.table) {
      throw new Error('表格实例不存在或已销毁，无法导入数据！');
    }

    const file = await this._selectFile();
    const result = await this._parseFile(file, options);

    // 根据配置决定是否自动更新表格
    if (options.autoTable && this.table) {
      if (options.autoColumns) {
        this.table.updateOption(
          Object.assign({}, this.table.options, {
            columns: result.columns
          })
        );
      }
      this.table.setRecords(result.records);
    }

    return result;
  }

  /**
   * 从字符串数据导入
   */
  private async _importFromString(
    type: 'csv' | 'json' | 'html',
    data: string,
    options: ExcelImportOptions
  ): Promise<ImportResult> {
    let result: ImportResult;

    switch (type) {
      case 'csv':
        result = await this._parseCSVString(data, options);
        break;
      case 'json':
        result = await this._parseJSONString(data, options);
        break;
      case 'html':
        result = await this._parseHTMLString(data, options);
        break;
      default:
        throw new Error(`不支持的导入类型: ${type}`);
    }

    // 自动更新表格
    if (options.autoTable && this.table) {
      if (options.autoColumns) {
        this.table.updateOption({
          columns: result.columns,
          plugins: [this]
        });
      }
      this.table.setRecords(result.records);
    }

    return result;
  }

  /**
   * 从数据对象导入
   */
  private async _importFromData(
    type: 'json',
    data: unknown[] | object,
    options: ExcelImportOptions
  ): Promise<ImportResult> {
    let result: ImportResult;

    if (type === 'json') {
      result = await this._parseJSONData(data, options);
    } else {
      throw new Error(`不支持的数据类型: ${type}`);
    }

    // 自动更新表格
    if (options.autoTable && this.table) {
      if (options.autoColumns) {
        this.table.updateOption({
          columns: result.columns,
          plugins: [this]
        });
      }
      this.table.setRecords(result.records);
    }

    return result;
  }
  /**
   * 根据文件类型解析文件
   */
  private async _parseFile(file: File, options?: ExcelImportOptions): Promise<ImportResult> {
    const mergedOptions = { ...this.options, ...options };
    const fileExtension = this._getFileExtension(file.name).toLowerCase();

    switch (fileExtension) {
      case 'xlsx':
      case 'xls':
        return await this._parseExcelFile(file, mergedOptions);
      case 'csv':
        return await this._parseCsvFile(file, mergedOptions);
      case 'json':
        return await this._parseJsonFile(file, mergedOptions);
      case 'html':
      case 'htm':
        return await this._parseHtmlFile(file, mergedOptions);
      default:
        throw new Error(`不支持的文件类型: ${fileExtension}`);
    }
  }

  /**
   * 解析Excel文件
   */
  private async _parseExcelFile(file: File, options?: ExcelImportOptions): Promise<ImportResult> {
    const mergedOptions = { ...this.options, ...options };
    return await ExcelImportPlugin.importExcelToVTableData(file, mergedOptions);
  }

  /**
   * 解析CSV文件
   */
  private async _parseCsvFile(file: File, options?: ExcelImportOptions): Promise<ImportResult> {
    const mergedOptions = { ...this.options, ...options };
    const text = await file.text();
    return this._parseCSVString(text, mergedOptions);
  }

  /**
   * 解析JSON文件
   */
  private async _parseJsonFile(file: File, options?: ExcelImportOptions): Promise<ImportResult> {
    const mergedOptions = { ...this.options, ...options };
    const text = await file.text();
    return this._parseJSONString(text, mergedOptions);
  }

  /**
   * 解析HTML表格文件
   */
  private async _parseHtmlFile(file: File, options?: ExcelImportOptions): Promise<ImportResult> {
    const mergedOptions = { ...this.options, ...options };
    const text = await file.text();
    return this._parseHTMLString(text, mergedOptions);
  }

  /**
   * 从表头行构建列配置
   */
  private _buildColumnsFromHeaders(headerRows: string[][]): ColumnsDefine {
    if (headerRows.length === 1) {
      return headerRows[0].map((title, index) => ({
        field: `col${index}`,
        title: title || `列${index + 1}`,
        cellType: 'text' as const,
        headerType: 'text' as const
      }));
    }
    return ExcelImportPlugin.buildColumns(headerRows);
  }

  static async importExcelToVTableData(file: File, options?: ExcelImportOptions) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());
    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error('Excel 文件无有效工作表');
    }
    const detectedHeaderRows = options?.headerRowCount ?? this.detectHeaderRowCount(worksheet);
    const headerRows = [];
    for (let i = 1; i <= detectedHeaderRows; i++) {
      const row = worksheet.getRow(i);
      headerRows.push(Array.prototype.slice.call(row.values, 1));
    }
    const columns = ExcelImportPlugin.buildColumns(headerRows);
    const records: Record<string, unknown>[] = [];
    const dataRows: unknown[][] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= detectedHeaderRows) {
        return;
      }
      const cells = Array.prototype.slice.call(row.values, 1);
      dataRows.push(cells);
    });

    // 分批处理数据行，提升大文件性能
    const batchSize = options?.batchSize || 1000;
    const enableBatch = options?.enableBatchProcessing !== false && dataRows.length > batchSize;
    if (enableBatch) {
      for (let i = 0; i < dataRows.length; i += batchSize) {
        const batch = dataRows.slice(i, i + batchSize);
        const batchRecords = batch.map(cells => {
          const record: Record<string, unknown> = {};
          cells.forEach((cell: unknown, j: number) => {
            record[`col${j}`] = cell;
          });
          return record;
        });
        records.push(...batchRecords);
        if (i + batchSize < dataRows.length) {
          await new Promise(resolve => setTimeout(resolve, options?.asyncDelay || 5));
        }
      }
    } else {
      // 小文件直接处理
      dataRows.forEach(cells => {
        const record: Record<string, unknown> = {};
        cells.forEach((cell: unknown, i: number) => {
          record[`col${i}`] = cell;
        });
        records.push(record);
      });
    }
    if (options?.exportData) {
      // 导出为JavaScript对象字面量格式
      const jsContent = ExcelImportPlugin._generateJavaScriptExport(columns, records);
      const blob = new Blob([jsContent], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vtable-data.js';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    }
    return { columns, records };
  }

  private static detectHeaderRowCount(worksheet: any): number {
    let rowIndex = 1;
    let headerRowCount = 1;
    while (true) {
      const row = worksheet.getRow(rowIndex);
      const cells = Array.prototype.slice.call(row.values, 1);
      let hasConsecutive = false;
      for (let i = 1; i < cells.length; i++) {
        if (cells[i] !== undefined && cells[i] !== '' && cells[i] === cells[i - 1]) {
          hasConsecutive = true;
          break;
        }
      }
      if (hasConsecutive) {
        headerRowCount++;
        rowIndex++;
      } else {
        break;
      }
    }
    return headerRowCount;
  }

  private static buildColumns(headerRows: unknown[][], colStart = 0, colEnd?: number, level = 0): ColumnsDefine {
    const row = headerRows[level] as unknown[];
    const columns: ColumnsDefine = [];
    colEnd = colEnd ?? row.length;
    let i = colStart;
    while (i < colEnd) {
      const title = String(row[i] || `列${i + 1}`);
      let span = 1;
      while (i + span < colEnd && row[i + span] === title) {
        span++;
      }
      if (level < headerRows.length - 1) {
        const subColumns = ExcelImportPlugin.buildColumns(headerRows, i, i + span, level + 1);
        if (subColumns.length === 1) {
          columns.push(subColumns[0]);
        } else {
          columns.push({
            title,
            columns: subColumns,
            hideColumnsSubHeader: false
          });
        }
      } else {
        columns.push({
          field: `col${i}`,
          title,
          cellType: 'text' as const,
          headerType: 'text' as const
        });
      }
      i += span;
    }
    return columns;
  }

  /**
   * 解析CSV字符串（使用与 excel.ts 相同的解析逻辑）
   */
  private async _parseCSVString(text: string, options: ExcelImportOptions): Promise<ImportResult> {
    const delimiter = options.delimiter || ',';
    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);

    if (lines.length === 0) {
      throw new Error('CSV文件为空');
    }

    // 使用与 excel.ts 相同的 CSV 行解析逻辑
    const parseCSVLine = (line: string): unknown[] => {
      const result: unknown[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === delimiter && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headerRowCount = 1;
    const headerRows = lines.slice(0, headerRowCount).map(line => parseCSVLine(line).map(cell => String(cell || '')));
    const dataRows = lines.slice(headerRowCount);

    const columns = this._buildColumnsFromHeaders(headerRows);
    const records: Record<string, unknown>[] = [];

    await this._processBatchRecords(dataRows, options, async (batch: string[]) => {
      const batchRecords = batch.map(line => {
        const parsedRow = parseCSVLine(line);
        const record: Record<string, unknown> = {};
        parsedRow.forEach((cell, i) => {
          record[`col${i}`] = cell ?? '';
        });
        return record;
      });
      records.push(...batchRecords);
    });

    if (options.exportData) {
      this._exportToJS(columns, records);
    }

    return { columns, records };
  }

  /**
   * 解析JSON字符串
   */
  private async _parseJSONString(text: string, options: ExcelImportOptions): Promise<ImportResult> {
    let jsonData;

    try {
      jsonData = JSON.parse(text);
    } catch (error) {
      throw new Error('JSON文件格式错误');
    }

    const result = await this._parseJSONData(jsonData, options);
    if (options.exportData) {
      this._exportToJS(result.columns, result.records);
    }

    return result;
  }

  /**
   * 解析HTML字符串
   */
  private async _parseHTMLString(text: string, options: ExcelImportOptions): Promise<ImportResult> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const table = doc.querySelector('table');

    if (!table) {
      throw new Error('HTML文件中未找到表格');
    }

    const rows = Array.from(table.querySelectorAll('tr'));
    if (rows.length === 0) {
      throw new Error('表格中没有数据行');
    }

    const headerRowCount = 1;
    const headerRows = rows
      .slice(0, headerRowCount)
      .map(row => Array.from(row.querySelectorAll('th, td')).map(cell => cell.textContent?.trim() || ''));
    const dataRows = rows.slice(headerRowCount);

    const columns = this._buildColumnsFromHeaders(headerRows);
    const records: Record<string, unknown>[] = [];

    // 分批处理数据行
    await this._processBatchRecords(dataRows, options, async (batch: Element[]) => {
      const batchRecords = batch.map(row => {
        const cells = Array.from(row.querySelectorAll('td')).map(cell => cell.textContent?.trim() || '');
        const record: Record<string, unknown> = {};
        cells.forEach((cell, i) => {
          record[`col${i}`] = cell || '';
        });
        return record;
      });
      records.push(...batchRecords);
    });

    // 如果启用了导出功能，则导出为JS文件
    if (options.exportData) {
      this._exportToJS(columns, records);
    }

    return { columns, records };
  }

  /**
   * 解析JSON数据对象
   */
  private async _parseJSONData(jsonData: unknown[] | object, options: ExcelImportOptions): Promise<ImportResult> {
    let result: ImportResult;

    // 如果JSON直接包含columns和records
    if (
      typeof jsonData === 'object' &&
      !Array.isArray(jsonData) &&
      jsonData &&
      'columns' in jsonData &&
      'records' in jsonData
    ) {
      const data = jsonData as { columns: ColumnsDefine; records: Record<string, unknown>[] };
      const records: Record<string, unknown>[] = [];
      await this._processBatchRecords(data.records, options, async (batch: Record<string, unknown>[]) => {
        const batchRecords = batch.map(record => ({ ...record }));
        records.push(...batchRecords);
      });
      result = {
        columns: data.columns,
        records: records
      };
    } else if (Array.isArray(jsonData) && jsonData.length > 0) {
      const firstRecord = jsonData[0] as Record<string, unknown>;
      const columns: ColumnsDefine = Object.keys(firstRecord).map(key => ({
        field: key,
        title: key,
        cellType: 'text' as const,
        headerType: 'text' as const
      }));

      const records: Record<string, unknown>[] = [];
      await this._processBatchRecords(
        jsonData as Record<string, unknown>[],
        options,
        async (batch: Record<string, unknown>[]) => {
          const batchRecords = batch.map(record => ({ ...record }));
          records.push(...batchRecords);
        }
      );

      result = { columns, records };
    } else {
      throw new Error('不支持的JSON格式');
    }

    if (options.exportData) {
      this._exportToJS(result.columns, result.records);
    }

    return result;
  }

  /**
   * 生成JavaScript对象字面量格式的导出内容
   */
  private static _generateJavaScriptExport(columns: ColumnsDefine, records: Record<string, unknown>[]): string {
    // 格式化值，确保正确的缩进
    const formatValue = (value: unknown, indent: string = ''): string => {
      if (value === null || value === undefined) {
        return 'null';
      }
      if (typeof value === 'string') {
        return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
      }
      if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
      }
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return '[]';
        }
        const items = value.map(item => formatValue(item, indent + '  ')).join(', ');
        return `[${items}]`;
      }
      if (typeof value === 'object') {
        const props = Object.entries(value)
          .map(([key, val]) => `${indent}  ${key}: ${formatValue(val, indent + '  ')}`)
          .join(',\n');
        return `{\n${props}\n${indent}}`;
      }
      return String(value);
    };

    // 格式化记录对象
    const formatRecord = (record: unknown): string => {
      const props = Object.entries(record)
        .map(([key, value]) => `      ${key}: ${formatValue(value)}`)
        .join(',\n');
      return `    {\n${props}\n    }`;
    };

    // 格式化列对象（支持嵌套列）
    const formatColumn = (column: unknown, baseIndent: string = '    '): string => {
      const props = Object.entries(column)
        .map(([key, value]) => {
          if (key === 'columns' && Array.isArray(value)) {
            // 递归处理嵌套列，增加缩进
            const nestedColumns = value.map(col => formatColumn(col, baseIndent + '  ')).join(',\n');
            return `${baseIndent}  ${key}: [\n${nestedColumns}\n${baseIndent}  ]`;
          }
          return `${baseIndent}  ${key}: ${formatValue(value)}`;
        })
        .join(',\n');
      return `${baseIndent}{\n${props}\n${baseIndent}}`;
    };

    const columnsStr = columns.map(col => formatColumn(col)).join(',\n');
    const recordsStr = records.map(formatRecord).join(',\n');

    return `// VTable 数据导出 - JavaScript 对象字面量格式
// 生成时间: ${new Date().toLocaleString()}

const vtableData = {
  columns: [
${columnsStr}
  ],
  records: [
${recordsStr}
  ]
};
`;
  }

  /**
   * 导出数据为JavaScript对象字面量格式
   */
  private _exportToJS(columns: ColumnsDefine, records: Record<string, unknown>[]): void {
    const jsContent = ExcelImportPlugin._generateJavaScriptExport(columns, records);
    const blob = new Blob([jsContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vtable-data.js';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  /**
   * 分批处理大数据记录，避免UI阻塞
   */
  private async _processBatchRecords<T>(
    records: T[],
    options: ExcelImportOptions,
    processor: (batch: T[], batchIndex: number) => Promise<void> | void
  ): Promise<void> {
    if (!options.enableBatchProcessing || records.length <= (options.batchSize || 1000)) {
      // 小数据量直接处理
      await processor(records, 0);
      return;
    }

    const batchSize = options.batchSize || 1000;
    const totalBatches = Math.ceil(records.length / batchSize);
    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, records.length);
      const batch = records.slice(start, end);
      await processor(batch, i);
      // 让出控制权给浏览器，避免长时间阻塞UI
      if (i < totalBatches - 1) {
        await new Promise(resolve => setTimeout(resolve, options.asyncDelay || 5));
      }
    }
  }
}
