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
  // @ts-ignore: Temporarily suppress type checking for font handling
  updateTextPosition() {
    if (!this.textLabel || !this.barRect) {
      return;
    }

    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) {
      return;
    }

    // @ts-ignore: Temporarily ignore font type issue
    ctx.font = `${this.textLabel.attribute.fontSize || 12}px ${this.textLabel.attribute.fontFamily || 'Arial'}`;

    const text = this.textLabel.attribute.text || '';
    const textWidth = ctx.measureText(text).width;
    const padding = 8;

    const barWidth = this.barRect.attribute.width;

    // 检查是否有showTextOutsideBar配置，从taskBar配置中获取
    const showTextOutsideBar = this.gantt?.parsedOptions?.showTextOutsideBar !== false;

    if (textWidth + padding * 2 <= barWidth) {
      // 文本可以完全显示在进度条内
      if (this.clipGroupBox && this.textLabel.parent !== this.clipGroupBox) {
        if (this.textLabel.parent) {
          this.textLabel.parent.removeChild(this.textLabel);
        }
        this.clipGroupBox.appendChild(this.textLabel);
      }

      // 设置文本位置和样式
      this.textLabel.setAttribute('x', padding);
      this.textLabel.setAttribute('y', this.barRect.attribute.height / 2);
      this.textLabel.setAttribute('fill', '#ff0000');

      this.textLabel.setAttribute('ellipsis', undefined);
      this.textLabel.setAttribute('maxLineWidth', barWidth - padding * 2);
    } else if (showTextOutsideBar) {
      if (this.clipGroupBox && this.textLabel.parent === this.clipGroupBox) {
        this.clipGroupBox.removeChild(this.textLabel);
      }

      if (this.textLabel.parent !== this) {
        this.appendChild(this.textLabel);
      }

      this.textLabel.setAttribute('x', barWidth + padding);
      this.textLabel.setAttribute('y', this.barRect.attribute.height / 2);
      this.textLabel.setAttribute('fill', '#333333');

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
      this.textLabel.setAttribute('y', this.barRect.attribute.height / 2);
      this.textLabel.setAttribute('fill', '#ff0000');

      this.textLabel.setAttribute('ellipsis', '...');
      this.textLabel.setAttribute('maxLineWidth', barWidth - padding * 2);
    }

    this.textLabel.setAttribute('textBaseline', 'middle');
    this.textLabel.setAttribute('textAlign', 'left');

    this.textLabel.setAttribute('visible', true);
  }
}
