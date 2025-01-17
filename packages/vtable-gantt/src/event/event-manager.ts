import { vglobal } from '@visactor/vtable/es/vrender';
import type { Circle, FederatedPointerEvent, FederatedWheelEvent } from '@visactor/vtable/es/vrender';
import type { Gantt } from '../Gantt';
import { EventHandler } from '../event/EventHandler';
import { handleWhell } from '../event/scroll';
import { formatDate, parseDateFormat, throttle } from '../tools/util';
import { GANTT_EVENT_TYPE, InteractionState, TasksShowMode } from '../ts-types';
import { isValid } from '@visactor/vutils';
import { getPixelRatio } from '../tools/pixel-ratio';
import { DayTimes, getDateIndexByX, getTaskIndexsByTaskY, _getTaskInfoByXYForCreateSchedule } from '../gantt-helper';
import type { GanttTaskBarNode } from '../scenegraph/gantt-node';

export class EventManager {
  _gantt: Gantt;
  _eventHandler: EventHandler;
  isDown: boolean = false;
  isDraging: boolean = false;
  lastDragPointerXYOnWindow: { x: number; y: number };
  //报错已绑定过的事件 后续清除绑定
  globalEventListeners: { name: string; env: 'document' | 'body' | 'window'; callback: (e?: any) => void }[] = [];
  poniterState: 'down' | 'draging' | 'up';
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

  scene.ganttGroup.addEventListener('pointerdown', (e: FederatedPointerEvent) => {
    if (e.button !== 0) {
      // 只处理左键
      return;
    }
    let downBarNode;
    let downCreationButtomNode;
    let downDependencyLineNode;
    let downLeftLinkPointNode;
    let downRightLinkPointNode;
    let depedencyLink;

    e.detailPath.find((pathNode: any) => {
      if (pathNode.name === 'task-bar') {
        // || pathNode.name === 'task-bar-hover-shadow';
        downBarNode = pathNode;
        return true;
      } else if (pathNode.name === 'task-creation-button') {
        downCreationButtomNode = pathNode;
        return true;
      } else if (pathNode.name === 'task-bar-link-point-left') {
        // || pathNode.name === 'task-bar-hover-shadow';
        downLeftLinkPointNode = pathNode;
        return true;
      } else if (pathNode.name === 'task-bar-link-point-right') {
        // || pathNode.name === 'task-bar-hover-shadow';
        downRightLinkPointNode = pathNode;
        return true;
      } else if (pathNode.attribute.vtable_link) {
        downDependencyLineNode = pathNode;
        depedencyLink = pathNode.attribute.vtable_link;
        return true;
      }
      return false;
    });
    if (downBarNode) {
      if (e.target.name === 'task-bar-hover-shadow-left-icon') {
        stateManager.startResizeTaskBar(
          downBarNode,
          (e.nativeEvent as any).x,
          (e.nativeEvent as any).y,
          e.offset.y,
          'left'
        );
        stateManager.updateInteractionState(InteractionState.grabing);
      } else if (e.target.name === 'task-bar-hover-shadow-right-icon') {
        stateManager.startResizeTaskBar(
          downBarNode,
          (e.nativeEvent as any).x,
          (e.nativeEvent as any).y,
          e.offset.y,
          'right'
        );
        stateManager.updateInteractionState(InteractionState.grabing);
      } else if (gantt.parsedOptions.taskBarMoveable) {
        let moveable: boolean = true;
        if (typeof gantt.parsedOptions.taskBarMoveable === 'function') {
          const { startDate, endDate, taskRecord } = scene._gantt.getTaskInfoByTaskListIndex(
            (downBarNode as GanttTaskBarNode).task_index,
            (downBarNode as GanttTaskBarNode).sub_task_index
          );

          const args = {
            index: (downBarNode as GanttTaskBarNode).task_index,
            startDate,
            endDate,
            taskRecord,
            ganttInstance: scene._gantt
          };
          moveable = gantt.parsedOptions.taskBarMoveable(args);
        } else {
          moveable = gantt.parsedOptions.taskBarMoveable;
        }
        if (moveable) {
          stateManager.startMoveTaskBar(downBarNode, (e.nativeEvent as any).x, (e.nativeEvent as any).y, e.offset.y);
          stateManager.updateInteractionState(InteractionState.grabing);
        }
      }
    } else if (downLeftLinkPointNode) {
      stateManager.startCreateDependencyLine(
        downLeftLinkPointNode,
        (e.nativeEvent as any).x,
        (e.nativeEvent as any).y,
        e.offset.y,
        'left'
      );
      stateManager.updateInteractionState(InteractionState.grabing);
    } else if (downRightLinkPointNode) {
      stateManager.startCreateDependencyLine(
        downRightLinkPointNode,
        (e.nativeEvent as any).x,
        (e.nativeEvent as any).y,
        e.offset.y,
        'right'
      );
      stateManager.updateInteractionState(InteractionState.grabing);
    }
  });

  scene.ganttGroup.addEventListener('pointermove', (e: FederatedPointerEvent) => {
    if (stateManager.interactionState === InteractionState.default) {
      const taskBarTarget = e.detailPath.find((pathNode: any) => {
        return pathNode.name === 'task-bar'; // || pathNode.name === 'task-bar-hover-shadow';
      });
      if (taskBarTarget) {
        if (scene._gantt.stateManager.hoverTaskBar.target !== (taskBarTarget as any as GanttTaskBarNode)) {
          scene._gantt.stateManager.hoverTaskBar.target = taskBarTarget as any as GanttTaskBarNode;
          stateManager.showTaskBarHover();
          if (scene._gantt.hasListeners(GANTT_EVENT_TYPE.MOUSEENTER_TASK_BAR)) {
            // const taskIndex = getTaskIndexByY(e.offset.y, scene._gantt);
            const taskIndex = taskBarTarget.task_index;
            const sub_task_index = taskBarTarget.sub_task_index;
            const record = scene._gantt.getRecordByIndex(taskIndex, sub_task_index);
            scene._gantt.fireListeners(GANTT_EVENT_TYPE.MOUSEENTER_TASK_BAR, {
              federatedEvent: e,
              event: e.nativeEvent,
              index: taskIndex,
              sub_task_index,
              record
            });
          }
        }
      } else {
        if (scene._gantt.stateManager.hoverTaskBar.target) {
          if (scene._gantt.hasListeners(GANTT_EVENT_TYPE.MOUSELEAVE_TASK_BAR)) {
            // const taskIndex = getTaskIndexByY(e.offset.y, scene._gantt);
            const taskIndex = scene._gantt.stateManager.hoverTaskBar.target.task_index;
            const sub_task_index = scene._gantt.stateManager.hoverTaskBar.target.sub_task_index;
            const record = scene._gantt.getRecordByIndex(taskIndex, sub_task_index);
            scene._gantt.fireListeners(GANTT_EVENT_TYPE.MOUSELEAVE_TASK_BAR, {
              federatedEvent: e,
              event: e.nativeEvent,
              index: taskIndex,
              sub_task_index,
              record
            });
          }
          stateManager.hideTaskBarHover(e);
        }
        //#region hover到某一个任务 检查有没有日期安排，没有的话显示创建按钮
        if (
          // gantt.parsedOptions.tasksShowMode !== TasksShowMode.Sub_Tasks_Inline &&
          // gantt.parsedOptions.tasksShowMode !== TasksShowMode.Sub_Tasks_Separate &&
          // gantt.parsedOptions.tasksShowMode !== TasksShowMode.Sub_Tasks_Arrange &&
          // gantt.parsedOptions.tasksShowMode !== TasksShowMode.Sub_Tasks_Compact
          gantt.parsedOptions.taskBarCreatable
        ) {
          const taskIndex = getTaskIndexsByTaskY(e.offset.y - gantt.headerHeight + gantt.stateManager.scrollTop, gantt);
          const recordTaskInfo = gantt.getTaskInfoByTaskListIndex(taskIndex.task_index, taskIndex.sub_task_index);

          let taskBarCreatable: boolean = true;
          if (typeof gantt.parsedOptions.taskBarCreatable === 'function') {
            const { startDate, endDate, taskRecord } = recordTaskInfo;
            const args = {
              index: taskIndex.task_index,
              sub_task_index: taskIndex.sub_task_index,
              startDate,
              endDate,
              taskRecord,
              ganttInstance: gantt
            };
            taskBarCreatable = gantt.parsedOptions.taskBarCreatable(args);
          } else {
            taskBarCreatable = gantt.parsedOptions.taskBarCreatable;
          }

          if (taskBarCreatable) {
            const taskInfoOnXY = _getTaskInfoByXYForCreateSchedule(e.offset.x, e.offset.y, gantt);
            if (
              ((gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate ||
                gantt.parsedOptions.tasksShowMode === TasksShowMode.Tasks_Separate) &&
                !recordTaskInfo.taskDays &&
                recordTaskInfo.taskRecord &&
                !recordTaskInfo.taskRecord.vtableMerge) ||
              ((gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline ||
                gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange ||
                gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact) &&
                !taskInfoOnXY)
            ) {
              const dateIndex = getDateIndexByX(e.offset.x, gantt);
              const showX =
                (dateIndex >= 1 ? gantt.getDateColsWidth(0, dateIndex - 1) : 0) -
                gantt.stateManager.scroll.horizontalBarPos;
              const showY =
                gantt.taskListTableInstance.getRowsHeight(
                  gantt.taskListTableInstance.columnHeaderLevelCount,
                  taskIndex.task_index + gantt.taskListTableInstance.columnHeaderLevelCount - 1
                ) +
                (taskIndex.sub_task_index ?? 0) * gantt.parsedOptions.rowHeight -
                gantt.stateManager.scroll.verticalBarPos;
              gantt.scenegraph.showTaskCreationButton(showX, showY, dateIndex);
              return;
            }
          }
        }
        //#endregion
      }
      gantt.scenegraph.hideTaskCreationButton();
    } else if (stateManager.interactionState === InteractionState.grabing) {
      let downBarNode;
      let downCreationButtomNode;
      let downDependencyLineNode;
      let downLeftLinkPointNode;
      let downRightLinkPointNode;
      let depedencyLink;

      e.detailPath.find((pathNode: any) => {
        if (pathNode.name === 'task-bar') {
          // || pathNode.name === 'task-bar-hover-shadow';
          downBarNode = pathNode;
          return true;
        } else if (pathNode.name === 'task-creation-button') {
          downCreationButtomNode = pathNode;
          return true;
        } else if (pathNode.name === 'task-bar-link-point-left') {
          // || pathNode.name === 'task-bar-hover-shadow';
          downLeftLinkPointNode = pathNode;
          return true;
        } else if (pathNode.name === 'task-bar-link-point-right') {
          // || pathNode.name === 'task-bar-hover-shadow';
          downRightLinkPointNode = pathNode;
          return true;
        } else if (pathNode.attribute.vtable_link) {
          downDependencyLineNode = pathNode;
          depedencyLink = pathNode.attribute.vtable_link;
          return true;
        }
        return false;
      });
      downBarNode =
        downBarNode ??
        downLeftLinkPointNode?.parent?.attribute.attachedToTaskBarNode ??
        downRightLinkPointNode?.parent?.attribute.attachedToTaskBarNode;
      if (scene._gantt.stateManager.isCreatingDependencyLine() && !downBarNode) {
        //如果正在创建依赖链，但是鼠标没有一定到目标taskBar上
        stateManager.hideSecondTaskBarSelectedBorder();
      } else if (
        scene._gantt.stateManager.isCreatingDependencyLine() &&
        downLeftLinkPointNode &&
        scene._gantt.stateManager.selectedTaskBar.target !== (downBarNode as any as GanttTaskBarNode)
      ) {
        //如果正在创建依赖链，鼠标在另一个taskBar的左侧定位点上
        // 这时候需要高亮左侧定位点
        stateManager.highlightLinkPointNode(downLeftLinkPointNode);
        stateManager.creatingDenpendencyLink.lastHighLightLinkPoint = downLeftLinkPointNode;
        stateManager.creatingDenpendencyLink.secondTaskBarPosition = 'left';
      } else if (
        scene._gantt.stateManager.isCreatingDependencyLine() &&
        downRightLinkPointNode &&
        scene._gantt.stateManager.selectedTaskBar.target !== (downBarNode as any as GanttTaskBarNode)
      ) {
        //如果正在创建依赖链，鼠标在另一个taskBar的右侧定位点上
        // 这时候需要高亮右侧定位点
        stateManager.highlightLinkPointNode(downRightLinkPointNode);
        stateManager.creatingDenpendencyLink.lastHighLightLinkPoint = downRightLinkPointNode;
        stateManager.creatingDenpendencyLink.secondTaskBarPosition = 'right';
      } else if (
        scene._gantt.stateManager.isCreatingDependencyLine() &&
        downBarNode &&
        scene._gantt.stateManager.selectedTaskBar.target !== (downBarNode as any as GanttTaskBarNode)
      ) {
        // 如果正在创建依赖链，鼠标在另一个taskBar上
        stateManager.unhighlightLinkPointNode(stateManager.creatingDenpendencyLink.lastHighLightLinkPoint);
        if (
          !stateManager.creatingDenpendencyLink.secondTaskBarNode ||
          stateManager.creatingDenpendencyLink.secondTaskBarNode !== (downBarNode as any as GanttTaskBarNode)
        ) {
          if (
            stateManager.creatingDenpendencyLink.secondTaskBarNode &&
            stateManager.creatingDenpendencyLink.secondTaskBarNode !== (downBarNode as any as GanttTaskBarNode)
          ) {
            stateManager.hideSecondTaskBarSelectedBorder();
          }
          stateManager.creatingDenpendencyLink.secondTaskBarNode = downBarNode as any as GanttTaskBarNode;
          stateManager.showSecondTaskBarSelectedBorder();
        } else {
        }
      }
    }
  });
  // pointerup如果改为pointertap 问题：新建依赖关系线不起作用
  scene.ganttGroup.addEventListener('pointerup', (e: FederatedPointerEvent) => {
    if (e.button === 0) {
      let isClickBar = false;
      let isClickCreationButtom = false;
      let isClickDependencyLine = false;
      let isClickLeftLinkPoint = false;
      let isClickRightLinkPoint = false;
      let depedencyLink;

      const taskBarTarget = e.detailPath.find((pathNode: any) => {
        if (pathNode.name === 'task-bar') {
          // || pathNode.name === 'task-bar-hover-shadow';
          isClickBar = true;
          return true;
        } else if (pathNode.name === 'task-creation-button') {
          isClickCreationButtom = true;
          return false;
        } else if (pathNode.name === 'task-bar-link-point-left') {
          // || pathNode.name === 'task-bar-hover-shadow';
          isClickLeftLinkPoint = true;
          return false;
        } else if (pathNode.name === 'task-bar-link-point-right') {
          // || pathNode.name === 'task-bar-hover-shadow';
          isClickRightLinkPoint = true;
          return false;
        } else if (pathNode.attribute.vtable_link) {
          isClickDependencyLine = true;
          depedencyLink = pathNode.attribute.vtable_link;
          return false;
        }
        return false;
      });
      if (isClickBar && scene._gantt.parsedOptions.taskBarSelectable && event.poniterState === 'down') {
        stateManager.hideDependencyLinkSelectedLine();
        stateManager.showTaskBarSelectedBorder(taskBarTarget);
        if (gantt.hasListeners(GANTT_EVENT_TYPE.CLICK_TASK_BAR)) {
          // const taskIndex = getTaskIndexByY(e.offset.y, gantt);
          const taskIndex = taskBarTarget.task_index;
          const sub_task_index = taskBarTarget.sub_task_index;
          const record = gantt.getRecordByIndex(taskIndex, sub_task_index);
          gantt.fireListeners(GANTT_EVENT_TYPE.CLICK_TASK_BAR, {
            federatedEvent: e,
            event: e.nativeEvent,
            index: taskIndex,
            sub_task_index,
            record
          });
        }
      } else if (isClickCreationButtom && event.poniterState === 'down') {
        stateManager.hideDependencyLinkSelectedLine();
        stateManager.hideTaskBarSelectedBorder();
        const taskIndex = getTaskIndexsByTaskY(e.offset.y - gantt.headerHeight + gantt.stateManager.scrollTop, gantt);

        if (
          gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange ||
          gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline ||
          gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact
        ) {
          if (gantt.hasListeners(GANTT_EVENT_TYPE.CREATE_TASK_SCHEDULE)) {
            const dateIndex = getDateIndexByX(e.offset.x, gantt);
            const dateRange = gantt.getDateRangeByIndex(dateIndex);
            const dateFormat =
              gantt.parsedOptions.dateFormat ??
              (gantt.parsedOptions.timeScaleIncludeHour ? 'yyyy-mm-dd hh:mm:ss' : 'yyyy-mm-dd');
            gantt.fireListeners(GANTT_EVENT_TYPE.CREATE_TASK_SCHEDULE, {
              federatedEvent: e,
              event: e.nativeEvent,
              index: taskIndex.task_index,
              sub_task_index: taskIndex.sub_task_index,
              startDate: formatDate(dateRange.startDate, dateFormat),
              endDate: formatDate(dateRange.endDate, dateFormat),
              record: undefined,
              parentRecord: gantt.getRecordByIndex(taskIndex.task_index)
            });
          }
        } else {
          const recordTaskInfo = gantt.getTaskInfoByTaskListIndex(taskIndex.task_index, taskIndex.sub_task_index);

          if (recordTaskInfo.taskRecord) {
            // const minTimeUnit = gantt.parsedOptions.reverseSortedTimelineScales[0].unit;
            const dateFormat =
              gantt.parsedOptions.dateFormat ??
              (gantt.parsedOptions.timeScaleIncludeHour ? 'yyyy-mm-dd hh:mm:ss' : 'yyyy-mm-dd');
            const dateIndex = getDateIndexByX(e.offset.x, gantt);
            const dateRange = gantt.getDateRangeByIndex(dateIndex);
            recordTaskInfo.taskRecord[gantt.parsedOptions.startDateField] = formatDate(dateRange.startDate, dateFormat);
            recordTaskInfo.taskRecord[gantt.parsedOptions.endDateField] = formatDate(dateRange.endDate, dateFormat);

            gantt.scenegraph.hideTaskCreationButton();
            gantt.updateTaskRecord(recordTaskInfo.taskRecord, taskIndex.task_index, taskIndex.sub_task_index);
            if (gantt.hasListeners(GANTT_EVENT_TYPE.CREATE_TASK_SCHEDULE)) {
              gantt.fireListeners(GANTT_EVENT_TYPE.CREATE_TASK_SCHEDULE, {
                federatedEvent: e,
                event: e.nativeEvent,
                index: taskIndex.task_index,
                sub_task_index: taskIndex.sub_task_index,
                startDate: recordTaskInfo.taskRecord[gantt.parsedOptions.startDateField],
                endDate: recordTaskInfo.taskRecord[gantt.parsedOptions.endDateField],
                record: recordTaskInfo.taskRecord
              });
            }
          }
        }
      } else if (
        isClickDependencyLine &&
        scene._gantt.parsedOptions.dependencyLinkSelectable &&
        event.poniterState === 'down'
      ) {
        stateManager.hideDependencyLinkSelectedLine();
        stateManager.hideTaskBarSelectedBorder();
        scene._gantt.stateManager.selectedDenpendencyLink.link = depedencyLink;
        stateManager.showDependencyLinkSelectedLine();
      } else if ((isClickLeftLinkPoint || isClickRightLinkPoint) && event.poniterState === 'down') {
        if (gantt.hasListeners(GANTT_EVENT_TYPE.CLICK_DEPENDENCY_LINK_POINT)) {
          const taskIndex = getTaskIndexsByTaskY(e.offset.y - gantt.headerHeight + gantt.stateManager.scrollTop, gantt);

          const record = gantt.getRecordByIndex(taskIndex.task_index, taskIndex.sub_task_index);

          gantt.fireListeners(GANTT_EVENT_TYPE.CLICK_DEPENDENCY_LINK_POINT, {
            event: e.nativeEvent,
            index: taskIndex.task_index,
            sub_task_index: taskIndex.sub_task_index,
            point: isClickLeftLinkPoint ? 'start' : 'end',
            record
          });
        }
        stateManager.hideTaskBarSelectedBorder();
      } else if (isClickLeftLinkPoint && event.poniterState === 'draging') {
        if (stateManager.isCreatingDependencyLine()) {
          const link = stateManager.endCreateDependencyLine(e.offset.y);
          if (gantt.hasListeners(GANTT_EVENT_TYPE.CREATE_DEPENDENCY_LINK)) {
            gantt.fireListeners(GANTT_EVENT_TYPE.CREATE_DEPENDENCY_LINK, {
              federatedEvent: e,
              event: e.nativeEvent,
              link
            });
          }
        }
      } else if (isClickRightLinkPoint && event.poniterState === 'draging') {
        if (stateManager.isCreatingDependencyLine()) {
          const link = stateManager.endCreateDependencyLine(e.offset.y);
          if (gantt.hasListeners(GANTT_EVENT_TYPE.CREATE_DEPENDENCY_LINK)) {
            gantt.fireListeners(GANTT_EVENT_TYPE.CREATE_DEPENDENCY_LINK, {
              federatedEvent: e,
              event: e.nativeEvent,
              link
            });
          }
        }
      } else {
        stateManager.hideDependencyLinkSelectedLine();
        stateManager.hideTaskBarSelectedBorder();
      }
    }
  });
  scene.ganttGroup.addEventListener('rightdown', (e: FederatedPointerEvent) => {
    let isClickBar = false;
    let isClickDependencyLine = false;
    let depedencyLink;
    const taskBarTarget = e.detailPath.find((pathNode: any) => {
      if (pathNode.name === 'task-bar') {
        isClickBar = true;
        return true;
      } else if (pathNode.attribute.vtable_link) {
        isClickDependencyLine = true;
        depedencyLink = pathNode.attribute.vtable_link;
        return false;
      }
      return false;
    });
    if (isClickBar) {
      if (gantt.hasListeners(GANTT_EVENT_TYPE.CONTEXTMENU_TASK_BAR)) {
        // const taskIndex = getTaskIndexByY(e.offset.y, gantt);
        const taskIndex = taskBarTarget.task_index;
        const sub_task_index = taskBarTarget.sub_task_index;
        const record = gantt.getRecordByIndex(taskIndex, sub_task_index);
        gantt.fireListeners(GANTT_EVENT_TYPE.CONTEXTMENU_TASK_BAR, {
          federatedEvent: e,
          event: e.nativeEvent,
          index: taskIndex,
          sub_task_index,
          record
        });
      }
    } else if (isClickDependencyLine) {
      if (gantt.hasListeners(GANTT_EVENT_TYPE.CONTEXTMENU_DEPENDENCY_LINK)) {
        gantt.fireListeners(GANTT_EVENT_TYPE.CONTEXTMENU_DEPENDENCY_LINK, {
          federatedEvent: e,
          event: e.nativeEvent,
          link: depedencyLink
        });
      }
    }
  });
  scene.ganttGroup.addEventListener('pointerenter', (e: FederatedPointerEvent) => {
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

  scene.ganttGroup.addEventListener('pointerleave', (e: FederatedPointerEvent) => {
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

    // 移动到gantt外部 如移动到表格空白区域 移动到表格浏览器外部
    if (scene._gantt.stateManager.hoverTaskBar.target) {
      if (scene._gantt.hasListeners(GANTT_EVENT_TYPE.MOUSELEAVE_TASK_BAR)) {
        // const taskIndex = getTaskIndexByY(e.offset.y, scene._gantt);
        const taskIndex = scene._gantt.stateManager.hoverTaskBar.target.task_index;
        const sub_task_index = scene._gantt.stateManager.hoverTaskBar.target.sub_task_index;
        const record = scene._gantt.getRecordByIndex(taskIndex, sub_task_index);
        scene._gantt.fireListeners(GANTT_EVENT_TYPE.MOUSELEAVE_TASK_BAR, {
          federatedEvent: e,
          event: e.nativeEvent,
          index: taskIndex,
          sub_task_index,
          record
        });
      }
      stateManager.hideTaskBarHover(e);
    }
  });
  scene.ganttGroup.addEventListener('wheel', (e: FederatedWheelEvent) => {
    handleWhell(e, stateManager, gantt);
  });
}

function bindContainerDomListener(eventManager: EventManager) {
  const gantt = eventManager._gantt;
  const scene = eventManager._gantt.scenegraph;
  const stateManager = gantt.stateManager;
  const handler = eventManager._eventHandler;
  handler.on(gantt.getElement(), 'contextmenu', (e: any) => {
    if (gantt.parsedOptions.eventOptions?.preventDefaultContextMenu !== false) {
      e.preventDefault();
    }
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
    gantt.eventManager.poniterState = 'down';
  };
  eventManager.globalEventListeners.push({
    name: 'mousedown',
    env: 'document',
    callback: globalMousedownCallback
  });
  vglobal.addEventListener('mousedown', globalMousedownCallback);
  const globalMousemoveCallback = (e: FederatedPointerEvent) => {
    if (gantt.eventManager.poniterState === 'down') {
      const x1 = gantt.eventManager.lastDragPointerXYOnWindow.x ?? e.x;
      const x2 = e.x;
      const dx = x2 - x1;
      const y1 = gantt.eventManager.lastDragPointerXYOnWindow.y ?? e.y;
      const y2 = e.y;
      const dy = y2 - y1;
      if (Math.abs(dx) >= 1 || Math.abs(dy) >= 1) {
        gantt.eventManager.poniterState = 'draging';
      }
    }
    if (stateManager.interactionState === InteractionState.grabing && gantt.eventManager.poniterState === 'draging') {
      const lastX = gantt.eventManager.lastDragPointerXYOnWindow?.x ?? e.x;
      const lastY = gantt.eventManager.lastDragPointerXYOnWindow?.y ?? e.y;
      if (Math.abs(lastX - e.x) >= 1 || Math.abs(lastY - e.y) >= 1) {
        if (stateManager.isResizingTableWidth()) {
          stateManager.hideDependencyLinkSelectedLine();
          stateManager.hideTaskBarSelectedBorder();
          stateManager.dealResizeTableWidth(e);
        } else if (stateManager.isMoveingTaskBar()) {
          stateManager.hideDependencyLinkSelectedLine();
          stateManager.hideTaskBarSelectedBorder();
          stateManager.dealTaskBarMove(e);
        } else if (stateManager.isResizingTaskBar()) {
          stateManager.hideDependencyLinkSelectedLine();
          stateManager.hideTaskBarSelectedBorder();
          stateManager.dealTaskBarResize(e);
        } else if (stateManager.isCreatingDependencyLine()) {
          // stateManager.hideDependencyLinkSelectedLine();
          stateManager.dealCreateDependencyLine(e);
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
        stateManager.endMoveTaskBar();
      } else if (stateManager.isResizingTaskBar()) {
        stateManager.endResizeTaskBar(e.x);
      }
    }
    gantt.eventManager.lastDragPointerXYOnWindow = undefined;
    gantt.eventManager.poniterState = 'up';
  };
  eventManager.globalEventListeners.push({
    name: 'mouseup',
    env: 'document',
    callback: globalMouseupCallback
  });
  vglobal.addEventListener('mouseup', globalMouseupCallback);

  const globalKeydownCallback = (e: KeyboardEvent) => {
    if (
      gantt.parsedOptions.dependencyLinkDeletable &&
      ((e.key === 'Delete' && gantt.parsedOptions.keyboardOptions?.deleteLinkOnDel) ||
        (e.key === 'Backspace' && gantt.parsedOptions.keyboardOptions?.deleteLinkOnBack))
    ) {
      if (gantt.stateManager.selectedDenpendencyLink.link) {
        const link = gantt.stateManager.selectedDenpendencyLink.link;
        gantt.deleteLink(gantt.stateManager.selectedDenpendencyLink.link);
        stateManager.hideDependencyLinkSelectedLine();
        stateManager.hideTaskBarSelectedBorder();
        if (gantt.hasListeners(GANTT_EVENT_TYPE.DELETE_DEPENDENCY_LINK)) {
          gantt.fireListeners(GANTT_EVENT_TYPE.DELETE_DEPENDENCY_LINK, {
            event: e,
            link
          });
        }
      }
    }
  };
  eventManager.globalEventListeners.push({
    name: 'keydown',
    env: 'document',
    callback: globalKeydownCallback
  });
  vglobal.addEventListener('keydown', globalKeydownCallback);
}
