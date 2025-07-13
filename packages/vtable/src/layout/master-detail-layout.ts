import type { LayoutMapAPI } from '../ts-types/list-table/layout-map/api';
import type { MasterDetailTable } from '../MasterDetailTable';
import type { ColumnsDefine } from '../ts-types';
import { SimpleHeaderLayoutMap } from './simple-header-layout';
import type { ListTable } from '../ListTable';

/**
 * MasterDetailTable 专用的 LayoutMap 实现
 * 继承自 SimpleHeaderLayoutMap 并适配 MasterDetailTable
 */
export class MasterDetailLayoutMap extends SimpleHeaderLayoutMap implements LayoutMapAPI {
  private _masterDetailTable: MasterDetailTable;

  constructor(table: MasterDetailTable, columns: ColumnsDefine, showHeader: boolean, hierarchyIndent: number) {
    // 将 MasterDetailTable 强制转换为 ListTable 类型传递给父类
    // 这是安全的，因为 MasterDetailTable 实现了 ListTable 的所有必要接口
    super(table as unknown as ListTable, columns, showHeader, hierarchyIndent);
    
    this._masterDetailTable = table;
  }
  
  /**
   * 重写 rowCount getter 来支持展开行的额外行数
   */
  get rowCount(): number {
    if (this.transpose) {
      return super.rowCount;
    }
    
    // 基础行数 = 表头行数 + 数据行数
    const baseRowCount = this.headerLevelCount + this.recordsCount;
    
    // 计算展开行产生的额外行数
    const expandedRows = this._masterDetailTable.internalProps.expandedRowsSet;
    const extraRows = expandedRows.size; // 每个展开的行会增加一行空白行
    
    return baseRowCount + extraRows;
  }



  /**
   * 根据记录索引获取表格中的行号
   */
  getRecordStartRowByRecordIndex(index: number): number {
    const skipRowCount = this.hasAggregationOnTopCount ? this.headerLevelCount + 1 : this.headerLevelCount;
    let tableRow = skipRowCount;
    const expandedRows = this._masterDetailTable.internalProps.expandedRowsSet;

    // 计算到达指定记录索引需要经过多少行
    for (let recordIndex = 0; recordIndex < index; recordIndex++) {
      tableRow++; // 数据行
      
      // 如果这个记录是展开的，需要额外增加一行（空白行）
      if (expandedRows.has(recordIndex)) {
        tableRow++; // 空白行
      }
    }

    return tableRow;
  }

  /**
   * 检查指定行是否是展开后插入的详情行
   */
  isDetailRow(row: number): boolean {
    const skipRowCount = this.hasAggregationOnTopCount ? this.headerLevelCount + 1 : this.headerLevelCount;
    
    if (row < skipRowCount) {
      return false;
    }

    // 使用行管理器来检查是否是详情行
    return this._masterDetailTable.isDetailRow(row);
  }
}
