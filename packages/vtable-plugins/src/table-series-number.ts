import * as VTable from '@visactor/vtable';
import { TableSeriesNumber as VRenderTableSeriesNumber, SeriesNumberEvent } from '@visactor/vrender-components';
import type { ILayer } from '@visactor/vrender-core';

export interface TableSeriesNumberOptions {
  rowCount: number;
  colCount: number;
  rowHeight: number;
  colWidth: number;
  syncRowHeightFromTable?: boolean;
  syncColWidthFromTable?: boolean;
}
export class TableSeriesNumber implements VTable.plugins.IVTablePlugin {
  id = `table-series-number`;
  name = 'Table Series Number';
  runTime = [VTable.TABLE_EVENT_TYPE.INITIALIZED];
  pluginOptions: TableSeriesNumberOptions;
  table: VTable.ListTable;
  seriesNumberComponent: VRenderTableSeriesNumber;
  componentLayoutLayer: ILayer;
  lastCurrentRow: number = 0;
  lastCurrentCol: number = 0;
  startRowIndex: number = 0;
  constructor(pluginOptions: TableSeriesNumberOptions) {
    this.pluginOptions = pluginOptions;
    this.seriesNumberComponent = new VRenderTableSeriesNumber({
      rowCount: pluginOptions.rowCount,
      colCount: pluginOptions.colCount,
      rowHeight: pluginOptions.rowHeight,
      colWidth: pluginOptions.colWidth
    });
    this.listenComponentEvents();
  }

  run(...args: any[]) {
    // const eventArgs = args[0];
    const runTime = args[1];
    if (runTime === VTable.TABLE_EVENT_TYPE.INITIALIZED) {
      console.log('TableSeriesNumber initialized');
      this.table = args[2];
      this.table.customConfig = {
        cancelSelectCellHook: (e: any) => {
          const target = e.target;
          if (target.isDescendantsOf(this.seriesNumberComponent)) {
            return false;
          }
        }
      };

      const rowSeriesNumberColWidth = this.seriesNumberComponent.rowSeriesNumberWidth;
      const colSeriesNumberRowHeight = this.seriesNumberComponent.colSeriesNumberHeight;
      // this.table.scenegraph.stage.defaultLayer.setAttributes({
      //   x: rowSeriesNumberColWidth,
      //   y: colSeriesNumberRowHeight,
      //   width: 1700,
      //   height: 500,
      //   clip: true
      // });

      this.table.setTranslate(colSeriesNumberRowHeight, rowSeriesNumberColWidth);
      const t0 = performance.now();
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
      const t1 = performance.now();
      console.log('append component', t1 - t0);

      if (this.pluginOptions.syncRowHeightFromTable) {
        this.syncRowHeightToComponent();
      }
      if (this.pluginOptions.syncColWidthFromTable) {
        this.syncColWidthToComponent();
      }

      this.listenTableEvents();
    }
  }
  listenTableEvents() {
    this.table.on(VTable.TABLE_EVENT_TYPE.SCROLL, () => {
      this.syncScrollToComponent();
    });
    // this.table.on(VTable.TABLE_EVENT_TYPE.CLICK_CELL, e => {
    //   //todo 对应更新seriesNumberComponent的选中状态
    //   console.log('click_cell', e);
    // });
    this.table.on(VTable.TABLE_EVENT_TYPE.DRAG_SELECT_END, e => {
      //todo 对应更新seriesNumberComponent的选中状态
      // console.log('drag_select_end', e);
    });
    this.table.on(VTable.TABLE_EVENT_TYPE.SELECTED_CELL, e => {
      //todo 对应更新seriesNumberComponent的选中状态
      // console.log('select_cell', e);
      this.seriesNumberComponent.removeAllSelectedIndexs();
      const selectRange = this.table.stateManager.select.ranges;
      const rowSelectedIndexs = [];
      const colSelectedIndexs = [];
      for (const range of selectRange) {
        const { row: rowStart, col: colStart } = range.start;
        const { row: rowEnd, col: colEnd } = range.end;
        rowSelectedIndexs.push({ startIndex: rowStart, endIndex: rowEnd });
        colSelectedIndexs.push({ startIndex: colStart, endIndex: colEnd });
      }
      this.seriesNumberComponent.addRowSelectedRanges(rowSelectedIndexs);
      this.seriesNumberComponent.addColSelectedRanges(colSelectedIndexs);

      this.seriesNumberComponent.renderSelectedIndexsState();
    });
    this.table.on(VTable.TABLE_EVENT_TYPE.SELECTED_CLEAR, e => {
      //todo 对应更新seriesNumberComponent的选中状态
      // console.log('selected_clear', e);
    });
    // this.table.on(VTable.TABLE_EVENT_TYPE.BEFORE_BATCH_UPDATE_ROW_HEIGHT_COL_WIDTH, e => {
    //   console.log(
    //     'before_batch currentRow',
    //     this.table.scenegraph.proxy.currentRow,
    //     'rowEnd',
    //     this.table.scenegraph.proxy.rowEnd,
    //     'rowUpdatePos',
    //     this.table.scenegraph.proxy.rowUpdatePos,
    //     'totalRow',
    //     this.table.scenegraph.proxy.totalRow
    //   );
    //   this.startRowIndex = Math.min(this.table.scenegraph.proxy.currentRow, this.table.scenegraph.proxy.rowUpdatePos);
    // });
    // this.table.on(VTable.TABLE_EVENT_TYPE.AFTER_BATCH_UPDATE_ROW_HEIGHT_COL_WIDTH, e => {
    //   console.log(
    //     'after_batch currentRow',
    //     this.table.scenegraph.proxy.currentRow,
    //     'rowEnd',
    //     this.table.scenegraph.proxy.rowEnd,
    //     'rowUpdatePos',
    //     this.table.scenegraph.proxy.rowUpdatePos,
    //     'totalRow',
    //     this.table.scenegraph.proxy.totalRow
    //   );
    //   this.syncRowHeightToComponent(this.startRowIndex, e.currentRow);
    //   this.table.render();
    //   // this.syncColWidthToComponent(e.currentRow, e.currentCol);
    // });
  }

  listenComponentEvents() {
    this.seriesNumberComponent.on(SeriesNumberEvent.seriesNumberCellHover, e => {
      // console.log(SeriesNumberEvent.seriesNumberCellHover, e);
      this.table.scenegraph.renderSceneGraph();
    });
    this.seriesNumberComponent.on(SeriesNumberEvent.seriesNumberCellUnHover, e => {
      // console.log(SeriesNumberEvent.seriesNumberCellUnHover, e);
      this.table.scenegraph.renderSceneGraph();
    });
    this.seriesNumberComponent.on(SeriesNumberEvent.seriesNumberCellClick, e => {
      const { seriesNumberCell, event } = e.detail;
      const isCtrl = event.nativeEvent.ctrlKey || event.nativeEvent.metaKey;
      // console.log(SeriesNumberEvent.seriesNumberCellClick, event, seriesNumberCell);
      const isRow = seriesNumberCell.name.includes('row');
      if (isRow) {
        const rowIndex = seriesNumberCell.id;
        this.table.selectRow(rowIndex, isCtrl);
      } else {
        const colIndex = seriesNumberCell.id;
        this.table.selectCol(colIndex, isCtrl);
      }
    });
    this.seriesNumberComponent.on(SeriesNumberEvent.rowSeriesNumberWidthChange, e => {
      // console.log(SeriesNumberEvent.rowSeriesNumberWidthChange, e);
      const rowSeriesNumberColWidth = this.seriesNumberComponent.rowSeriesNumberWidth;
      const colSeriesNumberRowHeight = this.seriesNumberComponent.colSeriesNumberHeight;
      this.table.setTranslate(rowSeriesNumberColWidth, colSeriesNumberRowHeight);
    });
  }
  release() {
    console.log('TableSeriesNumber release');
  }

  syncRowHeightToComponent() {
    const { rowStart, rowEnd } = this.table.getBodyVisibleRowRange();
    const adjustStartRowIndex = rowStart;
    const adjustEndRowIndex = rowEnd;
    // console.log('syncRowHeightToComponent adjust', adjustStartRowIndex, adjustEndRowIndex);
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
    const { colStart, colEnd } = this.table.getBodyVisibleColRange();
    const adjustStartColIndex = colStart;
    const adjustEndColIndex = colEnd;
    //  console.log('syncColWidthToComponent adjust', adjustStartColIndex, adjustEndColIndex);

    // 调用列序号重建接口
    this.seriesNumberComponent.recreateCellsToColSeriesNumberGroup(adjustStartColIndex, adjustEndColIndex);
    //更新冻结列序号单元格的x和width
    for (let i = 0; i < this.table.frozenColCount; i++) {
      const cellGroup = this.table.scenegraph.getCell(i, 0);
      const cell_attrs = cellGroup.getAttributes();
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
