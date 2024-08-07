import { text } from 'stream/consumers';
import type { Gantt } from './Gantt';
import type { IMarkLine, IScrollStyle, ITimelineDateInfo, ITimelineScale } from './ts-types';
import { getWeekNumber } from './tools/util';

const isNode = typeof window === 'undefined' || typeof window.window === 'undefined';
export const DayTimes = 1000 * 60 * 60 * 24;
/** 通过事件坐标y计算鼠标当前所在所几条任务条上 */
export function getTaskIndexByY(y: number, gantt: Gantt) {
  const gridY = y - gantt.headerHeight;
  const taskBarHeight = gantt.stateManager.scroll.verticalBarPos + gridY;
  const taskBarIndex = Math.floor(taskBarHeight / gantt.parsedOptions.rowHeight);
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

export { isNode };

export function initOptions(gantt: Gantt) {
  const options = gantt.options;
  gantt.parsedOptions.pixelRatio = options?.pixelRatio ?? 1;
  gantt.parsedOptions.headerRowHeight = options?.defaultHeaderRowHeight ?? 40;
  gantt.parsedOptions.rowHeight = options?.defaultRowHeight ?? 40;
  gantt.parsedOptions.timelineColWidth = options?.timelineColWidth ?? 60;
  gantt.parsedOptions.startDateField = options?.startDateField ?? 'startDate';
  gantt.parsedOptions.endDateField = options?.endDateField ?? 'endDate';
  gantt.parsedOptions.progressField = options?.progressField ?? 'progress';
  gantt.parsedOptions.minDate = options?.minDate ? new Date(options?.minDate) : undefined;
  gantt.parsedOptions.maxDate = options?.maxDate ? new Date(options?.maxDate) : undefined;
  gantt.parsedOptions._minDateTime = gantt.parsedOptions.minDate?.getTime();
  gantt.parsedOptions._maxDateTime = gantt.parsedOptions.maxDate?.getTime();
  gantt.parsedOptions.overscrollBehavior = options?.overscrollBehavior ?? 'auto';
  gantt.parsedOptions.scrollStyle = Object.assign(
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
    options?.scrollStyle
  );
  gantt.parsedOptions.timelineHeaderStyle = Object.assign(
    {},
    {
      borderColor: 'gray',
      borderWidth: 1,
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      textBaseline: 'middle',
      color: '#000',
      backgroundColor: '#fff'
    },
    options?.timelineHeaderStyle
  );
  gantt.parsedOptions.gridStyle = Object.assign(
    {},
    // {
    //   backgroundColor: '#fff',
    //   vertical: {
    //     lineColor: 'red',
    //     lineWidth: 1
    //   },
    //   horizontal: {
    //     lineColor: 'blue',
    //     lineWidth: 1
    //   }
    // },
    options?.gridStyle
  );
  gantt.parsedOptions.taskBarStyle = Object.assign(
    {},
    {
      barColor: 'blue',
      /** 已完成部分任务条的颜色 */
      completedBarColor: 'gray',
      /** 任务条的宽度 */
      width: gantt.parsedOptions.rowHeight,
      /** 任务条的圆角 */
      cornerRadius: 3,
      /** 任务条的边框 */
      borderWidth: 1,
      /** 边框颜色 */
      borderColor: 'red',
      fontFamily: 'Arial',
      fontSize: 14
    },
    options?.taskBar?.barStyle
  );
  gantt.parsedOptions.taskBarLabelText = options?.taskBar?.labelText ?? '';
  gantt.parsedOptions.taskBarMoveable = options?.taskBar?.moveable ?? true;
  gantt.parsedOptions.taskBarResizable = options?.taskBar?.resizable ?? true;
  gantt.parsedOptions.taskBarHoverColor =
    options?.taskBar?.hoverColor === null ? 'rgba(0,0,0,0)' : options?.taskBar?.hoverColor ?? 'rgba(0,0,0,0.1)';
  gantt.parsedOptions.taskBarLabelStyle = {
    fontFamily: options?.taskBar?.labelTextStyle.fontFamily ?? 'Arial',
    fontSize: options?.taskBar?.labelTextStyle.fontSize ?? gantt.parsedOptions.rowHeight,
    color: options?.taskBar?.labelTextStyle.color ?? '#F01',
    textAlign: options?.taskBar?.labelTextStyle.textAlign ?? 'left',
    textBaseline: options?.taskBar?.labelTextStyle.textBaseline ?? 'middle',
    padding: options?.taskBar?.labelTextStyle.padding ?? 0,
    textOverflow: options?.taskBar?.labelTextStyle.textOverflow
  };
  gantt.parsedOptions.taskBarCustomLayout = options?.taskBar?.customLayout;

  gantt.parsedOptions.frameStyle = Object.assign(
    {},
    {
      borderColor: 'gray',
      borderLineWidth: [1, 1, 1, 1],
      cornerRadius: 4
    },
    options.frameStyle
  );
  gantt.parsedOptions.markLine = generateMarkLine(options?.markLine);
  gantt.parsedOptions.resizeLineStyle = {
    lineColor: options.resizeLineStyle?.lineColor ?? 'yellow',
    lineWidth: options.resizeLineStyle?.lineWidth ?? 2
  };
}

export function generateTimeLineDate(currentDate: Date, endDate: Date, scale: ITimelineScale) {
  const { unit, step, format } = scale;
  const timelineDates: ITimelineDateInfo[] = [];
  while (currentDate <= endDate) {
    if (unit === 'day') {
      const dateEnd = new Date(currentDate.getTime() + step * 24 * 60 * 60 * 1000);
      const startDate = new Date(currentDate);
      const formattedDate = format?.({ index: currentDate.getDate(), startDate, endDate: dateEnd });
      const columnTitle = formattedDate || currentDate.getDate().toString();
      const dayCellConfig = {
        days: step,
        startDate,
        endDate: dateEnd,
        title: columnTitle,
        dateIndex: currentDate.getDate()
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
      const formattedDate = format?.({ index: month, startDate: start, endDate: end });
      const columnTitle = formattedDate || month.toString();
      const dayCellConfig = {
        days: Math.ceil(Math.abs(end.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
        startDate: start,
        endDate: end,
        title: columnTitle,
        dateIndex: month
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
      const formattedDate = format?.({ index: quarter, startDate: start, endDate: end });
      const columnTitle = formattedDate || quarter.toString();
      const dayCellConfig = {
        days: Math.ceil(Math.abs(end.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
        startDate: start,
        endDate: end,
        title: columnTitle,
        dateIndex: quarter
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
      const formattedDate = format?.({ index: year, startDate: start, endDate: end });
      const columnTitle = formattedDate || year.toString();
      const dayCellConfig = {
        days: Math.ceil(Math.abs(end.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
        startDate: start,
        endDate: end,
        title: columnTitle,
        dateIndex: year
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
      // const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
      // const weekNumber = Math.ceil(((startOfWeek.getTime() - startOfYear.getTime()) / 86400000 + 1) / 7);
      const weekNumber = getWeekNumber(startOfWeek);

      const columnTitle =
        format?.({ index: weekNumber, startDate: startOfWeek, endDate: endOfWeek }) || weekNumber.toString();

      const dayCellConfig = {
        days: Math.ceil((endOfWeek.getTime() - startOfWeek.getTime()) / (24 * 60 * 60 * 1000)) + 1,
        startDate: startOfWeek,
        endDate: endOfWeek,
        title: columnTitle,
        dateIndex: weekNumber
      };

      timelineDates.push(dayCellConfig);

      // Move currentDate to the next week
      currentDate.setDate(currentDate.getDate() + (7 - dayOfWeek));
    }
  }
  return timelineDates;
}

/**
 * @description: 获取对应样式和容器尺寸下的文字位置
 * @return {*}
 */
export function getTextPos(
  padding: number[],
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline,
  width: number,
  height: number
) {
  let textX = padding[3] ?? 10;
  if (textAlign === 'right' || textAlign === 'end') {
    textX = width - 0 - (padding[1] ?? 10);
  } else if (textAlign === 'center') {
    textX = 0 + (width - 0 + (padding[3] ?? 10) - (padding[1] ?? 10)) / 2;
  }
  let textY = 0 + (padding[0] ?? 10);
  if (textBaseline === 'bottom' || textBaseline === 'alphabetic' || textBaseline === 'ideographic') {
    textY = height - 0 - (padding[2] ?? 10);
  } else if (textBaseline === 'middle') {
    textY = 0 + (height - 0 - (padding[0] ?? 10) - (padding[2] ?? 10)) / 2 + (padding[0] ?? 10);
  }

  return {
    x: textX,
    y: textY
  };
}
