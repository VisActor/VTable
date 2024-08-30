{{ target: common-gantt-timeline-scale }}
Date scale configuration, corresponding type is ITimelineScale, specific configuration items are as follows:

${prefix} rowHeight(number)

Row height

Optional

${prefix} unit('day' | 'week' | 'month' | 'quarter' | 'year')

Time unit

${prefix} step(number)

Step size

${prefix} startOfWeek('sunday' | 'monday')

Specify whether the week starts on Sunday or Monday

Optional

${prefix} customLayout(IDateCustomLayout)

Custom layout rendering

Optional

{{ use: common-gantt-date-header-custom-layout }}

${prefix} style(ITimelineHeaderStyle)

Specify header text style

Optional

{{ use: common-gantt-timeline-header-style }}

${prefix} format((date: DateFormatArgumentType) => string)

Date formatting function.

Optional

Function parameters:

```
export type DateFormatArgumentType = {
  /** The index of the current date within the date scale. For example, in a quarterly date, the fourth quarter returns 4. */
  dateIndex: number;
  startDate: Date;
  endDate: Date;
};
```
