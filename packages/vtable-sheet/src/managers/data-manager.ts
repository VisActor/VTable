import type { Sheet } from '../core/Sheet';
import { dataToRecords, recordsToData } from '../sheet-helper';

/**
 * Manages data for the Sheet component
 */
export class DataManager {
  private sheet: Sheet;
  private data: any[][] = [];
  private columns: any[] = [];

  /**
   * Creates a new DataManager instance
   * @param sheet The Sheet instance
   */
  constructor(sheet: Sheet) {
    this.sheet = sheet;
    this.initializeData();
  }

  /**
   * Initializes data from the sheet options
   */
  private initializeData(): void {
    const options = this.sheet.options;

    // Initialize data from options or create empty data
    if (options.data && Array.isArray(options.data)) {
      this.data = options.data;
    } else {
      // Create a default empty grid
      const rows = 100;
      const cols = 26;
      this.data = Array(rows)
        .fill(0)
        .map(() => Array(cols).fill(''));
    }

    // Initialize columns
    if (options.columns && Array.isArray(options.columns)) {
      this.columns = options.columns;
    } else {
      // Create default columns
      this.columns = Array(this.getColCount())
        .fill(0)
        .map((_, index) => ({
          field: index.toString(),
          title: String.fromCharCode(65 + index)
        }));
    }
  }

  /**
   * Gets the number of rows
   */
  getRowCount(): number {
    return this.data.length;
  }

  /**
   * Gets the number of columns
   */
  getColCount(): number {
    return this.data.length > 0 ? this.data[0].length : 0;
  }

  /**
   * Gets the value at the specified cell coordinates
   * @param row Row index
   * @param col Column index
   */
  getCellValue(row: number, col: number): any {
    if (row < 0 || row >= this.getRowCount() || col < 0 || col >= this.getColCount()) {
      return null;
    }

    return this.data[row][col];
  }

  /**
   * Sets the value at the specified cell coordinates
   * @param row Row index
   * @param col Column index
   * @param value Value to set
   */
  setCellValue(row: number, col: number, value: any): void {
    if (row < 0 || row >= this.getRowCount() || col < 0 || col >= this.getColCount()) {
      return;
    }

    this.data[row][col] = value;
  }

  /**
   * Gets the data as a 2D array
   */
  getData(): any[][] {
    return this.data;
  }

  /**
   * Sets the data as a 2D array
   * @param data Data to set
   */
  setData(data: any[][]): void {
    this.data = data;
  }

  /**
   * Gets the data as VTable records
   */
  getRecords(): any[] {
    return dataToRecords(this.data);
  }

  /**
   * Gets the columns definition
   */
  getColumns(): any[] {
    return this.columns;
  }

  /**
   * Sets the columns definition
   * @param columns Columns to set
   */
  setColumns(columns: any[]): void {
    this.columns = columns;
  }

  /**
   * Inserts a row at the specified index
   * @param index Row index
   * @param data Row data
   */
  insertRow(index: number, data?: any[]): void {
    if (index < 0 || index > this.getRowCount()) {
      return;
    }

    const newRow = data || Array(this.getColCount()).fill('');
    this.data.splice(index, 0, newRow);
  }

  /**
   * Deletes a row at the specified index
   * @param index Row index
   */
  deleteRow(index: number): void {
    if (index < 0 || index >= this.getRowCount()) {
      return;
    }

    this.data.splice(index, 1);
  }

  /**
   * Inserts a column at the specified index
   * @param index Column index
   * @param data Column data
   */
  insertColumn(index: number, data?: any[]): void {
    if (index < 0 || index > this.getColCount()) {
      return;
    }

    const colData = data || Array(this.getRowCount()).fill('');

    // Insert the column data into each row
    for (let i = 0; i < this.getRowCount(); i++) {
      this.data[i].splice(index, 0, colData[i] || '');
    }

    // Update columns definition
    this.columns.splice(index, 0, {
      field: index.toString(),
      title: String.fromCharCode(65 + index)
    });

    // Update field names for columns after the inserted column
    for (let i = index + 1; i < this.columns.length; i++) {
      this.columns[i].field = i.toString();
      this.columns[i].title = String.fromCharCode(65 + i);
    }
  }

  /**
   * Deletes a column at the specified index
   * @param index Column index
   */
  deleteColumn(index: number): void {
    if (index < 0 || index >= this.getColCount()) {
      return;
    }

    // Remove the column from each row
    for (let i = 0; i < this.getRowCount(); i++) {
      this.data[i].splice(index, 1);
    }

    // Update columns definition
    this.columns.splice(index, 1);

    // Update field names for columns after the deleted column
    for (let i = index; i < this.columns.length; i++) {
      this.columns[i].field = i.toString();
      this.columns[i].title = String.fromCharCode(65 + i);
    }
  }

  /**
   * Imports data from a CSV string
   * @param csv CSV string
   */
  importFromCSV(csv: string): void {
    if (!csv) {
      return;
    }

    // Basic CSV parsing
    const rows = csv.split('\n');
    const newData: any[][] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i].split(',');
      newData.push(row);
    }

    this.setData(newData);
  }

  /**
   * Exports data to a CSV string
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
