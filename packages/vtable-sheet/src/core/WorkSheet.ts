import type { ColumnDefine, ListTableConstructorOptions, ColumnsDefine } from '@visactor/vtable';
import { ListTable } from '@visactor/vtable';
import { isValid } from '@visactor/vutils';
import type {
  IWorkSheetOptions,
  IWorkSheetAPI,
  CellCoord,
  CellRange,
  CellValue,
  IFormulaManagerOptions
} from '../ts-types';
import type { TYPES, VTableSheet } from '..';
import { isPropertyWritable } from '../tools';
import { VTableThemes } from '../ts-types';
import { FormulaPasteProcessor } from '../formula/formula-paste-processor';
import { WorkSheetEventManager } from '../event/worksheet-event-manager';
import type { VTableSheetEventBus } from '../event/vtable-sheet-event-bus';
import type { IWorksheetEventSource } from '../event/event-interfaces';

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

export class WorkSheet implements IWorkSheetAPI, IWorksheetEventSource {
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
  private _sheetKey: string;
  /** Sheet 标题 */
  private _sheetTitle: string;

  /** 事件总线 */
  private eventBus: VTableSheetEventBus;

  /** WorkSheet 事件管理器 */
  eventManager: WorkSheetEventManager;

  private vtableSheet: VTableSheet;

  editingCell: { sheet: string; row: number; col: number } | null = null;

  /**
   * 获取 Sheet Key
   */
  get sheetKey(): string {
    return this._sheetKey;
  }

  /**
   * 获取事件总线
   */
  getEventBus(): VTableSheetEventBus {
    if (!this.eventBus) {
      // If eventBus is not initialized yet, return the parent VTableSheet's event bus
      return this.vtableSheet.getEventBus();
    }
    return this.eventBus;
  }

  /**
   * 获取 Sheet 标题
   */
  get sheetTitle(): string {
    return this._sheetTitle;
  }

  /**
   * 设置 Sheet 标题
   */
  set sheetTitle(title: string) {
    this._sheetTitle = title;
  }

  constructor(sheet: VTableSheet, options: IWorkSheetOptions) {
    this.options = options;
    this.container = options.container;

    // 初始化基本属性
    this._sheetKey = options.sheetKey;
    this._sheetTitle = options.sheetTitle;
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
    return this.getRowCount();
  }

  /**
   * 获取列数
   */
  get colCount(): number {
    return this.getColumnCount();
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
    // 使用统一事件总线
    this.eventBus = this.vtableSheet.getEventBus();

    // 初始化 WorkSheet 事件管理器
    this.eventManager = new WorkSheetEventManager(this);
    // 在 tableInstance 上设置 VTableSheet 引用，方便插件访问
    (this.tableInstance as any).__vtableSheet = this.vtableSheet;

    // 通知 VTableSheet 的事件中转器绑定这个 sheet 的事件
    (this.vtableSheet as any).tableEventRelay.bindSheetEvents(this.sheetKey, this.tableInstance);

    // 触发工作表准备就绪事件
    if (this.eventManager) {
      this.eventManager.emitReady();
      // 触发数据加载完成事件
      this.eventManager.emitDataLoaded(this.rowCount, this.colCount);
    }
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
        this.options.columns[i].key = i as any;
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
            key: i as any,
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
      getCopyCellValue: {
        html: this.getCellValueConsiderFormula.bind(this)
      },
      processFormulaBeforePaste: this.processFormulaPaste.bind(this),
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
      // 确保theme是一个对象而不是字符串
      if (typeof this.options.theme === 'string') {
        console.warn('theme is a string, it will be ignored');
      } else {
        changedTheme = this.options.theme;
        changedTheme.frameStyle = Object.assign({}, this.options.theme.frameStyle, {
          shadowBlur: 0,
          cornerRadius: 0,
          borderLineWidth: 0
        });
      }
    }
    return {
      ...(this.options as any),
      dragOrder: {
        maintainArrayDataOrder: true
      },
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

      // 监听选择变化事件（多选时）
      this.tableInstance.on('selected_changed' as any, (event: any) => {
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
      });

      // 监听拖拽选择结束事件 - 优化：移除console.log和debugger调试代码
      this.tableInstance.on('drag_select_end' as any, (event: any) => {
        this.handleDragSelectEnd(event);
      });

      // 监听单元格值变更事件
      this.tableInstance.on('change_cell_value', (event: any) => {
        this.handleCellValueChanged(event);
      });

      // 监听数据记录变更事件 - 用于调整公式引用
      // 注意：'add_record' 事件类型需要使用 as any 绕过类型检查
      (this.tableInstance as any).on('add_record', (event: any) => {
        this.handleDataRecordsChanged('add', event);
      });

      // 注意：'delete_record' 事件类型需要使用 as any 绕过类型检查
      (this.tableInstance as any).on('delete_record', (event: any) => {
        this.handleDataRecordsChanged('delete', event);
      });
      // 注意：'add_column' 事件类型尚未在 VTable 中定义，这里使用 as any 绕过类型检查
      (this.tableInstance as any).on('add_column', (event: any) => {
        this.handleColumnsChanged('add', event);
      });

      // 注意：'delete_column' 事件类型需要使用 as any 绕过类型检查
      (this.tableInstance as any).on('delete_column', (event: any) => {
        this.handleColumnsChanged('delete', event);
      });

      // 监听编辑结束事件，恢复十字光标
      this.tableInstance.on('click_cell', () => {
        this.element.classList.add('vtable-excel-cursor');
      });
      // 监听编辑结束事件，恢复十字光标
      this.tableInstance.on('change_header_position', (event: any) => {
        this.handleChangeHeaderPosition(event);
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
    // 如果在公式编辑状态，不处理
    if (this.vtableSheet.formulaManager.formulaWorkingOnCell) {
      return;
    }

    // 重置公式栏显示标志，让公式栏显示选中单元格的值
    const formulaUIManager = this.vtableSheet.formulaUIManager;
    formulaUIManager.isFormulaBarShowingResult = false;
    formulaUIManager.clearFormula();
    formulaUIManager.updateFormulaBar();
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
    this.vtableSheet.formulaManager.formulaRangeSelector.handleSelectionChangedForRangeMode();
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
    this.vtableSheet.formulaManager.formulaRangeSelector.handleSelectionChangedForRangeMode();
  }

  /**
   * 处理单元格值变更事件
   * @param event 值变更事件
   */
  private handleCellValueChanged(event: any): void {
    this.vtableSheet.formulaManager.formulaRangeSelector.handleCellValueChanged(event);
  }

  /**
   * 处理数据记录变更事件 - 用于调整公式引用
   * @param type 变更类型 ('add' | 'delete')
   * @param event 数据变更事件
   */
  private handleDataRecordsChanged(type: 'add' | 'delete', event: any): void {
    try {
      const sheetKey = this.getKey();
      //#region 处理数据变化后，公式引擎中的数据也需要更新
      const normalizedData = this.vtableSheet.formulaManager.normalizeSheetData(
        this.tableInstance.records,
        this.tableInstance
      );
      this.vtableSheet.formulaManager.formulaEngine.updateSheetData(sheetKey, normalizedData);
      //#endregion
      if (type === 'add') {
        // 处理添加记录事件
        const { recordIndex, recordCount } = event;
        if (recordIndex !== undefined && recordCount > 0) {
          // 在指定位置插入行，需要调整该位置之后的公式引用
          this.vtableSheet.formulaManager.addRows(sheetKey, recordIndex, recordCount);
        } else {
          // 默认在末尾添加
          const currentRowCount = this.getRowCount();
          this.vtableSheet.formulaManager.addRows(sheetKey, currentRowCount, recordCount);
        }
      } else if (type === 'delete') {
        // 处理删除记录事件
        const { rowIndexs, deletedCount } = event;
        if (rowIndexs && rowIndexs.length > 0) {
          // 为了简化，我们假设删除的是连续的行，从最小的索引开始
          const minIndex = Math.min(...rowIndexs.flat());
          this.vtableSheet.formulaManager.removeRows(sheetKey, minIndex, deletedCount);
          // 删除行后，需要更新合并单元格状态
          // 完全在删除范围内：删除合并单元格
          // 与删除范围有重叠（startRow <= deleteEndIndex && endRow >= minIndex）：
          // 起始行在删除范围内：移到 minIndex
          // 起始行在删除范围之前：保持不变
          // 结束行在删除范围内：移到 minIndex - 1
          // 结束行在删除范围之后：减去 deletedCount
          // 完全在删除范围之后（startRow > deleteEndIndex）：起始行和结束行都减去 deletedCount
          if (Array.isArray(this.tableInstance.options.customMergeCell)) {
            const mergeCellsToRemove: number[] = [];
            const deleteEndIndex = minIndex + deletedCount - 1;
            const customMergeCellArray = this.tableInstance.options.customMergeCell;
            // 需要clone一份mergeCellArray，因为后续会修改mergeCellArray
            const cloneMergeCellArray = customMergeCellArray.map(mergeCell => ({
              ...mergeCell,
              range: {
                start: { ...mergeCell.range.start },
                end: { ...mergeCell.range.end }
              }
            }));
            customMergeCellArray.forEach((mergeCell, index) => {
              const startRow = mergeCell.range.start.row;
              const endRow = mergeCell.range.end.row;

              // 如果合并单元格完全在删除范围内，标记为删除
              if (startRow >= minIndex && endRow <= deleteEndIndex) {
                mergeCellsToRemove.push(index);
                return;
              }

              // 如果合并单元格与删除范围有重叠
              if (startRow <= deleteEndIndex && endRow >= minIndex) {
                // 如果起始行在删除范围内，将起始行移到删除范围的起始位置（删除后这个位置不存在，所以移到 minIndex）
                if (startRow >= minIndex) {
                  mergeCell.range.start.row = minIndex;
                }
                // 如果起始行在删除范围之前，不需要调整（保持不变）

                // 如果结束行在删除范围内，将结束行移到删除范围之前
                if (endRow <= deleteEndIndex) {
                  mergeCell.range.end.row = minIndex - 1;
                } else {
                  // 结束行在删除范围之后，需要减去删除的行数
                  mergeCell.range.end.row -= deletedCount;
                }

                // 如果调整后起始行大于结束行，标记为删除
                if (mergeCell.range.start.row > mergeCell.range.end.row) {
                  mergeCellsToRemove.push(index);
                }
              }
              // 如果合并单元格完全在删除范围之后，只需要向前移动行索引
              else if (startRow > deleteEndIndex) {
                mergeCell.range.start.row -= deletedCount;
                mergeCell.range.end.row -= deletedCount;
              }
            });

            // 从后往前删除，避免索引变化影响
            mergeCellsToRemove
              .sort((a, b) => b - a)
              .forEach(index => {
                customMergeCellArray.splice(index, 1);
              });
            const updateRanges = cloneMergeCellArray.map(mergeCell => ({
              start: { ...mergeCell.range.start },
              end: { ...mergeCell.range.end }
            }));
            (this.tableInstance as any).updateCellContentRange(updateRanges);
          }
        }
      }
      // update 事件不需要调整引用，因为只是数据内容变更
    } catch (error) {
      console.error(`Failed to handle data records changed (${type}):`, error);
    }
  }
  /**
   * 处理列变更事件 - 用于调整公式引用
   * @param type 变更类型 ('add' | 'delete')
   * @param event 列变更事件
   */
  private handleColumnsChanged(type: 'add' | 'delete', event: any): void {
    try {
      const sheetKey = this.getKey();
      //#region 处理数据变化后，公式引擎中的数据也需要更新
      const normalizedData = this.vtableSheet.formulaManager.normalizeSheetData(
        this.tableInstance.records,
        this.tableInstance
      );
      this.vtableSheet.formulaManager.formulaEngine.updateSheetData(sheetKey, normalizedData);
      //#endregion
      if (type === 'add') {
        // 处理添加列事件
        const { columnIndex, columnCount } = event;
        if (columnIndex !== undefined && columnCount > 0) {
          // 在指定位置插入列，需要调整该位置之后的公式引用
          this.vtableSheet.formulaManager.addColumns(sheetKey, columnIndex, columnCount);
        } else {
          // 默认在末尾添加
          const currentColumnCount = this.getColumnCount();
          this.vtableSheet.formulaManager.addColumns(sheetKey, currentColumnCount, columnCount);
        }
      } else if (type === 'delete') {
        // 处理删除列事件
        const { deleteColIndexs } = event;
        if (deleteColIndexs && deleteColIndexs.length > 0) {
          // 为了简化，我们假设删除的是连续的列，从最小的索引开始
          const minIndex = Math.min(...deleteColIndexs.flat());
          const deletedCount = deleteColIndexs.length;
          this.vtableSheet.formulaManager.removeColumns(sheetKey, minIndex, deletedCount);
          // 删除列后，需要更新合并单元格状态
          // 完全在删除范围内：删除合并单元格
          // 与删除范围有重叠（startCol <= deleteEndIndex && endCol >= minIndex）：
          // 起始列在删除范围内：移到 minIndex
          // 起始列在删除范围之前：保持不变
          // 结束列在删除范围内：移到 minIndex - 1
          // 结束列在删除范围之后：减去 deletedCount
          // 完全在删除范围之后（startCol > deleteEndIndex）：起始列和结束列都减去 deletedCount
          if (Array.isArray(this.tableInstance.options.customMergeCell)) {
            const mergeCellsToRemove: number[] = [];
            const deleteEndIndex = minIndex + deletedCount - 1;
            const customMergeCellArray = this.tableInstance.options.customMergeCell;
            // 需要clone一份mergeCellArray，因为后续会修改mergeCellArray
            const cloneMergeCellArray = customMergeCellArray.map(mergeCell => ({
              ...mergeCell,
              range: {
                start: { ...mergeCell.range.start },
                end: { ...mergeCell.range.end }
              }
            }));
            customMergeCellArray.forEach((mergeCell, index) => {
              const startCol = mergeCell.range.start.col;
              const endCol = mergeCell.range.end.col;

              // 如果合并单元格完全在删除范围内，标记为删除
              if (startCol >= minIndex && endCol <= deleteEndIndex) {
                mergeCellsToRemove.push(index);
                return;
              }

              // 如果合并单元格与删除范围有重叠
              if (startCol <= deleteEndIndex && endCol >= minIndex) {
                // 如果起始列在删除范围内，将起始列移到删除范围的起始位置（删除后这个位置不存在，所以移到 minIndex）
                if (startCol >= minIndex) {
                  mergeCell.range.start.col = minIndex;
                }
                // 如果起始列在删除范围之前，不需要调整（保持不变）

                // 如果结束列在删除范围内，将结束列移到删除范围之前
                if (endCol <= deleteEndIndex) {
                  mergeCell.range.end.col = minIndex - 1;
                } else {
                  // 结束列在删除范围之后，需要减去删除的列数
                  mergeCell.range.end.col -= deletedCount;
                }

                // 如果调整后起始列大于结束列，标记为删除
                if (mergeCell.range.start.col > mergeCell.range.end.col) {
                  mergeCellsToRemove.push(index);
                }
              }
              // 如果合并单元格完全在删除范围之后，只需要向前移动列索引
              else if (startCol > deleteEndIndex) {
                mergeCell.range.start.col -= deletedCount;
                mergeCell.range.end.col -= deletedCount;
              }
            });

            // 从后往前删除，避免索引变化影响
            mergeCellsToRemove
              .sort((a, b) => b - a)
              .forEach(index => {
                customMergeCellArray.splice(index, 1);
              });

            const updateRanges = cloneMergeCellArray.map(mergeCell => ({
              start: { ...mergeCell.range.start },
              end: { ...mergeCell.range.end }
            }));
            (this.tableInstance as any).updateCellContentRange(updateRanges);
          }
        }
      }
      // update 事件不需要调整引用，因为只是数据内容变更
    } catch (error) {
      console.error(`Failed to handle columns changed (${type}):`, error);
    }
  }
  /**
   * 处理表头位置变更事件
   * @param event 表头位置变更事件
   */
  private handleChangeHeaderPosition(event: any): void {
    console.log('handleChangeHeaderPosition', event);
    if (event.movingColumnOrRow === 'column') {
      this.handleChangeColumnHeaderPosition(event);
    } else {
      this.handleChangeRowHeaderPosition(event);
    }
  }
  /**
   * 处理列表头位置变更事件
   * @param event 列表头位置变更事件
   */
  private handleChangeColumnHeaderPosition(event: any): void {
    console.log('handleChangeColumnHeaderPosition', event);
    // 注意：tableInstance.options.columns 中的顺序并未更新（和其他操作如delete/add等操作不同）需要注意后续是否有什么问题
    const { source, target } = event;
    const { col: sourceCol } = source;
    const { col: targetCol } = target;
    const sheetKey = this.getKey();
    //#region 处理数据变化后，公式引擎中的数据也需要更新
    const normalizedData = this.vtableSheet.formulaManager.normalizeSheetData(
      this.tableInstance.records,
      this.tableInstance
    );
    this.vtableSheet.formulaManager.formulaEngine.updateSheetData(sheetKey, normalizedData);
    //#endregion
    // 在指定位置插入列，需要调整该位置之后的公式引用
    this.vtableSheet.formulaManager.changeColumnHeaderPosition(sheetKey, sourceCol, targetCol);
  }
  /**
   * 处理行表头位置变更事件
   * @param event 行表头位置变更事件
   */
  handleChangeRowHeaderPosition(event: any): void {
    // 注意：tableInstance.options.columns 中的顺序并未更新（和其他操作如delete/add等操作不同）需要注意后续是否有什么问题
    const { source, target } = event;
    const { row: sourceRow } = source;
    const { row: targetRow } = target;
    const sheetKey = this.getKey();
    //#region 处理数据变化后，公式引擎中的数据也需要更新
    const normalizedData = this.vtableSheet.formulaManager.normalizeSheetData(
      this.tableInstance.records,
      this.tableInstance
    );
    this.vtableSheet.formulaManager.formulaEngine.updateSheetData(sheetKey, normalizedData);
    //#endregion
    // 在指定位置插入行，需要调整该位置之后的公式引用
    this.vtableSheet.formulaManager.changeRowHeaderPosition(sheetKey, sourceRow, targetRow);
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

        // 触发工作表尺寸改变事件
        if (this.eventManager) {
          this.eventManager.emitResized(width, height);
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
    return this.tableInstance.columns || [];
  }

  /**
   * 获取表格数据
   */
  getData(): any[][] {
    // 从表格实例获取数据
    return this.options.data || [];
  }

  getCopiedData(): any[][] {
    // 为了避免影响当前数据，所以需要复制一份数据
    return this.getData().map(row => (Array.isArray(row) ? row.slice() : []));
  }
  /**
   * 获取指定坐标的单元格值
   * @param col 列索引
   * @param row 行索引
   */
  getCellValue(col: number, row: number): any {
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
   * 获取指定坐标的单元格值
   * @param col 列索引
   * @param row 行索引
   */
  getCellValueConsiderFormula(col: number, row: number): any {
    if (this.tableInstance) {
      try {
        if (
          this.vtableSheet.formulaManager.isCellFormula({
            sheet: this.getKey(),
            row,
            col
          })
        ) {
          return this.vtableSheet.formulaManager.getCellFormula({
            sheet: this.getKey(),
            row,
            col
          });
        }
        return this.getCellValue(col, row);
      } catch (error) {
        console.warn('Failed to get cell value from VTable:', error);
      }
      return null;
    }
  }

  /**
   * 设置指定坐标的单元格值
   * @param col 列索引
   * @param row 行索引
   * @param value 新值
   */
  setCellValue(col: number, row: number, value: any): void {
    const data = this.getData();
    if (data && data[row]) {
      data[row][col] = value;

      // 更新表格实例
      if (this.tableInstance) {
        this.tableInstance.changeCellValue(col, row, value);
      }
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
      value: this.getCellValue(coord.col, coord.row)
    };
  }

  /**
   * 将行/列坐标转换为A1格式
   * @param coord 坐标
   */
  addressFromCoord(coord: CellCoord): string;
  addressFromCoord(col: number, row: number): string;
  addressFromCoord(coordOrCol: CellCoord | number, row?: number): string {
    let col: number;
    let rowNum: number;

    if (typeof coordOrCol === 'object') {
      col = coordOrCol.col;
      rowNum = coordOrCol.row;
    } else {
      col = coordOrCol;
      rowNum = row!;
    }

    let colStr = '';
    let tempCol = col + 1;

    do {
      tempCol -= 1;
      colStr = String.fromCharCode(65 + (tempCol % 26)) + colStr;
      tempCol = Math.floor(tempCol / 26);
    } while (tempCol > 0);

    return `${colStr}${rowNum + 1}`;
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
    return vtableRanges.map((range: any) => ({
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
      columns: this.options.columns as any as ColumnsDefine,
      showHeader: true,
      records: data
    });
  }

  /**
   * 处理公式粘贴 - 调整公式中的单元格引用
   * @param formulas 要粘贴的公式数组
   * @param sourceStartCol 源起始列
   * @param sourceStartRow 源起始行
   * @param targetStartCol 目标起始列
   * @param targetStartRow 目标起始行
   */
  processFormulaPaste(
    formulas: string[][],
    sourceStartCol: number,
    _sourceStartRow: number,
    targetStartCol: number,
    _targetStartRow: number
  ): string[][] {
    if (!formulas || formulas.length === 0) {
      return formulas;
    }

    // 计算整个范围的相对位移
    const colOffset = targetStartCol - sourceStartCol;
    const rowOffset = _targetStartRow - _sourceStartRow;

    // 使用计算出的位移来调整公式
    return FormulaPasteProcessor.adjustFormulasForPasteWithOffset(formulas, colOffset, rowOffset);
  }

  /**
   * 获取复制数据，包括公式处理
   */
  getCopyData(): (string | number)[][] {
    const selections = this.getMultipleSelections();
    if (selections.length === 0) {
      return [];
    }

    const data = this.getData();
    const result: string[][] = [];

    // 获取第一个选择范围
    const selection = selections[0];
    const rows = selection.endRow - selection.startRow + 1;
    const cols = selection.endCol - selection.startCol + 1;

    for (let row = 0; row < rows; row++) {
      const rowData: string[] = [];
      for (let col = 0; col < cols; col++) {
        const actualRow = selection.startRow + row;
        const actualCol = selection.startCol + col;

        if (data[actualRow] && data[actualRow][actualCol] !== undefined) {
          // 如果是公式，返回公式字符串；否则返回值
          if (
            this.vtableSheet.formulaManager.isCellFormula({
              sheet: this.getKey(),
              row: actualRow,
              col: actualCol
            })
          ) {
            const formula = this.vtableSheet.formulaManager.getCellFormula({
              sheet: this.getKey(),
              row: actualRow,
              col: actualCol
            });
            rowData.push(formula);
          } else {
            rowData.push(data[actualRow][actualCol]);
          }
        } else {
          rowData.push('');
        }
      }
      result.push(rowData);
    }

    return result;
  }

  /**
   * 粘贴数据，包括公式处理
   */
  pasteData(data: string[][], targetStartCol: number, targetStartRow: number): void {
    if (!data || data.length === 0) {
      return;
    }

    const selections = this.getMultipleSelections();
    if (selections.length === 0) {
      return;
    }

    // 获取源数据范围（从当前选择范围推断）
    const sourceSelection = selections[0];
    const sourceStartCol = sourceSelection.startCol;
    const sourceStartRow = sourceSelection.startRow;

    // 处理公式粘贴
    const processedData = this.processFormulaPaste(
      data,
      sourceStartCol,
      sourceStartRow,
      targetStartCol,
      targetStartRow
    );

    // 应用处理后的数据
    const dataArray = this.getData();
    for (let row = 0; row < processedData.length; row++) {
      for (let col = 0; col < processedData[row].length; col++) {
        const targetRow = targetStartRow + row;
        const targetCol = targetStartCol + col;

        if (targetRow < dataArray.length && targetCol < dataArray[targetRow].length) {
          const value = processedData[row][col];

          // 如果是公式，设置公式；否则设置普通值
          if (FormulaPasteProcessor.needsFormulaAdjustment(value)) {
            this.setCellFormula(targetRow, targetCol, value as string);
          } else {
            this.setCellValue(targetRow, targetCol, value);
          }
        }
      }
    }
  }

  /**
   * 设置单元格公式
   */
  setCellFormula(row: number, col: number, formula: string): void {
    if (this.vtableSheet.formulaManager) {
      this.vtableSheet.formulaManager.setCellContent(
        {
          sheet: this.getKey(),
          row,
          col
        },
        formula
      );

      // 事件触发移到 formula-manager 中处理，这里不再触发
      // 这样可以确保事件在正确的时机触发，并且只在操作成功时触发
    }
  }

  /**
   * 释放资源
   */
  release(): void {
    // 清理事件监听器
    if (this.tableInstance) {
      (this.vtableSheet as any).tableEventRelay.unbindSheetEvents(this.sheetKey, this.tableInstance);
    }

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
