import type { ListTableProtected } from '../../ts-types/base-table';
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
    !(scene.table.internalProps as ListTableProtected).enableTreeStickCell
  );
  colHeaderGroup.role = 'col-header';
  scene.colHeaderGroup = colHeaderGroup;

  const cornerHeaderGroup = createContainerGroup(
    0,
    0,
    !(scene.table.internalProps as ListTableProtected).enableTreeStickCell
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

  const bodySelectGroup = createContainerGroup(width, 0, true);
  bodySelectGroup.role = 'body';
  bodySelectGroup.name = 'select-overlay';
  scene.bodySelectGroup = bodySelectGroup;

  const rowHeaderSelectGroup = createContainerGroup(0, 0, true);
  rowHeaderSelectGroup.role = 'row-header';
  rowHeaderSelectGroup.name = 'select-overlay';
  scene.rowHeaderSelectGroup = rowHeaderSelectGroup;

  const bottomFrozenSelectGroup = createContainerGroup(0, 0, true);
  bottomFrozenSelectGroup.role = 'bottom-frozen';
  bottomFrozenSelectGroup.name = 'select-overlay';
  scene.bottomFrozenSelectGroup = bottomFrozenSelectGroup;

  const colHeaderSelectGroup = createContainerGroup(0, 0, true);
  colHeaderSelectGroup.role = 'col-header';
  colHeaderSelectGroup.name = 'select-overlay';
  scene.colHeaderSelectGroup = colHeaderSelectGroup;

  const rightFrozenSelectGroup = createContainerGroup(0, 0, true);
  rightFrozenSelectGroup.role = 'right-frozen';
  rightFrozenSelectGroup.name = 'select-overlay';
  scene.rightFrozenSelectGroup = rightFrozenSelectGroup;

  const rightTopCornerSelectGroup = createContainerGroup(0, 0, true);
  rightTopCornerSelectGroup.role = 'corner-right-top-header';
  rightTopCornerSelectGroup.name = 'select-overlay';
  scene.rightTopCornerSelectGroup = rightTopCornerSelectGroup;

  const rightBottomCornerSelectGroup = createContainerGroup(0, 0, true);
  rightBottomCornerSelectGroup.role = 'corner-right-bottom-header';
  rightBottomCornerSelectGroup.name = 'select-overlay';
  scene.rightBottomCornerSelectGroup = rightBottomCornerSelectGroup;

  const leftBottomCornerSelectGroup = createContainerGroup(0, 0, true);
  leftBottomCornerSelectGroup.role = 'corner-left-bottom-header';
  leftBottomCornerSelectGroup.name = 'select-overlay';
  scene.leftBottomCornerSelectGroup = leftBottomCornerSelectGroup;

  const cornerHeaderSelectGroup = createContainerGroup(0, 0, true);
  cornerHeaderSelectGroup.role = 'corner-header';
  cornerHeaderSelectGroup.name = 'select-overlay';
  scene.cornerHeaderSelectGroup = cornerHeaderSelectGroup;

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

  scene.tableGroup.addChild(bodySelectGroup);
  scene.tableGroup.addChild(rowHeaderSelectGroup);
  scene.tableGroup.addChild(bottomFrozenSelectGroup);
  scene.tableGroup.addChild(colHeaderSelectGroup);
  scene.tableGroup.addChild(rightFrozenSelectGroup);
  scene.tableGroup.addChild(rightBottomCornerSelectGroup);
  scene.tableGroup.addChild(rightTopCornerSelectGroup);
  scene.tableGroup.addChild(leftBottomCornerSelectGroup);
  scene.tableGroup.addChild(cornerHeaderSelectGroup);
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
