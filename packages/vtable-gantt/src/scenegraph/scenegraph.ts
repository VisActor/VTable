import type { Stage } from '@visactor/vtable/es/vrender';
import { container, Group, vglobal, createStage } from '@visactor/vtable/es/vrender';
import { Grid } from './grid';
import type { Gantt } from '../Gantt';
import { Env } from '../env';
import { ScrollBarComponent } from './scroll-bar';
import { bindScrollBarListener } from '../event/scroll';
import { TimelineHeader } from './timeline-header';
import { TaskBar } from './task-bar';
import { MarkLine } from './mark-line';
import { FrameBorder } from './frame-border';
import { getTaskIndexByY } from '../gantt-helper';
import graphicContribution from './graphic';
container.load(graphicContribution);
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
  stage: Stage;
  tableGroupWidth: number;
  tableGroupHeight: number;
  constructor(gantt: Gantt) {
    this._gantt = gantt;
    this.tableGroupWidth = gantt.tableNoFrameWidth;
    this.tableGroupHeight = Math.min(gantt.tableNoFrameHeight, gantt.drawHeight);
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
      autoRender: false,
      context: {
        appName: 'vtable'
      },
      pluginList: ['poptipForText']
      // afterRender: () => {
      // this._gantt.fireListeners('after_render', null);
      // }
    });
    (this.stage as any).gantt = this._gantt;
    (this.stage as any).table = this._gantt; // 为了使用bindDebugTool
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
    this.initSceneGraph();
  }

  initSceneGraph() {
    const scene = this;

    scene.tableGroup = new Group({
      x: scene._gantt.tableX,
      y: scene._gantt.tableY,
      width: this.tableGroupWidth,
      height: this.tableGroupHeight,
      clip: true,
      pickable: false
    });
    scene.stage.defaultLayer.add(scene.tableGroup);
    scene.tableGroup.name = 'table';
    // 初始化顶部时间线表头部分
    scene.timelineHeader = new TimelineHeader(scene);

    // 初始化网格线组件
    scene.grid = new Grid(scene);

    // 初始化任务条线组件
    scene.taskBar = new TaskBar(scene);

    // 初始化标记线组件
    scene.markLine = new MarkLine(scene);

    // 初始化边框
    scene.frameBorder = new FrameBorder(scene);

    // 初始化滚动条组件
    scene.scrollbarComponent = new ScrollBarComponent(scene._gantt);
    scene.stage.defaultLayer.addChild(scene.scrollbarComponent.hScrollBar);
    scene.stage.defaultLayer.addChild(scene.scrollbarComponent.vScrollBar);
  }

  afterCreateSceneGraph() {
    this.scrollbarComponent.updateScrollBar();
    bindScrollBarListener(this._gantt.eventManager);
  }

  refreshAll() {
    this.tableGroupHeight = Math.min(this._gantt.tableNoFrameHeight, this._gantt.drawHeight);
    this.tableGroup.setAttribute('height', this.tableGroupHeight);
    this.timelineHeader.refresh();
    this.grid.refresh();
    this.taskBar.refresh();
    this.markLine.refresh();
    this.frameBorder.resize();
    this.scrollbarComponent.updateScrollBar();
    this.updateNextFrame();
  }

  refreshTaskBars() {
    // this.timelineHeader.refresh();
    // this.grid.refresh();
    this.taskBar.refresh();
    // this.markLine.refresh();
    // this.frameBorder.refresh();
    // this.scrollbarComponent.refresh();
    this.updateNextFrame();
  }
  refreshTaskBarsAndGrid() {
    this.tableGroupHeight = Math.min(this._gantt.tableNoFrameHeight, this._gantt.drawHeight);
    this.tableGroup.setAttribute('height', this.tableGroupHeight);
    // this.timelineHeader.refresh();
    this.grid.refresh();
    this.taskBar.refresh();
    this.markLine.refresh();
    this.frameBorder.resize();
    this.scrollbarComponent.updateScrollBar();
    this.updateNextFrame();
  }

  updateTableSize() {
    this.tableGroupHeight = Math.min(this._gantt.tableNoFrameHeight, this._gantt.drawHeight);
    this.tableGroup.setAttributes({
      x: this._gantt.tableX,
      y: this._gantt.tableY,
      width: this._gantt.tableNoFrameWidth,
      height: this.tableGroupHeight
    } as any);
    this.grid.resize();
    this.taskBar.resize();
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
  release() {
    this.stage.release();
  }
  getTaskBarNodeByY(y: number) {
    const taskIndex = getTaskIndexByY(y, this._gantt);
  }
}
