import type { IRect, IText, IGroupGraphicAttribute } from '@visactor/vtable/es/vrender';
import { Group } from '@visactor/vtable/es/vrender';

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
   * 当文字在进度条内展示不全时，根据配置决定是否显示在进度条右侧
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

    const labelStyle = this.gantt?.parsedOptions?.taskBarLabelStyle;
    const padding = labelStyle?.padding
      ? Array.isArray(labelStyle.padding)
        ? labelStyle.padding[3]
        : labelStyle.padding
      : 8;

    const barWidth = this.barRect.attribute.width;

    const showTextOutsideBar = this.gantt?.parsedOptions?.showTextOutsideBar !== false;

    if (textWidth + padding * 2 <= barWidth) {
      if (this.clipGroupBox && this.textLabel.parent !== this.clipGroupBox) {
        if (this.textLabel.parent) {
          this.textLabel.parent.removeChild(this.textLabel);
        }
        this.clipGroupBox.appendChild(this.textLabel);
      }

      const textAlign = this.gantt?.parsedOptions?.taskBarLabelStyle?.textAlign || 'left';
      this.textLabel.setAttribute('textAlign', textAlign);

      if (textAlign === 'right') {
        this.textLabel.setAttribute('x', barWidth - padding);
      } else if (textAlign === 'center') {
        this.textLabel.setAttribute('x', barWidth / 2);
      } else {
        this.textLabel.setAttribute('x', padding);
      }

      this.textLabel.setAttribute('fill', this.gantt?.parsedOptions?.taskBarLabelStyle?.color || '#333333');

      this.textLabel.setAttribute('ellipsis', undefined);
      this.textLabel.setAttribute('maxLineWidth', barWidth - padding * 2);
    } else if (showTextOutsideBar) {
      if (this.clipGroupBox && this.textLabel.parent === this.clipGroupBox) {
        this.clipGroupBox.removeChild(this.textLabel);
      }

      if (this.textLabel.parent !== this) {
        this.appendChild(this.textLabel);
      }

      const originalFill = this.gantt?.parsedOptions?.taskBarLabelStyle?.outsideColor || '#333333';
      this.textLabel.setAttribute('x', barWidth + padding);
      this.textLabel.setAttribute('fill', originalFill);

      this.textLabel.setAttribute('ellipsis', undefined);
      this.textLabel.setAttribute('maxLineWidth', undefined);

      this.textLabel.setAttribute('zIndex', 1000);
    } else {
      if (this.clipGroupBox && this.textLabel.parent !== this.clipGroupBox) {
        if (this.textLabel.parent) {
          this.textLabel.parent.removeChild(this.textLabel);
        }
        this.clipGroupBox.appendChild(this.textLabel);
      }

      this.textLabel.setAttribute('x', padding);
      this.textLabel.setAttribute('fill', this.gantt?.parsedOptions?.taskBarLabelStyle?.color || '#333333');

      this.textLabel.setAttribute('ellipsis', '...');
      this.textLabel.setAttribute('maxLineWidth', barWidth - padding * 2);
    }

    // When text is outside, always align to left
    if (!this.clipGroupBox || this.textLabel.parent !== this.clipGroupBox) {
      this.textLabel.setAttribute('textAlign', 'left');
    }

    // Use configured textBaseline or default to middle
    const textBaseline = this.gantt?.parsedOptions?.taskBarLabelStyle?.textBaseline || 'middle';
    this.textLabel.setAttribute('textBaseline', textBaseline);

    // Adjust y position based on textBaseline
    let yPos = this.barRect.attribute.height / 2;
    if (textBaseline === 'top') {
      yPos = labelStyle?.padding?.[0] || 0;
    } else if (textBaseline === 'bottom') {
      yPos = this.barRect.attribute.height - (labelStyle?.padding?.[2] || 0);
    }

    // Update y position for all text elements
    this.textLabel.setAttribute('y', yPos);
    this.textLabel.setAttribute('visible', true);
  }
}
