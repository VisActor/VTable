import {
  GraphicRender,
  GroupRenderContribution,
  ImageRenderContribution,
  RectRenderContribution,
  SplitRectBeforeRenderContribution,
  SplitRectAfterRenderContribution,
  DrawItemInterceptor,
  TextRenderContribution,
  CanvasPickerContribution,
  serviceRegistry,
  contributionRegistry
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
import { VChartPicker } from './vchart-graphic-picker';
// import { VChartPickServiceInterceptorContribution } from './picker-interceptor';

export default function registerSplits() {
  serviceRegistry.registerSingleton(
    VTableSplitRectBeforeRenderContribution,
    new VTableSplitRectBeforeRenderContribution()
  );

  const prevSplitRectBeforeRender = contributionRegistry
    .get(RectRenderContribution)
    .find(imp => imp instanceof SplitRectBeforeRenderContribution);
  if (prevSplitRectBeforeRender) {
    contributionRegistry.unregister(RectRenderContribution, prevSplitRectBeforeRender);
  }
  contributionRegistry.register(RectRenderContribution, serviceRegistry.get(VTableSplitRectBeforeRenderContribution));

  serviceRegistry.registerSingleton(
    VTableSplitRectAfterRenderContribution,
    new VTableSplitRectAfterRenderContribution()
  );
  const prevSplitRectAfterRender = contributionRegistry
    .get(RectRenderContribution)
    .find(imp => imp instanceof SplitRectAfterRenderContribution);
  if (prevSplitRectAfterRender) {
    contributionRegistry.unregister(RectRenderContribution, prevSplitRectAfterRender);
  }
  contributionRegistry.register(RectRenderContribution, serviceRegistry.get(VTableSplitRectAfterRenderContribution));

  // chart渲染器注入
  serviceRegistry.registerSingleton(DefaultCanvasChartRender, new DefaultCanvasChartRender());
  contributionRegistry.register(ChartRender, serviceRegistry.get(DefaultCanvasChartRender));
  contributionRegistry.register(GraphicRender, serviceRegistry.get(DefaultCanvasChartRender));
  // chart picker 注入
  serviceRegistry.registerSingleton(VChartPicker, new VChartPicker());
  contributionRegistry.register(CanvasPickerContribution, serviceRegistry.get(VChartPicker));

  // image 渲染器注入contributions
  serviceRegistry.registerSingleton(BeforeImageRenderContribution, new BeforeImageRenderContribution());
  contributionRegistry.register(ImageRenderContribution, serviceRegistry.get(BeforeImageRenderContribution));
  serviceRegistry.registerSingleton(AfterImageRenderContribution, new AfterImageRenderContribution());
  contributionRegistry.register(ImageRenderContribution, serviceRegistry.get(AfterImageRenderContribution));

  serviceRegistry.registerSingleton(BeforeGifImageRenderContribution, new BeforeGifImageRenderContribution());
  contributionRegistry.register(ImageRenderContribution, serviceRegistry.get(BeforeGifImageRenderContribution));
  serviceRegistry.registerSingleton(AfterGifImageRenderContribution, new AfterGifImageRenderContribution());
  contributionRegistry.register(ImageRenderContribution, serviceRegistry.get(AfterGifImageRenderContribution));

  // group 渲染器注入contributions
  serviceRegistry.registerSingleton(
    AdjustColorGroupBeforeRenderContribution,
    new AdjustColorGroupBeforeRenderContribution()
  );
  contributionRegistry.register(GroupRenderContribution, serviceRegistry.get(AdjustColorGroupBeforeRenderContribution));
  serviceRegistry.registerSingleton(
    AdjustColorGroupAfterRenderContribution,
    new AdjustColorGroupAfterRenderContribution()
  );
  contributionRegistry.register(GroupRenderContribution, serviceRegistry.get(AdjustColorGroupAfterRenderContribution));

  serviceRegistry.registerSingleton(SplitGroupAfterRenderContribution, new SplitGroupAfterRenderContribution());
  contributionRegistry.register(GroupRenderContribution, serviceRegistry.get(SplitGroupAfterRenderContribution));
  serviceRegistry.registerSingleton(SplitGroupBeforeRenderContribution, new SplitGroupBeforeRenderContribution());
  contributionRegistry.register(GroupRenderContribution, serviceRegistry.get(SplitGroupBeforeRenderContribution));

  serviceRegistry.registerSingleton(DashGroupBeforeRenderContribution, new DashGroupBeforeRenderContribution());
  contributionRegistry.register(GroupRenderContribution, serviceRegistry.get(DashGroupBeforeRenderContribution));
  serviceRegistry.registerSingleton(DashGroupAfterRenderContribution, new DashGroupAfterRenderContribution());
  contributionRegistry.register(GroupRenderContribution, serviceRegistry.get(DashGroupAfterRenderContribution));

  serviceRegistry.registerSingleton(
    AdjustPosGroupBeforeRenderContribution,
    new AdjustPosGroupBeforeRenderContribution()
  );
  contributionRegistry.register(GroupRenderContribution, serviceRegistry.get(AdjustPosGroupBeforeRenderContribution));
  serviceRegistry.registerSingleton(AdjustPosGroupAfterRenderContribution, new AdjustPosGroupAfterRenderContribution());
  contributionRegistry.register(GroupRenderContribution, serviceRegistry.get(AdjustPosGroupAfterRenderContribution));

  serviceRegistry.registerSingleton(ClipBodyGroupBeforeRenderContribution, new ClipBodyGroupBeforeRenderContribution());
  contributionRegistry.register(GroupRenderContribution, serviceRegistry.get(ClipBodyGroupBeforeRenderContribution));
  // bind(ClipBodyGroupAfterRenderContribution).toSelf().inSingletonScope();
  // bind(GroupRenderContribution).toService(ClipBodyGroupAfterRenderContribution);

  // interceptor
  serviceRegistry.registerSingleton(VTableDrawItemInterceptorContribution, new VTableDrawItemInterceptorContribution());
  contributionRegistry.register(DrawItemInterceptor, serviceRegistry.get(VTableDrawItemInterceptorContribution));

  // text 渲染器注入contributions
  serviceRegistry.registerSingleton(SuffixTextBeforeRenderContribution, new SuffixTextBeforeRenderContribution());
  contributionRegistry.register(TextRenderContribution, serviceRegistry.get(SuffixTextBeforeRenderContribution));
}
