import { Group } from '../graphic/group';
import type { Scenegraph } from '../scenegraph';
import { createCornerCell } from '../style/corner-cell';

export function initSceneGraph(scene: Scenegraph) {
  const width = scene.table.tableNoFrameWidth;
  const height = scene.table.tableNoFrameHeight;

  scene.tableGroup = new Group({ x: 0, y: 0, width, height, clip: true, pickable: false });
  scene.tableGroup.role = 'table';

  const colHeaderGroup = createContainerGroup(0, 0);
  colHeaderGroup.role = 'col-header';
  scene.colHeaderGroup = colHeaderGroup;

  const cornerHeaderGroup = createContainerGroup(0, 0);
  cornerHeaderGroup.role = 'corner-header';
  scene.cornerHeaderGroup = cornerHeaderGroup;

  const rowHeaderGroup = createContainerGroup(0, 0);
  rowHeaderGroup.role = 'row-header';
  scene.rowHeaderGroup = rowHeaderGroup;

  const bodyGroup = createContainerGroup(width, 0);
  bodyGroup.role = 'body';
  scene.bodyGroup = bodyGroup;

  const rightFrozenGroup = createContainerGroup(0, 0);
  rightFrozenGroup.role = 'right-frozen';
  scene.rightFrozenGroup = rightFrozenGroup;

  const bottomFrozenGroup = createContainerGroup(0, 0);
  bottomFrozenGroup.role = 'bottom-frozen';
  scene.bottomFrozenGroup = bottomFrozenGroup;

  const componentGroup = createContainerGroup(0, 0);
  componentGroup.role = 'component';
  scene.componentGroup = componentGroup;

  const rightTopCornerGroup = createContainerGroup(0, 0);
  rightTopCornerGroup.role = 'corner-right-top-header';
  scene.rightTopCornerGroup = rightTopCornerGroup;

  const rightBottomCornerGroup = createContainerGroup(0, 0);
  rightBottomCornerGroup.role = 'corner-right-bottom-header';
  scene.rightBottomCornerGroup = rightBottomCornerGroup;

  const leftBottomCornerGroup = createContainerGroup(0, 0);
  leftBottomCornerGroup.role = 'corner-right-top-header';
  scene.leftBottomCornerGroup = leftBottomCornerGroup;

  if (scene.table.isPivotChart()) {
    createCornerCell(
      rightTopCornerGroup,
      scene.table.theme.cornerRightTopCellStyle || scene.table.theme.cornerHeaderStyle
    );
    createCornerCell(
      leftBottomCornerGroup,
      scene.table.theme.cornerLeftBottomCellStyle || scene.table.theme.cornerHeaderStyle
    );
    createCornerCell(
      rightBottomCornerGroup,
      scene.table.theme.cornerRightBottomCellStyle || scene.table.theme.cornerHeaderStyle
    );
  } else {
    createCornerCell(
      rightBottomCornerGroup,
      scene.table.theme.cornerRightBottomCellStyle || scene.table.theme.cornerHeaderStyle
    );
  }

  scene.tableGroup.addChild(bodyGroup);
  scene.tableGroup.addChild(rightFrozenGroup);
  scene.tableGroup.addChild(bottomFrozenGroup);
  scene.tableGroup.addChild(rowHeaderGroup);
  scene.tableGroup.addChild(colHeaderGroup);
  scene.tableGroup.addChild(rightBottomCornerGroup);
  scene.tableGroup.addChild(rightTopCornerGroup);
  scene.tableGroup.addChild(leftBottomCornerGroup);
  scene.tableGroup.addChild(cornerHeaderGroup);
  scene.tableGroup.addChild(componentGroup);
}

function createContainerGroup(width: number, height: number) {
  return new Group({
    x: 0,
    y: 0,
    width,
    height,
    clip: false,
    pickable: false
  });
}
