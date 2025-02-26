import type { CellRange, DropDownMenuOptions, MenuInstanceInfo, MenuInstanceType } from '../../../ts-types';
import type { BaseMenu } from './BaseMenu';
import { Container, Menu } from './Menu';
import { cellInRange } from '../../../tools/helper';
import { TABLE_EVENT_TYPE } from '../../../core/TABLE_EVENT_TYPE';
import type { BaseTableAPI, HeaderData } from '../../../ts-types/base-table';
// import { DEFAULTFONT } from '../../tools/global';
// import { getFontSize } from '../../tools/canvases';

const MENU_INSTANCE_FACTORY = {
  'dropdown-menu': function (table: BaseTableAPI): BaseMenu {
    return new Menu(table);
  },
  'context-menu': function (table: BaseTableAPI): BaseMenu {
    return new Menu(table);
  },
  container(table: BaseTableAPI): BaseMenu {
    return new Container(table);
  }
};

/** 获取下拉菜单展示内容及坐标位置 */
function getMenuInstanceInfo(
  table: BaseTableAPI,
  col: number,
  row: number,
  type: MenuInstanceType,
  dropDownMenuOptions?: DropDownMenuOptions
): MenuInstanceInfo | null {
  const { lineHeight, textBaseline, textStick } = table._getCellStyle(col, row);
  // table.internalProps.layoutMap.getHeader(col, row).style ?? {};
  // const lineHeight = getFontSize(table.getContext(), font).height;
  let rect = table.getCellRangeRelativeRect(table.getCellRange(col, row));
  if (textStick) {
    rect = table.getVisibleCellRangeRelativeRect({ col, row });
  }

  let { left, right, bottom, top, width, height } = rect;
  if (table.isHeader(col, row)) {
    ({ left, right, bottom, top, width, height } = table.internalProps.headerHelper.getDropDownIconRect(
      rect,
      // paddingArray[1]
      lineHeight as number,
      textBaseline || 'middle'
    ));
  }
  if (dropDownMenuOptions?.content) {
    //如果有指定的下拉菜单内容
    return {
      type,
      position: dropDownMenuOptions.position,
      referencePosition: dropDownMenuOptions.referencePosition ?? {
        rect: {
          left,
          right,
          top,
          bottom,
          width,
          height
        }
      },
      content: dropDownMenuOptions.content
    };
  } // 没有指定的下拉菜单 从headerLayout中获取下拉菜单内容
  else if (type === 'dropdown-menu') {
    // 获取下拉菜单信息及位置 注：这里逻辑特指内置的下拉菜单
    let dropDownMenu = table.globalDropDownMenu;
    const headerData = table._getHeaderLayoutMap(col, row) as HeaderData;
    dropDownMenu = headerData.dropDownMenu ?? dropDownMenu;
    const pivotInfo = headerData.pivotInfo;

    if (typeof dropDownMenu === 'function') {
      dropDownMenu = dropDownMenu({ row, col, table });
    }
    // const x = (left + right) / 2;
    // const y = bottom;

    return {
      type,
      // position: {
      //   x,
      //   y,
      // },
      referencePosition: {
        rect: {
          left,
          right,
          top,
          bottom,
          width,
          height
        }
      },
      content: dropDownMenu,
      pivotInfo
    };
  }
  // else if (type === 'context-menu') {
  //   // 获取右键菜单信息及位置
  //   const abstractPos = table._getMouseAbstractPoint(event, false);
  //   let menu = null;
  //   if (abstractPos && typeof table.options.contextmenu === 'function') {
  //     menu = table.options.contextmenu(table.getHeaderField(col, row) as string, row);
  //   } else if (abstractPos && Array.isArray(table.options.contextmenu)) {
  //     menu = table.options.contextmenu;
  //   }
  //   return {
  //     position: {
  //       x: abstractPos.x,
  //       y: abstractPos.y,
  //     },
  //     type,
  //     content: menu,
  //   };
  // }
  return null;
}

type AttachInfo = {
  instance?: BaseMenu;
  range: CellRange;
};

export interface IMenuHandler {
  new (table: BaseTableAPI): MenuHandler;
}
export class MenuHandler {
  private _table: BaseTableAPI;
  private _menuInstances?: { [type: string]: BaseMenu };
  private _attachInfo?: AttachInfo | null;
  constructor(table: BaseTableAPI) {
    this._table = table;
    this._menuInstances = {};
    this._bindTableEvent(table);
  }
  release(): void {
    const menuInstances = this._menuInstances;
    for (const k in menuInstances) {
      menuInstances[k].release();
    }
    delete this._menuInstances;
    this._attachInfo = null;
  }
  _bindToCell(col: number, row: number, type: MenuInstanceType, dropDownMenuOptions?: DropDownMenuOptions): void {
    const info = this._attachInfo;
    const instanceInfo = this._getMenuInstanceInfo(col, row, type, dropDownMenuOptions);
    if (info && (!instanceInfo || info.instance !== instanceInfo.instance)) {
      info.instance?.unbindMenuElement();
      this._attachInfo = null;
    }
    if (!instanceInfo) {
      return;
    }
    const { instance, info: menuInstanceInfo } = instanceInfo;
    const attach = instance && instance.bindMenuElement(col, row, menuInstanceInfo);
    if (attach) {
      const range = this._table.getCellRange(col, row);
      this._attachInfo = { range, instance };
    }
  }
  _unbindFromCell(): void {
    const info = this._attachInfo;
    if (!info) {
      return;
    }
    const { instance } = info;
    instance?.unbindMenuElement();
    this._attachInfo = null;
    // this._table.showHoverIcon = undefined;
  }
  _isBindToCell(col: number, row: number): boolean {
    const info = this._attachInfo;
    if (!info) {
      return false;
    }
    return cellInRange(info.range, col, row);
  }
  /** 鼠标坐标位置 是否位于下拉菜单内 */
  pointInMenuElement(x: number, y: number) {
    if (!this._attachInfo) {
      return false;
    }
    const info = this._attachInfo;
    const { instance } = info;
    return instance.pointInMenuElement(x, y);
  }
  _bindTableEvent(table: BaseTableAPI): void {
    // 监听按钮点击事件
    // 三种情况：
    // 1. 没有菜单，点击弹出菜单
    // 2. 已显示菜单，点击关闭菜单
    // 3. 已显示菜单，点击其他菜单按钮，关闭当前菜单，显示另一菜单
    table.on(TABLE_EVENT_TYPE.DROPDOWN_ICON_CLICK, e => {
      if (this._attachInfo) {
        if (this._isBindToCell(e.col, e.row)) {
          this._unbindFromCell();
        } else {
          this._bindToCell(e.col, e.row, 'dropdown-menu');
        }
      } else {
        this._bindToCell(e.col, e.row, 'dropdown-menu');
      }
    });
    // 监听菜单清除事件
    table.on(TABLE_EVENT_TYPE.DROPDOWN_MENU_CLEAR, e => {
      this._unbindFromCell();
    });
    // 监听右键菜单
    table.on(TABLE_EVENT_TYPE.CONTEXTMENU_CELL, e => {
      if (table.internalProps.menu?.renderMode === 'html') {
        // 获取右键菜单信息及位置
        const abstractPos = table._getMouseAbstractPoint(e.event, false);
        let menu = null;
        if (abstractPos.inTable && typeof table.internalProps.menu?.contextMenuItems === 'function') {
          menu = table.internalProps.menu.contextMenuItems(
            table.getHeaderField(e.col, e.row) as string,
            e.row,
            e.col,
            table
          );
        } else if (abstractPos.inTable && Array.isArray(table.internalProps.menu?.contextMenuItems)) {
          menu = table.internalProps.menu?.contextMenuItems;
        }

        this._bindToCell(e.col, e.row, 'context-menu', {
          content: menu,
          position: { x: abstractPos.x, y: abstractPos.y }
        });
      }
    });
  }
  _getMenuInstanceInfo(
    col: number,
    row: number,
    type: MenuInstanceType,
    dropDownMenuOptions?: DropDownMenuOptions
  ): {
    instance?: BaseMenu;
    type: MenuInstanceType;
    info: MenuInstanceInfo;
  } | null {
    const table = this._table;
    const menuInstances = this._menuInstances;

    const info = getMenuInstanceInfo(table, col, row, type, dropDownMenuOptions);
    if (!info) {
      return null;
    }

    // const { type } = info;
    const instance =
      (menuInstances && menuInstances[type]) ||
      (menuInstances && (menuInstances[type] = MENU_INSTANCE_FACTORY[type](table)));

    return {
      instance,
      type,
      info
    };
  }

  containElement(el: HTMLElement): boolean {
    for (const k in this._menuInstances) {
      const contain = this._menuInstances[k].getRootElement()?.contains(el);
      if (contain) {
        return true;
      }
    }
    return false;
  }
}
