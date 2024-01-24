import type { ILine, IRect, IGroup, FederatedPointerEvent, Text, IText } from '@src/vrender';
import { createRect, createLine, createText, createGroup, createSymbol } from '@src/vrender';
import { ScrollBar } from '@visactor/vrender-components';
import type { Group } from '../graphic/group';
import { MenuHandler } from './menu';
import { DrillIcon } from './drill-icon';
import { CellMover } from './cell-mover';
import { getColX } from './util';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { SceneEvent } from '../../event/util';
import { getCellEventArgsSet } from '../../event/util';
import type { ListTableAPI } from '../../ts-types';

/**
 * @description: 表格内容外组件
 * @return {*}
 */
export class TableComponent {
  table: BaseTableAPI;

  border: IRect; // 表格外边框
  // selectBorder: IRect; // 表格选择区域边框
  columnResizeLine: ILine; // 表格列宽调整基准线
  columnResizeBgLine: ILine; // 表格列宽调整基准线背景
  columnResizeLabel: IGroup; // 表格列宽调整标记
  menu: MenuHandler; // 表格菜单
  vScrollBar: ScrollBar; // 表格横向滚动条
  hScrollBar: ScrollBar; // 表格纵向滚动条
  frozenShadowLine: IRect; // 表格冻结列右侧阴影块
  drillIcon: DrillIcon; // drill icon
  cellMover: CellMover; // 表格列顺序调整标记

  constructor(table: BaseTableAPI) {
    this.table = table;
    const theme = this.table.theme;

    // 滚动条
    this.createScrollBar();

    // 列宽调整基准线
    const columnResizeColor = theme.columnResize?.lineColor;
    const columnResizeWidth = theme.columnResize?.lineWidth;
    const columnResizeBgColor = theme.columnResize?.bgColor;
    const columnResizeBgWidth = theme.columnResize?.width;
    const labelColor = theme.columnResize?.labelColor;
    const labelFontSize = theme.columnResize?.labelFontSize;
    const labelFontFamily = theme.columnResize?.labelFontFamily;
    const labelBackgroundFill = theme.columnResize?.labelBackgroundFill;
    const labelBackgroundCornerRadius = theme.columnResize?.labelBackgroundCornerRadius;

    this.columnResizeLine = createLine({
      visible: false,
      pickable: false,
      stroke: columnResizeColor as string,
      lineWidth: columnResizeWidth as number,
      x: 0,
      y: 0,
      points: [
        { x: 0, y: 0 },
        { x: 0, y: 0 }
      ]
    });
    this.columnResizeBgLine = createLine({
      visible: false,
      pickable: false,
      stroke: columnResizeBgColor as string,
      lineWidth: columnResizeBgWidth as number,
      x: 0,
      y: 0,
      // dx: -(columnResizeBgWidth - columnResizeWidth) / 2,
      points: [
        { x: 0, y: 0 },
        { x: 0, y: 0 }
      ]
    });

    // 列宽调整文字标签
    const columnResizeLabelText = createText({
      visible: false,
      pickable: false,
      x: 0,
      y: 0,
      fontSize: labelFontSize, // 10
      fill: labelColor,
      fontFamily: labelFontFamily,
      text: '',
      textBaseline: 'top',
      dx: 12 + 4,
      dy: -labelFontSize / 2
    });
    const columnResizeLabelBack = createRect({
      visible: false,
      pickable: false,
      fill: labelBackgroundFill,
      x: 0,
      y: 0,
      width: 5 * labelFontSize * 0.8,
      height: labelFontSize + 8,
      cornerRadius: labelBackgroundCornerRadius,
      dx: 12,
      dy: -labelFontSize / 2 - 4
    });
    this.columnResizeLabel = createGroup({
      visible: false,
      pickable: false,
      x: 0,
      y: 0
    });
    this.columnResizeLabel.appendChild(columnResizeLabelBack);
    this.columnResizeLabel.appendChild(columnResizeLabelText);

    // 列顺序调整基准线
    this.cellMover = new CellMover(this.table);

    // 冻结列阴影
    const shadowWidth = theme.frozenColumnLine?.shadow?.width;
    const shadowStartColor = theme.frozenColumnLine?.shadow?.startColor;
    const shadowEndColor = theme.frozenColumnLine?.shadow?.endColor;
    this.frozenShadowLine = createRect({
      visible: true,
      pickable: false,
      x: 0,
      y: 0,
      width: shadowWidth,
      height: 0,
      fill: {
        gradient: 'linear',
        x0: 0,
        y0: 0,
        x1: 1,
        y1: 0,
        stops: [
          { color: shadowStartColor, offset: 0 },
          { color: shadowEndColor, offset: 1 }
        ]
      }
    });

    // TO BE DONE 冻结列border(theme.frozenColumnLine?.border)

    // 弹出窗口
    // this.menu = createGroup({
    //   visible: false,
    //   pickable: false,
    //   x: 0,
    //   y: 0,
    // });
    this.menu = new MenuHandler(this.table);

    this.drillIcon = new DrillIcon();
  }

  /**
   * @description: 组件mark加入到容器Group中
   * @param {Group} componentGroup
   * @return {*}
   */
  addToGroup(componentGroup: Group) {
    componentGroup.addChild(this.frozenShadowLine);
    // componentGroup.addChild(this.selectBorder);
    componentGroup.addChild(this.columnResizeBgLine);
    componentGroup.addChild(this.columnResizeLine);
    componentGroup.addChild(this.columnResizeLabel);
    if (this.table.theme.scrollStyle.hoverOn) {
      componentGroup.addChild(this.hScrollBar);
      componentGroup.addChild(this.vScrollBar);
    } else {
      componentGroup.stage.defaultLayer.addChild(this.hScrollBar);
      componentGroup.stage.defaultLayer.addChild(this.vScrollBar);
    }
    this.menu.bindTableComponent(componentGroup);
    this.drillIcon.appand(componentGroup);
    this.cellMover.appand(componentGroup);
  }

  /**
   * @description: 创建滚动条组件
   * @return {*}
   */
  createScrollBar() {
    const theme = this.table.theme;
    const scrollRailColor = theme.scrollStyle?.scrollRailColor as string;
    const scrollSliderColor = theme.scrollStyle?.scrollSliderColor as string;
    const width = theme.scrollStyle?.width as number;
    // const visible = theme.scrollStyle?.visible as string;
    // const hoverOn = theme.scrollStyle?.hoverOn as boolean;

    this.hScrollBar = new ScrollBar({
      direction: 'horizontal',
      x: -this.table.tableNoFrameWidth * 2,
      y: -this.table.tableNoFrameHeight * 2,
      width: this.table.tableNoFrameWidth,
      height: width,
      padding: 0,
      railStyle: {
        fill: scrollRailColor
      },
      sliderStyle: {
        fill: scrollSliderColor
      },
      range: [0, 0.1],
      // scrollRange: [0.4, 0.8]
      visible: false
    });
    // hack方案实现初始化隐藏滚动条，也可以add到stage之后执行hideAll
    (this.hScrollBar as any).render();
    this.hScrollBar.hideAll();

    this.vScrollBar = new ScrollBar({
      direction: 'vertical',
      x: -this.table.tableNoFrameWidth * 2,
      y: -this.table.tableNoFrameHeight * 2,
      width,
      height: this.table.tableNoFrameHeight - this.table.getFrozenRowsHeight(),
      padding: 0,
      railStyle: {
        fill: scrollRailColor
      },
      sliderStyle: {
        fill: scrollSliderColor
      },
      range: [0, 0.1],
      visible: false
    });
    (this.vScrollBar as any).render();
    this.vScrollBar.hideAll();
  }

  /**
   * @description: 更新滚动条尺寸
   * @return {*}
   */
  updateScrollBar() {
    const oldHorizontalBarPos = this.table.stateManager.scroll.horizontalBarPos;
    const oldVerticalBarPos = this.table.stateManager.scroll.verticalBarPos;

    const theme = this.table.theme;
    const width = theme.scrollStyle?.width as number;
    const visible = theme.scrollStyle?.visible as string;
    // const hoverOn = theme.scrollStyle?.hoverOn as boolean;
    const tableWidth = Math.ceil(this.table.scenegraph.tableGroup.attribute.width);
    const tableHeight = Math.ceil(this.table.scenegraph.tableGroup.attribute.height);

    const totalHeight = this.table.getAllRowsHeight();
    const totalWidth = this.table.getAllColsWidth();
    const frozenRowsHeight = this.table.getFrozenRowsHeight();
    const frozenColsWidth = this.table.getFrozenColsWidth();
    const bottomFrozenRowsHeight = this.table.getBottomFrozenRowsHeight();
    const rightFrozenColsWidth = this.table.getRightFrozenColsWidth();
    if (totalWidth > tableWidth) {
      const y = Math.min(tableHeight, totalHeight);
      const rangeEnd = Math.max(0.05, (tableWidth - frozenColsWidth) / (totalWidth - frozenColsWidth));
      this.hScrollBar.setAttributes({
        x: frozenColsWidth + (!this.table.theme.scrollStyle.hoverOn ? this.table.scenegraph.tableGroup.attribute.x : 0),
        y: y - (this.table.theme.scrollStyle.hoverOn ? width : -this.table.scenegraph.tableGroup.attribute.y),
        width: tableWidth - frozenColsWidth - rightFrozenColsWidth,
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
        x: -this.table.tableNoFrameWidth * 2,
        y: -this.table.tableNoFrameHeight * 2,
        width: 0,
        visible: false
      });
    }

    if (totalHeight > tableHeight) {
      const x = Math.min(tableWidth, totalWidth);
      const rangeEnd = Math.max(0.05, (tableHeight - frozenRowsHeight) / (totalHeight - frozenRowsHeight));
      this.vScrollBar.setAttributes({
        x: x - (this.table.theme.scrollStyle.hoverOn ? width : -this.table.scenegraph.tableGroup.attribute.x),
        y:
          frozenRowsHeight + (!this.table.theme.scrollStyle.hoverOn ? this.table.scenegraph.tableGroup.attribute.y : 0),
        height: tableHeight - frozenRowsHeight - bottomFrozenRowsHeight,
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
        x: -this.table.tableNoFrameWidth * 2,
        y: -this.table.tableNoFrameHeight * 2,
        height: 0,
        visible: false
      });
    }

    this.table.stateManager.setScrollLeft(oldHorizontalBarPos);
    this.table.stateManager.setScrollTop(oldVerticalBarPos);
  }

  /**
   * @description: 隐藏列宽调整组件
   * @return {*}
   */
  hideResizeCol() {
    // this.columnResizeLine.attribute.visible = false;
    this.columnResizeLine.setAttribute('visible', false);
    this.columnResizeBgLine.setAttribute('visible', false);
    this.columnResizeLabel.setAttribute('visible', false);
    this.columnResizeLabel.hideAll();
  }

  /**
   * @description: 显示列宽调整组件
   * @param {number} col
   * @param {number} y
   * @return {*}
   */
  showResizeCol(col: number, y: number, isRightFrozen?: boolean) {
    // this.columnResizeLine.attribute.visible = false;
    // 基准线
    const colX = getColX(col, this.table, isRightFrozen);
    this.columnResizeLine.setAttributes({
      visible: true,
      x: colX,
      points: [
        { x: 0, y: 0 },
        { x: 0, y: this.table.getRowsHeight(0, this.table.rowCount - 1) }
      ]
    });
    this.columnResizeBgLine.setAttributes({
      visible: true,
      x: colX,
      points: [
        { x: 0, y: 0 },
        { x: 0, y: this.table.getRowsHeight(0, this.table.rowCount - 1) }
      ]
    });

    // 标签
    // this.columnResizeLabel.setAttribute('visible', true);
    this.columnResizeLabel.showAll();
    this.columnResizeLabel.setAttributes({
      visible: true,
      x: colX,
      y
    });
    (this.columnResizeLabel.lastChild as Text).setAttribute('text', `${this.table.getColWidth(col)}px`);
  }

  /**
   * @description: 更新列宽调整组件
   * @param {number} col
   * @param {number} y 标签显示的y坐标
   * @return {*}
   */
  updateResizeCol(col: number, y: number, isRightFrozen?: boolean) {
    // 基准线
    const colX = getColX(col, this.table, isRightFrozen);
    // this.columnResizeLine.setAttribute('x', x);
    this.columnResizeLine.setAttributes({
      x: colX,
      points: [
        { x: 0, y: 0 },
        { x: 0, y: this.table.getRowsHeight(0, this.table.rowCount - 1) } // todo: 优化points赋值
      ]
    });
    this.columnResizeBgLine.setAttributes({
      x: colX,
      points: [
        { x: 0, y: 0 },
        { x: 0, y: this.table.getRowsHeight(0, this.table.rowCount - 1) } // todo: 优化points赋值
      ]
    });

    // 标签
    this.columnResizeLabel.setAttributes({
      x: colX,
      y
    });
    (this.columnResizeLabel.lastChild as Text).setAttribute('text', `${Math.floor(this.table.getColWidth(col))}px`);
  }

  /**
   * @description: 隐藏列顺序调整组件
   * @return {*}
   */
  hideMoveCol() {
    this.cellMover.hide();
  }

  /**
   * @description: 显示列顺序调整组件
   * @param {number} col
   * @param {number} x
   * @return {*}
   */
  showMoveCol(col: number, row: number, delta: number) {
    this.cellMover.show(col, row, delta);
  }

  /**
   * @description: 更新列顺序调整组件
   * @param {number} backX
   * @param {number} lineX
   * @return {*}
   */
  updateMoveCol(backX: number, lineX: number, backY: number, lineY: number) {
    this.cellMover.update(backX, lineX, backY, lineY);
  }

  /**
   * @description: 显示冻结列shadow
   * @param {number} col
   * @return {*}
   */
  setFrozenColumnShadow(col: number, isRightFrozen?: boolean) {
    if (col < 0) {
      this.frozenShadowLine.setAttributes({
        visible: false
      });
    } else {
      // const colX = this.table.getColsWidth(0, col);
      const colX = getColX(col, this.table, isRightFrozen);
      this.frozenShadowLine.setAttributes({
        visible: true,
        x: colX,
        height: this.table.getRowsHeight(0, this.table.rowCount - 1)
      });
    }
  }

  hideVerticalScrollBar() {
    const visable = this.table.theme.scrollStyle.visible;
    if (visable !== 'focus' && visable !== 'scrolling') {
      return;
    }
    this.vScrollBar.setAttribute('visible', false);
    this.vScrollBar.hideAll();
    this.table.scenegraph.updateNextFrame();
  }
  showVerticalScrollBar() {
    const visable = this.table.theme.scrollStyle.visible;
    if (visable !== 'focus' && visable !== 'scrolling') {
      return;
    }
    this.vScrollBar.setAttribute('visible', true);
    this.vScrollBar.showAll();
    this.table.scenegraph.updateNextFrame();
  }
  hideHorizontalScrollBar() {
    const visable = this.table.theme.scrollStyle.visible;
    if (visable !== 'focus' && visable !== 'scrolling') {
      return;
    }
    this.hScrollBar.setAttribute('visible', false);
    this.hScrollBar.hideAll();
    this.table.scenegraph.updateNextFrame();
  }
  showHorizontalScrollBar() {
    const visable = this.table.theme.scrollStyle.visible;
    if (visable !== 'focus' && visable !== 'scrolling') {
      return;
    }
    this.hScrollBar.setAttribute('visible', true);
    this.hScrollBar.showAll();
    this.table.scenegraph.updateNextFrame();
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

  updateStyle() {
    const theme = this.table.theme;

    // scrollbar
    const scrollRailColor = theme.scrollStyle?.scrollRailColor as string;
    const scrollSliderColor = theme.scrollStyle?.scrollSliderColor as string;
    const width = theme.scrollStyle?.width as number;
    this.hScrollBar.setAttributes({
      height: width,
      railStyle: {
        fill: scrollRailColor
      },
      sliderStyle: {
        fill: scrollSliderColor
      }
    });

    this.vScrollBar.setAttributes({
      width,
      railStyle: {
        fill: scrollRailColor
      },
      sliderStyle: {
        fill: scrollSliderColor
      }
    });

    // columnResizeLine & columnResizeBgLine
    const columnResizeColor = theme.columnResize?.lineColor;
    const columnResizeWidth = theme.columnResize?.lineWidth;
    const columnResizeBgColor = theme.columnResize?.bgColor;
    const columnResizeBgWidth = theme.columnResize?.width;

    this.columnResizeLine.setAttributes({
      stroke: columnResizeColor as string,
      lineWidth: columnResizeWidth as number
    });
    this.columnResizeBgLine = createLine({
      stroke: columnResizeBgColor as string,
      lineWidth: columnResizeBgWidth as number
    });

    const labelColor = theme.columnResize?.labelColor;
    const labelFontSize = theme.columnResize?.labelFontSize;
    const labelFontFamily = theme.columnResize?.labelFontFamily;
    const labelBackgroundFill = theme.columnResize?.labelBackgroundFill;
    const labelBackgroundCornerRadius = theme.columnResize?.labelBackgroundCornerRadius;

    // columnResizeLabelBack
    (this.columnResizeLabel.lastChild as IText).setAttributes({
      fontSize: labelFontSize, // 10
      fill: labelColor,
      fontFamily: labelFontFamily,
      dy: -labelFontSize / 2
    });
    // columnResizeLabelText
    (this.columnResizeLabel.firstChild as IRect).setAttributes({
      fill: labelBackgroundFill,
      width: 5 * labelFontSize * 0.8,
      height: labelFontSize + 8,
      cornerRadius: labelBackgroundCornerRadius,
      dy: -labelFontSize / 2 - 4
    });

    // frozenShadowLine
    const shadowWidth = theme.frozenColumnLine?.shadow?.width;
    const shadowStartColor = theme.frozenColumnLine?.shadow?.startColor;
    const shadowEndColor = theme.frozenColumnLine?.shadow?.endColor;
    this.frozenShadowLine.setAttributes({
      width: shadowWidth,
      fill: {
        gradient: 'linear',
        x0: 0,
        y0: 0,
        x1: 1,
        y1: 0,
        stops: [
          { color: shadowStartColor, offset: 0 },
          { color: shadowEndColor, offset: 1 }
        ]
      }
    });

    this.cellMover.updateStyle();
    // this.menu.updateStyle();
    // this.drillIcon.updateStyle();
  }
}
