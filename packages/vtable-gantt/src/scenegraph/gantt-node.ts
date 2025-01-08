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
  constructor(attrs: IGroupGraphicAttribute) {
    super(attrs);
  }
}
