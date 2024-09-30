import { text } from 'stream/consumers';
import type { Gantt } from './Gantt';
import type { IMarkLine, IScrollStyle, ITimelineDateInfo, ITimelineScale } from './ts-types';
import { createDateAtMidnight, getWeekNumber } from './tools/util';

const isNode = typeof window === 'undefined' || typeof window.window === 'undefined';
export const DayTimes = 1000 * 60 * 60 * 24;
/** 通过事件坐标y计算鼠标当前所在所几条任务条上。y是相对于canvas的坐标值，vrender事件返回的e.offset.y */
export function getTaskIndexByY(y: number, gantt: Gantt) {
  const gridY = y - gantt.headerHeight;
  const taskBarHeight = gantt.stateManager.scroll.verticalBarPos + gridY;
  const taskBarIndex = Math.floor(taskBarHeight / gantt.parsedOptions.rowHeight);
  return taskBarIndex;
}
export function getDateIndexByX(x: number, gantt: Gantt) {
  const totalX = x + gantt.stateManager.scroll.horizontalBarPos;
  const dateIndex = Math.floor(totalX / gantt.parsedOptions.timelineColWidth);
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
  gantt.parsedOptions.pixelRatio = options?.pixelRatio ?? 1;
  gantt.parsedOptions.rowHeight = options?.rowHeight ?? 40;
  gantt.parsedOptions.timelineColWidth = options?.timelineHeader?.colWidth ?? 60;
  gantt.parsedOptions.startDateField = options.taskBar?.startDateField ?? 'startDate';
  gantt.parsedOptions.endDateField = options.taskBar?.endDateField ?? 'endDate';
  gantt.parsedOptions.progressField = options.taskBar?.progressField ?? 'progress';
  gantt.parsedOptions.minDate = options?.minDate ? createDateAtMidnight(options?.minDate) : undefined;
  gantt.parsedOptions.maxDate = options?.maxDate ? createDateAtMidnight(options?.maxDate) : undefined;

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
  gantt.parsedOptions.taskBarStyle = Object.assign(
    {},
    {
      barColor: 'blue',
      /** 已完成部分任务条的颜色 */
      completedBarColor: 'gray',
      /** 任务条的宽度 */
      width: (gantt.parsedOptions.rowHeight * 3) / 4,
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

  gantt.parsedOptions.dateFormat = options?.dateFormat;
  gantt.parsedOptions.taskBarHoverStyle = Object.assign(
    {
      barOverlayColor: 'rgba(99, 144, 0, 0.4)'
    },
    options?.taskBar?.hoverBarStyle
  );

  gantt.parsedOptions.taskBarSelectionStyle = Object.assign(
    {
      barOverlayColor: 'rgba(99, 144, 0, 0.4)'
    },
    options?.taskBar?.selectionBarStyle
  );
  gantt.parsedOptions.taskBarLabelText = options?.taskBar?.labelText ?? '';
  gantt.parsedOptions.taskBarMoveable = options?.taskBar?.moveable ?? true;
  gantt.parsedOptions.taskBarResizable = options?.taskBar?.resizable ?? true;
  // gantt.parsedOptions.taskBarHoverColor =
  //   options?.taskBar?.hoverColor === null ? 'rgba(0,0,0,0)' : options?.taskBar?.hoverColor ?? 'rgba(0,0,0,0.1)';
  gantt.parsedOptions.taskBarLabelStyle = {
    fontFamily: options?.taskBar?.labelTextStyle?.fontFamily ?? 'Arial',
    fontSize: options?.taskBar?.labelTextStyle?.fontSize ?? gantt.parsedOptions.rowHeight / 2,
    color: options?.taskBar?.labelTextStyle?.color ?? '#F01',
    textAlign: options?.taskBar?.labelTextStyle?.textAlign ?? 'left',
    textBaseline: options?.taskBar?.labelTextStyle?.textBaseline ?? 'middle',
    padding: options?.taskBar?.labelTextStyle?.padding ?? [0, 0, 0, 10],
    textOverflow: options?.taskBar?.labelTextStyle?.textOverflow
  };
  gantt.parsedOptions.taskBarCustomLayout = options?.taskBar?.customLayout;
  gantt.parsedOptions.taskBarCreatable = options?.taskBar?.scheduleCreatable ?? true;
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
      gantt.parsedOptions.scrollToMarkLineDate = createDateAtMidnight(
        gantt.parsedOptions.markLine?.find(item => item.scrollToMarkLine).date
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
}

export function generateTimeLineDate(currentDate: Date, endDate: Date, scale: ITimelineScale) {
  const { unit, step, format } = scale;
  const timelineDates: ITimelineDateInfo[] = [];
  while (currentDate <= endDate) {
    if (unit === 'day') {
      const dateEnd = createDateAtMidnight(currentDate.getTime() + step * 24 * 60 * 60 * 1000);
      const startDate = createDateAtMidnight(currentDate);
      const formattedDate = format?.({ dateIndex: currentDate.getDate(), startDate, endDate: dateEnd });
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
      const formattedDate = format?.({ dateIndex: month, startDate: start, endDate: end });
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
      const formattedDate = format?.({ dateIndex: quarter, startDate: start, endDate: end });
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
      const formattedDate = format?.({ dateIndex: year, startDate: start, endDate: end });
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
      const startOfWeek = createDateAtMidnight(currentDate);
      const endOfWeek = createDateAtMidnight(startOfWeek.getTime() + (6 - dayOfWeek) * 24 * 60 * 60 * 1000); // Calculate the end of the week

      if (endOfWeek > endDate) {
        endOfWeek.setDate(endDate.getDate());
      }

      // Calculate the week number within the year
      // const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
      // const weekNumber = Math.ceil(((startOfWeek.getTime() - startOfYear.getTime()) / 86400000 + 1) / 7);
      const weekNumber = getWeekNumber(startOfWeek);

      const columnTitle =
        format?.({ dateIndex: weekNumber, startDate: startOfWeek, endDate: endOfWeek }) || weekNumber.toString();

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

export function convertProgress(progress: number | string) {
  // 如果是字符串类型，去掉可能存在的百分号
  if (typeof progress === 'string') {
    progress = progress.replace('%', '');
    // 转换成数字类型
    progress = parseFloat(progress);
  }

  // 如果小于或等于1，说明是0.4这种情况，转换成百分比
  if (progress <= 1) {
    progress = progress * 100;
  }

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
