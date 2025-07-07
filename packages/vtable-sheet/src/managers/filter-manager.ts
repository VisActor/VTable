import type { ColumnFilter, Filter, IFilterManager } from '../ts-types';
import { FilterOperator, FilterType } from '../ts-types';
import type { VTableSheet } from '../components/vtable-sheet';

/**
 * 过滤管理器 - 管理数据过滤
 */
export class FilterManager implements IFilterManager {
  /** 过滤器集合 */
  _filters: Map<string, Filter> = new Map();
  /** 原始数据 */
  _originalData: any[][] = [];
  /** 过滤后的数据 */
  _filteredData: any[][] = [];
  /** 父组件 */
  _parent: VTableSheet;

  /**
   * 构造函数
   * @param parent 父组件
   */
  constructor(parent: VTableSheet) {
    this._parent = parent;
  }

  /**
   * 设置列过滤器
   */
  setFilter(columnKey: string, filter: Filter): void {
    // 保存过滤器
    this._filters.set(columnKey, filter);

    // 应用过滤器
    this.applyFilters();
  }

  /**
   * 获取列过滤器
   */
  getFilter(columnKey: string): Filter | null {
    return this._filters.get(columnKey) || null;
  }

  /**
   * 移除列过滤器
   */
  removeFilter(columnKey: string): void {
    // 移除过滤器
    this._filters.delete(columnKey);

    // 重新应用过滤器
    this.applyFilters();
  }

  /**
   * 应用过滤器
   */
  applyFilters(): void {
    // 获取当前活动的sheet
    const activeSheet = this._parent.getActiveSheet();
    if (!activeSheet) {
      return;
    }

    // 获取原始数据
    this._originalData = activeSheet.getData();

    // 如果没有过滤器，直接使用原始数据
    if (this._filters.size === 0) {
      this._filteredData = [...this._originalData];
      activeSheet.setData(this._filteredData);
      return;
    }

    // 应用所有过滤器
    this._filteredData = this._originalData.filter(row => {
      // 检查每个过滤器
      for (const [columnKey, filter] of this._filters.entries()) {
        const columnIndex = parseInt(columnKey.replace('col', ''), 10);
        const cellValue = row[columnIndex];

        // 如果不满足过滤条件，排除该行
        if (!this.matchesFilter(cellValue, filter)) {
          return false;
        }
      }

      // 满足所有过滤条件，保留该行
      return true;
    });

    // 更新表格数据
    activeSheet.setData(this._filteredData);
  }

  /**
   * 判断值是否满足过滤条件
   */
  matchesFilter(value: any, filter: Filter): boolean {
    // 处理空值
    if (value === null || value === undefined || value === '') {
      return false;
    }

    // 根据过滤器类型判断
    if (filter.type === FilterType.VALUE_LIST) {
      // 值列表过滤
      const includesValue = filter.values.includes(value);
      return filter.exclude ? !includesValue : includesValue;
    }
    // 条件过滤
    switch (filter.operator) {
      case FilterOperator.EQUALS:
        return value === filter.value;
      case FilterOperator.NOT_EQUALS:
        return value !== filter.value;
      case FilterOperator.GREATER_THAN:
        return value > filter.value;
      case FilterOperator.GREATER_THAN_OR_EQUAL:
        return value >= filter.value;
      case FilterOperator.LESS_THAN:
        return value < filter.value;
      case FilterOperator.LESS_THAN_OR_EQUAL:
        return value <= filter.value;
      case FilterOperator.CONTAINS:
        return String(value).includes(String(filter.value));
      case FilterOperator.NOT_CONTAINS:
        return !String(value).includes(String(filter.value));
      case FilterOperator.STARTS_WITH:
        return String(value).startsWith(String(filter.value));
      case FilterOperator.ENDS_WITH:
        return String(value).endsWith(String(filter.value));
      case FilterOperator.BETWEEN:
        return value >= filter.value && value <= filter.value2;
      default:
        return true;
    }
  }

  /**
   * 重置所有过滤器
   */
  resetFilters(): void {
    // 清空过滤器
    this._filters.clear();

    // 重置数据
    this._filteredData = [...this._originalData];

    // 更新表格
    const activeSheet = this._parent.getActiveSheet();
    if (activeSheet) {
      activeSheet.setData(this._filteredData);
    }
  }

  /**
   * 获取过滤后的数据
   */
  getFilteredData(): any[][] {
    return this._filteredData;
  }

  /**
   * 获取所有过滤器
   */
  getAllFilters(): ColumnFilter[] {
    const result: ColumnFilter[] = [];

    for (const [columnKey, filter] of this._filters.entries()) {
      result.push({
        columnKey,
        filter
      });
    }

    return result;
  }
}
