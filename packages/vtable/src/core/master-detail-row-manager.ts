import type { MasterDetailTable } from '../MasterDetailTable';
import { TABLE_EVENT_TYPE } from './TABLE_EVENT_TYPE';
import { HierarchyState } from '../ts-types';
import { updateRowHeight } from '../scenegraph/layout/update-height';

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

    // 标记为已展开
    this.table.internalProps.expandedRowsSet.add(recordIndex);

    // 计算插入位置：记录行的下一行
    const insertRowIndex = this.getInsertRowIndex(recordIndex);
    
    // 获取详情行高度
    detailHeight = 300;
    const height = detailHeight ?? this.getDetailRowHeight(recordIndex);
    
    // 更新行数 - 插入一个空白行
    this.table.internalProps.rowCount++;
    
    // 使用 scenegraph.updateRow 插入新的空白行
    const addCells = [{ col: 0, row: insertRowIndex }];
    console.log(addCells)
    this.table.scenegraph.updateRow([], addCells, []);
    
    // 获取插入后的当前行高度，计算需要的高度变化量
    const currentHeight = this.table.getRowHeight(insertRowIndex);
    console.log(currentHeight)
    const deltaHeight = height - currentHeight;
    
    // 使用 update-height.ts 中的 updateRowHeight 函数来更新行高度
    updateRowHeight(this.table.scenegraph, insertRowIndex, deltaHeight);
        // 1. 将 Set 转换为数组，以便使用数组方法
    const oldValues = this.table.scenegraph.table.internalProps._heightResizedRowMap;
    const newSet = new Set<number>(); // 创建一个新的 Set 来存放修改后的值

    oldValues.forEach(value => {
        if (value >= insertRowIndex) { // 根据你修正后的逻辑
            newSet.add(value + 1);
        } else {
            newSet.add(value);
        }
    });

    newSet.add(insertRowIndex); // 添加新插入的行索引

    this.table.scenegraph.table.internalProps._heightResizedRowMap = newSet;
    console.log(this.table.scenegraph.table.internalProps._heightResizedRowMap)
    
    // 触发展开事件 - 使用现有的事件类型
    this.table.fireListeners(TABLE_EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE, {
      col: 0,
      row: insertRowIndex,
      hierarchyState: HierarchyState.expand
    });
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
    const removeRowIndex = this.getInsertRowIndex(recordIndex);
    console.log(removeRowIndex)
    // 标记为已收起
    this.table.internalProps.expandedRowsSet.delete(recordIndex);
    
    // 使用 update-height.ts 中的 updateRowHeight 函数来更新整体高度
    // 传入负的高度变化量来减少表格高度
    this.table.scenegraph.table.internalProps._heightResizedRowMap.delete(removeRowIndex);
    // 1. 将 Set 转换为数组，以便使用数组方法
    const valuesAsArray = Array.from(this.table.scenegraph.table.internalProps._heightResizedRowMap);

    // 2. 链式调用 filter 和 map 来处理数据
    const newValues = valuesAsArray
      .filter(value => value !== removeRowIndex)
      .map(value => (value > removeRowIndex ? value - 1 : value));

    // 3. 用处理好的新数组来创建一个全新的 Set，并替换掉旧的
    this.table.scenegraph.table.internalProps._heightResizedRowMap = new Set(newValues);
    console.log(this.table.scenegraph.table.internalProps._heightResizedRowMap)
    // 更新行数 - 删除空白行
    this.table.internalProps.rowCount--;
    
    // 使用 scenegraph.updateRow 删除空白行
    const removeCells = [{ col: 0, row: removeRowIndex }];
    this.table.scenegraph.updateRow(removeCells, [], []);
    
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
   * 计算插入行的索引位置
   * @param recordIndex 记录索引
   * @returns 插入位置的行索引
   */
  private getInsertRowIndex(recordIndex: number): number {
    // 获取基础行位置：表头行数 + 记录索引 + 1（记录行的下一行）
    const headerRowCount = this.table.columnHeaderLevelCount;
    const insertRow = headerRowCount + recordIndex + 1;
    
    // 需要考虑在此记录之前已经展开的行数
    let expandedCount = 0;
    for (let i = 0; i < recordIndex; i++) {
      if (this.table.internalProps.expandedRowsSet.has(i)) {
        expandedCount++;
      }
    }
    
    return insertRow + expandedCount;
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
   * 检查指定行是否是详情行
   * @param row 行索引
   * @returns 是否是详情行
   */
  isDetailRow(row: number): boolean {
    const headerRowCount = this.table.columnHeaderLevelCount;
    
    if (row < headerRowCount) {
      return false;
    }

    const adjustedRow = row - headerRowCount;
    let currentTableRow = 0;
    let recordIndex = 0;
    const expandedRows = this.table.internalProps.expandedRowsSet;

    // 遍历每一行，找到目标行对应的记录
    while (currentTableRow <= adjustedRow && recordIndex < this.table.recordsCount) {
      // 检查是否到达目标行（数据行位置）
      if (currentTableRow === adjustedRow) {
        return false; // 这是数据行，不是详情行
      }
      
      // 移动到下一个表格行（数据行）
      currentTableRow++;
      
      // 如果当前记录是展开的，需要检查详情行
      if (expandedRows.has(recordIndex)) {
        if (currentTableRow === adjustedRow) {
          // 这是详情行
          return true;
        }
        currentTableRow++; // 跳过详情行
      }
      
      recordIndex++;
    }

    return false;
  }

  /**
   * 根据行索引获取对应的记录索引（仅对数据行有效）
   * @param row 行索引
   * @returns 记录索引，如果是详情行则返回 -1
   */
  getRecordIndexByRow(row: number): number {
    const headerRowCount = this.table.columnHeaderLevelCount;
    
    if (row < headerRowCount) {
      return -1;
    }

    const adjustedRow = row - headerRowCount;
    let currentTableRow = 0;
    let recordIndex = 0;
    const expandedRows = this.table.internalProps.expandedRowsSet;

    // 遍历每一行，找到目标行对应的记录
    while (currentTableRow <= adjustedRow && recordIndex < this.table.recordsCount) {
      // 检查是否到达目标行（数据行位置）
      if (currentTableRow === adjustedRow) {
        return recordIndex; // 这是数据行
      }
      
      // 移动到下一个表格行（数据行）
      currentTableRow++;
      
      // 如果当前记录是展开的，需要检查详情行
      if (expandedRows.has(recordIndex)) {
        if (currentTableRow === adjustedRow) {
          // 这是详情行，返回 -1
          return -1;
        }
        currentTableRow++; // 跳过详情行
      }
      
      recordIndex++;
    }

    return -1;
  }
}
