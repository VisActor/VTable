import { FormulaManager } from '../managers/formula-manager';
import { FilterManager } from '../managers/filter-manager';
import SheetManager from '../managers/sheet-manager';
import { Sheet } from '../core/Sheet';
import '../styles/index.css';
import * as VTable_editors from '@visactor/vtable-editors';
import * as VTable from '@visactor/vtable';
import { getTablePlugins } from '../core/table-plugins';
import { EventManager } from '../event/event-manager';
import { showSnackbar } from '../tools/ui/snackbar';
import type { IVTableSheetOptions, ISheetDefine, CellValue, CellValueChangedEvent, FormulaCell } from '../ts-types';
import SheetTabDragManager from '../managers/tab-drag-manager';
import { checkTabTitle } from '../tools';
import { FormulaAutocomplete } from './formula-autocomplete';
import { formulaEditor } from './formula-editor';
import { CellHighlightManager } from '../managers/cell-highlight-manager';
import type { TYPES } from '@visactor/vtable';
import { MenuManager } from '../managers/menu-manager';

// const input_editor = new VTable_editors.InputEditor();
// VTable.register.editor('input', input_editor);
VTable.register.editor('formula', formulaEditor);
export default class VTableSheet {
  /** DOM容器 */
  private container: HTMLElement;
  /** 配置选项 */
  private options: IVTableSheetOptions;
  /** sheet管理器 */
  private sheetManager: SheetManager;
  /** 公式管理器 */
  private formulaManager: FormulaManager;
  /** 过滤管理器 */
  private filterManager: FilterManager;
  /** 事件管理器 */
  private eventManager: EventManager;

  /** 菜单管理 */
  private menuManager: MenuManager;
  /** 当前活动sheet实例 */
  private activeSheet: Sheet | null = null;
  /** 所有sheet实例 */
  private sheetInstances: Map<string, Sheet> = new Map();
  /** 公式自动补全 */
  private formulaAutocomplete: FormulaAutocomplete | null = null;
  /** 单元格高亮管理器 */
  private cellHighlightManager: CellHighlightManager;

  /** UI组件 */
  private rootElement: HTMLElement;
  private formulaBarElement: HTMLElement | null = null;
  private sheetTabElement: HTMLElement | null = null;
  private mainMenuElement: HTMLElement | null = null;
  private contentElement: HTMLElement;

  /** 防止递归调用的标志 */
  private isUpdatingFromFormula = false;

  private isEnterKeyPressed = false;

  // 新增：拖拽管理器实例
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
    this.filterManager = new FilterManager(this);
    this.eventManager = new EventManager(this);
    this.dragManager = new SheetTabDragManager(this);
    this.cellHighlightManager = new CellHighlightManager(this);
    this.menuManager = new MenuManager(this);
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

    const formulaInput = this.formulaBarElement.querySelector('.vtable-sheet-formula-input') as HTMLInputElement;
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
    this.rootElement.style.width = `${this.options.width}px`;
    this.rootElement.style.height = `${this.options.height}px`;
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
      this.formulaBarElement = this.createFormulaBar();
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
    formulaInput.addEventListener('focus', () => {
      this.activateFormulaBar();
      // 当获得焦点时，显示公式而不是计算值
      if (this.activeSheet) {
        const selection = this.activeSheet.getSelection();
        if (selection) {
          const formula = this.formulaManager.getCellFormula({
            sheet: this.activeSheet.getKey(),
            row: selection.startRow,
            col: selection.startCol
          });
          if (formula) {
            // 显示公式
            const displayFormula = formula.startsWith('=') ? formula : `=${formula}`;
            formulaInput.value = displayFormula;
            // 触发高亮
            this.cellHighlightManager.highlightFormulaCells(displayFormula);
          }
        }
      }
    });
    formulaInput.addEventListener('blur', () => {
      this.deactivateFormulaBar();
      this.cellHighlightManager.clearHighlights();
      // 当失去焦点时，如果没有确认修改，恢复显示计算值
      if (this.activeSheet) {
        const selection = this.activeSheet.getSelection();
        if (selection) {
          const result = this.formulaManager.getCellValue({
            sheet: this.activeSheet.getKey(),
            row: selection.startRow,
            col: selection.startCol
          });
          this.isUpdatingFromFormula = true;
          this.activeSheet.tableInstance?.changeCellValue(
            selection.startCol,
            selection.startRow,
            result.error ? '#ERROR!' : result.value
          );
          this.isUpdatingFromFormula = false;
        }
      }
    });
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
    this.cellHighlightManager.clearHighlights();
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
      if (value.startsWith('=') && value.length > 1) {
        try {
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
        } catch (error) {
          console.warn('Formula confirmation error:', error);
          // 显示错误状态
          this.activeSheet.setCellValue(selection.startRow, selection.startCol, '#ERROR!');
        }
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
    this.activeSheetTab();
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
   * @param sheetKey sheet的key
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
   * @param sheetDefine sheet的定义
   */
  private createSheetInstance(sheetDefine: ISheetDefine): Sheet {
    formulaEditor.setSheet(this);
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
      editCellTrigger: ['api', 'keydown'],
      customMergeCell: sheetDefine.cellMerge
    } as any);

    // 注册事件
    sheet.on('cell-selected', this.handleCellSelected.bind(this));
    sheet.on('cell-value-changed', this.handleCellValueChanged.bind(this));

    // 在公式管理器中添加这个sheet
    try {
      this.formulaManager.addSheet(sheetDefine.sheetKey, sheetDefine.data as any[][]);
    } catch (error) {
      console.warn(`Sheet ${sheetDefine.sheetKey} may already exist in formula manager:`, error);
      // 如果添加失败（可能已存在），继续执行
    }

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
   * 处理单元格选中事件
   */
  private handleCellSelected(): void {
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
      const formula = this.formulaManager.getCellFormula({
        sheet: this.activeSheet.getKey(),
        row: selection.startRow,
        col: selection.startCol
      });

      if (formula) {
        const displayFormula = formula.startsWith('=') ? formula : '=' + formula;
        formulaInput.value = displayFormula;
      } else {
        const cellValue = this.activeSheet.getCellValue(selection.startRow, selection.startCol);
        formulaInput.value = cellValue !== undefined && cellValue !== null ? String(cellValue) : '';
      }
    }
  }

  /**
   * 处理公式输入
   * @param event 事件
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

    // 如果是公式，高亮引用的单元格
    if (value.startsWith('=')) {
      this.cellHighlightManager.highlightFormulaCells(value);
    } else {
      this.cellHighlightManager.clearHighlights();
    }

    this.isUpdatingFromFormula = false;
  }

  /**
   * 处理公式输入框键盘事件
   * @param event 事件
   */
  private handleFormulaKeydown(event: KeyboardEvent): void {
    if (!this.activeSheet) {
      return;
    }

    const input = event.target as HTMLInputElement;

    if (event.key === 'Enter') {
      const selection = this.activeSheet.getSelection();
      if (!selection) {
        return;
      }

      const value = input.value;

      if (value.startsWith('=') && value.length > 1) {
        try {
          // 设置公式内容
          this.formulaManager.setCellContent(
            {
              sheet: this.activeSheet.getKey(),
              row: selection.startRow,
              col: selection.startCol
            },
            value
          );

          // 保持显示公式
          this.isUpdatingFromFormula = true;
          this.activeSheet.tableInstance?.changeCellValue(selection.startCol, selection.startRow, value);
          this.isUpdatingFromFormula = false;

          // 清空公式栏
          input.value = '';

          // 让输入框失焦
          input.blur();

          // 重要：在移动到下一行之前，先重置当前单元格的显示状态为计算结果
          const result = this.formulaManager.getCellValue({
            sheet: this.activeSheet.getKey(),
            row: selection.startRow,
            col: selection.startCol
          });

          this.isUpdatingFromFormula = true;
          this.activeSheet.tableInstance?.changeCellValue(selection.startCol, selection.startRow, result.value);
          this.isUpdatingFromFormula = false;

          // 移动选择到下一行
          this.activeSheet.tableInstance?.selectCell(selection.startCol, selection.startRow + 1);
        } catch (error) {
          this.isUpdatingFromFormula = false;
          console.warn('Formula evaluation error:', error);
          // 显示错误状态
          this.activeSheet.setCellValue(selection.startRow, selection.startCol, '#ERROR!');
          this.isUpdatingFromFormula = true;
          this.activeSheet.tableInstance?.changeCellValue(selection.startCol, selection.startRow, '#ERROR!');
          this.isUpdatingFromFormula = false;
        }
      } else {
        // 普通值，直接设置
        this.activeSheet.setCellValue(selection.startRow, selection.startCol, value);
        this.isUpdatingFromFormula = true;
        this.activeSheet.tableInstance?.changeCellValue(selection.startCol, selection.startRow, value);
        this.isUpdatingFromFormula = false;
      }

      // 设置标志
      this.isEnterKeyPressed = true;

      // 让输入框失焦，回到表格
      input.blur();

      // 移动选择到下一行
      this.activeSheet.tableInstance?.selectCell(selection.startCol, selection.startRow + 1);

      // 阻止默认行为
      event.preventDefault();
      event.stopPropagation();
    }
  }

  /**
   * 处理单元格值变更事件
   * @param event 事件
   */
  private handleCellValueChanged(event: CellValueChangedEvent): void {
    if (!this.activeSheet || this.isUpdatingFromFormula) {
      return;
    }

    // 检查新输入的值是否为公式
    const newValue = event.newValue;
    if (typeof newValue === 'string' && newValue.startsWith('=') && newValue.length > 1) {
      try {
        // 首先设置公式内容
        this.formulaManager.setCellContent(
          {
            sheet: this.activeSheet.getKey(),
            row: event.row,
            col: event.col
          },
          newValue
        );
        const result = this.formulaManager.getCellValue({
          sheet: this.activeSheet.getKey(),
          row: event.row,
          col: event.col
        });

        // 检查当前单元格是否正在编辑（是否在公式栏中编辑）
        const formulaInput = this.formulaBarElement?.querySelector('.vtable-sheet-formula-input') as HTMLInputElement;
        const isEditing = document.activeElement === formulaInput;

        // 更新单元格显示 - 如果正在编辑则显示公式，否则显示计算结果
        this.isUpdatingFromFormula = true;
        this.activeSheet.tableInstance?.changeCellValue(event.col, event.row, isEditing ? newValue : result.value);
        this.isUpdatingFromFormula = false;
      } catch (error) {
        this.isUpdatingFromFormula = false;
        console.warn('Formula processing error:', error);
        // 显示错误状态
        this.isUpdatingFromFormula = true;
        this.activeSheet.tableInstance?.changeCellValue(event.col, event.row, '#ERROR!');
        this.isUpdatingFromFormula = false;
      }
    } else {
      // 非公式值，同步到HyperFormula
      this.formulaManager.setCellContent(
        {
          sheet: this.activeSheet.getKey(),
          row: event.row,
          col: event.col
        },
        newValue
      );
    }

    // 更新依赖的公式
    const dependents = this.formulaManager.getCellDependents({
      sheet: this.activeSheet.getKey(),
      row: event.row,
      col: event.col
    });

    // 重新计算依赖该单元格的所有公式
    dependents.forEach(dependent => {
      const result = this.formulaManager.getCellValue(dependent);
      this.isUpdatingFromFormula = true;
      this.activeSheet!.setCellValue(dependent.row, dependent.col, result.value);
      this.isUpdatingFromFormula = false;
    });

    // 如果当前编辑的单元格就是选中的单元格，更新 fx 输入框
    const selection = this.activeSheet.getSelection();
    if (selection && selection.startRow === event.row && selection.startCol === event.col) {
      this.updateFormulaBar();
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
  saveToConfig(): IVTableSheetOptions {
    // 收集所有sheet的数据
    const sheets: ISheetDefine[] = [];

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
          cellMerge: instance.tableInstance.options.customMergeCell as TYPES.CustomMergeCellArray,
          showHeader: instance.tableInstance.options.showHeader,
          frozenRowCount: instance.tableInstance.frozenRowCount,
          frozenColCount: instance.tableInstance.frozenColCount,
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

    if (this.formulaAutocomplete) {
      this.formulaAutocomplete.destroy();
    }
    if (this.cellHighlightManager) {
      this.cellHighlightManager.destroy();
    }
  }

  /**
   * 导出指定sheet的数据
   * @param sheetKey sheet的key
   * @returns 数据
   */
  exportData(sheetKey: string): any[][] {
    const sheet = this.sheetInstances.get(sheetKey);
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
    const sheets = Array.from(this.sheetInstances.values());
    return sheets.map(sheet => sheet.getData());
  }

  /**
   * resize
   */
  resize(): void {
    const containerWidth = this.getContainer().clientWidth;
    const containerHeight = this.getContainer().clientHeight;
    this.rootElement.style.width = `${this.getOptions().width || containerWidth}px`;
    this.rootElement.style.height = `${this.getOptions().height || containerHeight}px`;
    this.getActiveSheet()?.resize();
  }
}
