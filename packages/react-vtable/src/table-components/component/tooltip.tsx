import type { BaseComponentProps } from '../base-component';
import { createComponent } from '../base-component';

export type TooltipProps = {
  /** html目前实现较完整 先默认html渲染方式 */
  renderMode?: 'html'; // 目前暂不支持canvas方案
  /** 代替原来hover:isShowTooltip配置 暂时需要将renderMode配置为html才能显示，canvas的还未开发*/
  isShowOverflowTextTooltip?: boolean;
  /** 是否将 tooltip 框限制在画布区域内，默认开启。针对renderMode:"html"有效 */
  confine?: boolean;
} & BaseComponentProps;

export const Tooltip = createComponent<TooltipProps>('Tooltip', 'tooltip', undefined, true);
