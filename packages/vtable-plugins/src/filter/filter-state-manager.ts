import type { ListTable, PivotTable } from '@visactor/vtable';
import type { FilterState, FilterAction, FilterConfig, FilterListener, FilterStateSnapshot } from './types';
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
   * 生成可序列化的筛选快照，用于撤销/恢复或跨实例回放。
   * - 只保留声明式配置（byValue 的 values、byCondition 的 operator/condition 等），不包含运行时函数。
   * - 对 byValue 的 values 做排序，避免因为用户勾选顺序不同导致快照 diff 抖动。
   * - 对 filters 按 field 排序，保证快照稳定。
   */
  getSnapshot(): FilterStateSnapshot {
    const filters: FilterConfig[] = [];
    this.state.filters.forEach(v => {
      const next: any = { ...v };
      if (next && next.type === 'byValue' && Array.isArray(next.values)) {
        next.values = next.values.slice().sort((a: any, b: any) => String(a).localeCompare(String(b)));
      }
      if (next && Array.isArray(next.condition) && next.condition.length > 2) {
        next.condition = next.condition.slice();
      }
      filters.push(next);
    });
    filters.sort((a, b) => String(a.field).localeCompare(String(b.field)));
    return { filters };
  }

  /**
   * 从快照恢复筛选状态并立即重新应用筛选。
   * 典型用途：HistoryPlugin 回放（undo/redo）时恢复筛选配置。
   */
  applySnapshot(snapshot: FilterStateSnapshot, actionType: FilterActionType = FilterActionType.APPLY_FILTERS): void {
    const next = new Map<string | number, FilterConfig>();
    (snapshot?.filters ?? []).forEach(cfg => {
      if (!cfg) {
        return;
      }
      const cloned: any = { ...cfg };
      if (cloned && cloned.type === 'byValue' && Array.isArray(cloned.values)) {
        cloned.values = cloned.values.slice();
      }
      if (cloned && Array.isArray(cloned.condition)) {
        cloned.condition = cloned.condition.slice();
      }
      next.set(cloned.field, cloned);
    });
    this.state = { ...this.state, filters: next };
    this.applyFilters();
    this.notifyListeners({ type: actionType, payload: { fromSnapshot: true } } as any);
  }

  /**
   * 列插入后修正筛选配置中的 field。
   * 背景：ListTable.addColumns(..., isMaintainArrayData=true) 会重排 columns[i].field=i，
   * 此时 FilterStateManager 里如果存的是数字 field（数组 records 场景），需要同步 +columnCount，
   * 否则旧筛选会错位应用到新列，表现为“全部被过滤掉/筛选异常”。
   */
  shiftFieldsOnAddColumns(columnIndex: number, columnCount: number): void {
    if (!Number.isFinite(columnIndex) || !Number.isFinite(columnCount) || columnCount <= 0) {
      return;
    }
    const next = new Map<string | number, FilterConfig>();
    this.state.filters.forEach((cfg, key) => {
      let newKey: string | number = key;
      const cloned: any = { ...cfg };
      if (typeof newKey === 'number' && newKey >= columnIndex) {
        newKey = newKey + columnCount;
      }
      if (typeof cloned.field === 'number' && cloned.field >= columnIndex) {
        cloned.field = cloned.field + columnCount;
      }
      if (cloned && cloned.type === 'byValue' && Array.isArray(cloned.values)) {
        cloned.values = cloned.values.slice();
      }
      if (cloned && Array.isArray(cloned.condition)) {
        cloned.condition = cloned.condition.slice();
      }
      next.set(newKey, cloned);
    });
    this.state = { ...this.state, filters: next };
  }

  /**
   * 列删除后修正筛选配置中的 field。
   * - 命中被删除列的筛选项会被移除（否则将引用无效列）。
   * - 删除多列时按升序依次“前移”，与 ListTable.deleteColumns 的维护逻辑一致。
   */
  shiftFieldsOnDeleteColumns(deleteColIndexs: number[]): void {
    if (!Array.isArray(deleteColIndexs) || deleteColIndexs.length === 0) {
      return;
    }
    const sorted = deleteColIndexs
      .slice()
      .filter(n => Number.isFinite(n))
      .sort((a, b) => a - b);
    const deleteIndexNums = sorted.map((idx, i) => idx - i);

    const next = new Map<string | number, FilterConfig>();
    this.state.filters.forEach((cfg, key) => {
      let newKey: string | number = key;
      const cloned: any = { ...cfg };
      let removed = false;
      if (typeof newKey === 'number') {
        let k = newKey;
        for (let i = 0; i < deleteIndexNums.length; i++) {
          const d = deleteIndexNums[i];
          if (k === d) {
            removed = true;
            break;
          }
          if (k > d) {
            k -= 1;
          }
        }
        newKey = k;
      }
      if (typeof cloned.field === 'number') {
        let f = cloned.field;
        for (let i = 0; i < deleteIndexNums.length; i++) {
          const d = deleteIndexNums[i];
          if (f === d) {
            removed = true;
            break;
          }
          if (f > d) {
            f -= 1;
          }
        }
        cloned.field = f;
      }
      if (removed) {
        return;
      }
      if (cloned && cloned.type === 'byValue' && Array.isArray(cloned.values)) {
        cloned.values = cloned.values.slice();
      }
      if (cloned && Array.isArray(cloned.condition)) {
        cloned.condition = cloned.condition.slice();
      }
      next.set(newKey, cloned);
    });
    this.state = { ...this.state, filters: next };
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
    this.notifyListeners(action);
  }

  subscribe(listener: FilterListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(action: FilterAction): void {
    this.listeners.forEach(listener => listener(this.state, action));
  }

  private reduce(state: FilterState, action: FilterAction): FilterState {
    const { type, payload } = action;
    const newFilter = new Map(state.filters);
    switch (type) {
      case FilterActionType.ADD_FILTER:
        if (payload.shouldKeepUnrelatedState) {
          newFilter.set(payload.field, { ...newFilter.get(payload.field), ...payload });
        } else {
          newFilter.set(payload.field, payload);
        }
        break;
      case FilterActionType.REMOVE_FILTER:
        if (payload.shouldKeepUnrelatedState && payload.type === 'byValue') {
          delete newFilter.get(payload.field).values;
          newFilter.set(payload.field, { ...newFilter.get(payload.field), enable: false });
        } else if (payload.shouldKeepUnrelatedState && payload.type === 'byCondition') {
          delete newFilter.get(payload.field).condition;
          delete newFilter.get(payload.field).operator;
          newFilter.set(payload.field, { ...newFilter.get(payload.field), enable: false });
        } else {
          newFilter.delete(payload.field);
        }

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
    return shouldApplyActions.includes(action.type);
  }
}
