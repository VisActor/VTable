import type { IThemeSpec } from '@visactor/vrender-core';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { style as utilStyle } from '../../tools/helper';

export function getCellBorderStrokeWidth(col: number, row: number, cellTheme: IThemeSpec, table: BaseTableAPI) {
  const frameBorderLineWidths = utilStyle.toBoxArray(table.internalProps.theme.frameStyle?.borderLineWidth ?? [null]);
  let strokeArrayWidth = (cellTheme?.group as any)?.strokeArrayWidth ?? undefined;
  if (table.theme.cellInnerBorder) {
    return strokeArrayWidth;
  }
  if (col === 0 && frameBorderLineWidths[3]) {
    strokeArrayWidth = strokeArrayWidth ?? [
      cellTheme?.group?.lineWidth,
      cellTheme?.group?.lineWidth,
      cellTheme?.group?.lineWidth,
      cellTheme?.group?.lineWidth
    ];
    strokeArrayWidth[3] = 0;
  }
  if (col === table.colCount - 1 && frameBorderLineWidths[1]) {
    strokeArrayWidth = strokeArrayWidth ?? [
      cellTheme?.group?.lineWidth,
      cellTheme?.group?.lineWidth,
      cellTheme?.group?.lineWidth,
      cellTheme?.group?.lineWidth
    ];
    strokeArrayWidth[1] = 0;
  }
  if (row === 0 && frameBorderLineWidths[0]) {
    strokeArrayWidth = strokeArrayWidth ?? [
      cellTheme?.group?.lineWidth,
      cellTheme?.group?.lineWidth,
      cellTheme?.group?.lineWidth,
      cellTheme?.group?.lineWidth
    ];
    strokeArrayWidth[0] = 0;
  }
  if (row === table.rowCount - 1 && frameBorderLineWidths[2]) {
    strokeArrayWidth = strokeArrayWidth ?? [
      cellTheme?.group?.lineWidth,
      cellTheme?.group?.lineWidth,
      cellTheme?.group?.lineWidth,
      cellTheme?.group?.lineWidth
    ];
    strokeArrayWidth[2] = 0;
  }

  return strokeArrayWidth;
}
