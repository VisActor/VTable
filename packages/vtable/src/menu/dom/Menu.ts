import { BaseMenu } from './BaseMenu';
import { MenuContainer } from './logic/MenuContainer';
import { MenuElement } from './logic/MenuElement';

export class Menu extends BaseMenu {
  createMenuElementInternal(): MenuElement {
    return new MenuElement(this._table);
  }
}
export class Container extends BaseMenu {
  createMenuElementInternal(): MenuContainer {
    return new MenuContainer(this._table);
  }
}
