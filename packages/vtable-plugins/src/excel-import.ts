import ExcelJS from 'exceljs';
import type { ListTable } from '@visactor/vtable';
import * as VTable from '@visactor/vtable';

export interface ExcelImportOptions {
  id?: string;
  headerRowCount?: number;
  exportJson?: boolean;
  buttonText?: string;
  onImported?: (columns: any[], records: any[]) => void;
}

export class ExcelImportPlugin implements VTable.plugins.IVTablePlugin {
  id: string = `excel-import-plugin-${Date.now()}`;
  name = 'ExcelImportPlugin';
  runTime = [VTable.TABLE_EVENT_TYPE.INITIALIZED];
  private options: ExcelImportOptions;
  private _importButton: HTMLButtonElement | null = null;
  private _importContainer: HTMLDivElement | null = null;
  private _tableInstance: ListTable | null = null;

  constructor(options?: ExcelImportOptions) {
    this.options = options || {};
    if (options?.id) this.id = options.id;
  }

  run(...args: [any, any, ListTable]) {
    const tableInstance = args[2];
    this._tableInstance = tableInstance;
    this._renderImportButton();
  }

  release() {
    if (this._importButton && this._importButton.parentElement) {
      this._importButton.parentElement.removeChild(this._importButton);
    }
    if (this._importContainer && this._importContainer.parentElement) {
      this._importContainer.parentElement.removeChild(this._importContainer);
    }
    this._importButton = null;
    this._importContainer = null;
    this._tableInstance = null;
  }

  private _renderImportButton() {
    if (!this._tableInstance) return;
    let importContainer = document.getElementById('excel-import-buttom');
    if (importContainer) {
      importContainer.parentElement?.removeChild(importContainer);
    }
    importContainer = document.createElement('div');
    importContainer.id = 'excel-import-buttom';
    importContainer.style.position = 'absolute';
    importContainer.style.bottom = '0';
    importContainer.style.right = '0';
    this._tableInstance.getContainer().appendChild(importContainer);
    this._importContainer = importContainer as HTMLDivElement;

    const importExcelButton = document.createElement('button');
    importExcelButton.innerHTML = this.options.buttonText || 'Excel导入';
    importContainer.appendChild(importExcelButton);
    this._importButton = importExcelButton;

    importExcelButton.addEventListener('click', () => {
      this._triggerImport();
    });
  }

  private _triggerImport() {
    const tableInstance = this._tableInstance;
    const pluginInstance = this; // 捕获当前插件实例
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.style.display = 'none';
    document.body.appendChild(input);
    input.addEventListener('change', async e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      if (!tableInstance) {
        alert('表格实例不存在或已销毁，无法导入数据！');
        document.body.removeChild(input);
        return;
      }
      const { columns, records } = await ExcelImportPlugin.importExcelToVTableData(file, pluginInstance.options);
      // 重新 updateOption 时，需带上 plugins 保证插件不会丢失
      tableInstance.updateOption({
        columns,
        plugins: [pluginInstance]
      });
      tableInstance.setRecords(records);
      input.value = '';
      document.body.removeChild(input);
      if (typeof pluginInstance.options.onImported === 'function') {
        pluginInstance.options.onImported(columns, records);
      }
    });
    input.click();
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
    const columns = this.buildColumns(headerRows);
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
        const subColumns = this.buildColumns(headerRows, i, i + span, level + 1);
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
}