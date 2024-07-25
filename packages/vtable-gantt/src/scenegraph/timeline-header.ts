import type { Scenegraph } from './scenegraph';
import { Group, Text, createStage, vglobal, createRect, createLine } from '@visactor/vrender-core';
export class TimelineHeader {
  group: Group;
  constructor(scene: Scenegraph) {
    const dateHeader = new Group({
      x: 0,
      y: 0,
      width: scene._gantt.getAllColsWidth(), //width - 2,
      height: scene._gantt.headerRowHeight * scene._gantt.headerLevel,
      clip: true,
      pickable: false
      // fill: 'purple',
      // stroke: 'green',
      // lineWidth: 2
    });
    this.group = dateHeader;
    dateHeader.name = 'date-header-container';

    const y = 0;
    for (let i = 0; i < scene._gantt.headerLevel; i++) {
      const rowHeader = new Group({
        x: 0,
        y: scene._gantt.headerRowHeight * i,
        width: scene._gantt.getAllColsWidth(),
        height: scene._gantt.headerRowHeight,
        clip: false
      });
      rowHeader.name = 'row-header';
      dateHeader.addChild(rowHeader);

      const { unit, timelineDates } = scene._gantt.sortedScales[i];
      let x = 0;
      console.log(scene._gantt.timelineHeaderStyle?.borderWidth * 2);
      for (let j = 0; j < timelineDates.length; j++) {
        const date = new Group({
          x,
          y: 0,
          width: scene._gantt.colWidthPerDay * timelineDates[j].days,
          height: scene._gantt.headerRowHeight,
          clip: false,
          fill: scene._gantt.timelineHeaderStyle?.backgroundColor
        });
        date.name = 'date-cell';
        // const rect = createRect({
        //   x: 0,
        //   y: 0,
        //   width: scene._gantt.colWidthPerDay * timelineDates[j].days,
        //   height: scene._gantt.headerRowHeight,
        //   fill: scene._gantt.timelineHeaderStyle?.backgroundColor
        // });
        // date.appendChild(rect);

        if (j > 0) {
          const line = createLine({
            pickable: false,
            stroke: scene._gantt.timelineHeaderStyle?.borderColor,
            lineWidth: scene._gantt.timelineHeaderStyle?.borderWidth,
            points: [
              { x: scene._gantt.timelineHeaderStyle?.borderWidth & 1 ? 0.5 : 0, y: 0 },
              { x: scene._gantt.timelineHeaderStyle?.borderWidth & 1 ? 0.5 : 0, y: scene._gantt.headerRowHeight }
            ]
          });
          date.appendChild(line);
        }

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
      //创建表头分割线 水平分割线 TODO
      if (i > 0) {
        const line = createLine({
          pickable: false,
          stroke: scene._gantt.timelineHeaderStyle?.borderColor,
          lineWidth: scene._gantt.timelineHeaderStyle?.borderWidth,
          points: [
            { x: 0, y: scene._gantt.timelineHeaderStyle?.borderWidth & 1 ? 0.5 : 0 },
            { x: scene._gantt.getAllColsWidth(), y: scene._gantt.timelineHeaderStyle?.borderWidth & 1 ? 0.5 : 0 }
          ]
        });
        rowHeader.addChild(line);
      }
    }
  }
  setX(x: number) {
    this.group.setAttribute('x', x);
  }
  setY(y: number) {
    this.group.setAttribute('y', y);
  }
  resize() {
    this.group.setAttribute('width', this.group.attribute?.width ?? 0);
    this.group.setAttribute('height', this.group.attribute?.height ?? 0);
  }
}
