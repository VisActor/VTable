import type { IRect } from '@src/vrender';
import type { Scenegraph } from '../scenegraph';
import type { CellSubLocation } from '../../ts-types';
import { getCellMergeInfo } from '../utils/get-cell-merge';

export function updateAllSelectComponent(scene: Scenegraph) {
  scene.selectingRangeComponents.forEach((selectComp: { rect: IRect; role: CellSubLocation }, key: string) => {
    updateComponent(selectComp, key, scene);
  });
  scene.selectedRangeComponents.forEach((selectComp: { rect: IRect; role: CellSubLocation }, key: string) => {
    updateComponent(selectComp, key, scene);
  });
}

function updateComponent(selectComp: { rect: IRect; role: CellSubLocation }, key: string, scene: Scenegraph) {
  const [startColStr, startRowStr, endColStr, endRowStr] = key.split('-');
  const startCol = parseInt(startColStr, 10);
  const startRow = parseInt(startRowStr, 10);
  const endCol = parseInt(endColStr, 10);
  const endRow = parseInt(endRowStr, 10);
  // 下面为计算选中区域使用的行列值
  let computeRectCellRangeStartCol = startCol;
  let computeRectCellRangeStartRow = startRow;
  let computeRectCellRangeEndCol = endCol;
  let computeRectCellRangeEndRow = endRow;
  // 下面逻辑根据选中区域所属表格部分 来判断可视区域内容的选中单元格范围
  let visibleCellRange;
  switch (selectComp.role) {
    case 'rowHeader':
      visibleCellRange = scene.table.getBodyVisibleRowRange();
      if (visibleCellRange) {
        computeRectCellRangeStartRow = Math.max(startRow, visibleCellRange.rowStart - 1);
        computeRectCellRangeEndRow = Math.min(endRow, visibleCellRange.rowEnd + 1);
      }
      break;
    case 'columnHeader':
      visibleCellRange = scene.table.getBodyVisibleCellRange();
      if (visibleCellRange) {
        computeRectCellRangeStartCol = Math.max(startCol, visibleCellRange.colStart - 1);
        computeRectCellRangeEndCol = Math.min(endCol, visibleCellRange.colEnd + 1);
      }
      break;
    case 'cornerHeader':
      break;
    case 'bottomFrozen':
      visibleCellRange = scene.table.getBodyVisibleCellRange();
      if (visibleCellRange) {
        computeRectCellRangeStartCol = Math.max(startCol, visibleCellRange.colStart - 1);
        computeRectCellRangeEndCol = Math.min(endCol, visibleCellRange.colEnd + 1);
      }
      break;
    case 'rightFrozen':
      visibleCellRange = scene.table.getBodyVisibleCellRange();
      if (visibleCellRange) {
        computeRectCellRangeStartRow = Math.max(startRow, visibleCellRange.rowStart - 1);
        computeRectCellRangeEndRow = Math.min(endRow, visibleCellRange.rowEnd + 1);
      }
      break;
    case 'rightTopCorner':
      break;
    case 'leftBottomCorner':
      break;
    case 'rightBottomCorner':
      break;
    default:
      visibleCellRange = scene.table.getBodyVisibleCellRange();
      if (visibleCellRange) {
        computeRectCellRangeStartRow = Math.max(startRow, visibleCellRange.rowStart - 1);
        computeRectCellRangeEndRow = Math.min(endRow, visibleCellRange.rowEnd + 1);
        computeRectCellRangeStartCol = Math.max(startCol, visibleCellRange.colStart - 1);
        computeRectCellRangeEndCol = Math.min(endCol, visibleCellRange.colEnd + 1);
      }
      break;
  }
  // const cellRange = scene.table.getCellRange(startCol, startRow);
  // const colsWidth = scene.table.getColsWidth(cellRange.start.col, endCol);
  // const rowsHeight = scene.table.getRowsHeight(cellRange.start.row, endRow);
  const colsWidth = scene.table.getColsWidth(computeRectCellRangeStartCol, computeRectCellRangeEndCol);
  const rowsHeight = scene.table.getRowsHeight(computeRectCellRangeStartRow, computeRectCellRangeEndRow);
  const firstCellBound = scene.highPerformanceGetCell(
    computeRectCellRangeStartCol,
    computeRectCellRangeStartRow
  ).globalAABBBounds;

  selectComp.rect.setAttributes({
    x: firstCellBound.x1 - scene.tableGroup.attribute.x, //坐标xy在下面的逻辑中会做适当调整
    y: firstCellBound.y1 - scene.tableGroup.attribute.y,
    width: colsWidth,
    height: rowsHeight,
    visible: true
  });

  //#region 判断是不是按着表头部分的选中框 因为绘制层级的原因 线宽会被遮住一半，因此需要动态调整层级
  const isNearRowHeader = scene.table.frozenColCount ? startCol === scene.table.frozenColCount : false;
  const isNearRightRowHeader = scene.table.rightFrozenColCount
    ? scene.table.rightFrozenColCount > 0 && endCol === scene.table.colCount - scene.table.rightFrozenColCount - 1
    : false;
  const isNearColHeader = scene.table.frozenRowCount ? startRow === scene.table.frozenRowCount : true;
  const isNearBottomColHeader = scene.table.bottomFrozenRowCount
    ? endRow === scene.table.rowCount - scene.table.bottomFrozenRowCount - 1
    : false;
  if (
    (isNearRowHeader && selectComp.rect.attribute.stroke[3]) ||
    (isNearRightRowHeader && selectComp.rect.attribute.stroke[1]) ||
    (isNearColHeader && selectComp.rect.attribute.stroke[0]) ||
    (isNearBottomColHeader && selectComp.rect.attribute.stroke[2])
  ) {
    if (isNearRowHeader && selectComp.rect.attribute.stroke[3]) {
      scene.tableGroup.insertAfter(
        selectComp.rect,
        selectComp.role === 'columnHeader'
          ? scene.cornerHeaderGroup
          : selectComp.role === 'bottomFrozen'
          ? scene.leftBottomCornerGroup
          : scene.rowHeaderGroup
      );
    }

    if (isNearBottomColHeader && selectComp.rect.attribute.stroke[2]) {
      scene.tableGroup.insertAfter(
        selectComp.rect,
        selectComp.role === 'rowHeader'
          ? scene.leftBottomCornerGroup
          : selectComp.role === 'rightFrozen'
          ? scene.rightBottomCornerGroup
          : scene.bottomFrozenGroup
      );
    }

    if (isNearColHeader && selectComp.rect.attribute.stroke[0]) {
      scene.tableGroup.insertAfter(
        selectComp.rect,
        selectComp.role === 'rowHeader'
          ? scene.cornerHeaderGroup
          : selectComp.role === 'rightFrozen'
          ? scene.rightTopCornerGroup
          : scene.colHeaderGroup
      );
    }
    if (isNearRightRowHeader && selectComp.rect.attribute.stroke[1]) {
      scene.tableGroup.insertAfter(
        selectComp.rect,
        selectComp.role === 'columnHeader'
          ? scene.rightTopCornerGroup
          : selectComp.role === 'bottomFrozen'
          ? scene.rightBottomCornerGroup
          : scene.rightFrozenGroup
      );
    }

    //#region 调整层级后 滚动情况下会出现绘制范围出界 如body的选中框 渲染在了rowheader上面，所有需要调整选中框rect的 边界
    if (
      selectComp.rect.attribute.x < scene.table.getFrozenColsWidth() &&
      // selectComp.rect.attribute.x + selectComp.rect.attribute.width > scene.rowHeaderGroup.attribute.width &&
      scene.table.scrollLeft > 0 &&
      (selectComp.role === 'body' || selectComp.role === 'columnHeader' || selectComp.role === 'bottomFrozen')
    ) {
      const width = selectComp.rect.attribute.width - (scene.table.getFrozenColsWidth() - selectComp.rect.attribute.x);
      selectComp.rect.setAttributes({
        x: selectComp.rect.attribute.x + (scene.table.getFrozenColsWidth() - selectComp.rect.attribute.x),
        width: width > 0 ? width : 0
      });
    }
    if (
      // selectComp.rect.attribute.x < scene.rightFrozenGroup.attribute.x &&
      scene.table.getRightFrozenColsWidth() > 0 && // right冻结列存在的情况下
      scene.rightFrozenGroup.attribute.height > 0 &&
      selectComp.rect.attribute.x + selectComp.rect.attribute.width > scene.rightFrozenGroup.attribute.x &&
      (selectComp.role === 'body' || selectComp.role === 'columnHeader' || selectComp.role === 'bottomFrozen')
    ) {
      const width = scene.rightFrozenGroup.attribute.x - selectComp.rect.attribute.x;
      selectComp.rect.setAttributes({
        x: selectComp.rect.attribute.x,
        width: width > 0 ? width : 0
      });
    }
    if (
      selectComp.rect.attribute.y < scene.colHeaderGroup.attribute.height &&
      scene.table.scrollTop > 0 &&
      (selectComp.role === 'body' || selectComp.role === 'rowHeader' || selectComp.role === 'rightFrozen')
    ) {
      const height =
        selectComp.rect.attribute.height - (scene.colHeaderGroup.attribute.height - selectComp.rect.attribute.y);
      selectComp.rect.setAttributes({
        y: selectComp.rect.attribute.y + (scene.colHeaderGroup.attribute.height - selectComp.rect.attribute.y),
        height: height > 0 ? height : 0
      });
    }
    if (
      scene.bottomFrozenGroup.attribute.width > 0 &&
      scene.bottomFrozenGroup.attribute.height > 0 &&
      selectComp.rect.attribute.y + selectComp.rect.attribute.height > scene.bottomFrozenGroup.attribute.y &&
      (selectComp.role === 'body' || selectComp.role === 'rowHeader' || selectComp.role === 'rightFrozen')
    ) {
      const height = scene.bottomFrozenGroup.attribute.y - selectComp.rect.attribute.y;
      selectComp.rect.setAttributes({
        y: selectComp.rect.attribute.y,
        height: height > 0 ? height : 0
      });
    }
    //#endregion
  } else {
    scene.tableGroup.insertAfter(
      selectComp.rect,
      selectComp.role === 'body'
        ? scene.bodyGroup
        : selectComp.role === 'columnHeader'
        ? scene.colHeaderGroup
        : selectComp.role === 'rowHeader'
        ? scene.rowHeaderGroup
        : selectComp.role === 'cornerHeader'
        ? scene.cornerHeaderGroup
        : selectComp.role === 'rightTopCorner'
        ? scene.rightTopCornerGroup
        : selectComp.role === 'rightFrozen'
        ? scene.rightFrozenGroup
        : selectComp.role === 'leftBottomCorner'
        ? scene.leftBottomCornerGroup
        : selectComp.role === 'bottomFrozen'
        ? scene.bottomFrozenGroup
        : scene.rightBottomCornerGroup
    );
  }
  //#endregion

  //#region 处理边缘被截问题
  let diffSize = 0;
  if (typeof selectComp.rect.attribute.lineWidth === 'number') {
    diffSize = Math.ceil(selectComp.rect.attribute.lineWidth / 2);
  }
  if (endCol === scene.table.colCount - 1) {
    if (Array.isArray(selectComp.rect.attribute.lineWidth)) {
      diffSize = Math.ceil((selectComp.rect.attribute.lineWidth[1] ?? 0) / 2);
    }
    selectComp.rect.setAttributes({
      width: selectComp.rect.attribute.width - diffSize
    });
  }
  if (startCol === 0) {
    if (Array.isArray(selectComp.rect.attribute.lineWidth)) {
      diffSize = Math.ceil((selectComp.rect.attribute.lineWidth[3] ?? 0) / 2);
    }
    selectComp.rect.setAttributes({
      x: selectComp.rect.attribute.x + diffSize,
      width: selectComp.rect.attribute.width - diffSize
    });
  }
  if (endRow === scene.table.rowCount - 1) {
    if (Array.isArray(selectComp.rect.attribute.lineWidth)) {
      diffSize = Math.ceil((selectComp.rect.attribute.lineWidth[2] ?? 0) / 2);
    }
    selectComp.rect.setAttributes({
      height: selectComp.rect.attribute.height - diffSize
    });
  }
  if (startRow === 0) {
    if (Array.isArray(selectComp.rect.attribute.lineWidth)) {
      diffSize = Math.ceil((selectComp.rect.attribute.lineWidth[0] ?? 0) / 2);
    }
    selectComp.rect.setAttributes({
      y: selectComp.rect.attribute.y + diffSize,
      height: selectComp.rect.attribute.height - diffSize
    });
  }
  //#endregion
}

export function updateCellSelectBorder(
  scene: Scenegraph,
  newStartCol: number,
  newStartRow: number,
  newEndCol: number,
  newEndRow: number
) {
  let startCol = Math.max(Math.min(newEndCol, newStartCol), 0);
  let startRow = Math.max(Math.min(newEndRow, newStartRow), 0);
  let endCol = Math.min(Math.max(newEndCol, newStartCol), scene.table.colCount - 1);
  let endRow = Math.min(Math.max(newEndRow, newStartRow), scene.table.rowCount - 1);
  //#region region 校验四周的单元格有没有合并的情况，如有则扩大范围
  const extendSelectRange = () => {
    let isExtend = false;
    for (let col = startCol; col <= endCol; col++) {
      if (col === startCol) {
        for (let row = startRow; row <= endRow; row++) {
          const mergeInfo = getCellMergeInfo(scene.table, col, row);
          if (mergeInfo && mergeInfo.start.col < startCol) {
            startCol = mergeInfo.start.col;
            isExtend = true;
            break;
          }
        }
      }
      if (!isExtend && col === endCol) {
        for (let row = startRow; row <= endRow; row++) {
          const mergeInfo = getCellMergeInfo(scene.table, col, row);
          if (mergeInfo && Math.min(mergeInfo.end.col, scene.table.colCount - 1) > endCol) {
            endCol = mergeInfo.end.col;
            isExtend = true;
            break;
          }
        }
      }

      if (isExtend) {
        break;
      }
    }
    if (!isExtend) {
      for (let row = startRow; row <= endRow; row++) {
        if (row === startRow) {
          for (let col = startCol; col <= endCol; col++) {
            const mergeInfo = getCellMergeInfo(scene.table, col, row);
            if (mergeInfo && mergeInfo.start.row < startRow) {
              startRow = mergeInfo.start.row;
              isExtend = true;
              break;
            }
          }
        }
        if (!isExtend && row === endRow) {
          for (let col = startCol; col <= endCol; col++) {
            const mergeInfo = getCellMergeInfo(scene.table, col, row);
            if (mergeInfo && Math.min(mergeInfo.end.row, scene.table.rowCount - 1) > endRow) {
              endRow = mergeInfo.end.row;
              isExtend = true;
              break;
            }
          }
        }

        if (isExtend) {
          break;
        }
      }
    }
    if (isExtend) {
      extendSelectRange();
    }
  };
  extendSelectRange();
  //#endregion
  scene.selectingRangeComponents.forEach((selectComp: { rect: IRect; role: CellSubLocation }, key: string) => {
    selectComp.rect.delete();
  });
  scene.selectingRangeComponents = new Map();

  let needRowHeader = false;
  let needRightRowHeader = false; // 右侧冻结
  let needColumnHeader = false;
  let needBottomColumnHeader = false; // 底部冻结
  let needBody = false;
  let needCornerHeader = false;
  let needRightTopCornerHeader = false;
  let needRightBottomCornerHeader = false;
  let needLeftBottomCornerHeader = false;
  if (startCol <= scene.table.frozenColCount - 1 && startRow <= scene.table.frozenRowCount - 1) {
    needCornerHeader = true;
  }
  if (endCol >= scene.table.colCount - scene.table.rightFrozenColCount && startRow <= scene.table.frozenRowCount - 1) {
    needRightTopCornerHeader = true;
  }

  if (startCol <= scene.table.frozenColCount - 1 && endRow >= scene.table.rowCount - scene.table.bottomFrozenRowCount) {
    needLeftBottomCornerHeader = true;
  }

  if (
    endCol >= scene.table.colCount - scene.table.rightFrozenColCount &&
    endRow >= scene.table.rowCount - scene.table.bottomFrozenRowCount
  ) {
    needRightBottomCornerHeader = true;
  }

  if (
    startCol <= scene.table.frozenColCount - 1 &&
    endRow >= scene.table.frozenRowCount &&
    startRow <= scene.table.rowCount - scene.table.bottomFrozenRowCount - 1
  ) {
    needRowHeader = true;
  }
  if (
    endCol >= scene.table.colCount - scene.table.rightFrozenColCount &&
    endRow >= scene.table.frozenRowCount &&
    startRow <= scene.table.rowCount - scene.table.bottomFrozenRowCount - 1
  ) {
    needRightRowHeader = true;
  }

  if (
    startRow <= scene.table.frozenRowCount - 1 &&
    endCol >= scene.table.frozenColCount &&
    startCol <= scene.table.colCount - scene.table.rightFrozenColCount - 1
  ) {
    needColumnHeader = true;
  }
  if (
    endRow >= scene.table.rowCount - scene.table.bottomFrozenRowCount &&
    endCol >= scene.table.frozenColCount &&
    startCol <= scene.table.colCount - scene.table.rightFrozenColCount - 1
  ) {
    needBottomColumnHeader = true;
  }
  if (
    startCol <= scene.table.colCount - scene.table.rightFrozenColCount - 1 &&
    endCol >= scene.table.frozenColCount &&
    startRow <= scene.table.rowCount - scene.table.bottomFrozenRowCount - 1 &&
    endRow >= scene.table.frozenRowCount
  ) {
    needBody = true;
  }

  // TODO 可以尝试不拆分三个表头和body【前提是theme中合并配置】 用一个SelectBorder 需要结合clip，并动态设置border的范围【依据区域范围 已经是否跨表头及body】
  if (needCornerHeader) {
    const cornerEndCol = Math.min(endCol, scene.table.frozenColCount - 1);
    const cornerEndRow = Math.min(endRow, scene.table.frozenRowCount - 1);
    const strokeArray = [true, !needColumnHeader, !needRowHeader, true];
    scene.createCellSelectBorder(
      startCol,
      startRow,
      cornerEndCol,
      cornerEndRow,
      'cornerHeader',
      `${startCol}${startRow}${endCol}${endRow}`,
      strokeArray
    );
  }
  if (needRightTopCornerHeader) {
    const cornerStartCol = Math.max(startCol, scene.table.colCount - scene.table.rightFrozenColCount);
    const cornerEndRow = Math.min(endRow, scene.table.frozenRowCount - 1);
    const strokeArray = [true, true, !needRightRowHeader, !needColumnHeader];
    scene.createCellSelectBorder(
      cornerStartCol,
      startRow,
      endCol,
      cornerEndRow,
      'rightTopCorner',
      `${startCol}${startRow}${endCol}${endRow}`,
      strokeArray
    );
  }

  if (needLeftBottomCornerHeader) {
    const cornerEndCol = Math.min(endCol, scene.table.frozenColCount - 1);
    const cornerStartRow = Math.max(startRow, scene.table.rowCount - scene.table.bottomFrozenRowCount);
    const strokeArray = [!needRowHeader, !needBottomColumnHeader, true, true];
    scene.createCellSelectBorder(
      startCol,
      cornerStartRow,
      cornerEndCol,
      endRow,
      'leftBottomCorner',
      `${startCol}${startRow}${endCol}${endRow}`,
      strokeArray
    );
  }
  if (needRightBottomCornerHeader) {
    const cornerStartCol = Math.max(startCol, scene.table.colCount - scene.table.rightFrozenColCount);
    const cornerStartRow = Math.max(startRow, scene.table.rowCount - scene.table.bottomFrozenRowCount);
    const strokeArray = [!needRightRowHeader, true, true, !needBottomColumnHeader];
    scene.createCellSelectBorder(
      cornerStartCol,
      cornerStartRow,
      endCol,
      endRow,
      'rightBottomCorner',
      `${startCol}${startRow}${endCol}${endRow}`,
      strokeArray
    );
  }
  if (needColumnHeader) {
    const columnHeaderStartCol = Math.max(startCol, scene.table.frozenColCount);
    const columnHeaderEndCol = Math.min(endCol, scene.table.colCount - scene.table.rightFrozenColCount - 1);
    const columnHeaderEndRow = Math.min(endRow, scene.table.frozenRowCount - 1);
    const strokeArray = [true, !needRightTopCornerHeader, !needBody, !needCornerHeader];
    scene.createCellSelectBorder(
      columnHeaderStartCol,
      startRow,
      columnHeaderEndCol,
      columnHeaderEndRow,
      'columnHeader',
      `${startCol}${startRow}${endCol}${endRow}`,
      strokeArray
    );
  }
  if (needBottomColumnHeader) {
    const columnHeaderStartCol = Math.max(startCol, scene.table.frozenColCount);
    const columnHeaderEndCol = Math.min(endCol, scene.table.colCount - scene.table.rightFrozenColCount - 1);
    const columnHeaderStartRow = Math.max(startRow, scene.table.rowCount - scene.table.bottomFrozenRowCount);
    const strokeArray = [!needBody, !needRightBottomCornerHeader, true, !needLeftBottomCornerHeader];
    scene.createCellSelectBorder(
      columnHeaderStartCol,
      columnHeaderStartRow,
      columnHeaderEndCol,
      endRow,
      'bottomFrozen',
      `${startCol}${startRow}${endCol}${endRow}`,
      strokeArray
    );
  }
  if (needRowHeader) {
    const columnHeaderStartRow = Math.max(startRow, scene.table.frozenRowCount);
    const columnHeaderEndRow = Math.min(endRow, scene.table.rowCount - scene.table.bottomFrozenRowCount - 1);
    const columnHeaderEndCol = Math.min(endCol, scene.table.frozenColCount - 1);
    const strokeArray = [!needCornerHeader, !needBody, !needLeftBottomCornerHeader, true];
    scene.createCellSelectBorder(
      startCol,
      columnHeaderStartRow,
      columnHeaderEndCol,
      columnHeaderEndRow,
      'rowHeader',
      `${startCol}${startRow}${endCol}${endRow}`,
      strokeArray
    );
  }
  if (needRightRowHeader) {
    const columnHeaderStartRow = Math.max(startRow, scene.table.frozenRowCount);
    const columnHeaderEndRow = Math.min(endRow, scene.table.rowCount - scene.table.bottomFrozenRowCount - 1);
    const columnHeaderStartCol = Math.max(startCol, scene.table.colCount - scene.table.rightFrozenColCount);
    const strokeArray = [!needRightTopCornerHeader, true, !needRightBottomCornerHeader, !needBody];
    scene.createCellSelectBorder(
      columnHeaderStartCol,
      columnHeaderStartRow,
      endCol,
      columnHeaderEndRow,
      'rightFrozen',
      `${startCol}${startRow}${endCol}${endRow}`,
      strokeArray
    );
  }
  if (needBody) {
    const columnHeaderStartCol = Math.max(startCol, scene.table.frozenColCount);
    const columnHeaderStartRow = Math.max(startRow, scene.table.frozenRowCount);
    const columnHeaderEndCol = Math.min(endCol, scene.table.colCount - scene.table.rightFrozenColCount - 1);
    const columnHeaderEndRow = Math.min(endRow, scene.table.rowCount - scene.table.bottomFrozenRowCount - 1);
    const strokeArray = [!needColumnHeader, !needRightRowHeader, !needBottomColumnHeader, !needRowHeader];
    scene.createCellSelectBorder(
      columnHeaderStartCol,
      columnHeaderStartRow,
      columnHeaderEndCol,
      columnHeaderEndRow,
      'body',
      `${startCol}${startRow}${endCol}${endRow}`,
      strokeArray
    );
  }
}
