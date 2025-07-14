import type { ColumnDefine, ListTableConstructorOptions } from '@visactor/vtable';
import { ListTable } from '@visactor/vtable';
import type { CellCoord, CellRange, CellValueChangedEvent, FormulaOptions, SelectionMode, SheetAPI } from '../ts-types';
import { isValid, type EventEmitter } from '@visactor/vutils';
import { getTablePlugins } from './table-plugins';
import { editor } from '@visactor/vtable/es/register';
/**
 * Sheet constructor options. 内部类型Sheet的构造函数参数类型
 */
export type SheetConstructorOptions = {
  /**
   * Grid data in 2D array format
   */
  data?: any[][];
  /**
   * Formula calculation options
   */
  formula?: FormulaOptions;
  /** Sheet Key */
  sheetKey: string;
  /** Sheet 标题 */
  sheetTitle: string;
  // ...其他属性
} & Omit<ListTableConstructorOptions, 'records'>; // 排除有冲突的属性

/**
 * VTable-Sheet is a lightweight editable spreadsheet component based on VTable
 */
export class Sheet implements SheetAPI {
  options: SheetConstructorOptions;
  container: HTMLElement;

  tableInstance?: ListTable;

  element: HTMLElement;

  /**
   * 选择范围
   */
  private selection: CellRange | null = null;

  /**
   * Sheet Key
   */
  private sheetKey: string;

  /**
   * Sheet 标题
   */
  private sheetTitle: string;

  /**
   * 事件总线
   */
  // private eventBus: EventEmitter;

  /**
   * Creates a new Sheet instance
   * @param options Configuration options
   */
  constructor(options: SheetConstructorOptions) {
    this.options = options;
    this.container = options.container;

    // 初始化基本属性
    this.sheetKey = options.sheetKey;
    this.sheetTitle = options.sheetTitle;

    // 创建表格元素
    this.element = this._createRootElement();
    this.container.appendChild(this.element);

    // 初始化表格
    this._initializeTable();

    // 设置事件监听
    this._setupEventListeners();
  }
  // 实现ListTableAPI所需的属性

  get rowCount(): number {
    const data = this.getData();
    return data ? data.length : 0;
  }

  get colCount(): number {
    const data = this.getData();
    return data && data.length > 0 ? data[0].length : 0;
  }

  get records(): any {
    return this.getData();
  }

  get columns(): any {
    return this.options.columns || [];
  }
  /**
   * Creates the root element for the sheet
   */
  private _createRootElement(): HTMLElement {
    const element = document.createElement('div');
    element.setAttribute('sheet-key', `${this.sheetKey}`);
    element.classList.add('vtable-sheet');
    element.style.outline = 'none';
    element.style.position = 'relative';

    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 600;

    element.style.width = `${width}px`;
    element.style.height = `${height}px`;

    return element;
  }

  /**
   * Initializes the table instance
   */
  private _initializeTable(): void {
    // 这里应该是实际的表格初始化逻辑
    const tableOptions = this._generateTableOptions();
    this.tableInstance = new ListTable(tableOptions);

    // // 获取事件总线 - 这里假设eventBus是存在的，如果不存在需要创建一个
    // this.eventBus = (this.tableInstance as any).eventBus;
  }

  /**
   * Generates VTable options from Sheet options
   */
  private _generateTableOptions(): ListTableConstructorOptions {
    let isShowTableHeader = this.options.showHeader;
    // 转换为ListTable的选项
    if (!this.options.columns) {
      isShowTableHeader = isValid(isShowTableHeader) ? isShowTableHeader : false;
      this.options.columns = [];
    } else {
      for (let i = 0; i < this.options.columns.length; i++) {
        this.options.columns[i].field = i;
      }
    }
    if (!this.options.data) {
      this.options.data = [];
    }
    const keyboardOptions = {
      ...this.options.keyboardOptions,
      copySelected: true,
      pasteValueToCell: true
    };
    return {
      ...this.options,
      records: this.options.data,
      container: this.element,
      showHeader: isShowTableHeader,
      keyboardOptions
      // 其他特定配置
    };
  }

  /**
   * Sets up event listeners
   */
  private _setupEventListeners(): void {
    // 设置事件监听器
  }

  // /**
  //  * 触发事件
  //  */
  // protected fire(eventName: string, eventData: any): void {
  //   if (this.eventBus) {
  //     this.eventBus.emit(eventName, eventData);
  //   }
  // }

  // /**
  //  * 监听事件
  //  */
  // on(eventName: string, handler: (...args: any[]) => void): void {
  //   if (this.eventBus) {
  //     this.eventBus.on(eventName, handler);
  //   }
  // }

  /**
   * Updates the size of the sheet
   */
  resize(): void {
    if (!this.element) {
      return;
    }

    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 600;

    this.element.style.width = `${width}px`;
    this.element.style.height = `${height}px`;

    // 更新表格实例大小
    if (this.tableInstance) {
      // 触发VTable的resize
      this.tableInstance.resize();
    }
  }

  /**
   * Gets the HTML element containing the sheet
   */
  getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Gets the container element
   */
  getContainer(): HTMLElement {
    return this.container;
  }

  /**
   * 获取Sheet的key
   */
  getKey(): string {
    return this.sheetKey;
  }

  /**
   * 获取Sheet的标题
   */
  getTitle(): string {
    return this.sheetTitle;
  }

  /**
   * 设置Sheet的标题
   */
  setTitle(title: string): void {
    this.sheetTitle = title;
  }
  getColumns(): ColumnDefine[] {
    return this.options.columns || [];
  }
  /**
   * 获取表格数据
   */
  getData(): any[][] {
    // 从表格实例获取数据
    return this.options.data || [];
  }

  /**
   * 设置表格数据
   */
  setData(data: any[][]): void {
    this.options.data = data;
    // 更新表格实例数据
    if (this.tableInstance) {
      // TODO: 更新表格数据
    }
  }
  /**
   * Gets the cell value at the specified coordinates
   */
  getCellValue(row: number, col: number): any {
    const data = this.getData();
    if (data && data[row] && data[row][col] !== undefined) {
      return data[row][col];
    }
    return null;
  }

  /**
   * Sets the cell value at the specified coordinates
   */
  setCellValue(row: number, col: number, value: any): void {
    const data = this.getData();
    if (data && data[row]) {
      const oldValue = data[row][col];
      data[row][col] = value;

      // 触发事件
      const event: CellValueChangedEvent = {
        row,
        col,
        oldValue,
        newValue: value,
        cellAddress: this.addressFromCoord(row, col)
      };

      // this.fire('cellValueChanged', event);
    }
  }

  /**
   * Gets cell information by A1 address notation
   */
  getCellByAddress(address: string): { row: number; col: number; value: any } {
    const coord = this.coordFromAddress(address);
    return {
      row: coord.row,
      col: coord.col,
      value: this.getCellValue(coord.row, coord.col)
    };
  }

  /**
   * Converts row/col coordinates to A1 notation
   */
  addressFromCoord(row: number, col: number): string {
    let colStr = '';
    let tempCol = col + 1;

    do {
      tempCol -= 1;
      colStr = String.fromCharCode(65 + (tempCol % 26)) + colStr;
      tempCol = Math.floor(tempCol / 26);
    } while (tempCol > 0);

    return `${colStr}${row + 1}`;
  }

  /**
   * Converts A1 notation to row/col coordinates
   */
  coordFromAddress(address: string): CellCoord {
    const match = address.match(/^([A-Z]+)([0-9]+)$/);
    if (!match) {
      throw new Error(`Invalid cell address: ${address}`);
    }

    const colStr = match[1];
    const rowStr = match[2];

    let col = 0;
    for (let i = 0; i < colStr.length; i++) {
      col = col * 26 + (colStr.charCodeAt(i) - 64);
    }

    return {
      row: parseInt(rowStr, 10) - 1,
      col: col - 1
    };
  }

  /**
   * Gets the current selection
   */
  getSelection(): CellRange | null {
    return this.selection;
  }

  /**
   * Sets the current selection
   */
  setSelection(range: CellRange): void {
    this.selection = range;
    // 更新UI选择
  }

  /**
   * Inserts a row at the specified index
   */
  insertRow(index: number, data?: any[]): void {
    // 插入行实现
  }

  /**
   * Inserts a column at the specified index
   */
  insertColumn(index: number, data?: any[]): void {
    // 插入列实现
  }

  /**
   * Deletes a row at the specified index
   */
  deleteRow(index: number): void {
    // 删除行实现
  }

  /**
   * Deletes a column at the specified index
   */
  deleteColumn(index: number): void {
    // 删除列实现
  }

  /**
   * Imports data from CSV
   */
  importFromCSV(csv: string): void {
    // CSV导入实现
  }

  /**
   * Exports data to CSV
   */
  exportToCSV(): string {
    // CSV导出实现
    return '';
  }

  /**
   * 将第一行设置为表头
   */
  setFirstRowAsHeader(): void {
    const data = this.getData();
    if (data && data.length > 0) {
      for (let i = 0; i < data[0].length; i++) {
        if (!this.options.columns[i]) {
          this.options.columns[i] = {
            field: i,
            title: data[0][i]
          };
        } else {
          this.options.columns[i].title = data[0][i];
          this.options.columns[i].field = i;
        }
      }
    }
    data.shift();
    this.tableInstance.updateOption({
      ...this.options,
      columns: this.options.columns,
      showHeader: true,
      records: data
    });
  }

  /**
   * Releases resources
   */
  release(): void {
    // 清理事件监听器

    // 释放表格实例
    if (this.tableInstance) {
      this.tableInstance.release();
    }

    // 从DOM中移除元素
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    // 清除引用
    this.tableInstance = undefined;
  }
  undo(): void {
    // 撤销实现
  }

  redo(): void {
    // 重做实现
  }
}
