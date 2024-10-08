import { vglobal } from '@visactor/vtable/es/vrender';
import type { FederatedPointerEvent } from '@visactor/vtable/es/vrender';
import type { Gantt } from '../Gantt';
import { EventHandler } from '../event/EventHandler';
import { handleWhell } from '../event/scroll';
import { formatDate, parseDateFormat, throttle } from '../tools/util';
import { GANTT_EVENT_TYPE, InteractionState } from '../ts-types';
import { isValid } from '@visactor/vutils';
import { getPixelRatio } from '../tools/pixel-ratio';
import { DayTimes, getDateIndexByX, getTaskIndexByY } from '../gantt-helper';
import type { GanttTaskBarNode } from '../scenegraph/GanttNode';

export class EventManager {
  _gantt: Gantt;
  _eventHandler: EventHandler;
  isDown: boolean = false;
  isDraging: boolean = false;
  lastDragPointerXYOnWindow: { x: number; y: number };
  //报错已绑定过的事件 后续清除绑定
  globalEventListeners: { name: string; env: 'document' | 'body' | 'window'; callback: (e?: any) => void }[] = [];
  // lastDragPointerXYOnResizeLine: { x: number; y: number };
  constructor(gantt: Gantt) {
    this._gantt = gantt;
    this._eventHandler = new EventHandler();
    this.bindEvent();
  }
  release() {
    this._eventHandler.release();
    // remove global event listerner
    this.globalEventListeners.forEach(item => {
      if (item.env === 'document') {
        document.removeEventListener(item.name, item.callback);
      } else if (item.env === 'body') {
        document.body.removeEventListener(item.name, item.callback);
      } else if (item.env === 'window') {
        window.removeEventListener(item.name, item.callback);
      }
    });
    this.globalEventListeners = [];
  }
  // 绑定DOM事件
  bindEvent() {
    bindTableGroupListener(this);
    bindContainerDomListener(this);
    // bindScrollBarListener(this);
  }
}
function bindTableGroupListener(event: EventManager) {
  const scene = event._gantt.scenegraph;
  const gantt = event._gantt;
  const stateManager = gantt.stateManager;
  let poniterState: 'down' | 'draging' | 'up';
  scene.tableGroup.addEventListener('pointerdown', (e: FederatedPointerEvent) => {
    poniterState = 'down';
    if (e.button !== 0) {
      // 只处理左键
      return;
    }
    const taskBarTarget = e.detailPath.find((pathNode: any) => {
      return pathNode.name === 'task-bar'; // || pathNode.name === 'task-bar-hover-shadow';
    }) as any as GanttTaskBarNode;
    if (taskBarTarget) {
      if (e.target.name === 'task-bar-hover-shadow-left-icon') {
        stateManager.startResizeTaskBar(
          taskBarTarget,
          (e.nativeEvent as any).x,
          (e.nativeEvent as any).y,
          e.offset.y,
          'left'
        );
        stateManager.updateInteractionState(InteractionState.grabing);
      } else if (e.target.name === 'task-bar-hover-shadow-right-icon') {
        stateManager.startResizeTaskBar(
          taskBarTarget,
          (e.nativeEvent as any).x,
          (e.nativeEvent as any).y,
          e.offset.y,
          'right'
        );
        stateManager.updateInteractionState(InteractionState.grabing);
      } else if (gantt.parsedOptions.taskBarMoveable) {
        stateManager.startMoveTaskBar(taskBarTarget, (e.nativeEvent as any).x, (e.nativeEvent as any).y, e.offset.y);
        stateManager.updateInteractionState(InteractionState.grabing);
      }
    }
  });

  scene.tableGroup.addEventListener('pointermove', (e: FederatedPointerEvent) => {
    if (poniterState === 'down') {
      const x1 = gantt.eventManager.lastDragPointerXYOnWindow.x;
      const x2 = e.x;
      const dx = x2 - x1;
      const y1 = gantt.eventManager.lastDragPointerXYOnWindow.y;
      const y2 = e.y;
      const dy = y2 - y1;
      if (dx >= 1 || dy >= 1) {
        poniterState = 'draging';
      }
    }
    if (stateManager.interactionState === InteractionState.default) {
      const taskBarTarget = e.detailPath.find((pathNode: any) => {
        return pathNode.name === 'task-bar'; // || pathNode.name === 'task-bar-hover-shadow';
      });
      if (taskBarTarget) {
        stateManager.showTaskBarHover(e);
      } else {
        stateManager.hideTaskBarHover(e);
        //#region hover到某一个任务 检查有没有日期安排，没有的话显示创建按钮
        if (gantt.parsedOptions.taskBarCreatable) {
          const taskIndex = getTaskIndexByY(e.offset.y, gantt);
          const recordTaskInfo = gantt.getTaskInfoByTaskListIndex(taskIndex);
          if (!recordTaskInfo.taskDays && recordTaskInfo.taskRecord) {
            const dateIndex = getDateIndexByX(e.offset.x, gantt);
            const showX = dateIndex * gantt.parsedOptions.timelineColWidth - gantt.stateManager.scroll.horizontalBarPos;
            const showY = taskIndex * gantt.parsedOptions.rowHeight - gantt.stateManager.scroll.verticalBarPos;
            //    -
            // (gantt.stateManager.scroll.horizontalBarPos % gantt.parsedOptions.rowHeight);
            // const date = getDateByX(e.offset.x, gantt);
            gantt.scenegraph.showTaskCreationButton(showX, showY, taskIndex, recordTaskInfo.taskRecord);
            return;
          }
        }
        //#endregion
      }
      gantt.scenegraph.hideTaskCreationButton();
    }
  });
  scene.tableGroup.addEventListener('pointerup', (e: FederatedPointerEvent) => {
    if (poniterState === 'down' && gantt.hasListeners(GANTT_EVENT_TYPE.CLICK_TASK_BAR)) {
      let isClickBar = false;
      let isClickCreationButtom = false;
      e.detailPath.find((pathNode: any) => {
        if (pathNode.name === 'task-bar') {
          // || pathNode.name === 'task-bar-hover-shadow';
          isClickBar = true;
        } else if (pathNode.name === 'task-creation-button') {
          isClickCreationButtom = true;
        }
      });
      if (isClickBar) {
        const taskIndex = getTaskIndexByY(e.offset.y, gantt);
        const record = gantt.getRecordByIndex(taskIndex);
        gantt.fireListeners(GANTT_EVENT_TYPE.CLICK_TASK_BAR, {
          event: e.nativeEvent,
          index: taskIndex,
          record
        });
      } else if (isClickCreationButtom) {
        const taskIndex = getTaskIndexByY(e.offset.y, gantt);
        const recordTaskInfo = gantt.getTaskInfoByTaskListIndex(taskIndex);
        if (recordTaskInfo.taskRecord) {
          const dateFormat = gantt.parsedOptions.dateFormat ?? 'yyyy-mm-dd';
          recordTaskInfo.taskRecord[gantt.parsedOptions.startDateField] = recordTaskInfo.taskRecord[
            gantt.parsedOptions.endDateField
          ] = formatDate(
            new Date(
              gantt.parsedOptions._minDateTime +
                Math.floor(
                  (e.offset.x + gantt.stateManager.scroll.horizontalBarPos) / gantt.parsedOptions.colWidthPerDay
                ) *
                  DayTimes
            ),
            dateFormat
          );
          gantt.scenegraph.hideTaskCreationButton();
          gantt.updateTaskRecord(recordTaskInfo.taskRecord, taskIndex);
          if (gantt.hasListeners(GANTT_EVENT_TYPE.CREATE_TASK_SCHEDULE)) {
            gantt.fireListeners(GANTT_EVENT_TYPE.CREATE_TASK_SCHEDULE, {
              event: e.nativeEvent,
              index: taskIndex,
              startDate: recordTaskInfo.taskRecord[gantt.parsedOptions.startDateField],
              endDate: recordTaskInfo.taskRecord[gantt.parsedOptions.endDateField],
              record: recordTaskInfo.taskRecord
            });
          }
        }
      }
    }
    poniterState = 'up';
  });

  scene.tableGroup.addEventListener('pointerenter', (e: FederatedPointerEvent) => {
    if (
      (gantt.parsedOptions.scrollStyle.horizontalVisible &&
        gantt.parsedOptions.scrollStyle.horizontalVisible === 'focus') ||
      (!gantt.parsedOptions.scrollStyle.horizontalVisible && gantt.parsedOptions.scrollStyle.visible === 'focus')
    ) {
      scene.scrollbarComponent.showHorizontalScrollBar();
    }
    if (
      (gantt.parsedOptions.scrollStyle.verticalVisible &&
        gantt.parsedOptions.scrollStyle.verticalVisible === 'focus') ||
      (!gantt.parsedOptions.scrollStyle.verticalVisible && gantt.parsedOptions.scrollStyle.visible === 'focus')
    ) {
      scene.scrollbarComponent.showVerticalScrollBar();
    }
  });

  scene.tableGroup.addEventListener('pointerleave', (e: FederatedPointerEvent) => {
    if (
      (gantt.parsedOptions.scrollStyle.horizontalVisible &&
        gantt.parsedOptions.scrollStyle.horizontalVisible === 'focus') ||
      (!gantt.parsedOptions.scrollStyle.horizontalVisible && gantt.parsedOptions.scrollStyle.visible === 'focus')
    ) {
      scene.scrollbarComponent.hideHorizontalScrollBar();
    }
    if (
      (gantt.parsedOptions.scrollStyle.verticalVisible &&
        gantt.parsedOptions.scrollStyle.verticalVisible === 'focus') ||
      (!gantt.parsedOptions.scrollStyle.verticalVisible && gantt.parsedOptions.scrollStyle.visible === 'focus')
    ) {
      scene.scrollbarComponent.hideVerticalScrollBar();
    }
  });
}

function bindContainerDomListener(eventManager: EventManager) {
  const gantt = eventManager._gantt;
  const scene = eventManager._gantt.scenegraph;
  const stateManager = gantt.stateManager;
  const handler = eventManager._eventHandler;
  handler.on(gantt.getElement(), 'wheel', (e: WheelEvent) => {
    handleWhell(e, stateManager, eventManager._gantt);
  });

  handler.on(gantt.getContainer(), 'resize', (e: any) => {
    // if (table.canvasSizeSeted) {
    //   return;
    // }
    if (e.width === 0 && e.height === 0) {
      // 临时绕行解决因为display设置为none产生的问题
      return;
    }
    if (!isValid(gantt.options.pixelRatio)) {
      gantt.setPixelRatio(getPixelRatio());
    }
    if (!e.windowSizeNotChange) {
      gantt._resize();
    }
  });
  if (gantt.taskListTableInstance && gantt.parsedOptions.verticalSplitLineMoveable) {
    handler.on(gantt.verticalSplitResizeLine, 'mousedown', (e: MouseEvent) => {
      console.log('resizeLine mousedown');
      stateManager.updateInteractionState(InteractionState.grabing);
      stateManager.startResizeTableWidth(e);
    });
  }
  if (gantt.parsedOptions.verticalSplitLineHighlight) {
    // 添加鼠标悬停时的高亮效果
    gantt.verticalSplitResizeLine &&
      handler.on(gantt.verticalSplitResizeLine, 'mouseover', (e: MouseEvent) => {
        (gantt.verticalSplitResizeLine.childNodes[1] as HTMLDivElement).style.opacity = '1';
      });

    // 添加鼠标移出时恢复初始样式
    gantt.verticalSplitResizeLine &&
      handler.on(gantt.verticalSplitResizeLine, 'mouseout', (e: MouseEvent) => {
        (gantt.verticalSplitResizeLine.childNodes[1] as HTMLDivElement).style.opacity = '0';
      });
  }
  const globalMousedownCallback = (e: FederatedPointerEvent) => {
    gantt.eventManager.lastDragPointerXYOnWindow = { x: e.x, y: e.y };
  };
  eventManager.globalEventListeners.push({
    name: 'mousedown',
    env: 'document',
    callback: globalMousedownCallback
  });
  vglobal.addEventListener('mousedown', globalMousedownCallback);
  const globalMousemoveCallback = (e: FederatedPointerEvent) => {
    if (stateManager.interactionState === InteractionState.grabing) {
      const lastX = gantt.eventManager.lastDragPointerXYOnWindow?.x ?? e.x;
      // const lastY = gantt.eventManager.lastDragPointerXYOnWindow?.y ?? e.y;
      if (Math.abs(lastX - e.x) >= 1) {
        if (stateManager.isResizingTableWidth()) {
          stateManager.dealResizeTableWidth(e);
        } else if (stateManager.isMoveingTaskBar()) {
          stateManager.dealTaskBarMove(e);
        } else if (stateManager.isResizingTaskBar()) {
          stateManager.dealTaskBarResize(e);
        }
        gantt.eventManager.lastDragPointerXYOnWindow = { x: e.x, y: e.y };
      }
    }
  };
  eventManager.globalEventListeners.push({
    name: 'mousemove',
    env: 'document',
    callback: globalMousemoveCallback
  });
  vglobal.addEventListener('mousemove', globalMousemoveCallback);
  const globalMouseupCallback = (e: MouseEvent) => {
    if (stateManager.interactionState === 'grabing') {
      stateManager.updateInteractionState(InteractionState.default);
      if (stateManager.isResizingTableWidth()) {
        stateManager.endResizeTableWidth();
      } else if (stateManager.isMoveingTaskBar()) {
        stateManager.endMoveTaskBar(e.x);
      } else if (stateManager.isResizingTaskBar()) {
        stateManager.endResizeTaskBar(e.x);
      }
    }
  };
  eventManager.globalEventListeners.push({
    name: 'mouseup',
    env: 'document',
    callback: globalMouseupCallback
  });
  vglobal.addEventListener('mouseup', globalMouseupCallback);
}
