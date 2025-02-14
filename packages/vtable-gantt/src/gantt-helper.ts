import { text } from 'stream/consumers';
import type { Gantt } from './Gantt';
import {
  TasksShowMode,
  type IMarkLine,
  type IScrollStyle,
  type ITimelineDateInfo,
  type ITimelineScale
} from './ts-types';
import {
  createDateAtLastHour,
  createDateAtLastMillisecond,
  createDateAtLastMinute,
  createDateAtLastSecond,
  createDateAtMidnight,
  getEndDateByTimeUnit,
  getStartDateByTimeUnit,
  getWeekNumber
} from './tools/util';
export const defaultTaskBarStyle = {
  barColor: 'blue',
  /** 已完成部分任务条的颜色 */
  completedBarColor: 'gray',
  /** 任务条的宽度 */
  width: 30,
  /** 任务条的圆角 */
  cornerRadius: 3,
  /** 任务条的边框 */
  borderWidth: 0,

  /** 边框颜色 */
  // borderColor: 'red',
  fontFamily: 'Arial',
  fontSize: 14
};
function setWidthToDefaultTaskBarStyle(width: number) {
  defaultTaskBarStyle.width = width;
}
const isNode = typeof window === 'undefined' || typeof window.window === 'undefined';
export const DayTimes = 1000 * 60 * 60 * 24;
export function getDateIndexByX(x: number, gantt: Gantt) {
  const totalX = x + gantt.stateManager.scroll.horizontalBarPos;
  const firstDateColWidth = gantt.getDateColWidth(0);
  const dateIndex = Math.floor((totalX - firstDateColWidth) / gantt.parsedOptions.timelineColWidth) + 1;
  return dateIndex;
}

export function generateMarkLine(markLine?: boolean | IMarkLine | IMarkLine[]): IMarkLine[] {
  if (!markLine) {
    return [];
  }
  if (markLine === true) {
    return [
      {
        date: createDateAtMidnight().toLocaleDateString(),
        scrollToMarkLine: true,
        position: 'left',
        style: {
          lineColor: 'red',
          lineWidth: 1
        }
      }
    ];
  } else if (Array.isArray(markLine)) {
    return markLine.map((item, index) => {
      return {
        date: item.date,
        scrollToMarkLine: item.scrollToMarkLine,
        position: item.position ?? 'left',
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
      scrollToMarkLine: (markLine as IMarkLine).scrollToMarkLine ?? true,
      position: (markLine as IMarkLine).position ?? 'left',
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
  gantt.parsedOptions.tasksShowMode = options?.tasksShowMode ?? TasksShowMode.Tasks_Separate;
  gantt.parsedOptions.pixelRatio = options?.pixelRatio ?? 1;
  gantt.parsedOptions.rowHeight = options?.rowHeight ?? 40;
  gantt.parsedOptions.timelineColWidth = options?.timelineHeader?.colWidth ?? 60;
  gantt.parsedOptions.startDateField = options.taskBar?.startDateField ?? 'startDate';
  gantt.parsedOptions.endDateField = options.taskBar?.endDateField ?? 'endDate';
  gantt.parsedOptions.progressField = options.taskBar?.progressField ?? 'progress';
  // gantt.parsedOptions.minDate = options?.minDate
  //   ? gantt.parsedOptions.timeScaleIncludeHour
  //     ? createDateAtMidnight(options.minDate)
  //     : createDateAtMidnight(options.minDate, true)
  //   : undefined;
  // gantt.parsedOptions.maxDate = options?.maxDate
  //   ? gantt.parsedOptions.timeScaleIncludeHour
  //     ? createDateAtLastHour(options.maxDate)
  //     : createDateAtLastHour(options.maxDate, true)
  //   : undefined;
  const { unit: minTimeUnit, startOfWeek, step } = gantt.parsedOptions.reverseSortedTimelineScales[0];
  gantt.parsedOptions.minDate = options?.minDate
    ? getStartDateByTimeUnit(new Date(options.minDate), minTimeUnit, startOfWeek)
    : undefined;
  gantt.parsedOptions.maxDate = options?.maxDate
    ? getEndDateByTimeUnit(gantt.parsedOptions.minDate, new Date(options.maxDate), minTimeUnit, step)
    : undefined;
  gantt.parsedOptions._minDateTime = gantt.parsedOptions.minDate?.getTime();
  gantt.parsedOptions._maxDateTime = gantt.parsedOptions.maxDate?.getTime();
  gantt.parsedOptions.overscrollBehavior = options?.overscrollBehavior ?? 'auto';
  gantt.parsedOptions.underlayBackgroundColor = options?.underlayBackgroundColor ?? '#FFF';
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

  gantt.parsedOptions.timelineHeaderHorizontalLineStyle = options?.timelineHeader?.horizontalLine;
  gantt.parsedOptions.timelineHeaderVerticalLineStyle = options?.timelineHeader?.verticalLine;
  gantt.parsedOptions.timelineHeaderBackgroundColor = options?.timelineHeader?.backgroundColor;
  gantt.parsedOptions.timeLineHeaderRowHeights = [];
  gantt.parsedOptions.timelineHeaderStyles = [];
  for (let i = 0; i < gantt.parsedOptions.sortedTimelineScales.length ?? 0; i++) {
    const style = gantt.parsedOptions.sortedTimelineScales[i].style;
    gantt.parsedOptions.timelineHeaderStyles.push(
      Object.assign(
        {
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          textBaseline: 'middle',
          color: '#000',
          backgroundColor: '#fff'
        },
        style
      )
    );

    gantt.parsedOptions.timeLineHeaderRowHeights.push(
      gantt.parsedOptions.sortedTimelineScales[i].rowHeight ?? options?.headerRowHeight ?? 40
    );
  }
  gantt.parsedOptions.grid = Object.assign(
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
    options?.grid
  );
  setWidthToDefaultTaskBarStyle((gantt.parsedOptions.rowHeight * 3) / 4);
  gantt.parsedOptions.taskBarStyle =
    options?.taskBar?.barStyle && typeof options?.taskBar?.barStyle === 'function'
      ? options.taskBar.barStyle
      : Object.assign({}, defaultTaskBarStyle, options?.taskBar?.barStyle);
  gantt.parsedOptions.taskBarMilestoneStyle = Object.assign(
    typeof gantt.parsedOptions.taskBarStyle === 'function'
      ? {}
      : {
          width: gantt.parsedOptions.taskBarStyle.width,
          borderColor: gantt.parsedOptions.taskBarStyle.borderColor,
          borderLineWidth: gantt.parsedOptions.taskBarStyle.borderLineWidth ?? 1,
          fillColor: gantt.parsedOptions.taskBarStyle.barColor,
          cornerRadius: 0
        },
    options?.taskBar?.milestoneStyle
  );
  gantt.parsedOptions.taskBarMilestoneHypotenuse = gantt.parsedOptions.taskBarMilestoneStyle.width * Math.sqrt(2);

  gantt.parsedOptions.dateFormat = options?.dateFormat;
  gantt.parsedOptions.taskBarHoverStyle = Object.assign(
    {
      barOverlayColor: 'rgba(99, 144, 0, 0.4)'
    },
    options?.taskBar?.hoverBarStyle
  );
  gantt.parsedOptions.taskBarSelectable = options?.taskBar?.selectable ?? true;
  gantt.parsedOptions.taskBarSelectedStyle = Object.assign(
    typeof gantt.parsedOptions.taskBarStyle === 'function'
      ? {
          shadowBlur: 6, //阴影宽度
          shadowOffsetX: 0, //x方向偏移
          shadowOffsetY: 0, //Y方向偏移
          borderLineWidth: 1 //边框宽度
        }
      : {
          shadowBlur: 6, //阴影宽度
          shadowOffsetX: 0, //x方向偏移
          shadowOffsetY: 0, //Y方向偏移
          shadowColor: gantt.parsedOptions.taskBarStyle.barColor, //阴影颜色
          borderColor: gantt.parsedOptions.taskBarStyle.barColor, //边框颜色
          borderLineWidth: 1 //边框宽度
        },
    options?.taskBar?.selectedBarStyle
  );
  gantt.parsedOptions.taskBarLabelText = options?.taskBar?.labelText ?? '';
  gantt.parsedOptions.taskBarMoveable = options?.taskBar?.moveable ?? true;
  gantt.parsedOptions.moveTaskBarToExtendDateRange = options?.taskBar?.moveToExtendDateRange ?? true;
  gantt.parsedOptions.taskBarResizable = options?.taskBar?.resizable ?? true;
  gantt.parsedOptions.taskBarDragOrder = options?.taskBar?.dragOrder ?? true;

  // gantt.parsedOptions.taskBarHoverColor =
  //   options?.taskBar?.hoverColor === null ? 'rgba(0,0,0,0)' : options?.taskBar?.hoverColor ?? 'rgba(0,0,0,0.1)';
  gantt.parsedOptions.taskBarLabelStyle = {
    fontFamily: options?.taskBar?.labelTextStyle?.fontFamily ?? 'Arial',
    fontSize: options?.taskBar?.labelTextStyle?.fontSize ?? 20,
    color: options?.taskBar?.labelTextStyle?.color ?? '#F01',
    textAlign: options?.taskBar?.labelTextStyle?.textAlign ?? 'left',
    textBaseline: options?.taskBar?.labelTextStyle?.textBaseline ?? 'middle',
    padding: options?.taskBar?.labelTextStyle?.padding ?? [0, 0, 0, 10],
    textOverflow: options?.taskBar?.labelTextStyle?.textOverflow
  };
  gantt.parsedOptions.taskBarCustomLayout = options?.taskBar?.customLayout;
  gantt.parsedOptions.taskBarCreatable =
    options?.taskBar?.scheduleCreatable ??
    !!(
      gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate ||
      gantt.parsedOptions.tasksShowMode === TasksShowMode.Tasks_Separate
    );
  gantt.parsedOptions.taskBarCreationButtonStyle = Object.assign(
    {
      lineColor: 'rgb(99, 144, 0)',
      lineWidth: 1,
      lineDash: [5, 5],
      cornerRadius: 4,
      backgroundColor: '#FFF'
    },
    options?.taskBar?.scheduleCreation?.buttonStyle
  );
  gantt.parsedOptions.taskBarCreationCustomLayout = options?.taskBar?.scheduleCreation?.customLayout;
  gantt.parsedOptions.taskBarCreationMaxWidth = options?.taskBar?.scheduleCreation?.maxWidth;
  gantt.parsedOptions.taskBarCreationMinWidth = options?.taskBar?.scheduleCreation?.minWidth;
  gantt.parsedOptions.outerFrameStyle = Object.assign(
    {
      borderColor: '#e1e4e8',
      borderLineWidth: 1,
      cornerRadius: 4
    },
    options.frame?.outerFrameStyle
  );
  gantt.parsedOptions.markLine = generateMarkLine(options?.markLine);
  if (gantt.parsedOptions.markLine?.length ?? 0) {
    if (gantt.parsedOptions.markLine?.every(item => item.scrollToMarkLine === undefined)) {
      gantt.parsedOptions.markLine[0].scrollToMarkLine = true;
    }
    if (gantt.parsedOptions.markLine?.find(item => item.scrollToMarkLine)) {
      gantt.parsedOptions.scrollToMarkLineDate = getStartDateByTimeUnit(
        new Date(gantt.parsedOptions.markLine?.find(item => item.scrollToMarkLine).date),
        minTimeUnit,
        startOfWeek
      );
    }
  }
  gantt.parsedOptions.verticalSplitLineHighlight = options.frame?.verticalSplitLineHighlight;

  gantt.parsedOptions.verticalSplitLine = Object.assign(
    {
      lineColor: gantt.parsedOptions.outerFrameStyle?.borderColor,
      lineWidth: gantt.parsedOptions.outerFrameStyle?.borderLineWidth
    },
    options.frame?.verticalSplitLine
  );
  gantt.parsedOptions.horizontalSplitLine = options.frame?.horizontalSplitLine;
  gantt.parsedOptions.verticalSplitLineMoveable = options.frame?.verticalSplitLineMoveable;

  gantt.parsedOptions.taskKeyField = options.taskKeyField ?? 'id';
  gantt.parsedOptions.dependencyLinks = options.dependency?.links ?? [];
  gantt.parsedOptions.dependencyLinkCreatable = options.dependency?.linkCreatable ?? false;
  gantt.parsedOptions.dependencyLinkSelectable = options.dependency?.linkSelectable ?? true;
  gantt.parsedOptions.dependencyLinkDeletable = options.dependency?.linkDeletable ?? false;
  gantt.parsedOptions.dependencyLinkLineStyle = Object.assign(
    {
      lineColor: 'red',
      lineWidth: 1
    },
    options.dependency?.linkLineStyle
  );

  gantt.parsedOptions.dependencyLinkSelectedLineStyle = Object.assign(
    {
      shadowBlur: 4, //阴影宽度
      shadowOffset: 0, //方向偏移
      shadowColor: gantt.parsedOptions.dependencyLinkLineStyle.lineColor, //阴影颜色
      lineColor: gantt.parsedOptions.dependencyLinkLineStyle.lineColor,
      lineWidth: gantt.parsedOptions.dependencyLinkLineStyle.lineWidth
    },
    options?.dependency?.linkSelectedLineStyle
  );

  gantt.parsedOptions.dependencyLinkLineCreatePointStyle = Object.assign(
    {
      strokeColor: 'red',
      fillColor: 'white',
      radius: 5,
      strokeWidth: 1
    },
    options?.dependency?.linkCreatePointStyle
  );
  gantt.parsedOptions.dependencyLinkLineCreatingPointStyle = Object.assign(
    {
      strokeColor: 'red',
      fillColor: 'red',
      radius: 5,
      strokeWidth: 1
    },
    options?.dependency?.linkCreatingPointStyle
  );
  gantt.parsedOptions.dependencyLinkLineCreatingStyle = Object.assign(
    {
      lineColor: 'red',
      lineWidth: 1,
      lineDash: [5, 5]
    },
    options?.dependency?.linkCreatingLineStyle
  );
  gantt.parsedOptions.eventOptions = options?.eventOptions;
  gantt.parsedOptions.keyboardOptions = options?.keyboardOptions;
}
export function updateOptionsWhenScaleChanged(gantt: Gantt) {
  const options = gantt.options;

  const { unit: minTimeUnit, startOfWeek, step } = gantt.parsedOptions.reverseSortedTimelineScales[0];
  gantt.parsedOptions.minDate = getStartDateByTimeUnit(new Date(gantt.parsedOptions.minDate), minTimeUnit, startOfWeek);
  gantt.parsedOptions.maxDate = getEndDateByTimeUnit(
    gantt.parsedOptions.minDate,
    new Date(gantt.parsedOptions.maxDate),
    minTimeUnit,
    step
  );
  gantt.parsedOptions._minDateTime = gantt.parsedOptions.minDate?.getTime();
  gantt.parsedOptions._maxDateTime = gantt.parsedOptions.maxDate?.getTime();
  gantt.parsedOptions.timeLineHeaderRowHeights = [];
  gantt.parsedOptions.timelineHeaderStyles = [];
  for (let i = 0; i < gantt.parsedOptions.sortedTimelineScales.length ?? 0; i++) {
    const style = gantt.parsedOptions.sortedTimelineScales[i].style;
    gantt.parsedOptions.timelineHeaderStyles.push(
      Object.assign(
        {
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          textBaseline: 'middle',
          color: '#000',
          backgroundColor: '#fff'
        },
        style
      )
    );

    gantt.parsedOptions.timeLineHeaderRowHeights.push(
      gantt.parsedOptions.sortedTimelineScales[i].rowHeight ?? options?.headerRowHeight ?? 40
    );
  }
}

export function generateTimeLineDate(currentDate: Date, endDate: Date, scale: ITimelineScale) {
  const { unit, step, format } = scale;
  const timelineDates: ITimelineDateInfo[] = [];
  while (currentDate < endDate) {
    if (unit === 'day') {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const day = currentDate.getDate();
      const end = createDateAtLastHour(new Date(year, month, day + step - 1), true);
      if (end.getTime() > endDate.getTime()) {
        end.setTime(endDate.getTime());
      }
      const start = currentDate;
      const formattedDate = format?.({ dateIndex: day, startDate: start, endDate: end });
      const columnTitle = formattedDate || day.toString();
      const dayCellConfig: ITimelineDateInfo = {
        days: Math.abs(end.getTime() - currentDate.getTime() + 1) / DayTimes,
        startDate: start,
        endDate: end,
        step,
        unit: 'day',
        title: columnTitle,
        dateIndex: day
      };
      timelineDates.push(dayCellConfig);
      // currentDate.setTime(createDateAtMidnight(currentDate.getTime() + step * 24 * 60 * 60 * 1000, true).getTime());
      currentDate = new Date(year, month, day + step);
    } else if (unit === 'month') {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth(); //index 从0 开始
      const end = createDateAtLastHour(new Date(year, month + step, 0), true);
      if (end.getTime() > endDate.getTime()) {
        end.setTime(endDate.getTime());
      }
      const start = currentDate;
      const formattedDate = format?.({ dateIndex: month + 1, startDate: start, endDate: end });
      const columnTitle = formattedDate || (month + 1).toString();
      const dayCellConfig: ITimelineDateInfo = {
        days: Math.abs(end.getTime() - currentDate.getTime() + 1) / DayTimes,
        startDate: start,
        step,
        unit: 'month',
        endDate: end,
        title: columnTitle,
        dateIndex: month + 1
      };

      timelineDates.push(dayCellConfig);
      currentDate = new Date(year, month + step, 1);
    } else if (unit === 'quarter') {
      const year = currentDate.getFullYear();
      const quarter = Math.floor(currentDate.getMonth() / 3); //quarter 从0 开始
      const end = createDateAtLastHour(new Date(year, (quarter + step) * 3, 0), true);
      if (end.getTime() > endDate.getTime()) {
        end.setTime(endDate.getTime());
      }
      const start = currentDate;
      const formattedDate = format?.({ dateIndex: quarter + 1, startDate: start, endDate: end });
      const columnTitle = formattedDate || (quarter + 1).toString();
      const dayCellConfig: ITimelineDateInfo = {
        days: Math.abs(end.getTime() - currentDate.getTime() + 1) / (1000 * 60 * 60 * 24),
        startDate: start,
        step,
        unit: 'quarter',
        endDate: end,
        title: columnTitle,
        dateIndex: quarter + 1
      };
      timelineDates.push(dayCellConfig);
      currentDate = new Date(year, (quarter + step) * 3, 1);
    } else if (unit === 'year') {
      const year = currentDate.getFullYear();
      const end = createDateAtLastHour(new Date(year + step - 1, 11, 31), true);
      if (end.getTime() > endDate.getTime()) {
        end.setTime(endDate.getTime());
      }
      const start = currentDate;
      const formattedDate = format?.({ dateIndex: year, startDate: start, endDate: end });
      const columnTitle = formattedDate || year.toString();
      const dayCellConfig: ITimelineDateInfo = {
        days: Math.abs(end.getTime() - currentDate.getTime() + 1) / DayTimes,
        startDate: start,
        endDate: end,
        step,
        unit: 'year',
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
      const startOfWeek = createDateAtMidnight(currentDate);
      // const endOfWeek = createDateAtLastHour(startOfWeek.getTime() + (6 - dayOfWeek) * 24 * 60 * 60 * 1000, true); // Calculate the end of the week
      const dateEnd = createDateAtLastHour(
        currentDate.getTime() + (7 * step - dayOfWeek) * 24 * 60 * 60 * 1000 - 1,
        true
      );
      if (dateEnd > endDate) {
        dateEnd.setTime(endDate.getTime());
      }

      // Calculate the week number within the year
      // const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
      // const weekNumber = Math.ceil(((startOfWeek.getTime() - startOfYear.getTime()) / 86400000 + 1) / 7);
      const weekNumber = getWeekNumber(startOfWeek);

      const columnTitle =
        format?.({ dateIndex: weekNumber, startDate: startOfWeek, endDate: dateEnd }) || weekNumber.toString();

      const dayCellConfig: ITimelineDateInfo = {
        days: (dateEnd.getTime() - startOfWeek.getTime() + 1) / DayTimes,
        // days: Math.abs(dateEnd.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
        startDate: startOfWeek,
        endDate: dateEnd,
        step,
        unit: 'week',
        title: columnTitle,
        dateIndex: weekNumber
      };

      timelineDates.push(dayCellConfig);

      // Move currentDate to the next week
      // currentDate.setDate(currentDate.getDate() + (7 - dayOfWeek));
      currentDate.setTime(
        createDateAtMidnight(currentDate.getTime() + (7 * step - dayOfWeek) * 24 * 60 * 60 * 1000, true).getTime()
      );
    } else if (unit === 'hour') {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const day = currentDate.getDate();
      const hour = currentDate.getHours();
      const end = createDateAtLastMinute(new Date(year, month, day, hour + step - 1), true);
      if (end.getTime() > endDate.getTime()) {
        end.setTime(endDate.getTime());
      }
      const start = currentDate;
      const formattedDate = format?.({ dateIndex: hour, startDate: start, endDate: end });
      const columnTitle = formattedDate || hour.toString();
      const dayCellConfig: ITimelineDateInfo = {
        days: Math.abs(end.getTime() - currentDate.getTime() + 1) / DayTimes,
        startDate: start,
        endDate: end,
        step,
        unit: 'hour',
        title: columnTitle,
        dateIndex: currentDate.getHours()
      };
      timelineDates.push(dayCellConfig);
      currentDate = new Date(year, month, day, hour + step);
    } else if (unit === 'minute') {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const day = currentDate.getDate();
      const hour = currentDate.getHours();
      const minute = currentDate.getMinutes();
      const end = createDateAtLastSecond(new Date(year, month, day, hour, minute + step - 1), true);
      if (end.getTime() > endDate.getTime()) {
        end.setTime(endDate.getTime());
      }
      const start = currentDate;
      const formattedDate = format?.({ dateIndex: minute, startDate: start, endDate: end });
      const columnTitle = formattedDate || minute.toString();
      const dayCellConfig: ITimelineDateInfo = {
        days: Math.abs(end.getTime() - currentDate.getTime() + 1) / DayTimes,
        startDate: start,
        endDate: end,
        step,
        unit: 'minute',
        title: columnTitle,
        dateIndex: currentDate.getMinutes()
      };
      timelineDates.push(dayCellConfig);
      currentDate = new Date(year, month, day, hour, minute + step);
    } else if (unit === 'second') {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const day = currentDate.getDate();
      const hour = currentDate.getHours();
      const minute = currentDate.getMinutes();
      const second = currentDate.getSeconds();
      const end = createDateAtLastMillisecond(new Date(year, month, day, hour, minute, second + step - 1), true);
      if (end.getTime() > endDate.getTime()) {
        end.setTime(endDate.getTime());
      }
      const start = currentDate;
      const formattedDate = format?.({ dateIndex: second, startDate: start, endDate: end });
      const columnTitle = formattedDate || second.toString();
      const dayCellConfig: ITimelineDateInfo = {
        days: Math.abs(end.getTime() - currentDate.getTime() + 1) / DayTimes,
        startDate: start,
        endDate: end,
        step,
        unit: 'second',
        title: columnTitle,
        dateIndex: currentDate.getSeconds()
      };
      timelineDates.push(dayCellConfig);
      currentDate = new Date(year, month, day, hour, minute, second + step);
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

export function convertProgress(progress: number | string) {
  // 如果是字符串类型，去掉可能存在的百分号
  if (typeof progress === 'string') {
    progress = progress.replace('%', '');
    // 转换成数字类型
    progress = parseFloat(progress);
  }

  // // 如果小于或等于1，说明是0.4这种情况，转换成百分比
  // if (progress <= 1) {
  //   progress = progress * 100;
  // }

  // 最后转换成整数
  return Math.round(progress);
}

export function createSplitLineAndResizeLine(gantt: Gantt) {
  // 注释掉水平分割线 改成用左侧表格的body frameStyle和右侧的grid绘制的表头底部线做分割线
  // if (gantt.parsedOptions.horizontalSplitLine) {
  //   gantt.horizontalSplitLine = document.createElement('div');
  //   gantt.horizontalSplitLine.style.position = 'absolute';
  //   gantt.horizontalSplitLine.style.top =
  //     gantt.getAllHeaderRowsHeight() + (gantt.parsedOptions.outerFrameStyle?.borderLineWidth ?? 0) + 'px';
  //   gantt.horizontalSplitLine.style.left = gantt.tableY + 'px';
  //   gantt.horizontalSplitLine.style.height = (gantt.parsedOptions.horizontalSplitLine.lineWidth ?? 2) + 'px';
  //   gantt.horizontalSplitLine.style.width =
  //     gantt.tableNoFrameWidth +
  //     (gantt.taskListTableInstance?.tableNoFrameWidth ?? 0) +
  //     +(gantt.taskListTableInstance ? gantt.parsedOptions.verticalSplitLine.lineWidth : 0) +
  //     'px'; //'100%';
  //   gantt.horizontalSplitLine.style.backgroundColor = gantt.parsedOptions.horizontalSplitLine.lineColor;
  //   gantt.horizontalSplitLine.style.zIndex = '100';
  //   gantt.horizontalSplitLine.style.userSelect = 'none';
  //   gantt.horizontalSplitLine.style.opacity = '1';
  //   (gantt.container as HTMLElement).appendChild(gantt.horizontalSplitLine);
  // }
  if (gantt.taskListTableInstance) {
    gantt.verticalSplitResizeLine = document.createElement('div');
    gantt.verticalSplitResizeLine.style.position = 'absolute';
    gantt.verticalSplitResizeLine.style.top = gantt.tableY + 'px';
    gantt.verticalSplitResizeLine.style.left =
      (gantt.taskTableWidth ? gantt.taskTableWidth - 7 + gantt.parsedOptions.verticalSplitLine.lineWidth / 2 : 0) +
      'px';
    gantt.verticalSplitResizeLine.style.width = '14px'; // 注意下面的14 和7 的地方 都是因为这里的宽度是 14
    gantt.verticalSplitResizeLine.style.height = gantt.drawHeight + 'px'; //'100%';
    gantt.verticalSplitResizeLine.style.backgroundColor = 'rgba(0,0,0,0)';
    gantt.verticalSplitResizeLine.style.zIndex = '100';
    gantt.parsedOptions.verticalSplitLineMoveable && (gantt.verticalSplitResizeLine.style.cursor = 'col-resize');
    gantt.verticalSplitResizeLine.style.userSelect = 'none';
    gantt.verticalSplitResizeLine.style.opacity = '1';

    const verticalSplitLine = document.createElement('div');
    verticalSplitLine.style.position = 'absolute';
    verticalSplitLine.style.top = '0px';
    verticalSplitLine.style.left = `${(14 - gantt.parsedOptions.verticalSplitLine.lineWidth) / 2}px`;
    verticalSplitLine.style.width = gantt.parsedOptions.verticalSplitLine.lineWidth + 'px';
    verticalSplitLine.style.height = '100%';
    verticalSplitLine.style.backgroundColor = gantt.parsedOptions.verticalSplitLine.lineColor;
    verticalSplitLine.style.zIndex = '100';
    verticalSplitLine.style.userSelect = 'none';
    verticalSplitLine.style.pointerEvents = 'none';
    // verticalSplitLine.style.opacity = '0';
    verticalSplitLine.style.transition = 'background-color 0.3s';
    gantt.verticalSplitResizeLine.appendChild(verticalSplitLine);

    if (gantt.parsedOptions.verticalSplitLineHighlight) {
      const highlightLine = document.createElement('div');
      highlightLine.style.position = 'absolute';
      highlightLine.style.top = '0px';
      highlightLine.style.left = `${(14 - gantt.parsedOptions.verticalSplitLineHighlight.lineWidth ?? 2) / 2}px`;
      highlightLine.style.width = (gantt.parsedOptions.verticalSplitLineHighlight.lineWidth ?? 2) + 'px';
      highlightLine.style.height = '100%';
      highlightLine.style.backgroundColor = gantt.parsedOptions.verticalSplitLineHighlight.lineColor;
      highlightLine.style.zIndex = '100';
      highlightLine.style.cursor = 'col-resize';
      highlightLine.style.userSelect = 'none';
      highlightLine.style.pointerEvents = 'none';
      highlightLine.style.opacity = '0';
      highlightLine.style.transition = 'background-color 0.3s';
      gantt.verticalSplitResizeLine.appendChild(highlightLine);
    }
    (gantt.container as HTMLElement).appendChild(gantt.verticalSplitResizeLine);
  }
}

export function updateSplitLineAndResizeLine(gantt: Gantt) {
  // if (gantt.horizontalSplitLine) {
  //   gantt.horizontalSplitLine.style.position = 'absolute';
  //   gantt.horizontalSplitLine.style.top = gantt.getAllHeaderRowsHeight() + 'px';
  //   gantt.horizontalSplitLine.style.left = gantt.tableY + 'px';
  //   gantt.horizontalSplitLine.style.height = (gantt.parsedOptions.horizontalSplitLine.lineWidth ?? 2) + 'px';
  //   gantt.horizontalSplitLine.style.width =
  //     gantt.tableNoFrameWidth +
  //     (gantt.taskListTableInstance?.tableNoFrameWidth ?? 0) +
  //     (gantt.taskListTableInstance ? gantt.parsedOptions.verticalSplitLine.lineWidth : 0) +
  //     'px'; //'100%';
  //   gantt.horizontalSplitLine.style.backgroundColor = gantt.parsedOptions.horizontalSplitLine.lineColor;
  //   gantt.horizontalSplitLine.style.zIndex = '100';
  //   gantt.horizontalSplitLine.style.userSelect = 'none';
  //   gantt.horizontalSplitLine.style.opacity = '1';
  // }
  if (gantt.verticalSplitResizeLine) {
    gantt.verticalSplitResizeLine.style.position = 'absolute';
    gantt.verticalSplitResizeLine.style.top = gantt.tableY + 'px';
    gantt.verticalSplitResizeLine.style.left = gantt.taskTableWidth
      ? `${gantt.taskTableWidth - 7 + gantt.parsedOptions.verticalSplitLine.lineWidth / 2}px`
      : '0px';
    gantt.verticalSplitResizeLine.style.width = '14px';
    gantt.verticalSplitResizeLine.style.height = gantt.drawHeight + 'px'; //'100%';
    gantt.verticalSplitResizeLine.style.backgroundColor = 'rgba(0,0,0,0)';
    gantt.verticalSplitResizeLine.style.zIndex = '100';
    gantt.parsedOptions.verticalSplitLineMoveable && (gantt.verticalSplitResizeLine.style.cursor = 'col-resize');
    gantt.verticalSplitResizeLine.style.userSelect = 'none';
    gantt.verticalSplitResizeLine.style.opacity = '1';

    const verticalSplitLine = gantt.verticalSplitResizeLine.childNodes[0] as HTMLDivElement;
    verticalSplitLine.style.position = 'absolute';
    verticalSplitLine.style.top = '0px';
    verticalSplitLine.style.left = `${(14 - gantt.parsedOptions.verticalSplitLine.lineWidth) / 2}px`;
    verticalSplitLine.style.width = gantt.parsedOptions.verticalSplitLine.lineWidth + 'px';
    verticalSplitLine.style.height = '100%';
    verticalSplitLine.style.backgroundColor = gantt.parsedOptions.verticalSplitLine.lineColor;
    verticalSplitLine.style.zIndex = '100';
    verticalSplitLine.style.userSelect = 'none';
    verticalSplitLine.style.pointerEvents = 'none';
    // verticalSplitLine.style.opacity = '0';
    verticalSplitLine.style.transition = 'background-color 0.3s';

    if (gantt.verticalSplitResizeLine.childNodes[1]) {
      const highlightLine = gantt.verticalSplitResizeLine.childNodes[1] as HTMLDivElement;
      highlightLine.style.position = 'absolute';
      highlightLine.style.top = '0px';
      highlightLine.style.left = `${(14 - gantt.parsedOptions.verticalSplitLineHighlight.lineWidth ?? 2) / 2}px`;
      highlightLine.style.width = (gantt.parsedOptions.verticalSplitLineHighlight.lineWidth ?? 2) + 'px';
      highlightLine.style.height = '100%';
      highlightLine.style.backgroundColor = gantt.parsedOptions.verticalSplitLineHighlight.lineColor;
      highlightLine.style.zIndex = '100';
      highlightLine.style.cursor = 'col-resize';
      highlightLine.style.userSelect = 'none';
      highlightLine.style.pointerEvents = 'none';
      highlightLine.style.opacity = '0';
      highlightLine.style.transition = 'background-color 0.3s';
    }
  }
}

export function findRecordByTaskKey(
  records: any[],
  taskKeyField: string,
  taskKey: string | number | (string | number)[],
  childrenField: string = 'children'
): { record: any; index: number[] } | undefined {
  for (let i = 0; i < records.length; i++) {
    if (
      (Array.isArray(taskKey) && taskKey.length === 1 && records[i][taskKeyField] === taskKey[0]) ||
      records[i][taskKeyField] === taskKey
    ) {
      return { record: records[i], index: [i] };
    } else if (records[i][childrenField]?.length) {
      if (Array.isArray(taskKey) && taskKey[0] === records[i][taskKeyField]) {
        const result: { record: any; index: number[] } | undefined = findRecordByTaskKey(
          records[i][childrenField],
          taskKeyField,
          taskKey.slice(1)
        );
        if (result) {
          result.index.unshift(i);
          return result;
        }
      } else if (!Array.isArray(taskKey)) {
        const result: { record: any; index: number[] } | undefined = findRecordByTaskKey(
          records[i][childrenField],
          taskKeyField,
          taskKey
        );
        if (result) {
          result.index.unshift(i);
          return result;
        }
      }
    }
  }
}

export function clearRecordLinkInfos(records: any[], childrenField: string = 'children') {
  for (let i = 0; i < records.length; i++) {
    if (records[i][childrenField]?.length) {
      clearRecordLinkInfos(records[i][childrenField], childrenField);
    } else {
      delete records[i].vtable_gantt_linkedTo;
      delete records[i].vtable_gantt_linkedFrom;
    }
  }
}

export function clearRecordShowIndex(records: any[], childrenField: string = 'children') {
  for (let i = 0; i < records.length; i++) {
    if (records[i][childrenField]?.length) {
      clearRecordShowIndex(records[i][childrenField], childrenField);
    } else {
      delete records[i].vtable_gantt_showIndex;
    }
  }
}
export function getTaskIndexsByTaskY(y: number, gantt: Gantt) {
  let task_index;
  let sub_task_index;
  if (gantt.taskListTableInstance) {
    const rowInfo = gantt.taskListTableInstance.getTargetRowAt(y + gantt.headerHeight);
    if (rowInfo) {
      const { row } = rowInfo;
      task_index = row - gantt.taskListTableInstance.columnHeaderLevelCount;
      const beforeRowsHeight = gantt.getRowsHeightByIndex(0, task_index - 1); // 耦合了listTableOption的customComputeRowHeight
      if (
        gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline ||
        gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange ||
        gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact ||
        gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate
      ) {
        sub_task_index = Math.floor((y - beforeRowsHeight) / gantt.parsedOptions.rowHeight);
      }
    }
  } else {
    task_index = Math.floor(y / gantt.parsedOptions.rowHeight);
  }
  return { task_index, sub_task_index };
}

export function computeRowsCountByRecordDateForCompact(gantt: Gantt, record: any) {
  if (!record.children || record.children.length === 1) {
    if (record.children?.length === 1) {
      record.children[0].vtable_gantt_showIndex = 0;
    } else {
      record.vtable_gantt_showIndex = 0;
    }
    return 1;
  }
  // 创建一个浅拷贝并排序子任务，根据开始日期排序
  const sortedChildren = record.children.slice().sort((a: any, b: any) => {
    const { startDate: aStartDate } = formatRecordDateConsiderHasHour(gantt, a);
    const { startDate: bStartDate } = formatRecordDateConsiderHasHour(gantt, b);
    return aStartDate.getTime() - bStartDate.getTime();
  });
  // 用于存储每一行的结束日期
  const rows = [];
  for (let i = 0; i <= sortedChildren.length - 1; i++) {
    const newRecord = sortedChildren[i];
    const { startDate, endDate } = formatRecordDateConsiderHasHour(gantt, newRecord);

    let placed = false;

    // 尝试将当前任务放入已有的行中
    for (let j = 0; j < rows.length; j++) {
      if (startDate.getTime() > rows[j]) {
        // 如果当前任务的开始日期在该行的结束日期之后，则可以放在这一行
        rows[j] = endDate.getTime();
        placed = true;
        newRecord.vtable_gantt_showIndex = j;
        break;
      }
    }

    // 如果不能放在已有的行中，则需要新开一行
    if (!placed) {
      rows.push(endDate.getTime());
      newRecord.vtable_gantt_showIndex = rows.length - 1;
    }
  }

  return rows.length;
}
// 检查两个日期范围是否重叠
function isOverlapping(startDate: Date, endDate: Date, rowTasks: any[], gantt: Gantt) {
  return rowTasks.some(rowTask => {
    const { startDate: startDate2, endDate: endDate2 } = formatRecordDateConsiderHasHour(gantt, rowTask);
    return startDate <= endDate2 && startDate2 <= endDate;
  });
}
export function computeRowsCountByRecordDate(gantt: Gantt, record: any) {
  if (!record.children || record.children.length === 1) {
    if (record.children?.length === 1) {
      record.children[0].vtable_gantt_showIndex = 0;
    } else {
      record.vtable_gantt_showIndex = 0;
    }
    return 1;
  }

  // 用于存储每一行的结束日期
  const rows = [];
  for (let i = 0; i <= record.children.length - 1; i++) {
    const newRecord = record.children[i];
    const { startDate, endDate } = formatRecordDateConsiderHasHour(gantt, newRecord);
    let placed = false;
    // 尝试将当前任务放入已有的行中
    for (let j = 0; j < rows.length; j++) {
      const rowTasks = record.children.filter((t: any) => t !== newRecord && t.vtable_gantt_showIndex === j);
      if (!isOverlapping(startDate, endDate, rowTasks, gantt)) {
        // 如果当前任务的开始日期在该行的结束日期之后，则可以放在这一行
        rows[j] = endDate.getTime();
        placed = true;
        newRecord.vtable_gantt_showIndex = j;
        break;
      }
    }

    // 如果不能放在已有的行中，则需要新开一行
    if (!placed) {
      rows.push(endDate.getTime());
      newRecord.vtable_gantt_showIndex = rows.length - 1;
    }
  }

  return rows.length;
}
export function getSubTaskRowIndexByRecordDate(
  record: any,
  childIndex: number,
  startDateField: string,
  endDateField: string
) {
  if (childIndex === 0) {
    return 0;
  }
  // 排序在datasource中已经排过了
  //  创建一个浅拷贝并排序子任务，根据开始日期排序
  // const sortedChildren = record.children.slice().sort((a: any, b: any) => {
  //   return createDateAtMidnight(a[startDateField]).getTime() - createDateAtMidnight(b[startDateField]).getTime();
  // });

  // 用于存储每一行的结束日期
  const rows = [];
  if (record?.children) {
    for (let i = 0; i <= record.children.length - 1; i++) {
      const newRecord = record.children[i];
      const startDate = createDateAtMidnight(newRecord[startDateField]).getTime();
      const endDate = createDateAtMidnight(newRecord[endDateField]).getTime();

      let placed = false;

      // 尝试将当前任务放入已有的行中
      for (let j = 0; j < rows.length; j++) {
        if (startDate > rows[j]) {
          // 如果当前任务的开始日期在该行的结束日期之后，则可以放在这一行
          rows[j] = endDate;
          placed = true;
          if (i === childIndex) {
            return j;
          }
          break;
        }
      }
      // 如果不能放在已有的行中，则需要新开一行
      if (!placed) {
        rows.push(endDate);
      }
      if (i === childIndex) {
        return rows.length - 1;
      }
    }
  }

  return 0;
}

/**
 * 获取指定index处任务数据的具体信息
 * @param index
 * @returns 当前任务信息
 */
export function formatRecordDateConsiderHasHour(
  gantt: Gantt,
  record: any
): {
  startDate: Date;
  endDate: Date;
} {
  const { timeScaleIncludeHour, startDateField, endDateField } = gantt.parsedOptions;
  const startDate = record[startDateField];
  const endDate = record[endDateField];
  if (timeScaleIncludeHour) {
    return { startDate: createDateAtMidnight(startDate), endDate: createDateAtLastHour(endDate) };
  }
  return { startDate: createDateAtMidnight(startDate, true), endDate: createDateAtLastHour(endDate, true) };
}

export function updateOptionsWhenRecordChanged(gantt: Gantt) {
  const options = gantt.options;
  const { unit: minTimeUnit, startOfWeek } = gantt.parsedOptions.reverseSortedTimelineScales[0];
  gantt.parsedOptions.markLine = generateMarkLine(options?.markLine);
  if (gantt.parsedOptions.markLine?.length ?? 0) {
    if (gantt.parsedOptions.markLine?.every(item => item.scrollToMarkLine === undefined)) {
      gantt.parsedOptions.markLine[0].scrollToMarkLine = true;
    }
    if (gantt.parsedOptions.markLine?.find(item => item.scrollToMarkLine)) {
      gantt.parsedOptions.scrollToMarkLineDate = getStartDateByTimeUnit(
        new Date(gantt.parsedOptions.markLine?.find(item => item.scrollToMarkLine).date),
        minTimeUnit,
        startOfWeek
      );
    }
  }
  gantt.parsedOptions.dependencyLinks = options.dependency?.links;
}

export function updateOptionsWhenDateRangeChanged(gantt: Gantt) {
  const options = gantt.options;
  const { unit: minTimeUnit, startOfWeek, step } = gantt.parsedOptions.reverseSortedTimelineScales[0];
  gantt.parsedOptions.minDate = options?.minDate
    ? getStartDateByTimeUnit(new Date(options.minDate), minTimeUnit, startOfWeek)
    : undefined;
  gantt.parsedOptions.maxDate = options?.maxDate
    ? getEndDateByTimeUnit(gantt.parsedOptions.minDate, new Date(options.maxDate), minTimeUnit, step)
    : undefined;
  gantt.parsedOptions._minDateTime = gantt.parsedOptions.minDate?.getTime();
  gantt.parsedOptions._maxDateTime = gantt.parsedOptions.maxDate?.getTime();
}

export function updateOptionsWhenMarkLineChanged(gantt: Gantt) {
  const options = gantt.options;
  gantt.parsedOptions.markLine = generateMarkLine(options?.markLine);
}

/**
 * 获取指定坐标处任务数据的具体信息
 * @param eventX
 * @param eventY
 * @returns 当前任务信息
 */
export function _getTaskInfoByXYForCreateSchedule(eventX: number, eventY: number, gantt: Gantt) {
  const taskIndex = getTaskIndexsByTaskY(eventY - gantt.headerHeight + gantt.stateManager.scrollTop, gantt);
  const recordParent = gantt.getRecordByIndex(taskIndex.task_index);
  const dateIndex = getDateIndexByX(eventX, gantt);
  const dateRange = gantt.getDateRangeByIndex(dateIndex);
  if (recordParent?.children) {
    const taskIndex = getTaskIndexsByTaskY(eventY - gantt.headerHeight + gantt.stateManager.scrollTop, gantt);
    for (let i = 0; i < recordParent.children.length; i++) {
      const { startDate, endDate, taskDays, progress, taskRecord } = gantt.getTaskInfoByTaskListIndex(
        taskIndex.task_index,
        i
      );
      if (
        ((gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact ||
          gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange) &&
          taskRecord.vtable_gantt_showIndex === taskIndex.sub_task_index) ||
        gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline
      ) {
        if (dateRange.startDate.getTime() >= startDate.getTime() && dateRange.endDate.getTime() <= endDate.getTime()) {
          return { startDate, endDate, taskDays, progress, taskRecord };
        }
      }
    }
  }
}
