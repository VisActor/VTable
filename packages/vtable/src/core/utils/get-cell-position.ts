import type { CellAddressWithBound, ColumnInfo, RowInfo } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { _getTargetFrozenColAt, _getTargetFrozenRowAt } from '../tableHelper';

/**
 * 根据y值计算所在行
 * @param absoluteY 相对于表格左上角的y坐标（无滚动）
 * @returns
 */
export function getRowAt(absoluteY: number, _this: BaseTableAPI): RowInfo {
  const frozen = _getTargetFrozenRowAt(_this, absoluteY);
  if (frozen) {
    return frozen;
  }
  return getTargetRowAt(absoluteY, _this) ?? { top: -1, row: -1, bottom: -1, height: -1 };
}

/**
 * 根据x值计算所在列
 * @param absoluteX 相对于表格左上角的x坐标（无滚动）
 * @returns
 */
export function getColAt(absoluteX: number, _this: BaseTableAPI): ColumnInfo {
  const frozen = _getTargetFrozenColAt(_this, absoluteX);
  if (frozen) {
    return frozen;
  }
  return getTargetColAt(absoluteX, _this) ?? { left: -1, col: -1, right: -1, width: 1 };
}
/**
 * 根据坐标值获取行列位置，index和rect范围
 * @param absoluteX 表格左上角的x坐标（无滚动）
 * @param absoluteY 表格左上角的y坐标（无滚动）
 * @returns
 */
export function getCellAt(absoluteX: number, absoluteY: number, _this: BaseTableAPI): CellAddressWithBound {
  const rowInfo = getRowAt(absoluteY, _this);
  const { row, top, bottom, height } = rowInfo;
  const colInfo = getColAt(absoluteX, _this);
  const { col, left, right, width } = colInfo;
  const rect = {
    left,
    right,
    top,
    bottom,
    width,
    height
  };
  return {
    row,
    col,
    rect
  };
}

/**
 * 根据x获取该位置所处列值
 * @param table
 * @param absoluteX 表格左上角的x坐标（无滚动）
 * @returns
 */
export function getTargetColAt(absoluteX: number, _this: BaseTableAPI): ColumnInfo | null {
  if (absoluteX === 0) {
    return { left: 0, col: 0, right: 0, width: 0 };
  }
  const findBefore = (startCol: number, startRight: number): ColumnInfo | null => {
    let right = startRight;
    for (let col = startCol; col >= 0; col--) {
      const width = _this.getColWidth(col);
      const left = right - width;
      if (Math.round(left) <= Math.round(absoluteX) && Math.round(absoluteX) < Math.round(right)) {
        return {
          left,
          col,
          right,
          width
        };
      }
      right = left;
    }
    return null;
  };
  const findAfter = (startCol: number, startRight: number): ColumnInfo | null => {
    let left = startRight - _this.getColWidth(startCol);
    const { colCount } = _this.internalProps;
    for (let col = startCol; col < colCount; col++) {
      const width = _this.getColWidth(col);
      const right = left + width;
      if (Math.round(left) <= Math.round(absoluteX) && Math.round(absoluteX) < Math.round(right)) {
        return {
          left,
          col,
          right,
          width
        };
      }
      left = right;
    }
    return null;
  };
  //计算这个位置处是第几行
  const candCol = computeTargetColByX(absoluteX, _this);
  const right = _this.getColsWidth(0, candCol);
  if (absoluteX >= right) {
    return findAfter(candCol, right);
  }
  return findBefore(candCol, right);
}

/**
 * 根据y获取该位置所处行值
 * @param table
 * @param absoluteX 表格左上角的y坐标（无滚动）
 * @returns
 */
export function getTargetRowAt(absoluteY: number, _this: BaseTableAPI): RowInfo | null {
  if (absoluteY === 0) {
    return { top: 0, row: 0, bottom: 0, height: 0 };
  }

  const floorOrRound = _this.options.customConfig?._disableColumnAndRowSizeRound === true ? Math.floor : Math.round;

  const findBefore = (startRow: number, startBottom: number): RowInfo | null => {
    let bottom = startBottom;
    for (let row = startRow; row >= 0; row--) {
      const height = _this.getRowHeight(row);
      const top = bottom - height;
      if (floorOrRound(top) <= floorOrRound(absoluteY) && floorOrRound(absoluteY) < floorOrRound(bottom)) {
        return {
          top,
          row,
          bottom,
          height
        };
      }
      bottom = top;
    }
    return null;
  };
  const findAfter = (startRow: number, startBottom: number): RowInfo | null => {
    let top = startBottom - _this.getRowHeight(startRow);
    const { rowCount } = _this.internalProps;
    for (let row = startRow; row < rowCount; row++) {
      const height = _this.getRowHeight(row);
      const bottom = top + height;
      if (floorOrRound(top) <= floorOrRound(absoluteY) && floorOrRound(absoluteY) < floorOrRound(bottom)) {
        return {
          top,
          row,
          bottom,
          height
        };
      }
      top = bottom;
    }
    return null;
  };
  // const candRow = Math.min(
  //   Math.ceil(absoluteY / this.internalProps.defaultRowHeight),
  //   this.rowCount - 1
  // );
  //计算这个位置处是第几行
  const candRow = computeTargetRowByY(absoluteY, _this);
  const bottom = _this.getRowsHeight(0, candRow);
  if (absoluteY >= bottom) {
    return findAfter(candRow, bottom);
  }
  return findBefore(candRow, bottom);
}

/**
 * 根据x获取右侧冻结中该位置所处列值
 * @param table
 * @param absoluteX 屏幕坐标x值
 * @returns
 */
export function getTargetColAtConsiderRightFrozen(
  absoluteX: number,
  isConsider: boolean,
  _this: BaseTableAPI
): ColumnInfo | null {
  if (absoluteX === 0) {
    return { left: 0, col: 0, right: 0, width: 0 };
  }
  absoluteX = absoluteX - _this.tableX;
  if (
    isConsider &&
    absoluteX > _this.tableNoFrameWidth - _this.getRightFrozenColsWidth() &&
    absoluteX < _this.tableNoFrameWidth &&
    absoluteX <= _this.getAllColsWidth()
  ) {
    for (let i = 0; i < _this.rightFrozenColCount; i++) {
      if (absoluteX > _this.tableNoFrameWidth - _this.getColsWidth(_this.colCount - i - 1, _this.colCount - 1)) {
        return {
          col: _this.colCount - i - 1,
          left: undefined,
          right: undefined,
          width: undefined
        };
      }
    }
  }
  return getTargetColAt(absoluteX, _this);
}

/**
 * 根据y获取底部冻结该位置所处行值
 * @param table
 * @param absoluteX 屏幕坐标y值
 * @param isConsider 是否考Y值是否在底部冻结区域内
 * @returns
 */
export function getTargetRowAtConsiderBottomFrozen(
  absoluteY: number,
  isConsider: boolean,
  _this: BaseTableAPI
): RowInfo | null {
  if (absoluteY === 0) {
    return { top: 0, row: 0, bottom: 0, height: 0 };
  }
  absoluteY = absoluteY - _this.tableY;
  if (
    isConsider &&
    absoluteY > _this.tableNoFrameHeight - _this.getBottomFrozenRowsHeight() &&
    absoluteY < _this.tableNoFrameHeight
  ) {
    for (let i = 0; i < _this.rightFrozenColCount; i++) {
      if (absoluteY > _this.tableNoFrameHeight - _this.getRowsHeight(_this.rowCount - i - 1, _this.rowCount - 1)) {
        return {
          row: _this.rowCount - i - 1,
          top: undefined,
          bottom: undefined,
          height: undefined
        };
      }
    }
  }
  return getTargetRowAt(absoluteY, _this);
}

/**
 * 根据y值（包括了scroll的）计算所在行
 * @param this
 * @param absoluteY 左边y值，包含了scroll滚动距离
 * @returns
 */
export function computeTargetRowByY(absoluteY: number, _this: BaseTableAPI): number {
  let defaultRowHeight = _this.defaultRowHeight;

  //使用二分法计算出row
  if (_this._rowRangeHeightsMap.get(`$0$${_this.rowCount - 1}`)) {
    defaultRowHeight = _this._rowRangeHeightsMap.get(`$0$${_this.rowCount - 1}`) / _this.rowCount;
    // let startRow = 0;
    // let endRow = this.rowCount - 1;
    // while (endRow - startRow > 1) {
    //   const midRow = Math.floor((startRow + endRow) / 2);
    //   if (absoluteY < this._rowRangeHeightsMap.get(`$0$${midRow}`)) {
    //     endRow = midRow;
    //   } else if (absoluteY > this._rowRangeHeightsMap.get(`$0$${midRow}`)) {
    //     startRow = midRow;
    //   } else {
    //     return midRow;
    //   }
    // }
    // return endRow;
  }
  //否则使用defaultRowHeight大约计算一个row
  return Math.min(Math.ceil(absoluteY / defaultRowHeight), _this.rowCount - 1);
}

/**
 * 根据x值（包括了scroll的）计算所在列 主要借助colRangeWidthsMap缓存来提高计算效率
 * @param this
 * @param absoluteX 左边x值，包含了scroll滚动距离
 * @returns
 */
export function computeTargetColByX(absoluteX: number, _this: BaseTableAPI): number {
  //使用二分法计算出col
  if (_this._colRangeWidthsMap.get(`$0$${_this.colCount - 1}`)) {
    let startCol = 0;
    let endCol = _this.colCount - 1;
    while (endCol - startCol > 1) {
      const midCol = Math.floor((startCol + endCol) / 2);
      if (absoluteX < _this._colRangeWidthsMap.get(`$0$${midCol}`)) {
        endCol = midCol;
      } else if (absoluteX > _this._colRangeWidthsMap.get(`$0$${midCol}`)) {
        startCol = midCol;
      } else {
        return midCol;
      }
    }
    return endCol;
  }
  //否则使用defaultColWidth大约计算一个col
  return Math.min(Math.ceil(absoluteX / _this.internalProps.defaultColWidth), _this.colCount - 1);
}

/**
 * 获取屏幕坐标对应的单元格信息，考虑滚动
 * @param this
 * @param relativeX 左边x值，相对于容器左上角，考虑表格滚动
 * @param relativeY 左边y值，相对于容器左上角，考虑表格滚动
 * @returns
 */
export function getCellAtRelativePosition(x: number, y: number, _this: BaseTableAPI): CellAddressWithBound {
  // table border and outer component
  x -= _this.tableX;
  y -= _this.tableY;

  // top frozen
  let topFrozen = false;
  if (y > 0 && y < _this.getFrozenRowsHeight()) {
    topFrozen = true;
  }

  // left frozen
  let leftFrozen = false;
  if (x > 0 && x < _this.getFrozenColsWidth()) {
    leftFrozen = true;
  }

  // bottom frozen
  let bottomFrozen = false;
  if (
    y > _this.tableNoFrameHeight - _this.getBottomFrozenRowsHeight() &&
    y < _this.tableNoFrameHeight &&
    y <= _this.getAllRowsHeight()
  ) {
    bottomFrozen = true;
  }
  // right frozen
  let rightFrozen = false;
  if (
    x > _this.tableNoFrameWidth - _this.getRightFrozenColsWidth() &&
    x < _this.tableNoFrameWidth &&
    x <= _this.getAllColsWidth()
  ) {
    rightFrozen = true;
  }

  // 加上 tableX 和 tableY 是因为在考虑冻结列和冻结行时，需要将坐标转换为相对于表格左上角的坐标
  const colInfo = getTargetColAtConsiderRightFrozen(
    (leftFrozen || rightFrozen ? x : x + _this.scrollLeft) + _this.tableX,
    rightFrozen,
    _this
  );
  const rowInfo = getTargetRowAtConsiderBottomFrozen(
    (topFrozen || bottomFrozen ? y : y + _this.scrollTop) + _this.tableY,
    bottomFrozen,
    _this
  );

  if (colInfo && rowInfo) {
    const { row, top, bottom, height } = rowInfo;
    const { col, left, right, width } = colInfo;
    const rect = {
      left,
      right,
      top,
      bottom,
      width,
      height
    };
    return {
      row,
      col,
      rect
    };
  }
  return { col: -1, row: -1 };
}
