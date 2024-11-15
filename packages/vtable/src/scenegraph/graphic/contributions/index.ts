import {
  GraphicRender,
  GroupRenderContribution,
  ImageRenderContribution,
  RectRenderContribution,
  SplitRectBeforeRenderContribution,
  SplitRectAfterRenderContribution,
  ContainerModule,
  DrawItemInterceptor,
  TextRenderContribution
} from '@src/vrender';
import { ChartRender, DefaultCanvasChartRender } from './chart-render';
import {
  AfterImageRenderContribution,
  BeforeImageRenderContribution,
  BeforeGifImageRenderContribution,
  AfterGifImageRenderContribution
} from './image-contribution-render';
import {
  SplitRectBeforeRenderContribution as VTableSplitRectBeforeRenderContribution,
  SplitRectAfterRenderContribution as VTableSplitRectAfterRenderContribution
} from './rect-contribution-render';
import {
  DashGroupAfterRenderContribution,
  DashGroupBeforeRenderContribution,
  SplitGroupBeforeRenderContribution,
  SplitGroupAfterRenderContribution,
  AdjustPosGroupBeforeRenderContribution,
  AdjustPosGroupAfterRenderContribution,
  AdjustColorGroupBeforeRenderContribution,
  AdjustColorGroupAfterRenderContribution,
  ClipBodyGroupBeforeRenderContribution
  // ClipBodyGroupAfterRenderContribution
} from './group-contribution-render';
import { VTableDrawItemInterceptorContribution } from './draw-interceptor';
import { SuffixTextBeforeRenderContribution } from './text-contribution-render';

export default new ContainerModule((bind, unbind, isBound, rebind) => {
  // rect 渲染器注入contributions
  if (isBound(SplitRectBeforeRenderContribution)) {
    rebind(SplitRectBeforeRenderContribution).to(VTableSplitRectBeforeRenderContribution).inSingletonScope();
  } else {
    bind(VTableSplitRectBeforeRenderContribution).toSelf().inSingletonScope();
    bind(RectRenderContribution).toService(VTableSplitRectBeforeRenderContribution);
  }
  if (isBound(SplitRectAfterRenderContribution)) {
    rebind(SplitRectAfterRenderContribution).to(VTableSplitRectAfterRenderContribution).inSingletonScope();
  } else {
    bind(VTableSplitRectAfterRenderContribution).toSelf().inSingletonScope();
    bind(RectRenderContribution).toService(VTableSplitRectAfterRenderContribution);
  }

  // chart渲染器注入
  bind(DefaultCanvasChartRender).toSelf().inSingletonScope();
  bind(ChartRender).to(DefaultCanvasChartRender);
  bind(GraphicRender).to(DefaultCanvasChartRender);

  // image 渲染器注入contributions
  bind(BeforeImageRenderContribution).toSelf().inSingletonScope();
  bind(ImageRenderContribution).toService(BeforeImageRenderContribution);
  bind(AfterImageRenderContribution).toSelf().inSingletonScope();
  bind(ImageRenderContribution).toService(AfterImageRenderContribution);

  bind(BeforeGifImageRenderContribution).toSelf().inSingletonScope();
  bind(ImageRenderContribution).toService(BeforeGifImageRenderContribution);
  bind(AfterGifImageRenderContribution).toSelf().inSingletonScope();
  bind(ImageRenderContribution).toService(AfterGifImageRenderContribution);

  // group 渲染器注入contributions
  bind(AdjustColorGroupBeforeRenderContribution).toSelf().inSingletonScope();
  bind(GroupRenderContribution).toService(AdjustColorGroupBeforeRenderContribution);
  bind(AdjustColorGroupAfterRenderContribution).toSelf().inSingletonScope();
  bind(GroupRenderContribution).toService(AdjustColorGroupAfterRenderContribution);

  bind(SplitGroupAfterRenderContribution).toSelf().inSingletonScope();
  bind(GroupRenderContribution).toService(SplitGroupAfterRenderContribution);
  bind(SplitGroupBeforeRenderContribution).toSelf().inSingletonScope();
  bind(GroupRenderContribution).toService(SplitGroupBeforeRenderContribution);

  bind(DashGroupBeforeRenderContribution).toSelf().inSingletonScope();
  bind(GroupRenderContribution).toService(DashGroupBeforeRenderContribution);
  bind(DashGroupAfterRenderContribution).toSelf().inSingletonScope();
  bind(GroupRenderContribution).toService(DashGroupAfterRenderContribution);

  bind(AdjustPosGroupBeforeRenderContribution).toSelf().inSingletonScope();
  bind(GroupRenderContribution).toService(AdjustPosGroupBeforeRenderContribution);
  bind(AdjustPosGroupAfterRenderContribution).toSelf().inSingletonScope();
  bind(GroupRenderContribution).toService(AdjustPosGroupAfterRenderContribution);

  bind(ClipBodyGroupBeforeRenderContribution).toSelf().inSingletonScope();
  bind(GroupRenderContribution).toService(ClipBodyGroupBeforeRenderContribution);
  // bind(ClipBodyGroupAfterRenderContribution).toSelf().inSingletonScope();
  // bind(GroupRenderContribution).toService(ClipBodyGroupAfterRenderContribution);

  // interceptor
  bind(VTableDrawItemInterceptorContribution).toSelf().inSingletonScope();
  bind(DrawItemInterceptor).toService(VTableDrawItemInterceptorContribution);

  // text 渲染器注入contributions
  bind(SuffixTextBeforeRenderContribution).toSelf().inSingletonScope();
  bind(TextRenderContribution).toService(SuffixTextBeforeRenderContribution);
});
