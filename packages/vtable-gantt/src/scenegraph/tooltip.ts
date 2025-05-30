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
      content: '',
      contentStyle: {
        fill: '#fff'
      },
      visible: false,
      panel: {
        background: '#14161c',
        cornerRadius: 4
      }
    } as any);
    scene.ganttGroup.addChild(this.group);
  }
  show(graphic: IGraphic<Partial<IRectGraphicAttribute>>) {
    const options = this._scene._gantt.parsedOptions.markLineCreateOptions?.markLineCreationHoverToolTip || {};
    const matrix = graphic.globalTransMatrix;
    const targetWidth = graphic.attribute.width;
    const targetHeight = graphic.attribute.height;
    let x;
    let y;
    const position = options.position || 'top';
    if (position === 'top') {
      x = matrix.e + targetWidth / 2 - 2;
      y = matrix.f;
    } else if (position === 'bottom') {
      x = matrix.e + targetWidth / 2 - 2;
      y = matrix.f + targetHeight;
    }
    const contentStyle = options.style?.contentStyle || { fill: '#fff' };
    const pannelStyle = options.style?.panelStyle || { background: '#14161c', cornerRadius: 4 };
    this.group.setAttributes({
      content: options.tipContent,
      position,
      visibleAll: true,
      visible: true,
      contentStyle,
      panel: {
        ...pannelStyle,
        visible: true
      },
      x,
      y
    } as any);
  }

  hide() {
    this.group.setAttributes({
      visibleAll: false,
      visible: false
    });
  }
}
