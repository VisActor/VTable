import { createLine, Group } from '@visactor/vtable/es/vrender';
import type { IRect, IGroupGraphicAttribute, IRectGraphicAttribute } from '@visactor/vtable/es/vrender';

import type { Scenegraph } from './scenegraph';

export class AddTaskButton {
  _scene: Scenegraph;
  group: Group;
  constructor(scene: Scenegraph) {
    this._scene = scene;
    this.createAddButton();
  }
  createAddButton() {
    this.group = new Group({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      clip: true,
      cursor: 'pointer',

      cornerRadius:
        this._scene._gantt.parsedOptions.taskBarHoverStyle.cornerRadius ??
        this._scene._gantt.parsedOptions.taskBarStyle.cornerRadius ??
        0,
      fill: this._scene._gantt.parsedOptions.taskBarHoverStyle.barOverlayColor
    });
    this.group.name = 'add-task-button-group';
    this._scene.tableGroup.addChild(this.group);
    const lineObj = createLine({
      pickable: false,
      stroke: 'red',
      lineWidth: 2,
      points: [
        { x: 50, y: 0 },
        { x: 50, y: 100 }
      ]
    });
    this.group.appendChild(lineObj);
  }
  show(x: number, y: number, width: number, height: number) {
    this.group.setAttribute('x', x);
    this.group.setAttribute('y', y);
    this.group.setAttribute('width', width);
    this.group.setAttribute('height', height);
    this.group.setAttribute('visibleAll', true);
  }
  hide() {
    this.group.setAttribute('visibleAll', false);
  }
}
