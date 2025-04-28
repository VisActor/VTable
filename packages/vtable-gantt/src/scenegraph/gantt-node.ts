import type { IRect, IText, IGroupGraphicAttribute } from '@visactor/vtable/es/vrender';
import { Group } from '@visactor/vtable/es/vrender';
import { getTextPos } from '../gantt-helper';
import { toBoxArray } from '../tools/util';
import { isValid } from '@visactor/vutils';

export class GanttTaskBarNode extends Group {
  clipGroupBox: Group;
  barRect?: IRect;
  progressRect?: IRect;
  textLabel?: IText;
  declare name: string;
  task_index: number;
  sub_task_index?: number;
  record?: any;
  gantt: any;
  constructor(attrs: IGroupGraphicAttribute) {
    super(attrs);
  }

  /**
   * 更新文本位置
   * orient: 直接将文本显示在指定方位位置
   * orientHandleWithOverflow: 只有当文本溢出时才在指定方位显示，当配置了orient时此配置无效
   */
  updateTextPosition() {
    if (!this.textLabel || !this.barRect) {
      return;
    }

    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) {
      return;
    }

    const fontSize = this.textLabel.attribute.fontSize || 12;
    ctx.font = `${fontSize.toString()}px ${this.textLabel.attribute.fontFamily || 'Arial'}`;

    const text = String(this.textLabel.attribute.text || '');
    const textWidth = ctx.measureText(text).width;

    const labelStyle = this.gantt?.parsedOptions?.taskBarLabelStyle || {};
    const padding = labelStyle?.padding
      ? Array.isArray(labelStyle.padding)
        ? labelStyle.padding[3]
        : labelStyle.padding
      : 8;

    const barWidth = this.barRect.attribute.width;
    const barHeight = this.barRect.attribute.height;

    // 计算文本适应性
    const textFitsInBar = textWidth + padding * 2 <= barWidth;

    // 获取默认文本位置和样式
    const { textAlign = 'left', textBaseline = 'middle', textOverflow, color } = labelStyle;
    const defaultPosition = getTextPos(toBoxArray(padding), textAlign, textBaseline, barWidth, barHeight);

    // 确定最终的文本方位
    const textPosition =
      labelStyle.orient ||
      (!textFitsInBar && labelStyle.orientHandleWithOverflow ? labelStyle.orientHandleWithOverflow : null);

    // 根据原始逻辑设置默认文本位置和属性
    this.textLabel.setAttribute('x', defaultPosition.x);
    this.textLabel.setAttribute('y', defaultPosition.y);
    this.textLabel.setAttribute('textAlign', textAlign);
    this.textLabel.setAttribute('textBaseline', textBaseline);
    this.textLabel.setAttribute('fill', color || '#333333');
    this.textLabel.setAttribute('maxLineWidth', barWidth - padding * 2);
    this.textLabel.setAttribute(
      'ellipsis',
      textOverflow === 'clip'
        ? ''
        : textOverflow === 'ellipsis'
        ? '...'
        : isValid(textOverflow)
        ? textOverflow
        : undefined
    );

    // 根据orient配置决定文本位置
    if (textPosition) {
      // 文本显示在任务条外部指定方位
      // 确保文本从clipGroupBox移到主容器
      this.textLabel.parent?.removeChild(this.textLabel);
      this.appendChild(this.textLabel);

      const outsideFill = labelStyle.outsideColor || '#333333';
      this.textLabel.setAttribute('fill', outsideFill);
      this.textLabel.setAttribute('ellipsis', undefined);
      this.textLabel.setAttribute('maxLineWidth', undefined);
      // 确保外部文本显示在最上层
      this.textLabel.setAttribute('zIndex', 10000);
      this.setAttribute('zIndex', 10000);

      // 根据方位设置文本位置和对齐方式
      switch (textPosition) {
        case 'left':
          this.textLabel.setAttribute('x', -padding);
          this.textLabel.setAttribute('y', barHeight / 2);
          this.textLabel.setAttribute('textAlign', 'right');
          this.textLabel.setAttribute('textBaseline', 'middle');
          break;
        case 'right':
          this.textLabel.setAttribute('x', barWidth + padding);
          this.textLabel.setAttribute('y', barHeight / 2);
          this.textLabel.setAttribute('textAlign', 'left');
          this.textLabel.setAttribute('textBaseline', 'middle');
          break;
        case 'top':
          this.textLabel.setAttribute('x', barWidth / 2);
          this.textLabel.setAttribute('y', -padding);
          this.textLabel.setAttribute('textAlign', 'center');
          this.textLabel.setAttribute('textBaseline', 'bottom');
          break;
        case 'bottom':
          this.textLabel.setAttribute('x', barWidth / 2);
          this.textLabel.setAttribute('y', barHeight + padding);
          this.textLabel.setAttribute('textAlign', 'center');
          this.textLabel.setAttribute('textBaseline', 'top');
          break;
      }
    } else {
      // 确保文本在clipGroupBox内
      this.textLabel.parent?.removeChild(this.textLabel);
      this.clipGroupBox?.appendChild(this.textLabel);

      const textAlign = labelStyle.textAlign || 'left';
      const textBaseline = labelStyle.textBaseline || 'middle';

      this.textLabel.setAttribute('textAlign', textAlign);
      this.textLabel.setAttribute('textBaseline', textBaseline);
      this.textLabel.setAttribute('fill', labelStyle.color || '#333333');

      this.textLabel.setAttribute('x', defaultPosition.x);
      this.textLabel.setAttribute('y', defaultPosition.y);
      this.textLabel.setAttribute('maxLineWidth', barWidth - padding * 2);
      this.textLabel.setAttribute(
        'ellipsis',
        textOverflow === 'clip'
          ? ''
          : textOverflow === 'ellipsis'
          ? '...'
          : isValid(textOverflow)
          ? textOverflow
          : undefined
      );
    }

    this.textLabel.setAttribute('visible', true);
  }
}
