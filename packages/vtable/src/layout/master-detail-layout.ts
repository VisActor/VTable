import type { LayoutMapAPI } from '../ts-types/list-table/layout-map/api';
import type { MasterDetailTable } from '../MasterDetailTable';
import type { ColumnsDefine } from '../ts-types';
import { SimpleHeaderLayoutMap } from './simple-header-layout';


/**
 * MasterDetailTable 专用的 LayoutMap 实现
 * 继承自 SimpleHeaderLayoutMap 并适配 MasterDetailTable
 */
export class MasterDetailLayoutMap extends SimpleHeaderLayoutMap implements LayoutMapAPI {
  private _masterDetailTable: MasterDetailTable;

  constructor(table: MasterDetailTable, columns: ColumnsDefine, showHeader: boolean, hierarchyIndent: number) {
    // 将 MasterDetailTable 强制转换为 ListTable 类型传递给父类
    // 这是安全的，因为 MasterDetailTable 实现了 ListTable 的所有必要接口
    super(table, columns, showHeader, hierarchyIndent);
    
    this._masterDetailTable = table;
  }

}
