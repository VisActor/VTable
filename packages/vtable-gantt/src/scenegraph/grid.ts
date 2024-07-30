import { Group, createLine } from '@visactor/vrender-core';
import { TYPES } from '@visactor/vtable';
import type { IGridStyle } from '../ts-types';
import { str } from '@visactor/vtable/es/tools/helper';
import type { Scenegraph } from './scenegraph';
export class Grid {
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
  allGridWidth: number;
  _scene: Scenegraph;
  constructor(scene: Scenegraph) {
    this._scene = scene;
    this.vertical = !!scene._gantt.gridStyle.vertical;
    this.horizontal = !!scene._gantt.gridStyle.horizontal;
    this.gridStyle = scene._gantt.gridStyle;
    this.scrollLeft = 0;
    this.scrollTop = 0;
    this.x = 0;
    this.y = scene._gantt.headerRowHeight * scene._gantt.headerLevel;
    this.width = scene.tableGroup.attribute.width;
    this.height = scene.tableGroup.attribute.height - scene.timelineHeader.group.attribute.height;
    this.timelineDates = scene._gantt.reverseSortedScales[0].timelineDates;
    this.colWidthPerDay = scene._gantt.colWidthPerDay;
    this.rowHeight = scene._gantt.rowHeight;
    this.rowCount = scene._gantt.itemCount;
    this.allGridWidth = scene._gantt.getAllColsWidth();
    this.allGridHeight = scene._gantt.getAllGridHeight();
    this.group = new Group({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      clip: true,
      fill: this.gridStyle?.backgroundColor
    });
    this.group.name = 'grid-container';
    scene.tableGroup.addChild(this.group);
    //补充timelineHeader中不好绘制的底部的边线
    const line = createLine({
      pickable: false,
      stroke: scene._gantt.timelineHeaderStyle?.borderColor,
      lineWidth: scene._gantt.timelineHeaderStyle?.borderWidth,
      points: [
        { x: 0, y: scene._gantt.timelineHeaderStyle?.borderWidth & 1 ? 0.5 : 0 },
        { x: scene._gantt.getAllColsWidth(), y: scene._gantt.timelineHeaderStyle?.borderWidth & 1 ? 0.5 : 0 }
      ]
    });
    this.group.addChild(line);
    this.createVerticalLines();

    this.createHorizontalLines();
  }
  createVerticalLines() {
    if (this.vertical) {
      this.verticalLineGroup = new Group({
        x: 0,
        y: 0,
        width: this.allGridWidth,
        height: this.allGridHeight
      });
      this.verticalLineGroup.name = 'grid-vertical';
      this.group.appendChild(this.verticalLineGroup);

      const vLines = [];
      let x = 0;
      if (this.gridStyle?.vertical.lineWidth & 1) {
        x = 0.5;
      }
      for (let i = 0; i < this.timelineDates.length - 1; i++) {
        const dateline = this.timelineDates[i];
        x = x + Math.floor(this.colWidthPerDay * dateline.days);
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
        this.verticalLineGroup.appendChild(line);
      }
    }
  }
  createHorizontalLines() {
    if (this.horizontal) {
      this.horizontalLineGroup = new Group({
        x: 0,
        y: 0,
        width: this.allGridWidth,
        height: this.allGridHeight
      });
      this.horizontalLineGroup.name = 'grid-horizontal';
      this.group.appendChild(this.horizontalLineGroup);

      const hLines = [];
      let y = 0;
      if (this.gridStyle?.horizontal.lineWidth & 1) {
        y += 0.5;
      }
      for (let i = 0; i < this.rowCount - 1; i++) {
        y = y + Math.floor(this.rowHeight);
        const line = createLine({
          pickable: false,
          stroke: this.gridStyle?.horizontal.lineColor,
          lineWidth: this.gridStyle?.horizontal.lineWidth,
          points: [
            { x: 0, y },
            { x: this.allGridWidth, y }
          ]
        });
        hLines.push(line);
        this.horizontalLineGroup.appendChild(line);
      }
    }
  }
  /** 重新创建网格线场景树结点 */
  refresh() {
    this.width = this._scene.tableGroup.attribute.width;
    this.height = this._scene.tableGroup.attribute.height - this._scene.timelineHeader.group.attribute.height;
    this.group.setAttributes({
      width: this.width,
      height: this.height
    });
    this.rowCount = this._scene._gantt.itemCount;
    this.allGridWidth = this._scene._gantt.getAllColsWidth();
    this.allGridHeight = this._scene._gantt.getAllGridHeight();
    this.verticalLineGroup.parent.removeChild(this.verticalLineGroup);
    this.horizontalLineGroup.parent.removeChild(this.horizontalLineGroup);
    this.createVerticalLines();
    this.createHorizontalLines();
  }
  setX(x: number) {
    this.verticalLineGroup.setAttribute('x', x);
    this.horizontalLineGroup.setAttribute('x', x);
  }
  setY(y: number) {
    this.verticalLineGroup.setAttribute('y', y);
    this.horizontalLineGroup.setAttribute('y', y);
  }
  resize() {
    this.width = this._scene.tableGroup.attribute.width;
    this.height = this._scene.tableGroup.attribute.height - this._scene.timelineHeader.group.attribute.height;
    this.group.setAttribute('width', this.width);
    this.group.setAttribute('height', this.height);
  }
}
