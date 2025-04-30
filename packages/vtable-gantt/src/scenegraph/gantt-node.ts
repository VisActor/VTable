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

  // 用于测量文本的 canvas 上下文
  private static measureContext: CanvasRenderingContext2D;

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

    // 懒加载创建用于测量文本的 canvas 上下文
    if (!GanttTaskBarNode.measureContext) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }
      GanttTaskBarNode.measureContext = ctx;
    }

    const labelStyle = this.gantt?.parsedOptions?.taskBarLabelStyle || {};
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

    // 计算文本宽度
    const fontSize = this.textLabel.attribute.fontSize || 12;
    const fontFamily = this.textLabel.attribute.fontFamily || 'Arial';
    GanttTaskBarNode.measureContext.font = `${fontSize}px ${fontFamily}`;
    const text = String(this.textLabel.attribute.text || '');
    const textWidth = GanttTaskBarNode.measureContext.measureText(text).width;

    // 计算文本位置
    const textFitsInBar = textWidth + padding * 2 <= barWidth;
    const defaultPosition = getTextPos(toBoxArray(padding), textAlign, textBaseline, barWidth, barHeight);
    const textPosition =
      labelStyle.orient ||
      (!textFitsInBar && labelStyle.orientHandleWithOverflow ? labelStyle.orientHandleWithOverflow : null);

    // 设置公共属性
    this.textLabel.setAttribute('visible', true);
    this.textLabel.setAttribute('textBaseline', textBaseline);

    if (textPosition) {
      // 文本在任务条外部显示
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

      // 根据方位设置位置
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
      // 文本在任务条内部显示
      this.textLabel.parent?.removeChild(this.textLabel);
      this.clipGroupBox?.appendChild(this.textLabel);
      this.textLabel.setAttribute('x', defaultPosition.x);
      this.textLabel.setAttribute('y', defaultPosition.y);
      this.textLabel.setAttribute('textAlign', textAlign);
      this.textLabel.setAttribute('fill', color);
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
  }
}
