import type { StateManager } from '../state';
import type { Group } from '../../scenegraph/graphic/group';
import { getProp } from '../../scenegraph/utils/get-prop';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { HighlightScope } from '../../ts-types';
import { isValid } from '@visactor/vutils';

export function getCellHoverColor(cellGroup: Group, table: BaseTableAPI): string | undefined {
  let colorKey;
  if (
    cellGroup.role === 'cell' &&
    isValid(cellGroup.mergeStartCol) &&
    isValid(cellGroup.mergeStartRow) &&
    isValid(cellGroup.mergeEndCol) &&
    isValid(cellGroup.mergeEndRow)
  ) {
    for (let col = cellGroup.mergeStartCol; col <= cellGroup.mergeEndCol; col++) {
      for (let row = cellGroup.mergeStartRow; row <= cellGroup.mergeEndRow; row++) {
        const key = isCellHover(table.stateManager, col, row);
        if (key && (!colorKey || key === 'cellBgColor')) {
          colorKey = key;
        }
      }
    }
  } else if (cellGroup.role === 'cell') {
    colorKey = isCellHover(table.stateManager, cellGroup.col, cellGroup.row);
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

export function isCellHover(state: StateManager, col: number, row: number): string | undefined {
  const { highlightScope, disableHeader, cellPos } = state.hover;
  const table = state.table;

  const isHeader = table.isHeader(col, row);
  if (isHeader && disableHeader) {
    return undefined;
  }

  if (highlightScope === HighlightScope.single && cellPos.col === col && cellPos.row === row) {
    return 'cellBgColor';
  } else if (highlightScope === HighlightScope.column && cellPos.col === col) {
    return 'inlineColumnBgColor';
  } else if (highlightScope === HighlightScope.row && cellPos.row === row) {
    return 'inlineRowBgColor';
  } else if (highlightScope === HighlightScope.cross) {
    if (cellPos.col === col && cellPos.row === row) {
      return 'cellBgColor';
    } else if (cellPos.col === col) {
      return 'inlineColumnBgColor';
    } else if (cellPos.row === row) {
      return 'inlineRowBgColor';
    }
  }

  return undefined;
}
