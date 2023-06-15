import type { ILine, IRect, IGroup } from '@visactor/vrender';
import { createRect, createLine, createText, createGroup, createSymbol } from '@visactor/vrender';
import { ScrollBar } from '@visactor/vrender-components';
import type { Group } from '../graphic/group';
import type { WrapText } from '../graphic/text';
import { MenuHandler } from './menu';
import { DrillIcon } from './drill-icon';
import { CellMover } from './cell-mover';
import { getColX } from './util';
import type { BaseTableAPI } from '../../ts-types/base-table';

/**
 * @description: 表格内容外组件
 * @return {*}
 */
export class TableComponent {
  table: BaseTableAPI;

  border: IRect; // 表格外边框
  // selectBorder: IRect; // 表格选择区域边框
  columnResizerLine: ILine; // 表格列宽调整基准线
  columnResizerBgLine: ILine; // 表格列宽调整基准线背景
  columnResizerLabel: IGroup; // 表格列宽调整标记
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
    const columnResizerColor = theme.columnResize?.lineColor;
    const columnResizerWidth = theme.columnResize?.lineWidth;
    const columnResizerBgColor = theme.columnResize?.bgColor;
    const columnResizerBgWidth = theme.columnResize?.width;
    this.columnResizerLine = createLine({
      visible: false,
      pickable: false,
      stroke: columnResizerColor as string,
      lineWidth: columnResizerWidth as number,
      x: 0,
      y: 0,
      points: [
        { x: 0, y: 0 },
        { x: 0, y: 0 }
      ]
    });
    this.columnResizerBgLine = createLine({
      visible: false,
      pickable: false,
      stroke: columnResizerBgColor as string,
      lineWidth: columnResizerBgWidth as number,
      x: 0,
      y: 0,
      // dx: -(columnResizerBgWidth - columnResizerWidth) / 2,
      points: [
        { x: 0, y: 0 },
        { x: 0, y: 0 }
      ]
    });

    // 列宽调整文字标签
    const columnResizerLabelText = createText({
      visible: false,
      pickable: false,
      x: 0,
      y: 0,
      fontSize: 10,
      fill: '#FFF',
      text: '',
      textBaseline: 'top',
      dx: 12 + 4,
      dy: -8 + 2
    });
    const columnResizerLabelBack = createRect({
      visible: false,
      pickable: false,
      fill: '#3073F2',
      x: 0,
      y: 0,
      width: 38,
      height: 16,
      borderRadius: 5,
      dx: 12,
      dy: -8
    });
    this.columnResizerLabel = createGroup({
      visible: false,
      pickable: false,
      x: 0,
      y: 0
    });
    this.columnResizerLabel.appendChild(columnResizerLabelBack);
    this.columnResizerLabel.appendChild(columnResizerLabelText);

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
    componentGroup.addChild(this.columnResizerBgLine);
    componentGroup.addChild(this.columnResizerLine);
    componentGroup.addChild(this.columnResizerLabel);
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
    const oldHorizontalBarPos = this.table.stateManeger.scroll.horizontalBarPos;
    const oldVerticalBarPos = this.table.stateManeger.scroll.verticalBarPos;

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
    if (totalWidth > tableWidth) {
      const y = Math.min(tableHeight, totalHeight);
      const rangeEnd = Math.max(0.05, (tableWidth - frozenColsWidth) / (totalWidth - frozenColsWidth));
      this.hScrollBar.setAttributes({
        x: frozenColsWidth,
        y: y - (this.table.theme.scrollStyle.hoverOn ? width : 0),
        width: tableWidth - frozenColsWidth,
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
    }

    if (totalHeight > tableHeight) {
      const x = Math.min(tableWidth, totalWidth);
      const rangeEnd = Math.max(0.05, (tableHeight - frozenRowsHeight) / (totalHeight - frozenRowsHeight));
      this.vScrollBar.setAttributes({
        x: x - (this.table.theme.scrollStyle.hoverOn ? width : 0),
        y: frozenRowsHeight,
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
    }

    this.table.stateManeger.setScrollLeft(oldHorizontalBarPos);
    this.table.stateManeger.setScrollTop(oldVerticalBarPos);
  }

  /**
   * @description: 隐藏列宽调整组件
   * @return {*}
   */
  hideResizeCol() {
    // this.columnResizerLine.attribute.visible = false;
    this.columnResizerLine.setAttribute('visible', false);
    this.columnResizerBgLine.setAttribute('visible', false);
    this.columnResizerLabel.setAttribute('visible', false);
    this.columnResizerLabel.hideAll();
  }

  /**
   * @description: 显示列宽调整组件
   * @param {number} col
   * @param {number} y
   * @return {*}
   */
  showResizeCol(col: number, y: number) {
    // this.columnResizerLine.attribute.visible = false;
    // 基准线
    const colX = getColX(col, this.table);
    this.columnResizerLine.setAttributes({
      visible: true,
      x: colX,
      points: [
        { x: 0, y: 0 },
        { x: 0, y: this.table.getRowsHeight(0, this.table.rowCount - 1) }
      ]
    });
    this.columnResizerBgLine.setAttributes({
      visible: true,
      x: colX,
      points: [
        { x: 0, y: 0 },
        { x: 0, y: this.table.getRowsHeight(0, this.table.rowCount - 1) }
      ]
    });

    // 标签
    // this.columnResizerLabel.setAttribute('visible', true);
    this.columnResizerLabel.showAll();
    this.columnResizerLabel.setAttributes({
      visible: true,
      x: colX,
      y
    });
    (this.columnResizerLabel.lastChild as WrapText).setAttribute('text', `${this.table.getColWidth(col)}px`);
  }

  /**
   * @description: 更新列宽调整组件
   * @param {number} col
   * @param {number} y 标签显示的y坐标
   * @return {*}
   */
  updateResizeCol(col: number, y: number) {
    // 基准线
    const colX = getColX(col, this.table);
    // this.columnResizerLine.setAttribute('x', x);
    this.columnResizerLine.setAttributes({
      x: colX,
      points: [
        { x: 0, y: 0 },
        { x: 0, y: this.table.getRowsHeight(0, this.table.rowCount - 1) } // todo: 优化points赋值
      ]
    });
    this.columnResizerBgLine.setAttributes({
      x: colX,
      points: [
        { x: 0, y: 0 },
        { x: 0, y: this.table.getRowsHeight(0, this.table.rowCount - 1) } // todo: 优化points赋值
      ]
    });

    // 标签
    this.columnResizerLabel.setAttributes({
      x: colX,
      y
    });
    (this.columnResizerLabel.lastChild as WrapText).setAttribute(
      'text',
      `${Math.floor(this.table.getColWidth(col))}px`
    );
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
  setFrozenColumnShadow(col: number) {
    if (col < 0) {
      this.frozenShadowLine.setAttributes({
        visible: false
      });
    } else {
      const colX = this.table.getColsWidth(0, col);
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
    this.hScrollBar.setAttribute('range', [leftRatio, leftRatio + size]);
    const bounds = this.hScrollBar.AABBBounds && this.hScrollBar.globalAABBBounds;
    (this.hScrollBar as any)._viewPosition = {
      x: bounds.x1,
      y: bounds.y1
    };
  }
}
