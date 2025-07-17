import type * as VTable from '@visactor/vtable';
import type { FilterStateManager } from './filter-state-manager';
import { ValueFilter } from './value-filter';
import { ConditionFilter } from './condition-filter';
import { applyStyles, filterStyles } from './styles';

/**
 * 筛选工具栏，管理按值和按条件筛选组件
 */
export class FilterToolbar {
  table: VTable.ListTable | VTable.PivotTable;
  filterStateManager: FilterStateManager;
  valueFilter: ValueFilter | null = null;
  conditionFilter: ConditionFilter | null = null;
  activeTab: 'byValue' | 'byCondition' = 'byValue';
  isVisible: boolean = false;
  selectedField: string | null = null;

  private filterMenu: HTMLElement;
  private filterMenuWidth: number;
  private filterTabByValue: HTMLButtonElement;
  private filterTabByCondition: HTMLButtonElement;
  private clearFilterOptionLink: HTMLAnchorElement;
  private cancelFilterButton: HTMLButtonElement;
  private applyFilterButton: HTMLButtonElement;

  constructor(table: VTable.ListTable | VTable.PivotTable, filterStateManager: FilterStateManager) {
    this.table = table;
    this.filterStateManager = filterStateManager;
    this.valueFilter = new ValueFilter(this.table, this.filterStateManager);
    this.conditionFilter = new ConditionFilter(this.table, this.filterStateManager);

    this.filterMenuWidth = 300; // 待优化，可能需要自适应内容的宽度
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

  private updateSelectedField(field: string): void {
    this.selectedField = field;
    // 通知筛选组件更新选中字段
    if (this.valueFilter) {
      this.valueFilter.setSelectedField(field);
    }
    if (this.conditionFilter) {
      this.conditionFilter.setSelectedField(field);
    }
  }

  private applyFilter(field: string): void {
    if (this.activeTab === 'byValue') {
      this.valueFilter.applyFilter(field);
    } else if (this.activeTab === 'byCondition') {
      this.conditionFilter.applyFilter(field);
    }
    this.hide();
  }

  private clearFilter(field: string): void {
    if (this.valueFilter) {
      this.valueFilter.clearFilter(field);
    }
    if (this.conditionFilter) {
      this.conditionFilter.clearFilter(field);
    }
    this.hide();
  }

  render(container: HTMLElement): void {
    // === 主容器 ===
    this.filterMenu = document.createElement('div');
    applyStyles(this.filterMenu, filterStyles.filterMenu);
    this.filterMenu.style.width = `${this.filterMenuWidth}px`;

    // === 筛选 Tab ===
    const filterTabsContainer = document.createElement('div');
    applyStyles(filterTabsContainer, filterStyles.tabsContainer);

    this.filterTabByValue = document.createElement('button');
    this.filterTabByValue.innerText = '按值筛选';
    applyStyles(this.filterTabByValue, filterStyles.tabStyle(true));

    this.filterTabByCondition = document.createElement('button');
    this.filterTabByCondition.innerText = '按条件筛选';
    applyStyles(this.filterTabByCondition, filterStyles.tabStyle(false));

    filterTabsContainer.append(this.filterTabByValue, this.filterTabByCondition);

    // === 页脚（清除、取消、确定 筛选按钮） ===
    const footerContainer = document.createElement('div');
    applyStyles(footerContainer, filterStyles.footerContainer);

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
    footerContainer.append(this.clearFilterOptionLink, footerButtons);

    // --- 筛选器头部 Tab ---
    this.filterMenu.append(filterTabsContainer);

    // --- 筛选器内容 ---
    this.valueFilter.render(this.filterMenu);
    this.conditionFilter.render(this.filterMenu);

    // --- 筛选器页脚 ---
    this.filterMenu.append(footerContainer);

    container.appendChild(this.filterMenu); // 将筛选器添加到 DOM 中
    this.attachEventListeners();
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

    // 点击空白处整个筛选菜单可消失（存在未解决的问题）
    // this.filterMenu.addEventListener('click', e => e.stopPropagation());
    // document.addEventListener('click', () => {this.hideFilterMenu(); console.log("document clicked")});
  }

  show(col: number, row: number): void {
    let left: number = 0;
    let top: number = 0;
    const canvasBounds = this.table.canvas.getBoundingClientRect();
    const cell = this.table.getMergeCellRect(col, row);
    if (cell.right < this.filterMenuWidth) {
      // 无法把筛选菜单完整地显示在左侧，那么显示在右侧
      left = cell.left + canvasBounds.left;
      top = cell.bottom + canvasBounds.top;
    } else {
      // 筛选菜单默认显示在左侧
      left = cell.right + canvasBounds.left - this.filterMenuWidth;
      top = cell.bottom + canvasBounds.top;
    }

    this.filterMenu.style.display = 'block';
    this.filterMenu.style.left = `${left}px`;
    this.filterMenu.style.top = `${top}px`;
    this.isVisible = true;

    const field = this.table.internalProps.layoutMap.getHeaderField(col, row) as string;
    this.updateSelectedField(field);

    // 根据当前筛选配置自动选择正确的筛选标签页
    const currentFilter = this.filterStateManager.getState().filters.get(field);
    if (currentFilter && currentFilter.type === 'byCondition') {
      this.onTabSwitch('byCondition');
    } else {
      this.onTabSwitch('byValue');
    }
  }

  hide(): void {
    this.filterMenu.style.display = 'none';
    this.isVisible = false;
  }
}
