import { getStyleTheme } from '../../core/tableHelper';
import { getTargetCell } from '../../event/util';
import { Group } from '../graphic/group';
import { createColGroup } from '../group-creater/column';
import type { Scenegraph } from '../scenegraph';
import { getProp } from '../utils/get-prop';
import { table } from 'console';
import { updateReactComponentContainer } from './frozen-react';

export function dealFrozen(scene: Scenegraph) {
  if (scene.table.frozenColCount > scene.table.rowHeaderLevelCount) {
    // 将对应列移入rowHeaderGroup
    scene.rowHeaderGroup.setAttribute('height', scene.bodyGroup.attribute.height);
    scene.rowHeaderGroup.setAttribute('y', scene.bodyGroup.attribute.y);
    scene.cornerHeaderGroup.setAttribute('height', scene.colHeaderGroup.attribute.height);
    for (let i = 0; i < scene.table.frozenColCount - scene.table.rowHeaderLevelCount; i++) {
      moveColumnFromBodyToRowHeader(scene);
      moveColumnFromColHeaderToCornerHeader(scene);
      moveColumnFromBottomToLeftBottomCorner(scene);
    }
  } else if (scene.table.frozenColCount < scene.table.rowHeaderLevelCount) {
    // move columnGroup from rowHeaderGroup into bodyGroup(from cornerHeaderGroup into colHeaderGroup)
    scene.bodyGroup.setAttribute('height', scene.rowHeaderGroup.attribute.height);
    scene.bodyGroup.setAttribute('y', scene.rowHeaderGroup.attribute.y);
    scene.colHeaderGroup.setAttribute('height', scene.cornerHeaderGroup.attribute.height);
    for (let i = 0; i < scene.table.rowHeaderLevelCount - scene.table.frozenColCount; i++) {
      moveColumnFromRowHeaderToBody(scene);
      moveColumnFromCornerHeaderToColHeader(scene);
      moveColumnFromLeftBottomCornerToBottom(scene);
    }
  }
  scene.bodyGroup.setAttribute('x', scene.rowHeaderGroup.attribute.width);
  scene.colHeaderGroup.setAttribute('x', scene.cornerHeaderGroup.attribute.width);

  scene.updateContainer();
  scene.updateBorderSizeAndPosition();

  if (!scene.isPivot && !(scene.table as any).transpose) {
    scene.component.setFrozenColumnShadow(scene.table.frozenColCount - 1);
    scene.component.setRightFrozenColumnShadow(scene.table.colCount - scene.table.rightFrozenColCount);
  } else if (scene.table.options.frozenColCount) {
    scene.component.setFrozenColumnShadow(scene.table.frozenColCount - 1);
  } else if (scene.table.options.frozenColCount) {
    scene.component.setRightFrozenColumnShadow(scene.table.colCount - scene.table.rightFrozenColCount);
  }
  scene.hasFrozen = true;

  // scene.frozenColCount = scene.rowHeaderGroup.childrenCount;
  scene.frozenColCount = scene.table.frozenColCount;
  scene.frozenRowCount = scene.colHeaderGroup.firstChild?.childrenCount ?? 0;
}

export function resetFrozen(scene: Scenegraph) {
  if (scene.frozenColCount > scene.table.frozenColCount) {
    // move columnGroup from rowHeaderGroup into bodyGroup(from cornerHeaderGroup into colHeaderGroup)
    scene.bodyGroup.setAttribute('height', scene.rowHeaderGroup.attribute.height);
    scene.bodyGroup.setAttribute('y', scene.rowHeaderGroup.attribute.y);
    scene.colHeaderGroup.setAttribute('height', scene.cornerHeaderGroup.attribute.height);
    for (let i = 0; i < scene.frozenColCount - scene.table.frozenColCount; i++) {
      moveColumnFromRowHeaderToBody(scene);
      moveColumnFromCornerHeaderToColHeader(scene);
      moveColumnFromLeftBottomCornerToBottom(scene);
    }
  } else if (scene.frozenColCount < scene.table.frozenColCount) {
    // move columnGroup from bodyGroup into rowHeaderGroup(from colHeaderGroup into cornerHeaderGroup)
    scene.rowHeaderGroup.setAttribute('height', scene.bodyGroup.attribute.height);
    scene.rowHeaderGroup.setAttribute('y', scene.bodyGroup.attribute.y);
    scene.cornerHeaderGroup.setAttribute('height', scene.colHeaderGroup.attribute.height);
    for (let i = 0; i < scene.table.frozenColCount - scene.frozenColCount; i++) {
      moveColumnFromBodyToRowHeader(scene);
      moveColumnFromColHeaderToCornerHeader(scene);
      moveColumnFromBottomToLeftBottomCorner(scene);
    }
  }

  updateReactComponentContainer(scene);
  scene.recreateAllSelectRangeComponents();
  // scene.frozenColCount = scene.rowHeaderGroup.childrenCount;
  scene.frozenColCount = scene.table.frozenColCount;
  scene.frozenRowCount = scene.colHeaderGroup.firstChild?.childrenCount ?? 0;
  //   scene.proxy.colStart = scene.table.frozenColCount;
  scene.proxy.colStart = (scene.bodyGroup.firstChild as any)?.col ?? scene.table.frozenColCount;

  scene.bodyGroup.setAttribute('x', scene.rowHeaderGroup.attribute.width);
  scene.colHeaderGroup.setAttribute('x', scene.cornerHeaderGroup.attribute.width);
  // scene.updateContainerAttrWidthAndX();
  scene.updateContainer();
  scene.updateBorderSizeAndPosition();

  if (!scene.isPivot && !(scene.table as any).transpose) {
    scene.component.setFrozenColumnShadow(scene.table.frozenColCount - 1);
    scene.component.setRightFrozenColumnShadow(scene.table.colCount - scene.table.rightFrozenColCount);
  } else if (scene.table.options.frozenColCount) {
    scene.component.setFrozenColumnShadow(scene.table.frozenColCount - 1);
  } else if (scene.table.options.rightFrozenColCount) {
    scene.component.setRightFrozenColumnShadow(scene.table.colCount - scene.table.rightFrozenColCount);
  }
  scene.hasFrozen = true;
}

function moveColumnFromBodyToRowHeader(scene: Scenegraph) {
  // deal with bodyGroup
  const column = scene.bodyGroup.firstChild instanceof Group ? scene.bodyGroup.firstChild : null;
  if (column) {
    scene.rowHeaderGroup.appendChild(column);
    // update container width
    scene.rowHeaderGroup.setAttribute('width', scene.rowHeaderGroup.attribute.width + column.attribute.width);
    scene.bodyGroup.setAttribute('width', scene.bodyGroup.attribute.width - column.attribute.width);
  }
}

function moveColumnFromColHeaderToCornerHeader(scene: Scenegraph) {
  // deal width colHeaderGroup
  const headerColumn = scene.colHeaderGroup.firstChild instanceof Group ? scene.colHeaderGroup.firstChild : null;
  if (headerColumn) {
    scene.cornerHeaderGroup.appendChild(headerColumn);
    scene.cornerHeaderGroup.setAttribute(
      'width',
      scene.cornerHeaderGroup.attribute.width + headerColumn.attribute.width
    );
    scene.colHeaderGroup.setAttribute('width', scene.colHeaderGroup.attribute.width - headerColumn.attribute.width);
  }
}

function moveColumnFromRowHeaderToBody(scene: Scenegraph) {
  const column =
    scene.rowHeaderGroup.lastChild instanceof Group
      ? scene.rowHeaderGroup.lastChild
      : (scene.rowHeaderGroup.lastChild?._prev as Group);
  if (column) {
    insertBefore(scene.bodyGroup, column, scene.bodyGroup.firstChild as Group);
    // 更新容器宽度
    scene.bodyGroup.setAttribute('width', scene.bodyGroup.attribute.width + column.attribute.width);
    scene.rowHeaderGroup.setAttribute('width', scene.rowHeaderGroup.attribute.width - column.attribute.width);
  }
}

function moveColumnFromCornerHeaderToColHeader(scene: Scenegraph) {
  // 处理列表头
  const headerColumn =
    scene.cornerHeaderGroup.lastChild instanceof Group
      ? scene.cornerHeaderGroup.lastChild
      : (scene.cornerHeaderGroup.lastChild?._prev as Group);
  if (headerColumn) {
    insertBefore(scene.colHeaderGroup, headerColumn, scene.colHeaderGroup.firstChild as Group);
    scene.colHeaderGroup.setAttribute('width', scene.colHeaderGroup.attribute.width + headerColumn.attribute.width);
    scene.cornerHeaderGroup.setAttribute(
      'width',
      scene.cornerHeaderGroup.attribute.width - headerColumn.attribute.width
    );
  }
}

function moveColumnFromBottomToLeftBottomCorner(scene: Scenegraph) {
  // deal with bottomFrozenGroup
  const column = scene.bottomFrozenGroup.firstChild instanceof Group ? scene.bottomFrozenGroup.firstChild : null;
  if (column) {
    scene.leftBottomCornerGroup.appendChild(column);
    // update container width
    scene.leftBottomCornerGroup.setAttribute(
      'width',
      scene.leftBottomCornerGroup.attribute.width + column.attribute.width
    );
    scene.bottomFrozenGroup.setAttribute('width', scene.bottomFrozenGroup.attribute.width - column.attribute.width);

    if (scene.table.isPivotChart()) {
      column.forEachChildren((child: Group) => {
        child.setAttributes({
          stroke: false,
          fill: false
        });
      });
    }
  }
}

function moveColumnFromLeftBottomCornerToBottom(scene: Scenegraph) {
  const column =
    scene.leftBottomCornerGroup.lastChild instanceof Group
      ? scene.leftBottomCornerGroup.lastChild
      : (scene.leftBottomCornerGroup.lastChild?._prev as Group);
  if (column) {
    insertBefore(scene.bottomFrozenGroup, column, scene.bottomFrozenGroup.firstChild as Group);
    // 更新容器宽度
    scene.bottomFrozenGroup.setAttribute('width', scene.bottomFrozenGroup.attribute.width + column.attribute.width);
    scene.leftBottomCornerGroup.setAttribute(
      'width',
      scene.leftBottomCornerGroup.attribute.width - column.attribute.width
    );

    if (scene.table.isPivotChart()) {
      column.forEachChildren((child: Group) => {
        const cellStyle = scene.table._getCellStyle(child.col, child.row);
        const range = scene.table.getCellRange(child.col, child.row);
        const cellTheme = getStyleTheme(
          cellStyle,
          scene.table,
          range ? range.start.col : child.col,
          range ? range.start.row : child.row,
          getProp
        ).theme;

        child.setAttributes({
          fill: cellTheme?.group?.fill ?? undefined,
          stroke: cellTheme?.group?.stroke ?? undefined
        });
      });
    }
  }
}

export function dealRightFrozen(distRightFrozenCol: number, scene: Scenegraph) {
  const {
    table,
    proxy,
    rightTopCornerGroup,
    rightFrozenGroup,
    rightBottomCornerGroup,
    bottomFrozenGroup,
    bodyGroup,
    colHeaderGroup
  } = scene;
  // const distRightFrozenCol = scene.table.rightFrozenColCount;
  const currentRightFrozenCol = scene.table.rightFrozenColCount;
  if (distRightFrozenCol > currentRightFrozenCol) {
    for (let col = table.colCount - currentRightFrozenCol - 1; col >= table.colCount - distRightFrozenCol; col--) {
      const colGroup = scene.getColGroup(col);
      insertBefore(rightFrozenGroup, colGroup, rightFrozenGroup.firstChild as Group);
      const headerColGroup = scene.getColGroup(col, true);
      insertBefore(rightTopCornerGroup, headerColGroup, rightTopCornerGroup.firstChild as Group);
      const bottomColGroup = scene.getColGroupInBottom(col);
      insertBefore(rightBottomCornerGroup, bottomColGroup, rightBottomCornerGroup.firstChild as Group);
    }
    // reset cell y
    let x = 0;
    rightFrozenGroup.forEachChildren((columnGroup: Group) => {
      columnGroup.setAttribute('x', x);
      x += columnGroup.attribute.width;
    });
    x = 0;
    rightTopCornerGroup.forEachChildren((columnGroup: Group) => {
      columnGroup.setAttribute('x', x);
      x += columnGroup.attribute.width;
    });
    x = 0;
    rightBottomCornerGroup.forEachChildren((columnGroup: Group) => {
      columnGroup.setAttribute('x', x);
      x += columnGroup.attribute.width;
    });
  } else if (distRightFrozenCol < currentRightFrozenCol) {
    for (let col = table.colCount - currentRightFrozenCol; col < table.colCount - distRightFrozenCol; col++) {
      const colGroup = scene.getColGroup(col);
      colGroup.setAttribute(
        'x',
        (bodyGroup.lastChild as Group).attribute.x + table.getColWidth((bodyGroup.lastChild as Group).col)
      );
      bodyGroup.appendChild(colGroup);
      const headerColGroup = scene.getColGroupInRightTopCorner(col);
      headerColGroup.setAttribute(
        'x',
        (colHeaderGroup.lastChild as Group).attribute.x + table.getColWidth((colHeaderGroup.lastChild as Group).col)
      );
      colHeaderGroup.appendChild(headerColGroup);
      const bottomColGroup = scene.getColGroupInRightBottomCorner(col);
      bottomColGroup.setAttribute(
        'x',
        (bottomFrozenGroup.lastChild as Group).attribute.x +
          table.getColWidth((bottomFrozenGroup.lastChild as Group).col)
      );
      bottomFrozenGroup.appendChild(bottomColGroup);
    }
    // reset cell y
    let x = 0;
    rightFrozenGroup.forEachChildren((columnGroup: Group) => {
      columnGroup.setAttribute('x', x);
      x += columnGroup.attribute.width;
    });
    x = 0;
    rightTopCornerGroup.forEachChildren((columnGroup: Group) => {
      columnGroup.setAttribute('x', x);
      x += columnGroup.attribute.width;
    });
    x = 0;
    rightBottomCornerGroup.forEachChildren((columnGroup: Group) => {
      columnGroup.setAttribute('x', x);
      x += columnGroup.attribute.width;
    });
  }

  // reset right width
  rightFrozenGroup.setAttribute('width', table.getColsWidth(table.colCount - distRightFrozenCol, table.colCount - 1));
  rightTopCornerGroup.setAttribute(
    'width',
    table.getColsWidth(table.colCount - distRightFrozenCol, table.colCount - 1)
  );
  rightBottomCornerGroup.setAttribute(
    'width',
    table.getColsWidth(table.colCount - distRightFrozenCol, table.colCount - 1)
  );

  table.internalProps.rightFrozenColCount = distRightFrozenCol;
  scene.updateContainer();
  scene.component.updateScrollBar();
  scene.updateNextFrame();
}

export function dealBottomFrozen(distBottomFrozenRow: number, scene: Scenegraph) {
  const { table, proxy, bottomFrozenGroup, leftBottomCornerGroup, rightBottomCornerGroup } = scene;
  if (!bottomFrozenGroup.childrenCount) {
    // init bottom
    if (!proxy.table.isPivotChart()) {
      // create left bottom frozen
      createColGroup(
        leftBottomCornerGroup,
        0,
        0,
        0, // colStart
        table.frozenColCount - 1, // colEnd
        0, // rowStart
        -1, // rowEnd
        'rowHeader', // isHeader
        table
      );
      createColGroup(
        rightBottomCornerGroup,
        0,
        0,
        table.colCount - table.rightFrozenColCount, // colStart
        table.colCount - 1, // colEnd
        0, // rowStart
        -1, // rowEnd
        'body', // isHeader
        table
      );
    }
    // create bottomFrozenGroup
    createColGroup(
      bottomFrozenGroup,
      0,
      0,
      proxy.colStart, // colStart
      proxy.colEnd, // colEnd
      0, // rowStart
      -1, // rowEnd
      'body', // isHeader
      table
    );
  }
  const currentBottomFrozenRow = scene.table.bottomFrozenRowCount;
  if (distBottomFrozenRow > currentBottomFrozenRow) {
    // row header -> left bottom
    for (let col = 0; col < table.frozenColCount; col++) {
      const bottomFrozenColumnGroup = scene.getColGroupInLeftBottomCorner(col);
      // move cell
      for (let row = table.rowCount - currentBottomFrozenRow - 1; row >= table.rowCount - distBottomFrozenRow; row--) {
        const cellGroup = scene.getCell(col, row, true);
        // bottomFrozenColumnGroup.insertBefore(cellGroup, bottomFrozenColumnGroup.firstChild);
        insertBefore(bottomFrozenColumnGroup, cellGroup, bottomFrozenColumnGroup.firstChild as Group);
      }
      // reset cell y
      let y = 0;
      bottomFrozenColumnGroup.forEachChildren((cellGroup: Group) => {
        cellGroup.setAttribute('y', y);
        y += table.getRowHeight(cellGroup.row);
      });
    }
    // body -> bottom
    for (let col = proxy.colStart; col <= proxy.colEnd; col++) {
      const bottomFrozenColumnGroup = scene.getColGroupInBottom(col);
      // move cell
      for (let row = table.rowCount - currentBottomFrozenRow - 1; row >= table.rowCount - distBottomFrozenRow; row--) {
        const cellGroup = scene.getCell(col, row, true);
        // bottomFrozenColumnGroup.insertBefore(cellGroup, bottomFrozenColumnGroup.firstChild);
        insertBefore(bottomFrozenColumnGroup, cellGroup, bottomFrozenColumnGroup.firstChild as Group);
      }
      // reset cell y
      let y = 0;
      bottomFrozenColumnGroup.forEachChildren((cellGroup: Group) => {
        cellGroup.setAttribute('y', y);
        y += table.getRowHeight(cellGroup.row);
      });
    }
    if (table.rightFrozenColCount > 0) {
      // right -> right bottom
      for (let col = table.colCount - table.rightFrozenColCount; col < table.colCount; col++) {
        const bottomFrozenColumnGroup = scene.getColGroupInRightBottomCorner(col);
        // move cell
        for (
          let row = table.rowCount - currentBottomFrozenRow - 1;
          row >= table.rowCount - distBottomFrozenRow;
          row--
        ) {
          const cellGroup = scene.getCell(col, row, true);
          // bottomFrozenColumnGroup.insertBefore(cellGroup, bottomFrozenColumnGroup.firstChild);
          insertBefore(bottomFrozenColumnGroup, cellGroup, bottomFrozenColumnGroup.firstChild as Group);
        }
        // reset cell y
        let y = 0;
        bottomFrozenColumnGroup.forEachChildren((cellGroup: Group) => {
          cellGroup.setAttribute('y', y);
          y += table.getRowHeight(cellGroup.row);
        });
      }
    }
  } else if (distBottomFrozenRow < currentBottomFrozenRow) {
    // left bottom -> row header
    for (let col = 0; col < table.rowHeaderLevelCount; col++) {
      const columnGroup = scene.getColGroup(col);
      for (let row = table.rowCount - currentBottomFrozenRow; row < table.rowCount - distBottomFrozenRow; row++) {
        const cellGroup = scene.getCell(col, row, true);
        cellGroup.setAttribute(
          'y',
          (columnGroup.lastChild as Group).attribute.y + table.getRowHeight((columnGroup.lastChild as Group).row)
        );
        columnGroup.appendChild(cellGroup);
      }
      // reset cell y
      const bottomFrozenColumnGroup = scene.getColGroupInLeftBottomCorner(col);
      let y = 0;
      bottomFrozenColumnGroup.forEachChildren((cellGroup: Group) => {
        cellGroup.setAttribute('y', y);
        y += table.getRowHeight(cellGroup.row);
      });
    }
    // bottom -> body
    for (let col = proxy.colStart; col <= proxy.colEnd; col++) {
      const columnGroup = scene.getColGroup(col);
      for (let row = table.rowCount - currentBottomFrozenRow; row < table.rowCount - distBottomFrozenRow; row++) {
        const cellGroup = scene.getCell(col, row, true);
        cellGroup.setAttribute(
          'y',
          (columnGroup.lastChild as Group).attribute.y + table.getRowHeight((columnGroup.lastChild as Group).row)
        );
        columnGroup.appendChild(cellGroup);
      }
      // reset cell y
      const bottomFrozenColumnGroup = scene.getColGroupInBottom(col);
      let y = 0;
      bottomFrozenColumnGroup.forEachChildren((cellGroup: Group) => {
        cellGroup.setAttribute('y', y);
        y += table.getRowHeight(cellGroup.row);
      });
    }
    if (table.rightFrozenColCount > 0) {
      // right bottom -> right
      for (let col = table.colCount - table.rightFrozenColCount; col < table.colCount; col++) {
        const columnGroup = scene.getColGroup(col);
        for (let row = table.rowCount - currentBottomFrozenRow; row < table.rowCount - distBottomFrozenRow; row++) {
          const cellGroup = scene.getCell(col, row, true);
          cellGroup.setAttribute(
            'y',
            (columnGroup.lastChild as Group).attribute.y + table.getRowHeight((columnGroup.lastChild as Group).row)
          );
          columnGroup.appendChild(cellGroup);
        }
        // reset cell y
        const bottomFrozenColumnGroup = scene.getColGroupInRightBottomCorner(col);
        let y = 0;
        bottomFrozenColumnGroup.forEachChildren((cellGroup: Group) => {
          cellGroup.setAttribute('y', y);
          y += table.getRowHeight(cellGroup.row);
        });
      }
    }
  }
  // reset bottom height
  bottomFrozenGroup.setAttribute(
    'height',
    table.getRowsHeight(table.rowCount - distBottomFrozenRow, table.rowCount - 1)
  );
  leftBottomCornerGroup.setAttribute(
    'height',
    table.getRowsHeight(table.rowCount - distBottomFrozenRow, table.rowCount - 1)
  );
  rightBottomCornerGroup.setAttribute(
    'height',
    table.getRowsHeight(table.rowCount - distBottomFrozenRow, table.rowCount - 1)
  );

  table.internalProps.bottomFrozenRowCount = distBottomFrozenRow;
  scene.updateContainer();
  scene.component.updateScrollBar();
  scene.updateNextFrame();
}

function insertBefore(container: Group, newNode: Group, targetGroup: Group) {
  if (!newNode || !container) {
    return;
  }
  if (targetGroup) {
    container.insertBefore(newNode, targetGroup);
  } else {
    container.appendChild(newNode);
  }
}

export function resetRowFrozen(scene: Scenegraph) {
  if (scene.frozenRowCount > scene.table.frozenRowCount) {
    // move columnGroup from rowHeaderGroup into bodyGroup(from cornerHeaderGroup into colHeaderGroup)
    scene.bodyGroup.setAttribute('width', scene.colHeaderGroup.attribute.width);
    scene.bodyGroup.setAttribute('x', scene.colHeaderGroup.attribute.x);
    scene.rowHeaderGroup.setAttribute('width', scene.cornerHeaderGroup.attribute.width);
    for (let i = 0; i < scene.frozenRowCount - scene.table.frozenRowCount; i++) {
      moveRowFromColHeaderToBody(scene);
      moveRowFromCornerHeaderToRowHeader(scene);
      moveRowFromTopRightCornerToRight(scene);
    }
  } else if (scene.frozenRowCount < scene.table.frozenRowCount) {
    // move columnGroup from bodyGroup into rowHeaderGroup(from colHeaderGroup into cornerHeaderGroup)
    scene.colHeaderGroup.setAttribute('width', scene.bodyGroup.attribute.width);
    scene.colHeaderGroup.setAttribute('x', scene.bodyGroup.attribute.x);
    scene.cornerHeaderGroup.setAttribute('width', scene.rowHeaderGroup.attribute.width);
    for (let i = 0; i < scene.table.frozenRowCount - scene.frozenRowCount; i++) {
      moveRowFromBodyToColHeader(scene);
      moveRowFromRowHeaderToCornerHeader(scene);
      moveRowFromRightToTopRightCorner(scene);
    }
  }

  updateReactComponentContainer(scene);
  scene.recreateAllSelectRangeComponents();
  // scene.frozenColCount = scene.rowHeaderGroup.childrenCount;
  scene.frozenRowCount = scene.table.frozenRowCount;
  scene.frozenColCount = scene.rowHeaderGroup?.childrenCount ?? 0;
  //   scene.proxy.colStart = scene.table.frozenColCount;
  scene.proxy.rowStart = (scene.bodyGroup.firstChild?.firstChild as any)?.row ?? scene.table.frozenRowCount;
  scene.bodyGroup.setAttribute('y', scene.colHeaderGroup.attribute.height);
  scene.rowHeaderGroup.setAttribute('y', scene.cornerHeaderGroup.attribute.height);
  // scene.updateContainerAttrWidthAndX();
  scene.updateContainer();
  scene.updateBorderSizeAndPosition();

  scene.hasFrozen = true;
}

function moveRowFromBodyToColHeader(scene: Scenegraph) {
  let hasSetedHeight = false;
  // deal with bodyGroup
  for (let i = 0; i < scene.bodyGroup.childrenCount; i++) {
    const colGroup = scene.bodyGroup.children[i] as Group;
    const rowCell = colGroup.firstChild as Group;
    scene.colHeaderGroup.children[i]?.appendChild(rowCell);
    // update container width
    if (!hasSetedHeight) {
      scene.colHeaderGroup.setAttribute('height', scene.colHeaderGroup.attribute.height + rowCell.attribute.height);
      scene.bodyGroup.setAttribute('height', scene.bodyGroup.attribute.height - rowCell.attribute.height);
      hasSetedHeight = true;
    }
  }
}

function moveRowFromRowHeaderToCornerHeader(scene: Scenegraph) {
  let hasSetedHeight = false;
  // deal with rowHeaderGroup
  for (let i = 0; i < scene.rowHeaderGroup.childrenCount; i++) {
    const colGroup = scene.rowHeaderGroup.children[i] as Group;
    const rowCell = colGroup.firstChild as Group;
    scene.cornerHeaderGroup.children[i]?.appendChild(rowCell);
    // update container width
    if (!hasSetedHeight) {
      scene.cornerHeaderGroup.setAttribute(
        'height',
        scene.cornerHeaderGroup.attribute.height + rowCell.attribute.height
      );
      scene.rowHeaderGroup.setAttribute('height', scene.rowHeaderGroup.attribute.height - rowCell.attribute.height);
      hasSetedHeight = true;
    }
  }
}

function moveRowFromRightToTopRightCorner(scene: Scenegraph) {
  let hasSetedHeight = false;
  // deal with rowHeaderGroup
  for (let i = 0; i < scene.rightFrozenGroup.childrenCount; i++) {
    const colGroup = scene.rightFrozenGroup.children[i] as Group;
    const rowCell = colGroup.firstChild as Group;
    scene.rightTopCornerGroup.children[i]?.appendChild(rowCell);
    // update container width
    if (!hasSetedHeight) {
      scene.rightTopCornerGroup.setAttribute(
        'height',
        scene.rightTopCornerGroup.attribute.height + rowCell.attribute.height
      );
      scene.rightFrozenGroup.setAttribute('height', scene.rightFrozenGroup.attribute.height - rowCell.attribute.height);
      hasSetedHeight = true;
    }
  }
}

function moveRowFromColHeaderToBody(scene: Scenegraph) {
  let hasSetedHeight = false;
  // deal with bodyGroup
  for (let i = 0; i < scene.colHeaderGroup.childrenCount; i++) {
    const colGroup = scene.colHeaderGroup.children[i] as Group;
    const rowCell = colGroup.lastChild as Group;
    insertBefore(scene.bodyGroup.children[i] as Group, rowCell, scene.bodyGroup.children[i].firstChild as Group);
    // update container width
    if (!hasSetedHeight) {
      scene.colHeaderGroup.setAttribute('height', scene.colHeaderGroup.attribute.height - rowCell.attribute.height);
      scene.bodyGroup.setAttribute('height', scene.bodyGroup.attribute.height + rowCell.attribute.height);
      hasSetedHeight = true;
    }
  }
}

function moveRowFromCornerHeaderToRowHeader(scene: Scenegraph) {
  let hasSetedHeight = false;
  // deal with rowHeaderGroup
  for (let i = 0; i < scene.cornerHeaderGroup.childrenCount; i++) {
    const colGroup = scene.cornerHeaderGroup.children[i] as Group;
    const rowCell = colGroup.lastChild as Group;
    // scene.rowHeaderGroup.children[i]?.appendChild(rowCell);
    insertBefore(
      scene.rowHeaderGroup.children[i] as Group,
      rowCell,
      scene.rowHeaderGroup.children[i].firstChild as Group
    );
    // update container width
    if (!hasSetedHeight) {
      scene.cornerHeaderGroup.setAttribute(
        'height',
        scene.cornerHeaderGroup.attribute.height - rowCell.attribute.height
      );
      scene.rowHeaderGroup.setAttribute('height', scene.rowHeaderGroup.attribute.height + rowCell.attribute.height);
      hasSetedHeight = true;
    }
  }
}

function moveRowFromTopRightCornerToRight(scene: Scenegraph) {
  let hasSetedHeight = false;
  // deal with rowHeaderGroup
  for (let i = 0; i < scene.rightTopCornerGroup.childrenCount; i++) {
    const colGroup = scene.rightTopCornerGroup.children[i] as Group;
    const rowCell = colGroup.lastChild as Group;
    // scene.rightFrozenGroup.children[i]?.appendChild(rowCell);
    insertBefore(
      scene.rightFrozenGroup.children[i] as Group,
      rowCell,
      scene.rightFrozenGroup.children[i].firstChild as Group
    );
    // update container width
    if (!hasSetedHeight) {
      scene.rightTopCornerGroup.setAttribute(
        'height',
        scene.rightTopCornerGroup.attribute.height - rowCell.attribute.height
      );
      scene.rightFrozenGroup.setAttribute('height', scene.rightFrozenGroup.attribute.height + rowCell.attribute.height);
      hasSetedHeight = true;
    }
  }
}
