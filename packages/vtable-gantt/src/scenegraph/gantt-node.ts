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
  /**
   * 更新里程碑文本位置
   */
  updateMilestoneTextPosition() {
    if (!this.milestoneTextLabel || this.record?.type !== 'milestone') {
      return;
    }

    const milestoneStyle = this.gantt?.parsedOptions?.taskBarMilestoneStyle || {};

    // 获取默认文本样式并合并用户配置
    const defaultTextStyle = {
      fontSize: 12,
      color: '#333333',
      fontFamily: 'Arial',
      padding: 4
    };
    const textStyle = { ...defaultTextStyle, ...(milestoneStyle.labelTextStyle || {}) };

    const textPosition = milestoneStyle.textPosition || 'center';
    const milestoneWidth = milestoneStyle.width || 16;
    const padding = typeof textStyle.padding === 'number' ? textStyle.padding : 4;

    // 获取里程碑中心点坐标（相对于父节点）
    const centerX = milestoneWidth / 2;
    const centerY = milestoneWidth / 2;

    // 根据textPosition计算文本位置
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

    // 设置文本属性
    this.milestoneTextLabel.setAttribute('x', textX);
    this.milestoneTextLabel.setAttribute('y', textY);
    this.milestoneTextLabel.setAttribute('textAlign', textStyle.textAlign || textAlignValue);
    this.milestoneTextLabel.setAttribute('textBaseline', textStyle.textBaseline || textBaselineValue);
    this.milestoneTextLabel.setAttribute('zIndex', 3000); // 确保文本始终在最上层
    this.milestoneTextLabel.setAttribute('fill', textStyle.color || '#333333');
    this.milestoneTextLabel.setAttribute('fontSize', textStyle.fontSize || 12);
    this.milestoneTextLabel.setAttribute('fontFamily', textStyle.fontFamily || 'Arial');
  }

  /**
   * 更新位置
   */
  updatePosition(x: number, y: number) {
    // 保存原始位置
    const oldX = this.attribute.x;
    const oldY = this.attribute.y;

    // 设置新位置
    this.setAttribute('x', x);
    this.setAttribute('y', y);

    // 如果有里程碑文本容器，同步更新其位置
    if (this.milestoneTextContainer && this.record?.type === 'milestone') {
      // 计算位置偏移量
      const deltaX = x - oldX;
      const deltaY = y - oldY;

      // 更新文本容器位置
      const currentX = this.milestoneTextContainer.attribute.x;
      const currentY = this.milestoneTextContainer.attribute.y;
      this.milestoneTextContainer.setAttribute('x', currentX + deltaX);
      this.milestoneTextContainer.setAttribute('y', currentY + deltaY);
    }

    // 更新里程碑文本位置
    if (this.milestoneTextLabel && this.record?.type === 'milestone') {
      this.updateMilestoneTextPosition();
    }
  }
}
