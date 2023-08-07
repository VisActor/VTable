import type { Placement, RectProps } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { TooltipOptions } from '../../ts-types/tooltip';
import type { BubbleTooltipElement } from './logic/BubbleTooltipElement';

export abstract class BaseTooltip {
  private _table: BaseTableAPI;
  private _tooltipElement?: BubbleTooltipElement;
  constructor(table: BaseTableAPI) {
    this._table = table;
  }
  release(): void {
    this.unbindTooltipElement();
    if (this._tooltipElement) {
      this._tooltipElement.release?.();
    }
    this._tooltipElement = undefined;
  }
  private _getTooltipElement(): BubbleTooltipElement {
    if (this._tooltipElement) {
      return this._tooltipElement;
    }
    this._tooltipElement = this.createTooltipElementInternal();
    return this._tooltipElement;
  }
  abstract createTooltipElementInternal(): BubbleTooltipElement;
  bindTooltipElement(col: number, row: number, tooltipInstanceInfo: TooltipOptions, confine?: boolean): boolean {
    const tooltipElement = this._getTooltipElement();
    return tooltipElement.bindToCell(this._table, col, row, tooltipInstanceInfo, confine);
  }
  moveTooltipElement(col: number, row: number, tooltipOptions: TooltipOptions, confine?: boolean): void {
    const tooltipElement = this._getTooltipElement();
    tooltipElement.move(this._table, col, row, tooltipOptions, confine);
  }
  unbindTooltipElement(): void {
    const tooltipElement = this._getTooltipElement();
    tooltipElement.unbindFromCell();
  }
  locateTooltipElement(
    col: number,
    row: number,
    position?: { x: number; y: number },
    referencePosition?: {
      rect: RectProps;
      placement?: Placement;
    },
    confine?: boolean
  ): void {
    const tooltipElement = this._getTooltipElement();
    tooltipElement._locate(this._table, col, row, position, referencePosition, confine);
  }
}
