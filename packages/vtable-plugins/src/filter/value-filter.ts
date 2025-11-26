import type { ListTable, PivotTable } from '@visactor/vtable';
import { arrayEqual } from '@visactor/vutils';
import type { FilterConfig, ValueFilterOptionDom, FilterState } from './types';
import { FilterActionType } from './types';
import type { FilterStateManager } from './filter-state-manager';
import { applyStyles, filterStyles } from './styles';

export class ValueFilter {
  private table: ListTable | PivotTable;
  private filterStateManager: FilterStateManager;
  private uniqueKeys = new Map<string | number, Array<{ value: any; count: number; rawValue: any }>>();
  private displayToRawValueMap = new Map<string | number, Map<any, any>>();
  private selectedField: string | number;

  private valueFilterOptionList: Map<string | number, ValueFilterOptionDom[]> = new Map();
  private filterByValuePanel: HTMLElement;
  private filterByValueSearchInput: HTMLInputElement;
  private selectAllCheckbox: HTMLInputElement;
  private filterItemsContainer: HTMLElement;

  constructor(table: ListTable | PivotTable, filterStateManager: FilterStateManager) {
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

  setSelectedField(fieldId: string | number): void {
    this.selectedField = fieldId;
    this.collectUniqueColumnValues(fieldId);
  }

  collectUniqueColumnValues(fieldId: string | number): void {
    const isEnable = this.filterStateManager.getFilterState(fieldId)?.enable;
    const displayValueMap = new Map<any, number>();
    const rawToDisplayMap = new Map<any, any>();
    const displayToRawMap = new Map<any, any>();

    // 找到第一个匹配字段的列位置，用于获取格式化数据
    let targetCol = -1;
    let targetRow = -1;
    for (let col = 0; col < this.table.colCount; col++) {
      for (let row = this.table.columnHeaderLevelCount; row < this.table.rowCount; row++) {
        if (!this.table.internalProps.layoutMap.isHeader(col, row)) {
          const bodyInfo = this.table.internalProps.layoutMap.getBody(col, row);
          if (bodyInfo && bodyInfo.field === fieldId) {
            targetCol = col;
            targetRow = row;
            break;
          }
        }
      }
      if (targetCol !== -1) {
        break;
      }
    }

    if (isEnable) {
      // 如果已应用筛选，则从原始数据收集
      const records = this.table.internalProps.records;
      const recordsLength = records.length;

      for (let i = 0; i < recordsLength; i++) {
        let rawValue;
        let displayValue;
        if (targetCol !== -1) {
          const row = this.table.columnHeaderLevelCount + i;
          const currentRecord = records[i];
          // 获取原始数据
          rawValue = currentRecord[fieldId];
          // 获取格式化显示数据
          const bodyInfo = this.table.internalProps.layoutMap.getBody(targetCol, row);
          if (
            bodyInfo &&
            'fieldFormat' in bodyInfo &&
            bodyInfo.fieldFormat &&
            typeof bodyInfo.fieldFormat === 'function'
          ) {
            // displayValue = bodyInfo.fieldFormat(rawValue, targetCol, row, this.table);
            displayValue = bodyInfo.fieldFormat({ [fieldId]: rawValue });
          } else {
            displayValue = rawValue;
          }
        }

        if (rawValue !== undefined && rawValue !== null) {
          displayValueMap.set(displayValue, (displayValueMap.get(displayValue) || 0) + 1);
          rawToDisplayMap.set(rawValue, displayValue);
          displayToRawMap.set(displayValue, rawValue);
        }
      }
    } else {
      // 如果未筛选，则从当前表格数据收集
      const dataSource = this.table.internalProps.dataSource;
      const currentLength = dataSource.length;

      for (let i = 0; i < currentLength; i++) {
        let rawValue;
        let displayValue;
        if (targetCol !== -1) {
          const row = this.table.columnHeaderLevelCount + i;
          if (row < this.table.rowCount) {
            // 获取原始数据
            rawValue = this.table.getCellOriginValue(targetCol, row);
            // 获取格式化显示数据
            displayValue = this.table.getCellValue(targetCol, row);
          }
        } else {
          rawValue = this.table.getFieldData(
            String(fieldId),
            targetCol !== -1 ? targetCol : 0,
            this.table.columnHeaderLevelCount + i
          );
          displayValue = rawValue; // 如果没有格式化函数，显示值等于原始值
        }

        if (rawValue !== undefined && rawValue !== null) {
          displayValueMap.set(displayValue, (displayValueMap.get(displayValue) || 0) + 1);
          rawToDisplayMap.set(rawValue, displayValue);
          displayToRawMap.set(displayValue, rawValue);
        }
      }
    }

    // 保存显示值到原始值的映射关系
    this.displayToRawValueMap.set(fieldId, displayToRawMap);

    // 转换为所需格式，包含显示值、计数和原始值
    const uniqueValues = Array.from(displayValueMap.entries()).map(([displayValue, count]) => ({
      value: displayValue, // UI显示的格式化值
      count,
      rawValue: displayToRawMap.get(displayValue) // 对应的原始值
    }));

    this.uniqueKeys.set(fieldId, uniqueValues);
  }

  private onValueSelect(fieldId: string | number, displayValue: any, selected: boolean): void {
    // 获取显示值对应的原始值
    const displayToRawMap = this.displayToRawValueMap.get(fieldId);
    const rawValue = displayToRawMap ? displayToRawMap.get(displayValue) : displayValue;

    const filter = this.filterStateManager.getFilterState(fieldId);
    if (!filter) {
      this.filterStateManager.dispatch({
        type: FilterActionType.ADD_FILTER,
        payload: {
          field: fieldId,
          type: 'byValue',
          values: [rawValue] // 使用原始值
        }
      });
    } else {
      const updatedValues = selected
        ? [...(filter.values || []), rawValue] // 使用原始值
        : (filter.values || []).filter(v => v !== rawValue); // 使用原始值进行比较
      this.filterStateManager.dispatch({
        type: FilterActionType.UPDATE_FILTER,
        payload: {
          field: fieldId,
          values: updatedValues
        }
      });
    }
  }

  private toggleSelectAll(fieldId: string | number, selected: boolean): void {
    const filter = this.filterStateManager.getFilterState(fieldId);
    // 获取所有原始值用于全选/取消全选
    const rawValuesToUpdate = selected ? this.uniqueKeys.get(fieldId)?.map(item => item.rawValue) || [] : [];
    if (!filter) {
      this.filterStateManager.dispatch({
        type: FilterActionType.ADD_FILTER,
        payload: {
          field: fieldId,
          type: 'byValue',
          values: rawValuesToUpdate, // 使用原始值
          enable: true
        }
      });
    } else {
      const updatedValues = selected ? rawValuesToUpdate : [];
      this.filterStateManager.dispatch({
        type: FilterActionType.UPDATE_FILTER,
        payload: {
          field: fieldId,
          values: updatedValues // 使用原始值
        }
      });
    }
  }

  private onSearch(fieldId: string | number, value: string): void {
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
  private initFilterStateFromTableData(fieldId: string | number): void {
    const filter = this.filterStateManager.getFilterState(fieldId);
    const selectedRawValues = new Set();
    const displayToRawMap = this.displayToRawValueMap.get(fieldId);

    // 找到第一个匹配字段的列位置，用于获取格式化数据
    let targetCol = -1;
    for (let col = 0; col < this.table.colCount; col++) {
      for (let row = this.table.columnHeaderLevelCount; row < this.table.rowCount; row++) {
        if (!this.table.internalProps.layoutMap.isHeader(col, row)) {
          const bodyInfo = this.table.internalProps.layoutMap.getBody(col, row);
          if (bodyInfo && bodyInfo.field === fieldId) {
            targetCol = col;
            break;
          }
        }
      }
      if (targetCol !== -1) {
        break;
      }
    }

    // 收集当前显示的数据对应的原始值
    const dataSource = this.table.internalProps.dataSource;
    const currentLength = dataSource.length;

    for (let i = 0; i < currentLength; i++) {
      let displayValue;
      let rawValue;
      if (targetCol !== -1) {
        const row = this.table.columnHeaderLevelCount + i;
        if (row < this.table.rowCount) {
          // 获取格式化显示值
          displayValue = this.table.getCellValue(targetCol, row);
          // 通过映射获取对应的原始值
          rawValue = displayToRawMap ? displayToRawMap.get(displayValue) : displayValue;
        }
      } else {
        displayValue = this.table.getFieldData(
          String(fieldId),
          targetCol !== -1 ? targetCol : 0,
          this.table.columnHeaderLevelCount + i
        );
        rawValue = displayToRawMap ? displayToRawMap.get(displayValue) : displayValue;
      }

      if (rawValue !== undefined && rawValue !== null) {
        selectedRawValues.add(rawValue);
      }
    }

    const hasChanged = !filter || !arrayEqual(filter.values, Array.from(selectedRawValues));
    if (!hasChanged) {
      return;
    }
    if (filter) {
      this.filterStateManager.dispatch({
        type: FilterActionType.UPDATE_FILTER,
        payload: {
          field: fieldId,
          type: 'byValue',
          values: Array.from(selectedRawValues) // 使用原始值
        }
      });
    } else {
      this.filterStateManager.dispatch({
        type: FilterActionType.ADD_FILTER,
        payload: {
          field: fieldId,
          type: 'byValue',
          values: Array.from(selectedRawValues) // 使用原始值
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
    const selectedRawValues = filter.values || [];
    const displayToRawMap = this.displayToRawValueMap.get(filter.field);
    const optionDomList = this.valueFilterOptionList.get(filter.field);

    optionDomList?.forEach(optionDom => {
      // optionDom.id 是显示值，需要转换为原始值进行比较
      const displayValue = optionDom.originalValue;
      const rawValue = displayToRawMap ? displayToRawMap.get(displayValue) : displayValue;

      // 检查原始值是否在选中的原始值列表中
      optionDom.checkbox.checked = selectedRawValues.some(v => v === rawValue);

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

  applyFilter(fieldId: string | number = this.selectedField): void {
    const selectedKeys = this.filterStateManager.getFilterState(fieldId)?.values || [];
    if (selectedKeys.length > 0 && selectedKeys.length < this.uniqueKeys.get(fieldId)?.length) {
      this.filterStateManager.dispatch({
        type: FilterActionType.APPLY_FILTERS,
        payload: {
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
          field: fieldId
        }
      });
    }
  }

  clearFilter(fieldId: string | number): void {
    this.filterStateManager.dispatch({
      type: FilterActionType.REMOVE_FILTER,
      payload: {
        field: fieldId
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

  private renderFilterOptions(field: string | number): void {
    this.filterItemsContainer.innerHTML = '';
    this.valueFilterOptionList.delete(field);
    this.valueFilterOptionList.set(field, []);

    const selectedRawValues = this.filterStateManager.getFilterState(field)?.values || [];
    // 为了优化复杂度，将原始值转换为Set进行快速查找
    const selectedRawValueSet = new Set(selectedRawValues);

    const itemDomList: ValueFilterOptionDom[] = [];
    this.uniqueKeys.get(field)?.forEach(({ value, count, rawValue }) => {
      const itemDiv = document.createElement('div');
      applyStyles(itemDiv, filterStyles.optionItem);

      const label = document.createElement('label');
      applyStyles(label, filterStyles.optionLabel);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = String(value); // 显示值作为checkbox的value
      // 使用原始值进行选中状态判断，优化为O(1)复杂度
      checkbox.checked = selectedRawValueSet.has(rawValue);
      applyStyles(checkbox, filterStyles.checkbox);

      const countSpan = document.createElement('span');
      countSpan.textContent = String(count);
      applyStyles(countSpan, filterStyles.countSpan);

      label.append(checkbox, ` ${value}`); // UI显示格式化值
      itemDiv.append(label, countSpan);
      this.filterItemsContainer.appendChild(itemDiv);

      const itemDom: ValueFilterOptionDom = {
        id: String(value), // 显示值作为id，用于UI交互
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
      if (target instanceof HTMLInputElement && target.type === 'text') {
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

  clearSearchInputValue(): void {
    this.filterByValueSearchInput.value = '';
  }
}
