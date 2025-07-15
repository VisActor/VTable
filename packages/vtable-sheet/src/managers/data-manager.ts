import type { Sheet } from '../core/Sheet';
import { dataToRecords } from '../sheet-helper';

export class DataManager {
  /** Sheet实例 */
  private sheet: Sheet;
  /** 数据 */
  private data: any[][] = [];
  /** 列定义 */
  private columns: any[] = [];

  constructor(sheet: Sheet) {
    this.sheet = sheet;
    this.initializeData();
  }

  /**
   * 初始化数据
   */
  private initializeData(): void {
    const options = this.sheet.options;

    // 从选项中初始化数据或创建空数据
    if (options.data && Array.isArray(options.data)) {
      this.data = options.data;
    } else {
      // 创建一个默认的空网格
      const rows = 100;
      const cols = 26;
      this.data = Array(rows)
        .fill(0)
        .map(() => Array(cols).fill(''));
    }

    // 初始化列
    if (options.columns && Array.isArray(options.columns)) {
      this.columns = options.columns;
    } else {
      // 创建默认列
      this.columns = Array(this.getColCount())
        .fill(0)
        .map((_, index) => ({
          field: index.toString(),
          title: String.fromCharCode(65 + index)
        }));
    }
  }

  /**
   * 获取行数
   */
  getRowCount(): number {
    return this.data.length;
  }

  /**
   * 获取列数
   */
  getColCount(): number {
    return this.data.length > 0 ? this.data[0].length : 0;
  }

  /**
   * 获取指定单元格的值
   * @param row 行索引
   * @param col 列索引
   */
  getCellValue(row: number, col: number): any {
    if (row < 0 || row >= this.getRowCount() || col < 0 || col >= this.getColCount()) {
      return null;
    }

    return this.data[row][col];
  }

  /**
   * 设置指定单元格的值
   * @param row 行索引
   * @param col 列索引
   * @param value 要设置的值
   */
  setCellValue(row: number, col: number, value: any): void {
    if (row < 0 || row >= this.getRowCount() || col < 0 || col >= this.getColCount()) {
      return;
    }

    this.data[row][col] = value;
  }

  /**
   * 获取数据
   */
  getData(): any[][] {
    return this.data;
  }

  /**
   * 设置数据
   * @param data 要设置的数据
   */
  setData(data: any[][]): void {
    this.data = data;
  }

  /**
   * 获取数据
   */
  getRecords(): any[] {
    return dataToRecords(this.data);
  }

  /**
   * 获取列定义
   */
  getColumns(): any[] {
    return this.columns;
  }

  /**
   * 设置列定义
   * @param columns 要设置的列定义
   */
  setColumns(columns: any[]): void {
    this.columns = columns;
  }

  /**
   * 插入行
   * @param index 行索引
   * @param data 行数据
   */
  insertRow(index: number, data?: any[]): void {
    if (index < 0 || index > this.getRowCount()) {
      return;
    }

    const newRow = data || Array(this.getColCount()).fill('');
    this.data.splice(index, 0, newRow);
  }

  /**
   * 删除行
   * @param index 行索引
   */
  deleteRow(index: number): void {
    if (index < 0 || index >= this.getRowCount()) {
      return;
    }

    this.data.splice(index, 1);
  }

  /**
   * 插入列
   * @param index 列索引
   * @param data 列数据
   */
  insertColumn(index: number, data?: any[]): void {
    if (index < 0 || index > this.getColCount()) {
      return;
    }

    const colData = data || Array(this.getRowCount()).fill('');

    // 插入列数据到每一行
    for (let i = 0; i < this.getRowCount(); i++) {
      this.data[i].splice(index, 0, colData[i] || '');
    }

    // 更新列定义
    this.columns.splice(index, 0, {
      field: index.toString(),
      title: String.fromCharCode(65 + index)
    });

    // 更新插入列后的列字段名
    for (let i = index + 1; i < this.columns.length; i++) {
      this.columns[i].field = i.toString();
      this.columns[i].title = String.fromCharCode(65 + i);
    }
  }

  /**
   * 删除列
   * @param index 列索引
   */
  deleteColumn(index: number): void {
    if (index < 0 || index >= this.getColCount()) {
      return;
    }

    // 从每一行中删除列
    for (let i = 0; i < this.getRowCount(); i++) {
      this.data[i].splice(index, 1);
    }

    // 更新列定义
    this.columns.splice(index, 1);

    // 更新删除列后的列字段名
    for (let i = index; i < this.columns.length; i++) {
      this.columns[i].field = i.toString();
      this.columns[i].title = String.fromCharCode(65 + i);
    }
  }

  /**
   * 从CSV导入数据
   * @param csv CSV字符串
   */
  importFromCSV(csv: string): void {
    if (!csv) {
      return;
    }

    // 基本CSV解析
    const rows = csv.split('\n');
    const newData: any[][] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i].split(',');
      newData.push(row);
    }

    this.setData(newData);
  }

  /**
   * 导出数据到CSV字符串
   */
  exportToCSV(): string {
    const rows: string[] = [];

    for (let i = 0; i < this.getRowCount(); i++) {
      const row = this.data[i].join(',');
      rows.push(row);
    }

    return rows.join('\n');
  }
}
