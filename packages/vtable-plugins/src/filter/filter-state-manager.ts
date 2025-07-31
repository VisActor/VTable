import type * as VTable from '@visactor/vtable';
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

  private table: VTable.ListTable | VTable.PivotTable;

  constructor(table: VTable.ListTable | VTable.PivotTable, engine: FilterEngine) {
    this.state = {
      filters: new Map()
    };
    this.engine = engine;
    this.table = table;
  }

  getFilterState(fieldId?: string | number): FilterConfig {
    return this.state.filters.get(fieldId);
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
    this.updateColumnIcons();
  }

  /**
   * 更新列图标状态
   */
  private updateColumnIcons() {
    const columns = (this.table as VTable.ListTable).columns;
    if (!columns) {
      return;
    }

    const plugin = this.table.pluginManager.getPluginByName('Filter') as FilterPlugin;
    if (!plugin || !plugin.pluginOptions) {
      return;
    }

    const filterIcon = plugin.pluginOptions.filterIcon;
    const filteringIcon = plugin.pluginOptions.filteringIcon;

    // 遍历所有列，更新图标
    columns.forEach((col: VTable.ColumnDefine, index: number) => {
      const field = col.field as string;
      const filterConfig = this.state.filters.get(field);

      // 首先检查这一列是否应该启用筛选功能
      const shouldEnableFilter = plugin.shouldEnableFilterForColumn
        ? plugin.shouldEnableFilterForColumn(index, col)
        : true;

      if (shouldEnableFilter) {
        // 如果该列有激活的筛选，则使用filteringIcon
        if (filterConfig && filterConfig.enable) {
          col.headerIcon = filteringIcon;
        } else {
          col.headerIcon = filterIcon;
        }
      } else {
        // 如果不应该启用筛选，则移除筛选图标（恢复原始图标或无图标）
        // 这里我们需要小心，不要覆盖其他插件设置的图标
        if (col.headerIcon === filterIcon || col.headerIcon === filteringIcon) {
          col.headerIcon = undefined;
        }
      }
    });

    // 更新表格列定义
    (this.table as VTable.ListTable).updateColumns(columns);
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
