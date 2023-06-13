// import { FederatedPointerEvent } from '@visactor/vrender';
import type { FederatedPointerEvent, IEventTarget } from '@visactor/vrender';
import { RichText } from '@visactor/vrender';
import type { KeydownEvent, MousePointerMultiCellEvent, MousePointerSparklineEvent } from '../ts-types';
import { InteractionState } from '../ts-types';
import { IconFuncTypeEnum } from '../ts-types';
import type { EventHandler } from './EventHandler';
import type { StateManeger } from '../state/state';
import type { Scenegraph } from '../scenegraph/scenegraph';
import type { Group } from '../scenegraph/graphic/group';
import { TABLE_EVENT_TYPE } from '../core/TABLE_EVENT_TYPE';
import type { Icon } from '../scenegraph/graphic/icon';
import { checkCellInSelect } from '../state/common/check-in-select';
import { throttle, isValid } from '../tools/util';
import { browser, cellInRanges } from '../tools/helper';
import { Rect } from '../tools/Rect';
import { bindMediaClick } from './media-click';
import { bindDrillEvent, drillClick } from './drill';
import { bindChartHoverEvent } from './chart';
import { getIconAndPositionFromTarget } from '../scenegraph/utils/icon';
import type { BaseTableAPI } from '../ts-types/base-table';
import { handleWhell } from './scroll';

interface SceneEvent {
  abstractPos: {
    x: number;
    y: number;
  };
  eventArgs?: {
    col: number;
    row: number;
    event: FederatedPointerEvent;
    targetCell: Group;
    target: IEventTarget;
  };
}
export class EventManeger {
  table: BaseTableAPI;
  // _col: number;
  // _resizing: boolean = false;

  constructor(table: BaseTableAPI) {
    this.table = table;
    this.bindOuterEvent();
    setTimeout(() => {
      this.bindSelfEvent();
    }, 0);
  }

  // 绑定DOM事件
  bindOuterEvent() {
    const handler: EventHandler = this.table.internalProps.handler;
    const stateManeger: StateManeger = this.table.stateManeger;
    const scenegraph: Scenegraph = this.table.scenegraph;
    // const { tableGroup } = this.table.scenegraph;
    // handler.on(this.table.getElement(), 'pointermove', (e: MouseEvent) => {
    //   console.log('VTable div pointermove');
    // });

    this.table.scenegraph.tableGroup.addEventListener('pointermove', (e: FederatedPointerEvent) => {
      // console.log('scenegraph pointermove',e.type);
      // const eventArgsSet: SceneEvent = (this.table as any)._getCellEventArgsSet(e);
      const eventArgsSet = _getCellEventArgsSet(e);

      if (stateManeger.interactionState === InteractionState.scrolling) {
        return;
      }
      if (stateManeger.interactionState === InteractionState.grabing) {
        if (stateManeger.isResizeCol()) {
          this.dealColumnResizer(eventArgsSet);
          if (eventArgsSet.eventArgs && (this.table as any).hasListeners(TABLE_EVENT_TYPE.RESIZE_COLUMN)) {
            this.table.fireListeners(TABLE_EVENT_TYPE.RESIZE_COLUMN, {
              col: this.table.stateManeger.columnResize.col,
              colWidth: this.table.getColWidth(this.table.stateManeger.columnResize.col)
            });
          }
        } else if (stateManeger.isMoveCol()) {
          this.dealColumnMover(eventArgsSet);
        } else {
          this.dealTableSelect(eventArgsSet);
        }
        return;
      }
      // if (stateManeger.menu.isShow && stateManeger.menu.bounds.inPoint(e.x, e.y)) {
      //   this.dealMenuHover(eventArgsSet);
      //   return;
      // }
      // 更新列宽调整pointer
      if (this.checkColumnResizer(eventArgsSet)) {
        stateManeger.updateCursor('col-resize');
      } else {
        stateManeger.updateCursor();
      }

      if ((this.table as any).hasListeners(TABLE_EVENT_TYPE.MOUSELEAVE_CELL)) {
        const cellGoup = eventArgsSet?.eventArgs?.target as unknown as Group;
        if (
          cellGoup?.role === 'cell' &&
          this.table.stateManeger.hover.cellPos.col !== -1 &&
          this.table.stateManeger.hover.cellPos.row !== -1 &&
          (cellGoup.col !== this.table.stateManeger.hover.cellPos.col ||
            cellGoup.row !== this.table.stateManeger.hover.cellPos.row)
        ) {
          this.table.fireListeners(TABLE_EVENT_TYPE.MOUSELEAVE_CELL, {
            col: this.table.stateManeger.hover.cellPos.col,
            row: this.table.stateManeger.hover.cellPos.row,
            cellRange: this.table.getCellRangeRelativeRect({
              col: this.table.stateManeger.hover.cellPos.col,
              row: this.table.stateManeger.hover.cellPos.row
            }),
            scaleRatio: this.table.canvas.getBoundingClientRect().width / this.table.canvas.offsetWidth,
            event: e.nativeEvent
          });
        }
      }
      if ((this.table as any).hasListeners(TABLE_EVENT_TYPE.MOUSEENTER_CELL)) {
        const cellGoup = eventArgsSet?.eventArgs?.target as unknown as Group;
        if (
          cellGoup?.role === 'cell' &&
          isValid(cellGoup.col) &&
          isValid(cellGoup.row) &&
          (cellGoup.col !== this.table.stateManeger.hover.cellPos.col ||
            cellGoup.row !== this.table.stateManeger.hover.cellPos.row)
        ) {
          this.table.fireListeners(TABLE_EVENT_TYPE.MOUSEENTER_CELL, {
            col: cellGoup.col,
            row: cellGoup.row,
            cellRange: this.table.getCellRangeRelativeRect({
              col: cellGoup.col,
              row: cellGoup.row
            }),
            scaleRatio: this.table.canvas.getBoundingClientRect().width / this.table.canvas.offsetWidth,
            event: e.nativeEvent
          });
        }
      }
      this.dealIconHover(eventArgsSet);
      this.dealTableHover(eventArgsSet);

      // 触发MOUSEMOVE_CELL
      if (eventArgsSet.eventArgs && (this.table as any).hasListeners(TABLE_EVENT_TYPE.MOUSEMOVE_CELL)) {
        let icon;
        let position;
        if (eventArgsSet.eventArgs?.target) {
          const iconInfo = getIconAndPositionFromTarget(eventArgsSet.eventArgs?.target);
          if (iconInfo) {
            icon = iconInfo.icon;
            position = iconInfo.position;
          }
        }
        this.table.fireListeners(TABLE_EVENT_TYPE.MOUSEMOVE_CELL, {
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

    this.table.scenegraph.tableGroup.addEventListener('pointerout', (e: FederatedPointerEvent) => {
      const eventArgsSet = _getCellEventArgsSet(e);
      const cellGoup = eventArgsSet?.eventArgs?.target as unknown as Group;
      if (cellGoup?.role === 'table') {
        this.dealTableHover();
      }
    });

    this.table.scenegraph.tableGroup.addEventListener('pointerover', (e: FederatedPointerEvent) => {
      const eventArgsSet = _getCellEventArgsSet(e);
      const cellGoup = eventArgsSet?.eventArgs?.target as unknown as Group;
      // console.log('pointerover', cellGoup);
      if ((this.table as any).hasListeners(TABLE_EVENT_TYPE.MOUSEOVER_CHART_SYMBOL) && cellGoup.type === 'symbol') {
        const cellGroup = e.composedPath().find(p => (p as any).roll === 'cell');
        if (cellGroup) {
          const { col, row } = cellGroup as unknown as Group;
          const eventInfo: MousePointerSparklineEvent = {
            col,
            row,
            field: this.table.getHeaderField(col, row),
            value: this.table.getCellValue(col, row),
            dataValue: this.table.getCellOriginValue(col, row),
            cellHeaderPaths: this.table.internalProps.layoutMap.getCellHeaderPaths(col, row),
            caption: this.table.getBodyColumnDefine(col, row).caption,
            cellRange: this.table.getCellRelativeRect(col, row),
            event: e.nativeEvent,
            sparkline: {
              pointData: undefined // chartPoint.pointData,
            },
            scaleRatio: this.table.canvas.getBoundingClientRect().width / this.table.canvas.offsetWidth
          };
          this.table.fireListeners(TABLE_EVENT_TYPE.MOUSEOVER_CHART_SYMBOL, eventInfo);
        }
      }
      //MOUSEENTER_CELL 不能在这里触发 引发在单元格内移动会触发多次的问题【迷你图的单元格中】
      // if ((this.table as any).hasListeners(DG_EVENT_TYPE.MOUSEENTER_CELL)) {
      //   const eventArgsSet = _getCellEventArgsSet(e);
      //   const cellGoup = eventArgsSet?.eventArgs?.target as unknown as Group;
      //   console.log('hover cell', this.table.stateManeger.hover.cellPos);
      //   if (
      //     cellGoup?.role === 'cell' &&
      //     (cellGoup.col !== this.table.stateManeger.hover.cellPos.col ||
      //       cellGoup.row !== this.table.stateManeger.hover.cellPos.row)
      //   ) {
      //     this.table.fireListeners(DG_EVENT_TYPE.MOUSEENTER_CELL, {
      //       col: cellGoup.col,
      //       row: cellGoup.row,
      //       cellRange: this.table.getCellRangeRelativeRect({
      //         col: cellGoup.col,
      //         row: cellGoup.row,
      //       }),
      //       scaleRatio:
      //         this.table.canvas.getBoundingClientRect().width / this.table.canvas.offsetWidth,
      //       event: e.nativeEvent,
      //     });
      //   }
      // }
    });
    // this.table.scenegraph.tableGroup.addEventListener('pointerenter', (e: FederatedPointerEvent) => {
    //   console.log('pointerenter', e.target);
    // 触发MOUSEOVER_CELL
    // const eventArgsSet = _getCellEventArgsSet(e);
    // if ((eventArgsSet?.eventArgs?.target as unknown as Group)?.role === 'cell') {
    //   this.table.fireListeners(DG_EVENT_TYPE.MOUSEENTER_CELL, {
    //     col: (eventArgsSet.eventArgs.target as unknown as Group).col,
    //     row: (eventArgsSet.eventArgs.target as unknown as Group).row,
    //     cellRange: this.table.getCellRangeRelativeRect({
    //       col: (eventArgsSet.eventArgs.target as unknown as Group).col,
    //       row: (eventArgsSet.eventArgs.target as unknown as Group).row,
    //     }),
    //     scaleRatio: this.table.canvas.getBoundingClientRect().width / this.table.canvas.offsetWidth,
    //     event: e.nativeEvent,
    //   });
    // }
    // });
    this.table.scenegraph.tableGroup.addEventListener('pointerleave', (e: FederatedPointerEvent) => {
      stateManeger.updateInteractionState(InteractionState.default);
      this.dealTableHover();
      stateManeger.updateCursor();
      const target = e.target;
      if (target && !target.isDescendantsOf(this.table.scenegraph.tableGroup)) {
        this.table.fireListeners(TABLE_EVENT_TYPE.MOUSELEAVE_TABLE, {
          col: -1,
          row: -1,
          event: e.nativeEvent
        });
      }
    });

    handler.on(this.table.getElement(), 'blur', (e: MouseEvent) => {
      console.log('blur');
      this.dealTableHover();
      // this.dealTableSelect();
    });

    this.table.scenegraph.tableGroup.addEventListener('pointerupoutside', (e: FederatedPointerEvent) => {
      console.log('pointerupoutside');
      stateManeger.updateInteractionState(InteractionState.default);
      this.dealTableHover();
      this.dealTableSelect();
    });

    this.table.scenegraph.tableGroup.addEventListener('pointerdown', (e: FederatedPointerEvent) => {
      if (e.button !== 0) {
        // 只处理左键
        return;
      }
      const eventArgsSet: SceneEvent = _getCellEventArgsSet(e);

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
        // 处理列宽调整
        if (this.checkColumnResizer(eventArgsSet, true)) {
          // this.startColumnResizer(e);
          // this._resizing = true;
          stateManeger.updateInteractionState(InteractionState.grabing);
          return;
        }

        // 处理column mover
        if (this.chechColumnMover(eventArgsSet)) {
          stateManeger.updateInteractionState(InteractionState.grabing);
          return;
        }

        // // 处理icon点击
        // if (this.dealIconClick(eventArgsSet)) {
        //   return; // 点击图标不透传到单元格
        // }

        // 处理单元格选择
        if (this.dealTableSelect(eventArgsSet)) {
          // 先执行单选逻辑，再更新为grabing模式
          // stateManeger.interactionState = 'grabing';
          stateManeger.updateInteractionState(InteractionState.grabing);
          // console.log('DRAG_SELECT_START');
        }
      }
      if ((this.table as any).hasListeners(TABLE_EVENT_TYPE.MOUSEDOWN_CELL)) {
        const eventArgsSet: SceneEvent = _getCellEventArgsSet(e);
        if (eventArgsSet.eventArgs) {
          this.table.fireListeners(TABLE_EVENT_TYPE.MOUSEDOWN_CELL, {
            col: eventArgsSet.eventArgs.col,
            row: eventArgsSet.eventArgs.row,
            event: e.nativeEvent
          });
        }
      }
    });

    this.table.scenegraph.tableGroup.addEventListener('pointerup', (e: FederatedPointerEvent) => {
      // console.log('pointerup');
      if (e.button !== 0) {
        // 只处理左键
        return;
      }
      if (stateManeger.interactionState === 'grabing') {
        // stateManeger.interactionState = 'default';
        stateManeger.updateInteractionState(InteractionState.default);
        // this._resizing = false;
        if (stateManeger.isResizeCol()) {
          this.table.stateManeger.endResizeCol();
          if ((this.table as any).hasListeners(TABLE_EVENT_TYPE.RESIZE_COLUMN_END)) {
            // RESIZE_COLUMN_END事件触发，返回所有列宽
            const columns = [];
            // 返回所有列宽信息
            for (let col = 0; col < this.table.colCount; col++) {
              columns.push(this.table.getColWidth(col));
            }
            this.table.fireListeners(TABLE_EVENT_TYPE.RESIZE_COLUMN_END, {
              col: this.table.stateManeger.columnResize.col,
              columns
            });
          }
        } else if (stateManeger.isMoveCol()) {
          this.table.stateManeger.endMoveCol();
          const eventArgsSet: SceneEvent = _getCellEventArgsSet(e);
          if (eventArgsSet.eventArgs && (this.table as any).hasListeners(TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION)) {
            this.table.fireListeners(TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION, {
              target: { col: eventArgsSet.eventArgs.col, row: eventArgsSet.eventArgs.row },
              source: {
                col: this.table.stateManeger.columnMove.colSource,
                row: this.table.stateManeger.columnMove.colSource //TODO row
              }
            });
          }
        } else if (stateManeger.isSelecting()) {
          this.table.stateManeger.endSelectCells();
          const eventArgsSet: SceneEvent = _getCellEventArgsSet(e);
          if (eventArgsSet.eventArgs && (this.table as any).hasListeners(TABLE_EVENT_TYPE.DRAG_SELECT_END)) {
            const cellsEvent: MousePointerMultiCellEvent = {
              event: e.nativeEvent,
              cells: [],
              col: (eventArgsSet.eventArgs.target as unknown as Group).col,
              row: (eventArgsSet.eventArgs.target as unknown as Group).row,
              scaleRatio: this.table.canvas.getBoundingClientRect().width / this.table.canvas.offsetWidth
            };

            cellsEvent.cells = this.table.getSelectedCellInfos();
            this.table.fireListeners(TABLE_EVENT_TYPE.DRAG_SELECT_END, cellsEvent);
          }
        }
      } else if (stateManeger.interactionState === InteractionState.scrolling) {
        stateManeger.updateInteractionState(InteractionState.default);
        // scroll end
      }
      // console.log('DRAG_SELECT_END');
      if ((this.table as any).hasListeners(TABLE_EVENT_TYPE.MOUSEUP_CELL)) {
        const eventArgsSet: SceneEvent = _getCellEventArgsSet(e);
        if (eventArgsSet.eventArgs) {
          this.table.fireListeners(TABLE_EVENT_TYPE.MOUSEUP_CELL, {
            col: eventArgsSet.eventArgs.col,
            row: eventArgsSet.eventArgs.row,
            event: e.nativeEvent
          });
        }
      }
    });

    this.table.scenegraph.tableGroup.addEventListener('rightdown', (e: FederatedPointerEvent) => {
      const eventArgsSet: SceneEvent = _getCellEventArgsSet(e);
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
        if ((this.table as any).hasListeners(TABLE_EVENT_TYPE.CONTEXTMENU_CELL)) {
          const cellInfo = this.table.getCellInfo(col, row);
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
          if (cellInRanges(this.table.stateManeger.select.ranges, col, row)) {
            // 用户右键点击已经选中的区域
            // const { start, end } = this.selection.range;
            cellsEvent.cells = this.table.getSelectedCellInfos();
          } else {
            // 用户右键点击新单元格
            cellsEvent.cells = [[cellInfo]];
          }

          this.table.fireListeners(TABLE_EVENT_TYPE.CONTEXTMENU_CELL, cellsEvent);
        }
      }
    });

    this.table.scenegraph.tableGroup.addEventListener('click', (e: FederatedPointerEvent) => {
      console.log('click', e);
      if (this.table.stateManeger.columnResize.resizing || this.table.stateManeger.columnMove.moving) {
        return;
      }
      const eventArgsSet: SceneEvent = _getCellEventArgsSet(e);
      this.dealIconClick(e, eventArgsSet);
      if (!eventArgsSet?.eventArgs) {
        return;
      }
      const { col, row } = eventArgsSet.eventArgs;
      if ((this.table as any).hasListeners(TABLE_EVENT_TYPE.CLICK_CELL)) {
        const cellInfo = this.table.getCellInfo(col, row);
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

        this.table.fireListeners(TABLE_EVENT_TYPE.CLICK_CELL, cellsEvent);
      }
    });

    // click outside
    this.table.scenegraph.stage.addEventListener('click', (e: FederatedPointerEvent) => {
      console.log('stage click');
      const target = e.target;
      if (
        target &&
        !target.isDescendantsOf(this.table.scenegraph.tableGroup) &&
        (target as any) !== this.table.scenegraph.tableGroup
      ) {
        console.log('pointerup outside table');
        stateManeger.updateInteractionState(InteractionState.default);
        this.dealTableHover();
        this.dealTableSelect();
        stateManeger.updateCursor();
      }
    });

    this.table.scenegraph.tableGroup.addEventListener('dblclick', (e: FederatedPointerEvent) => {
      const eventArgsSet: SceneEvent = _getCellEventArgsSet(e);
      const bounds = eventArgsSet.eventArgs.targetCell.globalAABBBounds;
      const { col, row } = eventArgsSet.eventArgs;
      const value = this.table.getCellValue(col, row);
      this.table.internalProps.focusControl.setFocusRect(
        new Rect(
          bounds.x1 + this.table.scrollLeft,
          bounds.y1 + this.table.scrollTop,
          bounds.x2 - bounds.x1,
          bounds.y2 - bounds.y1
        ),
        value
      );
      // console.log('activeElement',document.activeElement);
      // this.table.getElement().focus();
      // console.log('activeElement 2',document.activeElement);
      if ((this.table as any).hasListeners(TABLE_EVENT_TYPE.DBLCLICK_CELL)) {
        const cellInfo = this.table.getCellInfo(col, row);
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
        this.table.fireListeners(TABLE_EVENT_TYPE.DBLCLICK_CELL, cellsEvent);
      }
    });

    // 监听滚动条组件pointover事件
    scenegraph.component.vScrollBar.addEventListener('pointerover', (e: any) => {
      stateManeger.showVerticalScrollBar();
    });
    scenegraph.component.hScrollBar.addEventListener('pointerover', (e: any) => {
      stateManeger.showHorizontalScrollBar();
    });
    scenegraph.component.vScrollBar.addEventListener('pointerout', (e: any) => {
      if (stateManeger.interactionState === InteractionState.scrolling) {
        return;
      }
      stateManeger.hideVerticalScrollBar();
    });
    scenegraph.component.hScrollBar.addEventListener('pointerout', (e: any) => {
      if (stateManeger.interactionState === InteractionState.scrolling) {
        return;
      }
      stateManeger.hideHorizontalScrollBar();
    });
    // 目前ScrollBar的pointerdown事件回调内有e.stopPropagation，因此无法通过vScrollBar监听，先使用_slider监听
    (scenegraph.component.vScrollBar as any)._slider.addEventListener('pointerdown', () => {
      if (stateManeger.interactionState !== InteractionState.scrolling) {
        stateManeger.updateInteractionState(InteractionState.scrolling);
      }
    });
    scenegraph.component.vScrollBar.addEventListener('pointerup', () => {
      if (stateManeger.interactionState === InteractionState.scrolling) {
        stateManeger.updateInteractionState(InteractionState.default);
      }
    });
    scenegraph.component.vScrollBar.addEventListener('pointerupoutside', () => {
      if (stateManeger.interactionState === InteractionState.scrolling) {
        stateManeger.updateInteractionState(InteractionState.default);
      }
    });
    // 目前ScrollBar的pointerdown事件回调内有e.stopPropagation，因此无法通过hScrollBar监听，先使用_slider监听
    (scenegraph.component.hScrollBar as any)._slider.addEventListener('pointerdown', () => {
      if (stateManeger.interactionState !== InteractionState.scrolling) {
        stateManeger.updateInteractionState(InteractionState.scrolling);
      }
    });
    scenegraph.component.hScrollBar.addEventListener('pointerup', () => {
      if (stateManeger.interactionState === InteractionState.scrolling) {
        stateManeger.updateInteractionState(InteractionState.default);
      }
    });
    scenegraph.component.hScrollBar.addEventListener('pointerupoutside', () => {
      if (stateManeger.interactionState === InteractionState.scrolling) {
        stateManeger.updateInteractionState(InteractionState.default);
      }
    });

    const throttleVerticalWheel = throttle(stateManeger.updateVerticalScrollBar, 20);
    const throttleHorizontalWheel = throttle(stateManeger.updateHorizontalScrollBar, 20);
    // const debounceScroll = debounce(() => {
    //   this.scrolling = false;
    // }, 500);

    // 监听滚动条组件scroll事件
    scenegraph.component.vScrollBar.addEventListener('scroll', (e: any) => {
      const ratio = e.detail.value[0] / (1 - e.detail.value[1] + e.detail.value[0]);
      // console.log('vScrollBar', e.detail.value);
      // stateManeger.updateVerticalScrollBar(ratio);
      throttleVerticalWheel(ratio, e);
    });

    scenegraph.component.hScrollBar.addEventListener('scroll', (e: any) => {
      const ratio = e.detail.value[0] / (1 - e.detail.value[1] + e.detail.value[0]);
      // console.log('hScrollBar', ratio);
      // stateManeger.updateHorizontalScrollBar(ratio);
      throttleHorizontalWheel(ratio);
    });

    handler.on(this.table.getElement(), 'wheel', (e: WheelEvent) => {
      handleWhell(e, stateManeger);
    });
    // 监听键盘事件
    handler.on(this.table.getElement(), 'keydown', (e: KeyboardEvent) => {
      if (this.table.keyboardOptions?.selectAllOnCtrlA) {
        // 处理全选
        if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          //全选
          this.deelTableSelectAll();
        }
      }
      if ((this.table as any).hasListeners(TABLE_EVENT_TYPE.KEYDOWN)) {
        const cellsEvent: KeydownEvent = {
          keyCode: e.keyCode ?? e.which,
          code: e.code,
          event: e,
          cells: this.table.getSelectedCellInfos(),
          scaleRatio: this.table.canvas.getBoundingClientRect().width / this.table.canvas.offsetWidth
        };
        this.table.fireListeners(TABLE_EVENT_TYPE.KEYDOWN, cellsEvent);
      }
    });

    handler.on(this.table.getElement(), 'copy', (e: KeyboardEvent) => {
      if (this.table.keyboardOptions?.copySelected) {
        const data = this.table.getCopyValue();
        if (isValid(data)) {
          e.preventDefault();
          if (browser.IE) {
            (window as any).clipboardData.setData('Text', data); // IE
          } else {
            (e as any).clipboardData.setData('text/plain', data); // Chrome, Firefox
          }
        }
      }
    });

    handler.on(this.table.getElement(), 'contextmenu', (e: any) => {
      e.preventDefault();
    });
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
      } else if (funcType === IconFuncTypeEnum.pin) {
        stateManeger.triggerPin(col, row, icon);
      } else if (funcType === IconFuncTypeEnum.drillDown) {
        drillClick(this.table);
      }
    });

    // 下拉菜单内容点击
    this.table.listen(TABLE_EVENT_TYPE.DROPDOWNMENU_CLICK, () => {
      stateManeger.hideMenu();
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
    bindChartHoverEvent(this.table);
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

  checkColumnResizer(eventArgsSet: SceneEvent, update?: boolean): boolean {
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

  dealColumnResizer(eventArgsSet: SceneEvent) {
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

  startColumnResizer(eventArgsSet: SceneEvent) {
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

function _getCellEventArgsSet(e: FederatedPointerEvent): SceneEvent {
  const tableEvent: SceneEvent = {
    abstractPos: {
      x: e.x,
      y: e.y
    }
    // eventArgs: {
    //   col: (e.target as any).col,
    //   row: (e.target as any).row,
    //   event: e,
    // },
  };
  const targetCell = getTargetCell(e.target);
  if (targetCell) {
    tableEvent.eventArgs = {
      col: targetCell.col,
      row: targetCell.row,
      event: e,
      targetCell,
      target: e.target
    };
  }
  return tableEvent;
}

function getTargetCell(target: any) {
  while (target && target.parent) {
    if (target.role === 'cell') {
      return target;
    }
    target = target.parent;
  }
  return null;
}
