import type { ListTable, PivotTable } from '@visactor/vtable';
import { arrayEqual, isValid } from '@visactor/vutils';
import type { FilterConfig, ValueFilterOptionDom, FilterState, FilterStyles } from './types';
import { FilterActionType } from './types';
import type { FilterStateManager } from './filter-state-manager';
import { applyStyles } from './styles';

export class ValueFilter {
  private table: ListTable | PivotTable;
  private filterStateManager: FilterStateManager;
  private styles: FilterStyles;
  private uniqueKeys = new Map<string | number, Array<{ value: any; count: number; rawValue: any }>>();
  private displayToRawValueMap = new Map<string | number, Map<any, any>>();
  private selectedField: string | number;

  private valueFilterOptionList: Map<string | number, ValueFilterOptionDom[]> = new Map();
  private filterByValuePanel: HTMLElement;
  private filterByValueSearchInput: HTMLInputElement;
  private selectAllCheckbox: HTMLInputElement;
  private filterItemsContainer: HTMLElement;

  constructor(table: ListTable | PivotTable, filterStateManager: FilterStateManager, styles: FilterStyles) {
    this.table = table;
    this.filterStateManager = filterStateManager;
    this.styles = styles;

    this.filterStateManager.subscribe((state: FilterState) => {
      const filterState = state.filters.get(this.selectedField);
      if (filterState && filterState.type === 'byValue') {
        this.updateUI(filterState);
      }
    });
  }

  updateUI(filterState: FilterConfig): void {
    this.syncCheckboxesWithFilterState(filterState);
    this.syncSelectAllWithFilterState(filterState);
  }

  setSelectedField(fieldId: string | number): void {
    this.selectedField = fieldId;
    this.collectUniqueColumnValues(fieldId);
  }

  collectUniqueColumnValues(fieldId: string | number, forceCollect: boolean = false): void {
    // 如果已经收集过，直接返回
    if (this.uniqueKeys.has(fieldId) && !forceCollect) {
      return;
    }

    const displayToRawMap = new Map<any, any>(); // displayValue -> rawValue

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

    // 从原始数据收集候选值（不计数，只收集唯一值）
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
          displayValue = bodyInfo.fieldFormat({ [fieldId]: rawValue });
        } else {
          displayValue = rawValue;
        }
      } else {
        rawValue = records[i][fieldId];
        displayValue = rawValue;
      }

      if (rawValue !== undefined && rawValue !== null && !displayToRawMap.has(displayValue)) {
        displayToRawMap.set(displayValue, rawValue);
        if (this.filterStateManager.getFilterState(fieldId)?.values?.length > 0) {
          this.filterStateManager.getFilterState(fieldId).values.push(rawValue);
        }
      }
    }

    // 保存显示值到原始值的映射关系
    this.displayToRawValueMap.set(fieldId, displayToRawMap);

    // 转换为所需格式，包含显示值、计数和原始值（count = 0 占位，后续会更新）
    const uniqueValues = Array.from(displayToRawMap.entries()).map(([displayValue, rawValue]) => ({
      value: displayValue, // UI显示的格式化值
      count: 0, // 计数占位，后续会根据筛选状态动态计算
      rawValue: rawValue // 对应的原始值
    }));

    this.uniqueKeys.set(fieldId, uniqueValues);
  }

  /**
   * 更新候选值列表的计数（基于当前筛选状态选择数据源）
   * - 未筛选列：使用当前表格数据（dataSource）计算计数
   * - 已筛选列：使用原始数据（records）计算计数
   */
  private updateCandidateCounts(fieldId: string | number): void {
    const uniqueValues = this.uniqueKeys.get(fieldId);
    if (!uniqueValues) {
      return;
    }

    // 判断当前列是否已启用筛选
    const filter = this.filterStateManager.getFilterState(fieldId);
    const isFiltered = filter?.enable;

    // 根据筛选状态选择数据源
    const dataSource = isFiltered
      ? this.table.internalProps.records // 已筛选：使用原始数据
      : this.table.internalProps.dataSource; // 未筛选：使用当前表格数据

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

    // 计算每个候选值的计数
    const dataLength = dataSource.length;
    const countMap = new Map<any, number>();

    for (let i = 0; i < dataLength; i++) {
      let displayValue;
      if (targetCol !== -1) {
        const row = this.table.columnHeaderLevelCount + i;
        if (row < this.table.rowCount) {
          displayValue = this.table.getCellValue(targetCol, row);
        }
      } else {
        displayValue = this.table.getFieldData(
          String(fieldId),
          targetCol !== -1 ? targetCol : 0,
          this.table.columnHeaderLevelCount + i
        );
      }

      if (displayValue !== undefined && displayValue !== null) {
        countMap.set(displayValue, (countMap.get(displayValue) || 0) + 1);
      }
    }

    // 更新计数
    uniqueValues.forEach(item => {
      item.count = countMap.get(item.value) || 0;
    });
  }

  private onValueSelect(fieldId: string | number, displayValue: any, selected: boolean): void {
    // 获取显示值对应的原始值
    const displayToRawMap = this.displayToRawValueMap.get(fieldId);
    const rawValue = displayToRawMap ? displayToRawMap.get(displayValue) : displayValue;

    // 更新筛选状态
    const filter = this.filterStateManager.getFilterState(fieldId);
    let updatedValues: any[];
    if (!filter) {
      updatedValues = selected ? [rawValue] : [];
      this.filterStateManager.dispatch({
        type: FilterActionType.ADD_FILTER,
        payload: {
          field: fieldId,
          type: 'byValue',
          values: updatedValues
        }
      });
    } else {
      updatedValues = selected
        ? [...(filter.values || []), rawValue]
        : (filter.values || []).filter(v => v !== rawValue);
      this.filterStateManager.dispatch({
        type: FilterActionType.UPDATE_FILTER,
        payload: {
          field: fieldId,
          values: updatedValues
        }
      });
    }
  }

  /**
   * 检查值在当前搜索关键词下是否可见
   */
  private isValueVisible(displayValue: any, keyword: string): boolean {
    if (!keyword) {
      return true;
    }

    const filterKeywords = keyword
      .toUpperCase()
      .split(' ')
      .filter(s => s);

    const txtValue = String(displayValue).toUpperCase();
    return filterKeywords.some(keyword => txtValue.includes(keyword));
  }

  private toggleSelectAll(fieldId: string | number, selected: boolean): void {
    // 获取当前可见的值进行全选/取消全选
    const currentKeyword = this.filterStateManager.getCurrentSearchKeyword(fieldId);
    const stableCandidates = this.filterStateManager.getStableCandidateValues(fieldId);
    const displayToRawMap = this.displayToRawValueMap.get(fieldId);

    // 找出当前可见的所有值
    const visibleRawValues = stableCandidates
      .filter(candidate => this.isValueVisible(candidate.value, currentKeyword))
      .map(candidate => (displayToRawMap ? displayToRawMap.get(candidate.value) : candidate.value));

    const filter = this.filterStateManager.getFilterState(fieldId);
    const currentValues = new Set(filter?.values || []);

    let updatedValues: any[];
    if (selected) {
      // 全选：将可见的值添加到当前选中值中
      updatedValues = Array.from(new Set([...currentValues, ...visibleRawValues]));
    } else {
      // 取消全选：从当前选中值中移除可见的值
      updatedValues = Array.from(currentValues).filter(value => !visibleRawValues.includes(value));
    }

    if (!filter) {
      this.filterStateManager.dispatch({
        type: FilterActionType.ADD_FILTER,
        payload: {
          field: fieldId,
          type: 'byValue',
          values: updatedValues,
          enable: true
        }
      });
    } else {
      this.filterStateManager.dispatch({
        type: FilterActionType.UPDATE_FILTER,
        payload: {
          field: fieldId,
          values: updatedValues
        }
      });
    }
  }

  private onSearch(fieldId: string | number, value: string): void {
    // 更新 FilterStateManager 中的搜索关键词
    this.filterStateManager.updateSearchKeyword(fieldId, value);

    // 更新UI显示
    const items = this.valueFilterOptionList.get(fieldId);
    const filterKeywords = value
      .toUpperCase()
      .split(' ')
      .filter(s => s);

    for (const item of items) {
      const txtValue = item.id.toUpperCase() || '';
      const match = filterKeywords.some(keyword => txtValue.includes(keyword));
      const isVisible = filterKeywords.length === 0 || match;

      item.itemContainer.style.display = isVisible ? 'flex' : 'none';
    }
  }

  /**
   * 根据当前表格中的数据，初始化或更新 filter 的被选状态
   * 如果筛选已启用(enable=true)，收集当前显示的数据作为选中项
   * 如果筛选未启用，初始化为所有值都选中
   */
  private initFilterStateFromTableData(fieldId: string | number): void {
    const filter = this.filterStateManager.getFilterState(fieldId);
    const isEnable = filter?.enable;

    // 如果筛选已启用，使用当前显示的数据作为选中值
    if (isEnable) {
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

      const hasChanged = !arrayEqual(filter.values, Array.from(selectedRawValues));
      if (hasChanged) {
        this.filterStateManager.dispatch({
          type: FilterActionType.UPDATE_FILTER,
          payload: {
            field: fieldId,
            values: Array.from(selectedRawValues)
          }
        });
      }
    } else {
      // 如果筛选未启用，初始化为计数>0的值都选中（但不启用筛选）
      if (!filter) {
        const availableRawValues =
          this.uniqueKeys
            .get(fieldId)
            ?.filter(item => item.count > 0) // 只选中计数>0的值
            ?.map(item => item.rawValue)
            .filter(v => v !== undefined && v !== null) || [];

        this.filterStateManager.dispatch({
          type: FilterActionType.ADD_FILTER,
          payload: {
            field: fieldId,
            type: 'byValue',
            values: availableRawValues,
            enable: false // 初始状态为未启用
          }
        });
      }
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

      // 同步禁用状态：计数为0时禁用复选框
      // const count = this.uniqueKeys.get(filter.field)?.find(key => String(key.value) === optionDom.id)?.count || 0;
      // optionDom.checkbox.disabled = count === 0;
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
    // 获取当前搜索过滤后可见的选中值
    const visibleSelectedKeys = Array.from(this.filterStateManager.getVisibleSelectedValues(fieldId));

    if (visibleSelectedKeys.length > 0 && visibleSelectedKeys.length < this.uniqueKeys.get(fieldId)?.length) {
      this.filterStateManager.dispatch({
        type: FilterActionType.APPLY_FILTERS,
        payload: {
          field: fieldId,
          type: 'byValue',
          values: visibleSelectedKeys,
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
    applyStyles(this.filterByValuePanel, this.styles.filterPanel);

    // -- 搜索栏 ---
    const searchContainer = document.createElement('div');
    applyStyles(searchContainer, this.styles.searchContainer);

    this.filterByValueSearchInput = document.createElement('input');
    this.filterByValueSearchInput.type = 'text';
    this.filterByValueSearchInput.placeholder = this.styles.searchInput?.placeholder || '可使用空格分隔多个关键词';
    applyStyles(this.filterByValueSearchInput, this.styles.searchInput);

    searchContainer.appendChild(this.filterByValueSearchInput);

    // --- 筛选选项 ---
    const optionsContainer = document.createElement('div');
    applyStyles(optionsContainer, this.styles.optionsContainer);

    const selectAllItemDiv = document.createElement('div');
    applyStyles(selectAllItemDiv, this.styles.optionItem);

    const selectAllLabel = document.createElement('label');
    applyStyles(selectAllLabel, this.styles.optionLabel);

    this.selectAllCheckbox = document.createElement('input');
    this.selectAllCheckbox.type = 'checkbox';
    this.selectAllCheckbox.checked = true; // 默认全选
    applyStyles(this.selectAllCheckbox, this.styles.checkbox);

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
      applyStyles(itemDiv, this.styles.optionItem);
      itemDiv.style.display = 'flex';

      const label = document.createElement('label');
      applyStyles(label, this.styles.optionLabel);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = String(value); // 显示值作为checkbox的value
      // 使用原始值进行选中状态判断，优化为O(1)复杂度
      checkbox.checked = selectedRawValueSet.has(rawValue);
      // 计数为0时禁用复选框（不可选中）
      // checkbox.disabled = count === 0;
      applyStyles(checkbox, this.styles.checkbox);

      const countSpan = document.createElement('span');
      countSpan.textContent = String(count);
      applyStyles(countSpan, this.styles.countSpan);

      label.append(checkbox, ` ${rawValue}`); // UI显示原始值
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
    // 只改变UI状态，不更新筛选状态
    // 因为只有点击确认后，筛选状态才能落库
    this.filterByValuePanel.addEventListener('change', (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement && target.type === 'checkbox') {
        if (target === this.selectAllCheckbox) {
          this.valueFilterOptionList.get(this.selectedField).forEach(item => (item.checkbox.checked = target.checked));
        } else {
          this.updateCheckboxUI(this.selectedField);
        }
      }
    });
  }

  updateCheckboxUI(field: string | number): void {
    const checkedItem = this.valueFilterOptionList.get(field)?.filter(item => item.checkbox.checked);
    const uncheckedItem = this.valueFilterOptionList.get(field)?.filter(item => !item.checkbox.checked);
    if (!isValid(checkedItem) || !isValid(uncheckedItem)) {
      return;
    }
    if (checkedItem.length !== 0 && uncheckedItem.length !== 0) {
      this.selectAllCheckbox.indeterminate = true;
    } else {
      this.selectAllCheckbox.indeterminate = false;
      this.selectAllCheckbox.checked = uncheckedItem.length === 0;
    }
  }

  updateCheckboxState(field: string | number): void {
    const originalValues: any = this.valueFilterOptionList
      .get(field)
      ?.filter(item => item.checkbox.checked)
      .map(item => item.originalValue);
    // 获取显示值对应的原始值
    const displayToRawMap = this.displayToRawValueMap.get(field);
    const rawValues = originalValues.map((displayValue: any) => {
      return displayToRawMap ? displayToRawMap.get(displayValue) : displayValue;
    });
    // 更新筛选状态
    this.filterStateManager.dispatch({
      type: FilterActionType.ADD_FILTER,
      payload: {
        field: field,
        type: 'byValue',
        values: rawValues
      }
    });
  }

  show(): void {
    // 1. 收集候选值（来自原始数据）
    this.collectUniqueColumnValues(this.selectedField);

    // 2. 更新计数（根据筛选状态选择数据源）
    this.updateCandidateCounts(this.selectedField);

    // 3. 初始化筛选状态（必须在 renderFilterOptions 之前执行）
    this.initFilterStateFromTableData(this.selectedField);

    // 4. 初始化筛选菜单状态，确保候选值列表稳定，并清空搜索关键词
    const uniqueValues = this.uniqueKeys.get(this.selectedField);
    const displayToRawMap = this.displayToRawValueMap.get(this.selectedField);
    if (uniqueValues && displayToRawMap) {
      this.filterStateManager.initializeFilterMenuState(this.selectedField, uniqueValues, displayToRawMap);
    }

    // 5. 清空搜索框
    if (this.filterByValueSearchInput) {
      this.filterByValueSearchInput.value = '';
    }
    // 6. 渲染选项（此时状态已经初始化完成）
    this.renderFilterOptions(this.selectedField);
    // 7. 同步全选状态(必须放在render之后, 只有这样checkbox ui才能与state同步, 此时需要做的是同步全选状态)
    this.updateCheckboxUI(this.selectedField);
    this.filterByValuePanel.style.display = 'block';
  }

  hide(): void {
    this.filterByValuePanel.style.display = 'none';
  }

  clearSearchInputValue(): void {
    this.filterByValueSearchInput.value = '';
  }
}
