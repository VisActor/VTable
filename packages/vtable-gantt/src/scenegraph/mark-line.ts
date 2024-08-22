import { createDateAtMidnight } from '../tools/util';
import type { IMarkLine } from '../ts-types';
import type { Scenegraph } from './scenegraph';
import { Group, createLine } from '@visactor/vtable/es/vrender';

export class MarkLine {
  _scene: Scenegraph;
  group: Group;
  markLine: IMarkLine[];
  markLIneContainer: Group;
  markLineContainerWidth: number = 20;
  height: number;
  constructor(scene: Scenegraph) {
    this._scene = scene;
    this.markLine = scene._gantt.parsedOptions.markLine;
    this.height =
      Math.min(scene._gantt.tableNoFrameHeight, scene._gantt.drawHeight) - scene._gantt.getAllHeaderRowsHeight();
    this.group = new Group({
      x: 0,
      y: scene._gantt.getAllHeaderRowsHeight(),
      width: scene._gantt.tableNoFrameWidth,
      height: this.height,
      pickable: false,
      clip: true
    });
    this.group.name = 'mark-line-container';
    scene.tableGroup.addChild(this.group);

    this.markLIneContainer = new Group({
      x: 0,
      y: 0,
      width: this._scene._gantt._getAllColsWidth(),
      height: this.height,
      pickable: false,
      clip: true
    });
    this.group.appendChild(this.markLIneContainer);
    this.initMarkLines();
  }
  initMarkLines() {
    this.markLine.forEach(line => {
      const style = line.style;
      const date = createDateAtMidnight(line.date);
      const minDate = createDateAtMidnight(this._scene._gantt.parsedOptions.minDate);
      const dateX =
        this._scene._gantt.parsedOptions.colWidthPerDay *
        (Math.ceil(Math.abs(date.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) +
          (line.position === 'right' ? 1 : line.position === 'middle' ? 0.5 : 0));
      const markLineGroup = new Group({
        pickable: false,
        x: dateX - this.markLineContainerWidth / 2,
        y: 0,
        width: this.markLineContainerWidth,
        height: this.height
      });
      markLineGroup.name = 'mark-line';
      this.markLIneContainer.appendChild(markLineGroup);
      // 创建整个任务条rect
      const lineObj = createLine({
        pickable: false,
        stroke: style.lineColor,
        lineWidth: style.lineWidth,
        lineDash: style.lineDash,
        points: [
          { x: this.markLineContainerWidth / 2, y: 0 },
          { x: this.markLineContainerWidth / 2, y: this.height }
        ]
      });
      markLineGroup.appendChild(lineObj);
    });
  }

  /** 重新场景场景树节点 */
  refresh() {
    this.height =
      Math.min(this._scene._gantt.tableNoFrameHeight, this._scene._gantt.drawHeight) -
      this._scene._gantt.getAllHeaderRowsHeight();
    this.markLIneContainer.removeAllChild();
    this.group.setAttribute('height', this.height);
    this.markLIneContainer.setAttribute('height', this.height);
    this.initMarkLines();
  }
  setX(x: number) {
    this.markLIneContainer.setAttribute('x', x);
  }
}
