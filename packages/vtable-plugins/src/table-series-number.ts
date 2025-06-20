import * as VTable from '@visactor/vtable';
import { TableSeriesNumber as VRenderTableSeriesNumber, SeriesNumberEvent } from '@visactor/vrender-components';
import type { ILayer } from '@visactor/vrender-core';

export interface TableSeriesNumberOptions {
  rowCount: number;
  colCount: number;
  rowHeight: number;
  colWidth: number;
}
export class TableSeriesNumber implements VTable.plugins.IVTablePlugin {
  id = `table-series-number-${Date.now()}`;
  name = 'Table Series Number';
  runTime = [VTable.TABLE_EVENT_TYPE.INITIALIZED];
  pluginOptions: TableSeriesNumberOptions;
  table: VTable.ListTable;
  seriesNumberComponent: VRenderTableSeriesNumber;
  componentLayoutLayer: ILayer;
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
      const newLayer = this.table.scenegraph.stage.createLayer();
      newLayer.appendChild(this.seriesNumberComponent);
      newLayer.setAttributes({ pickable: false });
      this.componentLayoutLayer = newLayer;
      const rowSeriesNumberColWidth = this.seriesNumberComponent.rowSeriesNumberWidth;
      const colSeriesNumberRowHeight = this.seriesNumberComponent.colSeriesNumberHeight;
      // this.table.scenegraph.stage.defaultLayer.setAttributes({
      //   x: rowSeriesNumberColWidth,
      //   y: colSeriesNumberRowHeight,
      //   width: 1700,
      //   height: 500,
      //   clip: true
      // });
      this.table.setTableX(this.table.tableX + rowSeriesNumberColWidth);
      this.table.setTableY(this.table.tableY + colSeriesNumberRowHeight);
      // this.syncCornerHeight();
      this.syncRowHeightToComponent();
      this.syncColWidthToComponent();
      this.syncFrozenToComponent();
      this.listenTableEvents();
    }
  }
  listenTableEvents() {
    this.table.on(VTable.TABLE_EVENT_TYPE.SCROLL, () => {
      this.syncScrollToComponent();
    });
    this.table.on(VTable.TABLE_EVENT_TYPE.CLICK_CELL, e => {
      //todo 对应更新seriesNumberComponent的选中状态
    });
    this.table.on(VTable.TABLE_EVENT_TYPE.DRAG_SELECT_END, e => {
      //todo 对应更新seriesNumberComponent的选中状态
    });
  }

  listenComponentEvents() {
    this.seriesNumberComponent.on(SeriesNumberEvent.seriesNumberCellHover, e => {
      console.log(SeriesNumberEvent.seriesNumberCellHover, e);
      this.table.scenegraph.renderSceneGraph();
    });
    this.seriesNumberComponent.on(SeriesNumberEvent.seriesNumberCellUnHover, e => {
      console.log(SeriesNumberEvent.seriesNumberCellUnHover, e);
      this.table.scenegraph.renderSceneGraph();
    });
    this.seriesNumberComponent.on(SeriesNumberEvent.seriesNumberCellClick, e => {
      const { seriesNumberCell, event } = e.detail;
      console.log(SeriesNumberEvent.seriesNumberCellClick, event, seriesNumberCell);
      const isRow = seriesNumberCell.name.includes('row');
      if (isRow) {
        const rowIndex = seriesNumberCell.id;
        this.table.selectRow(rowIndex);
      } else {
        const colIndex = seriesNumberCell.id;
        this.table.selectCol(colIndex);
      }
    });
  }
  release() {
    console.log('TableSeriesNumber release');
  }
  syncRowHeightToComponent() {
    const currentRowIndex = this.table.scenegraph.proxy.currentRow;
    console.log('currentRowIndex', currentRowIndex);
    for (let i = 0; i <= currentRowIndex; i++) {
      const rowHeight = this.table.getRowHeight(i);
      const y = this.table.getRowsHeight(0, i - 1);
      this.seriesNumberComponent.setRowSeriesNumberCellAttributes(i, { height: rowHeight, y });
    }
    //获取seriesNumberComponent的下一个行cell group的y 计算差值
    const currentRowCellGroup = this.seriesNumberComponent.getRowSeriesNumberCellGroup(currentRowIndex);
    const new_nextRowCellGroupY = currentRowCellGroup.getAttributes().y + currentRowCellGroup.getAttributes().height;
    const nextRowCellGroup = this.seriesNumberComponent.getRowSeriesNumberCellGroup(currentRowIndex + 1);
    const diffY = new_nextRowCellGroupY - nextRowCellGroup.getAttributes().y;
    //更改其他剩余行单元格的y
    for (let i = currentRowIndex + 1; i < this.seriesNumberComponent.rowCount; i++) {
      const y = this.seriesNumberComponent.getRowSeriesNumberCellAttributes(i).y + diffY;
      this.seriesNumberComponent.setRowSeriesNumberCellAttributes(i, { y });
    }
  }
  syncColWidthToComponent() {
    const currentColIndex = this.table.scenegraph.proxy.currentCol;
    console.log('currentColIndex', currentColIndex);
    for (let i = 0; i <= currentColIndex; i++) {
      const colWidth = this.table.getColWidth(i);
      console.log('colWidth', i, colWidth);
      const x = this.table.getColsWidth(0, i - 1);
      this.seriesNumberComponent.setColSeriesNumberCellAttributes(i, { width: colWidth, x });
    }
    const currentColCellGroup = this.seriesNumberComponent.getColSeriesNumberCellGroup(currentColIndex);
    const new_nextColCellGroupX = currentColCellGroup.getAttributes().x + currentColCellGroup.getAttributes().width;
    const nextColCellGroup = this.seriesNumberComponent.getColSeriesNumberCellGroup(currentColIndex + 1);
    const diffX = new_nextColCellGroupX - nextColCellGroup.getAttributes().x;
    for (let i = currentColIndex + 1; i < this.seriesNumberComponent.colCount; i++) {
      const x = this.seriesNumberComponent.getColSeriesNumberCellAttributes(i).x + diffX;
      this.seriesNumberComponent.setColSeriesNumberCellAttributes(i, { x });
    }
  }

  syncScrollToComponent() {
    const scrollLeft = this.table.stateManager.scroll.horizontalBarPos;
    const scrollTop = this.table.stateManager.scroll.verticalBarPos;
    this.seriesNumberComponent.setScrollLeft(scrollLeft);
    this.seriesNumberComponent.setScrollTop(scrollTop);
  }
  syncFrozenToComponent() {
    const frozenRowCount = this.table.frozenRowCount;
    this.seriesNumberComponent.setFrozenRowCount(frozenRowCount);
    // this.seriesNumberComponent.setFrozenColCount(frozenColCount);
  }
}
