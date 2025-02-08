import { isNumber, isValid } from '@visactor/vutils';
import type { BaseTableAPI } from '../../../ts-types/base-table';
import { Group } from '../../graphic/group';
import { computeColsWidth } from '../../layout/compute-col-width';
import { computeRowsHeight } from '../../layout/compute-row-height';
import { emptyGroup } from '../../utils/empty-group';
import { createColGroup } from '../column';
import { createComplexColumn } from '../column-helper';
import { createGroupForFirstScreen } from './create-group-for-first-screen';
import { dynamicSetX, updateColContent } from './update-position/dynamic-set-x';
import { dynamicSetY, updateRowContent } from './update-position/dynamic-set-y';
import { updateAutoRow } from './update-position/update-auto-row';
import { sortVertical } from './update-position/sort-vertical';
import { sortHorizontal } from './update-position/sort-horizontal';
import { updateAutoColumn } from './update-position/update-auto-column';
import { getDefaultHeight, getDefaultWidth } from './default-width-height';
import { handleTextStick } from '../../stick-text';
import type { ColumnInfo, RowInfo } from '../../../ts-types';

export class SceneProxy {
  table: BaseTableAPI;
  isRelease: boolean = false;
  mode: 'column' | 'row' | 'pivot' = 'column';
  isProgressing: boolean;

  rowLimit = 200;
  currentRow = 0; // 目前渐进生成的row number
  totalRow: number; // 渐进完成最后一行的row number
  yLimitTop: number; // y > yLimitTop动态更新，否则直接修改xy
  yLimitBottom: number; // y < yLimitBottom动态更新，否则直接修改xy
  rowStart = 0; // 当前维护的部分第一行的row number
  rowEnd = 0; // 当前维护的部分最后一行的row number
  referenceRow = 0; // 当前维护的部分中间一行的row number，认为referenceRow对应当前屏幕显示范围的第一行
  // bodyTopRow: number; // table body部分的第一行row number
  bodyBottomRow: number; // table body部分的最后一行row number
  screenRowCount: number; // 预计屏幕范围内显示的row count
  firstScreenRowLimit: number; // 首屏同步加载部分最后一行的row number
  taskRowCount: number; // 一次任务生成/更新的row count
  rowUpdatePos: number; // 异步任务目前更新到的行的row number
  rowUpdateDirection: 'up' | 'down'; // 当前行更新的方向,up表示从下往上挨个更新，down表示从上往下挨个更新
  screenTopRow: number = 0; // 当前屏幕范围内显示的第一行的row number
  totalActualBodyRowCount: number; // 实际表格body部分的行数
  deltaY: number = 0;
  deltaHeight: number = 0;

  colLimit = 100;
  // bodyLeftCol: number; // table body部分的第一列col number
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
  totalActualBodyColCount: number; // 实际表格body部分的列数
  deltaX: number = 0;
  deltaWidth: number = 0;

  cellCache: Map<number, Group> = new Map(); // 单元格位置快速查找缓存

  constructor(table: BaseTableAPI) {
    this.table = table;

    if (this.table.isPivotChart()) {
      // this.rowLimit = 100;
      // this.colLimit = 100;
      this.rowLimit = Math.max(100, Math.ceil((table.tableNoFrameHeight * 2) / table.defaultRowHeight));
      this.colLimit = Math.max(100, Math.ceil((table.tableNoFrameWidth * 2) / table.defaultColWidth));
    } else if (this.table.isAutoRowHeight()) {
      // this.rowLimit = 100;
      this.rowLimit = Math.max(100, Math.ceil((table.tableNoFrameHeight * 2) / table.defaultRowHeight));
    } else if (this.table.widthMode === 'autoWidth') {
      // this.colLimit = 100;
      this.colLimit = Math.max(100, Math.ceil((table.tableNoFrameWidth * 2) / table.defaultColWidth));
    } else {
      this.rowLimit = Math.max(200, Math.ceil((table.tableNoFrameHeight * 2) / table.defaultRowHeight));
      this.colLimit = Math.max(100, Math.ceil((table.tableNoFrameWidth * 2) / table.defaultColWidth));
    }

    if (this.table.internalProps.transpose) {
      this.mode = 'row';
    } else if (this.table.isPivotTable()) {
      this.mode = 'pivot';
    }
    if (this.table.options.maintainedDataCount) {
      this.rowLimit = this.table.options.maintainedDataCount;
    }
  }

  get bodyLeftCol(): number {
    return this.table.frozenColCount;
  }
  get bodyTopRow(): number {
    return this.table.frozenRowCount;
  }

  setParamsForColumn() {
    // this.bodyLeftCol = this.table.frozenColCount;
    this.bodyRightCol = this.table.colCount - 1 - this.table.rightFrozenColCount;

    // compute the column info about progress creation
    const totalActualBodyColCount = Math.min(this.colLimit, this.bodyRightCol - this.bodyLeftCol + 1);
    this.totalActualBodyColCount = totalActualBodyColCount;
    this.totalCol = this.bodyLeftCol + totalActualBodyColCount - 1; // 目标渐进完成的col
    this.colStart = this.bodyLeftCol;
    this.colEnd = this.totalCol; // temp for first screen, will replace in createGroupForFirstScreen()
    const defaultColWidth = this.table.defaultColWidth;
    // const defaultColWidth = getDefaultHeight(this.table);
    this.taskColCount = Math.ceil(this.table.tableNoFrameWidth / defaultColWidth) * 1;

    // 确定动态更新限制
    const totalBodyWidth = defaultColWidth * totalActualBodyColCount;
    const totalWidth = defaultColWidth * (this.bodyRightCol - this.bodyLeftCol + 1);
    this.xLimitLeft = totalBodyWidth / 2;
    this.xLimitRight = totalWidth - totalBodyWidth / 2;

    // 确定首屏高度范围
    const widthLimit = this.table.tableNoFrameWidth * 5;
    this.screenColCount = Math.ceil(this.table.tableNoFrameWidth / defaultColWidth);
    this.firstScreenColLimit = Math.max(
      15, // min firstScreenColLimit
      this.bodyLeftCol + Math.min(this.colLimit, Math.ceil(widthLimit / defaultColWidth))
    );
    // this.firstScreenRowLimit = this.bodyBottomRow;

    this.colUpdatePos = this.bodyRightCol;
  }

  setParamsForRow() {
    // this.bodyTopRow = this.table.frozenRowCount;
    this.bodyBottomRow = this.table.rowCount - 1 - this.table.bottomFrozenRowCount;
    // this.bodyLeftCol = 0;
    // this.bodyRightCol = this.table.colCount - 1 - this.table.rightFrozenColCount;

    // 计算渐进加载数量
    const totalActualBodyRowCount = Math.min(this.rowLimit, this.bodyBottomRow - this.bodyTopRow + 1); // 渐进加载总row数量
    this.totalActualBodyRowCount = totalActualBodyRowCount;
    this.totalRow = this.bodyTopRow + totalActualBodyRowCount - 1; // 目标渐进完成的row
    this.rowStart = this.bodyTopRow;
    this.rowEnd = this.totalRow; // temp for first screen, will replace in createGroupForFirstScreen()
    const defaultRowHeight = this.table.defaultRowHeight;
    // const defaultRowHeight = getDefaultWidth(this.table);
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
    this.firstScreenRowLimit = Math.max(
      30, // min firstScreenRowLimit
      this.bodyTopRow + Math.min(this.rowLimit, Math.ceil(heightLimit / defaultRowHeight))
    );
    // this.firstScreenRowLimit = this.bodyBottomRow;

    this.rowUpdatePos = this.bodyBottomRow;
  }

  refreshRowCount() {
    // this.bodyTopRow = this.table.frozenRowCount;
    this.bodyBottomRow = this.table.rowCount - 1 - this.table.bottomFrozenRowCount;
    const totalActualBodyRowCount = Math.min(this.rowLimit, this.bodyBottomRow - this.bodyTopRow + 1); // 渐进加载总row数量
    this.totalActualBodyRowCount = totalActualBodyRowCount;
    this.totalRow = this.rowStart + totalActualBodyRowCount - 1; // 目标渐进完成的row

    // this.rowStart = this.bodyTopRow;
    // this.rowEnd = this.totalRow; // temp for first screen, will replace in createGroupForFirstScreen()
  }

  refreshColCount() {
    this.bodyRightCol = this.table.colCount - 1 - this.table.rightFrozenColCount;
    const totalActualBodyColCount = Math.min(this.colLimit, this.bodyRightCol - this.bodyLeftCol + 1);
    this.totalActualBodyColCount = totalActualBodyColCount;
    this.totalCol = this.bodyLeftCol + totalActualBodyColCount - 1; // 目标渐进完成的col

    this.colStart = this.bodyLeftCol;
    this.colEnd = this.totalCol; // temp for first screen, will replace in createGroupForFirstScreen()
  }

  resize() {
    const defaultColWidth = this.table.defaultColWidth;
    this.taskColCount = Math.ceil(this.table.tableNoFrameWidth / defaultColWidth) * 1;
    const widthLimit = this.table.tableNoFrameWidth * 5;
    this.screenColCount = Math.ceil(this.table.tableNoFrameWidth / defaultColWidth);
    this.firstScreenColLimit = this.bodyLeftCol + Math.min(this.colLimit, Math.ceil(widthLimit / defaultColWidth));

    const defaultRowHeight = this.table.defaultRowHeight;
    this.taskRowCount = Math.ceil(this.table.tableNoFrameHeight / defaultRowHeight) * 1;
    const heightLimit = this.table.tableNoFrameHeight * 5;
    this.screenRowCount = Math.ceil(this.table.tableNoFrameHeight / defaultRowHeight);
    this.firstScreenRowLimit = this.bodyTopRow + Math.min(this.rowLimit, Math.ceil(heightLimit / defaultRowHeight));
  }

  createGroupForFirstScreen(
    cornerHeaderGroup: Group,
    colHeaderGroup: Group,
    rowHeaderGroup: Group,
    rightFrozenGroup: Group,
    bottomFrozenGroup: Group,
    bodyGroup: Group,
    xOrigin: number,
    yOrigin: number
  ) {
    createGroupForFirstScreen(
      cornerHeaderGroup,
      colHeaderGroup,
      rowHeaderGroup,
      rightFrozenGroup,
      bottomFrozenGroup,
      bodyGroup,
      xOrigin,
      yOrigin,
      this
    );
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
    if (this.isProgressing) {
      return;
    }
    this.isProgressing = true;
    return new Promise<void>((resolve, reject) => {
      setTimeout(async () => {
        this.isProgressing = false;
        if (this.isRelease) {
          return;
        }
        // console.log('progress col', this.colUpdatePos, this.colEnd, this.currentCol, this.totalCol);
        // console.log('progress row', this.rowUpdatePos, this.rowEnd, this.currentRow, this.totalRow);
        // console.log('before: createRow', table.scenegraph.bodyGroup.lastChild.attribute);
        // if (this.isSkipProgress) {
        //   await this.progress();
        // } else
        if (this.colUpdatePos <= this.colEnd) {
          // console.log('progress colUpdatePos', this.colUpdatePos);
          await this.updateColCellGroupsAsync();
          await this.progress();
        } else if (this.rowUpdatePos <= this.rowEnd) {
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
        handleTextStick(this.table);
        this.table.scenegraph.updateNextFrame();
        resolve();
      }, 16);
    });
  }

  async createRow() {
    if (!this.taskRowCount) {
      return;
    }
    // console.log('createRow', this.currentRow, this.currentRow + this.taskRowCount);
    this.createRowCellGroup(this.taskRowCount);
  }

  async createCol() {
    if (!this.taskColCount) {
      return;
    }
    // console.log('createCol', this.currentCol, this.currentCol + this.taskColCount);
    this.createColGroup(this.taskRowCount);
  }

  createRowCellGroup(onceCount: number) {
    const endRow = Math.min(this.totalRow, this.currentRow + onceCount);
    // compute rows height
    computeRowsHeight(this.table, this.currentRow + 1, endRow, false);

    this.rowEnd = endRow;

    if (this.table.frozenColCount) {
      // create row header row cellGroup
      let maxHeight = 0;
      for (let col = 0; col < this.table.frozenColCount; col++) {
        const colGroup = this.table.scenegraph.getColGroup(col);
        const cellLocation = this.table.isListTable() ? 'body' : 'rowHeader';
        const { height } = createComplexColumn(
          colGroup,
          col,
          colGroup.attribute.width,
          this.currentRow + 1,
          endRow,
          this.table.scenegraph.mergeMap,
          this.table.defaultRowHeight,
          this.table
          // cellLocation
        );
        maxHeight = Math.max(maxHeight, height);
        this.table.scenegraph.rowHeaderGroup.setAttribute('height', maxHeight);
      }
    }

    if (this.table.rightFrozenColCount) {
      // create row header row cellGroup
      let maxHeight = 0;
      for (let col = this.table.colCount - this.table.rightFrozenColCount; col < this.table.colCount; col++) {
        const colGroup = this.table.scenegraph.getColGroup(col);
        const cellLocation = this.table.isPivotChart() ? 'rowHeader' : 'body'; // isHeader
        const { height } = createComplexColumn(
          colGroup,
          col,
          colGroup.attribute.width,
          this.currentRow + 1,
          endRow,
          this.table.scenegraph.mergeMap,
          this.table.defaultRowHeight,
          this.table
          // cellLocation
        );
        maxHeight = Math.max(maxHeight, height);
        this.table.scenegraph.rightFrozenGroup.setAttribute('height', maxHeight);
      }
    }

    // create body row cellGroup
    let maxHeight = 0;
    for (let col = this.bodyLeftCol; col <= this.bodyRightCol; col++) {
      const colGroup = this.table.scenegraph.getColGroup(col);
      if (!colGroup) {
        continue;
      }
      const cellLocation = col < this.table.rowHeaderLevelCount ? 'rowHeader' : 'body';
      const { height } = createComplexColumn(
        colGroup,
        col,
        colGroup.attribute.width,
        this.currentRow + 1,
        endRow,
        this.table.scenegraph.mergeMap,
        this.table.defaultRowHeight,
        this.table
        // cellLocation
      );
      maxHeight = Math.max(maxHeight, height);
    }
    this.table.scenegraph.bodyGroup.setAttribute('height', maxHeight);

    this.currentRow = endRow;
    this.rowUpdatePos = this.rowEnd;

    // update container group size and border
    this.table.scenegraph.updateContainer();
    this.table.scenegraph.updateBorderSizeAndPosition();
  }

  createColGroup(onceCount: number) {
    // compute rows height
    const endCol = Math.min(this.totalCol, this.currentCol + onceCount);
    computeColsWidth(this.table, this.currentCol + 1, endCol);

    this.colEnd = endCol;

    // update last merge cell size
    for (let row = 0; row < this.table.rowCount; row++) {
      const cellGroup = this.highPerformanceGetCell(this.currentCol, row);
      if (cellGroup.role === 'cell' && isNumber(cellGroup.mergeStartCol) && cellGroup.mergeStartCol > this.currentCol) {
        this.table.scenegraph.updateCellContent(cellGroup.col, cellGroup.row);
      }
    }

    // create column
    if (this.table.frozenRowCount) {
      // create colGroup
      const lastColumnGroup = (
        this.table.scenegraph.colHeaderGroup.lastChild instanceof Group
          ? this.table.scenegraph.colHeaderGroup.lastChild
          : this.table.scenegraph.colHeaderGroup.lastChild._prev
      ) as Group;
      const xOrigin = lastColumnGroup.attribute.x + lastColumnGroup.attribute.width;
      const yOrigin = lastColumnGroup.attribute.y;
      // create colHeaderGroup
      createColGroup(
        this.table.scenegraph.colHeaderGroup,
        xOrigin,
        yOrigin,
        this.currentCol + 1, // colStart
        endCol, // colEnd
        0, // rowStart
        this.table.frozenRowCount - 1, // rowEnd
        'columnHeader', // isHeader
        this.table
      );
    }
    if (this.table.bottomFrozenRowCount) {
      // create colGroup
      const lastColumnGroup = (
        this.table.scenegraph.bottomFrozenGroup.lastChild instanceof Group
          ? this.table.scenegraph.bottomFrozenGroup.lastChild
          : this.table.scenegraph.bottomFrozenGroup.lastChild._prev
      ) as Group;
      const xOrigin = lastColumnGroup.attribute.x + lastColumnGroup.attribute.width;
      const yOrigin = lastColumnGroup.attribute.y;
      // create bottomFrozenGroup
      createColGroup(
        this.table.scenegraph.bottomFrozenGroup,
        xOrigin,
        yOrigin,
        this.currentCol + 1, // colStart
        endCol, // colEnd
        this.table.rowCount - this.table.bottomFrozenRowCount, // rowStart
        this.table.rowCount - 1, // rowEnd
        'columnHeader', // isHeader
        this.table
      );
    }
    // create colGroup
    let lastColumnGroup =
      this.table.scenegraph.bodyGroup.lastChild &&
      ((this.table.scenegraph.bodyGroup.lastChild instanceof Group
        ? this.table.scenegraph.bodyGroup.lastChild
        : this.table.scenegraph.bodyGroup.lastChild._prev) as Group);
    if (!lastColumnGroup) {
      lastColumnGroup =
        this.table.scenegraph.colHeaderGroup.lastChild &&
        ((this.table.scenegraph.colHeaderGroup.lastChild instanceof Group
          ? this.table.scenegraph.colHeaderGroup.lastChild
          : this.table.scenegraph.colHeaderGroup.lastChild._prev) as Group);
    }
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
    this.colUpdatePos = this.colEnd;

    // update container group size and border
    this.table.scenegraph.updateContainer();
    this.table.scenegraph.updateBorderSizeAndPosition();
  }

  async setY(y: number, isEnd = false) {
    const yLimitTop =
      this.table.getRowsHeight(this.bodyTopRow, this.bodyTopRow + (this.rowEnd - this.rowStart + 1)) / 2;
    const yLimitBottom = this.table.getAllRowsHeight() - yLimitTop;

    const screenTop = this.table.getTargetRowAt(y + this.table.scenegraph.colHeaderGroup.attribute.height);
    if (screenTop) {
      this.screenTopRow = screenTop.row;
    }

    if (y < yLimitTop && this.rowStart === this.bodyTopRow) {
      // 执行真实body group坐标修改
      this.updateDeltaY(y);
      this.updateBody(y - this.deltaY);
    } else if (y > yLimitBottom && this.rowEnd === this.bodyBottomRow) {
      // 执行真实body group坐标修改
      this.updateDeltaY(y);
      this.updateBody(y - this.deltaY);
    } else if (
      (!this.table.scenegraph.bodyGroup.firstChild ||
        this.table.scenegraph.bodyGroup.firstChild.type !== 'group' ||
        this.table.scenegraph.bodyGroup.firstChild.childrenCount === 0) &&
      (!this.table.scenegraph.rowHeaderGroup.firstChild ||
        this.table.scenegraph.rowHeaderGroup.firstChild.type !== 'group' ||
        this.table.scenegraph.rowHeaderGroup.firstChild.childrenCount === 0)
    ) {
      this.updateDeltaY(y);
      // 兼容异步加载数据promise的情况 childrenCount=0 如果用户立即调用setScrollTop执行dynamicSetY会出错
      this.updateBody(y - this.deltaY);
    } else {
      // 执行动态更新节点
      this.dynamicSetY(y, screenTop, isEnd);
    }
  }

  async setX(x: number, isEnd = false) {
    const xLimitLeft =
      this.table.getColsWidth(this.bodyLeftCol, this.bodyLeftCol + (this.colEnd - this.colStart + 1)) / 2;
    const xLimitRight = this.table.getAllColsWidth() - xLimitLeft;

    const screenLeft = this.table.getTargetColAt(x + this.table.scenegraph.rowHeaderGroup.attribute.width);
    if (screenLeft) {
      this.screenLeftCol = screenLeft.col;
    }

    if (x < xLimitLeft && this.colStart === this.bodyLeftCol) {
      // 执行真实body group坐标修改
      this.updateDeltaX(x);
      this.table.scenegraph.setBodyAndColHeaderX(-x + this.deltaX);
    } else if (x > xLimitRight && this.colEnd === this.bodyRightCol) {
      // 执行真实body group坐标修改
      this.updateDeltaX(x);
      this.table.scenegraph.setBodyAndColHeaderX(-x + this.deltaX);
    } else if (
      // 注意判断关系 这里不是 || 而是 &&
      this.table.scenegraph.bodyGroup.firstChild &&
      this.table.scenegraph.bodyGroup.firstChild.type === 'group' &&
      this.table.scenegraph.bodyGroup.firstChild.childrenCount === 0
    ) {
      // 兼容异步加载数据promise的情况 childrenCount=0 如果用户立即调用setScrollLeft执行dynamicSetX会出错
      this.updateDeltaX(x);
      this.table.scenegraph.setBodyAndColHeaderX(-x + this.deltaX);
    } else {
      // 执行动态更新节点
      this.dynamicSetX(x, screenLeft, isEnd);
    }
  }

  async dynamicSetY(y: number, screenTop: RowInfo | null, isEnd = false) {
    dynamicSetY(y, screenTop, isEnd, this);
  }
  async dynamicSetX(x: number, screenLeft: ColumnInfo | null, isEnd = false) {
    dynamicSetX(x, screenLeft, isEnd, this);
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
    if (this.table.isAutoRowHeight()) {
      computeRowsHeight(this.table, this.rowUpdatePos, distRow, false);
    }

    updateRowContent(this.rowUpdatePos, distRow, this);

    if (this.table.isAutoRowHeight()) {
      // body group
      updateAutoRow(
        this.bodyLeftCol, // colStart
        this.bodyRightCol, // colEnd
        this.rowUpdatePos, // rowStart
        distRow, // rowEnd
        this.table,
        this.rowUpdateDirection,
        true
      );
      // row header group
      updateAutoRow(
        0, // colStart
        this.table.frozenColCount - 1, // colEnd
        this.rowUpdatePos, // rowStart
        distRow, // rowEnd
        this.table,
        this.rowUpdateDirection,
        true
      );
      // right frozen group
      updateAutoRow(
        this.table.colCount - this.table.rightFrozenColCount, // colStart
        this.table.colCount - 1, // colEnd
        this.rowUpdatePos, // rowStart
        distRow, // rowEnd
        this.table,
        this.rowUpdateDirection,
        true
      );
    }

    this.rowUpdatePos = distRow + 1;
  }
  /** 更新底部冻结行的单元格内容 包括两边的角头 */
  updateBottomFrozenCellGroups() {
    const startRow = this.table.rowCount - this.table.bottomFrozenRowCount;
    const endRow = this.table.rowCount - 1;
    if (this.table.isAutoRowHeight()) {
      computeRowsHeight(this.table, startRow, endRow, false);
    }
    updateRowContent(startRow, endRow, this);

    if (this.table.isAutoRowHeight()) {
      // body group
      updateAutoRow(
        this.bodyLeftCol, // colStart
        this.bodyRightCol, // colEnd
        startRow, // rowStart
        endRow, // rowEnd
        this.table,
        this.rowUpdateDirection
      );
      // row header group
      updateAutoRow(
        0, // colStart
        this.table.frozenColCount - 1, // colEnd
        startRow, // rowStart
        endRow, // rowEnd
        this.table,
        this.rowUpdateDirection
      );
      // right frozen group
      updateAutoRow(
        this.table.colCount - this.table.rightFrozenColCount, // colStart
        this.table.colCount - 1, // colEnd
        startRow, // rowStart
        endRow, // rowEnd
        this.table,
        this.rowUpdateDirection
      );
    }
  }
  /** 更新底部冻结行的单元格内容 包括两边的角头 */
  updateRightFrozenCellGroups() {
    const startCol = this.table.colCount - this.table.rightFrozenColCount;
    const endCol = this.table.colCount - 1;
    if (this.table.widthMode === 'autoWidth') {
      computeColsWidth(this.table, startCol, endCol, false);
    }
    console.log('updateRightFrozenCellGroups', startCol, endCol);
    updateColContent(startCol, endCol, this);

    if (this.table.isAutoRowHeight()) {
      // body group
      updateAutoColumn(startCol, endCol, this.table, this.colUpdateDirection);
    }
  }
  async updateColCellGroupsAsync() {
    this.updateColGroups(this.taskRowCount);
  }

  updateColGroups(count: number) {
    const distCol = Math.min(this.bodyRightCol, this.colUpdatePos + count);
    // console.log('updateCellGroups', this.colUpdatePos, distCol);
    // for (let col = this.colUpdatePos; col <= distCol; col++) {
    //   const colGroup = this.table.scenegraph.getColGroup(col);
    //   if (colGroup) {
    //     // colGroup.forEachChildren((cellGroup: Group) => {
    //     //   this.updateCellGroupContent(cellGroup);
    //     // });
    //     // for (let row = (colGroup.firstChild as Group).row; row <= (colGroup.lastChild as Group).row; row++) {
    //     //   const cellGroup = this.highPerformanceGetCell(colGroup.col, row);
    //     //   this.updateCellGroupContent(cellGroup);
    //     // }
    //     let cellGroup = colGroup.firstChild;
    //     while (cellGroup) {
    //       // this.updateCellGroupContent(cellGroup as Group);
    //       // cellGroup = cellGroup._next;
    //       const newCellGroup = this.updateCellGroupContent(cellGroup as Group);
    //       cellGroup = newCellGroup._next;
    //     }
    //     colGroup.needUpdate = false;
    //   }
    // }
    computeColsWidth(this.table, this.colUpdatePos, distCol);
    updateColContent(this.colUpdatePos, distCol, this);
    this.colUpdatePos = distCol + 1;
  }

  updateCellGroupPosition(cellGroup: Group, newRow: number, y: number) {
    // 更新位置&row
    cellGroup.row = newRow;
    cellGroup.mergeStartCol = undefined;
    cellGroup.mergeStartRow = undefined;
    cellGroup.mergeEndCol = undefined;
    cellGroup.mergeEndRow = undefined;
    cellGroup.setAttribute('y', y);
    (cellGroup as any).needUpdate = true;
    (cellGroup as any).needUpdateForAutoRowHeight = true;
  }

  updateCellGroupContent(cellGroup: Group) {
    if (!cellGroup.needUpdate || cellGroup.role !== 'cell') {
      return cellGroup;
    }

    const newCellGroup = this.table.scenegraph.updateCellContent(cellGroup.col, cellGroup.row);
    cellGroup.needUpdate = false;
    return newCellGroup || cellGroup;
  }

  async sortCellVertical() {
    await sortVertical(this);
  }

  async sortCellHorizontal() {
    await sortHorizontal(this);
  }

  highPerformanceGetCell(
    col: number,
    row: number,
    // rowStart: number = this.rowStart,
    // rowEnd: number = this.rowEnd,
    getShadow?: boolean
  ) {
    // if (row < rowStart || row > rowEnd) {
    //   return emptyGroup;
    // }
    // if (row < this.rowStart || row > this.rowEnd || col < this.colStart || col > this.colEnd) {
    //   return emptyGroup;
    // }

    if (
      row >= this.table.frozenRowCount && // not column header
      row < this.table.rowCount - this.table.bottomFrozenRowCount && // not bottom frozen
      (row < this.rowStart || row > this.rowEnd) // not in proxy row range
    ) {
      return emptyGroup;
    }

    if (
      col >= this.table.frozenColCount && // not row header
      col < this.table.colCount - this.table.rightFrozenColCount && // not right frozen
      (col < this.colStart || col > this.colEnd) // not in proxy col range
    ) {
      return emptyGroup;
    }

    if (this.cellCache.get(col)) {
      const cacheCellGoup = this.cellCache.get(col);
      if ((cacheCellGoup._next || cacheCellGoup._prev) && Math.abs(cacheCellGoup.row - row) < row) {
        // 由缓存单元格向前后查找要快于从头查找
        let cellGroup = getCellByCache(cacheCellGoup, row);
        if (!cellGroup || (!getShadow && cellGroup.role === 'shadow-cell')) {
          cellGroup = this.table.scenegraph.getCell(col, row, getShadow);
        }
        cellGroup.row && this.cellCache.set(col, cellGroup);
        return cellGroup;
      }
      const cellGroup = this.table.scenegraph.getCell(col, row, getShadow);
      // cellGroup.row && this.cellCache.set(col, cellGroup);
      if (cellGroup.col === col && cellGroup.row) {
        this.cellCache.set(col, cellGroup);
      }
      return cellGroup;
    }
    const cellGroup = this.table.scenegraph.getCell(col, row, getShadow);
    // cellGroup.row && this.cellCache.set(col, cellGroup);
    if (cellGroup.col === col && cellGroup.row) {
      this.cellCache.set(col, cellGroup);
    }
    return cellGroup;
  }

  updateDeltaY(y: number, screenTopY?: number, screenTopRow?: number) {
    if (this.rowStart === this.bodyTopRow) {
      const cellGroup = this.table.scenegraph.highPerformanceGetCell(this.colStart, this.rowStart, true);
      if (cellGroup.role === 'cell') {
        const deltaY = cellGroup.attribute.y;
        this.deltaY = -deltaY;
      }
    } else if (this.rowEnd === this.bodyBottomRow) {
      const cellGroup = this.table.scenegraph.highPerformanceGetCell(this.colStart, this.rowEnd, true);
      if (cellGroup.role === 'cell') {
        // const deltaY =
        //   cellGroup.attribute.y +
        //   cellGroup.attribute.height -
        //   (this.table.tableNoFrameHeight - this.table.getFrozenRowsHeight() - this.table.getBottomFrozenRowsHeight()) -
        //   y;
        const deltaY =
          cellGroup.attribute.y +
          cellGroup.attribute.height -
          (this.table.getAllRowsHeight() - this.table.getFrozenRowsHeight() - this.table.getBottomFrozenRowsHeight());
        this.deltaY = -deltaY;
      }
    } else if (isValid(screenTopY) && isValid(screenTopRow)) {
      let cellGroup = this.table.scenegraph.highPerformanceGetCell(this.colStart, screenTopRow, true);
      if (cellGroup.role !== 'cell') {
        cellGroup = this.table.scenegraph.highPerformanceGetCell(0, screenTopRow, true);
      }
      const bodyY = y - this.deltaY;
      const distRowYOffset = screenTopY - bodyY; // dist cell 距离表格顶部的位置差
      const currentRowYOffset = cellGroup.attribute.y - bodyY + this.table.getFrozenRowsHeight(); // current cell 距离表格顶部的位置差
      // const deltaY = screenTopY - (cellGroup.attribute.y + );
      this.deltaY = distRowYOffset - currentRowYOffset;
    }
  }

  updateDeltaX(x: number, screenLeftX?: number, screenLeftCol?: number) {
    if (this.colStart === this.bodyLeftCol) {
      const colGroup = this.table.scenegraph.getColGroup(this.colStart);
      if (colGroup) {
        const deltaX = colGroup.attribute.x;
        this.deltaX = -deltaX;
      }
    } else if (this.colEnd === this.bodyRightCol) {
      const colGroup = this.table.scenegraph.getColGroup(this.colEnd);
      if (colGroup) {
        const deltaX =
          colGroup.attribute.x +
          colGroup.attribute.width -
          (this.table.getAllColsWidth() - this.table.getFrozenColsWidth() - this.table.getRightFrozenColsWidth());
        this.deltaX = -deltaX;
      }
    } else if (isValid(screenLeftX) && isValid(screenLeftCol)) {
      const colGroup =
        this.table.scenegraph.getColGroup(screenLeftCol) || this.table.scenegraph.getColGroup(screenLeftCol, true);
      // const deltaX = screenLeftX - (colGroup.attribute.x + this.table.getFrozenColsWidth() + this.deltaX);
      // this.deltaX = deltaX + this.deltaX;
      const bodyX = x - this.deltaX;
      const distColXOffset = screenLeftX - bodyX; // dist col 距离表格左侧的位置差
      const currentColXOffset = colGroup.attribute.x - bodyX + this.table.getFrozenColsWidth(); // current col 距离表格左侧的位置差
      this.deltaX = distColXOffset - currentColXOffset;
    }
  }

  release() {
    this.isRelease = true;
  }
}

function getCellByCache(cacheCellGroup: Group, row: number): Group | null {
  if (!cacheCellGroup) {
    return null;
  }
  if (cacheCellGroup.row === row) {
    return cacheCellGroup;
  }
  const prev = cacheCellGroup._prev as Group;
  const next = cacheCellGroup._next as Group;
  // cacheCellGroup may have wrong order
  if (cacheCellGroup.row > row && prev && prev.row === cacheCellGroup.row - 1) {
    return getCellByCache(prev, row);
  }
  if (cacheCellGroup.row < row && next && next.row === cacheCellGroup.row + 1) {
    return getCellByCache(next, row);
  }
  return null;
}
