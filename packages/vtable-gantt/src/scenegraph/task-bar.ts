import { Group } from '@visactor/vrender-core';
import { createRect } from '@visactor/vrender-core';
import type { Scenegraph } from './scenegraph';
export class TaskBar {
  group: Group;
  barContainer: Group;
  _scene: Scenegraph;
  constructor(scene: Scenegraph) {
    this._scene = scene;
    const height = Math.min(scene._gantt.tableNoFrameHeight, scene._gantt.drawHeight);
    this.group = new Group({
      x: 0,
      y: scene._gantt.headerRowHeight * scene._gantt.headerLevel,
      width: scene._gantt.tableNoFrameWidth,
      height: height - scene._gantt.headerRowHeight * scene._gantt.headerLevel,
      pickable: false,
      clip: true
    });
    this.group.name = 'task-bar-container';
    this.barContainer = new Group({
      x: 0,
      y: 0,
      width: this._scene._gantt.getAllColsWidth(),
      height: this._scene._gantt.getAllGridHeight(),
      pickable: false,
      clip: true
    });
    this.group.appendChild(this.barContainer);
    this.initBars();
  }
  initBars() {
    const listTableInstance = this._scene._gantt.listTableInstance;
    for (let i = 0; i < this._scene._gantt.itemCount; i++) {
      let taskRecord;
      if (listTableInstance) {
        taskRecord = listTableInstance.getRecordByRowCol(
          0,
          i + this._scene._gantt.listTableInstance.columnHeaderLevelCount
        );
      } else {
        taskRecord = this._scene._gantt.records[i];
      }
      const startDateField = this._scene._gantt.startDateField;
      const endDateField = this._scene._gantt.endDateField;
      const progressField = this._scene._gantt.progressField;
      const startDate = new Date(taskRecord[startDateField]);
      const endDate = new Date(taskRecord[endDateField]);
      const taskDays = Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const taskBarSize = this._scene._gantt.colWidthPerDay * taskDays;
      const taskbarHeight = this._scene._gantt.barStyle.width;
      const minDate = new Date(this._scene._gantt.minDate);
      const barGroup = new Group({
        x:
          this._scene._gantt.colWidthPerDay *
          Math.ceil(Math.abs(startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)),
        // y: this._scene._gantt.rowHeight * i,
        y: this._scene._gantt.rowHeight * i + (this._scene._gantt.rowHeight - taskbarHeight) / 2,
        width: taskBarSize,
        // height: this._scene._gantt.rowHeight,
        height: taskbarHeight,
        cornerRadius: this._scene._gantt.barStyle.cornerRadius,
        clip: true
      });
      barGroup.name = 'task-bar';
      this.barContainer.appendChild(barGroup);
      // 创建整个任务条rect
      const rect = createRect({
        x: 0,
        y: 0, //this._scene._gantt.rowHeight - taskbarHeight) / 2,
        width: taskBarSize,
        height: taskbarHeight,
        fill: this._scene._gantt.barStyle.barColor,
        pickable: false
      });
      rect.name = 'task-bar-rect';
      barGroup.appendChild(rect);

      // 创建已完成部分任务条rect
      const progress_rect = createRect({
        x: 0,
        y: 0, //(this._scene._gantt.rowHeight - taskbarHeight) / 2,
        width: (taskBarSize * taskRecord[progressField]) / 100,
        height: taskbarHeight,
        fill: this._scene._gantt.barStyle.barColor2,
        pickable: false
      });
      barGroup.appendChild(progress_rect);
    }
  }
  setX(x: number) {
    this.barContainer.setAttribute('x', x);
  }
  setY(y: number) {
    this.barContainer.setAttribute('y', y);
  }
}
