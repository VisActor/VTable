import type { IRect, IText, IGroupGraphicAttribute } from '@visactor/vtable/es/vrender';
import { Group } from '@visactor/vtable/es/vrender';

export class GanttTaskBarNode extends Group {
  clipGroupBox: Group;
  barRect?: IRect;
  progressRect?: IRect;
  textLabel?: IText;
  name: string;
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
    const fontFamily = this.textLabel.attribute.fontFamily || 'Arial';
    ctx.font = `${fontSize}px ${fontFamily}`;

    const text = this.textLabel.attribute.text || '';
    const textWidth = ctx.measureText(text).width;
    const padding = 5;

    const barWidth = this.barRect.attribute.width;

    if (textWidth + padding * 2 <= barWidth) {
      if (this.clipGroupBox && this.textLabel.parent !== this.clipGroupBox) {
        if (this.textLabel.parent) {
          this.textLabel.parent.removeChild(this.textLabel);
        }
        this.clipGroupBox.appendChild(this.textLabel);
      }

      this.textLabel.setAttribute('x', (barWidth - textWidth) / 2);
      this.textLabel.setAttribute('y', this.barRect.attribute.height / 2);
      this.textLabel.setAttribute('fill', '#ffffff');

      if (this.textLabel.attribute.ellipsis) {
        this.textLabel.setAttribute('ellipsis', '');
      }
      if (this.textLabel.attribute.maxLineWidth) {
        this.textLabel.setAttribute('maxLineWidth', 0);
      }
    } else {
      const showTextOutsideBar = this.gantt?.parsedOptions?.showTextOutsideBar !== false; // 默认为true

      if (showTextOutsideBar) {
        if (this.clipGroupBox && this.textLabel.parent === this.clipGroupBox) {
          this.clipGroupBox.removeChild(this.textLabel);
        }

        if (this.textLabel.parent !== this) {
          this.appendChild(this.textLabel);
        }

        this.textLabel.setAttribute('x', barWidth + padding);
        this.textLabel.setAttribute('y', this.barRect.attribute.height / 2);
        this.textLabel.setAttribute('fill', '#333333'); // 深色文本，适合在白色背景上显示

        if (this.textLabel.attribute.ellipsis) {
          this.textLabel.setAttribute('ellipsis', '');
        }
        if (this.textLabel.attribute.maxLineWidth) {
          this.textLabel.setAttribute('maxLineWidth', 0);
        }
      } else {
        if (this.clipGroupBox && this.textLabel.parent !== this.clipGroupBox) {
          if (this.textLabel.parent) {
            this.textLabel.parent.removeChild(this.textLabel);
          }
          this.clipGroupBox.appendChild(this.textLabel);
        }

        this.textLabel.setAttribute('x', padding);
        this.textLabel.setAttribute('y', this.barRect.attribute.height / 2);
        this.textLabel.setAttribute('fill', '#ffffff');

        this.textLabel.setAttribute('ellipsis', '...');
        this.textLabel.setAttribute('maxLineWidth', barWidth - padding * 2);
      }
    }

    this.textLabel.setAttribute('textBaseline', 'middle');
    this.textLabel.setAttribute('textAlign', 'left');
  }
}
