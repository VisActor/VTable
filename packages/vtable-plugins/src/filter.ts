import * as VTable from '@visactor/vtable';
import { FilterEngine } from './filter/filter-engine';
import { FilterStateManager } from './filter/filter-state-manager';
import { FilterToolbar } from './filter/filter-toolbar';
import type { FilterOptions } from './filter/types';

/**
 * 筛选插件，负责初始化筛选引擎、状态管理器和工具栏
 */
export class FilterPlugin implements VTable.plugins.IVTablePlugin {
  id = `filter-${Date.now()}`;
  name = 'Filter';
  runTime = [VTable.TABLE_EVENT_TYPE.INITIALIZED, VTable.TABLE_EVENT_TYPE.ICON_CLICK];

  pluginOptions: FilterOptions;

  table: VTable.ListTable | VTable.PivotTable;

  filterEngine: FilterEngine;
  filterStateManager: FilterStateManager;
  filterToolbar: FilterToolbar;

  constructor(pluginOptions: FilterOptions) {
    this.id = pluginOptions?.id ?? this.id;
    this.pluginOptions = pluginOptions;
    this.pluginOptions.filterIcon = pluginOptions.filterIcon ?? {
      name: 'filter-icon',
      type: 'svg',
      width: 20,
      height: 20,
      marginRight: 6,
      positionType: VTable.TYPES.IconPosition.right,
      // interactive: true,
      svg: '<svg t="1752821809070" class="icon" viewBox="0 0 1664 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12092" width="200" height="200"><path d="M89.6 179.2A89.6 89.6 0 0 1 89.6 0h1408a89.6 89.6 0 0 1 0 179.2H89.6z m256 384a89.6 89.6 0 0 1 0-179.2h896a89.6 89.6 0 0 1 0 179.2h-896z m256 384a89.6 89.6 0 0 1 0-179.2h384a89.6 89.6 0 0 1 0 179.2h-384z" fill="#333333" p-id="12093"></path></svg>'
    };
    this.pluginOptions.filteringIcon = pluginOptions.filteringIcon ?? {
      name: 'filtering-icon',
      type: 'svg',
      width: 20,
      height: 20,
      marginRight: 6,
      positionType: VTable.TYPES.IconPosition.right,
      svg: '<svg t="1752821771292" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11926" width="200" height="200"><path d="M971.614323 53.05548L655.77935 412.054233C635.196622 435.434613 623.906096 465.509377 623.906096 496.583302v495.384307c0 28.975686-35.570152 43.063864-55.353551 21.781723l-159.865852-171.256294c-5.495389-5.895053-8.59279-13.688514-8.592789-21.781722V496.583302c0-31.073925-11.290526-61.148688-31.873254-84.429153L52.385677 53.05548C34.200936 32.472751 48.888611 0 76.365554 0h871.268892c27.476943 0 42.164618 32.472751 23.979877 53.05548z" p-id="11927"></path></svg>'
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
    } else if (
      (runtime === VTable.TABLE_EVENT_TYPE.ICON_CLICK && eventArgs.name === 'filter-icon') ||
      eventArgs.name === 'filtering-icon'
    ) {
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
    columns.forEach((col: VTable.ColumnDefine, index: number) => {
      // 检查是否应该为这一列启用筛选功能
      if (this.shouldEnableFilterForColumn(index, col)) {
        col.headerIcon = this.pluginOptions.filterIcon;
      }
      // 如果不应该启用筛选，则不设置 headerIcon（保持原有图标或无图标）
    });
    (this.table as VTable.ListTable).updateColumns(columns);
  }

  /**
   * 判断指定列是否应该启用筛选功能
   */
  shouldEnableFilterForColumn(columnIndex: number, column: VTable.ColumnDefine): boolean {
    // 如果是空白列，不适用筛选
    if (!column.title) {
      return false;
    }

    // 如果有自定义的启用钩子函数，使用钩子函数的结果
    if (this.pluginOptions.enableFilter) {
      return this.pluginOptions.enableFilter(columnIndex, column);
    }

    // 如果没有钩子函数，使用默认启用配置
    if (this.pluginOptions.defaultEnabled !== undefined) {
      return this.pluginOptions.defaultEnabled;
    }

    // 默认情况：所有列都启用筛选（保持原有行为）
    return true;
  }

  release() {
    this.table = null;
    this.filterEngine = null;
    this.filterStateManager = null;
    this.filterToolbar = null;
  }
}
