import { isValid } from '@visactor/vutils';
import type { Gantt } from '../Gantt';
import { InteractionState, GANTT_EVENT_TYPE } from '../ts-types';
import type { Group, FederatedPointerEvent } from '@visactor/vrender-core';
import { DayTimes, getTaskIndexByY, syncScrollStateToTable } from '../gantt-helper';
import { formatDate, parseDateFormat } from '../tools/util';
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
  interactionState: InteractionState;

  moveTaskBar: {
    /** x坐标是相对table内坐标 */
    startX: number;
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
  constructor(gantt: Gantt) {
    this._gantt = gantt;
    this.scroll = {
      horizontalBarPos: 0,
      verticalBarPos: 0
    };
    this.moveTaskBar = {
      targetStartX: null,
      startX: null,
      moving: false,
      target: null
    };

    this.updateVerticalScrollBar = this.updateVerticalScrollBar.bind(this);
    this.updateHorizontalScrollBar = this.updateHorizontalScrollBar.bind(this);
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

  startMoveTaskBar(target: Group, x: number) {
    this.moveTaskBar.moving = true;
    this.moveTaskBar.target = target;
    this.moveTaskBar.targetStartX = target.attribute.x;
    this.moveTaskBar.startX = x;
  }
  isMoveingTaskBar() {
    return this.moveTaskBar.moving;
  }
  endMoveTaskBar(x: number, y: number) {
    const deltaX = x - this.moveTaskBar.startX;

    const days = Math.round(deltaX / this._gantt.colWidthPerDay);
    const correctX = days * this._gantt.colWidthPerDay;
    const targetEndX = this.moveTaskBar.targetStartX + correctX;
    this._gantt.stateManager.moveTaskBar.target.setAttribute('x', targetEndX);
    const taskIndex = getTaskIndexByY(y, this._gantt);
    const taskRecord = this._gantt.getRecordByIndex(taskIndex);
    const startDateField = this._gantt.startDateField;
    const endDateField = this._gantt.endDateField;
    const dateFormat = parseDateFormat(taskRecord[startDateField]);
    const startDate = new Date(taskRecord[startDateField]);
    const endDate = new Date(taskRecord[endDateField]);
    const newStartDate = formatDate(new Date(days * DayTimes + startDate.getTime()), dateFormat);
    const newEndDate = formatDate(new Date(days * DayTimes + endDate.getTime()), dateFormat);
    taskRecord[startDateField] = newStartDate;
    taskRecord[endDateField] = newEndDate;
    this._gantt.updateRecord(taskRecord, taskIndex);
    this.moveTaskBar.moving = false;
    this.moveTaskBar.target = null;
    this._gantt.scenegraph.updateNextFrame();
  }
  dealTaskBarMove(e: FederatedPointerEvent) {
    const x1 = this._gantt.eventManager.lastDragPointerXY.x;
    const x2 = e.x;
    const dx = x2 - x1;
    this._gantt.stateManager.moveTaskBar.target.setAttribute(
      'x',
      this._gantt.stateManager.moveTaskBar.target.attribute.x + dx
    );
    this._gantt.scenegraph.updateNextFrame();
    //
  }
  dealTaskBarHover(e: FederatedPointerEvent) {
    const x1 = this._gantt.eventManager.lastDragPointerXY.x;
    const x2 = e.x;
    const dx = x2 - x1;
    this._gantt.stateManager.moveTaskBar.target.setAttribute(
      'x',
      this._gantt.stateManager.moveTaskBar.target.attribute.x + dx
    );
    this._gantt.scenegraph.updateNextFrame();
    //
  }
}
