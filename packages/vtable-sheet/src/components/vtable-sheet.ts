import { FormulaManager } from '../managers/formula-manager';
import SheetManager from '../managers/sheet-manager';
import { WorkSheet } from '../core/WorkSheet';
import '../styles/index.css';
import * as VTable from '@visactor/vtable';
import { getTablePlugins } from '../core/table-plugins';
import { EventManager } from '../event/event-manager';
import { showSnackbar } from '../tools/ui/snackbar';
import type { IVTableSheetOptions, ISheetDefine, CellValueChangedEvent, FormulaCell } from '../ts-types';
import SheetTabDragManager from '../managers/tab-drag-manager';
import { checkTabTitle } from '../tools';
import { FormulaAutocomplete } from './formula-autocomplete';
import { formulaEditor } from './formula-editor';
import { CellHighlightManager } from '../managers/cell-highlight-manager';
import type { TYPES } from '@visactor/vtable';
import { MenuManager } from '../managers/menu-manager';
import { FormulaThrottle } from '..';
import { FormulaRangeSelector } from './formula-range-selector';

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
  private formulaManager: FormulaManager;
  /** 事件管理器 */
  private eventManager: EventManager;

  /** 菜单管理 */
  private menuManager: MenuManager;
  /** 当前活动sheet实例 */
  private activeWorkSheet: WorkSheet | null = null;
  /** 所有sheet实例 */
  private workSheetInstances: Map<string, WorkSheet> = new Map();
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

  /** 公式栏是否正在显示计算结果 */
  private isFormulaBarShowingResult = false;

  // tab拖拽管理器
  private dragManager: SheetTabDragManager;

  /** 公式范围选择器 */
  private formulaRangeSelector: FormulaRangeSelector;

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
    this.cellHighlightManager = new CellHighlightManager(this);
    this.menuManager = new MenuManager(this);
    this.formulaRangeSelector = new FormulaRangeSelector();
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
      if (this.activeWorkSheet) {
        const selection = this.activeWorkSheet.getSelection();
        if (selection) {
          const formula = this.formulaManager.getCellFormula({
            sheet: this.activeWorkSheet.getKey(),
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
      if (this.activeWorkSheet) {
        const selection = this.activeWorkSheet.getSelection();
        if (selection) {
          const result = this.formulaManager.getCellValue({
            sheet: this.activeWorkSheet.getKey(),
            row: selection.startRow,
            col: selection.startCol
          });
          this.isUpdatingFromFormula = true;
          this.activeWorkSheet.tableInstance?.changeCellValue(
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
    if (formulaInput && this.activeWorkSheet) {
      const selection = this.activeWorkSheet.getSelection();
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
              sheet: this.activeWorkSheet.getKey(),
              row: selection.startRow,
              col: selection.startCol
            },
            value
          );

          // 获取计算结果
          const result = this.formulaManager.getCellValue({
            sheet: this.activeWorkSheet.getKey(),
            row: selection.startRow,
            col: selection.startCol
          });

          this.activeWorkSheet.setCellValue(selection.startRow, selection.startCol, result.value);
        } catch (error) {
          console.warn('Formula confirmation error:', error);
          // 显示错误状态
          this.activeWorkSheet.setCellValue(selection.startRow, selection.startCol, '#ERROR!');
        }
      } else {
        this.activeWorkSheet.setCellValue(selection.startRow, selection.startCol, value);
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
    const sheet = new WorkSheet({
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
      customMergeCell: sheetDefine.cellMerge,
      theme: sheetDefine.theme?.tableTheme || this.options.theme?.tableTheme
    } as any);

    // 注册事件
    sheet.on('cell-selected', this.handleCellSelected.bind(this));
    sheet.on('cell-value-changed', this.handleCellValueChanged.bind(this));
    sheet.on('selection-changed', this.handleSelectionChangedForRangeMode.bind(this));
    sheet.on('drag_select_end', this.handleSelectionChangedForRangeMode.bind(this));

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
   * 恢复筛选状态
   */
  private restoreFilterState(sheet: WorkSheet, sheetDefine: ISheetDefine): void {
    // 如果没有保存的筛选状态，直接返回
    if (!sheetDefine.filterState) {
      return;
    }

    console.log(`恢复 Sheet ${sheetDefine.sheetKey} 的筛选状态:`, sheetDefine.filterState);

    // 等待表格初始化完成
    setTimeout(() => {
      if (sheet.tableInstance && sheet.tableInstance.pluginManager) {
        const filterPlugin = sheet.tableInstance.pluginManager.getPluginByName('Filter') as any;
        if (filterPlugin) {
          filterPlugin.setFilterState(sheetDefine.filterState);
          console.log(`Sheet ${sheetDefine.sheetKey} 筛选状态恢复完成`);
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
   * 处理单元格选中事件
   */
  private handleCellSelected(): void {
    const formulaInput = this.formulaBarElement?.querySelector('.vtable-sheet-formula-input') as HTMLInputElement;
    // 若处于函数参数模式，拖拽过程中会频繁触发 cell-selected，这里直接忽略，等待 selection-end 统一写入
    if (formulaInput && this.ensureFunctionParamModeFromInput(formulaInput)) {
      // 如果公式栏没有焦点，说明用户想要退出公式编辑，显示新单元格的值
      if (document.activeElement !== formulaInput) {
        this.formulaRangeSelector.reset();
        this.updateFormulaBar();
      }
      return;
    }

    // 重置公式栏显示标志，让公式栏显示选中单元格的值
    this.isFormulaBarShowingResult = false;
    this.updateFormulaBar();
  }

  /**
   * 根据当前公式输入框内容，判定/进入函数参数模式
   */
  private ensureFunctionParamModeFromInput(formulaInput: HTMLInputElement): boolean {
    const value = formulaInput.value || '';
    const cursor =
      typeof formulaInput.selectionStart === 'number' ? (formulaInput.selectionStart as number) : value.length;
    return this.formulaRangeSelector?.detectFunctionParameterPosition(value, cursor) === true;
  }

  /**
   * 处理范围选择模式下的单元格选中事件
   */
  private handleSelectionChangedForRangeMode(event: any): void {
    if (!this.activeWorkSheet) {
      return;
    }

    const formulaInput = this.formulaBarElement?.querySelector('.vtable-sheet-formula-input') as HTMLInputElement;
    if (!formulaInput) {
      return;
    }

    // 不依赖 event.type 字符串，selection-end 已在上层绑定，这里直接处理

    const inParamMode = this.ensureFunctionParamModeFromInput(formulaInput);

    if (!inParamMode) {
      return;
    }

    if (document.activeElement !== formulaInput) {
      formulaInput.focus();
    }

    // 获取所有选择范围（支持Ctrl/Cmd多选）
    const selections = this.activeWorkSheet.getMultipleSelections();

    if (!selections || selections.length === 0) {
      return;
    }

    // 排除当前编辑单元格，避免形成自引用导致 #CYCLE!
    const editCell = this.activeWorkSheet.getSelection();
    const safeSelections = selections
      .map(selection => this.excludeEditCellFromSelection(selection, editCell?.startRow || 0, editCell?.startCol || 0))
      .filter(selection => selection.startRow >= 0 && selection.startCol >= 0); // 过滤掉无效选择

    if (safeSelections.length === 0) {
      return; // 如果没有有效的选择，直接返回
    }

    this.formulaRangeSelector.handleSelectionChanged(safeSelections, formulaInput, (row: number, col: number) =>
      this.activeWorkSheet!.addressFromCoord(row, col)
    );

    // 写入后不再刷新公式栏，以免覆盖刚插入的引用
  }

  /**
   * 更新公式栏
   */
  private updateFormulaBar(): void {
    if (!this.formulaBarElement) {
      return;
    }

    // 清除单元格地址和公式输入框
    const clearFormula = () => {
      const cellAddressBox = this.formulaBarElement?.querySelector('.vtable-sheet-cell-address');
      if (cellAddressBox) {
        cellAddressBox.textContent = '';
      }

      const formulaInput = this.formulaBarElement?.querySelector('.vtable-sheet-formula-input') as HTMLInputElement;
      if (formulaInput) {
        formulaInput.value = '';
      }
    };

    // 如果没有活动的sheet或者没有选中的单元格，则清空公式栏
    if (!this.activeWorkSheet) {
      clearFormula();
      return;
    }

    const selection = this.activeWorkSheet.getSelection();
    if (!selection) {
      clearFormula();
      return;
    }

    try {
      // 边界检查
      const rowCount = this.activeWorkSheet.getRowCount();
      const colCount = this.activeWorkSheet.getColumnCount();

      if (
        selection.startRow < 0 ||
        selection.startRow >= rowCount ||
        selection.startCol < 0 ||
        selection.startCol >= colCount
      ) {
        clearFormula();
        return;
      }

      // 更新单元格地址
      const cellAddressBox = this.formulaBarElement.querySelector('.vtable-sheet-cell-address');
      if (cellAddressBox) {
        cellAddressBox.textContent = this.activeWorkSheet.addressFromCoord(selection.startRow, selection.startCol);
      }

      // 更新公式输入框
      const formulaInput = this.formulaBarElement.querySelector('.vtable-sheet-formula-input') as HTMLInputElement;
      if (formulaInput) {
        // 检查是否在函数参数模式下，如果是则不覆盖公式输入框内容
        const inParamMode = this.ensureFunctionParamModeFromInput(formulaInput);
        if (inParamMode) {
          return;
        }

        // 如果公式栏正在显示计算结果，不覆盖内容
        if (this.isFormulaBarShowingResult) {
          return;
        }

        try {
          const formula = this.formulaManager.getCellFormula({
            sheet: this.activeWorkSheet.getKey(),
            row: selection.startRow,
            col: selection.startCol
          });

          if (formula) {
            const displayFormula = formula.startsWith('=') ? formula : '=' + formula;
            formulaInput.value = displayFormula;
          } else {
            const cellValue = this.activeWorkSheet.getCellValue(selection.startRow, selection.startCol);
            formulaInput.value = cellValue !== undefined && cellValue !== null ? String(cellValue) : '';
          }
        } catch (e) {
          console.warn('Error updating formula input:', e);
          formulaInput.value = '';
        }
      }
    } catch (e) {
      console.error('Error in updateFormulaBar:', e);
      clearFormula();
    }
  }

  /**
   * 处理公式输入
   * @param event 事件
   */
  private handleFormulaInput(event: Event): void {
    if (!this.activeWorkSheet) {
      return;
    }

    // 如果是公式插入事件，不进行公式计算
    if ((event as any).isFormulaInsertion) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const selection = this.activeWorkSheet.getSelection();
    if (!selection) {
      return;
    }

    const value = input.value;
    const cursorPosition = input.selectionStart || 0;

    // 检测函数参数位置
    this.formulaRangeSelector.detectFunctionParameterPosition(value, cursorPosition);

    // 如果是公式，高亮引用的单元格
    if (value.startsWith('=')) {
      this.cellHighlightManager.highlightFormulaCells(value);
      // 开始新的公式输入，重置标志
      this.isFormulaBarShowingResult = false;
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
    if (!this.activeWorkSheet) {
      return;
    }

    const input = event.target as HTMLInputElement;

    if (event.key === 'Enter') {
      const selection = this.activeWorkSheet.getSelection();
      if (!selection) {
        return;
      }

      const value = input.value;

      if (value.startsWith('=') && value.length > 1) {
        try {
          // 检查是否包含循环引用
          const currentCellAddress = this.activeWorkSheet.addressFromCoord(selection.startRow, selection.startCol);
          if (value.includes(currentCellAddress)) {
            console.warn('Circular reference detected:', value, 'contains', currentCellAddress);
            this.activeWorkSheet.setCellValue(selection.startRow, selection.startCol, '#CYCLE!');
            this.isUpdatingFromFormula = true;
            this.activeWorkSheet.tableInstance?.changeCellValue(selection.startCol, selection.startRow, '#CYCLE!');
            this.isUpdatingFromFormula = false;
            input.value = '';
            input.blur();
            return;
          }

          // 设置公式内容
          this.formulaManager.setCellContent(
            {
              sheet: this.activeWorkSheet.getKey(),
              row: selection.startRow,
              col: selection.startCol
            },
            value
          );

          // 计算结果并仅写入结果展示（不写入公式文本到单元格显示）
          const result = this.formulaManager.getCellValue({
            sheet: this.activeWorkSheet.getKey(),
            row: selection.startRow,
            col: selection.startCol
          });

          this.isUpdatingFromFormula = true;
          this.activeWorkSheet.tableInstance?.changeCellValue(
            selection.startCol,
            selection.startRow,
            result.error ? '#ERROR!' : result.value
          );
          this.isUpdatingFromFormula = false;

          // 在公式栏中显示计算结果
          input.value = result.error ? '#ERROR!' : String(result.value);
          this.isFormulaBarShowingResult = true;
          input.blur();
        } catch (error) {
          this.isUpdatingFromFormula = false;
          console.warn('Formula evaluation error:', error);
          // 显示错误状态
          this.activeWorkSheet.setCellValue(selection.startRow, selection.startCol, '#ERROR!');
          this.isUpdatingFromFormula = true;
          this.activeWorkSheet.tableInstance?.changeCellValue(selection.startCol, selection.startRow, '#ERROR!');
          this.isUpdatingFromFormula = false;
        }
      } else {
        // 普通值，直接设置
        this.activeWorkSheet.setCellValue(selection.startRow, selection.startCol, value);
        this.isUpdatingFromFormula = true;
        this.activeWorkSheet.tableInstance?.changeCellValue(selection.startCol, selection.startRow, value);
        this.isUpdatingFromFormula = false;
      }

      // 不自动移动到下一行，保持当前位置
      this.isEnterKeyPressed = true;

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
    if (!this.activeWorkSheet || this.isUpdatingFromFormula) {
      return;
    }

    try {
      // 检查新输入的值是否为公式
      const newValue = event.newValue;
      if (typeof newValue === 'string' && newValue.startsWith('=') && newValue.length > 1) {
        try {
          // 检查是否包含循环引用
          const currentCellAddress = this.activeWorkSheet.addressFromCoord(event.row, event.col);
          if (newValue.includes(currentCellAddress)) {
            console.warn('Circular reference detected:', newValue, 'contains', currentCellAddress);
            this.isUpdatingFromFormula = true;
            this.activeWorkSheet.tableInstance?.changeCellValue(event.col, event.row, '#CYCLE!');
            this.isUpdatingFromFormula = false;
            return;
          }

          // 首先设置公式内容
          this.formulaManager.setCellContent(
            {
              sheet: this.activeWorkSheet.getKey(),
              row: event.row,
              col: event.col
            },
            newValue
          );

          // 获取计算结果
          const result = this.formulaManager.getCellValue({
            sheet: this.activeWorkSheet.getKey(),
            row: event.row,
            col: event.col
          });

          // 检查当前单元格是否正在编辑（是否在公式栏中编辑）
          const formulaInput = this.formulaBarElement?.querySelector('.vtable-sheet-formula-input') as HTMLInputElement;
          const isEditing = document.activeElement === formulaInput;

          // 更新单元格显示 - 如果正在编辑则显示公式，否则显示计算结果
          this.isUpdatingFromFormula = true;
          this.activeWorkSheet.tableInstance?.changeCellValue(
            event.col,
            event.row,
            isEditing ? newValue : result.value
          );
          this.isUpdatingFromFormula = false;
        } catch (error) {
          this.isUpdatingFromFormula = false;
          console.warn('Formula processing error:', error);
          // 显示错误状态
          this.isUpdatingFromFormula = true;
          this.activeWorkSheet.tableInstance?.changeCellValue(event.col, event.row, '#ERROR!');
          this.isUpdatingFromFormula = false;
        }
      } else {
        // 非公式值，同步到HyperFormula
        this.formulaManager.setCellContent(
          {
            sheet: this.activeWorkSheet.getKey(),
            row: event.row,
            col: event.col
          },
          newValue
        );
      }

      // 使用FormulaThrottle来优化公式重新计算
      const formulaThrottle = FormulaThrottle.getInstance();
      // 判断是否需要立即更新
      const needImmediateUpdate = this.hasFormulaDependents({
        sheet: this.activeWorkSheet.getKey(),
        row: event.row,
        col: event.col
      });
      if (needImmediateUpdate) {
        // 更新依赖的公式
        const dependents = this.formulaManager.getCellDependents({
          sheet: this.activeWorkSheet.getKey(),
          row: event.row,
          col: event.col
        });

        // 重新计算依赖该单元格的所有公式
        dependents.forEach(dependent => {
          const result = this.formulaManager.getCellValue(dependent);
          this.isUpdatingFromFormula = true;
          if (this.activeWorkSheet) {
            this.activeWorkSheet.setCellValue(dependent.row, dependent.col, result.value);
          }
          this.isUpdatingFromFormula = false;
        });
        // 立即执行完整重新计算
        formulaThrottle.immediateRebuildAndRecalculate(this.formulaManager);
      } else {
        // 使用节流方式进行公式计算
        formulaThrottle.throttledRebuildAndRecalculate(this.formulaManager);
      }

      // 如果当前编辑的单元格就是选中的单元格，更新 fx 输入框
      const selection = this.activeWorkSheet.getSelection();
      if (selection && selection.startRow === event.row && selection.startCol === event.col) {
        this.updateFormulaBar();
      }
    } catch (error) {
      console.error('Error in handleCellValueChanged:', error);
    }
  }

  /**
   * 检查单元格是否有公式依赖
   * @param cell 单元格
   * @returns 是否有公式依赖
   */
  private hasFormulaDependents(cell: FormulaCell): boolean {
    try {
      const dependents = this.formulaManager.getCellDependents(cell);
      return dependents.length > 0;
    } catch (error) {
      console.warn('Error checking formula dependents:', error);
      return false;
    }
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

        sheets.push({
          ...sheetDefine,
          data,
          columns,
          cellMerge: instance.tableInstance.options.customMergeCell as TYPES.CustomMergeCellArray,
          showHeader: instance.tableInstance.options.showHeader,
          frozenRowCount: instance.tableInstance.frozenRowCount,
          frozenColCount: instance.tableInstance.frozenColCount,
          active: sheetDefine.sheetKey === this.sheetManager.getActiveSheet().sheetKey,
          filterState: filterState
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
    if (this.cellHighlightManager) {
      this.cellHighlightManager.release();
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
    const containerWidth = this.getContainer().clientWidth;
    const containerHeight = this.getContainer().clientHeight;
    this.rootElement.style.width = `${this.getOptions().width || containerWidth}px`;
    this.rootElement.style.height = `${this.getOptions().height || containerHeight}px`;
    this.getActiveSheet()?.resize();
  }

  /**
   * 若所选范围包含当前正在编辑的单元格，自动排除该单元格以避免 #CYCLE!
   */
  private excludeEditCellFromSelection(
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
