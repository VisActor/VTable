import { VRender } from '@visactor/vtable';
export class GanttTaskBarNode extends VRender.Group {
  barRect?: VRender.IRect;
  progressRect?: VRender.IRect;
  textLabel?: VRender.IText;
  constructor(attrs: VRender.IGroupGraphicAttribute) {
    super(attrs);
  }
}
