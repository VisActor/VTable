import type {
  ITextRenderContribution,
  IText,
  IContext2d,
  ITextGraphicAttribute,
  IDrawContext,
  IMarkAttribute,
  IGraphicAttribute,
  IThemeAttribute
} from '@visactor/vtable/es/vrender';
import { injectable, BaseRenderContributionTime } from '@visactor/vtable/es/vrender';

@injectable()
export class TextStickBeforeRenderContribution implements ITextRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.beforeFillStroke;
  useStyle: boolean = true;
  order: number = 0;
  supportedAppName: string = 'vtable';
  drawShape(
    text: IText,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    textAttribute: Required<ITextGraphicAttribute>,
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
    // debugger;
    const gantt = (text.stage as any).gantt;
    if (gantt && text.name === 'date-header-cell-text') {
      // text.setAttribute('dx', 0);
      // const textBounds = text.globalAABBBounds;
      // const stageBound = text.stage.globalAABBBounds;
      // const groupParent = text.parent.globalAABBBounds;
      // const intersectBounds = stageBound.intersect(groupParent);
      // if (stageBound.intersect(groupParent)) {
      //   // if (!stageBound.contains(textBounds)) {
      //   if (textBounds.width() >= intersectBounds.width()) {
      //     text.setAttribute('dx', text.attribute.last_dx ?? 0);
      //   } else {
      //     if (stageBound.x1 >= textBounds.x1) {
      //       text.setAttribute('dx', stageBound.x1 - textBounds.x1);
      //       text.setAttribute('last_dx', stageBound.x1 - textBounds.x1);
      //     } else if (stageBound.x2 <= textBounds.x2) {
      //       text.setAttribute('dx', stageBound.x2 - textBounds.x2);
      //       text.setAttribute('last_dx', stageBound.x1 - textBounds.x1);
      //     }
      //   }
      //   // }
      // }
    }
  }
}
