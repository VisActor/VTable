{{ target: common-gantt-timeline-scale }}
Date scale configuration, corresponding type is ITimelineScale, specific configuration items are as follows:

${prefix} rowHeight(number)

Row height

Optional

${prefix} unit('day' | 'week' | 'month' | 'quarter' | 'year' | 'hour' | 'minute' | 'second')

Time unit

If the configured smallest time unit is `'day' | 'week' | 'month' | 'quarter' | 'year'`, the more standard date format in the record is `YYYY-MM-DD`, and if it is `'hour' |'minute' |'second'`, the standard date format is `YYYY-MM-DD HH:mm:ss`.

For example:

If the smallest time unit is `'hour'`, the task start time in the record is configured as: `'2024-11-09 05:00:00'`, and the end time is: `'2024-11-09 06:59:59'`, then the execution time of this task should be between 5 o'clock and 6 o'clock on `'2024-11-09'`.

If the smallest time unit is `'minute'`, then the task start time in the record is configured as: `'2024-11-09 05:10:00'`, and the end time is: `'2024-11-09 05:09:59'`, then the execution time of this task is 10 minutes.

It should be noted that: if the smallest time unit is `'hour' |'minute' |'second'`, the standard end time in the record is 59 minutes or 59 seconds.

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

${prefix} visible(boolean)

Whether to display the date scale, the default is displayed

Optional
