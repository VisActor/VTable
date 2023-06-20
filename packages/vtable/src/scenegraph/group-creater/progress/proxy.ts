import type { BaseTableAPI } from '../../../ts-types/base-table';
import type { Group } from '../../graphic/group';
import type { WrapText } from '../../graphic/text';
import { updateCellHeightForColumn } from '../../layout/update-height';
import type { Scenegraph } from '../../scenegraph';
import { emptyGroup } from '../../scenegraph';
import { getProp } from '../../utils/get-prop';
import { getPadding } from '../../utils/padding';
import { createColGroup } from '../column';
import { createComplexColumn } from '../column-helper';

const mergeMap = new Map();

export class SceneProxy {
  table: BaseTableAPI;
  scenegraph: Scenegraph;
  currentRow = 0;
  totalRow: number;
  rowLimit = 1000;
  yLimitTop: number; // y > yLimitTop动态更新，否则直接修改xy
  yLimitBottom: number; // y < yLimitBottom动态更新，否则直接修改xy
  // bottomOffset: number;
  // scroll
  accurateY = 0;
  rowStart = 0;
  rowEnd = 0;
  referenceRow = 0;

  bodyTopRow: number;
  bodyBottomRow: number;
  bodyLeftCol: number;
  bodyRightCol: number;
  screenRowCount: number;
  firstScreenRowLimit: number;
  taskRowCount: number;
  rowUpdatePos: number;
  rowUpdateDirection: 'up' | 'down';
  screenTopRow: number = 0;
  screenTopRowDeltaY: number;
  y: number;

  cellCache: Map<number, Group> = new Map(); // 单元格位置快速查找缓存

  constructor(table: BaseTableAPI) {
    this.table = table;
    this.scenegraph = table.scenegraph;
  }

  setParams() {
    this.bodyTopRow = this.table.columnHeaderLevelCount;
    this.bodyBottomRow = this.table.rowCount - 1;
    this.bodyLeftCol = 0;
    this.bodyRightCol = this.table.colCount - 1;

    // 计算渐进加载数量
    const totalActualBodyRowCount = Math.min(this.rowLimit, this.bodyBottomRow - this.bodyTopRow + 1);
    this.totalRow = this.bodyTopRow + totalActualBodyRowCount - 1; // 目标渐进完成的row
    this.rowStart = this.bodyTopRow;
    const defaultRowHeight = this.table.defaultRowHeight;
    this.taskRowCount = Math.ceil(this.table.tableNoFrameHeight / defaultRowHeight) * 5;

    // 确定动态更新限制
    const totalBodyHeight = defaultRowHeight * totalActualBodyRowCount;
    const totalHeight = defaultRowHeight * (this.bodyBottomRow - this.bodyTopRow + 1);
    this.yLimitTop = totalBodyHeight / 2;
    this.yLimitBottom = totalHeight - totalBodyHeight / 2;
    // this.bottomOffset = totalHeight - totalBodyHeight / 2;

    // 确定首屏高度范围
    const heightLimit = this.table.tableNoFrameHeight * 5;
    this.screenRowCount = Math.ceil(this.table.tableNoFrameHeight / defaultRowHeight);
    this.firstScreenRowLimit = this.bodyTopRow + Math.ceil(heightLimit / defaultRowHeight);
    // this.firstScreenRowLimit = this.bodyBottomRow;

    this.rowUpdatePos = this.bodyBottomRow;
  }

  async createColGroupForFirstScreen(
    rowHeaderGroup: Group,
    bodyGroup: Group,
    xOrigin: number,
    yOrigin: number,
    table: BaseTableAPI
  ) {
    this.setParams();

    // 生成首屏单元格
    // rowHeader
    createColGroup(
      rowHeaderGroup,
      xOrigin,
      yOrigin,
      0, // colStart
      table.rowHeaderLevelCount - 1, // colEnd
      table.columnHeaderLevelCount, // rowStart
      table.rowCount - 1, // rowEnd
      'rowHeader', // isHeader
      table,
      this.firstScreenRowLimit
    );
    // body
    createColGroup(
      bodyGroup,
      xOrigin,
      yOrigin,
      table.rowHeaderLevelCount, // colStart
      table.colCount - 1, // colEnd
      table.columnHeaderLevelCount, // rowStart
      table.rowCount - 1, // rowEnd
      'body', // isHeader
      table,
      this.firstScreenRowLimit
    );

    // 更新row信息
    if (!bodyGroup.firstChild) {
      // 无数据
      this.currentRow = this.totalRow;
      this.rowEnd = this.currentRow;
      this.rowUpdatePos = this.rowEnd;
      this.referenceRow = Math.floor((this.rowEnd - this.rowStart) / 2);
    } else {
      this.currentRow = (bodyGroup.firstChild.lastChild as Group)?.row ?? this.totalRow;
      this.rowEnd = this.currentRow;
      this.rowUpdatePos = this.rowEnd;
      this.referenceRow = Math.floor((this.rowEnd - this.rowStart) / 2);
      // 开始异步任务
      await this.progress();
    }
  }

  // async progress() {
  //   if (this.rowUpdatePos < this.rowEnd) {
  //     console.log('progress rowUpdatePos', this.rowUpdatePos);
  //     // 先更新
  //     await this.updateCellGroupsAsync();
  //     await this.progress();
  //   } else if (this.currentRow < this.totalRow) {
  //     console.log('progress currentRow', this.currentRow);
  //     // 先更新没有需要更新的节点，在生成新节点
  //     await this.createRow();
  //     await this.progress();
  //   }
  // }
  async progress() {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (this.rowUpdatePos < this.rowEnd) {
          // console.log('progress rowUpdatePos', this.rowUpdatePos);
          // 先更新
          this.updateCellGroupsAsync();
          this.progress();
        } else if (this.currentRow < this.totalRow) {
          // console.log('progress currentRow', this.currentRow);
          // 先更新没有需要更新的节点，在生成新节点
          this.createRow();
          this.progress();
        }

        resolve();
      }, 0);
    });
  }

  async createRow() {
    if (!this.taskRowCount) {
      return;
    }
    console.log('createRow', this.currentRow, this.currentRow + this.taskRowCount);
    this.createRowCellGroup(this.taskRowCount);
  }

  createRowCellGroup(onceCount: number) {
    const endRow = Math.min(this.totalRow, this.currentRow + onceCount);
    for (let col = this.bodyLeftCol; col <= this.bodyRightCol; col++) {
      const colGroup = this.scenegraph.getColGroup(col);
      const cellType = col < this.table.rowHeaderLevelCount ? 'rowHeader' : 'body';
      createComplexColumn(
        colGroup,
        col,
        colGroup.attribute.width,
        this.currentRow + 1,
        endRow,
        mergeMap,
        this.table.internalProps.defaultRowHeight,
        this.table,
        cellType
      );
    }

    if (this.table.internalProps.autoRowHeight) {
      updateAutoRow(
        this.bodyLeftCol, // colStart
        this.bodyRightCol, // colEnd
        this.currentRow + 1, // rowStart
        endRow, // rowEnd
        this.table
      );
    }
    this.currentRow = endRow;
    this.rowEnd = endRow;
    this.rowUpdatePos = this.rowEnd;
    this.referenceRow = Math.floor((endRow - this.rowStart) / 2);
  }

  async setY(y: number) {
    if (y < this.yLimitTop && this.rowStart === this.bodyTopRow) {
      // 执行真实body group坐标修改
      this.scenegraph.setBodyAndRowHeaderY(-y);
    } else if (y > this.yLimitBottom && this.rowEnd === this.bodyBottomRow) {
      // 执行真实body group坐标修改
      this.scenegraph.setBodyAndRowHeaderY(-y);
    } else {
      // 执行动态更新节点
      this.dynamicSetY(y);
    }
  }

  async dynamicSetY(y: number) {
    // 计算变动row range
    // const screenTopRow = this.table.getRowAt(y).row;
    const screenTop = (this.table as any).getTargetRowAt(y + this.table.scenegraph.colHeaderGroup.attribute.height);
    if (!screenTop) {
      return;
    }
    const screenTopRow = screenTop.row;
    this.y = y;
    this.screenTopRow = screenTopRow;
    // this.screenTopRowDeltaY = y - this.table.getRowsHeight(this.bodyTopRow, screenTopRow - 1);
    const deltaRow = screenTopRow - this.referenceRow;
    if (deltaRow > 0) {
      // 向下滚动，顶部cell group移到底部
      this.moveCell(deltaRow, 'up', screenTopRow);
      this.updateBody(y);
      // if (this.rowEnd === this.table.scenegraph.proxy.bodyBottomRow) {
      //   const totalHeight = this.table.getAllRowsHeight();
      //   const top = totalHeight - this.table.scenegraph.height;
      //   this.updateBody(top);
      // } else {
      //   this.updateBody(y);
      // }
    } else if (deltaRow < 0) {
      // 向上滚动，底部cell group移到顶部
      this.moveCell(-deltaRow, 'down', screenTopRow);
      this.updateBody(y);
      // if (this.rowStart === this.bodyTopRow) {
      //   this.updateBody(0);
      // } else {
      //   this.updateBody(y);
      // }
    } else {
      // 不改变row，更新body group范围
      this.updateBody(y);
    }

    this.scenegraph.updateNextFrame();
  }

  updateBody(y: number) {
    this.scenegraph.setBodyAndRowHeaderY(-y);
  }

  async moveCell(count: number, direction: 'up' | 'down', screenTopRow: number) {
    // 限制count范围
    if (direction === 'up' && this.rowEnd + count > this.bodyBottomRow) {
      count = this.bodyBottomRow - this.rowEnd;
    } else if (direction === 'down' && this.rowStart - count < this.bodyTopRow) {
      count = this.rowStart - this.bodyTopRow;
    }

    // 两种更新模式
    // 1. count < rowEnd - rowStart：从顶/底部移动count数量的单元格到底/顶部
    // 2. count >= rowEnd - rowStart：整体移动到目标位置
    if (count < this.rowEnd - this.rowStart) {
      // 计算更新区域
      const startRow = direction === 'up' ? this.rowStart : this.rowEnd - count + 1;
      const endRow = direction === 'up' ? this.rowStart + count - 1 : this.rowEnd;
      // console.log('move', startRow, endRow, direction);
      for (let col = this.bodyLeftCol; col <= this.bodyRightCol; col++) {
        const colGroup = this.scenegraph.getColGroup(col);
        for (let row = startRow; row <= endRow; row++) {
          if (direction === 'up') {
            const cellGroup = colGroup.firstChild as Group;
            this.updateCellGroupPosition(
              cellGroup,
              (colGroup.lastChild as Group).row + 1,
              (colGroup.lastChild as Group).attribute.y + (colGroup.lastChild as Group).attribute.height
            );
            colGroup.appendChild(cellGroup);
          } else {
            const cellGroup = colGroup.lastChild as Group;
            this.updateCellGroupPosition(
              cellGroup,
              (colGroup.firstChild as Group).row - 1,
              (colGroup.firstChild as Group).attribute.y - cellGroup.attribute.height
            );
            colGroup.insertBefore(cellGroup, colGroup.firstChild);
          }
        }
      }
      const distStartRow = direction === 'up' ? this.rowEnd + 1 : this.rowStart - count;
      const distEndRow = direction === 'up' ? this.rowEnd + count : this.rowStart - 1;

      // 更新同步范围
      const syncTopRow = Math.max(this.bodyTopRow, screenTopRow - this.screenRowCount * 2);
      const syncBottomRow = Math.min(this.bodyBottomRow, screenTopRow + this.screenRowCount * 3);
      for (let col = this.bodyLeftCol; col <= this.bodyRightCol; col++) {
        for (let row = syncTopRow; row <= syncBottomRow; row++) {
          // const cellGroup = this.table.scenegraph.getCell(col, row);
          const cellGroup = this.highPerformanceGetCell(col, row, distStartRow, distEndRow);
          this.updateCellGroupContent(cellGroup);
        }
      }
      if (this.table.internalProps.autoRowHeight) {
        updateAutoRow(
          this.bodyLeftCol, // colStart
          this.bodyRightCol, // colEnd
          syncTopRow, // rowStart
          syncBottomRow, // rowEnd
          this.table,
          direction
        );
      }

      this.rowStart = direction === 'up' ? this.rowStart + count : this.rowStart - count;
      this.rowEnd = direction === 'up' ? this.rowEnd + count : this.rowEnd - count;
      this.currentRow = direction === 'up' ? this.currentRow + count : this.currentRow - count;
      this.totalRow = direction === 'up' ? this.totalRow + count : this.totalRow - count;
      this.referenceRow = this.rowStart + Math.floor((this.rowEnd - this.rowStart) / 2);
      this.rowUpdatePos = distStartRow;
      this.rowUpdateDirection = direction;
      console.log('move end proxy', this.rowStart, this.rowEnd);
      console.log(
        'move end cell',
        (this.table as any).scenegraph.bodyGroup.firstChild.firstChild.row,
        (this.table as any).scenegraph.bodyGroup.firstChild.lastChild.row
      );

      this.table.scenegraph.stage.render();
      await this.progress();
    } else {
      const distStartRow = direction === 'up' ? this.rowStart + count : this.rowStart - count;
      const distEndRow = direction === 'up' ? this.rowEnd + count : this.rowEnd - count;
      const distStartRowY = this.table.getRowsHeight(this.bodyTopRow, distStartRow - 1);
      for (let col = this.bodyLeftCol; col <= this.bodyRightCol; col++) {
        const colGroup = this.scenegraph.getColGroup(col);
        colGroup.forEachChildren((cellGroup: Group, index) => {
          // 这里使用colGroup变量而不是for this.rowStart to this.rowEndthis.rowEnd是因为在更新内可能出现row号码重复的情况
          this.updateCellGroupPosition(
            cellGroup,
            direction === 'up' ? cellGroup.row + count : cellGroup.row - count,
            index === 0 // row === this.rowStart
              ? distStartRowY
              : (cellGroup._prev as Group).attribute.y + (cellGroup._prev as Group).attribute.height
          );
        });
      }

      // 更新同步范围
      let syncTopRow;
      let syncBottomRow;
      if (this.table.internalProps.autoRowHeight) {
        syncTopRow = distStartRow;
        syncBottomRow = distEndRow;
      } else {
        syncTopRow = Math.max(this.bodyTopRow, screenTopRow - this.screenRowCount * 2);
        syncBottomRow = Math.min(this.bodyBottomRow, screenTopRow + this.screenRowCount * 3);
      }
      console.log('更新同步范围', syncTopRow, syncBottomRow);
      for (let col = this.bodyLeftCol; col <= this.bodyRightCol; col++) {
        for (let row = syncTopRow; row <= syncBottomRow; row++) {
          // const cellGroup = this.table.scenegraph.getCell(col, row);
          const cellGroup = this.highPerformanceGetCell(col, row, distStartRow, distEndRow);
          this.updateCellGroupContent(cellGroup);
        }
      }
      console.log('updateAutoRow', distEndRow > this.bodyBottomRow - (this.rowEnd - this.rowStart + 1) ? 'down' : 'up');

      if (this.table.internalProps.autoRowHeight) {
        updateAutoRow(
          this.bodyLeftCol, // colStart
          this.bodyRightCol, // colEnd
          syncTopRow, // rowStart
          syncBottomRow, // rowEnd
          this.table,
          distEndRow > this.bodyBottomRow - (this.rowEnd - this.rowStart + 1) ? 'down' : 'up' // 跳转到底部时，从下向上对齐
        );
      }

      this.rowStart = distStartRow;
      this.rowEnd = distEndRow;
      this.currentRow = direction === 'up' ? this.currentRow + count : this.currentRow - count;
      this.totalRow = direction === 'up' ? this.totalRow + count : this.totalRow - count;
      this.referenceRow = this.rowStart + Math.floor((this.rowEnd - this.rowStart) / 2);
      this.rowUpdatePos = this.rowStart;
      this.rowUpdateDirection = distEndRow > this.bodyBottomRow - (this.rowEnd - this.rowStart + 1) ? 'down' : 'up';
      console.log('move total end proxy', this.rowStart, this.rowEnd);
      console.log(
        'move total end cell',
        (this.table as any).scenegraph.bodyGroup.firstChild.firstChild.row,
        (this.table as any).scenegraph.bodyGroup.firstChild.lastChild.row
      );

      if (!this.table.internalProps.autoRowHeight) {
        await this.progress();
      }
    }
  }

  async updateCellGroupsAsync() {
    this.updateCellGroups(this.taskRowCount);
  }

  updateCellGroups(count: number) {
    const distRow = Math.min(this.bodyBottomRow, this.rowUpdatePos + count);
    console.log('updateCellGroups', this.rowUpdatePos, distRow);
    for (let col = this.bodyLeftCol; col <= this.bodyRightCol; col++) {
      for (let row = this.rowUpdatePos; row <= distRow; row++) {
        // const cellGroup = this.table.scenegraph.getCell(col, row);
        const cellGroup = this.highPerformanceGetCell(col, row);
        this.updateCellGroupContent(cellGroup);
      }
    }

    if (this.table.internalProps.autoRowHeight) {
      updateAutoRow(
        this.bodyLeftCol, // colStart
        this.bodyRightCol, // colEnd
        this.rowUpdatePos, // rowStart
        distRow, // rowEnd
        this.table,
        this.rowUpdateDirection
      );
    }

    this.rowUpdatePos = distRow + 1;
  }

  updateCellGroupPosition(cellGroup: Group, newRow: number, y: number) {
    // 更新位置&row
    cellGroup.row = newRow;
    cellGroup.setAttribute('y', y);
    (cellGroup as any).needUpdate = true;
    (cellGroup as any).needUpdateForAutoRowHeight = true;
  }

  updateCellGroupContent(cellGroup: Group) {
    if (!cellGroup.needUpdate) {
      return;
    }

    this.scenegraph.updateCellContent(cellGroup.col, cellGroup.row);
    // 更新内容
    // const textMark = cellGroup.firstChild as WrapText;
    // const autoWrapText = Array.isArray(textMark.attribute.text);
    // const textStr: string = this.table.getCellValue(cellGroup.col, cellGroup.row);
    // let text;
    // if (autoWrapText) {
    //   text = String(textStr).replace(/\r?\n/g, '\n').replace(/\r/g, '\n').split('\n');
    // } else {
    //   text = textStr;
    // }

    // textMark.setAttribute('text', text);

    cellGroup.needUpdate = false;
  }

  async sortCell() {
    for (let col = this.bodyLeftCol; col <= this.bodyRightCol; col++) {
      for (let row = this.rowStart; row <= this.rowEnd; row++) {
        // const cellGroup = this.table.scenegraph.getCell(col, row);
        const cellGroup = this.highPerformanceGetCell(col, row);
        cellGroup.needUpdate = true;
      }
    }

    // 更新同步范围
    let syncTopRow;
    let syncBottomRow;
    if (this.table.internalProps.autoRowHeight) {
      syncTopRow = this.rowStart;
      syncBottomRow = this.rowEnd;
    } else {
      syncTopRow = Math.max(this.bodyTopRow, this.screenTopRow - this.screenRowCount * 2);
      syncBottomRow = Math.min(this.bodyBottomRow, this.screenTopRow + this.screenRowCount * 3);
    }
    console.log('sort更新同步范围', syncTopRow, syncBottomRow);
    for (let col = this.bodyLeftCol; col <= this.bodyRightCol; col++) {
      for (let row = syncTopRow; row <= syncBottomRow; row++) {
        // const cellGroup = this.table.scenegraph.getCell(col, row);
        const cellGroup = this.highPerformanceGetCell(col, row);
        this.updateCellGroupContent(cellGroup);
      }
    }
    console.log('updateAutoRow', this.rowEnd > this.bodyBottomRow - (this.rowEnd - this.rowStart + 1) ? 'down' : 'up');
    if (this.table.internalProps.autoRowHeight) {
      updateAutoRow(
        this.bodyLeftCol, // colStart
        this.bodyRightCol, // colEnd
        syncTopRow, // rowStart
        syncBottomRow, // rowEnd
        this.table,
        this.rowEnd > this.bodyBottomRow - (this.rowEnd - this.rowStart + 1) ? 'down' : 'up' // 跳转到底部时，从下向上对齐
      );
    }
    this.rowUpdatePos = this.rowStart;
    this.rowUpdateDirection = this.rowEnd > this.bodyBottomRow - (this.rowEnd - this.rowStart + 1) ? 'down' : 'up';

    if (
      this.rowEnd === this.table.scenegraph.proxy.bodyBottomRow &&
      this.rowStart === this.table.scenegraph.proxy.bodyTopRow
    ) {
      // 全量更新，do nothing
    } else if (this.rowEnd === this.table.scenegraph.proxy.bodyBottomRow) {
      const totalHeight = this.table.getAllRowsHeight();
      const top = totalHeight - this.table.scenegraph.height;
      this.updateBody(top);
    } else if (this.rowStart === this.table.scenegraph.proxy.bodyTopRow) {
      this.updateBody(0);
    }

    if (!this.table.internalProps.autoRowHeight) {
      await this.progress();
    }
  }

  highPerformanceGetCell(col: number, row: number, rowStart: number = this.rowStart, rowEnd: number = this.rowEnd) {
    if (row < rowStart || row > rowEnd) {
      return emptyGroup;
    }
    if (this.cellCache.get(col)) {
      const cacheCellGoup = this.cellCache.get(col);
      if ((cacheCellGoup._next || cacheCellGoup._prev) && Math.abs(cacheCellGoup.row - row) < row) {
        // 由缓存单元格向前后查找要快于从头查找
        let cellGroup = getCellByCache(cacheCellGoup, row);
        if (!cellGroup) {
          cellGroup = this.scenegraph.getCell(col, row);
        }
        cellGroup.row && this.cellCache.set(col, cellGroup);
        return cellGroup;
      }
      const cellGroup = this.scenegraph.getCell(col, row);
      cellGroup.row && this.cellCache.set(col, cellGroup);
      return cellGroup;
    }
    const cellGroup = this.scenegraph.getCell(col, row);
    cellGroup.row && this.cellCache.set(col, cellGroup);
    return cellGroup;
  }
}

function updateAutoRow(
  colStart: number,
  colEnd: number,
  rowStart: number,
  rowEnd: number,
  table: BaseTableAPI,
  direction: 'up' | 'down' = 'up'
) {
  // 获取行高
  for (let row = rowStart; row <= rowEnd; row++) {
    let maxRowHeight = 0;
    for (let col = colStart; col <= colEnd; col++) {
      const cellGroup = table.scenegraph.getCell(col, row);
      if (!cellGroup.row) {
        continue;
      }
      // const contentHeight = cellGroup.getContentHeight();
      const text = (cellGroup.getChildByName('text') as WrapText) || cellGroup.getChildByName('content');
      const headerStyle = table._getCellStyle(col, row);
      const padding = getPadding(getProp('padding', headerStyle, col, row, table));
      const height = text.AABBBounds.height() + (padding[0] + padding[2]);
      maxRowHeight = Math.max(maxRowHeight, height);
      (cellGroup as any).needUpdateForAutoRowHeight = false;
    }
    // updateRowHeight(table.scenegraph, row, table.getRowHeight(row) - maxRowHeight);
    for (let col = colStart; col <= colEnd; col++) {
      const cellGroup = table.scenegraph.getCell(col, row);
      updateCellHeightForColumn(table.scenegraph, cellGroup, col, row, maxRowHeight, 0, false);
    }

    table.setRowHeight(row, maxRowHeight, true);
  }

  // 更新y位置
  if (direction === 'up') {
    for (let col = colStart; col <= colEnd; col++) {
      for (let row = rowStart; row <= rowEnd; row++) {
        const cellGroup = table.scenegraph.getCell(col, row);
        if (!cellGroup.row) {
          continue;
        }
        let y;
        if (cellGroup._prev) {
          y = ((cellGroup._prev as Group)?.attribute.y ?? 0) + ((cellGroup._prev as Group)?.attribute.height ?? 0);
        } else {
          // 估计位置
          y = table.getRowsHeight(table.columnHeaderLevelCount, cellGroup.row - 1);
        }
        cellGroup.setAttribute('y', y);
      }
    }
  } else {
    for (let col = colStart; col <= colEnd; col++) {
      for (let row = rowEnd; row >= rowStart; row--) {
        const cellGroup = table.scenegraph.getCell(col, row);
        if (!cellGroup.row) {
          continue;
        }
        let y;
        if (cellGroup._next) {
          y = ((cellGroup._next as Group)?.attribute.y ?? 0) - (cellGroup.attribute.height ?? 0);
        } else {
          // 估计位置
          y = table.getRowsHeight(table.columnHeaderLevelCount, cellGroup.row) - (cellGroup.attribute.height ?? 0);
          console.log('估计位置', table.getRowsHeight(table.columnHeaderLevelCount, cellGroup.row));
        }
        cellGroup.setAttribute('y', y);
      }
    }
  }
}

function getCellByCache(cacheCellGroup: Group, row: number): Group | null {
  if (!cacheCellGroup) {
    return null;
  }
  if (cacheCellGroup.row === row) {
    return cacheCellGroup;
  } else if (cacheCellGroup.row > row) {
    return getCellByCache(cacheCellGroup._prev as Group, row);
  }
  return getCellByCache(cacheCellGroup._next as Group, row);
}
