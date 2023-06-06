import { ContainerModule } from 'inversify';
import {
  GraphicRender,
  GroupRenderContribution,
  ImageRenderContribution,
  RectRenderContribution
} from '@visactor/vrender';
import { ChartRender, DefaultCanvasChartRender } from './chart-render';
import { AfterImageRenderContribution, BeforeImageRenderContribution } from './image-contribution-render';
import { SplitRectBeforeRenderContribution, SplitRectAfterRenderContribution } from './rect-contribution-render';
import {
  DashGroupAfterRenderContribution,
  DashGroupBeforeRenderContribution,
  SplitGroupBeforeRenderContribution,
  SplitGroupAfterRenderContribution,
  AdjustPosGroupBeforeRenderContribution,
  AdjustPosGroupAfterRenderContribution,
  AdjustColorGroupBeforeRenderContribution,
  AdjustColorGroupAfterRenderContribution
} from './group-contribution-render';

export default new ContainerModule((bind, unbind, isBound, rebind) => {
  // rect 渲染器注入contributions
  bind(SplitRectBeforeRenderContribution).toSelf().inSingletonScope();
  bind(RectRenderContribution).toService(SplitRectBeforeRenderContribution);
  bind(SplitRectAfterRenderContribution).toSelf().inSingletonScope();
  bind(RectRenderContribution).toService(SplitRectAfterRenderContribution);

  // group 渲染器注入contributions
  bind(SplitGroupAfterRenderContribution).toSelf().inSingletonScope();
  bind(GroupRenderContribution).toService(SplitGroupAfterRenderContribution);
  bind(SplitGroupBeforeRenderContribution).toSelf().inSingletonScope();
  bind(GroupRenderContribution).toService(SplitGroupBeforeRenderContribution);

  // chart渲染器注入
  bind(DefaultCanvasChartRender).toSelf().inSingletonScope();
  bind(ChartRender).to(DefaultCanvasChartRender);
  bind(GraphicRender).to(DefaultCanvasChartRender);

  // image 渲染器注入contributions
  bind(BeforeImageRenderContribution).toSelf().inSingletonScope();
  bind(ImageRenderContribution).toService(BeforeImageRenderContribution);
  bind(AfterImageRenderContribution).toSelf().inSingletonScope();
  bind(ImageRenderContribution).toService(AfterImageRenderContribution);

  // group 渲染器注入contributions
  bind(DashGroupBeforeRenderContribution).toSelf().inSingletonScope();
  bind(GroupRenderContribution).toService(DashGroupBeforeRenderContribution);
  bind(DashGroupAfterRenderContribution).toSelf().inSingletonScope();
  bind(GroupRenderContribution).toService(DashGroupAfterRenderContribution);

  bind(AdjustPosGroupBeforeRenderContribution).toSelf().inSingletonScope();
  bind(GroupRenderContribution).toService(AdjustPosGroupBeforeRenderContribution);
  bind(AdjustPosGroupAfterRenderContribution).toSelf().inSingletonScope();
  bind(GroupRenderContribution).toService(AdjustPosGroupAfterRenderContribution);

  bind(AdjustColorGroupBeforeRenderContribution).toSelf().inSingletonScope();
  bind(GroupRenderContribution).toService(AdjustColorGroupBeforeRenderContribution);
  bind(AdjustColorGroupAfterRenderContribution).toSelf().inSingletonScope();
  bind(GroupRenderContribution).toService(AdjustColorGroupAfterRenderContribution);
});
