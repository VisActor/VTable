import { createLine, PopTip } from '@visactor/vtable/es/vrender';
import type { PopTipAttributes, IRectGraphicAttribute, IGraphic, Group } from '@visactor/vtable/es/vrender';

import type { Scenegraph } from './scenegraph';

export class ToolTip {
  _scene: Scenegraph;
  group: Group;
  constructor(scene: Scenegraph) {
    this._scene = scene;
    this.group = new PopTip({
      title: 'pop测试',
      position: 'top',
      // content: '我是content',
      // padding: 16,
      visible: false,
      panel: {
        visible: true,
        background: 'red'
      }
      // stroke: this._scene._gantt.parsedOptions.taskBarCreationButtonStyle.lineColor,
      // cornerRadius: this._scene._gantt.parsedOptions.taskBarCreationButtonStyle.cornerRadius ?? 0,
      // fill: this._scene._gantt.parsedOptions.taskBarCreationButtonStyle.backgroundColor
    });
    scene.ganttGroup.addChild(this.group);
  }
  // options: PopTipAttributes
  show(graphic: IGraphic<Partial<IRectGraphicAttribute>>) {
    const matrix = graphic.globalTransMatrix;
    const targetWidth = graphic.attribute.width;
    this.group.setAttributes({
      visibleAll: true,
      visible: true,
      pickable: false,
      childrenPickable: false,
      x: matrix.e + targetWidth / 2,
      y: matrix.f
    });
  }

  hide() {
    this.group.setAttributes({
      visibleAll: false,
      visible: false
    });
  }
}
