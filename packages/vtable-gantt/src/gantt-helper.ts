import type { Gantt } from './Gantt';
import type { IMarkLine, IScrollStyle } from './ts-types';

import { parsePadding } from '@src/vrender';
import { isArray, isNumber, isString } from '@visactor/vutils';
const isNode = typeof window === 'undefined' || typeof window.window === 'undefined';
export const DayTimes = 1000 * 60 * 60 * 24;
/** 通过事件坐标y计算鼠标当前所在所几条任务条上 */
export function getTaskIndexByY(y: number, gantt: Gantt) {
  const gridY = y - gantt.headerHeight;
  const taskBarHeight = gantt.stateManager.scroll.verticalBarPos + gridY;
  const taskBarIndex = Math.floor(taskBarHeight / gantt.rowHeight);
  return taskBarIndex;
}

export function generateMarkLine(markLine?: boolean | IMarkLine | IMarkLine[]) {
  if (!markLine) {
    return [];
  }
  if (markLine === true) {
    return [
      {
        date: new Date().toLocaleDateString(),
        style: {
          lineColor: 'red',
          lineWidth: 1
        }
      }
    ];
  } else if (Array.isArray(markLine)) {
    return markLine.map(item => {
      return {
        date: item.date,
        style: {
          lineColor: item.style?.lineColor || 'red',
          lineWidth: item.style?.lineWidth || 1,
          lineDash: item.style?.lineDash
        }
      };
    });
  }
  return [
    {
      date: (markLine as IMarkLine).date,
      style: {
        lineColor: (markLine as IMarkLine).style?.lineColor || 'red',
        lineWidth: (markLine as IMarkLine).style?.lineWidth || 1,
        lineDash: (markLine as IMarkLine).style?.lineDash
      }
    }
  ];
}

export function syncScrollStateToTable(gantt: Gantt) {
  const { scroll } = gantt.stateManager;
  const { verticalBarPos } = scroll;
  gantt.listTableInstance.stateManager.setScrollTop(verticalBarPos, false);
}

export function syncScrollStateFromTable(gantt: Gantt) {
  if (gantt.listTableInstance) {
    gantt.listTableInstance.on('scroll', (args: any) => {
      if (args.scrollDirection === 'vertical') {
        const { scroll } = gantt.listTableInstance.stateManager;
        const { verticalBarPos } = scroll;
        gantt.stateManager.setScrollTop(verticalBarPos, false);
      }
    });
  }
}

export function getHorizontalScrollBarSize(scrollStyle?: IScrollStyle): number {
  if (
    scrollStyle?.hoverOn ||
    (scrollStyle?.horizontalVisible && scrollStyle?.horizontalVisible === 'none') ||
    (!scrollStyle?.horizontalVisible && scrollStyle?.visible === 'none')
  ) {
    return 0;
  }
  return scrollStyle?.width ?? 7;
}

export function getVerticalScrollBarSize(scrollStyle?: IScrollStyle): number {
  if (
    scrollStyle?.hoverOn ||
    (scrollStyle?.verticalVisible && scrollStyle?.verticalVisible === 'none') ||
    (!scrollStyle?.verticalVisible && scrollStyle?.visible === 'none')
  ) {
    return 0;
  }
  return scrollStyle?.width ?? 7;
}

// 复制文件 https://github.com/VisActor/VTable/blob/develop/packages/vtable/src/scenegraph/utils/padding.ts
export function getQuadProps(
  paddingOrigin: number | string | number[] | { left?: number; right?: number; top?: number; bottom?: number }
): [number, number, number, number] {
  if (isNumber(paddingOrigin) || isString(paddingOrigin) || isArray(paddingOrigin)) {
    let padding = parsePadding(paddingOrigin as number);
    if (typeof padding === 'number' || typeof padding === 'string') {
      padding = [padding, padding, padding, padding];
    } else if (Array.isArray(padding)) {
      padding = padding.slice(0) as any;
    }
    return padding as any;
  } else if (
    paddingOrigin &&
    (isFinite(paddingOrigin.bottom) ||
      isFinite(paddingOrigin.left) ||
      isFinite(paddingOrigin.right) ||
      isFinite(paddingOrigin.top))
  ) {
    return [paddingOrigin.top ?? 0, paddingOrigin.right ?? 0, paddingOrigin.bottom ?? 0, paddingOrigin.left ?? 0];
  }
  return [0, 0, 0, 0];
}
export { isNode };
