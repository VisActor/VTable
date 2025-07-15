import * as VTable from '@visactor/vtable';
import { arrayEqual } from '@visactor/vutils';

export interface FilterOptions {
  id?: string;
  filterIcon?: VTable.TYPES.ColumnIconOption;
}

export class FilterPlugin implements VTable.plugins.IVTablePlugin {
  id = `filter-${Date.now()}`;
  name = 'Filter';
  runTime: (
    | 'click_cell'
    | 'dblclick_cell'
    | 'mousedown_cell'
    | 'mouseup_cell'
    | 'selected_cell'
    | 'selected_clear'
    | 'before_keydown'
    | 'keydown'
    | 'mouseenter_table'
    | 'mouseleave_table'
    | 'mousedown_table'
    | 'mousemove_table'
    | 'mousemove_cell'
    | 'mouseenter_cell'
    | 'mouseleave_cell'
    | 'contextmenu_cell'
    | 'resize_column'
    | 'resize_column_end'
    | 'resize_row'
    | 'resize_row_end'
    | 'change_header_position'
    | 'change_header_position_start'
    | 'changing_header_position'
    | 'change_header_position_fail'
    | 'sort_click'
    | 'after_sort'
    | 'freeze_click'
    | 'scroll'
    | 'can_scroll'
    | 'scroll_horizontal_end'
    | 'scroll_vertical_end'
    | 'dropdown_menu_click'
    | 'mouseover_chart_symbol'
    | 'drag_select_end'
    | 'copy_data'
    | 'dropdown_icon_click'
    | 'dropdown_menu_clear'
    | 'tree_hierarchy_state_change'
    | 'show_menu'
    | 'hide_menu'
    | 'icon_click'
    | 'legend_item_click'
    | 'legend_item_hover'
    | 'legend_item_unHover'
    | 'legend_change'
    | 'mouseenter_axis'
    | 'mouseleave_axis'
    | 'checkbox_state_change'
    | 'radio_state_change'
    | 'switch_state_change'
    | 'before_init'
    | 'before_set_size'
    | 'after_render'
    | 'initialized'
    | 'change_cell_value'
    | 'mousedown_fill_handle'
    | 'drag_fill_handle_end'
    | 'dblclick_fill_handle'
    | 'empty_tip_click'
    | 'empty_tip_dblclick'
    | 'button_click'
    | 'before_cache_chart_image'
    | 'pasted_data'
  )[] = [VTable.TABLE_EVENT_TYPE.INITIALIZED, VTable.TABLE_EVENT_TYPE.ICON_CLICK];

  pluginOptions: FilterOptions;

  table: VTable.ListTable | VTable.PivotTable;

  filterEngine: FilterEngine;
  filterStateManager: FilterStateManager;
  filterToolbar: FilterToolbar;

  constructor(pluginOptions: FilterOptions) {
    this.id = pluginOptions?.id ?? this.id;
    this.pluginOptions = pluginOptions;
    this.pluginOptions.filterIcon = pluginOptions.filterIcon ?? {
      name: 'filter',
      type: 'svg',
      width: 20,
      height: 20,
      marginRight: 6,
      positionType: VTable.TYPES.IconPosition.right,
      // interactive: true,
      svg: '<svg t="1707378931406" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1587" width="200" height="200"><path d="M741.248 79.68l-234.112 350.08v551.488l55.296 24.704v-555.776l249.152-372.544c8.064-32.96-10.496-59.712-41.152-59.712h-709.248c-30.464 0-49.28 26.752-41.344 59.712l265.728 372.544v432.256l55.36 24.704v-478.592l-248.896-348.864h649.216z m-68.032 339.648c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-14.016-27.264-30.848z m0 185.216c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.256-27.264-14.016-27.264-30.848z m0 185.28c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-13.952-27.264-30.848z" p-id="1588"></path></svg>'
    };
  }

  run(...args: any[]) {
    const eventArgs = args[0];
    const runtime = args[1];
    const table: VTable.BaseTableAPI = args[2];
    this.table = table as VTable.ListTable | VTable.PivotTable;

    if (runtime === VTable.TABLE_EVENT_TYPE.INITIALIZED) {
      this.filterEngine = new FilterEngine();
      this.filterStateManager = new FilterStateManager(this.table, this.filterEngine);
      this.filterToolbar = new FilterToolbar(this.table, this.filterStateManager);

      this.filterToolbar.render(document.body);
      this.addFilterIcon();
    } else if (runtime === VTable.TABLE_EVENT_TYPE.ICON_CLICK && eventArgs.name === 'filter') {
      const col = eventArgs.col;
      const row = eventArgs.row;
      if (this.filterToolbar.isVisible) {
        this.filterToolbar.hide();
      } else {
        this.filterToolbar.show(col, row);
      }
    }
  }

  addFilterIcon(): void {
    const columns = (this.table as VTable.ListTable).columns; // TODO: 待处理多行的情况，待扩展透视表类型
    columns.forEach((col: VTable.ColumnDefine) => {
      col.headerIcon = this.pluginOptions.filterIcon;
    });
    (this.table as VTable.ListTable).updateColumns(columns);
  }

  release() {
    this.table = null;
    this.filterEngine = null;
    this.filterStateManager = null;
    this.filterToolbar = null;
  }
}

export interface FilterState {
  filters: Map<string, FilterConfig>;
  // activeFilters: string[];  // 激活的筛选器的 ID 列表
}

export interface FilterConfig {
  id: string; // 列筛选设置的唯一标识，用来区分不同的列筛选设置
  enable: boolean;
  field: string; // 对应表格列
  type: 'byValue' | 'byCondition'; // 筛选类型
  values?: any[]; // 按值筛选时的值列表
  operator?: FilterOperator; // 按条件筛选时的操作符
  condition?: any; // 按条件筛选时的具体条件
}

export enum FilterActionType {
  ADD_FILTER,
  REMOVE_FILTER,
  UPDATE_FILTER,
  ENABLE_FILTER,
  DISABLE_FILTER,
  CLEAR_ALL_FILTERS,
  APPLY_FILTERS
}

export interface FilterAction {
  type: FilterActionType;
  payload: any;
}

export interface ValueFilterOptionDom {
  id: string;
  originalValue: any;
  itemContainer: HTMLDivElement;
  checkbox: HTMLInputElement;
  countSpan: HTMLSpanElement;
}

export interface ColumnDefinition {
  field: string;
  title: string;
  dataType: 'string' | 'number' | 'boolean' | 'date';
}

type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual';

function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes: Record<string, string> = {},
  children: (HTMLElement | string)[] = []
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });

  return element;
}

/**
 * 筛选引擎，用于进行实际的筛选操作
 */
export class FilterEngine {
  filterFuncRule: (VTable.TYPES.FilterFuncRule & { fieldId?: string })[] = [];
  filterValueRule: VTable.TYPES.FilterValueRule[] = [];

  applyFilter(state: FilterState, table: VTable.ListTable | VTable.PivotTable) {
    const { filters } = state;
    this.filterFuncRule = [];
    this.filterValueRule = [];

    filters.forEach(filter => {
      if (!filter.enable) {
        return;
      }

      if (filter.type === 'byValue') {
        this.filterValueRule.push({
          filterKey: filter.id,
          filteredValues: filter.values
        });
      } else if (filter.type === 'byCondition') {
        this.filterFuncRule.push({
          filterFunc: filter.condition,
          fieldId: filter.id
        });
      }
    });

    table.updateFilterRules([...this.filterFuncRule, ...this.filterValueRule]);
  }

  clearAllFilter(table: VTable.ListTable | VTable.PivotTable) {
    this.filterFuncRule = [];
    this.filterValueRule = [];
    table.updateFilterRules([]);
  }

  clearFilter(table: VTable.ListTable | VTable.PivotTable, fieldId: string) {
    this.filterValueRule = this.filterValueRule.filter(rule => rule.filterKey !== fieldId);
    this.filterFuncRule = this.filterFuncRule.filter(rule => rule.fieldId !== fieldId);

    table.updateFilterRules([...this.filterFuncRule, ...this.filterValueRule]);
  }
}

/**
 * 筛选状态管理器，用于管理筛选状态
 */
export class FilterStateManager {
  private state: FilterState;
  private engine: FilterEngine;
  private listeners: Array<(state: FilterState) => void> = [];

  private table: VTable.ListTable | VTable.PivotTable;

  constructor(table: VTable.ListTable | VTable.PivotTable, engine: FilterEngine) {
    this.state = {
      filters: new Map<string, FilterConfig>()
    };
    this.engine = engine;
    this.table = table;
  }

  getState() {
    return { ...this.state };
  }

  dispatch(action: FilterAction) {
    this.state = this.reduce(this.state, action);
    if (this.shouldApplyFilter(action)) {
      this.applyFilters();
    }
    this.notifyListeners();
  }

  subscribe(listener: (state: FilterState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  private reduce(state: FilterState, action: FilterAction): FilterState {
    const { type, payload } = action;
    const newFilter = new Map(state.filters);
    switch (type) {
      case FilterActionType.ADD_FILTER:
        newFilter.set(payload.id, payload);
        break;
      case FilterActionType.REMOVE_FILTER:
        newFilter.delete(payload.id);
        break;
      case FilterActionType.UPDATE_FILTER:
        newFilter.set(payload.id, { ...newFilter.get(payload.id), ...payload });
        break;
      case FilterActionType.ENABLE_FILTER:
        newFilter.set(payload.id, { ...newFilter.get(payload.id), enable: true });
        break;
      case FilterActionType.DISABLE_FILTER:
        newFilter.set(payload.id, { ...newFilter.get(payload.id), enable: false });
        break;
      case FilterActionType.CLEAR_ALL_FILTERS:
        newFilter.clear();
        break;
      case FilterActionType.APPLY_FILTERS:
        newFilter.set(payload.id, { ...newFilter.get(payload.id), enable: true });
        break;
    }

    return { ...state, filters: newFilter };
  }

  private applyFilters() {
    this.engine.applyFilter(this.state, this.table);
  }

  private shouldApplyFilter(action: FilterAction) {
    const shouldApplyActions = [
      FilterActionType.REMOVE_FILTER,
      FilterActionType.ENABLE_FILTER,
      FilterActionType.DISABLE_FILTER,
      FilterActionType.CLEAR_ALL_FILTERS,
      FilterActionType.APPLY_FILTERS
    ];
    return shouldApplyActions.includes(action.type);
  }
}

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

  private collectUniqueColumnValues(fieldId: string): void {
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
    this.filterByValuePanel.style.padding = '10px';
    this.filterByValuePanel.style.display = 'block'; // 控制显隐

    // -- 搜索栏 ---
    const searchContainer = document.createElement('div');
    searchContainer.style.padding = '5px';
    this.filterByValueSearchInput = document.createElement('input');
    this.filterByValueSearchInput.type = 'text';
    this.filterByValueSearchInput.placeholder = '可使用空格分隔多个关键词';
    this.filterByValueSearchInput.style.width = '100%';
    this.filterByValueSearchInput.style.padding = '8px 10px';
    this.filterByValueSearchInput.style.border = '1px solid #ccc';
    this.filterByValueSearchInput.style.borderRadius = '4px';
    this.filterByValueSearchInput.style.fontSize = '14px';
    this.filterByValueSearchInput.style.boxSizing = 'border-box';
    searchContainer.appendChild(this.filterByValueSearchInput);

    // --- 筛选选项 ---
    const optionsContainer = document.createElement('div');
    optionsContainer.style.maxHeight = '200px';
    optionsContainer.style.overflowY = 'auto';
    optionsContainer.style.marginTop = '10px';

    const selectAllItemDiv = document.createElement('div');
    this.styleOptionItem(selectAllItemDiv);
    const selectAllLabel = document.createElement('label');
    this.styleOptionLabel(selectAllLabel);
    this.selectAllCheckbox = document.createElement('input');
    this.selectAllCheckbox.type = 'checkbox';
    this.selectAllCheckbox.checked = true; // 默认全选
    this.selectAllCheckbox.style.marginRight = '10px';
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
      this.styleOptionItem(itemDiv);

      const label = document.createElement('label');
      this.styleOptionLabel(label);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = String(value);
      checkbox.checked = selectedValues.includes(value); // TODO: 复杂度需要优化
      checkbox.style.marginRight = '10px';

      const countSpan = document.createElement('span');
      countSpan.textContent = String(count);
      countSpan.style.color = '#888';
      countSpan.style.fontSize = '12px';

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

  private bindEventForFilterByValue(): void {
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

  private styleOptionItem(div: HTMLElement): void {
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.alignItems = 'center';
    div.style.padding = '8px 5px';
  }
  private styleOptionLabel(label: HTMLLabelElement): void {
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.cursor = 'pointer';
    label.style.flexGrow = '1';
    label.style.fontWeight = 'normal';
  }
}

export class ConditionFilter {
  table: VTable.ListTable | VTable.PivotTable;
  filterStateManager: FilterStateManager;
  selectedField: string;
  isVisible: boolean = false;

  private condition: FilterOperator;

  private filterByConditionPanel: HTMLElement;

  constructor(table: VTable.ListTable | VTable.PivotTable, filterStateManager: FilterStateManager) {
    this.table = table;
    this.filterStateManager = filterStateManager;
  }

  setSelectedField(fieldId: string): void {
    this.selectedField = fieldId;
  }

  applyFilter(field: string): void {
    this.filterStateManager.dispatch({
      type: FilterActionType.ADD_FILTER,
      payload: {
        id: field,
        filterType: 'byCondition',
        condition: this.condition
      }
    });

    this.hide();
  }

  clearFilter(field: string): void {
    this.filterStateManager.dispatch({
      type: FilterActionType.REMOVE_FILTER,
      payload: {
        id: field
      }
    });

    this.hide();
  }

  render(container: HTMLElement): void {
    // === 按条件筛选的菜单内容 ===
    this.filterByConditionPanel = document.createElement('div');
    this.filterByConditionPanel.style.padding = '10px';
    this.filterByConditionPanel.style.display = 'none'; // 控制显隐
    this.filterByConditionPanel.innerHTML = '<p>按条件筛选功能待开发。</p>';
  }

  show(): void {
    this.filterByConditionPanel.style.display = 'block';
    this.isVisible = true;
  }

  hide(): void {
    this.filterByConditionPanel.style.display = 'none';
    this.isVisible = false;
  }
}

/**
 * 筛选工具栏，用于显示筛选 UI
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
    this.styleTabToggle(tab);
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
    this.filterMenu.style.display = 'none'; // 控制筛选器的显隐
    this.filterMenu.style.position = 'absolute';
    this.filterMenu.style.backgroundColor = 'white'; // 暂且先以日间模式为主
    this.filterMenu.style.border = '1px solid #ccc';
    this.filterMenu.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    this.filterMenu.style.zIndex = '100';
    this.filterMenu.style.width = `${this.filterMenuWidth}px`;

    // === 筛选 Tab ===
    const filterTabsContainer = document.createElement('div');
    filterTabsContainer.style.display = 'flex';
    filterTabsContainer.style.justifyContent = 'space-around';
    filterTabsContainer.style.borderBottom = '1px solid #e0e0e0';

    this.filterTabByValue = document.createElement('button');
    this.filterTabByValue.innerText = '按值筛选';
    this.styleFilterTab(this.filterTabByValue, true);

    this.filterTabByCondition = document.createElement('button');
    this.filterTabByCondition.innerText = '按条件筛选';
    this.styleFilterTab(this.filterTabByCondition, false);

    filterTabsContainer.append(this.filterTabByValue, this.filterTabByCondition);

    // === 页脚（清除、取消、确定 筛选按钮） ===
    const footerContainer = document.createElement('div');
    footerContainer.style.display = 'flex';
    footerContainer.style.justifyContent = 'space-between';
    footerContainer.style.alignItems = 'center';
    footerContainer.style.padding = '10px 15px';
    footerContainer.style.borderTop = '1px solid #e0e0e0';
    footerContainer.style.backgroundColor = '#f8f9fa';

    this.clearFilterOptionLink = document.createElement('a');
    this.clearFilterOptionLink.href = '#';
    this.clearFilterOptionLink.innerText = '清除筛选';
    this.clearFilterOptionLink.style.color = '#007bff';
    this.clearFilterOptionLink.style.textDecoration = 'none';

    const footerButtons = document.createElement('div');
    this.cancelFilterButton = document.createElement('button');
    this.cancelFilterButton.innerText = '取消';
    this.styleFooterButton(this.cancelFilterButton, false);

    this.applyFilterButton = document.createElement('button');
    this.applyFilterButton.innerText = '确认';
    this.styleFooterButton(this.applyFilterButton, true);

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
    if (this.activeTab === 'byValue') {
      this.valueFilter.show();
    } else {
      this.conditionFilter.show();
    }
  }

  hide(): void {
    this.filterMenu.style.display = 'none';
    this.isVisible = false;
  }

  private styleFilterTab(button: HTMLButtonElement, isActive: boolean) {
    button.style.backgroundColor = 'transparent';
    button.style.border = 'none';
    button.style.flex = '1';
    button.style.padding = '10px 15px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    button.style.fontWeight = isActive ? 'bold' : 'normal';
    button.style.color = isActive ? '#007bff' : '#666';
    button.style.borderBottom = isActive ? '3px solid #007bff' : '2px solid transparent';
  }
  private styleFooterButton(button: HTMLButtonElement, isPrimary = false): void {
    button.style.padding = '6px 12px';
    button.style.border = '1px solid #ccc';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.marginLeft = '5px';
    button.style.backgroundColor = isPrimary ? '#007bff' : 'white';
    button.style.color = isPrimary ? 'white' : '#333';
    button.style.borderColor = isPrimary ? '#007bff' : '#ccc';
  }
  private styleTabToggle(tab: 'byValue' | 'byCondition') {
    const isValueTab = tab === 'byValue';
    this.styleFilterTab(this.filterTabByValue, isValueTab);
    this.styleFilterTab(this.filterTabByCondition, !isValueTab);
  }
}
