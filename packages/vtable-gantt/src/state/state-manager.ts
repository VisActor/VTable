import { clone, cloneDeep, isValid } from '@visactor/vutils';
import type { Gantt } from '../Gantt';
import type { ITaskLink } from '../ts-types';
import { InteractionState, GANTT_EVENT_TYPE, DependencyType, TasksShowMode } from '../ts-types';
import type { Group, FederatedPointerEvent, Polygon, Line, Circle } from '@visactor/vtable/es/vrender';
import {
  syncEditCellFromTable,
  syncScrollStateFromTable,
  syncScrollStateToTable,
  syncDragOrderFromTable,
  syncTreeChangeFromTable,
  syncSortFromTable
} from './gantt-table-sync';
import { clearRecordShowIndex, findRecordByTaskKey, getDateIndexByX, getTaskIndexsByTaskY } from '../gantt-helper';
import { debounce } from '../tools/debounce';
import type { GanttTaskBarNode } from '../scenegraph/gantt-node';
import { TASKBAR_HOVER_ICON_WIDTH } from '../scenegraph/task-bar';
import { Inertia } from '../tools/inertia';
import { createDateAtMidnight } from '../tools/util';
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
  selectedTaskBar: {
    target: GanttTaskBarNode;
  };
  resizeTableWidth: {
    /** x坐标是相对table内坐标 */
    lastX: number;
    resizing: boolean;
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
      secondTaskBarNode: null
    };

    this.updateVerticalScrollBar = this.updateVerticalScrollBar.bind(this);
    this.updateHorizontalScrollBar = this.updateHorizontalScrollBar.bind(this);

    syncScrollStateFromTable(this._gantt);
    syncEditCellFromTable(this._gantt);
    syncDragOrderFromTable(this._gantt);
    syncTreeChangeFromTable(this._gantt);
    syncSortFromTable(this._gantt);
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
      const taskIndex = target.task_index;
      const sub_task_index = target.sub_task_index;
      const oldRecord = this._gantt.getRecordByIndex(taskIndex, sub_task_index);
      const oldStartDate = oldRecord[this._gantt.parsedOptions.startDateField];
      const oldEndDate = oldRecord[this._gantt.parsedOptions.endDateField];
      // const days =
      //   Math.round(deltaX / this._gantt.parsedOptions.timelineColWidth) * this._gantt.getMinScaleUnitToDays();

      // const correctX = days * this._gantt.parsedOptions.colWidthPerDay;
      // const targetEndX = this.moveTaskBar.targetStartX + correctX;
      const targetEndY =
        this.moveTaskBar.targetStartY +
        this._gantt.parsedOptions.rowHeight * Math.round(deltaY / this._gantt.parsedOptions.rowHeight);

      const startDateColIndex = getDateIndexByX(
        this.moveTaskBar.target.attribute.x - this._gantt.stateManager.scroll.horizontalBarPos,
        this._gantt
      );
      const timelineStartDate =
        this._gantt.parsedOptions.reverseSortedTimelineScales[0].timelineDates[startDateColIndex];
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
          const newX = startDateColIndex >= 1 ? this._gantt.getDateColsWidth(0, startDateColIndex - 1) : 0;
          resizeOrMoveTaskBar(
            target,
            newX - (target as Group).attribute.x,
            targetEndY - (target as Group).attribute.y,
            null,
            this
          );

          // 为了确保拖拽后 保持startDate日期晚的显示在上层不被盖住 这里需要重新排序一下
          if (dateChanged === 'right') {
            let insertAfterNode = target;
            while (
              (insertAfterNode as Group).nextSibling &&
              (insertAfterNode as Group).nextSibling.attribute.y === (target as Group).attribute.y &&
              (insertAfterNode as Group).nextSibling.record[this._gantt.parsedOptions.startDateField] <=
                target.record[this._gantt.parsedOptions.startDateField]
            ) {
              insertAfterNode = (insertAfterNode as Group).nextSibling;
            }
            if (insertAfterNode !== target) {
              (insertAfterNode as Group).parent.insertAfter(target, insertAfterNode);
            }
          } else if (dateChanged === 'left') {
            let insertBeforeNode = target;
            while (
              (insertBeforeNode as Group).previousSibling &&
              (insertBeforeNode as Group).previousSibling.attribute.y === (target as Group).attribute.y &&
              (insertBeforeNode as Group).previousSibling.record[this._gantt.parsedOptions.startDateField] >=
                target.record[this._gantt.parsedOptions.startDateField]
            ) {
              insertBeforeNode = (insertBeforeNode as Group).previousSibling;
            }
            if (insertBeforeNode !== target) {
              (insertBeforeNode as Group).parent.insertBefore(target, insertBeforeNode);
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
    this.moveTaskBar.target = null;
    this.moveTaskBar.deltaX = 0;
    this.moveTaskBar.deltaY = 0;
    this.moveTaskBar.moveTaskBarXSpeed = 0;
  }
  dealTaskBarMove(e: FederatedPointerEvent) {
    const target = this.moveTaskBar.target;
    target.setAttribute('zIndex', 10000);
    // const taskIndex = getTaskIndexByY(this.moveTaskBar.startOffsetY, this._gantt);
    const x1 = this._gantt.eventManager.lastDragPointerXYOnWindow.x;
    const x2 = e.x;
    const dx = x2 - x1;
    const y1 = this._gantt.eventManager.lastDragPointerXYOnWindow.y;
    const y2 = e.y;
    const dy = y2 - y1;

    this.moveTaskBar.deltaX += dx;
    this.moveTaskBar.deltaY += dy;
    // target.setAttribute('x', target.attribute.x + dx);
    resizeOrMoveTaskBar(target, dx, dy, null, this);

    // 处理向左拖拽任务条时，整体向左滚动
    if (target.attribute.x <= this._gantt.stateManager.scrollLeft && dx < 0) {
      this.moveTaskBar.moveTaskBarXSpeed = -this._gantt.parsedOptions.colWidthPerDay / 100;

      this.moveTaskBar.moveTaskBarXInertia.startInertia(this.moveTaskBar.moveTaskBarXSpeed, 0, 1);
      this.moveTaskBar.moveTaskBarXInertia.setScrollHandle((dx: number, dy: number) => {
        this.moveTaskBar.deltaX += dx;
        this.moveTaskBar.deltaY += dy;
        resizeOrMoveTaskBar(target, dx, dy, null, this);

        this._gantt.stateManager.setScrollLeft(target.attribute.x);
        if (this._gantt.stateManager.scrollLeft === 0) {
          this.moveTaskBar.moveTaskBarXInertia.endInertia();
        }
      });
    } else if (
      target.attribute.x + target.attribute.width >=
        this._gantt.stateManager.scrollLeft + this._gantt.tableNoFrameWidth &&
      dx > 0
    ) {
      // 处理向右拖拽任务条时，整体向右滚动
      this.moveTaskBar.moveTaskBarXSpeed = this._gantt.parsedOptions.colWidthPerDay / 100;

      this.moveTaskBar.moveTaskBarXInertia.startInertia(this.moveTaskBar.moveTaskBarXSpeed, 0, 1);
      this.moveTaskBar.moveTaskBarXInertia.setScrollHandle((dx: number, dy: number) => {
        this.moveTaskBar.deltaX += dx;
        this.moveTaskBar.deltaY += dy;
        resizeOrMoveTaskBar(target, dx, dy, null, this);

        this._gantt.stateManager.setScrollLeft(
          target.attribute.x + target.attribute.width - this._gantt.tableNoFrameWidth
        );
        if (this._gantt.stateManager.scrollLeft === this._gantt.getAllDateColsWidth() - this._gantt.tableNoFrameWidth) {
          this.moveTaskBar.moveTaskBarXInertia.endInertia();
        }
      });
    } else if (this.moveTaskBar.moveTaskBarXInertia.isInertiaScrolling()) {
      this.moveTaskBar.moveTaskBarXInertia.endInertia();
    } else {
      this.moveTaskBar.moveTaskBarXSpeed = 0;
    }

    this._gantt.scenegraph.updateNextFrame();

    //
  }
  //#region 调整拖拽任务条的大小
  startResizeTaskBar(target: Group, x: number, y: number, startOffsetY: number, onIconName: string) {
    // if (target.name === 'task-bar-hover-shadow') {
    // target = target.parent.parent;
    // }
    this.resizeTaskBar.onIconName = onIconName;
    this.resizeTaskBar.resizing = true;
    this.resizeTaskBar.target = target;
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
      const targetDate = direction === 'left' ? timelineDate.startDate : timelineDate.endDate;
      // diff_days = direction === 'left' ? -diff_days : diff_days;

      const taskBarGroup = this.resizeTaskBar.target;
      const clipGroupBox = taskBarGroup.clipGroupBox;
      const rect = this.resizeTaskBar.target.barRect;
      const progressRect = this.resizeTaskBar.target.progressRect;
      // const taskIndex = getTaskIndexByY(this.resizeTaskBar.startOffsetY, this._gantt);
      const taskIndex = this.resizeTaskBar.target.task_index;
      const sub_task_index = this.resizeTaskBar.target.sub_task_index;
      const oldRecord = this._gantt.getRecordByIndex(taskIndex, sub_task_index);
      const oldStartDate = oldRecord[this._gantt.parsedOptions.startDateField];
      const oldEndDate = oldRecord[this._gantt.parsedOptions.endDateField];
      const { taskDays, progress } = this._gantt.getTaskInfoByTaskListIndex(taskIndex, sub_task_index);
      // if (diff_days < 0 && taskDays + diff_days <= 0) {
      //   diff_days = 1 - taskDays;
      // }
      // this._gantt._updateDateToTaskRecord(
      //   direction === 'left' ? 'start-move' : 'end-move',
      //   direction === 'left' ? -diff_days : diff_days,
      //   taskIndex,
      //   sub_task_index
      // );
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
        // const correctX = (direction === 'left' ? -diff_days : diff_days) * this._gantt.parsedOptions.colWidthPerDay;
        // const targetEndX = this.resizeTaskBar.targetStartX + correctX;

        // const taskBarSize = this._gantt.parsedOptions.colWidthPerDay * (taskDays + diff_days);
        // if (direction === 'left') {
        //   resizeOrMoveTaskBar(taskBarGroup, targetEndX - taskBarGroup.attribute.x, 0, taskBarSize, this);
        //   clipGroupBox.setAttribute('width', taskBarGroup.attribute.width);
        //   rect?.setAttribute('width', taskBarGroup.attribute.width);
        //   progressRect?.setAttribute('width', (progress / 100) * taskBarGroup.attribute.width);
        // } else if (direction === 'right') {
        //   resizeOrMoveTaskBar(taskBarGroup, 0, 0, taskBarSize, this);
        //   clipGroupBox.setAttribute('width', taskBarGroup.attribute.width);
        //   rect?.setAttribute('width', taskBarGroup.attribute.width);
        //   progressRect?.setAttribute('width', (progress / 100) * taskBarGroup.attribute.width);
        // }
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
        this._gantt.scenegraph.refreshRecordLinkNodes(taskIndex, sub_task_index, taskBarGroup, 0); //更新关联线
        this.showTaskBarHover();
        reCreateCustomNode(this._gantt, taskBarGroup, taskIndex, sub_task_index);
        taskBarGroup.setAttribute('zIndex', 0);
      }
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
    taskBarGroup.setAttribute('zIndex', 10000);
    const clipGroupBox = taskBarGroup.clipGroupBox;
    const rect = taskBarGroup.barRect;
    const progressRect = taskBarGroup.progressRect;
    const textLabel = taskBarGroup.textLabel;

    const progressField = this._gantt.parsedOptions.progressField;
    // const taskIndex = getTaskIndexByY(this.resizeTaskBar.startOffsetY, this._gantt);
    const taskIndex = taskBarGroup.task_index;
    const sub_task_index = taskBarGroup.sub_task_index;
    const taskRecord = this._gantt.getRecordByIndex(taskIndex, sub_task_index);
    const progress = taskRecord[progressField];

    let diffWidth = this._gantt.stateManager.resizeTaskBar.onIconName === 'left' ? -dx : dx;
    let taskBarSize = taskBarGroup.attribute.width + diffWidth;
    if (diffWidth < 0 && taskBarSize <= this._gantt.parsedOptions.timelineColWidth) {
      diffWidth = this._gantt.parsedOptions.timelineColWidth - taskBarGroup.attribute.width;
      taskBarSize += diffWidth;
    }
    // taskBarGroup.setAttribute('width', taskBarSize);
    // if (this._gantt.stateManager.resizeTaskBar.onIconName === 'left') {
    //   taskBarGroup.setAttribute('x', taskBarGroup.attribute.x - diffWidth);
    // }
    resizeOrMoveTaskBar(
      taskBarGroup,
      this._gantt.stateManager.resizeTaskBar.onIconName === 'left' ? -diffWidth : 0,
      0,
      taskBarSize,
      this
    );
    clipGroupBox.setAttribute('width', taskBarGroup.attribute.width);
    rect?.setAttribute('width', taskBarGroup.attribute.width);
    progressRect?.setAttribute('width', (progress / 100) * taskBarGroup.attribute.width);

    textLabel?.setAttribute('maxLineWidth', taskBarSize - TASKBAR_HOVER_ICON_WIDTH * 2);

    this.showTaskBarHover();

    reCreateCustomNode(this._gantt, taskBarGroup, taskIndex, sub_task_index);
    this._gantt.scenegraph.updateNextFrame();
    //
  }
  //#endregion
  //#region 生成关联线的交互处理
  startCreateDependencyLine(target: Group, x: number, y: number, startOffsetY: number, position: 'left' | 'right') {
    // if (target.name === 'task-bar-hover-shadow') {
    // target = target.parent.parent;
    // }
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
  }

  dealResizeTableWidth(e: MouseEvent) {
    if (!this.resizeTableWidth.resizing) {
      return;
    }
    const deltaX = e.pageX - this.resizeTableWidth.lastX;
    if (Math.abs(deltaX) >= 1) {
      const startWidth = this._gantt.taskTableWidth;
      let width = startWidth + deltaX;
      const maxWidth = Math.min(
        this._gantt.taskListTableInstance.getAllColsWidth() + this._gantt.parsedOptions.outerFrameStyle.borderLineWidth,
        this._gantt.options.taskListTable.maxTableWidth ?? 100000
      );
      const minWidth = Math.max(
        this._gantt.parsedOptions.outerFrameStyle.borderLineWidth,
        this._gantt.options.taskListTable.minTableWidth ?? 0
      );
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

function resizeOrMoveTaskBar(target: GanttTaskBarNode, dx: number, dy: number, newWidth: number, state: StateManager) {
  // const taskIndex = getTaskIndexByY(state.moveTaskBar.startOffsetY, state._gantt);
  const taskIndex = target.task_index;
  const sub_task_index = target.sub_task_index;
  if (dx) {
    target.setAttribute('x', target.attribute.x + dx);
  }
  if (state._gantt.parsedOptions.tasksShowMode !== TasksShowMode.Tasks_Separate) {
    if (dy) {
      target.setAttribute('y', target.attribute.y + dy);
    }
  } else {
    dy = 0;
  }
  if (newWidth) {
    target.setAttribute('width', newWidth);
  }

  state._gantt.scenegraph.refreshRecordLinkNodes(taskIndex, sub_task_index, target, dy);
}
