import { VRender } from '@visactor/vtable';

// const highlightDash: number[] = [];

// SplitGroupContribution处理分段渲染stroke
// stroke/strokeArrayWidth/strokeArrayColor 为数组时调用
@VRender.injectable()
export class DateHeaderGroupBeforeRenderContribution implements VRender.IGroupRenderContribution {
  time: VRender.BaseRenderContributionTime = VRender.BaseRenderContributionTime.beforeFillStroke;
  useStyle = true;
  order = 0;
  supportedAppName: string = 'vtable';
  drawShape(
    group: VRender.IGroup,
    context: VRender.IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    groupAttribute: Required<VRender.IGroupGraphicAttribute>,
    drawContext: VRender.IDrawContext,
    fillCb?: (
      ctx: VRender.IContext2d,
      markAttribute: Partial<VRender.IMarkAttribute & VRender.IGraphicAttribute>,
      themeAttribute: VRender.IThemeAttribute
    ) => boolean,
    strokeCb?: (
      ctx: VRender.IContext2d,
      markAttribute: Partial<VRender.IMarkAttribute & VRender.IGraphicAttribute>,
      themeAttribute: VRender.IThemeAttribute
    ) => boolean,
    doFillOrStroke?: { doFill: boolean; doStroke: boolean }
  ) {
    if (group.name === 'date-header-cell') {
      group.forEachChildren((child: any) => {
        if (child.name === 'date-header-cell-text' && child.attribute.textStick === true) {
          console.log('text', child.attribute.text);
          const text = child;
          text.setAttribute('dx', 0);
          const textBounds = text.globalAABBBounds;
          const stageBound = text.stage.globalAABBBounds;
          const groupParent = text.parent.globalAABBBounds;
          const intersectBounds = stageBound.intersect(groupParent);
          console.log('textBounds1', textBounds);
          if (stageBound.intersect(groupParent)) {
            // if (!stageBound.contains(textBounds)) {
            if (textBounds.width() >= intersectBounds.width() && text.attribute.last_dx) {
              text.setAttribute('dx', text.attribute.last_dx ?? 0);
            } else {
              if (stageBound.x1 >= textBounds.x1) {
                text.setAttribute('dx', stageBound.x1 - textBounds.x1);
                text.setAttribute('last_dx', stageBound.x1 - textBounds.x1);
              } else if (stageBound.x2 <= textBounds.x2) {
                console.log('textBounds2', text.globalAABBBounds);
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
