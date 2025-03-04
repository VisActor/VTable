import { Group, createLine, createRect } from '@visactor/vtable/es/vrender';

import type { Scenegraph } from './scenegraph';
import type { IGrid } from '../ts-types';
import { computeCountToTimeScale } from '../tools/util';
export class Grid {
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
  verticalBackgroundRectsGroup: Group;
  horizontalBackgroundRectsGroup: Group;
  allGridHeight: number;
  allGridWidth: number;
  _scene: Scenegraph;
  constructor(scene: Scenegraph) {
    this._scene = scene;

    this.scrollLeft = 0;
    this.scrollTop = 0;
    this.x = 0;
    this.y = scene._gantt.getAllHeaderRowsHeight();
    this.width = scene.ganttGroup.attribute.width;
    this.height = scene.ganttGroup.attribute.height - scene.timelineHeader.group.attribute.height;
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
      fill: scene._gantt.parsedOptions.grid?.backgroundColor
    });
    this.group.name = 'grid-container';
    scene.ganttGroup.addChild(this.group);
    this.createVerticalBackgroundRects();
    this.createHorizontalBackgroundRects();
    this.createVerticalLines();
    this.createHorizontalLines();
    this.createTimeLineHeaderBottomLine();
  }

  createTimeLineHeaderBottomLine() {
    const options = this._scene._gantt.parsedOptions;
    //补充timelineHeader中不好绘制的底部的边线
    const horizontalSplitLineWidth =
      options.horizontalSplitLine?.lineWidth ?? options.timelineHeaderHorizontalLineStyle?.lineWidth;
    const bottomLineY = (horizontalSplitLineWidth & 1 ? -0.5 : 0) + horizontalSplitLineWidth / 2; // 原来是(horizontalSplitLineWidth & 1 ? 0.5 : 0)  这里改成-0.5为了和左侧表格的水平分割线对齐
    const line = createLine({
      pickable: false,
      stroke: options.horizontalSplitLine?.lineColor ?? options.timelineHeaderHorizontalLineStyle?.lineColor,
      lineWidth: horizontalSplitLineWidth + (horizontalSplitLineWidth & 1 ? 1 : 0), // 加上后面这个1是为了和左侧表格的水平分割线对齐
      points: [
        { x: 0, y: bottomLineY },
        {
          x: this._scene._gantt.getAllDateColsWidth(),
          y: bottomLineY
        }
      ]
    });
    line.name = 'timeLine-header-bottom-line';
    this.group.addChild(line);
  }

  createVerticalLines() {
    const gridStyle = this._scene._gantt.parsedOptions.grid;
    const verticalLineDependenceOnTimeScale =
      gridStyle.verticalLineDependenceOnTimeScale ??
      this._scene._gantt.parsedOptions.reverseSortedTimelineScales[0].unit;

    if (gridStyle.verticalLine) {
      this.verticalLineGroup = new Group({
        x: 0,
        y: 0,
        width: this.allGridWidth,
        height: this.allGridHeight
      });
      this.verticalLineGroup.name = 'grid-vertical';
      this.group.appendChild(this.verticalLineGroup);

      const dependenceOnTimeScale =
        this._scene._gantt.parsedOptions.reverseSortedTimelineScales.find(
          scale => scale.unit === verticalLineDependenceOnTimeScale
        ) ?? this._scene._gantt.parsedOptions.reverseSortedTimelineScales[0];
      const { unit: minUnit, step } = this._scene._gantt.parsedOptions.reverseSortedTimelineScales[0];
      const { timelineDates } = dependenceOnTimeScale;
      const timelineColWidth = this._scene._gantt.parsedOptions.timelineColWidth;

      if (typeof gridStyle.verticalLine === 'function') {
        for (let i = 0; i < timelineDates?.length - 1; i++) {
          const { endDate } = timelineDates[i];
          const verticalLine_style = gridStyle.verticalLine({
            index: i,
            dateIndex: timelineDates[i].dateIndex,
            date: timelineDates[i].endDate,
            ganttInstance: this._scene._gantt
          });
          const x =
            Math.ceil(
              computeCountToTimeScale(endDate, this._scene._gantt.parsedOptions.minDate, minUnit, step, 1) *
                timelineColWidth
            ) + (verticalLine_style.lineWidth & 1 ? 0.5 : 0);
          // const x = Math.ceil(timelineColWidth * (i + 1)) + (verticalLine_style.lineWidth & 1 ? 0.5 : 0);
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
        const verticalLine_style = gridStyle.verticalLine;
        for (let i = 0; i < timelineDates?.length - 1; i++) {
          const { endDate } = timelineDates[i];
          const x =
            Math.ceil(
              computeCountToTimeScale(endDate, this._scene._gantt.parsedOptions.minDate, minUnit, step, 1) *
                timelineColWidth
            ) + (verticalLine_style.lineWidth & 1 ? 0.5 : 0);
          // const x = Math.ceil(timelineColWidth * (i + 1)) + (verticalLine_style.lineWidth & 1 ? 0.5 : 0);
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
    const gridStyle = this._scene._gantt.parsedOptions.grid;
    if (gridStyle.horizontalLine) {
      this.horizontalLineGroup = new Group({
        x: 0,
        y: 0,
        width: this.allGridWidth,
        height: this.allGridHeight
      });
      this.horizontalLineGroup.name = 'grid-horizontal';
      this.group.appendChild(this.horizontalLineGroup);
      if (typeof gridStyle.horizontalLine === 'function') {
        let y = 0.5; //确保大多数情况 LineWidth为1时是准确的
        for (let i = 0; i < this.rowCount - 1; i++) {
          const horizontalLine_style = gridStyle.horizontalLine({
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
        const horizontalLine_style = gridStyle.horizontalLine;
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

  createVerticalBackgroundRects() {
    const verticalBackgroundColor = this._scene._gantt.parsedOptions.grid.verticalBackgroundColor;
    const weekendBackgroundColor = this._scene._gantt.parsedOptions.grid.weekendBackgroundColor;
    if (verticalBackgroundColor || weekendBackgroundColor) {
      this.verticalBackgroundRectsGroup = new Group({
        x: 0,
        y: 0,
        width: this.allGridWidth,
        height: this.allGridHeight
      });
      this.verticalBackgroundRectsGroup.name = 'grid-vertical-background';
      this.group.appendChild(this.verticalBackgroundRectsGroup);

      const { timelineDates, unit, step } = this._scene._gantt.parsedOptions.reverseSortedTimelineScales[0];
      const timelineColWidth = this._scene._gantt.parsedOptions.timelineColWidth;

      if (verticalBackgroundColor || weekendBackgroundColor) {
        for (let i = 0; i <= timelineDates?.length - 1; i++) {
          let backgroundColor;
          if (
            weekendBackgroundColor &&
            unit === 'day' &&
            step === 1 &&
            (timelineDates[i].startDate.getDay() === 0 || timelineDates[i].startDate.getDay() === 6)
          ) {
            backgroundColor = weekendBackgroundColor;
          } else if (typeof verticalBackgroundColor === 'function') {
            backgroundColor = verticalBackgroundColor({
              index: i,
              dateIndex: timelineDates[i].dateIndex,
              date: timelineDates[i].endDate,
              ganttInstance: this._scene._gantt
            });
          } else if (verticalBackgroundColor) {
            backgroundColor = verticalBackgroundColor[i % verticalBackgroundColor.length];
          }
          if (backgroundColor) {
            const x = Math.ceil(timelineColWidth * i);
            const rect = createRect({
              pickable: false,
              fill: backgroundColor,
              x,
              y: 0,
              width: timelineColWidth,
              height: this.allGridHeight
            });
            this.verticalBackgroundRectsGroup.appendChild(rect);
          }
        }
      }
    }
  }
  createHorizontalBackgroundRects() {
    const horizontalBackgroundColor = this._scene._gantt.parsedOptions.grid.horizontalBackgroundColor;
    if (horizontalBackgroundColor) {
      this.horizontalBackgroundRectsGroup = new Group({
        x: 0,
        y: 0,
        width: this.allGridWidth,
        height: this.allGridHeight
      });
      this.horizontalBackgroundRectsGroup.name = 'grid-horizontal-background';
      this.group.appendChild(this.horizontalBackgroundRectsGroup);

      let y = 0;
      for (let i = 0; i <= this.rowCount - 1; i++) {
        let backgroundColor;
        if (typeof horizontalBackgroundColor === 'function') {
          backgroundColor = horizontalBackgroundColor({
            index: i,
            ganttInstance: this._scene._gantt
          });
        } else {
          backgroundColor = horizontalBackgroundColor[i % horizontalBackgroundColor.length];
        }

        const rect = createRect({
          pickable: false,
          fill: backgroundColor,
          x: 0,
          y,
          width: this.allGridWidth,
          height: this._scene._gantt.getRowHeightByIndex(i)
        });
        this.horizontalBackgroundRectsGroup.appendChild(rect);
        y += this._scene._gantt.getRowHeightByIndex(i);
      }
    }
  }
  /** 重新创建网格线场景树结点 */
  refresh() {
    this.width = this._scene.ganttGroup.attribute.width;
    this.height = this._scene.ganttGroup.attribute.height - this._scene.timelineHeader.group.attribute.height;
    this.group.setAttributes({
      width: this.width,
      height: this.height,
      y: this._scene._gantt.getAllHeaderRowsHeight()
    });
    this.rowCount = this._scene._gantt.itemCount;
    this.allGridWidth = this._scene._gantt.getAllDateColsWidth();
    this.allGridHeight = this._scene._gantt.getAllTaskBarsHeight();
    this.group.removeAllChild();
    // this.verticalLineGroup?.parent.removeChild(this.verticalLineGroup);
    // this.horizontalLineGroup?.parent.removeChild(this.horizontalLineGroup);
    // this.verticalBackgroundRectsGroup?.parent.removeChild(this.verticalBackgroundRectsGroup);
    // this.horizontalBackgroundRectsGroup?.parent.removeChild(this.horizontalBackgroundRectsGroup);
    this.createVerticalBackgroundRects();
    this.createHorizontalBackgroundRects();
    this.createVerticalLines();
    this.createHorizontalLines();
    this.createTimeLineHeaderBottomLine();
  }
  setX(x: number) {
    this.verticalLineGroup?.setAttribute('x', x);
    this.horizontalLineGroup?.setAttribute('x', x);
    this.verticalBackgroundRectsGroup?.setAttribute('x', x);
    this.horizontalBackgroundRectsGroup?.setAttribute('x', x);
  }
  setY(y: number) {
    this.verticalLineGroup?.setAttribute('y', y);
    this.horizontalLineGroup?.setAttribute('y', y);
    this.verticalBackgroundRectsGroup?.setAttribute('y', y);
    this.horizontalBackgroundRectsGroup?.setAttribute('y', y);
  }
  resize() {
    this.width = this._scene.ganttGroup.attribute.width;
    this.height = this._scene.ganttGroup.attribute.height - this._scene.timelineHeader.group.attribute.height;
    this.group.setAttribute('width', this.width);
    this.group.setAttribute('height', this.height);
  }
}
