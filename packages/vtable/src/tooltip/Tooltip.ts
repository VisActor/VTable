import { BaseTooltip } from './BaseTooltip';
import { BubbleTooltipElement } from './logic/BubbleTooltipElement';

// export class Tooltip extends BaseTooltip {
//   createTooltipElementInternal(): TooltipElement {
//     return new TooltipElement();
//   }
// }

export class BubbleTooltip extends BaseTooltip {
  createTooltipElementInternal(): BubbleTooltipElement {
    return new BubbleTooltipElement();
  }
}
