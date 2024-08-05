import type { StateManager } from '../state';
import type { Group } from '../../scenegraph/graphic/group';
import { getProp } from '../../scenegraph/utils/get-prop';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { ColumnDefine } from '../../ts-types';
import { HighlightScope } from '../../ts-types';
import { isValid } from '@visactor/vutils';
import { getCellMergeRange } from '../../tools/merge-range';

export function getCellSelectColor(cellGroup: Group, table: BaseTableAPI): string | undefined {
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
        const key = isCellSelected(table.stateManager, col, row, cellGroup);
        if (key && (!colorKey || key === 'cellBgColor')) {
          colorKey = key;
        }
      }
    }
  } else if (cellGroup.role === 'cell') {
    colorKey = isCellSelected(table.stateManager, cellGroup.col, cellGroup.row, cellGroup);
  }

  if (!colorKey) {
    return undefined;
  }

  let selectStyle;
  const layout = table.internalProps.layoutMap;
  if (layout.isCornerHeader(cellGroup.col, cellGroup.row)) {
    selectStyle = table.theme.cornerHeaderStyle?.select || table.theme.headerStyle?.select;
  } else if (layout.isColumnHeader(cellGroup.col, cellGroup.row)) {
    selectStyle = table.theme.headerStyle?.select;
  } else if (layout.isRowHeader(cellGroup.col, cellGroup.row)) {
    selectStyle = table.theme.rowHeaderStyle?.select;
  } else if (layout.isBottomFrozenRow(cellGroup.col, cellGroup.row)) {
    selectStyle =
      table.theme.bottomFrozenStyle?.select ||
      (table.isListTable() ? table.theme.bodyStyle?.select : table.theme.headerStyle?.select);
  } else if (layout.isRightFrozenColumn(cellGroup.col, cellGroup.row)) {
    selectStyle =
      table.theme.rightFrozenStyle?.select ||
      (table.isListTable() ? table.theme.bodyStyle?.select : table.theme.rowHeaderStyle?.select);
  } else if (!table.isHeader(cellGroup.col, cellGroup.row)) {
    selectStyle = table.theme.bodyStyle?.select;
  }
  const fillColor = getProp(colorKey, selectStyle, cellGroup.col, cellGroup.row, table);
  return fillColor;
}

export function isCellSelected(state: StateManager, col: number, row: number, cellGroup: Group): string | undefined {
  const { highlightScope, disableHeader, cellPos, ranges } = state.select;

  let selectMode;
  if (ranges?.length === 1 && ranges[0].end.col === ranges[0].start.col && ranges[0].end.row === ranges[0].start.row) {
    const table = state.table;

    const isHeader = table.isHeader(col, row);
    if (isHeader && disableHeader) {
      return undefined;
    }

    if (highlightScope === HighlightScope.single && cellPos.col === col && cellPos.row === row) {
      selectMode = 'cellBgColor';
    } else if (highlightScope === HighlightScope.column && cellPos.col === col) {
      if (cellPos.col === col && cellPos.row === row) {
        selectMode = 'cellBgColor';
      } else {
        selectMode = 'inlineColumnBgColor';
      }
    } else if (highlightScope === HighlightScope.row && cellPos.row === row) {
      if (cellPos.col === col && cellPos.row === row) {
        selectMode = 'cellBgColor';
      } else {
        selectMode = 'inlineRowBgColor';
      }
    } else if (highlightScope === HighlightScope.cross) {
      if (cellPos.col === col && cellPos.row === row) {
        selectMode = 'cellBgColor';
      } else if (cellPos.col === col) {
        selectMode = 'inlineColumnBgColor';
      } else if (cellPos.row === row) {
        selectMode = 'inlineRowBgColor';
      }
    }

    if (selectMode) {
      let cellDisable;
      if (isHeader) {
        const define = table.getHeaderDefine(col, row);
        cellDisable = (define as ColumnDefine)?.disableHeaderSelect;

        // if (cellGroup.firstChild && cellGroup.firstChild.name === 'axis' && table.options.select?.disableAxisHover) {
        //   cellDisable = true;
        // }
      } else {
        const define = table.getBodyColumnDefine(col, row);
        cellDisable = (define as ColumnDefine)?.disableSelect;
      }

      if (cellDisable) {
        selectMode = undefined;
      }
    }
  } else if (state.table.theme.selectionStyle.selectionFillMode === 'replace') {
    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i];
      if (range.start.col <= col && range.start.row <= row && range.end.col >= col && range.end.row >= row) {
        selectMode = 'cellBgColor';
        break;
      }
    }
  }
  return selectMode;
}

export function isCellDisableSelect(table: BaseTableAPI, col: number, row: number) {
  const columnDefine = table.getBodyColumnDefine(col, row);
  const isHeader = table.isHeader(col, row);
  if ((columnDefine as ColumnDefine)?.disableSelect && !isHeader) {
    return true;
  }
  if (isHeader && (columnDefine as ColumnDefine)?.disableHeaderSelect) {
    return true;
  }
  return false;
}
