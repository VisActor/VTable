import { Group, createLine } from '@visactor/vrender-core';
import { TYPES } from '@visactor/vtable';
import type { GridStyle } from '../ts-types';
export class GridComponent {
  vertical: boolean;
  horizontal: boolean;
  // verticalLineSpace: number;
  // horizontalLineSpace: number;
  gridStyle: any;
  scrollLeft: number;
  scrollTop: number;
  x: number;
  y: number;
  width: number;
  height: number;
  timelineDates: any;
  colWidthPerDay: number;
  rowHeight: number;
  rowCount: number;
  group: Group;
  verticalLineGroup: Group;
  horizontalLineGroup: Group;
  allGridHeight: number;
  constructor(gridOption: {
    vertical: boolean;
    horizontal: boolean;
    scrollLeft: number;
    scrollTop: number;
    x: number;
    y: number;
    width: number;
    height: number;
    timelineDates: any;
    colWidthPerDay: number;
    rowHeight: number;
    rowCount: number;
    allGridHeight: number;
    gridStyle: GridStyle;
  }) {
    this.vertical = gridOption.vertical;
    this.horizontal = gridOption.horizontal;
    this.gridStyle = gridOption.gridStyle;
    this.scrollLeft = gridOption.scrollLeft;
    this.scrollTop = gridOption.scrollTop;
    this.x = gridOption.x;
    this.y = gridOption.y;
    this.width = gridOption.width;
    this.height = gridOption.height;
    this.timelineDates = gridOption.timelineDates;
    this.colWidthPerDay = gridOption.colWidthPerDay;
    this.rowHeight = gridOption.rowHeight;
    this.rowCount = gridOption.rowCount;
    this.allGridHeight = gridOption.allGridHeight;
    console.trace('new GridComponent');
    this.group = new Group({
      x: gridOption.x,
      y: gridOption.y,
      width: gridOption.width,
      height: gridOption.height - 4,
      clip: true,
      pickable: false,
      stroke: 'blue',
      lineWidth: 2
      // fill: false
    });
    (this.group as any).role = 'grid';
    if (this.vertical) {
      this.verticalLineGroup = new Group({
        x: 0,
        y: 0,
        width: this.width,
        height: this.allGridHeight
      });
      (this.verticalLineGroup as any).role = 'grid-vertical';
      this.group.addChild(this.verticalLineGroup);

      const vLines = [];
      let x = 0;
      for (let i = 0; i < this.timelineDates.length - 1; i++) {
        const dateline = this.timelineDates[i];
        x = Math.floor(x + this.colWidthPerDay * dateline.days);
        if (this.gridStyle?.vertical.lineWidth & 1) {
          x += 0.5;
        }
        const line = createLine({
          pickable: false,
          stroke: this.gridStyle?.vertical.lineColor,
          lineWidth: this.gridStyle?.vertical.lineWidth,
          points: [
            { x, y: 0 },
            { x, y: this.allGridHeight }
          ]
        });
        vLines.push(line);
        this.verticalLineGroup.addChild(line);
      }
    }

    if (this.horizontal) {
      this.horizontalLineGroup = new Group({
        x: 0,
        y: 0,
        width: this.width,
        height: this.allGridHeight
      });
      (this.horizontalLineGroup as any).role = 'grid-horizontal';
      this.group.addChild(this.horizontalLineGroup);

      const hLines = [];
      let y = 0;
      for (let i = 0; i < this.rowCount - 1; i++) {
        y = Math.floor(y + this.rowHeight);
        if (this.gridStyle?.horizontal.lineWidth & 1) {
          y += 0.5;
        }
        const line = createLine({
          pickable: false,
          stroke: this.gridStyle?.horizontal.lineColor,
          lineWidth: this.gridStyle?.horizontal.lineWidth,
          points: [
            { x: 0, y },
            { x: this.width, y }
          ]
        });
        hLines.push(line);
        this.horizontalLineGroup.addChild(line);
      }
    }
  }
  setX(x: number) {
    this.verticalLineGroup.setAttribute('x', x + 1);
    this.horizontalLineGroup.setAttribute('x', x);
  }
  setY(y: number) {
    this.verticalLineGroup.setAttribute('y', y);
    this.horizontalLineGroup.setAttribute('y', y);
  }
}
