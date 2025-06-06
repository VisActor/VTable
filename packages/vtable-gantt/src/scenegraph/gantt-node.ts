import type { IRect, IText, IGroupGraphicAttribute } from '@visactor/vtable/es/vrender';
import type { ITaskBarLabelTextStyle } from '../ts-types';
import { Group } from '@visactor/vtable/es/vrender';
import { getTextPos } from '../gantt-helper';
import { toBoxArray } from '../tools/util';
import { isValid } from '@visactor/vutils';
import { textMeasure } from '@visactor/vtable';

export class GanttTaskBarNode extends Group {
  milestoneTextLabel?: IText;
  milestoneTextContainer?: Group;
  clipGroupBox: Group;
  barRect?: IRect;
  progressRect?: IRect;
  textLabel?: IText;
  declare name: string;
  task_index: number;
  sub_task_index?: number;
  record?: any;
  labelStyle?: ITaskBarLabelTextStyle;

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
   * 更新任务条文本标签的位置和样式
   * @description 根据任务条的大小和配置，更新文本标签的位置、对齐方式等属性
   * orient: 直接将文本显示在指定方位位置
   * orientHandleWithOverflow: 只有当文本溢出时才在指定方位显示，当配置了orient时此配置无效
   */
  updateTextPosition() {
    if (!this.textLabel || !this.barRect) {
      return;
    }

    const labelStyle = this.labelStyle || {};
    const {
      textAlign = 'left',
      textBaseline = 'middle',
      textOverflow,
      color = '#333333',
      outsideColor = '#333333',
      padding: rawPadding = 8
    } = labelStyle;

    const padding = Array.isArray(rawPadding) ? rawPadding[3] : rawPadding;
    const barWidth = this.barRect.attribute.width;
    const barHeight = this.barRect.attribute.height;

    const fontSize = this.textLabel.attribute.fontSize || 12;
    const fontFamily = this.textLabel.attribute.fontFamily || 'Arial';
    const text = String(this.textLabel.attribute.text || '');
    const textWidth = textMeasure.measureTextWidth(text, { fontSize, fontFamily });

    const textFitsInBar = textWidth + padding * 2 <= barWidth;
    const defaultPosition = getTextPos(toBoxArray(padding), textAlign, textBaseline, barWidth, barHeight);
    const textPosition =
      labelStyle.orient ||
      (!textFitsInBar && labelStyle.orientHandleWithOverflow ? labelStyle.orientHandleWithOverflow : null);

    this.textLabel.setAttribute('visible', true);
    this.textLabel.setAttribute('textBaseline', textBaseline);

    if (textPosition) {
      this.textLabel.parent?.removeChild(this.textLabel);
      this.appendChild(this.textLabel);
      this.textLabel.setAttribute('fill', outsideColor);
      this.textLabel.setAttribute('ellipsis', undefined);
      this.textLabel.setAttribute('maxLineWidth', undefined);
      this.textLabel.setAttribute('zIndex', 10000);
      this.setAttribute('zIndex', 10000);

      type Position = {
        x: number;
        y: number;
        align: string;
        baseline: string;
      };
      type Positions = {
        [key: string]: Position;
      };

      const positions: Positions = {
        left: {
          x: -padding,
          y: barHeight / 2,
          align: 'right',
          baseline: 'middle'
        },
        right: {
          x: barWidth + padding,
          y: barHeight / 2,
          align: 'left',
          baseline: 'middle'
        },
        top: {
          x: barWidth / 2,
          y: -padding,
          align: 'center',
          baseline: 'bottom'
        },
        bottom: {
          x: barWidth / 2,
          y: barHeight + padding,
          align: 'center',
          baseline: 'top'
        }
      };

      const pos = positions[textPosition];
      if (pos) {
        this.textLabel.setAttribute('x', pos.x);
        this.textLabel.setAttribute('y', pos.y);
        this.textLabel.setAttribute('textAlign', pos.align);
        this.textLabel.setAttribute('textBaseline', pos.baseline);
      }
    } else {
      this.textLabel.parent?.removeChild(this.textLabel);
      this.clipGroupBox?.appendChild(this.textLabel);
      this.textLabel.setAttribute('x', defaultPosition.x);
      this.textLabel.setAttribute('y', defaultPosition.y);
      this.textLabel.setAttribute('textAlign', textAlign);
      this.textLabel.setAttribute('fill', color);
      this.textLabel.setAttribute('maxLineWidth', barWidth - padding);
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
  }
}
