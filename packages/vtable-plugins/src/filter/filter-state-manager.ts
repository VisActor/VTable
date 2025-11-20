import type { ListTable, PivotTable } from '@visactor/vtable';
import type { FilterState, FilterAction, FilterConfig, FilterListener } from './types';
import { FilterActionType } from './types';
import type { FilterEngine } from './filter-engine';

/**
 * 筛选状态管理器，用于管理筛选状态
 */
export class FilterStateManager {
  private state: FilterState;
  private engine: FilterEngine;
  private listeners: Array<FilterListener> = [];

  private table: ListTable | PivotTable;

  constructor(table: ListTable | PivotTable, engine: FilterEngine) {
    this.state = {
      filters: new Map()
    };
    this.engine = engine;
    this.table = table;
  }

  getFilterState(fieldId?: string | number): FilterConfig {
    return this.state.filters.get(fieldId);
  }

  /**
   * 获取所有激活的筛选字段
   */
  getActiveFilterFields(): (string | number)[] {
    const activeFields: (string | number)[] = [];
    this.state.filters.forEach((config, field) => {
      if (config.enable) {
        activeFields.push(field);
      }
    });
    return activeFields;
  }

  /**
   * 获取所有筛选状态
   */
  getAllFilterStates(): FilterState {
    return this.state;
  }

  /**
   * 公共方法：重新应用当前所有激活的筛选状态
   * 用于在表格配置更新后恢复筛选显示
   */
  reapplyCurrentFilters(): void {
    const activeFields = this.getActiveFilterFields();
    if (activeFields.length > 0) {
      this.applyFilters();
    }
  }

  dispatch(action: FilterAction) {
    this.state = this.reduce(this.state, action);
    if (this.shouldApplyFilter(action)) {
      this.applyFilters();
    }
    this.notifyListeners();
  }

  subscribe(listener: FilterListener): () => void {
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
        newFilter.set(payload.field, payload);
        break;
      case FilterActionType.REMOVE_FILTER:
        newFilter.delete(payload.field);
        break;
      case FilterActionType.UPDATE_FILTER:
        newFilter.set(payload.field, { ...newFilter.get(payload.field), ...payload });
        break;
      case FilterActionType.ENABLE_FILTER:
        newFilter.set(payload.field, { ...newFilter.get(payload.field), enable: true });
        break;
      case FilterActionType.DISABLE_FILTER:
        newFilter.set(payload.field, { ...newFilter.get(payload.field), enable: false });
        break;
      case FilterActionType.CLEAR_ALL_FILTERS:
        newFilter.clear();
        break;
      case FilterActionType.APPLY_FILTERS:
        newFilter.set(payload.field, { ...newFilter.get(payload.field), ...payload, enable: true });
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
    return shouldApplyActions.includes(action.type) || action.payload.enable;
  }
}
