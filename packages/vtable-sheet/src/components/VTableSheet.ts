import type { ListTable } from '@visactor/vtable';
import type { SheetDefine, VTableSheetOptions, CellValueChangedEvent } from '../ts-types';
import { FormulaManager } from '../managers/FormulaManager';
import { FilterManager } from '../managers/FilterManager';
import SheetManager from '../managers/SheetManager';
import { Sheet } from '../core/Sheet';
import '../styles/index.css';
import * as VTable_editors from '@visactor/vtable-editors';
import * as VTable from '@visactor/vtable';
import { getTablePlugins } from '../core/table-plugins';
import { EventManager } from '../event/event-manager';
const input_editor = new VTable_editors.InputEditor();
VTable.register.editor('input', input_editor);
/**
 * VTableSheet组件 - 多sheet表格组件
 */
export default class VTableSheet {
  /** DOM容器 */
  private container: HTMLElement;
  /** 配置选项 */
  private options: VTableSheetOptions;
  /** sheet管理器 */
  private sheetManager: SheetManager;
  /** 公式管理器 */
  private formulaManager: FormulaManager;
  /** 过滤管理器 */
  private filterManager: FilterManager;
  /** 事件管理器 */
  private eventManager: EventManager;
  /** 当前活动sheet实例 */
  private activeSheet: Sheet | null = null;
  /** 所有sheet实例 */
  private sheetInstances: Map<string, Sheet> = new Map();

  /** UI组件 */
  private rootElement: HTMLElement;
  private formulaBarElement: HTMLElement | null = null;
  private sheetTabElement: HTMLElement | null = null;
  private contentElement: HTMLElement;
  private toolbarElement: HTMLElement | null = null;
  private footerElement: HTMLElement | null = null;

  /**
   * 构造函数
   * @param options 配置选项
   */
  constructor(container: HTMLElement, options: VTableSheetOptions) {
    this.container = container;
    this.options = this.mergeDefaultOptions(options);

    // 创建管理器
    this.sheetManager = new SheetManager();
    this.formulaManager = new FormulaManager(this);
    this.filterManager = new FilterManager(this);
    this.eventManager = new EventManager(this);
    // 初始化UI
    this.initUI();

    // 初始化sheets
    this.initSheets();

    // 绑定事件
    this.bindEvents();

    this.resize();
  }

  /**
   * 合并默认配置
   */
  private mergeDefaultOptions(options: VTableSheetOptions): VTableSheetOptions {
    return {
      showFormulaBar: true,
      showSheetTab: true,
      defaultRowHeight: 25,
      defaultColWidth: 100,
      ...options
    };
  }

  /**
   * 获取DOM容器
   */
  private resolveContainer(container: HTMLElement | string): HTMLElement {
    if (typeof container === 'string') {
      const el = document.getElementById(container);
      if (!el) {
        throw new Error(`Container with id '${container}' not found`);
      }
      return el;
    }
    return container;
  }

  /**
   * 初始化UI
   */
  private initUI(): void {
    // 创建根元素
    this.rootElement = document.createElement('div');
    this.rootElement.className = 'vtable-sheet-container';
    this.rootElement.style.width = `${this.options.width}px`;
    this.rootElement.style.height = `${this.options.height}px`;
    this.container.appendChild(this.rootElement);

    // 创建公式栏
    if (this.options.showFormulaBar) {
      this.formulaBarElement = this.createFormulaBar();
      this.rootElement.appendChild(this.formulaBarElement);
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
   * 创建公式栏
   */
  private createFormulaBar(): HTMLElement {
    // SVG图标常量
    const cancelIcon =
      '<svg viewBox="0 0 24 24" width="16" height="16">' +
      '<path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 ' +
      '6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>' +
      '</svg>';
    const confirmIcon =
      '<svg viewBox="0 0 24 24" width="16" height="16">' +
      '<path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>' +
      '</svg>';

    const formulaBar = document.createElement('div');
    formulaBar.className = 'vtable-sheet-formula-bar';

    // 创建单元格地址显示
    const cellAddressBox = document.createElement('div');
    cellAddressBox.className = 'vtable-sheet-cell-address';
    cellAddressBox.textContent = '';
    formulaBar.appendChild(cellAddressBox);

    // 创建fx标志
    const formulaIcon = document.createElement('div');
    formulaIcon.className = 'vtable-sheet-formula-icon';
    formulaIcon.textContent = 'fx';
    formulaIcon.title = '插入函数';
    formulaBar.appendChild(formulaIcon);

    // 创建公式输入框
    const formulaInput = document.createElement('input');
    formulaInput.className = 'vtable-sheet-formula-input';
    formulaInput.placeholder = '输入公式...';
    formulaInput.addEventListener('input', e => this.handleFormulaInput(e));
    formulaInput.addEventListener('keydown', e => this.handleFormulaKeydown(e));
    formulaInput.addEventListener('focus', () => this.activateFormulaBar());
    formulaInput.addEventListener('blur', () => this.deactivateFormulaBar());
    formulaBar.appendChild(formulaInput);

    // 创建操作按钮容器
    const formulaActions = document.createElement('div');
    formulaActions.className = 'vtable-sheet-formula-actions';

    // 创建取消按钮
    const cancelButton = document.createElement('button');
    cancelButton.className = 'vtable-sheet-formula-button vtable-sheet-formula-cancel';
    cancelButton.innerHTML = cancelIcon;
    cancelButton.title = '取消';
    cancelButton.addEventListener('click', () => this.cancelFormulaEdit());
    formulaActions.appendChild(cancelButton);

    // 创建确认按钮
    const confirmButton = document.createElement('button');
    confirmButton.className = 'vtable-sheet-formula-button vtable-sheet-formula-confirm';
    confirmButton.innerHTML = confirmIcon;
    confirmButton.title = '确认';
    confirmButton.addEventListener('click', () => this.confirmFormulaEdit());
    formulaActions.appendChild(confirmButton);

    formulaBar.appendChild(formulaActions);

    return formulaBar;
  }

  /**
   * 激活公式栏
   */
  private activateFormulaBar(): void {
    const formulaBar = this.formulaBarElement;
    if (formulaBar) {
      formulaBar.classList.add('active');
    }
  }

  /**
   * 取消激活公式栏
   */
  private deactivateFormulaBar(): void {
    const formulaBar = this.formulaBarElement;
    if (formulaBar) {
      formulaBar.classList.remove('active');
    }
  }

  /**
   * 取消公式编辑
   */
  private cancelFormulaEdit(): void {
    const formulaInput = this.formulaBarElement?.querySelector('.vtable-sheet-formula-input') as HTMLInputElement;
    if (formulaInput) {
      this.updateFormulaBar(); // 重置为原始值
    }
  }

  /**
   * 确认公式编辑
   */
  private confirmFormulaEdit(): void {
    const formulaInput = this.formulaBarElement?.querySelector('.vtable-sheet-formula-input') as HTMLInputElement;
    if (formulaInput && this.activeSheet) {
      const selection = this.activeSheet.getSelection();
      if (!selection) {
        return;
      }

      const value = formulaInput.value;

      // 应用与按Enter键相同的逻辑
      if (value.startsWith('=')) {
        const formula = value.substring(1);
        this.formulaManager.registerFormula(
          {
            sheet: this.activeSheet.getKey(),
            row: selection.startRow,
            col: selection.startCol
          },
          formula
        );

        const result = this.formulaManager.evaluateFormula(formula, {
          sheet: this.activeSheet.getKey()
        });

        this.activeSheet.setCellValue(selection.startRow, selection.startCol, result);
      } else {
        this.activeSheet.setCellValue(selection.startRow, selection.startCol, value);
      }
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

    // 创建右侧渐变效果
    const fadeRight = document.createElement('div');
    fadeRight.className = 'vtable-sheet-fade-right';
    sheetTab.appendChild(fadeRight);

    // 添加新增sheet按钮
    const addButton = document.createElement('button');
    addButton.className = 'vtable-sheet-add-button';
    addButton.innerHTML = addIcon;
    addButton.title = '添加工作表';
    addButton.addEventListener('click', () => this.addNewSheet());
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
  private activeSheetTab(): void {
    const tabs = this.sheetTabElement?.querySelectorAll('.vtable-sheet-tab') as NodeListOf<HTMLElement>;
    let activeTab: HTMLElement | null = null;
    tabs.forEach(tab => {
      tab.classList.remove('active');
      if (tab.dataset.key === this.activeSheet?.getKey()) {
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
   */
  private updateSheetTabs(
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
    sheets.forEach(sheet => {
      const tab = document.createElement('div');
      tab.className = 'vtable-sheet-tab';
      tab.dataset.key = sheet.sheetKey;
      tab.textContent = sheet.sheetTitle;
      tab.title = sheet.sheetTitle;
      tab.addEventListener('click', () => this.activateSheet(sheet.sheetKey));
      tab.addEventListener('dblclick', () => this.renameSheet(sheet.sheetKey));
      tabsContainer.appendChild(tab);
    });
    // 激活sheet标签并滚动到可见区域
    this.activeSheetTab();
  }
  private renameSheet(sheetKey: string): void {
    const tabsContainer: HTMLElement = this.sheetTabElement?.querySelector(
      '.vtable-sheet-tabs-container'
    ) as HTMLElement;
    const targetTab = tabsContainer.querySelector(`.vtable-sheet-tab[data-key="${sheetKey}"]`) as HTMLElement;
    if (!targetTab) {
      return;
    }
    const sheet = this.sheetManager.getSheet(sheetKey);
    if (!sheet) {
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

    const finishInput = (commit: boolean) => {
      targetTab.removeEventListener('blur', onBlur);
      targetTab.removeEventListener('keydown', onKeyDown);
      const newTitle = targetTab.textContent?.trim();
      targetTab.classList.remove('editing');
      targetTab.setAttribute('contenteditable', 'false');
      if (!commit || !newTitle || newTitle === sheet.sheetTitle) {
        targetTab.innerHTML = sheet.sheetTitle;
        return;
      }
      const isExist = this.sheetManager.getAllSheets().find(s => s.sheetKey !== sheetKey && s.sheetTitle === newTitle);
      if (isExist) {
        //TODO toast
        alert('工作表名称已存在');
        targetTab.innerHTML = sheet.sheetTitle;
      } else {
        this.sheetManager.renameSheet(sheetKey, newTitle);
        targetTab.innerHTML = newTitle;
      }
    };

    const onBlur = () => finishInput(true);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        finishInput(true);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        finishInput(false);
      }
    };

    targetTab.addEventListener('blur', onBlur);
    targetTab.addEventListener('keydown', onKeyDown);
  }

  /**
   * 更新sheet列表
   */
  private updateSheetMenu(): void {
    const menuContainer = this.sheetTabElement?.querySelector('.vtable-sheet-menu-list') as HTMLElement;
    menuContainer.innerHTML = '';
    const sheets = this.sheetManager.getAllSheets();
    sheets.forEach(sheet => {
      const li = document.createElement('li');
      li.className = 'vtable-sheet-menu-item';
      li.dataset.key = sheet.sheetKey;
      li.textContent = sheet.sheetTitle;
      li.addEventListener('click', () => this.activateSheet(sheet.sheetKey));
      menuContainer.appendChild(li as any);
    });
    this.activeSheetMenuItem();
    // 确保激活的标签可见
    setTimeout(() => {
      const activeItem = menuContainer.querySelector('.vtable-sheet-menu-item.active');
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  }

  /**
   * 激活sheet菜单项并滚动到可见区域
   */
  private activeSheetMenuItem(): void {
    const menuItems = this.sheetTabElement?.querySelectorAll('.vtable-sheet-menu-item') as NodeListOf<HTMLElement>;
    let activeItem: HTMLElement | null = null;
    menuItems.forEach(item => {
      item.classList.remove('active');
      if (item.dataset.key === this.activeSheet?.getKey()) {
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
      this.options.sheets.forEach(sheetDefine => {
        this.sheetManager.addSheet(sheetDefine);
      });

      // 找到active的sheet
      let activeSheetKey = '';
      const activeSheet = this.options.sheets.find(sheet => sheet.active);
      if (activeSheet) {
        activeSheetKey = activeSheet.sheetKey;
      } else {
        activeSheetKey = this.options.sheets[0].sheetKey;
      }

      // 激活sheet
      this.activateSheet(activeSheetKey);
    } else {
      // 如果没有提供sheets，创建一个默认的
      this.addNewSheet();
    }
  }

  /**
   * 绑定事件
   */
  private bindEvents(): void {
    // 监听窗口大小变化
    // window.addEventListener('resize', this.handleResize.bind(this));
  }

  /**
   * 激活指定sheet
   */
  private activateSheet(sheetKey: string): void {
    // 设置活动sheet
    this.sheetManager.setActiveSheet(sheetKey);

    // 获取sheet定义
    const sheetDefine = this.sheetManager.getSheet(sheetKey);
    if (!sheetDefine) {
      return;
    }

    // 隐藏所有sheet实例
    this.sheetInstances.forEach(instance => {
      instance.getElement().style.display = 'none';
    });

    // 如果已经存在实例，则显示并激活对应tab和menu
    if (this.sheetInstances.has(sheetKey)) {
      const instance = this.sheetInstances.get(sheetKey)!;
      instance.getElement().style.display = 'block';
      this.activeSheet = instance;
      // sheet标签和菜单项激活样式
      this.activeSheetTab();
      this.activeSheetMenuItem();
    } else {
      // 创建新的sheet实例
      const instance = this.createSheetInstance(sheetDefine);
      this.sheetInstances.set(sheetKey, instance);
      this.activeSheet = instance;
      // 刷新sheet标签和菜单
      this.updateSheetTabs();
      this.updateSheetMenu();
    }

    this.updateFormulaBar();
  }

  /**
   * 创建sheet实例
   */
  private createSheetInstance(sheetDefine: SheetDefine): Sheet {
    // 计算内容区域大小
    const contentWidth = this.contentElement.clientWidth;
    const contentHeight = this.contentElement.clientHeight;

    // 创建sheet实例
    const sheet = new Sheet({
      ...sheetDefine,
      container: this.contentElement,
      width: contentWidth,
      height: contentHeight,
      defaultRowHeight: this.options.defaultRowHeight,
      defaultColWidth: this.options.defaultColWidth,
      parent: this,
      plugins: getTablePlugins(),
      editor: 'input',
      select: {
        makeSelectCellVisible: false
      },
      editCellTrigger: ['api', 'keydown', 'doubleclick']
    } as any); // 使用as any暂时解决类型不匹配问题

    // 注册事件
    // sheet.on('cell-selected', this.handleCellSelected.bind(this));
    // sheet.on('cell-value-changed', this.handleCellValueChanged.bind(this));
    return sheet;
  }

  /**
   * 添加新sheet
   */
  private addNewSheet(): void {
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
    const newSheet: SheetDefine = {
      sheetKey: key,
      sheetTitle: title,
      columnCount: 20,
      rowCount: 100,
      data: Array(100)
        .fill(0)
        .map(() => Array(20).fill(''))
    };

    // 添加到管理器
    this.sheetManager.addSheet(newSheet);

    // 激活新sheet
    this.activateSheet(key);
  }

  /**
   * 处理单元格选中事件
   */
  private handleCellSelected(event: any): void {
    // 更新公式栏
    this.updateFormulaBar();
  }

  /**
   * 更新公式栏
   */
  private updateFormulaBar(): void {
    if (!this.formulaBarElement || !this.activeSheet) {
      return;
    }

    const selection = this.activeSheet.getSelection();
    if (!selection) {
      return;
    }

    // 更新单元格地址
    const cellAddressBox = this.formulaBarElement.querySelector('.vtable-sheet-cell-address');
    if (cellAddressBox) {
      cellAddressBox.textContent = this.activeSheet.addressFromCoord(selection.startRow, selection.startCol);
    }

    // 更新公式输入框
    const formulaInput = this.formulaBarElement.querySelector('.vtable-sheet-formula-input') as HTMLInputElement;
    if (formulaInput) {
      const cellValue = this.activeSheet.getCellValue(selection.startRow, selection.startCol);
      const formula = this.formulaManager.getFormula({
        sheet: this.activeSheet.getKey(),
        row: selection.startRow,
        col: selection.startCol
      });

      if (formula) {
        formulaInput.value = '=' + formula.formula;
      } else {
        formulaInput.value = cellValue !== undefined && cellValue !== null ? String(cellValue) : '';
      }
    }
  }

  /**
   * 处理公式输入
   */
  private handleFormulaInput(event: Event): void {
    // 公式输入处理
  }

  /**
   * 处理公式输入框键盘事件
   */
  private handleFormulaKeydown(event: KeyboardEvent): void {
    if (!this.activeSheet) {
      return;
    }

    const input = event.target as HTMLInputElement;

    if (event.key === 'Enter') {
      // 获取当前选中的单元格
      const selection = this.activeSheet.getSelection();
      if (!selection) {
        return;
      }

      const value = input.value;

      // 检查是否是公式
      if (value.startsWith('=')) {
        const formula = value.substring(1);

        // 注册公式
        this.formulaManager.registerFormula(
          {
            sheet: this.activeSheet.getKey(),
            row: selection.startRow,
            col: selection.startCol
          },
          formula
        );

        // 计算公式值
        const result = this.formulaManager.evaluateFormula(formula, {
          sheet: this.activeSheet.getKey()
        });

        // 设置单元格值
        this.activeSheet.setCellValue(selection.startRow, selection.startCol, result);
      } else {
        // 普通值，直接设置
        this.activeSheet.setCellValue(selection.startRow, selection.startCol, value);
      }

      // 阻止默认行为
      event.preventDefault();
    }
  }

  /**
   * 处理单元格值变更事件
   */
  private handleCellValueChanged(event: CellValueChangedEvent): void {
    // 更新依赖的公式
    if (this.activeSheet) {
      this.formulaManager.updateDependencies({
        sheet: this.activeSheet.getKey(),
        row: event.row,
        col: event.col
      });
    }
  }

  /**
   * 获取公式管理器
   */
  getFormulaManager(): FormulaManager {
    return this.formulaManager;
  }

  /**
   * 获取过滤管理器
   */
  getFilterManager(): FilterManager {
    return this.filterManager;
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
  getActiveSheet(): Sheet | null {
    return this.activeSheet;
  }

  /**
   * 保存所有数据为配置
   */
  saveToConfig(): VTableSheetOptions {
    // 收集所有sheet的数据
    const sheets: SheetDefine[] = [];

    this.sheetManager.getAllSheets().forEach(sheetDefine => {
      const instance = this.sheetInstances.get(sheetDefine.sheetKey);
      if (instance) {
        const data = instance.getData();
        //column中去除field字段
        const columns = instance.getColumns().map(column => {
          const { field, ...rest } = column;
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
        sheets.push({
          ...sheetDefine,
          data,
          columns,
          showHeader: instance.tableInstance.options.showHeader,
          active: sheetDefine.sheetKey === this.sheetManager.getActiveSheet().sheetKey
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

  /**
   * 获取容器元素
   */
  getContainer(): HTMLElement {
    return this.container;
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
  destroy(): void {
    // 释放事件管理器
    this.eventManager.release();
    // 销毁所有sheet实例
    this.sheetInstances.forEach(instance => {
      instance.release();
    });

    // 清空容器
    if (this.rootElement && this.rootElement.parentNode) {
      this.rootElement.parentNode.removeChild(this.rootElement);
    }
  }
  exportData(sheetKey: string): any[][] {
    const sheet = this.sheetInstances.get(sheetKey);
    if (!sheet) {
      return [];
    }
    return sheet.getData();
  }
  exportAllData(): any[][] {
    const sheets = Array.from(this.sheetInstances.values());
    return sheets.map(sheet => sheet.getData());
  }

  /**
   * resize
   */
  resize(): void {
    this.updateRootSize();
    this.updateContentSize();
    this.updateActiveSheetSize();
    this.updateUILayout();
  }

  /**
   * 更新根元素尺寸
   */
  private updateRootSize(): void {
    // 获取容器尺寸
    const containerWidth = this.container.clientWidth;
    const containerHeight = this.container.clientHeight;
    // 设置根元素尺寸
    this.rootElement.style.width = `${this.options.width || containerWidth}px`;
    this.rootElement.style.height = `${this.options.height || containerHeight}px`;
  }

  /**
   * 更新内容区域尺寸
   */
  private updateContentSize(): void {
    // 计算可用内容区域尺寸
    const rootRect = this.rootElement.getBoundingClientRect();
    const contentWidth = rootRect.width;
    let contentHeight = rootRect.height;
    // 减去公式栏高度
    if (this.formulaBarElement && this.options.showFormulaBar) {
      const formulaBarRect = this.formulaBarElement.getBoundingClientRect();
      contentHeight -= formulaBarRect.height;
    }
    // 减去sheet标签栏高度
    if (this.sheetTabElement && this.options.showSheetTab) {
      const sheetTabRect = this.sheetTabElement.getBoundingClientRect();
      contentHeight -= sheetTabRect.height;
    }
    // 更新内容区域尺寸
    this.contentElement.style.width = `${contentWidth}px`;
    this.contentElement.style.height = `${contentHeight}px`;
  }

  /**
   * 更新活动 sheet 尺寸
   */
  private updateActiveSheetSize(): void {
    if (this.activeSheet) {
      this.activeSheet.resize();
    }
  }

  /**
   * 更新 UI 组件布局
   */
  private updateUILayout(): void {
    // 更新公式栏布局
    this.updateFormulaBarLayout();
    // 更新 sheet 标签栏布局
    this.updateSheetTabLayout();
  }

  /**
   * 更新公式栏布局
   */
  private updateFormulaBarLayout(): void {
    if (!this.formulaBarElement) {
      return;
    }
    // 确保公式栏宽度与根元素一致
    this.formulaBarElement.style.width = '100%';
    // 更新公式输入框宽度
    const formulaInput = this.formulaBarElement.querySelector('.vtable-sheet-formula-input') as HTMLInputElement;
    if (formulaInput) {
      // 计算可用宽度（减去地址框、fx图标、按钮等）
      const addressBox = this.formulaBarElement.querySelector('.vtable-sheet-cell-address');
      const formulaIcon = this.formulaBarElement.querySelector('.vtable-sheet-formula-icon');
      const actions = this.formulaBarElement.querySelector('.vtable-sheet-formula-actions');

      const addressWidth = addressBox?.getBoundingClientRect().width || 0;
      const iconWidth = formulaIcon?.getBoundingClientRect().width || 0;
      const actionsWidth = actions?.getBoundingClientRect().width || 0;
      const padding = 20;

      const availableWidth = this.rootElement.clientWidth - addressWidth - iconWidth - actionsWidth - padding;
      formulaInput.style.width = `${Math.max(availableWidth, 100)}px`;
    }
  }

  /**
   * 更新 sheet 标签栏布局
   */
  private updateSheetTabLayout(): void {
    if (!this.sheetTabElement) {
      return;
    }
    // 确保标签栏宽度与根元素一致
    this.sheetTabElement.style.width = '100%';
    // 更新标签容器宽度
    const tabsContainer = this.sheetTabElement.querySelector('.vtable-sheet-tabs-container');
    if (tabsContainer) {
      // 计算可用宽度（减去导航按钮等）
      const navButtons = this.sheetTabElement.querySelector('.vtable-sheet-nav-buttons');
      const addButton = this.sheetTabElement.querySelector('.vtable-sheet-add-button');
      const navWidth = navButtons?.getBoundingClientRect().width || 0;
      const addButtonWidth = addButton?.getBoundingClientRect().width || 0;
      const padding = 20; // 预留边距
      const availableWidth = this.rootElement.clientWidth - navWidth - addButtonWidth - padding;
      (tabsContainer as HTMLElement).style.width = `${Math.max(availableWidth, 200)}px`;
    }
  }
}
