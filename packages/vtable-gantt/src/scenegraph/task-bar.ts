import { Group, createText, createRect, Image } from '@visactor/vtable/es/vrender';
import type { Scenegraph } from './scenegraph';
// import { Icon } from './icon';
import { createDateAtMidnight, parseStringTemplate, toBoxArray } from '../tools/util';
import { isValid } from '@visactor/vutils';
import { getTextPos } from '../gantt-helper';
import { GanttTaskBarNode } from './GanttNode';

const TASKBAR_HOVER_ICON = `<svg width="100" height="200" xmlns="http://www.w3.org/2000/svg">
  <line x1="30" y1="10" x2="30" y2="190" stroke="black" stroke-width="4"/>
  <line x1="70" y1="10" x2="70" y2="190" stroke="black" stroke-width="4"/>
</svg>`;
export const TASKBAR_HOVER_ICON_WIDTH = 10;

export class TaskBar {
  group: Group;
  barContainer: Group;
  hoverBarGroup: Group;
  hoverBarLeftIcon: Image;
  hoverBarRightIcon: Image;
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
      y: scene._gantt.getAllHeaderRowsHeight(),
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
      width: this._scene._gantt._getAllColsWidth(),
      height: this._scene._gantt.getAllTaskBarsHeight(),
      pickable: false,
      clip: true
    });
    this.group.appendChild(this.barContainer);

    for (let i = 0; i < this._scene._gantt.itemCount; i++) {
      const barGroup = this.initBar(i);
      if (barGroup) {
        this.barContainer.appendChild(barGroup);
      }
    }
  }
  initBar(index: number) {
    const taskBarCustomLayout = this._scene._gantt.parsedOptions.taskBarCustomLayout;
    const { startDate, endDate, taskDays, progress, taskRecord } = this._scene._gantt.getTaskInfoByTaskListIndex(index);
    if (taskDays <= 0 || !startDate || !endDate) {
      return null;
    }
    const taskBarSize = this._scene._gantt.parsedOptions.colWidthPerDay * taskDays;
    const taskbarHeight = this._scene._gantt.parsedOptions.taskBarStyle.width;
    const minDate = createDateAtMidnight(this._scene._gantt.parsedOptions.minDate);
    const barGroup = new GanttTaskBarNode({
      x:
        this._scene._gantt.parsedOptions.colWidthPerDay *
        Math.ceil(Math.abs(startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)),
      // y: this._scene._gantt.parsedOptions.rowHeight * i,
      y:
        this._scene._gantt.parsedOptions.rowHeight * index +
        (this._scene._gantt.parsedOptions.rowHeight - taskbarHeight) / 2,
      width: taskBarSize,
      // height: this._scene._gantt.parsedOptions.rowHeight,
      height: taskbarHeight,
      cornerRadius: this._scene._gantt.parsedOptions.taskBarStyle.cornerRadius,
      clip: true
    });
    barGroup.name = 'task-bar';
    // this.barContainer.appendChild(barGroup);
    let rootContainer;
    let renderDefaultBar = true;
    let renderDefaultText = true;

    if (taskBarCustomLayout) {
      let customLayoutObj;
      if (typeof taskBarCustomLayout === 'function') {
        const arg = {
          width: taskBarSize,
          height: taskbarHeight,
          index,
          startDate,
          endDate,
          taskDays,
          progress,
          taskRecord,
          ganttInstance: this._scene._gantt
        };
        customLayoutObj = taskBarCustomLayout(arg);
      } else {
        customLayoutObj = taskBarCustomLayout;
      }
      if (customLayoutObj) {
        // if (customLayoutObj.rootContainer) {
        //   customLayoutObj.rootContainer = decodeReactDom(customLayoutObj.rootContainer);
        // }
        rootContainer = customLayoutObj.rootContainer;
        renderDefaultBar = customLayoutObj.renderDefaultBar ?? false;
        renderDefaultText = customLayoutObj.renderDefaultText ?? false;
        rootContainer.name = 'task-bar-custom-render';
      }
    }

    if (renderDefaultBar) {
      // 创建整个任务条rect
      const rect = createRect({
        x: 0,
        y: 0, //this._scene._gantt.parsedOptions.rowHeight - taskbarHeight) / 2,
        width: taskBarSize,
        height: taskbarHeight,
        fill: this._scene._gantt.parsedOptions.taskBarStyle.barColor,
        pickable: false
      });
      rect.name = 'task-bar-rect';
      barGroup.appendChild(rect);
      barGroup.barRect = rect;
      // 创建已完成部分任务条rect
      const progress_rect = createRect({
        x: 0,
        y: 0, //(this._scene._gantt.parsedOptions.rowHeight - taskbarHeight) / 2,
        width: (taskBarSize * progress) / 100,
        height: taskbarHeight,
        fill: this._scene._gantt.parsedOptions.taskBarStyle.completedBarColor,
        pickable: false
      });
      progress_rect.name = 'task-bar-progress-rect';
      barGroup.appendChild(progress_rect);
      barGroup.progressRect = progress_rect;
    }

    rootContainer && barGroup.appendChild(rootContainer);
    if (renderDefaultText) {
      const { textAlign, textBaseline, fontSize, fontFamily, textOverflow, color, padding } =
        this._scene._gantt.parsedOptions.taskBarLabelStyle;
      const position = getTextPos(toBoxArray(padding), textAlign, textBaseline, taskBarSize, taskbarHeight);
      //创建label 文字
      const label = createText({
        // visible: false,
        // pickable: false,
        x: position.x, //extAlign === 'center' ? taskBarSize / 2 : textAlign === 'left' ? 10 : taskBarSize - 10,
        y: position.y, //fontSize / 2,
        fontSize: fontSize, // 10
        fill: color,
        fontFamily: fontFamily,
        text: parseStringTemplate(this._scene._gantt.parsedOptions.taskBarLabelText as string, taskRecord),
        maxLineWidth: taskBarSize - TASKBAR_HOVER_ICON_WIDTH,
        textBaseline,
        textAlign,
        ellipsis:
          textOverflow === 'clip'
            ? ''
            : textOverflow === 'ellipsis'
            ? '...'
            : isValid(textOverflow)
            ? textOverflow
            : undefined,
        poptip: {
          position: 'bottom',
          dx: (taskBarSize - TASKBAR_HOVER_ICON_WIDTH) / 4
        }
        // dx: 12 + 4,
        // dy: this._scene._gantt.barLabelStyle.fontSize / 2
      });
      barGroup.appendChild(label);
      barGroup.textLabel = label;
    }
    return barGroup;
  }
  updateTaskBarNode(index: number) {
    const taskbarGroup = this.barContainer.getChildren()?.[index] as GanttTaskBarNode;
    if (taskbarGroup) {
      this.barContainer.removeChild(taskbarGroup);
      const barGroup = this.initBar(index);
      if (barGroup) {
        this.barContainer.insertInto(barGroup, index); //TODO
      }
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
      cursor: this._scene._gantt.parsedOptions.taskBarMoveable ? 'grab' : 'default',
      pickable: false,
      cornerRadius:
        this._scene._gantt.parsedOptions.taskBarHoverStyle.cornerRadius ??
        this._scene._gantt.parsedOptions.taskBarStyle.cornerRadius ??
        0,
      fill: this._scene._gantt.parsedOptions.taskBarHoverStyle.barOverlayColor,
      visibleAll: false
    });
    this.hoverBarGroup = hoverBarGroup;
    hoverBarGroup.name = 'task-bar-hover-shadow';
    // this.barContainer.appendChild(hoverBarGroup);
    // 创建左侧的icon
    if (this._scene._gantt.parsedOptions.taskBarResizable) {
      const icon = new Image({
        x: 0,
        y: 0, //this._scene._gantt.parsedOptions.rowHeight - taskbarHeight) / 2,
        width: TASKBAR_HOVER_ICON_WIDTH,
        height: 20,
        image: TASKBAR_HOVER_ICON,
        pickable: true,
        cursor: 'col-resize'
      });
      icon.name = 'task-bar-hover-shadow-left-icon';
      this.hoverBarLeftIcon = icon;
      hoverBarGroup.appendChild(icon);

      // 创建右侧的icon
      const rightIcon = new Image({
        x: 0,
        y: 0, //this._scene._gantt.parsedOptions.rowHeight - taskbarHeight) / 2,
        width: TASKBAR_HOVER_ICON_WIDTH,
        height: 20,
        image: TASKBAR_HOVER_ICON,
        pickable: true,
        cursor: 'col-resize'
      });
      rightIcon.name = 'task-bar-hover-shadow-right-icon';
      this.hoverBarRightIcon = rightIcon;
      hoverBarGroup.appendChild(rightIcon);
    }
  }
  setX(x: number) {
    this.barContainer.setAttribute('x', x);
  }
  setY(y: number) {
    this.barContainer.setAttribute('y', y);
  }
  /** 重新创建任务条节点 */
  refresh() {
    this.width = this._scene._gantt.tableNoFrameWidth;
    this.height = this._scene._gantt.gridHeight;
    this.group.setAttributes({
      height: this.height,
      width: this.width,
      y: this._scene._gantt.getAllHeaderRowsHeight()
    });
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
    if (this.hoverBarLeftIcon) {
      this.hoverBarLeftIcon.setAttribute('x', 0);
      this.hoverBarLeftIcon.setAttribute('y', Math.ceil(height / 10));
      this.hoverBarLeftIcon.setAttribute('width', TASKBAR_HOVER_ICON_WIDTH);
      this.hoverBarLeftIcon.setAttribute('height', height - 2 * Math.ceil(height / 10));
      this.hoverBarRightIcon.setAttribute('x', width - TASKBAR_HOVER_ICON_WIDTH);
      this.hoverBarRightIcon.setAttribute('y', Math.ceil(height / 10));
      this.hoverBarRightIcon.setAttribute('width', TASKBAR_HOVER_ICON_WIDTH);
      this.hoverBarRightIcon.setAttribute('height', height - 2 * Math.ceil(height / 10));
    }
  }
  hideHoverBar() {
    this.hoverBarGroup.setAttribute('visibleAll', false);
  }
}
