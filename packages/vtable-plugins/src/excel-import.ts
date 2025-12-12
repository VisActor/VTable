import ExcelJS from 'exceljs';
import type { ListTable, ColumnsDefine, ColumnDefine, pluginsDefinition } from '@visactor/vtable';
import { TABLE_EVENT_TYPE } from '@visactor/vtable';

// 数据导入结果类型（单个sheet）
export interface ImportResult {
  columns: ColumnsDefine;
  records: Record<string, unknown>[];
}

// 单个 sheet 的数据结构（用于多 sheet 导入）
export interface SheetData {
  /** sheet 名称 */
  sheetTitle: string;
  /** sheet 唯一标识（自动生成） */
  sheetKey: string;
  /** 列定义 */
  columns?: ColumnsDefine;
  /** 数据 (二维数组格式，用于 VTable-sheet) */
  data: unknown[][];
  /** 列数 */
  columnCount: number;
  /** 行数 */
  rowCount: number;
}

// 多 sheet 导入结果类型
export interface MultiSheetImportResult {
  /** 所有 sheet 的数据 */
  sheets: SheetData[];
}

export interface ExcelImportOptions {
  id?: string;
  headerRowCount?: number; // 指定头的层数，不指定会使用detectHeaderRowCount来自动判断，但是只有excel才有
  exportData?: boolean; // 是否导出JavaScript对象字面量格式文件
  autoTable?: boolean; // 是否自动替换表格数据
  autoColumns?: boolean; // 是否自动生成列配置
  delimiter?: string; // CSV分隔符，默认逗号
  batchSize?: number; // 批处理大小，默认1000行
  enableBatchProcessing?: boolean; // 是否启用分批处理，默认true
  asyncDelay?: number; // 异步处理延迟时间(ms)，默认5ms
  importAllSheets?: boolean; // 是否导入所有sheet，默认false（仅导入第一个sheet）
  sheetIndices?: number[]; // 指定要导入的sheet索引数组（从0开始），不指定则导入所有
  clearExisting?: boolean; // 对于 VTable-sheet：是否清除现有 sheets（true=替换，false=追加），默认 true
}

export class ExcelImportPlugin implements pluginsDefinition.IVTablePlugin {
  id: string = `excel-import-plugin`;
  name = 'ExcelImportPlugin';
  runTime = [TABLE_EVENT_TYPE.INITIALIZED];
  private options: ExcelImportOptions;
  private _tableInstance: ListTable | null = null;
  private _isVTableSheet: boolean = false;
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
      ...options
    };
    if (options?.id) {
      this.id = options.id;
    }
  }

  run(...args: [unknown, unknown, ListTable]) {
    const tableInstance = args[2];
    this._tableInstance = tableInstance;

    // 检测是否为 VTable-sheet
    this._isVTableSheet = this._detectVTableSheet(tableInstance);

    // 为表格实例添加 importFile 方法
    (this._tableInstance as unknown as Record<string, unknown>).importFile = () => {
      return this._isVTableSheet ? this._importForVTableSheet() : this.import('file');
    };
  }

  release() {
    this._tableInstance = null;
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
   * 为 VTable-sheet 导入 Excel（自动处理多 sheet）
   * @param options 导入选项，可覆盖默认配置
   */
  private async _importForVTableSheet(options?: Partial<ExcelImportOptions>): Promise<MultiSheetImportResult> {
    if (!this._tableInstance || !this._isVTableSheet) {
      throw new Error('当前实例不是 VTable-sheet');
    }

    try {
      const mergedOptions = { ...this.options, ...options };
      const clearExisting = mergedOptions.clearExisting !== false; // 默认 true（替换模式）

      // 导入所有 sheets
      const result = await this._importMultipleSheetsFromFileDialog({
        ...mergedOptions,
        importAllSheets: true
      });

      // 自动更新 VTable-sheet
      if (mergedOptions.autoTable !== false && result.sheets.length > 0) {
        // 获取 VTableSheet 实例
        const vtableSheetInstance = this._getVTableSheetInstance();
        if (!vtableSheetInstance) {
          console.error('无法获取 VTableSheet 实例', {
            tableInstance: this._tableInstance,
            hasVTableSheetRef: !!(this._tableInstance as any).__vtableSheet
          });
          throw new Error('无法获取 VTableSheet 实例，请确保插件已正确注册');
        }

        // 验证实例是否有必要的方法
        if (typeof vtableSheetInstance.addSheet !== 'function') {
          console.error('VTableSheet 实例缺少 addSheet 方法', vtableSheetInstance);
          throw new Error('VTableSheet 实例方法不完整');
        }

        // 记录现有的 sheets（用于替换模式）
        const existingSheets = clearExisting ? [...vtableSheetInstance.getAllSheets()] : [];
        const existingSheetKeys = existingSheets.map((s: { sheetKey: string }) => s.sheetKey);

        // 转换并添加导入的 sheets
        const importedSheetKeys: string[] = [];
        for (let i = 0; i < result.sheets.length; i++) {
          const sheetData = result.sheets[i];

          // 确保 sheetKey 唯一（追加模式下需要检查，替换模式下也需要避免与即将删除的冲突）
          let sheetKey = sheetData.sheetKey;
          let suffix = 1;
          // 检查是否已存在（包括现有的和已添加的）
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
            active: false // 稍后统一激活
          };

          // 添加 sheet
          vtableSheetInstance.addSheet(sheetDefine);
          importedSheetKeys.push(sheetKey);
        }

        // 替换模式：移除所有旧的 sheets
        // 注意：必须先添加新的 sheets，然后才能删除旧的（因为至少需要保留一个 sheet）
        if (clearExisting && existingSheetKeys.length > 0) {
          // 现在已经有新的 sheets 了，可以安全删除旧的
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

      return result;
    } catch (error) {
      console.error('VTable-sheet 导入失败:', error);
      throw error;
    }
  }

  /**
   * 获取 VTableSheet 实例
   * 通过 tableInstance 上的 __vtableSheet 属性获取（由 WorkSheet 设置）
   */
  private _getVTableSheetInstance(): any {
    if (!this._tableInstance) {
      console.warn('ExcelImportPlugin: tableInstance 不存在');
      return null;
    }

    // 通过 tableInstance 的自定义属性获取（由 WorkSheet 在创建时设置）
    const vtableSheet = (this._tableInstance as any).__vtableSheet;
    if (!vtableSheet) {
      console.warn('ExcelImportPlugin: 无法从 tableInstance 获取 VTableSheet 实例', {
        tableInstance: this._tableInstance,
        hasContainer: !!(this._tableInstance as any).container
      });
    }
    return vtableSheet || null;
  }
  /**
   * 调用导入文件接口
   * - 对于 VTable-sheet: 自动导入所有 sheets 并返回 MultiSheetImportResult
   * - 对于 ListTable: 导入单个 sheet 并返回 ImportResult
   * @param options 导入选项，可覆盖默认配置（仅对 VTable-sheet 有效）
   * @returns Promise<ImportResult | MultiSheetImportResult>
   */
  async importFile(options?: Partial<ExcelImportOptions>): Promise<ImportResult | MultiSheetImportResult> {
    if (this._isVTableSheet) {
      return this._importForVTableSheet(options);
    }
    return this.import('file');
  }

  /**
   * 为 VTableSheet 导入 Excel 文件（直接传入 VTableSheet 实例）
   * @param vtableSheetInstance VTableSheet 实例
   * @param options 导入选项
   * @returns Promise<MultiSheetImportResult>
   */
  async importFileForVTableSheet(
    vtableSheetInstance: any,
    options?: Partial<ExcelImportOptions>
  ): Promise<MultiSheetImportResult> {
    try {
      const mergedOptions = { ...this.options, ...options };
      const clearExisting = mergedOptions.clearExisting !== false; // 默认 true（替换模式）

      // 导入所有 sheets
      const result = await this._importMultipleSheetsFromFileDialog({
        ...mergedOptions,
        importAllSheets: true
      });

      // 自动更新 VTable-sheet
      if (mergedOptions.autoTable !== false && result.sheets.length > 0) {
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

      return result;
    } catch (error) {
      console.error('VTable-sheet 导入失败:', error);
      throw error;
    }
  }

  /**
   * 调用导入文件接口（多个sheet）
   * @param options 导入选项
   * @returns Promise<MultiSheetImportResult>
   */
  async importMultipleSheets(options?: Partial<ExcelImportOptions>): Promise<MultiSheetImportResult> {
    return this._importMultipleSheetsFromFileDialog({ ...this.options, ...options });
  }

  /**
   * @param type 导入类型: "file" | "csv" | "json" | "html"
   * @param source 数据源: 文件选择器 | 字符串数据
   * @param options 导入选项
   * @returns Promise<ImportResult>
   */
  async import(
    type: 'file' | 'csv' | 'json' | 'html',
    source?: string | object,
    options?: Partial<ExcelImportOptions>
  ): Promise<ImportResult> {
    const mergedOptions = { ...this.options, ...options };

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
   * 从文件对话框导入（单个sheet）
   */
  private async _importFromFileDialog(options: ExcelImportOptions): Promise<ImportResult> {
    return new Promise((resolve, reject) => {
      if (!this._tableInstance) {
        reject(new Error('表格实例不存在或已销毁，无法导入数据！'));
        return;
      }

      const input = document.createElement('input');
      input.type = 'file';
      input.style.display = 'none';
      document.body.appendChild(input);

      input.addEventListener('change', async e => {
        try {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) {
            document.body.removeChild(input);
            reject(new Error('未选择文件'));
            return;
          }

          const result = await this._parseFile(file, options);

          // 根据配置决定是否自动更新表格
          if (options.autoTable && this._tableInstance) {
            if (options.autoColumns) {
              this._tableInstance.updateOption(
                Object.assign({}, this._tableInstance.options, {
                  columns: result.columns
                })
              );
            }
            this._tableInstance.setRecords(result.records);
          }

          // 清理
          input.value = '';
          document.body.removeChild(input);

          resolve(result);
        } catch (error) {
          document.body.removeChild(input);
          reject(error);
        }
      });

      input.click();
    });
  }

  /**
   * 从文件对话框导入（多个sheet）
   */
  private async _importMultipleSheetsFromFileDialog(options: ExcelImportOptions): Promise<MultiSheetImportResult> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.xlsx,.xls';
      input.style.display = 'none';
      document.body.appendChild(input);

      input.addEventListener('change', async e => {
        try {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) {
            document.body.removeChild(input);
            reject(new Error('未选择文件'));
            return;
          }

          // 检查文件类型
          const fileExtension = this._getFileExtension(file.name).toLowerCase();
          if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
            document.body.removeChild(input);
            reject(new Error('只支持 Excel 文件（.xlsx, .xls）'));
            return;
          }

          const result = await this._parseExcelFileMultipleSheets(file, options);

          // 清理
          input.value = '';
          document.body.removeChild(input);

          resolve(result);
        } catch (error) {
          document.body.removeChild(input);
          reject(error);
        }
      });

      input.click();
    });
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
    if (options.autoTable && this._tableInstance) {
      if (options.autoColumns) {
        this._tableInstance.updateOption({
          columns: result.columns,
          plugins: [this]
        });
      }
      this._tableInstance.setRecords(result.records);
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
    if (options.autoTable && this._tableInstance) {
      if (options.autoColumns) {
        this._tableInstance.updateOption({
          columns: result.columns,
          plugins: [this]
        });
      }
      this._tableInstance.setRecords(result.records);
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
   * 获取文件扩展名
   */
  private _getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
   * 解析CSV字符串
   */
  private async _parseCSVString(text: string, options: ExcelImportOptions): Promise<ImportResult> {
    const lines = text.split('\n').filter(line => line.trim());

    if (lines.length === 0) {
      throw new Error('CSV文件为空');
    }

    // 解析CSV行（支持自定义分隔符）
    const delimiter = options.delimiter || ',';
    const parseCSVLine = (line: string): string[] => {
      return line.split(delimiter).map(cell => cell.trim().replace(/^"|"$/g, ''));
    };

    const headerRowCount = 1;
    const headerRows = lines.slice(0, headerRowCount).map(parseCSVLine);
    const dataRows = lines.slice(headerRowCount);

    const columns = this._buildColumnsFromHeaders(headerRows);
    const records: Record<string, unknown>[] = [];

    await this._processBatchRecords(dataRows, options, async (batch: string[]) => {
      const batchRecords = batch.map(line => {
        const parsedRow = parseCSVLine(line);
        const record: Record<string, unknown> = {};
        parsedRow.forEach((cell, i) => {
          record[`col${i}`] = cell || '';
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
  private _exportToJS(columns: ColumnDefine[], records: Record<string, unknown>[]): void {
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

  /**
   * 解析 Excel 文件的多个 sheet
   * @param file Excel 文件
   * @param options 导入选项
   * @returns Promise<MultiSheetImportResult>
   */
  private async _parseExcelFileMultipleSheets(
    file: File,
    options: ExcelImportOptions
  ): Promise<MultiSheetImportResult> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());

    if (!workbook.worksheets || workbook.worksheets.length === 0) {
      throw new Error('Excel 文件无有效工作表');
    }

    // 确定要导入的 sheet 索引
    let sheetIndices: number[];
    if (options.sheetIndices && options.sheetIndices.length > 0) {
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
        const sheetData = await this._parseWorksheetToSheetData(worksheet, sheetIndex, options);
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
  private async _parseWorksheetToSheetData(
    worksheet: ExcelJS.Worksheet,
    sheetIndex: number,
    options: ExcelImportOptions
  ): Promise<SheetData> {
    const sheetTitle = worksheet.name || `Sheet${sheetIndex + 1}`;
    const sheetKey = `sheet_${Date.now()}_${sheetIndex}`;

    // 获取实际数据范围
    const rowCount = worksheet.actualRowCount || 0;
    const columnCount = worksheet.actualColumnCount || 0;

    if (rowCount === 0 || columnCount === 0) {
      // 空 sheet
      return {
        sheetTitle,
        sheetKey,
        data: [],
        columnCount: 0,
        rowCount: 0
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

    return {
      sheetTitle,
      sheetKey,
      data,
      columnCount,
      rowCount
    };
  }

  /**
   * 静态方法：从 Excel 文件导入多个 sheet
   * @param file Excel 文件
   * @param options 导入选项
   * @returns Promise<MultiSheetImportResult>
   */
  static async importExcelMultipleSheets(file: File, options?: ExcelImportOptions): Promise<MultiSheetImportResult> {
    const plugin = new ExcelImportPlugin(options);
    return plugin._parseExcelFileMultipleSheets(file, { ...plugin.options, ...options });
  }
}
