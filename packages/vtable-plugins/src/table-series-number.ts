import type { BaseTableAPI, ListTable, ListTableConstructorOptions, pluginsDefinition } from '@visactor/vtable';
import { TABLE_EVENT_TYPE, TYPES } from '@visactor/vtable';
import { TableSeriesNumber as VRenderTableSeriesNumber, SeriesNumberEvent } from '@visactor/vtable/es/vrender';
import type { ILayer, TableSeriesNumberAttributes } from '@visactor/vtable/es/vrender';

export type TableSeriesNumberOptions = {
  rowCount: number;
  colCount: number;
  dragOrder?: {
    enableDragColumnOrder?: boolean;
    enableDragRowOrder?: boolean;
  };
  // syncRowHeightFromTable?: boolean;
  // syncColWidthFromTable?: boolean;
} & Partial<
  Pick<
    TableSeriesNumberAttributes,
    | 'rowSeriesNumberGenerate'
    | 'colSeriesNumberGenerate'
    | 'rowSeriesNumberCellStyle'
    | 'colSeriesNumberCellStyle'
    | 'cornerCellStyle'
    | 'colSeriesNumberHeight'
    | 'rowSeriesNumberWidth'
  >
>;
export class TableSeriesNumber implements pluginsDefinition.IVTablePlugin {
  id = `table-series-number`;
  name = 'Table Series Number';
  runTime = [
    TABLE_EVENT_TYPE.INITIALIZED,
    TABLE_EVENT_TYPE.BEFORE_INIT,
    TABLE_EVENT_TYPE.BEFORE_UPDATE_OPTION,
    TABLE_EVENT_TYPE.UPDATED
  ];
  pluginOptions: TableSeriesNumberOptions;
  table: ListTable;
  seriesNumberComponent: VRenderTableSeriesNumber;
  componentLayoutLayer: ILayer;
  lastCurrentRow: number = 0;
  lastCurrentCol: number = 0;
  startRowIndex: number = 0;
  scrollTimer: any;
  constructor(pluginOptions: TableSeriesNumberOptions) {
    this.pluginOptions = pluginOptions;
    this.seriesNumberComponent = new VRenderTableSeriesNumber({
      rowCount: pluginOptions.rowCount,
      colCount: pluginOptions.colCount,
      rowSeriesNumberWidth: pluginOptions.rowSeriesNumberWidth,
      colSeriesNumberHeight: pluginOptions.colSeriesNumberHeight,
      rowSeriesNumberGenerate: pluginOptions.rowSeriesNumberGenerate,
      colSeriesNumberGenerate: pluginOptions.colSeriesNumberGenerate,
      rowSeriesNumberCellStyle: Object.assign(
        {
          text: {
            fontSize: 14,
            fill: '#7A7A7A',
            pickable: false,
            textAlign: 'left',
            textBaseline: 'middle',
            padding: [2, 4, 2, 4]
          },
          borderLine: {
            stroke: '#D9D9D9',
            lineWidth: 1,
            pickable: false
          },
          bgColor: '#F9F9F9',
          states: {
            hover: {
              fill: '#c8daf6',
              opacity: 0.7
            },
            select: {
              fill: '#c8daf6',
              opacity: 1
            }
          }
        },
        pluginOptions.rowSeriesNumberCellStyle
      ),
      colSeriesNumberCellStyle: Object.assign(
        {
          text: {
            fontSize: 14,
            fill: '#7A7A7A',
            pickable: false,
            textAlign: 'left',
            textBaseline: 'middle',
            padding: [2, 4, 2, 4]
          },
          borderLine: {
            stroke: '#D9D9D9',
            lineWidth: 1,
            pickable: false
          },
          bgColor: '#F9F9F9',
          states: {
            hover: {
              fill: '#c8daf6',
              opacity: 0.7
            },
            select: {
              fill: '#c8daf6',
              opacity: 1
            }
          }
        },
        pluginOptions.colSeriesNumberCellStyle
      ),
      cornerCellStyle: Object.assign(
        {
          borderLine: {
            stroke: '#D9D9D9',
            lineWidth: 1,
            pickable: false
          },
          bgColor: '#F9F9F9',
          states: {
            hover: {
              fill: '#98C8A5',
              opacity: 0.7
            },
            select: {
              fill: '#98C8A5',
              opacity: 1
            }
          }
        },
        pluginOptions.cornerCellStyle
      ),
      checkMoveColumnOrder: (colIndex: number) => {
        return this.pluginOptions.dragOrder?.enableDragColumnOrder ? this.table.isColumnSelected(colIndex) : false;
      },
      checkMoveRowOrder: (rowIndex: number) => {
        return this.pluginOptions.dragOrder?.enableDragRowOrder ? this.table.isRowSelected(rowIndex) : false;
      }
    });
    this.listenComponentEvents();
  }

  run(...args: any[]) {
    // const eventArgs = args[0];
    const runTime = args[1];
    if (runTime === TABLE_EVENT_TYPE.BEFORE_INIT || runTime === TABLE_EVENT_TYPE.BEFORE_UPDATE_OPTION) {
      const eventArgs = args[0];
      const table: BaseTableAPI = args[2];
      this.table = table as ListTable;
      const options: ListTableConstructorOptions = eventArgs.options;
      const records = options.records ?? [];
      // //用空数据将records填充到pluginOptions.rowCount
      // for (let i = records.length; i < this.pluginOptions.rowCount; i++) {
      //   records.push({});
      // }
      // 直接设置数组长度，不填充任何内容
      if (records.length < this.pluginOptions.rowCount) {
        records.length = this.pluginOptions.rowCount;
      }
      options.records = records;
      if (!options.columns) {
        options.columns = [];
      }
      for (let i = options.columns.length; i < this.pluginOptions.colCount; i++) {
        const columnFields = {
          field: i,
          key: i,
          title: ``
        };
        options.columns.push(columnFields);
      }
      const rowSeriesNumberColWidth = this.seriesNumberComponent.rowSeriesNumberWidth;
      const colSeriesNumberRowHeight = this.seriesNumberComponent.colSeriesNumberHeight;
      options.contentOffsetX = rowSeriesNumberColWidth;
      options.contentOffsetY = colSeriesNumberRowHeight;
      // if (options.columns.length < this.pluginOptions.colCount) {
      //   options.columns.length = this.pluginOptions.colCount;
      // }
    } else if (runTime === TABLE_EVENT_TYPE.INITIALIZED || runTime === TABLE_EVENT_TYPE.UPDATED) {
      this.table = args[2];
      if (!this.table.options.customConfig) {
        this.table.options.customConfig = {};
      }
      this.table.options.customConfig.cancelSelectCellHook = (e: any) => {
        const target = e.target;
        if (target.isDescendantsOf(this.seriesNumberComponent)) {
          return false;
        }
        return true;
      };

      // const rowSeriesNumberColWidth = this.seriesNumberComponent.rowSeriesNumberWidth;
      // const colSeriesNumberRowHeight = this.seriesNumberComponent.colSeriesNumberHeight;
      // // this.table.scenegraph.stage.defaultLayer.setAttributes({
      // //   x: rowSeriesNumberColWidth,
      // //   y: colSeriesNumberRowHeight,
      // //   width: 1700,
      // //   height: 500,
      // //   clip: true
      // // });
      // this.table.setTranslate(colSeriesNumberRowHeight, rowSeriesNumberColWidth);
      this.seriesNumberComponent.setAttributes({
        rowCount: this.table.rowCount,
        colCount: this.table.colCount,
        frozenRowCount: this.table.frozenRowCount,
        frozenColCount: this.table.frozenColCount,
        rightFrozenColCount: this.table.rightFrozenColCount,
        bottomFrozenRowCount: this.table.bottomFrozenRowCount
      });
      // add到layer上时会触发组件的render方法
      const newLayer = this.table.scenegraph.stage.createLayer();
      newLayer.appendChild(this.seriesNumberComponent);
      newLayer.setAttributes({ pickable: false });
      this.componentLayoutLayer = newLayer;

      // if (this.pluginOptions.syncRowHeightFromTable) {
      this.syncRowHeightToComponent();
      // }
      // if (this.pluginOptions.syncColWidthFromTable) {
      this.syncColWidthToComponent();
      // }

      this.listenTableEvents();
    }
  }
  private handleScroll = () => {
    //节流处理，避免滚动时频繁触发
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
      this.scrollTimer = null;
    }
    this.scrollTimer = setTimeout(() => {
      this.scrollTimer = null;
      this.syncScrollToComponent();
    }, 10); // 优化: 由5ms改为10ms，减少频繁触发
  };

  private handleAfterSort = () => {
    this.syncScrollToComponent();
  };

  private handleSelectedChanged = (e: any) => {
    this.seriesNumberComponent.removeAllSelectedIndexs();
    const selectRange = this.table.stateManager.select.ranges;

    const rowSelectedIndexs = [];
    const colSelectedIndexs = [];
    for (const range of selectRange) {
      const { row: rowStart, col: colStart } = range.start;
      const { row: rowEnd, col: colEnd } = range.end;
      rowSelectedIndexs.push({ startIndex: Math.min(rowStart, rowEnd), endIndex: Math.max(rowStart, rowEnd) });
      colSelectedIndexs.push({ startIndex: Math.min(colStart, colEnd), endIndex: Math.max(colStart, colEnd) });
    }
    this.seriesNumberComponent.addRowSelectedRanges(rowSelectedIndexs);
    this.seriesNumberComponent.addColSelectedRanges(colSelectedIndexs);
    if (this.table.stateManager.select.isSelectAll) {
      this.seriesNumberComponent.addCornderSelected();
    }

    this.seriesNumberComponent.renderSelectedIndexsState();
  };

  private handleResizeColumnEnd = (e: any) => {
    this.seriesNumberComponent.setAttribute('hover', true);
  };

  private handleResizeRowEnd = (e: any) => {
    this.seriesNumberComponent.setAttribute('hover', true);
  };

  private handleChangeHeaderPosition = (e: any) => {
    // console.log('-----handleChangeHeaderPosition');
    this.syncColWidthToComponent();
  };

  listenTableEvents() {
    this.table.on(TABLE_EVENT_TYPE.SCROLL, this.handleScroll);
    this.table.on(TABLE_EVENT_TYPE.AFTER_SORT, this.handleAfterSort);
    this.table.on(TABLE_EVENT_TYPE.SELECTED_CHANGED, this.handleSelectedChanged);
    this.table.on(TABLE_EVENT_TYPE.RESIZE_COLUMN_END, this.handleResizeColumnEnd);
    this.table.on(TABLE_EVENT_TYPE.RESIZE_ROW_END, this.handleResizeRowEnd);
    this.table.on(TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION, this.handleChangeHeaderPosition);
  }

  private handleSeriesNumberCellRightClick = (e: any) => {
    const { seriesNumberCell, event, isDragSelect } = e.detail;
    const isRow = seriesNumberCell.name.includes('row');
    const isCol = seriesNumberCell.name.includes('col');
    if (isRow) {
      const rowIndex = seriesNumberCell.id;
      //判断rowIndex整行是否被选中
      const isRowSelected = this.table.stateManager.select.ranges.some(range => {
        return (
          range.start.row <= rowIndex &&
          rowIndex <= range.end.row &&
          range.start.col === 0 &&
          range.end.col === this.table.colCount - 1
        );
      });
      //当前右键的行号 没有整行被选中，则进行选中
      if (!isRowSelected) {
        this.table.selectCells([
          { start: { row: rowIndex, col: 0 }, end: { row: rowIndex, col: this.table.colCount - 1 } }
        ]);
      }
      this.table.fireListeners(TABLE_EVENT_TYPE.PLUGIN_EVENT, {
        plugin: this,
        event: event,
        pluginEventInfo: {
          eventType: 'rightclick',
          rowIndex: rowIndex
        }
      });
    } else if (isCol) {
      const colIndex = seriesNumberCell.id;
      //判断colIndex整列是否被选中
      const isColSelected = this.table.stateManager.select.ranges.some(range => {
        return (
          range.start.col <= colIndex &&
          colIndex <= range.end.col &&
          range.start.row === 0 &&
          range.end.row === this.table.rowCount - 1
        );
      });
      //当前右键的列号 没有整列被选中，则进行选中
      if (!isColSelected) {
        this.table.selectCells([
          { start: { row: 0, col: colIndex }, end: { row: this.table.rowCount - 1, col: colIndex } }
        ]);
      }
      this.table.fireListeners(TABLE_EVENT_TYPE.PLUGIN_EVENT, {
        plugin: this,
        event: event,
        pluginEventInfo: {
          eventType: 'rightclick',
          colIndex: colIndex
        }
      });
    } else {
      //直接全选
      this.table.selectCells([
        { start: { row: 0, col: 0 }, end: { row: this.table.rowCount - 1, col: this.table.colCount - 1 } }
      ]);
      this.table.fireListeners(TABLE_EVENT_TYPE.PLUGIN_EVENT, {
        plugin: this,
        event: event,
        pluginEventInfo: {
          eventType: 'rightclick',
          isCorner: true
        }
      });
    }
  };

  private handleSeriesNumberCellHover = (e: any) => {
    this.table.scenegraph.renderSceneGraph();
  };

  private handleSeriesNumberCellUnHover = (e: any) => {
    this.table.scenegraph.renderSceneGraph();
  };

  private handleSeriesNumberCellClick = (e: any) => {
    const { seriesNumberCell, event, isDragSelect } = e.detail;
    const ctrlMultiSelect = this.table.options.keyboardOptions?.ctrlMultiSelect ?? true;
    const shiftMultiSelect = (this.table.options.keyboardOptions as any)?.shiftMultiSelect ?? true;
    const enableCtrlSelectMode = (event.nativeEvent.ctrlKey || event.nativeEvent.metaKey) && ctrlMultiSelect;
    const enableShiftSelectMode = event.nativeEvent.shiftKey && shiftMultiSelect;
    const isRow = seriesNumberCell.name.includes('row');
    const isCol = seriesNumberCell.name.includes('col');
    if (isRow) {
      this.table.stateManager.setSelectInline('row');
      const rowIndex = seriesNumberCell.id;

      if (isDragSelect) {
        this.table.dragSelectRow(rowIndex, enableCtrlSelectMode, false);
      } else {
        this.table.startDragSelectRow(rowIndex, enableCtrlSelectMode, enableShiftSelectMode, false);
      }
    } else if (isCol) {
      this.table.stateManager.setSelectInline('col');
      const colIndex = seriesNumberCell.id;
      if (isDragSelect) {
        this.table.dragSelectCol(colIndex, enableCtrlSelectMode, false);
      } else {
        this.table.startDragSelectCol(colIndex, enableCtrlSelectMode, enableShiftSelectMode, false);
      }
    } else {
      this.table.eventManager.deelTableSelectAll();
    }
  };

  private handleSeriesNumberCellClickUp = (e: any) => {
    this.table.stateManager.setSelectInline(false);
    this.table.endDragSelect();
  };

  private handleRowSeriesNumberWidthChange = (e: any) => {
    const rowSeriesNumberColWidth = this.seriesNumberComponent.rowSeriesNumberWidth;
    const colSeriesNumberRowHeight = this.seriesNumberComponent.colSeriesNumberHeight;
    this.table.setContentInsetXY(rowSeriesNumberColWidth, colSeriesNumberRowHeight);
  };

  private handleResizeColWidthStart = (e: any) => {
    this.seriesNumberComponent.setAttribute('hover', false);
    const { colIndex, event } = e.detail;
    this.table.stateManager.updateInteractionState(TYPES.InteractionState.grabing);
    this.table.stateManager.startResizeCol(colIndex, event.viewport.x, event.viewport.y);
  };

  private handleResizeRowHeightStart = (e: any) => {
    this.seriesNumberComponent.setAttribute('hover', false);
    const { rowIndex, event } = e.detail;
    this.table.stateManager.updateInteractionState(TYPES.InteractionState.grabing);
    this.table.stateManager.startResizeRow(rowIndex, event.viewport.x, event.viewport.y);
  };

  private handleDragColumOrderStart = (e: any) => {
    // console.log('handleDragColumOrderStart', e.detail.event.viewport.x, e.detail.event.viewport.y);
    const { colIndex, event } = e.detail;
    this.table.stateManager.updateInteractionState(TYPES.InteractionState.grabing);
    this.table.stateManager.startMoveCol(colIndex, 0, event.viewport.x, event.viewport.y, event.nativeEvent, 'column');
  };
  private handleDragRowOrderStart = (e: any) => {
    // console.log('handleDragRowOrderStart', e.detail.event.viewport.x, e.detail.event.viewport.y);
    const { rowIndex, event } = e.detail;
    this.table.stateManager.updateInteractionState(TYPES.InteractionState.grabing);
    this.table.stateManager.startMoveCol(0, rowIndex, event.viewport.x, event.viewport.y, event.nativeEvent, 'row');
  };

  listenComponentEvents() {
    this.seriesNumberComponent.on(SeriesNumberEvent.seriesNumberCellRightClick, this.handleSeriesNumberCellRightClick);
    this.seriesNumberComponent.on(SeriesNumberEvent.seriesNumberCellHover, this.handleSeriesNumberCellHover);
    this.seriesNumberComponent.on(SeriesNumberEvent.seriesNumberCellUnHover, this.handleSeriesNumberCellUnHover);
    this.seriesNumberComponent.on(SeriesNumberEvent.seriesNumberCellClick, this.handleSeriesNumberCellClick);
    this.seriesNumberComponent.on(SeriesNumberEvent.seriesNumberCellClickUp, this.handleSeriesNumberCellClickUp);
    this.seriesNumberComponent.on(SeriesNumberEvent.rowSeriesNumberWidthChange, this.handleRowSeriesNumberWidthChange);
    this.seriesNumberComponent.on(SeriesNumberEvent.resizeColWidthStart, this.handleResizeColWidthStart);
    this.seriesNumberComponent.on(SeriesNumberEvent.resizeRowHeightStart, this.handleResizeRowHeightStart);
    if (this.pluginOptions.dragOrder?.enableDragColumnOrder) {
      this.seriesNumberComponent.on(SeriesNumberEvent.dragColumnOrderStart, this.handleDragColumOrderStart);
    }
    if (this.pluginOptions.dragOrder?.enableDragRowOrder) {
      this.seriesNumberComponent.on(SeriesNumberEvent.dragRowOrderStart, this.handleDragRowOrderStart);
    }
  }
  release() {
    // 清除组件资源
    if (this.componentLayoutLayer) {
      this.table.scenegraph.stage.removeLayer(this.componentLayoutLayer._uid);
      this.componentLayoutLayer = null;
    }

    // 清除定时器
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
      this.scrollTimer = null;
    }

    // 移除表格事件监听器
    if (this.table) {
      this.table.off(TABLE_EVENT_TYPE.SCROLL, this.handleScroll);
      this.table.off(TABLE_EVENT_TYPE.AFTER_SORT, this.handleAfterSort);
      this.table.off(TABLE_EVENT_TYPE.SELECTED_CHANGED, this.handleSelectedChanged);
      this.table.off(TABLE_EVENT_TYPE.RESIZE_COLUMN_END, this.handleResizeColumnEnd);
      this.table.off(TABLE_EVENT_TYPE.RESIZE_ROW_END, this.handleResizeRowEnd);
    }
    // 移除组件事件监听器
    if (this.seriesNumberComponent) {
      this.seriesNumberComponent.off(
        SeriesNumberEvent.seriesNumberCellRightClick,
        this.handleSeriesNumberCellRightClick
      );
      this.seriesNumberComponent.off(SeriesNumberEvent.seriesNumberCellHover, this.handleSeriesNumberCellHover);
      this.seriesNumberComponent.off(SeriesNumberEvent.seriesNumberCellUnHover, this.handleSeriesNumberCellUnHover);
      this.seriesNumberComponent.off(SeriesNumberEvent.seriesNumberCellClick, this.handleSeriesNumberCellClick);
      this.seriesNumberComponent.off(SeriesNumberEvent.seriesNumberCellClickUp, this.handleSeriesNumberCellClickUp);
      this.seriesNumberComponent.off(
        SeriesNumberEvent.rowSeriesNumberWidthChange,
        this.handleRowSeriesNumberWidthChange
      );
      this.seriesNumberComponent.off(SeriesNumberEvent.resizeColWidthStart, this.handleResizeColWidthStart);
      this.seriesNumberComponent.off(SeriesNumberEvent.resizeRowHeightStart, this.handleResizeRowHeightStart);

      // 释放组件资源
      this.seriesNumberComponent.release?.();
      this.seriesNumberComponent = null;
    }
  }

  syncRowHeightToComponent() {
    // console.log('syncRowHeightToComponent adjust', adjustStartRowIndex, adjustEndRowIndex);
    const rowRange = this.table.getBodyVisibleRowRange();
    if (!rowRange) {
      return;
    }
    const { rowStart, rowEnd } = this.table.getBodyVisibleRowRange();
    const adjustStartRowIndex = Math.max(rowStart - 2, this.table.frozenRowCount);
    const adjustEndRowIndex = Math.min(rowEnd + 2, this.table.rowCount - 1);
    //判断seriesNumberComponent的冻结行数是否变化
    if (this.table.frozenRowCount !== (this.seriesNumberComponent.getAttributes() as any).frozenRowCount) {
      this.seriesNumberComponent.setAttributes({ frozenRowCount: this.table.frozenRowCount } as any);
    }
    // 调用行序号重建接口
    this.seriesNumberComponent.recreateCellsToRowSeriesNumberGroup(adjustStartRowIndex, adjustEndRowIndex);
    // 更新冻结行序号单元格的y和height
    for (let i = 0; i < this.table.frozenRowCount; i++) {
      const cellGroup = this.table.scenegraph.getCell(0, i);
      const cell_attrs = cellGroup.getAttributes();
      this.seriesNumberComponent.setRowSeriesNumberCellAttributes(i, { y: cell_attrs.y, height: cell_attrs.height });
    }

    // 更新行序号单元格的y和height
    for (let i = adjustStartRowIndex; i <= adjustEndRowIndex; i++) {
      const cellGroup = this.table.scenegraph.getCell(0, i);
      const cell_attrs = cellGroup.getAttributes();
      this.seriesNumberComponent.setRowSeriesNumberCellAttributes(i, { y: cell_attrs.y, height: cell_attrs.height });
    }
  }
  syncColWidthToComponent() {
    const colRange = this.table.getBodyVisibleColRange();
    if (!colRange) {
      return;
    }
    const { colStart, colEnd } = this.table.getBodyVisibleColRange();
    const adjustStartColIndex = colStart;
    const adjustEndColIndex = Math.min(colEnd, this.table.scenegraph.proxy.colEnd);
    //  console.log('syncColWidthToComponent adjust', adjustStartColIndex, adjustEndColIndex);

    //判断seriesNumberComponent的冻结列数是否变化
    if (this.table.frozenColCount !== (this.seriesNumberComponent.getAttributes() as any).frozenColCount) {
      this.seriesNumberComponent.setAttributes({ frozenColCount: this.table.frozenColCount } as any);
    }
    // 调用列序号重建接口
    this.seriesNumberComponent.recreateCellsToColSeriesNumberGroup(adjustStartColIndex, adjustEndColIndex);
    //更新冻结列序号单元格的x和width
    for (let i = 0; i < this.table.frozenColCount; i++) {
      const colGroup = this.table.scenegraph.getColGroup(i);
      const cell_attrs = colGroup.getAttributes();
      this.seriesNumberComponent.setColSeriesNumberCellAttributes(i, { x: cell_attrs.x, width: cell_attrs.width });
    }
    // 更新列序号单元格的x和width
    for (let i = adjustStartColIndex; i <= adjustEndColIndex; i++) {
      const colGroup = this.table.scenegraph.getColGroup(i);
      const col_attrs = colGroup.getAttributes();
      this.seriesNumberComponent.setColSeriesNumberCellAttributes(i, { x: col_attrs.x, width: col_attrs.width });
    }
  }

  syncScrollToComponent() {
    //TODO 根据滚动方向，同步对应的序号组件的滚动
    this.syncRowHeightToComponent();
    this.syncColWidthToComponent();
    const y = this.table.scenegraph.bodyGroup.getAttributes().y;
    const x = this.table.scenegraph.bodyGroup.getAttributes().x;
    this.seriesNumberComponent.setRowSeriesNumberGroupAttributes({
      y: y + this.seriesNumberComponent.colSeriesNumberHeight
    });
    this.seriesNumberComponent.setColSeriesNumberGroupAttributes({
      x: x + this.seriesNumberComponent.rowSeriesNumberWidth
    });
  }
  // syncFrozenToComponent() {
  //   const frozenRowCount = this.table.frozenRowCount;
  //   const frozenColCount = this.table.frozenColCount;
  //   this.seriesNumberComponent.setFrozenTopRow(frozenRowCount);
  //   this.seriesNumberComponent.setFrozenLeftCol(frozenColCount);
  // }
}
