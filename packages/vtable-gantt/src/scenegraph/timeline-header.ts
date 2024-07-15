import type { Scenegraph } from './scenegraph';
import { Group, Text, createStage, vglobal, createRect } from '@visactor/vrender-core';
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
    (dateHeader as any).role = 'date-header';

    const y = 0;
    for (let i = 0; i < scene._gantt.headerLevel; i++) {
      const rowHeader = new Group({
        x: 0,
        y: scene._gantt.headerRowHeight * i,
        width: scene._gantt.getAllColsWidth(),
        height: scene._gantt.headerRowHeight,
        clip: true,
        pickable: false
        // fill: 'pink',
        // stroke: 'green',
        // lineWidth: 2
      });
      (rowHeader as any).role = 'row-header';
      dateHeader.addChild(rowHeader);

      //创建表头分割线 水平分割线 TODO

      const { unit, timelineDates } = scene._gantt.orderedScales[i];
      let x = 0;
      // debugger;
      // if (scene._gantt.timelineHeaderStyle?.borderWidth & 1) {
      //   x += 0.5;
      // }
      // x += scene._gantt.timelineHeaderStyle?.borderWidth / 2;
      console.log(scene._gantt.timelineHeaderStyle?.borderWidth * 2);
      for (let j = 0; j < timelineDates.length; j++) {
        const date = new Group({
          x,
          y: 0,
          width: scene._gantt.colWidthPerDay * timelineDates[j].days,
          height: scene._gantt.headerRowHeight,
          clip: true
        });
        (date as any).role = 'date-cell';
        // debugger;
        const rect = createRect({
          x: 0,
          y: 0,
          width: scene._gantt.colWidthPerDay * timelineDates[j].days,
          height: scene._gantt.headerRowHeight,
          fill: scene._gantt.timelineHeaderStyle?.backgroundColor
        });
        date.appendChild(rect);

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
    }
  }
  setX(x: number) {
    this.group.setAttribute('x', x);
    this.group.setAttribute('x', x);
  }
  setY(y: number) {
    this.group.setAttribute('y', y);
    this.group.setAttribute('y', y);
  }
}
