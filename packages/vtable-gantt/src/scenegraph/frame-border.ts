import { createRect } from '@visactor/vtable/es/vrender';
import type { IRect, IGroupGraphicAttribute, IRectGraphicAttribute } from '@visactor/vtable/es/vrender';

import type { Scenegraph } from './scenegraph';

export class FrameBorder {
  _scene: Scenegraph;
  border: IRect;
  constructor(scene: Scenegraph) {
    this._scene = scene;
    this.createFrameBorder();
  }
  createFrameBorder() {
    const justForXYPosition = false;
    const group = this._scene.ganttGroup;
    const frameStyle = this._scene._gantt.parsedOptions.outerFrameStyle;
    // const strokeArray = [true, true, true, false];
    if (!frameStyle) {
      return;
    }
    const { cornerRadius, borderColor, borderLineWidth, borderLineDash } = frameStyle;

    // const hasShadow = false;
    const groupAttributes: IGroupGraphicAttribute = {};
    const rectAttributes: IRectGraphicAttribute = {
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

    if (cornerRadius) {
      if (this._scene._gantt.taskListTableInstance) {
        rectAttributes.cornerRadius = [
          0,
          this._scene._gantt.parsedOptions.outerFrameStyle.cornerRadius ?? 0,
          this._scene._gantt.parsedOptions.outerFrameStyle.cornerRadius ?? 0,
          0
        ];
        groupAttributes.cornerRadius = [
          0,
          this._scene._gantt.parsedOptions.outerFrameStyle.cornerRadius ?? 0,
          this._scene._gantt.parsedOptions.outerFrameStyle.cornerRadius ?? 0,
          0
        ];
      } else {
        rectAttributes.cornerRadius = this._scene._gantt.parsedOptions.outerFrameStyle.cornerRadius ?? 0;
        groupAttributes.cornerRadius = this._scene._gantt.parsedOptions.outerFrameStyle.cornerRadius ?? 0;
      }
    }

    group.setAttributes(groupAttributes);

    if (justForXYPosition) {
      return;
    }

    if (rectAttributes.stroke) {
      rectAttributes.x = this._scene._gantt.taskListTableInstance ? -borderLineWidth / 2 : borderLineWidth / 2; //为了可以绘制完整矩形 且左侧的边框不出现在group中
      rectAttributes.y = borderLineWidth / 2;
      rectAttributes.pickable = false;

      rectAttributes.width =
        group.attribute.width +
        borderLineWidth +
        (this._scene._gantt.taskListTableInstance ? this._scene._gantt.parsedOptions.verticalSplitLine.lineWidth : 0);
      rectAttributes.height = group.attribute.height + borderLineWidth / 2 + borderLineWidth / 2;
      const borderRect = createRect(rectAttributes);
      borderRect.name = 'border-rect';
      group.parent.insertAfter(borderRect, group);
      (group as any).border = borderRect;
      this.border = borderRect;
    }
  }
  refresh() {
    if (this.border && this.border.parent) {
      this.border.parent.removeChild(this.border);
    }
    this.createFrameBorder();
  }
  resize() {
    const { cornerRadius, borderColor, borderLineWidth, borderLineDash } =
      this._scene._gantt.parsedOptions.outerFrameStyle;
    this.border?.setAttributes({
      // x: -borderLineWidth / 2,
      // y: borderLineWidth / 2,
      width:
        this._scene.ganttGroup.attribute.width +
        borderLineWidth +
        (this._scene._gantt.taskListTableInstance ? this._scene._gantt.parsedOptions.verticalSplitLine.lineWidth : 0),
      // this._scene.tableGroup.attribute.width +
      // this.border.attribute.lineWidth +
      // this._scene._gantt.parsedOptions.verticalSplitLine.lineWidth,
      height: this._scene._gantt.drawHeight + borderLineWidth
      // height: this._scene.tableGroup.attribute.height + this.border.attribute.lineWidth
    });
  }
}
