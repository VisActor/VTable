import { createDateAtMidnight } from '../tools/util';
import { DayTimes } from '../gantt-helper';
//import type { IMarkLine } from '../ts-types';
import type { Scenegraph } from './scenegraph';
import { Group, createLine, Text } from '@visactor/vtable/es/vrender';

export class MarkLine {
  _scene: Scenegraph;
  group: Group;
  markLIneContainer: Group;
  markLineContainerWidth: number = 20;
  height: number;
  constructor(scene: Scenegraph) {
    this._scene = scene;
    this.height =
      Math.min(scene._gantt.tableNoFrameHeight, scene._gantt.drawHeight) - scene._gantt.getAllHeaderRowsHeight();
    this.group = new Group({
      x: 0,
      y: scene._gantt.getAllHeaderRowsHeight(),
      width: scene._gantt.tableNoFrameWidth,
      height: this.height,
      pickable: false,
      clip: true
    });
    this.group.name = 'mark-line-container';
    scene.ganttGroup.addChild(this.group);

    this.markLIneContainer = new Group({
      x: 0,
      y: 0,
      width: this._scene._gantt.getAllDateColsWidth(),
      height: this.height,
      pickable: false,
      clip: true
    });
    this.group.appendChild(this.markLIneContainer);
    this.initMarkLines();
  }
  initMarkLines() {
    //#region 重置markLine容器大小
    const height =
      Math.min(this._scene._gantt.tableNoFrameHeight, this._scene._gantt.drawHeight) -
      this._scene._gantt.getAllHeaderRowsHeight();
    this.group.setAttributes({
      y: this._scene._gantt.getAllHeaderRowsHeight(),
      width: this._scene._gantt.tableNoFrameWidth,
      height: height
    });
    this.markLIneContainer.setAttribute('width', this._scene._gantt.getAllDateColsWidth());
    this.markLIneContainer.setAttribute('height', height);
    //#endregion
    const markLine = this._scene._gantt.parsedOptions.markLine;
    const minDate = this._scene._gantt.parsedOptions.minDate;
    minDate &&
      markLine.forEach(line => {
        const style = line.style;
        const contentStyle = line.contentStyle || {};
        const date = this._scene._gantt.parsedOptions.timeScaleIncludeHour
          ? createDateAtMidnight(line.date)
          : createDateAtMidnight(line.date, true);
        const dateTime = date.getTime();
        const cellIndex = this._scene._gantt.getDateIndexByTime(dateTime);
        const cellStartX = cellIndex >= 1 ? this._scene._gantt.getDateColsWidth(0, cellIndex - 1) : 0;
        const cellWidth = this._scene._gantt.getDateColWidth(cellIndex);
        let dateX = cellStartX;
        if (line.position === 'date') {
          dateX = this._scene._gantt.getXByTime(dateTime);
        } else if (line.position === 'right') {
          dateX = cellStartX + cellWidth;
        } else if (line.position === 'middle') {
          dateX = cellStartX + cellWidth / 2;
        }
        const markLineGroup = new Group({
          pickable: false,
          x: dateX - this.markLineContainerWidth / 2,
          y: 0,
          width: this.markLineContainerWidth,
          height: this.height
        });
        markLineGroup.name = 'mark-line';
        this.markLIneContainer.appendChild(markLineGroup);
        // 创建整个任务条rect
        const lineObj = createLine({
          pickable: false,
          stroke: style.lineColor,
          lineWidth: style.lineWidth,
          lineDash: style.lineDash,
          points: [
            { x: this.markLineContainerWidth / 2, y: 0 },
            { x: this.markLineContainerWidth / 2, y: this.height }
          ]
        });
        markLineGroup.appendChild(lineObj);
        if (line.content) {
          const textMaxLineWidth = Math.max(this._scene._gantt.getDateColWidth(cellIndex), 1);
          const textContainerHeight = contentStyle.lineHeight || 18;
          // 创建内容区
          const textGroup = new Group({
            x: this.markLineContainerWidth / 2,
            y: 0,
            cursor: 'pointer',
            height: textContainerHeight,
            clip: false,
            fill: contentStyle.backgroundColor || style.lineColor,
            display: 'flex',
            cornerRadius: contentStyle.cornerRadius || [0, 2, 2, 0]
          });
          textGroup.name = 'mark-line-content';
          (textGroup as any).data = line;
          markLineGroup.appendChild(textGroup);
          // 创建内容
          const text = new Text({
            maxLineWidth: textMaxLineWidth,
            text: line.content,
            cursor: 'pointer',
            lineHeight: textContainerHeight,
            fontWeight: contentStyle.fontWeight || 'normal',
            fill: contentStyle.color || style.lineColor,
            fontSize: contentStyle.fontSize || 12,
            poptip: {
              position: 'top',
              dx: textMaxLineWidth / 4,
              dy: -textContainerHeight / 4
            }
          } as any);
          textGroup.appendChild(text);
        }
      });
  }

  /** 重新场景场景树节点 */
  refresh() {
    this.height =
      Math.min(this._scene._gantt.tableNoFrameHeight, this._scene._gantt.drawHeight) -
      this._scene._gantt.getAllHeaderRowsHeight();
    this.markLIneContainer.removeAllChild();
    this.group.setAttribute('height', this.height);
    this.markLIneContainer.setAttribute('height', this.height);
    this.initMarkLines();
  }
  setX(x: number) {
    this.markLIneContainer.setAttribute('x', x);
  }
}
