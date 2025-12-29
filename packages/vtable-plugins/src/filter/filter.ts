import { TABLE_EVENT_TYPE, TYPES } from '@visactor/vtable';
import { FilterEngine } from './filter-engine';
import { FilterStateManager } from './filter-state-manager';
import { FilterToolbar } from './filter-toolbar';
import type { FilterOptions, FilterConfig, FilterState, FilterAction } from './types';
import { FilterActionType } from './types';
import type {
  ListTableConstructorOptions,
  pluginsDefinition,
  ListTable,
  PivotTable,
  BaseTableAPI,
  ColumnDefine,
  ColumnsDefine
} from '@visactor/vtable';
import { cloneDeep, merge } from 'lodash';
import { filterStyles } from './styles';
import { categories } from './constant';

/**
 * 筛选插件，负责初始化筛选引擎、状态管理器和工具栏
 */
export class FilterPlugin implements pluginsDefinition.IVTablePlugin {
  id = `filter`;
  name = 'Filter';
  runTime = [
    TABLE_EVENT_TYPE.BEFORE_INIT,
    TABLE_EVENT_TYPE.BEFORE_UPDATE_OPTION,
    TABLE_EVENT_TYPE.ICON_CLICK,
    TABLE_EVENT_TYPE.SCROLL,
    TABLE_EVENT_TYPE.CHANGE_CELL_VALUE,
    TABLE_EVENT_TYPE.UPDATE_RECORD,
    TABLE_EVENT_TYPE.ADD_RECORD,
    TABLE_EVENT_TYPE.DELETE_RECORD
  ];

  pluginOptions: FilterOptions;

  table: ListTable | PivotTable;
  columns: ColumnsDefine;

  filterEngine: FilterEngine;
  filterStateManager: FilterStateManager;
  filterToolbar: FilterToolbar;

  constructor(pluginOptions: FilterOptions) {
    this.id = pluginOptions?.id ?? this.id;
    this.pluginOptions = cloneDeep(pluginOptions); // 不污染用户的配置, 以便上层业务做diff的时候使用
    this.pluginOptions.filterIcon = pluginOptions.filterIcon ?? {
      name: 'filter-icon',
      type: 'svg',
      width: 12,
      height: 12,
      positionType: TYPES.IconPosition.right,
      cursor: 'pointer',
      svg: '<svg t="1752821809070" class="icon" viewBox="0 0 1664 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12092" width="200" height="200"><path d="M89.6 179.2A89.6 89.6 0 0 1 89.6 0h1408a89.6 89.6 0 0 1 0 179.2H89.6z m256 384a89.6 89.6 0 0 1 0-179.2h896a89.6 89.6 0 0 1 0 179.2h-896z m256 384a89.6 89.6 0 0 1 0-179.2h384a89.6 89.6 0 0 1 0 179.2h-384z" fill="#93a2b9" p-id="12093"></path></svg>'
    };
    this.pluginOptions.filteringIcon = pluginOptions.filteringIcon ?? {
      name: 'filtering-icon',
      type: 'svg',
      width: 12,
      height: 12,
      positionType: TYPES.IconPosition.right,
      cursor: 'pointer',
      svg: '<svg t="1752821771292" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11926" width="200" height="200"><path d="M971.614323 53.05548L655.77935 412.054233C635.196622 435.434613 623.906096 465.509377 623.906096 496.583302v495.384307c0 28.975686-35.570152 43.063864-55.353551 21.781723l-159.865852-171.256294c-5.495389-5.895053-8.59279-13.688514-8.592789-21.781722V496.583302c0-31.073925-11.290526-61.148688-31.873254-84.429153L52.385677 53.05548C34.200936 32.472751 48.888611 0 76.365554 0h871.268892c27.476943 0 42.164618 32.472751 23.979877 53.05548z" fill="#416eff" p-id="11927"></path></svg>'
    };
    if (!this.pluginOptions.filterModes || !this.pluginOptions.filterModes.length) {
      this.pluginOptions.filterModes = ['byValue', 'byCondition'];
    }

    this.pluginOptions.styles = merge(filterStyles, this.pluginOptions.styles ?? {});
    this.pluginOptions.conditionCategories = pluginOptions.conditionCategories ?? categories;
  }

  initFilterPlugin(eventArgs: any) {
    this.filterEngine = new FilterEngine(this.pluginOptions);
    this.filterStateManager = new FilterStateManager(this.table, this.filterEngine);
    this.filterToolbar = new FilterToolbar(this.table, this.filterStateManager, this.pluginOptions);
    this.columns = eventArgs.options.columns;

    this.filterToolbar.render(document.body);
    this.updateFilterIcons(this.columns);
    this.filterStateManager.subscribe((_: FilterState, action?: FilterAction) => {
      // 新增筛选配置时，不需要更新筛选图标以及表格
      if (action?.type === FilterActionType.ADD_FILTER) {
        return;
      }
      this.updateFilterIcons(this.columns);
      (this.table as ListTable).updateColumns(this.columns, {
        clearRowHeightCache: false
      });
    });
  }

  run(...args: any[]) {
    const eventArgs = args[0];
    const runtime = args[1];
    const table: BaseTableAPI = args[2];
    this.table = table as ListTable | PivotTable;

    if (runtime === TABLE_EVENT_TYPE.BEFORE_INIT) {
      this.initFilterPlugin(eventArgs);
    } else if (runtime === TABLE_EVENT_TYPE.BEFORE_UPDATE_OPTION) {
      if (!this.filterEngine || !this.filterStateManager || !this.filterToolbar) {
        this.initFilterPlugin(eventArgs);
      }
      this.pluginOptions = {
        ...this.pluginOptions,
        ...(eventArgs.options.plugins as FilterPlugin[])?.find(plugin => plugin.id === this.id)?.pluginOptions
      };
      this.columns = eventArgs.options.columns;
      this.handleOptionUpdate(eventArgs.options);
    } else if (
      (runtime === TABLE_EVENT_TYPE.ICON_CLICK && eventArgs.name === 'filter-icon') ||
      eventArgs.name === 'filtering-icon'
    ) {
      const isRightClick =
        eventArgs.event?.which === 3 || eventArgs.event?.button === 2 || (eventArgs.event?.buttons & 2) === 2;
      // 如果是右键点击，直接返回不处理
      if (isRightClick) {
        return;
      }

      const col = eventArgs.col;
      const row = eventArgs.row;
      if (this.filterToolbar.isVisible) {
        this.filterToolbar.hide(eventArgs.col, eventArgs.row);
      } else {
        this.filterToolbar.show(col, row, this.pluginOptions.filterModes);
        this.table.fireListeners(TABLE_EVENT_TYPE.FILTER_MENU_SHOW, {
          col: eventArgs.col,
          row: eventArgs.row
        });
      }
    } else if (runtime === TABLE_EVENT_TYPE.SCROLL) {
      if (eventArgs.scrollDirection === 'horizontal') {
        this.filterToolbar.adjustMenuPosition();
      }
    } else if (runtime === TABLE_EVENT_TYPE.CHANGE_CELL_VALUE) {
      const changedField = this.table.getHeaderField(eventArgs.col, eventArgs.row);
      this.syncFilterWithTableData(changedField as string | number);
    } else if (runtime === TABLE_EVENT_TYPE.UPDATE_RECORD) {
      this.syncFilterWithTableData();
    } else if (runtime === TABLE_EVENT_TYPE.ADD_RECORD) {
      this.syncFilterWithTableData();
    } else if (runtime === TABLE_EVENT_TYPE.DELETE_RECORD) {
      this.syncFilterWithTableData();
    }
  }

  updatePluginOptions(pluginOptions: FilterOptions) {
    // TODO: 目前额外只处理了styles，其他的后续再处理
    this.pluginOptions = merge(this.pluginOptions, pluginOptions);
    // 更新筛选器UI样式
    this.filterToolbar.updateStyles(this.pluginOptions.styles);
  }

  // 当用户的配置项更新时调用
  update() {
    if (this.filterStateManager) {
      this.reapplyActiveFilters();
    }
  }

  syncFilterWithTableData(field?: string | number) {
    const filterType = this.filterStateManager.getFilterState(field)?.type;
    if (filterType === 'byValue') {
      if (field !== null && field !== undefined) {
        this.filterToolbar.valueFilter.syncSingleStateFromTableData(field);
        return;
      }

      const columns = this.table.dataSource.columns;
      columns.forEach(({ field }) => {
        this.filterToolbar.valueFilter.syncSingleStateFromTableData(field as string | number);
      });
    }
  }

  /**
   * 处理选项更新事件
   */
  private handleOptionUpdate(options: ListTableConstructorOptions): void {
    const currentActiveFields = this.filterStateManager ? this.filterStateManager.getActiveFilterFields() : [];

    // 验证筛选状态一致性
    if (this.filterStateManager && currentActiveFields.length > 0) {
      this.validateFilterStatesAfterUpdate(options, currentActiveFields);
    }

    // 更新筛选图标
    this.updateFilterIcons(options.columns);
  }

  /**
   * 重新应用所有激活的筛选状态
   * 在 updateOption 后调用，因为 updateOption 会全量更新表格
   */
  private reapplyActiveFilters(): void {
    this.filterStateManager.reapplyCurrentFilters();
  }

  /**
   * 验证更新后的筛选状态一致性
   */
  private validateFilterStatesAfterUpdate(
    options: ListTableConstructorOptions,
    activeFields: (string | number)[]
  ): void {
    const columns = options.columns;
    const fieldsToRemove: (string | number)[] = [];

    activeFields.forEach(field => {
      const column = columns.find(col => col.field === field);

      // 检查该列是否仍然应该启用筛选
      if (!column || !this.shouldEnableFilterForColumn(field, column)) {
        fieldsToRemove.push(field);
      }
    });

    // 清除不再有效的筛选状态
    fieldsToRemove.forEach(field => {
      this.filterStateManager.dispatch({
        type: FilterActionType.REMOVE_FILTER,
        payload: { field }
      });
    });
  }

  /**
   * 更新所有列的筛选图标状态
   * 根据列的筛选启用状态，添加或移除筛选图标
   */
  private updateFilterIcons(columns: ColumnsDefine = []) {
    const filterIcon = this.pluginOptions.filterIcon;
    const filteringIcon = this.pluginOptions.filteringIcon;

    const isIconEqual = (a: any, b: any) =>
      a === b || (a && b && typeof a === 'object' && typeof b === 'object' && a.name === b.name);

    const toIconList = (icons: any) => (icons ? (Array.isArray(icons) ? icons : [icons]) : []);

    const compactIcons = (list: any[]) => (list.length === 0 ? undefined : list.length === 1 ? list[0] : list);

    const stack = [...columns];
    const subColumns = [];
    while (stack.length > 0) {
      const currentCol = stack.pop();
      if (currentCol.columns) {
        currentCol.columns.forEach(col => stack.push(col));
      } else {
        subColumns.push(currentCol);
      }
    }

    subColumns.forEach(column => {
      const shouldShow = this.shouldEnableFilterForColumn(column.field as string | number, column);
      const isFiltering = !!this.filterStateManager.getFilterState(column.field as string | number)?.enable;
      let icons = toIconList(column.headerIcon);

      if (shouldShow) {
        if (isFiltering) {
          if (!icons.some(icon => isIconEqual(icon, filteringIcon))) {
            icons = icons.filter(icon => !isIconEqual(icon, filterIcon));
            icons.push(filteringIcon);
          }
        } else {
          if (!icons.some(icon => isIconEqual(icon, filterIcon))) {
            icons = icons.filter(icon => !isIconEqual(icon, filteringIcon));
            icons.push(filterIcon);
          }
        }
      } else {
        icons = icons.filter(icon => !isIconEqual(icon, filterIcon));
      }

      column.headerIcon = compactIcons(icons);
    });
  }

  /**
   * 判断指定列是否应该启用筛选功能
   */
  shouldEnableFilterForColumn(field: number | string, column: ColumnDefine): boolean {
    // 如果是空白列，不适用筛选
    if (!column.title) {
      return false;
    }

    // 首先检查列级别的 filter 属性（最高优先级）
    const columnWithFilter = column as any;
    if (columnWithFilter.filter !== undefined) {
      return !!columnWithFilter.filter;
    }

    // 如果有自定义的启用钩子函数，使用钩子函数的结果
    if (this.pluginOptions.enableFilter) {
      return this.pluginOptions.enableFilter(field, column);
    }

    // 如果没有钩子函数，使用默认启用配置
    if (this.pluginOptions.defaultEnabled !== undefined) {
      return this.pluginOptions.defaultEnabled;
    }

    // 默认情况，所有列都启用筛选
    return true;
  }

  /**
   * 获取当前的筛选状态
   * 用于保存配置时获取筛选状态
   */
  getFilterState(): any {
    if (!this.filterStateManager) {
      return null;
    }

    const state = this.filterStateManager.getAllFilterStates();
    const serializedState: Record<string | number, any> = {};

    // 将 Map 转换为普通对象以便序列化
    state.filters.forEach((config: FilterConfig, field: string | number) => {
      serializedState[field] = {
        enable: config.enable,
        field: config.field,
        type: config.type,
        values: config.values,
        operator: config.operator,
        condition: config.condition
      };
    });

    return {
      filters: serializedState
    };
  }

  /**
   * 设置筛选状态
   * 用于从保存的配置中恢复筛选状态
   */
  setFilterState(filterState?: FilterState): void {
    if (!this.filterStateManager) {
      console.warn('setFilterState: 状态管理器未初始化');
      return;
    }

    // 清除当前所有筛选
    this.filterStateManager.dispatch({
      type: FilterActionType.CLEAR_ALL_FILTERS,
      payload: {}
    });

    // 若传入参数为空，则重置筛选状态
    if (!filterState || !filterState.filters) {
      return;
    }

    // 恢复每个筛选配置
    Object.entries(filterState.filters).forEach(([, config]: [string, any]) => {
      if (config.enable) {
        this.filterStateManager.dispatch({
          type: FilterActionType.ADD_FILTER,
          payload: {
            field: config.field,
            type: config.type,
            values: config.values,
            operator: config.operator,
            condition: config.condition,
            enable: true
          }
        });
      }
    });
  }

  release() {
    this.columns.forEach(column => {
      column.headerIcon = undefined;
    });
    this.table = null;
    this.filterEngine = null;
    this.filterStateManager = null;
    this.filterToolbar.destroy();
    this.filterToolbar = null;
  }
}
