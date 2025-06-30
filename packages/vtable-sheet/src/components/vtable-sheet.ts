import type { ListTable } from '@visactor/vtable';
import type { SheetDefine, VTableSheetOptions, CellValueChangedEvent } from '../ts-types';
import { FormulaManager } from '../managers/formula-manager';
import { FilterManager } from '../managers/filter-manager';
import SheetManager from '../managers/sheet-manager';
import { Sheet } from '../core/Sheet';
import '../styles/index.css';
import * as VTable_editors from '@visactor/vtable-editors';
import * as VTable from '@visactor/vtable';
import { getTablePlugins } from '../core/table-plugins';
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

    // 初始化UI
    this.initUI();

    // 初始化sheets
    this.initSheets();

    // 绑定事件
    this.bindEvents();
  }

  /**
   * 合并默认配置
   */
  private mergeDefaultOptions(options: VTableSheetOptions): VTableSheetOptions {
    return {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
      showFormulaBar: true,
      showSheetTab: true,
      defaultRowHeight: 25,
      defaultColWidth: 100,
      frozenRowCount: 0,
      frozenColCount: 0,
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
        // 设置公式单元格
        this.formulaManager.setCellContent(
          {
            sheet: this.activeSheet.getKey(),
            row: selection.startRow,
            col: selection.startCol
          },
          value
        );

        // 获取计算结果
        const result = this.formulaManager.getCellValue({
          sheet: this.activeSheet.getKey(),
          row: selection.startRow,
          col: selection.startCol
        });

        this.activeSheet.setCellValue(selection.startRow, selection.startCol, result.value);
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

    // 更新sheet切换标签
    this.updateSheetTabs(tabsContainer);

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
    menuButton.addEventListener('click', e => this.showSheetMenu(e));
    navButtons.appendChild(menuButton);

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
  private showSheetMenu(event: MouseEvent): void {
    // 在这里添加菜单逻辑
    console.log('Show sheet menu', event);
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
    const activeSheet = this.sheetManager.getActiveSheet();

    // 如果没有活动sheet，提前返回
    if (!activeSheet) {
      return;
    }

    sheets.forEach(sheet => {
      const tab = document.createElement('div');
      tab.className = 'vtable-sheet-tab';
      tab.dataset.key = sheet.key;
      tab.textContent = sheet.title;
      tab.title = sheet.title;

      // 高亮当前活动sheet
      if (sheet.key === activeSheet.key) {
        tab.classList.add('active');
      }

      tab.addEventListener('click', () => this.activateSheet(sheet.key));
      tabsContainer.appendChild(tab);
    });

    // 确保激活的标签可见
    setTimeout(() => {
      const activeTab = tabsContainer.querySelector('.vtable-sheet-tab.active');
      if (activeTab) {
        this.scrollTabIntoView(activeTab as HTMLElement, tabsContainer);
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
        activeSheetKey = activeSheet.key;
      } else {
        activeSheetKey = this.options.sheets[0].key;
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
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  /**
   * 处理窗口大小变化
   */
  private handleResize(): void {
    // 更新容器大小
    if (this.options.width === undefined || this.options.height === undefined) {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;

      this.rootElement.style.width = `${width}px`;
      this.rootElement.style.height = `${height}px`;

      // 如果有活动的sheet，调整其大小
      if (this.activeSheet) {
        this.activeSheet.resize();
      }
    }
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

    // 如果已经存在实例，则显示
    if (this.sheetInstances.has(sheetKey)) {
      const instance = this.sheetInstances.get(sheetKey)!;
      instance.getElement().style.display = 'block';
      this.activeSheet = instance;
    } else {
      // 创建新的sheet实例
      const instance = this.createSheetInstance(sheetDefine);
      this.sheetInstances.set(sheetKey, instance);
      this.activeSheet = instance;
    }

    // 更新UI
    this.updateSheetTabs();
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
      container: this.contentElement,
      width: contentWidth,
      height: contentHeight,
      records: sheetDefine.data,
      columns: sheetDefine.columns,
      defaultRowHeight: this.options.defaultRowHeight,
      defaultColWidth: this.options.defaultColWidth,
      frozenRowCount: this.options.frozenRowCount,
      frozenColCount: this.options.frozenColCount,
      sheetKey: sheetDefine.key,
      sheetTitle: sheetDefine.title,
      parent: this,
      plugins: getTablePlugins(),
      editor: 'input',
      editCellTrigger: ['api', 'keydown', 'doubleclick']
    } as any); // 使用as any暂时解决类型不匹配问题

    // 注册事件
    sheet.on('cell-selected', this.handleCellSelected.bind(this));
    sheet.on('cell-value-changed', this.handleCellValueChanged.bind(this));

    // 在公式管理器中添加这个sheet
    this.formulaManager.addSheet(sheetDefine.key, sheetDefine.data as any[][]);

    return sheet;
  }

  /**
   * 添加新sheet
   */
  private addNewSheet(): void {
    // 生成新sheet的key和title
    const sheetCount = this.sheetManager.getSheetCount();
    const key = `sheet${sheetCount + 1}`;
    const title = `Sheet ${sheetCount + 1}`;

    // 创建新sheet配置
    const newSheet: SheetDefine = {
      key,
      title,
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
      const formula = this.formulaManager.getCellFormula({
        sheet: this.activeSheet.getKey(),
        row: selection.startRow,
        col: selection.startCol
      });

      if (formula) {
        formulaInput.value = '=' + formula;
      } else {
        formulaInput.value = cellValue !== undefined && cellValue !== null ? String(cellValue) : '';
      }
    }
  }

  /**
   * 处理公式输入
   */
  private handleFormulaInput(event: Event): void {
    if (!this.activeSheet) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const selection = this.activeSheet.getSelection();
    if (!selection) {
      return;
    }

    const value = input.value;

    if (value.startsWith('=')) {
      // 设置公式单元格
      this.formulaManager.setCellContent(
        {
          sheet: this.activeSheet.getKey(),
          row: selection.startRow,
          col: selection.startCol
        },
        value
      );

      // 获取计算结果
      const result = this.formulaManager.getCellValue({
        sheet: this.activeSheet.getKey(),
        row: selection.startRow,
        col: selection.startCol
      });

      // 使用 VTable API 更新表格显示
      this.activeSheet.tableInstance?.changeCellValue(selection.startCol + 1, selection.startRow + 1, result.value);
    } else {
      // 普通值，使用 VTable API 直接更新
      this.activeSheet.tableInstance?.changeCellValue(selection.startCol + 1, selection.startRow + 1, value);
    }
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
        // 设置公式单元格
        this.formulaManager.setCellContent(
          {
            sheet: this.activeSheet.getKey(),
            row: selection.startRow,
            col: selection.startCol
          },
          value
        );

        // 获取计算结果
        const result = this.formulaManager.getCellValue({
          sheet: this.activeSheet.getKey(),
          row: selection.startRow,
          col: selection.startCol
        });

        // 设置单元格值
        this.activeSheet.setCellValue(selection.startRow, selection.startCol, result.value);
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
      const dependents = this.formulaManager.getCellDependents({
        sheet: this.activeSheet.getKey(),
        row: event.row,
        col: event.col
      });

      // 重新计算依赖该单元格的所有公式
      dependents.forEach(dependent => {
        const result = this.formulaManager.getCellValue(dependent);
        this.activeSheet!.setCellValue(dependent.row, dependent.col, result.value);
      });

      // 如果当前编辑的单元格就是选中的单元格，更新 fx 输入框
      const selection = this.activeSheet.getSelection();
      if (selection && selection.startRow === event.row && selection.startCol === event.col) {
        this.updateFormulaBar();
      }
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
      const instance = this.sheetInstances.get(sheetDefine.key);
      if (instance) {
        const data = instance.getData();
        sheets.push({
          ...sheetDefine,
          data,
          active: sheetDefine.key === this.sheetManager.getActiveSheet().key
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
    // 移除事件监听
    window.removeEventListener('resize', this.handleResize.bind(this));

    // 销毁所有sheet实例
    this.sheetInstances.forEach(instance => {
      instance.release();
    });

    // 清空容器
    if (this.rootElement && this.rootElement.parentNode) {
      this.rootElement.parentNode.removeChild(this.rootElement);
    }
  }
}
