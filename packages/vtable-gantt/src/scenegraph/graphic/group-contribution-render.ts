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
        if (child.name === 'date-header-cell-text') {
          console.log('text', child.attribute.text);
          child.addUpdateBoundTag();
        }
      });
    }
  }
}
