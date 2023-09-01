import type { IRect } from '@visactor/vrender';
import type { Scenegraph } from '../scenegraph';
import type { CellLocation } from '../../ts-types';
import { getCellMergeInfo } from '../utils/get-cell-merge';

export function updateAllSelectComponent(scene: Scenegraph) {
  scene.selectingRangeComponents.forEach((selectComp: { rect: IRect; role: CellLocation }, key: string) => {
    updateComponent(selectComp, key, scene);
  });
  scene.selectedRangeComponents.forEach((selectComp: { rect: IRect; role: CellLocation }, key: string) => {
    updateComponent(selectComp, key, scene);
  });
}

function updateComponent(selectComp: { rect: IRect; role: CellLocation }, key: string, scene: Scenegraph) {
  const [startColStr, startRowStr, endColStr, endRowStr] = key.split('-');
  const startCol = parseInt(startColStr, 10);
  const startRow = parseInt(startRowStr, 10);
  const endCol = parseInt(endColStr, 10);
  const endRow = parseInt(endRowStr, 10);
  let cellsBounds;
  for (let i = startCol; i <= endCol; i++) {
    for (let j = startRow; j <= endRow; j++) {
      const cellGroup = scene.highPerformanceGetCell(i, j);
      if (cellGroup.role !== 'cell') {
        continue;
      }
      cellGroup.AABBBounds.width(); // hack: globalAABBBounds可能不会自动更新，这里强制更新一下
      const bounds = cellGroup.globalAABBBounds;
      if (!cellsBounds) {
        cellsBounds = bounds;
      } else {
        cellsBounds.union(bounds);
      }
    }
  }
  if (!cellsBounds) {
    // 选中区域在实际单元格区域外，不显示选择框
    selectComp.rect.setAttributes({
      visible: false
    });
  } else {
    selectComp.rect.setAttributes({
      x: cellsBounds.x1 - scene.tableGroup.attribute.x,
      y: cellsBounds.y1 - scene.tableGroup.attribute.y,
      width: cellsBounds.width(),
      height: cellsBounds.height(),
      visible: true
    });
  }

  //#region 判断是不是按着表头部分的选中框 因为绘制层级的原因 线宽会被遮住一半，因此需要动态调整层级
  const isNearRowHeader =
    // scene.table.scrollLeft === 0 &&
    startCol === scene.table.frozenColCount;
  const isNearColHeader =
    // scene.table.scrollTop === 0 &&
    startRow === scene.table.frozenRowCount;
  if (
    (isNearRowHeader && selectComp.rect.attribute.stroke[3]) ||
    (isNearColHeader && selectComp.rect.attribute.stroke[0])
  ) {
    if (isNearRowHeader) {
      scene.tableGroup.insertAfter(
        selectComp.rect,
        selectComp.role === 'columnHeader' ? scene.cornerHeaderGroup : scene.rowHeaderGroup
      );
    }
    if (isNearColHeader) {
      scene.tableGroup.insertAfter(
        selectComp.rect,
        selectComp.role === 'rowHeader' ? scene.cornerHeaderGroup : scene.colHeaderGroup
      );
    }
    //#region 调整层级后 滚动情况下会出现绘制范围出界 如body的选中框 渲染在了rowheader上面，所有需要调整选中框rect的 边界
    if (
      selectComp.rect.attribute.x < scene.rowHeaderGroup.attribute.width &&
      scene.table.scrollLeft > 0 &&
      (selectComp.role === 'body' || selectComp.role === 'columnHeader')
    ) {
      selectComp.rect.setAttributes({
        x: selectComp.rect.attribute.x + (scene.rowHeaderGroup.attribute.width - selectComp.rect.attribute.x),
        width: selectComp.rect.attribute.width - (scene.rowHeaderGroup.attribute.width - selectComp.rect.attribute.x)
      });
    }
    if (
      selectComp.rect.attribute.y < scene.colHeaderGroup.attribute.height &&
      scene.table.scrollTop > 0 &&
      (selectComp.role === 'body' || selectComp.role === 'rowHeader')
    ) {
      selectComp.rect.setAttributes({
        y: selectComp.rect.attribute.y + (scene.colHeaderGroup.attribute.height - selectComp.rect.attribute.y),
        height: selectComp.rect.attribute.height - (scene.colHeaderGroup.attribute.height - selectComp.rect.attribute.y)
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
        : scene.cornerHeaderGroup
    );
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
  let startCol = Math.min(newEndCol, newStartCol);
  let startRow = Math.min(newEndRow, newStartRow);
  let endCol = Math.max(newEndCol, newStartCol);
  let endRow = Math.max(newEndRow, newStartRow);
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
          if (mergeInfo && mergeInfo.end.col > endCol) {
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
            if (mergeInfo && mergeInfo.end.row > endRow) {
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
  scene.selectingRangeComponents.forEach((selectComp: { rect: IRect; role: CellLocation }, key: string) => {
    selectComp.rect.delete();
  });
  scene.selectingRangeComponents = new Map();

  let needRowHeader = false;
  let needColumnHeader = false;
  let needBody = false;
  let needCornerHeader = false;
  if (startCol <= scene.table.frozenColCount - 1 && startRow <= scene.table.frozenRowCount - 1) {
    needCornerHeader = true;
  }
  if (startCol <= scene.table.frozenColCount - 1 && endRow >= scene.table.frozenRowCount) {
    needRowHeader = true;
  }
  if (startRow <= scene.table.frozenRowCount - 1 && endCol >= scene.table.frozenColCount) {
    needColumnHeader = true;
  }
  if (endCol >= scene.table.frozenColCount && endRow >= scene.table.frozenRowCount) {
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
  if (needColumnHeader) {
    const columnHeaderStartCol = Math.max(startCol, scene.table.frozenColCount);
    const columnHeaderEndRow = Math.min(endRow, scene.table.frozenRowCount - 1);
    const strokeArray = [true, true, !needBody, !needCornerHeader];
    scene.createCellSelectBorder(
      columnHeaderStartCol,
      startRow,
      endCol,
      columnHeaderEndRow,
      'columnHeader',
      `${startCol}${startRow}${endCol}${endRow}`,
      strokeArray
    );
  }
  if (needRowHeader) {
    const columnHeaderStartRow = Math.max(startRow, scene.table.frozenRowCount);
    const columnHeaderEndCol = Math.min(endCol, scene.table.frozenColCount - 1);
    const strokeArray = [!needCornerHeader, !needBody, true, true];
    scene.createCellSelectBorder(
      startCol,
      columnHeaderStartRow,
      columnHeaderEndCol,
      endRow,
      'rowHeader',
      `${startCol}${startRow}${endCol}${endRow}`,
      strokeArray
    );
  }
  if (needBody) {
    const columnHeaderStartCol = Math.max(startCol, scene.table.frozenColCount);
    const columnHeaderStartRow = Math.max(startRow, scene.table.frozenRowCount);
    const strokeArray = [!needColumnHeader, true, true, !needRowHeader];
    scene.createCellSelectBorder(
      columnHeaderStartCol,
      columnHeaderStartRow,
      endCol,
      endRow,
      'body',
      `${startCol}${startRow}${endCol}${endRow}`,
      strokeArray
    );
  }
}
