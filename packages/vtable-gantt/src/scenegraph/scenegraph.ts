import type { Stage } from '@visactor/vtable/es/vrender';
import { container, Group, vglobal, createStage } from '@visactor/vtable/es/vrender';
import { Grid } from './grid';
import type { Gantt } from '../Gantt';
import { Env } from '../env';
import { ScrollBarComponent } from './scroll-bar';
import { bindScrollBarListener } from '../event/scroll';
import { TimelineHeader } from './timeline-header';
import { TaskBar } from './task-bar';
import { MarkLine } from './mark-line';
import { FrameBorder } from './frame-border';
import { findRecordByTaskKey, getTaskIndexByY, getTaskIndexsByTaskY } from '../gantt-helper';
import graphicContribution from './graphic';
import { TaskCreationButton } from './task-creation-button';
import { DependencyLink, updateLinkLinePoints } from './dependency-link';
import { DragOrderLine } from './drag-order-line';
import type { GanttTaskBarNode } from './gantt-node';
import { TasksShowMode } from '../ts-types';
container.load(graphicContribution);
export class Scenegraph {
  dateStepWidth: number;
  rowHeight: number;
  _scales: {}[];
  timelineHeader: TimelineHeader;
  grid: Grid;
  dependencyLink: DependencyLink;
  taskBar: TaskBar;
  _gantt: Gantt;
  ganttGroup: Group;
  scrollbarComponent: ScrollBarComponent;
  markLine: MarkLine;
  dragOrderLine: DragOrderLine;
  frameBorder: FrameBorder;
  taskCreationButton: TaskCreationButton;
  stage: Stage;
  tableGroupWidth: number;
  tableGroupHeight: number;
  constructor(gantt: Gantt) {
    this._gantt = gantt;
    this.tableGroupWidth = gantt.tableNoFrameWidth;
    this.tableGroupHeight = Math.min(gantt.tableNoFrameHeight, gantt.drawHeight);
    let width;
    let height;
    if (Env.mode === 'node') {
      // vglobal.setEnv('node', gantt.options.modeParams);
      // width = table.canvasWidth;
      // height = table.canvasHeight;
    } else {
      vglobal.setEnv('browser');
      width = gantt.canvas.width;
      height = gantt.canvas.height;
    }
    this.stage = createStage({
      canvas: gantt.canvas,
      width,
      height,
      disableDirtyBounds: false,
      background: gantt.parsedOptions.underlayBackgroundColor,
      // dpr: gantt.internalProps.pixelRatio,
      enableLayout: true,
      autoRender: false,
      context: {
        appName: 'vtable'
      },
      pluginList: ['poptipForText']
      // afterRender: () => {
      // this._gantt.fireListeners('after_render', null);
      // }
    });
    (this.stage as any).gantt = this._gantt;
    (this.stage as any).table = this._gantt; // 为了使用bindDebugTool
    this.stage.defaultLayer.setTheme({
      group: {
        boundsPadding: 0,
        strokeBoundsBuffer: 0,
        lineJoin: 'round'
      },
      text: {
        ignoreBuf: true
      }
    });
    this.initSceneGraph();
  }

  initSceneGraph() {
    const scene = this;

    scene.ganttGroup = new Group({
      x: scene._gantt.tableX,
      y: scene._gantt.tableY,
      width: this.tableGroupWidth,
      height: this.tableGroupHeight,
      clip: true,
      pickable: false
    });
    scene.stage.defaultLayer.add(scene.ganttGroup);
    scene.ganttGroup.name = 'table';
    // 初始化顶部时间线表头部分
    scene.timelineHeader = new TimelineHeader(scene);

    // 初始化网格线组件
    scene.grid = new Grid(scene);
    // 初始化任务条线组件
    scene.dependencyLink = new DependencyLink(scene);
    // 初始化任务条线组件
    scene.taskBar = new TaskBar(scene);

    // 初始化标记线组件
    scene.markLine = new MarkLine(scene);

    // 初始化边框
    scene.frameBorder = new FrameBorder(scene);

    // 初始化滚动条组件
    scene.scrollbarComponent = new ScrollBarComponent(scene._gantt);
    scene.stage.defaultLayer.addChild(scene.scrollbarComponent.hScrollBar);
    scene.stage.defaultLayer.addChild(scene.scrollbarComponent.vScrollBar);

    //初始化换位交互标记线
    scene.dragOrderLine = new DragOrderLine(scene);
  }
  updateSceneGraph() {
    const gantt = this._gantt;
    this.tableGroupWidth = gantt.tableNoFrameWidth;
    this.tableGroupHeight = Math.min(gantt.tableNoFrameHeight, gantt.drawHeight);
    let width;
    let height;
    if (Env.mode === 'node') {
    } else {
      vglobal.setEnv('browser');
      width = gantt.canvas.width;
      height = gantt.canvas.height;
    }
    this.stage.resize(width, height);
    this.refreshAll();
  }

  afterCreateSceneGraph() {
    this.scrollbarComponent.updateScrollBar();
    bindScrollBarListener(this._gantt.eventManager);
  }

  refreshAll() {
    this.tableGroupHeight = Math.min(this._gantt.tableNoFrameHeight, this._gantt.drawHeight);
    this.tableGroupWidth = this._gantt.tableNoFrameWidth;
    this.ganttGroup.setAttribute('height', this.tableGroupHeight);
    this.ganttGroup.setAttribute('width', this.tableGroupWidth);
    this.timelineHeader.refresh();
    this.grid.refresh();
    this.taskBar.refresh();
    this.dependencyLink.refresh();
    this.markLine.refresh();
    this.dependencyLink.refresh();
    this.frameBorder.refresh();
    this.scrollbarComponent.updateScrollBar();
    this.updateNextFrame();
  }

  refreshTaskBars() {
    // this.timelineHeader.refresh();
    // this.grid.refresh();
    this.dependencyLink.refresh();
    this.taskBar.refresh();
    // this.markLine.refresh();
    // this.frameBorder.refresh();
    // this.scrollbarComponent.refresh();
    this.updateNextFrame();
  }
  refreshTaskBarsAndGrid() {
    this._gantt.verticalSplitResizeLine.style.height = this._gantt.drawHeight + 'px'; //'100%';
    this.tableGroupHeight = Math.min(this._gantt.tableNoFrameHeight, this._gantt.drawHeight);
    this.ganttGroup.setAttribute('height', this.tableGroupHeight);
    // this.timelineHeader.refresh();
    this.grid.refresh();
    this.taskBar.refresh();
    this.dependencyLink.refresh();
    this.markLine.refresh();
    this.frameBorder.resize();
    this.scrollbarComponent.updateScrollBar();
    this.updateNextFrame();
  }

  updateTableSize() {
    this.tableGroupHeight = Math.min(this._gantt.tableNoFrameHeight, this._gantt.drawHeight);
    this.tableGroupWidth = this._gantt.tableNoFrameWidth;
    this.ganttGroup.setAttributes({
      x: this._gantt.tableX,
      y: this._gantt.tableY,
      width: this._gantt.tableNoFrameWidth,
      height: this.tableGroupHeight
    } as any);
    this.grid.resize();
    this.taskBar.resize();
    this.dependencyLink.resize();
    this.markLine.refresh();
    this.frameBorder.resize();
  }

  updateStageBackground() {
    this.stage.background = this._gantt.parsedOptions.underlayBackgroundColor;
    this.updateNextFrame();
  }

  /**
   * @description: 绘制场景树
   * @param {any} element
   * @param {CellRange} visibleCoord
   * @return {*}
   */
  renderSceneGraph() {
    this.stage.render();
  }

  /**
   * @description: 触发下一帧渲染
   * @return {*}
   */
  updateNextFrame() {
    this.stage.renderNextFrame();
  }
  get width(): number {
    return this.ganttGroup.attribute?.width ?? 0;
  }

  get height(): number {
    return this.ganttGroup.attribute?.height ?? 0;
  }

  get x(): number {
    return this.ganttGroup.attribute?.x ?? 0;
  }

  get y(): number {
    return this.ganttGroup.attribute?.y ?? 0;
  }

  /**
   * @description: 设置表格的x位置，滚动中使用
   * @param {number} x
   * @return {*}
   */
  setX(x: number, isEnd = false) {
    this.timelineHeader.setX(x);
    this.grid.setX(x);
    this.taskBar.setX(x);
    this.dependencyLink.setX(x);
    this.markLine.setX(x);
    this.updateNextFrame();
    // this._gantt.scenegraph.proxy.setX(-x, isEnd);
  }

  /**
   * @description: 更新表格的y位置，滚动中使用
   * @param {number} y
   * @return {*}
   */
  setY(y: number, isEnd = false) {
    // this._gantt.scenegraph.proxy.setY(-y, isEnd);
    this.grid.setY(y);
    this.taskBar.setY(y);
    this.dependencyLink.setY(y);
    this.updateNextFrame();
  }

  setPixelRatio(pixelRatio: number) {
    // this.stage.setDpr(pixelRatio);
    // 这里因为本时刻部分节点有更新bounds标记，直接render回导致开启DirtyBounds，无法完整重绘画布；
    // 所以这里先关闭DirtyBounds，等待下一帧再开启
    this.stage.disableDirtyBounds();
    this.stage.window.setDpr(pixelRatio);
    this.stage.render();
    this.stage.enableDirtyBounds();
  }

  resize() {
    this.updateTableSize();
    // this.updateBorderSizeAndPosition();
    this.scrollbarComponent.updateScrollBar();
    this.updateNextFrame();
  }
  release() {
    this.stage.release();
  }

  showTaskCreationButton(x: number, y: number, dateIndex: number) {
    if (!this.taskCreationButton) {
      this.taskCreationButton = new TaskCreationButton(this._gantt.scenegraph);
    }
    //根据最大最小宽度计算按钮的宽度
    const createButton_max_width = this._gantt.parsedOptions.taskBarCreationMaxWidth;
    const createButton_min_width = this._gantt.parsedOptions.taskBarCreationMinWidth;
    const col_width = this._gantt.getDateColWidth(dateIndex);
    const button_width = createButton_max_width
      ? Math.min(
          createButton_max_width,
          createButton_min_width ? Math.max(createButton_min_width, col_width) : col_width
        )
      : createButton_min_width
      ? Math.max(createButton_min_width, col_width)
      : col_width;
    // 调整x，使按钮居中
    const button_x = x - (button_width - col_width) / 2;
    this.taskCreationButton.show(button_x, y, button_width, this._gantt.parsedOptions.rowHeight);
    this.updateNextFrame();
  }

  hideTaskCreationButton() {
    if (this.taskCreationButton) {
      this.taskCreationButton.hide();
      this.updateNextFrame();
    }
  }
  refreshRecordLinkNodes(taskIndex: number, sub_task_index: number, target: GanttTaskBarNode, dy: number = 0) {
    const gantt: Gantt = this._gantt;
    const record = gantt.getRecordByIndex(taskIndex, sub_task_index);
    const vtable_gantt_linkedTo = record.vtable_gantt_linkedTo;
    const vtable_gantt_linkedFrom = record.vtable_gantt_linkedFrom;
    for (let i = 0; i < vtable_gantt_linkedTo?.length; i++) {
      const link = vtable_gantt_linkedTo[i];
      const linkLineNode = link.vtable_gantt_linkLineNode;
      const lineArrowNode = link.vtable_gantt_linkArrowNode;

      const { linkedToTaskKey, linkedFromTaskKey, type } = link;
      const { taskKeyField, minDate } = gantt.parsedOptions;
      const linkedFromTaskRecord = findRecordByTaskKey(gantt.records, taskKeyField, linkedFromTaskKey);
      const linkedToTaskRecord = findRecordByTaskKey(gantt.records, taskKeyField, linkedToTaskKey);
      // const { startDate: linkedToTaskStartDate, endDate: linkedToTaskEndDate } =
      //   gantt.getTaskInfoByTaskListIndex(taskIndex);
      // const taskShowIndex = gantt.getTaskShowIndexByRecordIndex(linkedFromTaskRecord.index);
      // const { startDate: linkedFromTaskStartDate, endDate: linkedFromTaskEndDate } =
      //   gantt.getTaskInfoByTaskListIndex(taskShowIndex);

      let linkedToTaskStartDate;
      let linkedToTaskEndDate;
      let linkedToTaskTaskDays;
      // let linkedToTaskTaskRecord;
      let linkedFromTaskStartDate;
      let linkedFromTaskEndDate;
      let linkedFromTaskTaskDays;
      // let linkedFromTaskTaskRecord;

      let linkedToTaskShowIndex;
      let linkedFromTaskShowIndex;
      let diffY: number;
      const taskBarStyle = this._gantt.getTaskBarStyle(taskIndex, sub_task_index);
      if (gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline) {
        const new_indexs = getTaskIndexsByTaskY(target.attribute.y + dy, gantt);
        linkedFromTaskShowIndex = linkedFromTaskRecord.index[0];
        // linkedToTaskShowIndex = linkedToTaskRecord.index[0];
        const beforeRowCountLinkedTo =
          gantt.getRowsHeightByIndex(0, new_indexs.task_index - 1) / gantt.parsedOptions.rowHeight; // 耦合了listTableOption的customComputeRowHeight
        linkedToTaskShowIndex = beforeRowCountLinkedTo;
        ({
          startDate: linkedToTaskStartDate,
          endDate: linkedToTaskEndDate,
          taskDays: linkedToTaskTaskDays
        } = gantt.getTaskInfoByTaskListIndex(linkedToTaskRecord.index[0], linkedToTaskRecord.index[1]));
        ({
          startDate: linkedFromTaskStartDate,
          endDate: linkedFromTaskEndDate,
          taskDays: linkedFromTaskTaskDays
        } = gantt.getTaskInfoByTaskListIndex(linkedFromTaskRecord.index[0], linkedFromTaskRecord.index[1]));

        const taskbarHeight = taskBarStyle.width;
        diffY = target.attribute.y + taskbarHeight / 2 - (linkedToTaskShowIndex + 0.5) * gantt.parsedOptions.rowHeight;
      } else if (
        gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate ||
        gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange ||
        gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact
      ) {
        const new_indexs = getTaskIndexsByTaskY(target.attribute.y + dy, gantt);
        const beforeRowCountLinkedFrom =
          gantt.getRowsHeightByIndex(0, linkedFromTaskRecord.index[0] - 1) / gantt.parsedOptions.rowHeight; // 耦合了listTableOption的customComputeRowHeight
        linkedFromTaskShowIndex =
          beforeRowCountLinkedFrom +
          (gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange ||
          gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact
            ? linkedFromTaskRecord.record.vtable_gantt_showIndex
            : linkedFromTaskRecord.index[1]);
        // const beforeRowCountLinkedTo =
        //   gantt.getRowsHeightByIndex(0, linkedToTaskRecord.index[0] - 1) / gantt.parsedOptions.rowHeight; // 耦合了listTableOption的customComputeRowHeight
        // linkedToTaskShowIndex = beforeRowCountLinkedTo + linkedToTaskRecord.index[1];
        const beforeRowCountLinkedTo =
          gantt.getRowsHeightByIndex(0, new_indexs.task_index - 1) / gantt.parsedOptions.rowHeight; // 耦合了listTableOption的customComputeRowHeight
        linkedToTaskShowIndex =
          beforeRowCountLinkedTo +
          (gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange ||
          gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact
            ? linkedToTaskRecord.record.vtable_gantt_showIndex
            : new_indexs.sub_task_index);

        ({
          startDate: linkedToTaskStartDate,
          endDate: linkedToTaskEndDate,
          taskDays: linkedToTaskTaskDays
        } = gantt.getTaskInfoByTaskListIndex(linkedToTaskRecord.index[0], linkedToTaskRecord.index[1]));
        ({
          startDate: linkedFromTaskStartDate,
          endDate: linkedFromTaskEndDate,
          taskDays: linkedFromTaskTaskDays
        } = gantt.getTaskInfoByTaskListIndex(linkedFromTaskRecord.index[0], linkedFromTaskRecord.index[1]));

        const taskbarHeight = taskBarStyle.width;
        diffY = target.attribute.y + taskbarHeight / 2 - (linkedToTaskShowIndex + 0.5) * gantt.parsedOptions.rowHeight;
      } else {
        linkedFromTaskShowIndex = gantt.getTaskShowIndexByRecordIndex(linkedFromTaskRecord.index);
        linkedToTaskShowIndex = gantt.getTaskShowIndexByRecordIndex(linkedToTaskRecord.index);
        if (linkedFromTaskShowIndex === -1 || linkedToTaskShowIndex === -1) {
          continue;
        }
        ({
          startDate: linkedToTaskStartDate,
          endDate: linkedToTaskEndDate,
          taskDays: linkedToTaskTaskDays
        } = gantt.getTaskInfoByTaskListIndex(linkedToTaskShowIndex));
        ({
          startDate: linkedFromTaskStartDate,
          endDate: linkedFromTaskEndDate,
          taskDays: linkedFromTaskTaskDays
        } = gantt.getTaskInfoByTaskListIndex(linkedFromTaskShowIndex));
      }
      if (
        !linkedFromTaskStartDate ||
        !linkedFromTaskEndDate ||
        !linkedToTaskStartDate ||
        !linkedToTaskEndDate ||
        !linkLineNode ||
        !lineArrowNode
      ) {
        return;
      }
      const { linePoints, arrowPoints } = updateLinkLinePoints(
        type,
        linkedFromTaskStartDate,
        linkedFromTaskEndDate,
        linkedFromTaskShowIndex,
        linkedFromTaskTaskDays,
        linkedFromTaskRecord.record.type === 'milestone',
        null,
        0,
        linkedToTaskStartDate,
        linkedToTaskEndDate,
        linkedToTaskShowIndex,
        linkedToTaskTaskDays,
        linkedToTaskRecord.record.type === 'milestone',
        target,
        diffY ?? 0,
        this._gantt
      );
      linkLineNode.setAttribute('points', linePoints);
      lineArrowNode.setAttribute('points', arrowPoints);
    }

    for (let i = 0; i < vtable_gantt_linkedFrom?.length; i++) {
      const link = vtable_gantt_linkedFrom[i];
      const linkLineNode = link.vtable_gantt_linkLineNode;
      const lineArrowNode = link.vtable_gantt_linkArrowNode;

      const { linkedToTaskKey, linkedFromTaskKey, type } = link;
      const { taskKeyField, minDate } = gantt.parsedOptions;
      const linkedToTaskRecord = findRecordByTaskKey(gantt.records, taskKeyField, linkedToTaskKey);
      const linkedFromTaskRecord = findRecordByTaskKey(gantt.records, taskKeyField, linkedFromTaskKey);
      // const { startDate: linkedFromTaskStartDate, endDate: linkedFromTaskEndDate } =
      //   gantt.getTaskInfoByTaskListIndex(taskIndex);
      // const taskShowIndex = gantt.getTaskShowIndexByRecordIndex(linkedToTaskRecord.index);
      // const { startDate: linkedToTaskStartDate, endDate: linkedToTaskEndDate } =
      //   gantt.getTaskInfoByTaskListIndex(taskShowIndex);

      let linkedToTaskStartDate;
      let linkedToTaskEndDate;
      let linkedToTaskTaskDays;
      let linkedFromTaskStartDate;
      let linkedFromTaskEndDate;
      let linkedFromTaskTaskDays;

      let linkedToTaskShowIndex;
      let linkedFromTaskShowIndex;
      let diffY: number;
      const taskBarStyle = this._gantt.getTaskBarStyle(taskIndex, sub_task_index);
      if (gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline) {
        const new_indexs = getTaskIndexsByTaskY(target.attribute.y + dy, gantt);
        const beforeRowCountLinkedFrom =
          gantt.getRowsHeightByIndex(0, new_indexs.task_index - 1) / gantt.parsedOptions.rowHeight; // 耦合了listTableOption的customComputeRowHeight
        linkedFromTaskShowIndex = beforeRowCountLinkedFrom;

        // linkedFromTaskShowIndex = linkedFromTaskRecord.index[0];
        linkedToTaskShowIndex = linkedToTaskRecord.index[0];
        ({
          startDate: linkedToTaskStartDate,
          endDate: linkedToTaskEndDate,
          taskDays: linkedToTaskTaskDays
        } = gantt.getTaskInfoByTaskListIndex(linkedToTaskRecord.index[0], linkedToTaskRecord.index[1]));
        ({
          startDate: linkedFromTaskStartDate,
          endDate: linkedFromTaskEndDate,
          taskDays: linkedFromTaskTaskDays
        } = gantt.getTaskInfoByTaskListIndex(linkedFromTaskRecord.index[0], linkedFromTaskRecord.index[1]));
        const taskbarHeight = taskBarStyle.width;
        diffY =
          target.attribute.y + taskbarHeight / 2 - (linkedFromTaskShowIndex + 0.5) * gantt.parsedOptions.rowHeight;
      } else if (
        gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate ||
        gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange ||
        gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact
      ) {
        const new_indexs = getTaskIndexsByTaskY(target.attribute.y + dy, gantt);
        // const beforeRowCountLinkedFrom =
        //   gantt.getRowsHeightByIndex(0, linkedFromTaskRecord.index[0] - 1) / gantt.parsedOptions.rowHeight; // 耦合了listTableOption的customComputeRowHeight
        // linkedFromTaskShowIndex = beforeRowCountLinkedFrom + linkedFromTaskRecord.index[1];
        const beforeRowCountLinkedFrom =
          gantt.getRowsHeightByIndex(0, new_indexs.task_index - 1) / gantt.parsedOptions.rowHeight; // 耦合了listTableOption的customComputeRowHeight
        linkedFromTaskShowIndex =
          beforeRowCountLinkedFrom +
          (gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange ||
          gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact
            ? linkedFromTaskRecord.record.vtable_gantt_showIndex
            : new_indexs.sub_task_index);

        const beforeRowCountLinkedTo =
          gantt.getRowsHeightByIndex(0, linkedToTaskRecord.index[0] - 1) / gantt.parsedOptions.rowHeight; // 耦合了listTableOption的customComputeRowHeight
        linkedToTaskShowIndex =
          beforeRowCountLinkedTo +
          (gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange ||
          gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact
            ? linkedToTaskRecord.record.vtable_gantt_showIndex
            : linkedToTaskRecord.index[1]);
        ({
          startDate: linkedToTaskStartDate,
          endDate: linkedToTaskEndDate,
          taskDays: linkedToTaskTaskDays
        } = gantt.getTaskInfoByTaskListIndex(linkedToTaskRecord.index[0], linkedToTaskRecord.index[1]));
        ({
          startDate: linkedFromTaskStartDate,
          endDate: linkedFromTaskEndDate,
          taskDays: linkedFromTaskTaskDays
        } = gantt.getTaskInfoByTaskListIndex(linkedFromTaskRecord.index[0], linkedFromTaskRecord.index[1]));
        const taskbarHeight = taskBarStyle.width;
        diffY =
          target.attribute.y + taskbarHeight / 2 - (linkedFromTaskShowIndex + 0.5) * gantt.parsedOptions.rowHeight;
      } else {
        linkedFromTaskShowIndex = gantt.getTaskShowIndexByRecordIndex(linkedFromTaskRecord.index);
        linkedToTaskShowIndex = gantt.getTaskShowIndexByRecordIndex(linkedToTaskRecord.index);
        if (linkedFromTaskShowIndex === -1 || linkedToTaskShowIndex === -1) {
          continue;
        }
        ({
          startDate: linkedToTaskStartDate,
          endDate: linkedToTaskEndDate,
          taskDays: linkedToTaskTaskDays
        } = gantt.getTaskInfoByTaskListIndex(linkedToTaskShowIndex));
        ({
          startDate: linkedFromTaskStartDate,
          endDate: linkedFromTaskEndDate,
          taskDays: linkedFromTaskTaskDays
        } = gantt.getTaskInfoByTaskListIndex(linkedFromTaskShowIndex));
      }
      if (
        !linkedFromTaskStartDate ||
        !linkedFromTaskEndDate ||
        !linkedToTaskStartDate ||
        !linkedToTaskEndDate ||
        !linkLineNode ||
        !lineArrowNode
      ) {
        return;
      }
      const { linePoints, arrowPoints } = updateLinkLinePoints(
        type,
        linkedFromTaskStartDate,
        linkedFromTaskEndDate,
        linkedFromTaskShowIndex,
        linkedFromTaskTaskDays,
        linkedFromTaskRecord.record.type === 'milestone',
        target,
        diffY ?? 0,
        linkedToTaskStartDate,
        linkedToTaskEndDate,
        linkedToTaskShowIndex,
        linkedToTaskTaskDays,
        linkedToTaskRecord.record.type === 'milestone',
        null,
        0,
        this._gantt
      );
      linkLineNode.setAttribute('points', linePoints);
      lineArrowNode.setAttribute('points', arrowPoints);
    }
  }
}
