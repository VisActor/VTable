import { TABLE_EVENT_TYPE } from '../../../core/TABLE_EVENT_TYPE';
import type { BaseTableAPI } from '../../../ts-types/base-table';

// 下拉菜单内容点击
export function bindDropdownMenuClickEvent(table: BaseTableAPI) {
  table.on(TABLE_EVENT_TYPE.DROPDOWN_MENU_CLICK, () => {
    table.stateManager.hideMenu();
  });
}
