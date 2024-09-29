import type { VNode } from 'vue';

export type TooltipProps = {
  renderMode?: 'html';
  isShowOverflowTextTooltip?: boolean;
  confine?: boolean;
};

export default function Tooltip(props: TooltipProps): VNode {
  return null;
}

Tooltip.symbol = 'Tooltip';
