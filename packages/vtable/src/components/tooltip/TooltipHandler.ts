import type { CellRange, RectProps } from '../../ts-types';
import type { Placement } from '../../ts-types';
import type { BaseTooltip } from './BaseTooltip';
import { BubbleTooltip } from './Tooltip';
import { cellInRange } from '../../tools/helper';
import { isMobile } from '../../tools/util';
// import { DG_EVENT_TYPE } from '../core/DG_EVENT_TYPE';
import type { TooltipOptions } from '../../ts-types/tooltip';
import { TABLE_EVENT_TYPE } from '../../core/TABLE_EVENT_TYPE';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { isFunction } from '@visactor/vutils';
const TOOLTIP_INSTANCE_FACTORY = {
  // tooltip(table: BaseTableAPI): BaseTooltip {
  //   return new Tooltip(table);
  // },
  'bubble-tooltip': function (table: BaseTableAPI): BaseTooltip {
    return new BubbleTooltip(table);
  }
};
type AttachInfo = {
  instance?: BaseTooltip;
  range: CellRange;
  tooltipOptions: TooltipOptions;
};
export interface ITooltipHandler {
  new (table: BaseTableAPI, confine: boolean): TooltipHandler;
}

export class TooltipHandler {
  private _table: BaseTableAPI;
  private _tooltipInstances?: { [type: string]: BaseTooltip };
  private _attachInfo?: AttachInfo | null;
  private confine?: boolean; //弹出框是否需要限定在canvas区域
  constructor(table: BaseTableAPI, confine: boolean) {
    this._table = table;
    this._tooltipInstances = {};
    this._bindTableEvent(table);
    this.confine = confine;
  }
  release(): void {
    const tooltipInstances = this._tooltipInstances;
    for (const k in tooltipInstances) {
      tooltipInstances[k]?.release?.();
    }
    delete this._tooltipInstances;
    this._attachInfo = null;
  }
  _bindToCell(col: number, row: number, tooltipOptions?: TooltipOptions): void {
    const info = this._attachInfo;
    const instance = this._getTooltipInstanceInfo(col, row);
    if (info && (!instance || info.instance !== instance)) {
      info.instance?.unbindTooltipElement();
      this._attachInfo = null;
    }
    if (!instance) {
      return;
    }
    // const { instance, info: tooltipInstanceInfo } = instanceInfo;
    const attach = instance && instance.bindTooltipElement(col, row, tooltipOptions, this.confine);
    if (attach) {
      const range = this._table.getCellRange(col, row);
      this._attachInfo = { range, instance, tooltipOptions };
    }
  }
  _move(col: number, row: number, tooltipOptions: TooltipOptions): void {
    const info = this._attachInfo;
    if (!info || !cellInRange(info.range, col, row)) {
      return;
    }
    const { instance } = info;
    instance?.moveTooltipElement(col, row, tooltipOptions, this.confine);
  }
  moveToPosition(
    col: number,
    row: number,
    position?: { x: number; y: number },
    referencePosition?: {
      rect: RectProps;
      placement?: Placement;
    }
  ): void {
    const info = this._attachInfo;
    if (!info || !cellInRange(info.range, col, row)) {
      return;
    }
    const { instance } = info;
    this._attachInfo.tooltipOptions.position = position;
    this._attachInfo.tooltipOptions.referencePosition = referencePosition;
    instance?.locateTooltipElement(col, row, position, referencePosition, this.confine);
  }
  _unbindFromCell(): void {
    const info = this._attachInfo;
    if (!info) {
      return;
    }
    const { instance } = info;
    instance?.unbindTooltipElement();
    this._attachInfo = null;
  }
  _isBindCell(col: number, row: number): boolean {
    const info = this._attachInfo;
    if (!info) {
      return false;
    }
    return cellInRange(info.range, col, row);
  }
  _bindTableEvent(table: BaseTableAPI): void {
    // (table.options.hover?.isShowTooltip || table.options.tooltip?.isShowOverflowTextTooltip) &&
    table.on(TABLE_EVENT_TYPE.MOUSEENTER_CELL, e => {
      //移动端不监听mousemove事件 （修改移动端tooltip时加的isMobile判断）
      if (isMobile()) {
        return;
      }
      // dropDownMenu区域不响应
      const { x1: left, x2: right, y1: top, y2: bottom } = table.stateManager.menu.bounds;
      if (
        table.stateManager.menu.isShow &&
        typeof e.x === 'number' &&
        typeof e.y === 'number' &&
        e.x > left &&
        e.x < right &&
        e.y > top &&
        e.y < bottom
      ) {
        return;
      }
      const { col, row } = e;
      this.showTooltip(col, row);
      // if (e.related) {
      //   if (this._isBindCell(col, row)) {
      //     return;
      //   }
      // }
    });
    table.on(TABLE_EVENT_TYPE.MOUSEMOVE_CELL, e => {
      //移动端不监听mousemove事件 （修改移动端tooltip时加的isMobile判断）
      if (isMobile()) {
        return;
      }
      if (this._attachInfo?.tooltipOptions?.referencePosition) {
        const position = this._attachInfo.tooltipOptions.referencePosition;
        const { event } = e;
        const { left, right, top, bottom } = position.rect;
        const abstractPos = table._getMouseAbstractPoint(event, false);
        if (
          !(
            abstractPos.inTable &&
            abstractPos.x >= left - 5 &&
            abstractPos.x <= right + 5 &&
            abstractPos.y >= top - 5 &&
            abstractPos.y <= bottom + 5
          )
        ) {
          // 这里加5px的判断buffer
          this._unbindFromCell();
        }
      }
      // dropDownMenu区域不响应
      if (this._attachInfo && table.stateManager.menu.isShow) {
        this._bindToCell(e.col, e.row);
      }
    });
    table.on(TABLE_EVENT_TYPE.MOUSELEAVE_CELL, e => {
      // if (e.related) {
      //   if (this._isBindCell(e.related.col, e.related.row)) {
      //     return;
      //   }
      // }
      this._unbindFromCell();
    });
    table.on(TABLE_EVENT_TYPE.SELECTED_CELL, e => {
      if (this._isBindCell(e.col, e.row)) {
        this._unbindFromCell();
      }
    });
    table.on(TABLE_EVENT_TYPE.MOUSELEAVE_TABLE, e => {
      this._unbindFromCell();
    });
    table.on(TABLE_EVENT_TYPE.SCROLL, e => {
      this._unbindFromCell();
      // const info = this._attachInfo;
      // if (info?.tooltipOptions && info?.range?.start) {
      //   const { col, row } = info.range.start;
      //   const rect = table.getCellRangeRelativeRect({ col, row });
      //   info.tooltipOptions.referencePosition.rect = rect;
      //   this._move(info.range.start.col, info.range.start.row, info.tooltipOptions);
      // }
    });
  }
  showTooltip(col: number, row: number) {
    let tooltipOption;
    const table = this._table;
    const headerDescription = table.getHeaderDescription(col, row);
    if (headerDescription) {
      const rect = table.getCellRangeRelativeRect({ col, row });
      tooltipOption = {
        content: headerDescription,
        referencePosition: {
          placement: table.internalProps.tooltip.position,
          rect
        },
        disappearDelay: table.internalProps.tooltip.overflowTextTooltipDisappearDelay ?? 0,
        style: table.theme.tooltipStyle
      };
    } else if (
      isFunction(table.internalProps.tooltip?.isShowOverflowTextTooltip)
        ? table.internalProps.tooltip.isShowOverflowTextTooltip(col, row, table)
        : table.internalProps.tooltip.isShowOverflowTextTooltip
    ) {
      const overflowText = table.getCellOverflowText(col, row);
      const rect = table.getCellRangeRelativeRect({ col, row });
      if (overflowText) {
        tooltipOption = {
          content: headerDescription
            ? `${headerDescription}
  ${overflowText}`
            : overflowText,
          referencePosition: {
            placement: table.internalProps.tooltip.position,
            rect
          },
          disappearDelay: table.internalProps.tooltip.overflowTextTooltipDisappearDelay ?? 0,
          style: table.theme.tooltipStyle
        };
      }
    }
    if (tooltipOption) {
      this._bindToCell(col, row, tooltipOption);
    } else {
      this._unbindFromCell();
    }
  }
  _getTooltipInstanceInfo(col: number, row: number): BaseTooltip | null {
    const table = this._table;
    const tooltipInstances = this._tooltipInstances;
    // const info = getTooltipInstanceInfo(table, col, row, tooltipOptions);
    // if (!info) {
    //   return null;
    // }
    const tooltipType = 'bubble-tooltip';
    // const { tooltipType } = info;
    const instance =
      (tooltipInstances && tooltipInstances[tooltipType]) ||
      (tooltipInstances && (tooltipInstances[tooltipType] = TOOLTIP_INSTANCE_FACTORY[tooltipType](table)));
    return instance;
  }
  isBinded(tooltipOptions: TooltipOptions) {
    if (JSON.stringify(tooltipOptions) === JSON.stringify(this._attachInfo?.tooltipOptions)) {
      return true;
    }
    return false;
  }
}
