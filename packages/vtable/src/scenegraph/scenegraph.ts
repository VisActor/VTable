import type { IStage, IRect, ITextCache } from '@visactor/vrender';
import { createStage, createRect, IContainPointMode, container } from '@visactor/vrender';
import type { CellType, ColumnIconOption } from '../ts-types';
import { Group } from './graphic/group';
import type { Icon } from './graphic/icon';
import {
  createBodyColGroup,
  createColHeaderColGroup,
  createCornerHeaderColGroup,
  createRowHeaderColGroup
} from './group-creater/column';
import type { WrapText } from './graphic/text';
import { updateAutoRowHeight } from './layout/auto-height';
import { getCellMergeInfo } from './utils/get-cell-merge';
import { updateColWidth } from './layout/update-width';
import { TableComponent } from './component/table-component';
import { updateRowHeight } from './layout/update-height';
import { updateImageCellContentWhileResize } from './group-creater/cell-type/image-cell';
import { getPadding } from './utils/padding';
import { createFrameBorder } from './style/frame-border';
import { ResizeColumnHotSpotSize } from '../tools/global';
import splitModule from './graphic/contributions';
import { getProp } from './utils/get-prop';
import { dealWithIcon } from './utils/text-icon-layout';
import { SceneProxy } from './group-creater/progress/proxy';
import { SortOrder } from '../state/state';
import type { TooltipOptions } from '../ts-types/tooltip';
import { computeColWidth, computeColsWidth } from './layout/compute-col-width';
import { moveHeaderPosition } from './layout/move-cell';
import { updateCell } from './group-creater/cell-helper';
import type { BaseTableAPI } from '../ts-types/base-table';
import { updateAllSelectComponent, updateCellSelectBorder } from './select/update-select-border';
import { createCellSelectBorder } from './select/create-select-border';
import { moveSelectingRangeComponentsToSelectedRangeComponents } from './select/move-select-border';
import { deleteAllSelectBorder, deleteLastSelectedRangeComponents } from './select/delete-select-border';

container.load(splitModule);

export const groupForDebug = new Group({});
groupForDebug.role = 'empty';
/**
 * @description: 表格场景树，存储和管理表格全部的场景图元
 * @return {*}
 */
export class Scenegraph {
  proxy: SceneProxy;
  tableGroup: Group; // 表格全局Group
  colHeaderGroup: Group; // 列表头Group
  cornerHeaderGroup: Group; // 列表头冻结列Group
  rowHeaderGroup: Group; // 行表头Group
  bodyGroup: Group; // 内容Group
  componentGroup: Group; // 表格外组件Group
  /** 所有选中区域对应的选框组件 */
  selectedRangeComponents: Map<string, { rect: IRect; role: CellType }>;
  /** 当前正在选择区域对应的选框组件 为什么是map 以为可能一个选中区域会被拆分为多个rect组件 三块表头和body都分别对应不同组件*/
  selectingRangeComponents: Map<string, { rect: IRect; role: CellType }>;
  lastSelectId: string;
  component: TableComponent;
  stage: IStage;
  table: BaseTableAPI;
  isPivot: boolean;
  transpose: boolean;
  hasFrozen: boolean; // 是否已经处理冻结列，用在getCell判断是否从cornerHeaderGroup获取cellGroup
  frozenColCount: number;
  frozenRowCount: number;
  clear: boolean;

  constructor(table: BaseTableAPI) {
    this.table = table;
    this.hasFrozen = false;
    this.clear = true;

    this.stage = createStage({
      canvas: table.canvas,
      width: table.canvas.width,
      height: table.canvas.height,
      disableDirtyBounds: false,
      background: table.theme.underlayBackgroundColor
    });

    this.stage.defaultLayer.setTheme({
      group: {
        boundsPadding: 0,
        strokeBoundsBuffer: 0,
        lineJoin: 'round'
      }
    });
    this.initSceneGraph();
    this.stage.defaultLayer.add(this.tableGroup);

    (this.stage as any).table = this.table;

    this.createComponent();
  }

  get width(): number {
    return this.tableGroup.attribute?.width ?? 0;
  }

  get height(): number {
    return this.tableGroup.attribute?.height ?? 0;
  }

  get x(): number {
    return this.tableGroup.attribute?.x ?? 0;
  }

  get y(): number {
    return this.tableGroup.attribute?.y ?? 0;
  }

  get bodyRowStart(): number {
    if (this.transpose || this.isPivot) {
      return this.table.columnHeaderLevelCount;
    }
    return this.proxy.rowStart ?? 0;
  }

  get bodyRowEnd(): number {
    if (this.transpose || this.isPivot) {
      return this.table.rowCount - 1;
    }
    return this.proxy.rowEnd ?? 0;
  }

  /**
   * @description: 初始化场景树结构
   * @return {*}
   */
  initSceneGraph() {
    this.isPivot = this.table.isPivotTable();
    this.transpose = (this.table.options as any).transpose; // 初始化时this.table.transpose还未赋值

    const width = this.table.tableNoFrameWidth;
    const height = this.table.tableNoFrameHeight;

    this.tableGroup = new Group({ x: 0, y: 0, width, height, clip: true, pickable: false });
    this.tableGroup.role = 'table';

    const colHeaderGroup = new Group({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      clip: false,
      pickable: false
    });
    colHeaderGroup.role = 'col-header';
    this.colHeaderGroup = colHeaderGroup;

    const cornerHeaderGroup = new Group({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      clip: false,
      pickable: false
    });
    cornerHeaderGroup.role = 'corner-header';
    this.cornerHeaderGroup = cornerHeaderGroup;

    const rowHeaderGroup = new Group({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      clip: false,
      pickable: false
    });
    rowHeaderGroup.role = 'row-header';
    this.rowHeaderGroup = rowHeaderGroup;

    const bodyGroup = new Group({
      x: 0,
      y: 0,
      width,
      height: 0,
      clip: false,
      pickable: false
    });
    bodyGroup.role = 'body';
    this.bodyGroup = bodyGroup;

    const componentGroup = new Group({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      clip: false,
      pickable: false,
      childrenPickable: true
    });
    componentGroup.role = 'component';
    this.componentGroup = componentGroup;

    this.tableGroup.addChild(bodyGroup);
    this.tableGroup.addChild(rowHeaderGroup);
    this.tableGroup.addChild(colHeaderGroup);
    this.tableGroup.addChild(cornerHeaderGroup);
    this.tableGroup.addChild(componentGroup);
  }

  /**
   * @description: 初始化表格外组件
   * @return {*}
   */
  createComponent() {
    this.component = new TableComponent(this.table);
    this.component.addToGroup(this.componentGroup);
    this.selectedRangeComponents = new Map();
    this.selectingRangeComponents = new Map();
  }

  /**
   * @description: 依据数据创建表格场景树
   * @return {*}
   */
  createSceneGraph() {
    this.clear = false;
    computeColsWidth(this.table);

    this.frozenColCount = this.table.rowHeaderLevelCount;
    this.frozenRowCount = this.table.columnHeaderLevelCount;

    this.proxy = new SceneProxy(this.table);

    // 首屏表头全量
    this.createHeaderSceneGraph();
    // body生成首屏
    if (this.transpose || this.isPivot) {
      this.createBodySceneGraph();
    } else {
      this.createBodySceneGraphForFirstScreen();
    }
  }

  createHeaderSceneGraph() {
    createCornerHeaderColGroup(this.cornerHeaderGroup, 0, 0, this.table);
    this.colHeaderGroup.setAttribute('x', this.cornerHeaderGroup.attribute.width);
    createColHeaderColGroup(this.colHeaderGroup, 0, 0, this.table);
  }

  createBodySceneGraph() {
    // 依据列表头高度更新行表头Group y
    this.rowHeaderGroup.setAttribute('y', this.colHeaderGroup.attribute.height);
    createRowHeaderColGroup(this.rowHeaderGroup, 0, 0, this.table);

    // 依据列表头高度和行表头宽度，更新内容Group xy
    this.bodyGroup.setAttributes({
      y: this.colHeaderGroup.attribute.height,
      x: this.rowHeaderGroup.attribute.width
    });
    createBodyColGroup(this.bodyGroup, 0, 0, this.table);
    this.afterScenegraphCreated();
  }

  createBodySceneGraphForFirstScreen() {
    // 依据列表头高度更新行表头Group y
    this.rowHeaderGroup.setAttribute('y', this.colHeaderGroup.attribute.height);
    // createRowHeaderColGroup(this.rowHeaderGroup, 0, 0, this.table);
    // this.proxy.createBodyColGroupForFirstScreen(this.rowHeaderGroup, 0, 0, this.table, 'rowHeader');

    // 依据列表头高度和行表头宽度，更新内容Group xy
    this.bodyGroup.setAttributes({
      y: this.colHeaderGroup.attribute.height,
      x: this.rowHeaderGroup.attribute.width
    });
    console.log('before-createBodyColGroupForFirstScreen');
    this.proxy.createColGroupForFirstScreen(this.rowHeaderGroup, this.bodyGroup, 0, 0, this.table);
    console.log('after-createBodyColGroupForFirstScreen');
    this.afterScenegraphCreated();
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
   * @description: 获取指定行列位置的cell group
   * @param {number} col
   * @param {number} row
   * @return {Group}
   */
  getCellOld(col: number, row: number): Group {
    // hasFrozen处理前，列表头的冻结部分在colHeaderGroup中
    // hasFrozen处理后，列表头的冻结部分在cornerHeaderGroup中
    // 因此在获取cell时需要区别hasFrozen时机
    let element: Group;
    if (this.hasFrozen && col < this.table.frozenColCount && row < this.table.frozenRowCount) {
      element = this.cornerHeaderGroup.getChildAt(col)?.getChildAt(row) as Group;
    } else if (row < this.table.frozenRowCount) {
      // element = (this as any).tableGroup.children[0]?.children[col]?.children[row];
      element = this.colHeaderGroup
        .getChildAt(this.hasFrozen ? col - this.table.frozenColCount : col)
        ?.getChildAt(row) as Group;
    } else if (col < this.table.frozenColCount) {
      // element = (this as any).tableGroup.children[1]?.children[col]?.children[
      //   row - this.table.frozenRowCount
      // ];
      element = this.rowHeaderGroup.getChildAt(col)?.getChildAt(row - this.table.frozenRowCount) as Group;
    } else {
      // element = (this as any).tableGroup.children[2]?.children[col - this.table.frozenColCount]
      //   ?.children[row - this.table.frozenRowCount];
      element = this.bodyGroup
        .getChildAt(col - this.table.frozenColCount)
        ?.getChildAt(row - this.table.frozenRowCount) as Group;
    }

    if (element && element.role === 'shadow-cell') {
      const range = this.table.getCellRange(col, row);
      element = this.getCell(range.start.col, range.start.row);
    }

    return element || undefined;
  }

  getColGroupOld(col: number, isHeader = false): Group {
    let element: Group;
    if (col < this.frozenColCount && isHeader) {
      element = this.cornerHeaderGroup.getChildAt(col) as Group;
    } else if (col < this.frozenColCount) {
      element = this.rowHeaderGroup.getChildAt(col) as Group;
    } else if (isHeader) {
      element = this.rowHeaderGroup.getChildAt(col - this.frozenColCount) as Group;
    } else {
      element = this.bodyGroup.getChildAt(col - this.frozenColCount) as Group;
    }
    return element || undefined;
  }

  /**
   * @description: 获取指定行列位置的cell group
   * @param {number} col
   * @param {number} row
   * @return {Group}
   */
  getCell(col: number, row: number, getShadow?: boolean): Group {
    // hasFrozen处理前，列表头的冻结部分在colHeaderGroup中
    // hasFrozen处理后，列表头的冻结部分在cornerHeaderGroup中
    // 因此在获取cell时需要区别hasFrozen时机
    let cell = this.getColGroup(col, row < this.frozenRowCount)?.getRowGroup(row);
    if (cell && cell.role === 'shadow-cell' && !getShadow) {
      const range = this.table.getCellRange(col, row);
      cell = this.getCell(range.start.col, range.start.row);
    }

    return cell || groupForDebug;
  }

  highPerformanceGetCell(col: number, row: number): Group {
    if (!this.isPivot && !this.transpose && !this.table.isHeader(col, row)) {
      return this.proxy.highPerformanceGetCell(col, row);
    }
    return this.getCell(col, row);
  }

  getColGroup(col: number, isCornerOrColHeader = false): Group {
    let element: Group;
    if (col < this.frozenColCount && isCornerOrColHeader) {
      element = this.cornerHeaderGroup.getColGroup(col) as Group;
    } else if (col < this.frozenColCount) {
      element = this.rowHeaderGroup.getColGroup(col) as Group;
    } else if (isCornerOrColHeader) {
      element = this.colHeaderGroup.getColGroup(col) as Group;
    } else {
      element = this.bodyGroup.getColGroup(col) as Group;
    }
    return element || undefined;
  }

  /**
   * @description: 获取指定行列位置的cell的宽高，主要处理merge情况
   * @param {number} col
   * @param {number} row
   * @return {Group}
   */
  getCellSize(col: number, row: number): { width: number; height: number } {
    const cell = this.getCell(col, row);
    const mergeInfo = getCellMergeInfo(this.table, col, row);
    let width = cell.attribute.width;
    let height = cell.attribute.height;
    if (mergeInfo) {
      width = width / (mergeInfo.end.col - mergeInfo.start.col + 1);
      height = height / (mergeInfo.end.row - mergeInfo.start.row + 1);
    }
    return { width, height };
  }

  /**
   * @description: 触发下一帧渲染
   * @return {*}
   */
  updateNextFrame() {
    // to do
    // this.table.invalidate();
    this.resetAllSelectComponent();

    this.stage.renderNextFrame();
  }
  resetAllSelectComponent() {
    updateAllSelectComponent(this);
  }

  hideHoverIcon(col: number, row: number) {
    if (col === -1 || row === -1) {
      return;
    }
    const cellGroup = this.getCell(col, row);
    hideIcon(this, cellGroup, 'mouseenter_cell');
  }
  showHoverIcon(col: number, row: number) {
    if (col === -1 || row === -1) {
      return;
    }
    const cellGroup = this.getCell(col, row);
    showIcon(this, cellGroup, 'mouseenter_cell');
  }
  hideClickIcon(col: number, row: number) {
    if (col === -1 || row === -1) {
      return;
    }
    const cellGroup = this.getCell(col, row);
    hideIcon(this, cellGroup, 'click_cell');
  }
  showClickIcon(col: number, row: number) {
    if (col === -1 || row === -1) {
      return;
    }
    const cellGroup = this.getCell(col, row);
    showIcon(this, cellGroup, 'click_cell');
  }
  /**
   * 单元格失焦 失效该单元格对应的图表实例
   * @param col
   * @param row
   * @returns
   */
  deactivateChart(col: number, row: number) {
    if (col === -1 || row === -1) {
      return;
    }
    const cellGroup = this.getCell(col, row);
    (cellGroup?.firstChild as any)?.deactivate?.();
  }
  /**
   * hover 到单元格上 激活该单元格对应的图表实例
   * @param col
   * @param row
   * @returns
   */
  activateChart(col: number, row: number) {
    if (col === -1 || row === -1) {
      return;
    }
    const cellGroup = this.getCell(col, row);
    (cellGroup?.firstChild as any)?.activate?.(this.table);
  }

  removeInteractionBorder(col: number, row: number) {
    const cellGroup = this.getCell(col, row);
    cellGroup.setAttribute('highlightStroke', undefined);
    cellGroup.setAttribute('highlightStrokeArrayWidth', undefined);
    cellGroup.setAttribute('highlightStrokeArrayColor', undefined);
  }

  createCellSelectBorder(
    start_Col: number,
    start_Row: number,
    end_Col: number,
    end_Row: number,
    selectRangeType: CellType,
    selectId: string, //整体区域${endRow}-${startCol}${startRow}${endCol}${endRow}作为其编号
    strokes?: boolean[]
  ) {
    createCellSelectBorder(this, start_Col, start_Row, end_Col, end_Row, selectRangeType, selectId, strokes);
  }
  moveSelectingRangeComponentsToSelectedRangeComponents() {
    moveSelectingRangeComponentsToSelectedRangeComponents(this);
  }
  /** 按住shift 则继续上次选中范围 需要将现有的删除掉 */
  deleteLastSelectedRangeComponents() {
    deleteLastSelectedRangeComponents(this);
  }
  deleteAllSelectBorder() {
    deleteAllSelectBorder(this);
  }

  updateCellSelectBorder(newStartCol: number, newStartRow: number, newEndCol: number, newEndRow: number) {
    updateCellSelectBorder(this, newStartCol, newStartRow, newEndCol, newEndRow);
  }

  /**
   * @description: 获取指定单元格指定位置的icon mark
   * @param {number} col
   * @param {number} row
   * @param {number} x
   * @param {number} y
   * @return {*}
   */
  getIcon(col: number, row: number, x: number, y: number): Icon | undefined {
    const cellGroup = this.getCell(col, row);
    let pickMark;
    cellGroup.forEachChildren((mark: Icon) => {
      if (mark.role === 'icon' && mark.containsPoint(x, y, IContainPointMode.GLOBAL)) {
        pickMark = mark;
      }
    });
    return pickMark;
  }

  /**
   * @description: 将指定icon mark设置为Hover样式
   * @param {Icon} icon
   * @param {number} col
   * @param {number} row
   * @return {*}
   */
  setIconHoverStyle(icon: Icon, col: number, row: number, cellGroup: Group) {
    // hover展示背景
    if (icon.attribute.backgroundColor) {
      let iconBack = icon.parent.getChildByName('icon-back') as IRect;
      if (iconBack) {
        iconBack.setAttributes({
          x: (icon.attribute.x ?? 0) + (icon.attribute.dx ?? 0) + (icon.AABBBounds.width() - icon.backgroundWidth) / 2,
          y: (icon.attribute.y ?? 0) + (icon.AABBBounds.height() - icon.backgroundHeight) / 2,
          width: icon.backgroundWidth,
          height: icon.backgroundHeight,
          fillColor: icon.attribute.backgroundColor,
          borderRadius: 5,
          visible: true
        });
      } else {
        iconBack = createRect({
          x: (icon.attribute.x ?? 0) + (icon.attribute.dx ?? 0) + (icon.AABBBounds.width() - icon.backgroundWidth) / 2,
          y: (icon.attribute.y ?? 0) + (icon.AABBBounds.height() - icon.backgroundHeight) / 2,
          width: icon.backgroundWidth,
          height: icon.backgroundHeight,
          fillColor: icon.attribute.backgroundColor,
          borderRadius: 5,
          pickable: false,
          visible: true
        }) as IRect;
        iconBack.name = 'icon-back';
        // cellGroup.appendChild(iconBack);
      }
      icon.parent.insertBefore(iconBack, icon);
    }

    // hover更换图片
    if (icon.attribute.hoverImage && icon.attribute.image !== icon.attribute.hoverImage) {
      icon.image = icon.attribute.hoverImage;
    }

    // hover展示tooltip
    if (icon.tooltip) {
      const { x1: left, x2: right, y1: top, y2: bottom } = icon.globalAABBBounds;
      const tooltipOptions: TooltipOptions = {
        content: icon.tooltip.title,
        referencePosition: {
          rect: {
            left: left - this.table.tableX,
            right: right - this.table.tableX,
            top: top - this.table.tableY,
            bottom: bottom - this.table.tableY,
            width: icon.globalAABBBounds.width(),
            height: icon.globalAABBBounds.height()
          },
          placement: icon.tooltip.placement
        },
        style: Object.assign({}, this.table.internalProps.theme?.tooltipStyle, icon.tooltip?.style)
      };
      if (!this.table.internalProps.tooltipHandler.isBinded(tooltipOptions)) {
        this.table.showTooltip(col, row, tooltipOptions);
      }
    }
  }

  /**
   * @description: 将指定icon mark设置为Normal样式
   * @param {Icon} icon
   * @param {number} col
   * @param {number} row
   * @return {*}
   */
  setIconNormalStyle(icon: Icon, col: number, row: number) {
    const iconBack = icon.parent.getChildByName('icon-back') as IRect;
    if (iconBack) {
      iconBack.setAttribute('visible', false);
    }

    // hover更换图片
    if (icon.attribute.hoverImage && icon.attribute.image !== icon.attribute.originImage) {
      icon.image = icon.attribute.originImage;
    }
  }

  /**
   * @description: 列宽调整结果更新列宽
   * @param {number} col
   * @param {number} detaX 改变的宽度值
   * @return {*}
   */
  updateColWidth(col: number, detaX: number) {
    updateColWidth(this, col, detaX);
    this.updateContainerWidth(col, detaX);
  }

  updateAutoColWidth(col: number) {
    const oldWidth = this.table.getColWidth(col);
    const newWidth = computeColWidth(col, 0, this.table.rowCount - 1, this.table, true);
    if (newWidth !== oldWidth) {
      this.updateColWidth(col, newWidth - oldWidth);
    }
  }

  updateTableSize() {
    this.tableGroup.setAttributes({
      width: Math.min(
        this.table.tableNoFrameWidth,
        Math.max(this.colHeaderGroup.attribute.width, this.bodyGroup.attribute.width, 0) +
          Math.max(this.cornerHeaderGroup.attribute.width, this.rowHeaderGroup.attribute.width, 0)
      ),
      height: Math.min(
        this.table.tableNoFrameHeight,
        (this.colHeaderGroup.attribute.height ?? 0) + (this.bodyGroup.attribute.height ?? 0)
      )
    } as any);

    if (this.tableGroup.border) {
      this.tableGroup.border.setAttributes({
        width: this.tableGroup.attribute.width + this.tableGroup.border.attribute.lineWidth,
        height: this.tableGroup.attribute.height + this.tableGroup.border.attribute.lineWidth
      });
    }
  }

  updateRowHeight(row: number, detaY: number) {
    updateRowHeight(this, row, detaY);
    this.updateContainerHeight(row, detaY);
  }

  /**
   * @description: 更新table&header&body高度
   * @return {*}
   */
  updateContainerWidth(col: number, detaX: number) {
    // 更新table/header/border宽度
    if (col < this.frozenColCount) {
      this.rowHeaderGroup.setDeltaWidth(detaX);
      this.cornerHeaderGroup.setDeltaWidth(detaX);
      this.colHeaderGroup.setDeltaX(detaX);
      this.bodyGroup.setDeltaX(detaX);
    } else {
      this.colHeaderGroup.setDeltaWidth(detaX);
      this.bodyGroup.setDeltaWidth(detaX);
    }

    this.updateTableSize();
    this.component.updateScrollBar();

    this.updateNextFrame();
  }

  /**
   * @description: 更新table&header&body高度
   * @return {*}
   */
  updateContainerHeight(row: number, detaY: number) {
    // 更新table/header/border高度
    if (row < this.frozenRowCount) {
      this.colHeaderGroup.setDeltaHeight(detaY);
      this.cornerHeaderGroup.setDeltaHeight(detaY);
      this.rowHeaderGroup.setDeltaY(detaY);
      this.bodyGroup.setDeltaY(detaY);
    } else {
      this.rowHeaderGroup.setDeltaHeight(detaY);
      this.bodyGroup.setDeltaHeight(detaY);
    }

    this.updateTableSize();
    this.component.updateScrollBar();

    this.updateNextFrame();
  }
  setColWidth(col: number, width: number) {
    const oldWidth = this.table.getColWidth(col);
    if (oldWidth === width) {
      return;
    }
    this.updateColWidth(col, width - oldWidth);
  }

  setRowHeight(row: number, height: number) {
    const oldHeight = this.table.getRowHeight(row);
    this.updateRowHeight(row, height - oldHeight);
  }

  /**
   * @description: 设置表格的x位置，滚动中使用
   * @param {number} x
   * @return {*}
   */
  setX(x: number) {
    if (this.colHeaderGroup.attribute.width + x === this.bodyGroup.attribute.x) {
      return;
    }
    // this.tableGroup.setAttribute('x', x);
    // this.tableGroup.setAttribute('width', this.table.tableNoFrameWidth - x);
    this.bodyGroup.setAttribute('x', this.rowHeaderGroup.attribute.width + x);
    this.colHeaderGroup.setAttribute('x', this.rowHeaderGroup.attribute.width + x);

    // (this.tableGroup.lastChild as any).setAttribute('width', this.table.tableNoFrameWidth - x);
    this.updateNextFrame();
  }

  /**
   * @description: 更新表格的y位置，滚动中使用
   * @param {number} y
   * @return {*}
   */
  setY(y: number) {
    if (this.transpose || this.isPivot) {
      if (this.colHeaderGroup.attribute.height + y === this.bodyGroup.attribute.y) {
        return;
      }
      this.bodyGroup.setAttribute('y', this.colHeaderGroup.attribute.height + y);
      this.rowHeaderGroup.setAttribute('y', this.colHeaderGroup.attribute.height + y);
      // this.tableGroup.setAttribute('height', this.table.tableNoFrameHeight - y);
      // (this.tableGroup.lastChild as any).setAttribute('width', this.table.tableNoFrameWidth - x);
      this.updateNextFrame();
    } else if (this.table.scenegraph.proxy) {
      this.table.scenegraph.proxy.setY(-y);
    }
  }

  /**
   * @description: 更新表格的y位置，滚动中使用
   * @param {number} y
   * @return {*}
   */
  setBodyAndRowHeaderY(y: number) {
    if (this.colHeaderGroup.attribute.height + y === this.bodyGroup.attribute.y) {
      return;
    }
    this.bodyGroup.setAttribute('y', this.colHeaderGroup.attribute.height + y);
    this.rowHeaderGroup.setAttribute('y', this.colHeaderGroup.attribute.height + y);
    // this.tableGroup.setAttribute('height', this.table.tableNoFrameHeight - y);
    // (this.tableGroup.lastChild as any).setAttribute('width', this.table.tableNoFrameWidth - x);
    this.updateNextFrame();
  }

  /**
   * @description: 完成创建场景树节点后，处理自动行高列宽
   * @return {*}
   */
  afterScenegraphCreated() {
    // 对齐auto列宽
    // updateAutoColWidth(this);
    // 对齐autoWrapText
    const { autoRowHeight } = this.table.internalProps;
    if (autoRowHeight) {
      updateAutoRowHeight(this);
    }

    this.dealWidthMode();

    // 处理冻结
    this.dealFrozen();

    // 处理frame border
    this.createFrameBorder();

    // 更新滚动条状态
    this.component.updateScrollBar();
  }

  /**
   * @description: 处理宽度模式
   * @return {*}
   */
  dealWidthMode() {
    const table = this.table;
    if (table.widthMode === 'adaptive') {
      // 处理adaptive宽度
      // table._colRangeWidthsMap = new Map();
      // const canvasWidth = this.internalProps.canvas.width;
      const totalDrawWidth = table.tableNoFrameWidth;
      let actualWidth = 0;
      for (let col = 0; col < table.colCount; col++) {
        actualWidth += table.getColWidth(col);
      }
      const factor = totalDrawWidth / actualWidth;
      for (let col = 0; col < table.colCount; col++) {
        let colWidth;
        if (col === table.colCount - 1) {
          colWidth = totalDrawWidth - table.getColsWidth(0, table.colCount - 2);
        } else {
          colWidth = Math.round(table.getColWidth(col) * factor);
        }
        this.setColWidth(col, colWidth);
      }
    } else if (table.widthMode === 'standard-aeolus' && this.transpose) {
      // 处理风神列宽特殊逻辑
      // table._colRangeWidthsMap = new Map();
      const canvasWidth = table.tableNoFrameWidth;
      let actualWidth = 0;
      let actualHeaderWidth = 0;
      for (let col = 0; col < table.colCount; col++) {
        const colWidth = table.getColWidth(col);
        if (col < table.frozenColCount) {
          actualHeaderWidth += colWidth;
        }

        actualWidth += colWidth;
      }

      // 如果内容宽度小于canvas宽度，执行adaptive放大
      if (actualWidth < canvasWidth && actualWidth - actualHeaderWidth > 0) {
        const factor = (canvasWidth - actualHeaderWidth) / (actualWidth - actualHeaderWidth);
        for (let col = table.frozenColCount; col < table.colCount; col++) {
          this.setColWidth(col, table.getColWidth(col) * factor);
        }
      }
    }

    // 更新容器宽度
    let bodyWidth = 0;
    this.bodyGroup.forEachChildrenSkipChild((column: Group) => {
      bodyWidth += column.attribute.width;
    });
    this.bodyGroup.setAttribute('width', bodyWidth);
    let colHeaderWidth = 0;
    this.colHeaderGroup.forEachChildrenSkipChild((column: Group) => {
      colHeaderWidth += column.attribute.width;
    });
    this.colHeaderGroup.setAttribute('width', colHeaderWidth);
    let rowHeaderWidth = 0;
    this.rowHeaderGroup.forEachChildrenSkipChild((column: Group) => {
      rowHeaderWidth += column.attribute.width;
    });
    this.rowHeaderGroup.setAttribute('width', rowHeaderWidth);
    let cornerHeaderWidth = 0;
    this.cornerHeaderGroup.forEachChildrenSkipChild((column: Group) => {
      cornerHeaderWidth += column.attribute.width;
    });
    this.cornerHeaderGroup.setAttribute('width', cornerHeaderWidth);

    this.colHeaderGroup.setAttribute('x', this.cornerHeaderGroup.attribute.width);
    this.rowHeaderGroup.setAttribute('y', this.colHeaderGroup.attribute.height);
    this.bodyGroup.setAttributes({
      x: this.rowHeaderGroup.attribute.width,
      y: this.colHeaderGroup.attribute.height
    });
  }

  /**
   * @description: 处理冻结
   * @return {*}
   */
  dealFrozen() {
    if (this.table.frozenColCount > this.table.rowHeaderLevelCount) {
      // 将对应列移入rowHeaderGroup
      this.rowHeaderGroup.setAttribute('height', this.bodyGroup.attribute.height);
      this.rowHeaderGroup.setAttribute('y', this.bodyGroup.attribute.y);
      this.cornerHeaderGroup.setAttribute('height', this.colHeaderGroup.attribute.height);
      for (let i = 0; i < this.table.frozenColCount - this.table.rowHeaderLevelCount; i++) {
        const column = this.bodyGroup.firstChild as Group;
        if (column) {
          this.rowHeaderGroup.appendChild(column);
          // 更新容器宽度
          this.rowHeaderGroup.setAttribute('width', this.rowHeaderGroup.attribute.width + column.attribute.width);
          this.bodyGroup.setAttribute('width', this.bodyGroup.attribute.width - column.attribute.width);
        }

        // 处理列表头
        const headerColumn = this.colHeaderGroup.firstChild as Group;
        if (headerColumn) {
          this.cornerHeaderGroup.appendChild(headerColumn);
          this.cornerHeaderGroup.setAttribute(
            'width',
            this.cornerHeaderGroup.attribute.width + headerColumn.attribute.width
          );
          this.colHeaderGroup.setAttribute('width', this.colHeaderGroup.attribute.width - headerColumn.attribute.width);
        }
      }
    }
    this.bodyGroup.setAttribute('x', this.rowHeaderGroup.attribute.width);
    this.colHeaderGroup.setAttribute('x', this.cornerHeaderGroup.attribute.width);

    // 更新bodyGroup&colHeaderGroup剩余列位置
    const bodyDeltaX = (this.bodyGroup.firstChild as Group)?.attribute.x ?? 0;
    this.bodyGroup.forEachChildrenSkipChild((column: Group) => {
      column.setAttribute('x', column.attribute.x - bodyDeltaX);
    });
    const colDeltaX = (this.colHeaderGroup.firstChild as Group)?.attribute.x ?? 0;
    this.colHeaderGroup.forEachChildrenSkipChild((column: Group) => {
      column.setAttribute('x', column.attribute.x - colDeltaX);
    });

    this.updateBorderSizeAndPosition();

    if (!this.isPivot && !this.transpose) {
      this.component.setFrozenColumnShadow(this.table.frozenColCount - 1);
    }
    this.hasFrozen = true;

    // this.frozenColCount = this.rowHeaderGroup.childrenCount;
    this.frozenColCount = this.table.frozenColCount;
    this.frozenRowCount = this.colHeaderGroup.firstChild?.childrenCount ?? 0;
  }

  /**
   * @description: 还原冻结
   * @return {*}
   */
  resetFrozen() {
    if (this.frozenColCount > this.table.rowHeaderLevelCount) {
      // 将对应列移入rowHeaderGroup
      // this.rowHeaderGroup.setAttribute('height', this.bodyGroup.attribute.height);
      // this.cornerHeaderGroup.setAttribute('height', this.colHeaderGroup.attribute.height);
      for (let i = 0; i < this.frozenColCount - this.table.rowHeaderLevelCount; i++) {
        const column =
          this.rowHeaderGroup.lastChild instanceof Group
            ? this.rowHeaderGroup.lastChild
            : (this.rowHeaderGroup.lastChild._prev as Group);
        if (column) {
          this.bodyGroup.insertBefore(column, this.bodyGroup.firstChild);
          // 更新容器宽度
          this.bodyGroup.setAttribute('width', this.bodyGroup.attribute.width + column.attribute.width);
          this.rowHeaderGroup.setAttribute('width', this.rowHeaderGroup.attribute.width - column.attribute.width);
        }

        // 处理列表头
        const headerColumn =
          this.cornerHeaderGroup.lastChild instanceof Group
            ? this.cornerHeaderGroup.lastChild
            : (this.cornerHeaderGroup.lastChild._prev as Group);
        if (headerColumn) {
          this.colHeaderGroup.insertBefore(headerColumn, this.colHeaderGroup.firstChild);
          this.colHeaderGroup.setAttribute('width', this.colHeaderGroup.attribute.width + headerColumn.attribute.width);
          this.cornerHeaderGroup.setAttribute(
            'width',
            this.cornerHeaderGroup.attribute.width - headerColumn.attribute.width
          );
        }
      }
    }
    this.bodyGroup.setAttribute('x', this.rowHeaderGroup.attribute.width);
    this.colHeaderGroup.setAttribute('x', this.cornerHeaderGroup.attribute.width);

    // 更新bodyGroup&colHeaderGroup剩余列位置
    let bodyX = 0;
    this.bodyGroup.forEachChildrenSkipChild((column: Group) => {
      column.setAttribute('x', bodyX);
      bodyX += column.attribute.width;
    });
    let colX = 0;
    this.colHeaderGroup.forEachChildrenSkipChild((column: Group) => {
      column.setAttribute('x', colX);
      colX += column.attribute.width;
    });

    this.updateBorderSizeAndPosition();

    if (!this.isPivot && !this.transpose) {
      this.component.setFrozenColumnShadow(this.table.frozenColCount - 1);
    }
    this.hasFrozen = true;

    // this.frozenColCount = this.rowHeaderGroup.childrenCount;
    this.frozenColCount = this.table.rowHeaderLevelCount;
    this.frozenRowCount = this.colHeaderGroup.firstChild?.childrenCount ?? 0;
  }

  /**
   * @description: 判断指定列更新宽度时，其中单元格是否会更新宽度；如果更新宽度，返回true
   * @param {Group} columnGroup
   * @param {number} detaRow columnGroup内的index与row的差值，列表头为0；行表头和内容为table.frozenRowCount
   * @param {number} col
   * @return {*}
   */
  updateCellLayoutWidthCertainWidth(columnGroup: Group, detaRow: number, col: number) {
    const width = columnGroup.attribute.width;
    let isUpdate = false;
    columnGroup.forEachChildren((cellGroup: Group, row: number) => {
      row += detaRow;
      const mergeInfo = getCellMergeInfo(this.table, col, row);
      if (mergeInfo) {
        cellGroup = this.getCell(mergeInfo.start.col, mergeInfo.start.row);
        // cellGroup.setAttribute('width', width);
      } else {
        cellGroup.setAttribute('width', width);
      }
      const headerStyle = this.table._getCellStyle(col, row);
      const padding = getPadding(getProp('padding', headerStyle, col, row, this.table));

      // const text = cellGroup.getChildAt(1) as WrapText;
      const text = cellGroup.getChildByName('text') as WrapText;
      let oldCellHeight = 0;
      let newCellHeight = 0;
      if (text) {
        oldCellHeight = text.AABBBounds.height() + (padding[0] + padding[2]);
        text.setAttribute('maxLineWidth', width - (padding[1] + padding[3]));
        newCellHeight = text.AABBBounds.height() + (padding[0] + padding[2]);
      } else {
        const group = cellGroup.getChildAt(1) as any;
        oldCellHeight = group.AABBBounds.height() + (padding[0] + padding[2]);
        group._cellWidth = width - (padding[1] + padding[3]);
        group.layout();
        newCellHeight = group.AABBBounds.height() + (padding[0] + padding[2]);
      }
      const rowHeight = this.table.getRowHeight(row);

      if (cellGroup.attribute.height !== newCellHeight) {
        cellGroup.setAttribute('height', newCellHeight);
        if (rowHeight === oldCellHeight) {
          // 当前行由本单元格高度撑起，更新本行行高
          isUpdate = true;
        } else if (newCellHeight > rowHeight) {
          // 当前行不由本单元格高度撑起，只在本单元格高度高于当前行高度时更新本行行高
          isUpdate = true;
        }
      }
    });
    return isUpdate;
  }

  /**
   * @description: 更新某列到其他列位置
   * @param {number} colSource 原始列col
   * @param {number} colTarget 目标列col
   * @return {*}
   */
  updateHeaderPosition(colSource: number, rowSource: number, colTarget: number, rowTarget: number) {
    moveHeaderPosition(colSource, rowSource, colTarget, rowTarget, this.table);
  }

  updateContainer() {
    // 更新各列x&col
    let cornerX = 0;
    this.cornerHeaderGroup.forEachChildrenSkipChild((column: Group, index) => {
      column.setAttribute('x', cornerX);
      cornerX += column.attribute.width;
    });
    let rowHeaderX = 0;
    this.rowHeaderGroup.forEachChildrenSkipChild((column: Group, index) => {
      column.setAttribute('x', rowHeaderX);
      rowHeaderX += column.attribute.width;
    });
    let colHeaderX = 0;
    this.colHeaderGroup.forEachChildrenSkipChild((column: Group, index) => {
      column.setAttribute('x', colHeaderX);
      colHeaderX += column.attribute.width;
    });
    let bodyX = 0;
    this.bodyGroup.forEachChildrenSkipChild((column: Group, index) => {
      column.setAttribute('x', bodyX);
      bodyX += column.attribute.width;
    });
    // 更新容器
    this.cornerHeaderGroup.setDeltaWidth(cornerX - this.cornerHeaderGroup.attribute.width);
    this.colHeaderGroup.setDeltaWidth(colHeaderX - this.colHeaderGroup.attribute.width);
    this.rowHeaderGroup.setDeltaWidth(rowHeaderX - this.rowHeaderGroup.attribute.width);
    this.bodyGroup.setDeltaWidth(bodyX - this.bodyGroup.attribute.width);

    this.colHeaderGroup.setAttribute('x', this.cornerHeaderGroup.attribute.width);
    this.bodyGroup.setAttribute('x', this.rowHeaderGroup.attribute.width);

    // 记录滚动条原位置
    const oldHorizontalBarPos = this.table.stateManeger.scroll.horizontalBarPos;
    const oldVerticalBarPos = this.table.stateManeger.scroll.verticalBarPos;
    this.component.updateScrollBar();
    this.table.stateManeger.setScrollLeft(oldHorizontalBarPos);
    this.table.stateManeger.setScrollTop(oldVerticalBarPos);
    this.updateNextFrame();
  }

  /**
   * @description: 清空全部单元格内容，用于setRecord
   * @return {*}
   */
  clearCells() {
    this.clear = true;
    this.hasFrozen = false;

    this.colHeaderGroup.clear();
    this.rowHeaderGroup.clear();
    this.cornerHeaderGroup.clear();
    this.bodyGroup.clear();

    this.colHeaderGroup.setAttributes({
      x: 0,
      y: 0,
      width: 0,
      height: 0
    });
    this.rowHeaderGroup.setAttributes({
      x: 0,
      y: 0,
      width: 0,
      height: 0
    });
    this.cornerHeaderGroup.setAttributes({
      x: 0,
      y: 0,
      width: 0,
      height: 0
    });
    this.bodyGroup.setAttributes({
      x: 0,
      y: 0,
      width: 0,
      height: 0
    });
    this.tableGroup.setAttributes({
      x: 0,
      y: 0,
      width: 0,
      height: 0
    });

    if ((this.tableGroup as any).border) {
      (this.tableGroup.parent as Group).removeChild((this.tableGroup as any).border);
      delete (this.tableGroup as any).border;
    }
  }

  updateCellContentWhileResize(col: number, row: number) {
    const type = this.table.getBodyColumnType(col, row);
    const cellGroup = this.getCell(col, row);
    if (type === 'image' || type === 'video') {
      updateImageCellContentWhileResize(cellGroup, col, row, this.table);
    }
  }

  /**
   * @description: 创建table&header&body的border
   * @return {*}
   */
  createFrameBorder() {
    // 更新宽高
    this.updateTableSize();
    // this.tableGroup.setAttributes({
    //   width: Math.min(
    //     this.table.tableNoFrameWidth,
    //     (this.colHeaderGroup.attribute.width ?? 0) + (this.cornerHeaderGroup.attribute.width ?? 0)
    //   ),
    //   height: Math.min(
    //     this.table.tableNoFrameHeight,
    //     (this.colHeaderGroup.attribute.height ?? 0) + (this.bodyGroup.attribute.height ?? 0)
    //   ),
    // } as any);

    const isListTableWithFrozen = !this.isPivot && this.rowHeaderGroup.attribute.width;

    // 设置border
    createFrameBorder(
      this.bodyGroup,
      this.table.theme.bodyStyle.frameStyle,
      this.bodyGroup.role,
      isListTableWithFrozen ? [true, true, true, false] : undefined
    );
    createFrameBorder(
      this.rowHeaderGroup,
      this.isPivot ? this.table.theme.rowHeaderStyle.frameStyle : this.table.theme.bodyStyle.frameStyle,
      this.rowHeaderGroup.role,
      isListTableWithFrozen ? [true, false, true, true] : undefined
    );
    createFrameBorder(
      this.colHeaderGroup,
      this.table.theme.headerStyle.frameStyle, // 透视表的主题中没有colHeaderStyle，直接使用headerStyle
      this.colHeaderGroup.role,
      isListTableWithFrozen ? [true, true, true, false] : undefined
    );
    createFrameBorder(
      this.cornerHeaderGroup,
      this.isPivot ? this.table.theme.cornerHeaderStyle.frameStyle : this.table.theme.headerStyle.frameStyle,
      this.cornerHeaderGroup.role,
      isListTableWithFrozen ? [true, false, true, true] : undefined
    );
    createFrameBorder(this.tableGroup, this.table.theme.frameStyle, this.tableGroup.role);
  }

  /**
   * @description: 获取当前位置的列宽调整信息
   * @param {number} abstractX
   * @param {number} abstractY
   * @param {Group} cellGroup
   * @param {*} offset
   * @return {*}
   */
  getResizeColAt(
    abstractX: number,
    abstractY: number,
    cellGroup?: Group,
    offset = ResizeColumnHotSpotSize / 2
  ): { col: number; row: number; x?: number } {
    if (!cellGroup) {
      // to do: 处理最后一列外调整列宽
    } else {
      if (abstractX < cellGroup.globalAABBBounds.x1 + offset) {
        return { col: cellGroup.col - 1, row: cellGroup.row, x: cellGroup.globalAABBBounds.x1 };
      }
      if (cellGroup.globalAABBBounds.x2 - offset < abstractX) {
        return { col: cellGroup.col, row: cellGroup.row, x: cellGroup.globalAABBBounds.x2 };
      }
    }
    return { col: -1, row: -1 };
  }

  updateIcon(icon: Icon, iconConfig: ColumnIconOption) {
    // 直接更新mark attribute
    dealWithIcon(iconConfig, icon);
    icon.name = iconConfig.name;
    this.updateNextFrame();
  }

  updateFrozen() {
    if (this.clear) {
      return;
    }
    this.resetFrozen();
    this.dealFrozen();
    this.component.updateScrollBar();
  }

  updateBorderSizeAndPosition() {
    if (this.bodyGroup.border) {
      this.bodyGroup.appendChild(this.bodyGroup.border);
      this.bodyGroup.border?.setAttribute(
        'width',
        this.bodyGroup.attribute.width - (this.bodyGroup.border.attribute.lineWidth ?? 0)
      );
      if (this.rowHeaderGroup.attribute.width === 0) {
        this.bodyGroup.border?.setAttribute('stroke', [true, true, true, true]);
      } else {
        this.bodyGroup.border?.setAttribute('stroke', [true, true, true, false]);
      }
    }
    if (this.colHeaderGroup.border) {
      this.colHeaderGroup.appendChild(this.colHeaderGroup.border);
      this.colHeaderGroup.border?.setAttribute(
        'width',
        this.colHeaderGroup.attribute.width - (this.colHeaderGroup.border.attribute.lineWidth ?? 0)
      );
      if (this.cornerHeaderGroup.attribute.width === 0) {
        this.colHeaderGroup.border?.setAttribute('stroke', [true, true, true, true]);
      } else {
        this.colHeaderGroup.border?.setAttribute('stroke', [true, true, true, false]);
      }
    }
    if (this.rowHeaderGroup.border) {
      this.rowHeaderGroup.appendChild(this.rowHeaderGroup.border);
      this.rowHeaderGroup.border?.setAttribute(
        'width',
        this.rowHeaderGroup.attribute.width - (this.rowHeaderGroup.border.attribute.lineWidth ?? 0)
      );
    }
    if (this.cornerHeaderGroup.border) {
      this.cornerHeaderGroup.appendChild(this.cornerHeaderGroup.border);
      this.cornerHeaderGroup.border?.setAttribute(
        'width',
        this.cornerHeaderGroup.attribute.width - (this.cornerHeaderGroup.border.attribute.lineWidth ?? 0)
      );
    }
  }

  updateSortIcon(
    col: number,
    row: number,
    iconMark: Icon,
    order: SortOrder,
    oldSortCol: number,
    oldSortRow: number,
    oldIconMark: Icon | undefined
  ) {
    // 更新icon
    const icon = this.table.internalProps.headerHelper.getSortIcon(order, this.table, col, row);
    if (iconMark) {
      this.updateIcon(iconMark, icon);
    }

    // 更新旧frozen icon
    if (oldIconMark !== iconMark) {
      const oldIcon = this.table.internalProps.headerHelper.getSortIcon(
        SortOrder.normal,
        this.table,
        oldSortCol,
        oldSortRow
      );
      if (oldIconMark) {
        this.updateIcon(oldIconMark, oldIcon);
      } else {
        const oldSortCell = this.getCell(oldSortCol, oldSortRow);
        let oldIconMark;
        oldSortCell.forEachChildren((mark: Icon) => {
          if (mark.attribute.funcType === 'sort') {
            oldIconMark = mark;
            return true;
          }
          return false;
        });
        if (oldIconMark) {
          this.updateIcon(oldIconMark, oldIcon);
        }
      }
    }
  }

  updateFrozenIcon(col: number, oldFrozenCol: number) {
    // 依据新旧冻结列确定更新范围
    const updateCol = Math.max(col, oldFrozenCol);

    // 遍历表头单元格，更新icon
    this.colHeaderGroup.forEachChildrenSkipChild((colGroup: Group) => {
      if (colGroup.col <= updateCol) {
        colGroup.forEachChildren((cellGroup: Group) => {
          cellGroup.forEachChildren((icon: Icon) => {
            if (icon.attribute.funcType === 'pin') {
              const iconConfig = this.table.internalProps.headerHelper.getPinIcon(cellGroup.col, cellGroup.row);
              this.updateIcon(icon, iconConfig);
              return true;
            }
            return false;
          });
        });
        return false;
      }
      return true;
    });
    this.cornerHeaderGroup.forEachChildrenSkipChild((colGroup: Group) => {
      if (colGroup.col <= updateCol) {
        colGroup.forEachChildren((cellGroup: Group) => {
          cellGroup.forEachChildren((icon: Icon) => {
            if (icon.attribute.funcType === 'pin') {
              const iconConfig = this.table.internalProps.headerHelper.getPinIcon(cellGroup.col, cellGroup.row);
              this.updateIcon(icon, iconConfig);
              return true;
            }
            return false;
          });
        });
        return false;
      }
      return true;
    });
  }

  sortCell() {
    if (this.isPivot) {
      // 透视表外部处理排序
    } else if (this.transpose) {
      setTimeout(() => {
        // 清空单元格内容
        this.clearCells();
        // 生成单元格场景树
        this.createSceneGraph();
      }, 10);
    } else {
      this.proxy.sortCell();
    }
  }

  getCellOverflowText(col: number, row: number): string | null {
    const cellGroup = this.getCell(col, row);
    const text = cellGroup.getChildByName('text', true) as unknown as WrapText;
    // if (text && text.cache?.clipedText !== text.attribute.text) {
    //   return text.attribute.text as string;
    // }
    if (text) {
      const textAttributeStr = (text.attribute.text as string[]).join('');
      let cacheStr = '';
      (text.cache as ITextCache).layoutData.lines.forEach((line: any) => {
        cacheStr += line.str;
      });
      if (cacheStr !== textAttributeStr) {
        return textAttributeStr;
      }
    }
    return null;
  }

  updateDrill(visible: boolean, x: number, y: number, drillDown: boolean, drillUp: boolean) {
    this.component.drillIcon.update(visible, x, y, drillDown, drillUp, this);
  }

  updateCellContent(col: number, row: number) {
    if (this.clear) {
      return;
    }
    updateCell(col, row, this.table);
  }
}

function showIcon(scene: Scenegraph, cellGroup: Group, visibleTime: 'mouseenter_cell' | 'click_cell') {
  cellGroup.forEachChildren((child: any) => {
    if (child.type === 'group') {
      showIcon(scene, child, visibleTime);
    } else if (child.attribute.visibleTime === visibleTime) {
      child.attribute.visible = true;
      scene.updateNextFrame();
    }
  });
}

function hideIcon(scene: Scenegraph, cellGroup: Group, visibleTime: 'mouseenter_cell' | 'click_cell') {
  cellGroup.forEachChildren((child: any) => {
    if (child.type === 'group') {
      hideIcon(scene, child, visibleTime);
    } else if (child.attribute.visibleTime === visibleTime) {
      child.attribute.visible = false;
      scene.updateNextFrame();
    }
  });
}
