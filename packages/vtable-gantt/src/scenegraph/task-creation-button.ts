import { createLine, Group } from '@visactor/vtable/es/vrender';
import type { IRect, IGroupGraphicAttribute, IRectGraphicAttribute, ILine } from '@visactor/vtable/es/vrender';

import type { Scenegraph } from './scenegraph';

export class TaskCreationButton {
  _scene: Scenegraph;
  group: Group;
  lineVertical: ILine;
  lineHorizontal: ILine;
  constructor(scene: Scenegraph) {
    this._scene = scene;
    this.createAddButton();
  }
  createAddButton() {
    if (this._scene._gantt.parsedOptions.taskBarCreationCustomLayout) {
      this.group = new Group({
        x: 0,
        y: 0,
        width: 100,
        height: 100
      });
    } else {
      this.group = new Group({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        lineDash: this._scene._gantt.parsedOptions.taskBarCreationButtonStyle.lineDash,
        cursor: 'pointer',
        lineWidth: this._scene._gantt.parsedOptions.taskBarCreationButtonStyle.lineWidth,
        stroke: this._scene._gantt.parsedOptions.taskBarCreationButtonStyle.lineColor,
        cornerRadius: this._scene._gantt.parsedOptions.taskBarCreationButtonStyle.cornerRadius ?? 0,
        fill: this._scene._gantt.parsedOptions.taskBarCreationButtonStyle.backgroundColor
      });

      this.lineVertical = createLine({
        pickable: false,
        stroke: this._scene._gantt.parsedOptions.taskBarCreationButtonStyle.lineColor,
        lineWidth: this._scene._gantt.parsedOptions.taskBarCreationButtonStyle.lineWidth,
        points: [
          { x: 50, y: 0 },
          { x: 50, y: 100 }
        ]
      });
      this.group.appendChild(this.lineVertical);
      this.lineHorizontal = createLine({
        pickable: false,
        stroke: this._scene._gantt.parsedOptions.taskBarCreationButtonStyle.lineColor,
        lineWidth: this._scene._gantt.parsedOptions.taskBarCreationButtonStyle.lineWidth,
        points: [
          { x: 0, y: 50 },
          { x: 100, y: 50 }
        ]
      });
      this.group.appendChild(this.lineHorizontal);
    }
    this.group.name = 'task-creation-button';
    this._scene.taskBar.group.addChild(this.group);
  }
  show(x: number, y: number, width: number, height: number) {
    if (this._scene._gantt.parsedOptions.taskBarCreationCustomLayout) {
      this.group.appendChild(
        this._scene._gantt.parsedOptions.taskBarCreationCustomLayout({
          width,
          height,
          ganttInstance: this._scene._gantt
        }).rootContainer
      );
    } else {
      const lineSize = Math.min(width, height) / 6;
      this.lineHorizontal.setAttribute('points', [
        { x: (width - lineSize * 4) / 2, y: height / 2 },
        { x: (width - lineSize * 4) / 2 + lineSize * 4, y: height / 2 }
      ]);

      this.lineVertical.setAttribute('points', [
        { x: width / 2, y: (height - lineSize * 4) / 2 },
        { x: width / 2, y: (height - lineSize * 4) / 2 + lineSize * 4 }
      ]);
    }
    this.group.setAttribute('x', x);
    this.group.setAttribute('y', y);
    this.group.setAttribute('width', width);
    this.group.setAttribute('height', height);
    this.group.setAttribute('visibleAll', true);
  }
  hide() {
    this.group.setAttribute('visibleAll', false);
    if (this._scene._gantt.parsedOptions.taskBarCreationCustomLayout) {
      this.group.removeAllChild();
    }
  }
}
