import { isValid } from '@visactor/vutils';
import type { Gantt } from '../Gantt';

export class StateManager {
  _gantt: Gantt;

  scroll: {
    horizontalBarPos: number;
    verticalBarPos: number;
  };
  constructor(gantt: Gantt) {
    this._gantt = gantt;
    this.scroll = {
      horizontalBarPos: 0,
      verticalBarPos: 0
    };
  }

  setScrollTop(top: number) {
    // 矫正top值范围
    const totalHeight = this._gantt.getAllRowsHeight();
    top = Math.max(0, Math.min(top, totalHeight - this._gantt.scenegraph.height));
    top = Math.ceil(top);

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

    // if (oldVerticalBarPos !== top) {
    //   this._gantt.fireListeners(TABLE_EVENT_TYPE.SCROLL, {
    //     scrollTop: this.scroll.verticalBarPos,
    //     scrollLeft: this.scroll.horizontalBarPos,
    //     scrollHeight: this._gantt.theme.scrollStyle?.width,
    //     scrollWidth: this._gantt.theme.scrollStyle?.width,
    //     viewHeight: this._gantt.tableNoFrameHeight,
    //     viewWidth: this._gantt.tableNoFrameWidth,
    //     scrollDirection: 'vertical',
    //     scrollRatioY: yRatio
    //   });

    //   this.checkVerticalScrollBarEnd();
    // }
  }
  setScrollLeft(left: number) {
    // 矫正left值范围
    const totalWidth = this._gantt.getAllColsWidth();

    left = Math.max(0, Math.min(left, totalWidth - this._gantt.scenegraph.width));
    left = Math.ceil(left);
    // 滚动期间清空选中清空
    // if (left !== this.scroll.horizontalBarPos) {
    //   this.updateHoverPos(-1, -1);
    // }
    // this._gantt.stateManager.updateSelectPos(-1, -1);
    this.scroll.horizontalBarPos = left;
    if (!isValid(this.scroll.horizontalBarPos) || isNaN(this.scroll.horizontalBarPos)) {
      this.scroll.horizontalBarPos = 0;
    }

    // 设置scenegraph坐标
    this._gantt.scenegraph.setX(-left);

    // 更新scrollbar位置
    const xRatio = left / (totalWidth - this._gantt.scenegraph.width);
    this._gantt.scenegraph.scrollbarComponent.updateHorizontalScrollBarPos(xRatio);

    // if (oldHorizontalBarPos !== left) {
    //   this._gantt.fireListeners(TABLE_EVENT_TYPE.SCROLL, {
    //     scrollTop: this.scroll.verticalBarPos,
    //     scrollLeft: this.scroll.horizontalBarPos,
    //     scrollHeight: this._gantt.theme.scrollStyle?.width,
    //     scrollWidth: this._gantt.theme.scrollStyle?.width,
    //     viewHeight: this._gantt.tableNoFrameHeight,
    //     viewWidth: this._gantt.tableNoFrameWidth,
    //     scrollDirection: 'horizontal',
    //     scrollRatioX: xRatio
    //   });

    //   this.checkHorizontalScrollBarEnd();
    // }
  }
}
