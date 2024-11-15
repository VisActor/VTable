import type { ILine, IRect, ISymbol } from '@src/vrender';
import { createLine, createRect, createSymbol } from '@src/vrender';
import { getCellMergeInfo } from '../utils/get-cell-merge';
import type { Group } from '../graphic/group';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { SimpleHeaderLayoutMap } from '../../layout';

export class CellMover {
  columnMoverLabel: ISymbol;
  columnMoverLine: ILine;
  columnMoverBack: IRect;
  table: BaseTableAPI;
  x?: number;

  constructor(table: BaseTableAPI) {
    const columnMoverLineWidth = table.theme.dragHeaderSplitLine.lineWidth;
    const columnMoverLineColor = table.theme.dragHeaderSplitLine.lineColor;
    const columnMoverShadowBlockColor = table.theme.dragHeaderSplitLine.shadowBlockColor;

    this.columnMoverLabel = createSymbol({
      visible: false,
      pickable: false,
      x: 0,
      y: 0,
      symbolType: 'triangle',
      fill: columnMoverLineColor as string
    });
    this.columnMoverLine = createLine({
      visible: false,
      pickable: false,
      stroke: columnMoverLineColor as string,
      lineWidth: columnMoverLineWidth as number,
      x: 0,
      y: 0,
      points: [
        { x: 0, y: 0 },
        { x: 0, y: 0 }
      ]
    });

    // 列顺序调整阴影块
    this.columnMoverBack = createRect({
      visible: false,
      pickable: false,
      fill: columnMoverShadowBlockColor,
      x: 0,
      y: 0,
      width: 0,
      height: 0
    });

    this.table = table;
  }

  appand(parent: Group) {
    parent.appendChild(this.columnMoverLabel);
    parent.appendChild(this.columnMoverLine);
    parent.appendChild(this.columnMoverBack);
  }

  show(col: number, row: number, delta: number) {
    const cellLocation = this.table.getCellLocation(col, row);
    const mergeInfo = getCellMergeInfo(this.table, col, row);
    if (mergeInfo) {
      col = mergeInfo.start.col;
      row = mergeInfo.start.row;
    }

    let rectX = 0;
    let rectY = 0;
    let rectWidth = 0;
    let rectHeight = 0;
    let rectDx = 0;
    let rectDy = 0;
    let symbolX = 0;
    let symbolY = 0;
    let symbolRotate = Math.PI;
    const linePoints: { x: number; y: number }[] = [];
    if (cellLocation === 'columnHeader') {
      rectX = this.table.getColsWidth(0, col - 1) - this.table.stateManager.scroll.horizontalBarPos;
      rectY = this.table.getRowsHeight(0, this.table.frozenRowCount - 1);
      rectHeight = this.table.tableNoFrameHeight;
      if (mergeInfo) {
        rectWidth = this.table.getColsWidth(mergeInfo.start.col, mergeInfo.end.col);
      } else {
        rectWidth = this.table.getColWidth(col);
      }
      rectDx = rectX - delta;

      symbolX = rectX + rectWidth;
      symbolY = 2;

      linePoints.push({ x: 0, y: 0 });
      linePoints.push({ x: 0, y: this.table.tableNoFrameHeight });
    } else if (
      cellLocation === 'rowHeader' ||
      (this.table.internalProps.layoutMap as SimpleHeaderLayoutMap).isSeriesNumberInBody(col, row)
    ) {
      rectY = this.table.getRowsHeight(0, row - 1) - this.table.stateManager.scroll.verticalBarPos;
      rectX = this.table.getColsWidth(0, this.table.frozenColCount - 1);
      rectWidth = this.table.tableNoFrameWidth;
      if (mergeInfo) {
        rectHeight = this.table.getRowsHeight(mergeInfo.start.row, mergeInfo.end.row);
      } else {
        rectHeight = this.table.getRowHeight(row);
      }
      rectDy = rectY - delta;

      symbolX = 2;
      symbolY = rectY + rectHeight;
      symbolRotate = Math.PI / 2;

      linePoints.push({ x: 0, y: 0 });
      linePoints.push({ x: this.table.tableNoFrameWidth, y: 0 });
    }

    this.columnMoverBack.setAttributes({
      visible: true,
      x: rectX - rectDx,
      y: rectY - rectDy,
      width: rectWidth,
      height: rectHeight,
      dx: rectDx,
      dy: rectDy
    });
    this.columnMoverLine.setAttributes({
      x: symbolX,
      y: symbolY,
      visible: true,
      points: linePoints
    });
    this.columnMoverLabel.setAttributes({
      visible: true,
      x: symbolX,
      y: symbolY,
      angle: symbolRotate
    });
    return {
      backX: rectX - rectDx,
      lineX: symbolX,
      backY: rectY - rectDy,
      lineY: symbolY
    };
  }

  hide() {
    this.columnMoverLabel.setAttribute('visible', false);
    this.columnMoverLine.setAttribute('visible', false);
    this.columnMoverBack.setAttribute('visible', false);
  }

  update(backX: number | undefined, lineX: number | undefined, backY: number | undefined, lineY: number | undefined) {
    if (typeof backX === 'number' && typeof lineX === 'number') {
      this.columnMoverLabel.setAttribute('x', lineX);
      this.columnMoverLine.setAttribute('x', lineX);
      this.columnMoverBack.setAttribute('x', backX);
    } else if (typeof backY === 'number' && typeof lineY === 'number') {
      this.columnMoverLabel.setAttribute('y', lineY);
      this.columnMoverLine.setAttribute('y', lineY);
      this.columnMoverBack.setAttribute('y', backY);
    }
  }

  updateStyle() {
    const columnMoverLineWidth = this.table.theme.dragHeaderSplitLine.lineWidth;
    const columnMoverLineColor = this.table.theme.dragHeaderSplitLine.lineColor;
    const columnMoverShadowBlockColor = this.table.theme.dragHeaderSplitLine.shadowBlockColor;

    this.columnMoverLabel.setAttributes({
      fill: columnMoverLineColor as string
    });
    this.columnMoverLine.setAttributes({
      stroke: columnMoverLineColor as string,
      lineWidth: columnMoverLineWidth as number
    });

    // 列顺序调整阴影块
    this.columnMoverBack.setAttributes({
      fill: columnMoverShadowBlockColor
    });
  }
}
