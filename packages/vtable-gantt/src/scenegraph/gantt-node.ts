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

  _lastWidth?: number;
  _lastHeight?: number;
  _lastX?: number;
  _lastY?: number;
  constructor(attrs: IGroupGraphicAttribute) {
    super(attrs);
    this._lastWidth = attrs.width;
    this._lastHeight = attrs.height;
    this._lastX = attrs.x;
    this._lastY = attrs.y;
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

    const textFitsInBar = textWidth + padding * 2 <= barWidth;

    const { textAlign = 'left', textBaseline = 'middle', textOverflow, color } = labelStyle;
    const defaultPosition = getTextPos(toBoxArray(padding), textAlign, textBaseline, barWidth, barHeight);

    const textPosition =
      labelStyle.orient ||
      (!textFitsInBar && labelStyle.orientHandleWithOverflow ? labelStyle.orientHandleWithOverflow : null);

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

    if (textPosition) {
      this.textLabel.parent?.removeChild(this.textLabel);
      this.appendChild(this.textLabel);

      const outsideFill = labelStyle.outsideColor || '#333333';
      this.textLabel.setAttribute('fill', outsideFill);
      this.textLabel.setAttribute('ellipsis', undefined);
      this.textLabel.setAttribute('maxLineWidth', undefined);
      this.textLabel.setAttribute('zIndex', 10000);
      this.setAttribute('zIndex', 10000);

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
