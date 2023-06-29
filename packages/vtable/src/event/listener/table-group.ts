import type { FederatedPointerEvent } from '@visactor/vrender';
import type { MousePointerMultiCellEvent, MousePointerSparklineEvent } from '../../ts-types';
import { InteractionState } from '../../ts-types';
import type { SceneEvent } from '../util';
import { getCellEventArgsSet } from '../util';
import { TABLE_EVENT_TYPE } from '../../core/TABLE_EVENT_TYPE';
import type { Group } from '../../scenegraph/graphic/group';
import { isValid } from '@visactor/vutils';
import { getIconAndPositionFromTarget } from '../../scenegraph/utils/icon';
import { cellInRanges } from '../../tools/helper';
import { Rect } from '../../tools/Rect';
import type { EventManeger } from '../event';

export function bindTableGroupListener(eventManeger: EventManeger) {
  const table = eventManeger.table;
  const stateManeger = table.stateManeger;
  table.scenegraph.tableGroup.addEventListener('pointermove', (e: FederatedPointerEvent) => {
    // console.log('scenegraph pointermove',e.type);
    // const eventArgsSet: SceneEvent = (table as any).getCellEventArgsSet(e);
    if (eventManeger.touchSetTimeout) {
      clearTimeout(eventManeger.touchSetTimeout);
      eventManeger.touchSetTimeout = undefined;
    }
    const eventArgsSet = getCellEventArgsSet(e);

    if (stateManeger.interactionState === InteractionState.scrolling) {
      return;
    }
    if (stateManeger.interactionState === InteractionState.grabing) {
      if (stateManeger.isResizeCol()) {
        eventManeger.dealColumnResizer(eventArgsSet);
        if (eventArgsSet.eventArgs && (table as any).hasListeners(TABLE_EVENT_TYPE.RESIZE_COLUMN)) {
          table.fireListeners(TABLE_EVENT_TYPE.RESIZE_COLUMN, {
            col: table.stateManeger.columnResize.col,
            colWidth: table.getColWidth(table.stateManeger.columnResize.col)
          });
        }
      } else if (stateManeger.isMoveCol()) {
        eventManeger.dealColumnMover(eventArgsSet);
      } else {
        eventManeger.dealTableSelect(eventArgsSet);
      }
      return;
    }
    // if (stateManeger.menu.isShow && stateManeger.menu.bounds.inPoint(e.x, e.y)) {
    //   eventManeger.dealMenuHover(eventArgsSet);
    //   return;
    // }
    // 更新列宽调整pointer
    if (eventManeger.checkColumnResizer(eventArgsSet)) {
      stateManeger.updateCursor('col-resize');
    } else {
      stateManeger.updateCursor();
    }

    if ((table as any).hasListeners(TABLE_EVENT_TYPE.MOUSELEAVE_CELL)) {
      const cellGoup = eventArgsSet?.eventArgs?.target as unknown as Group;
      if (
        cellGoup?.role === 'cell' &&
        table.stateManeger.hover.cellPos.col !== -1 &&
        table.stateManeger.hover.cellPos.row !== -1 &&
        (cellGoup.col !== table.stateManeger.hover.cellPos.col || cellGoup.row !== table.stateManeger.hover.cellPos.row)
      ) {
        table.fireListeners(TABLE_EVENT_TYPE.MOUSELEAVE_CELL, {
          col: table.stateManeger.hover.cellPos.col,
          row: table.stateManeger.hover.cellPos.row,
          cellRange: table.getCellRangeRelativeRect({
            col: table.stateManeger.hover.cellPos.col,
            row: table.stateManeger.hover.cellPos.row
          }),
          scaleRatio: table.canvas.getBoundingClientRect().width / table.canvas.offsetWidth,
          event: e.nativeEvent
        });
      }
    }
    if ((table as any).hasListeners(TABLE_EVENT_TYPE.MOUSEENTER_CELL)) {
      const cellGoup = eventArgsSet?.eventArgs?.target as unknown as Group;
      if (
        cellGoup?.role === 'cell' &&
        isValid(cellGoup.col) &&
        isValid(cellGoup.row) &&
        (cellGoup.col !== table.stateManeger.hover.cellPos.col || cellGoup.row !== table.stateManeger.hover.cellPos.row)
      ) {
        table.fireListeners(TABLE_EVENT_TYPE.MOUSEENTER_CELL, {
          col: cellGoup.col,
          row: cellGoup.row,
          cellRange: table.getCellRangeRelativeRect({
            col: cellGoup.col,
            row: cellGoup.row
          }),
          scaleRatio: table.canvas.getBoundingClientRect().width / table.canvas.offsetWidth,
          event: e.nativeEvent
        });
      }
    }
    eventManeger.dealIconHover(eventArgsSet);
    eventManeger.dealTableHover(eventArgsSet);

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
          : undefined
      });
    }
  });

  table.scenegraph.tableGroup.addEventListener('pointerout', (e: FederatedPointerEvent) => {
    const eventArgsSet = getCellEventArgsSet(e);
    const cellGoup = eventArgsSet?.eventArgs?.target as unknown as Group;
    if (cellGoup?.role === 'table') {
      eventManeger.dealTableHover();
    }
  });

  table.scenegraph.tableGroup.addEventListener('pointerover', (e: FederatedPointerEvent) => {
    const eventArgsSet = getCellEventArgsSet(e);
    const cellGoup = eventArgsSet?.eventArgs?.target as unknown as Group;
    // console.log('pointerover', cellGoup);
    if ((table as any).hasListeners(TABLE_EVENT_TYPE.MOUSEOVER_CHART_SYMBOL) && cellGoup.type === 'symbol') {
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
          caption: table.getBodyColumnDefine(col, row).caption,
          cellRange: table.getCellRelativeRect(col, row),
          event: e.nativeEvent,
          sparkline: {
            pointData: undefined // chartPoint.pointData,
          },
          scaleRatio: table.canvas.getBoundingClientRect().width / table.canvas.offsetWidth
        };
        table.fireListeners(TABLE_EVENT_TYPE.MOUSEOVER_CHART_SYMBOL, eventInfo);
      }
    }
    //MOUSEENTER_CELL 不能在这里触发 引发在单元格内移动会触发多次的问题【迷你图的单元格中】
    // if ((table as any).hasListeners(DG_EVENT_TYPE.MOUSEENTER_CELL)) {
    //   const eventArgsSet = getCellEventArgsSet(e);
    //   const cellGoup = eventArgsSet?.eventArgs?.target as unknown as Group;
    //   console.log('hover cell', table.stateManeger.hover.cellPos);
    //   if (
    //     cellGoup?.role === 'cell' &&
    //     (cellGoup.col !== table.stateManeger.hover.cellPos.col ||
    //       cellGoup.row !== table.stateManeger.hover.cellPos.row)
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
  table.scenegraph.tableGroup.addEventListener('pointerleave', (e: FederatedPointerEvent) => {
    stateManeger.updateInteractionState(InteractionState.default);
    eventManeger.dealTableHover();
    stateManeger.updateCursor();
    const target = e.target;
    if (target && !target.isDescendantsOf(table.scenegraph.tableGroup)) {
      table.fireListeners(TABLE_EVENT_TYPE.MOUSELEAVE_TABLE, {
        col: -1,
        row: -1,
        event: e.nativeEvent
      });
    }
  });

  table.scenegraph.tableGroup.addEventListener('pointerupoutside', (e: FederatedPointerEvent) => {
    console.log('pointerupoutside');
    stateManeger.updateInteractionState(InteractionState.default);
    eventManeger.dealTableHover();
    eventManeger.dealTableSelect();
  });

  table.scenegraph.tableGroup.addEventListener('pointerdown', (e: FederatedPointerEvent) => {
    if (e.button !== 0) {
      // 只处理左键
      return;
    }
    const eventArgsSet: SceneEvent = getCellEventArgsSet(e);

    if (stateManeger.interactionState !== InteractionState.default) {
      return;
    }

    // 处理menu
    if (
      stateManeger.menu.isShow &&
      eventArgsSet.eventArgs &&
      (eventArgsSet.eventArgs.target as any) !== stateManeger.residentHoverIcon?.icon
    ) {
      // 点击在menu外，且不是下拉菜单的icon，移除menu
      stateManeger.hideMenu();
    }
    const hitIcon = (eventArgsSet?.eventArgs?.target as any)?.role?.startsWith('icon')
      ? eventArgsSet.eventArgs.target
      : undefined;
    if (!hitIcon) {
      if (e.pointerType === 'touch') {
        eventManeger.touchEnd = false;
        eventManeger.touchSetTimeout = setTimeout(() => {
          eventManeger.isTouchdown = false;
          eventManeger.touchMove = true;
          // 处理列宽调整
          if (!eventManeger.touchEnd && eventManeger.checkColumnResizer(eventArgsSet, true)) {
            // eventManeger.startColumnResizer(e);
            // eventManeger._resizing = true;
            stateManeger.updateInteractionState(InteractionState.grabing);
            return;
          }

          // 处理column mover
          if (!eventManeger.touchEnd && eventManeger.chechColumnMover(eventArgsSet)) {
            stateManeger.updateInteractionState(InteractionState.grabing);
            return;
          }

          // 处理单元格选择
          if (eventManeger.dealTableSelect(eventArgsSet) && !eventManeger.touchEnd) {
            // 先执行单选逻辑，再更新为grabing模式
            // stateManeger.interactionState = 'grabing';
            stateManeger.updateInteractionState(InteractionState.grabing);
            // console.log('DRAG_SELECT_START');
          }
        }, 500);
      } else {
        // 处理列宽调整
        if (eventManeger.checkColumnResizer(eventArgsSet, true)) {
          // eventManeger.startColumnResizer(e);
          // eventManeger._resizing = true;
          stateManeger.updateInteractionState(InteractionState.grabing);
          return;
        }

        // 处理column mover
        if (eventManeger.chechColumnMover(eventArgsSet)) {
          stateManeger.updateInteractionState(InteractionState.grabing);
          return;
        }

        // 处理单元格选择
        if (eventManeger.dealTableSelect(eventArgsSet)) {
          // 先执行单选逻辑，再更新为grabing模式
          // stateManeger.interactionState = 'grabing';
          stateManeger.updateInteractionState(InteractionState.grabing);
          // console.log('DRAG_SELECT_START');
        }
      }
    }
    if ((table as any).hasListeners(TABLE_EVENT_TYPE.MOUSEDOWN_CELL)) {
      const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
      if (eventArgsSet.eventArgs) {
        table.fireListeners(TABLE_EVENT_TYPE.MOUSEDOWN_CELL, {
          col: eventArgsSet.eventArgs.col,
          row: eventArgsSet.eventArgs.row,
          event: e.nativeEvent
        });
      }
    }
  });

  table.scenegraph.tableGroup.addEventListener('pointerup', (e: FederatedPointerEvent) => {
    // console.log('pointerup');
    if (e.button !== 0) {
      // 只处理左键
      return;
    }
    if (stateManeger.interactionState === 'grabing') {
      // stateManeger.interactionState = 'default';
      stateManeger.updateInteractionState(InteractionState.default);
      // eventManeger._resizing = false;
      if (stateManeger.isResizeCol()) {
        table.stateManeger.endResizeCol();
        if ((table as any).hasListeners(TABLE_EVENT_TYPE.RESIZE_COLUMN_END)) {
          // RESIZE_COLUMN_END事件触发，返回所有列宽
          const columns = [];
          // 返回所有列宽信息
          for (let col = 0; col < table.colCount; col++) {
            columns.push(table.getColWidth(col));
          }
          table.fireListeners(TABLE_EVENT_TYPE.RESIZE_COLUMN_END, {
            col: table.stateManeger.columnResize.col,
            columns
          });
        }
      } else if (stateManeger.isMoveCol()) {
        table.stateManeger.endMoveCol();
        const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
        if (eventArgsSet.eventArgs && (table as any).hasListeners(TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION)) {
          table.fireListeners(TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION, {
            target: { col: eventArgsSet.eventArgs.col, row: eventArgsSet.eventArgs.row },
            source: {
              col: table.stateManeger.columnMove.colSource,
              row: table.stateManeger.columnMove.colSource //TODO row
            }
          });
        }
      } else if (stateManeger.isSelecting()) {
        table.stateManeger.endSelectCells();
        const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
        if (eventArgsSet.eventArgs && (table as any).hasListeners(TABLE_EVENT_TYPE.DRAG_SELECT_END)) {
          const cellsEvent: MousePointerMultiCellEvent = {
            event: e.nativeEvent,
            cells: [],
            col: (eventArgsSet.eventArgs.target as unknown as Group).col,
            row: (eventArgsSet.eventArgs.target as unknown as Group).row,
            scaleRatio: table.canvas.getBoundingClientRect().width / table.canvas.offsetWidth
          };

          cellsEvent.cells = table.getSelectedCellInfos();
          table.fireListeners(TABLE_EVENT_TYPE.DRAG_SELECT_END, cellsEvent);
        }
      }
    } else if (stateManeger.interactionState === InteractionState.scrolling) {
      stateManeger.updateInteractionState(InteractionState.default);
      // scroll end
    }
    // console.log('DRAG_SELECT_END');
    if ((table as any).hasListeners(TABLE_EVENT_TYPE.MOUSEUP_CELL)) {
      const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
      if (eventArgsSet.eventArgs) {
        table.fireListeners(TABLE_EVENT_TYPE.MOUSEUP_CELL, {
          col: eventArgsSet.eventArgs.col,
          row: eventArgsSet.eventArgs.row,
          event: e.nativeEvent
        });
      }
    }
  });

  table.scenegraph.tableGroup.addEventListener('rightdown', (e: FederatedPointerEvent) => {
    const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
    // 右键点击
    if (eventArgsSet.eventArgs) {
      stateManeger.triggerContextMenu(
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
            : undefined
        };
        if (cellInRanges(table.stateManeger.select.ranges, col, row)) {
          // 用户右键点击已经选中的区域
          // const { start, end } = eventManeger.selection.range;
          cellsEvent.cells = table.getSelectedCellInfos();
        } else {
          // 用户右键点击新单元格
          cellsEvent.cells = [[cellInfo]];
        }

        table.fireListeners(TABLE_EVENT_TYPE.CONTEXTMENU_CELL, cellsEvent);
      }
    }
  });

  table.scenegraph.tableGroup.addEventListener('click', (e: FederatedPointerEvent) => {
    console.log('click', e);
    if (table.stateManeger.columnResize.resizing || table.stateManeger.columnMove.moving) {
      return;
    }
    const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
    eventManeger.dealIconClick(e, eventArgsSet);
    if (!eventArgsSet?.eventArgs) {
      return;
    }
    const { col, row } = eventArgsSet.eventArgs;
    if ((table as any).hasListeners(TABLE_EVENT_TYPE.CLICK_CELL)) {
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
          : undefined
      };

      table.fireListeners(TABLE_EVENT_TYPE.CLICK_CELL, cellsEvent);
    }
  });

  // click outside
  table.scenegraph.stage.addEventListener('click', (e: FederatedPointerEvent) => {
    console.log('stage click');
    const target = e.target;
    if (
      target &&
      !target.isDescendantsOf(table.scenegraph.tableGroup) &&
      (target as any) !== table.scenegraph.tableGroup
    ) {
      console.log('pointerup outside table');
      stateManeger.updateInteractionState(InteractionState.default);
      eventManeger.dealTableHover();
      eventManeger.dealTableSelect();
      stateManeger.updateCursor();
    }
  });

  table.scenegraph.tableGroup.addEventListener('dblclick', (e: FederatedPointerEvent) => {
    const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
    const bounds = eventArgsSet.eventArgs.targetCell.globalAABBBounds;
    const { col, row } = eventArgsSet.eventArgs;
    const value = table.getCellValue(col, row);
    table.internalProps.focusControl.setFocusRect(
      new Rect(bounds.x1 + table.scrollLeft, bounds.y1 + table.scrollTop, bounds.x2 - bounds.x1, bounds.y2 - bounds.y1),
      value
    );
    // console.log('activeElement',document.activeElement);
    // table.getElement().focus();
    // console.log('activeElement 2',document.activeElement);
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
        cells: [],
        targetIcon: icon
          ? {
              name: icon.name,
              position: position,
              funcType: (icon as any).attribute.funcType
            }
          : undefined
      };
      table.fireListeners(TABLE_EVENT_TYPE.DBLCLICK_CELL, cellsEvent);
    }
  });
}
