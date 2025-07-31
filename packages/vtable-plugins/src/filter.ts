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
