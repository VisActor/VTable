import type { IEventTarget, FederatedPointerEvent, FederatedWheelEvent, Switch } from '@src/vrender';
import { Gesture, vglobal } from '@src/vrender';
import type {
  ListTableAPI,
  MousePointerCellEvent,
  MousePointerMultiCellEvent,
  MousePointerSparklineEvent,
  RadioColumnDefine
} from '../../ts-types';
import { IconFuncTypeEnum, InteractionState } from '../../ts-types';
import type { SceneEvent } from '../util';
import { getCellEventArgsSet, regIndexReg } from '../util';
import { TABLE_EVENT_TYPE } from '../../core/TABLE_EVENT_TYPE';
import type { Group } from '../../scenegraph/graphic/group';
import { isValid } from '@visactor/vutils';
import { getIconAndPositionFromTarget } from '../../scenegraph/utils/icon';
import { cellInRanges, getPromiseValue } from '../../tools/helper';
import { Rect } from '../../tools/Rect';
import type { EventManager } from '../event';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { IIconGraphicAttribute } from '../../scenegraph/graphic/icon';
import { getCellMergeInfo } from '../../scenegraph/utils/get-cell-merge';
import type { CheckBox, CheckboxAttributes, Radio } from '@src/vrender';
import { handleWhell } from '../scroll';
import { fireMoveColEventListeners } from '../helper';
export function bindTableGroupListener(eventManager: EventManager) {
  const table = eventManager.table;
  const stateManager = table.stateManager;

  table.scenegraph.tableGroup.addEventListener('pointermove', (e: FederatedPointerEvent) => {
    const lastX = table.eventManager.LastPointerXY?.x ?? e.x;
    const lastY = table.eventManager.LastPointerXY?.y ?? e.y;
    table.eventManager.LastPointerXY = { x: e.x, y: e.y };
    // const eventArgsSet: SceneEvent = (table as any).getCellEventArgsSet(e);
    if (eventManager.touchSetTimeout) {
      // 移动端事件特殊处理
      clearTimeout(eventManager.touchSetTimeout);
      eventManager.touchSetTimeout = undefined;
    }
    const eventArgsSet = getCellEventArgsSet(e);
    // if (stateManager.interactionState === InteractionState.scrolling) {
    //   return;
    // }

    // 触发MOUSEMOVE_TABLE
    if (eventArgsSet.eventArgs && (table as any).hasListeners(TABLE_EVENT_TYPE.MOUSEMOVE_TABLE)) {
      table.fireListeners(TABLE_EVENT_TYPE.MOUSEMOVE_TABLE, {
        col: eventArgsSet.eventArgs.col,
        row: eventArgsSet.eventArgs.row,
        x: eventArgsSet.abstractPos.x,
        y: eventArgsSet.abstractPos.y,
        event: e.nativeEvent,
        target: eventArgsSet?.eventArgs?.target,
        mergeCellInfo: eventArgsSet.eventArgs?.mergeInfo
      });
    }

    if (
      stateManager.interactionState === InteractionState.grabing &&
      !(table as ListTableAPI).editorManager?.editingEditor
    ) {
      if (Math.abs(lastX - e.x) + Math.abs(lastY - e.y) >= 1) {
        if (stateManager.isResizeCol() || stateManager.isResizeRow()) {
          /* do nothing */
        } else if (stateManager.isMoveCol()) {
          eventManager.dealColumnMover(eventArgsSet);
        } else if (stateManager.isFillHandle()) {
          eventManager.dealFillSelect(eventArgsSet, true);
        } else {
          table.options.select?.disableDragSelect || eventManager.dealTableSelect(eventArgsSet, true);
        }
      }
      return;
    } else if (
      !table.options.select?.disableDragSelect &&
      table.eventManager.isDraging &&
      stateManager.isSelecting() &&
      !(table as ListTableAPI).editorManager?.editingEditor
    ) {
      eventManager.dealTableSelect(eventArgsSet, true);
    }
    // 更新列宽调整pointer
    // if (stateManager.isResizeCol() || eventManager.checkColumnResize(eventArgsSet)) {
    //   // 更新填充柄pointer
    //   if (table.stateManager.select && eventManager.checkCellFillhandle(eventArgsSet)) {
    //     stateManager.updateCursor('crosshair');
    //   } else {
    //     stateManager.updateCursor('col-resize');
    //   }
    // } else {
    //   stateManager.updateCursor();
    // }

    const cellGoup: any = e.path.find(node => (node as any).role === 'cell');
    if ((table as any).hasListeners(TABLE_EVENT_TYPE.MOUSELEAVE_CELL)) {
      // const cellGoup = eventArgsSet?.eventArgs?.target as unknown as Group;
      if (
        // cellGoup?.role === 'cell' && // 这里去掉这个判断 处理当鼠标移动到滚动条上 也需要触发leave事件
        table.stateManager.hover.cellPos.col !== -1 &&
        table.stateManager.hover.cellPos.row !== -1 &&
        (cellGoup?.col !== table.stateManager.hover.cellPos.col ||
          cellGoup?.row !== table.stateManager.hover.cellPos.row)
      ) {
        table.fireListeners(TABLE_EVENT_TYPE.MOUSELEAVE_CELL, {
          col: table.stateManager.hover.cellPos.col,
          row: table.stateManager.hover.cellPos.row,
          cellRange: table.getCellRangeRelativeRect({
            col: table.stateManager.hover.cellPos.col,
            row: table.stateManager.hover.cellPos.row
          }),
          scaleRatio: table.canvas.getBoundingClientRect().width / table.canvas.offsetWidth,
          event: e.nativeEvent,
          target: eventArgsSet?.eventArgs?.target
        });
      }
    }
    if ((table as any).hasListeners(TABLE_EVENT_TYPE.MOUSEENTER_CELL)) {
      // const cellGoup = eventArgsSet?.eventArgs?.target as unknown as Group;
      if (
        cellGoup?.role === 'cell' &&
        isValid(cellGoup.col) &&
        isValid(cellGoup.row) &&
        (cellGoup.col !== table.stateManager.hover.cellPos.col ||
          cellGoup.row !== table.stateManager.hover.cellPos.row) &&
        (cellGoup.col !== table.stateManager.hover.cellPosContainHeader?.col ||
          cellGoup.row !== table.stateManager.hover.cellPosContainHeader?.row)
      ) {
        table.fireListeners(TABLE_EVENT_TYPE.MOUSEENTER_CELL, {
          col: cellGoup.col,
          row: cellGoup.row,
          cellRange: table.getCellRangeRelativeRect({
            col: cellGoup.col,
            row: cellGoup.row
          }),
          scaleRatio: table.canvas.getBoundingClientRect().width / table.canvas.offsetWidth,
          event: e.nativeEvent,
          target: eventArgsSet?.eventArgs?.target,
          mergeCellInfo: eventArgsSet.eventArgs?.mergeInfo
        });
      }
    }

    eventManager.dealIconHover(eventArgsSet);
    eventManager.dealTableHover(eventArgsSet);

    if (table.theme.columnResize.visibleOnHover) {
      // 是否在hover时显示
      eventManager.checkColumnResize(eventArgsSet, true);
    }
    // 触发MOUSEMOVE_CELL
    if (eventArgsSet.eventArgs && (table as any).hasListeners(TABLE_EVENT_TYPE.MOUSEMOVE_CELL)) {
      let icon;
      let position;
      if (eventArgsSet.eventArgs?.target) {
        const iconInfo = getIconAndPositionFromTarget(eventArgsSet.eventArgs?.target);
        if (iconInfo) {
          icon = iconInfo.icon;
          position = iconInfo.position;
        }
      }
      table.fireListeners(TABLE_EVENT_TYPE.MOUSEMOVE_CELL, {
        col: eventArgsSet.eventArgs.col,
        row: eventArgsSet.eventArgs.row,
        x: eventArgsSet.abstractPos.x,
        y: eventArgsSet.abstractPos.y,
        event: e.nativeEvent,
        targetIcon: icon
          ? {
              name: icon.name,
              position: position,
              funcType: (icon as any).attribute.funcType
            }
          : undefined,
        target: eventArgsSet?.eventArgs?.target,
        mergeCellInfo: eventArgsSet.eventArgs?.mergeInfo
      });
    }
  });

  table.scenegraph.tableGroup.addEventListener('pointerout', (e: FederatedPointerEvent) => {
    const eventArgsSet = getCellEventArgsSet(e);
    const cellGoup = eventArgsSet?.eventArgs?.target as unknown as Group;
    if (cellGoup?.role === 'table') {
      eventManager.dealTableHover();
    }
  });

  table.scenegraph.tableGroup.addEventListener('pointerover', (e: FederatedPointerEvent) => {
    const eventArgsSet = getCellEventArgsSet(e);
    const cellGoup = eventArgsSet?.eventArgs?.target as unknown as Group;
    // console.log('pointerover', cellGoup);

    if (
      cellGoup &&
      (table as any).hasListeners(TABLE_EVENT_TYPE.MOUSEOVER_CHART_SYMBOL) &&
      cellGoup.type === 'symbol'
    ) {
      const cellGroup = e.composedPath().find(p => (p as any).roll === 'cell');
      if (cellGroup) {
        const { col, row } = cellGroup as unknown as Group;
        const eventInfo: MousePointerSparklineEvent = {
          col,
          row,
          field: table.getHeaderField(col, row),
          value: table.getCellValue(col, row),
          dataValue: table.getCellOriginValue(col, row),
          cellHeaderPaths: table.internalProps.layoutMap.getCellHeaderPaths(col, row),
          title: table.getBodyColumnDefine(col, row).title,
          cellRange: table.getCellRelativeRect(col, row),
          event: e.nativeEvent,
          sparkline: {
            pointData: undefined // chartPoint.pointData,
          },
          scaleRatio: table.canvas.getBoundingClientRect().width / table.canvas.offsetWidth,
          target: eventArgsSet?.eventArgs?.target
        };
        table.fireListeners(TABLE_EVENT_TYPE.MOUSEOVER_CHART_SYMBOL, eventInfo);
      }
    }
    //MOUSEENTER_CELL 不能在这里触发 引发在单元格内移动会触发多次的问题【迷你图的单元格中】
    // if ((table as any).hasListeners(DG_EVENT_TYPE.MOUSEENTER_CELL)) {
    //   const eventArgsSet = getCellEventArgsSet(e);
    //   const cellGoup = eventArgsSet?.eventArgs?.target as unknown as Group;
    //   console.log('hover cell', table.stateManager.hover.cellPos);
    //   if (
    //     cellGoup?.role === 'cell' &&
    //     (cellGoup.col !== table.stateManager.hover.cellPos.col ||
    //       cellGoup.row !== table.stateManager.hover.cellPos.row)
    //   ) {
    //     table.fireListeners(DG_EVENT_TYPE.MOUSEENTER_CELL, {
    //       col: cellGoup.col,
    //       row: cellGoup.row,
    //       cellRange: table.getCellRangeRelativeRect({
    //         col: cellGoup.col,
    //         row: cellGoup.row,
    //       }),
    //       scaleRatio:
    //         table.canvas.getBoundingClientRect().width / table.canvas.offsetWidth,
    //       event: e.nativeEvent,
    //     });
    //   }
    // }
  });
  // table.scenegraph.tableGroup.addEventListener('pointerenter', (e: FederatedPointerEvent) => {
  //   console.log('pointerenter', e.target);
  // 触发MOUSEOVER_CELL
  // const eventArgsSet = getCellEventArgsSet(e);
  // if ((eventArgsSet?.eventArgs?.target as unknown as Group)?.role === 'cell') {
  //   table.fireListeners(DG_EVENT_TYPE.MOUSEENTER_CELL, {
  //     col: (eventArgsSet.eventArgs.target as unknown as Group).col,
  //     row: (eventArgsSet.eventArgs.target as unknown as Group).row,
  //     cellRange: table.getCellRangeRelativeRect({
  //       col: (eventArgsSet.eventArgs.target as unknown as Group).col,
  //       row: (eventArgsSet.eventArgs.target as unknown as Group).row,
  //     }),
  //     scaleRatio: table.canvas.getBoundingClientRect().width / table.canvas.offsetWidth,
  //     event: e.nativeEvent,
  //   });
  // }
  // });
  table.scenegraph.tableGroup.addEventListener('pointerenter', (e: FederatedPointerEvent) => {
    if (
      (table.theme.scrollStyle.horizontalVisible && table.theme.scrollStyle.horizontalVisible === 'focus') ||
      (!table.theme.scrollStyle.horizontalVisible && table.theme.scrollStyle.visible === 'focus')
    ) {
      stateManager.showHorizontalScrollBar();
    }
    if (
      (table.theme.scrollStyle.verticalVisible && table.theme.scrollStyle.verticalVisible === 'focus') ||
      (!table.theme.scrollStyle.verticalVisible && table.theme.scrollStyle.visible === 'focus')
    ) {
      stateManager.showVerticalScrollBar();
    }
    if ((table as any).hasListeners(TABLE_EVENT_TYPE.MOUSEENTER_TABLE)) {
      table.fireListeners(TABLE_EVENT_TYPE.MOUSEENTER_TABLE, {
        event: e.nativeEvent
      });
    }
  });
  table.scenegraph.tableGroup.addEventListener('pointerleave', (e: FederatedPointerEvent) => {
    //resize 列宽 当鼠标离开table也需要继续响应
    if (
      !stateManager.isResizeCol() &&
      !stateManager.isResizeRow() &&
      !stateManager.isMoveCol() &&
      !stateManager.isSelecting()
    ) {
      stateManager.updateInteractionState(InteractionState.default);
      stateManager.updateCursor();
    }

    if (
      (table.theme.scrollStyle.horizontalVisible && table.theme.scrollStyle.horizontalVisible === 'focus') ||
      (!table.theme.scrollStyle.horizontalVisible && table.theme.scrollStyle.visible === 'focus')
    ) {
      stateManager.hideHorizontalScrollBar();
    }
    if (
      (table.theme.scrollStyle.verticalVisible && table.theme.scrollStyle.verticalVisible === 'focus') ||
      (!table.theme.scrollStyle.verticalVisible && table.theme.scrollStyle.visible === 'focus')
    ) {
      stateManager.hideVerticalScrollBar();
    }

    // 移动到table外部 如移动到表格空白区域 移动到表格浏览器外部
    if ((table as any).hasListeners(TABLE_EVENT_TYPE.MOUSELEAVE_CELL)) {
      if (table.stateManager.hover.cellPos.col !== -1 && table.stateManager.hover.cellPos.row !== -1) {
        table.fireListeners(TABLE_EVENT_TYPE.MOUSELEAVE_CELL, {
          col: table.stateManager.hover.cellPos.col,
          row: table.stateManager.hover.cellPos.row,
          cellRange: table.getCellRangeRelativeRect({
            col: table.stateManager.hover.cellPos.col,
            row: table.stateManager.hover.cellPos.row
          }),
          scaleRatio: table.canvas.getBoundingClientRect().width / table.canvas.offsetWidth,
          event: e.nativeEvent,
          target: undefined
        });
      }
    }
    eventManager.dealTableHover();
    const target = e.target;
    if (target && !target.isDescendantsOf(table.scenegraph.tableGroup)) {
      table.fireListeners(TABLE_EVENT_TYPE.MOUSELEAVE_TABLE, {
        event: e.nativeEvent
      });
    }
  });
  // /**
  //  * 两种场景会触发这里的pointerupoutside TODO 第二种并不应该触发，待vrender修改后再整理这里的逻辑
  //  * 1. 鼠标down和up的场景树节点不一样
  //  * 2. 点击到非stage的（非canvas）  其他dom节点
  //  */
  // table.scenegraph.tableGroup.addEventListener('pointerupoutside', (e: FederatedPointerEvent) => {
  //   console.log('pointerupoutside');
  //   const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
  //   if (stateManager.menu.isShow && (eventArgsSet.eventArgs?.target as any) !== stateManager.residentHoverIcon?.icon) {
  //     setTimeout(() => {
  //       // conside page scroll
  //       if (!table.internalProps.menuHandler.pointInMenuElement(e.client.x, e.client.y)) {
  //         stateManager.menu.isShow && stateManager.hideMenu();
  //       }
  //     }, 0);
  //   }
  //   // 同pointerup中的逻辑
  //   if (stateManager.isResizeCol()) {
  //     endResizeCol(table);
  //   } else if (stateManager.isResizeRow()) {
  //     endResizeRow(table);
  //   } else if (stateManager.isMoveCol()) {
  //     const endMoveColSuccess = table.stateManager.endMoveCol();
  //     if (
  //       endMoveColSuccess &&
  //       table.stateManager.columnMove?.colSource !== -1 &&
  //       table.stateManager.columnMove?.rowSource !== -1 &&
  //       table.stateManager.columnMove?.colTarget !== -1 &&
  //       table.stateManager.columnMove?.rowTarget !== -1
  //     ) {
  //       // 下面触发CHANGE_HEADER_POSITION 区别于pointerup
  //       if ((table as any).hasListeners(TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION)) {
  //         table.fireListeners(TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION, {
  //           target: { col: table.stateManager.columnMove.colTarget, row: table.stateManager.columnMove.rowTarget },
  //           source: {
  //             col: table.stateManager.columnMove.colSource,
  //             row: table.stateManager.columnMove.rowSource
  //           },
  //           event: e.nativeEvent
  //         });
  //       }
  //     }
  //   } else if (stateManager.isSelecting()) {
  //     if (table.stateManager.select?.ranges?.length) {
  //       const lastCol = table.stateManager.select.ranges[table.stateManager.select.ranges.length - 1].end.col;
  //       const lastRow = table.stateManager.select.ranges[table.stateManager.select.ranges.length - 1].end.row;
  //       table.stateManager.endSelectCells();
  //       if ((table as any).hasListeners(TABLE_EVENT_TYPE.DRAG_SELECT_END)) {
  //         const cellsEvent: MousePointerMultiCellEvent = {
  //           event: e.nativeEvent,
  //           cells: [],
  //           col: lastCol,
  //           row: lastRow,
  //           scaleRatio: table.canvas.getBoundingClientRect().width / table.canvas.offsetWidth,
  //           target: undefined
  //         };
  //         cellsEvent.cells = table.getSelectedCellInfos();
  //         table.fireListeners(TABLE_EVENT_TYPE.DRAG_SELECT_END, cellsEvent);
  //       }
  //     }
  //   }
  // });

  const globalPointerupCallback = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!table.getElement().contains(target)) {
      // 如果点击到表格外部的dom
      const isCompleteEdit = (table as ListTableAPI).editorManager?.completeEdit(e);
      getPromiseValue<boolean>(isCompleteEdit, isCompleteEdit => {
        if (isCompleteEdit === false) {
          // 如果没有正常退出编辑状态 则不执行下面的逻辑 如选择其他单元格的逻辑
          return;
        }
        stateManager.updateInteractionState(InteractionState.default);
        eventManager.dealTableHover();
      });
    }
  };
  const globalPointerdownCallback = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!table.getElement().contains(target) && !table.internalProps.menuHandler.containElement(target)) {
      // 如果点击到表格外部的dom
      const isCompleteEdit = (table as ListTableAPI).editorManager?.completeEdit(e);
      getPromiseValue<boolean>(isCompleteEdit, isCompleteEdit => {
        if (isCompleteEdit === false) {
          // 如果没有正常退出编辑状态 则不执行下面的逻辑 如选择其他单元格的逻辑
          return;
        }
        //点击到表格外部不需要取消选中状态
        if (table.options.select?.outsideClickDeselect) {
          const isHasSelected = !!stateManager.select.ranges?.length;
          eventManager.dealTableSelect();
          stateManager.endSelectCells(true, isHasSelected);
        }
      });
    }
  };
  //释放时最好是通过vglobal.removeEventListener TODO
  eventManager.globalEventListeners.push({
    name: 'pointerup',
    env: 'document',
    callback: globalPointerupCallback
  });
  //释放时最好是通过vglobal.removeEventListener TODO
  eventManager.globalEventListeners.push({
    name: 'pointerdown',
    env: 'document',
    callback: globalPointerdownCallback
  });
  // 整体全局监听事件
  vglobal.addEventListener('pointerup', globalPointerupCallback);
  vglobal.addEventListener('pointerdown', globalPointerdownCallback);
  table.scenegraph.tableGroup.addEventListener('pointerdown', (e: FederatedPointerEvent) => {
    if ((table as any).hasListeners(TABLE_EVENT_TYPE.MOUSEDOWN_TABLE)) {
      table.fireListeners(TABLE_EVENT_TYPE.MOUSEDOWN_TABLE, {
        event: e.nativeEvent
      });
    }
    // table.eventManager.isPointerDownOnTable = true;
    // setTimeout(() => {
    //   table.eventManager.isPointerDownOnTable = false;
    // }, 0);
    table.eventManager.isDown = true;
    table.eventManager.LastBodyPointerXY = { x: e.x, y: e.y };
    // // 避免在调整列宽等拖拽操作触发外层组件的拖拽逻辑;
    // // 如果鼠标位置在表格内（加调整列宽的热区），将pointerdown事件阻止冒泡（如果阻止mousedown需要结合isPointerDownOnTable来判断）
    // e.stopPropagation();

    // e.preventDefault(); //为了阻止mousedown事件的触发，后续：不能这样写，会阻止table聚焦
    table.eventManager.LastPointerXY = { x: e.x, y: e.y };
    if (e.button !== 0) {
      // 只处理左键
      return;
    }
    const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
    eventManager.downIcon = undefined;
    if (stateManager.interactionState !== InteractionState.default) {
      return;
    }
    //处理当点击到的不是图表上时 更新图表的状态为空
    if (table.isPivotChart() && eventArgsSet?.eventArgs?.target.type !== 'chart') {
      table.scenegraph.updateChartState(null);
    }
    // 处理menu
    if ((eventArgsSet.eventArgs?.target as any) !== stateManager.residentHoverIcon?.icon) {
      // 点击在menu外，且不是下拉菜单的icon，移除menu
      stateManager.hideMenu();
    }
    // 如果点击到了图表上  后续的逻辑忽略掉 以免重绘了图表 丢失vchart图表的交互
    if (eventArgsSet?.eventArgs?.target.type === 'chart') {
      return;
    }

    const isCompleteEdit = (table as ListTableAPI).editorManager?.completeEdit(e.nativeEvent);
    getPromiseValue<boolean>(isCompleteEdit, isCompleteEdit => {
      if (isCompleteEdit === false) {
        // 如果没有正常退出编辑状态 则不执行下面的逻辑 如选择其他单元格的逻辑
        return;
      }

      const hitIcon = (eventArgsSet?.eventArgs?.target as any)?.role?.startsWith('icon')
        ? eventArgsSet.eventArgs.target
        : (e.target as any).role?.startsWith('icon')
        ? e.target
        : undefined;
      eventManager.downIcon = hitIcon;
      if (!hitIcon || (hitIcon.attribute as IIconGraphicAttribute).interactive === false) {
        if (e.pointerType === 'touch') {
          // 移动端事件特殊处理
          eventManager.touchEnd = false;
          eventManager.touchSetTimeout = setTimeout(() => {
            eventManager.isTouchdown = false;
            eventManager.touchMove = true;
            // 处理列宽调整
            if (
              !eventManager.touchEnd &&
              (eventManager.checkColumnResize(eventArgsSet, true) || eventManager.checkRowResize(eventArgsSet, true))
            ) {
              // eventManager.startColumnResize(e);
              // eventManager._resizing = true;
              stateManager.updateInteractionState(InteractionState.grabing);
              return;
            }

            // 处理column mover
            if (!eventManager.touchEnd && eventManager.chechColumnMover(eventArgsSet)) {
              stateManager.updateInteractionState(InteractionState.grabing);
              return;
            }

            // 处理单元格选择
            if (eventManager.dealTableSelect(eventArgsSet) && !eventManager.touchEnd) {
              // 先执行单选逻辑，再更新为grabing模式
              // stateManager.interactionState = 'grabing';
              stateManager.updateInteractionState(InteractionState.grabing);
              // console.log('DRAG_SELECT_START');
            }
          }, 500);
          // 这里处理成hover  这样移动端 当点击到带有下拉菜单dropdown的单元格时 那个icon才能绘制出来。可以测试example的menu示例
          eventManager.dealTableHover(eventArgsSet);
        } else {
          // 处理列宽调整
          if (
            !eventManager.checkCellFillhandle(eventArgsSet) &&
            (eventManager.checkColumnResize(eventArgsSet, true) || eventManager.checkRowResize(eventArgsSet, true))
          ) {
            // eventManager.startColumnResize(e);
            // eventManager._resizing = true;
            table.scenegraph.updateChartState(null);
            stateManager.updateInteractionState(InteractionState.grabing);
            return;
          }

          // 处理column mover
          if (eventManager.chechColumnMover(eventArgsSet)) {
            stateManager.updateInteractionState(InteractionState.grabing);
            return;
          }

          // 处理填充功能
          if (eventManager.checkCellFillhandle(eventArgsSet, true) && eventManager.dealFillSelect(eventArgsSet)) {
            // table.eventManager.LastRange = {
            //   start: table.stateManager.select.ranges[0].start,
            //   end: {
            //     col: (getCellEventArgsSet(e).eventArgs.target as unknown as Group).col,
            //     row: (getCellEventArgsSet(e).eventArgs.target as unknown as Group).row
            //   }
            // };
            // table.eventManager.SelectData = table.getCopyValue();
            stateManager.updateInteractionState(InteractionState.grabing);
            return;
          }
          // 处理单元格选择
          if (eventManager.dealTableSelect(eventArgsSet)) {
            // 先执行单选逻辑，再更新为grabing模式
            // stateManager.interactionState = 'grabing';
            stateManager.updateInteractionState(InteractionState.grabing);
            // console.log('DRAG_SELECT_START');
          }
        }
      } else if ((hitIcon.attribute as any).funcType === IconFuncTypeEnum.dragReorder) {
        stateManager.startMoveCol(
          eventArgsSet.eventArgs.col,
          eventArgsSet.eventArgs.row,
          eventArgsSet.abstractPos.x,
          eventArgsSet.abstractPos.y,
          eventArgsSet.eventArgs?.event?.nativeEvent
        );
        stateManager.updateInteractionState(InteractionState.grabing);
      }
      if ((table as any).hasListeners(TABLE_EVENT_TYPE.MOUSEDOWN_CELL)) {
        const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
        if (eventArgsSet.eventArgs) {
          table.fireListeners(TABLE_EVENT_TYPE.MOUSEDOWN_CELL, {
            col: eventArgsSet.eventArgs.col,
            row: eventArgsSet.eventArgs.row,
            event: e.nativeEvent,
            target: eventArgsSet?.eventArgs?.target,
            mergeCellInfo: eventArgsSet.eventArgs.mergeInfo
          });
        }
      }
    });
  });
  // 注意和pointertap事件的处理 vrender中的事件系统： 是先触发pointerup 如果是点击到的场景树图元节点则会继续触发pointertap 否则不触发pointertap
  table.scenegraph.tableGroup.addEventListener('pointerup', (e: FederatedPointerEvent) => {
    console.log('tableGroup', 'pointerup');
    if (e.button !== 0) {
      // 只处理左键
      return;
    }
    if (stateManager.interactionState === 'grabing') {
      // stateManager.interactionState = 'default';
      stateManager.updateInteractionState(InteractionState.default);
      // eventManager._resizing = false;
      if (stateManager.isResizeCol()) {
        endResizeCol(table);
      } else if (stateManager.isResizeRow()) {
        endResizeRow(table);
      } else if (stateManager.isMoveCol()) {
        // const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
        const endMoveColSuccess = table.stateManager.endMoveCol();
        fireMoveColEventListeners(table, endMoveColSuccess, e.nativeEvent);
      } else if (stateManager.isSelecting()) {
        table.stateManager.endSelectCells();
        if (table.stateManager.isFillHandle()) {
          table.stateManager.endFillSelect();
        }
        const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
        if (
          table.eventManager.isDraging &&
          eventArgsSet.eventArgs &&
          (table as any).hasListeners(TABLE_EVENT_TYPE.DRAG_SELECT_END)
        ) {
          const cellsEvent: MousePointerMultiCellEvent = {
            event: e.nativeEvent,
            cells: [],
            col: (eventArgsSet.eventArgs.target as unknown as Group).col,
            row: (eventArgsSet.eventArgs.target as unknown as Group).row,
            scaleRatio: table.canvas.getBoundingClientRect().width / table.canvas.offsetWidth,
            target: eventArgsSet?.eventArgs?.target,
            mergeCellInfo: eventArgsSet.eventArgs?.mergeInfo
          };

          cellsEvent.cells = table.getSelectedCellInfos();
          table.fireListeners(TABLE_EVENT_TYPE.DRAG_SELECT_END, cellsEvent);
        }
      }
    } else if (stateManager.interactionState === InteractionState.scrolling) {
      stateManager.updateInteractionState(InteractionState.default);
      // scroll end
    }

    // console.log('DRAG_SELECT_END');
    if ((table as any).hasListeners(TABLE_EVENT_TYPE.MOUSEUP_CELL)) {
      const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
      if (eventArgsSet.eventArgs) {
        table.fireListeners(TABLE_EVENT_TYPE.MOUSEUP_CELL, {
          col: eventArgsSet.eventArgs.col,
          row: eventArgsSet.eventArgs.row,
          event: e.nativeEvent,
          target: eventArgsSet?.eventArgs?.target,
          mergeCellInfo: eventArgsSet.eventArgs?.mergeInfo
        });
      }
    }
  });

  table.scenegraph.tableGroup.addEventListener('rightdown', (e: FederatedPointerEvent) => {
    const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
    // 右键点击
    if (eventArgsSet.eventArgs) {
      stateManager.triggerContextMenu(
        eventArgsSet.eventArgs.col,
        eventArgsSet.eventArgs.row,
        eventArgsSet.abstractPos.x,
        eventArgsSet.abstractPos.y
      );

      //处理监听的右键事件
      const { col, row } = eventArgsSet.eventArgs;
      if ((table as any).hasListeners(TABLE_EVENT_TYPE.CONTEXTMENU_CELL)) {
        const cellInfo = table.getCellInfo(col, row);
        let icon;
        let position;
        if (eventArgsSet.eventArgs?.target) {
          const iconInfo = getIconAndPositionFromTarget(eventArgsSet.eventArgs?.target);
          if (iconInfo) {
            icon = iconInfo.icon;
            position = iconInfo.position;
          }
        }
        const cellsEvent: MousePointerMultiCellEvent = {
          ...cellInfo,
          event: e.nativeEvent,
          cells: [],
          targetIcon: icon
            ? {
                name: icon.name,
                position: position,
                funcType: (icon as any).attribute.funcType
              }
            : undefined,
          target: eventArgsSet?.eventArgs?.target,
          mergeCellInfo: eventArgsSet.eventArgs?.mergeInfo
        };
        if (cellInRanges(table.stateManager.select.ranges, col, row)) {
          // 用户右键点击已经选中的区域
          // const { start, end } = eventManager.selection.range;
          cellsEvent.cells = table.getSelectedCellInfos();
        } else {
          // 用户右键点击新单元格
          cellsEvent.cells = [[cellInfo]];
        }

        table.fireListeners(TABLE_EVENT_TYPE.CONTEXTMENU_CELL, cellsEvent);
      }
    }
  });
  // 注意和pointerup事件的处理 vrender中的事件系统： 是先触发pointerup 如果是点击到的场景树图元节点则会继续触发pointertap 否则不触发pointertap
  table.scenegraph.tableGroup.addEventListener('pointertap', (e: FederatedPointerEvent) => {
    if (table.stateManager.columnResize.resizing) {
      return;
    }
    const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
    if (
      !eventManager.touchMove &&
      e.button === 0 &&
      eventArgsSet.eventArgs &&
      (table as any).hasListeners(TABLE_EVENT_TYPE.CLICK_CELL)
    ) {
      const { col, row } = eventArgsSet.eventArgs;
      const cellInfo = table.getCellInfo(col, row);
      let icon;
      let position;
      if (eventArgsSet.eventArgs?.target) {
        const iconInfo = getIconAndPositionFromTarget(eventArgsSet.eventArgs?.target);
        if (iconInfo) {
          icon = iconInfo.icon;
          position = iconInfo.position;
        }
      }
      const cellsEvent: MousePointerMultiCellEvent = {
        ...cellInfo,
        event: e.nativeEvent,
        federatedEvent: e,
        cells: [],
        targetIcon: icon
          ? {
              name: icon.name,
              position: position,
              funcType: (icon as any).attribute.funcType
            }
          : undefined,
        target: eventArgsSet?.eventArgs?.target,
        mergeCellInfo: eventArgsSet.eventArgs?.mergeInfo
      };

      table.fireListeners(TABLE_EVENT_TYPE.CLICK_CELL, cellsEvent);
    }
    if (table.stateManager.columnResize.resizing || table.stateManager.columnMove.moving) {
      return;
    }
    // if (table.stateManager.fillHandle.isFilling) {
    //   table.stateManager.endFillSelect();
    //   return;
    // }

    eventManager.dealIconClick(e, eventArgsSet);
    if (!eventArgsSet?.eventArgs) {
      return;
    }
    if (eventManager.touchSetTimeout) {
      // 通过这个变量判断非drag鼠标拖拽状态，就不再增加其他变量isDrag了（touchSetTimeout如果拖拽过会变成undefined pointermove事件有置为undefined）
      if (e.pointerType === 'touch') {
        // 移动端事件特殊处理
        const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
        if (eventManager.touchSetTimeout) {
          clearTimeout(eventManager.touchSetTimeout);
          const isHasSelected = !!stateManager.select.ranges?.length;
          eventManager.dealTableSelect(eventArgsSet);
          stateManager.endSelectCells(true, isHasSelected);
          eventManager.touchSetTimeout = undefined;
        }
      }
    }
  });
  // stage 的pointerdown监听
  table.scenegraph.stage.addEventListener('pointerdown', (e: FederatedPointerEvent) => {
    const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
    if (
      !eventArgsSet.eventArgs?.target ||
      (eventArgsSet.eventArgs?.target as any) !== stateManager.residentHoverIcon?.icon
    ) {
      stateManager.hideMenu();
    }
    const isCompleteEdit = (table as ListTableAPI).editorManager?.completeEdit(e.nativeEvent);
    getPromiseValue<boolean>(isCompleteEdit, isCompleteEdit => {
      if (isCompleteEdit === false) {
        // 如果没有正常退出编辑状态 则不执行下面的逻辑 如选择其他单元格的逻辑
        return;
      }
      const hitIcon = (e.target as any).role?.startsWith('icon') ? e.target : undefined;
      eventManager.downIcon = hitIcon;
      // 处理列宽调整  这里和tableGroup.addEventListener('pointerdown' 逻辑一样
      if (
        !hitIcon &&
        !eventManager.checkCellFillhandle(eventArgsSet) &&
        !stateManager.columnResize.resizing &&
        eventManager.checkColumnResize(eventArgsSet, true)
      ) {
        // eventManager.startColumnResize(e);
        // eventManager._resizing = true;
        table.scenegraph.updateChartState(null);
        stateManager.updateInteractionState(InteractionState.grabing);

        // 调整列宽最后一列有外扩了8px  需要将其考虑到table中 需要触发下MOUSEDOWN_TABLE事件
        const { eventArgs } = eventArgsSet;
        if (!eventArgs?.targetCell) {
          const cell = table.getCellAt(
            eventArgsSet.abstractPos.x - table.theme.columnResize.resizeHotSpotSize / 2,
            eventArgsSet.abstractPos.y
          );
          if (cell) {
            if ((table as any).hasListeners(TABLE_EVENT_TYPE.MOUSEDOWN_TABLE)) {
              table.fireListeners(TABLE_EVENT_TYPE.MOUSEDOWN_TABLE, {
                event: e.nativeEvent
              });
            }
          }
        }
        return;
      }
    });
  });
  table.scenegraph.stage.addEventListener('pointerup', (e: FederatedPointerEvent) => {
    // 处理列宽调整  这里和tableGroup.addEventListener('pointerup' 逻辑一样
    if (stateManager.interactionState === 'grabing') {
      // stateManager.interactionState = 'default';
      stateManager.updateInteractionState(InteractionState.default);
      // eventManager._resizing = false;
      if (stateManager.isResizeCol()) {
        endResizeCol(table);
      } else if (stateManager.isResizeRow()) {
        endResizeRow(table);
      }
    }
  });
  // click outside
  table.scenegraph.stage.addEventListener('pointertap', (e: FederatedPointerEvent) => {
    const target = e.target;
    if (
      // 如果是鼠标点击到canvas空白区域 则取消选中状态
      !table.eventManager.isDraging &&
      target &&
      (target.isDescendantsOf(table.scenegraph.stage) || (target as any).stage === target) && //判断节点未被删除 后面这个是为了判断是stage本身
      !target.isDescendantsOf(table.scenegraph.tableGroup)
      // &&
      // (target as any) !== table.scenegraph.tableGroup &&
      // (target as any) !== table.scenegraph.stage
    ) {
      stateManager.updateInteractionState(InteractionState.default);
      eventManager.dealTableHover();
      const isHasSelected = !!stateManager.select.ranges?.length;
      // 点击空白区域取消选中
      if (table.options.select?.blankAreaClickDeselect ?? true) {
        eventManager.dealTableSelect();
      }
      stateManager.endSelectCells(true, isHasSelected);

      stateManager.updateCursor();
      table.scenegraph.updateChartState(null);
    } else if (table.eventManager.isDraging && stateManager.isSelecting()) {
      // 如果鼠标拖拽后是否 则结束选中
      stateManager.endSelectCells();
    }
  });
  table.scenegraph.stage.addEventListener('pointermove', (e: FederatedPointerEvent) => {
    const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
    // 处理列宽调整  这里和tableGroup.addEventListener('pointermove' 逻辑一样
    if (stateManager.isResizeCol() || eventManager.checkColumnResize(eventArgsSet)) {
      // 更新填充柄pointer
      if (table.stateManager.select && eventManager.checkCellFillhandle(eventArgsSet)) {
        stateManager.updateCursor('crosshair');
      } else {
        stateManager.updateCursor('col-resize');
      }
    } else if (stateManager.isResizeRow() || eventManager.checkRowResize(eventArgsSet)) {
      // 更新填充柄pointer
      if (table.stateManager.select && eventManager.checkCellFillhandle(eventArgsSet)) {
        stateManager.updateCursor('crosshair');
      } else {
        stateManager.updateCursor('row-resize');
      }
    } else if (stateManager.isMoveCol()) {
      // 拖拽位置已经在updateMoveCol方法中添加了响应的鼠标样式
    } else {
      stateManager.updateCursor();
    }
  });
  // table.scenegraph.tableGroup.addEventListener('dbltap', (e: FederatedPointerEvent) => {
  //   console.log('tableGroup', 'dbltap');
  //   dblclickHandler(e);
  // });
  // table.scenegraph.tableGroup.addEventListener('dblclick', (e: FederatedPointerEvent) => {
  //   console.log('tableGroup', 'dblclick');
  //   dblclickHandler(e);
  // });

  table.scenegraph.tableGroup.addEventListener('checkbox_state_change', (e: FederatedPointerEvent) => {
    const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
    const { col, row } = eventArgsSet.eventArgs;
    const cellInfo = table.getCellInfo(col, row);

    const mergeRange = getCellMergeInfo(table, col, row);
    if (mergeRange) {
      for (let col = mergeRange.start.col; col <= mergeRange.end.col; col++) {
        for (let row = mergeRange.start.row; row <= mergeRange.end.row; row++) {
          const cellGroup = table.scenegraph.getCell(col, row);
          cellGroup.forEachChildren((checkbox: CheckBox) => {
            if (checkbox.name === 'checkbox') {
              checkbox.setAttributes({
                checked: (e.target.attribute as CheckboxAttributes).checked,
                indeterminate: (e.target.attribute as CheckboxAttributes).indeterminate
              });
            }
          });
        }
      }
    }

    const cellsEvent: MousePointerCellEvent & { checked: boolean } = {
      ...cellInfo,
      event: e.nativeEvent,
      target: eventArgsSet?.eventArgs?.target,
      mergeCellInfo: eventArgsSet?.eventArgs?.mergeInfo,
      checked: (e.detail as unknown as { checked: boolean }).checked
    };

    if (table.isHeader(col, row)) {
      //点击的表头部分的checkbox 需要同时处理表头和body单元格的状态
      table.stateManager.setHeaderCheckedState(
        cellInfo.field as string | number,
        (e.detail as unknown as { checked: boolean }).checked
      );
      const cellType = table.getCellType(col, row);
      if (cellType === 'checkbox') {
        table.scenegraph.updateCheckboxCellState(col, row, (e.detail as unknown as { checked: boolean }).checked);
      }
    } else {
      //点击的是body单元格的checkbox  处理本单元格的状态维护 同时需要检查表头是否改变状态
      table.stateManager.setCheckedState(
        col,
        row,
        cellInfo.field as string | number,
        (e.detail as unknown as { checked: boolean }).checked
      );
      const cellType = table.getCellType(col, row);
      if (cellType === 'checkbox') {
        const oldHeaderCheckedState = table.stateManager.headerCheckedState[cellInfo.field as string | number];
        const newHeaderCheckedState = table.stateManager.updateHeaderCheckedState(
          cellInfo.field as string | number,
          col,
          row
        );
        if (oldHeaderCheckedState !== newHeaderCheckedState) {
          table.scenegraph.updateHeaderCheckboxCellState(col, row, newHeaderCheckedState);
        }
      }
    }
    table.fireListeners(TABLE_EVENT_TYPE.CHECKBOX_STATE_CHANGE, cellsEvent);

    table.scenegraph.updateNextFrame();
  });

  table.scenegraph.tableGroup.addEventListener('radio_checked', (e: FederatedPointerEvent) => {
    const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
    const { col, row, target } = eventArgsSet.eventArgs;
    const cellInfo = table.getCellInfo(col, row);
    const indexInCell: string | undefined = regIndexReg.exec(target.id as string)?.[1];

    const mergeRange = getCellMergeInfo(table, col, row);
    if (mergeRange) {
      // update all radio in merge cells
      for (let col = mergeRange.start.col; col <= mergeRange.end.col; col++) {
        for (let row = mergeRange.start.row; row <= mergeRange.end.row; row++) {
          const cellGroup = table.scenegraph.getCell(col, row);
          cellGroup.forEachChildren((radio: Radio) => {
            if (radio.name === 'radio' && radio.id === target.id) {
              radio.setAttributes({
                checked: true
              });
            }
          });
        }
      }
    }

    // update other radio
    const define = table.getBodyColumnDefine(col, row) as RadioColumnDefine;
    const radioCheckType = define.radioCheckType || 'column';

    if (radioCheckType === 'cell') {
      // update other radio in this cell
      if (mergeRange) {
        // update all radio in merge cells
        for (let col = mergeRange.start.col; col <= mergeRange.end.col; col++) {
          for (let row = mergeRange.start.row; row <= mergeRange.end.row; row++) {
            const cellGroup = table.scenegraph.getCell(col, row);
            cellGroup.forEachChildren((radio: Radio) => {
              if (radio.name === 'radio' && radio.id !== target.id) {
                radio.setAttributes({
                  checked: false
                });
              }
            });
          }
        }
      } else {
        // update all radio in single cell
        const cellGroup = table.scenegraph.getCell(col, row);
        cellGroup.forEachChildren((radio: Radio) => {
          if (radio.name === 'radio' && radio.id !== target.id) {
            radio.setAttributes({
              checked: false
            });
          }
        });
      }
    } else if (radioCheckType === 'column') {
      // update other radio in this column
      const columnGroup = table.scenegraph.getColGroup(col);
      columnGroup.forEachChildren((cellGroup: Group) => {
        cellGroup.forEachChildren((radio: Radio) => {
          if (radio.name === 'radio' && radio.id !== target.id) {
            radio.setAttributes({
              checked: false
            });
          }
        });
      });
    }

    // update state
    const radioIndexInCell = indexInCell ? Number(indexInCell) : undefined;
    table.stateManager.setRadioState(col, row, cellInfo.field as string | number, radioCheckType, radioIndexInCell);

    // trigger event
    const cellsEvent: MousePointerCellEvent & { radioIndexInCell: number | undefined } = {
      ...cellInfo,
      event: e.nativeEvent,
      target: eventArgsSet?.eventArgs?.target,
      mergeCellInfo: eventArgsSet?.eventArgs?.mergeInfo,
      radioIndexInCell
    };
    table.fireListeners(TABLE_EVENT_TYPE.RADIO_STATE_CHANGE, cellsEvent);

    table.scenegraph.updateNextFrame();
  });

  table.scenegraph.tableGroup.addEventListener('switch_state_change', (e: FederatedPointerEvent) => {
    const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
    const { col, row, target } = eventArgsSet.eventArgs;
    const cellInfo = table.getCellInfo(col, row);

    const mergeRange = getCellMergeInfo(table, col, row);
    if (mergeRange) {
      for (let col = mergeRange.start.col; col <= mergeRange.end.col; col++) {
        for (let row = mergeRange.start.row; row <= mergeRange.end.row; row++) {
          const cellGroup = table.scenegraph.getCell(col, row);
          cellGroup.forEachChildren((switchComponent: Switch) => {
            if (switchComponent.name === 'switch') {
              switchComponent.setAttributes({
                checked: (e.target.attribute as CheckboxAttributes).checked
              });
            }
          });
        }
      }
    }

    const cellsEvent: MousePointerCellEvent & { checked: boolean } = {
      ...cellInfo,
      event: e.nativeEvent,
      target: eventArgsSet?.eventArgs?.target,
      mergeCellInfo: eventArgsSet?.eventArgs?.mergeInfo,
      checked: (e.detail as unknown as { checked: boolean }).checked
    };

    table.stateManager.setCheckedState(
      col,
      row,
      cellInfo.field as string | number,
      (e.detail as unknown as { checked: boolean }).checked
    );

    table.fireListeners(TABLE_EVENT_TYPE.SWITCH_STATE_CHANGE, cellsEvent);

    table.scenegraph.updateNextFrame();
  });

  table.scenegraph.stage.addEventListener('wheel', (e: FederatedWheelEvent) => {
    const legend: any = e.path.find(node => (node as any).name === 'legend');
    if (!legend) {
      table.editorManager?.completeEdit();
      if (table.eventManager._enableTableScroll) {
        handleWhell(e, stateManager);
      }
    }
  });
}
export function bindGesture(eventManager: EventManager) {
  const table = eventManager.table;
  eventManager.gesture = new Gesture(table.scenegraph.tableGroup as unknown as IEventTarget, {
    tap: {
      interval: 300
    }
  });
  eventManager.gesture.on('doubletap', e => {
    console.log('doubletap', e);
    // e.preventDefault();
    dblclickHandler(e, table);
  });
}
export function endResizeCol(table: BaseTableAPI) {
  table.stateManager.endResizeCol();
  // textStick 依赖了这个事件 所以一定要触发RESIZE_COLUMN_END
  // if ((table as any).hasListeners(TABLE_EVENT_TYPE.RESIZE_COLUMN_END)) {
  // RESIZE_COLUMN_END事件触发，返回所有列宽
  const columns = [];
  // 返回所有列宽信息
  for (let col = 0; col < table.colCount; col++) {
    columns.push(table.getColWidth(col));
  }
  table.fireListeners(TABLE_EVENT_TYPE.RESIZE_COLUMN_END, {
    col: table.stateManager.columnResize.col,
    colWidths: columns
  });
  // }
}

export function endResizeRow(table: BaseTableAPI) {
  table.stateManager.endResizeRow();

  table.fireListeners(TABLE_EVENT_TYPE.RESIZE_ROW_END, {
    row: table.stateManager.rowResize.row,
    rowHeight: table.getRowHeight(table.stateManager.rowResize.row)
  });
}

function dblclickHandler(e: FederatedPointerEvent, table: BaseTableAPI) {
  const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
  let col = -1;
  let row = -1;
  if (eventArgsSet.eventArgs) {
    col = eventArgsSet.eventArgs.col;
    row = eventArgsSet.eventArgs.row;
  }
  const value = table.getCellValue(col, row);

  const bounds = eventArgsSet.eventArgs?.targetCell?.globalAABBBounds;
  bounds &&
    table.internalProps.focusControl.setFocusRect(
      new Rect(bounds.x1 + table.scrollLeft, bounds.y1 + table.scrollTop, bounds.x2 - bounds.x1, bounds.y2 - bounds.y1),
      value
    );
  if ((table as any).hasListeners(TABLE_EVENT_TYPE.DBLCLICK_CELL)) {
    const cellInfo = table.getCellInfo(col, row);
    let icon;
    let position;
    if (eventArgsSet.eventArgs?.target) {
      const iconInfo = getIconAndPositionFromTarget(eventArgsSet.eventArgs?.target);
      if (iconInfo) {
        icon = iconInfo.icon;
        position = iconInfo.position;
      }
    }
    const cellsEvent: MousePointerMultiCellEvent = {
      ...cellInfo,
      event: e.nativeEvent,
      federatedEvent: e,
      cells: [],
      targetIcon: icon
        ? {
            name: icon.name,
            position: position,
            funcType: (icon as any).attribute.funcType
          }
        : undefined,
      target: eventArgsSet?.eventArgs?.target,
      mergeCellInfo: eventArgsSet?.eventArgs?.mergeInfo
    };
    table.fireListeners(TABLE_EVENT_TYPE.DBLCLICK_CELL, cellsEvent);
  }
}
