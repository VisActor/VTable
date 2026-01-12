import { FormulaManager } from '../managers/formula-manager';
import SheetManager from '../managers/sheet-manager';
import { WorkSheet } from '../core/WorkSheet';
import * as VTable from '@visactor/vtable';
import { getTablePlugins } from '../core/table-plugins';
import { EventManager } from '../event/event-manager';
import { showSnackbar } from '../tools/ui/snackbar';
import type { IVTableSheetOptions, ISheetDefine } from '../ts-types';
import type { MultiSheetImportResult } from '@visactor/vtable-plugins/src/excel-import/types';
import SheetTabDragManager from '../managers/tab-drag-manager';
import { FormulaAutocomplete } from '../formula/formula-autocomplete';
import { formulaEditor } from '../formula/formula-editor';
import type { TYPES } from '@visactor/vtable';
import { MenuManager } from '../managers/menu-manager';
import { FormulaUIManager } from '../formula/formula-ui-manager';
import { SheetTabEventHandler } from './sheet-tab-event-handler';
import { TableEventRelay } from '../core/table-event-relay';

// 注册公式编辑器
VTable.register.editor('formula', formulaEditor);
export default class VTableSheet {
  /** DOM容器 */
  private container: HTMLElement;
  /** 配置选项 */
  private options: IVTableSheetOptions;
  /** sheet管理器 */
  private sheetManager: SheetManager;
  /** 公式管理器 */
  formulaManager: FormulaManager;
  /** 事件管理器 */
  private eventManager: EventManager;

  /** 菜单管理 */
  private menuManager: MenuManager;
  /** 当前活动sheet实例 */
  private activeWorkSheet: WorkSheet | null = null;
  /** 所有sheet实例 */
  workSheetInstances: Map<string, WorkSheet> = new Map();
  /** 公式自动补全 */
  private formulaAutocomplete: FormulaAutocomplete | null = null;
  /** Table 事件中转器 */
  private tableEventRelay: TableEventRelay;

  /** 公式UI管理器 */
  formulaUIManager: FormulaUIManager;

  /** UI组件 */
  private rootElement: HTMLElement;
  private formulaBarElement: HTMLElement | null = null;
  private sheetTabElement: HTMLElement | null = null;
  private mainMenuElement: HTMLElement | null = null;
  private contentElement: HTMLElement;

  // tab拖拽管理器
  private dragManager: SheetTabDragManager;
  /** sheet标签事件处理器 */
  private sheetTabEventHandler: SheetTabEventHandler;

  /**
   * 构造函数
   * @param options 配置选项
   */
  constructor(container: HTMLElement, options: IVTableSheetOptions) {
    this.container = container;
    this.options = this.mergeDefaultOptions(options);

    // 创建管理器（注意：tableEventRelay 必须在 eventManager 之前初始化）
    this.sheetManager = new SheetManager();
    this.formulaManager = new FormulaManager(this);
    this.tableEventRelay = new TableEventRelay(this); // ⚠️ 必须在 EventManager 之前初始化
    this.eventManager = new EventManager(this); // EventManager 构造函数会调用 this.onTableEvent()
    this.dragManager = new SheetTabDragManager(this);
    this.menuManager = new MenuManager(this);
    this.formulaUIManager = new FormulaUIManager(this);
    this.sheetTabEventHandler = new SheetTabEventHandler(this);

    // 初始化UI
    this.initUI();

    // 初始化sheets
    this.initSheets();

    this.resize();
  }

  /**
   * 合并默认配置
   */
  private mergeDefaultOptions(options: IVTableSheetOptions): IVTableSheetOptions {
    return {
      showFormulaBar: true,
      showSheetTab: true,
      defaultRowHeight: 25,
      defaultColWidth: 100,
      ...options
    };
  }

  /**
   * 初始化公式自动补全
   */
  private initFormulaAutocomplete(): void {
    if (!this.formulaBarElement) {
      return;
    }

    const formulaInput = this.formulaUIManager.formulaInput;
    if (formulaInput) {
      this.formulaAutocomplete = new FormulaAutocomplete(this.rootElement, this);
      this.formulaAutocomplete.attachTo(formulaInput);
    }
  }

  /**
   * 初始化UI
   */
  private initUI(): void {
    // 创建根元素
    this.rootElement = document.createElement('div');
    this.rootElement.className = 'vtable-sheet-container';
    // this.rootElement.style.width = `${this.options.width}px`;
    // this.rootElement.style.height = `${this.options.height}px`;
    this.container.appendChild(this.rootElement);
    //创建顶部菜单和公式的容器
    const topContainer = document.createElement('div');
    topContainer.className = 'vtable-sheet-top-container';
    this.rootElement.appendChild(topContainer);

    // 创建主菜单
    if (this.options.mainMenu?.show) {
      this.mainMenuElement = this.menuManager.createMainMenu();
      topContainer.appendChild(this.mainMenuElement);
    }
    // 创建公式栏
    if (this.options.showFormulaBar) {
      this.formulaBarElement = this.formulaUIManager.createFormulaBar();
      topContainer.appendChild(this.formulaBarElement);

      this.initFormulaAutocomplete();
    }

    // 创建内容区域
    this.contentElement = document.createElement('div');
    this.contentElement.className = 'vtable-sheet-content';
    this.rootElement.appendChild(this.contentElement);

    // 创建sheet切换栏
    if (this.options.showSheetTab) {
      this.sheetTabElement = this.createSheetTab();
      this.rootElement.appendChild(this.sheetTabElement);
    }
  }

  /**
   * 创建sheet切换栏
   */
  private createSheetTab(): HTMLElement {
    // SVG图标常量
    const addIcon =
      '<svg viewBox="0 0 24 24" width="16" height="16">' +
      '<path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/>' +
      '</svg>';
    const leftIcon =
      '<svg viewBox="0 0 24 24" width="16" height="16">' +
      '<path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>' +
      '</svg>';
    const rightIcon =
      '<svg viewBox="0 0 24 24" width="16" height="16">' +
      '<path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>' +
      '</svg>';
    const menuIcon =
      '<svg viewBox="0 0 24 24" width="16" height="16">' +
      '<path fill="currentColor" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 ' +
      '.9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>' +
      '</svg>';

    const sheetTab = document.createElement('div');
    sheetTab.className = 'vtable-sheet-tab-bar';

    // 创建左侧渐变效果
    const fadeLeft = document.createElement('div');
    fadeLeft.className = 'vtable-sheet-fade-left';
    fadeLeft.style.display = 'none';
    sheetTab.appendChild(fadeLeft);

    // 创建中间的tabs容器
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'vtable-sheet-tabs-container';
    tabsContainer.addEventListener('scroll', () =>
      this.sheetTabEventHandler.updateFadeEffects(tabsContainer, fadeLeft, fadeRight)
    );
    sheetTab.appendChild(tabsContainer);

    // 创建插入指示器
    const insertIndicator = document.createElement('div');
    insertIndicator.className = 'vtable-sheet-insert-indicator';
    insertIndicator.style.display = 'none';
    tabsContainer.appendChild(insertIndicator);

    // 创建右侧渐变效果
    const fadeRight = document.createElement('div');
    fadeRight.className = 'vtable-sheet-fade-right';
    sheetTab.appendChild(fadeRight);

    // 添加新增sheet按钮
    const addButton = document.createElement('button');
    addButton.className = 'vtable-sheet-add-button';
    addButton.innerHTML = addIcon;
    addButton.title = '添加工作表';
    addButton.addEventListener('click', () => this._addNewSheet());
    sheetTab.appendChild(addButton);

    // 创建导航按钮容器
    const navButtons = document.createElement('div');
    navButtons.className = 'vtable-sheet-nav-buttons';

    // 创建左侧滚动按钮
    const leftScrollBtn = document.createElement('button');
    leftScrollBtn.className = 'vtable-sheet-scroll-button';
    leftScrollBtn.innerHTML = leftIcon;
    leftScrollBtn.title = '向左滚动';
    leftScrollBtn.addEventListener('click', () => this.sheetTabEventHandler.scrollSheetTabs('left', tabsContainer));
    navButtons.appendChild(leftScrollBtn);

    // 创建右侧滚动按钮
    const rightScrollBtn = document.createElement('button');
    rightScrollBtn.className = 'vtable-sheet-scroll-button';
    rightScrollBtn.innerHTML = rightIcon;
    rightScrollBtn.title = '向右滚动';
    rightScrollBtn.addEventListener('click', () => this.sheetTabEventHandler.scrollSheetTabs('right', tabsContainer));
    navButtons.appendChild(rightScrollBtn);

    // 创建sheet菜单按钮
    const menuButton = document.createElement('button');
    menuButton.className = 'vtable-sheet-menu-button';
    menuButton.innerHTML = menuIcon;
    menuButton.title = '工作表选项';
    menuButton.addEventListener('click', e => this.sheetTabEventHandler.toggleSheetMenu(e));
    navButtons.appendChild(menuButton);

    // 创建菜单容器
    const menuContainer = document.createElement('ul');
    menuContainer.className = 'vtable-sheet-menu-list';
    sheetTab.appendChild(menuContainer);

    sheetTab.appendChild(navButtons);
    // 初始化渐变效果
    setTimeout(() => {
      this.sheetTabEventHandler.updateFadeEffects(tabsContainer, fadeLeft, fadeRight);
    }, 100);

    return sheetTab;
  }

  /**
   * 激活sheet标签并滚动到可见区域
   */
  private _activeSheetTab(): void {
    this.sheetTabEventHandler.activeSheetTab();
  }
  /**
   * 更新sheet切换标签
   * @param tabsContainer 标签容器
   */
  updateSheetTabs(
    tabsContainer: HTMLElement = this.sheetTabElement?.querySelector('.vtable-sheet-tabs-container')
  ): void {
    if (!tabsContainer) {
      return;
    }
    // 清除现有标签
    const tabs = tabsContainer.querySelectorAll('.vtable-sheet-tab');
    tabs.forEach(tab => {
      tab.remove();
    });
    // 添加sheet标签
    const sheets = this.sheetManager.getAllSheets();
    sheets.forEach((sheet, index) => {
      tabsContainer.appendChild(this.createSheetTabItem(sheet, index));
    });
    // 激活sheet标签并滚动到可见区域
    this._activeSheetTab();
  }
  /**
   * 创建tab栏标签项
   */
  private createSheetTabItem(sheet: ISheetDefine, index: number): HTMLElement {
    const tab = document.createElement('div');
    tab.className = 'vtable-sheet-tab';
    tab.dataset.key = sheet.sheetKey;
    tab.textContent = sheet.sheetTitle;
    tab.title = sheet.sheetTitle;
    tab.addEventListener('click', () => this.activateSheet(sheet.sheetKey));
    tab.addEventListener('dblclick', () =>
      this.sheetTabEventHandler.handleSheetTabDblClick(sheet.sheetKey, sheet.sheetTitle)
    );
    // 拖拽事件
    tab.addEventListener('mousedown', e => this.dragManager.handleTabMouseDown(e, sheet.sheetKey));

    return tab;
  }

  /**
   * 更新sheet列表
   */
  updateSheetMenu(): void {
    this.sheetTabEventHandler.updateSheetMenu();
  }

  /**
   * 初始化sheets
   */
  private initSheets(): void {
    if (this.options.sheets && this.options.sheets.length > 0) {
      // 添加所有sheet
      this.options.sheets.forEach((sheetDefine: ISheetDefine) => {
        this.sheetManager.addSheet(sheetDefine);
      });

      // 找到active的sheet
      let activeSheetKey = '';
      const activeSheet = this.options.sheets.find((sheet: ISheetDefine) => sheet.active);
      if (activeSheet) {
        activeSheetKey = activeSheet.sheetKey;
      } else {
        activeSheetKey = this.options.sheets[0].sheetKey;
      }

      // 激活sheet
      this.activateSheet(activeSheetKey);
    } else {
      // 如果没有提供sheets，创建一个默认的
      this._addNewSheet();
    }
  }

  /**
   * 激活指定sheet
   * @param sheetKey sheet的key
   */
  activateSheet(sheetKey: string): void {
    // 设置活动sheet
    this.sheetManager.setActiveSheet(sheetKey);

    // 获取sheet定义
    const sheetDefine = this.sheetManager.getSheet(sheetKey);
    if (!sheetDefine) {
      return;
    }

    // 隐藏所有sheet实例
    this.workSheetInstances.forEach(instance => {
      instance.getElement().style.display = 'none';
    });

    // 如果已经存在实例，则显示并激活对应tab和menu
    if (this.workSheetInstances.has(sheetKey)) {
      const instance = this.workSheetInstances.get(sheetKey)!;
      instance.getElement().style.display = 'block';
      this.activeWorkSheet = instance;

      // 更新公式管理器中的活动工作表（在实例激活后）
      this.formulaManager.setActiveSheet(sheetKey);

      // sheet标签和菜单项激活样式
      this._activeSheetTab();
      this.sheetTabEventHandler.activeSheetMenuItem();

      // 恢复筛选状态
      this.restoreFilterState(instance, sheetDefine);
    } else {
      // 创建新的sheet实例
      const instance = this.createWorkSheetInstance(sheetDefine);
      this.workSheetInstances.set(sheetKey, instance);
      this.activeWorkSheet = instance;

      // 更新公式管理器中的活动工作表（在实例创建后）
      this.formulaManager.setActiveSheet(sheetKey);

      // 刷新sheet标签和菜单
      this.updateSheetTabs();
      this.updateSheetMenu();

      // 恢复筛选状态
      this.restoreFilterState(instance, sheetDefine);
    }

    this.updateFormulaBar();
  }

  addSheet(sheet: ISheetDefine): void {
    this.sheetManager.addSheet(sheet);
    this.updateSheetTabs();
    this.updateSheetMenu();
  }

  /**
   * 选择 Excel 文件
   * @returns Promise<File | null>
   */
  private _selectExcelFile(): Promise<File | null> {
    return new Promise(resolve => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.xlsx,.xls';
      input.style.display = 'none';
      document.body.appendChild(input);

      input.addEventListener('change', e => {
        const file = (e.target as HTMLInputElement).files?.[0];
        document.body.removeChild(input);
        resolve(file || null);
      });

      // 如果用户取消选择
      input.addEventListener('cancel', () => {
        document.body.removeChild(input);
        resolve(null);
      });

      input.click();
    });
  }

  /**
   * 删除sheet
   * @param sheetKey 工作表key
   */
  removeSheet(sheetKey: string): void {
    if (this.sheetManager.getSheetCount() <= 1) {
      showSnackbar('至少保留一个工作表', 1300);
      return;
    }
    // 删除实例对应的dom元素
    const instance = this.workSheetInstances.get(sheetKey);
    if (instance) {
      instance.release();
      this.workSheetInstances.delete(sheetKey);
    }
    // 删除sheet定义
    const newActiveSheetKey = this.sheetManager.removeSheet(sheetKey);
    // 激活新的sheet(如果有)
    if (newActiveSheetKey) {
      this.activateSheet(newActiveSheetKey);
    }
    this.updateSheetTabs();
    this.updateSheetMenu();
  }
  getSheetCount(): number {
    return this.sheetManager.getSheetCount();
  }
  getSheet(sheetKey: string): ISheetDefine | null {
    return this.sheetManager.getSheet(sheetKey);
  }
  getAllSheets(): ISheetDefine[] {
    return this.sheetManager.getAllSheets();
  }

  /**
   * 创建sheet实例
   * @param sheetDefine sheet的定义
   */
  createWorkSheetInstance(sheetDefine: ISheetDefine): WorkSheet {
    formulaEditor.setSheet(this);
    // 计算内容区域大小
    const contentWidth = this.contentElement.clientWidth;
    const contentHeight = this.contentElement.clientHeight;
    sheetDefine.dragOrder = sheetDefine.dragOrder ?? this.options.dragOrder;
    // 创建sheet实例
    const sheet = new WorkSheet(this, {
      ...sheetDefine,
      container: this.contentElement,
      width: contentWidth,
      height: contentHeight,
      defaultRowHeight: this.options.defaultRowHeight,
      defaultColWidth: this.options.defaultColWidth,
      dragOrder: sheetDefine.dragOrder,
      plugins: getTablePlugins(sheetDefine, this.options, this),
      headerEditor: 'formula',
      editor: 'formula',
      select: {
        makeSelectCellVisible: false
      },
      style: {
        borderColor: ['#E1E4E8', '#E1E4E8', '#E1E4E8', '#E1E4E8'],
        borderLineWidth: [1, 1, 1, 1],
        borderLineDash: [null, null, null, null],
        padding: [8, 8, 8, 8]
      },
      editCellTrigger: ['api', 'keydown', 'doubleclick'],
      customMergeCell: sheetDefine.cellMerge,
      theme: sheetDefine.theme?.tableTheme || this.options.theme?.tableTheme
    } as any);

    // 不再需要在这里注册事件，EventManager 会直接使用 VTableSheet 的 onTableEvent

    // 在公式管理器中添加这个sheet
    try {
      const normalizedData = this.formulaManager.normalizeSheetData(sheetDefine.data, sheet.tableInstance);
      this.formulaManager.addSheet(sheetDefine.sheetKey, normalizedData, sheetDefine.sheetTitle);
      // 加载保存的公式数据（如果有）
      if (sheetDefine.formulas && Object.keys(sheetDefine.formulas).length > 0) {
        this.loadFormulas(sheetDefine.sheetKey, sheetDefine.formulas);
      }
    } catch (error) {
      console.warn(`Sheet ${sheetDefine.sheetKey} may already exist in formula manager:`, error);
      // 如果添加失败（可能已存在），继续执行
    }

    return sheet;
  }
  /**
   * 加载指定工作表的公式数据
   * @param sheetKey 工作表键
   * @param formulas 公式数据 (A1表示法的单元格引用 -> 公式内容)
   */
  private loadFormulas(sheetKey: string, formulas: Record<string, string>): void {
    if (!formulas || Object.keys(formulas).length === 0) {
      return;
    }

    try {
      // 优化公式计算顺序
      const sortedFormulas = this.formulaManager.sortFormulasByDependency(sheetKey, formulas);
      // 按照优化后的顺序设置公式
      for (const [cellRef, formula] of sortedFormulas) {
        // 解析单元格引用 (如 A1, B2) 到行列索引
        const { row, col } = this.parseCellKey(cellRef);
        // 设置单元格公式
        this.formulaManager.setCellContent({ sheet: sheetKey, row, col }, formula);
      }

      // 刷新计算
      this.formulaManager.rebuildAndRecalculate();
    } catch (error) {
      console.error(`Failed to load formulas for sheet ${sheetKey}:`, error);
    }
  }

  /**
   * 将单元格引用（A1表示法）解析为行列索引
   * @param cellKey 单元格引用 (如 A1, B2)
   * @returns 行列索引 (0-based)
   */
  private parseCellKey(cellKey: string): { row: number; col: number } {
    // 匹配列引用（字母部分）和行引用（数字部分）
    const match = cellKey.match(/^([A-Za-z]+)(\d+)$/);
    if (!match) {
      throw new Error(`Invalid cell reference: ${cellKey}`);
    }
    const [, colStr, rowStr] = match;
    // 解析行索引 (1-based -> 0-based)
    const row = parseInt(rowStr, 10) - 1;
    // 解析列索引 (A -> 0, B -> 1, ..., Z -> 25, AA -> 26, etc.)
    let col = 0;
    for (let i = 0; i < colStr.length; i++) {
      const charCode = colStr.toUpperCase().charCodeAt(i) - 65; // 65 is ASCII for 'A'
      col = col * 26 + charCode;
    }
    return { row, col };
  }

  /**
   * 恢复筛选状态
   */
  private restoreFilterState(sheet: WorkSheet, sheetDefine: ISheetDefine): void {
    // 如果没有保存的筛选状态，直接返回
    if (!sheetDefine.filterState) {
      return;
    }

    // console.log(`恢复 Sheet ${sheetDefine.sheetKey} 的筛选状态:`, sheetDefine.filterState);

    // 等待表格初始化完成
    setTimeout(() => {
      if (sheet.tableInstance && sheet.tableInstance.pluginManager) {
        const filterPlugin = sheet.tableInstance.pluginManager.getPluginByName('Filter') as any;
        if (filterPlugin) {
          filterPlugin.setFilterState(sheetDefine.filterState);
        } else {
          console.warn(`Sheet ${sheetDefine.sheetKey} 未找到筛选插件或插件不支持 setFilterState 方法`);
        }
      } else {
        console.warn(`Sheet ${sheetDefine.sheetKey} 表格实例或插件管理器未初始化`);
      }
    }, 0);
  }

  /**
   * 添加新sheet
   */
  private _addNewSheet(): void {
    // 生成新sheet的key和title
    const sheetCount = this.sheetManager.getSheetCount();
    const baseKey = `sheet${sheetCount + 1}`;
    const baseTitle = `Sheet ${sheetCount + 1}`;
    let key = baseKey;
    let title = baseTitle;
    let index = sheetCount + 1;
    // 检查key和title是否被占用，递增直到唯一
    const existingKeys = new Set(this.sheetManager.getAllSheets().map(s => s.sheetKey));
    const existingTitles = new Set(this.sheetManager.getAllSheets().map(s => s.sheetTitle));
    while (existingKeys.has(key) || existingTitles.has(title)) {
      index += 1;
      key = `sheet${index}`;
      title = `Sheet ${index}`;
    }

    // 创建新sheet配置
    const newSheet: ISheetDefine = {
      sheetKey: key,
      sheetTitle: title,
      columnCount: 20,
      rowCount: 100,
      data: []
    };

    // 添加到管理器
    this.sheetManager.addSheet(newSheet);

    // 激活新sheet
    this.activateSheet(key);
  }

  /**
   * 更新公式栏
   */
  private updateFormulaBar(): void {
    this.formulaUIManager.updateFormulaBar();
  }

  /**
   * 获取公式管理器
   */
  getFormulaManager(): FormulaManager {
    return this.formulaManager;
  }
  /**
   * 获取Sheet管理器
   */
  getSheetManager(): SheetManager {
    return this.sheetManager;
  }

  /**
   * 获取活动Sheet实例
   */
  getActiveSheet(): WorkSheet | null {
    return this.activeWorkSheet;
  }

  /**
   * 监听 Table 事件（统一监听所有 sheet）
   *
   * 提供通用的事件转发机制
   * 当任何 sheet 触发事件时，回调函数会自动接收到增强的事件对象（附带 sheetKey）
   *
   * @example
   * ```typescript
   * // 监听所有 sheet 的单元格点击
   * sheet.onTableEvent('click_cell', (event) => {
   *   // event.sheetKey 告诉你是哪个 sheet
   *   // event 的其他属性是原始 VTable 事件
   *   console.log(`Sheet ${event.sheetKey} 的单元格 [${event.row}, ${event.col}] 被点击`);
   * });
   *
   * // 监听所有 sheet 的单元格值改变
   * sheet.onTableEvent('change_cell_value', (event) => {
   *   console.log(`Sheet ${event.sheetKey} 的值改变`);
   *   autoSave(event);
   * });
   *
   * // 可以监听任何 VTable 支持的事件
   * sheet.onTableEvent('scroll', (event) => {
   *   console.log(`Sheet ${event.sheetKey} 滚动了`);
   * });
   * ```
   *
   * @param type VTable 事件类型
   * @param callback 事件回调函数，参数是增强后的事件对象（包含 sheetKey）
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTableEvent(type: string, callback: (...args: any[]) => void): void {
    this.tableEventRelay.onTableEvent(type, callback);
  }

  /**
   * 移除 Table 事件监听器
   *
   * @param type VTable 事件类型
   * @param callback 事件回调函数（可选）
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  offTableEvent(type: string, callback?: (...args: any[]) => void): void {
    this.tableEventRelay.offTableEvent(type, callback);
  }

  /**
   * 根据名称获取Sheet实例
   */
  getSheetByName(sheetName: string): WorkSheet | null {
    // 遍历所有sheet实例，找到匹配的sheet
    for (const [sheetKey, workSheet] of this.workSheetInstances) {
      const sheetDefine = this.sheetManager.getSheet(sheetKey);
      if (sheetDefine && sheetDefine.sheetTitle === sheetName) {
        return workSheet;
      }
    }
    return null;
  }

  /**
   * 保存所有数据为配置
   */
  saveToConfig(): IVTableSheetOptions {
    // 收集所有sheet的数据
    const sheets: ISheetDefine[] = [];

    this.sheetManager.getAllSheets().forEach(sheetDefine => {
      const instance = this.workSheetInstances.get(sheetDefine.sheetKey);
      if (instance) {
        const data = instance.getCopiedData();
        //#region 组织columns
        //column中去除field字段 (field字段会在columns.map中被使用)
        const columns = instance.getColumns().map(column => {
          // 解构时省略field属性
          const { ...rest } = column;
          // 删除field属性
          delete rest.field;
          return rest;
        });
        // 找到最后一个有title的列的索引
        const lastTitleIndex = columns.reduce((lastIndex, column, index) => (column.title ? index : lastIndex), -1);

        // 从最后一个有title的列之后删除所有列
        if (lastTitleIndex === -1) {
          columns.length = 0; // 清空数组
        } else {
          columns.splice(lastTitleIndex + 1);
        }
        //#endregion

        //#region 组织data
        // 找到最后一个有非空值的行
        const lastDataIndex = data.reduce((lastIndex, rowData, index) => (rowData ? index : lastIndex), -1);
        // 保留到最后一个有值的行，删除之后的空行
        if (lastDataIndex === -1) {
          data.length = 0; // 清空数组
        } else {
          data.splice(lastDataIndex + 1);
        }
        //#endregion
        // 获取筛选状态
        let filterState = null;
        const filterPlugin = instance.tableInstance.pluginManager.getPluginByName('Filter') as any;
        if (filterPlugin) {
          filterState = filterPlugin.getFilterState();
        }

        // 获取排序状态
        let sortState = instance.tableInstance.internalProps.sortState;
        let currentSortState;
        if (sortState) {
          sortState = Array.isArray(sortState) ? sortState : [sortState];
          currentSortState = sortState.map(item => ({
            field: item.field,
            order: item.order,
            ...(item.orderFn != null && { orderFn: item.orderFn })
          }));
        }

        // 使用FormulaManager的导出方法获取所有公式
        const formulas = this.formulaManager.exportFormulas(sheetDefine.sheetKey);

        //#region 从tableInstance.internalProps._widthResizedColMap对应到columns的key 组织columnWidthConfig
        const columnWidthConfig = Array.from(instance.tableInstance.internalProps._widthResizedColMap).map(key => {
          return {
            key: key,
            width: instance.tableInstance.getColWidth(key as number)
          };
        });
        //#endregion
        //#region 从tableInstance.internalProps._heightResizedRowMap对应到columns的key 组织rowHeightConfig
        const rowHeightConfig = Array.from(instance.tableInstance.internalProps._heightResizedRowMap).map(key => {
          return {
            key: key,
            height: instance.tableInstance.getRowHeight(key)
          };
        });
        //#endregion

        sheets.push({
          ...sheetDefine,
          data,
          columns,
          cellMerge: instance.tableInstance.options.customMergeCell as TYPES.CustomMergeCellArray,
          showHeader: instance.tableInstance.options.showHeader,
          frozenRowCount: instance.tableInstance.frozenRowCount,
          frozenColCount: instance.tableInstance.frozenColCount,
          active: sheetDefine.sheetKey === this.sheetManager.getActiveSheet().sheetKey,
          filterState: filterState,
          sortState: currentSortState,
          formulas: Object.keys(formulas).length > 0 ? formulas : undefined,
          columnWidthConfig,
          rowHeightConfig
        });
      } else {
        sheets.push(sheetDefine);
      }
    });

    return {
      ...this.options,
      sheets
    };
  }

  /** 导出当前sheet到文件 */
  exportSheetToFile(fileType: 'csv' | 'xlsx', allSheets: boolean = true): void {
    const sheet = this.getActiveSheet();
    if (!sheet) {
      return;
    }
    if (fileType === 'csv') {
      if ((sheet.tableInstance as any)?.exportToCsv) {
        (sheet.tableInstance as any).exportToCsv();
      } else {
        console.warn('Please configure TableExportPlugin in VTablePluginModules');
      }
    } else {
      if (allSheets) {
        this.exportAllSheetsToExcel();
      } else {
        if ((sheet.tableInstance as any)?.exportToExcel) {
          (sheet.tableInstance as any).exportToExcel();
        } else {
          console.warn('Please configure TableExportPlugin in VTablePluginModules');
        }
      }
    }
  }
  exportAllSheetsToExcel(): void {
    this.initAllSheetInstances();
    const allDefines = this.sheetManager.getAllSheets();
    const tables = allDefines.map(def => {
      const inst = this.workSheetInstances.get(def.sheetKey)!;
      return { table: inst.tableInstance as any, name: def.sheetTitle || def.sheetKey };
    });
    (this as any)._exportMutipleTablesToExcel?.(tables); //这个方法是在vtable-plugins中添加的，table-export插件在VTableSheet实例上添加了导出所有sheet到Excel的方法
  }
  initAllSheetInstances(): void {
    const allDefines = this.sheetManager.getAllSheets();
    allDefines.forEach(def => {
      if (!this.workSheetInstances.has(def.sheetKey)) {
        const instance = this.createWorkSheetInstance(def);
        this.workSheetInstances.set(def.sheetKey, instance);
      }
    });
  }
  /**
   * 导入文件（支持 Excel 多 sheet 和 CSV）
   * @param options 导入选项，包括 clearExisting（是否清除现有 sheets，默认 true 表示替换模式）
   * @returns Promise<MultiSheetImportResult | void>
   */
  async importFileToSheet(
    options: { clearExisting?: boolean } = { clearExisting: true }
  ): Promise<MultiSheetImportResult | void> {
    // 使用绑定到 VTableSheet 实例的导入方法（插件内部会处理文件选择）
    if ((this as any)?._importFile) {
      return await (this as any)._importFile({
        clearExisting: options?.clearExisting !== false
      });
    }

    // 回退到 tableInstance 的 importFile 方法
    const sheet = this.getActiveSheet();
    if (!sheet) {
      return;
    }
    if ((sheet.tableInstance as any)?.importFile) {
      return await (sheet.tableInstance as any).importFile({
        clearExisting: options?.clearExisting !== false
      });
    }
    console.warn('Please configure ExcelImportPlugin in VTablePluginModules');
  }
  /**
   * 获取容器元素
   */
  getContainer(): HTMLElement {
    return this.container;
  }

  /**
   * 获取根元素
   */
  getRootElement(): HTMLElement {
    return this.rootElement;
  }

  /**
   * 获取选项
   */
  getOptions(): IVTableSheetOptions {
    return this.options;
  }

  /**
   * 获取公式栏元素
   */
  getFormulaBarElement(): HTMLElement | null {
    return this.formulaBarElement;
  }

  /**
   * 获取sheet标签栏元素
   */
  getSheetTabElement(): HTMLElement | null {
    return this.sheetTabElement;
  }

  /**
   * 获取内容区域元素
   */
  getContentElement(): HTMLElement {
    return this.contentElement;
  }

  /**
   * 销毁实例
   */
  release(): void {
    // 清除所有 Table 事件监听器
    this.tableEventRelay.clearAllListeners();

    // 释放事件管理器
    this.eventManager.release();
    this.formulaManager.release();
    this.formulaUIManager.release();
    // 移除点击外部监听器
    this.sheetTabEventHandler.removeClickOutsideListener();
    // 销毁所有sheet实例
    this.workSheetInstances.forEach(instance => {
      instance.release();
    });
    // 清空容器
    if (this.rootElement && this.rootElement.parentNode) {
      this.rootElement.parentNode.removeChild(this.rootElement);
    }

    if (this.formulaAutocomplete) {
      this.formulaAutocomplete.release();
    }
    if (this.formulaManager.cellHighlightManager) {
      this.formulaManager.cellHighlightManager.release();
    }
  }

  /**
   * 导出指定sheet的数据
   * @param sheetKey sheet的key
   * @returns 数据
   */
  exportData(sheetKey: string): any[][] {
    const sheet = this.workSheetInstances.get(sheetKey);
    if (!sheet) {
      return [];
    }
    return sheet.getData();
  }

  /**
   * 导出所有sheet的数据
   * @returns 数据
   */
  exportAllData(): any[][] {
    const sheets = Array.from(this.workSheetInstances.values());
    return sheets.map(sheet => sheet.getData());
  }

  /**
   * resize
   */
  resize(): void {
    // const containerWidth = this.getContainer().clientWidth;
    // const containerHeight = this.getContainer().clientHeight;
    // this.rootElement.style.width = `${this.getOptions().width || containerWidth}px`;
    // this.rootElement.style.height = `${this.getOptions().height || containerHeight}px`;
    this.getActiveSheet()?.resize();
  }

  /**
   * 若所选范围包含当前正在编辑的单元格，自动排除该单元格以避免 #CYCLE!
   */
  excludeEditCellFromSelection(
    range: { startRow: number; startCol: number; endRow: number; endCol: number },
    editRow: number,
    editCol: number
  ) {
    const r = { ...range };
    const withinRow = r.startRow <= editRow && editRow <= r.endRow;
    const withinCol = r.startCol <= editCol && editCol <= r.endCol;
    if (!withinRow || !withinCol) {
      return r;
    }

    const rowSpan = r.endRow - r.startRow;
    const colSpan = r.endCol - r.startCol;

    // 如果选择范围就是编辑单元格本身，返回空范围（表示无效选择）
    if (rowSpan === 0 && colSpan === 0 && r.startRow === editRow && r.startCol === editCol) {
      return { startRow: -1, startCol: -1, endRow: -1, endCol: -1 };
    }

    if (rowSpan >= colSpan) {
      // 优先在行方向上排除编辑单元格
      if (editRow === r.startRow && r.startRow < r.endRow) {
        r.startRow += 1;
      } else if (editRow === r.endRow && r.startRow < r.endRow) {
        r.endRow -= 1;
      } else if (r.startRow < r.endRow) {
        r.startRow += 1;
      } // 中间，默认从起点缩一格
    } else {
      // 优先在列方向上排除编辑单元格
      if (editCol === r.startCol && r.startCol < r.endCol) {
        r.startCol += 1;
      } else if (editCol === r.endCol && r.startCol < r.endCol) {
        r.endCol -= 1;
      } else if (r.startCol < r.endCol) {
        r.startCol += 1;
      }
    }
    return r;
  }
}
