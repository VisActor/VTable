import { ListTable } from '@visactor/vtable';
import type {
  CellCoord,
  CellRange,
  CellValueChangedEvent,
  SelectionMode,
  SheetAPI,
  SheetConstructorOptions,
  SheetDefine
} from '../ts-types';
import type { EventEmitter } from '@visactor/vutils';
import type VTableSheet from '../components/vtable-sheet';
import { getTablePlugins } from './table-plugins';
import { editor } from '@visactor/vtable/es/register';
import { EventTarget } from '../event/event-target';

/**
 * Sheet构造函数扩展选项
 */
export interface SheetOptions extends SheetConstructorOptions {
  /** Sheet Key */
  sheetKey: string;
  /** Sheet 标题 */
  sheetTitle: string;
  /** 父组件 */
  parent: VTableSheet;
}

/**
 * VTable-Sheet is a lightweight editable spreadsheet component based on VTable
 */
export class Sheet extends EventTarget implements SheetAPI {
  options: SheetOptions;
  container: HTMLElement;

  tableInstance?: ListTable;

  element: HTMLElement;

  parsedOptions: {
    defaultRowHeight: number;
    defaultColWidth: number;
    showRowHeader: boolean;
    showColHeader: boolean;
    editable: boolean;
    theme: string;
    selectionMode: SelectionMode;
    pixelRatio: number;
  } = {} as any;

  /**
   * 选择范围
   */
  private selection: CellRange | null = null;

  /**
   * 父组件
   */
  private parent: VTableSheet;

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
  private eventBus: EventEmitter;

  /**
   * Creates a new Sheet instance
   * @param options Configuration options
   */
  constructor(options: SheetOptions) {
    super();
    this.options = options;
    this.container = options.container;

    // 初始化基本属性
    this.parent = options.parent;
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
    this.element.classList.add('vtable-excel-cursor');
    // 获取事件总线
    this.eventBus = (this.tableInstance as any).eventBus;
  }

  /**
   * Generates VTable options from Sheet options
   */
  private _generateTableOptions(): any {
    // 转换为ListTable的选项
    return {
      ...this.options,
      container: this.element
    };
  }

  /**
   * Sets up event listeners
   */
  private _setupEventListeners(): void {
    if (this.tableInstance) {
      // 监听单元格选择事件
      this.tableInstance.on('selected_cell', (event: any) => {
        this.handleCellSelected(event);
      });

      // 监听单元格值变更事件
      this.tableInstance.on('change_cell_value', (event: any) => {
        this.handleCellValueChanged(event);
      });

      // 监听双击进入编辑状态
      this.tableInstance.on('dblclick_cell', (event: any) => {
        this.element.classList.remove('vtable-excel-cursor');
        this.handleCellValueChanged(event);
      });

      // 监听编辑结束事件，恢复十字光标

      this.tableInstance.on('click_cell', () => {
        this.element.classList.add('vtable-excel-cursor');
      });
    }
  }

  /**
   * 处理单元格选择事件
   */
  private handleCellSelected(event: any): void {
    // 更新选择范围
    this.selection = {
      startRow: event.row - 1,
      startCol: event.col - 1,
      endRow: event.row - 1,
      endCol: event.col - 1
    };

    // 触发事件给父组件
    this.fire('cell-selected', event);
  }

  /**
   * 处理单元格值变更事件
   */
  private handleCellValueChanged(event: any): void {
    this.fire('cell-value-changed', {
      row: event.row - 1,
      col: event.col - 1,
      oldValue: event.rawValue,
      newValue: event.changedValue
    });
  }

  /**
   * 触发事件
   */
  protected fireEvent(eventName: string, eventData: any): void {
    this.fire(eventName, eventData);
  }

  /**
   * 监听事件
   */
  on(eventName: string, handler: (...args: any[]) => void): this {
    return super.on(eventName, handler);
  }

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
    if (this.tableInstance) {
      try {
        // 尝试交换参数顺序：可能是(row, col)而不是(col, row)
        const value = this.tableInstance.getCellValue(col + 1, row + 1);
        return value;
      } catch (error) {
        console.warn('Failed to get cell value from VTable:', error);
      }
    }

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

      // 更新表格实例
      if (this.tableInstance) {
        this.tableInstance.changeCellValue(col, row, value);
      }

      // 触发事件
      const event: CellValueChangedEvent = {
        row,
        col,
        oldValue,
        newValue: value,
        cellAddress: this.addressFromCoord(row, col)
      };

      this.fire('cellValueChanged', event);
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
   * Undo the last operation
   */
  undo(): void {
    // 撤销操作实现
  }

  /**
   * Redo the last undone operation
   */
  redo(): void {
    // 重做操作实现
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
}
