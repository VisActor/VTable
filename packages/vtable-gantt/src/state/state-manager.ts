import { isValid } from '@visactor/vutils';
import type { Gantt } from '../Gantt';
import { InteractionState, GANTT_EVENT_TYPE } from '../ts-types';
import type { Group, FederatedPointerEvent } from '@visactor/vrender-core';
import {
  getTaskIndexByY,
  syncResizeStateFromTable,
  syncScrollStateFromTable,
  syncScrollStateToTable
} from '../gantt-helper';
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
    targetStartX: number;
    moving: boolean;
    target: Group;
  };

  hoverTaskBar: {
    /** x坐标是相对table内坐标 */
    startX: number;
    targetStartX: number;
    target: Group;
  };
  resizeTaskBar: {
    /** x坐标是相对table内坐标 */
    startX: number;
    startY: number;
    targetStartX: number;
    target: Group;
    resizing: boolean;
    onIconName: string;
  };
  resizeTableWidth: {
    /** x坐标是相对table内坐标 */
    lastX: number;
    resizing: boolean;
  };
  constructor(gantt: Gantt) {
    this._gantt = gantt;
    this.scroll = {
      horizontalBarPos: 0,
      verticalBarPos: 0
    };
    this.moveTaskBar = {
      targetStartX: null,
      startX: null,
      startY: null,
      moving: false,
      target: null
    };

    this.hoverTaskBar = {
      targetStartX: null,
      startX: null,
      target: null
    };
    this.resizeTaskBar = {
      targetStartX: null,
      startX: null,
      startY: null,
      target: null,
      resizing: false,
      onIconName: ''
    };
    this.resizeTableWidth = {
      targetStartX: null,
      lastX: null,
      lastY: null,
      target: null,
      resizing: false,
      onIconName: ''
    };

    this.updateVerticalScrollBar = this.updateVerticalScrollBar.bind(this);
    this.updateHorizontalScrollBar = this.updateHorizontalScrollBar.bind(this);

    syncScrollStateFromTable(this._gantt);
    syncResizeStateFromTable(this._gantt);
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
  setScrollLeft(left: number, triggerEvent: boolean = true) {
    // 矫正left值范围
    const totalWidth = this._gantt.getAllColsWidth();

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
    const totalWidth = this._gantt.getAllColsWidth();
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

  startMoveTaskBar(target: Group, x: number, y: number) {
    if (target.name === 'task-bar-hover-shadow') {
      target = target.parent;
    }
    this.moveTaskBar.moving = true;
    this.moveTaskBar.target = target;
    this.moveTaskBar.targetStartX = target.attribute.x;
    this.moveTaskBar.startX = x;
    this.moveTaskBar.startY = y;
  }

  isMoveingTaskBar() {
    return this.moveTaskBar.moving;
  }
  endMoveTaskBar(x: number) {
    const deltaX = x - this.moveTaskBar.startX;
    const days = Math.round(deltaX / this._gantt.colWidthPerDay);
    const correctX = days * this._gantt.colWidthPerDay;
    const targetEndX = this.moveTaskBar.targetStartX + correctX;
    this._gantt.stateManager.moveTaskBar.target.setAttribute('x', targetEndX);
    const taskIndex = getTaskIndexByY(this.moveTaskBar.startY, this._gantt);
    this._gantt.updateDateToTaskRecord('move', days, taskIndex);
    this.moveTaskBar.moving = false;
    this.moveTaskBar.target = null;
    this._gantt.scenegraph.updateNextFrame();
  }
  dealTaskBarMove(e: FederatedPointerEvent) {
    const target = this.moveTaskBar.target;
    const x1 = this._gantt.eventManager.lastDragPointerXYOnTableGroup.x;
    const x2 = e.x;
    const dx = x2 - x1;
    target.setAttribute('x', target.attribute.x + dx);
    this._gantt.scenegraph.updateNextFrame();

    //
  }
  //#region 调整拖拽任务条的大小
  startResizeTaskBar(target: Group, x: number, y: number, onIconName: string) {
    // if (target.name === 'task-bar-hover-shadow') {
    target = target.parent.parent;
    // }
    this.resizeTaskBar.onIconName = onIconName;
    this.resizeTaskBar.resizing = true;
    this.resizeTaskBar.target = target;
    this.resizeTaskBar.targetStartX = target.attribute.x;
    this.resizeTaskBar.startX = x;
    this.resizeTaskBar.startY = y;
  }
  isResizingTaskBar() {
    return this.resizeTaskBar.resizing;
  }
  endtResizeTaskBar(x: number) {
    const direction = this._gantt.stateManager.resizeTaskBar.onIconName;
    const deltaX = x - this.resizeTaskBar.startX;
    const days = Math.round(deltaX / this._gantt.colWidthPerDay);
    const correctX = days * this._gantt.colWidthPerDay;
    const targetEndX = this.resizeTaskBar.targetStartX + correctX;
    const tastBarGroup = this._gantt.stateManager.resizeTaskBar.target;
    const rect = this._gantt.stateManager.resizeTaskBar.target.barRect;
    const progressRect = this._gantt.stateManager.resizeTaskBar.target.progressRect;
    const taskIndex = getTaskIndexByY(this.resizeTaskBar.startY, this._gantt);
    const { taskDays, progress } = this._gantt.getTaskInfoByTaskListIndex(taskIndex);
    const taskBarSize = this._gantt.colWidthPerDay * (taskDays + (direction === 'left' ? -days : days));
    if (direction === 'left') {
      tastBarGroup.setAttribute('x', targetEndX);
      tastBarGroup.setAttribute('width', taskBarSize);
      rect.setAttribute('width', tastBarGroup.attribute.width);
      progressRect.setAttribute('width', (progress / 100) * tastBarGroup.attribute.width);
      this._gantt.updateDateToTaskRecord('start-move', days, taskIndex);
    } else if (direction === 'right') {
      tastBarGroup.setAttribute('width', taskBarSize);
      rect.setAttribute('width', tastBarGroup.attribute.width);
      progressRect.setAttribute('width', (progress / 100) * tastBarGroup.attribute.width);
      this._gantt.updateDateToTaskRecord('end-move', days, taskIndex);
    }
    this._gantt.scenegraph.taskBar.showHoverBar(
      tastBarGroup.attribute.x,
      tastBarGroup.attribute.y,
      tastBarGroup.attribute.width,
      tastBarGroup.attribute.height
    );
    this.resizeTaskBar.resizing = false;
    this.resizeTaskBar.target = null;
    this._gantt.scenegraph.updateNextFrame();
  }
  dealTaskBartResize(e: FederatedPointerEvent) {
    const x1 = this._gantt.eventManager.lastDragPointerXYOnTableGroup.x;
    const x2 = e.x;
    const dx = x2 - x1;
    // debugger;
    const tastBarGroup = this._gantt.stateManager.resizeTaskBar.target;
    const rect = this._gantt.stateManager.resizeTaskBar.target.barRect;
    const progressRect = this._gantt.stateManager.resizeTaskBar.target.progressRect;
    const textLabel = this._gantt.stateManager.resizeTaskBar.target.textLabel;

    const progressField = this._gantt.progressField;
    const taskIndex = getTaskIndexByY(this.resizeTaskBar.startY, this._gantt);
    const taskRecord = this._gantt.getRecordByIndex(taskIndex);
    const progress = taskRecord[progressField];
    if (this._gantt.stateManager.resizeTaskBar.onIconName === 'left') {
      tastBarGroup.setAttribute('x', tastBarGroup.attribute.x + dx);
    }
    const taskBarSize =
      tastBarGroup.attribute.width + (this._gantt.stateManager.resizeTaskBar.onIconName === 'left' ? -dx : dx);
    tastBarGroup.setAttribute('width', taskBarSize);

    rect.setAttribute('width', tastBarGroup.attribute.width);
    progressRect.setAttribute('width', (progress / 100) * tastBarGroup.attribute.width);
    textLabel.setAttribute(
      'x',
      this._gantt.barLabelStyle.textAlign === 'center'
        ? taskBarSize / 2
        : this._gantt.barLabelStyle.textAlign === 'left'
        ? 10
        : taskBarSize - 10
    );
    textLabel.setAttribute('maxLineWidth', taskBarSize - 20);

    const x = tastBarGroup.attribute.x;
    const y = tastBarGroup.attribute.y;
    const width = tastBarGroup.attribute.width;
    const height = tastBarGroup.attribute.height;
    this._gantt.scenegraph.taskBar.showHoverBar(x, y, width, height, e.target);
    this._gantt.scenegraph.updateNextFrame();
    //
  }
  //#endregion

  //#region 调整左侧任务列表表格整体的宽度
  startResizeTableWidth(e: MouseEvent) {
    this.resizeTableWidth.resizing = true;
    this.resizeTableWidth.lastX = e.pageX;
    this.resizeTableWidth.lastY = e.pageY;
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
      if (deltaX > 0 && width > this._gantt.listTableInstance.getAllColsWidth() + this._gantt.tableX * 2) {
        width = this._gantt.listTableInstance.getAllColsWidth() + this._gantt.tableX * 2;
      }
      this._gantt.taskTableWidth = width;
      this._gantt.element.style.left = this._gantt.taskTableWidth ? `${this._gantt.taskTableWidth}px` : '0px';
      this._gantt._resize();
      this.resizeTableWidth.lastX = e.pageX;
    }
  }
  //#endregion

  showTaskBarHover(e: FederatedPointerEvent) {
    const taskBarTarget =
      e.target?.name === 'task-bar-hover-shadow-left-icon' || e.target?.name === 'task-bar-hover-shadow-right-icon'
        ? e.target.parent //转成父级元素task-bar-hover-shadow  后面逻辑需要宽高值
        : e.target;
    if (this._gantt.stateManager.hoverTaskBar.target !== taskBarTarget) {
      this._gantt.stateManager.hoverTaskBar.target = taskBarTarget;
      const target = this._gantt.stateManager.hoverTaskBar.target;
      const x = target.attribute.x;
      const y = target.attribute.y;
      const width = target.attribute.width;
      const height = target.attribute.height;
      this._gantt.scenegraph.taskBar.showHoverBar(x, y, width, height, e.target);
      this._gantt.scenegraph.updateNextFrame();
    }
    //
  }
  hideTaskBarHover() {
    this._gantt.stateManager.hoverTaskBar.target = null;
    this._gantt.scenegraph.taskBar.hideHoverBar();
    this._gantt.scenegraph.updateNextFrame();
  }
}