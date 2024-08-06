import { createRect } from '@src/vrender';
import type { CellSubLocation } from '../../ts-types';
import type { Scenegraph } from '../scenegraph';
import { table } from 'console';

export function createCellSelectBorder(
  scene: Scenegraph,
  start_Col: number,
  start_Row: number,
  end_Col: number,
  end_Row: number,
  selectRangeType: CellSubLocation,
  selectId: string, //整体区域${endRow}-${startCol}${startRow}${endCol}${endRow}作为其编号
  strokes: boolean[]
  // isHasFillHandleRect: boolean
) {
  let isHasFillHandleRect = !!scene.table.options.excelOptions?.fillHandle;
  if (scene.table.stateManager.select.ranges?.length > 1) {
    isHasFillHandleRect = false;
    scene.removeFillHandleFromSelectComponents();
  } else if (scene.table.stateManager.select.ranges?.length === 1) {
    const maxRow = Math.max(
      scene.table.stateManager.select.ranges[0].start.row,
      scene.table.stateManager.select.ranges[0].end.row
    );
    const maxCol = Math.max(
      scene.table.stateManager.select.ranges[0].start.col,
      scene.table.stateManager.select.ranges[0].end.col
    );
    if (scene.table.isHeader(maxCol, maxRow)) {
      isHasFillHandleRect = false;
    }
  }
  if (Array.isArray(strokes) && (strokes[1] === false || strokes[2] === false)) {
    isHasFillHandleRect = false;
  }
  const startCol = Math.min(start_Col, end_Col);
  const startRow = Math.min(start_Row, end_Row);
  const endCol = Math.max(start_Col, end_Col);
  const endRow = Math.max(start_Row, end_Row);
  const firstCellBound = scene.highPerformanceGetCell(startCol, startRow).globalAABBBounds;
  const lastCellBound = scene.highPerformanceGetCell(endCol, endRow).globalAABBBounds;
  const theme = scene.table.theme;
  // 框选外边框
  const bodyClickBorderColor = theme.selectionStyle?.cellBorderColor;
  const bodyClickLineWidth = theme.selectionStyle?.cellBorderLineWidth;
  const rect = createRect({
    pickable: false,
    fill:
      theme.selectionStyle?.selectionFillMode === 'replace'
        ? false
        : (theme.selectionStyle?.cellBgColor as any) ?? 'rgba(0, 0, 255,0.1)',

    lineWidth: bodyClickLineWidth as number,
    // stroke: bodyClickBorderColor as string,
    stroke: strokes.map(stroke => {
      if (stroke) {
        return bodyClickBorderColor as string;
      }
      return false;
    }),
    x: firstCellBound.x1 - scene.tableGroup.attribute.x, // 坐标xy及宽高width height 不需要这里计算具体值 update-select-border文件中updateComponent方法中有逻辑  且该方法调用时间是render
    y: firstCellBound.y1 - scene.tableGroup.attribute.y,
    width: 0,
    height: 0,
    visible: true
  });
  // 创建右下角小方块
  let fillhandle;
  if (isHasFillHandleRect) {
    fillhandle = createRect({
      pickable: false,
      fill: bodyClickBorderColor as string,
      // lineWidth: bodyClickLineWidth as number,
      stroke: bodyClickBorderColor as string, // 右下角小方块边框颜色
      x: lastCellBound.x2 - 3, // 调整小方块位置
      y: lastCellBound.y2 - 3, // 调整小方块位置
      width: 6,
      height: 6,

      visible: true
    });
  }
  scene.lastSelectId = selectId;
  scene.selectingRangeComponents.set(`${startCol}-${startRow}-${endCol}-${endRow}-${selectId}`, {
    rect,
    fillhandle,
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
      : selectRangeType === 'cornerHeader'
      ? scene.cornerHeaderGroup
      : selectRangeType === 'rightTopCorner'
      ? scene.rightTopCornerGroup
      : selectRangeType === 'rightFrozen'
      ? scene.rightFrozenGroup
      : selectRangeType === 'leftBottomCorner'
      ? scene.leftBottomCornerGroup
      : selectRangeType === 'bottomFrozen'
      ? scene.bottomFrozenGroup
      : scene.rightBottomCornerGroup
  );
  isHasFillHandleRect &&
    scene.tableGroup.insertAfter(
      fillhandle,
      selectRangeType === 'body'
        ? scene.bodyGroup
        : selectRangeType === 'columnHeader'
        ? scene.colHeaderGroup
        : selectRangeType === 'rowHeader'
        ? scene.rowHeaderGroup
        : selectRangeType === 'cornerHeader'
        ? scene.cornerHeaderGroup
        : selectRangeType === 'rightTopCorner'
        ? scene.rightTopCornerGroup
        : selectRangeType === 'rightFrozen'
        ? scene.rightFrozenGroup
        : selectRangeType === 'leftBottomCorner'
        ? scene.leftBottomCornerGroup
        : selectRangeType === 'bottomFrozen'
        ? scene.bottomFrozenGroup
        : scene.rightBottomCornerGroup
    );
}
