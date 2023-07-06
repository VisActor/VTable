import type { BaseTableAPI } from '../../../ts-types/base-table';
import { Group } from '../../graphic/group';
import { computeColsWidth } from '../../layout/compute-col-width';
import { computeRowsHeight } from '../../layout/compute-row-height';
import { emptyGroup } from '../../utils/empty-group';
import { createColGroup } from '../column';
import { createComplexColumn } from '../column-helper';
import { dynamicSetX } from './update-position/dynamic-set-x';
import { dynamicSetY } from './update-position/dynamic-set-y';
import { updateAutoRow } from './update-position/update-auto-row';

export class SceneProxy {
  table: BaseTableAPI;
  mode: 'column' | 'row' | 'pivot' = 'column';

  rowLimit = 1000;
  currentRow = 0; // 目前渐进生成的row number
  totalRow: number; // 渐进完成最后一行的row number
  yLimitTop: number; // y > yLimitTop动态更新，否则直接修改xy
  yLimitBottom: number; // y < yLimitBottom动态更新，否则直接修改xy
  rowStart = 0; // 当前维护的部分第一行的row number
  rowEnd = 0; // 当前维护的部分最后一行的row number
  referenceRow = 0; // 当前维护的部分中间一行的row number，认为referenceRow对应当前屏幕显示范围的第一行
  bodyTopRow: number; // table body部分的第一行row number
  bodyBottomRow: number; // table body部分的最后一行row number
  screenRowCount: number; // 预计屏幕范围内显示的row count
  firstScreenRowLimit: number; // 首屏同步加载部分最后一行的row number
  taskRowCount: number; // 一次任务生成/更新的row count
  rowUpdatePos: number; // 异步任务目前更新到的行的row number
  rowUpdateDirection: 'up' | 'down'; // 当前行更新的方向
  screenTopRow: number = 0; // 当前屏幕范围内显示的第一行的row number

  colLimit = 1000;
  bodyLeftCol: number; // table body部分的第一列col number
  bodyRightCol: number; // table body部分的最后一列col number
  totalCol: number; // 渐进完成最后一列的col number
  colStart: number; // 当前维护的部分第一列的col number
  colEnd: number; // 当前维护的部分最后一列的col number
  taskColCount: number; // 一次任务生成/更新的col count
  xLimitLeft: number; // x > xLimitLeft动态更新，否则直接修改xy
  xLimitRight: number; // x < xLimitRight动态更新，否则直接修改xy
  screenColCount: number; // 预计屏幕范围内显示的col count
  firstScreenColLimit: number; // 首屏同步加载部分最后一列的col number
  colUpdatePos: number; // 异步任务目前更新到的列的col number
  currentCol: number; // 目前渐进生成的col number
  referenceCol: number; // 当前维护的部分中间一列的col number，认为referenceCol对应当前屏幕显示范围的第一列
  screenLeftCol: number = 0; // 当前屏幕范围内显示的第一列的col number
  colUpdateDirection: 'left' | 'right'; // 当前列更新方向

  cellCache: Map<number, Group> = new Map(); // 单元格位置快速查找缓存

  constructor(table: BaseTableAPI) {
    this.table = table;

    if (this.table.internalProps.transpose) {
      this.mode = 'row';
    } else if (this.table.isPivotTable()) {
      this.mode = 'pivot';
    }
    if (this.table.options.maintainedDataCount) {
      this.rowLimit = this.table.options.maintainedDataCount;
    }
  }

  setParamsForColumn() {
    this.bodyLeftCol = this.table.rowHeaderLevelCount;
    this.bodyRightCol = this.table.colCount - 1;

    // compute the column info about progress creation
    const totalActualBodyColCount = Math.min(this.colLimit, this.bodyRightCol - this.bodyLeftCol + 1);
    this.totalCol = this.bodyLeftCol + totalActualBodyColCount - 1; // 目标渐进完成的col
    this.colStart = this.bodyLeftCol;
    const defaultColWidth = this.table.defaultColWidth;
    this.taskColCount = Math.ceil(this.table.tableNoFrameWidth / defaultColWidth) * 1;

    // 确定动态更新限制
    const totalBodyWidth = defaultColWidth * totalActualBodyColCount;
    const totalWidth = defaultColWidth * (this.bodyRightCol - this.bodyLeftCol + 1);
    this.xLimitLeft = totalBodyWidth / 2;
    this.xLimitRight = totalWidth - totalBodyWidth / 2;

    // 确定首屏高度范围
    const widthLimit = this.table.tableNoFrameWidth * 5;
    this.screenColCount = Math.ceil(this.table.tableNoFrameWidth / defaultColWidth);
    this.firstScreenColLimit = this.bodyLeftCol + Math.ceil(widthLimit / defaultColWidth);
    // this.firstScreenRowLimit = this.bodyBottomRow;

    this.colUpdatePos = this.bodyRightCol;
  }

  setParamsForRow() {
    this.bodyTopRow = this.table.columnHeaderLevelCount;
    this.bodyBottomRow = this.table.rowCount - 1;
    this.bodyLeftCol = 0;
    this.bodyRightCol = this.table.colCount - 1;

    // 计算渐进加载数量
    const totalActualBodyRowCount = Math.min(this.rowLimit, this.bodyBottomRow - this.bodyTopRow + 1); // 渐进加载总row数量
    this.totalRow = this.bodyTopRow + totalActualBodyRowCount - 1; // 目标渐进完成的row
    this.rowStart = this.bodyTopRow;
    const defaultRowHeight = this.table.defaultRowHeight;
    this.taskRowCount = Math.ceil(this.table.tableNoFrameHeight / defaultRowHeight) * 1;

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

  async createGroupForFirstScreen(
    cornerHeaderGroup: Group,
    colHeaderGroup: Group,
    rowHeaderGroup: Group,
    bodyGroup: Group,
    xOrigin: number,
    yOrigin: number
  ) {
    // compute parameters
    this.setParamsForRow();
    this.setParamsForColumn();

    // compute colums width in first screen
    this.table.internalProps._colWidthsMap.clear();
    this.table._clearColRangeWidthsMap();
    computeColsWidth(this.table, 0, Math.min(this.firstScreenColLimit, this.table.colCount - 1));

    // compute rows height in first screen
    this.table.internalProps._rowHeightsMap.clear();
    this.table._clearRowRangeHeightsMap();
    computeRowsHeight(this.table, 0, Math.min(this.firstScreenRowLimit, this.table.rowCount - 1));

    // create cornerHeaderGroup
    createColGroup(
      cornerHeaderGroup,
      xOrigin,
      yOrigin,
      0, // colStart
      this.table.rowHeaderLevelCount - 1, // colEnd
      0, // rowStart
      this.table.columnHeaderLevelCount - 1, // rowEnd
      'cornerHeader', // CellType
      this.table
    );

    // create colHeaderGroup
    createColGroup(
      colHeaderGroup,
      xOrigin,
      yOrigin,
      this.table.rowHeaderLevelCount, // colStart
      Math.min(this.firstScreenColLimit, this.table.colCount - 1), // colEnd
      0, // rowStart
      this.table.columnHeaderLevelCount - 1, // rowEnd
      'columnHeader', // isHeader
      this.table
    );

    // create rowHeaderGroup
    createColGroup(
      rowHeaderGroup,
      xOrigin,
      yOrigin,
      0, // colStart
      this.table.rowHeaderLevelCount - 1, // colEnd
      this.table.columnHeaderLevelCount, // rowStart
      Math.min(this.firstScreenRowLimit, this.table.rowCount - 1), // rowEnd
      'rowHeader', // isHeader
      this.table
    );

    // create bodyGroup
    createColGroup(
      bodyGroup,
      xOrigin,
      yOrigin,
      this.table.rowHeaderLevelCount, // colStart
      Math.min(this.firstScreenColLimit, this.table.colCount - 1), // colEnd
      this.table.columnHeaderLevelCount, // rowStart
      Math.min(this.firstScreenRowLimit, this.table.rowCount - 1), // rowEnd
      'body', // isHeader
      this.table
    );

    // update progress information
    if (!bodyGroup.firstChild) {
      // 无数据
      this.currentRow = this.totalRow;
      this.rowEnd = this.currentRow;
      this.rowUpdatePos = this.rowEnd;
      this.referenceRow = Math.floor((this.rowEnd - this.rowStart) / 2);

      this.currentCol = this.totalCol;
      this.colEnd = this.currentCol;
      this.colUpdatePos = this.colEnd;
      this.referenceCol = Math.floor((this.colEnd - this.colStart) / 2);
    } else {
      this.currentRow = (bodyGroup.firstChild as Group)?.rowNumber ?? this.totalRow;
      this.rowEnd = this.currentRow;
      this.rowUpdatePos = this.rowEnd;
      this.referenceRow = Math.floor((this.rowEnd - this.rowStart) / 2);

      this.currentCol = (bodyGroup.lastChild as Group)?.col ?? this.totalCol;
      this.colEnd = this.currentCol;
      this.colUpdatePos = this.colEnd;
      this.referenceCol = Math.floor((this.colEnd - this.colStart) / 2);

      // 开始异步任务
      await this.progress();
    }
  }

  async createColGroupForFirstScreen(
    rowHeaderGroup: Group,
    bodyGroup: Group,
    xOrigin: number,
    yOrigin: number,
    table: BaseTableAPI
  ) {
    this.setParamsForRow();
    this.setParamsForColumn();

    // compute row height in first screen
    computeRowsHeight(table, this.table.columnHeaderLevelCount, Math.min(this.firstScreenRowLimit, table.rowCount - 1));

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
      this.currentRow = (bodyGroup.firstChild as Group)?.rowNumber ?? this.totalRow;
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
      setTimeout(async () => {
        if (this.colUpdatePos < this.colEnd) {
          await this.updateColCellGroupsAsync();
          await this.progress();
        } else if (this.rowUpdatePos < this.rowEnd) {
          // console.log('progress rowUpdatePos', this.rowUpdatePos);
          // 先更新
          await this.updateRowCellGroupsAsync();
          await this.progress();
        } else if (this.currentCol < this.totalCol) {
          await this.createCol();
          await this.progress();
        } else if (this.currentRow < this.totalRow) {
          // console.log('progress currentRow', this.currentRow);
          // 先更新没有需要更新的节点，在生成新节点
          await this.createRow();
          await this.progress();
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

  async createCol() {
    if (!this.taskColCount) {
      return;
    }
    console.log('createCol', this.currentCol, this.currentCol + this.taskColCount);
    this.createColGroup(this.taskRowCount);
  }

  createRowCellGroup(onceCount: number) {
    const endRow = Math.min(this.totalRow, this.currentRow + onceCount);
    // compute rows height
    computeRowsHeight(this.table, this.currentRow + 1, endRow);

    // create row cellGroup
    let maxHeight = 0;
    for (let col = this.bodyLeftCol; col <= this.bodyRightCol; col++) {
      const colGroup = this.table.scenegraph.getColGroup(col);
      const cellType = col < this.table.rowHeaderLevelCount ? 'rowHeader' : 'body';
      const { height } = createComplexColumn(
        colGroup,
        col,
        colGroup.attribute.width,
        this.currentRow + 1,
        endRow,
        this.table.scenegraph.mergeMap,
        this.table.internalProps.defaultRowHeight,
        this.table,
        cellType
      );
      maxHeight = Math.max(maxHeight, height);
    }
    this.table.scenegraph.bodyGroup.setAttribute('height', maxHeight);

    this.currentRow = endRow;
    this.rowEnd = endRow;
    this.rowUpdatePos = this.rowEnd;
    this.referenceRow = Math.floor((endRow - this.rowStart) / 2);

    // update container group size and border
    this.table.scenegraph.updateContainer();
    this.table.scenegraph.updateBorderSizeAndPosition();
  }

  createColGroup(onceCount: number) {
    // compute rows height
    const endCol = Math.min(this.totalCol, this.currentCol + onceCount);
    computeColsWidth(this.table, this.currentCol + 1, endCol);

    // create colGroup
    const lastColumnGroup = (
      this.table.scenegraph.bodyGroup.lastChild instanceof Group
        ? this.table.scenegraph.bodyGroup.lastChild
        : this.table.scenegraph.bodyGroup.lastChild._prev
    ) as Group;
    const xOrigin = lastColumnGroup.attribute.x + lastColumnGroup.attribute.width;
    const yOrigin = lastColumnGroup.attribute.y;
    // create bodyGroup
    createColGroup(
      this.table.scenegraph.bodyGroup,
      xOrigin,
      yOrigin,
      this.currentCol + 1, // colStart
      endCol, // colEnd
      this.rowStart, // rowStart
      this.rowEnd, // rowEnd
      'body', // isHeader
      this.table
    );

    this.currentCol = endCol;
    this.colEnd = endCol;
    this.colUpdatePos = this.colEnd;
    this.referenceCol = Math.floor((endCol - this.colStart) / 2);
    console.log('async', this.referenceCol, this.colStart, this.colEnd);

    // update container group size and border
    this.table.scenegraph.updateContainer();
    this.table.scenegraph.updateBorderSizeAndPosition();
  }

  async setY(y: number) {
    if (y < this.yLimitTop && this.rowStart === this.bodyTopRow) {
      // 执行真实body group坐标修改
      this.table.scenegraph.setBodyAndRowHeaderY(-y);
    } else if (y > this.yLimitBottom && this.rowEnd === this.bodyBottomRow) {
      // 执行真实body group坐标修改
      this.table.scenegraph.setBodyAndRowHeaderY(-y);
    } else {
      // 执行动态更新节点
      this.dynamicSetY(y);
    }
  }

  async setX(x: number) {
    if (x < this.xLimitLeft && this.colStart === this.bodyLeftCol) {
      // 执行真实body group坐标修改
      this.table.scenegraph.setBodyAndColHeaderX(-x);
    } else if (x > this.xLimitRight && this.colEnd === this.bodyRightCol) {
      // 执行真实body group坐标修改
      this.table.scenegraph.setBodyAndColHeaderX(-x);
    } else {
      // 执行动态更新节点
      this.dynamicSetX(x);
    }
  }

  async dynamicSetY(y: number) {
    dynamicSetY(y, this);
  }
  async dynamicSetX(x: number) {
    dynamicSetX(x, this);
  }

  updateBody(y: number) {
    this.table.scenegraph.setBodyAndRowHeaderY(-y);
  }

  async updateRowCellGroupsAsync() {
    this.updateCellGroups(this.taskRowCount);
  }

  updateCellGroups(count: number) {
    const distRow = Math.min(this.bodyBottomRow, this.rowUpdatePos + count);
    // console.log('updateCellGroups', this.rowUpdatePos, distRow);
    if (this.table.internalProps.autoRowHeight) {
      computeRowsHeight(this.table, this.rowUpdatePos, distRow);
    }
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

  async updateColCellGroupsAsync() {
    this.updateColGroups(this.taskRowCount);
  }

  updateColGroups(count: number) {
    const distCol = Math.min(this.bodyRightCol, this.colUpdatePos + count);
    // console.log('updateCellGroups', this.colUpdatePos, distCol);
    for (let col = this.colUpdatePos; col <= distCol; col++) {
      const colGroup = this.table.scenegraph.getColGroup(col);
      if (colGroup) {
        // colGroup.forEachChildren((cellGroup: Group) => {
        //   this.updateCellGroupContent(cellGroup);
        // });
        // for (let row = (colGroup.firstChild as Group).row; row <= (colGroup.lastChild as Group).row; row++) {
        //   const cellGroup = this.highPerformanceGetCell(colGroup.col, row);
        //   this.updateCellGroupContent(cellGroup);
        // }
        let cellGroup = colGroup.firstChild;
        while (cellGroup) {
          // this.updateCellGroupContent(cellGroup as Group);
          // cellGroup = cellGroup._next;
          const newCellGroup = this.updateCellGroupContent(cellGroup as Group);
          cellGroup = newCellGroup._next;
        }
        colGroup.needUpdate = false;
      }
    }
    this.colUpdatePos = distCol + 1;
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
      return cellGroup;
    }

    const newCellGroup = this.table.scenegraph.updateCellContent(cellGroup.col, cellGroup.row);
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
    return newCellGroup || cellGroup;
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
    if (this.table.internalProps.autoRowHeight) {
      computeRowsHeight(this.table, syncTopRow, syncBottomRow);
    }
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

  highPerformanceGetCell(
    col: number,
    row: number,
    rowStart: number = this.rowStart,
    rowEnd: number = this.rowEnd,
    getShadow?: boolean
  ) {
    if (row < rowStart || row > rowEnd) {
      return emptyGroup;
    }
    if (this.cellCache.get(col)) {
      const cacheCellGoup = this.cellCache.get(col);
      if ((cacheCellGoup._next || cacheCellGoup._prev) && Math.abs(cacheCellGoup.row - row) < row) {
        // 由缓存单元格向前后查找要快于从头查找
        let cellGroup = getCellByCache(cacheCellGoup, row);
        if (!cellGroup) {
          cellGroup = this.table.scenegraph.getCell(col, row, getShadow);
        }
        cellGroup.row && this.cellCache.set(col, cellGroup);
        return cellGroup;
      }
      const cellGroup = this.table.scenegraph.getCell(col, row, getShadow);
      cellGroup.row && this.cellCache.set(col, cellGroup);
      return cellGroup;
    }
    const cellGroup = this.table.scenegraph.getCell(col, row, getShadow);
    cellGroup.row && this.cellCache.set(col, cellGroup);
    return cellGroup;
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
