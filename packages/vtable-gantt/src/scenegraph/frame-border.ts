import { VRender } from '@visactor/vtable';

import { isArray } from '@visactor/vutils';
import type { IFrameStyle } from '../ts-types';
import type { Gantt } from '../Gantt';
import type { Scenegraph } from './scenegraph';

export class FrameBorder {
  _scene: Scenegraph;
  border: VRender.IRect;
  constructor(scene: Scenegraph) {
    this._scene = scene;
    this.createFrameBorder();
  }
  createFrameBorder() {
    const justForXYPosition = false;
    const group = this._scene.tableGroup;
    const frameStyle = this._scene._gantt.parsedOptions.frameStyle;
    // const strokeArray = [true, true, true, false];
    if (!frameStyle) {
      return;
    }
    const { cornerRadius, borderColor, borderLineWidth, borderLineDash } = frameStyle;

    // const hasShadow = false;
    const groupAttributes: VRender.IGroupGraphicAttribute = {};
    const rectAttributes: VRender.IRectGraphicAttribute = {
      pickable: false
    };

    // 处理边框
    if (borderLineWidth) {
      rectAttributes.stroke = true;
      rectAttributes.fill = false;
      rectAttributes.stroke = borderColor; // getStroke(borderColor, strokeArray);
      rectAttributes.lineWidth = borderLineWidth as number;
      borderLineDash && (rectAttributes.lineDash = borderLineDash as number[]);
      rectAttributes.lineCap = 'butt';
    }

    // if (Array.isArray(borderLineWidth)) {
    //   (rectAttributes as any).strokeArrayWidth = getQuadProps(borderLineWidth);
    //   (rectAttributes as any).lineWidth = 1;
    // }

    if (cornerRadius) {
      rectAttributes.cornerRadius = [0, 10, 10, 0];
      groupAttributes.cornerRadius = [0, 10, 10, 0];
    }

    // const borderTop = (rectAttributes as any).strokeArrayWidth
    //   ? (rectAttributes as any).strokeArrayWidth[0]
    //   : (rectAttributes.lineWidth as number) ?? 0;
    // const borderRight = (rectAttributes as any).strokeArrayWidth
    //   ? (rectAttributes as any).strokeArrayWidth[1]
    //   : (rectAttributes.lineWidth as number) ?? 0;
    // const borderBottom = (rectAttributes as any).strokeArrayWidth
    //   ? (rectAttributes as any).strokeArrayWidth[2]
    //   : (rectAttributes.lineWidth as number) ?? 0;
    // const borderLeft = (rectAttributes as any).strokeArrayWidth
    //   ? (rectAttributes as any).strokeArrayWidth[3]
    //   : (rectAttributes.lineWidth as number) ?? 0;
    group.setAttributes(groupAttributes);

    if (justForXYPosition) {
      return;
    }

    if (rectAttributes.stroke) {
      rectAttributes.x = -borderLineWidth / 2; //为了可以绘制完整矩形 且左侧的边框不出现在group中
      rectAttributes.y = borderLineWidth / 2;
      rectAttributes.pickable = false;

      rectAttributes.width = group.attribute.width + borderLineWidth / 2 + borderLineWidth / 2;
      rectAttributes.height = group.attribute.height + borderLineWidth / 2 + borderLineWidth / 2;
      const borderRect = VRender.createRect(rectAttributes);
      borderRect.name = 'border-rect';
      group.parent.insertAfter(borderRect, group);
      (group as any).border = borderRect;
      this.border = borderRect;
    }
  }
  resize() {
    const { cornerRadius, borderColor, borderLineWidth, borderLineDash } = this._scene._gantt.parsedOptions.frameStyle;
    this.border.setAttributes({
      // x: -borderLineWidth / 2,
      // y: borderLineWidth / 2,
      width: this._scene.tableGroup.attribute.width + this.border.attribute.lineWidth,
      height: this._scene.tableGroup.attribute.height + this.border.attribute.lineWidth
    });
  }
}
