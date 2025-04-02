import { createRect, createArc, createPolygon } from '@src/vrender';

import type { Group, IFillType } from '@src/vrender';

import type { MarkCellStyle, MarkedPropertyDefine } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';

export function createMark(marked: MarkedPropertyDefine, cellGroup: Group, table: BaseTableAPI) {
  if (typeof marked === 'boolean') {
    // 默认是右上角显示个扇形
    const mark = createArc({
      x: cellGroup.attribute.width,
      y: 0,
      startAngle: Math.PI / 2,
      endAngle: Math.PI,
      outerRadius: 6,
      fill: '#3073F2',
      pickable: false
    });
    mark.name = 'mark';

    cellGroup.appendChild(mark);
  } else {
    const {
      bgColor = '#3073F2',
      shape = 'sector',
      position = 'right-top',
      size = 10,
      offset = 0
    } = marked as MarkCellStyle;
    let x;
    let y;
    let startAngle;
    let endAngle;
    let fill;
    let mark;

    if (shape === 'sector') {
      if (position === 'right-top') {
        x = cellGroup.attribute.width - offset;
        y = offset;
        startAngle = Math.PI / 2;
        endAngle = Math.PI;
      } else if (position === 'left-top') {
        x = offset;
        y = offset;
        startAngle = 0;
        endAngle = Math.PI / 2;
      } else if (position === 'right-bottom') {
        x = cellGroup.attribute.width - offset;
        y = cellGroup.attribute.height - offset;
        startAngle = Math.PI;
        endAngle = (Math.PI / 2) * 3;
      } else if (position === 'left-bottom') {
        x = offset;
        y = cellGroup.attribute.height - offset;
        startAngle = (Math.PI / 2) * 3;
        endAngle = Math.PI * 2;
      }

      fill = bgColor;
      mark = createArc({
        x,
        y,
        startAngle,
        endAngle,
        outerRadius: size,
        fill: fill as IFillType,
        pickable: false
      });
    } else if (shape === 'triangle') {
      let x2;
      let y2;
      let x3;
      let y3;
      if (position === 'right-top') {
        x = cellGroup.attribute.width - offset;
        y = offset;
        x2 = x - size;
        y2 = y;
        x3 = x;
        y3 = y + size;
      } else if (position === 'left-top') {
        x = offset;
        y = offset;
        x2 = x + size;
        y2 = y;
        x3 = x;
        y3 = y + size;
      } else if (position === 'right-bottom') {
        x = cellGroup.attribute.width - offset;
        y = cellGroup.attribute.height - offset;
        x2 = x - size;
        y2 = y;
        x3 = x;
        y3 = y - size;
      } else if (position === 'left-bottom') {
        x = offset;
        y = cellGroup.attribute.height - offset;
        x2 = x + size;
        y2 = y;
        x3 = x;
        y3 = y - size;
      }
      fill = bgColor;
      mark = createPolygon({
        points: [
          { x: x, y: y },
          { x: x2, y: y2 },
          { x: x3, y: y3 }
        ],
        fill: fill as IFillType,
        pickable: false
      });
    } else if (shape === 'rect') {
      if (position === 'right-top') {
        x = cellGroup.attribute.width - size - offset;
        y = offset;
      } else if (position === 'left-top') {
        x = offset;
        y = offset;
      } else if (position === 'right-bottom') {
        x = cellGroup.attribute.width - size - offset;
        y = cellGroup.attribute.height - size - offset;
      } else if (position === 'left-bottom') {
        x = offset;
        y = cellGroup.attribute.height - size - offset;
      }
      fill = bgColor;
      mark = createRect({
        x,
        y,
        width: size,
        height: size,
        fill: fill as IFillType,
        pickable: false
      });
    }
    mark.name = 'mark';
    cellGroup.appendChild(mark);
  }
}
