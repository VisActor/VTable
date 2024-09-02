import type { IThemeSpec, Group as VGroup } from '@src/vrender';
import { Group } from '../../graphic/group';
import type { CellInfo, CellRange, CheckboxColumnDefine, CheckboxStyleOption, SparklineSpec } from '../../../ts-types';
import type { BaseTableAPI } from '../../../ts-types/base-table';
import { isObject } from '@visactor/vutils';
import type { CheckboxAttributes } from '@visactor/vrender-components';
import { CheckBox } from '@visactor/vrender-components';
import { getHierarchyOffset } from '../../utils/get-hierarchy-offset';
import { getOrApply } from '../../../tools/helper';
import type { CheckboxStyle } from '../../../body-helper/style/CheckboxStyle';
import { getProp } from '../../utils/get-prop';
import { getCellBorderStrokeWidth } from '../../utils/cell-border-stroke-width';
import { dealWithIconLayout } from '../../utils/text-icon-layout';

export function createCustomCellGroup(
  columnGroup: Group,
  xOrigin: number,
  yOrigin: number,
  col: number,
  row: number,
  width: number,
  height: number,
  customElementsGroup: VGroup,
  table: BaseTableAPI,
  cellTheme: IThemeSpec,
  isAsync: boolean
) {
  // cell
  let cellGroup;

  const strokeArrayWidth = getCellBorderStrokeWidth(col, row, cellTheme, table);

  if (isAsync) {
    cellGroup = table.scenegraph.highPerformanceGetCell(col, row, true);
    if (cellGroup && cellGroup.role === 'cell') {
      cellGroup.setAttributes({
        x: xOrigin,
        y: yOrigin,
        width,
        height,
        // 背景相关，cell背景由cellGroup绘制
        lineWidth: cellTheme?.group?.lineWidth ?? undefined,
        fill: cellTheme?.group?.fill ?? undefined,
        stroke: cellTheme?.group?.stroke ?? undefined,
        strokeArrayWidth: strokeArrayWidth,
        strokeArrayColor: (cellTheme?.group as any)?.strokeArrayColor ?? undefined,
        cursor: (cellTheme?.group as any)?.cursor ?? undefined,
        lineDash: cellTheme?.group?.lineDash ?? undefined,
        lineCap: 'butt',
        clip: true,
        cornerRadius: cellTheme.group.cornerRadius
      } as any);
    }
  }
  if (!cellGroup || cellGroup.role !== 'cell') {
    cellGroup = new Group({
      x: xOrigin,
      y: yOrigin,
      width,
      height,
      // 背景相关，cell背景由cellGroup绘制
      lineWidth: cellTheme?.group?.lineWidth ?? undefined,
      fill: cellTheme?.group?.fill ?? undefined,
      stroke: cellTheme?.group?.stroke ?? undefined,
      strokeArrayWidth: strokeArrayWidth,
      strokeArrayColor: (cellTheme?.group as any)?.strokeArrayColor ?? undefined,
      cursor: (cellTheme?.group as any)?.cursor ?? undefined,
      lineDash: cellTheme?.group?.lineDash ?? undefined,
      lineCap: 'butt',
      clip: true,
      cornerRadius: cellTheme.group.cornerRadius
    } as any);
    cellGroup.role = 'cell';
    cellGroup.col = col;
    cellGroup.row = row;
    columnGroup?.addCellGroup(cellGroup);
  }
  cellGroup.appendChild(customElementsGroup);
  cellGroup.setAttributes({
    width: Math.max(cellGroup.attribute.width, customElementsGroup.attribute.width ?? 0),
    height: Math.max(cellGroup.attribute.height, customElementsGroup.attribute.height ?? 0)
  });
  return cellGroup;
}
