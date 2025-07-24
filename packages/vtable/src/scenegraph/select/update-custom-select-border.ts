import { type IRect } from '@src/vrender';
import type { Scenegraph } from '../scenegraph';
import type { CellRange, CellSubLocation } from '../../ts-types';
import { getCellMergeInfo } from '../utils/get-cell-merge';
import { calculateCellRangeDistribution } from '../utils/cell-pos';
import { createRect } from '@src/vrender';
import { getCornerRadius } from './create-select-border';
import type { CustomSelectionStyle } from '../../ts-types';

export function updateCustomSelectBorder(
  scene: Scenegraph,
  selectRange: CellRange & { skipBodyMerge?: boolean },
  style: CustomSelectionStyle
) {
  const table = scene.table;
  const newStartCol = selectRange.start.col;
  const newStartRow = selectRange.start.row;
  const newEndCol = selectRange.end.col;
  const newEndRow = selectRange.end.row;
  const skipBodyMerge = selectRange.skipBodyMerge;

  const startCol = Math.max(Math.min(newEndCol, newStartCol), 0);
  const startRow = Math.max(Math.min(newEndRow, newStartRow), 0);
  const endCol = Math.min(Math.max(newEndCol, newStartCol), table.colCount - 1);
  const endRow = Math.min(Math.max(newEndRow, newStartRow), table.rowCount - 1);

  const {
    needRowHeader,
    needRightRowHeader,
    needColumnHeader,
    needBottomColumnHeader,
    needBody,
    needCornerHeader,
    needRightTopCornerHeader,
    needLeftBottomCornerHeader,
    needRightBottomCornerHeader
  } = calculateCellRangeDistribution(startCol, startRow, endCol, endRow, table);

  if (needCornerHeader) {
    const cornerEndCol = Math.min(endCol, table.frozenColCount - 1);
    const cornerEndRow = Math.min(endRow, table.frozenRowCount - 1);
    const strokeArray = [true, !needColumnHeader, !needRowHeader, true];
    createCustomCellSelectBorder(
      scene,
      startCol,
      startRow,
      cornerEndCol,
      cornerEndRow,
      'cornerHeader',
      `${startCol}${startRow}${endCol}${endRow}`,
      strokeArray,
      style
    );
  }
  if (needRightTopCornerHeader) {
    const cornerStartCol = Math.max(startCol, table.colCount - table.rightFrozenColCount);
    const cornerEndRow = Math.min(endRow, table.frozenRowCount - 1);
    const strokeArray = [true, true, !needRightRowHeader, !needColumnHeader];
    createCustomCellSelectBorder(
      scene,
      cornerStartCol,
      startRow,
      endCol,
      cornerEndRow,
      'rightTopCorner',
      `${startCol}${startRow}${endCol}${endRow}`,
      strokeArray,
      style
    );
  }

  if (needLeftBottomCornerHeader) {
    const cornerEndCol = Math.min(endCol, table.frozenColCount - 1);
    const cornerStartRow = Math.max(startRow, table.rowCount - table.bottomFrozenRowCount);
    const strokeArray = [!needRowHeader, !needBottomColumnHeader, true, true];
    createCustomCellSelectBorder(
      scene,
      startCol,
      cornerStartRow,
      cornerEndCol,
      endRow,
      'leftBottomCorner',
      `${startCol}${startRow}${endCol}${endRow}`,
      strokeArray,
      style
    );
  }
  if (needRightBottomCornerHeader) {
    const cornerStartCol = Math.max(startCol, table.colCount - table.rightFrozenColCount);
    const cornerStartRow = Math.max(startRow, table.rowCount - table.bottomFrozenRowCount);
    const strokeArray = [!needRightRowHeader, true, true, !needBottomColumnHeader];
    createCustomCellSelectBorder(
      scene,
      cornerStartCol,
      cornerStartRow,
      endCol,
      endRow,
      'rightBottomCorner',
      `${startCol}${startRow}${endCol}${endRow}`,
      strokeArray,
      style
    );
  }
  if (needColumnHeader) {
    const columnHeaderStartCol = Math.max(startCol, table.frozenColCount);
    const columnHeaderEndCol = Math.min(endCol, table.colCount - table.rightFrozenColCount - 1);
    const columnHeaderEndRow = Math.min(endRow, table.frozenRowCount - 1);
    const strokeArray = [true, !needRightTopCornerHeader, !needBody, !needCornerHeader];
    createCustomCellSelectBorder(
      scene,
      columnHeaderStartCol,
      startRow,
      columnHeaderEndCol,
      columnHeaderEndRow,
      'columnHeader',
      `${startCol}${startRow}${endCol}${endRow}`,
      strokeArray,
      style
    );
  }
  if (needBottomColumnHeader) {
    const columnHeaderStartCol = Math.max(startCol, table.frozenColCount);
    const columnHeaderEndCol = Math.min(endCol, table.colCount - table.rightFrozenColCount - 1);
    const columnHeaderStartRow = Math.max(startRow, table.rowCount - table.bottomFrozenRowCount);
    const strokeArray = [!needBody, !needRightBottomCornerHeader, true, !needLeftBottomCornerHeader];
    createCustomCellSelectBorder(
      scene,
      columnHeaderStartCol,
      columnHeaderStartRow,
      columnHeaderEndCol,
      endRow,
      'bottomFrozen',
      `${startCol}${startRow}${endCol}${endRow}`,
      strokeArray,
      style
    );
  }
  if (needRowHeader) {
    const columnHeaderStartRow = Math.max(startRow, table.frozenRowCount);
    const columnHeaderEndRow = Math.min(endRow, table.rowCount - table.bottomFrozenRowCount - 1);
    const columnHeaderEndCol = Math.min(endCol, table.frozenColCount - 1);
    const strokeArray = [!needCornerHeader, !needBody, !needLeftBottomCornerHeader, true];
    createCustomCellSelectBorder(
      scene,
      startCol,
      columnHeaderStartRow,
      columnHeaderEndCol,
      columnHeaderEndRow,
      'rowHeader',
      `${startCol}${startRow}${endCol}${endRow}`,
      strokeArray,
      style
    );
  }
  if (needRightRowHeader) {
    const columnHeaderStartRow = Math.max(startRow, table.frozenRowCount);
    const columnHeaderEndRow = Math.min(endRow, table.rowCount - table.bottomFrozenRowCount - 1);
    const columnHeaderStartCol = Math.max(startCol, table.colCount - table.rightFrozenColCount);
    const strokeArray = [!needRightTopCornerHeader, true, !needRightBottomCornerHeader, !needBody];
    createCustomCellSelectBorder(
      scene,
      columnHeaderStartCol,
      columnHeaderStartRow,
      endCol,
      columnHeaderEndRow,
      'rightFrozen',
      `${startCol}${startRow}${endCol}${endRow}`,
      strokeArray,
      style
    );
  }
  if (needBody) {
    const columnHeaderStartCol = Math.max(startCol, table.frozenColCount);
    const columnHeaderStartRow = Math.max(startRow, table.frozenRowCount);
    const columnHeaderEndCol = Math.min(endCol, table.colCount - table.rightFrozenColCount - 1);
    const columnHeaderEndRow = Math.min(endRow, table.rowCount - table.bottomFrozenRowCount - 1);
    const strokeArray = [!needColumnHeader, !needRightRowHeader, !needBottomColumnHeader, !needRowHeader];
    createCustomCellSelectBorder(
      scene,
      columnHeaderStartCol,
      columnHeaderStartRow,
      columnHeaderEndCol,
      columnHeaderEndRow,
      'body',
      `${startCol}${startRow}${endCol}${endRow}`,
      strokeArray,
      style
    );
  }
}

function createCustomCellSelectBorder(
  scene: Scenegraph,
  start_Col: number,
  start_Row: number,
  end_Col: number,
  end_Row: number,
  selectRangeType: CellSubLocation,
  selectId: string, //整体区域${endRow}-${startCol}${startRow}${endCol}${endRow}作为其编号
  strokes: boolean[],
  style: CustomSelectionStyle
) {
  const startCol = Math.min(start_Col, end_Col);
  const startRow = Math.min(start_Row, end_Row);
  const endCol = Math.max(start_Col, end_Col);
  const endRow = Math.max(start_Row, end_Row);
  const firstCellBound = scene.highPerformanceGetCell(startCol, startRow).globalAABBBounds;
  const rect = createRect({
    pickable: false,
    fill: style.cellBgColor ?? false,
    lineWidth: style.cellBorderLineWidth ?? 0,
    lineDash: style.cellBorderLineDash ?? [],
    stroke: strokes.map(stroke => {
      if (stroke) {
        return style.cellBorderColor as string;
      }
      return false;
    }),
    x: firstCellBound.x1 - scene.tableGroup.attribute.x, // 坐标xy及宽高width height 不需要这里计算具体值 update-select-border文件中updateComponent方法中有逻辑  且该方法调用时间是render
    y: firstCellBound.y1 - scene.tableGroup.attribute.y,
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
  scene.customSelectedRangeComponents.set(`${startCol}-${startRow}-${endCol}-${endRow}-${selectId}`, {
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
