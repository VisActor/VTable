import type { IRect, Stage } from '@visactor/vrender-core';
import { Group, Text, createStage, vglobal } from '@visactor/vrender-core';
import { GridComponent } from './grid-component';
import type { Gantt } from '../Gantt';
import { Env } from '../tools/env';
import { ScrollBarComponent } from './scrollbar';

export class Scenegraph {
  dateStepWidth: number;
  rowHeight: number;
  _scales: {}[];
  grid: GridComponent;
  dateHeader: Group;
  _gantt: any;
  tableGroup: Group;
  scrollbarComponent: ScrollBarComponent;
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
      autoRender: true
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
    this.stage.defaultLayer.add(this.tableGroup);
  }

  afterCreateSceneGraph() {
    this.scrollbarComponent.updateScrollBar();
  }

  // updateTableSize() {
  //   this.tableGroup.setAttributes({
  //     x: this._gantt.tableX,
  //     y: this._gantt.tableY,
  //     width: Math.min(
  //       this._gantt.tableNoFrameWidth,
  //       Math.max(
  //         this.colHeaderGroup.attribute.width,
  //         this.bodyGroup.attribute.width,
  //         this.bottomFrozenGroup.attribute.width,
  //         0
  //       ) +
  //         Math.max(
  //           this.cornerHeaderGroup.attribute.width,
  //           this.rowHeaderGroup.attribute.width,
  //           this.leftBottomCornerGroup.attribute.width,
  //           0
  //         ) +
  //         Math.max(
  //           this.rightTopCornerGroup.attribute.width,
  //           this.rightFrozenGroup.attribute.width,
  //           this.rightBottomCornerGroup.attribute.width,
  //           0
  //         )
  //     ),
  //     height: Math.min(
  //       this._gantt.tableNoFrameHeight,
  //       Math.max(
  //         this.colHeaderGroup.attribute.height,
  //         this.cornerHeaderGroup.attribute.height,
  //         this.rightTopCornerGroup.attribute.height,
  //         0
  //       ) +
  //         Math.max(
  //           this.rowHeaderGroup.attribute.height,
  //           this.bodyGroup.attribute.height,
  //           this.rightFrozenGroup.attribute.height,
  //           0
  //         ) +
  //         Math.max(
  //           this.leftBottomCornerGroup.attribute.height,
  //           this.bottomFrozenGroup.attribute.height,
  //           this.rightBottomCornerGroup.attribute.height,
  //           0
  //         )
  //     )
  //   } as any);

  //   if (this.tableGroup.border && this.tableGroup.border.type === 'rect') {
  //     if (this._gantt.theme.frameStyle?.innerBorder) {
  //       this.tableGroup.border.setAttributes({
  //         x: this._gantt.tableX + this.tableGroup.border.attribute.lineWidth / 2,
  //         y: this._gantt.tableY + this.tableGroup.border.attribute.lineWidth / 2,
  //         width: this.tableGroup.attribute.width - this.tableGroup.border.attribute.lineWidth,
  //         height: this.tableGroup.attribute.height - this.tableGroup.border.attribute.lineWidth
  //       });
  //     } else {
  //       this.tableGroup.border.setAttributes({
  //         x: this._gantt.tableX - this.tableGroup.border.attribute.lineWidth / 2,
  //         y: this._gantt.tableY - this.tableGroup.border.attribute.lineWidth / 2,
  //         width: this.tableGroup.attribute.width + this.tableGroup.border.attribute.lineWidth,
  //         height: this.tableGroup.attribute.height + this.tableGroup.border.attribute.lineWidth
  //       });
  //     }
  //   } else if (this.tableGroup.border && this.tableGroup.border.type === 'group') {
  //     if (this._gantt.theme.frameStyle?.innerBorder) {
  //       this.tableGroup.border.setAttributes({
  //         x: this._gantt.tableX + this.tableGroup.border.attribute.lineWidth / 2,
  //         y: this._gantt.tableY + this.tableGroup.border.attribute.lineWidth / 2,
  //         width: this.tableGroup.attribute.width - this.tableGroup.border.attribute.lineWidth,
  //         height: this.tableGroup.attribute.height - this.tableGroup.border.attribute.lineWidth
  //       });
  //       (this.tableGroup.border.firstChild as IRect)?.setAttributes({
  //         x: 0,
  //         y: 0,
  //         width: this.tableGroup.attribute.width - this.tableGroup.border.attribute.lineWidth,
  //         height: this.tableGroup.attribute.height - this.tableGroup.border.attribute.lineWidth
  //       });
  //     } else {
  //       this.tableGroup.border.setAttributes({
  //         x: this._gantt.tableX - this.tableGroup.border.attribute.lineWidth / 2,
  //         y: this._gantt.tableY - this.tableGroup.border.attribute.lineWidth / 2,
  //         width: this.tableGroup.attribute.width + this.tableGroup.border.attribute.lineWidth,
  //         height: this.tableGroup.attribute.height + this.tableGroup.border.attribute.lineWidth
  //       });
  //       (this.tableGroup.border.firstChild as IRect)?.setAttributes({
  //         x: this.tableGroup.border.attribute.lineWidth / 2,
  //         y: this.tableGroup.border.attribute.lineWidth / 2,
  //         width: this.tableGroup.attribute.width,
  //         height: this.tableGroup.attribute.height
  //       });
  //     }
  //   }
  // }

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
    // this._gantt.scenegraph.proxy.setX(-x, isEnd);
  }

  /**
   * @description: 更新表格的y位置，滚动中使用
   * @param {number} y
   * @return {*}
   */
  setY(y: number, isEnd = false) {
    // this._gantt.scenegraph.proxy.setY(-y, isEnd);
  }
}

export function initSceneGraph(scene: Scenegraph) {
  const width = scene._gantt.tableNoFrameWidth;
  const height = Math.min(scene._gantt.tableNoFrameHeight, scene._gantt.drawHeight);

  scene.tableGroup = new Group({
    x: 1,
    y: 1,
    width: width,
    height: height,
    clip: true,
    pickable: false,
    stroke: 'green',
    lineWidth: 2
    // fill: false
  });
  (scene.tableGroup as any).role = 'table';

  const dateHeader = new Group({
    x: 0,
    y: 0,
    width: width - 2,
    height: scene._gantt.headerRowHeight * scene._gantt.headerLevel,
    clip: true,
    pickable: true,
    fill: 'purple',
    stroke: 'green',
    lineWidth: 2
  });
  (dateHeader as any).role = 'date-header';
  scene.dateHeader = dateHeader;

  scene.tableGroup.addChild(dateHeader);

  const y = 0;
  for (let i = 0; i < scene._gantt.headerLevel; i++) {
    const rowHeader = new Group({
      x: 0,
      y: scene._gantt.headerRowHeight * i,
      width: width - 2,
      height: scene._gantt.headerRowHeight,
      clip: true,
      pickable: true,
      fill: 'pink',
      stroke: 'green',
      lineWidth: 2
    });
    (rowHeader as any).role = 'row-header';
    dateHeader.addChild(rowHeader);

    const { unit, timelineDates } = scene._gantt.orderedScales[i];
    let x = 0;

    for (let j = 0; j < timelineDates.length; j++) {
      const date = new Group({
        x,
        y: 0,
        width: scene._gantt.colWidthPerDay * timelineDates[j].days,
        height: scene._gantt.headerRowHeight,
        clip: true,
        pickable: true,
        fill: i === 1 ? 'yellow' : 'blue',
        stroke: 'green',
        lineWidth: 2
      });
      (date as any).role = 'date-cell';
      // debugger;
      const text = new Text({
        x: 0,
        y: 0,
        maxLineWidth: scene._gantt.colWidthPerDay * timelineDates[j].days,
        // width: scene._gantt.colWidthPerDay * timelineDates[j].days,
        heightLimit: scene._gantt.headerRowHeight,
        // clip: true,
        pickable: true,
        text: timelineDates[j].title.toLocaleString(),
        fontSize: 18,
        // textAlign: 'left',
        dx: 20,
        dy: 10,
        textBaseline: 'top',
        fill: 'white',
        stroke: 'green',
        lineWidth: 2
      });
      date.appendChild(text);
      rowHeader.addChild(date);
      x += scene._gantt.colWidthPerDay * timelineDates[j].days;
    }
    scene.grid = new GridComponent({
      vertical: true,
      horizontal: true,
      gridStyle: {
        stroke: 'red',
        lineWidth: 1
      },
      scrollLeft: 0,
      scrollTop: 0,
      x: 0,
      y: scene._gantt.headerRowHeight * scene._gantt.headerLevel,
      width: width - 2,
      height: height - scene._gantt.headerRowHeight * scene._gantt.headerLevel,
      timelineDates: scene._gantt.reverseOrderedScales[0].timelineDates,
      colWidthPerDay: scene._gantt.colWidthPerDay,
      rowHeight: scene._gantt.rowHeight,
      rowCount: scene._gantt.itemCount
    });
    scene.tableGroup.addChild(scene.grid.group);

    scene.scrollbarComponent = new ScrollBarComponent(scene._gantt);
    scene.stage.defaultLayer.addChild(scene.scrollbarComponent.hScrollBar);
    scene.stage.defaultLayer.addChild(scene.scrollbarComponent.vScrollBar);
  }
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
