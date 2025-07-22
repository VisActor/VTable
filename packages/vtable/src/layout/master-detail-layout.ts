import type { LayoutMapAPI } from '../ts-types/list-table/layout-map/api';
import type { MasterDetailTable } from '../MasterDetailTable';
import type { ColumnsDefine } from '../ts-types';
import { SimpleHeaderLayoutMap } from './simple-header-layout';


/**
 * MasterDetailTable 专用的 LayoutMap 实现
 */
export class MasterDetailLayoutMap extends SimpleHeaderLayoutMap implements LayoutMapAPI {
  private _masterDetailTable: MasterDetailTable;

  constructor(table: MasterDetailTable, columns: ColumnsDefine, showHeader: boolean, hierarchyIndent: number) {
    // 这里我直接修改了SimpleHeaderLayoutMap中接受table的参数类型，增加了MasterDetailTable,
    // 因为这个MasterDetailTable和ListTable实现的接口类似，所以应该没问题
    super(table, columns, showHeader, hierarchyIndent);
    this._masterDetailTable = table;
  }
}
