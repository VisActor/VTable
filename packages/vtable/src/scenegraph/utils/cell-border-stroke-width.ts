import type { IThemeSpec } from '@src/vrender';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { style as utilStyle } from '../../tools/helper';
import { isValid } from '@visactor/vutils';
import { isValidStyle, isZeroStyle } from '../../tools/style';

export function getCellBorderStrokeWidth(col: number, row: number, cellTheme: IThemeSpec, table: BaseTableAPI) {
  // const frameBorderLineWidths = utilStyle.toBoxArray(table.internalProps.theme.frameStyle?.borderLineWidth ?? [null]);
  let strokeArrayWidth = (cellTheme?.group as any)?.strokeArrayWidth ?? undefined;
  if (
    table.theme.cellInnerBorder ||
    !isValidStyle(table.theme.frameStyle.borderLineWidth) ||
    isZeroStyle(table.theme.frameStyle.borderLineWidth)
  ) {
    return strokeArrayWidth;
  }
  if (col === 0) {
    strokeArrayWidth = strokeArrayWidth ?? [
      cellTheme?.group?.lineWidth,
      cellTheme?.group?.lineWidth,
      cellTheme?.group?.lineWidth,
      cellTheme?.group?.lineWidth
    ];
    strokeArrayWidth[3] = 0;
  }
  if (col === table.colCount - 1) {
    strokeArrayWidth = strokeArrayWidth ?? [
      cellTheme?.group?.lineWidth,
      cellTheme?.group?.lineWidth,
      cellTheme?.group?.lineWidth,
      cellTheme?.group?.lineWidth
    ];
    strokeArrayWidth[1] = 0;
  }
  if (row === 0) {
    strokeArrayWidth = strokeArrayWidth ?? [
      cellTheme?.group?.lineWidth,
      cellTheme?.group?.lineWidth,
      cellTheme?.group?.lineWidth,
      cellTheme?.group?.lineWidth
    ];
    strokeArrayWidth[0] = 0;
  }
  if (row === table.rowCount - 1) {
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
