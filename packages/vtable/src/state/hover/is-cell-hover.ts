import type { StateManeger } from '../state';
import type { Group } from '../../scenegraph/graphic/group';
import { getProp } from '../../scenegraph/utils/get-prop';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { HighlightScope } from '../../ts-types';

export function getCellHoverColor(cellGroup: Group, table: BaseTableAPI): string | undefined {
  let colorKey;
  if (cellGroup.role === 'cell' && typeof cellGroup.mergeCol === 'number' && typeof cellGroup.mergeRow === 'number') {
    for (let col = cellGroup.col; col <= cellGroup.mergeCol; col++) {
      for (let row = cellGroup.row; row <= cellGroup.mergeRow; row++) {
        const key = isCellHover(table.stateManeger, col, row);
        if (key && (!colorKey || key === 'cellBgColor')) {
          colorKey = key;
        }
      }
    }
  } else if (cellGroup.role === 'cell') {
    colorKey = isCellHover(table.stateManeger, cellGroup.col, cellGroup.row);
  }

  if (!colorKey) {
    return undefined;
  }

  const hoverStyle = table.isHeader(cellGroup.col, cellGroup.row)
    ? table.theme.headerStyle?.hover
    : table.theme.bodyStyle?.hover;
  const fillColor = getProp(colorKey, hoverStyle, cellGroup.col, cellGroup.row, table);
  return fillColor;
}

export function isCellHover(state: StateManeger, col: number, row: number): string | undefined {
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
