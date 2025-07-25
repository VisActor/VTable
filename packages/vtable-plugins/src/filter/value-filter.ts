import * as VTable from '@visactor/vtable';
import { arrayEqual } from '@visactor/vutils';
import type { FilterConfig, ValueFilterOptionDom, FilterState } from './types';
import { FilterActionType } from './types';
import type { FilterStateManager } from './filter-state-manager';
import { applyStyles, filterStyles } from './styles';

export class ValueFilter {
  private table: VTable.ListTable | VTable.PivotTable;
  private filterStateManager: FilterStateManager;
  private uniqueKeys: Map<string, { value: any; count: number }[]> = new Map();
  private selectedField: string;
  private isVisible: boolean = false; // TODO，待处理状态与 UI 更新逻辑耦合的问题

  private valueFilterOptionList: Map<string, ValueFilterOptionDom[]> = new Map();
  private filterByValuePanel: HTMLElement;
  private filterByValueSearchInput: HTMLInputElement;
  private selectAllCheckbox: HTMLInputElement;
  private filterItemsContainer: HTMLElement;

  constructor(table: VTable.ListTable | VTable.PivotTable, filterStateManager: FilterStateManager) {
    this.table = table;
    this.filterStateManager = filterStateManager;

    this.filterStateManager.subscribe((state: FilterState) => {
      const filterState = state.filters.get(this.selectedField);
      if (filterState && filterState.type === 'byValue') {
        this.updateUI(filterState);
      }
    });
  }

  private updateUI(filterState: FilterConfig): void {
    this.syncCheckboxesWithFilterState(filterState);
    this.syncSelectAllWithFilterState(filterState);
  }

  setSelectedField(fieldId: string): void {
    this.selectedField = fieldId;
    const state: FilterConfig = this.filterStateManager.getState().filters.get(fieldId);
    if (!state || !state.enable) {
      // 除了已经筛选的列，其他情况都重新收集
      this.collectUniqueColumnValues(fieldId);
    }
  }

  collectUniqueColumnValues(fieldId: string): void {
    const records = this.table.internalProps.dataSource.source;
    const aggregator = new VTable.TYPES.CustomAggregator({
      key: fieldId,
      field: fieldId,
      aggregationFun: (values: any[]) => {
        const map = new Map<string | number, number>();
        values.forEach(v => {
          if (v !== undefined && v !== null) {
            map.set(v, (map.get(v) || 0) + 1);
          }
        });

        return Array.from(map.entries()).map(([value, count]) => ({ value, count }));
      }
    });

    const recordsArray = Array.isArray(records) ? records : []; // TODO: 待优化，需要进一步考察
    recordsArray.forEach(record => aggregator.push(record));

    this.uniqueKeys.set(fieldId, aggregator.value());
  }

  private onValueSelect(fieldId: string, value: any, selected: boolean): void {
    const state = this.filterStateManager.getState();
    const filter = state.filters.get(fieldId);
    if (!filter) {
      this.filterStateManager.dispatch({
        type: FilterActionType.ADD_FILTER,
        payload: {
          id: fieldId,
          field: fieldId,
          type: 'byValue',
          values: [value]
        }
      });
    } else {
      const updatedValues = selected
        ? [...(filter.values || []), value]
        : (filter.values || []).filter(v => v !== value);
      this.filterStateManager.dispatch({
        type: FilterActionType.UPDATE_FILTER,
        payload: {
          id: fieldId,
          values: updatedValues
        }
      });
    }
  }

  private toggleSelectAll(fieldId: string, selected: boolean): void {
    const state = this.filterStateManager.getState();
    const filter = state.filters.get(fieldId);
    const valuesToUpdate = selected ? this.uniqueKeys.get(fieldId)?.map(item => item.value) || [] : [];
    if (!filter) {
      this.filterStateManager.dispatch({
        type: FilterActionType.ADD_FILTER,
        payload: {
          id: fieldId,
          field: fieldId,
          type: 'byValue',
          values: valuesToUpdate,
          enable: true
        }
      });
    } else {
      const updatedValues = selected ? valuesToUpdate : [];
      this.filterStateManager.dispatch({
        type: FilterActionType.UPDATE_FILTER,
        payload: {
          id: fieldId,
          values: updatedValues
        }
      });
    }
  }

  private onSearch(fieldId: string, value: string): void {
    const filterKeywords = value
      .toUpperCase()
      .split(' ')
      .filter(s => s);
    const items = this.valueFilterOptionList.get(fieldId);

    for (const item of items) {
      const txtValue = item.id.toUpperCase() || '';
      const match = filterKeywords.some(keyword => txtValue.includes(keyword));
      item.itemContainer.style.display = filterKeywords.length === 0 || match ? 'flex' : 'none';
    }
  }

  /**
   * 根据当前表格中的数据，更新 filter 的被选状态 selectedKeys
   */
  private initFilterStateFromTableData(fieldId: string): void {
    const filter = this.filterStateManager.getState().filters.get(fieldId);
    const records = this.table.internalProps.dataSource.source as any[]; // TODO: 需要进一步调查
    const selectedKeys = new Set();
    records.forEach(record => {
      const value = record[fieldId];
      if (value !== undefined && value !== null) {
        selectedKeys.add(value);
      }
    });
    const hasChanged = !filter || !arrayEqual(filter.values, Array.from(selectedKeys));
    if (!hasChanged) {
      return;
    }
    if (filter) {
      this.filterStateManager.dispatch({
        type: FilterActionType.UPDATE_FILTER,
        payload: {
          id: fieldId,
          field: fieldId,
          type: 'byValue',
          values: Array.from(selectedKeys)
        }
      });
    } else {
      this.filterStateManager.dispatch({
        type: FilterActionType.ADD_FILTER,
        payload: {
          id: fieldId,
          field: fieldId,
          type: 'byValue',
          values: Array.from(selectedKeys)
        }
      });
    }
  }

  /**
   * 根据 filter 的数据状态，更新 UI
   */
  private syncCheckboxesWithFilterState(filter: FilterConfig): void {
    if (!filter) {
      return;
    }
    const selectedValues = filter.values || [];
    const stringSelectedValues = new Set(selectedValues.map(v => String(v)));
    const optionDomList = this.valueFilterOptionList.get(filter.id);
    optionDomList?.forEach(optionDom => {
      optionDom.checkbox.checked = stringSelectedValues.has(optionDom.id);
      const count = this.uniqueKeys.get(filter.field)?.find(key => String(key.value) === optionDom.id)?.count || 0;
      optionDom.countSpan.textContent = String(count);
      optionDom.itemContainer.style.display = count === 0 ? 'none' : 'flex';
    });
  }

  /**
   * 根据 filter 的数据状态，更新 UI
   */
  private syncSelectAllWithFilterState(filter: FilterConfig): void {
    if (!filter || !filter.values) {
      this.selectAllCheckbox.checked = false;
      this.selectAllCheckbox.indeterminate = false;
      return;
    }

    const uniqueValuesCount = this.uniqueKeys.get(filter.field)?.length || 0;
    if (uniqueValuesCount === 0) {
      this.selectAllCheckbox.checked = false;
      this.selectAllCheckbox.indeterminate = false;
    } else if (filter.values.length === 0) {
      // 没有选中任何值
      this.selectAllCheckbox.checked = false;
      this.selectAllCheckbox.indeterminate = false;
    } else if (filter.values.length === uniqueValuesCount) {
      // 所有值都被选中
      this.selectAllCheckbox.checked = true;
      this.selectAllCheckbox.indeterminate = false;
    } else {
      // 部分值被选中
      this.selectAllCheckbox.checked = false;
      this.selectAllCheckbox.indeterminate = true;
    }
  }

  applyFilter(fieldId: string = this.selectedField): void {
    const selectedKeys = this.filterStateManager.getState().filters.get(fieldId)?.values || [];
    if (selectedKeys.length > 0 && selectedKeys.length < this.uniqueKeys.get(fieldId)?.length) {
      this.filterStateManager.dispatch({
        type: FilterActionType.APPLY_FILTERS,
        payload: {
          id: fieldId,
          field: fieldId,
          type: 'byValue',
          values: selectedKeys,
          enable: true
        }
      });
    } else {
      this.filterStateManager.dispatch({
        type: FilterActionType.REMOVE_FILTER,
        payload: {
          id: fieldId
        }
      });
    }
  }

  clearFilter(fieldId: string): void {
    this.filterStateManager.dispatch({
      type: FilterActionType.REMOVE_FILTER,
      payload: {
        id: fieldId
      }
    });

    this.hide();
  }

  render(container: HTMLElement): void {
    // === 按值筛选的菜单内容 ===
    this.filterByValuePanel = document.createElement('div');
    applyStyles(this.filterByValuePanel, filterStyles.filterPanel);

    // -- 搜索栏 ---
    const searchContainer = document.createElement('div');
    applyStyles(searchContainer, filterStyles.searchContainer);

    this.filterByValueSearchInput = document.createElement('input');
    this.filterByValueSearchInput.type = 'text';
    this.filterByValueSearchInput.placeholder = '可使用空格分隔多个关键词';
    applyStyles(this.filterByValueSearchInput, filterStyles.searchInput);

    searchContainer.appendChild(this.filterByValueSearchInput);

    // --- 筛选选项 ---
    const optionsContainer = document.createElement('div');
    applyStyles(optionsContainer, filterStyles.optionsContainer);

    const selectAllItemDiv = document.createElement('div');
    applyStyles(selectAllItemDiv, filterStyles.optionItem);

    const selectAllLabel = document.createElement('label');
    applyStyles(selectAllLabel, filterStyles.optionLabel);

    this.selectAllCheckbox = document.createElement('input');
    this.selectAllCheckbox.type = 'checkbox';
    this.selectAllCheckbox.checked = true; // 默认全选
    applyStyles(this.selectAllCheckbox, filterStyles.checkbox);

    selectAllLabel.append(this.selectAllCheckbox, ' 全选');
    selectAllItemDiv.appendChild(selectAllLabel);

    this.filterItemsContainer = document.createElement('div'); // 筛选条目的容器，后续应动态 appendChild

    optionsContainer.append(selectAllItemDiv, this.filterItemsContainer);
    this.filterByValuePanel.append(searchContainer, optionsContainer);

    container.appendChild(this.filterByValuePanel);

    this.bindEventForFilterByValue();
  }

  private renderFilterOptions(field: string): void {
    this.filterItemsContainer.innerHTML = '';
    this.valueFilterOptionList.delete(field);
    this.valueFilterOptionList.set(field, []);

    const selectedValues = this.filterStateManager.getState().filters.get(field)?.values || [];
    const itemDomList: ValueFilterOptionDom[] = [];
    this.uniqueKeys.get(field)?.forEach(({ value, count }) => {
      const itemDiv = document.createElement('div');
      applyStyles(itemDiv, filterStyles.optionItem);

      const label = document.createElement('label');
      applyStyles(label, filterStyles.optionLabel);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = String(value);
      checkbox.checked = selectedValues.includes(value); // TODO: 复杂度需要优化
      applyStyles(checkbox, filterStyles.checkbox);

      const countSpan = document.createElement('span');
      countSpan.textContent = String(count);
      applyStyles(countSpan, filterStyles.countSpan);

      label.append(checkbox, ` ${value}`);
      itemDiv.append(label, countSpan);
      this.filterItemsContainer.appendChild(itemDiv);

      const itemDom: ValueFilterOptionDom = {
        id: String(value), // 因为每个筛选项的值都不同，所以用值作为id
        originalValue: value,
        itemContainer: itemDiv,
        checkbox: checkbox,
        countSpan: countSpan
      };

      itemDomList.push(itemDom);
    });

    this.valueFilterOptionList.set(field, itemDomList);
  }

  bindEventForFilterByValue(): void {
    // 事件委托：搜索框的 keyup 事件
    this.filterByValuePanel.addEventListener('keyup', (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLInputElement) {
        const value = target.value;
        this.onSearch(this.selectedField, value);
      }
    });

    // 事件委托：复选框的 change 事件
    this.filterByValuePanel.addEventListener('change', (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement && target.type === 'checkbox') {
        if (target === this.selectAllCheckbox) {
          this.toggleSelectAll(this.selectedField, this.selectAllCheckbox.checked);
        } else {
          const checkbox = target;
          const checked = checkbox.checked;
          const value = this.valueFilterOptionList
            .get(this.selectedField)
            ?.find(item => item.id === checkbox.value)?.originalValue;
          this.onValueSelect(this.selectedField, value, checked);
        }
      }
    });
  }

  show(): void {
    this.initFilterStateFromTableData(this.selectedField);
    this.renderFilterOptions(this.selectedField);
    this.filterByValuePanel.style.display = 'block';
  }

  hide(): void {
    this.filterByValuePanel.style.display = 'none';
  }
}
