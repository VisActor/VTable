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
