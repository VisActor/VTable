import type { FederatedEvent, IGroup } from '@src/vrender';
import { createRect, Text } from '@src/vrender';
import { TABLE_EVENT_TYPE } from '../../core/TABLE_EVENT_TYPE';
import type { ColumnDefine, MenuListItem } from '../../ts-types';
import { Group } from '../graphic/group';
import { Icon } from '../graphic/icon';
import type { BaseTableAPI, HeaderData } from '../../ts-types/base-table';

/**
 * 菜单类型
 * dropDown 下拉菜单
 * contextmenu 右键菜单
 * custom 自定义菜单
 */
export enum MenuType {
  'dropDown' = 'dropDown',
  'contextmenu' = 'contextmenu',
  'custom' = 'custom'
}

type MenuInfo = MenuListItem[];

const menuStyle = {
  fontSize: 12,
  fontFamily: 'Arial,sans-serif',
  color: '#000',
  highlightColor: '#2E68CF',
  hoverBgColor: '#EEE',
  lineHeight: 12 + 9 + 9,
  bgColor: '#FFF',
  cornerRadius: 4,
  borderWidth: 0.5,
  borderColor: '#CCC',
  menuPadding: 6,
  menuItemPadding: 9,
  maxLineWidth: 200
};

export class MenuHandler {
  private _table: BaseTableAPI;
  private _menuInstance: IGroup;
  private _menuInfo: {
    x: number;
    y: number;
    col: number;
    row: number;
    type: MenuType;
    menuInfo: MenuListItem[];
    highlightIndex: number;
  };
  // private _attachInfo?: AttachInfo | null;

  constructor(table: BaseTableAPI) {
    this._table = table;
    this._menuInstance = new Group({
      x: 0,
      y: 0,
      // visible: false,
      fill: menuStyle.bgColor,
      stroke: menuStyle.borderColor,
      cornerRadius: menuStyle.cornerRadius,
      lineWidth: menuStyle.borderWidth
    });
    this._menuInfo = {
      x: -1,
      y: -1,
      col: -1,
      row: -1,
      type: MenuType.dropDown,
      menuInfo: [],
      highlightIndex: -1
    };

    // this._menuInstance.setTheme({
    //   rect: {
    //     width: 100,
    //   },
    // });

    // 绑定事件
    // this._bindTableEvent(table);
  }

  bindTableComponent(componentGroup: Group) {
    componentGroup.appendChild(this._menuInstance);

    this.bindEvent();
  }

  release() {
    // do nothing
  }

  attach(x: number, y: number, col: number, row: number, type: MenuType, menuInfo?: MenuInfo) {
    if (type === MenuType.dropDown && this.checkDropDownMenuChange(col, row)) {
      // 菜单内容变化，更新菜单Group
      const tableMenuInfo = this.getMenuInfo(col, row, type);
      if (!tableMenuInfo) {
        return;
      }
      const { menuInfo, highlightIndex } = tableMenuInfo;
      this.updateMenuInfo(col, row, type, menuInfo, highlightIndex);
      this.updateMenuInstance(menuInfo, highlightIndex);
      // this.updatePosition(x - this._table.scenegraph.x, y - this._table.scenegraph.y);
    } else if (type === MenuType.contextmenu) {
      if (this.checkContextMenuChange(x, y)) {
        const tableMenuInfo = this.getMenuInfo(col, row, type);
        if (!tableMenuInfo) {
          return;
        }
        const { menuInfo, highlightIndex } = tableMenuInfo;
        this.updateMenuInfo(col, row, type, menuInfo, highlightIndex);
        this.updateMenuInstance(menuInfo, highlightIndex);
      }
    }
    this.updatePosition(x - this._table.scenegraph.x, y - this._table.scenegraph.y);

    this.addToScene();
  }

  updateMenuInfo(col: number, row: number, type: MenuType, menuInfo: MenuListItem[], highlightIndex: number) {
    this._menuInfo.col = col;
    this._menuInfo.row = row;
    this._menuInfo.type = type;
    this._menuInfo.menuInfo = menuInfo;
    this._menuInfo.highlightIndex = highlightIndex;
  }

  checkDropDownMenuChange(col: number, row: number) {
    const { type, col: curCol, row: curRow } = this._menuInfo;
    if (type === MenuType.dropDown && col === curCol && row === curRow) {
      return false;
    }
    return true;
  }

  checkContextMenuChange(x: number, y: number) {
    const { type, menuInfo } = this._menuInfo;
    if (type === MenuType.contextmenu && menuInfo === this._table.internalProps.menu?.contextMenuItems) {
      return false;
    }
    return true;
  }

  updateMenuInstance(menuInfo: MenuInfo, highlightIndex: number) {
    // 清空Mark
    this._menuInstance.removeAllChild();

    // menu padding
    let y = menuStyle.menuPadding;
    const x = menuStyle.menuPadding;
    let maxWidth = 0;
    menuInfo.forEach((item, index) => {
      const isisHighlight = highlightIndex === index;
      let icon;
      let text;
      if (typeof item === 'string') {
        text = item;
      } else if (typeof item === 'object') {
        text = item.text;
        if (isisHighlight) {
          icon = item.selectedIcon;
        } else {
          icon = item.icon;
        }
      }

      const group = new Group({
        y,
        x,
        // childrenPickable: false,
        height: menuStyle.lineHeight,
        fill: menuStyle.bgColor
      });
      group.role = 'menu-item';
      this._menuInstance.appendChild(group);

      // 处理背景hover效果
      group.stateProxy = (stateName: string) => {
        if (stateName === 'hover') {
          return {
            fill: menuStyle.hoverBgColor
          };
        }
        return {
          fill: menuStyle.bgColor
        };
      };
      group.addEventListener('pointerenter', (e: FederatedEvent) => {
        group.addState('hover', true, false);
        this._table.scenegraph.updateNextFrame();
      });
      group.addEventListener('pointerleave', (e: FederatedEvent) => {
        group.removeState('hover', false);
        this._table.scenegraph.updateNextFrame();
      });

      const textMark = new Text({
        x: menuStyle.menuItemPadding,
        y: menuStyle.menuItemPadding,
        fill: isisHighlight ? menuStyle.highlightColor : menuStyle.color,
        text,
        textBaseline: 'top',
        fontSize: menuStyle.fontSize,
        fontFamily: menuStyle.fontFamily,
        pickable: false,
        maxLineWidth: menuStyle.maxLineWidth,
        ellipsis: '…'
        // lineHeight: menuStyle.lineHeight,
      });
      group.addChild(textMark);

      if (icon) {
        const textHeight = textMark.AABBBounds.height();
        const iconWidth = icon.width ?? 16;
        const iconHeight = icon.height ?? 16;
        const iconMark = new Icon({
          x: menuStyle.menuItemPadding,
          y: (menuStyle.lineHeight - iconHeight) / 2,
          width: iconWidth,
          height: iconHeight,
          image: icon.svg,
          pickable: false
        });
        iconMark.role = 'menu-icon';
        group.insertBefore(iconMark, textMark);
        textMark.setAttribute('x', iconWidth + menuStyle.menuItemPadding);
      }

      // const textWidth = textMark.AABBBounds.width();
      maxWidth = Math.max(group.AABBBounds.width(), maxWidth);

      y += menuStyle.lineHeight;
    });

    this._menuInstance.setAttributes({
      width: maxWidth + menuStyle.menuItemPadding * 2 + menuStyle.menuPadding * 2,
      height: y + menuStyle.menuPadding
    });
    this._menuInstance.forEachChildren((itemGroup: Group) => {
      itemGroup.setAttribute('width', maxWidth + menuStyle.menuItemPadding * 2);
    });
  }

  updatePosition(x: number, y: number) {
    // to do: 位置躲避
    this._menuInstance.setAttributes({
      x: this._menuInfo.type === MenuType.dropDown ? x - this._menuInstance.attribute.width : x,
      y
    });
    this._menuInfo.x = MenuType.dropDown ? x - this._menuInstance.attribute.width : x;
    this._menuInfo.y = y;
  }

  addToScene() {
    this._table.scenegraph.updateNextFrame();
  }

  detach() {
    this._menuInstance.setAttributes({
      // visible: false,
      x: -1000,
      y: -1000
    });
    // this._menuInstance.hideAll();
    this._table.scenegraph.updateNextFrame();
  }

  /**
   * @description: 获取对应单元格的菜单内容
   * @param {number} col
   * @param {number} row
   * @param {MenuType} type
   * @return {*}
   */
  getMenuInfo(col: number, row: number, type: MenuType) {
    if (type === MenuType.dropDown) {
      let dropDownMenu = this._table.globalDropDownMenu;
      dropDownMenu = (this._table._getHeaderLayoutMap(col, row) as HeaderData).dropDownMenu;
      if (typeof dropDownMenu === 'function') {
        dropDownMenu = dropDownMenu({ row, col, table: this._table });
      }
      let highlightIndex = -1;
      if (Array.isArray(dropDownMenu)) {
        for (let i = 0; i < dropDownMenu.length; i++) {
          if (this._table._dropDownMenuIsHighlight(col, row, i)) {
            highlightIndex = i;
            break;
          }
        }
      }
      return {
        menuInfo: dropDownMenu,
        highlightIndex
      };
    } else if (type === MenuType.contextmenu) {
      const contextmenu = this._table.internalProps.menu?.contextMenuItems;
      let menuInfo;
      if (Array.isArray(contextmenu)) {
        menuInfo = contextmenu;
      } else if (typeof contextmenu === 'function') {
        const { field } = (
          this._table.isHeader(col, row)
            ? this._table.getHeaderDefine(col, row)
            : this._table.getBodyColumnDefine(col, row)
        ) as ColumnDefine;
        menuInfo = contextmenu(field, row, col);
      }
      return {
        menuInfo,
        highlightIndex: -1
      };
    }
    return undefined;
  }

  bindEvent() {
    // 监听菜单内容click
    this._menuInstance.addEventListener('click', (e: FederatedEvent) => {
      const { target } = e;
      if (target && (target as unknown as Group).role === 'menu-item') {
        // 成功点击menu-item，触发自定义事件
        const resultMenuInfo = this.getEventInfo(target as unknown as Group);
        const resultTableInfo = this._table.getMenuInfo(this._menuInfo.col, this._menuInfo.row, this._menuInfo.type);
        const result = Object.assign(resultMenuInfo, resultTableInfo);
        result.event = e.nativeEvent;
        this._table.fireListeners(TABLE_EVENT_TYPE.DROPDOWN_MENU_CLICK, result);

        // 由DROPDOWNMENU_CLICK事件清空菜单
        // this.detach();
      }
    });
  }

  getEventInfo(target: IGroup): {
    col: number;
    row: number;
    menuKey: string;
    dropDownIndex: number;
    text: string;
    highlight: boolean;
  } {
    const parent = target.parent as IGroup;
    let index = 0;
    parent.forEachChildren((child: IGroup, i: number) => {
      if (child === target) {
        index = i - 1; // index 0为背景rect
        return true;
      }
      return false;
    });

    const text =
      typeof this._menuInfo.menuInfo[index] === 'string'
        ? this._menuInfo.menuInfo[index]
        : (this._menuInfo.menuInfo[index] as any).text;
    const menuKey =
      typeof this._menuInfo.menuInfo[index] === 'string'
        ? text
        : (this._menuInfo.menuInfo[index] as any).menuKey || text;

    return {
      col: this._menuInfo.col,
      row: this._menuInfo.row,
      dropDownIndex: index,
      highlight: index === this._menuInfo.highlightIndex,
      text,
      menuKey
    };
  }

  get bounds() {
    return this._menuInstance.globalAABBBounds;
  }
}

// class MenuContainer {}

// class MenuElement {}
