import type { plugins, ListTable, BaseTableAPI } from '@visactor/vtable';
import { TABLE_EVENT_TYPE } from '@visactor/vtable';
import type { TableEvents } from '@visactor/vtable/src/core/TABLE_EVENT_TYPE';
import { AutoFillManager } from './auto-fill-manager';
/**
 * 自动填充插件
 */
export interface IAutoFillPluginOptions {
  /**
   * 填充模式
   * 'copy': 复制填充
   * 'series': 序列填充
   * 不填写则开启自动填充菜单
   */
  fillMode?: 'copy' | 'series';
  /**
   * 快速填充模式
   * 'copy': 复制填充
   * 'series': 序列填充
   * 不填写则开启自动填充菜单
   */
  fastFillMode?: 'copy' | 'series';
}

export class AutoFillPlugin implements plugins.IVTablePlugin {
  id = `auto-fill`;
  name = 'Auto Fill';
  runTime = [
    TABLE_EVENT_TYPE.MOUSEDOWN_FILL_HANDLE,
    TABLE_EVENT_TYPE.DRAG_FILL_HANDLE_END,
    TABLE_EVENT_TYPE.DBLCLICK_FILL_HANDLE
  ];
  table: ListTable;
  private autoFillManager: AutoFillManager;
  constructor(options?: IAutoFillPluginOptions) {
    this.autoFillManager = new AutoFillManager(options);
  }
  run(
    ...args: [{ direction: string }, TableEvents[keyof TableEvents] | TableEvents[keyof TableEvents][], BaseTableAPI]
  ) {
    // start drag
    console.log('auto fill plugin run', args);
    if (args[1] === TABLE_EVENT_TYPE.MOUSEDOWN_FILL_HANDLE) {
      const [_, __, table] = args;
      this.table = table as ListTable;
      this.autoFillManager.setTable(this.table);
      this.autoFillManager.handleStartDrag(this.table?.getSelectedCellRanges()[0]);
    } else if (args[1] === TABLE_EVENT_TYPE.DRAG_FILL_HANDLE_END) {
      // end drag
      const [{ direction }] = args;
      this.autoFillManager.handleEndDrag(this.table?.getSelectedCellRanges()[0], direction);
    } else if (args[1] === TABLE_EVENT_TYPE.DBLCLICK_FILL_HANDLE) {
      this.autoFillManager.handleDbClick();
    }
  }
}
