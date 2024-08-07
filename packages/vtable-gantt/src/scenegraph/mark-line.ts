import type { IMarkLine } from '../ts-types';
import type { Scenegraph } from './scenegraph';
import { VRender } from '@visactor/vtable';
export class MarkLine {
  _scene: Scenegraph;
  group: VRender.Group;
  markLine: IMarkLine[];
  markLIneContainer: VRender.Group;
  markLineContainerWidth: number = 20;
  height: number;
  constructor(scene: Scenegraph) {
    this._scene = scene;
    this.markLine = scene._gantt.parsedOptions.markLine;
    this.height =
      Math.min(scene._gantt.tableNoFrameHeight, scene._gantt.drawHeight) -
      scene._gantt.parsedOptions.headerRowHeight * scene._gantt.headerLevel;
    this.group = new VRender.Group({
      x: 0,
      y: scene._gantt.parsedOptions.headerRowHeight * scene._gantt.headerLevel,
      width: scene._gantt.tableNoFrameWidth,
      height: this.height,
      pickable: false,
      clip: true
    });
    this.group.name = 'mark-line-container';
    scene.tableGroup.addChild(this.group);

    this.markLIneContainer = new VRender.Group({
      x: 0,
      y: 0,
      width: this._scene._gantt.getAllColsWidth(),
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
      const date = new Date(line.date);
      const minDate = new Date(this._scene._gantt.parsedOptions.minDate);
      const dateX =
        this._scene._gantt.parsedOptions.colWidthPerDay *
        Math.ceil(Math.abs(date.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
      const markLineGroup = new VRender.Group({
        pickable: false,
        x: dateX - this.markLineContainerWidth / 2,
        y: 0,
        width: this.markLineContainerWidth,
        height: this.height
      });
      markLineGroup.name = 'mark-line';
      this.markLIneContainer.appendChild(markLineGroup);
      // 创建整个任务条rect
      const lineObj = VRender.createLine({
        pickable: false,
        stroke: style.lineColor,
        lineWidth: style.lineWidth,
        lineDash: style.lineDash,
        points: [
          { x: dateX, y: 0 },
          { x: dateX, y: this.height }
        ]
      });
      markLineGroup.appendChild(lineObj);
    });
  }

  /** 重新场景场景树节点 */
  refresh() {
    this.height =
      Math.min(this._scene._gantt.tableNoFrameHeight, this._scene._gantt.drawHeight) -
      this._scene._gantt.parsedOptions.headerRowHeight * this._scene._gantt.headerLevel;
    this.markLIneContainer.removeAllChild();
    this.group.setAttribute('height', this.height);
    this.markLIneContainer.setAttribute('height', this.height);
    this.initMarkLines();
  }
  setX(x: number) {
    this.markLIneContainer.setAttribute('x', x);
  }
}
