import { clone, cloneDeep, isValid } from '@visactor/vutils';
import type { Gantt } from '../Gantt';
import type { ITaskLink } from '../ts-types';
import { InteractionState, GANTT_EVENT_TYPE, DependencyType } from '../ts-types';
import type { Group, FederatedPointerEvent, Polygon, Line, Circle } from '@visactor/vtable/es/vrender';
import {
  syncEditCellFromTable,
  syncScrollStateFromTable,
  syncScrollStateToTable,
  syncDragOrderFromTable,
  syncTreeChangeFromTable,
  syncSortFromTable
} from './gantt-table-sync';
import { findRecordByTaskKey, getTaskIndexByY } from '../gantt-helper';
import { debounce } from '../tools/debounce';
import type { GanttTaskBarNode } from '../scenegraph/gantt-node';
import { TASKBAR_HOVER_ICON_WIDTH } from '../scenegraph/task-bar';
import { Inertia } from '../tools/inertia';
import { generateLinkLinePoints, updateLinkLinePoints } from '../scenegraph/dependency-link';
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
    targetStartX: number;
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
      deltaX: 0,
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
    const totalWidth = this._gantt._getAllColsWidth();

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
    const totalWidth = this._gantt._getAllColsWidth();
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
    this.moveTaskBar.startX = x;
    this.moveTaskBar.startY = y;
    this.moveTaskBar.startOffsetY = offsetY;
  }

  isMoveingTaskBar() {
    return this.moveTaskBar.moving;
  }
  endMoveTaskBar(x: number) {
    if (this.moveTaskBar.moveTaskBarXInertia.isInertiaScrolling()) {
      this.moveTaskBar.moveTaskBarXInertia.endInertia();
    }
    const taskIndex = getTaskIndexByY(this.moveTaskBar.startOffsetY, this._gantt);
    // const deltaX = x - this.moveTaskBar.startX;
    const deltaX = this.moveTaskBar.deltaX;
    const days = Math.round(deltaX / this._gantt.parsedOptions.colWidthPerDay);

    const correctX = days * this._gantt.parsedOptions.colWidthPerDay;
    const targetEndX = this.moveTaskBar.targetStartX + correctX;
    const target = this._gantt.stateManager.moveTaskBar.target;
    // target.setAttribute('x', targetEndX);
    resizeOrMoveTaskBar(taskIndex, target, targetEndX - target.attribute.x, null, this);
    // if (target.attribute.x < this._gantt.stateManager.scrollLeft - 2) {
    //   this._gantt.stateManager.setScrollLeft(target.attribute.x);
    // }
    // if(this._gantt.stateManager.scrollLeft===0){

    // }
    if (Math.abs(days) >= 1) {
      const taskIndex = getTaskIndexByY(this.moveTaskBar.startOffsetY, this._gantt);
      const oldRecord = this._gantt.getRecordByIndex(taskIndex);
      const oldStartDate = oldRecord[this._gantt.parsedOptions.startDateField];
      const oldEndDate = oldRecord[this._gantt.parsedOptions.endDateField];
      this._gantt._updateDateToTaskRecord('move', days, taskIndex);
      if (this._gantt.hasListeners(GANTT_EVENT_TYPE.CHANGE_DATE_RANGE)) {
        const newRecord = this._gantt.getRecordByIndex(taskIndex);
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
    this._gantt.scenegraph.updateNextFrame();
    this.moveTaskBar.moving = false;
    this.moveTaskBar.target = null;
    this.moveTaskBar.deltaX = 0;
    this.moveTaskBar.moveTaskBarXSpeed = 0;
  }
  dealTaskBarMove(e: FederatedPointerEvent) {
    const target = this.moveTaskBar.target;
    const taskIndex = getTaskIndexByY(this.moveTaskBar.startOffsetY, this._gantt);
    const x1 = this._gantt.eventManager.lastDragPointerXYOnWindow.x;
    const x2 = e.x;
    const dx = x2 - x1;
    this.moveTaskBar.deltaX += dx;
    // target.setAttribute('x', target.attribute.x + dx);
    resizeOrMoveTaskBar(taskIndex, target, dx, null, this);

    // 处理向左拖拽任务条时，整体向左滚动
    if (target.attribute.x <= this._gantt.stateManager.scrollLeft && dx < 0) {
      this.moveTaskBar.moveTaskBarXSpeed = -this._gantt.parsedOptions.colWidthPerDay / 100;

      this.moveTaskBar.moveTaskBarXInertia.startInertia(this.moveTaskBar.moveTaskBarXSpeed, 0, 1);
      this.moveTaskBar.moveTaskBarXInertia.setScrollHandle((dx: number, dy: number) => {
        this.moveTaskBar.deltaX += dx;
        resizeOrMoveTaskBar(taskIndex, target, dx, null, this);

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
        resizeOrMoveTaskBar(taskIndex, target, dx, null, this);

        this._gantt.stateManager.setScrollLeft(
          target.attribute.x + target.attribute.width - this._gantt.tableNoFrameWidth
        );
        if (this._gantt.stateManager.scrollLeft === this._gantt._getAllColsWidth() - this._gantt.tableNoFrameWidth) {
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
      let diff_days = Math.round(deltaX / this._gantt.parsedOptions.colWidthPerDay);
      diff_days = direction === 'left' ? -diff_days : diff_days;

      const taskBarGroup = this._gantt.stateManager.resizeTaskBar.target;
      const rect = this._gantt.stateManager.resizeTaskBar.target.barRect;
      const progressRect = this._gantt.stateManager.resizeTaskBar.target.progressRect;
      const taskIndex = getTaskIndexByY(this.resizeTaskBar.startOffsetY, this._gantt);
      const oldRecord = this._gantt.getRecordByIndex(taskIndex);
      const oldStartDate = oldRecord[this._gantt.parsedOptions.startDateField];
      const oldEndDate = oldRecord[this._gantt.parsedOptions.endDateField];
      const { taskDays, progress } = this._gantt.getTaskInfoByTaskListIndex(taskIndex);
      if (diff_days < 0 && taskDays + diff_days <= 0) {
        diff_days = 1 - taskDays;
      }
      const correctX = (direction === 'left' ? -diff_days : diff_days) * this._gantt.parsedOptions.colWidthPerDay;
      const targetEndX = this.resizeTaskBar.targetStartX + correctX;

      const taskBarSize = this._gantt.parsedOptions.colWidthPerDay * (taskDays + diff_days);
      if (direction === 'left') {
        // taskBarGroup.setAttribute('x', targetEndX);
        // taskBarGroup.setAttribute('width', taskBarSize);
        resizeOrMoveTaskBar(taskIndex, taskBarGroup, targetEndX - taskBarGroup.attribute.x, taskBarSize, this);
        rect?.setAttribute('width', taskBarGroup.attribute.width);
        progressRect?.setAttribute('width', (progress / 100) * taskBarGroup.attribute.width);
        this._gantt._updateDateToTaskRecord('start-move', -diff_days, taskIndex);
      } else if (direction === 'right') {
        // taskBarGroup.setAttribute('width', taskBarSize);
        resizeOrMoveTaskBar(taskIndex, taskBarGroup, 0, taskBarSize, this);
        rect?.setAttribute('width', taskBarGroup.attribute.width);
        progressRect?.setAttribute('width', (progress / 100) * taskBarGroup.attribute.width);
        this._gantt._updateDateToTaskRecord('end-move', diff_days, taskIndex);
      }
      this.showTaskBarHover();
      reCreateCustomNode(this._gantt, taskBarGroup, taskIndex);
      this.resizeTaskBar.resizing = false;
      this.resizeTaskBar.target = null;

      if (Math.abs(diff_days) >= 1 && this._gantt.hasListeners(GANTT_EVENT_TYPE.CHANGE_DATE_RANGE)) {
        const newRecord = this._gantt.getRecordByIndex(taskIndex);
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
    const rect = taskBarGroup.barRect;
    const progressRect = taskBarGroup.progressRect;
    const textLabel = taskBarGroup.textLabel;

    const progressField = this._gantt.parsedOptions.progressField;
    const taskIndex = getTaskIndexByY(this.resizeTaskBar.startOffsetY, this._gantt);
    const taskRecord = this._gantt.getRecordByIndex(taskIndex);
    const progress = taskRecord[progressField];

    let diffWidth = this._gantt.stateManager.resizeTaskBar.onIconName === 'left' ? -dx : dx;
    let taskBarSize = taskBarGroup.attribute.width + diffWidth;
    if (diffWidth < 0 && taskBarSize <= this._gantt.parsedOptions.colWidthPerDay) {
      diffWidth = this._gantt.parsedOptions.colWidthPerDay - taskBarGroup.attribute.width;
      taskBarSize += diffWidth;
    }

    // taskBarGroup.setAttribute('width', taskBarSize);
    // if (this._gantt.stateManager.resizeTaskBar.onIconName === 'left') {
    //   taskBarGroup.setAttribute('x', taskBarGroup.attribute.x - diffWidth);
    // }
    resizeOrMoveTaskBar(
      taskIndex,
      taskBarGroup,
      this._gantt.stateManager.resizeTaskBar.onIconName === 'left' ? -diffWidth : 0,
      taskBarSize,
      this
    );
    rect?.setAttribute('width', taskBarGroup.attribute.width);
    progressRect?.setAttribute('width', (progress / 100) * taskBarGroup.attribute.width);

    textLabel?.setAttribute('maxLineWidth', taskBarSize - TASKBAR_HOVER_ICON_WIDTH * 2);

    this.showTaskBarHover();

    reCreateCustomNode(this._gantt, taskBarGroup, taskIndex);
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
    const fromTaskIndex = getTaskIndexByY(this.creatingDenpendencyLink.startOffsetY, this._gantt);
    const toTaskIndex = getTaskIndexByY(offsetY, this._gantt);
    const fromRecord = this._gantt.getRecordByIndex(fromTaskIndex);
    const linkedFromTaskKey = fromRecord[taskKeyField];
    const toRecord = this._gantt.getRecordByIndex(toTaskIndex);
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
    const x = target.attribute.x;
    const y = target.attribute.y;
    const width = target.attribute.width;
    const height = target.attribute.height;
    this._gantt.scenegraph.taskBar.showHoverBar(x, y, width, height, target);
    this._gantt.scenegraph.updateNextFrame();
  }
  hideTaskBarHover(e: FederatedPointerEvent) {
    this._gantt.stateManager.hoverTaskBar.target = null;
    this._gantt.scenegraph.taskBar.hideHoverBar();
    this._gantt.scenegraph.updateNextFrame();
  }

  showTaskBarSelectedBorder() {
    const linkCreatable = this._gantt.parsedOptions.dependencyLinkCreatable;
    const target = this._gantt.stateManager.selectedTaskBar.target;
    const x = target.attribute.x;
    const y = target.attribute.y;
    const width = target.attribute.width;
    const height = target.attribute.height;
    this._gantt.scenegraph.taskBar.createSelectedBorder(x, y, width, height, target, linkCreatable);
    this._gantt.scenegraph.updateNextFrame();
  }

  hideTaskBarSelectedBorder() {
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
    const linkedToTaskRecord = findRecordByTaskKey(this._gantt.records, taskKeyField, linkedToTaskKey);
    const linkedFromTaskRecord = findRecordByTaskKey(this._gantt.records, taskKeyField, linkedFromTaskKey);
    const linkedFromTaskShowIndex = this._gantt.getTaskShowIndexByRecordIndex(linkedFromTaskRecord.index);
    const linkedToTaskShowIndex = this._gantt.getTaskShowIndexByRecordIndex(linkedToTaskRecord.index);
    const fromTaskNode = this._gantt.scenegraph.taskBar.getTaskBarNodeByIndex(
      linkedFromTaskShowIndex
    ) as GanttTaskBarNode;
    this._gantt.scenegraph.taskBar.createSelectedBorder(
      fromTaskNode.attribute.x,
      fromTaskNode.attribute.y,
      fromTaskNode.attribute.width,
      fromTaskNode.attribute.height,
      fromTaskNode,
      false
    );
    const toTaskNode = this._gantt.scenegraph.taskBar.getTaskBarNodeByIndex(linkedToTaskShowIndex) as GanttTaskBarNode;
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

function reCreateCustomNode(gantt: Gantt, taskBarGroup: Group, taskIndex: number) {
  const taskBarCustomLayout = gantt.parsedOptions.taskBarCustomLayout;
  if (taskBarCustomLayout) {
    let customLayoutObj;
    if (typeof taskBarCustomLayout === 'function') {
      const { startDate, endDate, taskDays, progress, taskRecord } = gantt.getTaskInfoByTaskListIndex(taskIndex);
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
      const oldCustomIndex = taskBarGroup.children.findIndex((node: any) => {
        return node.name === 'task-bar-custom-render';
      });
      const oldCustomNode = taskBarGroup.children[oldCustomIndex] as Group;
      taskBarGroup.removeChild(oldCustomNode);
      taskBarGroup.insertInto(rootContainer, oldCustomIndex);
    }
  }
}

function resizeOrMoveTaskBar(
  taskIndex: number,
  target: GanttTaskBarNode,
  dx: number,
  newWidth: number,
  state: StateManager
) {
  // const taskIndex = getTaskIndexByY(state.moveTaskBar.startOffsetY, state._gantt);
  const record = state._gantt.getRecordByIndex(taskIndex);
  if (dx) {
    target.setAttribute('x', target.attribute.x + dx);
  }
  if (newWidth) {
    target.setAttribute('width', newWidth);
  }
  const vtable_gantt_linkedTo = record.vtable_gantt_linkedTo;
  const vtable_gantt_linkedFrom = record.vtable_gantt_linkedFrom;
  for (let i = 0; i < vtable_gantt_linkedTo?.length; i++) {
    const link = vtable_gantt_linkedTo[i];
    const linkLineNode = link.vtable_gantt_linkLineNode;
    const lineArrowNode = link.vtable_gantt_linkArrowNode;

    const { linkedToTaskKey, linkedFromTaskKey, type } = link;
    const { taskKeyField, minDate } = state._gantt.parsedOptions;
    const linkedFromTaskRecord = findRecordByTaskKey(state._gantt.records, taskKeyField, linkedFromTaskKey);

    const { startDate: linkedToTaskStartDate, endDate: linkedToTaskEndDate } =
      state._gantt.getTaskInfoByTaskListIndex(taskIndex);
    const taskShowIndex = state._gantt.getTaskShowIndexByRecordIndex(linkedFromTaskRecord.index);
    const { startDate: linkedFromTaskStartDate, endDate: linkedFromTaskEndDate } =
      state._gantt.getTaskInfoByTaskListIndex(taskShowIndex);
    const { linePoints, arrowPoints } = updateLinkLinePoints(
      type,
      linkedFromTaskStartDate,
      linkedFromTaskEndDate,
      taskShowIndex,
      linkedToTaskStartDate,
      linkedToTaskEndDate,
      taskIndex,
      minDate,
      state._gantt.parsedOptions.rowHeight,
      state._gantt.parsedOptions.colWidthPerDay,
      null,
      target
    );
    linkLineNode.setAttribute('points', linePoints);
    lineArrowNode.setAttribute('points', arrowPoints);
  }

  for (let i = 0; i < vtable_gantt_linkedFrom?.length; i++) {
    const link = vtable_gantt_linkedFrom[i];
    const linkLineNode = link.vtable_gantt_linkLineNode;
    const lineArrowNode = link.vtable_gantt_linkArrowNode;

    const { linkedToTaskKey, linkedFromTaskKey, type } = link;
    const { taskKeyField, minDate } = state._gantt.parsedOptions;
    const linkedToTaskRecord = findRecordByTaskKey(state._gantt.records, taskKeyField, linkedToTaskKey);

    const { startDate: linkedFromTaskStartDate, endDate: linkedFromTaskEndDate } =
      state._gantt.getTaskInfoByTaskListIndex(taskIndex);
    const taskShowIndex = state._gantt.getTaskShowIndexByRecordIndex(linkedToTaskRecord.index);
    const { startDate: linkedToTaskStartDate, endDate: linkedToTaskEndDate } =
      state._gantt.getTaskInfoByTaskListIndex(taskShowIndex);
    const { linePoints, arrowPoints } = updateLinkLinePoints(
      type,
      linkedFromTaskStartDate,
      linkedFromTaskEndDate,
      taskIndex,
      linkedToTaskStartDate,
      linkedToTaskEndDate,
      taskShowIndex,
      minDate,
      state._gantt.parsedOptions.rowHeight,
      state._gantt.parsedOptions.colWidthPerDay,
      target,
      null
    );

    linkLineNode.setAttribute('points', linePoints);
    lineArrowNode.setAttribute('points', arrowPoints);
  }
}
