import { contributionRegistry, GroupRenderContribution } from '@visactor/vtable/es/vrender';

import { DateHeaderGroupBeforeRenderContribution } from './group-contribution-render';

export default function registerGroupContributions() {
  contributionRegistry.register(GroupRenderContribution, new DateHeaderGroupBeforeRenderContribution());
}
