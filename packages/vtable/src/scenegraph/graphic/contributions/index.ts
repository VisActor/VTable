import { ContainerModule } from 'inversify';
import {
  GraphicRender,
  GroupRenderContribution,
  ImageRenderContribution,
  RectRenderContribution,
  SplitRectBeforeRenderContribution,
  SplitRectAfterRenderContribution
} from '@visactor/vrender';
import { ChartRender, DefaultCanvasChartRender } from './chart-render';
import { AfterImageRenderContribution, BeforeImageRenderContribution } from './image-contribution-render';
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
  AdjustColorGroupAfterRenderContribution
} from './group-contribution-render';

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
