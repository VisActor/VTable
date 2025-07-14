import { createRect } from '@visactor/vtable/es/vrender';
import type { IRect, IGroupGraphicAttribute, IRectGraphicAttribute } from '@visactor/vtable/es/vrender';
import { toBoxArray } from '@visactor/vtable';

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
    // 根据是否有任务列表决定是否显示左边框
    const strokeArrayWidth = [
      lineWidths[0],
      lineWidths[1],
      lineWidths[2],
      this._scene._gantt.taskListTableInstance ? 0 : lineWidths[3] // 有任务列表时左边为0，无任务列表时使用配置值
    ];

    rectAttributes.stroke = true;
    rectAttributes.fill = false;
    rectAttributes.stroke = borderColor;
    rectAttributes.lineWidth = Math.max(...strokeArrayWidth); // 设置主线宽
    (rectAttributes as any).strokeArrayWidth = strokeArrayWidth; // 设置四方向独立线宽
    borderLineDash && (rectAttributes.lineDash = borderLineDash as number[]);
    rectAttributes.lineCap = 'butt';

    // 计算 IRect 的位置和尺寸
    const hasTaskList = !!this._scene._gantt.taskListTableInstance;

    // 根据是否有任务列表调整位置，有任务列表时向左偏移以隐藏左边框
    rectAttributes.x = hasTaskList ? 0 : strokeArrayWidth[3] / 2;
    rectAttributes.y = strokeArrayWidth[0] / 2;

    const verticalSplitLineWidth = this._scene._gantt.parsedOptions.verticalSplitLine?.lineWidth ?? 0;
    rectAttributes.width =
      group.attribute.width +
      strokeArrayWidth[3] / 2 +
      strokeArrayWidth[1] / 2 +
      (hasTaskList ? verticalSplitLineWidth : 0);
    rectAttributes.height = group.attribute.height + strokeArrayWidth[0] / 2 + strokeArrayWidth[2] / 2;

    // 设置圆角属性
    if (cornerRadius) {
      const radius = Array.isArray(cornerRadius)
        ? cornerRadius
        : [cornerRadius, cornerRadius, cornerRadius, cornerRadius];
      if (this._scene._gantt.taskListTableInstance) {
        rectAttributes.cornerRadius = [0, radius[1] ?? 0, radius[2] ?? 0, 0];
        groupAttributes.cornerRadius = [0, radius[1] ?? 0, radius[2] ?? 0, 0];
      } else {
        rectAttributes.cornerRadius = radius as [number, number, number, number];
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
    const strokeArrayWidth = [
      lineWidths[0],
      lineWidths[1],
      lineWidths[2],
      this._scene._gantt.taskListTableInstance ? 0 : lineWidths[3] // 有任务列表时左边为0，无任务列表时使用配置值
    ];
    const verticalSplitLineWidth = this._scene._gantt.parsedOptions.verticalSplitLine?.lineWidth ?? 0;

    // 更新边框矩形属性 (线宽, 位置, 尺寸)
    const hasTaskList = !!this._scene._gantt.taskListTableInstance;

    this.border?.setAttributes({
      // 根据是否有任务列表调整位置
      x: hasTaskList ? 0 : strokeArrayWidth[3] / 2,
      y: strokeArrayWidth[0] / 2,
      width:
        this._scene.ganttGroup.attribute.width +
        strokeArrayWidth[3] / 2 +
        strokeArrayWidth[1] / 2 +
        (hasTaskList ? verticalSplitLineWidth : 0),
      height: this._scene.ganttGroup.attribute.height + strokeArrayWidth[0] / 2 + strokeArrayWidth[2] / 2
    });
    // 更新 strokeArrayWidth 属性
    (this.border as any).strokeArrayWidth = strokeArrayWidth;
  }
}