import type {
  IContext2d,
  IDrawContext,
  IMarkAttribute,
  IGraphicAttribute,
  IThemeAttribute,
  IGroupGraphicAttribute,
  IGroup,
  IGroupRenderContribution
} from '@visactor/vtable/es/vrender';
import { injectable, BaseRenderContributionTime } from '@visactor/vtable/es/vrender';

// const highlightDash: number[] = [];

// SplitGroupContribution处理分段渲染stroke
// stroke/strokeArrayWidth/strokeArrayColor 为数组时调用
@injectable()
export class DateHeaderGroupBeforeRenderContribution implements IGroupRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.beforeFillStroke;
  useStyle = true;
  order = 0;
  supportedAppName: string = 'vtable';
  drawShape(
    group: IGroup,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    groupAttribute: Required<IGroupGraphicAttribute>,
    drawContext: IDrawContext,
    fillCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    strokeCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    doFillOrStroke?: { doFill: boolean; doStroke: boolean }
  ) {
    if (group.name === 'date-header-cell') {
      group.forEachChildren((child: any) => {
        if (child.name === 'date-header-cell-text' && child.attribute.textStick === true) {
          const text = child;
          text.setAttribute('dx', 0);
          const textBounds = text.globalAABBBounds;
          const stageBound = text.stage.globalAABBBounds;
          const groupParent = text.parent.globalAABBBounds;
          const intersectBounds = stageBound.intersect(groupParent);
          if (stageBound.intersect(groupParent)) {
            // if (!stageBound.contains(textBounds)) {
            if (textBounds.width() >= intersectBounds.width() && text.attribute.last_dx) {
              text.setAttribute('dx', text.attribute.last_dx ?? 0);
            } else {
              if (stageBound.x1 >= textBounds.x1) {
                text.setAttribute('dx', stageBound.x1 - textBounds.x1);
                text.setAttribute('last_dx', stageBound.x1 - textBounds.x1);
              } else if (stageBound.x2 <= textBounds.x2) {
                text.setAttribute('dx', stageBound.x2 - textBounds.x2);
                text.setAttribute('last_dx', stageBound.x1 - textBounds.x1);
              }
            }
            // }
          }
        }
      });
    }
  }
}
