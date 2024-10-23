import { EventHandler } from '../../../event/EventHandler';
import type { RectProps } from '../../../ts-types';
import { Placement } from '../../../ts-types';
import { createElement } from '../../../tools/dom';
import { importStyle } from './BubbleTooltipElementStyle';
import { isDivSelected, isMobile } from '../../../tools/util';
import type { TooltipOptions } from '../../../ts-types/tooltip';
import type { BaseTableAPI } from '../../../ts-types/base-table';
importStyle();
const TOOLTIP_CLASS = 'vtable__bubble-tooltip-element';
const CONTENT_CLASS = `${TOOLTIP_CLASS}__content`;
const TRIANGLE_CLASS = `${TOOLTIP_CLASS}__triangle`;
const HIDDEN_CLASS = `${TOOLTIP_CLASS}--hidden`;
const SHOWN_CLASS = `${TOOLTIP_CLASS}--shown`;

export class BubbleTooltipElement {
  private _handler: EventHandler;
  private _rootElement?: HTMLElement;
  private _messageElement?: HTMLElement;
  private _triangleElement?: HTMLElement;
  private _disappearDelay?: number; // 提示框延迟多久消失
  private _disappearDelayId?: any;
  constructor() {
    this._handler = new EventHandler();
    const rootElement = (this._rootElement = createElement('div', [TOOLTIP_CLASS, HIDDEN_CLASS]));
    const messageElement = createElement('div', [CONTENT_CLASS]);
    const triangle = createElement('span', [TRIANGLE_CLASS]);
    rootElement.appendChild(triangle);
    rootElement.appendChild(messageElement);
    this._messageElement = <HTMLElement>rootElement.querySelector(`.${CONTENT_CLASS}`) || undefined;
    this._triangleElement = <HTMLElement>rootElement.querySelector(`.${TRIANGLE_CLASS}`) || undefined;

    rootElement.addEventListener('mousemove', () => {
      this._disappearDelayId && clearTimeout(this._disappearDelayId);
    });
    rootElement.addEventListener('mouseleave', () => {
      this._disappearDelay = undefined;
      this.unbindFromCell();
    });

    messageElement.addEventListener('wheel', e => {
      e.stopPropagation();
    });
    messageElement.addEventListener('copy', e => {
      const isSelected = isDivSelected(messageElement as HTMLDivElement); // 判断tooltip弹框内容是否有选中
      if (isSelected) {
        e.stopPropagation();
      }
    });
  }
  bindToCell(
    table: BaseTableAPI,
    col: number,
    row: number,
    tooltipInstanceInfo: TooltipOptions,
    confine: boolean
  ): boolean {
    this._disappearDelay = tooltipInstanceInfo?.disappearDelay;
    this._disappearDelayId && clearTimeout(this._disappearDelayId);
    const rootElement = this._rootElement;
    const messageElement = this._messageElement;
    const triangle = this._triangleElement;

    rootElement?.classList.remove(SHOWN_CLASS);
    rootElement?.classList.add(HIDDEN_CLASS);
    if (this._canBindToCell(table, col, row)) {
      //设置style及类名
      messageElement.setAttribute('style', '');
      triangle.setAttribute('style', '');
      tooltipInstanceInfo?.className && rootElement.classList.add(tooltipInstanceInfo.className);
      tooltipInstanceInfo?.style?.bgColor &&
        (messageElement.style.backgroundColor = tooltipInstanceInfo?.style?.bgColor);
      tooltipInstanceInfo?.style?.bgColor && (triangle.style.backgroundColor = tooltipInstanceInfo?.style?.bgColor);
      triangle.style.display = tooltipInstanceInfo?.style?.arrowMark === true ? 'block' : 'none';
      tooltipInstanceInfo?.style?.fontSize &&
        (messageElement.style.fontSize = (tooltipInstanceInfo?.style?.fontSize ?? 12) + 'px');
      tooltipInstanceInfo?.style?.fontFamily &&
        (messageElement.style.fontFamily = tooltipInstanceInfo?.style?.fontFamily);
      tooltipInstanceInfo?.style?.color && (messageElement.style.color = tooltipInstanceInfo?.style?.color);
      tooltipInstanceInfo?.style?.padding &&
        (messageElement.style.padding = `${tooltipInstanceInfo?.style?.padding.join('px ')}px`);
      tooltipInstanceInfo?.style?.maxHeight &&
        (messageElement.style.maxHeight = `${tooltipInstanceInfo?.style?.maxHeight}px`);
      tooltipInstanceInfo?.style?.maxWidth &&
        (messageElement.style.maxWidth = `${tooltipInstanceInfo?.style?.maxWidth}px`);
      messageElement && (messageElement.textContent = tooltipInstanceInfo?.content);
      const binded = this._bindToCell(
        table,
        col,
        row,
        tooltipInstanceInfo?.position,
        tooltipInstanceInfo?.referencePosition,
        confine,
        tooltipInstanceInfo?.style?.arrowMark
      );
      if (binded) {
        rootElement?.classList.add(SHOWN_CLASS);
        rootElement?.classList.remove(HIDDEN_CLASS);
        return true;
      }
    } else {
      this.unbindFromCell();
    }
    return false;
  }
  release(): void {
    this.unbindFromCell();

    const rootElement = this._rootElement;
    if (rootElement?.parentElement) {
      rootElement.parentElement.removeChild(rootElement);
    }

    this._handler?.release?.();
    delete this._rootElement;
    delete this._messageElement;
  }
  move(table: BaseTableAPI, col: number, row: number, tooltipOptions?: TooltipOptions, confine?: boolean): void {
    const rootElement = this._rootElement;
    if (this._canBindToCell(table, col, row)) {
      this._bindToCell(table, col, row, tooltipOptions?.position, tooltipOptions?.referencePosition, confine);
      rootElement?.classList.add(SHOWN_CLASS);
      rootElement?.classList.remove(HIDDEN_CLASS);
    } else {
      this.unbindFromCell();
    }
  }
  unbindFromCell(): void {
    if (this._disappearDelay) {
      this._disappearDelayId = setTimeout(() => {
        const rootElement = this._rootElement;
        if (rootElement?.parentElement) {
          rootElement.classList.remove(SHOWN_CLASS);
          rootElement.classList.add(HIDDEN_CLASS);
        }
      }, this._disappearDelay ?? 0);
    } else {
      const rootElement = this._rootElement;
      if (rootElement?.parentElement) {
        rootElement.classList.remove(SHOWN_CLASS);
        rootElement.classList.add(HIDDEN_CLASS);
      }
    }
  }
  _canBindToCell(table: BaseTableAPI, col: number, row: number): boolean {
    const rect = table.getCellRangeRelativeRect({ col, row });
    const element = table.getElement();
    const { bottom, left, right, top } = rect;
    // const { frozenRowCount, frozenColCount } = table;
    // if (row >= frozenRowCount && frozenRowCount > 0) {
    //   const frozenRect = table.getCellRangeRelativeRect({ col, row: frozenRowCount - 1 });
    //   if (bottom < frozenRect.bottom) {
    //     // 范围外
    //     return false;
    //   }
    // } else if (bottom < 0) {
    //   // 范围外
    //   return false;
    // }
    // if (col >= frozenColCount && frozenColCount > 0) {
    //   const frozenRect = table.getCellRangeRelativeRect({ col: frozenColCount - 1, row });
    //   if (right < frozenRect.right) {
    //     //整个是被冻结列盖住的 不需要提示toolTip
    //     return false;
    //   }
    // } else if (left < 0) {
    //   return false;
    // }

    if (table.isFrozenCell(col, row)) {
      return true;
    } else if (
      bottom < table.getFrozenRowsHeight() ||
      right < table.getFrozenColsWidth() ||
      left > table.tableNoFrameWidth - table.getRightFrozenColsWidth() ||
      top > table.tableNoFrameHeight - table.getBottomFrozenRowsHeight()
    ) {
      // 范围外
      return false;
    }
    const { offsetHeight, offsetWidth } = element;
    if (top > offsetHeight) {
      return false;
    }
    if (left > offsetWidth) {
      return false;
    }
    return true;
  }
  _bindToCell(
    table: BaseTableAPI,
    col: number,
    row: number,
    position?: { x: number; y: number },
    referencePosition?: { rect: RectProps; placement?: Placement },
    confine?: boolean,
    arrowMark?: boolean
  ): boolean {
    const rootElement = this._rootElement;
    const rect = table.getCellRangeRelativeRect({ col, row });
    const element = table.internalProps.tooltip.parentElement;
    const containerWidth = table.internalProps.element.offsetWidth;
    const { width } = rect;
    if (rootElement) {
      if (rootElement.parentElement !== element) {
        element.appendChild(rootElement);
      }
      rootElement.style.left = `0px`;
      // 边界碰撞检测
      let tooltipY: number;
      let tooltipX: number;
      //设置最宽尺寸
      const maxWidth = Math.min(containerWidth * 0.8, width * 4);
      rootElement.style.maxWidth = `${maxWidth}px`;
      //计算弹出框的宽度
      const rootElementWidth = rootElement.clientWidth; //Math.min(Math.max(rootElement.clientWidth, width), maxWidth);
      const rootElementHeight = rootElement.clientHeight;
      if (position || referencePosition) {
        const tooltipPosition = this.getComputedPosition(
          table,
          col,
          row,
          position,
          referencePosition,
          confine,
          arrowMark
        );
        tooltipX = tooltipPosition.x;
        tooltipY = tooltipPosition.y;
      } else {
        return false;
      }

      rootElement.style.left = `${tooltipX}px`;
      rootElement.style.top = `${tooltipY}px`;
      // rootElement.style.width=rootElementWidth+'px';
      if (isMobile()) {
        rootElement.style.fontSize = '11px';
      }

      // 判断当前tooltip范围是否与tooltip重合
      const { x1: menuLeft, x2: menuRight, y1: menuTop, y2: menuBottom } = table.stateManager.menu.bounds;
      const tooltipLeft = tooltipX;
      const tooltipRight = tooltipLeft + rootElementWidth;
      const tooltipTop = tooltipY;
      const tooltipBottom = tooltipLeft + rootElementHeight;
      if (
        table.stateManager.menu.isShow &&
        menuLeft < tooltipRight &&
        menuRight > tooltipLeft &&
        menuBottom > tooltipTop &&
        menuTop < tooltipBottom
      ) {
        return false;
      }
      return true;
    }
    return false;
  }
  private getComputedPosition(
    table: BaseTableAPI,
    col: number,
    row: number,
    position?: { x: number; y: number },
    referencePosition?: { rect: RectProps; placement?: Placement },
    confine?: boolean,
    arrowMark?: boolean
  ) {
    const rootElement = this._rootElement;
    const rect = table.getCellRangeRelativeRect({ col, row });
    const { x: parentX, y: parentY } = table.internalProps.tooltip.parentElement.getBoundingClientRect();
    const {
      width: containerWidth,
      height: containerHeight,
      x,
      y
    } = table.internalProps.element.getBoundingClientRect();
    // const { width: containerWidth, height: containerHeight } = document.body.getBoundingClientRect();
    const { width } = rect;
    // 边界碰撞检测
    let tooltipY: number;
    let tooltipX: number;
    //设置最宽尺寸
    const maxWidth = Math.min(containerWidth * 0.8, width * 4);
    rootElement.style.maxWidth = `${maxWidth}px`;
    //计算弹出框的宽度
    const rootElementWidth = rootElement.clientWidth; //Math.min(Math.max(rootElement.clientWidth, width), maxWidth);
    const rootElementHeight = rootElement.clientHeight;
    // this._triangleElement.setAttribute('style', '');
    const triangleHeight = arrowMark ? 6 : 0;
    if (position) {
      tooltipX = position.x;
      tooltipY = position.y + triangleHeight;
      this._triangleElement.style.left = '50%';
      this._triangleElement.style.marginLeft = '-5px';
      this._triangleElement.style.top = '-5px';
    } else if (referencePosition) {
      let placement = referencePosition.placement ?? Placement.bottom;
      const referenceXMiddle = referencePosition.rect.left + referencePosition.rect.width / 2;
      const referenceYMiddle = referencePosition.rect.top + referencePosition.rect.height / 2;
      const referenceTop = referencePosition.rect.top;
      const referenceBottom = referencePosition.rect.bottom;
      const referenceLeft = referencePosition.rect.left;
      const referenceRight = referencePosition.rect.right;

      let callCount = 0;
      /** 根据placement计算弹出框的位置 躲避策略[dom的这块先去除 dom可以超出显示]：根据顺时针方向依次检测placement */
      const adjustPosition = () => {
        callCount++;
        if (callCount >= 4) {
          return;
        }
        this.removeStyleFromTriangle();
        if (placement === Placement.top) {
          tooltipX = referenceXMiddle - rootElementWidth / 2;
          tooltipY = referenceTop - rootElementHeight - triangleHeight;
          this._triangleElement.style.left = '50%';
          this._triangleElement.style.marginLeft = '-5px';
          this._triangleElement.style.bottom = '-5px';

          // 判断如果超出左右范围则靠边显示
          if (confine && tooltipY < 0) {
            placement = Placement.right;
            adjustPosition();
          }
        } else if (placement === Placement.bottom) {
          tooltipX = referenceXMiddle - rootElementWidth / 2;
          tooltipY = referenceBottom + triangleHeight;
          this._triangleElement.style.left = '50%';
          this._triangleElement.style.marginLeft = '-5px';
          this._triangleElement.style.top = '-5px';
          if (confine && tooltipY + rootElementHeight > containerHeight) {
            placement = Placement.left;
            adjustPosition();
          }
        } else if (placement === Placement.left) {
          tooltipY = referenceYMiddle - rootElementHeight / 2;
          tooltipX = referenceLeft - rootElementWidth - triangleHeight;
          this._triangleElement.style.top = '50%';
          this._triangleElement.style.marginTop = '-5px';
          this._triangleElement.style.right = '-5px';
          if (confine && tooltipX < 0) {
            placement = Placement.top;
            adjustPosition();
          }
        } else if (placement === Placement.right) {
          tooltipY = referenceYMiddle - rootElementHeight / 2;
          tooltipX = referenceRight + triangleHeight;
          this._triangleElement.style.top = '50%';
          this._triangleElement.style.marginTop = '-5px';
          this._triangleElement.style.left = '-5px';
          if (confine && tooltipX + rootElementWidth > containerWidth) {
            placement = Placement.bottom;
            adjustPosition();
          }
        }
      };
      adjustPosition();
    }
    // 判断如果超出左右范围则靠边显示
    if (confine) {
      if (tooltipX < 0) {
        tooltipX = 0;
      } else if (tooltipX + rootElement.offsetWidth > containerWidth) {
        tooltipX = containerWidth - rootElement.offsetWidth;
      }
    }
    return {
      x: tooltipX + x - parentX,
      y: tooltipY + y - parentY
    };
  }
  private removeStyleFromTriangle() {
    this._triangleElement.style.left = '';
    this._triangleElement.style.right = '';
    this._triangleElement.style.top = '';
    this._triangleElement.style.bottom = '';
    this._triangleElement.style.marginLeft = '';
    this._triangleElement.style.marginTop = '';
  }
  _locate(
    table: BaseTableAPI,
    col: number,
    row: number,
    position?: { x: number; y: number },
    referencePosition?: {
      rect: RectProps;
      placement?: Placement;
    },
    confine?: boolean
  ) {
    const tooltipPosition = this.getComputedPosition(table, col, row, position, referencePosition, confine);
    const tooltipX = tooltipPosition.x;
    const tooltipY = tooltipPosition.y;
    this._rootElement.style.left = `${tooltipX}px`;
    this._rootElement.style.top = `${tooltipY}px`;
  }
}
