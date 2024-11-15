import type { ListTable } from '../../ListTable';
import { TABLE_EVENT_TYPE } from '../../core/TABLE_EVENT_TYPE';
import type { SimpleHeaderLayoutMap } from '../../layout';
import type { PivotHeaderLayoutMap } from '../../layout/pivot-header-layout';
import { getCellMergeInfo } from '../../scenegraph/utils/get-cell-merge';
import type { CellRange } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { StateManager } from '../state';
import { adjustMoveHeaderTarget } from './adjust-header';

export function startMoveCol(
  col: number,
  row: number,
  x: number,
  y: number,
  state: StateManager,
  event: MouseEvent | PointerEvent | TouchEvent
) {
  if (!('canMoveHeaderPosition' in state.table.internalProps.layoutMap)) {
    return;
  }
  state.columnMove.moving = true;
  state.columnMove.colSource = col;
  state.columnMove.rowSource = row;
  state.columnMove.x = x - state.table.tableX;
  state.columnMove.y = y - state.table.tableY;

  const cellLocation = state.table.getCellLocation(col, row);
  const delta =
    cellLocation === 'columnHeader'
      ? state.columnMove.x
      : cellLocation === 'rowHeader' ||
        (state.table.internalProps.layoutMap as SimpleHeaderLayoutMap).isSeriesNumberInBody(col, row)
      ? state.columnMove.y
      : 0;

  const { backX, lineX, backY, lineY } = state.table.scenegraph.component.showMoveCol(col, row, delta);

  state.table.fireListeners(TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION_START, {
    col,
    row,
    x,
    y,
    backX,
    lineX,
    backY,
    lineY,
    event
  });
  // 调整列顺序期间清空选中清空
  const isHasSelected = !!state.select.ranges?.length;
  state.table.stateManager.updateSelectPos(-1, -1);
  state.table.stateManager.endSelectCells(true, isHasSelected);
  state.table.scenegraph.updateNextFrame();
}

export function updateMoveCol(
  col: number,
  row: number,
  x: number,
  y: number,
  state: StateManager,
  event: MouseEvent | PointerEvent | TouchEvent
) {
  if (!('canMoveHeaderPosition' in state.table.internalProps.layoutMap)) {
    return;
  }

  const targetCell = adjustMoveHeaderTarget(
    { col: state.columnMove.colSource, row: state.columnMove.rowSource },
    { col, row },
    state.table
  );
  const canMove = state.table.internalProps.layoutMap.canMoveHeaderPosition(
    { col: state.columnMove.colSource, row: state.columnMove.rowSource },
    { col: targetCell.col, row: targetCell.row }
  );
  if (!canMove) {
    state.updateCursor('not-allowed');
    state.columnMove.colTarget = state.columnMove.colSource;
    state.columnMove.rowTarget = state.columnMove.rowSource;
  } else {
    state.columnMove.x = x - state.table.tableX;
    state.columnMove.y = y - state.table.tableY;
    state.columnMove.colTarget = targetCell.col;
    state.columnMove.rowTarget = targetCell.row;
    state.updateCursor('grabbing');
    let lineX;
    let backX;
    let lineY;
    let backY;
    const cellLocation = state.table.getCellLocation(state.columnMove.colSource, state.columnMove.rowSource);
    if (cellLocation === 'columnHeader') {
      backX = state.columnMove.x;
      if (state.table.isLeftFrozenColumn(col)) {
        lineX =
          state.columnMove.colTarget >= state.columnMove.colSource
            ? state.table.getColsWidth(0, state.columnMove.colTarget)
            : state.table.getColsWidth(0, state.columnMove.colTarget - 1);
      } else if (state.table.isRightFrozenColumn(col)) {
        lineX = state.table.tableNoFrameWidth - state.table.getColsWidth(targetCell.col + 1, state.table.colCount - 1);
      } else {
        lineX =
          (state.columnMove.colTarget >= state.columnMove.colSource
            ? state.table.getColsWidth(0, state.columnMove.colTarget)
            : state.table.getColsWidth(0, state.columnMove.colTarget - 1)) -
          state.table.stateManager.scroll.horizontalBarPos;
      }
    } else if (
      cellLocation === 'rowHeader' ||
      (state.table.internalProps.layoutMap as SimpleHeaderLayoutMap).isSeriesNumberInBody(col, row)
    ) {
      backY = state.columnMove.y;
      if (state.table.isFrozenRow(row)) {
        lineY =
          state.columnMove.rowTarget >= state.columnMove.rowSource
            ? state.table.getRowsHeight(0, state.columnMove.rowTarget)
            : state.table.getRowsHeight(0, state.columnMove.rowTarget - 1);
      } else if (state.table.isBottomFrozenRow(row)) {
        lineY =
          state.table.tableNoFrameHeight - state.table.getRowsHeight(targetCell.row + 1, state.table.rowCount - 1);
      } else {
        lineY =
          (state.columnMove.rowTarget >= state.columnMove.rowSource
            ? state.table.getRowsHeight(0, state.columnMove.rowTarget)
            : state.table.getRowsHeight(0, state.columnMove.rowTarget - 1)) -
          state.table.stateManager.scroll.verticalBarPos;
      }
    }
    state.table.scenegraph.component.updateMoveCol(backX, lineX, backY, lineY);
    state.table.fireListeners(TABLE_EVENT_TYPE.CHANGING_HEADER_POSITION, {
      col,
      row,
      x,
      y,
      backX,
      lineX,
      backY,
      lineY,
      event
    });
    state.table.scenegraph.updateNextFrame();
  }
}

export function endMoveCol(state: StateManager): boolean {
  let moveColResult = false;
  if (
    'canMoveHeaderPosition' in state.table.internalProps.layoutMap &&
    state.columnMove.moving &&
    state.columnMove.colSource >= 0 &&
    state.columnMove.rowSource >= 0 &&
    state.columnMove.colTarget >= 0 &&
    state.columnMove.rowTarget >= 0 &&
    state.table.options.customConfig?.notUpdateInColumnRowMove !== true
  ) {
    //getCellMergeInfo 一定要在moveHeaderPosition之前调用  否则就不是修改前的range了
    const oldSourceMergeInfo = state.table.getCellRange(state.columnMove.colSource, state.columnMove.rowSource);
    const oldTargetMergeInfo = state.table.getCellRange(state.columnMove.colTarget, state.columnMove.rowTarget);
    // 调整列顺序
    const moveContext = state.table._moveHeaderPosition(
      { col: state.columnMove.colSource, row: state.columnMove.rowSource },
      { col: state.columnMove.colTarget, row: state.columnMove.rowTarget }
    );

    // 更新状态
    if (moveContext && moveContext.targetIndex !== moveContext.sourceIndex) {
      state.table.internalProps.useOneRowHeightFillAll = false;
      state.table.internalProps.layoutMap.clearCellRangeMap();
      const sourceMergeInfo = state.table.getCellRange(state.columnMove.colSource, state.columnMove.rowSource);
      const targetMergeInfo = state.table.getCellRange(state.columnMove.colTarget, state.columnMove.rowTarget);

      const colMin = Math.min(
        sourceMergeInfo.start.col,
        targetMergeInfo.start.col,
        oldSourceMergeInfo.start.col,
        oldTargetMergeInfo.start.col
      );
      const colMax = Math.max(
        sourceMergeInfo.end.col,
        targetMergeInfo.end.col,
        oldSourceMergeInfo.end.col,
        oldTargetMergeInfo.end.col
      );
      const rowMin = Math.min(
        sourceMergeInfo.start.row,
        targetMergeInfo.start.row,
        oldSourceMergeInfo.start.row,
        oldTargetMergeInfo.start.row
      );
      let rowMax = Math.max(
        sourceMergeInfo.end.row,
        targetMergeInfo.end.row,
        oldSourceMergeInfo.end.row,
        oldTargetMergeInfo.end.row
      );
      if (
        moveContext.moveType === 'row' &&
        (state.table.internalProps.layoutMap as PivotHeaderLayoutMap).rowHierarchyType === 'tree'
      ) {
        if (moveContext.targetIndex > moveContext.sourceIndex) {
          rowMax = rowMax + moveContext.targetSize - 1;
        } else {
          rowMax = rowMax + moveContext.sourceSize - 1;
        }
      }
      if (
        !(state.table as ListTable).transpose &&
        (state.table.internalProps.layoutMap as SimpleHeaderLayoutMap).isSeriesNumberInBody(
          state.columnMove.colSource,
          state.columnMove.rowSource
        )
      ) {
        state.table.changeRecordOrder(moveContext.sourceIndex, moveContext.targetIndex);
        state.changeCheckboxAndRadioOrder(moveContext.sourceIndex, moveContext.targetIndex);
      }
      // clear columns width and rows height cache
      if (moveContext.moveType === 'column') {
        clearWidthsAndHeightsCache(colMin, colMax, 0, -1, state.table);
      } else {
        clearWidthsAndHeightsCache(0, -1, rowMin, rowMax, state.table);
      }

      // clear cell style cache
      state.table.clearCellStyleCache();
      if (
        state.table.internalProps.layoutMap.isSeriesNumberInBody(state.columnMove.colSource, state.columnMove.rowSource)
      ) {
        // 如果是拖拽序号换位置 考虑到非拖拽单元格合并而是其他地方有合并被拆开或者独立单元格拖拽后变为合并的情况  这里直接刷新这个场景树的节点 才能覆盖所有情况
        state.table.scenegraph.updateHeaderPosition(
          state.table.scenegraph.proxy.colStart,
          state.table.scenegraph.proxy.colEnd,
          state.table.scenegraph.proxy.rowStart,
          state.table.scenegraph.proxy.rowEnd,
          moveContext.moveType
        );
      } else if (moveContext.moveType === 'column') {
        state.table.scenegraph.updateHeaderPosition(colMin, colMax, 0, -1, moveContext.moveType);
      } else {
        state.table.scenegraph.updateHeaderPosition(0, -1, rowMin, rowMax, moveContext.moveType);
      }
      //调整冻结列数量
      if (state.table.internalProps.frozenColDragHeaderMode === 'adjustFrozenCount' && state.table.isListTable()) {
        if (
          state.table.isLeftFrozenColumn(state.columnMove.colTarget) &&
          !state.table.isLeftFrozenColumn(state.columnMove.colSource)
        ) {
          state.table.frozenColCount +=
            (sourceMergeInfo as CellRange).end.col - (sourceMergeInfo as CellRange).start.col + 1;
        } else if (
          state.table.isLeftFrozenColumn(state.columnMove.colSource) &&
          !state.table.isLeftFrozenColumn(state.columnMove.colTarget)
        ) {
          state.table.frozenColCount -=
            (sourceMergeInfo as CellRange).end.col - (sourceMergeInfo as CellRange).start.col + 1;
        }
        if (
          state.table.isRightFrozenColumn(state.columnMove.colTarget) &&
          !state.table.isRightFrozenColumn(state.columnMove.colSource)
        ) {
          state.table.rightFrozenColCount +=
            (sourceMergeInfo as CellRange).end.col - (sourceMergeInfo as CellRange).start.col + 1;
        } else if (
          state.table.isRightFrozenColumn(state.columnMove.colSource) &&
          !state.table.isRightFrozenColumn(state.columnMove.colTarget)
        ) {
          state.table.rightFrozenColCount -=
            (sourceMergeInfo as CellRange).end.col - (sourceMergeInfo as CellRange).start.col + 1;
        }
      }
      moveColResult = true;
    } else {
      state.updateCursor();
      //触发事件 CHANGE_HEADER_POSITION 还需要用到这些值 所以延迟清理
      state.columnMove.moving = false;
      delete state.columnMove.colSource;
      delete state.columnMove.rowSource;
      delete state.columnMove.colTarget;
      delete state.columnMove.rowTarget;
      state.table.scenegraph.component.hideMoveCol();
      state.table.scenegraph.updateNextFrame();
      return false;
    }
  }
  state.columnMove.moving = false;
  setTimeout(() => {
    //触发事件 CHANGE_HEADER_POSITION 还需要用到这些值 所以延迟清理
    delete state.columnMove.colSource;
    delete state.columnMove.rowSource;
    delete state.columnMove.colTarget;
    delete state.columnMove.rowTarget;
  }, 0);
  state.table.scenegraph.component.hideMoveCol();
  // update frozen shadowline component
  if (
    state.columnResize.col < state.table.frozenColCount &&
    !state.table.isPivotTable() &&
    !(state.table as ListTable).transpose
  ) {
    state.table.scenegraph.component.setFrozenColumnShadow(
      state.table.frozenColCount - 1,
      state.columnResize.isRightFrozen
    );
    state.table.scenegraph.component.setRightFrozenColumnShadow(state.table.colCount - state.table.rightFrozenColCount);
  } else if (
    state.columnResize.col >= state.table.colCount - state.table.rightFrozenColCount &&
    !state.table.isPivotTable() &&
    !(state.table as ListTable).transpose
  ) {
    state.table.scenegraph.component.setRightFrozenColumnShadow(state.table.colCount - state.table.rightFrozenColCount);
  } else if (state.table.options.frozenColCount) {
    state.table.scenegraph.component.setFrozenColumnShadow(state.table.frozenColCount - 1);
  } else if (state.table.options.rightFrozenColCount) {
    state.table.scenegraph.component.setRightFrozenColumnShadow(state.table.colCount - state.table.rightFrozenColCount);
  }
  state.table.scenegraph.updateNextFrame();

  if (state.table.options.customConfig?.notUpdateInColumnRowMove === true) {
    return true;
  }
  return moveColResult;
}

function clearWidthsAndHeightsCache(
  colMin: number,
  colMax: number,
  rowMin: number,
  rowMax: number,
  table: BaseTableAPI
) {
  for (let col = colMin; col <= colMax; col++) {
    table._clearColRangeWidthsMap(col);
  }
  for (let row = rowMin; row <= rowMax; row++) {
    table._clearRowRangeHeightsMap(row);
  }
}
