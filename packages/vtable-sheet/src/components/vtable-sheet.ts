import { FormulaManager } from '../managers/formula-manager';
import SheetManager from '../managers/sheet-manager';
import { WorkSheet } from '../core/WorkSheet';
import * as VTable from '@visactor/vtable';
import { getTablePlugins } from '../core/table-plugins';
import { EventManager } from '../event/event-manager';
import { showSnackbar } from '../tools/ui/snackbar';
import type { IVTableSheetOptions, ISheetDefine, CellValueChangedEvent } from '../ts-types';
import { WorkSheetEventType } from '../ts-types';
import SheetTabDragManager from '../managers/tab-drag-manager';
import { checkTabTitle } from '../tools';
import { FormulaAutocomplete } from '../formula/formula-autocomplete';
import { formulaEditor } from '../formula/formula-editor';
import { CellHighlightManager } from '../formula/cell-highlight-manager';
import type { TYPES } from '@visactor/vtable';
import { MenuManager } from '../managers/menu-manager';
import { FormulaUIManager } from '../formula/formula-ui-manager';

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

  /**
   * 构造函数
   * @param options 配置选项
   */
  constructor(container: HTMLElement, options: IVTableSheetOptions) {
    this.container = container;
    this.options = this.mergeDefaultOptions(options);

    // 创建管理器
    this.sheetManager = new SheetManager();
    this.formulaManager = new FormulaManager(this);
    this.eventManager = new EventManager(this);
    this.dragManager = new SheetTabDragManager(this);
    this.menuManager = new MenuManager(this);
    this.formulaUIManager = new FormulaUIManager(this);

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
    tabsContainer.addEventListener('scroll', () => this.updateFadeEffects(tabsContainer, fadeLeft, fadeRight));
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
    leftScrollBtn.addEventListener('click', () => this.scrollSheetTabs('left', tabsContainer));
    navButtons.appendChild(leftScrollBtn);

    // 创建右侧滚动按钮
    const rightScrollBtn = document.createElement('button');
    rightScrollBtn.className = 'vtable-sheet-scroll-button';
    rightScrollBtn.innerHTML = rightIcon;
    rightScrollBtn.title = '向右滚动';
    rightScrollBtn.addEventListener('click', () => this.scrollSheetTabs('right', tabsContainer));
    navButtons.appendChild(rightScrollBtn);

    // 创建sheet菜单按钮
    const menuButton = document.createElement('button');
    menuButton.className = 'vtable-sheet-menu-button';
    menuButton.innerHTML = menuIcon;
    menuButton.title = '工作表选项';
    menuButton.addEventListener('click', e => this.toggleSheetMenu(e));
    navButtons.appendChild(menuButton);

    // 创建菜单容器
    const menuContainer = document.createElement('ul');
    menuContainer.className = 'vtable-sheet-menu-list';
    sheetTab.appendChild(menuContainer);

    sheetTab.appendChild(navButtons);
    // 初始化渐变效果
    setTimeout(() => {
      this.updateFadeEffects(tabsContainer, fadeLeft, fadeRight);
    }, 100);

    return sheetTab;
  }

  /**
   * 显示工作表菜单
   */

  private toggleSheetMenu(event: MouseEvent): void {
    const menuContainer = this.sheetTabElement?.querySelector('.vtable-sheet-menu-list') as HTMLElement;
    menuContainer.classList.toggle('active');
  }

  /**
   * 更新渐变效果
   * @param tabsContainer 标签容器
   * @param fadeLeft 左侧渐变效果
   * @param fadeRight 右侧渐变效果
   */
  private updateFadeEffects(tabsContainer: HTMLElement, fadeLeft: HTMLElement, fadeRight: HTMLElement): void {
    // 显示/隐藏左侧渐变
    if (tabsContainer.scrollLeft > 10) {
      fadeLeft.style.display = 'block';
    } else {
      fadeLeft.style.display = 'none';
    }

    // 显示/隐藏右侧渐变
    const maxScroll = tabsContainer.scrollWidth - tabsContainer.clientWidth;
    if (tabsContainer.scrollLeft < maxScroll - 10) {
      fadeRight.style.display = 'block';
    } else {
      fadeRight.style.display = 'none';
    }
  }

  /**
   * 滚动sheet标签
   * @param direction 滚动方向
   * @param tabsContainer 标签容器
   */
  private scrollSheetTabs(direction: 'left' | 'right', tabsContainer: HTMLElement): void {
    const scrollAmount = 200; // 每次滚动的像素数
    const currentScroll = tabsContainer.scrollLeft;

    if (direction === 'left') {
      tabsContainer.scrollTo({
        left: Math.max(0, currentScroll - scrollAmount),
        behavior: 'smooth'
      });
    } else {
      tabsContainer.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  }
  /**
   * 激活sheet标签并滚动到可见区域
   */
  private _activeSheetTab(): void {
    const tabs = this.sheetTabElement?.querySelectorAll('.vtable-sheet-tab') as NodeListOf<HTMLElement>;
    let activeTab: HTMLElement | null = null;
    tabs.forEach(tab => {
      tab.classList.remove('active');
      if (tab.dataset.key === this.activeWorkSheet?.getKey()) {
        tab.classList.add('active');
        activeTab = tab;
      }
    });
    // 确保激活的标签可见
    setTimeout(() => {
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
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
    tab.addEventListener('dblclick', () => this.handleSheetTabDblClick(sheet.sheetKey, sheet.sheetTitle));
    // 拖拽事件
    tab.addEventListener('mousedown', e => this.dragManager.handleTabMouseDown(e, sheet.sheetKey));

    return tab;
  }
  /**
   * 处理sheet标签双击事件
   * 双击sheet标签后，将标签设为可编辑状态。输入完成后进行重命名。
   * @param sheetKey 工作表key
   * @param originalTitle 原始名称
   */
  private handleSheetTabDblClick(sheetKey: string, originalTitle: string): void {
    const targetTab = this.getSheetTabElementByKey(sheetKey);
    if (!targetTab) {
      return;
    }
    // 将原文本节点设为可编辑
    targetTab.setAttribute('contenteditable', 'true');
    targetTab.setAttribute('spellcheck', 'false');
    targetTab.classList.add('editing'); // 添加编辑状态样式
    // 选中所有文本
    const range = document.createRange();
    range.selectNodeContents(targetTab);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    const onBlur = () => {
      finishInput(true);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        e.preventDefault();
        finishInput(true);
      } else if (e.key === 'Escape') {
        finishInput(false);
      }
    };
    const finishInput = (commit: boolean) => {
      targetTab.removeEventListener('blur', onBlur);
      targetTab.removeEventListener('keydown', onKeyDown);
      targetTab.classList.remove('editing');
      targetTab.setAttribute('contenteditable', 'false');
      const newTitle = targetTab.textContent?.trim();
      if (!commit || newTitle === originalTitle || !this.renameSheet(sheetKey, newTitle)) {
        targetTab.textContent = originalTitle;
        return;
      }
    };
    targetTab.addEventListener('blur', onBlur);
    targetTab.addEventListener('keydown', onKeyDown);
  }

  /**
   * 重命名sheet
   * @param sheetKey 工作表key
   * @param newTitle 新名称
   * @returns 是否成功
   */
  private renameSheet(sheetKey: string, newTitle: string): boolean {
    const sheet = this.sheetManager.getSheet(sheetKey);
    if (!sheet) {
      return false;
    }
    const error = checkTabTitle(newTitle);
    if (error) {
      showSnackbar(error, 1300);
      return false;
    }
    const isExist = this.sheetManager.getAllSheets().find(s => s.sheetKey !== sheetKey && s.sheetTitle === newTitle);
    if (isExist) {
      showSnackbar('工作表名称已存在，请重新输入', 1300);
      return false;
    }
    this.sheetManager.renameSheet(sheetKey, newTitle);
    this.workSheetInstances.get(sheetKey)?.setTitle(newTitle);
    this.updateSheetTabs();
    this.updateSheetMenu();
    return true;
  }

  /**
   * 获取指定sheetKey的标签元素
   */
  private getSheetTabElementByKey(sheetKey: string): HTMLElement | null {
    const tabsContainer = this.sheetTabElement?.querySelector('.vtable-sheet-tabs-container') as HTMLElement;
    return tabsContainer?.querySelector(`.vtable-sheet-tab[data-key="${sheetKey}"]`) as HTMLElement;
  }

  /**
   * 更新sheet列表
   */
  updateSheetMenu(): void {
    const menuContainer = this.sheetTabElement?.querySelector('.vtable-sheet-menu-list') as HTMLElement;
    menuContainer.innerHTML = '';
    const sheets = this.sheetManager.getAllSheets();
    sheets.forEach(sheet => {
      // li
      const li = document.createElement('li');
      li.className = 'vtable-sheet-menu-item';
      li.dataset.key = sheet.sheetKey;
      // title
      const title = document.createElement('span');
      title.className = 'vtable-sheet-menu-item-title';
      title.innerText = sheet.sheetTitle;
      li.appendChild(title);
      // delete button
      const div = document.createElement('div');
      div.className = 'vtable-sheet-menu-delete-button';
      div.innerHTML =
        '<svg class="x-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>';
      div.addEventListener('click', e => {
        e.stopPropagation();
        this.removeSheet(sheet.sheetKey);
      });
      li.addEventListener('click', () => this.activateSheet(sheet.sheetKey));
      li.appendChild(div);
      menuContainer.appendChild(li);
    });
    this.activeSheetMenuItem();
    // 确保激活的标签可见
    setTimeout(() => {
      const activeItem = menuContainer.querySelector('.vtable-sheet-main-menu-item.active');
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  }

  /**
   * 激活sheet菜单项并滚动到可见区域
   */
  private activeSheetMenuItem(): void {
    const menuItems = this.sheetTabElement?.querySelectorAll('.vtable-sheet-main-menu-item') as NodeListOf<HTMLElement>;
    let activeItem: HTMLElement | null = null;
    menuItems.forEach(item => {
      item.classList.remove('active');
      if (item.dataset.key === this.activeWorkSheet?.getKey()) {
        item.classList.add('active');
        activeItem = item;
      }
    });
    setTimeout(() => {
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  }

  /**
   * 滚动以确保标签可见
   * @param tab 标签
   * @param container 容器
   */
  private scrollTabIntoView(tab: HTMLElement, container: HTMLElement): void {
    const tabRect = tab.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    if (tabRect.left < containerRect.left) {
      // 标签在可见区域左侧
      container.scrollLeft += tabRect.left - containerRect.left - 10;
    } else if (tabRect.right > containerRect.right) {
      // 标签在可见区域右侧
      container.scrollLeft += tabRect.right - containerRect.right + 10;
    }
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
      // sheet标签和菜单项激活样式
      this._activeSheetTab();
      this.activeSheetMenuItem();

      // 恢复筛选状态
      this.restoreFilterState(instance, sheetDefine);
    } else {
      // 创建新的sheet实例
      const instance = this.createWorkSheetInstance(sheetDefine);
      this.workSheetInstances.set(sheetKey, instance);
      this.activeWorkSheet = instance;
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
      instance.getElement().remove();
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
  private createWorkSheetInstance(sheetDefine: ISheetDefine): WorkSheet {
    formulaEditor.setSheet(this);
    // 计算内容区域大小
    const contentWidth = this.contentElement.clientWidth;
    const contentHeight = this.contentElement.clientHeight;

    // 创建sheet实例
    const sheet = new WorkSheet(this, {
      ...sheetDefine,
      container: this.contentElement,
      width: contentWidth,
      height: contentHeight,
      defaultRowHeight: this.options.defaultRowHeight,
      defaultColWidth: this.options.defaultColWidth,
      plugins: getTablePlugins(sheetDefine, this.options),
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

    // 注册事件 - 使用预先绑定的事件处理方法和WorkSheetEventType枚举
    sheet.on(WorkSheetEventType.CELL_CLICK, this.eventManager.handleCellClickBind);
    sheet.on(WorkSheetEventType.CELL_VALUE_CHANGED, this.eventManager.handleCellValueChangedBind);
    sheet.on(WorkSheetEventType.SELECTION_CHANGED, this.eventManager.handleSelectionChangedForRangeModeBind);
    sheet.on(WorkSheetEventType.SELECTION_END, this.eventManager.handleSelectionChangedForRangeModeBind);

    // 在公式管理器中添加这个sheet
    try {
      const normalizedData = this.formulaManager.normalizeSheetData(sheetDefine.data, sheet.tableInstance);
      this.formulaManager.addSheet(sheetDefine.sheetKey, normalizedData);
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
   * 保存所有数据为配置
   */
  saveToConfig(): IVTableSheetOptions {
    // 收集所有sheet的数据
    const sheets: ISheetDefine[] = [];

    this.sheetManager.getAllSheets().forEach(sheetDefine => {
      const instance = this.workSheetInstances.get(sheetDefine.sheetKey);
      if (instance) {
        const data = instance.getData();
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
        // 找到最后一个有非空值的行
        const lastDataIndex = data.reduce((lastIndex, rowData, index) => (rowData ? index : lastIndex), -1);
        // 保留到最后一个有值的行，删除之后的空行
        if (lastDataIndex === -1) {
          data.length = 0; // 清空数组
        } else {
          data.splice(lastDataIndex + 1);
        }

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
          formulas: Object.keys(formulas).length > 0 ? formulas : undefined
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
  exportSheetToFile(fileType: 'csv' | 'xlsx'): void {
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
      if ((sheet.tableInstance as any)?.exportToExcel) {
        (sheet.tableInstance as any).exportToExcel();
      } else {
        console.warn('Please configure TableExportPlugin in VTablePluginModules');
      }
    }
  }
  /** 导入文件到当前sheet */
  importFileToSheet(): void {
    const sheet = this.getActiveSheet();
    if (!sheet) {
      return;
    }
    if ((sheet.tableInstance as any)?.importFile) {
      (sheet.tableInstance as any).importFile();
    } else {
      console.warn('Please configure ExcelImportPlugin in VTablePluginModules');
    }
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
    // 释放事件管理器
    this.eventManager.release();
    this.formulaManager.release();
    this.formulaUIManager.release();
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
