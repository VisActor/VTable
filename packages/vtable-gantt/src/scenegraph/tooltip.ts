import { PopTip } from '@visactor/vtable/es/vrender';
import type { IRectGraphicAttribute, IGraphic, Group } from '@visactor/vtable/es/vrender';

import type { Scenegraph } from './scenegraph';

export class ToolTip {
  _scene: Scenegraph;
  group: Group;
  constructor(scene: Scenegraph) {
    this._scene = scene;
    this.group = new PopTip({
      position: 'top',
      content: '创建里程碑',
      contentStyle: {
        fill: '#fff'
      },
      visible: false,
      panel: {
        visible: true,
        background: '#14161c',
        cornerRadius: 4
      }
    });
    scene.ganttGroup.addChild(this.group);
  }
  show(graphic: IGraphic<Partial<IRectGraphicAttribute>>) {
    const matrix = graphic.globalTransMatrix;
    const targetWidth = graphic.attribute.width;
    this.group.setAttributes({
      visibleAll: true,
      visible: true,
      x: matrix.e + targetWidth / 2 - 2,
      y: matrix.f - 4
    });
  }

  hide() {
    this.group.setAttributes({
      visibleAll: false,
      visible: false
    });
  }
}
