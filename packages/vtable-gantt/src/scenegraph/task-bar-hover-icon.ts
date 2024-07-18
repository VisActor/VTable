import { Group } from '@visactor/vrender-core';
import type { Scenegraph } from './scenegraph';
import { Icon } from './icon';
export class TaskBarHoverIcon {
  group: Group;
  barContainer: Group;
  _scene: Scenegraph;
  constructor(scene: Scenegraph) {
    this._scene = scene;
    const height = Math.min(scene._gantt.tableNoFrameHeight, scene._gantt.drawHeight);
    this.group = new Group({
      x: 0,
      y: scene._gantt.headerRowHeight * scene._gantt.headerLevel,
      width: scene._gantt.tableNoFrameWidth,
      height: height - scene._gantt.headerRowHeight * scene._gantt.headerLevel,
      pickable: false,
      clip: true
    });
    this.group.name = 'task-bar-container';
    this.barContainer = new Group({
      x: 0,
      y: 0,
      width: this._scene._gantt.getAllColsWidth(),
      height: this._scene._gantt.getAllGridHeight(),
      pickable: false,
      clip: true
    });
    this.group.appendChild(this.barContainer);
    this.initBarIcons();
  }
  initBarIcons() {
    // const target = this._scene._gantt.stateManager.hoverTaskBar.target;

    // const barGroup = new Group({
    //   x: target.attribute.x,
    //   y: target.attribute.y,
    //   width: target.attribute.width,
    //   height: target.attribute.height,
    //   cornerRadius: target.attribute.cornerRadius,
    //   clip: true,
    //   cursor: 'grab'
    // });
    const barGroup = new Group({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      cornerRadius: 2,
      clip: true,
      cursor: 'grab'
    });
    barGroup.name = 'task-bar-hover-shadow';
    this.barContainer.appendChild(barGroup);
    // 创建整个任务条rect
    const icon = new Icon({
      x: 0,
      y: 0, //this._scene._gantt.rowHeight - taskbarHeight) / 2,
      width: 20,
      height: 20,
      image:
        '<svg t="1721304233835" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7006" width="200" height="200"><path d="M320 864c-17.67 0-32-14.31-32-32V192c0-17.67 14.33-32 32-32s32 14.33 32 32v640c0 17.69-14.33 32-32 32zM704 864c-17.69 0-32-14.31-32-32V192c0-17.67 14.31-32 32-32s32 14.33 32 32v640c0 17.69-14.31 32-32 32z" fill="#ea9518" p-id="7007"></path></svg>',
      pickable: true
    });
    icon.name = 'task-bar-resize-icon';
    barGroup.appendChild(icon);
  }
  setX(x: number) {
    this.barContainer.setAttribute('x', x);
  }
  setY(y: number) {
    this.barContainer.setAttribute('y', y);
  }
}
