import type { Group } from '../../graphic/group';
import { computeColsWidth } from '../../layout/compute-col-width';
import { computeRowsHeight } from '../../layout/compute-row-height';
import { createColGroup } from '../column';
import type { SceneProxy } from './proxy';

export async function createGroupForFirstScreen(
  cornerHeaderGroup: Group,
  colHeaderGroup: Group,
  rowHeaderGroup: Group,
  rightFrozenGroup: Group,
  bottomFrozenGroup: Group,
  bodyGroup: Group,
  xOrigin: number,
  yOrigin: number,
  proxy: SceneProxy
) {
  const { leftBottomCornerGroup, rightTopCornerGroup, rightBottomCornerGroup } = proxy.table.scenegraph;

  // compute parameters
  proxy.setParamsForRow();
  proxy.setParamsForColumn();

  // compute colums width in first screen
  proxy.table.internalProps._colWidthsMap.clear();
  proxy.table._clearColRangeWidthsMap();
  computeColsWidth(proxy.table, 0, Math.min(proxy.firstScreenColLimit, proxy.table.colCount - 1));

  // compute rows height in first screen
  proxy.table.internalProps._rowHeightsMap.clear();
  proxy.table._clearRowRangeHeightsMap();
  computeRowsHeight(proxy.table, 0, Math.min(proxy.firstScreenRowLimit, proxy.table.rowCount - 1));

  if (proxy.table.rightFrozenColCount > 0 && proxy.table.colCount - 1 > proxy.firstScreenColLimit) {
    // compute right frozen row height
    computeColsWidth(
      proxy.table,
      proxy.table.colCount - 1 - proxy.table.rightFrozenColCount + 1,
      proxy.table.colCount - 1
    );
  }
  if (proxy.table.bottomFrozenRowCount > 0 && proxy.table.rowCount - 1 > proxy.firstScreenRowLimit) {
    // compute bottom frozen row height
    computeColsWidth(
      proxy.table,
      proxy.table.rowCount - 1 - proxy.table.bottomFrozenRowCount + 1,
      proxy.table.rowCount - 1
    );
  }

  // update colHeaderGroup rowHeaderGroup bodyGroup position
  proxy.table.scenegraph.colHeaderGroup.setAttribute('x', proxy.table.getFrozenColsWidth());
  proxy.table.scenegraph.rowHeaderGroup.setAttribute('y', proxy.table.getFrozenRowsHeight());
  proxy.table.scenegraph.bottomFrozenGroup.setAttribute('x', proxy.table.getFrozenColsWidth());
  proxy.table.scenegraph.rightFrozenGroup.setAttribute('y', proxy.table.getFrozenRowsHeight());
  proxy.table.scenegraph.bodyGroup.setAttributes({
    x: proxy.table.getFrozenColsWidth(),
    y: proxy.table.getFrozenRowsHeight()
  });

  // create cornerHeaderGroup
  createColGroup(
    cornerHeaderGroup,
    xOrigin,
    yOrigin,
    0, // colStart
    proxy.table.rowHeaderLevelCount - 1, // colEnd
    0, // rowStart
    proxy.table.columnHeaderLevelCount - 1, // rowEnd
    'cornerHeader', // CellType
    proxy.table
  );

  // create colHeaderGroup
  createColGroup(
    colHeaderGroup,
    xOrigin,
    yOrigin,
    proxy.table.rowHeaderLevelCount, // colStart
    Math.min(proxy.firstScreenColLimit, proxy.table.colCount - 1 - proxy.table.rightFrozenColCount), // colEnd
    0, // rowStart
    proxy.table.columnHeaderLevelCount - 1, // rowEnd
    'columnHeader', // isHeader
    proxy.table
  );

  // create rowHeaderGroup
  createColGroup(
    rowHeaderGroup,
    xOrigin,
    yOrigin,
    0, // colStart
    proxy.table.rowHeaderLevelCount - 1, // colEnd
    proxy.table.columnHeaderLevelCount, // rowStart
    Math.min(proxy.firstScreenRowLimit, proxy.table.rowCount - 1 - proxy.table.bottomFrozenRowCount), // rowEnd
    'rowHeader', // isHeader
    proxy.table
  );

  if (proxy.table.bottomFrozenRowCount > 0) {
    if (!proxy.table.isPivotChart()) {
      // create left bottom frozen
      createColGroup(
        leftBottomCornerGroup,
        xOrigin,
        yOrigin,
        0, // colStart
        proxy.table.rowHeaderLevelCount - 1, // colEnd
        proxy.table.rowCount - 1 - proxy.table.bottomFrozenRowCount + 1, // rowStart
        proxy.table.rowCount - 1, // rowEnd
        'rowHeader', // isHeader
        proxy.table
      );
    }
    // create bottomFrozenGroup
    createColGroup(
      bottomFrozenGroup,
      xOrigin,
      yOrigin,
      proxy.table.rowHeaderLevelCount, // colStart
      Math.min(proxy.firstScreenColLimit, proxy.table.colCount - 1 - proxy.table.rightFrozenColCount), // colEnd
      proxy.table.rowCount - 1 - proxy.table.bottomFrozenRowCount + 1, // rowStart
      proxy.table.rowCount - 1, // rowEnd
      'body', // isHeader
      proxy.table
    );
  }

  if (proxy.table.rightFrozenColCount > 0) {
    if (!proxy.table.isPivotChart()) {
      // create right top frozen Group
      createColGroup(
        rightTopCornerGroup,
        xOrigin,
        yOrigin,
        proxy.table.colCount - 1 - proxy.table.rightFrozenColCount + 1, // colStart
        proxy.table.colCount - 1, // colEnd
        0, // rowStart
        proxy.table.columnHeaderLevelCount - 1, // rowEnd
        'columnHeader', // isHeader
        proxy.table
      );
    }
    // create rightFrozenGroup
    createColGroup(
      rightFrozenGroup,
      xOrigin,
      yOrigin,
      proxy.table.colCount - 1 - proxy.table.rightFrozenColCount + 1, // colStart
      proxy.table.colCount - 1, // colEnd
      proxy.table.columnHeaderLevelCount, // rowStart
      Math.min(proxy.firstScreenRowLimit, proxy.table.rowCount - 1 - proxy.table.bottomFrozenRowCount), // rowEnd
      'body', // isHeader
      proxy.table
    );
  }

  if (proxy.table.bottomFrozenRowCount > 0 && proxy.table.rightFrozenColCount > 0) {
    // create right bottom frozen Group
    createColGroup(
      rightBottomCornerGroup,
      xOrigin,
      yOrigin,
      proxy.table.colCount - 1 - proxy.table.rightFrozenColCount + 1, // colStart
      proxy.table.colCount - 1, // colEnd
      proxy.table.rowCount - 1 - proxy.table.bottomFrozenRowCount + 1, // rowStart
      proxy.table.rowCount - 1, // rowEnd
      'body', // isHeader
      proxy.table
    );
  }

  // create bodyGroup
  createColGroup(
    bodyGroup,
    xOrigin,
    yOrigin,
    proxy.table.rowHeaderLevelCount, // colStart
    Math.min(proxy.firstScreenColLimit, proxy.table.colCount - 1 - proxy.table.rightFrozenColCount), // colEnd
    proxy.table.columnHeaderLevelCount, // rowStart
    Math.min(proxy.firstScreenRowLimit, proxy.table.rowCount - 1 - proxy.table.bottomFrozenRowCount), // rowEnd
    'body', // isHeader
    proxy.table
  );

  // update progress information
  if (!bodyGroup.firstChild) {
    // 无数据
    proxy.currentRow = proxy.totalRow;
    proxy.rowEnd = proxy.currentRow;
    proxy.rowUpdatePos = proxy.rowEnd;
    proxy.referenceRow = proxy.rowStart + Math.floor((proxy.rowEnd - proxy.rowStart) / 2);

    proxy.currentCol = proxy.totalCol;
    proxy.colEnd = proxy.currentCol;
    proxy.colUpdatePos = proxy.colEnd;
    proxy.referenceCol = proxy.colStart + Math.floor((proxy.colEnd - proxy.colStart) / 2);
  } else {
    proxy.currentRow = (bodyGroup.firstChild as Group)?.rowNumber ?? proxy.totalRow;
    proxy.rowEnd = proxy.currentRow;
    proxy.rowUpdatePos = proxy.rowEnd;
    proxy.referenceRow = proxy.rowStart + Math.floor((proxy.rowEnd - proxy.rowStart) / 2);

    proxy.currentCol = (bodyGroup.lastChild as Group)?.col ?? proxy.totalCol;
    proxy.colEnd = proxy.currentCol;
    proxy.colUpdatePos = proxy.colEnd;
    proxy.referenceCol = proxy.colStart + Math.floor((proxy.colEnd - proxy.colStart) / 2);

    // 开始异步任务
    await proxy.progress();
  }
}
