import { EventHandler } from '../../../../event/EventHandler';
import type { MenuInstanceInfo, Placement, RectProps } from '../../../../ts-types';
import { createElement } from '../../../../tools/dom';
import { TABLE_EVENT_TYPE } from '../../../../core/TABLE_EVENT_TYPE';
import type { PivotHeaderLayoutMap } from '../../../../layout/pivot-header-layout';
import type { BaseTableAPI } from '../../../../ts-types/base-table';

const CLASSNAME = 'vtable__menu-element';
const HIDDEN_CLASSNAME = `${CLASSNAME}--hidden`;
const SHOWN_CLASSNAME = `${CLASSNAME}--shown`;

function createMenuDomElement(): HTMLElement {
  const rootElement = createElement('div', [CLASSNAME, HIDDEN_CLASSNAME]);
  return rootElement;
}

export class MenuContainer {
  private _handler: EventHandler;
  private _rootElement?: HTMLElement;
  private _menuInstanceInfo?: MenuInstanceInfo;
  constructor(table: BaseTableAPI) {
    this._handler = new EventHandler();
    this._rootElement = createMenuDomElement();

    // 鼠标在菜单上滚动阻止冒泡
    this._rootElement.addEventListener('wheel', e => {
      e.stopPropagation();
    });
    // 绑定交互事件
    this._rootElement?.addEventListener('mousedown', e => {
      e.stopPropagation();
      e.preventDefault();
    });
    this._rootElement?.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      if (this._rootElement.classList.contains(HIDDEN_CLASSNAME)) {
        return;
      }
      // console.log('menu mousedown', e);
      // 触发菜单条目点击事件
      const { col, row, dropDownIndex, menuKey, text, hasChildren } = e.target as any;
      if (typeof dropDownIndex !== 'number' || hasChildren) {
        e.stopPropagation();
        return;
      }
      // const field = table.getHeaderField(col, row);
      const field = table.isPivotTable()
        ? (table.internalProps.layoutMap as PivotHeaderLayoutMap).getPivotDimensionInfo(col, row)
        : table.getHeaderField(col, row);

      const highlight = table._dropDownMenuIsHighlight(col, row, dropDownIndex);
      table.fireListeners(TABLE_EVENT_TYPE.DROPDOWN_MENU_CLICK, {
        col,
        row,
        field: <string>field,
        menuKey,
        // fieldKey,
        // dropDownIndex,
        text,
        highlight,
        cellLocation: table.getCellLocation(col, row),
        event: e
      });

      table.fireListeners(TABLE_EVENT_TYPE.DROPDOWN_MENU_CLEAR, null); // 清除菜单
      table.fireListeners(TABLE_EVENT_TYPE.HIDE_MENU, null); // 清除菜单
      // table.invalidateCell(col, row); // 更新状态图表
      e.stopPropagation();
    });
    this._rootElement?.addEventListener('mousemove', e => {
      if (this._rootElement.classList.contains(HIDDEN_CLASSNAME)) {
        return;
      }
      // console.log('menu mousemove', e);
      // table.hoverIcon = undefined;

      e.stopPropagation();
    });
    // this._rootElement?.addEventListener('mouseenter', () => {
    //   if (this._rootElement.classList.contains(HIDDEN_CLASSNAME)) return;
    //   if (!table.hoverIcon) return;
    //   // console.log('menu mousemove', e);
    //   table.showHoverIcon = table.hoverIcon;
    //   table.hoverIcon = undefined; // 避免在hover icon后不能交互表格区域
    //   table.invalidateCell(table.showHoverIcon.col, table.showHoverIcon.row);
    //   // console.log('showHoverIcon', table.showHoverIcon);
    // });
    // this._rootElement?.addEventListener('blur', () => {
    //   // table.fireListeners(LG_EVENT_TYPE.DROPDOWN_MENU_CLEAR, null); // 清除菜单
    //   table.showHoverIcon = undefined;
    // });
  }
  get rootElement() {
    return this._rootElement;
  }
  release(): void {
    this.unbindFromCell();

    const rootElement = this._rootElement;
    if (rootElement?.parentElement) {
      rootElement.parentElement.removeChild(rootElement);
    }

    this._handler.release();
    delete this._rootElement;
    // delete this._messageElement;
  }
  bindToCell(table: BaseTableAPI, col: number, row: number, menuInstanceInfo: MenuInstanceInfo): boolean {
    const rootElement = this._rootElement;
    this._menuInstanceInfo = menuInstanceInfo;
    // const messageElement = this._messageElement;

    rootElement?.classList.remove(SHOWN_CLASSNAME);
    rootElement?.classList.add(HIDDEN_CLASSNAME);

    if (this._canBindToCell(table, col, row)) {
      rootElement.innerHTML = '';
      rootElement.appendChild(<HTMLElement>menuInstanceInfo.content);

      const binded = this._bindCell(table, col, row, menuInstanceInfo.position, menuInstanceInfo.referencePosition);

      if (binded) {
        rootElement?.classList.add(SHOWN_CLASSNAME);
        rootElement?.classList.remove(HIDDEN_CLASSNAME);
        return true;
      }
    } else {
      this.unbindFromCell();
    }
    return false;
  }
  unbindFromCell(): void {
    const rootElement = this._rootElement;
    this._menuInstanceInfo = undefined;
    if (rootElement?.parentElement) {
      // rootElement.parentElement.removeChild(rootElement);
      rootElement.classList.remove(SHOWN_CLASSNAME);
      rootElement.classList.add(HIDDEN_CLASSNAME);
    }
  }
  _canBindToCell(table: BaseTableAPI, col: number, row: number): boolean {
    const rect = table.getCellRangeRelativeRect({ col, row });
    // const element = table.getElement();
    const element = table.internalProps.menu.parentElement ?? table.getElement();
    const { top, bottom, left, right } = rect;
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
    if (offsetHeight < top) {
      return false;
    }
    if (offsetWidth < left) {
      return false;
    }
    return true;
  }
  _bindCell(
    table: BaseTableAPI,
    col: number,
    row: number,
    position: { x: number; y: number },
    referencePosition: { rect: RectProps; placement?: Placement }
  ): boolean {
    const rootElement = this._rootElement;
    // const element = table.getElement(); // container element
    const element = table.internalProps.menu.parentElement ?? table.getElement();
    const {
      width: containerWidth,
      height: containerHeight,
      left: containerLeft,
      top: containerTop
    } = element.getBoundingClientRect();
    if (rootElement) {
      if (rootElement.parentElement !== element) {
        element.appendChild(rootElement); // 之前在做dom边缘躲避的时候放到了table.getParentElement()上，但发现不是相对定位导致位置错位
      }
      rootElement.style.left = `0px`;
      //设置最宽尺寸
      const maxWidth = containerWidth * 0.8;
      rootElement.style.maxWidth = `${maxWidth}px`;
      //计算弹出框的宽度
      const rootElementWidth = rootElement.clientWidth;
      const rootElementHeight = rootElement.clientHeight;
      let rootElementLeft;
      let rootElementTop;
      if (position) {
        rootElementLeft = position.x;
        rootElementTop = position.y;
      }
      if (referencePosition) {
        rootElementLeft = referencePosition.rect.right - rootElementWidth;
        rootElementTop = referencePosition.rect.bottom;
      }
      //  rootElementLeft = position.x - rootElementWidth;
      // let leftStyle = rootElementLeft;
      // 检测下方能否容纳，不能容纳向上偏移
      if (rootElementTop + rootElementHeight > containerHeight) {
        rootElementTop = containerHeight - rootElementHeight;
        rootElementLeft += rootElementWidth - 2;
      }
      // 偏移后上方超出canvas范围，居中显示
      if (rootElementTop < 0) {
        rootElementTop = rootElementTop / 2;
      }

      let deltaTop = 0;
      let deltaLeft = 0;
      if (table.getElement() !== element) {
        const { left, top } = table.getElement().getBoundingClientRect();
        deltaTop = top - containerTop;
        deltaLeft = left - containerLeft;
      }

      rootElement.style.top = `${rootElementTop + deltaTop}px`;

      // 判断如果超出左右范围则靠边显示
      if (rootElementLeft < 0) {
        rootElementLeft = 0;
      } else if (rootElementLeft + rootElementWidth > containerWidth) {
        rootElementLeft = containerWidth - rootElementWidth;
      }
      rootElement.style.left = `${rootElementLeft + deltaLeft}px`;

      return true;
    }
    return false;
  }
  /** 鼠标坐标位置 是否位于下拉菜单内 */
  pointInMenuElement(x: number, y: number): boolean {
    const rootElement = this._rootElement;

    const { x: rootLeft, y: rootTop, width: rootWidth, height: rootHeight } = rootElement.getBoundingClientRect();
    if (x > rootLeft - 5 && x < rootLeft + rootWidth + 5 && y > rootTop - 5 && y < rootTop + rootHeight + 5) {
      return true;
    }

    return false;
  }
}
