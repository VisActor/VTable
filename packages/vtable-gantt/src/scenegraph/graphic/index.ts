import { VRender } from '@visactor/vtable';

import { TextStickBeforeRenderContribution } from './text-contribution-render';
import { DateHeaderGroupBeforeRenderContribution } from './group-contribution-render';

export default new VRender.ContainerModule((bind, unbind, isBound, rebind) => {
  // text 渲染器注入contributions
  // bind(TextStickBeforeRenderContribution).toSelf().inSingletonScope();
  // bind(VRender.TextRenderContribution).toService(TextStickBeforeRenderContribution);

  // group 渲染器注入contributions
  bind(DateHeaderGroupBeforeRenderContribution).toSelf().inSingletonScope();
  bind(VRender.GroupRenderContribution).toService(DateHeaderGroupBeforeRenderContribution);
});
