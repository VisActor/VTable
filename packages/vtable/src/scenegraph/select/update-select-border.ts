import { createRect, type IRect } from '@src/vrender';
import type { Scenegraph } from '../scenegraph';
import type { CellRange, CellSubLocation } from '../../ts-types';
import { getCellMergeInfo } from '../utils/get-cell-merge';

export function updateAllSelectComponent(scene: Scenegraph) {
  scene.customSelectedRangeComponents.forEach((selectComp: { rect: IRect; role: CellSubLocation }, key: string) => {
    updateComponent(selectComp, key, scene);
  });

  scene.selectingRangeComponents.forEach(
    (selectComp: { rect: IRect; fillhandle?: IRect; role: CellSubLocation }, key: string) => {
      updateComponent(selectComp, key, scene);
    }
  );
  scene.selectedRangeComponents.forEach(
    (selectComp: { rect: IRect; fillhandle?: IRect; role: CellSubLocation }, key: string) => {
      updateComponent(selectComp, key, scene);
    }
  );
}

function updateComponent(
  selectComp: { rect: IRect; fillhandle?: IRect; role: CellSubLocation },
  key: string,
  scene: Scenegraph
) {
  const table = scene.table;
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
      visibleCellRange = table.getBodyVisibleRowRange();
      if (visibleCellRange) {
        computeRectCellRangeStartRow = Math.max(startRow, visibleCellRange.rowStart - 1);
        computeRectCellRangeEndRow = Math.min(endRow, visibleCellRange.rowEnd + 1);
      }
      break;
    case 'columnHeader':
      visibleCellRange = table.getBodyVisibleCellRange();
      if (visibleCellRange) {
        computeRectCellRangeStartCol = Math.max(startCol, visibleCellRange.colStart - 1);
        computeRectCellRangeEndCol = Math.min(endCol, visibleCellRange.colEnd + 1);
      }
      break;
    case 'cornerHeader':
      break;
    case 'bottomFrozen':
      visibleCellRange = table.getBodyVisibleCellRange();
      if (visibleCellRange) {
        computeRectCellRangeStartCol = Math.max(startCol, visibleCellRange.colStart - 1);
        computeRectCellRangeEndCol = Math.min(endCol, visibleCellRange.colEnd + 1);
      }
      break;
    case 'rightFrozen':
      visibleCellRange = table.getBodyVisibleCellRange();
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
      visibleCellRange = table.getBodyVisibleCellRange();
      if (visibleCellRange) {
        computeRectCellRangeStartRow = Math.max(startRow, visibleCellRange.rowStart - 1);
        computeRectCellRangeEndRow = Math.min(endRow, visibleCellRange.rowEnd + 1);
        computeRectCellRangeStartCol = Math.max(startCol, visibleCellRange.colStart - 1);
        computeRectCellRangeEndCol = Math.min(endCol, visibleCellRange.colEnd + 1);
      }
      break;
  }
  // const cellRange = table.getCellRange(startCol, startRow);
  // const colsWidth = table.getColsWidth(cellRange.start.col, endCol);
  // const rowsHeight = table.getRowsHeight(cellRange.start.row, endRow);
  const colsWidth = table.getColsWidth(computeRectCellRangeStartCol, computeRectCellRangeEndCol);
  const rowsHeight = table.getRowsHeight(computeRectCellRangeStartRow, computeRectCellRangeEndRow);
  const firstCellBound = scene.highPerformanceGetCell(
    computeRectCellRangeStartCol,
    computeRectCellRangeStartRow
  ).globalAABBBounds;
  const lastCellBound = scene.highPerformanceGetCell(
    computeRectCellRangeEndCol,
    computeRectCellRangeEndRow
  ).globalAABBBounds;

  selectComp.rect.setAttributes({
    x: firstCellBound.x1 - scene.tableGroup.attribute.x, //坐标xy在下面的逻辑中会做适当调整
    y: firstCellBound.y1 - scene.tableGroup.attribute.y,
    width: colsWidth,
    height: rowsHeight,
    visible: true
  });
  if (selectComp.fillhandle) {
    selectComp.fillhandle?.setAttributes({
      x: lastCellBound.x2 - scene.tableGroup.attribute.x - 3, // 调整小方块位置
      y: lastCellBound.y2 - scene.tableGroup.attribute.y - 3, // 调整小方块位置
      width: 6,
      height: 6,
      visible: true
    });
  }

  //#region 判断是不是按着表头部分的选中框 因为绘制层级的原因 线宽会被遮住一半，因此需要动态调整层级
  let isNearRowHeader = table.frozenColCount ? startCol === table.frozenColCount : false;
  if (!isNearRowHeader && table.frozenColCount && table.scrollLeft > 0 && startCol >= table.frozenColCount) {
    const startColRelativePosition = table.getColsWidth(0, startCol - 1) - table.scrollLeft;
    if (startColRelativePosition < table.getFrozenColsWidth()) {
      isNearRowHeader = true;
    }
  }

  let isNearRightRowHeader = table.rightFrozenColCount
    ? table.rightFrozenColCount > 0 && endCol === table.colCount - table.rightFrozenColCount - 1
    : false;
  if (!isNearRightRowHeader && table.rightFrozenColCount && endCol < table.colCount - table.rightFrozenColCount) {
    const endColRelativePosition = table.getColsWidth(0, endCol) - table.scrollLeft;
    if (endColRelativePosition > table.tableNoFrameWidth - table.getRightFrozenColsWidth()) {
      isNearRightRowHeader = true;
    }
  }

  let isNearColHeader = table.frozenRowCount ? startRow === table.frozenRowCount : true;
  if (!isNearColHeader && table.frozenRowCount && table.scrollTop > 0 && startRow >= table.frozenRowCount) {
    const startRowRelativePosition = table.getRowsHeight(0, startRow - 1) - table.scrollTop;
    if (startRowRelativePosition < table.getFrozenRowsHeight()) {
      isNearColHeader = true;
    }
  }

  let isNearBottomColHeader = table.bottomFrozenRowCount
    ? endRow === table.rowCount - table.bottomFrozenRowCount - 1
    : false;
  if (!isNearBottomColHeader && table.bottomFrozenRowCount && endRow < table.rowCount - table.bottomFrozenRowCount) {
    const endRowRelativePosition = table.getRowsHeight(0, endRow) - table.scrollTop;
    if (endRowRelativePosition > table.tableNoFrameHeight - table.getBottomFrozenRowsHeight()) {
      isNearBottomColHeader = true;
    }
  }

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
      selectComp.rect.attribute.x < table.getFrozenColsWidth() &&
      // selectComp.rect.attribute.x + selectComp.rect.attribute.width > scene.rowHeaderGroup.attribute.width &&
      table.scrollLeft > 0 &&
      (selectComp.role === 'body' || selectComp.role === 'columnHeader' || selectComp.role === 'bottomFrozen')
    ) {
      const width = selectComp.rect.attribute.width - (table.getFrozenColsWidth() - selectComp.rect.attribute.x);
      selectComp.rect.setAttributes({
        x: selectComp.rect.attribute.x + (table.getFrozenColsWidth() - selectComp.rect.attribute.x),
        width: width > 0 ? width : 0
      });
      selectComp.fillhandle?.setAttributes({
        visible: width > 0
      });
    }
    if (
      // selectComp.rect.attribute.x < scene.rightFrozenGroup.attribute.x &&
      table.getRightFrozenColsWidth() > 0 && // right冻结列存在的情况下
      scene.rightFrozenGroup.attribute.height > 0 &&
      selectComp.rect.attribute.x + selectComp.rect.attribute.width > scene.rightFrozenGroup.attribute.x &&
      (selectComp.role === 'body' || selectComp.role === 'columnHeader' || selectComp.role === 'bottomFrozen')
    ) {
      const width = scene.rightFrozenGroup.attribute.x - selectComp.rect.attribute.x;
      selectComp.rect.setAttributes({
        x: selectComp.rect.attribute.x,
        width: width > 0 ? width : 0
      });
      selectComp.fillhandle?.setAttributes({
        visible: width - colsWidth > 0
      });
    }
    if (
      selectComp.rect.attribute.y < scene.colHeaderGroup.attribute.height &&
      table.scrollTop > 0 &&
      (selectComp.role === 'body' || selectComp.role === 'rowHeader' || selectComp.role === 'rightFrozen')
    ) {
      const height =
        selectComp.rect.attribute.height - (scene.colHeaderGroup.attribute.height - selectComp.rect.attribute.y);
      selectComp.rect.setAttributes({
        y: selectComp.rect.attribute.y + (scene.colHeaderGroup.attribute.height - selectComp.rect.attribute.y),
        height: height > 0 ? height : 0
      });
      selectComp.fillhandle?.setAttributes({
        visible: height > 0
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
      selectComp.fillhandle?.setAttributes({
        visible: height - rowsHeight > 0
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
  if (endCol === table.colCount - 1) {
    if (Array.isArray(selectComp.rect.attribute.lineWidth)) {
      diffSize = Math.ceil((selectComp.rect.attribute.lineWidth[1] ?? 0) / 2);
    }
    selectComp.rect.setAttributes({
      width: selectComp.rect.attribute.width - diffSize
    });
    // selectComp.fillhandle?.setAttributes({
    //   width: selectComp.rect.attribute.width - diffSize
    // });
  }
  if (startCol === 0) {
    if (Array.isArray(selectComp.rect.attribute.lineWidth)) {
      diffSize = Math.ceil((selectComp.rect.attribute.lineWidth[3] ?? 0) / 2);
    }
    selectComp.rect.setAttributes({
      x: selectComp.rect.attribute.x + diffSize,
      width: selectComp.rect.attribute.width - diffSize
    });
    // selectComp.fillhandle?.setAttributes({
    //   x: selectComp.rect.attribute.x + diffSize,
    //   width: selectComp.rect.attribute.width - diffSize
    // });
  }
  if (endRow === table.rowCount - 1) {
    if (Array.isArray(selectComp.rect.attribute.lineWidth)) {
      diffSize = Math.ceil((selectComp.rect.attribute.lineWidth[2] ?? 0) / 2);
    }
    selectComp.rect.setAttributes({
      height: selectComp.rect.attribute.height - diffSize
    });
    // selectComp.fillhandle?.setAttributes({
    //   height: selectComp.rect.attribute.height - diffSize
    // });
  }
  if (startRow === 0) {
    if (Array.isArray(selectComp.rect.attribute.lineWidth)) {
      diffSize = Math.ceil((selectComp.rect.attribute.lineWidth[0] ?? 0) / 2);
    }
    selectComp.rect.setAttributes({
      y: selectComp.rect.attribute.y + diffSize,
      height: selectComp.rect.attribute.height - diffSize
    });
    // selectComp.fillhandle?.setAttributes({
    //   y: selectComp.rect.attribute.y + diffSize,
    //   height: selectComp.rect.attribute.height - diffSize
    // });
  }
  //#endregion
}

export function updateCellSelectBorder(
  scene: Scenegraph,
  selectRange: CellRange & { skipBodyMerge?: boolean },
  ifExtendSelectRange: boolean = true
) {
  const table = scene.table;
  const newStartCol = selectRange.start.col;
  const newStartRow = selectRange.start.row;
  const newEndCol = selectRange.end.col;
  const newEndRow = selectRange.end.row;
  const skipBodyMerge = selectRange.skipBodyMerge;

  let startCol = Math.max(Math.min(newEndCol, newStartCol), 0);
  let startRow = Math.max(Math.min(newEndRow, newStartRow), 0);
  let endCol = Math.min(Math.max(newEndCol, newStartCol), table.colCount - 1);
  let endRow = Math.min(Math.max(newEndRow, newStartRow), table.rowCount - 1);
  //#region region 校验四周的单元格有没有合并的情况，如有则扩大范围
  const extendSelectRange = () => {
    let isExtend = false;
    for (let col = startCol; col <= endCol; col++) {
      if (col === startCol) {
        for (let row = startRow; row <= endRow; row++) {
          if (!table.isHeader(col, row) && skipBodyMerge) {
            continue;
          }
          const mergeInfo = getCellMergeInfo(table, col, row);
          if (mergeInfo && mergeInfo.start.col < startCol) {
            startCol = mergeInfo.start.col;
            isExtend = true;
            break;
          }
        }
      }
      if (!isExtend && col === endCol) {
        for (let row = startRow; row <= endRow; row++) {
          if (!table.isHeader(col, row) && skipBodyMerge) {
            continue;
          }
          const mergeInfo = getCellMergeInfo(table, col, row);
          if (mergeInfo && Math.min(mergeInfo.end.col, table.colCount - 1) > endCol) {
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
            if (!table.isHeader(col, row) && skipBodyMerge) {
              continue;
            }
            const mergeInfo = getCellMergeInfo(table, col, row);
            if (mergeInfo && mergeInfo.start.row < startRow) {
              startRow = mergeInfo.start.row;
              isExtend = true;
              break;
            }
          }
        }
        if (!isExtend && row === endRow) {
          for (let col = startCol; col <= endCol; col++) {
            if (!table.isHeader(col, row) && skipBodyMerge) {
              continue;
            }
            const mergeInfo = getCellMergeInfo(table, col, row);
            if (mergeInfo && Math.min(mergeInfo.end.row, table.rowCount - 1) > endRow) {
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
  ifExtendSelectRange && extendSelectRange();
  //#endregion
  scene.selectingRangeComponents.forEach(
    (selectComp: { rect: IRect; fillhandle?: IRect; role: CellSubLocation }, key: string) => {
      selectComp.rect.delete();
      selectComp.fillhandle?.delete();
    }
  );
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
  if (startCol <= table.frozenColCount - 1 && startRow <= table.frozenRowCount - 1) {
    needCornerHeader = true;
  }
  if (endCol >= table.colCount - table.rightFrozenColCount && startRow <= table.frozenRowCount - 1) {
    needRightTopCornerHeader = true;
  }

  if (startCol <= table.frozenColCount - 1 && endRow >= table.rowCount - table.bottomFrozenRowCount) {
    needLeftBottomCornerHeader = true;
  }

  if (endCol >= table.colCount - table.rightFrozenColCount && endRow >= table.rowCount - table.bottomFrozenRowCount) {
    needRightBottomCornerHeader = true;
  }

  if (
    startCol <= table.frozenColCount - 1 &&
    endRow >= table.frozenRowCount &&
    startRow <= table.rowCount - table.bottomFrozenRowCount - 1
  ) {
    needRowHeader = true;
  }
  if (
    endCol >= table.colCount - table.rightFrozenColCount &&
    endRow >= table.frozenRowCount &&
    startRow <= table.rowCount - table.bottomFrozenRowCount - 1
  ) {
    needRightRowHeader = true;
  }

  if (
    startRow <= table.frozenRowCount - 1 &&
    endCol >= table.frozenColCount &&
    startCol <= table.colCount - table.rightFrozenColCount - 1
  ) {
    needColumnHeader = true;
  }
  if (
    endRow >= table.rowCount - table.bottomFrozenRowCount &&
    endCol >= table.frozenColCount &&
    startCol <= table.colCount - table.rightFrozenColCount - 1
  ) {
    needBottomColumnHeader = true;
  }
  if (
    startCol <= table.colCount - table.rightFrozenColCount - 1 &&
    endCol >= table.frozenColCount &&
    startRow <= table.rowCount - table.bottomFrozenRowCount - 1 &&
    endRow >= table.frozenRowCount
  ) {
    needBody = true;
  }

  // TODO 可以尝试不拆分三个表头和body【前提是theme中合并配置】 用一个SelectBorder 需要结合clip，并动态设置border的范围【依据区域范围 已经是否跨表头及body】
  if (needCornerHeader) {
    const cornerEndCol = Math.min(endCol, table.frozenColCount - 1);
    const cornerEndRow = Math.min(endRow, table.frozenRowCount - 1);
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
    const cornerStartCol = Math.max(startCol, table.colCount - table.rightFrozenColCount);
    const cornerEndRow = Math.min(endRow, table.frozenRowCount - 1);
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
    const cornerEndCol = Math.min(endCol, table.frozenColCount - 1);
    const cornerStartRow = Math.max(startRow, table.rowCount - table.bottomFrozenRowCount);
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
    const cornerStartCol = Math.max(startCol, table.colCount - table.rightFrozenColCount);
    const cornerStartRow = Math.max(startRow, table.rowCount - table.bottomFrozenRowCount);
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
    const columnHeaderStartCol = Math.max(startCol, table.frozenColCount);
    const columnHeaderEndCol = Math.min(endCol, table.colCount - table.rightFrozenColCount - 1);
    const columnHeaderEndRow = Math.min(endRow, table.frozenRowCount - 1);
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
    const columnHeaderStartCol = Math.max(startCol, table.frozenColCount);
    const columnHeaderEndCol = Math.min(endCol, table.colCount - table.rightFrozenColCount - 1);
    const columnHeaderStartRow = Math.max(startRow, table.rowCount - table.bottomFrozenRowCount);
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
    const columnHeaderStartRow = Math.max(startRow, table.frozenRowCount);
    const columnHeaderEndRow = Math.min(endRow, table.rowCount - table.bottomFrozenRowCount - 1);
    const columnHeaderEndCol = Math.min(endCol, table.frozenColCount - 1);
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
    const columnHeaderStartRow = Math.max(startRow, table.frozenRowCount);
    const columnHeaderEndRow = Math.min(endRow, table.rowCount - table.bottomFrozenRowCount - 1);
    const columnHeaderStartCol = Math.max(startCol, table.colCount - table.rightFrozenColCount);
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
    const columnHeaderStartCol = Math.max(startCol, table.frozenColCount);
    const columnHeaderStartRow = Math.max(startRow, table.frozenRowCount);
    const columnHeaderEndCol = Math.min(endCol, table.colCount - table.rightFrozenColCount - 1);
    const columnHeaderEndRow = Math.min(endRow, table.rowCount - table.bottomFrozenRowCount - 1);
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

export function hideCellSelectBorder(scene: Scenegraph) {
  scene.selectingRangeComponents.forEach((selectComp: { rect: IRect; role: CellSubLocation }, key: string) => {
    selectComp.rect.setAttribute('opacity', 0);
  });
  scene.selectedRangeComponents.forEach((selectComp: { rect: IRect; role: CellSubLocation }, key: string) => {
    selectComp.rect.setAttribute('opacity', 0);
  });
}

export function restoreCellSelectBorder(scene: Scenegraph) {
  scene.selectingRangeComponents.forEach((selectComp: { rect: IRect; role: CellSubLocation }, key: string) => {
    selectComp.rect.setAttribute('opacity', 1);
  });
  scene.selectedRangeComponents.forEach((selectComp: { rect: IRect; role: CellSubLocation }, key: string) => {
    selectComp.rect.setAttribute('opacity', 1);
  });
}
