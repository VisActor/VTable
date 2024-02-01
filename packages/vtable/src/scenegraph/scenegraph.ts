import type { IStage, IRect, ITextCache, INode, Text, RichText } from '@src/vrender';
import { createStage, createRect, IContainPointMode, container, vglobal, registerForVrender } from '@src/vrender';
import type { CellRange, CellSubLocation } from '../ts-types';
import {
  type CellAddress,
  type CellLocation,
  type ColumnIconOption,
  type SortOrder,
  IconFuncTypeEnum
} from '../ts-types';
import { isArray, isString, isValid } from '@visactor/vutils';
import type { Group } from './graphic/group';
import type { Icon } from './graphic/icon';
import { getCellMergeInfo } from './utils/get-cell-merge';
import { updateColWidth } from './layout/update-width';
import { TableComponent } from './component/table-component';
import { updateRowHeight } from './layout/update-height';
import { updateImageCellContentWhileResize } from './group-creater/cell-type/image-cell';
import { getQuadProps } from './utils/padding';
import { createFrameBorder, updateCornerRadius, updateFrameBorder, updateFrameBorderSize } from './style/frame-border';
import { ResizeColumnHotSpotSize } from '../tools/global';
import splitModule from './graphic/contributions';
import { getFunctionalProp, getProp } from './utils/get-prop';
import { dealWithIcon } from './utils/text-icon-layout';
import { SceneProxy } from './group-creater/progress/proxy';
import type { TooltipOptions } from '../ts-types/tooltip';
import { computeColWidth, computeColsWidth, getAdaptiveWidth } from './layout/compute-col-width';
import { moveHeaderPosition } from './layout/move-cell';
import { updateCell } from './group-creater/cell-helper';
import type { BaseTableAPI } from '../ts-types/base-table';
import { updateAllSelectComponent, updateCellSelectBorder } from './select/update-select-border';
import { createCellSelectBorder } from './select/create-select-border';
import { moveSelectingRangeComponentsToSelectedRangeComponents } from './select/move-select-border';
import { deleteAllSelectBorder, deleteLastSelectedRangeComponents } from './select/delete-select-border';
import { updateRow } from './layout/update-row';
import { handleTextStick } from './stick-text';
import { computeRowHeight, computeRowsHeight } from './layout/compute-row-height';
import { emptyGroup } from './utils/empty-group';
import { dealBottomFrozen, dealFrozen, dealRightFrozen, resetFrozen } from './layout/frozen';
import { updateChartSize, updateChartState } from './refresh-node/update-chart';
import { initSceneGraph } from './group-creater/init-scenegraph';
import { updateContainerChildrenX } from './utils/update-container';
import type { CheckBox } from '@visactor/vrender-components';
import { loadPoptip, setPoptipTheme } from '@visactor/vrender-components';
import textMeasureModule from './utils/text-measure';
import {
  getIconByXY,
  hideClickIcon,
  hideHoverIcon,
  resetResidentHoverIcon,
  residentHoverIcon,
  setIconHoverStyle,
  setIconNormalStyle,
  showClickIcon,
  showHoverIcon,
  updateFrozenIcon,
  updateHierarchyIcon,
  updateSortIcon
} from './icon/icon-update';
import { Env } from '../tools/env';
import { createCornerCell } from './style/corner-cell';
import { updateCol } from './layout/update-col';
import { deduplication } from '../tools/util';
// import { contextModule } from './context/module';

registerForVrender();

// VChart poptip theme
loadPoptip();
container.load(splitModule);
container.load(textMeasureModule);
// container.load(renderServiceModule);
// container.load(contextModule);
// console.log(container);

export type MergeMap = Map<
  string,
  {
    cellWidth: number;
    cellHeight: number;
  }
>;

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
  rightFrozenGroup: Group; // 右侧冻结列Group
  bottomFrozenGroup: Group; // 下侧冻结行Group
  rightTopCornerGroup: Group; // 右上角占位单元格Group，只在有右侧冻结列时使用
  leftBottomCornerGroup: Group; // 左下角占位单元格Group,只在有下侧冻结行时使用
  rightBottomCornerGroup: Group; // 右下角占位单元格Group,只在有右侧下侧都有冻结行时使用
  componentGroup: Group; // 表格外组件Group
  /** 所有选中区域对应的选框组件 */
  selectedRangeComponents: Map<string, { rect: IRect; role: CellSubLocation }>;
  /** 当前正在选择区域对应的选框组件 为什么是map 以为可能一个选中区域会被拆分为多个rect组件 三块表头和body都分别对应不同组件*/
  selectingRangeComponents: Map<string, { rect: IRect; role: CellSubLocation }>;
  lastSelectId: string;
  component: TableComponent;
  stage: IStage;
  table: BaseTableAPI;
  isPivot: boolean;
  transpose: boolean;
  hasFrozen: boolean; // 是否已经处理冻结列，用在getCell判断是否从cornerHeaderGroup获取cellGroup
  frozenColCount: number; // 冻结列数
  frozenRowCount: number; // 冻结行数
  clear: boolean;

  mergeMap: MergeMap;
  _dealAutoFillHeightOriginRowsHeight: number; // hack 缓存一个值 用于处理autoFillHeight的逻辑判断 在某些情况下是需要更新此值的 如增删数据 但目前没有做这个
  constructor(table: BaseTableAPI) {
    this.table = table;
    this.hasFrozen = false;
    this.clear = true;
    this.mergeMap = new Map();

    setPoptipTheme(this.table.theme.textPopTipStyle);
    let width;
    let height;
    if (Env.mode === 'node') {
      vglobal.setEnv('node', table.options.modeParams);
      width = table.canvasWidth;
      height = table.canvasHeight;
    } else {
      vglobal.setEnv('browser');
      width = table.canvas.width;
      height = table.canvas.height;
    }
    this.stage = createStage({
      canvas: table.canvas,
      width,
      height,
      disableDirtyBounds: false,
      background: table.theme.underlayBackgroundColor,
      dpr: table.internalProps.pixelRatio,
      enableLayout: true,
      // pluginList: table.isPivotChart() ? ['poptipForText'] : undefined,
      afterRender: () => {
        this.table.fireListeners('after_render', null);
        // console.trace('after_render');
      }
      // event: { clickInterval: 400 }
      // autoRender: true
    });

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
    return this.proxy.rowStart ?? 0;
  }

  get bodyRowEnd(): number {
    return this.proxy.rowEnd ?? this.table.rowCount - 1;
  }

  get bodyColStart(): number {
    return this.proxy.colStart ?? 0;
  }

  get bodyColEnd(): number {
    return this.proxy.colEnd ?? this.table.colCount - 1;
  }

  /**
   * @description: 初始化场景树结构
   * @return {*}
   */
  initSceneGraph() {
    this.isPivot = this.table.isPivotTable();
    this.transpose = (this.table.options as any).transpose; // 初始化时this.table.transpose还未赋值

    initSceneGraph(this);
  }

  /**
   * @description: 清空全部单元格内容，用于setRecord
   * @return {*}
   */
  clearCells() {
    // unbind AutoPoptip
    if (this.table.isPivotChart() || this.table.hasCustomRenderOrLayout()) {
      // bind for axis label in pivotChart
      this.stage.pluginService.findPluginsByName('poptipForText').forEach(plugin => {
        plugin.deactivate(this.stage.pluginService);
      });
    }

    this.clear = true;
    this.hasFrozen = false;
    this.mergeMap.clear();

    this.colHeaderGroup.clear();
    this.rowHeaderGroup.clear();
    this.cornerHeaderGroup.clear();
    this.bodyGroup.clear();

    this.bottomFrozenGroup.clear();
    this.rightFrozenGroup.clear();
    this.rightTopCornerGroup.clear();
    this.rightBottomCornerGroup.clear();
    this.leftBottomCornerGroup.clear();

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
    this.rightFrozenGroup.setAttributes({
      x: 0,
      y: 0,
      width: 0,
      height: 0
    });
    this.bottomFrozenGroup.setAttributes({
      x: 0,
      y: 0,
      width: 0,
      height: 0
    });
    this.rightTopCornerGroup.setAttributes({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      visible: false
    });
    this.leftBottomCornerGroup.setAttributes({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      visible: false
    });
    this.rightBottomCornerGroup.setAttributes({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      visible: false
    });

    this.tableGroup.setAttributes({
      x: this.table.tableX,
      y: this.table.tableY,
      width: 0,
      height: 0
    });

    if ((this.tableGroup as any).border) {
      (this.tableGroup.parent as Group).removeChild((this.tableGroup as any).border);
      delete (this.tableGroup as any).border;
    }
    this.proxy?.release();
  }

  updateStageBackground() {
    this.stage.background = this.table.theme.underlayBackgroundColor;
    this.stage.renderNextFrame();
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

  updateComponent() {
    this.component.updateStyle();
  }

  /**
   * @description: 依据数据创建表格场景树
   * @return {*}
   */
  createSceneGraph() {
    // bind AutoPoptip
    if (this.table.isPivotChart() || this.table.hasCustomRenderOrLayout()) {
      // bind for axis label in pivotChart
      (this.stage.pluginService as any).autoEnablePlugins.getContributions().forEach((p: any) => {
        if (p.name === 'poptipForText') {
          this.stage.pluginService.register(p);
        }
      });
    }

    this.clear = false;
    // this.frozenColCount = this.table.rowHeaderLevelCount;
    this.frozenColCount = this.table.frozenColCount;
    this.frozenRowCount = this.table.columnHeaderLevelCount;

    this.proxy = new SceneProxy(this.table);

    // update table group position for cell group global position, not create border yet.
    createFrameBorder(this.tableGroup, this.table.theme.frameStyle, this.tableGroup.role, undefined, true);

    if (this.table.isPivotChart()) {
      createCornerCell(
        this.rightTopCornerGroup,
        this.table.theme.cornerRightTopCellStyle || this.table.theme.cornerHeaderStyle || {}
      );
      createCornerCell(
        this.leftBottomCornerGroup,
        this.table.theme.cornerLeftBottomCellStyle || this.table.theme.cornerHeaderStyle || {}
      );
      createCornerCell(
        this.rightBottomCornerGroup,
        this.table.theme.cornerRightBottomCellStyle || this.table.theme.cornerHeaderStyle || {}
      );
    }

    this.proxy.createGroupForFirstScreen(
      this.cornerHeaderGroup,
      this.colHeaderGroup,
      this.rowHeaderGroup,
      this.rightFrozenGroup,
      this.bottomFrozenGroup,
      this.bodyGroup,
      0,
      0
    );
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
  getCell(col: number, row: number, getShadow?: boolean): Group {
    // hasFrozen处理前，列表头的冻结部分在colHeaderGroup中
    // hasFrozen处理后，列表头的冻结部分在cornerHeaderGroup中
    // 因此在获取cell时需要区别hasFrozen时机
    // const colGroup = row < this.frozenRowCount ? this.colHeaderGroup : this.cornerHeaderGroup;
    let cell;
    if (
      this.table.rightFrozenColCount > 0 &&
      col >= this.table.colCount - this.table.rightFrozenColCount &&
      row < this.table.frozenRowCount
    ) {
      cell = this.rightTopCornerGroup.getColGroup(col)?.getRowGroup(row);
    } else if (
      this.table.bottomFrozenRowCount > 0 &&
      row >= this.table.rowCount - this.table.bottomFrozenRowCount &&
      col < this.table.frozenColCount
    ) {
      cell = this.leftBottomCornerGroup.getColGroup(col)?.getRowGroup(row);
    } else if (
      this.table.rightFrozenColCount > 0 &&
      this.table.bottomFrozenRowCount > 0 &&
      col >= this.table.colCount - this.table.rightFrozenColCount &&
      row >= this.table.rowCount - this.table.bottomFrozenRowCount
    ) {
      cell = this.rightBottomCornerGroup.getColGroup(col)?.getRowGroup(row);
    } else if (this.table.rightFrozenColCount > 0 && col > this.table.colCount - 1 - this.table.rightFrozenColCount) {
      cell = this.rightFrozenGroup.getColGroup(col)?.getRowGroup(row);
    } else if (this.table.bottomFrozenRowCount > 0 && row > this.table.rowCount - 1 - this.table.bottomFrozenRowCount) {
      cell = this.bottomFrozenGroup.getColGroup(col)?.getRowGroup(row);
    } else {
      cell = this.getColGroup(col, row < this.frozenRowCount)?.getRowGroup(row);
    }

    if (cell && cell.role === 'shadow-cell' && !getShadow) {
      const range = this.table.getCellRange(col, row);
      if (range.start.col === col && range.start.row === row) {
        // 理论上不会出现这种情况，但是在PivotChart会偶先，这里处理避免进入死循环
        // do nothing
      } else {
        cell = this.getCell(range.start.col, range.start.row);
      }
    }

    return cell || emptyGroup;
  }

  highPerformanceGetCell(col: number, row: number, getShadow?: boolean): Group {
    // if (!this.table.isHeader(col, row)) {
    return this.proxy.highPerformanceGetCell(col, row, getShadow);
    // }
    // return this.getCell(col, row, getShadow);
  }

  getColGroup(col: number, isCornerOrColHeader = false): Group {
    let element: Group;
    if (col < this.frozenColCount && isCornerOrColHeader) {
      element = this.cornerHeaderGroup.getColGroup(col) as Group;
    } else if (col < this.frozenColCount) {
      element = this.rowHeaderGroup.getColGroup(col) as Group;
    } else if (
      isCornerOrColHeader &&
      this.table.rightFrozenColCount > 0 &&
      col > this.table.colCount - 1 - this.table.rightFrozenColCount
    ) {
      element = this.rightTopCornerGroup.getColGroup(col) as Group;
    } else if (
      !isCornerOrColHeader &&
      this.table.rightFrozenColCount > 0 &&
      col > this.table.colCount - 1 - this.table.rightFrozenColCount
    ) {
      element = this.rightFrozenGroup.getColGroup(col) as Group;
    } else if (isCornerOrColHeader) {
      element = this.colHeaderGroup.getColGroup(col) as Group;
    } else {
      element = this.bodyGroup.getColGroup(col) as Group;
    }
    return element || undefined;
  }

  getColGroupInBottom(col: number): Group | undefined {
    if (this.table.bottomFrozenRowCount > 0) {
      return this.bottomFrozenGroup.getColGroup(col) as Group;
    }
    return undefined;
  }

  getColGroupInLeftBottomCorner(col: number): Group | undefined {
    if (this.table.bottomFrozenRowCount > 0) {
      return this.leftBottomCornerGroup.getColGroup(col) as Group;
    }
    return undefined;
  }

  getColGroupInRightTopCorner(col: number): Group | undefined {
    if (this.table.rightFrozenColCount > 0) {
      return this.rightTopCornerGroup.getColGroup(col) as Group;
    }
    return undefined;
  }

  getColGroupInRightBottomCorner(col: number): Group | undefined {
    if (this.table.rightFrozenColCount > 0 && this.table.bottomFrozenRowCount > 0) {
      return this.rightBottomCornerGroup.getColGroup(col) as Group;
    }
    return undefined;
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
    if (this.table.stateManager.select?.ranges?.length > 0) {
      updateAllSelectComponent(this);
    }
  }

  hideHoverIcon(col: number, row: number) {
    hideHoverIcon(col, row, this);
  }

  showHoverIcon(col: number, row: number) {
    showHoverIcon(col, row, this);
  }

  hideClickIcon(col: number, row: number) {
    hideClickIcon(col, row, this);
  }

  showClickIcon(col: number, row: number) {
    showClickIcon(col, row, this);
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
    return getIconByXY(col, row, x, y, this);
  }

  /**
   * @description: 将指定icon mark设置为Hover样式
   * @param {Icon} icon
   * @param {number} col
   * @param {number} row
   * @return {*}
   */
  setIconHoverStyle(icon: Icon, col: number, row: number, cellGroup: Group) {
    setIconHoverStyle(icon, col, row, cellGroup, this);
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
    updateSortIcon(col, row, iconMark, order, oldSortCol, oldSortRow, oldIconMark, this);
  }

  updateFrozenIcon(col: number, oldFrozenCol: number) {
    updateFrozenIcon(this);
  }
  updateHierarchyIcon(col: number, row: number) {
    updateHierarchyIcon(col, row, this);
  }

  /**
   * @description: 将指定icon mark设置为Normal样式
   * @param {Icon} icon
   * @param {number} col
   * @param {number} row
   * @return {*}
   */
  setIconNormalStyle(icon: Icon, col: number, row: number) {
    setIconNormalStyle(icon, col, row, this);
  }

  residentHoverIcon(col: number, row: number) {
    residentHoverIcon(col, row, this);
  }
  resetResidentHoverIcon(col: number, row: number) {
    resetResidentHoverIcon(col, row, this);
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
    selectRangeType: CellSubLocation,
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
  /** 根据select状态重新创建选中range节点  目前无调用者 */
  recreateAllSelectRangeComponents() {
    deleteAllSelectBorder(this);
    this.table.stateManager.select.ranges.forEach((cellRange: CellRange) => {
      updateCellSelectBorder(this, cellRange.start.col, cellRange.start.row, cellRange.end.col, cellRange.end.row);
    });
    moveSelectingRangeComponentsToSelectedRangeComponents(this);
  }
  /**
   * @description: 列宽调整结果更新列宽
   * @param {number} col
   * @param {number} detaX 改变的宽度值
   * @return {*}
   */
  updateColWidth(col: number, detaX: number, skipUpdateContainer?: boolean, skipTableWidthMap?: boolean) {
    updateColWidth(this, col, Math.round(detaX), skipTableWidthMap);
    // this.updateContainerWidth(col, detaX);
    if (!skipUpdateContainer) {
      // this.updateContainerAttrWidthAndX();
      this.updateContainer();
    }
  }

  /**
   * @description: 列宽调整需要修改Chart的尺寸
   * @param {number} col
   * @return {*}
   */
  updateChartSize(col: number) {
    updateChartSize(this, col);
  }
  /** 更新图表的高亮状态 */
  updateChartState(datum: any) {
    this.table.isPivotChart() && updateChartState(this, datum);
  }

  updateCheckboxCellState(col: number, row: number, checked: boolean) {
    if (this.transpose) {
      this.bodyGroup.children?.forEach((columnGroup: INode) => {
        columnGroup
          .getChildAt(row)
          .getChildren()
          .forEach((node: INode) => {
            if (node.name === 'checkbox') {
              (node as CheckBox).setAttribute('checked', checked);
            }
          });
      });
    } else {
      const columnGroup = this.getColGroup(col);
      columnGroup.children?.forEach((cellNode: INode) => {
        cellNode.getChildren().find(node => {
          if (node.name === 'checkbox') {
            (node as CheckBox).setAttribute('checked', checked);
          }
        });
      });
    }
  }
  updateHeaderCheckboxCellState(col: number, row: number, checked: boolean | 'indeterminate') {
    if (this.transpose) {
      this.rowHeaderGroup.children?.forEach((columnGroup: INode) => {
        columnGroup
          .getChildAt(row)
          .getChildren()
          .forEach((node: INode) => {
            if (node.name === 'checkbox') {
              if (checked === 'indeterminate') {
                (node as CheckBox).setAttribute('indeterminate', true);
                (node as CheckBox).setAttribute('checked', undefined);
              } else {
                (node as CheckBox).setAttribute('indeterminate', undefined);
                (node as CheckBox).setAttribute('checked', checked);
              }
            }
          });
      });
    } else {
      const columnGroup = this.getColGroup(col, true);
      columnGroup.children?.forEach((cellNode: INode) => {
        cellNode.getChildren().find(node => {
          if (node.name === 'checkbox') {
            if (checked === 'indeterminate') {
              (node as CheckBox).setAttribute('indeterminate', true);
              (node as CheckBox).setAttribute('checked', undefined);
            } else {
              (node as CheckBox).setAttribute('indeterminate', undefined);
              (node as CheckBox).setAttribute('checked', checked);
            }
          }
        });
      });
    }
  }
  updateAutoColWidth(col: number) {
    this.table.internalProps._widthResizedColMap.delete(col);
    const oldWidth = this.table.getColWidth(col);
    const newWidth = computeColWidth(col, 0, this.table.rowCount - 1, this.table, true);
    if (newWidth !== oldWidth) {
      this.updateColWidth(col, newWidth - oldWidth);
    }
  }

  /*
   * recalculates column width in all autowidth columns
   */
  recalculateColWidths() {
    computeColsWidth(this.table, 0, this.table.colCount - 1, true);
  }

  recalculateRowHeights() {
    computeRowsHeight(this.table, 0, this.table.rowCount - 1, true, true);
  }

  resize() {
    // reset proxy config
    this.proxy.resize();

    if (this.table.widthMode === 'adaptive' || this.table.autoFillWidth) {
      if (this.table.internalProps._widthResizedColMap.size === 0) {
        //如果没有手动调整过行高列宽 则重新计算一遍并重新分配
        this.recalculateColWidths();
      } else {
        this.dealWidthMode();
      }
    }

    if (this.table.heightMode === 'adaptive') {
      // perf to be optimized:
      // reason to use recalculateRowHeights();
      // 1. error amplification（误差放大） in dealHeightMode when multiple resize
      // 2. width update caused height update dose not have enlarge/reduce number,
      // will cause scale error in dealHeightMode()
      this.recalculateRowHeights();
      // this.dealHeightMode();
    } else if (this.table.autoFillHeight) {
      this.dealHeightMode();
    }

    // this.dealWidthMode();
    // this.dealHeightMode();
    this.resetFrozen();
    // this.dealFrozen();
    this.updateTableSize();
    this.updateBorderSizeAndPosition();
    this.component.updateScrollBar();
    if (
      this.table.widthMode === 'adaptive' ||
      this.table.heightMode === 'adaptive' ||
      this.table.autoFillWidth ||
      this.table.autoFillHeight
    ) {
      this.updateChartSize(this.table.rowHeaderLevelCount);
    }

    this.proxy.progress();
    // this.stage.window.resize(width, height);
    this.updateNextFrame();
  }

  updateTableSize() {
    this.tableGroup.setAttributes({
      x: this.table.tableX,
      y: this.table.tableY,
      width: Math.min(
        this.table.tableNoFrameWidth,
        Math.max(
          this.colHeaderGroup.attribute.width,
          this.bodyGroup.attribute.width,
          this.bottomFrozenGroup.attribute.width,
          0
        ) +
          Math.max(
            this.cornerHeaderGroup.attribute.width,
            this.rowHeaderGroup.attribute.width,
            this.leftBottomCornerGroup.attribute.width,
            0
          ) +
          Math.max(
            this.rightTopCornerGroup.attribute.width,
            this.rightFrozenGroup.attribute.width,
            this.rightBottomCornerGroup.attribute.width,
            0
          )
      ),
      height: Math.min(
        this.table.tableNoFrameHeight,
        Math.max(
          this.colHeaderGroup.attribute.height,
          this.cornerHeaderGroup.attribute.height,
          this.rightTopCornerGroup.attribute.height,
          0
        ) +
          Math.max(
            this.rowHeaderGroup.attribute.height,
            this.bodyGroup.attribute.height,
            this.rightFrozenGroup.attribute.height,
            0
          ) +
          Math.max(
            this.leftBottomCornerGroup.attribute.height,
            this.bottomFrozenGroup.attribute.height,
            this.rightBottomCornerGroup.attribute.height,
            0
          )
      )
    } as any);

    if (this.tableGroup.border && this.tableGroup.border.type === 'rect') {
      this.tableGroup.border.setAttributes({
        x: this.table.tableX - this.tableGroup.border.attribute.lineWidth / 2,
        y: this.table.tableY - this.tableGroup.border.attribute.lineWidth / 2,
        width: this.tableGroup.attribute.width + this.tableGroup.border.attribute.lineWidth,
        height: this.tableGroup.attribute.height + this.tableGroup.border.attribute.lineWidth
      });
    } else if (this.tableGroup.border && this.tableGroup.border.type === 'group') {
      this.tableGroup.border.setAttributes({
        x: this.table.tableX - this.tableGroup.border.attribute.lineWidth / 2,
        y: this.table.tableY - this.tableGroup.border.attribute.lineWidth / 2,
        width: this.tableGroup.attribute.width + this.tableGroup.border.attribute.lineWidth,
        height: this.tableGroup.attribute.height + this.tableGroup.border.attribute.lineWidth
      });
      (this.tableGroup.border.firstChild as IRect)?.setAttributes({
        x: this.tableGroup.border.attribute.lineWidth / 2,
        y: this.tableGroup.border.attribute.lineWidth / 2,
        width: this.tableGroup.attribute.width,
        height: this.tableGroup.attribute.height
      });
    }

    if (this.table.bottomFrozenRowCount > 0) {
      this.bottomFrozenGroup.setAttribute(
        'y',
        this.tableGroup.attribute.height - this.bottomFrozenGroup.attribute.height
      );
      this.leftBottomCornerGroup.setAttributes({
        visible: true,
        y: this.tableGroup.attribute.height - this.bottomFrozenGroup.attribute.height,
        height: this.bottomFrozenGroup.attribute.height,
        width: this.table.getFrozenColsWidth()
      });
      this.rightBottomCornerGroup.setAttributes({
        visible: true,
        y: this.tableGroup.attribute.height - this.bottomFrozenGroup.attribute.height,
        height: this.bottomFrozenGroup.attribute.height
      });
    }

    if (this.table.rightFrozenColCount > 0) {
      this.rightFrozenGroup.setAttribute('x', this.tableGroup.attribute.width - this.table.getRightFrozenColsWidth());
      this.rightTopCornerGroup.setAttributes({
        visible: true,
        x: this.tableGroup.attribute.width - this.table.getRightFrozenColsWidth(),
        width: this.table.getRightFrozenColsWidth(),
        height: this.table.getFrozenRowsHeight()
      });
      this.rightBottomCornerGroup.setAttributes({
        visible: true,
        x: this.tableGroup.attribute.width - this.table.getRightFrozenColsWidth(),
        width: this.table.getRightFrozenColsWidth()
      });
    }
  }

  updateRowHeight(row: number, detaY: number, skipTableHeightMap?: boolean) {
    detaY = Math.round(detaY);
    updateRowHeight(this, row, detaY, skipTableHeightMap);
    this.updateContainerHeight(row, detaY);
  }
  updateRowsHeight(rows: number[], detaYs: number[], skipTableHeightMap?: boolean) {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row >= this.proxy.rowStart && row <= this.proxy.rowEnd) {
        const detaY = detaYs[i];
        updateRowHeight(this, row, Math.round(detaY), skipTableHeightMap);
        this._updateContainerHeight(row, detaY);
      }
    }
    // 更新table/header/border高度
    this.updateTableSize();
    this.component.updateScrollBar();

    this.updateNextFrame();
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
  _updateContainerHeight(row: number, detaY: number) {
    if (row < this.table.frozenRowCount) {
      this.colHeaderGroup.setDeltaHeight(detaY);
      this.cornerHeaderGroup.setDeltaHeight(detaY);
      this.rowHeaderGroup.setDeltaY(detaY);
      this.bodyGroup.setDeltaY(detaY);
      this.rightFrozenGroup.setDeltaY(detaY);
    } else if (row >= this.table.rowCount - this.table.bottomFrozenRowCount) {
      this.leftBottomCornerGroup.setDeltaHeight(detaY);
      this.bottomFrozenGroup.setDeltaHeight(detaY);
      this.rightBottomCornerGroup.setDeltaHeight(detaY);
    } else {
      this.rowHeaderGroup.setDeltaHeight(detaY);
      this.bodyGroup.setDeltaHeight(detaY);
      this.rightFrozenGroup.setDeltaHeight(detaY);
    }
  }
  /**
   * @description: 更新table&header&body高度
   * @return {*}
   */
  updateContainerHeight(row: number, detaY: number) {
    this._updateContainerHeight(row, detaY);
    // 更新table/header/border高度
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
    this.table._clearColRangeWidthsMap(col);
  }

  setRowHeight(row: number, height: number) {
    const oldHeight = this.table.getRowHeight(row);
    if (oldHeight === height) {
      return;
    }
    if (
      (row >= this.proxy.rowStart && row <= this.proxy.rowEnd) ||
      (row >= this.table.rowCount - this.table.bottomFrozenRowCount && row <= this.table.rowCount - 1)
    ) {
      this.updateRowHeight(row, height - oldHeight);
    }
    this.table._clearRowRangeHeightsMap(row);
  }

  /**
   * @description: 设置表格的x位置，滚动中使用
   * @param {number} x
   * @return {*}
   */
  setX(x: number) {
    // if (this.colHeaderGroup.attribute.width + x === this.bodyGroup.attribute.x) {
    //   return;
    // }
    // // this.tableGroup.setAttribute('x', x);
    // // this.tableGroup.setAttribute('width', this.table.tableNoFrameWidth - x);
    // this.bodyGroup.setAttribute('x', this.rowHeaderGroup.attribute.width + x);
    // this.colHeaderGroup.setAttribute('x', this.rowHeaderGroup.attribute.width + x);

    // // (this.tableGroup.lastChild as any).setAttribute('width', this.table.tableNoFrameWidth - x);
    // this.updateNextFrame();
    this.table.scenegraph.proxy.setX(-x);
  }

  /**
   * @description: 更新表格的y位置，滚动中使用
   * @param {number} y
   * @return {*}
   */
  setY(y: number) {
    // if (this.transpose || this.isPivot) {
    //   if (this.colHeaderGroup.attribute.height + y === this.bodyGroup.attribute.y) {
    //     return;
    //   }
    //   this.bodyGroup.setAttribute('y', this.colHeaderGroup.attribute.height + y);
    //   this.rowHeaderGroup.setAttribute('y', this.colHeaderGroup.attribute.height + y);
    //   // this.tableGroup.setAttribute('height', this.table.tableNoFrameHeight - y);
    //   // (this.tableGroup.lastChild as any).setAttribute('width', this.table.tableNoFrameWidth - x);
    //   this.updateNextFrame();
    // } else if (this.table.scenegraph.proxy) {
    this.table.scenegraph.proxy.setY(-y);
    // }
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
    this.rowHeaderGroup.setAttribute('y', this.cornerHeaderGroup.attribute.height + y);
    if (this.table.rightFrozenColCount > 0) {
      this.rightFrozenGroup.setAttribute('y', this.rightTopCornerGroup.attribute.height + y);
    }
    // this.tableGroup.setAttribute('height', this.table.tableNoFrameHeight - y);
    // (this.tableGroup.lastChild as any).setAttribute('width', this.table.tableNoFrameWidth - x);
    this.updateNextFrame();
  }

  /**
   * @description: 更新表格的x位置，滚动中使用
   * @param {number} x
   * @return {*}
   */
  setBodyAndColHeaderX(x: number) {
    if (this.table.getFrozenColsWidth() + x === this.bodyGroup.attribute.x) {
      return;
    }
    this.bodyGroup.setAttribute('x', this.table.getFrozenColsWidth() + x);
    this.colHeaderGroup.setAttribute('x', this.table.getFrozenColsWidth() + x);
    if (this.table.bottomFrozenRowCount > 0) {
      this.bottomFrozenGroup.setAttribute('x', this.table.getFrozenColsWidth() + x);
    }
    this.updateNextFrame();
  }

  /**
   * @description: 完成创建场景树节点后，处理自动行高列宽
   * @return {*}
   */
  afterScenegraphCreated() {
    // this.dealWidthMode();
    // this.dealHeightMode();
    // 处理冻结
    // this.resetFrozen();
    // this.dealFrozen();

    if (!this.isPivot && !this.transpose) {
      this.component.setFrozenColumnShadow(this.table.frozenColCount - 1);
    }
    this.table.stateManager.checkFrozen();
    // this.updateContainerAttrWidthAndX();
    this.updateContainer();

    // 处理frame border
    this.createFrameBorder();
    this.updateBorderSizeAndPosition();

    // 更新滚动条状态
    this.component.updateScrollBar();
    // 处理单元格内容需要textStick的情况
    handleTextStick(this.table);

    this.updateNextFrame();
  }

  /**
   * @description: 处理宽度模式
   * @return {*}
   */
  dealWidthMode() {
    const table = this.table;
    if (table.widthMode === 'adaptive') {
      table._clearColRangeWidthsMap();
      const canvasWidth = table.tableNoFrameWidth;
      let actualHeaderWidth = 0;
      for (let col = 0; col < table.colCount; col++) {
        if (
          col < table.rowHeaderLevelCount ||
          (table.isPivotChart() && col >= table.colCount - table.rightFrozenColCount)
        ) {
          const colWidth = table.getColWidth(col);
          actualHeaderWidth += colWidth;
        }
      }
      const startCol = table.rowHeaderLevelCount;
      const endCol = table.isPivotChart() ? table.colCount - table.rightFrozenColCount : table.colCount;
      getAdaptiveWidth(canvasWidth - actualHeaderWidth, startCol, endCol, false, [], table, true);
    } else if (table.autoFillWidth) {
      table._clearColRangeWidthsMap();
      const canvasWidth = table.tableNoFrameWidth;
      let actualHeaderWidth = 0;
      let actualWidth = 0;
      for (let col = 0; col < table.colCount; col++) {
        const colWidth = table.getColWidth(col);
        if (
          col < table.rowHeaderLevelCount ||
          (table.isPivotChart() && col >= table.colCount - table.rightFrozenColCount)
        ) {
          actualHeaderWidth += colWidth;
        }
        actualWidth += colWidth;
      }
      // 如果内容宽度小于canvas宽度，执行adaptive放大
      if (actualWidth < canvasWidth && actualWidth > actualHeaderWidth) {
        const startCol = table.rowHeaderLevelCount;
        const endCol = table.isPivotChart() ? table.colCount - table.rightFrozenColCount : table.colCount;
        getAdaptiveWidth(canvasWidth - actualHeaderWidth, startCol, endCol, false, [], table, true);
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
    this.rowHeaderGroup.setAttribute('y', this.cornerHeaderGroup.attribute.height);
    this.bodyGroup.setAttributes({
      x: this.rowHeaderGroup.attribute.width,
      y: this.colHeaderGroup.attribute.height
    });
  }

  /**
   * @description: 处理高度模式
   * @return {*}
   */
  dealHeightMode() {
    const table = this.table;
    // 处理adaptive高度
    if (table.heightMode === 'adaptive') {
      table._clearRowRangeHeightsMap();
      // const canvasWidth = table.internalProps.canvas.width;
      const columnHeaderHeight = table.getRowsHeight(0, table.columnHeaderLevelCount - 1);
      const bottomHeaderHeight = table.isPivotChart() ? table.getBottomFrozenRowsHeight() : 0;
      const totalDrawHeight = table.tableNoFrameHeight - columnHeaderHeight - bottomHeaderHeight;
      const startRow = table.columnHeaderLevelCount;
      const endRow = table.isPivotChart() ? table.rowCount - table.bottomFrozenRowCount : table.rowCount;
      let actualHeight = 0;
      for (let row = startRow; row < endRow; row++) {
        actualHeight += table.getRowHeight(row);
      }
      const factor = totalDrawHeight / actualHeight;
      for (let row = startRow; row < endRow; row++) {
        let rowHeight;
        if (row === endRow - 1) {
          rowHeight = totalDrawHeight - table.getRowsHeight(startRow, endRow - 2);
        } else {
          rowHeight = Math.round(table.getRowHeight(row) * factor);
        }

        this.setRowHeight(row, rowHeight);
      }
    } else if (table.autoFillHeight) {
      table._clearRowRangeHeightsMap();
      const canvasHeight = table.tableNoFrameHeight;
      let actualHeight = 0;
      let actualHeaderHeight = 0;
      for (let row = 0; row < table.rowCount; row++) {
        const rowHeight = table.getRowHeight(row);
        if (
          row < table.columnHeaderLevelCount ||
          (table.isPivotChart() && row >= table.rowCount - table.bottomFrozenRowCount)
        ) {
          actualHeaderHeight += rowHeight;
        }

        actualHeight += rowHeight;
      }
      // table.scenegraph._dealAutoFillHeightOriginRowsHeight = actualHeight;
      // 如果内容高度小于canvas高度，执行adaptive放大
      if (
        (this._dealAutoFillHeightOriginRowsHeight ?? actualHeight) < canvasHeight &&
        actualHeight - actualHeaderHeight > 0
      ) {
        const startRow = table.columnHeaderLevelCount;
        const endRow = table.isPivotChart() ? table.rowCount - table.bottomFrozenRowCount : table.rowCount;
        const factor = (canvasHeight - actualHeaderHeight) / (actualHeight - actualHeaderHeight);
        for (let row = startRow; row < endRow; row++) {
          let rowHeight;
          if (row === endRow - 1) {
            rowHeight = canvasHeight - actualHeaderHeight - table.getRowsHeight(startRow, endRow - 2);
          } else {
            rowHeight = Math.round(table.getRowHeight(row) * factor);
          }
          this.setRowHeight(row, rowHeight);
        }
      }
    }
  }

  /**
   * @description: 处理冻结
   * @return {*}
   */
  dealFrozen() {
    dealFrozen(this);
  }

  /**
   * @description: 还原冻结
   * @return {*}
   */
  resetFrozen() {
    resetFrozen(this);
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
      const padding = getQuadProps(getProp('padding', headerStyle, col, row, this.table));

      // const text = cellGroup.getChildAt(1) as Text;
      const text = cellGroup.getChildByName('text') as Text;
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
  updateHeaderPosition(
    colSource: number,
    rowSource: number,
    colTarget: number,
    rowTarget: number,
    sourceMergeInfo: false | CellRange,
    targetMergeInfo: false | CellRange
  ) {
    moveHeaderPosition(colSource, rowSource, colTarget, rowTarget, sourceMergeInfo, targetMergeInfo, this.table);
  }

  updateContainerAttrWidthAndX() {
    // 更新各列x&col
    const cornerX = updateContainerChildrenX(this.cornerHeaderGroup, 0);
    const rowHeaderX = updateContainerChildrenX(this.rowHeaderGroup, 0);
    const colHeaderX =
      this.colHeaderGroup.hasChildNodes() && this.colHeaderGroup.firstChild
        ? updateContainerChildrenX(
            this.colHeaderGroup,
            (this.colHeaderGroup.firstChild as any).col > 0
              ? this.table.getColsWidth(this.table.frozenColCount ?? 0, (this.colHeaderGroup.firstChild as any).col - 1)
              : 0
          )
        : 0;
    const bodyX =
      this.bodyGroup.hasChildNodes() && this.bodyGroup.firstChild
        ? updateContainerChildrenX(
            this.bodyGroup,
            (this.bodyGroup.firstChild as any).col > 0
              ? this.table.getColsWidth(this.table.frozenColCount ?? 0, (this.bodyGroup.firstChild as any).col - 1)
              : 0
          )
        : 0;
    const rightX = updateContainerChildrenX(this.rightFrozenGroup, 0);

    this.bottomFrozenGroup.hasChildNodes() &&
      this.bottomFrozenGroup.firstChild &&
      updateContainerChildrenX(
        this.bottomFrozenGroup,
        (this.bottomFrozenGroup.firstChild as any).col > 0
          ? this.table.getColsWidth(this.table.frozenColCount ?? 0, (this.bottomFrozenGroup.firstChild as any).col - 1)
          : 0
      );
    updateContainerChildrenX(this.leftBottomCornerGroup, 0);
    updateContainerChildrenX(this.rightTopCornerGroup, 0);
    updateContainerChildrenX(this.rightBottomCornerGroup, 0);

    // 更新容器
    this.cornerHeaderGroup.setDeltaWidth(cornerX - this.cornerHeaderGroup.attribute.width);
    this.leftBottomCornerGroup.setDeltaWidth(cornerX - this.leftBottomCornerGroup.attribute.width);
    //TODO 可能有影响
    this.colHeaderGroup.setDeltaWidth(colHeaderX - this.colHeaderGroup.attribute.width);
    // this.rightFrozenGroup.setDeltaWidth(colHeaderX - this.table.getRightFrozenColsWidth());
    this.rowHeaderGroup.setDeltaWidth(rowHeaderX - this.rowHeaderGroup.attribute.width);
    this.bottomFrozenGroup.setDeltaWidth(colHeaderX - this.bottomFrozenGroup.attribute.width);
    this.rightFrozenGroup.setDeltaWidth(rightX - this.rightFrozenGroup.attribute.width);
    this.rightTopCornerGroup.setDeltaWidth(rightX - this.rightTopCornerGroup.attribute.width);
    this.rightBottomCornerGroup.setDeltaWidth(rightX - this.rightBottomCornerGroup.attribute.width);
    this.bodyGroup.setDeltaWidth(bodyX - this.bodyGroup.attribute.width);
    this.colHeaderGroup.setAttribute('x', this.cornerHeaderGroup.attribute.width);
    this.bottomFrozenGroup.setAttribute('x', this.table.getFrozenColsWidth());
    this.bodyGroup.setAttribute('x', this.rowHeaderGroup.attribute.width);
  }

  updateContainer() {
    // console.trace('updateContainer');

    this.updateContainerAttrWidthAndX();

    this.updateTableSize();

    // 记录滚动条原位置
    const oldHorizontalBarPos = this.table.stateManager.scroll.horizontalBarPos;
    const oldVerticalBarPos = this.table.stateManager.scroll.verticalBarPos;
    this.component.updateScrollBar();
    this.table.stateManager.setScrollLeft(oldHorizontalBarPos);
    this.table.stateManager.setScrollTop(oldVerticalBarPos);
    this.updateNextFrame();
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

    const isListTableWithFrozen = !this.isPivot;

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
    createFrameBorder(this.tableGroup, this.table.theme.frameStyle, this.tableGroup.role, undefined);
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
  ): { col: number; row: number; x?: number; rightFrozen?: boolean } {
    if (!cellGroup) {
      // to do: 处理最后一列外调整列宽
    } else {
      let cell: { col: number; row: number; x?: number; rightFrozen?: boolean };
      if (abstractX < cellGroup.globalAABBBounds.x1 + offset) {
        cell = { col: cellGroup.col - 1, row: cellGroup.row, x: cellGroup.globalAABBBounds.x1 };
      } else if (cellGroup.globalAABBBounds.x2 - offset < abstractX) {
        cell = { col: cellGroup.col, row: cellGroup.row, x: cellGroup.globalAABBBounds.x2 };
      }
      if (
        cell &&
        this.table.rightFrozenColCount > 0 &&
        cell.col === this.table.colCount - this.table.rightFrozenColCount - 1 &&
        this.table.tableNoFrameWidth -
          this.table.getFrozenColsWidth() -
          this.table.getRightFrozenColsWidth() +
          this.table.scrollLeft <
          this.bodyGroup.attribute.width
      ) {
        // 有右侧冻结列，并且横向没有滚动到最右侧时，右侧冻结列左侧调整对只对右侧冻结列生效
        cell.col = cell.col + 1;
        cell.rightFrozen = true;
      }
      if (cell) {
        return cell;
      }
    }
    return { col: -1, row: -1 };
  }

  updateFrozen() {
    if (this.clear) {
      return;
    }
    this.resetFrozen();
    // this.dealFrozen();
    this.component.updateScrollBar();
  }

  dealWidthRightFrozen(rightFrozenColCount: number) {
    if (this.clear) {
      this.table.internalProps.rightFrozenColCount = rightFrozenColCount;
      return;
    }
    dealRightFrozen(rightFrozenColCount, this);
  }
  dealWidthBottomFrozen(bottomFrozenRowCount: number) {
    if (this.clear) {
      this.table.internalProps.bottomFrozenRowCount = bottomFrozenRowCount;
      return;
    }
    dealBottomFrozen(bottomFrozenRowCount, this);
  }

  updateBorderSizeAndPosition() {
    if (this.bodyGroup.border) {
      this.bodyGroup.appendChild(this.bodyGroup.border);
      updateFrameBorderSize(this.bodyGroup);
      if (this.rowHeaderGroup.attribute.width === 0) {
        updateFrameBorder(this.bodyGroup, this.table.theme.bodyStyle.frameStyle);
      } else {
        updateFrameBorder(this.bodyGroup, this.table.theme.bodyStyle.frameStyle);
      }
    }
    if (this.colHeaderGroup.border) {
      this.colHeaderGroup.appendChild(this.colHeaderGroup.border);
      updateFrameBorderSize(this.colHeaderGroup);
      if (this.cornerHeaderGroup.attribute.width === 0) {
        updateFrameBorder(this.colHeaderGroup, this.table.theme.headerStyle.frameStyle);
      } else {
        updateFrameBorder(this.colHeaderGroup, this.table.theme.headerStyle.frameStyle);
      }
    }
    if (this.rowHeaderGroup.border) {
      this.rowHeaderGroup.appendChild(this.rowHeaderGroup.border);
      updateFrameBorderSize(this.rowHeaderGroup);
    }
    if (this.cornerHeaderGroup.border) {
      this.cornerHeaderGroup.appendChild(this.cornerHeaderGroup.border);
      updateFrameBorderSize(this.cornerHeaderGroup);
    }

    updateCornerRadius(this.table);
  }

  sortCell() {
    if (this.isPivot) {
      // 透视表外部处理排序
    } else if (this.transpose) {
      this.proxy.sortCellHorizontal();
    } else {
      this.proxy.sortCellVertical();
    }
  }

  getCellOverflowText(col: number, row: number): string | null {
    const cellGroup = this.getCell(col, row);
    const text = cellGroup.getChildByName('text', true) as unknown as Text | RichText;

    if (text && text.type === 'text') {
      const textAttributeStr = isArray(text.attribute.text)
        ? text.attribute.text.join('')
        : (text.attribute.text as string);
      let cacheStr = '';
      if (isString(text.cache.clipedText)) {
        cacheStr = text.cache.clipedText;
      } else {
        (text.cache as ITextCache).layoutData?.lines?.forEach((line: any) => {
          cacheStr += line.str;
        });
      }
      if (cacheStr !== textAttributeStr) {
        return textAttributeStr;
      }
    } else if (text && text.type === 'richtext') {
      const richtext = text;
      if (
        richtext.attribute.ellipsis &&
        richtext._frameCache &&
        richtext.attribute.height < richtext._frameCache.actualHeight
      ) {
        const textConfig = richtext.attribute.textConfig.find((item: any) => item.text);
        return (textConfig as any).text as string;
      }
    }
    return null;
  }

  updateDrill(visible: boolean, x: number, y: number, drillDown: boolean, drillUp: boolean) {
    this.component.drillIcon.update(visible, x, y, drillDown, drillUp, this);
  }

  updateCellContent(col: number, row: number) {
    if (this.clear) {
      return undefined;
    }
    return updateCell(col, row, this.table);
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

  updateRow(removeCells: CellAddress[], addCells: CellAddress[], updateCells: CellAddress[] = []) {
    const addRows = deduplication(addCells.map(cell => cell.row)).sort((a, b) => a - b);
    const updateRows = deduplication(updateCells.map(cell => cell.row)).sort((a, b) => a - b);
    //这个值是后续为了autoFillHeight判断逻辑中用到的 判断是否更新前是未填满的情况
    const isNotFillHeight =
      this.table.getAllRowsHeight() -
        [...addRows, ...updateRows].reduce((tolHeight, rowNumber) => {
          return tolHeight + this.table.getRowHeight(rowNumber);
        }, 0) <=
      this.table.tableNoFrameHeight;

    // add or move rows
    updateRow(removeCells, addCells, updateCells, this.table);

    // update column width and row height
    this.recalculateColWidths();

    // this.recalculateRowHeights();

    if (
      this.table.heightMode === 'adaptive' ||
      (this.table.autoFillHeight && (this.table.getAllRowsHeight() <= this.table.tableNoFrameHeight || isNotFillHeight))
    ) {
      this.table.scenegraph.recalculateRowHeights();
    } else if (this.table.heightMode === 'autoHeight') {
      for (let i = 0; i < updateRows.length; i++) {
        const row = updateRows[i];
        const oldHeight = this.table.getRowHeight(row);
        const newHeight = computeRowHeight(row, 0, this.table.colCount - 1, this.table);
        if (
          (row >= this.proxy.rowStart && row <= this.proxy.rowEnd) ||
          (row >= this.table.rowCount - this.table.bottomFrozenRowCount && row <= this.table.rowCount - 1)
        ) {
          this.table.scenegraph.updateRowHeight(row, newHeight - oldHeight);
        }
      }
    }
    // check frozen status
    this.table.stateManager.checkFrozen();

    // update frozen shadow
    if (!this.isPivot && !this.transpose) {
      this.component.setFrozenColumnShadow(this.table.frozenColCount - 1);
    }

    this.component.updateScrollBar();

    // rerender
    this.updateNextFrame();
  }
  updateCol(removeCells: CellAddress[], addCells: CellAddress[], updateCells: CellAddress[] = []) {
    // add or move rows
    updateCol(removeCells, addCells, updateCells, this.table);

    // update column width and row height
    this.recalculateColWidths();

    this.recalculateRowHeights();

    // check frozen status
    this.table.stateManager.checkFrozen();

    // update frozen shadow
    if (!this.isPivot && !this.transpose) {
      this.component.setFrozenColumnShadow(this.table.frozenColCount - 1);
    }

    this.component.updateScrollBar();

    // rerender
    this.updateNextFrame();
  }
  getColumnGroupX(col: number) {
    if (col < this.table.rowHeaderLevelCount) {
      // row header
      return this.table.getColsWidth(0, col - 1);
    } else if (col < this.table.colCount - this.table.rightFrozenColCount) {
      // body
      return this.table.getColsWidth(this.table.rowHeaderLevelCount, col - 1);
    } else if (col < this.table.colCount) {
      // right frozen
      return this.table.getColsWidth(this.table.colCount - this.table.bottomFrozenRowCount, col - 1);
    }
    return 0;
  }

  getCellGroupY(row: number) {
    if (row < this.table.columnHeaderLevelCount) {
      // column header
      return this.table.getRowsHeight(0, row - 1);
    } else if (row < this.table.rowCount - this.table.bottomFrozenRowCount) {
      // body
      return this.table.getRowsHeight(this.table.columnHeaderLevelCount, row - 1);
    } else if (row < this.table.rowCount) {
      // bottom frozen
      return this.table.getRowsHeight(this.table.rowCount - this.table.bottomFrozenRowCount, row - 1);
    }
    return 0;
  }
  getCellGroupX(col: number) {
    if (col < this.table.rowHeaderLevelCount) {
      // column header
      return this.table.getColsWidth(0, col - 1);
    } else if (col < this.table.colCount - this.table.rightFrozenColCount) {
      // body
      return this.table.getColsWidth(this.table.rowHeaderLevelCount, col - 1);
    } else if (col < this.table.colCount) {
      // bottom frozen
      return this.table.getColsWidth(this.table.colCount - this.table.rightFrozenColCount, col - 1);
    }
    return 0;
  }
  // /** 更新场景树某个单元格的值 */
  // updateCellValue(col: number, row: number) {
  //   updateCell(col, row, this.table);
  // }
}
