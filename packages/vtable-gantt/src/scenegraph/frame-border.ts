import { createRect } from '@visactor/vtable/es/vrender';
import type { IRect, IGroupGraphicAttribute, IRectGraphicAttribute } from '@visactor/vtable/es/vrender';
import { toBoxArray } from '../gantt-helper';

import type { Scenegraph } from './scenegraph';

/**
 * 甘特图外边框组件
 */
export class FrameBorder {
  _scene: Scenegraph;
  border: IRect;

  /**
   * 构造函数，初始化外边框组件。
   * @param scene 所属的 Scenegraph 实例。
   */
  constructor(scene: Scenegraph) {
    this._scene = scene;
    this.createFrameBorder();
  }

  /**
   * 创建甘特图整体外边框的图形基元。
   */
  createFrameBorder() {
    const group = this._scene.ganttGroup;
    const frameStyle = this._scene._gantt.parsedOptions.outerFrameStyle;
    if (!frameStyle) return;
    const { cornerRadius, borderColor, borderLineWidth, borderLineDash } = frameStyle;
    const groupAttributes: IGroupGraphicAttribute = {};
    const rectAttributes: IRectGraphicAttribute = { pickable: false };

    // 归一化 borderLineWidth 并设置 strokeArrayWidth
    const lineWidths = toBoxArray(borderLineWidth ?? 0);
    const strokeArrayWidth = [lineWidths[0], lineWidths[1], lineWidths[2], 0]; // 左边线宽为0

    rectAttributes.stroke = true;
    rectAttributes.fill = false;
    rectAttributes.stroke = borderColor;
    rectAttributes.lineWidth = Math.max(...strokeArrayWidth); // 设置主线宽
    (rectAttributes as any).strokeArrayWidth = strokeArrayWidth; // 设置四方向独立线宽
    borderLineDash && (rectAttributes.lineDash = borderLineDash as number[]);
    rectAttributes.lineCap = 'butt';

    // 计算 IRect 的位置和尺寸
    rectAttributes.x = 0; // x 偏移
    rectAttributes.y = strokeArrayWidth[0] / 2; // y 偏移顶部线宽一半

    const verticalSplitLineWidth = this._scene._gantt.parsedOptions.verticalSplitLine?.lineWidth ?? 0;
    rectAttributes.width = group.attribute.width + lineWidths[1] / 2 + verticalSplitLineWidth;
    rectAttributes.height = group.attribute.height + lineWidths[0] / 2 + lineWidths[2] / 2;

    // 设置圆角属性
    if (cornerRadius) {
        const radius = Array.isArray(cornerRadius) ? cornerRadius : [cornerRadius, cornerRadius, cornerRadius, cornerRadius];
        if (this._scene._gantt.taskListTableInstance) {
            rectAttributes.cornerRadius = [0, radius[1] ?? 0, radius[2] ?? 0, 0]; // 有任务列表时只设右上右下
            groupAttributes.cornerRadius = [0, radius[1] ?? 0, radius[2] ?? 0, 0];
        } else {
            rectAttributes.cornerRadius = radius as [number, number, number, number]; // 无任务列表时设全部
            groupAttributes.cornerRadius = radius as [number, number, number, number];
        }
    }

    group.setAttributes(groupAttributes); // 应用组属性

    if (rectAttributes.stroke) {
      // 创建并添加 IRect 图形基元到场景图
      const borderRect = createRect(rectAttributes);
      borderRect.name = 'border-rect';
      group.parent.insertAfter(borderRect, group);
      this.border = borderRect;
      (group as any).border = borderRect;
    }
  }

  /**
   * 刷新边框，移除旧边框并重新创建。
   */
  refresh() {
    if (this.border && this.border.parent) {
      this.border.parent.removeChild(this.border);
    }
    this.createFrameBorder();
  }

  /**
   * 更新边框尺寸和位置。
   * 在甘特图布局变化后调用，更新现有图形基元属性。
   */
  resize() {
    // 获取最新配置并计算尺寸
    const { borderLineWidth } = this._scene._gantt.parsedOptions.outerFrameStyle;
    const lineWidths = toBoxArray(borderLineWidth ?? 0);
    const strokeArrayWidth = [lineWidths[0], lineWidths[1], lineWidths[2], 0];
    const verticalSplitLineWidth = this._scene._gantt.parsedOptions.verticalSplitLine?.lineWidth ?? 0;

    // 更新边框矩形属性 (线宽, 位置, 尺寸)
    this.border?.setAttributes({
      lineWidth: Math.max(...strokeArrayWidth),
      x: 0,
      y: strokeArrayWidth[0] / 2,
      width: this._scene.ganttGroup.attribute.width + lineWidths[1] / 2 + verticalSplitLineWidth,
      height: this._scene.ganttGroup.attribute.height + lineWidths[0] / 2 + lineWidths[2] / 2
    });
    // 更新 strokeArrayWidth 属性
    (this.border as any).strokeArrayWidth = strokeArrayWidth;
  }
}