import type { ColumnDefine, ListTableConstructorOptions } from '@visactor/vtable';
import { ListTable } from '@visactor/vtable';
import { isValid, type EventEmitter } from '@visactor/vutils';
import { EventTarget } from '../event/event-target';
import type {
  IWorkSheetOptions,
  IWorkSheetAPI,
  CellCoord,
  CellRange,
  CellValue,
  CellValueChangedEvent,
  IFormulaManagerOptions
} from '../ts-types';
import type { TYPES, VTableSheet } from '..';
import { isPropertyWritable } from '../tools';
import { VTableThemes } from '../ts-types';
import { detectFunctionParameterPosition } from '../formula/formula-helper';

/**
 * Sheet constructor options. 内部类型Sheet的构造函数参数类型
 */
export type WorkSheetConstructorOptions = {
  /** 表格数据 */
  data?: any[][];
  /** 公式计算选项 */
  formula?: IFormulaManagerOptions;
  /** Sheet 唯一标识 */
  sheetKey: string;
  /** Sheet 标题 */
  sheetTitle: string;
} & Omit<ListTableConstructorOptions, 'records'>;

export class WorkSheet extends EventTarget implements IWorkSheetAPI {
  /** 选项 */
  options: IWorkSheetOptions;
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

  private vtableSheet: VTableSheet;

  editingCell: { sheet: string; row: number; col: number } | null = null;

  constructor(sheet: VTableSheet, options: IWorkSheetOptions) {
    super();
    this.options = options;
    this.container = options.container;

    // 初始化基本属性
    this.sheetKey = options.sheetKey;
    this.sheetTitle = options.sheetTitle;
    this.vtableSheet = sheet;

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
    return this.tableInstance.rowCount;
  }

  /**
   * 获取列数
   */
  getColumnCount(): number {
    return this.tableInstance.colCount;
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
    } else if (this.options.columns.length === 0 && this.options.firstRowAsHeader) {
      const data = this.options.data;
      if (data && data.length > 0) {
        for (let i = 0; i < data[0].length; i++) {
          this.options.columns[i] = {
            field: i,
            title: data[0][i],
            filter: !!this.options.filter
          };
        }
      }
      data.shift();
      isShowTableHeader = true;
    }
    const keyboardOptions = {
      ...this.options.keyboardOptions,
      copySelected: true,
      pasteValueToCell: true,
      showCopyCellBorder: true,
      cutSelected: true
    };

    //更改theme 的frameStyle
    let changedTheme: TYPES.VTableThemes.ITableThemeDefine;
    if (!this.options?.theme) {
      this.options.theme = VTableThemes.DEFAULT;
    }
    this.options.theme = this.options.theme;
    if (this.options.theme.bodyStyle && !isPropertyWritable(this.options.theme, 'bodyStyle')) {
      //测试是否使用了主题 使用了主题配置项不可写。
      changedTheme = (this.options.theme as TYPES.VTableThemes.TableTheme).extends(
        (this.options.theme as TYPES.VTableThemes.TableTheme).getExtendTheme()
      ); //防止将原主题如DARK ARCO的属性改掉
      const extendThemeOption = (changedTheme as TYPES.VTableThemes.TableTheme).getExtendTheme();

      extendThemeOption.frameStyle = Object.assign({}, extendThemeOption.frameStyle, {
        shadowBlur: 0,
        cornerRadius: 0,
        borderLineWidth: 0
      });
    } else {
      changedTheme = this.options.theme;
      changedTheme.frameStyle = Object.assign({}, this.options.theme.frameStyle, {
        shadowBlur: 0,
        cornerRadius: 0,
        borderLineWidth: 0
      });
    }
    return {
      ...this.options,
      addRecordRule: 'Array',
      defaultCursor: 'cell',
      records: this.options.data,
      sortState: this.options.sortState,
      container: this.element,
      showHeader: isShowTableHeader,
      keyboardOptions,
      theme: changedTheme,
      excelOptions: {
        fillHandle: true
      },
      customConfig: {
        selectCellWhenCellEditorNotExists: true
      }
      // maintainedColumnCount: 120
      // 其他特定配置
    };
  }

  /**
   * 设置事件监听
   */
  private _setupEventListeners(): void {
    if (this.tableInstance) {
      // 监听单元格选择事件 - 优化：移除console.log调试代码
      this.tableInstance.on('mousedown_cell', (event: any) => {
        if (this.vtableSheet.formulaManager.formulaWorkingOnCell) {
          //防止公式输入状态下，原本的input元素blur掉，导致公式输入框无法输入
          event.event.preventDefault();
        }
      });

      // 监听选择变化事件（多选时）- 优化：移除console.log调试代码
      this.tableInstance.on('selected_changed' as any, (event: any) => {
        console.log('selected_changed', this.tableInstance.eventManager.isDraging);
        // 判断是drag过程中的选中单元格变化
        if (!this.tableInstance.eventManager.isDraging) {
          if (!this.vtableSheet.formulaManager.formulaWorkingOnCell) {
            this.editingCell = {
              sheet: this.getKey(),
              row: event.row,
              col: event.col
            };
          }
          this.handleCellSelected(event);
        }
        this.handleSelectionChanged(event);
        // if (this.vtableSheet.formulaManager.formulaWorkingOnCell) {
        //   //#region 在完整公式状态下 计算完结果 可以退出编辑状态  并重新响应重新选中的单元格
        //   this.vtableSheet.formulaManager.inputIsParamMode = detectFunctionParameterPosition(
        //     this.vtableSheet.formulaManager.inputingElement.value,
        //     this.vtableSheet.formulaManager.lastKnownCursorPosInFormulaInput
        //   );
        //   if (!this.vtableSheet.formulaManager.inputIsParamMode.inParamMode) {
        //     this.vtableSheet.formulaManager.formulaWorkingOnCell = null;
        //     this.handleCellSelected(event);
        //   }
        // }
        //#endregion
      });

      // 监听拖拽选择结束事件 - 优化：移除console.log和debugger调试代码
      this.tableInstance.on('drag_select_end' as any, (event: any) => {
        this.handleDragSelectEnd(event);
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
   * 处理选择变化事件
   * @param event 选择变化事件
   */
  private handleSelectionChanged(event: any): void {
    if (event?.ranges?.length) {
      const r = event.ranges[event.ranges.length - 1];
      this.selection = {
        startRow: r.start.row,
        startCol: r.start.col,
        endRow: r.end.row,
        endCol: r.end.col
      };
    }
    this.fire('selection-changed', event);
  }

  /**
   * 处理拖拽选择结束事件
   * @param event 拖拽选择结束事件
   */
  private handleDragSelectEnd(event: any): void {
    if (event?.cells?.length) {
      const first = event.cells[0][0];
      const lastRow = event.cells[event.cells.length - 1];
      const last = lastRow[lastRow.length - 1];
      this.selection = {
        startRow: first.row,
        startCol: first.col,
        endRow: last.row,
        endCol: last.col
      };
    }
    this.fire('selection-end', event);
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

  // 用于防止短时间内多次调用resize的节流变量
  private resizeTimer: number | null = null;
  private isResizing = false;

  /**
   * 更新Sheet大小
   * 使用节流方式避免频繁调用resize
   */
  resize(): void {
    if (!this.element) {
      return;
    }

    // 如果正在进行调整，清除之前的定时器
    if (this.resizeTimer !== null) {
      window.clearTimeout(this.resizeTimer);
      this.resizeTimer = null;
    }

    // 如果已经在执行resize，设置一个短期延迟
    if (this.isResizing) {
      this.resizeTimer = window.setTimeout(() => {
        this.doResize();
        this.resizeTimer = null;
      }, 50);
      return;
    }

    // 否则直接执行resize
    this.doResize();
  }

  /**
   * 实际执行调整大小的操作
   * @private
   */
  private doResize(): void {
    try {
      this.isResizing = true;

      const width = this.container.clientWidth || 800;
      const height = this.container.clientHeight || 600;

      // 只有尺寸确实变化时才更新样式和触发表格实例的resize
      if (parseInt(this.element.style.width, 10) !== width || parseInt(this.element.style.height, 10) !== height) {
        this.element.style.width = `${width}px`;
        this.element.style.height = `${height}px`;

        // 更新表格实例大小
        if (this.tableInstance) {
          // 触发VTable的resize
          this.tableInstance.resize();
        }
      }
    } catch (error) {
      console.error('Error during resize:', error);
    } finally {
      this.isResizing = false;
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
    this.options.sheetTitle = title;
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
      this.tableInstance.updateOption({
        records: data
      });
      // 更新公式引擎中的数据
      if (this.vtableSheet?.formulaManager) {
        try {
          this.vtableSheet.formulaManager.setSheetContent(this.sheetKey, data);
        } catch (e) {
          console.warn('Failed to update formula data:', e);
        }
      }
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
   * 获取多个选择范围（支持Ctrl/Cmd多选）
   */
  getMultipleSelections(): CellRange[] {
    if (!this.tableInstance) {
      return this.selection ? [this.selection] : [];
    }

    // 从底层VTable获取所有选择范围
    const vtableRanges = this.tableInstance.getSelectedCellRanges();

    if (vtableRanges.length === 0) {
      return this.selection ? [this.selection] : [];
    }

    // 转换VTable的坐标格式到WorkSheet格式
    return vtableRanges.map(range => ({
      startRow: range.start.row,
      startCol: range.start.col,
      endRow: range.end.row,
      endCol: range.end.col
    }));
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
    this.tableInstance?.release();
  }
}
