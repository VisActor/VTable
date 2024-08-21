{{ target: common-gantt-timeline-scale }}
日期刻度配置，对应的类型为 ITimelineScale，具体配置项如下：

${prefix} rowHeight(number)

行高

非必填

${prefix} unit('day' | 'week' | 'month' | 'quarter' | 'year')

时间单位

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