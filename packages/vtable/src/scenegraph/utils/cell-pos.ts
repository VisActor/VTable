import type { BaseTableAPI } from '../..';

/* eslint-disable no-undef */
export function calcStartPosition(
  left: number,
  top: number,
  width: number,
  height: number,
  contentWidth: number,
  contentHeight: number,
  textAlign: CanvasTextAlign = 'left',
  textBaseline: CanvasTextBaseline = 'middle',
  margin = [0, 0, 0, 0],
  paddingLeft = 0,
  paddingRight = 0,
  paddingTop = 0,
  paddingBottom = 0
): { x: number; y: number } {
  const right = left + width;
  const bottom = top + height;
  let x = left + margin[3] + paddingLeft;
  if (textAlign === 'right' || textAlign === 'end') {
    x = right - contentWidth - margin[1] - paddingRight;
  } else if (textAlign === 'center') {
    x = left + (width - contentWidth + paddingLeft - paddingRight) / 2;
  }
  let y = top + margin[0] + paddingTop;
  if (textBaseline === 'bottom' || textBaseline === 'alphabetic' || textBaseline === 'ideographic') {
    y = bottom - contentHeight - margin[2] - paddingBottom;
  } else if (textBaseline === 'middle') {
    y = top + (height - contentHeight + paddingTop - paddingBottom) / 2;
  }
  return { x, y };
}

export function calculateCellRangeDistribution(
  startCol: number,
  startRow: number,
  endCol: number,
  endRow: number,
  table: BaseTableAPI
) {
  let needRowHeader = false;
  let needRightRowHeader = false; // 右侧冻结
  let needColumnHeader = false;
  let needBottomColumnHeader = false; // 底部冻结
  let needBody = false;
  let needCornerHeader = false;
  let needRightTopCornerHeader = false;
  let needRightBottomCornerHeader = false;
  let needLeftBottomCornerHeader = false;
  if (startCol <= table.frozenColCount - 1 && startRow <= table.frozenRowCount - 1) {
    needCornerHeader = true;
  }
  if (endCol >= table.colCount - table.rightFrozenColCount && startRow <= table.frozenRowCount - 1) {
    needRightTopCornerHeader = true;
  }

  if (startCol <= table.frozenColCount - 1 && endRow >= table.rowCount - table.bottomFrozenRowCount) {
    needLeftBottomCornerHeader = true;
  }

  if (endCol >= table.colCount - table.rightFrozenColCount && endRow >= table.rowCount - table.bottomFrozenRowCount) {
    needRightBottomCornerHeader = true;
  }

  if (
    startCol <= table.frozenColCount - 1 &&
    endRow >= table.frozenRowCount &&
    startRow <= table.rowCount - table.bottomFrozenRowCount - 1
  ) {
    needRowHeader = true;
  }
  if (
    endCol >= table.colCount - table.rightFrozenColCount &&
    endRow >= table.frozenRowCount &&
    startRow <= table.rowCount - table.bottomFrozenRowCount - 1
  ) {
    needRightRowHeader = true;
  }

  if (
    startRow <= table.frozenRowCount - 1 &&
    endCol >= table.frozenColCount &&
    startCol <= table.colCount - table.rightFrozenColCount - 1
  ) {
    needColumnHeader = true;
  }
  if (
    endRow >= table.rowCount - table.bottomFrozenRowCount &&
    endCol >= table.frozenColCount &&
    startCol <= table.colCount - table.rightFrozenColCount - 1
  ) {
    needBottomColumnHeader = true;
  }
  if (
    startCol <= table.colCount - table.rightFrozenColCount - 1 &&
    endCol >= table.frozenColCount &&
    startRow <= table.rowCount - table.bottomFrozenRowCount - 1 &&
    endRow >= table.frozenRowCount
  ) {
    needBody = true;
  }
  return {
    needRowHeader,
    needRightRowHeader,
    needColumnHeader,
    needBottomColumnHeader,
    needBody,
    needCornerHeader,
    needRightTopCornerHeader,
    needLeftBottomCornerHeader,
    needRightBottomCornerHeader
  };
}
