import type { Gantt } from './Gantt';
import type { IMarkLine, IScrollStyle, ITimelineScale } from './ts-types';

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
export function syncResizeStateFromTable(gantt: Gantt) {
  if (gantt.listTableInstance && gantt.options.taskTable?.width === 'auto') {
    gantt.listTableInstance.on('resize_column', (args: any) => {
      gantt.taskTableWidth = gantt.listTableInstance.getAllColsWidth() + gantt.listTableInstance.tableX * 2;
      gantt.element.style.left = gantt.taskTableWidth ? `${gantt.taskTableWidth}px` : '0px';
      gantt._resize();
    });
  }
}
export function syncEditCellFromTable(gantt: Gantt) {
  gantt.listTableInstance.on('change_cell_value', (args: any) => {
    const { col, row, rawValue, changedValue } = args;
    gantt.updateRecord(row - gantt.listTableInstance.columnHeaderLevelCount);
    // const record = gantt.getRecordByIndex(row - gantt.listTableInstance.columnHeaderLevelCount);
    // debugger;
  });
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
    gantt.options.frameStyle
  );
  gantt.markLine = generateMarkLine(gantt.options?.markLine);
  gantt.resizeLineStyle = {
    lineColor: gantt.options.resizeLineStyle?.lineColor ?? 'yellow',
    lineWidth: gantt.options.resizeLineStyle?.lineWidth ?? 2
  };
}

export function generateTimeLineDate(currentDate: Date, endDate: Date, scale: ITimelineScale) {
  const { unit, step, format } = scale;
  const timelineDates = [];
  while (currentDate <= endDate) {
    if (unit === 'day') {
      const dateEnd = new Date(currentDate.getTime() + step * 24 * 60 * 60 * 1000);
      const formattedDate = format({ dateIndex: currentDate.getDate(), dateStart: currentDate, dateEnd });
      const columnTitle = formattedDate || currentDate.getDate().toString();
      const dayCellConfig = {
        days: step,
        start: currentDate,
        end: dateEnd,
        title: columnTitle
      };
      timelineDates.push(dayCellConfig);
      currentDate.setDate(currentDate.getDate() + step);
    } else if (unit === 'month') {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const end = new Date(year, month + step - 1, 0);
      if (end.getTime() > endDate.getTime()) {
        end.setDate(endDate.getDate());
      }
      const start = currentDate;
      const formattedDate = format({ dateIndex: month, dateStart: start, dateEnd: end });
      const columnTitle = formattedDate || month;
      const dayCellConfig = {
        days: Math.ceil(Math.abs(end.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
        start,
        end,
        title: columnTitle
      };

      timelineDates.push(dayCellConfig);
      currentDate = new Date(year, currentDate.getMonth() + step, 1);
    } else if (unit === 'quarter') {
      const year = currentDate.getFullYear();
      const quarter = Math.floor(currentDate.getMonth() / 3 + 1);
      const end = new Date(year, (quarter + step - 1) * 3, 0);
      if (end.getTime() > endDate.getTime()) {
        end.setDate(endDate.getDate());
      }
      const start = currentDate;
      const formattedDate = format({ dateIndex: quarter, dateStart: start, dateEnd: end });
      const columnTitle = formattedDate || quarter;
      const dayCellConfig = {
        days: Math.ceil(Math.abs(end.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
        start,
        end,
        title: columnTitle
      };
      timelineDates.push(dayCellConfig);
      currentDate = new Date(year, (quarter + step - 1) * 3, 1);
    } else if (unit === 'year') {
      const year = currentDate.getFullYear();
      const end = new Date(year, 11, 31);
      if (end.getTime() > endDate.getTime()) {
        end.setDate(endDate.getDate());
      }
      const start = currentDate;
      const formattedDate = format({ dateIndex: year, dateStart: start, dateEnd: end });
      const columnTitle = formattedDate || year;
      const dayCellConfig = {
        days: Math.ceil(Math.abs(end.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
        start,
        end,
        title: columnTitle
      };
      timelineDates.push(dayCellConfig);
      currentDate = new Date(year + step, 0, 1);
    } else if (unit === 'week') {
      const startOfWeekSetting = scale.startOfWeek ?? 'monday';
      let dayOfWeek = currentDate.getDay(); // index从0开始
      if (startOfWeekSetting === 'monday') {
        dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Calculate the difference between the current day and the start of the week
      }
      const startOfWeek = new Date(currentDate);
      const endOfWeek = new Date(startOfWeek.getTime() + (6 - dayOfWeek) * 24 * 60 * 60 * 1000); // Calculate the end of the week

      if (endOfWeek > endDate) {
        endOfWeek.setDate(endDate.getDate());
      }

      // Calculate the week number within the year
      const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
      const weekNumber = Math.ceil(((startOfWeek.getTime() - startOfYear.getTime()) / 86400000 + 1) / 7);

      const columnTitle = format({ dateIndex: weekNumber, dateStart: startOfWeek, dateEnd: endOfWeek });

      const dayCellConfig = {
        days: Math.ceil((endOfWeek.getTime() - startOfWeek.getTime()) / (24 * 60 * 60 * 1000)) + 1,
        start: startOfWeek,
        end: endOfWeek,
        title: columnTitle
      };

      timelineDates.push(dayCellConfig);

      // Move currentDate to the next week
      currentDate.setDate(currentDate.getDate() + (7 - dayOfWeek));
    }
  }
  return timelineDates;
}
