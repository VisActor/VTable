import type { IMarkLine } from '../ts-types';
import type { Scenegraph } from './scenegraph';
import { Group, createLine } from '@visactor/vrender-core';
export class MarkLine {
  _scene: Scenegraph;
  group: Group;
  markLine: IMarkLine[];
  markLIneContainer: Group;
  markLineContainerWidth: 20;
  constructor(scene: Scenegraph) {
    this._scene = scene;
    this.markLine = scene._gantt.markLine;
    const height =
      Math.min(scene._gantt.tableNoFrameHeight, scene._gantt.drawHeight) -
      scene._gantt.headerRowHeight * scene._gantt.headerLevel;
    this.group = new Group({
      x: 0,
      y: scene._gantt.headerRowHeight * scene._gantt.headerLevel,
      width: scene._gantt.tableNoFrameWidth,
      height,
      pickable: false,
      clip: true
    });

    this.group.name = 'mark-line-container';
    this.markLIneContainer = new Group({
      x: 0,
      y: 0,
      width: this._scene._gantt.getAllColsWidth(),
      height,
      pickable: false,
      clip: true
    });
    this.group.appendChild(this.markLIneContainer);
    this.initMarkLines();
  }
  initMarkLines() {
    const height =
      Math.min(this._scene._gantt.tableNoFrameHeight, this._scene._gantt.drawHeight) -
      this._scene._gantt.headerRowHeight * this._scene._gantt.headerLevel;
    this.markLine.forEach(line => {
      const style = line.style;
      const date = new Date(line.date);
      const minDate = new Date(this._scene._gantt.minDate);
      const dateX =
        this._scene._gantt.colWidthPerDay *
        Math.ceil(Math.abs(date.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
      const markLineGroup = new Group({
        x: dateX - this.markLineContainerWidth / 2,
        y: 0,
        width: this.markLineContainerWidth,
        height
      });
      markLineGroup.name = 'mark-line';
      this.markLIneContainer.appendChild(markLineGroup);
      // 创建整个任务条rect
      const lineObj = createLine({
        pickable: true,
        stroke: style.lineColor,
        lineWidth: style.lineWidth,
        lineDash: style.lineDash,
        points: [
          { x: dateX, y: 0 },
          { x: dateX, y: height }
        ]
      });
      markLineGroup.appendChild(lineObj);
    });
  }
  setX(x: number) {
    this.markLIneContainer.setAttribute('x', x);
  }
}
