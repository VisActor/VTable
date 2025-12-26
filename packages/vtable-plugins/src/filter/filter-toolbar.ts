import { TABLE_EVENT_TYPE, type ListTable, type PivotTable } from '@visactor/vtable';
import type { FilterStateManager } from './filter-state-manager';
import { ValueFilter } from './value-filter';
import { ConditionFilter } from './condition-filter';
import { applyStyles, filterStyles } from './styles';
import type { FilterMode, FilterOptions, FilterStyles } from './types';

/**
 * 筛选工具栏，管理按值和按条件筛选组件
 */
export class FilterToolbar {
  table: ListTable | PivotTable;
  filterStateManager: FilterStateManager;
  pluginOptions: FilterOptions;
  valueFilter: ValueFilter | null = null;
  conditionFilter: ConditionFilter | null = null;
  activeTab: 'byValue' | 'byCondition' = 'byValue';
  isVisible: boolean = false;
  selectedField: string | number | null = null;
  filterModes: FilterMode[] = [];

  private filterMenu: HTMLElement;
  private filterTabsContainer: HTMLElement;
  private filterMenuWidth: number;
  private currentCol?: number | null;
  private currentRow?: number | null;
  private filterTabByValue: HTMLButtonElement;
  private filterTabByCondition: HTMLButtonElement;
  private footerContainer: HTMLElement;
  private clearFilterOptionLink: HTMLAnchorElement;
  private cancelFilterButton: HTMLButtonElement;
  private applyFilterButton: HTMLButtonElement;

  constructor(table: ListTable | PivotTable, filterStateManager: FilterStateManager, pluginOptions: FilterOptions) {
    this.table = table;
    this.filterStateManager = filterStateManager;
    this.valueFilter = new ValueFilter(this.table, this.filterStateManager, pluginOptions);
    this.conditionFilter = new ConditionFilter(this.table, this.filterStateManager, pluginOptions, this.hide);
    this.pluginOptions = pluginOptions;

    this.filterMenuWidth = 300; // 待优化，可能需要自适应内容的宽度

    // 监听筛选状态变化，更新清除筛选按钮状态
    this.filterStateManager.subscribe(state => {
      if (this.isVisible && this.selectedField !== null) {
        this.updateClearFilterButtonState(this.selectedField);
      }
    });
  }

  private onTabSwitch(tab: 'byValue' | 'byCondition'): void {
    this.activeTab = tab;
    if (tab === 'byValue') {
      this.valueFilter.show();
      this.conditionFilter.hide();
    } else {
      this.conditionFilter.show();
      this.valueFilter.hide();
    }

    const isValueTab = tab === 'byValue';
    applyStyles(this.filterTabByValue, filterStyles.tabStyle(isValueTab));
    applyStyles(this.filterTabByCondition, filterStyles.tabStyle(!isValueTab));
  }

  private updateSelectedField(field: string | number): void {
    this.selectedField = field;
    // 通知筛选组件更新选中字段
    if (this.valueFilter) {
      this.valueFilter.setSelectedField(field);
    }
    if (this.conditionFilter) {
      this.conditionFilter.setSelectedField(field);
    }
  }

  private applyFilter(field: string | number): void {
    if (this.activeTab === 'byValue') {
      this.valueFilter.applyFilter(field);
    } else if (this.activeTab === 'byCondition') {
      this.conditionFilter.applyFilter(field);
    }
    this.hide();
  }

  private clearFilter(field: string | number): void {
    if (this.valueFilter) {
      this.valueFilter.clearFilter(field);
    }
    if (this.conditionFilter) {
      this.conditionFilter.clearFilter(field);
    }
    this.hide();
  }

  /**
   * 更新清除筛选按钮的状态
   */
  private updateClearFilterButtonState(field: string | number): void {
    const currentFilter = this.filterStateManager.getFilterState(field);
    const hasActiveFilter = currentFilter && currentFilter.enable;

    this.clearFilterOptionLink.style.display = 'inline';
    this.clearFilterOptionLink.style.opacity = hasActiveFilter ? '1' : '0.5';
    this.clearFilterOptionLink.style.pointerEvents = hasActiveFilter ? 'auto' : 'none';
    this.clearFilterOptionLink.style.cursor = hasActiveFilter ? 'pointer' : 'not-allowed';
  }

  render(container: HTMLElement): void {
    const filterStyles = this.pluginOptions.styles || {};
    // === 主容器 ===
    this.filterMenu = document.createElement('div');
    this.filterMenu.classList.add('vtable-filter-menu');
    applyStyles(this.filterMenu, filterStyles.filterMenu);
    this.filterMenu.style.width = `${this.filterMenuWidth}px`;

    // === 筛选 Tab ===
    this.filterTabsContainer = document.createElement('div');
    applyStyles(this.filterTabsContainer, filterStyles.tabsContainer);

    this.filterTabByValue = document.createElement('button');
    this.filterTabByValue.innerText = '按值筛选';
    applyStyles(this.filterTabByValue, filterStyles.tabStyle(true));

    this.filterTabByCondition = document.createElement('button');
    this.filterTabByCondition.innerText = '按条件筛选';
    applyStyles(this.filterTabByCondition, filterStyles.tabStyle(false));

    this.filterTabsContainer.append(this.filterTabByValue, this.filterTabByCondition);

    // === 页脚（清除、取消、确定 筛选按钮） ===
    this.footerContainer = document.createElement('div');
    applyStyles(this.footerContainer, filterStyles.footerContainer);

    this.clearFilterOptionLink = document.createElement('a');
    this.clearFilterOptionLink.href = '#';
    this.clearFilterOptionLink.innerText = '清除筛选';
    applyStyles(this.clearFilterOptionLink, filterStyles.clearLink);

    const footerButtons = document.createElement('div');
    this.cancelFilterButton = document.createElement('button');
    this.cancelFilterButton.innerText = '取消';
    applyStyles(this.cancelFilterButton, filterStyles.footerButton(false));

    this.applyFilterButton = document.createElement('button');
    this.applyFilterButton.innerText = '确认';
    applyStyles(this.applyFilterButton, filterStyles.footerButton(true));

    footerButtons.append(this.cancelFilterButton, this.applyFilterButton);
    this.footerContainer.append(this.clearFilterOptionLink, footerButtons);

    // --- 筛选器头部 Tab ---
    this.filterMenu.append(this.filterTabsContainer);

    // --- 筛选器内容 ---
    this.valueFilter.render(this.filterMenu);
    this.conditionFilter.render(this.filterMenu);

    // --- 筛选器页脚 ---
    this.filterMenu.append(this.footerContainer);

    container.appendChild(this.filterMenu); // 将筛选器添加到 DOM 中
    this.attachEventListeners();
  }

  updateStyles(styles: FilterStyles) {
    const realDisplay = (this.filterMenu.style.display ?? styles.filterMenu.display) || 'none';
    applyStyles(this.filterMenu, { ...styles.filterMenu, display: realDisplay });
    applyStyles(this.filterTabsContainer, styles.tabsContainer);
    applyStyles(this.filterTabByValue, styles.tabStyle(true));
    applyStyles(this.footerContainer, styles.footerContainer);
    applyStyles(this.clearFilterOptionLink, styles.clearLink);
    applyStyles(this.cancelFilterButton, styles.footerButton(false));
    applyStyles(this.applyFilterButton, styles.footerButton(true));
    this.valueFilter.updateStyles(styles);
    this.conditionFilter.updateStyles(styles);
    // 面板处于显示状态, 更新了样式, 则需要手动控制tab显隐
    // 面板显示按值筛选或按条件筛选
    const currentFilter = this.filterStateManager.getFilterState(this.selectedField);
    if (currentFilter && currentFilter.type === 'byCondition') {
      this.onTabSwitch('byCondition');
    } else {
      this.onTabSwitch('byValue');
    }
  }

  attachEventListeners() {
    // 按值筛选/按条件筛选的事件监听
    this.filterTabByValue.addEventListener('click', () => {
      this.onTabSwitch('byValue');
    });

    this.filterTabByCondition.addEventListener('click', () => {
      this.onTabSwitch('byCondition');
    });

    this.cancelFilterButton.addEventListener('click', () => this.hide());

    this.clearFilterOptionLink.addEventListener('click', e => {
      e.preventDefault();
      this.clearFilter(this.selectedField);
    });

    this.applyFilterButton.addEventListener('click', () => {
      this.applyFilter(this.selectedField);
    });

    // 点击空白处整个筛选菜单可消失
    document.addEventListener('click', () => {
      if (this.isVisible) {
        this.hide();
      }
    });

    this.filterMenu.addEventListener('click', e => {
      e.stopPropagation();
    });
  }

  adjustMenuPosition(
    col?: number | null,
    row?: number | null,
    providedLeft?: number | null,
    providedTop?: number | null
  ) {
    if (typeof providedLeft === 'number' && typeof providedTop === 'number') {
      this.filterMenu.style.display = this.isVisible ? 'block' : 'none';
      this.filterMenu.style.left = `${providedLeft}px`;
      this.filterMenu.style.top = `${providedTop}px`;
      return;
    }

    // 明晰的参数 > 记忆的数字
    const effectiveCol = typeof col === 'number' ? col : this.currentCol;
    const effectiveRow = typeof row === 'number' ? row : this.currentRow;

    if (typeof effectiveCol !== 'number' || typeof effectiveRow !== 'number') {
      return;
    }

    this.currentCol = effectiveCol;
    this.currentRow = effectiveRow;

    let left: number = 0;
    let top: number = 0;

    const canvasBounds = this.table.canvas.getBoundingClientRect();
    const cell = this.table.getCellRelativeRect(effectiveCol, effectiveRow);

    const filterMenuWidth = this.filterMenuWidth;
    // 最高高度预估值
    // TODO: 需要获取精确高度
    const filterMenuHeight = 380;

    if (cell.right < this.filterMenuWidth) {
      // 无法把筛选菜单完整地显示在左侧，那么显示在右侧
      left = cell.left + canvasBounds.left;
      top = cell.bottom + canvasBounds.top;
    } else {
      // 筛选菜单默认显示在左侧
      left = cell.right + canvasBounds.left - this.filterMenuWidth;
      top = cell.bottom + canvasBounds.top;
    }

    // 确保筛选菜单不会超出窗口边界
    left = Math.max(0, Math.min(window.innerWidth - filterMenuWidth, left));
    top = Math.max(0, Math.min(window.innerHeight - filterMenuHeight, top));

    this.filterMenu.style.display = this.isVisible ? 'block' : 'none';
    this.filterMenu.style.left = `${left}px`;
    this.filterMenu.style.top = `${top}px`;
  }

  show(col: number, row: number, filterModes: FilterMode[]): void {
    this.valueFilter.clearSearchInputValue();
    this.filterModes = filterModes;
    if (!this.filterModes.includes('byValue')) {
      this.filterTabByValue.style.display = 'none';
      this.onTabSwitch('byCondition');
    } else if (!this.filterModes.includes('byCondition')) {
      this.filterTabByCondition.style.display = 'none';
      this.onTabSwitch('byValue');
    }

    this.adjustMenuPosition(col, row);
    this.filterMenu.style.display = 'block';

    const field = this.table.internalProps.layoutMap.getHeaderField(col, row) as string | number;
    this.updateSelectedField(field);

    // 根据当前筛选配置自动选择正确的筛选标签页
    const currentFilter = this.filterStateManager.getFilterState(field);
    if (currentFilter && currentFilter.type === 'byCondition') {
      this.onTabSwitch('byCondition');
    } else {
      this.onTabSwitch('byValue');
    }

    // 更新清除筛选按钮状态
    this.updateClearFilterButtonState(field);

    // 确保在事件冒泡完成后才设置 isVisible 为 true
    setTimeout(() => {
      this.isVisible = true;
      this.table.fireListeners(TABLE_EVENT_TYPE.FILTER_MENU_SHOW, {
        col: col,
        row: row
      });
    }, 0);
  }

  hide = (currentCol?: number, currentRow?: number): void => {
    this.filterMenu.style.display = 'none';
    this.isVisible = false;
    this.table.fireListeners(TABLE_EVENT_TYPE.FILTER_MENU_HIDE, {
      col: currentCol ?? this.currentCol,
      row: currentRow ?? this.currentRow
    });
  };

  destroy() {
    this.valueFilter.destroy();
    this.filterMenu.remove();
  }
}
