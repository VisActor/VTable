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
    const options = this._scene._gantt.parsedOptions.markLineOptions;
    const matrix = graphic.globalTransMatrix;
    const targetWidth = graphic.attribute.width;
    const targetHeight = graphic.attribute.height;
    let x;
    let y;
    const position = options.toolTipOption?.position || 'top';
    if (position === 'top') {
      x = matrix.e + targetWidth / 2 - 2;
      y = matrix.f;
    } else if (position === 'bottom') {
      x = matrix.e + targetWidth / 2 - 2;
      y = matrix.f + targetHeight;
    }
    this.group.setAttributes({
      position,
      visibleAll: true,
      visible: true,
      x,
      y
    });
  }

  hide() {
    this.group.setAttributes({
      visibleAll: false,
      visible: false
    });
  }
}
