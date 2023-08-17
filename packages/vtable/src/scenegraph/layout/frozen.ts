import { Group } from '../graphic/group';
import { createColGroup } from '../group-creater/column';
import type { Scenegraph } from '../scenegraph';

export function dealFrozen(scene: Scenegraph) {
  if (scene.table.frozenColCount > scene.table.rowHeaderLevelCount) {
    // 将对应列移入rowHeaderGroup
    scene.rowHeaderGroup.setAttribute('height', scene.bodyGroup.attribute.height);
    scene.rowHeaderGroup.setAttribute('y', scene.bodyGroup.attribute.y);
    scene.cornerHeaderGroup.setAttribute('height', scene.colHeaderGroup.attribute.height);
    for (let i = 0; i < scene.table.frozenColCount - scene.table.rowHeaderLevelCount; i++) {
      moveColumnFromBodyToRowHeader(scene);
      moveColumnFromColHeaderToCornerHeader(scene);
    }
  } else if (scene.table.frozenColCount < scene.table.rowHeaderLevelCount) {
    // move columnGroup from rowHeaderGroup into bodyGroup(from cornerHeaderGroup into colHeaderGroup)
    for (let i = 0; i < scene.table.rowHeaderLevelCount - scene.table.frozenColCount; i++) {
      moveColumnFromRowHeaderToBody(scene);
      moveColumnFromCornerHeaderToColHeader(scene);
    }
  }
  scene.bodyGroup.setAttribute('x', scene.rowHeaderGroup.attribute.width);
  scene.colHeaderGroup.setAttribute('x', scene.cornerHeaderGroup.attribute.width);

  scene.updateContainer();
  scene.updateBorderSizeAndPosition();

  if (!scene.isPivot && !scene.transpose) {
    scene.component.setFrozenColumnShadow(scene.table.frozenColCount - 1);
  }
  scene.hasFrozen = true;

  // scene.frozenColCount = scene.rowHeaderGroup.childrenCount;
  scene.frozenColCount = scene.table.frozenColCount;
  scene.frozenRowCount = scene.colHeaderGroup.firstChild?.childrenCount ?? 0;
}

export function resetFrozen(scene: Scenegraph) {
  if (scene.frozenColCount > scene.table.rowHeaderLevelCount) {
    // move columnGroup from rowHeaderGroup into bodyGroup(from cornerHeaderGroup into colHeaderGroup)
    for (let i = 0; i < scene.frozenColCount - scene.table.rowHeaderLevelCount; i++) {
      moveColumnFromRowHeaderToBody(scene);
      moveColumnFromCornerHeaderToColHeader(scene);
    }
  } else if (scene.frozenColCount < scene.table.rowHeaderLevelCount) {
    // move columnGroup from bodyGroup into rowHeaderGroup(from colHeaderGroup into cornerHeaderGroup)
    scene.rowHeaderGroup.setAttribute('height', scene.bodyGroup.attribute.height);
    scene.rowHeaderGroup.setAttribute('y', scene.bodyGroup.attribute.y);
    scene.cornerHeaderGroup.setAttribute('height', scene.colHeaderGroup.attribute.height);
    for (let i = 0; i < scene.table.rowHeaderLevelCount - scene.frozenColCount; i++) {
      moveColumnFromBodyToRowHeader(scene);
      moveColumnFromColHeaderToCornerHeader(scene);
    }
  }
  scene.bodyGroup.setAttribute('x', scene.rowHeaderGroup.attribute.width);
  scene.colHeaderGroup.setAttribute('x', scene.cornerHeaderGroup.attribute.width);

  scene.updateContainer();
  scene.updateBorderSizeAndPosition();

  if (!scene.isPivot && !scene.transpose) {
    scene.component.setFrozenColumnShadow(scene.table.frozenColCount - 1);
  }
  scene.hasFrozen = true;

  // scene.frozenColCount = scene.rowHeaderGroup.childrenCount;
  scene.frozenColCount = scene.table.rowHeaderLevelCount;
  scene.frozenRowCount = scene.colHeaderGroup.firstChild?.childrenCount ?? 0;
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
        table.rowHeaderLevelCount - 1, // colEnd
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
    for (let col = 0; col < table.rowHeaderLevelCount; col++) {
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
