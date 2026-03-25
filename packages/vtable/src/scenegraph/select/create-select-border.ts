import { createRect } from '@src/vrender';
import type { CellSubLocation } from '../../ts-types';
import type { Scenegraph } from '../scenegraph';
import type { BaseTableAPI } from '../../ts-types/base-table';

/**
 * 选框（select border）的创建入口。
 *
 * 选框图元并不是直接挂在 tableGroup 下，而是挂在各区域对应的 overlayGroup（select-overlay）下：
 * - body / columnHeader / rowHeader / cornerHeader
 * - rightFrozen / rightTopCorner / rightBottomCorner
 * - bottomFrozen / leftBottomCorner
 *
 * 这样做的原因：
 * - overlay 会参与各区域的 clipRect 裁剪，避免选框越界绘制
 * - 当选择范围跨越多个区域（例如跨表头+body、跨左冻结+body、跨右冻结），需要拆成多段选框分别绘制
 */
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
  // fill handle（右下角小方块）只在“单一选区 + body 区域 + 允许显示”的场景生效：
  // - 多选区时避免出现多个 handle（交互语义不明确），并清理历史 handle
  // - 选区包含表头时禁止显示（表头不是可填充的目标）
  // - strokes 关闭底边/右边时（例如跨区域拆分后该边由其它段负责），也不应显示 handle
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
  // overlayGroup 在不同区域会有各自的坐标偏移（例如 columnHeader / body / rightFrozen），
  // 选框需要用 global bounds（全局 AABB）减去 tableGroup + overlayGroup 的偏移，换算为 overlay 的本地坐标。
  const overlayGroup = scene.getSelectOverlayGroup(selectRangeType);
  const offsetX = scene.tableGroup.attribute.x + (overlayGroup.attribute.x ?? 0);
  const offsetY = scene.tableGroup.attribute.y + (overlayGroup.attribute.y ?? 0);
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
    x: firstCellBound.x1 - offsetX,
    y: firstCellBound.y1 - offsetY,
    width: 0,
    height: 0,
    visible: true,
    cornerRadius: getCornerRadius(
      selectRangeType,
      scene.table.theme.frameStyle?.cornerRadius,
      start_Col,
      start_Row,
      end_Col,
      end_Row,
      scene.table
    )
  });
  // 创建右下角小方块
  let fillhandle;
  if (isHasFillHandleRect) {
    // 6x6 的 handle，定位在选区右下角（右/下各内缩 3px），避免压住边框线
    fillhandle = createRect({
      pickable: false,
      fill: bodyClickBorderColor as string,
      // lineWidth: bodyClickLineWidth as number,
      stroke: bodyClickBorderColor as string, // 右下角小方块边框颜色
      x: lastCellBound.x2 - offsetX - 3,
      y: lastCellBound.y2 - offsetY - 3,
      width: 6,
      height: 6,

      visible: true
    });
  }
  scene.lastSelectId = selectId;
  // key 以“标准化后的 start/end + selectId”组成：同一选择范围在不同区域拆分后 key 不同，
  // 但 selectId 相同，可用于 shift 续选等场景的删除/替换。
  scene.selectingRangeComponents.set(`${startCol}-${startRow}-${endCol}-${endRow}-${selectId}`, {
    rect,
    fillhandle,
    role: selectRangeType
  });
  overlayGroup.addChild(rect);
  if (isHasFillHandleRect) {
    overlayGroup.addChild(fillhandle);
  }
}

// set corner radius in select rect which covers the corner of the table
export function getCornerRadius(
  selectRangeType: CellSubLocation,
  cornerRadius: undefined | number | [number, number, number, number],
  start_Col: number,
  start_Row: number,
  end_Col: number,
  end_Row: number,
  table: BaseTableAPI
) {
  if (!cornerRadius) {
    return undefined;
  }
  const cornerRadiusArray = Array.isArray(cornerRadius)
    ? cornerRadius
    : [cornerRadius, cornerRadius, cornerRadius, cornerRadius]; // [left top, right top, right bottom, left bottom]

  const tableStartCol = 0;
  const tableStartRow = 0;
  const tableEndCol = table.colCount - 1;
  const tableEndRow = table.rowCount - 1;

  const result = [0, 0, 0, 0];
  let changed = false;

  if (start_Col === tableStartCol && start_Row === tableStartRow) {
    // select rect covers the left top corner of the table
    result[0] = cornerRadiusArray[0];
    changed = true;
  } else if (end_Col === tableEndCol && end_Row === tableEndRow) {
    // select rect covers the right bottom corner of the table
    result[2] = cornerRadiusArray[2];
    changed = true;
  } else if (start_Col === tableStartCol && end_Row === tableEndRow) {
    // select rect covers the left bottom corner of the table
    result[3] = cornerRadiusArray[3];
    changed = true;
  } else if (end_Col === tableEndCol && start_Row === tableStartRow) {
    // select rect covers the right top corner of the table
    result[1] = cornerRadiusArray[1];
    changed = true;
  }

  if (changed) {
    return result;
  }

  return undefined;
}
