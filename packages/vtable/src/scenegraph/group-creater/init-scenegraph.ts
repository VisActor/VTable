import type { ListTableConstructorOptions } from '../..';
import { Group } from '../graphic/group';
import type { Scenegraph } from '../scenegraph';

export function initSceneGraph(scene: Scenegraph) {
  const width = scene.table.tableNoFrameWidth;
  const height = scene.table.tableNoFrameHeight;

  scene.tableGroup = new Group({ x: 0, y: 0, width, height, clip: true, pickable: false });
  scene.tableGroup.role = 'table';

  const colHeaderGroup = createContainerGroup(
    0,
    0,
    !(scene.table.options as ListTableConstructorOptions).enableTreeStickCell
  );
  colHeaderGroup.role = 'col-header';
  scene.colHeaderGroup = colHeaderGroup;

  const cornerHeaderGroup = createContainerGroup(
    0,
    0,
    !(scene.table.options as ListTableConstructorOptions).enableTreeStickCell
  );
  cornerHeaderGroup.role = 'corner-header';
  scene.cornerHeaderGroup = cornerHeaderGroup;

  const rowHeaderGroup = createContainerGroup(0, 0, true);
  rowHeaderGroup.role = 'row-header';
  scene.rowHeaderGroup = rowHeaderGroup;

  const bodyGroup = createContainerGroup(width, 0, true);
  bodyGroup.role = 'body';
  scene.bodyGroup = bodyGroup;

  const rightFrozenGroup = createContainerGroup(0, 0, true);
  rightFrozenGroup.role = 'right-frozen';
  scene.rightFrozenGroup = rightFrozenGroup;

  const bottomFrozenGroup = createContainerGroup(0, 0, true);
  bottomFrozenGroup.role = 'bottom-frozen';
  scene.bottomFrozenGroup = bottomFrozenGroup;

  const componentGroup = createContainerGroup(0, 0);
  componentGroup.role = 'component';
  scene.componentGroup = componentGroup;

  const rightTopCornerGroup = createContainerGroup(0, 0, true);
  rightTopCornerGroup.role = 'corner-right-top-header';
  scene.rightTopCornerGroup = rightTopCornerGroup;

  const rightBottomCornerGroup = createContainerGroup(0, 0, true);
  rightBottomCornerGroup.role = 'corner-right-bottom-header';
  scene.rightBottomCornerGroup = rightBottomCornerGroup;

  const leftBottomCornerGroup = createContainerGroup(0, 0, true);
  leftBottomCornerGroup.role = 'corner-left-bottom-header';
  scene.leftBottomCornerGroup = leftBottomCornerGroup;

  scene.tableGroup.addChild(bodyGroup);
  //注意这块添加的顺序 会影响select框选效果 有可能引起框选框覆盖其他部分group的问题  具体问题出在update-select-border文件中的updateComponent方法
  scene.tableGroup.addChild(rowHeaderGroup);
  scene.tableGroup.addChild(bottomFrozenGroup);

  scene.tableGroup.addChild(colHeaderGroup);
  scene.tableGroup.addChild(rightFrozenGroup);

  scene.tableGroup.addChild(rightBottomCornerGroup);
  scene.tableGroup.addChild(rightTopCornerGroup);
  scene.tableGroup.addChild(leftBottomCornerGroup);
  scene.tableGroup.addChild(cornerHeaderGroup);
  scene.tableGroup.addChild(componentGroup);
}

function createContainerGroup(width: number, height: number, clip?: boolean) {
  return new Group({
    x: 0,
    y: 0,
    width,
    height,
    clip: clip ?? false,
    pickable: false
  });
}
