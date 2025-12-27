import { isValid } from '@visactor/vutils';
import type { Gantt } from '../Gantt';
import type { ITaskLink } from '../ts-types';
import { InteractionState, GANTT_EVENT_TYPE, DependencyType, TasksShowMode, TaskType } from '../ts-types';
import type { Group, FederatedPointerEvent, Polygon, Line } from '@visactor/vtable/es/vrender';
import {
  syncEditCellFromTable,
  syncScrollStateFromTable,
  syncScrollStateToTable,
  syncDragOrderFromTable,
  syncTreeChangeFromTable,
  syncSortFromTable,
  syncTableWidthFromTable
} from './gantt-table-sync';
import {
  clearRecordShowIndex,
  findRecordByTaskKey,
  getDateIndexByX,
  getTaskIndexsByTaskY,
  getTextPos
} from '../gantt-helper';
import { debounce } from '../tools/debounce';
import type { GanttTaskBarNode } from '../scenegraph/gantt-node';
import { TASKBAR_HOVER_ICON_WIDTH } from '../scenegraph/task-bar';
import { Inertia } from '../tools/inertia';
import {
  createDateAtMidnight,
  getEndDateByTimeUnit,
  getStartDateByTimeUnit,
  toBoxArray,
  parseStringTemplate
} from '../tools/util';
export class StateManager {
  _gantt: Gantt;

  scroll: {
    horizontalBarPos: number;
    verticalBarPos: number;
  };
  fastScrolling: boolean;
  /**
   * Default 默认展示
   * grabing 拖拽中
   *   -Resize column 改变列宽
   *   -column move 调整列顺序
   *   -drag select 拖拽多选
   * Scrolling 滚动中
   */
  interactionState: InteractionState = InteractionState.default;

  moveTaskBar: {
    /** x坐标是相对table内坐标 */
    startX: number;
    startY: number;
    deltaX: number;
    deltaY: number;
    targetStartX: number;
    targetStartY: number;
    startOffsetY: number;
    moving: boolean;
    target: GanttTaskBarNode;
    moveTaskBarXSpeed: number;
    moveTaskBarXInertia: Inertia;
  };

  hoverTaskBar: {
    /** x坐标是相对table内坐标 */
    startX: number;
    targetStartX: number;
    target: GanttTaskBarNode;
  };
  resizeTaskBar: {
    /** x坐标是相对table内坐标 */
    startX: number;
    startY: number;
    /** 刚开始时 任务条节点的offsetX */
    startOffsetY: number;
    targetStartX: number;
    targetEndX: number;
    target: GanttTaskBarNode;
    resizing: boolean;
    onIconName: string;
  };
  adjustProgressBar: {
    /** x坐标是相对table内坐标 */
    startX: number;
    startY: number;
    target: GanttTaskBarNode;
    adjusting: boolean;
    originalProgress: number;
  };
  selectedTaskBar: {
    target: GanttTaskBarNode;
  };
  resizeTableWidth: {
    /** x坐标是相对table内坐标 */
    lastX: number;
    resizing: boolean;
    /** 用于节流 DataZoom 更新的定时器，避免在拖拽表头时频繁触发响应式更新 */
    updateTimeout?: NodeJS.Timeout | null;
  };

  selectedDenpendencyLink: {
    link: ITaskLink & { vtable_gantt_linkArrowNode: Polygon; vtable_gantt_linkLineNode: Line };
  };
  creatingDenpendencyLink: {
    /** x坐标是相对table内坐标 */
    startX: number;
    startY: number;
    startOffsetY: number;
    targetStartX: number;
    startClickedPoint: Group;
    creating: boolean;
    firstTaskBarPosition: 'left' | 'right';
    secondTaskBarPosition: 'left' | 'right';
    secondTaskBarNode: GanttTaskBarNode;
    lastHighLightLinkPoint: Group;
  };
  marklineIcon: {
    target: any;
  };
  // 供滚动重置为default使用
  resetInteractionState = debounce(() => {
    this.updateInteractionState(InteractionState.default);
  }, 100);
  constructor(gantt: Gantt) {
    this._gantt = gantt;
    this.scroll = {
      horizontalBarPos: 0,
      verticalBarPos: 0
    };
    this.moveTaskBar = {
      targetStartX: null,
      targetStartY: null,
      deltaX: 0,
      deltaY: 0,
      startOffsetY: null,
      startX: null,
      startY: null,
      moving: false,
      target: null,
      moveTaskBarXSpeed: 0,
      moveTaskBarXInertia: new Inertia()
    };

    this.hoverTaskBar = {
      targetStartX: null,
      startX: null,
      target: null
    };
    this.marklineIcon = {
      target: null
    };

    this.selectedTaskBar = {
      target: null
    };
    this.resizeTaskBar = {
      startOffsetY: null,
      targetStartX: null,
      targetEndX: null,
      startX: null,
      startY: null,
      target: null,
      resizing: false,
      onIconName: ''
    };
    this.adjustProgressBar = {
      startX: null,
      startY: null,
      target: null,
      adjusting: false,
      originalProgress: 0
    };
    this.resizeTableWidth = {
      lastX: null,
      resizing: false
    };
    this.selectedDenpendencyLink = {
      link: null
    };
    this.creatingDenpendencyLink = {
      startClickedPoint: null,
      startX: null,
      startY: null,
      startOffsetY: null,
      targetStartX: null,
      creating: false,
      firstTaskBarPosition: 'left',
      secondTaskBarPosition: 'left',
      secondTaskBarNode: null,
      lastHighLightLinkPoint: null
    };

    this.updateVerticalScrollBar = this.updateVerticalScrollBar.bind(this);
    this.updateHorizontalScrollBar = this.updateHorizontalScrollBar.bind(this);

    syncScrollStateFromTable(this._gantt);
    syncEditCellFromTable(this._gantt);
    syncDragOrderFromTable(this._gantt);
    syncTreeChangeFromTable(this._gantt);
    syncSortFromTable(this._gantt);
    if (this._gantt.options.taskListTable?.tableWidth === 'auto' || this._gantt.taskTableWidth === -1) {
      syncTableWidthFromTable(this._gantt);
    }
  }

  setScrollTop(top: number, triggerEvent: boolean = true) {
    // 矫正top值范围
    const totalHeight = this._gantt.getAllRowsHeight();
    top = Math.max(0, Math.min(top, totalHeight - this._gantt.scenegraph.height));
    top = Math.ceil(top);
    const oldVerticalBarPos = this.scroll.verticalBarPos;
    // this._gantt.stateManager.updateSelectPos(-1, -1);
    this.scroll.verticalBarPos = top;
    if (!isValid(this.scroll.verticalBarPos) || isNaN(this.scroll.verticalBarPos)) {
      this.scroll.verticalBarPos = 0;
    }
    // 设置scenegraph坐标
    this._gantt.scenegraph.setY(-top);

    // 更新scrollbar位置
    const yRatio = top / (totalHeight - this._gantt.scenegraph.height);
    this._gantt.scenegraph.scrollbarComponent.updateVerticalScrollBarPos(yRatio);

    if (oldVerticalBarPos !== top && triggerEvent) {
      syncScrollStateToTable(this._gantt);
      this._gantt.fireListeners(GANTT_EVENT_TYPE.SCROLL, {
        scrollTop: this.scroll.verticalBarPos,
        scrollLeft: this.scroll.horizontalBarPos,
        // scrollHeight: this._gantt.theme.scrollStyle?.width,
        // scrollWidth: this._gantt.theme.scrollStyle?.width,
        // viewHeight: this._gantt.tableNoFrameHeight,
        // viewWidth: this._gantt.tableNoFrameWidth,
        scrollDirection: 'vertical',
        scrollRatioY: yRatio
      });
    }
  }
  get scrollLeft() {
    return this.scroll.horizontalBarPos;
  }
  get scrollTop() {
    return this.scroll.verticalBarPos;
  }
  setScrollLeft(left: number, triggerEvent: boolean = true) {
    // 矫正left值范围
    const totalWidth = this._gantt.getAllDateColsWidth();

    left = Math.max(0, Math.min(left, totalWidth - this._gantt.scenegraph.width));
    left = Math.ceil(left);
    // 滚动期间清空选中清空
    // if (left !== this.scroll.horizontalBarPos) {
    //   this.updateHoverPos(-1, -1);
    // }
    // this._gantt.stateManager.updateSelectPos(-1, -1);
    const oldHorizontalBarPos = this.scroll.horizontalBarPos;
    this.scroll.horizontalBarPos = left;
    if (!isValid(this.scroll.horizontalBarPos) || isNaN(this.scroll.horizontalBarPos)) {
      this.scroll.horizontalBarPos = 0;
    }

    // 设置scenegraph坐标
    this._gantt.scenegraph.setX(-left);

    // 更新scrollbar位置
    const xRatio = left / (totalWidth - this._gantt.scenegraph.width);
    this._gantt.scenegraph.scrollbarComponent.updateHorizontalScrollBarPos(xRatio);

    if (oldHorizontalBarPos !== left && triggerEvent) {
      this._gantt.fireListeners(GANTT_EVENT_TYPE.SCROLL, {
        scrollTop: this.scroll.verticalBarPos,
        scrollLeft: this.scroll.horizontalBarPos,
        // scrollHeight: this._gantt.theme.scrollStyle?.width,
        // scrollWidth: this._gantt.theme.scrollStyle?.width,
        // viewHeight: this._gantt.tableNoFrameHeight,
        // viewWidth: this._gantt.tableNoFrameWidth,
        scrollDirection: 'horizontal',
        scrollRatioX: xRatio
      });
    }
  }

  updateInteractionState(mode: InteractionState) {
    if (this.interactionState === mode) {
      return;
    }
    const oldState = this.interactionState;
    this.interactionState = mode;
    // 处理mode 更新后逻辑
    if (oldState === InteractionState.scrolling && mode === InteractionState.default) {
      // this.table.scenegraph.stage.disableDirtyBounds();
      // this.table.scenegraph.stage.render();
      // this.table.scenegraph.stage.enableDirtyBounds();
    }
  }

  updateVerticalScrollBar(yRatio: number) {
    const totalHeight = this._gantt.getAllRowsHeight();
    const oldVerticalBarPos = this.scroll.verticalBarPos;
    this.scroll.verticalBarPos = Math.ceil(yRatio * (totalHeight - this._gantt.scenegraph.height));
    if (!isValid(this.scroll.verticalBarPos) || isNaN(this.scroll.verticalBarPos)) {
      this.scroll.verticalBarPos = 0;
    }
    this._gantt.scenegraph.setY(-this.scroll.verticalBarPos, yRatio === 1);
    syncScrollStateToTable(this._gantt);
    this._gantt.fireListeners(GANTT_EVENT_TYPE.SCROLL, {
      scrollTop: this.scroll.verticalBarPos,
      scrollLeft: this.scroll.horizontalBarPos,
      // scrollHeight: this.table.theme.scrollStyle?.width,
      // scrollWidth: this.table.theme.scrollStyle?.width,
      // viewHeight: this.table.tableNoFrameHeight,
      // viewWidth: this.table.tableNoFrameWidth,
      scrollDirection: 'vertical',
      scrollRatioY: yRatio
    });
  }
  updateHorizontalScrollBar(xRatio: number) {
    const totalWidth = this._gantt.getAllDateColsWidth();
    const oldHorizontalBarPos = this.scroll.horizontalBarPos;
    this.scroll.horizontalBarPos = Math.ceil(xRatio * (totalWidth - this._gantt.scenegraph.width));
    if (!isValid(this.scroll.horizontalBarPos) || isNaN(this.scroll.horizontalBarPos)) {
      this.scroll.horizontalBarPos = 0;
    }
    this._gantt.scenegraph.setX(-this.scroll.horizontalBarPos, xRatio === 1);
    this._gantt.fireListeners(GANTT_EVENT_TYPE.SCROLL, {
      scrollTop: this.scroll.verticalBarPos,
      scrollLeft: this.scroll.horizontalBarPos,
      // scrollHeight: this.table.theme.scrollStyle?.width,
      // scrollWidth: this.table.theme.scrollStyle?.width,
      // viewHeight: this.table.tableNoFrameHeight,
      // viewWidth: this.table.tableNoFrameWidth,
      scrollDirection: 'horizontal',
      scrollRatioY: xRatio
    });
    // this.scroll.horizontalBarPos -= this._gantt.scenegraph.proxy.deltaX;
    // this._gantt.scenegraph.proxy.deltaX = 0;

    // this._gantt.fireListeners(TABLE_EVENT_TYPE.SCROLL, {
    //   scrollTop: this.scroll.verticalBarPos,
    //   scrollLeft: this.scroll.horizontalBarPos,
    //   scrollHeight: this._gantt.theme.scrollStyle?.width,
    //   scrollWidth: this._gantt.theme.scrollStyle?.width,
    //   viewHeight: this._gantt.tableNoFrameHeight,
    //   viewWidth: this._gantt.tableNoFrameWidth,
    //   scrollDirection: 'horizontal',
    //   scrollRatioX: xRatio
    // });

    // if (oldHorizontalBarPos !== this.scroll.horizontalBarPos) {
    //   this.checkHorizontalScrollBarEnd();
    // }
  }

  startMoveTaskBar(target: GanttTaskBarNode, x: number, y: number, offsetY: number) {
    if (target.name === 'task-bar-hover-shadow') {
      target = target.parent;
    }
    this.moveTaskBar.moving = true;
    this.moveTaskBar.target = target;
    this.moveTaskBar.targetStartX = target.attribute.x;
    this.moveTaskBar.targetStartY = target.attribute.y;
    this.moveTaskBar.startX = x;
    this.moveTaskBar.startY = y;
    this.moveTaskBar.startOffsetY = offsetY;
    target.setAttribute('zIndex', 10000);
  }

  isMoveingTaskBar() {
    return this.moveTaskBar.moving;
  }
  endMoveTaskBar() {
    if (this.moveTaskBar.moveTaskBarXInertia.isInertiaScrolling()) {
      this.moveTaskBar.moveTaskBarXInertia.endInertia();
    }

    const deltaX = this.moveTaskBar.deltaX;
    const deltaY = this.moveTaskBar.deltaY;
    const target = this.moveTaskBar.target;
    if (Math.abs(deltaX) >= 1 || Math.abs(deltaY) >= 1) {
      // 计算原始行号
      const oldRowIndex = target.task_index;
      const taskIndex = target.task_index;
      const sub_task_index = target.sub_task_index;
      const { startDate: oldStartDate, endDate: oldEndDate } = this._gantt.getTaskInfoByTaskListIndex(
        taskIndex,
        sub_task_index
      );

      const targetEndY =
        this.moveTaskBar.targetStartY +
        this._gantt.parsedOptions.rowHeight * Math.round(deltaY / this._gantt.parsedOptions.rowHeight);
      const milestoneTaskbarHeight = this._gantt.parsedOptions.taskBarMilestoneStyle.width;
      const testDateX =
        this.moveTaskBar.target.attribute.x +
        (target.record.type === TaskType.MILESTONE ? milestoneTaskbarHeight / 2 : 0);
      const startDateColIndex = getDateIndexByX(
        testDateX - this._gantt.stateManager.scroll.horizontalBarPos,
        this._gantt
      );
      const timelineStartDate =
        this._gantt.parsedOptions.reverseSortedTimelineScales[0].timelineDates[startDateColIndex];
      if (!timelineStartDate) {
        return;
      }
      const newStartDate = timelineStartDate.startDate;
      // const endDateColIndex = getDateIndexByX(
      //   this.moveTaskBar.target.attribute.x +
      //     this.moveTaskBar.target.attribute.width -
      //     this._gantt.stateManager.scroll.horizontalBarPos,
      //   this._gantt
      // );
      // const timelineEndDate = this._gantt.parsedOptions.reverseSortedTimelineScales[0].timelineDates[endDateColIndex];
      const newEndDate = new Date(
        newStartDate.getTime() +
          (createDateAtMidnight(oldEndDate).getTime() - createDateAtMidnight(oldStartDate).getTime())
      );
      // 判断横向拖动 更新数据的date
      let dateChanged: 'left' | 'right';
      if (createDateAtMidnight(oldStartDate).getTime() !== newStartDate.getTime()) {
        dateChanged = createDateAtMidnight(oldStartDate).getTime() > newStartDate.getTime() ? 'left' : 'right';
        // this._gantt._updateDateToTaskRecord('move', days, taskIndex, sub_task_index);
        this._gantt._updateStartEndDateToTaskRecord(newStartDate, newEndDate, taskIndex, sub_task_index);
        const newRecord = this._gantt.getRecordByIndex(taskIndex, sub_task_index);

        if (this._gantt.hasListeners(GANTT_EVENT_TYPE.CHANGE_DATE_RANGE)) {
          this._gantt.fireListeners(GANTT_EVENT_TYPE.CHANGE_DATE_RANGE, {
            startDate: newRecord[this._gantt.parsedOptions.startDateField],
            endDate: newRecord[this._gantt.parsedOptions.endDateField],
            oldStartDate,
            oldEndDate,
            index: taskIndex,
            record: newRecord
          });
        }

        const indexs = getTaskIndexsByTaskY(targetEndY, this._gantt);
        const newRowIndex = indexs.task_index;
        // 触发通用拖拽事件
        if (this._gantt.hasListeners(GANTT_EVENT_TYPE.MOVE_END_TASK_BAR)) {
          this._gantt.fireListeners(GANTT_EVENT_TYPE.MOVE_END_TASK_BAR, {
            startDate: newRecord[this._gantt.parsedOptions.startDateField],
            endDate: newRecord[this._gantt.parsedOptions.endDateField],
            oldStartDate,
            oldEndDate,
            oldRowIndex,
            newRowIndex,
            index: taskIndex,
            record: newRecord
            // dateChanged: !!dateChanged,
            // positionChanged: oldRowIndex !== newRowIndex
          });
        }
      } else {
        const newRecord = this._gantt.getRecordByIndex(taskIndex, sub_task_index);
        const indexs = getTaskIndexsByTaskY(targetEndY, this._gantt);
        const newRowIndex = indexs.task_index;
        // 触发通用拖拽事件
        if (this._gantt.hasListeners(GANTT_EVENT_TYPE.MOVE_END_TASK_BAR)) {
          this._gantt.fireListeners(GANTT_EVENT_TYPE.MOVE_END_TASK_BAR, {
            startDate: newRecord[this._gantt.parsedOptions.startDateField],
            endDate: newRecord[this._gantt.parsedOptions.endDateField],
            oldStartDate,
            oldEndDate,
            oldRowIndex,
            newRowIndex,
            index: newRowIndex,
            record: newRecord
          });
        }
      }
      if (
        this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange ||
        this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact
      ) {
        const indexs = getTaskIndexsByTaskY(targetEndY, this._gantt);
        this._gantt._dragOrderTaskRecord(
          target.task_index,
          target.sub_task_index,
          indexs.task_index,
          indexs.sub_task_index
        );
        clearRecordShowIndex(this._gantt.records);
        this._gantt.taskListTableInstance.renderWithRecreateCells();
        this._gantt._syncPropsFromTable();
        this._gantt.scenegraph.refreshTaskBarsAndGrid();
      } else {
        // 判断纵向拖动 处理数据的位置
        if (
          this._gantt.parsedOptions.tasksShowMode !== TasksShowMode.Tasks_Separate &&
          Math.abs(Math.round(deltaY / this._gantt.parsedOptions.rowHeight)) >= 1
        ) {
          const indexs = getTaskIndexsByTaskY(targetEndY, this._gantt);
          this._gantt._dragOrderTaskRecord(
            target.task_index,
            target.sub_task_index,
            indexs.task_index,
            indexs.sub_task_index
          );
          if (this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate) {
            this._gantt.taskListTableInstance.renderWithRecreateCells();
            this._gantt.scenegraph.refreshTaskBarsAndGrid();
          } else {
            this._gantt.scenegraph.taskBar.refresh();
            this._gantt.scenegraph.dependencyLink.refresh();
          }
          // target = this._gantt.scenegraph.taskBar.getTaskBarNodeByIndex(indexs.task_index, indexs.sub_task_index);
        } else {
          let newX = startDateColIndex >= 1 ? this._gantt.getDateColsWidth(0, startDateColIndex - 1) : 0;
          if (target.record.type === TaskType.MILESTONE) {
            const milestoneTaskbarHeight = this._gantt.parsedOptions.taskBarMilestoneStyle.width;
            newX -= milestoneTaskbarHeight / 2;
          }
          moveTaskBar(target, newX - (target as Group).attribute.x, targetEndY - (target as Group).attribute.y, this);

          // 为了确保拖拽后 保持startDate日期晚的显示在上层不被盖住 这里需要重新排序一下
          if (dateChanged === 'right') {
            let insertAfterNode = target;
            while (
              (insertAfterNode as Group).nextSibling &&
              (insertAfterNode as Group).nextSibling.attribute.y === (target as Group).attribute.y &&
              (insertAfterNode as Group).nextSibling.record[this._gantt.parsedOptions.startDateField] <=
                target.record[this._gantt.parsedOptions.startDateField]
            ) {
              insertAfterNode = (insertAfterNode as Group).nextSibling as any;
            }
            if (insertAfterNode !== target) {
              ((insertAfterNode as Group).parent as any).insertAfter(target, insertAfterNode);
            }
          } else if (dateChanged === 'left') {
            let insertBeforeNode = target;
            while (
              (insertBeforeNode as Group).previousSibling &&
              (insertBeforeNode as Group).previousSibling.attribute.y === (target as Group).attribute.y &&
              (insertBeforeNode as Group).previousSibling.record[this._gantt.parsedOptions.startDateField] >=
                target.record[this._gantt.parsedOptions.startDateField]
            ) {
              insertBeforeNode = (insertBeforeNode as Group).previousSibling as any;
            }
            if (insertBeforeNode !== target) {
              ((insertBeforeNode as Group).parent as any).insertBefore(target, insertBeforeNode);
            }
          }
        }
      }
      this._gantt.scenegraph.updateNextFrame();
    }
    this.moveTaskBar.moving = false;
    if (this.selectedTaskBar.target !== target) {
      target.setAttribute('zIndex', 0);
    }
    target.updateTextPosition();
    this.moveTaskBar.target = null;
    this.moveTaskBar.deltaX = 0;
    this.moveTaskBar.deltaY = 0;
    this.moveTaskBar.moveTaskBarXSpeed = 0;
  }
  dealTaskBarMove(e: FederatedPointerEvent) {
    const gantt = this._gantt;
    let target = this.moveTaskBar.target;
    target.setAttribute('zIndex', 10000);
    // const taskIndex = getTaskIndexByY(this.moveTaskBar.startOffsetY, this._gantt);
    const x1 = gantt.eventManager.lastDragPointerXYOnWindow.x;
    const x2 = e.x;
    const dx = x2 - x1;
    const y1 = gantt.eventManager.lastDragPointerXYOnWindow.y;
    const y2 = e.y;
    const dy = y2 - y1;

    this.moveTaskBar.deltaX += dx;
    this.moveTaskBar.deltaY += dy;
    // target.setAttribute('x', target.attribute.x + dx);
    moveTaskBar(target, dx, dy, this);

    // 处理向左拖拽任务条时，整体向左滚动
    if (target.attribute.x <= gantt.stateManager.scrollLeft && dx < 0) {
      if (gantt.parsedOptions.moveTaskBarToExtendDateRange && gantt.stateManager.scrollLeft === 0) {
        this.moveTaskBar.moveTaskBarXInertia?.endInertia();
        //已经在最左边了 扩展滚动区域
        const timeDiff =
          gantt.parsedOptions.reverseSortedTimelineScales[0].timelineDates[1].startDate.getTime() -
          gantt.parsedOptions.reverseSortedTimelineScales[0].timelineDates[0].startDate.getTime();
        const { unit: minTimeUnit, startOfWeek } = gantt.parsedOptions.reverseSortedTimelineScales[0];
        gantt.parsedOptions.minDate = getStartDateByTimeUnit(
          new Date(
            gantt.parsedOptions.reverseSortedTimelineScales[0].timelineDates[0].startDate.getTime() - timeDiff / 2
          ),
          minTimeUnit,
          startOfWeek
        );
        gantt.parsedOptions._minDateTime = gantt.parsedOptions.minDate?.getTime();
        gantt._generateTimeLineDateMap();
        gantt._updateSize();
        // refreshAll 当数据量大时会有性能问题 TODO优化
        gantt.scenegraph.refreshAll();
        target = this.moveTaskBar.target = gantt.scenegraph.taskBar.getTaskBarNodeByIndex(
          this.moveTaskBar.target.task_index,
          this.moveTaskBar.target.sub_task_index
        );
        gantt.scrollLeft = gantt.parsedOptions.timelineColWidth - 1;
        gantt.eventManager.lastDragPointerXYOnWindow.x = e.x;
        if (target.record?.type === 'milestone') {
          moveTaskBar(target, gantt.scrollLeft - target.attribute.x, 0, this);
        } else {
          target.setAttribute('x', gantt.scrollLeft);
        }
      } else {
        this.moveTaskBar.moveTaskBarXSpeed = -gantt.parsedOptions.timelineColWidth / 100;

        this.moveTaskBar.moveTaskBarXInertia.startInertia(this.moveTaskBar.moveTaskBarXSpeed, 0, 1);
        this.moveTaskBar.moveTaskBarXInertia.setScrollHandle((dx: number, dy: number) => {
          this.moveTaskBar.deltaX += dx;
          this.moveTaskBar.deltaY += dy;
          moveTaskBar(target, dx, dy, this);

          gantt.stateManager.setScrollLeft(target.attribute.x);
          if (gantt.stateManager.scrollLeft === 0) {
            this.moveTaskBar.moveTaskBarXInertia.endInertia();
          }
        });
      }
    } else if (
      target.attribute.x + target.attribute.width >= gantt.stateManager.scrollLeft + gantt.tableNoFrameWidth &&
      dx > 0
    ) {
      if (
        gantt.parsedOptions.moveTaskBarToExtendDateRange &&
        gantt.stateManager.scrollLeft + gantt.tableNoFrameWidth === gantt.getAllDateColsWidth()
      ) {
        this.moveTaskBar.moveTaskBarXInertia?.endInertia();
        //已经在最左边了 扩展滚动区域
        const timelineDates = gantt.parsedOptions.reverseSortedTimelineScales[0].timelineDates;
        const timeDiff = timelineDates[1].startDate.getTime() - timelineDates[0].startDate.getTime();
        const { unit: minTimeUnit, startOfWeek, step } = gantt.parsedOptions.reverseSortedTimelineScales[0];
        gantt.parsedOptions.maxDate = getEndDateByTimeUnit(
          gantt.parsedOptions.minDate,
          new Date(timelineDates[timelineDates.length - 1].endDate.getTime() + timeDiff / 2),
          minTimeUnit,
          step
        );
        gantt.parsedOptions._maxDateTime = gantt.parsedOptions.maxDate?.getTime();
        gantt._generateTimeLineDateMap();
        gantt._updateSize();
        // refreshAll 当数据量大时会有性能问题 TODO优化
        gantt.scenegraph.refreshAll();
        target = this.moveTaskBar.target = gantt.scenegraph.taskBar.getTaskBarNodeByIndex(
          this.moveTaskBar.target.task_index,
          this.moveTaskBar.target.sub_task_index
        );
        gantt.scrollLeft += 1;
        gantt.eventManager.lastDragPointerXYOnWindow.x = e.x;
        if (target.record?.type === 'milestone') {
          const newX = gantt.scrollLeft + gantt.tableNoFrameWidth - target.attribute.width;
          moveTaskBar(target, newX - target.attribute.x, 0, this);
        } else {
          target.setAttribute('x', gantt.scrollLeft + gantt.tableNoFrameWidth - target.attribute.width);
        }
      } else {
        // 处理向右拖拽任务条时，整体向右滚动
        this.moveTaskBar.moveTaskBarXSpeed = gantt.parsedOptions.timelineColWidth / 100;

        this.moveTaskBar.moveTaskBarXInertia.startInertia(this.moveTaskBar.moveTaskBarXSpeed, 0, 1);
        this.moveTaskBar.moveTaskBarXInertia.setScrollHandle((dx: number, dy: number) => {
          this.moveTaskBar.deltaX += dx;
          this.moveTaskBar.deltaY += dy;
          moveTaskBar(target, dx, dy, this);

          gantt.stateManager.setScrollLeft(target.attribute.x + target.attribute.width - gantt.tableNoFrameWidth);
          if (gantt.stateManager.scrollLeft === gantt.getAllDateColsWidth() - gantt.tableNoFrameWidth) {
            this.moveTaskBar.moveTaskBarXInertia.endInertia();
          }
        });
      }
    } else if (this.moveTaskBar.moveTaskBarXInertia.isInertiaScrolling()) {
      this.moveTaskBar.moveTaskBarXInertia.endInertia();
    } else {
      this.moveTaskBar.moveTaskBarXSpeed = 0;
    }

    gantt.scenegraph.updateNextFrame();
  }
  //#region 调整拖拽任务条的大小
  startResizeTaskBar(target: Group, x: number, y: number, startOffsetY: number, onIconName: string) {
    // if (target.name === 'task-bar-hover-shadow') {
    // target = target.parent.parent;
    // }
    this.resizeTaskBar.onIconName = onIconName;
    this.resizeTaskBar.resizing = true;
    this.resizeTaskBar.target = target as GanttTaskBarNode;
    this.resizeTaskBar.targetStartX = target.attribute.x;
    this.resizeTaskBar.targetEndX = target.attribute.x + target.attribute.width;
    this.resizeTaskBar.startX = x;
    this.resizeTaskBar.startY = y;
    this.resizeTaskBar.startOffsetY = startOffsetY;
  }
  isResizingTaskBar() {
    return this.resizeTaskBar.resizing;
  }
  endResizeTaskBar(x: number) {
    const direction = this._gantt.stateManager.resizeTaskBar.onIconName;
    const deltaX = x - this.resizeTaskBar.startX;
    if (Math.abs(deltaX) >= 1) {
      // let diff_days =
      //   Math.round(deltaX / this._gantt.parsedOptions.timelineColWidth) * this._gantt.getMinScaleUnitToDays();

      const colIndex = getDateIndexByX(
        (direction === 'left'
          ? this.resizeTaskBar.target.attribute.x
          : this.resizeTaskBar.target.attribute.x + this.resizeTaskBar.target.attribute.width) -
          this._gantt.stateManager.scroll.horizontalBarPos,
        this._gantt
      );
      const timelineDate = this._gantt.parsedOptions.reverseSortedTimelineScales[0].timelineDates[colIndex];
      if (!timelineDate) {
        return;
      }
      const targetDate = direction === 'left' ? timelineDate.startDate : timelineDate.endDate;
      // diff_days = direction === 'left' ? -diff_days : diff_days;

      const taskBarGroup = this.resizeTaskBar.target;
      const clipGroupBox = taskBarGroup.clipGroupBox;
      const rect = taskBarGroup.barRect;
      const progressRect = taskBarGroup.progressRect;
      const textLabel = taskBarGroup.textLabel;
      const taskIndex = taskBarGroup.task_index;
      const sub_task_index = taskBarGroup.sub_task_index;

      const {
        taskDays,
        progress,
        startDate: oldStartDate,
        endDate: oldEndDate
      } = this._gantt.getTaskInfoByTaskListIndex(taskIndex, sub_task_index);

      let dateChanged = false;
      if (direction === 'left') {
        this._gantt._updateStartDateToTaskRecord(targetDate, taskIndex, sub_task_index);
        targetDate.getTime() !== new Date(oldStartDate).getTime() && (dateChanged = true);
      } else {
        this._gantt._updateEndDateToTaskRecord(targetDate, taskIndex, sub_task_index);
        targetDate.getTime() !== new Date(oldEndDate).getTime() && (dateChanged = true);
      }
      if (
        this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange ||
        this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact
      ) {
        this._gantt.taskListTableInstance.renderWithRecreateCells();
        this._gantt._syncPropsFromTable();
        this._gantt.scenegraph.refreshTaskBarsAndGrid();
      } else {
        if (direction === 'left') {
          const newX = colIndex >= 1 ? this._gantt.getDateColsWidth(0, colIndex - 1) : 0;
          taskBarGroup.setAttribute('x', newX);
          taskBarGroup.setAttribute('width', this.resizeTaskBar.targetEndX - newX);
        } else if (direction === 'right') {
          const newEndX = this._gantt.getDateColsWidth(0, colIndex);
          taskBarGroup.setAttribute('width', newEndX - this.resizeTaskBar.targetStartX);
        }
        clipGroupBox.setAttribute('width', taskBarGroup.attribute.width);
        rect?.setAttribute('width', taskBarGroup.attribute.width);
        progressRect?.setAttribute('width', (progress / 100) * taskBarGroup.attribute.width);
        if (textLabel) {
          const { textAlign, textBaseline, padding } = this._gantt.parsedOptions.taskBarLabelStyle;
          const position = getTextPos(
            toBoxArray(padding),
            textAlign,
            textBaseline,
            taskBarGroup.attribute.width,
            taskBarGroup.attribute.height
          );
          textLabel.setAttribute('maxLineWidth', taskBarGroup.attribute.width - TASKBAR_HOVER_ICON_WIDTH * 2);
          textLabel.setAttribute('x', position.x);
        }
        this._gantt.scenegraph.refreshRecordLinkNodes(taskIndex, sub_task_index, taskBarGroup, 0); //更新关联线
        this.showTaskBarHover();
        reCreateCustomNode(this._gantt, taskBarGroup, taskIndex, sub_task_index);
        taskBarGroup.setAttribute('zIndex', 0);
      }
      taskBarGroup.updateTextPosition();
      this.resizeTaskBar.resizing = false;
      this.resizeTaskBar.target = null;

      if (dateChanged && this._gantt.hasListeners(GANTT_EVENT_TYPE.CHANGE_DATE_RANGE)) {
        const newRecord = this._gantt.getRecordByIndex(taskIndex, sub_task_index);
        this._gantt.fireListeners(GANTT_EVENT_TYPE.CHANGE_DATE_RANGE, {
          startDate: newRecord[this._gantt.parsedOptions.startDateField],
          endDate: newRecord[this._gantt.parsedOptions.endDateField],
          oldStartDate,
          oldEndDate,
          index: taskIndex,
          record: newRecord
        });
      }
      this._gantt.scenegraph.updateNextFrame();
    }
  }
  dealTaskBarResize(e: FederatedPointerEvent) {
    const x1 = this._gantt.eventManager.lastDragPointerXYOnWindow.x;
    const x2 = e.x;
    const dx = x2 - x1;
    // debugger;
    const taskBarGroup = this._gantt.stateManager.resizeTaskBar.target;

    // const taskIndex = getTaskIndexByY(this.resizeTaskBar.startOffsetY, this._gantt);

    let diffWidth = this._gantt.stateManager.resizeTaskBar.onIconName === 'left' ? -dx : dx;
    const taskBarSize = Math.max(1, taskBarGroup.attribute.width + diffWidth);
    diffWidth = taskBarSize - taskBarGroup.attribute.width;

    resizeTaskBar(
      taskBarGroup,
      this._gantt.stateManager.resizeTaskBar.onIconName === 'left' ? -diffWidth : 0,

      taskBarSize,
      this
    );

    this._gantt.scenegraph.updateNextFrame();
  }
  startAdjustProgressBar(target: GanttTaskBarNode, x: number, y: number) {
    // 验证目标任务条是否有效
    if (!target || !target.record) {
      console.warn('Invalid target for progress adjustment');
      return;
    }

    // 检查进度字段是否存在
    const progressField = this._gantt.parsedOptions.progressField;
    if (!progressField || target.record[progressField] === undefined || target.record[progressField] === null) {
      console.warn('Progress field not found or invalid');
      return;
    }

    const { progress } = this._gantt.getTaskInfoByTaskListIndex(target.task_index, target.sub_task_index);
    this.adjustProgressBar.target = target;
    this.adjustProgressBar.adjusting = true;
    this.adjustProgressBar.startX = x;
    this.adjustProgressBar.startY = y;
    this.adjustProgressBar.originalProgress = progress;
  }
  isAdjustingProgressBar() {
    return this.adjustProgressBar.adjusting;
  }
  endAdjustProgressBar(x: number) {
    const target = this.adjustProgressBar.target;
    if (!target) {
      return;
    }

    const taskBarWidth = target.attribute.width;
    const deltaX = x - this.adjustProgressBar.startX;
    const newProgress = Math.max(
      0,
      Math.min(100, this.adjustProgressBar.originalProgress + (deltaX / taskBarWidth) * 100)
    );

    if (Math.abs(newProgress - this.adjustProgressBar.originalProgress) >= 0.1) {
      const taskIndex = target.task_index;
      const subTaskIndex = target.sub_task_index;

      // 直接更新任务记录的进度值
      const progressField = this._gantt.parsedOptions.progressField;
      if (progressField && target.record) {
        target.record[progressField] = Math.round(newProgress * 10) / 10;
      }

      // 根据不同的 tasksShowMode 决定是否需要同步到表格
      if (this.shouldSyncProgressToTable(taskIndex, subTaskIndex)) {
        this._gantt._updateProgressToTaskRecord(Math.round(newProgress * 10) / 10, taskIndex, subTaskIndex);
      }

      // 刷新任务条显示
      this._gantt.scenegraph.taskBar.updateTaskBarNode(taskIndex, subTaskIndex);

      // 获取更新后的记录
      const newRecord = this._gantt.getRecordByIndex(taskIndex, subTaskIndex);

      // 触发进度更新事件
      if (this._gantt.hasListeners(GANTT_EVENT_TYPE.PROGRESS_UPDATE)) {
        this._gantt.fireListeners(GANTT_EVENT_TYPE.PROGRESS_UPDATE, {
          federatedEvent: null,
          event: null,
          index: taskIndex,
          sub_task_index: subTaskIndex,
          progress: Math.round(newProgress * 10) / 10,
          oldProgress: Math.round(this.adjustProgressBar.originalProgress * 10) / 10,
          record: newRecord
        });
      }
    }

    // 重置状态
    this.adjustProgressBar.adjusting = false;
    this.adjustProgressBar.target = null;
    this.adjustProgressBar.startX = null;
    this.adjustProgressBar.startY = null;
    this.adjustProgressBar.originalProgress = 0;
  }

  /**
   * 判断是否需要将进度同步到左侧表格
   * 根据不同的 tasksShowMode 和任务类型决定
   */
  private shouldSyncProgressToTable(taskIndex: number, subTaskIndex?: number | number[]): boolean {
    const tasksShowMode = this._gantt.parsedOptions.tasksShowMode;

    // Tasks_Separate 模式：所有任务都需要同步到表格
    if (tasksShowMode === TasksShowMode.Tasks_Separate) {
      return true;
    }

    // 如果没有子任务索引，说明是主任务，需要同步
    if (!isValid(subTaskIndex)) {
      return true;
    }

    // 其他子任务模式：子任务通常不需要同步到表格，因为它们不占独立行
    switch (tasksShowMode) {
      case TasksShowMode.Sub_Tasks_Inline:
      case TasksShowMode.Sub_Tasks_Arrange:
      case TasksShowMode.Sub_Tasks_Compact:
        return false; // 子任务不占独立行，不需要同步

      case TasksShowMode.Sub_Tasks_Separate:
        return true; // 子任务占独立行，需要同步

      case TasksShowMode.Project_Sub_Tasks_Inline:
        // 需要检查父项目的展开状态
        const parentRecord = this._gantt.getRecordByIndex(taskIndex);
        if (parentRecord && parentRecord.type === TaskType.PROJECT) {
          return parentRecord.hierarchyState === 'expand';
        }
        return false;

      default:
        return false;
    }
  }
  dealAdjustProgressBar(e: FederatedPointerEvent) {
    const target = this.adjustProgressBar.target;
    if (!target || !this.adjustProgressBar.adjusting) {
      return;
    }

    const taskBarWidth = target.attribute.width;
    if (!taskBarWidth || taskBarWidth <= 0) {
      return;
    }

    const deltaX = e.x - this.adjustProgressBar.startX;
    const newProgress = Math.max(
      0,
      Math.min(100, this.adjustProgressBar.originalProgress + (deltaX / taskBarWidth) * 100)
    );

    // 更新进度条显示
    if (target.progressRect) {
      target.progressRect.setAttribute('width', (taskBarWidth * newProgress) / 100);
    }

    // 更新进度手柄位置
    if (
      this._gantt.scenegraph.taskBar.hoverBarProgressHandle &&
      this._gantt.scenegraph.taskBar.hoverBarProgressHandle.attribute.visibleAll
    ) {
      this._gantt.scenegraph.taskBar.hoverBarProgressHandle.setAttribute('x', (taskBarWidth * newProgress) / 100 - 6);
    }

    // 更新文字标签中的进度百分比
    if (target.textLabel && target.record && this._gantt.parsedOptions.taskBarLabelText) {
      const progressField = this._gantt.parsedOptions.progressField;
      const tempRecord = {
        ...target.record,
        [progressField]: Math.round(newProgress * 10) / 10
      };
      const newText = parseStringTemplate(this._gantt.parsedOptions.taskBarLabelText as string, tempRecord);
      target.textLabel.setAttribute('text', newText);
    }

    // 实时显示变化
    if (this._gantt.scenegraph && this._gantt.scenegraph.stage) {
      this._gantt.scenegraph.stage.renderNextFrame();
    }
  }
  //#endregion
  //#region 生成关联线的交互处理
  startCreateDependencyLine(target: Group, x: number, y: number, startOffsetY: number, position: 'left' | 'right') {
    // if (target.name === 'task-bar-hover-shadow') {
    // target = target.parent.parent;
    // }
    this.resizeTaskBar.resizing = false; // 关联线创建时，任务条resizing状态重置
    this.creatingDenpendencyLink.creating = true;
    this.creatingDenpendencyLink.startClickedPoint = target;
    this.creatingDenpendencyLink.startX = x;
    this.creatingDenpendencyLink.startY = y;
    this.creatingDenpendencyLink.startOffsetY = startOffsetY;
    this.creatingDenpendencyLink.firstTaskBarPosition = position;
    this.highlightLinkPointNode(target);
  }
  isCreatingDependencyLine() {
    return this.creatingDenpendencyLink.creating;
  }
  endCreateDependencyLine(offsetY: number) {
    const taskKeyField = this._gantt.parsedOptions.taskKeyField;
    // const fromTaskIndex = getTaskIndexByY(this.creatingDenpendencyLink.startOffsetY, this._gantt);
    const fromTaskIndex = this.selectedTaskBar.target.task_index;
    const from_sub_task_id = this.selectedTaskBar.target.sub_task_index;
    // const toTaskIndex = getTaskIndexByY(offsetY, this._gantt);
    const toTaskIndex = this.creatingDenpendencyLink.secondTaskBarNode.task_index;
    const to_sub_task_id = this.creatingDenpendencyLink.secondTaskBarNode.sub_task_index;
    const fromRecord = this._gantt.getRecordByIndex(fromTaskIndex, from_sub_task_id);
    const linkedFromTaskKey = fromRecord[taskKeyField];
    const toRecord = this._gantt.getRecordByIndex(toTaskIndex, to_sub_task_id);
    const linkedToTaskKey = toRecord[taskKeyField];
    const link = {
      linkedFromTaskKey,
      linkedToTaskKey,
      type:
        this.creatingDenpendencyLink.firstTaskBarPosition === 'left' &&
        this.creatingDenpendencyLink.secondTaskBarPosition === 'left'
          ? DependencyType.StartToStart
          : this.creatingDenpendencyLink.firstTaskBarPosition === 'right' &&
            this.creatingDenpendencyLink.secondTaskBarPosition === 'left'
          ? DependencyType.FinishToStart
          : this.creatingDenpendencyLink.firstTaskBarPosition === 'right' &&
            this.creatingDenpendencyLink.secondTaskBarPosition === 'right'
          ? DependencyType.FinishToFinish
          : DependencyType.StartToFinish
    };
    this._gantt.addLink(link);
    // const oldRecord = this._gantt.getRecordByIndex(fromTaskIndex);
    this.hideTaskBarSelectedBorder();
    this._gantt.scenegraph.updateNextFrame();
    this.creatingDenpendencyLink.creating = false;
    return link;
  }
  dealCreateDependencyLine(e: FederatedPointerEvent) {
    const x1 = this.creatingDenpendencyLink.startX;
    const y1 = this.creatingDenpendencyLink.startY;
    const x2 = e.x;
    const y2 = e.y;
    const dx = x2 - x1;
    const dy = y2 - y1;
    // debugger;
    const startClickedPoint = this.creatingDenpendencyLink.startClickedPoint;
    const x = startClickedPoint.attribute.x + startClickedPoint.attribute.width / 2;
    const y = startClickedPoint.attribute.y + startClickedPoint.attribute.height / 2;
    this._gantt.scenegraph.taskBar.updateCreatingDependencyLine(x, y, x + dx, y + dy);
    this._gantt.scenegraph.updateNextFrame();
    //
  }
  //#endregion
  //#region 调整左侧任务列表表格整体的宽度
  startResizeTableWidth(e: MouseEvent) {
    this.resizeTableWidth.resizing = true;
    this.resizeTableWidth.lastX = e.pageX;
    //this.resizeTableWidth.startWidth = this._gantt.tableNoFrameWidth;
  }
  isResizingTableWidth() {
    return this.resizeTableWidth.resizing;
  }
  endResizeTableWidth() {
    this.resizeTableWidth.resizing = false;

    if (this._gantt.zoomScaleManager) {
      this._gantt.zoomScaleManager.handleTableWidthChange();
    }
  }

  dealResizeTableWidth(e: MouseEvent) {
    if (!this.resizeTableWidth.resizing) {
      return;
    }
    const deltaX = e.pageX - this.resizeTableWidth.lastX;
    if (Math.abs(deltaX) >= 1) {
      const startWidth = this._gantt.taskTableWidth;
      let width = startWidth + deltaX;
      const allColsWidth = this._gantt.taskListTableInstance.getAllColsWidth();
      const colsWidth = Array.isArray(allColsWidth) ? allColsWidth.reduce((a, b) => a + b, 0) : allColsWidth;
      const maxWidth = Math.min(
        colsWidth + this._gantt.parsedOptions.outerFrameStyle.borderLineWidth,
        this._gantt.options.taskListTable.maxTableWidth ?? 100000
      );
      const minTableWidth = this._gantt.options.taskListTable.minTableWidth;
      const minWidthValue: number = Array.isArray(minTableWidth)
        ? minTableWidth[0] ?? 0
        : typeof minTableWidth === 'number'
        ? minTableWidth
        : 0;
      const borderLineWidth =
        typeof this._gantt.parsedOptions.outerFrameStyle.borderLineWidth === 'number'
          ? this._gantt.parsedOptions.outerFrameStyle.borderLineWidth
          : Array.isArray(this._gantt.parsedOptions.outerFrameStyle.borderLineWidth)
          ? this._gantt.parsedOptions.outerFrameStyle.borderLineWidth[0] ?? 0
          : 0;
      const minWidth = Math.max(borderLineWidth, minWidthValue);
      if (deltaX > 0 && width > maxWidth) {
        width = maxWidth;
      }
      if (deltaX < 0 && width < minWidth) {
        width = minWidth;
      }
      this._gantt.taskTableWidth = width;
      this._gantt.element.style.left = this._gantt.taskTableWidth ? `${this._gantt.taskTableWidth}px` : '0px';
      this._gantt.verticalSplitResizeLine.style.left = this._gantt.taskTableWidth
        ? `${this._gantt.taskTableWidth - 7}px`
        : '0px';
      this._gantt._resize();
      this.resizeTableWidth.lastX = e.pageX;

      // 在拖拽过程中实时更新 DataZoom
      if (this._gantt.zoomScaleManager && !this.resizeTableWidth.updateTimeout) {
        this.resizeTableWidth.updateTimeout = setTimeout(() => {
          if (this._gantt.zoomScaleManager) {
            this._gantt.zoomScaleManager.handleTableWidthChange();
          }
          this.resizeTableWidth.updateTimeout = null;
        }, 50);
      }
    }
  }
  //#endregion

  showTaskBarHover() {
    const target = this._gantt.stateManager.hoverTaskBar.target;
    if (target) {
      const x = target.attribute.x;
      const y = target.attribute.y;
      const width = target.attribute.width;
      const height = target.attribute.height;
      this._gantt.scenegraph.taskBar.showHoverBar(x, y, width, height, target);
      this._gantt.scenegraph.updateNextFrame();
    }
  }
  hideTaskBarHover(e: FederatedPointerEvent) {
    this._gantt.stateManager.hoverTaskBar.target = null;
    this._gantt.scenegraph.taskBar.hideHoverBar();
    this._gantt.scenegraph.updateNextFrame();
  }

  showTaskBarSelectedBorder(target: GanttTaskBarNode) {
    this._gantt.stateManager.selectedTaskBar.target?.setAttribute('zIndex', 0);
    this._gantt.stateManager.selectedTaskBar.target = target as any as GanttTaskBarNode;
    const linkCreatable = this._gantt.parsedOptions.dependencyLinkCreatable;
    target.setAttribute('zIndex', 10000);
    const x = target.attribute.x;
    const y = target.attribute.y;
    const width = target.attribute.width;
    const height = target.attribute.height;
    this._gantt.scenegraph.taskBar.createSelectedBorder(x, y, width, height, target, linkCreatable);
    this._gantt.scenegraph.updateNextFrame();
  }

  hideTaskBarSelectedBorder() {
    this._gantt.stateManager.selectedTaskBar.target?.setAttribute('zIndex', 0);
    this._gantt.stateManager.selectedTaskBar.target = null;
    this._gantt.scenegraph.taskBar.removeSelectedBorder();
    this._gantt.scenegraph.updateNextFrame();
  }
  showSecondTaskBarSelectedBorder() {
    const target = this._gantt.stateManager.creatingDenpendencyLink.secondTaskBarNode;
    const x = target.attribute.x;
    const y = target.attribute.y;
    const width = target.attribute.width;
    const height = target.attribute.height;
    this._gantt.scenegraph.taskBar.createSelectedBorder(x, y, width, height, target, true);
    this._gantt.scenegraph.updateNextFrame();
  }
  hideSecondTaskBarSelectedBorder() {
    this._gantt.stateManager.creatingDenpendencyLink.secondTaskBarNode = null;
    this._gantt.scenegraph.taskBar.removeSecondSelectedBorder();
    this._gantt.scenegraph.updateNextFrame();
  }
  showDependencyLinkSelectedLine() {
    const link = this._gantt.stateManager.selectedDenpendencyLink.link;
    this._gantt.scenegraph.dependencyLink.createSelectedLinkLine(link);

    const { taskKeyField, dependencyLinks } = this._gantt.parsedOptions;
    const { linkedToTaskKey, linkedFromTaskKey, type } = link;
    let linkFrom_index;
    let linkFrom_sub_task_index;
    let linkTo_index;
    let linkTo_sub_task_index;
    const linkedToTaskRecord = findRecordByTaskKey(this._gantt.records, taskKeyField, linkedToTaskKey);
    const linkedFromTaskRecord = findRecordByTaskKey(this._gantt.records, taskKeyField, linkedFromTaskKey);
    if (
      this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline ||
      this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate ||
      this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange ||
      this._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact
    ) {
      linkFrom_index = linkedFromTaskRecord.index[0];
      linkFrom_sub_task_index = linkedFromTaskRecord.index[1];
      linkTo_index = linkedToTaskRecord.index[0];
      linkTo_sub_task_index = linkedToTaskRecord.index[1];
    } else {
      linkFrom_index = this._gantt.getTaskShowIndexByRecordIndex(linkedFromTaskRecord.index);
      linkTo_index = this._gantt.getTaskShowIndexByRecordIndex(linkedToTaskRecord.index);
    }
    const fromTaskNode = this._gantt.scenegraph.taskBar.getTaskBarNodeByIndex(
      linkFrom_index,
      linkFrom_sub_task_index
    ) as GanttTaskBarNode;
    this._gantt.scenegraph.taskBar.createSelectedBorder(
      fromTaskNode.attribute.x,
      fromTaskNode.attribute.y,
      fromTaskNode.attribute.width,
      fromTaskNode.attribute.height,
      fromTaskNode,
      false
    );
    const toTaskNode = this._gantt.scenegraph.taskBar.getTaskBarNodeByIndex(
      linkTo_index,
      linkTo_sub_task_index
    ) as GanttTaskBarNode;
    this._gantt.scenegraph.taskBar.createSelectedBorder(
      toTaskNode.attribute.x,
      toTaskNode.attribute.y,
      toTaskNode.attribute.width,
      toTaskNode.attribute.height,
      toTaskNode,
      false
    );

    this._gantt.scenegraph.updateNextFrame();
  }
  hideDependencyLinkSelectedLine() {
    this._gantt.stateManager.selectedDenpendencyLink.link = null;
    this._gantt.scenegraph.dependencyLink.removeSelectedLinkLine();
    this._gantt.scenegraph.taskBar.removeSelectedBorder();
    this._gantt.scenegraph.updateNextFrame();
  }
  highlightLinkPointNode(linkPointGroup: Group) {
    if (linkPointGroup?.children.length > 0) {
      const circle = linkPointGroup.children[0];
      circle.setAttribute('fill', this._gantt.parsedOptions.dependencyLinkLineCreatingPointStyle.fillColor);
      circle.setAttribute('stroke', this._gantt.parsedOptions.dependencyLinkLineCreatingPointStyle.strokeColor);
      circle.setAttribute('radius', this._gantt.parsedOptions.dependencyLinkLineCreatingPointStyle.radius);
      circle.setAttribute('lineWidth', this._gantt.parsedOptions.dependencyLinkLineCreatingPointStyle.strokeWidth);
      this._gantt.scenegraph.updateNextFrame();
    }
  }
  unhighlightLinkPointNode(linkPointGroup: Group) {
    if (linkPointGroup?.children.length > 0) {
      const circle = linkPointGroup.children[0];
      circle.setAttribute('fill', this._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.fillColor);
      circle.setAttribute('stroke', this._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.strokeColor);
      circle.setAttribute('radius', this._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.radius);
      circle.setAttribute('lineWidth', this._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.strokeWidth);
      this._gantt.scenegraph.updateNextFrame();
    }
  }
  showMarklineIconHover() {
    const target = this._gantt.stateManager.marklineIcon.target;
    if (target) {
      const marklineGroup = this._gantt.scenegraph.timelineHeader.showMarklineIcon(target.parent);
      if (marklineGroup && this._gantt.parsedOptions.markLineCreateOptions?.markLineCreationHoverToolTip?.tipContent) {
        this._gantt.scenegraph.showToolTip(marklineGroup);
      }
      this._gantt.scenegraph.updateNextFrame();
    }
  }
  hideMarklineIconHover() {
    this._gantt.scenegraph.timelineHeader.hideMarklineIconHover(this._gantt.stateManager.marklineIcon.target.parent);
    this._gantt.scenegraph.hideToolTip();
    this._gantt.stateManager.marklineIcon.target = null;
    this._gantt.scenegraph.updateNextFrame();
  }

  /**
   * 更新项目任务的时间范围
   * 当子任务移动或调整大小时，需要更新父项目任务的时间范围
   * @param taskPath 任务路径
   */
  updateProjectTaskTimes(taskPath: number[]) {
    if (!taskPath || taskPath.length === 0 || !this._gantt || !this._gantt.records) {
      return;
    }

    const startDateField = this._gantt.parsedOptions.startDateField;
    const endDateField = this._gantt.parsedOptions.endDateField;

    // 从最底层的子任务开始，向上更新所有父任务
    // 先复制一份路径数组，避免修改原数组
    const pathCopy = [...taskPath];

    // 逐步向上处理每个父节点
    while (pathCopy.length > 0) {
      // 获取当前层级的父节点路径
      const parentPath = [...pathCopy];
      // 移除最后一个索引，得到父节点路径
      const childIndex = parentPath.pop();

      // 使用父节点路径获取父任务记录
      let parentRecord = this._gantt.records;
      const currentPath = [];
      for (const index of parentPath) {
        currentPath.push(index);
        if (!parentRecord[index] || !parentRecord[index].children) {
          console.warn('Invalid parent path:', currentPath);
          return; // 路径无效，直接返回
        }
        parentRecord = parentRecord[index].children;
      }

      // 如果parentPath为空，表示已经到了顶层
      const parent = parentPath.length === 0 ? this._gantt.records[childIndex] : parentRecord[childIndex];

      // 只处理project类型的父任务
      if (parent && parent.type === TaskType.PROJECT && parent.children && parent.children.length > 0) {
        let earliestStart: Date | null = null;
        let latestEnd: Date | null = null;

        // 遍历所有子任务，找出最早的开始时间和最晚的结束时间
        for (const child of parent.children) {
          if (child[startDateField] && child[endDateField]) {
            const childStartDate = new Date(child[startDateField]);
            const childEndDate = new Date(child[endDateField]);

            if (!earliestStart || childStartDate < earliestStart) {
              earliestStart = childStartDate;
            }

            if (!latestEnd || childEndDate > latestEnd) {
              latestEnd = childEndDate;
            }
          }
        }

        // 只有当有有效的时间范围时才更新父任务
        if (earliestStart && latestEnd) {
          // 获取当前父任务的时间范围
          const currentStartDate = parent[startDateField] ? new Date(parent[startDateField]) : null;
          const currentEndDate = parent[endDateField] ? new Date(parent[endDateField]) : null;

          // 检查是否需要更新（避免不必要的更新）
          const needUpdate =
            !currentStartDate ||
            !currentEndDate ||
            earliestStart.getTime() !== currentStartDate.getTime() ||
            latestEnd.getTime() !== currentEndDate.getTime();

          if (needUpdate) {
            // 获取日期格式
            const dateFormat =
              this._gantt.parsedOptions.dateFormat ??
              this._gantt.parseTimeFormat(parent[startDateField] || parent.children[0][startDateField]);

            // 格式化日期
            const formatDateValue = (date: Date) => {
              return this._gantt.formatDate
                ? this._gantt.formatDate(date, dateFormat)
                : date.toISOString().split('T')[0];
            };

            // 更新父任务的时间范围
            parent[startDateField] = formatDateValue(earliestStart);
            parent[endDateField] = formatDateValue(latestEnd);
          }
        }
      }

      // 继续向上遍历父节点
      pathCopy.pop();
    }

    // 更新UI
    this._gantt.scenegraph?.refreshAll();
  }
}

function reCreateCustomNode(gantt: Gantt, taskBarGroup: Group, taskIndex: number, sub_task_index?: number) {
  const taskBarCustomLayout = gantt.parsedOptions.taskBarCustomLayout;
  if (taskBarCustomLayout) {
    let customLayoutObj;
    if (typeof taskBarCustomLayout === 'function') {
      const { startDate, endDate, taskDays, progress, taskRecord } = gantt.getTaskInfoByTaskListIndex(
        taskIndex,
        sub_task_index
      );
      const arg = {
        width: taskBarGroup.attribute.width,
        height: taskBarGroup.attribute.height,
        index: taskIndex,
        startDate,
        endDate,
        taskDays,
        progress,
        taskRecord,
        ganttInstance: gantt
      };
      customLayoutObj = taskBarCustomLayout(arg);
    } else {
      customLayoutObj = taskBarCustomLayout;
    }
    if (customLayoutObj) {
      const rootContainer = customLayoutObj.rootContainer;
      rootContainer.name = 'task-bar-custom-render';
      const barGroup = taskBarGroup.children.find((node: any) => node.name === 'task-bar-group');
      if (barGroup) {
        const oldCustomIndex = barGroup.children.findIndex((node: any) => {
          return node.name === 'task-bar-custom-render';
        });
        const oldCustomNode = barGroup.children[oldCustomIndex] as Group;
        if (oldCustomNode) {
          barGroup.removeChild(oldCustomNode);
          barGroup.insertInto(rootContainer, oldCustomIndex);
        }
      }
    }
  }
}

function moveTaskBar(target: GanttTaskBarNode, dx: number, dy: number, state: StateManager) {
  // const taskIndex = getTaskIndexByY(state.moveTaskBar.startOffsetY, state._gantt);
  const taskIndex = target.task_index;
  const sub_task_index = target.sub_task_index;
  const record = target.record;
  const isMilestone = record.type === TaskType.MILESTONE;
  const oldX = target.attribute.x;
  const oldY = target.attribute.y;

  if (dx) {
    target.setAttribute('x', Math.max(0, target.attribute.x + dx));
  }
  if (
    state._gantt.parsedOptions.tasksShowMode !== TasksShowMode.Tasks_Separate &&
    state._gantt.parsedOptions.tasksShowMode !== TasksShowMode.Project_Sub_Tasks_Inline
  ) {
    if (dy) {
      target.setAttribute('y', target.attribute.y + dy);
    }
  } else {
    dy = 0;
  }
  if (isMilestone) {
    target.setAttribute('anchor', [
      target.attribute.x + target.attribute.width / 2,
      target.attribute.y + target.attribute.height / 2
    ]);

    if (target.milestoneTextContainer) {
      const deltaX = target.attribute.x - oldX;
      const deltaY = target.attribute.y - oldY;

      const currentX = target.milestoneTextContainer.attribute.x;
      const currentY = target.milestoneTextContainer.attribute.y;
      target.milestoneTextContainer.setAttribute('x', currentX + deltaX);
      target.milestoneTextContainer.setAttribute('y', currentY + deltaY);
    }
  }

  target.updateTextPosition();

  state._gantt.scenegraph.refreshRecordLinkNodes(taskIndex, sub_task_index, target, dy);
}

function resizeTaskBar(target: GanttTaskBarNode, dx: number, newWidth: number, state: StateManager) {
  const progressField = state._gantt.parsedOptions.progressField;
  const clipGroupBox = target.clipGroupBox;
  const rect = target.barRect;
  const progressRect = target.progressRect;
  const textLabel = target.textLabel;
  // const taskIndex = getTaskIndexByY(state.moveTaskBar.startOffsetY, state._gantt);
  const taskIndex = target.task_index;
  const sub_task_index = target.sub_task_index;
  const record = target.record;
  const progress = record[progressField];
  const isMilestone = record.type === TaskType.MILESTONE;
  target.setAttribute('zIndex', 10000);
  if (dx) {
    target.setAttribute('x', target.attribute.x + dx);
  }

  if (isMilestone) {
    target.setAttribute('anchor', [
      target.attribute.x + target.attribute.width / 2,
      target.attribute.y + target.attribute.height / 2
    ]);
  }

  if (newWidth) {
    target.setAttribute('width', newWidth);
  }
  clipGroupBox.setAttribute('width', target.attribute.width);
  rect?.setAttribute('width', target.attribute.width);
  progressRect?.setAttribute('width', (progress / 100) * target.attribute.width);
  if (textLabel) {
    const { textAlign, textBaseline, padding } = state._gantt.parsedOptions.taskBarLabelStyle;
    const position = getTextPos(toBoxArray(padding), textAlign, textBaseline, newWidth, target.attribute.height);
    textLabel.setAttribute('maxLineWidth', newWidth - TASKBAR_HOVER_ICON_WIDTH * 2);
    textLabel.setAttribute('x', position.x);
  }

  target.updateTextPosition();

  state.showTaskBarHover();

  reCreateCustomNode(state._gantt, target, taskIndex, sub_task_index);
  state._gantt.scenegraph.refreshRecordLinkNodes(taskIndex, sub_task_index, target, 0);
}
