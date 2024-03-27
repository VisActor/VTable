import type { StateManager } from '../state';
import type { Group } from '../../scenegraph/graphic/group';
import { getProp } from '../../scenegraph/utils/get-prop';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { ColumnDefine } from '../../ts-types';
import { HighlightScope } from '../../ts-types';
import { isValid } from '@visactor/vutils';
import { getCellMergeRange } from '../../tools/merge-range';

export function getCellHoverColor(cellGroup: Group, table: BaseTableAPI): string | undefined {
  let colorKey;
  if (
    cellGroup.role === 'cell' &&
    isValid(cellGroup.mergeStartCol) &&
    isValid(cellGroup.mergeStartRow) &&
    isValid(cellGroup.mergeEndCol) &&
    isValid(cellGroup.mergeEndRow)
  ) {
    const { colStart, colEnd, rowStart, rowEnd } = getCellMergeRange(cellGroup, table.scenegraph);
    for (let col = colStart; col <= colEnd; col++) {
      for (let row = rowStart; row <= rowEnd; row++) {
        const key = isCellHover(table.stateManager, col, row, cellGroup);
        if (key && (!colorKey || key === 'cellBgColor')) {
          colorKey = key;
        }
      }
    }
  } else if (cellGroup.role === 'cell') {
    colorKey = isCellHover(table.stateManager, cellGroup.col, cellGroup.row, cellGroup);
  }

  if (!colorKey) {
    return undefined;
  }

  let hoverStyle;
  const layout = table.internalProps.layoutMap;
  if (layout.isCornerHeader(cellGroup.col, cellGroup.row)) {
    hoverStyle = table.theme.cornerHeaderStyle?.hover || table.theme.headerStyle?.hover;
  } else if (layout.isColumnHeader(cellGroup.col, cellGroup.row)) {
    hoverStyle = table.theme.headerStyle?.hover;
  } else if (layout.isRowHeader(cellGroup.col, cellGroup.row)) {
    hoverStyle = table.theme.rowHeaderStyle?.hover;
  } else if (layout.isBottomFrozenRow(cellGroup.col, cellGroup.row)) {
    hoverStyle =
      table.theme.bottomFrozenStyle?.hover ||
      (table.isListTable() ? table.theme.bodyStyle?.hover : table.theme.headerStyle?.hover);
  } else if (layout.isRightFrozenColumn(cellGroup.col, cellGroup.row)) {
    hoverStyle =
      table.theme.rightFrozenStyle?.hover ||
      (table.isListTable() ? table.theme.bodyStyle?.hover : table.theme.rowHeaderStyle?.hover);
  } else if (!table.isHeader(cellGroup.col, cellGroup.row)) {
    hoverStyle = table.theme.bodyStyle?.hover;
  }
  const fillColor = getProp(colorKey, hoverStyle, cellGroup.col, cellGroup.row, table);
  return fillColor;
}

export function isCellHover(state: StateManager, col: number, row: number, cellGroup: Group): string | undefined {
  const { highlightScope, disableHeader, cellPos } = state.hover;
  const table = state.table;

  const isHeader = table.isHeader(col, row);
  if (isHeader && disableHeader) {
    return undefined;
  }

  let hoverMode;
  if (highlightScope === HighlightScope.single && cellPos.col === col && cellPos.row === row) {
    hoverMode = 'cellBgColor';
  } else if (highlightScope === HighlightScope.column && cellPos.col === col) {
    if (cellPos.col === col && cellPos.row === row) {
      hoverMode = 'cellBgColor';
    } else {
      hoverMode = 'inlineColumnBgColor';
    }
  } else if (highlightScope === HighlightScope.row && cellPos.row === row) {
    if (cellPos.col === col && cellPos.row === row) {
      hoverMode = 'cellBgColor';
    } else {
      hoverMode = 'inlineRowBgColor';
    }
  } else if (highlightScope === HighlightScope.cross) {
    if (cellPos.col === col && cellPos.row === row) {
      hoverMode = 'cellBgColor';
    } else if (cellPos.col === col) {
      hoverMode = 'inlineColumnBgColor';
    } else if (cellPos.row === row) {
      hoverMode = 'inlineRowBgColor';
    }
  }

  if (hoverMode) {
    let cellDisable;
    if (isHeader) {
      const define = table.getHeaderDefine(col, row);
      cellDisable = (define as ColumnDefine)?.disableHeaderHover;

      if (cellGroup.firstChild && cellGroup.firstChild.name === 'axis' && table.options.hover?.disableAxisHover) {
        cellDisable = true;
      }
    } else {
      const define = table.getBodyColumnDefine(col, row);
      cellDisable = (define as ColumnDefine)?.disableHover;
    }

    if (cellDisable) {
      hoverMode = undefined;
    }
  }

  return hoverMode;
}
