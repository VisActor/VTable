import { Rect } from '../tools/Rect';
import { MenuType } from '../scenegraph/component/menu';
import type { Group } from '../scenegraph/graphic/group';
import type { Icon } from '../scenegraph/graphic/icon';
import type {
  CellAddress,
  CellPosition,
  CellRange,
  DropDownMenuHighlightInfo,
  IDimensionInfo,
  ListTableAPI,
  MenuListItem,
  PivotTableAPI,
  SortOrder,
  SortState
} from '../ts-types';
import { HighlightScope, InteractionState, SortType } from '../ts-types';
import { IconFuncTypeEnum } from '../ts-types';
import { checkMultiCellInSelect } from './common/check-in-select';
import { updateHoverPosition } from './hover/update-position';
import { dealFreeze } from './frozen';
import { dealSort } from './sort';
import { selectEnd, updateSelectPosition } from './select/update-position';
import { cellInRange, getOrApply } from '../tools/helper';
import type { ListTable } from '../ListTable';
import { PIVOT_TABLE_EVENT_TYPE } from '../ts-types/pivot-table/PIVOT_TABLE_EVENT_TYPE';
import type { PivotHeaderLayoutMap } from '../layout/pivot-header-layout';
import { TABLE_EVENT_TYPE } from '../core/TABLE_EVENT_TYPE';
import { Bounds, isObject, isString, isValid } from '@visactor/vutils';
import { updateDrill } from './drill';
import { clearChartHover, updateChartHover } from './spark-line';
import { endMoveCol, startMoveCol, updateMoveCol } from './cell-move';
import type { FederatedWheelEvent, IRectGraphicAttribute } from '@src/vrender';
import type { TooltipOptions } from '../ts-types/tooltip';
import { getIconAndPositionFromTarget } from '../scenegraph/utils/icon';
import type { BaseTableAPI, HeaderData } from '../ts-types/base-table';
import { debounce } from '../tools/debounce';
import { updateResizeColumn } from './resize/update-resize-column';
import { changeRadioOrder, setRadioState, syncRadioState } from './radio/radio';
import {
  changeCheckboxOrder,
  initCheckedState,
  initLeftRecordsCheckState,
  setCheckedState,
  setHeaderCheckedState,
  syncCheckedState,
  updateHeaderCheckedState
} from './checkbox/checkbox';
import { updateResizeRow } from './resize/update-resize-row';
import { deleteAllSelectingBorder } from '../scenegraph/select/delete-select-border';
import type { PivotTable } from '../PivotTable';
import { traverseObject } from '../tools/util';
import type { ColumnData } from '../ts-types/list-table/layout-map/api';
import { addCustomSelectRanges, deletaCustomSelectRanges } from './select/custom-select';
import { expendCellRange } from '../tools/merge-range';

export type CustomSelectionStyle = {
  cellBorderColor?: string; //边框颜色
  cellBorderLineWidth?: number; //边框线宽度
  cellBorderLineDash?: number[]; //边框线虚线
  cellBgColor?: string; //选择框背景颜色
};

export class StateManager {
  table: BaseTableAPI;
  /**
   * Default 默认展示
   * grabing 拖拽中
   *   -Resize column 改变列宽
   *   -column move 调整列顺序
   *   -drag select 拖拽多选
   * Scrolling 滚动中
   */
  interactionState: InteractionState;
  interactionStateBeforeScroll?: InteractionState;
  // select记录两个位置，第二个位置只在range模式生效
  select: {
    ranges: (CellRange & { skipBodyMerge?: boolean })[];
    highlightScope: HighlightScope;
    cellPos: CellPosition;
    // cellPosStart: CellPosition;
    // cellPosEnd: CellPosition;
    singleStyle?: boolean; // select当前单元格是否使用单独样式
    disableHeader?: boolean; // 是否禁用表头select
    disableCtrlMultiSelect?: boolean; // 是否禁用ctrl多选框
    /** 点击表头单元格效果
     * 'inline': 点击行表头则整行选中，选择列表头则整列选中；
     * 'cell': 仅仅选择当前点击的表头单元格；
     * 'body': 不选择表头，点击行表头则选择该行所有 body 单元格，点击列表头则选择该列所有 body 单元格。
     */
    headerSelectMode?: 'inline' | 'cell' | 'body';
    highlightInRange?: boolean;
    selecting: boolean;
    customSelectRanges?: {
      range: CellRange;
      style: CustomSelectionStyle;
    }[];
  };
  fillHandle: {
    direction?: 'top' | 'bottom' | 'left' | 'right';
    directionRow?: boolean;
    isFilling: boolean;
    startX: number;
    startY: number;
    beforeFillMinCol?: number;
    beforeFillMinRow?: number;
    beforeFillMaxCol?: number;
    beforeFillMaxRow?: number;
  };
  hover: {
    highlightScope: HighlightScope; // hover模式
    singleStyle?: boolean; // hover当前单元格是否使用单独样式
    disableHeader?: boolean; // 是否禁用表头hover
    cellPos: CellPosition; // 记录当前hover的位置
    cellPosContainHeader?: CellPosition; // 记录当前hover的位置(在disableHeader时启用，记录真实位置)
  };
  hoverIcon: {
    col: number;
    row: number;
    icon: Icon | null;
  };
  residentHoverIcon?: {
    col: number;
    row: number;
    icon: Icon | null;
  };
  columnResize: {
    col: number;
    /** x坐标是相对table内坐标 */
    x: number;
    resizing: boolean;
    isRightFrozen?: boolean;
  };
  rowResize: {
    row: number;
    /** x坐标是相对table内坐标 */
    y: number;
    resizing: boolean;
    isBottomFrozen?: boolean;
  };
  columnMove: {
    colSource: number;
    colTarget: number;
    rowSource: number;
    rowTarget: number;
    x: number;
    y: number;
    moving: boolean;
  };
  menu: {
    x: number;
    y: number;
    isShow: boolean;
    itemList: MenuListItem[];
    bounds: Bounds;
    highlightIndex: number;
    dropDownMenuHighlight?: DropDownMenuHighlightInfo[];
  };
  sort: Array<{
    col: number;
    row: number;
    field?: string;
    // fieldKey?: string;
    order: SortOrder;
    icon?: Icon;
  }>;
  frozen: {
    col: number;
    row: number;
    icon?: Icon;
  };
  scroll: {
    horizontalBarPos: number;
    verticalBarPos: number;
  };
  tablePosition: {
    absoluteX: number;
    absoluteY: number;
  };
  drill: {
    dimensionKey?: string;
    title?: string;
    drillDown?: boolean;
    drillUp?: boolean;
    col: number;
    row: number;
  };
  // 当鼠标hover到迷你图上时存储行列值，好在鼠标移动到其他单元格时清理Sparkline的高亮状态
  sparkLine: {
    col: number;
    row: number;
  };
  _clearVerticalScrollBar: any;
  _clearHorizontalScrollBar: any;

  fastScrolling: boolean = false;

  /**
   * 对应原始数据列表顺序的checked状态
   */
  // checkedState: Record<string | number, boolean>[] = [];
  checkedState: Map<string | number, Record<string | number, boolean | 'indeterminate'>> = new Map();
  /**
   * 对应表头checked状态
   */
  headerCheckedState: Record<string | number, boolean | 'indeterminate'> = {};

  _checkboxCellTypeFields: (string | number)[] = [];

  _headerCheckFuncs: Record<string | number, Function> = {};

  radioState: Record<string | number, boolean | number | Record<number, number>> = {};
  // 供滚动重置为default使用
  resetInteractionState = debounce((state?: InteractionState) => {
    this.updateInteractionState(state ?? InteractionState.default);
  }, 100);
  // _x: number = 0;
  constructor(table: BaseTableAPI) {
    this.table = table;
    this.initState();

    this.updateVerticalScrollBar = this.updateVerticalScrollBar.bind(this);
    this.updateHorizontalScrollBar = this.updateHorizontalScrollBar.bind(this);
  }

  initState() {
    this._initState();
    this.setHoverState();
    this.setSelectState();
    this.setFrozenState();
  }
  /** updateOption更新配置的情况下 调用接口*/
  updateOptionSetState() {
    this._updateOptionSetState();
    this.setHoverState();
    this.setSelectState();
    this.setFrozenState();
  }
  _updateOptionSetState() {
    this.interactionState = InteractionState.default;
    // this.select = {
    //   highlightScope: HighlightScope.single,
    //   ranges: [],
    //   cellPos: {
    //     col: -1,
    //     row: -1
    //   },
    //   selecting: false
    // };
    // this.hover = {
    //   highlightScope: HighlightScope.single,
    //   cellPos: {
    //     col: -1,
    //     row: -1
    //   }
    // };
    this.hoverIcon = {
      col: -1,
      row: -1,
      icon: null
    };
    this.columnResize = {
      col: -1,
      x: 0,
      resizing: false
    };
    this.rowResize = {
      row: -1,
      y: 0,
      resizing: false
    };
    this.columnMove = {
      colSource: -1,
      colTarget: -1,
      rowSource: -1,
      rowTarget: -1,
      x: 0,
      y: 0,
      moving: false
    };
    this.menu = {
      x: -1,
      y: -1,
      isShow: false,
      itemList: [],
      bounds: new Bounds(),
      highlightIndex: -1,
      dropDownMenuHighlight: []
    };
    this.sort = [
      {
        col: -1,
        row: -1,
        order: 'normal'
      }
    ];
    this.frozen = {
      col: -1,
      row: -1
    };
    // this.scroll = {
    //   horizontalBarPos: 0,
    //   verticalBarPos: 0
    // };
    this.tablePosition = {
      absoluteX: 0,
      absoluteY: 0
    };
    this.drill = {
      col: -1,
      row: -1
    };
    this.sparkLine = {
      col: -1,
      row: -1
    };
  }
  _initState() {
    this.interactionState = InteractionState.default;
    this.select = {
      highlightScope: HighlightScope.single,
      ranges: [],
      cellPos: {
        col: -1,
        row: -1
      },
      selecting: false
    };
    this.fillHandle = {
      isFilling: false,
      startX: undefined,
      startY: undefined
    };
    this.hover = {
      highlightScope: HighlightScope.single,
      cellPos: {
        col: -1,
        row: -1
      }
    };
    this.hoverIcon = {
      col: -1,
      row: -1,
      icon: null
    };
    this.columnResize = {
      col: -1,
      x: 0,
      resizing: false
    };
    this.rowResize = {
      row: -1,
      y: 0,
      resizing: false
    };
    this.columnMove = {
      colSource: -1,
      colTarget: -1,
      rowSource: -1,
      rowTarget: -1,
      x: 0,
      y: 0,
      moving: false
    };
    this.menu = {
      x: -1,
      y: -1,
      isShow: false,
      itemList: [],
      bounds: new Bounds(),
      highlightIndex: -1,
      dropDownMenuHighlight: []
    };
    this.sort = [
      {
        col: -1,
        row: -1,
        order: 'normal'
      }
    ];
    this.frozen = {
      col: -1,
      row: -1
    };
    this.scroll = {
      horizontalBarPos: 0,
      verticalBarPos: 0
    };
    this.tablePosition = {
      absoluteX: 0,
      absoluteY: 0
    };
    this.drill = {
      col: -1,
      row: -1
    };
    this.sparkLine = {
      col: -1,
      row: -1
    };
  }

  setHoverState() {
    const { highlightMode, disableHover, disableHeaderHover } = this.table.options.hover ?? {
      highlightMode: 'cell'
    };
    if (!disableHover) {
      if (highlightMode === 'cross') {
        this.hover.highlightScope = HighlightScope.cross;
      } else if (highlightMode === 'row') {
        this.hover.highlightScope = HighlightScope.row;
      } else if (highlightMode === 'column') {
        this.hover.highlightScope = HighlightScope.column;
      } else if (highlightMode === 'cell') {
        this.hover.highlightScope = HighlightScope.single;
      }
    } else {
      this.hover.highlightScope = HighlightScope.none;
    }

    this.hover.singleStyle = !disableHover;
    this.hover.disableHeader = disableHeaderHover;
    if (this.hover.highlightScope === HighlightScope.none || disableHeaderHover) {
      this.hover.cellPosContainHeader = {
        col: -1,
        row: -1
      };
    }
  }

  setSelectState() {
    const {
      // enableRowHighlight,
      // enableColumnHighlight,
      /** 点击表头单元格时连带body整行或整列选中 或仅选中当前单元格，默认或整行或整列选中*/
      headerSelectMode,
      disableSelect,
      disableHeaderSelect,
      highlightMode,
      highlightInRange
    } = Object.assign(
      {},
      {
        /** 点击表头单元格时连带body整行或整列选中 或仅选中当前单元格，默认或整行或整列选中*/
        headerSelectMode: 'inline',
        disableSelect: false,
        disableHeaderSelect: false,
        highlightMode: 'cell',
        highlightInRange: false
      },
      this.table.options.select
    );

    // if (enableRowHighlight && enableColumnHighlight) {
    //   this.select.highlightScope = HighlightScope.cross;
    // } else if (enableRowHighlight) {
    //   this.select.highlightScope = HighlightScope.row;
    // } else if (enableColumnHighlight) {
    //   this.select.highlightScope = HighlightScope.column;
    // } else
    if (disableSelect === true) {
      this.select.highlightScope = HighlightScope.none;
    } else {
      if (highlightMode === 'cross') {
        this.select.highlightScope = HighlightScope.cross;
      } else if (highlightMode === 'row') {
        this.select.highlightScope = HighlightScope.row;
      } else if (highlightMode === 'column') {
        this.select.highlightScope = HighlightScope.column;
      } else {
        this.select.highlightScope = HighlightScope.single;
      }
    }

    this.select.singleStyle = !disableSelect;
    this.select.disableHeader = disableHeaderSelect;
    this.select.headerSelectMode = headerSelectMode;
    this.select.highlightInRange = highlightInRange;
    this.select.disableCtrlMultiSelect = this.table.options.keyboardOptions?.ctrlMultiSelect === false;
  }

  isSelected(col: number, row: number): boolean {
    // if (!this.select.selecting) {
    //   return false;
    // }
    let seled = false;
    this.select.ranges.forEach((range: CellRange) => {
      if (cellInRange(range, col, row)) {
        seled = true;
      }
    });
    return seled;
  }

  setSortState(sortState: SortState | SortState[]) {
    const state = this;
    sortState = !sortState || Array.isArray(sortState) ? sortState : [sortState];
    ////this.sort[this.sort.length - 1].field = sortState[sortState.length - 1]?.field as string;
    // this.sort.fieldKey = sortState?.fieldKey as string;
    ////this.sort[this.sort.length - 1].order = sortState[sortState.length - 1]?.order;
    // // 这里有一个问题，目前sortState中一般只传入了fieldKey，但是getCellRangeByField需要field
    // const range = this.table.getCellRangeByField(this.sort.field, 0);
    // if (range) {
    //   this.sort.col = range.start.col;
    //   this.sort.row = range.start.row;
    // }

    function flattenColumns(columns: any) {
      const result: Array<any> = [];

      function flatten(cols: any, parentStartIndex = 0) {
        cols.forEach((col: any) => {
          const startIndex = col.startInTotal
            ? col.startInTotal + state.table.internalProps.layoutMap.leftRowSeriesNumberColumnCount ?? 0
            : parentStartIndex;
          if (col.columns) {
            flatten(col.columns, startIndex);
          } else {
            result.push({
              ...col,
              startIndex
            });
          }
        });
      }

      flatten(columns);
      return result;
    }

    const sort =
      sortState &&
      (sortState as SortState[]).reduce((prev, item) => {
        const column = flattenColumns((this.table.internalProps as any).columns)?.find(
          column => column?.field === item?.field
        );
        //let path = (item as any)?.event?.path?.findLast((item:any)=>item.col!=undefined);
        if (this.table.internalProps.transpose) {
          prev.push({
            field: item.field,
            order: item.order,
            row: column?.startInTotal + this.table.internalProps.layoutMap.leftRowSeriesNumberColumnCount ?? 0,
            col: column?.level
          } as any);
        } else {
          prev.push({
            field: item.field,
            order: item.order,
            col: column?.startInTotal + this.table.internalProps.layoutMap.leftRowSeriesNumberColumnCount ?? 0,
            row: column?.level
          } as any);
        }

        return prev;
      }, []);

    this.sort = sort || [];
  }

  setFrozenState() {
    this.frozen.col = this.table.frozenColCount - 1;
    // this.frozen.row = 0;
  }

  updateInteractionState(mode: InteractionState) {
    if (this.interactionState === mode) {
      return;
    }

    if (mode === InteractionState.scrolling) {
      this.interactionStateBeforeScroll = this.interactionState;
    }

    // console.log('updateInteractionState', mode);
    const oldState = this.interactionState;
    this.interactionState = mode;
    // 处理mode 更新后逻辑
    if (oldState === InteractionState.scrolling && mode === InteractionState.default) {
      // this.table.scenegraph.stage.disableDirtyBounds();
      // this.table.scenegraph.stage.render();
      // this.table.scenegraph.stage.enableDirtyBounds();
    }
  }

  updateHoverhighlightScope(mode: HighlightScope) {
    if (this.hover.highlightScope === mode) {
      return;
    }
    this.hover.highlightScope = mode;
    // 处理mode 更新后逻辑
    // ......
  }

  updateHoverPos(col: number, row: number) {
    updateHoverPosition(this, col, row);
  }

  updateSelectPos(
    col: number,
    row: number,
    isShift: boolean = false,
    isCtrl: boolean = false,
    isSelectAll: boolean = false,
    makeSelectCellVisible: boolean = true,
    skipBodyMerge: boolean = false
  ) {
    if (row !== -1 && row !== -1) {
      this.select.selecting = true;
    }
    updateSelectPosition(this, col, row, isShift, isCtrl, isSelectAll, makeSelectCellVisible, skipBodyMerge);
  }

  checkCellRangeInSelect(cellPosStart: CellAddress, cellPosEnd: CellAddress) {
    return checkMultiCellInSelect(
      cellPosStart,
      cellPosEnd,
      this.select.ranges,
      // this.select.cellPosEnd,
      this.select.highlightScope
    );
  }

  updateHoverIcon(col: number, row: number, target: any, cellGroup: Group) {
    if (this.residentHoverIcon?.icon && target === this.residentHoverIcon?.icon) {
      return; // 常驻hover icon不更新交互
    }
    const iconInfo = getIconAndPositionFromTarget(target);
    if (!iconInfo) {
      // target非icon
      if (this.hoverIcon.icon && this.hoverIcon.icon !== this.residentHoverIcon?.icon) {
        this.table.scenegraph.setIconNormalStyle(this.hoverIcon.icon, this.hoverIcon.col, this.hoverIcon.row);

        this.hoverIcon.col = -1;
        this.hoverIcon.col = -1;
        this.hoverIcon.icon = null;
        this.table.scenegraph.updateNextFrame();
      }
      return;
    }
    if (iconInfo.type === 'richtext-icon') {
      // richtext icon 特殊处理
      const inlineIcon = iconInfo.icon;
      // 清除当前hover icon
      if (this.hoverIcon.icon && this.hoverIcon.icon !== this.residentHoverIcon?.icon) {
        this.table.scenegraph.setIconNormalStyle(this.hoverIcon.icon, this.hoverIcon.col, this.hoverIcon.row);

        this.hoverIcon.col = -1;
        this.hoverIcon.col = -1;
        this.hoverIcon.icon = null;
        this.table.scenegraph.updateNextFrame();
      }
      // hover展示tooltip
      if (inlineIcon.attribute.tooltip) {
        const tooltipOptions: TooltipOptions = {
          content: inlineIcon.attribute.tooltip.title,
          referencePosition: {
            rect: iconInfo.position,
            placement: inlineIcon.attribute.tooltip.placement
          },
          style: Object.assign(
            {},
            this.table.internalProps.theme?.tooltipStyle,
            inlineIcon.tooltip?.style,
            inlineIcon.attribute?.tooltip?.style
          ),
          disappearDelay: inlineIcon.attribute.tooltip.disappearDelay
        };
        if (!this.table.internalProps.tooltipHandler.isBinded(tooltipOptions)) {
          this.table.showTooltip(col, row, tooltipOptions);
        }
      }
    } else {
      // const icon = target as Icon;
      const icon = iconInfo.icon;
      if (icon !== this.hoverIcon.icon) {
        if (this.hoverIcon.icon && this.hoverIcon.icon !== this.residentHoverIcon?.icon) {
          this.table.scenegraph.setIconNormalStyle(this.hoverIcon.icon, this.hoverIcon.col, this.hoverIcon.row);
        }

        this.hoverIcon.col = col;
        this.hoverIcon.row = row;
        this.hoverIcon.icon = icon;

        // 更新icon样式
        this.table.scenegraph.setIconHoverStyle(icon, col, row, cellGroup);
        this.table.scenegraph.updateNextFrame();
      }
    }
  }

  isResizeCol(): boolean {
    return this.columnResize.resizing;
  }
  isResizeRow(): boolean {
    return this.rowResize.resizing;
  }
  isFillHandle(): boolean {
    return this.fillHandle.isFilling;
  }
  isSelecting(): boolean {
    return this.select.selecting;
  }
  endSelectCells(fireListener: boolean = true, fireClear: boolean = true) {
    if (this.select.selecting) {
      this.select.selecting = false;
      if (this.select.ranges.length === 0) {
        return;
      }

      // this.select.ranges deduplication
      const currentRange = this.select.ranges[this.select.ranges.length - 1];

      // deal with merge cell
      expendCellRange(currentRange, this.table);

      let isSame = false;
      for (let i = 0; i < this.select.ranges.length - 1; i++) {
        const range = this.select.ranges[i];
        if (
          range &&
          range.start.col === currentRange.start.col &&
          range.start.row === currentRange.start.row &&
          range.end.col === currentRange.end.col &&
          range.end.row === currentRange.end.row
        ) {
          isSame = true;
          break;
        }
      }
      if (isSame) {
        this.select.ranges.pop();
        // remove selecting rect
        deleteAllSelectingBorder(this.table.scenegraph);
        this.table.scenegraph.selectingRangeComponents.clear();
      } else {
        selectEnd(this.table.scenegraph);
      }

      // 触发SELECTED_CELL
      const lastCol = this.select.ranges[this.select.ranges.length - 1].end.col;
      const lastRow = this.select.ranges[this.select.ranges.length - 1].end.row;
      fireListener &&
        this.table.fireListeners(TABLE_EVENT_TYPE.SELECTED_CELL, {
          ranges: this.select.ranges,
          col: lastCol,
          row: lastRow
        });
    } else if (fireClear) {
      if (this.select.ranges.length === 0) {
        this.table.fireListeners(TABLE_EVENT_TYPE.SELECTED_CLEAR, {});
      }
    }
  }

  endResizeCol() {
    setTimeout(() => {
      this.columnResize.resizing = false;
    }, 0);
    this.table.scenegraph.updateChartSizeForResizeColWidth(this.columnResize.col);
    this.checkFrozen();
    this.table.scenegraph.component.hideResizeCol();
    this.table.scenegraph.updateNextFrame();
  }
  startResizeCol(col: number, x: number, y: number, isRightFrozen?: boolean) {
    this.columnResize.resizing = true;
    this.columnResize.col = col;
    this.columnResize.x = x;
    this.columnResize.isRightFrozen = isRightFrozen;

    this.table.scenegraph.component.showResizeCol(col, y, isRightFrozen);

    // // 调整列宽期间清空选中清空
    // const isHasSelected = !!this.select.ranges?.length;
    // this.updateSelectPos(-1, -1);
    // this.endSelectCells(true, isHasSelected);
    this.table.scenegraph.updateNextFrame();
  }
  updateResizeCol(xInTable: number, yInTable: number) {
    updateResizeColumn(xInTable, yInTable, this);
  }

  endResizeRow() {
    setTimeout(() => {
      this.rowResize.resizing = false;
    }, 0);
    this.table.scenegraph.updateChartSizeForResizeRowHeight(this.rowResize.row);
    // this.checkFrozen();
    this.table.scenegraph.component.hideResizeRow();
    this.table.scenegraph.updateNextFrame();
  }
  startResizeRow(row: number, x: number, y: number, isBottomFrozen?: boolean) {
    this.rowResize.resizing = true;
    this.rowResize.row = row;
    this.rowResize.y = y;
    this.rowResize.isBottomFrozen = isBottomFrozen;

    this.table.scenegraph.component.showResizeRow(row, x, isBottomFrozen);

    // // 调整列宽期间清空选中清空
    // const isHasSelected = !!this.select.ranges?.length;
    // this.updateSelectPos(-1, -1);
    // this.endSelectCells(true, isHasSelected);
    this.table.scenegraph.updateNextFrame();
  }
  updateResizeRow(xInTable: number, yInTable: number) {
    updateResizeRow(xInTable, yInTable, this);
  }

  startFillSelect(x: number, y: number) {
    this.fillHandle.isFilling = true;
    this.fillHandle.startX = x;
    this.fillHandle.startY = y;
    const currentRange = this.select.ranges[this.select.ranges.length - 1];
    this.fillHandle.beforeFillMinCol = Math.min(currentRange.start.col, currentRange.end.col);
    this.fillHandle.beforeFillMinRow = Math.min(currentRange.start.row, currentRange.end.row);
    this.fillHandle.beforeFillMaxCol = Math.max(currentRange.start.col, currentRange.end.col);
    this.fillHandle.beforeFillMaxRow = Math.max(currentRange.start.row, currentRange.end.row);
    // this.table.scenegraph.updateNextFrame();
    this.table.fireListeners(TABLE_EVENT_TYPE.MOUSEDOWN_FILL_HANDLE, {});
  }
  endFillSelect() {
    this.fillHandle.isFilling = false;
    this.fillHandle.startX = undefined;
    this.fillHandle.startY = undefined;
    this.fillHandle.directionRow = undefined;
    const currentMinCol = Math.min(this.select.ranges[0].start.col, this.select.ranges[0].end.col);
    const currentMinRow = Math.min(this.select.ranges[0].start.row, this.select.ranges[0].end.row);
    const currentMaxCol = Math.max(this.select.ranges[0].start.col, this.select.ranges[0].end.col);
    const currentMaxRow = Math.max(this.select.ranges[0].start.row, this.select.ranges[0].end.row);
    //如果选中区域没有发生变化 不触发事件
    if (
      this.fillHandle.beforeFillMinCol !== currentMinCol ||
      this.fillHandle.beforeFillMinRow !== currentMinRow ||
      this.fillHandle.beforeFillMaxCol !== currentMaxCol ||
      this.fillHandle.beforeFillMaxRow !== currentMaxRow
    ) {
      this.table.eventManager.isDraging &&
        this.table.fireListeners(TABLE_EVENT_TYPE.DRAG_FILL_HANDLE_END, { direction: this.fillHandle.direction });
    }
    this.fillHandle.beforeFillMaxCol = undefined;
    this.fillHandle.beforeFillMaxRow = undefined;
    this.fillHandle.beforeFillMinCol = undefined;
    this.fillHandle.beforeFillMinRow = undefined;
  }

  startMoveCol(col: number, row: number, x: number, y: number, event: MouseEvent | PointerEvent | TouchEvent) {
    startMoveCol(col, row, x, y, this, event);
  }
  updateMoveCol(col: number, row: number, x: number, y: number, event: MouseEvent | PointerEvent | TouchEvent) {
    updateMoveCol(col, row, x, y, this, event);
  }
  isMoveCol(): boolean {
    return this.columnMove.moving;
  }
  endMoveCol(): boolean {
    return endMoveCol(this);
  }

  checkFrozen() {
    // 判断固定列的总宽度 是否过大
    // let originalFrozenColCount =
    //   this.table.isListTable() && !this.table.internalProps.transpose
    //     ? this.table.options.frozenColCount
    //     : this.table.isPivotChart()
    //     ? this.table.rowHeaderLevelCount ?? 0
    //     : Math.max(
    //         (this.table.rowHeaderLevelCount ?? 0) + this.table.internalProps.layoutMap.leftRowSeriesNumberColumnCount,
    //         this.table.options.frozenColCount ?? 0
    //       );
    let originalFrozenColCount = this.table.options.frozenColCount
      ? this.table.options.frozenColCount
      : this.table.isPivotTable() || (this.table.isListTable() && this.table.internalProps.transpose)
      ? (this.table.rowHeaderLevelCount ?? 0) + this.table.internalProps.layoutMap.leftRowSeriesNumberColumnCount
      : 0;

    if (originalFrozenColCount) {
      if (originalFrozenColCount > this.table.colCount) {
        originalFrozenColCount = this.table.colCount;
      }

      const maxFrozenWidth = this.table._getMaxFrozenWidth();
      if (this.table.getColsWidth(0, originalFrozenColCount - 1) > maxFrozenWidth) {
        if (this.table.internalProps.unfreezeAllOnExceedsMaxWidth) {
          this.table._setFrozenColCount(0);
          this.setFrozenCol(-1);
        } else {
          const computedFrozenColCount = this.table._getComputedFrozenColCount(originalFrozenColCount);
          this.table._setFrozenColCount(computedFrozenColCount);
          this.setFrozenCol(computedFrozenColCount);
        }
      } else if (this.table.frozenColCount !== originalFrozenColCount) {
        this.table._setFrozenColCount(originalFrozenColCount);
        this.setFrozenCol(originalFrozenColCount);
      }
    }
  }
  setFrozenCol(col: number) {
    if (col !== this.frozen.col) {
      // const oldFrozenCol = this.frozen.col;
      this.frozen.col = col;

      // 更新scenegraph，这里因为dealFreeze更新了table里存储的frozen信息，会影响scenegraph里的getCell
      // 因此先更新scenegraph结构再更新icon
      this.table.scenegraph.updateFrozen();

      // 更新icon
      this.table.scenegraph.updateFrozenIcon(0, this.table.colCount - 1);
    } else {
      this.table.scenegraph.updateFrozenIcon(0, this.table.colCount - 1);
    }
  }
  setFrozenRow(row: number) {
    if (row !== this.frozen.row) {
      // const oldFrozenCol = this.frozen.col;
      this.frozen.row = row;

      // 更新scenegraph，这里因为dealFreeze更新了table里存储的frozen信息，会影响scenegraph里的getCell
      // 因此先更新scenegraph结构再更新icon
      this.table.scenegraph.updateRowFrozen();
    }
  }
  checkVerticalScrollBarEnd() {
    const totalHeight = this.table.getAllRowsHeight();
    const scrollTop = this.scroll.verticalBarPos;
    const viewHeight = this.table.tableNoFrameHeight;

    if (scrollTop + viewHeight >= totalHeight) {
      this.table.fireListeners(TABLE_EVENT_TYPE.SCROLL_VERTICAL_END, {
        scrollTop,
        scrollLeft: this.scroll.horizontalBarPos,
        scrollHeight: this.table.theme.scrollStyle?.width,
        scrollWidth: this.table.theme.scrollStyle?.width,
        viewHeight,
        viewWidth: this.table.tableNoFrameWidth
      });
    }
  }
  checkHorizontalScrollBarEnd() {
    const totalWidth = this.table.getAllColsWidth();
    const scrollLeft = this.scroll.horizontalBarPos;
    const viewWidth = this.table.tableNoFrameWidth;

    if (scrollLeft + viewWidth >= totalWidth) {
      this.table.fireListeners(TABLE_EVENT_TYPE.SCROLL_HORIZONTAL_END, {
        scrollTop: this.scroll.verticalBarPos,
        scrollLeft,
        scrollHeight: this.table.theme.scrollStyle?.width,
        scrollWidth: this.table.theme.scrollStyle?.width,
        viewHeight: this.table.tableNoFrameHeight,
        viewWidth
      });
    }
  }
  updateVerticalScrollBar(yRatio: number) {
    const totalHeight = this.table.getAllRowsHeight();
    const oldVerticalBarPos = this.scroll.verticalBarPos;
    this.scroll.verticalBarPos = Math.ceil(yRatio * (totalHeight - this.table.scenegraph.height));
    if (!isValid(this.scroll.verticalBarPos) || isNaN(this.scroll.verticalBarPos)) {
      this.scroll.verticalBarPos = 0;
    }
    this.table.scenegraph.setY(-this.scroll.verticalBarPos, yRatio === 1);
    this.scroll.verticalBarPos -= this.table.scenegraph.proxy.deltaY;
    this.table.scenegraph.proxy.deltaY = 0;

    // 滚动期间清空选中清空
    this.updateHoverPos(-1, -1);
    // this.updateSelectPos(-1, -1);

    this.table.fireListeners(TABLE_EVENT_TYPE.SCROLL, {
      event: undefined,
      scrollTop: this.scroll.verticalBarPos,
      scrollLeft: this.scroll.horizontalBarPos,
      scrollHeight: this.table.theme.scrollStyle?.width,
      scrollWidth: this.table.theme.scrollStyle?.width,
      viewHeight: this.table.tableNoFrameHeight,
      viewWidth: this.table.tableNoFrameWidth,
      scrollDirection: 'vertical',
      scrollRatioY: yRatio
    });

    if (oldVerticalBarPos !== this.scroll.verticalBarPos) {
      this.checkVerticalScrollBarEnd();
    }
  }
  updateHorizontalScrollBar(xRatio: number) {
    const totalWidth = this.table.getAllColsWidth();
    const oldHorizontalBarPos = this.scroll.horizontalBarPos;
    this.scroll.horizontalBarPos = Math.ceil(xRatio * (totalWidth - this.table.scenegraph.width));
    if (!isValid(this.scroll.horizontalBarPos) || isNaN(this.scroll.horizontalBarPos)) {
      this.scroll.horizontalBarPos = 0;
    }
    this.table.scenegraph.setX(-this.scroll.horizontalBarPos, xRatio === 1);
    this.scroll.horizontalBarPos -= this.table.scenegraph.proxy.deltaX;
    this.table.scenegraph.proxy.deltaX = 0;
    // console.log(this.table.scenegraph.bodyGroup.lastChild.attribute);
    // this.table.scenegraph.bodyGroup.lastChild.onBeforeAttributeUpdate = attr => {
    //   if (attr.x) {
    //     debugger;
    //   }
    // };
    // 滚动期间清空选中清空
    this.updateHoverPos(-1, -1);
    // this.updateSelectPos(-1, -1);
    this.table.fireListeners(TABLE_EVENT_TYPE.SCROLL, {
      event: undefined,
      scrollTop: this.scroll.verticalBarPos,
      scrollLeft: this.scroll.horizontalBarPos,
      scrollHeight: this.table.theme.scrollStyle?.width,
      scrollWidth: this.table.theme.scrollStyle?.width,
      viewHeight: this.table.tableNoFrameHeight,
      viewWidth: this.table.tableNoFrameWidth,
      scrollDirection: 'horizontal',
      scrollRatioX: xRatio
    });

    if (oldHorizontalBarPos !== this.scroll.horizontalBarPos) {
      this.checkHorizontalScrollBarEnd();
    }
  }
  setScrollTop(top: number, event?: FederatedWheelEvent, triggerEvent: boolean = true) {
    // 矫正top值范围
    const totalHeight = this.table.getAllRowsHeight();
    // _disableColumnAndRowSizeRound环境中，可能出现
    // getAllColsWidth/getAllRowsHeight(A) + getAllColsWidth/getAllRowsHeight(B) < getAllColsWidth/getAllRowsHeight(A+B)
    // （由于小数在取数时被省略）
    // 这里加入tolerance，避免出现无用滚动
    const sizeTolerance = this.table.options.customConfig?._disableColumnAndRowSizeRound ? 1 : 0;
    top = Math.max(0, Math.min(top, totalHeight - this.table.scenegraph.height - sizeTolerance));
    top = Math.ceil(top);
    // 滚动期间清空选中清空 如果调用接口hover状态需要保留，但是如果不调用updateHoverPos透视图处于hover状态的图就不能及时更新 所以这里单独判断了isPivotChart
    if (top !== this.scroll.verticalBarPos || this.table.isPivotChart()) {
      this.updateHoverPos(-1, -1);
    }
    const oldVerticalBarPos = this.scroll.verticalBarPos;
    // this.table.stateManager.updateSelectPos(-1, -1);
    this.scroll.verticalBarPos = top;
    if (!isValid(this.scroll.verticalBarPos) || isNaN(this.scroll.verticalBarPos)) {
      this.scroll.verticalBarPos = 0;
    }
    // 设置scenegraph坐标
    this.table.scenegraph.setY(-top);

    // 更新scrollbar位置
    const yRatio = top / (totalHeight - this.table.scenegraph.height);
    this.table.scenegraph.component.updateVerticalScrollBarPos(yRatio);

    if (oldVerticalBarPos !== top && triggerEvent) {
      this.table.fireListeners(TABLE_EVENT_TYPE.SCROLL, {
        event: (event as FederatedWheelEvent)?.nativeEvent as WheelEvent,
        scrollTop: this.scroll.verticalBarPos,
        scrollLeft: this.scroll.horizontalBarPos,
        scrollHeight: this.table.theme.scrollStyle?.width,
        scrollWidth: this.table.theme.scrollStyle?.width,
        viewHeight: this.table.tableNoFrameHeight,
        viewWidth: this.table.tableNoFrameWidth,
        scrollDirection: 'vertical',
        scrollRatioY: yRatio
      });

      this.checkVerticalScrollBarEnd();
    }
  }
  setScrollLeft(left: number, event?: FederatedWheelEvent, triggerEvent: boolean = true) {
    const oldScrollLeft = this.table.scrollLeft;
    // 矫正left值范围
    const totalWidth = this.table.getAllColsWidth();
    const frozenWidth = this.table.getFrozenColsWidth();

    // _disableColumnAndRowSizeRound环境中，可能出现
    // getAllColsWidth/getAllRowsHeight(A) + getAllColsWidth/getAllRowsHeight(B) < getAllColsWidth/getAllRowsHeight(A+B)
    // （由于小数在取数时被省略）
    // 这里加入tolerance，避免出现无用滚动
    const sizeTolerance = this.table.options.customConfig?._disableColumnAndRowSizeRound ? 1 : 0;

    left = Math.max(0, Math.min(left, totalWidth - this.table.scenegraph.width - sizeTolerance));
    left = Math.ceil(left);
    // 滚动期间清空选中清空
    if (left !== this.scroll.horizontalBarPos) {
      this.updateHoverPos(-1, -1);
    }
    // this.table.stateManager.updateSelectPos(-1, -1);
    const oldHorizontalBarPos = this.scroll.horizontalBarPos;
    this.scroll.horizontalBarPos = left;
    if (!isValid(this.scroll.horizontalBarPos) || isNaN(this.scroll.horizontalBarPos)) {
      this.scroll.horizontalBarPos = 0;
    }

    // 设置scenegraph坐标
    this.table.scenegraph.setX(-left);

    // 更新scrollbar位置
    const xRatio = left / (totalWidth - this.table.scenegraph.width);
    this.table.scenegraph.component.updateHorizontalScrollBarPos(xRatio);

    if (oldHorizontalBarPos !== left && triggerEvent) {
      this.table.fireListeners(TABLE_EVENT_TYPE.SCROLL, {
        event: (event as FederatedWheelEvent)?.nativeEvent as WheelEvent,
        scrollTop: this.scroll.verticalBarPos,
        scrollLeft: this.scroll.horizontalBarPos,
        scrollHeight: this.table.theme.scrollStyle?.width,
        scrollWidth: this.table.theme.scrollStyle?.width,
        viewHeight: this.table.tableNoFrameHeight,
        viewWidth: this.table.tableNoFrameWidth,
        scrollDirection: 'horizontal',
        scrollRatioX: xRatio
      });

      this.checkHorizontalScrollBarEnd();
    }
  }
  hideVerticalScrollBar() {
    this.table.scenegraph.component.hideVerticalScrollBar();
  }
  showVerticalScrollBar(autoHide?: boolean) {
    this.table.scenegraph.component.showVerticalScrollBar();
    if (autoHide) {
      // 滚轮触发滚动条显示后，异步隐藏
      clearTimeout(this._clearVerticalScrollBar);
      this._clearVerticalScrollBar = setTimeout(() => {
        this.table.scenegraph?.component.hideVerticalScrollBar();
      }, 1000);
    }
  }
  hideHorizontalScrollBar() {
    this.table.scenegraph.component.hideHorizontalScrollBar();
  }
  showHorizontalScrollBar(autoHide?: boolean) {
    this.table.scenegraph.component.showHorizontalScrollBar();
    if (autoHide) {
      // 滚轮触发滚动条显示后，异步隐藏
      clearTimeout(this._clearHorizontalScrollBar);
      this._clearHorizontalScrollBar = setTimeout(() => {
        this.table.scenegraph?.component.hideHorizontalScrollBar();
      }, 1000);
    }
  }

  triggerContextMenu(col: number, row: number, x: number, y: number) {
    if (this.menu.isShow && this.menu.x === x && this.menu.y === y) {
      this.hideMenu();
    } else {
      this.showContextMenu(col, row, x, y);
    }
  }

  showContextMenu(col: number, row: number, x: number, y: number) {
    if (this.table.internalProps.menu?.contextMenuItems) {
      if (this.table.internalProps.menu.renderMode === 'html') {
        // dom菜单通过LG_EVENT_TYPE.DROPDOWN_ICON_CLICK事件触发
        this.menu.isShow = true;
      } else {
        this.menu.isShow = true;
        this.menu.x = x;
        this.menu.y = y;
        this.table.scenegraph.component.menu.attach(x, y, col, row, MenuType.contextmenu);
      }
      this.table.fireListeners(TABLE_EVENT_TYPE.SHOW_MENU, { x, y, col, row, type: 'contextmenu' });
    }
  }

  triggerDropDownMenu(col: number, row: number, x: number, y: number, event: Event) {
    this.table.fireListeners(TABLE_EVENT_TYPE.DROPDOWN_ICON_CLICK, {
      col,
      row,
      event
    });
    if (this.menu.isShow) {
      this.hideMenu();
    } else {
      this.showDropDownMenu(col, row, x, y);
    }
  }

  showDropDownMenu(col: number, row: number, x: number, y: number) {
    if (this.table.internalProps.menu.renderMode === 'html') {
      // dom菜单通过LG_EVENT_TYPE.CONTEXTMENU_CELL事件触发
      this.menu.isShow = true;
    } else {
      this.menu.isShow = true;
      this.table.scenegraph.component.menu.attach(x, y, col, row, MenuType.dropDown);
      this.menu.bounds = this.table.scenegraph.component.menu.bounds as Bounds;
    }
    this.table.fireListeners(TABLE_EVENT_TYPE.SHOW_MENU, { x, y, col, row, type: 'dropDown' });

    if (this.residentHoverIcon) {
      this.table.scenegraph.setIconNormalStyle(
        this.residentHoverIcon.icon,
        this.residentHoverIcon.col,
        this.residentHoverIcon.row
      );
    }
    // 常驻显示下拉菜单hover按钮
    const cellGroup = this.table.scenegraph.getCell(col, row);
    let icon: Icon;
    cellGroup.forEachChildren((child: Icon) => {
      if (child.attribute.funcType === IconFuncTypeEnum.dropDown) {
        icon = child;
        return true;
      }
      return false;
    });
    if (icon) {
      this.residentHoverIcon = {
        col,
        row,
        icon
      };
      this.table.scenegraph.setIconHoverStyle(
        this.residentHoverIcon.icon,
        this.residentHoverIcon.col,
        this.residentHoverIcon.row,
        cellGroup
      );
      // (icon as any).oldVisibleTime = icon.attribute.visibleTime;
      // icon.setAttribute('visibleTime', 'always');
      // icon.setAttribute('opacity', 1);
      this.table.scenegraph.residentHoverIcon(col, row);
    }
  }

  hideMenu() {
    if (this.menu.isShow) {
      this.table.fireListeners(TABLE_EVENT_TYPE.DROPDOWN_MENU_CLEAR, null);
      this.table.fireListeners(TABLE_EVENT_TYPE.HIDE_MENU, null);
      this.menu.isShow = false;
      this.table.scenegraph.component.menu.detach();
      if (this.residentHoverIcon) {
        this.table.scenegraph.setIconNormalStyle(
          this.residentHoverIcon.icon,
          this.residentHoverIcon.col,
          this.residentHoverIcon.row
        );
        // this.residentHoverIcon.icon.setAttribute('visibleTime', (this.residentHoverIcon.icon as any).oldVisibleTime);
        // this.residentHoverIcon.icon.setAttribute(
        //   'opacity',
        //   this.residentHoverIcon.icon.attribute.visibleTime === 'always' ? 1 : 0
        // );
        this.table.scenegraph.resetResidentHoverIcon(this.residentHoverIcon.col, this.residentHoverIcon.row);
        this.residentHoverIcon = null;
      }
    }
  }

  setDropDownMenuHighlight(dropDownMenuInfo: DropDownMenuHighlightInfo[]): void {
    this.menu.dropDownMenuHighlight = dropDownMenuInfo;
    for (let i = 0; i < dropDownMenuInfo.length; i++) {
      const { col, row } = dropDownMenuInfo[i];
      const range = this.table.getCellRange(col, row);
      if (!range) {
        continue;
      }
      for (let col = range.start.col; col <= range.end.col; col++) {
        for (let row = range.start.row; row <= range.end.row; row++) {
          this.table.scenegraph.updateCellContent(col, row);
        }
      }
    }
  }
  dropDownMenuIsHighlight(colNow: number, rowNow: number, index: number): boolean {
    const highlights = this.menu.dropDownMenuHighlight;
    if (Array.isArray(highlights)) {
      for (let i = 0; i < highlights.length; i++) {
        const highlight = highlights[i];
        let { col, row } = highlight;
        const { field, menuKey } = highlight;
        // 这部分比较hack，需要和张宏再确认一下
        // 没有col和row时，通过field或cellHeaderPaths确定col和row
        if (typeof col !== 'number' || typeof row !== 'number') {
          if (this.table.isPivotTable() && typeof Array.isArray(field)) {
            const cellAddress = (this.table.internalProps.layoutMap as PivotHeaderLayoutMap).getPivotCellAdress(
              field as IDimensionInfo[]
            );
            if (!cellAddress) {
              continue;
            }
            col = cellAddress.col;
            row = cellAddress.row;
          } else {
            const cellAddress = this.table.internalProps.layoutMap.getHeaderCellAddressByField(field as string);
            if (!cellAddress) {
              continue;
            }
            col = cellAddress.col;
            row = cellAddress.row;
          }
        }

        if (isValid(col) && isValid(row) && this.table.isCellRangeEqual(colNow, rowNow, col, row)) {
          // 手动查询menuKey对应的dropDownIndex
          const headerC = this.table._getHeaderLayoutMap(col ?? colNow, row ?? rowNow);

          let dropDownMenu = (headerC as HeaderData).dropDownMenu || this.table.globalDropDownMenu;
          if (typeof dropDownMenu === 'function') {
            dropDownMenu = dropDownMenu({ row, col, table: this.table });
          }

          if (dropDownMenu) {
            for (let i = 0; i < dropDownMenu.length; i++) {
              const item: any = dropDownMenu[i];
              if (isObject(item) && ((item as any).menuKey || (item as any).text) === (menuKey || '') && i === index) {
                // return i === index;
                return true;
              } else if (isString(item) && item === menuKey && i === index) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }
  triggerSort(col: number, row: number, iconMark: Icon, event: Event) {
    if (this.table.isPivotTable()) {
      // 透视表不执行sort操作
      const sortState = (this.table as PivotTableAPI).getPivotSortState(col, row);

      const order = sortState ? (sortState.toUpperCase() as SortOrder) : 'NORMAL';
      const new_order = order === 'ASC' ? 'DESC' : order === 'DESC' ? 'NORMAL' : 'ASC';
      // const new_order = order === 'ASC' ? 'DESC' : 'ASC';
      (this.table as PivotTable).sort(col, row, new_order);

      // // 触发透视表排序按钮点击
      this.table.fireListeners(PIVOT_TABLE_EVENT_TYPE.PIVOT_SORT_CLICK, {
        col: col,
        row: row,
        order: order || 'normal',
        dimensionInfo: (this.table.internalProps.layoutMap as PivotHeaderLayoutMap).getPivotDimensionInfo(col, row),
        cellLocation: this.table.getCellLocation(col, row),
        event
      });
      return;
    }

    const previousSort = [...this.sort];
    const previousSortItem =
      this.table.internalProps.multipleSort || !previousSort.length ? null : this.sort[this.sort.length - 1];

    // 执行sort
    dealSort(col, row, this.table as ListTableAPI, event);

    const range = this.table.getCellRange(col, row);
    const currentSortItem = this.sort.find(item => item.col === range.start.col && item.row === range.start.row);

    const oldSortCol = this.table.internalProps.multipleSort || !previousSortItem ? null : previousSortItem.col;
    const oldSortRow = this.table.internalProps.multipleSort || !previousSortItem ? null : previousSortItem.row;
    //currentSortItem.col = col;
    //currentSortItem.row = row;

    const currentSortItemIndex = previousSort.findIndex(item => item.col === col && item.row === row);
    if (currentSortItemIndex >= 0) {
      previousSort.splice(currentSortItemIndex, 1);
    }

    // 更新icon
    this.table.scenegraph.updateSortIcon({
      col: col,
      row: row,
      iconMark,
      order: currentSortItem?.order,
      oldSortCol,
      oldSortRow,
      oldIconMark: previousSortItem?.icon
    });
    if (currentSortItem) {
      currentSortItem.icon = iconMark;
    }

    if (!this.table.internalProps.multipleSort) {
      previousSort.forEach((sortItem: any) => {
        this.table.scenegraph.updateSortIcon({
          col: null,
          row: null,
          iconMark: null,
          order: 'normal',
          oldSortCol: sortItem.col,
          oldSortRow: sortItem.row,
          oldIconMark: null
        });
      });
    }
    this.table.fireListeners(PIVOT_TABLE_EVENT_TYPE.AFTER_SORT, {
      order: currentSortItem?.order,
      field: <string>this.table.getHeaderField(col, row),
      event
    });
  }

  updateSortState(sortState: SortState[]) {
    sortState = Array.isArray(sortState) ? sortState : [sortState];

    for (let index = 0; index < sortState.length; index++) {
      if (
        sortState[index].field === this.sort[index]?.field &&
        sortState[sortState.length - 1].order === this.sort[index]?.order
      ) {
        return;
      }
      const oldSortCol = this.table.internalProps.multipleSort ? null : this.sort[index]?.col || null;
      const oldSortRow = this.table.internalProps.multipleSort ? null : this.sort[index]?.row || null;
      const name =
        this.sort[index]?.order === 'asc'
          ? 'sort_downward'
          : this.sort[index]?.order === 'desc'
          ? 'sort_upward'
          : 'sort_normal';
      this.setSortState(sortState.slice(0, index + 1));
      // 获取sort对应的行列位置
      const cellAddress = this.table.internalProps.layoutMap.getHeaderCellAddressByField(
        sortState[index].field as string
      );
      this.sort[index].col = cellAddress.col;
      this.sort[index].row = cellAddress.row;
      const cellGroup = this.table.scenegraph.getCell(this.sort[index].col, this.sort[index].row);
      //const iconMark = cellGroup.getChildByName(name, true);
      let iconMark: Icon;

      traverseObject(cellGroup, 'children', (mark: Icon) => {
        if (mark.attribute.funcType === 'sort') {
          iconMark = mark;
          return true;
        }
        return false;
      });

      // 更新icon
      this.table.scenegraph.updateSortIcon({
        col: this.sort[index].col,
        row: this.sort[index].row,
        iconMark,
        order: this.sort[index].order,
        oldSortCol,
        oldSortRow,
        oldIconMark: this.sort[index]?.icon
      });
    }

    const normalHeaders: Array<any> = [];
    (this.table.internalProps.layoutMap.columnTree as any).tree.children.forEach((item: any) => {
      if (!sortState.some((state: SortState) => state.field === item.field)) {
        normalHeaders.push(item);
      }
    });

    for (let index = 0; index < normalHeaders.length; index++) {
      const column = normalHeaders[index];
      this.table.scenegraph.updateSortIcon({
        col: null,
        row: null,
        iconMark: null,
        order: null,
        oldSortCol: column.startInTotal + this.table.internalProps.layoutMap.leftRowSeriesNumberColumnCount ?? 0,
        oldSortRow: column.level,
        oldIconMark: null
      });
    }
  }

  triggerFreeze(col: number, row: number, iconMark: Icon) {
    if (this.table.isPivotTable() || (this.table as ListTable).transpose) {
      return;
    }
    // let oldFrowzenCol = this.frowzen.col;
    // let oldFrowzenRow = this.frowzen.row;

    // 更新frozen
    dealFreeze(col, row, this.table);
    if ((this.table as any).hasListeners(PIVOT_TABLE_EVENT_TYPE.FREEZE_CLICK)) {
      const fields: ColumnData[] = (this.table as ListTable).internalProps.layoutMap.columnObjects.slice(0, col + 1);
      this.table.fireListeners(PIVOT_TABLE_EVENT_TYPE.FREEZE_CLICK, {
        col: col,
        row: row,
        fields: fields.reduce((pre: any, cur: any) => pre.concat(cur.field), []),
        colCount: this.table.frozenColCount
      });
    }
    // // 更新scenegraph，这里因为dealFreeze更新了table里存储的frozen信息，会影响scenegraph里的getCell
    // // 因此先更新scenegraph结构再更新icon
    // this.table.scenegraph.updateFrozen(this.frowzen.col);

    // // 更新icon
    // this.table.scenegraph.updateFrozenIcon(oldFrowzenCol, this.frowzen.col);

    this.frozen.icon = iconMark;
  }

  updateCursor(mode: string = 'default') {
    this.table.getElement().style.cursor = mode;
  }

  updateDrillState(
    dimensionKey: string,
    title: string,
    drillDown: boolean,
    drillUp: boolean,
    col: number,
    row: number
  ) {
    this.drill.dimensionKey = dimensionKey;
    this.drill.title = title;
    this.drill.drillDown = drillDown;
    this.drill.drillUp = drillUp;
    this.drill.col = col;
    this.drill.row = row;
    updateDrill(col, row, drillDown, drillUp, this.table);
  }

  updateSparklineHoverPose(col: number, row: number, x: number, y: number) {
    if (this.sparkLine.col !== -1 && this.sparkLine.row !== -1) {
      clearChartHover(this.sparkLine.col, this.sparkLine.row, this.table);
    }
    let isUpdated = false;
    if (col !== -1 && row !== -1) {
      isUpdated = updateChartHover(col, row, x, y, this.table);
    }
    if (isUpdated) {
      this.sparkLine.col = col;
      this.sparkLine.row = row;
    } else {
      this.sparkLine.col = -1;
      this.sparkLine.row = -1;
    }
  }
  setCheckedState(col: number, row: number, field: string | number, checked: boolean | 'indeterminate') {
    return setCheckedState(col, row, field, checked, this);
  }
  setHeaderCheckedState(field: string | number, checked: boolean | 'indeterminate') {
    return setHeaderCheckedState(field, checked, this);
  }

  //#region CheckedState 状态维护

  /**
   * 创建cell节点时同步状态 如果状态缓存有则用 如果没有则设置缓存
   * @param col
   * @param row
   * @param field
   * @param checked
   * @returns
   */
  syncCheckedState(col: number, row: number, field: string | number, checked: boolean): boolean | 'indeterminate' {
    return syncCheckedState(col, row, field, checked, this);
  }
  /**
   * 创建表头cell节点时同步状态 如果状态缓存有则用 如果没有则设置缓存
   * @param col
   * @param row
   * @param field
   * @param checked
   * @returns
   */
  // syncHeaderCheckedState(field: string | number, checked: boolean): boolean | 'indeterminate' {
  //   if (isValid(this.headerCheckedState[field])) {
  //     return this.headerCheckedState[field];
  //   } else if (typeof checked === 'function') {
  //     return undefined;
  //   } else if (isValid(checked)) {
  //     this.headerCheckedState[field] = checked;
  //   } else if (this.checkedState?.length > 0) {
  //     const isAllChecked = this.updateHeaderCheckedState(field);
  //     return isAllChecked;
  //   }
  //   return this.headerCheckedState[field];
  // }
  /**
   * 初始化check状态
   * @param records
   */
  initCheckedState(records: any[]) {
    return initCheckedState(records, this);
  }
  /**
   * 更新header单元checked的状态，依据当前列每一个数据checked的状态。
   * @param field
   * @returns
   */
  updateHeaderCheckedState(field: string | number, col: number, row: number): boolean | 'indeterminate' {
    return updateHeaderCheckedState(field, this, col, row);
  }
  /**
   * setRecords的时候虽然调用了initCheckedState 进行了初始化 但当每个表头的checked状态都用配置了的话 初始化不会遍历全部数据
   * @param records
   */
  initLeftRecordsCheckState(records: any[]) {
    return initLeftRecordsCheckState(records, this);
  }
  //#endregion

  setRadioState(
    col: number,
    row: number,
    field: string | number,
    radioType: 'column' | 'cell',
    indexInCell: number | undefined
  ) {
    setRadioState(col, row, field, radioType, indexInCell, this);
  }

  syncRadioState(
    col: number,
    row: number,
    field: string | number,
    radioType: 'column' | 'cell',
    indexInCell: number | undefined,
    isChecked: boolean
  ) {
    return syncRadioState(col, row, field, radioType, indexInCell, isChecked, this);
  }

  changeCheckboxAndRadioOrder(sourceIndex: number, targetIndex: number) {
    if (this.checkedState.size) {
      changeCheckboxOrder(sourceIndex, targetIndex, this);
    }
    if (this.radioState.length) {
      changeRadioOrder(sourceIndex, targetIndex, this);
    }
  }

  setCustomSelectRanges(
    customSelectRanges: {
      range: CellRange;
      style: CustomSelectionStyle;
    }[]
  ) {
    deletaCustomSelectRanges(this);
    addCustomSelectRanges(customSelectRanges, this);
  }
}
