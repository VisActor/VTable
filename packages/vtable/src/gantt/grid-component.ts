import { Group, createLine } from '@visactor/vrender-core';

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

  constructor(gridOption: {
    vertical: boolean;
    horizontal: boolean;
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
    this.group = new Group({
      x: gridOption.x,
      y: gridOption.y,
      width: gridOption.width,
      height: gridOption.height - 4,
      clip: true,
      pickable: false,
      stroke: 'pink',
      lineWidth: 2
      // fill: false
    });

    if (this.vertical) {
      const vGroup = new Group({
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
        clip: true,
        pickable: false,
        stroke: 'red',
        lineWidth: 2
        // fill: false
      });
      this.group.addChild(vGroup);

      const vLines = [];
      let x = 0;
      for (let i = 0; i < this.timelineDates.length - 1; i++) {
        const dateline = this.timelineDates[i];
        x += this.colWidthPerDay * dateline.days;
        const line = createLine({
          pickable: false,
          stroke: 'red' as string,
          lineWidth: 1 as number,

          points: [
            { x, y: 0 },
            { x, y: this.height }
          ]
        });
        vLines.push(line);
        vGroup.addChild(line);
      }
    }

    if (this.horizontal) {
      const hGroup = new Group({
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
        clip: true,
        pickable: false,
        stroke: 'red',
        lineWidth: 2
        // fill: false
      });
      this.group.addChild(hGroup);

      const hLines = [];
      let y = 0;
      for (let i = 0; i < this.rowCount - 1; i++) {
        y += this.rowHeight;
        const line = createLine({
          pickable: false,
          stroke: 'red' as string,
          lineWidth: 1 as number,

          points: [
            { x: 0, y },
            { x: this.width, y }
          ]
        });
        hLines.push(line);
        hGroup.addChild(line);
      }
    }
  }
}
