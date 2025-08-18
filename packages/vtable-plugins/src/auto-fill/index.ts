import * as VTable from '@visactor/vtable';
import type { TableEvents } from '@visactor/vtable/src/core/TABLE_EVENT_TYPE';
import { AutoFillManager } from './auto-fill-manager';

export class AutoFillPlugin implements VTable.plugins.IVTablePlugin {
  id = `auto-fill-${Date.now()}`;
  name = 'Auto Fill';
  runTime = [VTable.TABLE_EVENT_TYPE.MOUSEDOWN_FILL_HANDLE, VTable.TABLE_EVENT_TYPE.DRAG_FILL_HANDLE_END];
  table: VTable.ListTable;
  private autoFillManager: AutoFillManager;
  constructor() {
    this.init();
  }
  init() {
    this.autoFillManager = new AutoFillManager();
  }
  run(
    ...args: [
      { direction: string },
      TableEvents[keyof TableEvents] | TableEvents[keyof TableEvents][],
      VTable.BaseTableAPI
    ]
  ) {
    // start drag
    if (args[1] === VTable.TABLE_EVENT_TYPE.MOUSEDOWN_FILL_HANDLE) {
      const [_, __, table] = args;
      this.table = table as VTable.ListTable;
      this.autoFillManager.setTable(this.table);
      this.autoFillManager.startDrag(this.table?.getSelectedCellRanges()[0]);
    } else if (args[1] === VTable.TABLE_EVENT_TYPE.DRAG_FILL_HANDLE_END) {
      // end drag
      const [{ direction }] = args;
      this.autoFillManager.endDrag(this.table?.getSelectedCellRanges()[0], direction);
    }
  }
}
