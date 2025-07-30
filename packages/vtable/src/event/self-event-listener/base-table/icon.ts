import { TABLE_EVENT_TYPE } from '../../../core/TABLE_EVENT_TYPE';
import { IconFuncTypeEnum } from '../../../ts-types';
import type { BaseTableAPI } from '../../../ts-types/base-table';
import { drillClick } from '../../drill';

// 图标点击
export function bindIconClickEvent(table: BaseTableAPI) {
  table.on(TABLE_EVENT_TYPE.ICON_CLICK, iconInfo => {
    const { col, row, x, y, funcType, icon, event } = iconInfo;
    const { stateManager } = table;
    // 下拉菜单按钮点击
    if (funcType === IconFuncTypeEnum.dropDown) {
      stateManager.triggerDropDownMenu(col, row, x, y, event);
    } else if (funcType === IconFuncTypeEnum.sort) {
      stateManager.triggerSort(col, row, icon, event);
    } else if (funcType === IconFuncTypeEnum.frozen) {
      stateManager.triggerFreeze(col, row, icon);
    } else if (funcType === IconFuncTypeEnum.drillDown) {
      drillClick(table);
    } else if (funcType === IconFuncTypeEnum.collapse || funcType === IconFuncTypeEnum.expand) {
      // 检查是否是 master 系统 - 如果是，则跳过这里的处理，让 master 系统自己处理
      const bodyColumnDefine = table.getBodyColumnDefine?.(col, row);
      const isMasterSystem = bodyColumnDefine && (bodyColumnDefine as any).master;
      
      if (!isMasterSystem) {
        const isHasSelected = !!stateManager.select.ranges?.length;
        stateManager.updateSelectPos(-1, -1);
        stateManager.endSelectCells(true, isHasSelected);
        table.toggleHierarchyState(col, row);
      }
      // 如果是 master 系统，什么都不做，让 ListTable 的 handleIconClick 处理
    }
  });
}
