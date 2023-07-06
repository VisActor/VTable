import { Group } from '../graphic/group';
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
    if (scene.bodyGroup.firstChild) {
      scene.bodyGroup.insertBefore(column, scene.bodyGroup.firstChild);
    } else {
      scene.bodyGroup.appendChild(column);
    }
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
    if (scene.colHeaderGroup.firstChild) {
      scene.colHeaderGroup.insertBefore(headerColumn, scene.colHeaderGroup.firstChild);
    } else {
      scene.bodyGroup.appendChild(headerColumn);
    }
    scene.colHeaderGroup.setAttribute('width', scene.colHeaderGroup.attribute.width + headerColumn.attribute.width);
    scene.cornerHeaderGroup.setAttribute(
      'width',
      scene.cornerHeaderGroup.attribute.width - headerColumn.attribute.width
    );
  }
}
