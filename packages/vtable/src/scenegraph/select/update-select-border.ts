import { type IRect } from '@src/vrender';
import type { Scenegraph } from '../scenegraph';
import type { CellRange, CellSubLocation } from '../../ts-types';
import { getCellMergeInfo } from '../utils/get-cell-merge';
import { calculateCellRangeDistribution } from '../utils/cell-pos';
import { TABLE_EVENT_TYPE } from '../../core/TABLE_EVENT_TYPE';

export function updateAllSelectComponent(scene: Scenegraph) {
  // 三类选区组件需要统一更新：
  // - customSelectedRangeComponents：自定义样式选区（独立于默认 selectionStyle）
  // - selectingRangeComponents：拖拽/框选过程中的临时选区
  // - selectedRangeComponents：最终选中态选区
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
  // key: `${startCol}-${startRow}-${endCol}-${endRow}-${selectId}`
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
      // rowHeader 的选区高度跟随 body 可视行范围（避免选框覆盖不可见区域造成性能浪费）
      visibleCellRange = table.getBodyVisibleRowRange();
      if (visibleCellRange) {
        computeRectCellRangeStartRow = Math.max(startRow, visibleCellRange.rowStart - 1);
        computeRectCellRangeEndRow = Math.min(endRow, visibleCellRange.rowEnd + 1);
      }
      break;
    case 'columnHeader':
      // columnHeader 的选区宽度跟随 body 可视列范围
      visibleCellRange = table.getBodyVisibleCellRange();
      if (visibleCellRange) {
        computeRectCellRangeStartCol = Math.max(startCol, visibleCellRange.colStart - 1);
        computeRectCellRangeEndCol = Math.min(endCol, visibleCellRange.colEnd + 1);
      }
      break;
    case 'cornerHeader':
      break;
    case 'bottomFrozen':
      // bottomFrozen 的横向范围依赖 body 的可视列范围
      visibleCellRange = table.getBodyVisibleCellRange();
      if (visibleCellRange) {
        computeRectCellRangeStartCol = Math.max(startCol, visibleCellRange.colStart - 1);
        computeRectCellRangeEndCol = Math.min(endCol, visibleCellRange.colEnd + 1);
      }
      break;
    case 'rightFrozen':
      // rightFrozen 的纵向范围依赖 body 的可视行范围
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
      // body 区选框默认同时裁剪行列范围
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

  const overlayGroup = scene.getSelectOverlayGroup(selectComp.role);
  const offsetX = scene.tableGroup.attribute.x + (overlayGroup.attribute.x ?? 0);
  const offsetY = scene.tableGroup.attribute.y + (overlayGroup.attribute.y ?? 0);

  // 使用第一个单元格的 global bounds 来确定选框左上角，换算为 overlay 本地坐标。
  const firstCellBound = scene.highPerformanceGetCell(
    computeRectCellRangeStartCol,
    computeRectCellRangeStartRow
  ).globalAABBBounds;

  selectComp.rect.setAttributes({
    x: firstCellBound.x1 - offsetX,
    y: firstCellBound.y1 - offsetY,
    width: colsWidth,
    height: rowsHeight,
    visible: true
  });

  if (table.hasListeners(TABLE_EVENT_TYPE.AFTER_UPDATE_SELECT_BORDER_HEIGHT)) {
    table.fireListeners(TABLE_EVENT_TYPE.AFTER_UPDATE_SELECT_BORDER_HEIGHT, {
      startRow: computeRectCellRangeStartRow,
      endRow: computeRectCellRangeEndRow,
      currentHeight: rowsHeight,
      selectComp
    });
  }
  if (selectComp.fillhandle) {
    const fillHandle = scene.table.options.excelOptions?.fillHandle;
    let visible = true;
    if (typeof fillHandle === 'function') {
      visible = fillHandle({ selectRanges: scene.table.stateManager.select.ranges, table: scene.table });
    }
    //#region 计算填充柄小方块的位置

    // fill handle 的定位基于“选区右下角单元格”的 global bounds。
    // 当选区贴边（最后一列/最后一行）时，需要用相邻单元格 bounds 来推导一个合理的 handle 位置，
    // 否则 handle 会超出 table/clip 区域导致不可见或命中异常。
    let lastCellBound;
    let handlerX;
    //当选择区域没有到到最后一列时
    if (endCol < table.colCount - 1) {
      lastCellBound = scene.highPerformanceGetCell(endCol, endRow).globalAABBBounds;
      handlerX = lastCellBound.x2 - offsetX - 3;
    } else {
      // 最后一列
      // computeRectCellRangeStartCol 而且是第一列时
      if (startCol === 0) {
        //解决issue #4376  但还是有问题当存在冻结的时候。以及需要处理类似情况下面逻辑最后一行的情况
        lastCellBound = scene.highPerformanceGetCell(0, endRow).globalAABBBounds;
        handlerX = lastCellBound.x1 - offsetX;
      } else {
        lastCellBound = scene.highPerformanceGetCell(startCol - 1, endRow).globalAABBBounds;
        handlerX = lastCellBound.x2 - offsetX - 3;
      }
    }
    // const handlerX = lastCellBound.x2 - scene.tableGroup.attribute.x - 3;
    //当选择区域没有到到最后一行时
    if (endRow < table.rowCount - 1) {
      lastCellBound = scene.highPerformanceGetCell(endCol, endRow).globalAABBBounds;
    } else {
      // 最后一行
      lastCellBound = scene.highPerformanceGetCell(endCol, startRow - 1).globalAABBBounds;
    }
    const handlerY = lastCellBound.y2 - offsetY - 3;
    //#endregion

    selectComp.fillhandle?.setAttributes({
      x: handlerX, // 调整小方块位置
      y: handlerY, // 调整小方块位置
      width: 6,
      height: 6,
      visible
    });
  }

  //#region 处理边缘被截问题
  // 选框边框线绘制在 rect 边缘的中心（half line width），当选区贴着表格最外边界时，
  // 有一半线宽会被 clip 或 canvas 边界裁掉。这里通过收缩/偏移 rect 的宽高来避免“半条线”效果。
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
    // 若选区边缘触达合并单元格的一部分，需要扩大选区以覆盖整个 merge block。
    // 这里采用递归扩展：一旦发生扩展，继续检查新边界直到收敛。
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
  if (ifExtendSelectRange) {
    extendSelectRange();
    if (selectRange.start.col > selectRange.end.col) {
      selectRange.start.col = Math.max(startCol, endCol);
      selectRange.end.col = Math.min(startCol, endCol);
    } else {
      selectRange.start.col = Math.min(startCol, endCol);
      selectRange.end.col = Math.max(startCol, endCol);
    }
    if (selectRange.start.row > selectRange.end.row) {
      selectRange.start.row = Math.max(startRow, endRow);
      selectRange.end.row = Math.min(startRow, endRow);
    } else {
      selectRange.start.row = Math.min(startRow, endRow);
      selectRange.end.row = Math.max(startRow, endRow);
    }
  }
  //#endregion
  scene.selectingRangeComponents.forEach(
    (selectComp: { rect: IRect; fillhandle?: IRect; role: CellSubLocation }, key: string) => {
      selectComp.rect.delete();
      selectComp.fillhandle?.delete();
    }
  );
  scene.selectingRangeComponents = new Map();

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

  // 选区可能跨越多个区域（例如 cornerHeader/columnHeader/body/rightFrozen/bottomFrozen 等），
  // 需要按区域拆分成多个 select border。每段的 strokeArray 用来控制四条边是否绘制，
  // 避免跨区域边界处出现“重复描边”（两段都画同一条边会显得更粗）。
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
