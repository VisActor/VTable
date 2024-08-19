import type { IRect, IText, IGroupGraphicAttribute } from '@visactor/vtable/es/vrender';
import { Group } from '@visactor/vtable/es/vrender';

export class GanttTaskBarNode extends Group {
  barRect?: IRect;
  progressRect?: IRect;
  textLabel?: IText;
  constructor(attrs: IGroupGraphicAttribute) {
    super(attrs);
  }
}
