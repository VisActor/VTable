import type { MenuInstanceInfo } from '../../../ts-types';
import type { BaseTableAPI } from '../../../ts-types/base-table';
import type { MenuContainer } from './logic/MenuContainer';
import type { MenuElement } from './logic/MenuElement';

export abstract class BaseMenu {
  protected _table: BaseTableAPI;
  /** 弹出的菜单显示内容 */
  private _menuElement?: MenuElement | MenuContainer;
  constructor(table: BaseTableAPI) {
    this._table = table;
  }
  release(): void {
    this.unbindMenuElement();
    if (this._menuElement) {
      this._menuElement.release();
    }
    this._menuElement = undefined;
  }
  private _getMenuElement(): MenuElement | MenuContainer {
    if (this._menuElement) {
      return this._menuElement;
    }
    this._menuElement = this.createMenuElementInternal();

    return this._menuElement;
  }
  /** 继承的具体类来实现 可以返回 MenuElement 或者 MenuContainer */
  abstract createMenuElementInternal(): MenuElement | MenuContainer;
  bindMenuElement(col: number, row: number, menuInstanceInfo: MenuInstanceInfo): boolean {
    const menuElement = this._getMenuElement();
    return menuElement.bindToCell(this._table, col, row, menuInstanceInfo);
  }
  unbindMenuElement(): void {
    const menuElement = this._getMenuElement();
    menuElement.unbindFromCell();
  }
  /** 鼠标坐标位置 是否位于下拉菜单内 */
  pointInMenuElement(x: number, y: number): boolean {
    const menuElement = this._getMenuElement();
    return menuElement.pointInMenuElement(x, y);
  }
  getRootElement(): HTMLElement {
    return this._getMenuElement().rootElement;
  }
}
