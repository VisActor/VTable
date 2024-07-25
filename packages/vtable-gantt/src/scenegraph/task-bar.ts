import { Group } from '@visactor/vrender-core';
import { createRect, createText } from '@visactor/vrender-core';
import type { Scenegraph } from './scenegraph';
import { Icon } from './icon';
import { parseStringTemplate } from '../tools/util';

const TASKBAR_HOVER_ICON = `<svg width="100" height="200" xmlns="http://www.w3.org/2000/svg">
  <line x1="30" y1="10" x2="30" y2="190" stroke="black" stroke-width="4"/>
  <line x1="70" y1="10" x2="70" y2="190" stroke="black" stroke-width="4"/>
</svg>`;

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
    for (let i = 0; i < this._scene._gantt.itemCount; i++) {
      const { startDate, taskDays, progress, taskRecord } = this._scene._gantt.getTaskInfoByTaskListIndex(i);
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
        width: (taskBarSize * progress) / 100,
        height: taskbarHeight,
        fill: this._scene._gantt.barStyle.barColor2,
        pickable: false
      });
      barGroup.appendChild(progress_rect);
      barGroup.progressRect = progress_rect;
      //创建label 文字
      const label = createText({
        // visible: false,
        pickable: false,
        x:
          this._scene._gantt.barLabelStyle.textAlign === 'center'
            ? taskBarSize / 2
            : this._scene._gantt.barLabelStyle.textAlign === 'left'
            ? 10
            : taskBarSize - 10,
        y: this._scene._gantt.barLabelStyle.fontSize / 2,
        fontSize: this._scene._gantt.barLabelStyle.fontSize, // 10
        fill: this._scene._gantt.barLabelStyle.color,
        fontFamily: this._scene._gantt.barLabelStyle.fontFamily,
        text: parseStringTemplate(this._scene._gantt.barLabelText as string, taskRecord),
        maxLineWidth: taskBarSize - 20,
        textBaseline: 'middle',
        textAlign: this._scene._gantt.barLabelStyle.textAlign
        // dx: 12 + 4,
        // dy: this._scene._gantt.barLabelStyle.fontSize / 2
      });
      barGroup.appendChild(label);
      barGroup.textLabel = label;
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
      width: 10,
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
      width: 10,
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
    this.hoverBarLeftIcon.setAttribute('width', 10);
    this.hoverBarLeftIcon.setAttribute('height', 20);
    this.hoverBarRightIcon.setAttribute('x', width - 10);
    this.hoverBarRightIcon.setAttribute('y', 0);
    this.hoverBarRightIcon.setAttribute('width', 10);
    this.hoverBarRightIcon.setAttribute('height', 20);
  }
  hideHoverBar() {
    this.hoverBarGroup.setAttribute('visibleAll', false);
  }
}