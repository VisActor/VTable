import type * as VTable from '@visactor/vtable';
import type { FilterState, FilterAction } from './types';
import { FilterActionType } from './types';
import type { FilterEngine } from './filter-engine';

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
      filters: new Map()
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
        newFilter.set(payload.id, { ...newFilter.get(payload.id), ...payload, enable: true });
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
