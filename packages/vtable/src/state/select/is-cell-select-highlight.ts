import type { StateManager } from '../state';
import type { Group } from '../../scenegraph/graphic/group';
import { getProp } from '../../scenegraph/utils/get-prop';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { CellRange, ColumnDefine } from '../../ts-types';
import { HighlightScope } from '../../ts-types';
import { isValid } from '@visactor/vutils';
import { getCellMergeRange } from '../../tools/merge-range';
import { cellInRange } from '../../tools/helper';

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

// 选中多列
function isSelectMultipleRange(range: CellRange) {
  return range.start.col !== range.end.col || range.start.row !== range.end.row;
}

function getSelectModeRange(state: StateManager, col: number, row: number) {
  let selectMode;
  const { highlightScope, cellPos, ranges } = state.select;
  const range = ranges[0];
  const rangeColStart = Math.min(range.start.col, range.end.col);
  const rangeColEnd = Math.max(range.start.col, range.end.col);
  const rangeRowStart = Math.min(range.start.row, range.end.row);
  const rangeRowEnd = Math.max(range.start.row, range.end.row);
  if (highlightScope === HighlightScope.single && cellPos.col === col && cellPos.row === row) {
    selectMode = 'cellBgColor';
  } else if (highlightScope === HighlightScope.column && col >= rangeColStart && col <= rangeColEnd) {
    if (cellInRange(ranges[0], col, row)) {
      selectMode = 'cellBgColor';
    } else {
      selectMode = 'inlineColumnBgColor';
    }
  } else if (highlightScope === HighlightScope.row && row >= rangeRowStart && row <= rangeRowEnd) {
    if (cellInRange(ranges[0], col, row)) {
      selectMode = 'cellBgColor';
    } else {
      selectMode = 'inlineRowBgColor';
    }
  } else if (highlightScope === HighlightScope.cross) {
    if (cellInRange(ranges[0], col, row)) {
      selectMode = 'cellBgColor';
    } else if (col >= rangeColStart && col <= rangeColEnd) {
      selectMode = 'inlineColumnBgColor';
    } else if (row >= rangeRowStart && row <= rangeRowEnd) {
      selectMode = 'inlineRowBgColor';
    }
  }
  return selectMode;
}

function getSelectMode(state: StateManager, col: number, row: number) {
  let selectMode;
  const { highlightScope, cellPos } = state.select;

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
  return selectMode;
}

export function isCellSelected(state: StateManager, col: number, row: number, cellGroup: Group): string | undefined {
  const { highlightInRange, disableHeader, ranges } = state.select;
  let selectMode;
  const isSelectRange = ranges.length === 1 && isSelectMultipleRange(ranges?.[0]) && highlightInRange;
  if (
    isSelectRange
      ? ranges?.length === 1 && ranges[0].start && ranges[0].end
      : ranges?.length === 1 && ranges[0].end.col === ranges[0].start.col && ranges[0].end.row === ranges[0].start.row
  ) {
    const table = state.table;

    const isHeader = table.isHeader(col, row);
    if (isHeader && disableHeader) {
      return undefined;
    }

    selectMode = isSelectRange ? getSelectModeRange(state, col, row) : getSelectMode(state, col, row);

    if (selectMode) {
      const cellDisable = isCellDisableSelect(state.table, col, row);
      if (cellDisable) {
        selectMode = undefined;
      }
    }
  } else if (state.table.theme.selectionStyle.selectionFillMode === 'replace') {
    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i];
      const rangeColStart = Math.min(range.start.col, range.end.col);
      const rangeColEnd = Math.max(range.start.col, range.end.col);
      const rangeRowStart = Math.min(range.start.row, range.end.row);
      const rangeRowEnd = Math.max(range.start.row, range.end.row);
      if (rangeColStart <= col && rangeRowStart <= row && rangeColEnd >= col && rangeRowEnd >= row) {
        selectMode = 'cellBgColor';
        break;
      }
    }
  }
  return selectMode;
}
/**
 * 判断单元格是否禁用选择。先判断高优配置select.disableSelect。
 * 然后在根据如果是表头的话依次去判断select.disableHeaderSelect和column.disableHeaderSelect。
 * 不是表头的话去判断column.disableSelect。
 */
export function isCellDisableSelect(table: BaseTableAPI, col: number, row: number) {
  const globalDisableSelect = table.options.select?.disableSelect;
  const cellDisable =
    typeof globalDisableSelect === 'function' ? globalDisableSelect(col, row, table) : globalDisableSelect;
  if (cellDisable) {
    return true;
  }
  if (table.isHeader(col, row)) {
    let cellDisable = table.options.select?.disableHeaderSelect;
    if (cellDisable) {
      return true;
    }
    const columnDefine = table.getHeaderDefine(col, row);
    cellDisable = (columnDefine as ColumnDefine)?.disableHeaderSelect;
    if (cellDisable) {
      return true;
    }
  } else {
    const columnDefine = table.getBodyColumnDefine(col, row);
    const disableSelect = (columnDefine as ColumnDefine)?.disableSelect;
    const cellDisable = typeof disableSelect === 'function' ? disableSelect(col, row, table) : disableSelect;
    if (cellDisable) {
      return true;
    }
  }
  return false;
}
