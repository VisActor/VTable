import { Group, createLine } from '@visactor/vtable/es/vrender';

import type { Scenegraph } from './scenegraph';
import type { IGrid } from '../ts-types';
export class Grid {
  vertical: boolean;
  horizontal: boolean;
  // verticalLineSpace: number;
  // horizontalLineSpace: number;
  gridStyle: IGrid;
  scrollLeft: number;
  scrollTop: number;
  x: number;
  y: number;
  width: number;
  height: number;
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
    this.vertical = !!scene._gantt.parsedOptions.grid.verticalLine;
    this.horizontal = !!scene._gantt.parsedOptions.grid.horizontalLine;
    this.gridStyle = scene._gantt.parsedOptions.grid;
    this.scrollLeft = 0;
    this.scrollTop = 0;
    this.x = 0;
    this.y = scene._gantt.getAllHeaderRowsHeight();
    this.width = scene.tableGroup.attribute.width;
    this.height = scene.tableGroup.attribute.height - scene.timelineHeader.group.attribute.height;
    this.rowHeight = scene._gantt.parsedOptions.rowHeight;
    this.rowCount = scene._gantt.itemCount;
    this.allGridWidth = scene._gantt.getAllDateColsWidth();
    this.allGridHeight = scene._gantt.getAllTaskBarsHeight();
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

    this.createVerticalLines();

    this.createHorizontalLines();

    //补充timelineHeader中不好绘制的底部的边线
    const horizontalSplitLineWidth =
      scene._gantt.parsedOptions.horizontalSplitLine?.lineWidth ??
      scene._gantt.parsedOptions.timelineHeaderHorizontalLineStyle?.lineWidth;
    const bottomLineY = (horizontalSplitLineWidth & 1 ? -0.5 : 0) + horizontalSplitLineWidth / 2; // 原来是(horizontalSplitLineWidth & 1 ? 0.5 : 0)  这里改成-0.5为了和左侧表格的水平分割线对齐
    const line = createLine({
      pickable: false,
      stroke:
        scene._gantt.parsedOptions.horizontalSplitLine?.lineColor ??
        scene._gantt.parsedOptions.timelineHeaderHorizontalLineStyle?.lineColor,
      lineWidth: horizontalSplitLineWidth + (horizontalSplitLineWidth & 1 ? 1 : 0), // 加上后面这个1是为了和左侧表格的水平分割线对齐
      points: [
        { x: 0, y: bottomLineY },
        {
          x: scene._gantt.getAllDateColsWidth(),
          y: bottomLineY
        }
      ]
    });
    line.name = 'timeLine-header-bottom-line';
    this.group.addChild(line);
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

      const timelineDates = this._scene._gantt.parsedOptions.reverseSortedTimelineScales[0].timelineDates;
      const timelineColWidth = this._scene._gantt.parsedOptions.timelineColWidth;

      if (typeof this.gridStyle.verticalLine === 'function') {
        for (let i = 0; i < timelineDates?.length - 1; i++) {
          const verticalLine_style = this.gridStyle.verticalLine({
            index: i,
            dateIndex: timelineDates[i].dateIndex,
            date: timelineDates[i].endDate,
            ganttInstance: this._scene._gantt
          });
          const x = Math.ceil(timelineColWidth * (i + 1)) + (verticalLine_style.lineWidth & 1 ? 0.5 : 0);
          const line = createLine({
            pickable: false,
            stroke: verticalLine_style.lineColor,
            lineWidth: verticalLine_style.lineWidth,
            points: [
              { x, y: 0 },
              { x, y: this.allGridHeight }
            ]
          });
          this.verticalLineGroup.appendChild(line);
        }
      } else {
        const verticalLine_style = this.gridStyle.verticalLine;
        for (let i = 0; i < timelineDates?.length - 1; i++) {
          const x = Math.ceil(timelineColWidth * (i + 1)) + (verticalLine_style.lineWidth & 1 ? 0.5 : 0);
          const line = createLine({
            pickable: false,
            stroke: verticalLine_style.lineColor,
            lineWidth: verticalLine_style.lineWidth,
            points: [
              { x, y: 0 },
              { x, y: this.allGridHeight }
            ]
          });
          this.verticalLineGroup.appendChild(line);
        }
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
      if (typeof this.gridStyle.horizontalLine === 'function') {
        let y = 0.5; //确保大多数情况 LineWidth为1时是准确的
        for (let i = 0; i < this.rowCount - 1; i++) {
          const horizontalLine_style = this.gridStyle.horizontalLine({
            index: i,
            ganttInstance: this._scene._gantt
          });
          y = y + this._scene._gantt.getRowHeightByIndex(i); // Math.floor(this.rowHeight);
          const line = createLine({
            pickable: false,
            stroke: horizontalLine_style.lineColor,
            lineWidth: horizontalLine_style.lineWidth,
            points: [
              { x: 0, y },
              { x: this.allGridWidth, y }
            ]
          });
          this.horizontalLineGroup.appendChild(line);
        }
      } else {
        const horizontalLine_style = this.gridStyle.horizontalLine;
        let y = 0;
        if (horizontalLine_style.lineWidth & 1) {
          y += 0.5;
        }
        for (let i = 0; i < this.rowCount - 1; i++) {
          y = y + this._scene._gantt.getRowHeightByIndex(i); // Math.floor(this.rowHeight);
          const line = createLine({
            pickable: false,
            stroke: horizontalLine_style.lineColor,
            lineWidth: horizontalLine_style.lineWidth,
            points: [
              { x: 0, y },
              { x: this.allGridWidth, y }
            ]
          });
          this.horizontalLineGroup.appendChild(line);
        }
      }
    }
  }
  /** 重新创建网格线场景树结点 */
  refresh() {
    this.width = this._scene.tableGroup.attribute.width;
    this.height = this._scene.tableGroup.attribute.height - this._scene.timelineHeader.group.attribute.height;
    this.group.setAttributes({
      width: this.width,
      height: this.height,
      y: this._scene._gantt.getAllHeaderRowsHeight()
    });
    this.rowCount = this._scene._gantt.itemCount;
    this.allGridWidth = this._scene._gantt.getAllDateColsWidth();
    this.allGridHeight = this._scene._gantt.getAllTaskBarsHeight();
    this.verticalLineGroup?.parent.removeChild(this.verticalLineGroup);
    this.horizontalLineGroup?.parent.removeChild(this.horizontalLineGroup);
    this.createVerticalLines();
    this.createHorizontalLines();
  }
  setX(x: number) {
    this.verticalLineGroup?.setAttribute('x', x);
    this.horizontalLineGroup?.setAttribute('x', x);
  }
  setY(y: number) {
    this.verticalLineGroup?.setAttribute('y', y);
    this.horizontalLineGroup?.setAttribute('y', y);
  }
  resize() {
    this.width = this._scene.tableGroup.attribute.width;
    this.height = this._scene.tableGroup.attribute.height - this._scene.timelineHeader.group.attribute.height;
    this.group.setAttribute('width', this.width);
    this.group.setAttribute('height', this.height);
  }
}
