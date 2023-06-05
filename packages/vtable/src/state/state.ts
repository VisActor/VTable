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
  SortState
} from '../ts-types';
import { IconFuncTypeEnum } from '../ts-types';
import { checkMultiCellInSelect } from './common/check-in-select';
import { updateHoverPosition } from './hover/update-position';
import { dealPin } from './pin';
import { dealSort } from './sort';
import { selectEnd, updateSelectPosition } from './select/update-position';
import { cellInRange } from '../tools/helper';
import type { ListTable } from '../ListTable';
import { PIVOT_TABLE_EVENT_TYPE } from '../ts-types/pivot-table/PIVOT_TABLE_EVENT_TYPE';
import type { PivotHeaderLayoutMap } from '../layout/pivot-header-layout';
import { TABLE_EVENT_TYPE } from '../core/TABLE_EVENT_TYPE';
import { Bounds } from '@visactor/vutils';
import { updateDrill } from './drill';
import { clearChartHover, updateChartHover } from './spark-line';
import { endMoveCol, startMoveCol, updateMoveCol } from './cell-move';
import type { FederatedEvent } from '@visactor/vrender';
import type { TooltipOptions } from '../ts-types/tooltip';
import { getIconAndPositionFromTarget } from '../scenegraph/utils/icon';
import type { BaseTableAPI } from '../ts-types/base-table';
import { isObject, isString, isValid } from '../tools/util';

/**
 * 当前表格的交互状态：
 * Default 默认展示
 * grabing 拖拽中
 *   -Resize column 改变列宽
 *   -column move 调整列顺序
 *   -drag select 拖拽多选
 * Scrolling 滚动中
 */
export enum InteractionState {
  'default' = 'default',
  'grabing' = 'grabing',
  'scrolling' = 'scrolling'
}
/**
 * 单元格的高亮效果设置
 * single 单个单元格高亮
 * column 整列高亮
 * row 整行高量
 * cross 十字花 行列均高亮
 * none 无高亮
 */
export enum HighlightScope {
  'single' = 'single',
  'column' = 'column',
  'row' = 'row',
  'cross' = 'cross',
  'none' = 'none'
}

export enum SortOrder {
  'asc' = 'asc',
  'desc' = 'desc',
  'normal' = 'normal'
}

export class StateManeger {
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
  // select记录两个位置，第二个位置只在range模式生效
  select: {
    ranges: CellRange[];
    highlightScope: HighlightScope;
    cellPos: CellPosition;
    // cellPosStart: CellPosition;
    // cellPosEnd: CellPosition;
    singleStyle?: boolean; // select当前单元格是否使用单独样式
    disableHeader?: boolean; // 是否禁用表头select
    selecting: boolean;
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
    x: number;
    resizing: boolean;
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
  sort: {
    col: number;
    row: number;
    field?: string;
    fieldKey?: string;
    order: SortOrder;
    icon?: Icon;
  };
  frozen: {
    col: number;
    // row: number;
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
    dimensionTitle?: string;
    drillDown?: boolean;
    drillUp?: boolean;
    col: number;
    row: number;
  };
  sparkLine: {
    col: number;
    row: number;
  };
  _clearVerticalScrollBar: any;
  _clearHorizontalScrollBar: any;

  // _x: number = 0;
  constructor(table: BaseTableAPI) {
    this.table = table;
    this.initState();
    this.setHoverState();
    this.setSelectState();
    this.setFrozenState();

    this.updateVerticalScrollBar = this.updateVerticalScrollBar.bind(this);
    this.updateHorizontalScrollBar = this.updateHorizontalScrollBar.bind(this);
  }

  initState() {
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
    this.sort = {
      col: -1,
      row: -1,
      order: SortOrder.normal
    };
    this.frozen = {
      col: -1
      // row: -1,
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
      disableSelect,
      disableHeaderSelect
    } = this.table.options?.select ?? {
      disableSelect: false,
      disableHeaderSelect: false
    };

    // if (enableRowHighlight && enableColumnHighlight) {
    //   this.select.highlightScope = HighlightScope.cross;
    // } else if (enableRowHighlight) {
    //   this.select.highlightScope = HighlightScope.row;
    // } else if (enableColumnHighlight) {
    //   this.select.highlightScope = HighlightScope.column;
    // } else
    if (!disableSelect) {
      this.select.highlightScope = HighlightScope.single;
    } else {
      this.select.highlightScope = HighlightScope.none;
    }

    this.select.singleStyle = !disableSelect;
    this.select.disableHeader = disableHeaderSelect;
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

  setSortState(sortState: SortState) {
    this.sort.field = sortState.field as string;
    this.sort.fieldKey = sortState.fieldKey as string;
    this.sort.order = SortOrder[sortState.order];

    // // 这里有一个问题，目前sortState中一般只传入了fieldKey，但是getCellRangeByField需要field
    // const range = this.table.getCellRangeByField(this.sort.field, 0);
    // if (range) {
    //   this.sort.col = range.start.col;
    //   this.sort.row = range.start.row;
    // }
  }

  setFrozenState() {
    this.frozen.col = this.table.frozenColCount - 1;
    // this.frozen.row = 0;
  }

  updateInteractionState(mode: InteractionState) {
    if (this.interactionState === mode) {
      return;
    }
    this.interactionState = mode;
    // 处理mode 更新后逻辑
    // ......
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
    isSelectAll: boolean = false
  ) {
    if (row !== -1 && row !== -1) {
      this.select.selecting = true;
    }
    updateSelectPosition(this, col, row, isShift, isCtrl, isSelectAll);
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

  updateHoverIcon(col: number, row: number, target: any, cellGroup: Group, event?: FederatedEvent) {
    if (target === this.residentHoverIcon?.icon) {
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
          style: Object.assign({}, this.table.internalProps.theme?.tooltipStyle, inlineIcon.tooltip?.style)
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
        this.hoverIcon.col = row;
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
  isSelecting(): boolean {
    return this.select.selecting;
  }
  endSelectCells() {
    this.select.selecting = false;
    if (this.select.ranges.length === 0) {
      return;
    }
    selectEnd(this.table.scenegraph);

    // 触发SELECTED_CELL
    const lastCol = this.select.ranges[this.select.ranges.length - 1].end.col;
    const lastRow = this.select.ranges[this.select.ranges.length - 1].end.row;
    this.table.fireListeners(TABLE_EVENT_TYPE.SELECTED_CELL, {
      ranges: this.select.ranges,
      col: lastCol,
      row: lastRow
    });
  }
  endResizeCol() {
    setTimeout(() => {
      this.columnResize.resizing = false;
    }, 0);
    this.checkFrozen();
    this.table.scenegraph.component.hideResizeCol();
    this.table.scenegraph.updateNextFrame();
  }
  startResizeCol(col: number, x: number, y: number) {
    this.columnResize.resizing = true;
    this.columnResize.col = col;
    this.columnResize.x = x;

    this.table.scenegraph.component.showResizeCol(col, y);

    // 调整列宽期间清空选中清空
    this.table.stateManeger.updateSelectPos(-1, -1);

    this.table.scenegraph.updateNextFrame();
  }
  updateResizeCol(x: number, y: number) {
    let detaX = x - this.columnResize.x;
    // table.getColWidth会使用Math.round，因此这里直接跳过小于1px的修改
    if (Math.abs(detaX) < 1) {
      return;
    }

    // 检查minWidth/maxWidth
    // getColWidth会进行Math.round，所以先从colWidthsMap获取：
    // 如果是数值，直接使用；如果不是，则通过getColWidth获取像素值
    let widthCache = (this.table as any).colWidthsMap.get(this.columnResize.col);
    if (typeof widthCache === 'number') {
      widthCache = widthCache;
    } else {
      widthCache = this.table.getColWidth(this.columnResize.col);
    }
    let width = widthCache;
    width += detaX;
    const minWidth = this.table.getMinColWidth(this.columnResize.col);
    const maxWidth = this.table.getMaxColWidth(this.columnResize.col);

    if (width < minWidth || width > maxWidth) {
      if (widthCache === minWidth || widthCache === maxWidth) {
        return;
      } else if (widthCache - minWidth > maxWidth - widthCache) {
        detaX = maxWidth - widthCache;
      } else {
        detaX = minWidth - widthCache;
      }
    }
    // console.log('detaX', detaX);
    this.table.scenegraph.updateColWidth(this.columnResize.col, detaX);
    this.columnResize.x = x;

    this.table.scenegraph.component.updateResizeCol(this.columnResize.col, y);
    if (
      this.columnResize.col < this.table.frozenColCount &&
      !this.table.isPivotTable() &&
      !(this.table as ListTable).transpose
    ) {
      this.table.scenegraph.component.setFrozenColumnShadow(this.table.frozenColCount - 1);
    }
    this.table.scenegraph.updateNextFrame();
  }

  startMoveCol(col: number, row: number, x: number, y: number) {
    startMoveCol(col, row, x, y, this);
  }
  updateMoveCol(col: number, row: number, x: number, y: number) {
    updateMoveCol(col, row, x, y, this);
  }
  isMoveCol(): boolean {
    return this.columnMove.moving;
  }
  endMoveCol() {
    endMoveCol(this);
  }

  checkFrozen(): boolean {
    // 判断固定列的总宽度 是否过大
    if (this.table.options.frozenColCount) {
      if (this.table.tableNoFrameWidth - this.table.getColsWidth(0, this.table.options.frozenColCount - 1) <= 120) {
        this.table._setFrozenColCount(0);
        this.setFrozenCol(-1);
        return false;
      } else if (this.table.frozenColCount !== this.table.options.frozenColCount) {
        this.table._setFrozenColCount(this.table.options.frozenColCount);
        this.setFrozenCol(this.table.options.frozenColCount);
        return false;
      }
    }
    return true;
  }
  setFrozenCol(col: number) {
    if (col !== this.frozen.col) {
      // const oldFrozenCol = this.frozen.col;
      this.frozen.col = col;

      // 更新scenegraph，这里因为dealPin更新了table里存储的frozen信息，会影响scenegraph里的getCell
      // 因此先更新scenegraph结构再更新icon
      this.table.scenegraph.updateFrozen();

      // 更新icon
      this.table.scenegraph.updateFrozenIcon(0, this.table.colCount - 1);
    } else {
      this.table.scenegraph.updateFrozenIcon(0, this.table.colCount - 1);
    }
  }

  updateVerticalScrollBar(yRatio: number) {
    const totalHeight = this.table.getAllRowsHeight();
    this.scroll.verticalBarPos = yRatio * (totalHeight - this.table.scenegraph.height);
    this.table.scenegraph.setY(-this.scroll.verticalBarPos);

    // 滚动期间清空选中清空
    this.table.stateManeger.updateHoverPos(-1, -1);
    // this.table.stateManeger.updateSelectPos(-1, -1);

    this.table.fireListeners(TABLE_EVENT_TYPE.SCROLL, {
      scrollTop: this.scroll.verticalBarPos,
      scrollLeft: this.scroll.horizontalBarPos,
      scrollHeight: this.table.theme.scrollStyle?.width,
      scrollWidth: this.table.theme.scrollStyle?.width,
      viewHeight: this.table.tableNoFrameHeight,
      viewWidth: this.table.tableNoFrameWidth
    });
  }
  updateHorizontalScrollBar(xRatio: number) {
    const totalWidth = this.table.getAllColsWidth();
    this.scroll.horizontalBarPos = xRatio * (totalWidth - this.table.scenegraph.width);
    this.table.scenegraph.setX(-this.scroll.horizontalBarPos);

    // 滚动期间清空选中清空
    this.table.stateManeger.updateHoverPos(-1, -1);
    // this.table.stateManeger.updateSelectPos(-1, -1);
    this.table.fireListeners(TABLE_EVENT_TYPE.SCROLL, {
      scrollTop: this.scroll.verticalBarPos,
      scrollLeft: this.scroll.horizontalBarPos,
      scrollHeight: this.table.theme.scrollStyle?.width,
      scrollWidth: this.table.theme.scrollStyle?.width,
      viewHeight: this.table.tableNoFrameHeight,
      viewWidth: this.table.tableNoFrameWidth
    });
  }
  setScrollTop(top: number) {
    // 矫正top值范围
    const totalHeight = this.table.getAllRowsHeight();
    top = Math.max(0, Math.min(top, totalHeight - this.table.scenegraph.height));

    this.scroll.verticalBarPos = top;

    // 设置scenegraph坐标
    this.table.scenegraph.setY(-top);

    // 更新scrollbar位置
    this.table.scenegraph.component.updateVerticalScrollBarPos(top / (totalHeight - this.table.scenegraph.height));
    // 滚动期间清空选中清空
    this.table.stateManeger.updateHoverPos(-1, -1);
    // this.table.stateManeger.updateSelectPos(-1, -1);
    this.table.fireListeners(TABLE_EVENT_TYPE.SCROLL, {
      scrollTop: this.scroll.verticalBarPos,
      scrollLeft: this.scroll.horizontalBarPos,
      scrollHeight: this.table.theme.scrollStyle?.width,
      scrollWidth: this.table.theme.scrollStyle?.width,
      viewHeight: this.table.tableNoFrameHeight,
      viewWidth: this.table.tableNoFrameWidth
    });
  }
  setScrollLeft(left: number) {
    // 矫正left值范围
    const totalWidth = this.table.getAllColsWidth();
    const frozenWidth = this.table.getFrozenColsWidth();

    left = Math.max(0, Math.min(left, totalWidth - this.table.scenegraph.width));

    this.scroll.horizontalBarPos = left;

    // 设置scenegraph坐标
    this.table.scenegraph.setX(-left);

    // 更新scrollbar位置
    this.table.scenegraph.component.updateHorizontalScrollBarPos(left / (totalWidth - frozenWidth));

    // 滚动期间清空选中清空
    this.table.stateManeger.updateHoverPos(-1, -1);
    // this.table.stateManeger.updateSelectPos(-1, -1);
    this.table.fireListeners(TABLE_EVENT_TYPE.SCROLL, {
      scrollTop: this.scroll.verticalBarPos,
      scrollLeft: this.scroll.horizontalBarPos,
      scrollHeight: this.table.theme.scrollStyle?.width,
      scrollWidth: this.table.theme.scrollStyle?.width,
      viewHeight: this.table.tableNoFrameHeight,
      viewWidth: this.table.tableNoFrameWidth
    });
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
        this.table.scenegraph.component.hideVerticalScrollBar();
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
        this.table.scenegraph.component.hideHorizontalScrollBar();
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

  triggerDropDownMenu(col: number, row: number, x: number, y: number) {
    this.table.fireListeners(TABLE_EVENT_TYPE.DROPDOWN_ICON_CLICK, {
      col,
      row
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
      (icon as any).oldVisibleTime = icon.attribute.visibleTime;
      icon.setAttribute('visibleTime', 'always');
      icon.setAttribute('visible', true);
    }
  }

  hideMenu() {
    this.table.fireListeners(TABLE_EVENT_TYPE.DROPDOWN_MENU_CLEAR, null);
    this.table.fireListeners(TABLE_EVENT_TYPE.HIDE_MENU);
    this.menu.isShow = false;
    this.table.scenegraph.component.menu.detach();
    if (this.residentHoverIcon) {
      this.table.scenegraph.setIconNormalStyle(
        this.residentHoverIcon.icon,
        this.residentHoverIcon.col,
        this.residentHoverIcon.row
      );
      this.residentHoverIcon.icon.setAttribute('visibleTime', (this.residentHoverIcon.icon as any).oldVisibleTime);
      this.residentHoverIcon.icon.setAttribute(
        'visible',
        this.residentHoverIcon.icon.attribute.visibleTime === 'always'
      );
      this.residentHoverIcon = null;
    }
  }

  setDropDownMenuHighlight(cells: DropDownMenuHighlightInfo[]): void {
    this.menu.dropDownMenuHighlight = cells;
    for (let i = 0; i < cells.length; i++) {
      const { col, row } = cells[i];
      this.table.scenegraph.updateCellContent(col, row);
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

          const dropDownMenu = headerC.dropDownMenu || this.table.globalDropDownMenu;
          if (dropDownMenu) {
            for (let i = 0; i < dropDownMenu.length; i++) {
              const item: any = dropDownMenu[i];
              if (isObject(item) && (item.menuKey || item.text) === (menuKey || '') && i === index) {
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
  triggerSort(col: number, row: number, iconMark: Icon) {
    if (this.table.isPivotTable()) {
      // 透视表不执行sort操作
      const order = (this.table as PivotTableAPI).getPivotSortState(col, row);
      // // 触发透视表排序按钮点击
      this.table.fireListeners(PIVOT_TABLE_EVENT_TYPE.PIVOT_SORT_CLICK, {
        col: col,
        row: row,
        order: order || 'normal',
        dimensionInfo: (this.table.internalProps.layoutMap as PivotHeaderLayoutMap).getPivotDimensionInfo(col, row),
        cellType: this.table.getCellType(col, row)
      });
      return;
    }

    const oldSortCol = this.sort.col;
    const oldSortRow = this.sort.row;
    // 执行sort
    dealSort(col, row, this.table as ListTableAPI);
    this.sort.col = col;
    this.sort.row = row;

    // 更新icon
    this.table.scenegraph.updateSortIcon(
      this.sort.col,
      this.sort.row,
      iconMark,
      this.sort.order,
      oldSortCol,
      oldSortRow,
      this.sort.icon
    );
    this.sort.icon = iconMark;
  }

  updateSortState(sortState: SortState) {
    if (sortState.field === this.sort.field && sortState.order === this.sort.order) {
      return;
    }
    const oldSortCol = this.sort.col;
    const oldSortRow = this.sort.row;
    const name =
      this.sort.order === 'asc' ? 'sort_downward' : this.sort.order === 'desc' ? 'sort_upward' : 'sort_normal';
    this.setSortState(sortState);
    // 获取sort对应的行列位置
    const cellAddress = this.table.internalProps.layoutMap.getHeaderCellAddressByField(sortState.field as string);
    this.sort.col = cellAddress.col;
    this.sort.row = cellAddress.row;
    const cellGroup = this.table.scenegraph.getCell(this.sort.col, this.sort.row);
    const iconMark = cellGroup.getChildByName(name, true);

    // 更新cell
    this.table.scenegraph.sortCell();
    // 更新icon
    this.table.scenegraph.updateSortIcon(
      this.sort.col,
      this.sort.row,
      iconMark,
      this.sort.order,
      oldSortCol,
      oldSortRow,
      this.sort.icon
    );
  }

  triggerPin(col: number, row: number, iconMark: Icon) {
    if (this.table.isPivotTable() || (this.table as ListTable).transpose) {
      return;
    }
    // let oldFrowzenCol = this.frowzen.col;
    // let oldFrowzenRow = this.frowzen.row;

    // 更新frozen
    dealPin(col, row, this.table);

    // // 更新scenegraph，这里因为dealPin更新了table里存储的frozen信息，会影响scenegraph里的getCell
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
    dimensionTitle: string,
    drillDown: boolean,
    drillUp: boolean,
    col: number,
    row: number
  ) {
    this.drill.dimensionKey = dimensionKey;
    this.drill.dimensionTitle = dimensionTitle;
    this.drill.drillDown = drillDown;
    this.drill.drillUp = drillUp;
    this.drill.col = col;
    this.drill.row = row;
    updateDrill(col, row, drillDown, drillUp, this.table);
  }

  updateChartHoverPose(col: number, row: number, x: number, y: number) {
    if (this.sparkLine.col !== -1 && this.sparkLine.row !== -1) {
      clearChartHover(this.sparkLine.col, this.sparkLine.row, this.table);
    }
    if (col !== -1 && row !== -1) {
      updateChartHover(col, row, x, y, this.table);
    }
    this.sparkLine.col = col;
    this.sparkLine.row = row;
  }
}
