import { theme } from './../../themes';
import type { ILine, IRect, IGroup, FederatedPointerEvent, Text, IText } from '@src/vrender';
import { createRect, createLine, createText, createGroup, createSymbol } from '@src/vrender';
import { ScrollBar } from '@src/vrender';
import type { Group } from '../graphic/group';
import { MenuHandler } from './menu';
import { DrillIcon } from './drill-icon';
import { CellMover } from './cell-mover';
import { getColX, getRowY } from './util';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { isValid } from '@visactor/vutils';

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
  rowResizeLine: ILine; // 表格列宽调整基准线
  rowResizeBgLine: ILine; // 表格列宽调整基准线背景
  rowResizeLabel: IGroup; // 表格列宽调整标记
  menu: MenuHandler; // 表格菜单
  vScrollBar: ScrollBar; // 表格横向滚动条
  hScrollBar: ScrollBar; // 表格纵向滚动条
  frozenShadowLine: IRect; // 表格冻结列右侧阴影块
  rightFrozenShadowLine: IRect; // 表格右侧冻结列左侧阴影块
  drillIcon: DrillIcon; // drill icon
  cellMover: CellMover; // 表格列顺序调整标记
  labelVisible: boolean; // 是否显示label
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
    const labelVisible = theme.columnResize?.labelVisible ?? true;
    const labelColor = theme.columnResize?.labelColor;
    const labelFontSize = theme.columnResize?.labelFontSize;
    const labelFontFamily = theme.columnResize?.labelFontFamily;
    const labelBackgroundFill = theme.columnResize?.labelBackgroundFill;
    const labelBackgroundCornerRadius = theme.columnResize?.labelBackgroundCornerRadius;

    this.labelVisible = labelVisible;

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

    this.rowResizeLine = createLine({
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
    this.rowResizeBgLine = createLine({
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
    const rowResizeLabelText = createText({
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
    const rowResizeLabelBack = createRect({
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
    this.rowResizeLabel = createGroup({
      visible: false,
      pickable: false,
      x: 0,
      y: 0
    });
    this.rowResizeLabel.appendChild(rowResizeLabelBack);
    this.rowResizeLabel.appendChild(rowResizeLabelText);
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
    this.rightFrozenShadowLine = createRect({
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
          { color: shadowEndColor, offset: 0 },
          { color: shadowStartColor, offset: 1 }
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
    componentGroup.addChild(this.rightFrozenShadowLine);
    // componentGroup.addChild(this.selectBorder);
    componentGroup.addChild(this.columnResizeBgLine);
    componentGroup.addChild(this.columnResizeLine);
    componentGroup.addChild(this.columnResizeLabel);
    componentGroup.addChild(this.rowResizeBgLine);
    componentGroup.addChild(this.rowResizeLine);
    componentGroup.addChild(this.rowResizeLabel);

    const hoverOn = this.table.theme.scrollStyle.hoverOn;
    if (hoverOn && !this.table.theme.scrollStyle.barToSide) {
      componentGroup.addChild(this.hScrollBar);
      componentGroup.addChild(this.vScrollBar);
    } else {
      componentGroup.stage.defaultLayer.addChild(this.hScrollBar);
      componentGroup.stage.defaultLayer.addChild(this.vScrollBar);

      // // add scroll bar before border, avoid scroll hide by border globalCompositeOperation
      // componentGroup.stage.defaultLayer.insertBefore(this.vScrollBar, componentGroup.stage.defaultLayer.firstChild);
      // componentGroup.stage.defaultLayer.insertBefore(this.hScrollBar, componentGroup.stage.defaultLayer.firstChild);
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
    const scrollSliderCornerRadius = theme.scrollStyle?.scrollSliderCornerRadius;
    const width = theme.scrollStyle?.width as number;
    const horizontalPadding = theme.scrollStyle?.horizontalPadding;
    const verticalPadding = theme.scrollStyle?.verticalPadding;

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
    // const visible = theme.scrollStyle?.visible as string;
    // const hoverOn = theme.scrollStyle?.hoverOn as boolean;

    this.hScrollBar = new ScrollBar({
      direction: 'horizontal',
      x: -this.table.tableNoFrameWidth * 2,
      y: -this.table.tableNoFrameHeight * 2,
      width: this.table.tableNoFrameWidth,
      height: width,
      padding: horizontalPadding,
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
      x: -this.table.tableNoFrameWidth * 2,
      y: -this.table.tableNoFrameHeight * 2,
      width,
      height: this.table.tableNoFrameHeight - this.table.getFrozenRowsHeight(),
      padding: verticalPadding,
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

  /**
   * @description: 更新滚动条尺寸
   * @return {*}
   */
  updateScrollBar() {
    const oldHorizontalBarPos = this.table.stateManager.scroll.horizontalBarPos;
    const oldVerticalBarPos = this.table.stateManager.scroll.verticalBarPos;

    const theme = this.table.theme;
    const width = theme.scrollStyle?.width as number;
    const visible1 = theme.scrollStyle?.visible as string;
    const horizontalVisible = theme.scrollStyle?.horizontalVisible ?? visible1;
    const verticalVisible = theme.scrollStyle?.verticalVisible ?? visible1;
    // const hoverOn = theme.scrollStyle?.hoverOn as boolean;
    const tableWidth = Math.ceil(this.table.scenegraph.tableGroup.attribute.width);
    const tableHeight = Math.ceil(this.table.scenegraph.tableGroup.attribute.height);

    const totalHeight = this.table.getAllRowsHeight();
    const totalWidth = this.table.getAllColsWidth();
    const frozenRowsHeight = this.table.getFrozenRowsHeight();
    const frozenColsWidth = this.table.getFrozenColsWidth();
    const bottomFrozenRowsHeight = this.table.getBottomFrozenRowsHeight();
    const rightFrozenColsWidth = this.table.getRightFrozenColsWidth();

    // _disableColumnAndRowSizeRound环境中，可能出现
    // getAllColsWidth/getAllRowsHeight(A) + getAllColsWidth/getAllRowsHeight(B) < getAllColsWidth/getAllRowsHeight(A+B)
    // （由于小数在取数时被省略）
    // 这里加入tolerance，避免出现无用滚动
    const sizeTolerance = this.table.options.customConfig?._disableColumnAndRowSizeRound ? 1 : 0;
    if (totalWidth > tableWidth + sizeTolerance) {
      const y = Math.min(tableHeight, totalHeight);
      const rangeEnd = Math.max(0.05, (tableWidth - frozenColsWidth) / (totalWidth - frozenColsWidth));

      const hoverOn = this.table.theme.scrollStyle.hoverOn;

      let attrY = 0;
      if (this.table.theme.scrollStyle.barToSide) {
        attrY =
          this.table.tableNoFrameHeight -
          (hoverOn ? width : -this.table.scenegraph.tableGroup.attribute.y) +
          this.table.tableY;
      } else {
        attrY = y - (hoverOn ? width : -this.table.scenegraph.tableGroup.attribute.y);
      }

      this.hScrollBar.setAttributes({
        x: frozenColsWidth + (!hoverOn ? this.table.scenegraph.tableGroup.attribute.x : 0),
        y: attrY,
        width: tableWidth - frozenColsWidth - rightFrozenColsWidth,
        range: [0, rangeEnd],
        visible: horizontalVisible === 'always'
      });
      const bounds = this.hScrollBar.AABBBounds && this.hScrollBar.globalAABBBounds;
      (this.hScrollBar as any)._viewPosition = {
        x: bounds.x1,
        y: bounds.y1
      };
      if (horizontalVisible === 'always') {
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

    if (totalHeight > tableHeight + sizeTolerance) {
      const x = Math.min(tableWidth, totalWidth);
      const rangeEnd = Math.max(0.05, (tableHeight - frozenRowsHeight) / (totalHeight - frozenRowsHeight));

      let attrX = 0;
      const hoverOn = this.table.theme.scrollStyle.hoverOn;

      if (this.table.theme.scrollStyle.barToSide) {
        attrX =
          this.table.tableNoFrameWidth -
          (hoverOn ? width : -this.table.scenegraph.tableGroup.attribute.x) +
          this.table.tableX;
      } else {
        attrX = x - (hoverOn ? width : -this.table.scenegraph.tableGroup.attribute.x);
      }

      this.vScrollBar.setAttributes({
        x: attrX,
        y: frozenRowsHeight + (!hoverOn ? this.table.scenegraph.tableGroup.attribute.y : 0),
        height: tableHeight - frozenRowsHeight - bottomFrozenRowsHeight,
        range: [0, rangeEnd],
        visible: verticalVisible === 'always'
      });
      const bounds = this.vScrollBar.AABBBounds && this.vScrollBar.globalAABBBounds;
      (this.vScrollBar as any)._viewPosition = {
        x: bounds.x1,
        y: bounds.y1
      };

      if (verticalVisible === 'always') {
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
    if (this.labelVisible) {
      this.columnResizeLabel.showAll();
      this.columnResizeLabel.setAttributes({
        visible: true,
        x: colX,
        y
      });
      (this.columnResizeLabel.lastChild as Text).setAttribute('text', `${this.table.getColWidth(col)}px`);
    }
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
    if (this.labelVisible) {
      this.columnResizeLabel.setAttributes({
        x: colX,
        y
      });
      (this.columnResizeLabel.lastChild as Text).setAttribute('text', `${Math.floor(this.table.getColWidth(col))}px`);
    }
  }

  /**
   * @description: 隐藏列宽调整组件
   * @return {*}
   */
  hideResizeRow() {
    // this.columnResizeLine.attribute.visible = false;
    this.rowResizeLine.setAttribute('visible', false);
    this.rowResizeBgLine.setAttribute('visible', false);
    this.rowResizeLabel.setAttribute('visible', false);
    this.rowResizeLabel.hideAll();
  }

  /**
   * @description: 显示列宽调整组件
   * @param {number} col
   * @param {number} y
   * @return {*}
   */
  showResizeRow(row: number, x: number, isRightFrozen?: boolean) {
    // 基准线
    const rowY = getRowY(row, this.table, isRightFrozen);
    this.rowResizeLine.setAttributes({
      visible: true,
      y: rowY,
      points: [
        { y: 0, x: 0 },
        { y: 0, x: this.table.getColsWidth(0, this.table.colCount - 1) }
      ]
    });
    this.rowResizeBgLine.setAttributes({
      visible: true,
      y: rowY,
      points: [
        { y: 0, x: 0 },
        { y: 0, x: this.table.getColsWidth(0, this.table.colCount - 1) }
      ]
    });

    if (this.labelVisible) {
      // 标签
      this.rowResizeLabel.showAll();
      this.rowResizeLabel.setAttributes({
        visible: true,
        y: rowY,
        x
      });
      (this.rowResizeLabel.lastChild as Text).setAttribute('text', `${this.table.getRowHeight(row)}px`);
    }
  }

  /**
   * @description: 更新列宽调整组件
   * @param {number} col
   * @param {number} y 标签显示的y坐标
   * @return {*}
   */
  updateResizeRow(row: number, x: number, isBottomFrozen?: boolean) {
    // 基准线
    const rowY = getRowY(row, this.table, isBottomFrozen);
    // this.columnResizeLine.setAttribute('x', x);
    this.rowResizeLine.setAttributes({
      y: rowY,
      points: [
        { y: 0, x: 0 },
        { y: 0, x: this.table.getColsWidth(0, this.table.colCount - 1) } // todo: 优化points赋值
      ]
    });
    this.rowResizeBgLine.setAttributes({
      y: rowY,
      points: [
        { y: 0, x: 0 },
        { y: 0, x: this.table.getColsWidth(0, this.table.colCount - 1) } // todo: 优化points赋值
      ]
    });

    if (this.labelVisible) {
      // 标签
      this.rowResizeLabel.setAttributes({
        y: rowY,
        x
      });
      (this.rowResizeLabel.lastChild as Text).setAttribute('text', `${Math.floor(this.table.getRowHeight(row))}px`);
    }
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
    return this.cellMover.show(col, row, delta);
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
        height: this.table.getDrawRange().height
      });
    }
  }

  /**
   * @description: 显示右侧冻结列shadow
   * @param {number} col
   * @return {*}
   */
  setRightFrozenColumnShadow(col: number) {
    if (col >= this.table.colCount) {
      this.rightFrozenShadowLine.setAttributes({
        visible: false
      });
    } else {
      // const colX = this.table.getColsWidth(0, col);
      const colX = getColX(col, this.table, true);
      this.rightFrozenShadowLine.setAttributes({
        visible: true,
        x: colX - this.rightFrozenShadowLine.attribute.width,
        height: this.table.getDrawRange().height
      });
    }
  }

  hideVerticalScrollBar() {
    const visible1 = this.table.theme.scrollStyle.visible;
    const verticalVisible = this.table.theme.scrollStyle.verticalVisible ?? visible1;
    if (verticalVisible !== 'focus' && verticalVisible !== 'scrolling') {
      return;
    }
    this.vScrollBar.setAttribute('visible', false);
    this.vScrollBar.hideAll();
    this.table.scenegraph.updateNextFrame();
  }
  showVerticalScrollBar() {
    const visible1 = this.table.theme.scrollStyle.visible;
    const verticalVisible = this.table.theme.scrollStyle.verticalVisible ?? visible1;
    if (verticalVisible !== 'focus' && verticalVisible !== 'scrolling') {
      return;
    }
    this.vScrollBar.setAttribute('visible', true);
    this.vScrollBar.showAll();
    this.table.scenegraph.updateNextFrame();
  }
  hideHorizontalScrollBar() {
    const visible1 = this.table.theme.scrollStyle.visible;
    const horizontalVisible = this.table.theme.scrollStyle.horizontalVisible ?? visible1;
    if (horizontalVisible !== 'focus' && horizontalVisible !== 'scrolling') {
      return;
    }
    this.hScrollBar.setAttribute('visible', false);
    this.hScrollBar.hideAll();
    this.table.scenegraph.updateNextFrame();
  }
  showHorizontalScrollBar() {
    const visible1 = this.table.theme.scrollStyle.visible;
    const horizontalVisible = this.table.theme.scrollStyle.horizontalVisible ?? visible1;
    if (horizontalVisible !== 'focus' && horizontalVisible !== 'scrolling') {
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
    const scrollSliderCornerRadius = theme.scrollStyle?.scrollSliderCornerRadius;
    const width = theme.scrollStyle?.width as number;
    const horizontalPadding = theme.scrollStyle?.horizontalPadding;
    const verticalPadding = theme.scrollStyle?.verticalPadding;

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
    this.hScrollBar.setAttributes({
      height: width,
      padding: horizontalPadding,
      railStyle: {
        fill: scrollRailColor
      },
      sliderStyle
    });

    this.vScrollBar.setAttributes({
      width,
      padding: verticalPadding,
      railStyle: {
        fill: scrollRailColor
      },
      sliderStyle
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
    const labelVisible = theme.columnResize?.labelVisible ?? true;
    this.labelVisible = labelVisible;

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

    // rowResizeLabelBack
    (this.rowResizeLabel.lastChild as IText).setAttributes({
      fontSize: labelFontSize, // 10
      fill: labelColor,
      fontFamily: labelFontFamily,
      dy: -labelFontSize / 2
    });
    // rowResizeLabelText
    (this.rowResizeLabel.firstChild as IRect).setAttributes({
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
    this.rightFrozenShadowLine.setAttributes({
      width: shadowWidth,
      fill: {
        gradient: 'linear',
        x0: 0,
        y0: 0,
        x1: 1,
        y1: 0,
        stops: [
          { color: shadowEndColor, offset: 0 },
          { color: shadowStartColor, offset: 1 }
        ]
      }
    });

    this.cellMover.updateStyle();
    // this.menu.updateStyle();
    // this.drillIcon.updateStyle();
  }
}
