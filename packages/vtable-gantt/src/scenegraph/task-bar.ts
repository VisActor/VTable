import { Group } from '@visactor/vrender-core';
import { createRect } from '@visactor/vrender-core';
import type { Scenegraph } from './scenegraph';
import { Icon } from './icon';

const TASKBAR_HOVER_ICON =
  '<svg t="1721370852076" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7166" width="200" height="200"><path d="M320 864c-17.67 0-32-14.31-32-32V192c0-17.67 14.33-32 32-32s32 14.33 32 32v640c0 17.69-14.33 32-32 32zM704 864c-17.69 0-32-14.31-32-32V192c0-17.67 14.31-32 32-32s32 14.33 32 32v640c0 17.69-14.31 32-32 32z" fill="#333333" p-id="7167"></path></svg>';

export class TaskBar {
  group: Group;
  barContainer: Group;
  hoverBarGroup: Group;
  hoverBarLeftIcon: Icon;
  hoverBarRightIcon: Icon;
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
    this.initHoverBarIcons();
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
        clip: true,
        cursor: 'grab'
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
      barGroup.barRect = rect;
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
      barGroup.progressRect = progress_rect;
    }
  }

  initHoverBarIcons() {
    // const target = this._scene._gantt.stateManager.hoverTaskBar.target;

    // const barGroup = new Group({
    //   x: target.attribute.x,
    //   y: target.attribute.y,
    //   width: target.attribute.width,
    //   height: target.attribute.height,
    //   cornerRadius: target.attribute.cornerRadius,
    //   clip: true,
    //   cursor: 'grab'
    // });
    const hoverBarGroup = new Group({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      clip: true,
      cursor: 'grab',
      cornerRadius: this._scene._gantt.barStyle.cornerRadius,
      fill: 'rgba(0,0,0,0.2)',
      visibleAll: false
    });
    this.hoverBarGroup = hoverBarGroup;
    hoverBarGroup.name = 'task-bar-hover-shadow';
    // this.barContainer.appendChild(hoverBarGroup);
    // 创建左侧的icon
    const icon = new Icon({
      x: 0,
      y: 0, //this._scene._gantt.rowHeight - taskbarHeight) / 2,
      width: 20,
      height: 20,
      image: TASKBAR_HOVER_ICON,
      pickable: true,
      cursor: 'col-resize'
    });
    icon.name = 'task-bar-hover-shadow-left-icon';
    this.hoverBarLeftIcon = icon;
    hoverBarGroup.appendChild(icon);

    // 创建右侧的icon
    const rightIcon = new Icon({
      x: 0,
      y: 0, //this._scene._gantt.rowHeight - taskbarHeight) / 2,
      width: 20,
      height: 20,
      image: TASKBAR_HOVER_ICON,
      pickable: true,
      cursor: 'col-resize'
    });
    rightIcon.name = 'task-bar-hover-shadow-right-icon';
    this.hoverBarRightIcon = rightIcon;
    hoverBarGroup.appendChild(rightIcon);
  }
  setX(x: number) {
    this.barContainer.setAttribute('x', x);
  }
  setY(y: number) {
    this.barContainer.setAttribute('y', y);
  }

  showHoverBar(x: number, y: number, width: number, height: number, target?: Group) {
    if (target && target.name === 'task-bar') {
      // this.hoverBarGroup.releatedTaskBar = target;
      target.appendChild(this.hoverBarGroup);
    }
    this.hoverBarGroup.setAttribute('x', 0);
    this.hoverBarGroup.setAttribute('y', 0);
    this.hoverBarGroup.setAttribute('width', width);
    this.hoverBarGroup.setAttribute('height', height);
    this.hoverBarGroup.setAttribute('visibleAll', true);
    this.hoverBarLeftIcon.setAttribute('x', 0);
    this.hoverBarLeftIcon.setAttribute('y', 0);
    this.hoverBarLeftIcon.setAttribute('width', 20);
    this.hoverBarLeftIcon.setAttribute('height', 20);
    this.hoverBarRightIcon.setAttribute('x', width - 20);
    this.hoverBarRightIcon.setAttribute('y', 0);
    this.hoverBarRightIcon.setAttribute('width', 20);
    this.hoverBarRightIcon.setAttribute('height', 20);
  }
  hideHoverBar() {
    this.hoverBarGroup.setAttribute('visibleAll', false);
  }
}
