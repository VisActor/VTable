import type { ListTable, PivotTable } from '@visactor/vtable';
import type { ColumnDefine } from '@visactor/vtable/es/ts-types';
import type { FilterState, FilterAction, FilterConfig } from './types';
import { FilterActionType } from './types';
import type { FilterEngine } from './filter-engine';
import type { FilterPlugin } from '../filter';

/**
 * 筛选状态管理器，用于管理筛选状态
 */
export class FilterStateManager {
  private state: FilterState;
  private engine: FilterEngine;
  private listeners: Array<(state: FilterState) => void> = [];

  private table: ListTable | PivotTable;

  // 筛选菜单相关的状态
  private filterMenuStates: Map<
    string | number,
    {
      // 筛选菜单打开时固定的候选值列表
      stableCandidateValues: Array<{ value: any; count: number; rawValue: any }>;
      // 当前搜索关键词
      currentSearchKeyword: string;
      // 显示值到原始值的映射
      displayToRawMap: Map<any, any>;
    }
  > = new Map();

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
    this.notifyListeners(action);
  }

  subscribe(listener: (state: FilterState) => void): () => void {
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

  /**
   * 初始化筛选菜单状态（当筛选菜单打开时调用）
   */
  initializeFilterMenuState(
    fieldId: string | number,
    candidateValues: Array<{ value: any; count: number; rawValue: any }>,
    displayToRawMap: Map<any, any>
  ): void {
    this.filterMenuStates.set(fieldId, {
      stableCandidateValues: candidateValues,
      currentSearchKeyword: '',
      displayToRawMap: displayToRawMap
    });
  }

  /**
   * 获取筛选菜单的稳定候选值列表
   */
  getStableCandidateValues(fieldId: string | number): Array<{ value: any; count: number; rawValue: any }> {
    return this.filterMenuStates.get(fieldId)?.stableCandidateValues || [];
  }

  /**
   * 更新搜索关键词
   */
  updateSearchKeyword(fieldId: string | number, keyword: string): void {
    const menuState = this.filterMenuStates.get(fieldId);
    if (!menuState) {
      return;
    }

    menuState.currentSearchKeyword = keyword;
  }

  /**
   * 获取当前可见的选中值（根据搜索关键词从筛选状态中筛选）
   */
  getVisibleSelectedValues(fieldId: string | number): Set<any> {
    const menuState = this.filterMenuStates.get(fieldId);
    const filter = this.getFilterState(fieldId);
    if (!menuState || !filter?.values) {
      return new Set();
    }

    const allSelectedValues = new Set(filter.values);
    const keyword = menuState.currentSearchKeyword;
    const filterKeywords = keyword
      .toUpperCase()
      .split(' ')
      .filter(s => s);

    // 如果没有搜索关键词，返回所有被选中的值
    if (filterKeywords.length === 0) {
      return allSelectedValues;
    }

    // 根据搜索关键词筛选出可见的选中值
    const visibleSelected = new Set<any>();
    for (const candidate of menuState.stableCandidateValues) {
      const displayValue = candidate.value;
      const txtValue = String(displayValue).toUpperCase();

      // 检查是否匹配搜索关键词
      const match = filterKeywords.some(keyword => txtValue.includes(keyword));

      if (match) {
        // 如果可见，检查是否被选中
        const rawValue = menuState.displayToRawMap ? menuState.displayToRawMap.get(displayValue) : displayValue;
        if (allSelectedValues.has(rawValue)) {
          visibleSelected.add(rawValue);
        }
      }
    }

    return visibleSelected;
  }

  /**
   * 获取当前搜索关键词
   */
  getCurrentSearchKeyword(fieldId: string | number): string {
    return this.filterMenuStates.get(fieldId)?.currentSearchKeyword || '';
  }
}
