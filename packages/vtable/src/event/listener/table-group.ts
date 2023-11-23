import type { IEventTarget } from '@visactor/vrender';
import { Gesture, type FederatedPointerEvent } from '@visactor/vrender';
import type { MousePointerCellEvent, MousePointerMultiCellEvent, MousePointerSparklineEvent } from '../../ts-types';
import { InteractionState } from '../../ts-types';
import type { SceneEvent } from '../util';
import { getCellEventArgsSet } from '../util';
import { TABLE_EVENT_TYPE } from '../../core/TABLE_EVENT_TYPE';
import type { Group } from '../../scenegraph/graphic/group';
import { isValid, last } from '@visactor/vutils';
import { getIconAndPositionFromTarget } from '../../scenegraph/utils/icon';
import { cellInRanges } from '../../tools/helper';
import { Rect } from '../../tools/Rect';
import type { EventManeger } from '../event';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { IIconGraphicAttribute } from '../../scenegraph/graphic/icon';
// PointerMove敏感度太高了 记录下上一个鼠标位置 在接收到PointerMove事件时做判断 是否到到触发框选或者移动表头操作的标准，防止误触
let LastPointerXY: { x: number; y: number };
let LastBodyPointerXY: { x: number; y: number };
let isDown = false;
let isDraging = false;
export function bindTableGroupListener(eventManeger: EventManeger) {
  const table = eventManeger.table;
  const stateManeger = table.stateManeger;

  document.body.addEventListener('pointerdown', e => {
    LastBodyPointerXY = { x: e.x, y: e.y };
    isDown = true;
  });
  document.addEventListener('pointerup', e => {
    LastBodyPointerXY = null;
    // console.log('body pointerup', isDown, isDraging);
    isDown = false;
    isDraging = false;
  });
  document.body.addEventListener('pointermove', (e: FederatedPointerEvent) => {
    if (isDown && LastBodyPointerXY) {
      const lastX = LastBodyPointerXY?.x ?? e.x;
      const lastY = LastBodyPointerXY?.y ?? e.y;
      if (Math.abs(lastX - e.x) > 1 || Math.abs(lastY - e.y) > 1) {
        isDraging = true;
      }
    }
    // 注释掉。因为： 这里pointermove太敏感了 点击快的时候 可能动了1px这里也会执行到 就影响到下面选中不触发的问题。下面pointermove就有这段逻辑，这里先去掉
    // if (eventManeger.touchSetTimeout) {
    //   clearTimeout(eventManeger.touchSetTimeout);
    //   console.log('eventManeger.touchSetTimeout', eventManeger.touchSetTimeout);
    //   eventManeger.touchSetTimeout = undefined;
    // }
    // const eventArgsSet = getCellEventArgsSet(e);
    const { x, y } = table._getMouseAbstractPoint(e, false);
    if (stateManeger.interactionState === InteractionState.scrolling) {
      return;
    }
    if (stateManeger.interactionState === InteractionState.grabing) {
      if (stateManeger.isResizeCol()) {
        eventManeger.dealColumnResize(x, y);
        if ((table as any).hasListeners(TABLE_EVENT_TYPE.RESIZE_COLUMN)) {
          table.fireListeners(TABLE_EVENT_TYPE.RESIZE_COLUMN, {
            col: table.stateManeger.columnResize.col,
            colWidth: table.getColWidth(table.stateManeger.columnResize.col)
          });
        }
      }
    }
  });
  table.scenegraph.tableGroup.addEventListener('pointermove', (e: FederatedPointerEvent) => {
    const lastX = LastPointerXY?.x ?? e.x;
    const lastY = LastPointerXY?.y ?? e.y;
    LastPointerXY = { x: e.x, y: e.y };
    // const eventArgsSet: SceneEvent = (table as any).getCellEventArgsSet(e);
    if (eventManeger.touchSetTimeout) {
      // 移动端事件特殊处理
      clearTimeout(eventManeger.touchSetTimeout);
      eventManeger.touchSetTimeout = undefined;
    }
    const eventArgsSet = getCellEventArgsSet(e);

    if (stateManeger.interactionState === InteractionState.scrolling) {
      return;
    }
    if (
      stateManeger.interactionState === InteractionState.grabing &&
      Math.abs(lastX - e.x) + Math.abs(lastY - e.y) >= 1
    ) {
      if (stateManeger.isResizeCol()) {
        /* do nothing */
      } else if (stateManeger.isMoveCol()) {
        eventManeger.dealColumnMover(eventArgsSet);
      } else {
        eventManeger.dealTableSelect(eventArgsSet, true);
      }
      return;
    }
    // if (stateManeger.menu.isShow && stateManeger.menu.bounds.inPoint(e.x, e.y)) {
    //   eventManeger.dealMenuHover(eventArgsSet);
    //   return;
    // }
    // 更新列宽调整pointer
    if (stateManeger.isResizeCol() || eventManeger.checkColumnResize(eventArgsSet)) {
      stateManeger.updateCursor('col-resize');
    } else {
      stateManeger.updateCursor();
    }
    const cellGoup: any = e.path.find(node => (node as any).role === 'cell');
    if ((table as any).hasListeners(TABLE_EVENT_TYPE.MOUSELEAVE_CELL)) {
      // const cellGoup = eventArgsSet?.eventArgs?.target as unknown as Group;
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
          event: e.nativeEvent,
          target: eventArgsSet?.eventArgs?.target
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
          : undefined,
        target: eventArgsSet?.eventArgs?.target
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
    //resize 列宽 当鼠标离开table也需要继续响应
    if (!stateManeger.isResizeCol() && !stateManeger.isMoveCol() && !stateManeger.isSelecting()) {
      stateManeger.updateInteractionState(InteractionState.default);
      stateManeger.updateCursor();
    }
    eventManeger.dealTableHover();

    const target = e.target;
    if (target && !target.isDescendantsOf(table.scenegraph.tableGroup)) {
      table.fireListeners(TABLE_EVENT_TYPE.MOUSELEAVE_TABLE, {
        col: -1,
        row: -1,
        event: e.nativeEvent,
        target: undefined
      });
    }
  });

  table.scenegraph.tableGroup.addEventListener('pointerupoutside', (e: FederatedPointerEvent) => {
    // 同pointerup中的逻辑
    if (stateManeger.isResizeCol()) {
      endResizeCol(table);
    } else if (stateManeger.isMoveCol()) {
      table.stateManeger.endMoveCol();
      if (
        table.stateManeger.columnMove?.colSource !== -1 &&
        table.stateManeger.columnMove?.rowSource !== -1 &&
        table.stateManeger.columnMove?.colTarget !== -1 &&
        table.stateManeger.columnMove?.rowTarget !== -1
      ) {
        // 下面触发CHANGE_HEADER_POSITION 区别于pointerup
        if ((table as any).hasListeners(TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION)) {
          table.fireListeners(TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION, {
            target: { col: table.stateManeger.columnMove.colTarget, row: table.stateManeger.columnMove.rowTarget },
            source: {
              col: table.stateManeger.columnMove.colSource,
              row: table.stateManeger.columnMove.rowSource //TODO row
            }
          });
        }
      }
    } else if (stateManeger.isSelecting()) {
      if (table.stateManeger.select?.ranges?.length) {
        const lastCol = table.stateManeger.select.ranges[table.stateManeger.select.ranges.length - 1].end.col;
        const lastRow = table.stateManeger.select.ranges[table.stateManeger.select.ranges.length - 1].end.row;
        table.stateManeger.endSelectCells();
        if ((table as any).hasListeners(TABLE_EVENT_TYPE.DRAG_SELECT_END)) {
          const cellsEvent: MousePointerMultiCellEvent = {
            event: e.nativeEvent,
            cells: [],
            col: lastCol,
            row: lastRow,
            scaleRatio: table.canvas.getBoundingClientRect().width / table.canvas.offsetWidth,
            target: undefined
          };
          cellsEvent.cells = table.getSelectedCellInfos();
          table.fireListeners(TABLE_EVENT_TYPE.DRAG_SELECT_END, cellsEvent);
        }
      }
    }
    stateManeger.updateInteractionState(InteractionState.default);
    eventManeger.dealTableHover();
    //点击到表格外部不需要取消选中状态
    // eventManeger.dealTableSelect();
  });

  table.scenegraph.tableGroup.addEventListener('pointerdown', (e: FederatedPointerEvent) => {
    LastPointerXY = { x: e.x, y: e.y };
    if (e.button !== 0) {
      // 只处理左键
      return;
    }
    const eventArgsSet: SceneEvent = getCellEventArgsSet(e);

    if (stateManeger.interactionState !== InteractionState.default) {
      return;
    }
    //处理当点击到的不是图表上时 更新图表的状态为空
    if (table.isPivotChart() && eventArgsSet?.eventArgs?.target.type !== 'chart') {
      table.scenegraph.updateChartState(null);
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
    if (!hitIcon || (hitIcon.attribute as IIconGraphicAttribute).interactive === false) {
      if (e.pointerType === 'touch') {
        // 移动端事件特殊处理
        eventManeger.touchEnd = false;
        eventManeger.touchSetTimeout = setTimeout(() => {
          eventManeger.isTouchdown = false;
          eventManeger.touchMove = true;
          // 处理列宽调整
          if (!eventManeger.touchEnd && eventManeger.checkColumnResize(eventArgsSet, true)) {
            // eventManeger.startColumnResize(e);
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
        // 这里处理成hover  这样移动端 当点击到带有下拉菜单dropdown的单元格时 那个icon才能绘制出来。可以测试example的menu示例
        eventManeger.dealTableHover(eventArgsSet);
      } else {
        // 处理列宽调整
        if (eventManeger.checkColumnResize(eventArgsSet, true)) {
          // eventManeger.startColumnResize(e);
          // eventManeger._resizing = true;
          table.scenegraph.updateChartState(null);
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
          event: e.nativeEvent,
          target: eventArgsSet?.eventArgs?.target
        });
      }
    }
  });
  // 注意和pointertap事件的处理 vrender中的事件系统： 是先触发pointerup 如果是点击到的场景树图元节点则会继续触发pointertap 否则不触发pointertap
  table.scenegraph.tableGroup.addEventListener('pointerup', (e: FederatedPointerEvent) => {
    console.log('tableGroup', 'pointerup');
    if (e.button !== 0) {
      // 只处理左键
      return;
    }
    if (stateManeger.interactionState === 'grabing') {
      // stateManeger.interactionState = 'default';
      stateManeger.updateInteractionState(InteractionState.default);
      // eventManeger._resizing = false;
      if (stateManeger.isResizeCol()) {
        endResizeCol(table);
      } else if (stateManeger.isMoveCol()) {
        const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
        table.stateManeger.endMoveCol();
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
            scaleRatio: table.canvas.getBoundingClientRect().width / table.canvas.offsetWidth,
            target: eventArgsSet?.eventArgs?.target
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
          event: e.nativeEvent,
          target: eventArgsSet?.eventArgs?.target
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
            : undefined,
          target: eventArgsSet?.eventArgs?.target
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
  // 注意和pointerup事件的处理 vrender中的事件系统： 是先触发pointerup 如果是点击到的场景树图元节点则会继续触发pointertap 否则不触发pointertap
  table.scenegraph.tableGroup.addEventListener('pointertap', (e: FederatedPointerEvent) => {
    console.log('tableGroup', 'pointertap');
    if (table.stateManeger.columnResize.resizing || table.stateManeger.columnMove.moving) {
      return;
    }
    const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
    eventManeger.dealIconClick(e, eventArgsSet);
    if (!eventArgsSet?.eventArgs) {
      return;
    }
    if (eventManeger.touchSetTimeout || e.pointerType !== 'touch') {
      // 通过这个变量判断非drag鼠标拖拽状态，就不再增加其他变量isDrag了（touchSetTimeout如果拖拽过会变成undefined pointermove事件有置为undefined）
      if (e.pointerType === 'touch') {
        // 移动端事件特殊处理
        const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
        if (eventManeger.touchSetTimeout) {
          clearTimeout(eventManeger.touchSetTimeout);
          eventManeger.dealTableSelect(eventArgsSet);
          stateManeger.endSelectCells();
          eventManeger.touchSetTimeout = undefined;
        }
      }
      if ((table as any).hasListeners(TABLE_EVENT_TYPE.CLICK_CELL)) {
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
          target: eventArgsSet?.eventArgs?.target
        };

        table.fireListeners(TABLE_EVENT_TYPE.CLICK_CELL, cellsEvent);
      }
    }
  });

  // click outside
  table.scenegraph.stage.addEventListener('pointertap', (e: FederatedPointerEvent) => {
    const target = e.target;
    if (
      // 如果是鼠标点击到canvas空白区域 则取消选中状态
      !isDraging &&
      target &&
      !target.isDescendantsOf(table.scenegraph.tableGroup)
      // &&
      // (target as any) !== table.scenegraph.tableGroup &&
      // (target as any) !== table.scenegraph.stage
    ) {
      stateManeger.updateInteractionState(InteractionState.default);
      eventManeger.dealTableHover();
      eventManeger.dealTableSelect();
      stateManeger.updateCursor();
      table.scenegraph.updateChartState(null);
    } else if (isDraging) {
      // 如果鼠标拖拽后是否 则结束选中
      stateManeger.endSelectCells();
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

    const cellsEvent: MousePointerCellEvent & { checked: boolean } = {
      ...cellInfo,
      event: e.nativeEvent,
      target: eventArgsSet?.eventArgs?.target,
      checked: (e.detail as unknown as { checked: boolean }).checked
    };

    if (table.isHeader(col, row)) {
      //点击的表头部分的checkbox 需要同时处理表头和body单元格的状态
      table.stateManeger.setHeaderCheckedState(
        cellInfo.field as string | number,
        (e.detail as unknown as { checked: boolean }).checked
      );
      const define = table.getBodyColumnDefine(col, row);
      if (define.cellType === 'checkbox') {
        table.scenegraph.updateCheckboxCellState(col, row, (e.detail as unknown as { checked: boolean }).checked);
      }
    } else {
      //点击的是body单元格的checkbox  处理本单元格的状态维护 同时需要检查表头是否改变状态
      table.stateManeger.setCheckedState(
        col,
        row,
        cellInfo.field as string | number,
        (e.detail as unknown as { checked: boolean }).checked
      );
      const define = table.getBodyColumnDefine(col, row);
      if (define.headerType === 'checkbox') {
        const oldHeaderCheckedState = table.stateManeger.headerCheckedState[cellInfo.field as string | number];
        const newHeaderCheckedState = table.stateManeger.updateHeaderCheckedState(cellInfo.field as string | number);
        if (oldHeaderCheckedState !== newHeaderCheckedState) {
          table.scenegraph.updateHeaderCheckboxCellState(col, row, newHeaderCheckedState);
        }
      }
    }
    table.fireListeners(TABLE_EVENT_TYPE.CHECKBOX_STATE_CHANGE, cellsEvent);
  });
}
export function bindGesture(eventManeger: EventManeger) {
  const table = eventManeger.table;
  eventManeger.gesture = new Gesture(table.scenegraph.stage as unknown as IEventTarget, {
    tap: {
      interval: 400
    }
  });
  eventManeger.gesture.on('doubletap', e => {
    console.log('doubletap', e);
    // e.preventDefault();
    dblclickHandler(e, table);
  });
}
function endResizeCol(table: BaseTableAPI) {
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
}

function dblclickHandler(e: FederatedPointerEvent, table: BaseTableAPI) {
  const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
  const bounds = eventArgsSet.eventArgs.targetCell.globalAABBBounds;
  const { col, row } = eventArgsSet.eventArgs;
  const value = table.getCellValue(col, row);
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
      target: eventArgsSet?.eventArgs?.target
    };
    table.fireListeners(TABLE_EVENT_TYPE.DBLCLICK_CELL, cellsEvent);
  }
}
