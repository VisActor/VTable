import { Group, createText, createRect, Image, Circle, Line, Polygon } from '@visactor/vtable/es/vrender';
import type { Scenegraph } from './scenegraph';
// import { Icon } from './icon';
import { computeCountToTimeScale, parseStringTemplate, toBoxArray } from '../tools/util';
import { isValid } from '@visactor/vutils';
import { defaultTaskBarStyle, getTextPos } from '../gantt-helper';
import { GanttTaskBarNode } from './gantt-node';
import { TasksShowMode, TaskType } from '../ts-types';

const TASKBAR_HOVER_ICON = `<svg width="100" height="200" xmlns="http://www.w3.org/2000/svg">
  <line x1="30" y1="10" x2="30" y2="190" stroke="black" stroke-width="4"/>
  <line x1="70" y1="10" x2="70" y2="190" stroke="black" stroke-width="4"/>
</svg>`;
export const TASKBAR_HOVER_ICON_WIDTH = 10;

export class TaskBar {
  formatMilestoneText(text: string, record: any): string {
    if (!text) {
      return '';
    }
    const fieldPattern = /{([^}]+)}/g;
    const matches = text.match(fieldPattern);

    if (matches) {
      matches.forEach(match => {
        const fieldName = match.substring(1, match.length - 1);
        const fieldValue = record[fieldName];
        if (fieldValue !== undefined) {
          text = text.replace(match, String(fieldValue));
        }
      });
    }
    return text;
  }

  calculateMilestoneTextPosition(
    position: string,
    milestoneWidth: number,
    padding: number | number[] = 4
  ): {
    textX: number;
    textY: number;
    textAlignValue: CanvasTextAlign;
    textBaselineValue: CanvasTextBaseline;
  } {
    const paddingVal = typeof padding === 'number' ? padding : 4;
    let textX = 0;
    let textY = 0;
    let textAlignValue: CanvasTextAlign = 'left';
    let textBaselineValue: CanvasTextBaseline = 'middle';

    // 将文本位置改为以中心点为基准
    const center = milestoneWidth / 2;

    switch (position) {
      case 'left':
        textX = -paddingVal;
        textY = center;
        textAlignValue = 'end';
        textBaselineValue = 'middle';
        break;
      case 'right':
        textX = milestoneWidth + paddingVal;
        textY = center;
        textAlignValue = 'start';
        textBaselineValue = 'middle';
        break;
      case 'top':
        textX = center;
        textY = -paddingVal;
        textAlignValue = 'center';
        textBaselineValue = 'bottom';
        break;
      case 'bottom':
        textX = center;
        textY = milestoneWidth + paddingVal;
        textAlignValue = 'center';
        textBaselineValue = 'top';
        break;
      default:
        textX = milestoneWidth + paddingVal;
        textY = center;
        textAlignValue = 'start';
        textBaselineValue = 'middle';
    }

    return {
      textX,
      textY,
      textAlignValue,
      textBaselineValue
    };
  }
  group: Group;
  barContainer: Group;
  hoverBarGroup: Group;
  creatingDependencyLine: Line;
  hoverBarLeftIcon: Image;
  hoverBarRightIcon: Image;
  hoverBarProgressHandle: Group;
  _scene: Scenegraph;
  width: number;
  height: number;
  selectedBorders: Group[] = [];
  constructor(scene: Scenegraph) {
    this._scene = scene;
    // const height = Math.min(scene._gantt.tableNoFrameHeight, scene._gantt.drawHeight);
    this.width = scene._gantt.tableNoFrameWidth;
    this.height = scene._gantt.gridHeight;
    this.group = new Group({
      x: 0,
      y: scene._gantt.getAllHeaderRowsHeight(),
      width: this.width,
      height: this.height,
      pickable: false,
      clip: true
    });
    this.group.name = 'task-bar-container';
    scene.ganttGroup.addChild(this.group);
    this.initBars();
    this.initHoverBarIcons();
  }

  initBars() {
    this.barContainer = new Group({
      x: 0,
      y: 0,
      width: this._scene._gantt.getAllDateColsWidth(),
      height: this._scene._gantt.getAllTaskBarsHeight(),
      pickable: false,
      clip: true
    });
    this.group.appendChild(this.barContainer);

    for (let i = 0; i < this._scene._gantt.itemCount; i++) {
      if (
        this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline ||
        this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate ||
        this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange ||
        this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact
      ) {
        const record = this._scene._gantt.getRecordByIndex(i);
        if (record.children?.length > 0) {
          for (let j = 0; j < record.children?.length; j++) {
            const barGroup = this.initBar(i, j, record.children.length);
            if (barGroup) {
              this.barContainer.appendChild(barGroup);
            }
          }
        } else {
          const barGroup = this.initBar(i);
          if (barGroup) {
            this.barContainer.appendChild(barGroup);
          }
        }
        continue;
      } else if (this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Project_Sub_Tasks_Inline) {
        const record = this._scene._gantt.getRecordByIndex(i);
        const isExpanded = record.hierarchyState === 'expand';
        // For project type records, we want to show all children in one line when collapsed
        if (record.type === TaskType.PROJECT && record.children?.length > 0 && !isExpanded) {
          const recordIndex = this._scene._gantt.getRecordIndexByTaskShowIndex(i);
          const sub_task_indexs: number[] = Array.isArray(recordIndex) ? [...recordIndex] : [recordIndex];

          const callInitBar = (record: any, sub_task_indexs: number[]) => {
            if (record.children?.length > 0) {
              for (let j = 0; j < record.children?.length; j++) {
                const child_record = record.children[j];
                if (child_record.type !== TaskType.PROJECT) {
                  const barGroup = this.initBar(i, [...sub_task_indexs, j], record.children.length);
                  if (barGroup) {
                    this.barContainer.appendChild(barGroup);
                  }
                } else {
                  //如果是project类型的子任务，需要递归调用 只将类型不是project的子任务添加到barContainer中
                  callInitBar(child_record, [...sub_task_indexs, j]);
                }
              }
            }
          };
          callInitBar(record, sub_task_indexs);
        } else {
          // For non-project tasks, use the default Tasks_Separate mode
          const barGroup = this.initBar(i);
          if (barGroup) {
            this.barContainer.appendChild(barGroup);
          }
        }
        continue;
      } else {
        const barGroup = this.initBar(i);
        if (barGroup) {
          this.barContainer.appendChild(barGroup);
        }
      }
    }
  }

  /**
   * @param index 任务显示的index，从0开始
   * @param childIndex 子任务的index, 当taskShowMode是sub_tasks_*模式时，会传入sub_task_index。如果是tasks_separate模式，sub_task_index传入undefined。
   * 如果模式Project_Sub_Tasks_Inline时，传入的sub_task_index是一个数组，数组的第一个元素是父任务的index，第二个元素是子任务的index,依次类推算是各层子任务的path。
   */
  initBar(index: number, childIndex?: number | number[], childrenLength?: number) {
    const taskBarCustomLayout = this._scene._gantt.parsedOptions.taskBarCustomLayout;
    const { startDate, endDate, taskDays, progress, taskRecord } = this._scene._gantt.getTaskInfoByTaskListIndex(
      index,
      childIndex
    );
    const isMilestone = taskRecord.type === TaskType.MILESTONE;
    if (
      (isMilestone && !startDate) ||
      (!isMilestone && (taskDays <= 0 || !startDate || !endDate || startDate.getTime() > endDate.getTime()))
    ) {
      return null;
    }
    const { unit, step } = this._scene._gantt.parsedOptions.reverseSortedTimelineScales[0];
    let taskBarSize =
      computeCountToTimeScale(endDate, startDate, unit, step, 1) * this._scene._gantt.parsedOptions.timelineColWidth;

    const taskBarStyle = this._scene._gantt.getTaskBarStyle(index, childIndex);
    const taskbarHeight = taskBarStyle.width;
    if (isValid(taskBarStyle.minSize)) {
      taskBarSize = Math.max(taskBarSize, taskBarStyle.minSize);
    }
    // const minDate = createDateAtMidnight(this._scene._gantt.parsedOptions.minDate);

    // const subTaskShowRowCount =
    //   this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate
    //     ? childrenLength || 1
    //     : this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange
    //     ? computeRowsCountByRecordDate(this._scene._gantt, this._scene._gantt.records[index])
    //     : this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact
    //     ? computeRowsCountByRecordDateForCompact(this._scene._gantt, this._scene._gantt.records[index])
    //     : 1;
    const oneTaskHeigth = this._scene._gantt.parsedOptions.rowHeight; // this._scene._gantt.getRowHeightByIndex(index) / subTaskShowRowCount;
    const milestoneTaskBarHeight = this._scene._gantt.parsedOptions.taskBarMilestoneStyle.width;
    const x =
      computeCountToTimeScale(startDate, this._scene._gantt.parsedOptions.minDate, unit, step) *
        this._scene._gantt.parsedOptions.timelineColWidth -
      (isMilestone ? milestoneTaskBarHeight / 2 : 0);
    const y =
      this._scene._gantt.getRowsHeightByIndex(0, index - 1) +
      (this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate
        ? ((childIndex as number) ?? 0) * oneTaskHeigth
        : this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange ||
          this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact
        ? taskRecord.vtable_gantt_showIndex * oneTaskHeigth
        : 0) +
      (oneTaskHeigth - (isMilestone ? milestoneTaskBarHeight : taskbarHeight)) / 2;
    const barGroupBox = new GanttTaskBarNode({
      x,
      y,
      width: isMilestone ? milestoneTaskBarHeight : taskBarSize,
      // height: this._scene._gantt.parsedOptions.rowHeight,
      height: isMilestone ? milestoneTaskBarHeight : taskbarHeight,
      cornerRadius: isMilestone
        ? this._scene._gantt.parsedOptions.taskBarMilestoneStyle.cornerRadius
        : taskBarStyle.cornerRadius,
      lineWidth: isMilestone
        ? this._scene._gantt.parsedOptions.taskBarMilestoneStyle.borderLineWidth * 2
        : (taskBarStyle.borderLineWidth ?? taskBarStyle.borderWidth) * 2,
      stroke: isMilestone
        ? this._scene._gantt.parsedOptions.taskBarMilestoneStyle.borderColor
        : taskBarStyle.borderColor,
      angle: isMilestone ? (45 / 180) * Math.PI : 0,
      anchor: isMilestone ? [x + milestoneTaskBarHeight / 2, y + milestoneTaskBarHeight / 2] : undefined
      // clip: true
    });
    barGroupBox.name = 'task-bar';
    //如果TaskShowMode是tasks_separate模式 这里的task_index其实是table中的bodyIndex；如果TaskShowMode是sub_tasks_***模式 task_index也是对应父节点任务条在table中的bodyIndex（但不会渲染父节点，只是渲染子节点）
    barGroupBox.task_index = index;
    //如果TaskShowMode是tasks_separate模式，不会赋值sub_task_index；如果TaskShowMode是sub_tasks_***模式 这里的sub_task_index是父节点下子元素的index
    barGroupBox.sub_task_index = childIndex as any;
    barGroupBox.record = taskRecord;

    const barGroup = new Group({
      x: 0,
      y: 0,
      width: barGroupBox.attribute.width,
      height: barGroupBox.attribute.height,
      cornerRadius: isMilestone
        ? this._scene._gantt.parsedOptions.taskBarMilestoneStyle.cornerRadius
        : taskBarStyle.cornerRadius,
      clip: this._scene._gantt.parsedOptions.taskBarClip
    });
    barGroup.name = 'task-bar-group';
    barGroupBox.appendChild(barGroup);
    barGroupBox.clipGroupBox = barGroup;
    let rootContainer;
    let renderDefaultBar = true;
    let renderDefaultText = true;

    if (taskBarCustomLayout) {
      let customLayoutObj;
      if (typeof taskBarCustomLayout === 'function') {
        const arg = {
          width: taskBarSize,
          height: taskbarHeight,
          index,
          startDate,
          endDate,
          taskDays,
          progress,
          taskRecord,
          ganttInstance: this._scene._gantt
        };
        customLayoutObj = taskBarCustomLayout(arg);
      } else {
        customLayoutObj = taskBarCustomLayout;
      }
      if (customLayoutObj) {
        // if (customLayoutObj.rootContainer) {
        //   customLayoutObj.rootContainer = decodeReactDom(customLayoutObj.rootContainer);
        // }
        rootContainer = customLayoutObj.rootContainer;
        renderDefaultBar = customLayoutObj.renderDefaultBar ?? false;
        renderDefaultText = customLayoutObj.renderDefaultText ?? false;
        rootContainer && (rootContainer.name = 'task-bar-custom-render');
      }
    }

    if (renderDefaultBar) {
      // 创建整个任务条rect
      const rect = createRect({
        x: 0,
        y: 0, //this._scene._gantt.parsedOptions.rowHeight - taskbarHeight) / 2,
        width: barGroupBox.attribute.width,
        height: barGroupBox.attribute.height,
        fill: isMilestone ? this._scene._gantt.parsedOptions.taskBarMilestoneStyle.fillColor : taskBarStyle.barColor,
        pickable: false
      });
      rect.name = 'task-bar-rect';
      barGroup.appendChild(rect);
      barGroupBox.barRect = rect;
      if (taskRecord.type !== TaskType.MILESTONE) {
        // 创建已完成部分任务条rect
        const progress_rect = createRect({
          x: 0,
          y: 0, //(this._scene._gantt.parsedOptions.rowHeight - taskbarHeight) / 2,
          width: (taskBarSize * progress) / 100,
          height: taskbarHeight,
          fill: taskBarStyle.completedBarColor,
          pickable: false
        });
        progress_rect.name = 'task-bar-progress-rect';
        barGroup.appendChild(progress_rect);
        barGroupBox.progressRect = progress_rect;
      }
    }

    rootContainer && barGroup.appendChild(rootContainer);
    if (renderDefaultText && taskRecord.type !== TaskType.MILESTONE) {
      const { textAlign, textBaseline, fontSize, fontFamily, textOverflow, color, padding } =
        this._scene._gantt.parsedOptions.taskBarLabelStyle;
      const position = getTextPos(toBoxArray(padding), textAlign, textBaseline, taskBarSize, taskbarHeight);
      //创建label 文字
      const label = createText({
        // visible: false,
        // pickable: false,
        x: position.x, //extAlign === 'center' ? taskBarSize / 2 : textAlign === 'left' ? 10 : taskBarSize - 10,
        y: position.y, //fontSize / 2,
        fontSize: fontSize, // 10
        fill: color,
        fontFamily: fontFamily,
        text: parseStringTemplate(this._scene._gantt.parsedOptions.taskBarLabelText as string, taskRecord),
        maxLineWidth: taskBarSize - TASKBAR_HOVER_ICON_WIDTH,
        textBaseline,
        textAlign,
        ellipsis:
          textOverflow === 'clip'
            ? ''
            : textOverflow === 'ellipsis'
            ? '...'
            : isValid(textOverflow)
            ? textOverflow
            : undefined,
        poptip: {
          position: 'bottom'
          // dx: (taskBarSize - TASKBAR_HOVER_ICON_WIDTH) / 4
        }
        // dx: 12 + 4,
        // dy: this._scene._gantt.barLabelStyle.fontSize / 2
      } as any);

      barGroup.appendChild(label);
      barGroupBox.textLabel = label;

      barGroupBox.labelStyle = this._scene._gantt.parsedOptions.taskBarLabelStyle;

      barGroupBox.updateTextPosition();
    }
    if (
      renderDefaultText &&
      taskRecord.type === 'milestone' &&
      this._scene._gantt.parsedOptions.taskBarMilestoneStyle.labelText
    ) {
      const milestoneStyle = this._scene._gantt.parsedOptions.taskBarMilestoneStyle;
      const textStyle = milestoneStyle.labelTextStyle || {};
      const pos = this.calculateMilestoneTextPosition(
        milestoneStyle.textOrient || 'right',
        milestoneStyle.width,
        textStyle.padding ?? 4
      );

      const textContainer = new Group({
        x,
        y,
        width: milestoneStyle.width,
        height: milestoneStyle.width,
        angle: 0,
        pickable: false
      });

      const milestoneLabel = createText({
        x: pos.textX,
        y: pos.textY,
        fontSize: textStyle.fontSize || 16,
        fontFamily: textStyle.fontFamily || 'Arial',
        fill: textStyle.color || '#ff0000',
        textBaseline: (textStyle.textBaseline || pos.textBaselineValue) as any,
        textAlign: textStyle.textAlign || pos.textAlignValue,
        text: this.formatMilestoneText(milestoneStyle.labelText, taskRecord),
        pickable: false
      });

      textContainer.appendChild(milestoneLabel);
      this.barContainer.appendChild(textContainer);

      barGroupBox.milestoneTextLabel = milestoneLabel;
      barGroupBox.milestoneTextContainer = textContainer;
    }
    return barGroupBox;
  }
  updateTaskBarNode(index: number, sub_task_index?: number) {
    const taskbarGroup = this.getTaskBarNodeByIndex(index, sub_task_index);
    if (taskbarGroup) {
      this.barContainer.removeChild(taskbarGroup);
    }
    const barGroup = this.initBar(index, sub_task_index);
    if (barGroup) {
      this.barContainer.insertInto(barGroup, index); //TODO
      barGroup.updateTextPosition();
    }
  }
  initHoverBarIcons() {
    const hoverBarGroup = new Group({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      clip: false, // 关闭裁剪以允许进度手柄显示在任务条外部
      pickable: false,
      cornerRadius:
        this._scene._gantt.parsedOptions.taskBarHoverStyle.cornerRadius ?? defaultTaskBarStyle.cornerRadius ?? 0,
      fill: this._scene._gantt.parsedOptions.taskBarHoverStyle.barOverlayColor,
      visibleAll: false
    });
    this.hoverBarGroup = hoverBarGroup;
    hoverBarGroup.name = 'task-bar-hover-shadow';
    // this.barContainer.appendChild(hoverBarGroup);
    // 创建左侧的icon
    if (this._scene._gantt.parsedOptions.taskBarResizable) {
      const icon = new Image({
        x: 0,
        y: 0, //this._scene._gantt.parsedOptions.rowHeight - taskbarHeight) / 2,
        width: TASKBAR_HOVER_ICON_WIDTH,
        height: 20,
        image: TASKBAR_HOVER_ICON,
        pickable: true,
        cursor: 'col-resize'
      });
      icon.name = 'task-bar-hover-shadow-left-icon';
      this.hoverBarLeftIcon = icon;
      hoverBarGroup.appendChild(icon);

      // 创建右侧的icon
      const rightIcon = new Image({
        x: 0,
        y: 0, //this._scene._gantt.parsedOptions.rowHeight - taskbarHeight) / 2,
        width: TASKBAR_HOVER_ICON_WIDTH,
        height: 20,
        image: TASKBAR_HOVER_ICON,
        pickable: true,
        cursor: 'col-resize'
      });
      rightIcon.name = 'task-bar-hover-shadow-right-icon';
      this.hoverBarRightIcon = rightIcon;
      hoverBarGroup.appendChild(rightIcon);
    }

    // 创建进度手柄
    const progressHandle = new Group({
      x: 0,
      y: 0,
      width: 12,
      height: 12,
      pickable: true,
      cursor: 'ew-resize',
      visible: false
    });

    // 创建三角形手柄
    const triangleHandle = new Polygon({
      points: [
        { x: 6, y: 0 }, // 顶部中心点
        { x: 0, y: 6 }, // 左下角
        { x: 12, y: 6 } // 右下角
      ],
      fill: '#0064ff',
      stroke: '#ffffff',
      lineWidth: 1,
      pickable: false
    });
    progressHandle.appendChild(triangleHandle);

    progressHandle.name = 'task-bar-progress-handle';
    this.hoverBarProgressHandle = progressHandle;
    hoverBarGroup.appendChild(progressHandle);
  }

  setX(x: number) {
    this.barContainer.setAttribute('x', x);
  }
  setY(y: number) {
    this.barContainer.setAttribute('y', y);
  }
  /** 重新创建任务条节点 */
  refresh() {
    this.width = this._scene._gantt.tableNoFrameWidth;
    this.height = this._scene._gantt.gridHeight;
    this.group.setAttributes({
      height: this.height,
      width: this.width,
      y: this._scene._gantt.getAllHeaderRowsHeight()
    });
    const x = this.barContainer.attribute.x;
    const y = this.barContainer.attribute.y;
    this.barContainer.removeAllChild();
    this.group.removeChild(this.barContainer);
    this.initBars();
    this.setX(x);
    this.setY(y);
  }
  resize() {
    this.width = this._scene._gantt.tableNoFrameWidth;
    this.height = this._scene._gantt.gridHeight;
    this.group.setAttribute('width', this.width);
    this.group.setAttribute('height', this.height);
  }

  showHoverBar(x: number, y: number, width: number, height: number, target?: GanttTaskBarNode) {
    const { startDate, endDate, taskRecord } = this._scene._gantt.getTaskInfoByTaskListIndex(
      target.task_index,
      target.sub_task_index
    );
    if (target && target.name === 'task-bar') {
      // this.hoverBarGroup.releatedTaskBar = target;
      target.appendChild(this.hoverBarGroup);
    }
    this.hoverBarGroup.setAttribute('x', 0);
    this.hoverBarGroup.setAttribute('y', 0);
    this.hoverBarGroup.setAttribute('width', width);
    this.hoverBarGroup.setAttribute('height', height);
    this.hoverBarGroup.setAttribute('visibleAll', true);
    const taskBarStyle = this._scene._gantt.getTaskBarStyle(target.task_index, target.sub_task_index);
    if (taskRecord.type === TaskType.MILESTONE) {
      this.hoverBarGroup.setAttribute('cornerRadius', target.attribute.cornerRadius);
    } else {
      const cornerRadius =
        this._scene._gantt.parsedOptions.taskBarHoverStyle.cornerRadius ?? taskBarStyle.cornerRadius ?? 0;
      this.hoverBarGroup.setAttribute('cornerRadius', cornerRadius);
    }
    this.hoverBarLeftIcon?.setAttribute('visible', false);
    this.hoverBarRightIcon?.setAttribute('visible', false);
    this.hoverBarProgressHandle?.setAttribute('visibleAll', false);

    let leftResizable = true;
    let rightResizable = true;
    let progressAdjustable = true;

    const progressField = this._scene._gantt.parsedOptions.progressField;
    const hasProgressField =
      progressField && taskRecord[progressField] !== undefined && taskRecord[progressField] !== null;

    if (!hasProgressField) {
      progressAdjustable = false;
    } else if (typeof this._scene._gantt.parsedOptions.taskBarProgressAdjustable === 'function') {
      const arg = {
        index: target.task_index,
        startDate,
        endDate,
        taskRecord,
        ganttInstance: this._scene._gantt
      };
      progressAdjustable = this._scene._gantt.parsedOptions.taskBarProgressAdjustable(arg);
    } else {
      progressAdjustable = this._scene._gantt.parsedOptions.taskBarProgressAdjustable;
    }

    if (taskRecord.type === TaskType.MILESTONE) {
      leftResizable = false;
      rightResizable = false;
      progressAdjustable = false;
    } else if (typeof this._scene._gantt.parsedOptions.taskBarResizable === 'function') {
      const arg = {
        index: target.task_index,
        startDate,
        endDate,
        taskRecord,
        ganttInstance: this._scene._gantt
      };
      const resizableResult = this._scene._gantt.parsedOptions.taskBarResizable(arg);
      if (Array.isArray(resizableResult)) {
        [leftResizable, rightResizable] = resizableResult;
      } else {
        leftResizable = resizableResult;
        rightResizable = resizableResult;
      }
    } else if (Array.isArray(this._scene._gantt.parsedOptions.taskBarResizable)) {
      [leftResizable, rightResizable] = this._scene._gantt.parsedOptions.taskBarResizable;
    } else {
      leftResizable = this._scene._gantt.parsedOptions.taskBarResizable;
      rightResizable = this._scene._gantt.parsedOptions.taskBarResizable;
    }
    if (leftResizable) {
      this.hoverBarLeftIcon.setAttribute('visible', true);
    }
    if (rightResizable) {
      this.hoverBarRightIcon.setAttribute('visible', true);
    }
    if (progressAdjustable) {
      this.hoverBarProgressHandle.setAttribute('visibleAll', true);
    }
    if (this.hoverBarLeftIcon) {
      this.hoverBarLeftIcon.setAttribute('x', 0);
      this.hoverBarLeftIcon.setAttribute('y', Math.ceil(height / 10));
      this.hoverBarLeftIcon.setAttribute('width', TASKBAR_HOVER_ICON_WIDTH);
      this.hoverBarLeftIcon.setAttribute('height', height - 2 * Math.ceil(height / 10));
      this.hoverBarRightIcon.setAttribute('x', width - TASKBAR_HOVER_ICON_WIDTH);
      this.hoverBarRightIcon.setAttribute('y', Math.ceil(height / 10));
      this.hoverBarRightIcon.setAttribute('width', TASKBAR_HOVER_ICON_WIDTH);
      this.hoverBarRightIcon.setAttribute('height', height - 2 * Math.ceil(height / 10));
    }
    if (this.hoverBarProgressHandle) {
      const { progress } = this._scene._gantt.getTaskInfoByTaskListIndex(target.task_index, target.sub_task_index);
      const progressX = (width * progress) / 100 - 6;
      this.hoverBarProgressHandle.setAttribute('x', progressX);
      this.hoverBarProgressHandle.setAttribute('y', height - 3); // 让三角形有一半在进度条内
    }
  }
  hideHoverBar() {
    this.hoverBarGroup.setAttribute('visibleAll', false);
  }

  createSelectedBorder(
    x: number,
    y: number,
    width: number,
    height: number,
    attachedToTaskBarNode: GanttTaskBarNode,
    showLinkPoint: boolean = false
  ) {
    const record = attachedToTaskBarNode.record;
    const selectedBorder = new Group({
      x,
      y,
      width,
      height,
      // lineWidth: this._scene._gantt.parsedOptions.taskBarSelectedStyle.borderLineWidth,
      pickable: false,
      // cornerRadius: attachedToTaskBarNode.attribute.cornerRadius,
      // fill: false,
      // stroke: this._scene._gantt.parsedOptions.taskBarSelectedStyle.borderColor,
      // shadowColor: this._scene._gantt.parsedOptions.taskBarSelectedStyle.shadowColor,
      // shadowOffsetX: this._scene._gantt.parsedOptions.taskBarSelectedStyle.shadowOffsetX,
      // shadowOffsetY: this._scene._gantt.parsedOptions.taskBarSelectedStyle.shadowOffsetY,
      // shadowBlur: this._scene._gantt.parsedOptions.taskBarSelectedStyle.shadowBlur,
      attachedToTaskBarNode: attachedToTaskBarNode,
      zIndex: 10000
      // angle: attachedToTaskBarNode.attribute.angle,
      // anchor: attachedToTaskBarNode.attribute.anchor
    } as any);
    selectedBorder.name = 'task-bar-select-border';
    this.barContainer.appendChild(selectedBorder);
    this.selectedBorders.push(selectedBorder);

    const selectRectBorder = new Group({
      x: 0,
      y: 0,
      width,
      height,
      lineWidth: this._scene._gantt.parsedOptions.taskBarSelectedStyle.borderLineWidth,
      pickable: false,
      cornerRadius: attachedToTaskBarNode.attribute.cornerRadius,
      fill: false,
      stroke: this._scene._gantt.parsedOptions.taskBarSelectedStyle.borderColor,
      shadowColor: this._scene._gantt.parsedOptions.taskBarSelectedStyle.shadowColor,
      shadowOffsetX: this._scene._gantt.parsedOptions.taskBarSelectedStyle.shadowOffsetX,
      shadowOffsetY: this._scene._gantt.parsedOptions.taskBarSelectedStyle.shadowOffsetY,
      shadowBlur: this._scene._gantt.parsedOptions.taskBarSelectedStyle.shadowBlur,
      // attachedToTaskBarNode: attachedToTaskBarNode,
      angle: attachedToTaskBarNode.attribute.angle,
      anchor: [width / 2, height / 2]
    });
    // selectRectBorder.name = 'task-bar-select-border';
    selectedBorder.appendChild(selectRectBorder);

    if (showLinkPoint) {
      const isMilestone = record.type === TaskType.MILESTONE;
      const linePointPadding = isMilestone ? 15 : 10;
      const linkPointContainer = new Group({
        x: -linePointPadding,
        y: 0,
        width: 10,
        height: height,
        pickable: true
      });
      const linkPoint = new Circle({
        x: 5,
        y: height / 2,
        radius: this._scene._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.radius,
        fill: this._scene._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.fillColor,
        stroke: this._scene._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.strokeColor,
        lineWidth: this._scene._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.strokeWidth,
        pickable: false
      });
      linkPointContainer.appendChild(linkPoint);
      linkPointContainer.name = 'task-bar-link-point-left';
      selectedBorder.appendChild(linkPointContainer);

      const linkPointContainer1 = new Group({
        x: width + (linePointPadding - 10),
        y: 0,
        width: 10,
        height: height,
        pickable: true
      });
      const linkPoint1 = new Circle({
        x: 5,
        y: height / 2,
        radius: this._scene._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.radius,
        fill: this._scene._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.fillColor,
        stroke: this._scene._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.strokeColor,
        lineWidth: this._scene._gantt.parsedOptions.dependencyLinkLineCreatePointStyle.strokeWidth,
        pickable: false,
        pickStrokeBuffer: 10
      });
      linkPointContainer1.appendChild(linkPoint1);
      linkPointContainer1.name = 'task-bar-link-point-right';
      selectedBorder.appendChild(linkPointContainer1);
    }
  }
  removeSelectedBorder() {
    this.selectedBorders.forEach(border => {
      border.delete();
    });
    this.selectedBorders = [];
  }
  removeSecondSelectedBorder() {
    if (this.selectedBorders.length === 2) {
      const secondBorder = this.selectedBorders.pop();
      secondBorder.delete();
    }
  }
  updateCreatingDependencyLine(x1: number, y1: number, x2: number, y2: number) {
    if (this.creatingDependencyLine) {
      this.creatingDependencyLine.delete();
      this.creatingDependencyLine = undefined;
    }
    const line = new Line({
      points: [
        { x: x1, y: y1 },
        { x: x2, y: y2 }
      ],
      stroke: this._scene._gantt.parsedOptions.dependencyLinkLineCreatingStyle.lineColor,
      lineWidth: this._scene._gantt.parsedOptions.dependencyLinkLineCreatingStyle.lineWidth,
      lineDash: this._scene._gantt.parsedOptions.dependencyLinkLineCreatingStyle.lineDash,
      pickable: false
    });
    this.creatingDependencyLine = line;
    this.selectedBorders[0].appendChild(line);
  }

  getTaskBarNodeByIndex(index: number, sub_task_index?: number): GanttTaskBarNode {
    let c = this.barContainer.firstChild as GanttTaskBarNode;
    if (!c) {
      return null;
    }
    for (let i = 0; i < this.barContainer.childrenCount; i++) {
      if (
        c.task_index === index &&
        (!isValid(sub_task_index) || (isValid(sub_task_index) && c.sub_task_index === sub_task_index))
      ) {
        return c;
      }
      c = c._next as GanttTaskBarNode;
    }
    return null;
  }
}
