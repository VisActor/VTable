import type { ColumnDefine, ListTableConstructorOptions } from '@visactor/vtable';
import { ListTable } from '@visactor/vtable';
import { isValid, type EventEmitter } from '@visactor/vutils';
import { EventTarget } from '../event/event-target';
import type {
  ISheetOptions,
  ISheetAPI,
  CellCoord,
  CellRange,
  CellValue,
  CellValueChangedEvent,
  IFormulaManagerOptions
} from '../ts-types';

/**
 * Sheet constructor options. 内部类型Sheet的构造函数参数类型
 */
export type SheetConstructorOptions = {
  /** 表格数据 */
  data?: any[][];
  /** 公式计算选项 */
  formula?: IFormulaManagerOptions;
  /** Sheet 唯一标识 */
  sheetKey: string;
  /** Sheet 标题 */
  sheetTitle: string;
} & Omit<ListTableConstructorOptions, 'records'>;

export class Sheet extends EventTarget implements ISheetAPI {
  /** 选项 */
  options: ISheetOptions;
  /** 容器 */
  container: HTMLElement;
  /** 表格实例 */
  tableInstance?: ListTable;
  /** 元素 */
  element: HTMLElement;
  /** 选择范围 */
  private selection: CellRange | null = null;
  /** Sheet 唯一标识 */
  private sheetKey: string;
  /** Sheet 标题 */
  private sheetTitle: string;

  /** 事件总线 */
  private eventBus: EventEmitter;

  private parent: any;

  constructor(options: ISheetOptions) {
    super();
    this.options = options;
    this.container = options.container;

    // 初始化基本属性
    this.sheetKey = options.sheetKey;
    this.sheetTitle = options.sheetTitle;
    this.parent = options.parent;

    // 创建表格元素
    this.element = this._createRootElement();
    this.container.appendChild(this.element);

    // 初始化表格
    this._initializeTable();

    // 设置事件监听
    this._setupEventListeners();
  }

  /**
   * 获取行数
   */
  get rowCount(): number {
    const data = this.getData();
    return data ? data.length : 0;
  }

  /**
   * 获取列数
   */
  get colCount(): number {
    const data = this.getData();
    return data && data.length > 0 ? data[0].length : 0;
  }

  /**
   * 获取行数
   */
  getRowCount(): number {
    return this.rowCount;
  }

  /**
   * 获取列数
   */
  getColumnCount(): number {
    return this.colCount;
  }

  /**
   * 获取表格数据
   */
  get records(): any {
    return this.getData();
  }

  /**
   * 获取列定义
   */
  get columns(): any {
    return this.options.columns || [];
  }

  /**
   * 创建根元素
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
   * 初始化表格实例
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
   * 生成VTable选项
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
      pasteValueToCell: true,
      showCopyCellBorder: true
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
   * 设置事件监听
   */
  private _setupEventListeners(): void {
    if (this.tableInstance) {
      // 监听单元格选择事件
      this.tableInstance.on('selected_cell', (event: any) => {
        this.handleCellSelected(event);
      });

      // 监听双击进入编辑状态
      this.tableInstance.on('dblclick_cell', (event: any) => {
        this.element.classList.remove('vtable-excel-cursor');

        // 获取公式
        const formula = this.parent.formulaManager.getCellFormula({
          sheet: this.getKey(),
          row: event.row,
          col: event.col
        });

        if (formula) {
          // 进入编辑状态
          this.tableInstance.startEditCell(event.col, event.row, formula);
        } else {
          // 不是公式单元格，直接进入编辑状态
          this.tableInstance.startEditCell(event.col, event.row);
        }
      });

      // 监听单元格值变更事件
      this.tableInstance.on('change_cell_value', (event: any) => {
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
   * @param event 选择事件
   */
  private handleCellSelected(event: any): void {
    // 更新选择范围
    this.selection = {
      startRow: event.row,
      startCol: event.col,
      endRow: event.row,
      endCol: event.col
    };

    // 触发事件给父组件
    this.fire('cell-selected', event);
  }

  /**
   * 处理单元格值变更事件
   * @param event 值变更事件
   */
  private handleCellValueChanged(event: any): void {
    this.fire('cell-value-changed', {
      row: event.row,
      col: event.col,
      oldValue: event.rawValue,
      newValue: event.changedValue
    });
  }

  /**
   * 触发事件
   * @param eventName 事件名称
   * @param eventData 事件数据
   */
  protected fireEvent(eventName: string, eventData: any): void {
    this.fire(eventName, eventData);
  }

  /**
   * 监听事件
   * @param eventName 事件名称
   * @param handler 事件处理函数
   */
  on(eventName: string, handler: (...args: any[]) => void): this {
    return super.on(eventName, handler);
  }

  /**
   * 更新Sheet大小
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
   * 获取Sheet元素
   */
  getElement(): HTMLElement {
    return this.element;
  }

  /**
   * 获取Sheet容器
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
   * 获取列定义
   */
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
   * @param data 表格数据
   */
  setData(data: any[][]): void {
    this.options.data = data;
    // 更新表格实例数据
    if (this.tableInstance) {
      // TODO: 更新表格数据
    }
  }
  /**
   * 获取指定坐标的单元格值
   * @param row 行索引
   * @param col 列索引
   */
  getCellValue(row: number, col: number): any {
    if (this.tableInstance) {
      try {
        const value = this.tableInstance.getCellValue(col, row);
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
   * 设置指定坐标的单元格值
   * @param row 行索引
   * @param col 列索引
   * @param value 新值
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
        newValue: value
      };

      this.fire('cellValueChanged', event);
    }
  }

  /**
   * 根据A1地址获取单元格信息
   * @param address A1地址
   */
  getCellByAddress(address: string): { coord: CellCoord; value: CellValue } {
    const coord = this.coordFromAddress(address);
    return {
      coord,
      value: this.getCellValue(coord.row, coord.col)
    };
  }

  /**
   * 将行/列坐标转换为A1格式
   * @param coord 坐标
   */
  addressFromCoord(coord: CellCoord): string;
  addressFromCoord(row: number, col: number): string;
  addressFromCoord(coordOrRow: CellCoord | number, col?: number): string {
    let row: number;
    let colNum: number;

    if (typeof coordOrRow === 'object') {
      row = coordOrRow.row;
      colNum = coordOrRow.col;
    } else {
      row = coordOrRow;
      colNum = col!;
    }

    let colStr = '';
    let tempCol = colNum + 1;

    do {
      tempCol -= 1;
      colStr = String.fromCharCode(65 + (tempCol % 26)) + colStr;
      tempCol = Math.floor(tempCol / 26);
    } while (tempCol > 0);

    return `${colStr}${row + 1}`;
  }

  /**
   * 将A1格式转换为行/列坐标
   * @param address A1地址
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
   * 获取当前选择
   */
  getSelection(): CellRange | null {
    return this.selection;
  }

  /**
   * 设置当前选择
   * @param range 选择范围
   */
  setSelection(range: CellRange): void {
    this.selection = range;
    // 更新UI选择
  }

  /**
   * 插入行
   * @param index 行索引
   * @param data 数据
   */
  insertRow(index: number, data?: any[]): void {
    // TODO: 插入行实现
  }

  /**
   * 插入列
   * @param index 列索引
   * @param data 数据
   */
  insertColumn(index: number, data?: any[]): void {
    // TODO: 插入列实现
  }

  /**
   * 删除行
   * @param index 行索引
   */
  deleteRow(index: number): void {
    // TODO: 删除行实现
  }

  /**
   * 删除列
   * @param index 列索引
   */
  deleteColumn(index: number): void {
    // TODO: 删除列实现
  }

  /**
   * 从CSV导入数据
   * @param csv CSV数据
   */
  importFromCSV(csv: string): void {
    // TODO: CSV导入实现
  }

  /**
   * 导出数据到CSV
   */
  exportToCSV(): string {
    // TODO: CSV导出实现
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
   * 释放资源
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

  /**
   * 撤销
   */
  undo(): void {
    // TODO: 撤销实现
  }

  /**
   * 重做
   */
  redo(): void {
    // TODO: 重做实现
  }

  /**
   * 清除数据
   */
  clearData(): void {
    this.setData([]);
  }

  /**
   * 获取可见行范围
   * @returns 可见行范围
   */
  getVisibleRowRange(): { start: number; end: number } {
    // TODO: 实现可见行范围获取
    return { start: 0, end: this.getRowCount() };
  }

  /**
   * 获取可见列范围
   * @returns 可见列范围
   */
  getVisibleColumnRange(): { start: number; end: number } {
    // TODO: 实现可见列范围获取
    return { start: 0, end: this.getColumnCount() };
  }

  /**
   * 滚动到指定单元格
   * @param coord 坐标
   */
  scrollToCell(coord: CellCoord): void {
    // TODO: 实现滚动到单元格功能
    console.log('Scroll to cell:', coord);
  }

  /**
   * 获取单元格DOM元素
   * @param coord 坐标
   * @returns 单元格DOM元素
   */
  getCellElement(coord: CellCoord): HTMLElement | null {
    // TODO: 实现获取单元格DOM元素
    return null;
  }

  /**
   * 获取行高
   * @param row 行索引
   * @returns 行高
   */
  getRowHeight(row: number): number {
    // TODO: 实现获取行高
    const defaultHeight = this.options.defaultRowHeight;
    return typeof defaultHeight === 'number' ? defaultHeight : 25;
  }

  /**
   * 设置行高
   * @param row 行索引
   * @param height 行高
   */
  setRowHeight(row: number, height: number): void {
    // TODO: 实现设置行高
    console.log('Set row height:', row, height);
  }

  /**
   * 获取列宽
   * @param col 列索引
   * @returns 列宽
   */
  getColumnWidth(col: number): number {
    // TODO: 实现获取列宽
    return this.options.defaultColWidth || 100;
  }

  /**
   * 设置列宽
   * @param col 列索引
   * @param width 列宽
   */
  setColumnWidth(col: number, width: number): void {
    // TODO: 实现设置列宽
    console.log('Set column width:', col, width);
  }
}
