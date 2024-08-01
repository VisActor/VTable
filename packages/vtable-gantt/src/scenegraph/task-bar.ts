import { Group } from '@visactor/vrender-core';
import { createRect, createText } from '@visactor/vrender-core';
import type { Scenegraph } from './scenegraph';
import { Icon } from './icon';
import { parseStringTemplate, toBoxArray } from '../tools/util';
import { isValid } from '@visactor/vutils';
import { getTextPos } from '../gantt-helper';

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
  width: number;
  height: number;
  constructor(scene: Scenegraph) {
    this._scene = scene;
    // const height = Math.min(scene._gantt.tableNoFrameHeight, scene._gantt.drawHeight);
    this.width = scene._gantt.tableNoFrameWidth;
    this.height = scene._gantt.gridHeight;
    this.group = new Group({
      x: 0,
      y: scene._gantt.headerRowHeight * scene._gantt.headerLevel,
      width: this.width,
      height: this.height,
      pickable: false,
      clip: true
    });
    this.group.name = 'task-bar-container';
    scene.tableGroup.addChild(this.group);
    this.initBars();
    this.initHoverBarIcons();
  }

  initBars() {
    this.barContainer = new Group({
      x: 0,
      y: 0,
      width: this._scene._gantt.getAllColsWidth(),
      height: this._scene._gantt.getAllGridHeight(),
      pickable: false,
      clip: true
    });
    this.group.appendChild(this.barContainer);

    const taskBarCustomRender = this._scene._gantt.taskBarCustomRender;

    for (let i = 0; i < this._scene._gantt.itemCount; i++) {
      const { startDate, endDate, taskDays, progress, taskRecord } = this._scene._gantt.getTaskInfoByTaskListIndex(i);
      if (taskDays <= 0) {
        continue;
      }
      const taskBarSize = this._scene._gantt.colWidthPerDay * taskDays;
      const taskbarHeight = this._scene._gantt.taskBarStyle.width;
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
        cornerRadius: this._scene._gantt.taskBarStyle.cornerRadius,
        clip: true,
        cursor: 'grab'
      });
      barGroup.name = 'task-bar';
      this.barContainer.appendChild(barGroup);
      let rootContainer;
      let renderDefaultBar = true;
      let renderDefaultText = true;

      if (taskBarCustomRender) {
        let customRenderObj;
        if (typeof taskBarCustomRender === 'function') {
          const arg = {
            width: taskBarSize,
            height: taskbarHeight,
            index: i,
            startDate,
            endDate,
            taskDays,
            progress,
            taskRecord,
            ganttInstance: this._scene._gantt
          };
          customRenderObj = taskBarCustomRender(arg);
        } else {
          customRenderObj = taskBarCustomRender;
        }
        if (customRenderObj) {
          rootContainer = customRenderObj.rootContainer;
          renderDefaultBar = customRenderObj.renderDefaultBar ?? false;
          renderDefaultText = customRenderObj.renderDefaultText ?? false;
        }
      }

      if (renderDefaultBar) {
        // 创建整个任务条rect
        const rect = createRect({
          x: 0,
          y: 0, //this._scene._gantt.rowHeight - taskbarHeight) / 2,
          width: taskBarSize,
          height: taskbarHeight,
          fill: this._scene._gantt.taskBarStyle.barColor,
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
          fill: this._scene._gantt.taskBarStyle.completedBarColor,
          pickable: false
        });
        progress_rect.name = 'task-bar-progress-rect';
        barGroup.appendChild(progress_rect);
        barGroup.progressRect = progress_rect;
      }

      rootContainer && barGroup.appendChild(rootContainer);
      if (renderDefaultText) {
        const { textAlign, textBaseline, fontSize, fontFamily, textOverflow, color, padding } =
          this._scene._gantt.taskBarLabelStyle;
        const position = getTextPos(toBoxArray(padding), textAlign, textBaseline, taskBarSize, taskbarHeight);
        //创建label 文字
        const label = createText({
          // visible: false,
          pickable: false,
          x: position.x, //extAlign === 'center' ? taskBarSize / 2 : textAlign === 'left' ? 10 : taskBarSize - 10,
          y: position.y, //fontSize / 2,
          fontSize: fontSize, // 10
          fill: color,
          fontFamily: fontFamily,
          text: parseStringTemplate(this._scene._gantt.taskBarLabelText as string, taskRecord),
          maxLineWidth: taskBarSize - 20,
          textBaseline,
          textAlign,
          ellipsis:
            textOverflow === 'clip'
              ? ''
              : textOverflow === 'ellipsis'
              ? '...'
              : isValid(textOverflow)
              ? textOverflow
              : undefined
          // dx: 12 + 4,
          // dy: this._scene._gantt.barLabelStyle.fontSize / 2
        });
        barGroup.appendChild(label);
        barGroup.textLabel = label;
      }
    }
  }

  updateTaskBarNode(index: number) {
    const taskbarGroup = this.barContainer.getChildren()?.[index];
    if (taskbarGroup) {
      const { startDate, taskDays, progress, taskRecord } = this._scene._gantt.getTaskInfoByTaskListIndex(index);
      const taskBarSize = this._scene._gantt.colWidthPerDay * taskDays;
      const taskbarHeight = this._scene._gantt.taskBarStyle.width;
      const minDate = new Date(this._scene._gantt.minDate);
      taskbarGroup.setAttributes({
        x:
          this._scene._gantt.colWidthPerDay *
          Math.ceil(Math.abs(startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)),
        y: this._scene._gantt.rowHeight * index + (this._scene._gantt.rowHeight - taskbarHeight) / 2,
        width: taskBarSize
      });
      taskbarGroup.forEachChildren((childNode: any) => {
        if (childNode.type === 'rect' && childNode.name === 'task-bar-rect') {
          childNode.setAttributes({
            width: taskBarSize
          });
        } else if (childNode.type === 'rect' && childNode.name === 'task-bar-progress-rect') {
          childNode.setAttributes({
            width: (taskBarSize * progress) / 100
          });
        } else if (childNode.type === 'text') {
          childNode.setAttributes({
            x:
              this._scene._gantt.taskBarLabelStyle.textAlign === 'center'
                ? taskBarSize / 2
                : this._scene._gantt.taskBarLabelStyle.textAlign === 'left'
                ? 10
                : taskBarSize - 10,
            y: this._scene._gantt.taskBarLabelStyle.fontSize / 2,
            text: parseStringTemplate(this._scene._gantt.taskBarLabelText as string, taskRecord),
            maxLineWidth: taskBarSize - 20
          });
        }
      });
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
      cornerRadius: this._scene._gantt.taskBarStyle.cornerRadius,
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
  /** 重新创建任务条节点 */
  refreshItems() {
    this.height = this._scene._gantt.gridHeight;
    this.group.setAttribute('height', this.height);
    this.barContainer.removeAllChild();
    this.group.removeChild(this.barContainer);
    this.initBars();
  }
  resize() {
    this.width = this._scene._gantt.tableNoFrameWidth;
    this.height = this._scene._gantt.gridHeight;
    this.group.setAttribute('width', this.width);
    this.group.setAttribute('height', this.height);
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
