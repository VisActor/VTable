import { GroupRenderContribution } from '@visactor/vtable/es/vrender';

import { DateHeaderGroupBeforeRenderContribution } from './group-contribution-render';

export default ({ bind }: any) => {
  // text 渲染器注入contributions
  // bind(TextStickBeforeRenderContribution).toSelf().inSingletonScope();
  // bind(TextRenderContribution).toService(TextStickBeforeRenderContribution);

  // group 渲染器注入contributions
  bind(DateHeaderGroupBeforeRenderContribution).toSelf().inSingletonScope();
  bind(GroupRenderContribution).toService(DateHeaderGroupBeforeRenderContribution);
};
