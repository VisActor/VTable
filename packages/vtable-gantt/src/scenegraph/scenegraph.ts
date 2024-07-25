import type { IRect, Stage } from '@visactor/vrender-core';
import { Group, Text, createStage, vglobal } from '@visactor/vrender-core';
import { Grid } from './grid';
import type { Gantt } from '../Gantt';
import { Env } from '../env';
import { ScrollBarComponent } from './scroll-bar';
import { bindScrollBarListener } from '../event/scroll';
import { TimelineHeader } from './timeline-header';
import { TaskBar } from './task-bar';
import { MarkLine } from './mark-line';
import type { TaskBarHoverIcon } from './task-bar-hover-icon';
import { FrameBorder, createFrameBorder } from './frame-border';

export class Scenegraph {
  dateStepWidth: number;
  rowHeight: number;
  _scales: {}[];
  timelineHeader: TimelineHeader;
  grid: Grid;
  taskBar: TaskBar;
  _gantt: Gantt;
  tableGroup: Group;
  scrollbarComponent: ScrollBarComponent;
  markLine: MarkLine;
  frameBorder: FrameBorder;
  taskBarHoverIcon: TaskBarHoverIcon;
  stage: Stage;
  constructor(gantt: Gantt) {
    this._gantt = gantt;

    let width;
    let height;
    if (Env.mode === 'node') {
      // vglobal.setEnv('node', gantt.options.modeParams);
      // width = table.canvasWidth;
      // height = table.canvasHeight;
    } else {
      vglobal.setEnv('browser');
      width = gantt.canvas.width;
      height = gantt.canvas.height;
    }
    this.stage = createStage({
      canvas: gantt.canvas,
      width,
      height,
      disableDirtyBounds: false,
      // background: gantt.theme.underlayBackgroundColor,
      // dpr: gantt.internalProps.pixelRatio,
      enableLayout: true,
      autoRender: false
      // afterRender: () => {
      // this._gantt.fireListeners('after_render', null);
      // }
    });

    this.stage.defaultLayer.setTheme({
      group: {
        boundsPadding: 0,
        strokeBoundsBuffer: 0,
        lineJoin: 'round'
      },
      text: {
        ignoreBuf: true
      }
    });
    initSceneGraph(this);
  }

  afterCreateSceneGraph() {
    this.scrollbarComponent.updateScrollBar();
    bindScrollBarListener(this._gantt.eventManager);
  }

  updateTableSize() {
    this.tableGroup.setAttributes({
      x: 0,
      y: this._gantt.tableY,
      width: this._gantt.tableNoFrameWidth,
      height: this._gantt.tableNoFrameHeight
    } as any);
    this.grid.resize();
    this.frameBorder.resize();
  }

  /**
   * @description: 绘制场景树
   * @param {any} element
   * @param {CellRange} visibleCoord
   * @return {*}
   */
  renderSceneGraph() {
    this.stage.render();
  }

  /**
   * @description: 触发下一帧渲染
   * @return {*}
   */
  updateNextFrame() {
    this.stage.renderNextFrame();
  }
  get width(): number {
    return this.tableGroup.attribute?.width ?? 0;
  }

  get height(): number {
    return this.tableGroup.attribute?.height ?? 0;
  }

  get x(): number {
    return this.tableGroup.attribute?.x ?? 0;
  }

  get y(): number {
    return this.tableGroup.attribute?.y ?? 0;
  }

  /**
   * @description: 设置表格的x位置，滚动中使用
   * @param {number} x
   * @return {*}
   */
  setX(x: number, isEnd = false) {
    this.timelineHeader.setX(x);
    this.grid.setX(x);
    this.taskBar.setX(x);
    this.markLine.setX(x);
    this.updateNextFrame();
    // this._gantt.scenegraph.proxy.setX(-x, isEnd);
  }

  /**
   * @description: 更新表格的y位置，滚动中使用
   * @param {number} y
   * @return {*}
   */
  setY(y: number, isEnd = false) {
    // this._gantt.scenegraph.proxy.setY(-y, isEnd);
    this.grid.setY(y);
    this.taskBar.setY(y);
    this.updateNextFrame();
  }

  setPixelRatio(pixelRatio: number) {
    // this.stage.setDpr(pixelRatio);
    // 这里因为本时刻部分节点有更新bounds标记，直接render回导致开启DirtyBounds，无法完整重绘画布；
    // 所以这里先关闭DirtyBounds，等待下一帧再开启
    this.stage.disableDirtyBounds();
    this.stage.window.setDpr(pixelRatio);
    this.stage.render();
    this.stage.enableDirtyBounds();
  }

  resize() {
    this.updateTableSize();
    // this.updateBorderSizeAndPosition();
    this.scrollbarComponent.updateScrollBar();
    this.updateNextFrame();
  }
}

export function initSceneGraph(scene: Scenegraph) {
  const width = scene._gantt.tableNoFrameWidth;
  const height = Math.min(scene._gantt.tableNoFrameHeight, scene._gantt.drawHeight);

  scene.tableGroup = new Group({
    x: 0,
    y: scene._gantt.tableY,
    width: width,
    height: height,
    clip: true,
    pickable: false
  });
  scene.stage.defaultLayer.add(scene.tableGroup);
  scene.tableGroup.name = 'table';
  // 初始化顶部时间线表头部分
  scene.timelineHeader = new TimelineHeader(scene);
  scene.tableGroup.addChild(scene.timelineHeader.group);
  // 初始化网格线组件
  scene.grid = new Grid(scene);
  scene.tableGroup.addChild(scene.grid.group);

  // 初始化任务条线组件
  scene.taskBar = new TaskBar(scene);
  scene.tableGroup.addChild(scene.taskBar.group);

  // 初始化标记线组件
  scene.markLine = new MarkLine(scene);
  scene.tableGroup.addChild(scene.markLine.group);

  scene.frameBorder = new FrameBorder(scene);

  // 初始化滚动条组件
  scene.scrollbarComponent = new ScrollBarComponent(scene._gantt);

  scene.stage.defaultLayer.addChild(scene.scrollbarComponent.hScrollBar);
  scene.stage.defaultLayer.addChild(scene.scrollbarComponent.vScrollBar);
}

export function createContainerGroup(width: number, height: number, clip?: boolean) {
  return new Group({
    x: 0,
    y: 0,
    width,
    height,
    clip: clip ?? false,
    pickable: true
  });
}
