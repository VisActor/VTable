import { ScrollBar } from '@visactor/vtable/es/vrender';
import { isValid } from '@visactor/vutils';
import type { Gantt } from '../Gantt';
/**
 * @description: 创建滚动条组件
 * @return {*}
 */

export class ScrollBarComponent {
  hScrollBar: ScrollBar;
  vScrollBar: ScrollBar;
  _gantt: Gantt;
  _clearHorizontalScrollBar: any;
  _clearVerticalScrollBar: any;
  constructor(gantt: Gantt) {
    this._gantt = gantt;
    this.createScrollBar(gantt.tableNoFrameWidth, gantt.tableNoFrameHeight - gantt.getAllHeaderRowsHeight());
  }

  createScrollBar(tableWidth: number, tableHeight: number) {
    const scrollRailColor = this._gantt.parsedOptions.scrollStyle.scrollRailColor;
    const scrollSliderColor = this._gantt.parsedOptions.scrollStyle.scrollSliderColor;
    const scrollSliderCornerRadius = this._gantt.parsedOptions.scrollStyle.scrollSliderCornerRadius;
    const width = this._gantt.parsedOptions.scrollStyle.width;

    let sliderStyle;
    if (isValid(scrollSliderCornerRadius)) {
      sliderStyle = {
        cornerRadius: scrollSliderCornerRadius,
        fill: scrollSliderColor
      };
    } else {
      sliderStyle = {
        fill: scrollSliderColor
      };
    }
    const visible = this._gantt.parsedOptions.scrollStyle?.visible as string;
    const hoverOn = this._gantt.parsedOptions.scrollStyle?.hoverOn as boolean;

    this.hScrollBar = new ScrollBar({
      direction: 'horizontal',
      x: -tableWidth * 2,
      y: -tableHeight * 2,
      width: tableWidth,
      height: width,
      padding: 0,
      railStyle: {
        fill: scrollRailColor
      },
      sliderStyle,
      range: [0, 0.1],
      // scrollRange: [0.4, 0.8]
      visible: false
    });
    // hack方案实现初始化隐藏滚动条，也可以add到stage之后执行hideAll
    (this.hScrollBar as any).render();
    this.hScrollBar.hideAll();

    this.vScrollBar = new ScrollBar({
      direction: 'vertical',
      x: -tableWidth * 2,
      y: -tableHeight * 2,
      width,
      height: tableHeight,
      padding: 0,
      railStyle: {
        fill: scrollRailColor
      },
      sliderStyle,
      range: [0, 0.1],
      visible: false
    });
    (this.vScrollBar as any).render();
    this.vScrollBar.hideAll();
  }
  refresh() {
    //
  }
  hideVerticalScrollBar() {
    const visable = this._gantt.parsedOptions.scrollStyle.visible;
    if (visable !== 'focus' && visable !== 'scrolling') {
      return;
    }
    this.vScrollBar.setAttribute('visible', false);
    this.vScrollBar.hideAll();
    this._gantt.scenegraph.updateNextFrame();
  }
  showVerticalScrollBar(autoHide?: boolean) {
    const visable = this._gantt.parsedOptions.scrollStyle.visible;
    if (visable !== 'focus' && visable !== 'scrolling') {
      return;
    }
    this.vScrollBar.setAttribute('visible', true);
    this.vScrollBar.showAll();
    this._gantt.scenegraph.updateNextFrame();
    if (autoHide) {
      // 滚轮触发滚动条显示后，异步隐藏
      clearTimeout(this._clearVerticalScrollBar);
      this._clearVerticalScrollBar = setTimeout(() => {
        this.hideVerticalScrollBar();
      }, 1000);
    }
  }
  hideHorizontalScrollBar() {
    const visable = this._gantt.parsedOptions.scrollStyle.visible;
    if (visable !== 'focus' && visable !== 'scrolling') {
      return;
    }
    this.hScrollBar.setAttribute('visible', false);
    this.hScrollBar.hideAll();
    this._gantt.scenegraph.updateNextFrame();
  }
  showHorizontalScrollBar(autoHide?: boolean) {
    const visable = this._gantt.parsedOptions.scrollStyle.visible;
    if (visable !== 'focus' && visable !== 'scrolling') {
      return;
    }
    this.hScrollBar.setAttribute('visible', true);
    this.hScrollBar.showAll();
    this._gantt.scenegraph.updateNextFrame();
    if (autoHide) {
      // 滚轮触发滚动条显示后，异步隐藏
      clearTimeout(this._clearHorizontalScrollBar);
      this._clearHorizontalScrollBar = setTimeout(() => {
        this.hideHorizontalScrollBar();
      }, 1000);
    }
  }
  updateVerticalScrollBarPos(topRatio: number) {
    const range = this.vScrollBar.attribute.range;
    const size = range[1] - range[0];
    const range0 = topRatio * (1 - size);
    this.vScrollBar.setAttribute('range', [range0, range0 + size]);
    const bounds = this.vScrollBar.AABBBounds && this.vScrollBar.globalAABBBounds;
    (this.vScrollBar as any)._viewPosition = {
      x: bounds.x1,
      y: bounds.y1
    };
  }
  updateHorizontalScrollBarPos(leftRatio: number) {
    const range = this.hScrollBar.attribute.range;
    const size = range[1] - range[0];
    const range0 = leftRatio * (1 - size);
    this.hScrollBar.setAttribute('range', [range0, range0 + size]);
    const bounds = this.hScrollBar.AABBBounds && this.hScrollBar.globalAABBBounds;
    (this.hScrollBar as any)._viewPosition = {
      x: bounds.x1,
      y: bounds.y1
    };
  }

  /**
   * @description: 更新滚动条尺寸
   * @return {*}
   */
  updateScrollBar() {
    const oldHorizontalBarPos = this._gantt.stateManager.scroll.horizontalBarPos;
    const oldVerticalBarPos = this._gantt.stateManager.scroll.verticalBarPos;

    const scrollStyle = this._gantt.parsedOptions.scrollStyle;
    const width = scrollStyle?.width as number;
    const visible = scrollStyle?.visible as string;
    // const hoverOn = theme.scrollStyle?.hoverOn as boolean;
    const tableWidth = Math.ceil(this._gantt.scenegraph.ganttGroup.attribute.width);
    const tableHeight = Math.ceil(this._gantt.scenegraph.ganttGroup.attribute.height);

    const totalHeight = this._gantt.getAllRowsHeight();
    const totalWidth = this._gantt.getAllDateColsWidth();
    const frozenRowsHeight = this._gantt.getAllHeaderRowsHeight();
    // const frozenColsWidth = this._gantt.getFrozenColsWidth();
    // const bottomFrozenRowsHeight = this._gantt.getBottomFrozenRowsHeight();
    // const rightFrozenColsWidth = this._gantt.getRightFrozenColsWidth();
    if (totalWidth > tableWidth) {
      const y = Math.min(tableHeight, totalHeight);
      const rangeEnd = Math.max(0.05, tableWidth / totalWidth);

      const hoverOn = scrollStyle.hoverOn;

      let attrY = 0;
      if (scrollStyle.barToSide) {
        attrY =
          this._gantt.tableNoFrameHeight -
          (hoverOn ? width : -this._gantt.scenegraph.ganttGroup.attribute.y) +
          this._gantt.tableY;
      } else {
        attrY = y - (hoverOn ? width : -this._gantt.scenegraph.ganttGroup.attribute.y) + this._gantt.tableY;
      }

      this.hScrollBar.setAttributes({
        x: this._gantt.scenegraph.ganttGroup.attribute.x,
        y: attrY,
        width: tableWidth,
        range: [0, rangeEnd],
        visible: visible === 'always'
      });
      const bounds = this.hScrollBar.AABBBounds && this.hScrollBar.globalAABBBounds;
      (this.hScrollBar as any)._viewPosition = {
        x: bounds.x1,
        y: bounds.y1
      };
      if (visible === 'always') {
        this.hScrollBar.showAll();
      }
    } else {
      this.hScrollBar.setAttributes({
        x: -this._gantt.tableNoFrameWidth * 2,
        y: -this._gantt.tableNoFrameHeight * 2,
        width: 0,
        visible: false
      });
    }

    if (totalHeight > tableHeight) {
      const x = Math.min(tableWidth, totalWidth) + this._gantt.scenegraph.ganttGroup.attribute.x;
      const rangeEnd = Math.max(0.05, (tableHeight - frozenRowsHeight) / (totalHeight - frozenRowsHeight));

      let attrX = 0;
      const hoverOn = this._gantt.parsedOptions.scrollStyle.hoverOn;

      if (this._gantt.parsedOptions.scrollStyle.barToSide) {
        attrX = this._gantt.tableNoFrameWidth - (hoverOn ? width : -this._gantt.scenegraph.ganttGroup.attribute.x);
      } else {
        attrX = x - (hoverOn ? width : -this._gantt.scenegraph.ganttGroup.attribute.x);
      }

      this.vScrollBar.setAttributes({
        x: attrX,
        y: frozenRowsHeight + (!hoverOn ? this._gantt.scenegraph.ganttGroup.attribute.y : 0) + this._gantt.tableY,
        height: tableHeight - frozenRowsHeight,
        range: [0, rangeEnd],
        visible: visible === 'always'
      });
      const bounds = this.vScrollBar.AABBBounds && this.vScrollBar.globalAABBBounds;
      (this.vScrollBar as any)._viewPosition = {
        x: bounds.x1,
        y: bounds.y1
      };

      if (visible === 'always') {
        this.vScrollBar.showAll();
      }
    } else {
      this.vScrollBar.setAttributes({
        x: -this._gantt.tableNoFrameWidth * 2,
        y: -this._gantt.tableNoFrameHeight * 2,
        height: 0,
        visible: false
      });
    }

    this._gantt.stateManager.setScrollLeft(oldHorizontalBarPos);
    this._gantt.stateManager.setScrollTop(oldVerticalBarPos);
  }
}
