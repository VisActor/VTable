import type { IEventTarget } from '@src/vrender';
import { Gesture, type FederatedPointerEvent } from '@src/vrender';
import type {
  ListTableAPI,
  MousePointerCellEvent,
  MousePointerMultiCellEvent,
  MousePointerSparklineEvent
} from '../../ts-types';
import { InteractionState } from '../../ts-types';
import type { SceneEvent } from '../util';
import { getCellEventArgsSet } from '../util';
import { TABLE_EVENT_TYPE } from '../../core/TABLE_EVENT_TYPE';
import type { Group } from '../../scenegraph/graphic/group';
import { isValid, last } from '@visactor/vutils';
import { getIconAndPositionFromTarget } from '../../scenegraph/utils/icon';
import { cellInRanges } from '../../tools/helper';
import { Rect } from '../../tools/Rect';
import type { EventManager } from '../event';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { IIconGraphicAttribute } from '../../scenegraph/graphic/icon';
import { getCellMergeInfo } from '../../scenegraph/utils/get-cell-merge';
import type { CheckBox, CheckboxAttributes } from '@visactor/vrender-components';

export function bindTableGroupListener(eventManager: EventManager) {
  const table = eventManager.table;
  const stateManager = table.stateManager;

  // 有被阻止冒泡的场景 就触发不到这里的事件了 所以这个LastBodyPointerXY变量的赋值在scrollbar的down事件也进行了处理
  document.body.addEventListener('pointerdown', e => {
    console.log('body pointerdown');
    table.eventManager.LastBodyPointerXY = { x: e.x, y: e.y };
    table.eventManager.isDown = true;
  });
  document.addEventListener('pointerup', e => {
    table.eventManager.LastBodyPointerXY = null;
    console.log('body pointerup', table.eventManager.isDown, table.eventManager.isDraging);
    table.eventManager.isDown = false;
    table.eventManager.isDraging = false;
  });
  document.body.addEventListener('pointermove', (e: FederatedPointerEvent) => {
    if (table.eventManager.isDown && table.eventManager.LastBodyPointerXY) {
      const lastX = table.eventManager.LastBodyPointerXY?.x ?? e.x;
      const lastY = table.eventManager.LastBodyPointerXY?.y ?? e.y;
      if (Math.abs(lastX - e.x) > 1 || Math.abs(lastY - e.y) > 1) {
        table.eventManager.isDraging = true;
      }
    }
    // 注释掉。因为： 这里pointermove太敏感了 点击快的时候 可能动了1px这里也会执行到 就影响到下面选中不触发的问题。下面pointermove就有这段逻辑，这里先去掉
    // if (eventManager.touchSetTimeout) {
    //   clearTimeout(eventManager.touchSetTimeout);
    //   console.log('eventManager.touchSetTimeout', eventManager.touchSetTimeout);
    //   eventManager.touchSetTimeout = undefined;
    // }
    // const eventArgsSet = getCellEventArgsSet(e);
    const { x, y } = table._getMouseAbstractPoint(e, false);
    if (stateManager.interactionState === InteractionState.scrolling) {
      return;
    }
    if (stateManager.interactionState === InteractionState.grabing) {
      if (stateManager.isResizeCol()) {
        eventManager.dealColumnResize(x, y);
        if ((table as any).hasListeners(TABLE_EVENT_TYPE.RESIZE_COLUMN)) {
          table.fireListeners(TABLE_EVENT_TYPE.RESIZE_COLUMN, {
            col: table.stateManager.columnResize.col,
            colWidth: table.getColWidth(table.stateManager.columnResize.col)
          });
        }
      }
    }
  });
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

    if (stateManager.interactionState === InteractionState.scrolling) {
      return;
    }
    if (stateManager.interactionState === InteractionState.grabing) {
      if (Math.abs(lastX - e.x) + Math.abs(lastY - e.y) >= 1) {
        if (stateManager.isResizeCol()) {
          /* do nothing */
        } else if (stateManager.isMoveCol()) {
          eventManager.dealColumnMover(eventArgsSet);
        } else {
          eventManager.dealTableSelect(eventArgsSet, true);
        }
      }
      return;
    }
    // if (stateManager.menu.isShow && stateManager.menu.bounds.inPoint(e.x, e.y)) {
    //   eventManager.dealMenuHover(eventArgsSet);
    //   return;
    // }
    // 更新列宽调整pointer
    if (stateManager.isResizeCol() || eventManager.checkColumnResize(eventArgsSet)) {
      stateManager.updateCursor('col-resize');
    } else {
      stateManager.updateCursor();
    }
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
          target: eventArgsSet?.eventArgs?.target
        });
      }
    }
    eventManager.dealIconHover(eventArgsSet);
    eventManager.dealTableHover(eventArgsSet);

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
  table.scenegraph.tableGroup.addEventListener('pointerleave', (e: FederatedPointerEvent) => {
    //resize 列宽 当鼠标离开table也需要继续响应
    if (!stateManager.isResizeCol() && !stateManager.isMoveCol() && !stateManager.isSelecting()) {
      stateManager.updateInteractionState(InteractionState.default);
      stateManager.updateCursor();
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
        col: -1,
        row: -1,
        event: e.nativeEvent,
        target: undefined
      });
    }
  });
  /**
   * 两种场景会触发这里的pointerupoutside
   * 1. 鼠标down和up的场景树节点不一样
   * 2. 点击到非stage的（非canvas）  其他dom节点
   */
  table.scenegraph.tableGroup.addEventListener('pointerupoutside', (e: FederatedPointerEvent) => {
    console.log('pointerupoutside');
    const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
    if (stateManager.menu.isShow && (eventArgsSet.eventArgs?.target as any) !== stateManager.residentHoverIcon?.icon) {
      setTimeout(() => {
        if (!table.internalProps.menuHandler.pointInMenuElement(e.page.x, e.page.y)) {
          stateManager.menu.isShow && stateManager.hideMenu();
        }
      }, 0);
    }
    // 同pointerup中的逻辑
    if (stateManager.isResizeCol()) {
      endResizeCol(table);
    } else if (stateManager.isMoveCol()) {
      table.stateManager.endMoveCol();
      if (
        table.stateManager.columnMove?.colSource !== -1 &&
        table.stateManager.columnMove?.rowSource !== -1 &&
        table.stateManager.columnMove?.colTarget !== -1 &&
        table.stateManager.columnMove?.rowTarget !== -1
      ) {
        // 下面触发CHANGE_HEADER_POSITION 区别于pointerup
        if ((table as any).hasListeners(TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION)) {
          table.fireListeners(TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION, {
            target: { col: table.stateManager.columnMove.colTarget, row: table.stateManager.columnMove.rowTarget },
            source: {
              col: table.stateManager.columnMove.colSource,
              row: table.stateManager.columnMove.rowSource //TODO row
            }
          });
        }
      }
    } else if (stateManager.isSelecting()) {
      if (table.stateManager.select?.ranges?.length) {
        const lastCol = table.stateManager.select.ranges[table.stateManager.select.ranges.length - 1].end.col;
        const lastRow = table.stateManager.select.ranges[table.stateManager.select.ranges.length - 1].end.row;
        table.stateManager.endSelectCells();
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
    (table as ListTableAPI).editorManager?.completeEdit(e.nativeEvent);
    stateManager.updateInteractionState(InteractionState.default);
    eventManager.dealTableHover();
    //点击到表格外部不需要取消选中状态
    // eventManager.dealTableSelect();
  });

  table.scenegraph.tableGroup.addEventListener('pointerdown', (e: FederatedPointerEvent) => {
    console.log('tableGroup pointerdown');
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
    (table as ListTableAPI).editorManager?.completeEdit(e.nativeEvent);

    const hitIcon = (eventArgsSet?.eventArgs?.target as any)?.role?.startsWith('icon')
      ? eventArgsSet.eventArgs.target
      : undefined;
    if (!hitIcon || (hitIcon.attribute as IIconGraphicAttribute).interactive === false) {
      if (e.pointerType === 'touch') {
        // 移动端事件特殊处理
        eventManager.touchEnd = false;
        eventManager.touchSetTimeout = setTimeout(() => {
          eventManager.isTouchdown = false;
          eventManager.touchMove = true;
          // 处理列宽调整
          if (!eventManager.touchEnd && eventManager.checkColumnResize(eventArgsSet, true)) {
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
        if (eventManager.checkColumnResize(eventArgsSet, true)) {
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

        // 处理单元格选择
        if (eventManager.dealTableSelect(eventArgsSet)) {
          // 先执行单选逻辑，再更新为grabing模式
          // stateManager.interactionState = 'grabing';
          stateManager.updateInteractionState(InteractionState.grabing);
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
    if (stateManager.interactionState === 'grabing') {
      // stateManager.interactionState = 'default';
      stateManager.updateInteractionState(InteractionState.default);
      // eventManager._resizing = false;
      if (stateManager.isResizeCol()) {
        endResizeCol(table);
      } else if (stateManager.isMoveCol()) {
        const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
        table.stateManager.endMoveCol();
        if (eventArgsSet.eventArgs && (table as any).hasListeners(TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION)) {
          table.fireListeners(TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION, {
            target: { col: eventArgsSet.eventArgs.col, row: eventArgsSet.eventArgs.row },
            source: {
              col: table.stateManager.columnMove.colSource,
              row: table.stateManager.columnMove.colSource //TODO row
            }
          });
        }
      } else if (stateManager.isSelecting()) {
        table.stateManager.endSelectCells();
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
          target: eventArgsSet?.eventArgs?.target
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
          target: eventArgsSet?.eventArgs?.target
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
    console.log('tableGroup', 'pointertap');
    if (table.stateManager.columnResize.resizing || table.stateManager.columnMove.moving) {
      return;
    }
    const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
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
          eventManager.dealTableSelect(eventArgsSet);
          stateManager.endSelectCells();
          eventManager.touchSetTimeout = undefined;
        }
      }
    }
    if (!eventManager.touchMove && (table as any).hasListeners(TABLE_EVENT_TYPE.CLICK_CELL)) {
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
  });
  // stage 的pointerdown监听 如果点击在表格内部 是会被阻止点的tableGroup的pointerdown 监听有stopPropagation
  table.scenegraph.stage.addEventListener('pointerdown', (e: FederatedPointerEvent) => {
    const eventArgsSet: SceneEvent = getCellEventArgsSet(e);
    if ((eventArgsSet.eventArgs?.target as any) !== stateManager.residentHoverIcon?.icon) {
      stateManager.hideMenu();
    }
    (table as ListTableAPI).editorManager?.completeEdit(e.nativeEvent);
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
      eventManager.dealTableSelect();
      stateManager.updateCursor();
      table.scenegraph.updateChartState(null);
    } else if (table.eventManager.isDraging) {
      // 如果鼠标拖拽后是否 则结束选中
      stateManager.endSelectCells();
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
        const newHeaderCheckedState = table.stateManager.updateHeaderCheckedState(cellInfo.field as string | number);
        if (oldHeaderCheckedState !== newHeaderCheckedState) {
          table.scenegraph.updateHeaderCheckboxCellState(col, row, newHeaderCheckedState);
        }
      }
    }
    table.fireListeners(TABLE_EVENT_TYPE.CHECKBOX_STATE_CHANGE, cellsEvent);
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
function endResizeCol(table: BaseTableAPI) {
  table.stateManager.endResizeCol();
  if ((table as any).hasListeners(TABLE_EVENT_TYPE.RESIZE_COLUMN_END)) {
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
  }
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
      target: eventArgsSet?.eventArgs?.target
    };
    table.fireListeners(TABLE_EVENT_TYPE.DBLCLICK_CELL, cellsEvent);
  }
}
