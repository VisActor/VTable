import type { MasterDetailTable } from '../MasterDetailTable';
import { TABLE_EVENT_TYPE } from './TABLE_EVENT_TYPE';
import { HierarchyState } from '../ts-types';
import { updateRowHeightForExpand } from '../scenegraph/layout/update-height';

/**
 * MasterDetailTable 的行操作工具类
 * 提供正确的展开/收起实现，不重新创建场景图，而是使用增量更新
 */
export class MasterDetailRowManager {
  private table: MasterDetailTable;

  constructor(table: MasterDetailTable) {
    this.table = table;
  }

  /**
   * 展开指定记录的详情行
   * @param recordIndex 记录索引
   * @param detailHeight 详情行高度，默认使用 API 配置
   */
  expandRecord(recordIndex: number, detailHeight?: number): void {
    // 检查是否已经展开
    if (this.table.internalProps.expandedRowsSet.has(recordIndex)) {
      return;
    }
    this.table.internalProps.expandedRowsSet.add(recordIndex);

    // 计算插入位置：记录行的下一行
    const insertRowIndex = recordIndex + 1;
    // 获取详情行高度
    detailHeight = 300;
    const height = detailHeight ?? this.getDetailRowHeight(recordIndex);
    
    
    // 获取插入后的当前行高度，计算需要的高度变化量
    const currentHeight = this.table.getRowHeight(insertRowIndex);
    const deltaHeight = height - currentHeight;
    // 使用 update-height.ts 中的 updateRowHeight 函数来更新行高度
    updateRowHeightForExpand(this.table.scenegraph, insertRowIndex, deltaHeight);

    // this.table.scenegraph.table.internalProps._heightResizedRowMap.add(insertRowIndex); // 添加新插入的行索引

    // 关键！更新容器高度，这会触发 updateTableSize() 和 updateScrollBar()
    this.table.scenegraph.updateContainerHeight(insertRowIndex, deltaHeight);
    
    // 触发展开事件 - 使用现有的事件类型
    this.table.fireListeners(TABLE_EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE, {
      col: 0,
      row: insertRowIndex,
      hierarchyState: HierarchyState.expand
    });

    // console.log(this.table.tableNoFrameHeight);
    console.log(this.table.canvasHeight)
    console.log(this.table.getAllRowsHeight())
    console.log(this.table.scenegraph.height)
    // console.log(this.table.scenegraph.proxy.rowStart)
    // console.log(this.table.scenegraph.proxy.rowEnd)
  }

  /**
   * 收起指定记录的详情行
   * @param recordIndex 记录索引
   */
  collapseRecord(recordIndex: number): void {
    // 检查是否已经展开
    if (!this.table.internalProps.expandedRowsSet.has(recordIndex)) {
      return;
    }

    // 先计算要删除的行索引（必须在删除 expandedRowsSet 记录之前）
    const removeRowIndex = recordIndex + 1;
    // 标记为已收起
    this.table.internalProps.expandedRowsSet.delete(recordIndex);
    
    // 使用 update-height.ts 中的 updateRowHeight 函数来更新整体高度
    // 传入负的高度变化量来减少表格高度
    updateRowHeightForExpand(this.table.scenegraph, removeRowIndex, -260);
    this.table.scenegraph.table.internalProps._heightResizedRowMap.delete(removeRowIndex);
    
    // 关键！更新容器高度，这会触发 updateTableSize() 和 updateScrollBar()
    this.table.scenegraph.updateContainerHeight(removeRowIndex, -260);
    
    // 触发收起事件 - 使用现有的事件类型
    this.table.fireListeners(TABLE_EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE, {
      col: 0,
      row: removeRowIndex,
      hierarchyState: HierarchyState.collapse
    });
  }

  /**
   * 切换指定记录的展开/收起状态
   * @param recordIndex 记录索引
   * @param detailHeight 详情行高度（仅在展开时使用）
   */
  toggleRecord(recordIndex: number, detailHeight?: number): boolean {
    const isExpanded = this.table.internalProps.expandedRowsSet.has(recordIndex);
    if (isExpanded) {
      this.collapseRecord(recordIndex);
      return false;
    } else {
      this.expandRecord(recordIndex, detailHeight);
      return true;
    }
  }

  /**
   * 获取详情行的高度
   * @param recordIndex 记录索引
   * @returns 详情行高度
   */
  private getDetailRowHeight(recordIndex: number): number {
    // 优先使用 API 配置的高度函数
    if (this.table.options.detailRowHeight) {
      if (typeof this.table.options.detailRowHeight === 'function') {
        return (this.table.options.detailRowHeight as any)(recordIndex);
      }
      return this.table.options.detailRowHeight as number;
    }
    
    // 默认高度
    return 200;
  }


  /**
   * 根据行索引获取对应的记录索引（仅对数据行有效）
   * @param row 行索引
   */
  getRecordIndexByRow(row: number): number {
    const headerRowCount = this.table.columnHeaderLevelCount;
    if (row < headerRowCount) {
      return -1;
    }
    return row - headerRowCount;
  }
}
