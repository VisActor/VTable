{{ target: common-gantt-timeline-scale }}
日期刻度配置，对应的类型为 ITimelineScale，具体配置项如下：

${prefix} rowHeight(number)

行高

非必填

${prefix} unit('day' | 'week' | 'month' | 'quarter' | 'year' | 'hour' | 'minute' | 'second')

时间单位

如果配置的最小的时间单位是`'day' | 'week' | 'month' | 'quarter' | 'year'`，record 中比较规范的是日期格式为`YYYY-MM-DD`，如果是`'hour' |'minute' |'second'`，则规范日期格式为`YYYY-MM-DD HH:mm:ss`。

举例：

如最小的时间单位是`'hour' `，record 中的任务开始时间配置为：`'2024-11-09 05:00:00'`，结束时间为：`'2024-11-09 06:59:59'`，则该条任务的进行时间应该在`'2024-11-09'`这一天当中的 5 点到 6 点。

如最小时间单位是`'minute'`, 则 record 中的任务开始时间配置为：`'2024-11-09 05:10:00'`，结束时间为：`'2024-11-09 05:09:59'`，则该条任务的进行时间是有 10 分钟时间。

需要注意的是：如最小的时间单位是`'hour' |'minute' |'second'`，record 中规范的结束时间是 59 分或者 59 秒。

${prefix} step(number)

步长

${prefix} startOfWeek('sunday' | 'monday')

指定一周的开始是周日还是周一

非必填

${prefix} customLayout(IDateCustomLayout)

自定义布局渲染

非必填

{{ use: common-gantt-date-header-custom-layout }}

${prefix} style(ITimelineHeaderStyle)

指定表头文字样式

非必填

{{ use: common-gantt-timeline-header-style }}

${prefix} format((date: DateFormatArgumentType) => string)

日期格式化函数。

非必填

函数参数：

```
export type DateFormatArgumentType = {
  /** 当期日期属于该日期刻度的第几位。如季度日期中第四季度 返回4。 */
  dateIndex: number;
  startDate: Date;
  endDate: Date;
};
```

${prefix} visible(boolean)

是否显示日期刻度，默认显示

非必填
