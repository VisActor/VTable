import { createRect } from '@visactor/vrender';
import type { CellLocation } from '../../ts-types';
import type { Scenegraph } from '../scenegraph';

export function createCellSelectBorder(
  scene: Scenegraph,
  start_Col: number,
  start_Row: number,
  end_Col: number,
  end_Row: number,
  selectRangeType: CellLocation,
  selectId: string, //整体区域${endRow}-${startCol}${startRow}${endCol}${endRow}作为其编号
  strokes?: boolean[]
) {
  const startCol = Math.min(start_Col, end_Col);
  const startRow = Math.min(start_Row, end_Row);
  const endCol = Math.max(start_Col, end_Col);
  const endRow = Math.max(start_Row, end_Row);

  let cellsBounds;
  for (let i = startCol; i <= endCol; i++) {
    for (let j = startRow; j <= endRow; j++) {
      const cellGroup = scene.highPerformanceGetCell(i, j);
      if (cellGroup.role === 'shadow-cell') {
        continue;
      }
      cellGroup.AABBBounds.width();
      const bounds = cellGroup.globalAABBBounds;
      if (!cellsBounds) {
        cellsBounds = bounds;
      } else {
        cellsBounds.union(bounds);
      }
    }
  }

  const theme = scene.table.theme;
  // 框选外边框
  const bodyClickBorderColor = theme.selectionStyle?.cellBorderColor;
  const bodyClickLineWidth = theme.selectionStyle?.cellBorderLineWidth;
  const rect = createRect({
    pickable: false,
    fill: (theme.selectionStyle?.cellBgColor as any) ?? 'rgba(0, 0, 255,0.1)',
    lineWidth: bodyClickLineWidth as number,
    // stroke: bodyClickBorderColor as string,
    stroke: strokes.map(stroke => {
      if (stroke) {
        return bodyClickBorderColor as string;
      }
      return false;
    }),
    x: cellsBounds.x1 - scene.tableGroup.attribute.x,
    y: cellsBounds.y1 - scene.tableGroup.attribute.y,
    width: cellsBounds.width(),
    height: cellsBounds.height(),
    visible: true
  });
  scene.lastSelectId = selectId;
  scene.selectingRangeComponents.set(`${startCol}-${startRow}-${endCol}-${endRow}-${selectId}`, {
    rect,
    role: selectRangeType
  });
  scene.tableGroup.insertAfter(
    rect,
    selectRangeType === 'body'
      ? scene.bodyGroup
      : selectRangeType === 'columnHeader'
      ? scene.colHeaderGroup
      : selectRangeType === 'rowHeader'
      ? scene.rowHeaderGroup
      : scene.cornerHeaderGroup
  );
}
