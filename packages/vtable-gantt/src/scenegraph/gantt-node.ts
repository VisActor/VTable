import type { IRect, IText, IGroupGraphicAttribute } from '@visactor/vtable/es/vrender';
import { Group } from '@visactor/vtable/es/vrender';
import type { Gantt } from '../Gantt';

export class GanttTaskBarNode extends Group {
  milestoneTextLabel?: IText;
  milestoneText?: string;
  milestoneTextContainer?: Group;
  gantt?: Gantt;
  clipGroupBox: Group;
  barRect?: IRect;
  progressRect?: IRect;
  textLabel?: IText;
  declare name: string;
  task_index: number;
  sub_task_index?: number;
  record?: any;
  constructor(attrs: IGroupGraphicAttribute) {
    super(attrs);
  }

  /**
   * 更新里程碑文本位置
   */
  updateMilestoneTextPosition() {
    if (!this.milestoneTextLabel || this.record?.type !== 'milestone') {
      return;
    }

    const milestoneStyle = this.gantt?.parsedOptions?.taskBarMilestoneStyle || {};

    const defaultTextStyle = {
      fontSize: 12,
      color: '#333333',
      fontFamily: 'Arial',
      padding: 4
    };
    const textStyle = { ...defaultTextStyle, ...(milestoneStyle.labelTextStyle || {}) };

    const textPosition = milestoneStyle.textorient || 'center';
    const milestoneWidth = milestoneStyle.width || 16;
    const padding = typeof textStyle.padding === 'number' ? textStyle.padding : 4;

    // 获取里程碑中心点坐标（相对于父节点）
    const centerX = milestoneWidth / 2;
    const centerY = milestoneWidth / 2;

    let textX = 0;
    let textY = 0;
    let textAlignValue = 'left';
    let textBaselineValue = 'middle';

    switch (textPosition) {
      case 'center':
        textX = centerX;
        textY = centerY;
        textAlignValue = 'center';
        textBaselineValue = 'middle';
        break;
      case 'left':
        textX = -padding;
        textY = centerY;
        textAlignValue = 'end';
        textBaselineValue = 'middle';
        break;
      case 'top':
        textX = centerX;
        textY = -padding;
        textAlignValue = 'center';
        textBaselineValue = 'bottom';
        break;
      case 'bottom':
        textX = centerX;
        textY = padding + milestoneWidth;
        textAlignValue = 'center';
        textBaselineValue = 'top';
        break;
      case 'right':
      default:
        textX = milestoneWidth + padding;
        textY = centerY;
        textAlignValue = 'start';
        textBaselineValue = 'middle';
        break;
    }

    this.milestoneTextLabel.setAttribute('x', textX);
    this.milestoneTextLabel.setAttribute('y', textY);
    this.milestoneTextLabel.setAttribute('textAlign', textStyle.textAlign || textAlignValue);
    this.milestoneTextLabel.setAttribute('textBaseline', textStyle.textBaseline || textBaselineValue);
    this.milestoneTextLabel.setAttribute('zIndex', 3000); // 确保文本始终在最上层
    this.milestoneTextLabel.setAttribute('fill', textStyle.color || '#ff0000');
    this.milestoneTextLabel.setAttribute('fontSize', textStyle.fontSize || 16);
    this.milestoneTextLabel.setAttribute('fontFamily', textStyle.fontFamily || 'Arial');
  }

  /**
   * 更新位置
   */
  updatePosition(x: number, y: number) {
    const oldX = this.attribute.x;
    const oldY = this.attribute.y;

    this.setAttribute('x', x);
    this.setAttribute('y', y);

    if (this.milestoneTextContainer && this.record?.type === 'milestone') {
      const deltaX = x - oldX;
      const deltaY = y - oldY;

      const currentX = this.milestoneTextContainer.attribute.x;
      const currentY = this.milestoneTextContainer.attribute.y;
      this.milestoneTextContainer.setAttribute('x', currentX + deltaX);
      this.milestoneTextContainer.setAttribute('y', currentY + deltaY);
    }

    if (this.milestoneTextLabel && this.record?.type === 'milestone') {
      this.updateMilestoneTextPosition();
    }
  }
}
