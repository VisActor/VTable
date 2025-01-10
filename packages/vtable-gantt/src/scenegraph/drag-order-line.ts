import { createDateAtMidnight } from '../tools/util';
import type { IMarkLine } from '../ts-types';
import type { Scenegraph } from './scenegraph';
import type { Line } from '@visactor/vtable/es/vrender';
import { Group, createLine } from '@visactor/vtable/es/vrender';

export class DragOrderLine {
  _scene: Scenegraph;

  dragLineContainer: Group;
  dragLine: Line;
  constructor(scene: Scenegraph) {
    this._scene = scene;
    // this.width = scene._gantt.tableNoFrameWidth;
    this.dragLineContainer = new Group({
      x: 0,
      y: 0,
      width: scene._gantt.tableNoFrameWidth,
      height: Math.min(scene._gantt.tableNoFrameHeight, scene._gantt.drawHeight),
      pickable: false,
      clip: true,
      visible: false
    });
    this.dragLineContainer.name = 'drag-order-line-container';
    scene.ganttGroup.addChild(this.dragLineContainer);
    this.initDragLine();
  }
  initDragLine() {
    if (this._scene._gantt.taskListTableInstance) {
      const style = this._scene._gantt.taskListTableInstance.theme.dragHeaderSplitLine;
      // 创建拖拽位置高亮线条
      const lineObj = createLine({
        pickable: false,
        stroke: style.lineColor,
        lineWidth: style.lineWidth,
        // lineDash: style.lineDash,
        points: []
      });
      this.dragLine = lineObj;
      this.dragLineContainer.appendChild(lineObj);
    }
  }

  /** 重新场景场景树节点 */
  showDragLine(y: number) {
    this.dragLineContainer.showAll();
    this.dragLine.setAttribute('points', [
      {
        x: 0,
        y: y
      },
      {
        x: this._scene._gantt.tableNoFrameWidth,
        y: y
      }
    ]);
  }
  hideDragLine() {
    this.dragLineContainer.hideAll();
  }
}
