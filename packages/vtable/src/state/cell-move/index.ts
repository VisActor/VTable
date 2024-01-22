import type { ListTable } from '../../ListTable';
import { getCellMergeInfo } from '../../scenegraph/utils/get-cell-merge';
import type { CellRange } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { StateManager } from '../state';
import { adjustMoveHeaderTarget } from './adjust-header';

export function startMoveCol(col: number, row: number, x: number, y: number, state: StateManager) {
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
    cellLocation === 'columnHeader' ? state.columnMove.x : cellLocation === 'rowHeader' ? state.columnMove.y : 0;

  state.table.scenegraph.component.showMoveCol(col, row, delta);

  // 调整列顺序期间清空选中清空
  state.table.stateManager.updateSelectPos(-1, -1);

  state.table.scenegraph.updateNextFrame();
}

export function updateMoveCol(col: number, row: number, x: number, y: number, state: StateManager) {
  if (!('canMoveHeaderPosition' in state.table.internalProps.layoutMap)) {
    return;
  }

  const targetCell = adjustMoveHeaderTarget(
    { col: state.columnMove.colSource, row: state.columnMove.rowSource },
    { col, row },
    state.table
  );

  state.columnMove.x = x - state.table.tableX;
  state.columnMove.y = y - state.table.tableY;
  state.columnMove.colTarget = targetCell.col;
  state.columnMove.rowTarget = targetCell.row;

  const canMove = state.table.internalProps.layoutMap.canMoveHeaderPosition(
    { col: state.columnMove.colSource, row: state.columnMove.rowSource },
    { col: state.columnMove.colTarget, row: state.columnMove.rowTarget }
  );

  if (!canMove) {
    state.updateCursor('not-allowed');
  } else {
    state.updateCursor('grabbing');
  }

  let lineX;
  let backX;
  let lineY;
  let backY;
  const cellLocation = state.table.getCellLocation(state.columnMove.colSource, state.columnMove.rowSource);
  if (cellLocation === 'columnHeader') {
    backX = state.columnMove.x;
    if (state.table.isFrozenColumn(col)) {
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
  } else if (cellLocation === 'rowHeader') {
    backY = state.columnMove.y;
    if (state.table.isFrozenRow(row)) {
      lineY =
        state.columnMove.rowTarget >= state.columnMove.rowSource
          ? state.table.getRowsHeight(0, state.columnMove.rowTarget)
          : state.table.getRowsHeight(0, state.columnMove.rowTarget - 1);
    } else if (state.table.isBottomFrozenRow(row)) {
      lineY = state.table.tableNoFrameHeight - state.table.getRowsHeight(targetCell.row + 1, state.table.rowCount - 1);
    } else {
      lineY =
        (state.columnMove.rowTarget >= state.columnMove.rowSource
          ? state.table.getRowsHeight(0, state.columnMove.rowTarget)
          : state.table.getRowsHeight(0, state.columnMove.rowTarget - 1)) -
        state.table.stateManager.scroll.verticalBarPos;
    }
  }

  state.table.scenegraph.component.updateMoveCol(backX, lineX, backY, lineY);
  state.table.scenegraph.updateNextFrame();
}

export function endMoveCol(state: StateManager) {
  if (
    'canMoveHeaderPosition' in state.table.internalProps.layoutMap &&
    state.columnMove.moving &&
    state.columnMove.colSource >= 0 &&
    state.columnMove.rowSource >= 0 &&
    state.columnMove.colTarget >= 0 &&
    state.columnMove.rowTarget >= 0
  ) {
    //getCellMergeInfo 一定要在moveHeaderPosition之前调用  否则就不是修改前的range了
    const sourceMergeInfo = getCellMergeInfo(state.table, state.columnMove.colSource, state.columnMove.rowSource);
    const targetMergeInfo = getCellMergeInfo(state.table, state.columnMove.colTarget, state.columnMove.rowTarget);
    // 调整列顺序
    const moveSuccess = (state.table as any).moveHeaderPosition(
      { col: state.columnMove.colSource, row: state.columnMove.rowSource },
      { col: state.columnMove.colTarget, row: state.columnMove.rowTarget }
    );

    // 更新状态
    if (moveSuccess) {
      // clear columns width and rows height cache
      clearWidthsAndHeightsCache(
        state.columnMove.colSource,
        state.columnMove.rowSource,
        state.columnMove.colTarget,
        state.columnMove.rowTarget,
        state.table
      );

      // clear cell style cache
      state.table.clearCellStyleCache();

      state.table.scenegraph.updateHeaderPosition(
        state.columnMove.colSource,
        state.columnMove.rowSource,
        state.columnMove.colTarget,
        state.columnMove.rowTarget,
        sourceMergeInfo,
        targetMergeInfo
      );
      //调整冻结列数量
      if (state.table.internalProps.frozenColDragHeaderMode === 'adjustFrozenCount' && state.table.isListTable()) {
        if (
          state.table.isFrozenColumn(state.columnMove.colTarget) &&
          !state.table.isFrozenColumn(state.columnMove.colSource)
        ) {
          state.table.frozenColCount +=
            (sourceMergeInfo as CellRange).end.col - (sourceMergeInfo as CellRange).start.col + 1;
        } else if (
          state.table.isFrozenColumn(state.columnMove.colSource) &&
          !state.table.isFrozenColumn(state.columnMove.colTarget)
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
    }

    state.updateCursor();
  }
  setTimeout(() => {
    //触发事件 CHANGE_HEADER_POSITION 还需要用到这些值 所以延迟清理
    state.columnMove.moving = false;
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
  }
  state.table.scenegraph.updateNextFrame();
}

function clearWidthsAndHeightsCache(
  colSource: number,
  rowSource: number,
  colTarget: number,
  rowTarget: number,
  table: BaseTableAPI
) {
  const colMin = Math.min(colSource, colTarget);
  const colMax = Math.max(colSource, colTarget);
  const rowMin = Math.min(rowSource, rowTarget);
  const rowMax = Math.max(rowSource, rowTarget);
  for (let col = colMin; col <= colMax; col++) {
    table._clearColRangeWidthsMap(col);
  }
  for (let row = rowMin; row <= rowMax; row++) {
    table._clearRowRangeHeightsMap(row);
  }
}
