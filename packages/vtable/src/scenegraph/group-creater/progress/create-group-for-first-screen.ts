import type { ListTable } from '../../../ListTable';
import { ListTableAPI } from '../../../ts-types';
import type { Group } from '../../graphic/group';
import { computeColsWidth } from '../../layout/compute-col-width';
import { computeRowsHeight } from '../../layout/compute-row-height';
import { createColGroup } from '../column';
import type { SceneProxy } from './proxy';

export function createGroupForFirstScreen(
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
  const { table } = proxy;
  const { leftBottomCornerGroup, rightTopCornerGroup, rightBottomCornerGroup } = table.scenegraph;

  // compute parameters
  proxy.setParamsForRow();
  proxy.setParamsForColumn();

  let distCol;
  let distRow;
  let distColForCompute;
  let distRowForCompute;
  if (
    table.widthMode === 'adaptive' ||
    (table.options.autoWrapText && (table.heightMode === 'adaptive' || table.isAutoRowHeight()))
  ) {
    // distCol = table.colCount - 1;
    // proxy.colEnd = distCol;

    distColForCompute = table.colCount - 1;
    distCol = Math.min(proxy.firstScreenColLimit - 1, table.colCount - 1);
  } else {
    distCol = Math.min(proxy.firstScreenColLimit - 1, table.colCount - 1);
  }
  if (table.heightMode === 'adaptive') {
    // distRow = table.rowCount - 1;
    // proxy.rowEnd = distRow;

    distRowForCompute = table.rowCount - 1;
    distRow = Math.min(proxy.firstScreenRowLimit - 1, table.rowCount - 1);
  } else {
    distRow = Math.min(proxy.firstScreenRowLimit - 1, table.rowCount - 1);
  }
  if (table.internalProps._widthResizedColMap.size === 0) {
    // compute colums width in first screen
    computeColsWidth(table, 0, distColForCompute ?? distCol);
  }

  if (table.internalProps._heightResizedRowMap.size === 0) {
    // compute rows height in first screen
    computeRowsHeight(
      table,
      0,
      table.options.canvasHeight === 'auto' ? table.rowCount - 1 : distRowForCompute ?? distRow
    ); //如果配置了 canvasHeight为 'auto'， 则一次性将所有行高都计算出来才能满足后续赋值表格高度的使用
  }

  if (distCol < table.colCount - table.rightFrozenColCount) {
    // compute right frozen row height
    computeColsWidth(table, table.colCount - table.rightFrozenColCount, table.colCount - 1);
  }
  if (distRow < table.rowCount - table.bottomFrozenRowCount) {
    // compute bottom frozen row height
    computeRowsHeight(table, table.rowCount - table.bottomFrozenRowCount, table.rowCount - 1);
  }

  // update colHeaderGroup rowHeaderGroup bodyGroup position
  table.scenegraph.colHeaderGroup.setAttribute('x', table.getFrozenColsWidth());
  table.scenegraph.rowHeaderGroup.setAttribute('y', table.getFrozenRowsHeight());
  table.scenegraph.bottomFrozenGroup.setAttribute('x', table.getFrozenColsWidth());
  table.scenegraph.rightFrozenGroup.setAttribute('y', table.getFrozenRowsHeight());
  table.scenegraph.bodyGroup.setAttributes({
    x: table.getFrozenColsWidth(),
    y: table.getFrozenRowsHeight()
  });

  // create cornerHeaderGroup
  createColGroup(
    cornerHeaderGroup,
    xOrigin,
    yOrigin,
    0, // colStart
    table.frozenColCount - 1, // colEnd
    0, // rowStart
    table.frozenRowCount - 1, // rowEnd
    table.isListTable() ? 'columnHeader' : 'cornerHeader', // CellType
    table
  );

  // create colHeaderGroup
  distCol - table.rightFrozenColCount >= table.frozenColCount &&
    createColGroup(
      colHeaderGroup,
      xOrigin,
      yOrigin,
      table.frozenColCount, // colStart
      // Math.min(proxy.firstScreenColLimit, table.colCount - 1 - table.rightFrozenColCount), // colEnd
      distCol - table.rightFrozenColCount,
      0, // rowStart
      table.frozenRowCount - 1, // rowEnd
      'columnHeader', // isHeader
      table
    );

  // create rowHeaderGroup
  if (table.frozenColCount > 0) {
    if (table.leftRowSeriesNumberCount > 0) {
      createColGroup(
        rowHeaderGroup,
        xOrigin,
        yOrigin,
        0, // colStart
        table.leftRowSeriesNumberCount - 1, // colEnd
        table.frozenRowCount, // rowStart
        // Math.min(proxy.firstScreenRowLimit, table.rowCount - 1 - table.bottomFrozenRowCount), // rowEnd
        distRow - table.bottomFrozenRowCount,
        'rowHeader', // isHeader
        table
      );
    }
    if (table.frozenColCount > table.leftRowSeriesNumberCount) {
      createColGroup(
        rowHeaderGroup,
        xOrigin,
        yOrigin,
        table.leftRowSeriesNumberCount, // colStart
        Math.min(table.frozenColCount - 1, table.rowHeaderLevelCount + table.leftRowSeriesNumberCount - 1), // colEnd
        table.frozenRowCount, // rowStart
        // Math.min(proxy.firstScreenRowLimit, table.rowCount - 1 - table.bottomFrozenRowCount), // rowEnd
        distRow - table.bottomFrozenRowCount,
        'rowHeader', // isHeader
        table
      );
    }
    if (table.frozenColCount > table.rowHeaderLevelCount + table.leftRowSeriesNumberCount) {
      createColGroup(
        rowHeaderGroup,
        xOrigin,
        yOrigin,
        table.rowHeaderLevelCount + table.leftRowSeriesNumberCount, // colStart
        table.frozenColCount - 1, // colEnd
        table.frozenRowCount, // rowStart
        // Math.min(proxy.firstScreenRowLimit, table.rowCount - 1 - table.bottomFrozenRowCount), // rowEnd
        distRow - table.bottomFrozenRowCount,
        'body',
        table
      );
    }
  }

  if (table.bottomFrozenRowCount > 0) {
    // if (!table.isPivotChart()) {
    // create left bottom frozen
    // if (table.rowHeaderLevelCount > 0) {
    //   createColGroup(
    //     leftBottomCornerGroup,
    //     xOrigin,
    //     yOrigin,
    //     0, // colStart
    //     table.rowHeaderLevelCount - 1, // colEnd
    //     table.rowCount - 1 - table.bottomFrozenRowCount + 1, // rowStart
    //     table.rowCount - 1, // rowEnd
    //     'rowHeader', // isHeader
    //     table
    //   );
    // }
    // if (table.frozenColCount > table.rowHeaderLevelCount) {
    //   createColGroup(
    //     leftBottomCornerGroup,
    //     xOrigin,
    //     yOrigin,
    //     table.rowHeaderLevelCount, // colStart
    //     table.frozenColCount - 1, // colEnd
    //     table.rowCount - 1 - table.bottomFrozenRowCount + 1, // rowStart
    //     table.rowCount - 1, // rowEnd
    //     'body',
    //     table
    //   );
    // }

    if (table.frozenColCount > 0) {
      if (table.leftRowSeriesNumberCount > 0) {
        createColGroup(
          leftBottomCornerGroup,
          xOrigin,
          yOrigin,
          0, // colStart
          table.leftRowSeriesNumberCount - 1, // colEnd
          table.rowCount - 1 - table.bottomFrozenRowCount + 1, // rowStart
          table.rowCount - 1, // rowEnd
          'rowHeader', // isHeader
          table
        );
      }
      if (table.rowHeaderLevelCount > 0) {
        createColGroup(
          leftBottomCornerGroup,
          xOrigin,
          yOrigin,
          table.leftRowSeriesNumberCount, // colStart
          table.leftRowSeriesNumberCount + table.rowHeaderLevelCount - 1, // colEnd
          table.rowCount - 1 - table.bottomFrozenRowCount + 1, // rowStart
          table.rowCount - 1, // rowEnd
          'rowHeader', // isHeader
          table
        );
      }
      if (table.frozenColCount > table.rowHeaderLevelCount + table.leftRowSeriesNumberCount) {
        createColGroup(
          leftBottomCornerGroup,
          xOrigin,
          yOrigin,
          table.rowHeaderLevelCount + table.leftRowSeriesNumberCount, // colStart
          table.frozenColCount - 1, // colEnd
          table.rowCount - 1 - table.bottomFrozenRowCount + 1, // rowStart
          table.rowCount - 1, // rowEnd
          'body',
          table
        );
      }
    }
    // }
    // create bottomFrozenGroup
    distCol - table.rightFrozenColCount >= table.frozenColCount &&
      createColGroup(
        bottomFrozenGroup,
        xOrigin,
        yOrigin,
        table.frozenColCount, // colStart
        // Math.min(proxy.firstScreenColLimit, table.colCount - 1 - table.rightFrozenColCount), // colEnd
        distCol - table.rightFrozenColCount,
        table.rowCount - 1 - table.bottomFrozenRowCount + 1, // rowStart
        table.rowCount - 1, // rowEnd
        table.isPivotChart() ? 'rowHeader' : 'body', // isHeader
        table
      );
  }

  if (table.rightFrozenColCount > 0) {
    // if (!table.isPivotChart()) {
    // create right top frozen Group
    createColGroup(
      rightTopCornerGroup,
      xOrigin,
      yOrigin,
      table.colCount - 1 - table.rightFrozenColCount + 1, // colStart
      table.colCount - 1, // colEnd
      0, // rowStart
      table.frozenRowCount - 1, // rowEnd
      'columnHeader', // isHeader
      table
    );
    // }
    // create rightFrozenGroup
    createColGroup(
      rightFrozenGroup,
      xOrigin,
      yOrigin,
      table.colCount - 1 - table.rightFrozenColCount + 1, // colStart
      table.colCount - 1, // colEnd
      table.frozenRowCount, // rowStart
      // Math.min(proxy.firstScreenRowLimit, table.rowCount - 1 - table.bottomFrozenRowCount), // rowEnd
      distRow - table.bottomFrozenRowCount,
      table.isPivotChart() ? 'rowHeader' : 'body', // isHeader
      table
    );
  }

  if (table.bottomFrozenRowCount > 0 && table.rightFrozenColCount > 0) {
    // create right bottom frozen Group
    createColGroup(
      rightBottomCornerGroup,
      xOrigin,
      yOrigin,
      table.colCount - 1 - table.rightFrozenColCount + 1, // colStart
      table.colCount - 1, // colEnd
      table.rowCount - 1 - table.bottomFrozenRowCount + 1, // rowStart
      table.rowCount - 1, // rowEnd
      'body', // isHeader
      table
    );
  }

  // create bodyGroup
  distCol - table.rightFrozenColCount >= table.frozenColCount &&
    createColGroup(
      bodyGroup,
      xOrigin,
      yOrigin,
      table.frozenColCount, // colStart
      // Math.min(proxy.firstScreenColLimit, table.colCount - 1 - table.rightFrozenColCount), // colEnd
      distCol - table.rightFrozenColCount,
      table.frozenRowCount, // rowStart
      // Math.min(proxy.firstScreenRowLimit, table.rowCount - 1 - table.bottomFrozenRowCount), // rowEnd
      distRow - table.bottomFrozenRowCount,
      'body', // isHeader
      table
    );

  // update progress information
  if (
    !bodyGroup.firstChild &&
    !colHeaderGroup.firstChild &&
    !cornerHeaderGroup.firstChild &&
    !rowHeaderGroup.firstChild
  ) {
    // 无数据
    proxy.currentRow = proxy.totalRow;
    proxy.rowEnd = proxy.currentRow;
    proxy.rowUpdatePos = proxy.rowEnd + 1;
    proxy.referenceRow = proxy.rowStart + Math.floor((proxy.rowEnd - proxy.rowStart) / 2);

    proxy.currentCol = proxy.totalCol;
    proxy.colEnd = proxy.currentCol;
    proxy.colUpdatePos = proxy.colEnd + 1;
    proxy.referenceCol = proxy.colStart + Math.floor((proxy.colEnd - proxy.colStart) / 2);
  } else {
    proxy.currentRow =
      (bodyGroup.firstChild as Group)?.rowNumber ?? (rowHeaderGroup.firstChild as Group)?.rowNumber ?? proxy.totalRow;
    proxy.rowEnd = proxy.currentRow;
    proxy.rowUpdatePos = proxy.rowEnd + 1;
    proxy.referenceRow = proxy.rowStart + Math.floor((proxy.rowEnd - proxy.rowStart) / 2);

    proxy.currentCol =
      (bodyGroup.lastChild as Group)?.col ??
      (colHeaderGroup.lastChild as Group)?.col ??
      (rowHeaderGroup.lastChild as Group)?.col ??
      (cornerHeaderGroup.lastChild as Group)?.col ??
      proxy.totalCol;
    proxy.colEnd = proxy.currentCol;
    proxy.colUpdatePos = proxy.colEnd + 1;
    proxy.referenceCol = proxy.colStart + Math.floor((proxy.colEnd - proxy.colStart) / 2);

    // 开始异步任务
    proxy.progress();
  }
}
