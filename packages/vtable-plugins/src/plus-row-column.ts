import type { BaseTableAPI } from '@visactor/vtable/src/ts-types/base-table';

export class PlusRowColumnPlugin {
  constructor(private table: BaseTableAPI) {
    this.table = table;
  }
  init() {
    //
  }
}
