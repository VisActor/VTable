import type { CellType } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { Group } from '../graphic/group';
import { createComplexColumn } from './column-helper';

/**
 * @description: 处理全部角表头
 * @param {Group} colHeaderGroup 列表头容器Group
 * @param {number} xOrigin x起始坐标
 * @param {number} yOrigin y起始坐标
 * @param {BaseTableAPI} table
 * @return {*}
 */
export function createCornerHeaderColGroup(
  cornerHeaderGroup: Group,
  xOrigin: number,
  yOrigin: number,
  table: BaseTableAPI
) {
  createColGroup(
    cornerHeaderGroup,
    xOrigin,
    yOrigin,
    0, // colStart
    table.rowHeaderLevelCount - 1, // colEnd
    0, // rowStart
    table.columnHeaderLevelCount - 1, // rowEnd
    'cornerHeader', // CellType
    table
  );
}

/**
 * @description: 处理全部列表头
 * @param {Group} colHeaderGroup 列表头容器Group
 * @param {number} xOrigin x起始坐标
 * @param {number} yOrigin y起始坐标
 * @param {BaseTableAPI} table
 * @return {*}
 */
export function createColHeaderColGroup(colHeaderGroup: Group, xOrigin: number, yOrigin: number, table: BaseTableAPI) {
  createColGroup(
    colHeaderGroup,
    xOrigin,
    yOrigin,
    table.rowHeaderLevelCount, // colStart
    table.colCount - 1, // colEnd
    0, // rowStart
    table.columnHeaderLevelCount - 1, // rowEnd
    'columnHeader', // isHeader
    table
  );
}

/**
 * @description: 处理全部行表头
 * @param {Group} rowHeaderGroup 行表头容器Group
 * @param {number} xOrigin x起始坐标
 * @param {number} yOrigin y起始坐标
 * @param {BaseTableAPI} table
 * @return {*}
 */
export function createRowHeaderColGroup(rowHeaderGroup: Group, xOrigin: number, yOrigin: number, table: BaseTableAPI) {
  createColGroup(
    rowHeaderGroup,
    xOrigin,
    yOrigin,
    0, // colStart
    table.rowHeaderLevelCount - 1, // colEnd
    table.columnHeaderLevelCount, // rowStart
    table.rowCount - 1, // rowEnd
    'rowHeader', // isHeader
    table
  );
}

/**
 * @description: 处理内容单元格
 * @param {Group} bodyGroup 内容容器Group
 * @param {number} xOrigin x起始坐标
 * @param {number} yOrigin y起始坐标
 * @param {BaseTableAPI} table
 * @return {*}
 */
export function createBodyColGroup(bodyGroup: Group, xOrigin: number, yOrigin: number, table: BaseTableAPI) {
  createColGroup(
    bodyGroup,
    xOrigin,
    yOrigin,
    table.rowHeaderLevelCount, // colStart
    table.colCount - 1, // colEnd
    table.columnHeaderLevelCount, // rowStart
    table.rowCount - 1, // rowEnd
    'body', // isHeader
    table
  );
}

/**
 * @description: 生成一个列的场景节点
 * @param {Group} containerGroup 列容器Group
 * @param {number} xOrigin x起始坐标
 * @param {number} yOrigin y起始坐标
 * @param {number} colStart 起始col
 * @param {number} colEnd 结束col
 * @param {number} rowStart 起始row
 * @param {number} rowEnd 结束row
 * @param {boolean} isHeader 是否是表头
 * @param {BaseTableAPI} table
 * @return {*}
 */
export function createColGroup(
  containerGroup: Group,
  xOrigin: number,
  yOrigin: number,
  colStart: number,
  colEnd: number,
  rowStart: number,
  rowEnd: number,
  cellType: CellType,
  table: BaseTableAPI,
  rowLimit?: number
) {
  if (colStart > colEnd || rowStart > rowEnd) {
    return;
  }
  const { layoutMap, defaultRowHeight, defaultHeaderRowHeight, defaultColWidth } = table.internalProps;
  let x = 0;
  let heightMax = 0;
  for (let i = colStart; i <= colEnd; i++) {
    const col = i;

    // 宽度模式
    // const { width: defineWidth } = layoutMap.columnWidths?.[col] || { width: defaultColWidth };
    // const width = table.getColWidth(col);
    // const colWidth: number | 'auto' =
    //   defineWidth === 'auto' ||
    //   table.scenegraph.transpose ||
    //   (table.widthMode === 'autoWidth' && !defineWidth)
    //     ? 'auto'
    //     : width;
    const colWidth = table.getColWidth(col);

    const columnGroup = new Group({
      x: xOrigin + x,
      y: yOrigin,
      width: colWidth,
      height: 0,
      clip: false,
      pickable: false
    });
    columnGroup.role = 'column';
    columnGroup.col = i;
    containerGroup.addChild(columnGroup);

    let customRender;
    let customLayout;

    if (cellType !== 'body') {
      const define = table.getHeaderDefine(col, rowStart);
      customRender = define?.headerCustomRender;
      customLayout = define?.headerCustomLayout;
    } else {
      const define = table.getBodyColumnDefine(col, rowStart);
      customRender = define?.customRender || table.customRender;
      customLayout = define?.customLayout;
    }
    const { width: default2Width, height: default2Height } = createComplexColumn(
      columnGroup,
      col,
      colWidth,
      rowStart,
      rowEnd,
      table.scenegraph.mergeMap,
      cellType === 'columnHeader' ? defaultHeaderRowHeight ?? defaultRowHeight : defaultRowHeight,
      table,
      cellType,
      rowLimit,
      customRender,
      customLayout
    );
    x += default2Width;
    heightMax = Math.max(heightMax, default2Height);
  }
  // 更新containerGroup尺寸
  containerGroup.setAttribute('width', x);
  containerGroup.setAttribute('height', heightMax);
}
