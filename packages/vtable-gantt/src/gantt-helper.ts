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

export function initOptions(gantt: Gantt) {
  gantt.scrollStyle = Object.assign(
    {},
    {
      scrollRailColor: 'rgba(100, 100, 100, 0.2)',
      scrollSliderColor: 'rgba(100, 100, 100, 0.5)',
      scrollSliderCornerRadius: 4,
      width: 10,
      visible: 'always',
      hoverOn: true,
      barToSide: false
    },
    gantt.options?.scrollStyle
  );
  gantt.timelineHeaderStyle = Object.assign(
    {},
    {
      borderColor: 'gray',
      borderWidth: 1,
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000',
      backgroundColor: '#fff'
    },
    gantt.options?.timelineHeaderStyle
  );
  gantt.gridStyle = Object.assign(
    {},
    {
      backgroundColor: '#fff',
      vertical: {
        lineColor: 'red',
        lineWidth: 1
      },
      horizontal: {
        lineColor: 'blue',
        lineWidth: 1
      }
    },
    gantt.options?.gridStyle
  );
  gantt.barStyle = Object.assign(
    {},
    {
      barColor: 'blue',
      /** 已完成部分任务条的颜色 */
      barColor2: 'gray',
      /** 任务条的宽度 */
      width: gantt.rowHeight,
      /** 任务条的圆角 */
      cornerRadius: 3,
      /** 任务条的边框 */
      borderWidth: 1,
      /** 边框颜色 */
      borderColor: 'red',
      fontFamily: 'Arial',
      fontSize: 14
    },
    gantt.options?.taskBar?.barStyle
  );
  gantt.barLabelText = gantt.options?.taskBar?.labelText ?? '';
  gantt.barLabelStyle = {
    fontFamily: gantt.options?.taskBar?.labelTextStyle.fontFamily ?? 'Arial',
    fontSize: gantt.options?.taskBar?.labelTextStyle.fontSize ?? gantt.rowHeight,
    color: gantt.options?.taskBar?.labelTextStyle.color ?? '#F01',
    textAlign: gantt.options?.taskBar?.labelTextStyle.textAlign ?? 'left'
  };
  gantt.frameStyle = Object.assign(
    {},
    {
      borderColor: 'gray',
      borderLineWidth: [1, 1, 1, 1],
      cornerRadius: 4
    },
    gantt.options?.frameStyle
  );
  gantt.markLine = generateMarkLine(gantt.options?.markLine);
}
