import ExcelJS from 'exceljs';
import type { ListTable } from '@visactor/vtable';
import * as VTable from '@visactor/vtable';

export interface ExcelImportOptions {
  id?: string;
  headerRowCount?: number;
  exportJson?: boolean;
  onImported?: (columns: any[], records: any[]) => void;
  supportedTypes?: string[]; // 支持的文件类型
  // Tabulator 风格的配置
  autoTable?: boolean; // 是否自动替换表格数据
  autoColumns?: boolean; // 是否自动生成列配置
  delimiter?: string; // CSV分隔符，默认逗号
  encoding?: string; // 文件编码，默认UTF-8
}

export class ExcelImportPlugin implements VTable.plugins.IVTablePlugin {
  id: string = `excel-import-plugin-${Date.now()}`;
  name = 'ExcelImportPlugin';
  runTime = [VTable.TABLE_EVENT_TYPE.INITIALIZED];
  private options: ExcelImportOptions;
  private _tableInstance: ListTable | null = null;
  constructor(options?: ExcelImportOptions) {
    this.options = {
      supportedTypes: ['csv', 'json', 'xlsx', 'xls', 'html'],
      autoTable: true,
      autoColumns: true,
      delimiter: ',',
      encoding: 'utf-8',
      ...options
    };
    if (options?.id) this.id = options.id;
  }

  run(...args: [any, any, ListTable]) {
    const tableInstance = args[2];
    this._tableInstance = tableInstance;
  }

  release() {
    this._tableInstance = null;
  }
  /**
   * 主动调用导入文件接口 (原有方法保持兼容)
   * @returns Promise<{columns: any[], records: any[]}>
   */
  async importFile(): Promise<{columns: any[], records: any[]}> {
    return this.import("file");
  }

  /**
   * Tabulator风格的导入方法
   * @param type 导入类型: "file" | "csv" | "json" | "xlsx" | "html"
   * @param source 数据源: 文件选择器 | 字符串数据 | 对象数据
   * @param options 导入选项
   * @returns Promise<{columns: any[], records: any[]}>
   */
  async import(
    type: "file" | "csv" | "json" | "xlsx" | "html",
    source?: string | any[] | object | HTMLInputElement,
    options?: Partial<ExcelImportOptions>
  ): Promise<{columns: any[], records: any[]}> {
    const mergedOptions = { ...this.options, ...options };

    if (type === "file") {
      return this._importFromFileDialog(mergedOptions);
    }    if (typeof source === "string") {
      if (type === "xlsx") {
        throw new Error("Excel文件不能从字符串导入，请使用文件上传");
      }
      return this._importFromString(type as "csv" | "json" | "html", source, mergedOptions);
    }

    if (source instanceof HTMLInputElement) {
      return this._importFromInput(source, mergedOptions);
    }

    if (Array.isArray(source) || typeof source === "object") {
      if (type !== "json") {
        throw new Error("只有JSON格式支持从对象导入");
      }
      return this._importFromData("json", source, mergedOptions);
    }

    throw new Error("Invalid import source");
  }

  /**
   * 从文件对话框导入
   */
  private async _importFromFileDialog(options: ExcelImportOptions): Promise<{columns: any[], records: any[]}> {
    return new Promise((resolve, reject) => {
      if (!this._tableInstance) {
        reject(new Error('表格实例不存在或已销毁，无法导入数据！'));
        return;
      }

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = this._buildAcceptString();
      input.style.display = 'none';
      document.body.appendChild(input);

      input.addEventListener('change', async (e) => {
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
              this._tableInstance.updateOption({
                columns: result.columns,
                plugins: [this]
              });
            }
            this._tableInstance.setRecords(result.records);
          }

          // 清理
          input.value = '';
          document.body.removeChild(input);

          // 触发回调
          if (typeof options.onImported === 'function') {
            options.onImported(result.columns, result.records);
          }

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
    type: "csv" | "json" | "html",
    data: string,
    options: ExcelImportOptions
  ): Promise<{columns: any[], records: any[]}> {
    let result: {columns: any[], records: any[]};

    switch (type) {
      case "csv":
        result = this._parseCSVString(data, options);
        break;
      case "json":
        result = this._parseJSONString(data, options);
        break;
      case "html":
        result = this._parseHTMLString(data, options);
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

    // 触发回调
    if (typeof options.onImported === 'function') {
      options.onImported(result.columns, result.records);
    }

    return result;
  }

  /**
   * 从input元素导入
   */
  private async _importFromInput(
    input: HTMLInputElement,
    options: ExcelImportOptions
  ): Promise<{columns: any[], records: any[]}> {
    if (!input.files || input.files.length === 0) {
      throw new Error('未选择文件');
    }

    const file = input.files[0];
    const result = await this._parseFile(file, options);

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

    // 触发回调
    if (typeof options.onImported === 'function') {
      options.onImported(result.columns, result.records);
    }

    return result;
  }

  /**
   * 从数据对象导入
   */
  private async _importFromData(
    type: "json",
    data: any[] | object,
    options: ExcelImportOptions
  ): Promise<{columns: any[], records: any[]}> {
    let result: {columns: any[], records: any[]};

    if (type === "json") {
      result = this._parseJSONData(data, options);
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

    // 触发回调
    if (typeof options.onImported === 'function') {
      options.onImported(result.columns, result.records);
    }

    return result;
  }
  /**
   * 构建文件选择器的accept字符串
   */
  private _buildAcceptString(): string {
    const typeMap: Record<string, string> = {
      'csv': '.csv',
      'json': '.json',
      'xlsx': '.xlsx',
      'xls': '.xls',
      'html': '.html,.htm'
    };
    
    return this.options.supportedTypes?.map(type => typeMap[type] || type).join(',') || '.csv,.json,.xlsx,.xls,.html,.htm';
  }
  /**
   * 根据文件类型解析文件
   */
  private async _parseFile(file: File, options?: ExcelImportOptions): Promise<{columns: any[], records: any[]}> {
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
  }  /**
   * 解析Excel文件
   */
  private async _parseExcelFile(file: File, options?: ExcelImportOptions): Promise<{columns: any[], records: any[]}> {
    const mergedOptions = { ...this.options, ...options };
    return await ExcelImportPlugin.importExcelToVTableData(file, mergedOptions);
  }

  /**
   * 解析CSV文件
   */
  private async _parseCsvFile(file: File, options?: ExcelImportOptions): Promise<{columns: any[], records: any[]}> {
    const mergedOptions = { ...this.options, ...options };
    const text = await file.text();
    return this._parseCSVString(text, mergedOptions);
  }

  /**
   * 解析JSON文件
   */
  private async _parseJsonFile(file: File, options?: ExcelImportOptions): Promise<{columns: any[], records: any[]}> {
    const mergedOptions = { ...this.options, ...options };
    const text = await file.text();
    return this._parseJSONString(text, mergedOptions);
  }

  /**
   * 解析HTML表格文件
   */
  private async _parseHtmlFile(file: File, options?: ExcelImportOptions): Promise<{columns: any[], records: any[]}> {
    const mergedOptions = { ...this.options, ...options };
    const text = await file.text();
    return this._parseHTMLString(text, mergedOptions);
  }

  /**
   * 从表头行构建列配置
   */
  private _buildColumnsFromHeaders(headerRows: string[][]): any[] {
    if (headerRows.length === 1) {
      // 单行表头
      return headerRows[0].map((title, index) => ({
        field: `col${index}`,
        title: title || `列${index + 1}`,
        key: `col${index}`,
        headerType: 'text' as const
      }));
    } else {
      // 多行表头，使用原有的buildColumns逻辑
      return ExcelImportPlugin.buildColumns(headerRows);
    }
  }

  static async importExcelToVTableData(
    file: File,
    options?: ExcelImportOptions
  ) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());
    const worksheet = workbook.worksheets[0];
    if (!worksheet) throw new Error('Excel 文件无有效工作表');
    const detectedHeaderRows = options?.headerRowCount ?? this.detectHeaderRowCount(worksheet);
    const headerRows = [];
    for (let i = 1; i <= detectedHeaderRows; i++) {
      const row = worksheet.getRow(i);
      headerRows.push(Array.prototype.slice.call(row.values, 1));
    }
    const columns = ExcelImportPlugin.buildColumns(headerRows);
    const records: Record<string, any>[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= detectedHeaderRows) return;
      const record: Record<string, any> = {};
      const cells = Array.prototype.slice.call(row.values, 1);
      cells.forEach((cell: any, i: number) => {
        record[`col${i}`] = cell;
      });
      records.push(record);
    });
    if (options?.exportJson) {
      const jsonStr = JSON.stringify({ columns, records }, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vtable-data.json';
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
        if (
          cells[i] !== undefined &&
          cells[i] !== '' &&
          cells[i] === cells[i - 1]
        ) {
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

  private static buildColumns(headerRows: any[][], colStart = 0, colEnd?: number, level = 0): any[] {
    const row = headerRows[level];
    const columns = [];
    colEnd = colEnd ?? row.length;
    let i = colStart;
    while (i < colEnd) {
      const title = row[i] || `列${i + 1}`;
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
            field: `group${level}_${i}`,
            title,
            columns: subColumns,
            key: `group${level}_${i}`
          });
        }
      } else {
        columns.push({
          field: `col${i}`,
          title,
          key: `col${i}`,
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
  private _parseCSVString(text: string, options: ExcelImportOptions): {columns: any[], records: any[]} {
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      throw new Error('CSV文件为空');
    }

    // 解析CSV行（支持自定义分隔符）
    const delimiter = options.delimiter || ',';
    const parseCSVLine = (line: string): string[] => {
      return line.split(delimiter).map(cell => cell.trim().replace(/^"|"$/g, ''));
    };

    const headerRowCount = options.headerRowCount ?? 1;
    const headerRows = lines.slice(0, headerRowCount).map(parseCSVLine);
    const dataRows = lines.slice(headerRowCount).map(parseCSVLine);

    const columns = this._buildColumnsFromHeaders(headerRows);
    const records = dataRows.map(row => {
      const record: Record<string, any> = {};
      row.forEach((cell, i) => {
        record[`col${i}`] = cell || '';
      });
      return record;
    });

    return { columns, records };
  }

  /**
   * 解析JSON字符串
   */
  private _parseJSONString(text: string, options: ExcelImportOptions): {columns: any[], records: any[]} {
    let jsonData;
    
    try {
      jsonData = JSON.parse(text);
    } catch (error) {
      throw new Error('JSON文件格式错误');
    }

    return this._parseJSONData(jsonData, options);
  }

  /**
   * 解析HTML字符串
   */
  private _parseHTMLString(text: string, options: ExcelImportOptions): {columns: any[], records: any[]} {
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

    const headerRowCount = options.headerRowCount ?? 1;
    const headerRows = rows.slice(0, headerRowCount).map(row => 
      Array.from(row.querySelectorAll('th, td')).map(cell => cell.textContent?.trim() || '')
    );
    const dataRows = rows.slice(headerRowCount).map(row =>
      Array.from(row.querySelectorAll('td')).map(cell => cell.textContent?.trim() || '')
    );

    const columns = this._buildColumnsFromHeaders(headerRows);
    const records = dataRows.map(row => {
      const record: Record<string, any> = {};
      row.forEach((cell, i) => {
        record[`col${i}`] = cell || '';
      });
      return record;
    });

    return { columns, records };
  }

  /**
   * 解析JSON数据对象
   */
  private _parseJSONData(jsonData: any[] | object, options: ExcelImportOptions): {columns: any[], records: any[]} {
    // 如果JSON直接包含columns和records
    if (typeof jsonData === 'object' && !Array.isArray(jsonData) && 
        'columns' in jsonData && 'records' in jsonData) {
      return { 
        columns: (jsonData as any).columns, 
        records: (jsonData as any).records 
      };
    }

    // 如果JSON是数组格式，自动生成列
    if (Array.isArray(jsonData) && jsonData.length > 0) {
      const firstRecord = jsonData[0];
      const columns = Object.keys(firstRecord).map((key, index) => ({
        field: key,
        title: key,
        key: key,
        headerType: 'text' as const
      }));
      return { columns, records: jsonData };
    }

    throw new Error('不支持的JSON格式');
  }
}