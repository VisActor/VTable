// import { FederatedPointerEvent } from '@visactor/vrender';
import type { FederatedPointerEvent, IEventTarget } from '@visactor/vrender';
import { RichText } from '@visactor/vrender';
import { IconFuncTypeEnum } from '../ts-types';
import type { StateManeger } from '../state/state';
import type { Group } from '../scenegraph/graphic/group';
import { TABLE_EVENT_TYPE } from '../core/TABLE_EVENT_TYPE';
import type { Icon } from '../scenegraph/graphic/icon';
import { checkCellInSelect } from '../state/common/check-in-select';
import { bindMediaClick } from './media-click';
import { bindDrillEvent, drillClick } from './drill';
import { bindSparklineHoverEvent } from './sparkline-event';
import type { BaseTableAPI } from '../ts-types/base-table';
import { handleTextStick } from '../scenegraph/stick-text';
import { bindTableGroupListener } from './listener/table-group';
import { bindScrollBarListener } from './listener/scroll-bar';
import { bindContainerDomListener } from './listener/container-dom';
import { bindTouchListener } from './listener/touch';
import type { SceneEvent } from './util';

export class EventManeger {
  table: BaseTableAPI;
  // _col: number;
  // _resizing: boolean = false;

  isTouchdown: boolean; // touch scrolling mode on
  touchMovePoints: {
    x: number;
    y: number;
    timestamp: number;
  }[]; // touch points record in touch scrolling mode
  touchSetTimeout: any; // touch start timeout, use to distinguish touch scrolling mode and default touch event
  touchEnd: boolean; // is touch event end when default touch event listener response
  touchMove: boolean; // is touch listener working, use to disable document touch scrolling function
  constructor(table: BaseTableAPI) {
    this.table = table;
    this.bindOuterEvent();
    setTimeout(() => {
      this.bindSelfEvent();
    }, 0);
  }

  // 绑定DOM事件
  bindOuterEvent() {
    bindTableGroupListener(this);
    bindContainerDomListener(this);
    bindScrollBarListener(this);
    bindTouchListener(this);
  }

  bindSelfEvent() {
    const stateManeger: StateManeger = this.table.stateManeger;

    // 图标点击
    this.table.listen(TABLE_EVENT_TYPE.ICON_CLICK, iconInfo => {
      const { col, row, x, y, funcType, icon } = iconInfo;
      // 下拉菜单按钮点击
      if (funcType === IconFuncTypeEnum.dropDown) {
        stateManeger.triggerDropDownMenu(col, row, x, y);
      } else if (funcType === IconFuncTypeEnum.sort) {
        stateManeger.triggerSort(col, row, icon);
      } else if (funcType === IconFuncTypeEnum.frozen) {
        stateManeger.triggerFreeze(col, row, icon);
      } else if (funcType === IconFuncTypeEnum.drillDown) {
        drillClick(this.table);
      } else if (funcType === IconFuncTypeEnum.collapse || funcType === IconFuncTypeEnum.expand) {
        this.table.toggleHierarchyState(col, row);
      }
    });

    // 下拉菜单内容点击
    this.table.listen(TABLE_EVENT_TYPE.DROPDOWNMENU_CLICK, () => {
      stateManeger.hideMenu();
    });

    // 处理textStick
    this.table.listen(TABLE_EVENT_TYPE.SCROLL, e => {
      handleTextStick(this.table);
    });

    // link/image/video点击
    bindMediaClick(this.table);

    // 双击自动列宽
    this.table.listen(TABLE_EVENT_TYPE.DBLCLICK_CELL, e => {
      if (this.table._canResizeColumn(e.col, e.row)) {
        this.table.scenegraph.updateAutoColWidth(e.col);
      }
    });

    // drill icon
    if (this.table.isPivotTable()) {
      bindDrillEvent(this.table);
    }

    // chart hover
    bindSparklineHoverEvent(this.table);
  }

  dealTableHover(eventArgsSet?: SceneEvent) {
    if (!eventArgsSet) {
      this.table.stateManeger.updateHoverPos(-1, -1);
      return;
    }
    const { eventArgs } = eventArgsSet;

    if (eventArgs) {
      this.table.stateManeger.updateHoverPos(eventArgs.col, eventArgs.row);
    } else {
      this.table.stateManeger.updateHoverPos(-1, -1);
    }
  }

  dealIconHover(eventArgsSet: SceneEvent) {
    const { eventArgs } = eventArgsSet;

    if (eventArgs) {
      this.table.stateManeger.updateHoverIcon(
        eventArgs.col,
        eventArgs.row,
        eventArgs.target,
        eventArgs.targetCell,
        eventArgs.event
      );
    } else {
      this.table.stateManeger.updateHoverIcon(-1, -1, undefined, undefined);
    }
  }

  dealMenuHover(eventArgsSet: SceneEvent) {
    // menu自身状态实现
  }

  dealTableSelect(eventArgsSet?: SceneEvent): boolean {
    if (!eventArgsSet) {
      this.table.stateManeger.updateSelectPos(-1, -1);
      return false;
    }
    const { eventArgs } = eventArgsSet;

    if (eventArgs) {
      this.table.stateManeger.updateHoverPos(-1, -1);
      // console.log('TableSelectPos', eventArgs.col, eventArgs.row);
      this.table.stateManeger.updateSelectPos(
        eventArgs.col,
        eventArgs.row,
        eventArgs.event.shiftKey,
        eventArgs.event.ctrlKey || eventArgs.event.metaKey
      );
      return true;
    }
    // this.table.stateManeger.updateSelectPos(-1, -1); 这句有问题 如drag框选鼠标超出表格范围 这里就直接情况是不对的
    return false;
  }

  deelTableSelectAll() {
    this.table.stateManeger.updateSelectPos(-1, -1, false, false, true);
  }

  dealMenuSelect(eventArgsSet: SceneEvent) {
    // do nothing
  }

  checkColumnResize(eventArgsSet: SceneEvent, update?: boolean): boolean {
    // return false;
    const { eventArgs } = eventArgsSet;

    if (eventArgs) {
      const resizeCol = this.table.scenegraph.getResizeColAt(
        eventArgsSet.abstractPos.x,
        eventArgsSet.abstractPos.y,
        eventArgs.targetCell
      );
      if (this.table._canResizeColumn(resizeCol.col, resizeCol.row) && resizeCol.col >= 0) {
        // this.table.stateManeger.updateResizeCol(resizeCol.col, eventArgsSet.abstractPos.x, first);
        // this._col = resizeCol.col;
        if (update) {
          this.table.stateManeger.startResizeCol(resizeCol.col, eventArgsSet.abstractPos.x, eventArgsSet.abstractPos.y);
        }
        return true;
      }
    }

    return false;
  }

  dealColumnResize(eventArgsSet: SceneEvent) {
    this.table.stateManeger.updateResizeCol(eventArgsSet.abstractPos.x, eventArgsSet.abstractPos.y);
  }

  chechColumnMover(eventArgsSet: SceneEvent): boolean {
    // return false;
    const { eventArgs } = eventArgsSet;

    if (
      eventArgs &&
      this.table.isHeader(eventArgs.col, eventArgs.row) &&
      checkCellInSelect(eventArgs.col, eventArgs.row, this.table.stateManeger.select.ranges) &&
      // this.table.stateManeger.select.cellPosStart.col === eventArgs.col &&
      // this.table.stateManeger.select.cellPosStart.row === eventArgs.row &&
      this.table._canDragHeaderPosition(eventArgs.col, eventArgs.row)
    ) {
      this.table.stateManeger.startMoveCol(
        eventArgs.col,
        eventArgs.row,
        eventArgsSet.abstractPos.x,
        eventArgsSet.abstractPos.y
      );
      return true;
    }

    return false;
  }

  dealColumnMover(eventArgsSet: SceneEvent) {
    const { eventArgs } = eventArgsSet;
    this.table.stateManeger.updateMoveCol(
      eventArgs.col,
      eventArgs.row,
      eventArgsSet.abstractPos.x,
      eventArgsSet.abstractPos.y
    );
  }

  startColumnResize(eventArgsSet: SceneEvent) {
    // do nothing
  }

  dealIconClick(e: FederatedPointerEvent, eventArgsSet: SceneEvent): boolean {
    const { eventArgs } = eventArgsSet;
    // if (!eventArgs) {
    //   return false;
    // }

    const { target, event, col, row } = eventArgs || {
      target: e.target,
      event: e,
      col: -1,
      row: -1
    };
    const icon = target as unknown as Icon;

    if (icon.role && icon.role.startsWith('icon-')) {
      this.table.fireListeners(TABLE_EVENT_TYPE.ICON_CLICK, {
        name: icon.name,
        // 默认位置：icon中部正下方
        x: (icon.globalAABBBounds.x1 + icon.globalAABBBounds.x2) / 2,
        y: icon.globalAABBBounds.y2,
        col,
        row,
        funcType: icon.attribute.funcType,
        icon
      });

      return true;
    } else if (target instanceof RichText) {
      const icon = target.pickIcon(event.global);
      if (icon) {
        this.table.fireListeners(TABLE_EVENT_TYPE.ICON_CLICK, {
          name: icon.attribute.id,
          // 默认位置：icon中部正下方
          x: icon.globalX + icon.globalAABBBounds.width() / 2,
          y: icon.globalY + icon.AABBBounds.height(),
          col,
          row,
          funcType: (icon.attribute as any).funcType,
          icon: icon as unknown as Icon
        });
        return true;
      }
    }

    return false;
  }
}
