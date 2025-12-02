import { ListTable, PivotTable } from '@visactor/vtable';
import { arrayEqual } from '@visactor/vutils';
import type { FilterConfig, ValueFilterOptionDom, FilterState } from './types';
import { FilterActionType } from './types';
import type { FilterStateManager } from './filter-state-manager';
import { applyStyles, filterStyles } from './styles';

export class ValueFilter {
  private table: ListTable | PivotTable;
  private filterStateManager: FilterStateManager;
  private selectedField: string | number;
  private selectedKeys = new Map<string | number, Set<string | number>>(); // 存储 format 之前的原始数据
  private candidateKeys = new Map<string | number, Map<string | number, number>>(); // 存储 format 后的数据
  private formatFnCache = new Map<string | number, (record: any) => string | number>();
  private toUnformattedCache = new Map<string | number, Map<any, Set<any>>>();

  private valueFilterOptionList: Map<string | number, ValueFilterOptionDom[]> = new Map();
  private filterByValuePanel: HTMLElement;
  private filterByValueSearchInput: HTMLInputElement;
  private selectAllCheckbox: HTMLInputElement;
  private totalCountSpan: HTMLSpanElement;
  private filterItemsContainer: HTMLElement;

  private _onInputKeyUpHandler: (event: KeyboardEvent) => void;
  private _onCheckboxChangeHandler: (event: Event) => void;

  constructor(table: ListTable | PivotTable, filterStateManager: FilterStateManager) {
    this.table = table;
    this.filterStateManager = filterStateManager;
  }

  setSelectedField(fieldId: string | number): void {
    this.selectedField = fieldId;
  }

  private getFormatFnCache(fieldId: string | number) {
    let formatFn = this.formatFnCache.get(fieldId);
    if (formatFn !== null && formatFn !== undefined) {
      return formatFn;
    }

    const headerAddress = this.table.internalProps.layoutMap.getHeaderCellAddressByField(String(fieldId));
    const bodyInfo = this.table.internalProps.layoutMap.getBody(headerAddress?.col, headerAddress?.row);
    if (bodyInfo && 'fieldFormat' in bodyInfo && typeof bodyInfo.fieldFormat === 'function') {
      formatFn = bodyInfo.fieldFormat;
    } else if (bodyInfo && 'format' in bodyInfo && typeof bodyInfo.format === 'function') {
      formatFn = bodyInfo.format;
    } else {
      formatFn = (record: any) => record[fieldId];
    }

    this.formatFnCache.set(fieldId, formatFn);
    return formatFn;
  }

  /**
   * 为未应用筛选的列，收集候选值集合
   */
  private collectCandidateKeysForUnfilteredColumn(fieldId: string | number): void {
    const countMap = new Map<any, number>(); // 计算每个候选值的计数
    const records = this.table.internalProps.dataSource.records; // 未筛选：使用当前表格数据
    const formatFn = this.getFormatFnCache(fieldId);
    const toUnformatted = new Map();

    records.forEach(record => {
      const originalValue = record[fieldId];
      const formattedValue = formatFn(record);
      if (formattedValue !== undefined && formattedValue !== null) {
        countMap.set(formattedValue, (countMap.get(formattedValue) || 0) + 1);

        const unformattedSet = toUnformatted.get(formattedValue);
        if (unformattedSet !== undefined && unformattedSet !== null) {
          unformattedSet.add(originalValue);
        } else {
          toUnformatted.set(formattedValue, new Set([originalValue]));
        }
      }
    });

    this.candidateKeys.set(fieldId, countMap);
    this.toUnformattedCache.set(fieldId, toUnformatted);
  }

  /**
   * 为已应用筛选的列，收集候选值集合
   */
  private collectCandidateKeysForFilteredColumn(candidateField: string | number): void {
    const filteredFields = this.filterStateManager.getActiveFilterFields().filter(field => field !== candidateField);
    const toUnformatted = new Map();
    const formatFn = this.getFormatFnCache(candidateField);

    const countMap = new Map<any, number>(); // 计算每个候选值的计数
    const recordsList = this.table.internalProps.records; // 已筛选：使用原始表格数据
    const records = recordsList.filter(record =>
      filteredFields.every(field => {
        const filterType = this.filterStateManager.getFilterState(field)?.type;
        if (filterType !== 'byValue' && filterType !== null && filterType !== undefined) {
          this.syncSingleStateFromTableData(field);
        }
        const set = this.selectedKeys.get(field);
        return set.has(record[field]);
      })
    );

    records.forEach(record => {
      const originalValue = record[candidateField];
      const formattedValue = formatFn(record);
      countMap.set(formattedValue, (countMap.get(formattedValue) || 0) + 1);
      if (formattedValue !== undefined && formattedValue !== null) {
        const unformattedSet = toUnformatted.get(formattedValue);
        if (unformattedSet !== undefined && unformattedSet !== null) {
          unformattedSet.add(originalValue);
        } else {
          toUnformatted.set(formattedValue, new Set([originalValue]));
        }
      }
    });

    this.candidateKeys.set(candidateField, countMap);
    this.toUnformattedCache.set(candidateField, toUnformatted);
  }

  private toggleSelectAll(fieldId: string | number, selected: boolean): void {
    const options = this.valueFilterOptionList.get(fieldId);
    options.forEach(option => {
      option.checkbox.checked = selected;
    });
  }

  private syncSelectAllCheckbox(fieldId: string | number): void {
    const options = this.valueFilterOptionList.get(fieldId) || [];
    const allChecked = options.every(o => o.checkbox.checked);
    const noneChecked = options.every(o => !o.checkbox.checked);

    this.selectAllCheckbox.checked = allChecked;
    this.selectAllCheckbox.indeterminate = !allChecked && !noneChecked;
  }

  private onSearch(fieldId: string | number, value: string): void {
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
   * 根据当前表格中的数据，更新 filter 的被选状态
   * 适用情况：表格数据发生变化，或者需要自动检测当前表格的数据情况
   */
  syncSingleStateFromTableData(fieldId: string | number): void {
    const selectedValues = new Set<any>();
    const originalValues = new Set<any>();

    const currentRecords = this.table.internalProps.dataSource.records; // 当前数据
    currentRecords.forEach(record => {
      selectedValues.add(record[fieldId]);
    });

    const originalRecords = this.table.internalProps.records; // 原始数据
    originalRecords.forEach(record => {
      originalValues.add(record[fieldId]);
    });

    const hasFiltered = !arrayEqual(Array.from(originalValues), Array.from(selectedValues));
    if (hasFiltered) {
      this.selectedKeys.set(fieldId, selectedValues);

      this.filterStateManager.dispatch({
        type: FilterActionType.UPDATE_FILTER,
        payload: {
          field: fieldId,
          values: Array.from(selectedValues),
          enable: true
        }
      });
    }
  }

  applyFilter(fieldId: string | number = this.selectedField): void {
    const options = this.valueFilterOptionList.get(fieldId);
    if (!options || options.length === 0) {
      return;
    }

    const selections = options
      .map(option => {
        if (option.checkbox.checked) {
          return option.originalValue;
        }
        return null;
      })
      .filter(key => key !== null)
      .flat();

    this.selectedKeys.set(fieldId, new Set(selections));

    if (selections.length > 0 && selections.length < this.valueFilterOptionList.get(fieldId).length) {
      this.filterStateManager.dispatch({
        type: FilterActionType.APPLY_FILTERS,
        payload: {
          field: fieldId,
          type: 'byValue',
          values: selections,
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

    this.totalCountSpan = document.createElement('span');
    this.totalCountSpan.textContent = '';
    applyStyles(this.totalCountSpan, filterStyles.countSpan);

    selectAllLabel.append(this.selectAllCheckbox, ' 全选');
    selectAllItemDiv.append(selectAllLabel, this.totalCountSpan);

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

    let totalCount = 0;
    let allChecked = true;
    let noneChecked = true;
    const selectedKeysSet = this.selectedKeys.get(field);
    const itemDomList: ValueFilterOptionDom[] = [];
    const isFiltered = this.filterStateManager.getFilterState(field)?.enable;
    const toUnformatted = this.toUnformattedCache.get(field);

    const candidates = this.candidateKeys.get(field);
    if (!candidates || candidates.size === 0) {
      return;
    }
    const candidatesArr = [...candidates.entries()] as [string, number][] | [number, number][];
    const sortedCandidatesArr =
      typeof candidatesArr[0][0] === 'number'
        ? [...candidatesArr]?.sort(([a], [b]) => Number(a) - Number(b))
        : [...candidatesArr]?.sort(([a], [b]) => String(a).localeCompare(String(b)));

    sortedCandidatesArr?.forEach(([val, count]) => {
      totalCount += count;
      const unformattedArr = Array.from(toUnformatted.get(val) || new Set());
      const itemDiv = document.createElement('div');
      applyStyles(itemDiv, filterStyles.optionItem);
      itemDiv.style.display = 'flex';

      const label = document.createElement('label');
      applyStyles(label, filterStyles.optionLabel);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = String(val); // 显示值作为checkbox的value
      checkbox.checked = isFiltered ? unformattedArr.some(v => selectedKeysSet?.has(v)) : true;
      applyStyles(checkbox, filterStyles.checkbox);

      if (checkbox.checked) {
        noneChecked = false;
      } else {
        allChecked = false;
      }

      const countSpan = document.createElement('span');
      countSpan.textContent = String(count);
      applyStyles(countSpan, filterStyles.countSpan);

      label.append(checkbox, ` ${val}`); // UI显示格式化值
      itemDiv.append(label, countSpan);
      this.filterItemsContainer.appendChild(itemDiv);

      const itemDom: ValueFilterOptionDom = {
        id: String(val), // 显示值作为id，用于UI交互
        originalValue: unformattedArr,
        itemContainer: itemDiv,
        checkbox: checkbox,
        countSpan: countSpan
      };

      itemDomList.push(itemDom);
    });

    this.valueFilterOptionList.set(field, itemDomList);
    this.selectAllCheckbox.checked = allChecked;
    this.selectAllCheckbox.indeterminate = !allChecked && !noneChecked;
    this.totalCountSpan.textContent = String(totalCount);
  }

  private bindEventForFilterByValue(): void {
    this._onInputKeyUpHandler = (event: KeyboardEvent) => {
      const target = event.target as EventTarget;
      if (target instanceof HTMLInputElement && target.type === 'text') {
        const value = target.value;
        this.onSearch(this.selectedField, value);
      }
    };

    this._onCheckboxChangeHandler = (event: Event) => {
      const target = event.target as EventTarget;
      if (target instanceof HTMLInputElement && target.type === 'checkbox') {
        if (target === this.selectAllCheckbox) {
          this.toggleSelectAll(this.selectedField, this.selectAllCheckbox.checked);
        } else {
          this.syncSelectAllCheckbox(this.selectedField);
        }
      }
    };

    this.filterByValuePanel.addEventListener('keyup', this._onInputKeyUpHandler);
    this.filterByValuePanel.addEventListener('change', this._onCheckboxChangeHandler);
  }

  show(): void {
    // 1. 收集候选值列表（根据筛选状态选择数据源）
    const isFiltered = this.filterStateManager.getFilterState(this.selectedField)?.enable;
    if (!isFiltered) {
      this.collectCandidateKeysForUnfilteredColumn(this.selectedField);
    } else {
      this.collectCandidateKeysForFilteredColumn(this.selectedField);
    }

    // 2. 初始筛选状态
    const filterType = this.filterStateManager.getFilterState(this.selectedField)?.type;
    if (filterType !== null && filterType !== undefined && filterType !== 'byValue') {
      this.syncSingleStateFromTableData(this.selectedField);
    }

    // 3. 清空搜索框
    if (this.filterByValueSearchInput) {
      this.filterByValueSearchInput.value = '';
    }

    // 4. 渲染选项（此时状态已经初始化完成）
    this.renderFilterOptions(this.selectedField);
    this.filterByValuePanel.style.display = 'block';
  }

  hide(): void {
    this.filterByValuePanel.style.display = 'none';
  }

  clearSearchInputValue(): void {
    this.filterByValueSearchInput.value = '';
  }

  destroy(): void {
    if (this.filterByValuePanel) {
      if (this._onInputKeyUpHandler) {
        this.filterByValuePanel.removeEventListener('keyup', this._onInputKeyUpHandler);
      }
      if (this._onCheckboxChangeHandler) {
        this.filterByValuePanel.removeEventListener('change', this._onCheckboxChangeHandler);
      }
    }
    this._onInputKeyUpHandler = undefined as any;
    this._onCheckboxChangeHandler = undefined as any;

    if (this.filterByValuePanel) {
      const parent = this.filterByValuePanel.parentElement;
      if (parent) {
        parent.removeChild(this.filterByValuePanel);
      } else {
        // if not attached, ensure it's removed
        this.filterByValuePanel.remove();
      }
    }

    // clear DOM contents to release child references
    if (this.filterItemsContainer) {
      this.filterItemsContainer.innerHTML = '';
    }
    if (this.filterByValueSearchInput) {
      this.filterByValueSearchInput.value = '';
    }

    // Clear in-memory caches and collections to avoid unbounded growth
    this.selectedKeys && this.selectedKeys.clear();
    this.candidateKeys && this.candidateKeys.clear();
    this.formatFnCache && this.formatFnCache.clear();
    this.toUnformattedCache && this.toUnformattedCache.clear();
    this.valueFilterOptionList && this.valueFilterOptionList.clear();

    // Nullify references (use casts to avoid TS strict errors at assignment)
    (this.filterByValuePanel as any) = undefined;
    (this.filterByValueSearchInput as any) = undefined;
    (this.selectAllCheckbox as any) = undefined;
    (this.totalCountSpan as any) = undefined;
    (this.filterItemsContainer as any) = undefined;
  }
}
