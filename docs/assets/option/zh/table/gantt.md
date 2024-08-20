{{ target: gantt }}
# Gantt

甘特图配置，对应的类型为 GanttConstructorOptions，具体配置项如下：

## records(Array)

数据集合。

非必填

## taskListTable(Object)

左侧任务列表表格的相关配置。

非必填

{{ use: common-gantt-task-list-table(prefix = '###') }}

## timelineHeader(Object)

时间刻度配置。
```
  {
    backgroundColor?: string;
    colWidth?: number;
    /** 垂直间隔线样式 */
    verticalLine?: ILineStyle;
    /** 水平间隔线样式 */
    horizontalLine?: ILineStyle;
    scales: ITimelineScale[];
  }
```
### backgroundColor(string)

时间刻度背景颜色。

### colWidth(number)

列宽。

### verticalLine(ILineStyle)

垂直间隔线样式。

{{ use: common-gantt-line-style }}

### horizontalLine(ILineStyle)

水平间隔线样式。

{{ use: common-gantt-line-style }}

### scales(Array<ITimelineScale>)

时间刻度配置数组。

{{ use: common-gantt-timeline-scale( prefix = '####') }}

## taskBar(Object)

设置任务条样式

非必填

{{ use: common-gantt-task-bar(prefix = '###')}}



## grid(IGrid)

网格样式。

非必填

{{ use: common-gantt-grid(prefix = '###') }}

## markLine(boolean | IMarkLine | Array<IMarkLine>)

标记线配置。如果配置为 true，会自动给今天做标记。

非必填

{{use: common-gantt-mark-line(prefix = '###')}}

## frame(Object)

整个外边框及横纵分割线配置。

非必填

{{ use: common-gantt-frame(prefix = '###') }}

## minDate(string)

指定整个甘特图的最小日期。

非必填

## maxDate(string)

指定整个甘特图的最大日期。不设置时使用默认规则。

非必填

## headerRowHeight(number)

顶部表头部分默认行高。如果想按表头层级依次配置，请配置到 timelineHeader.scale 中。

非必填

## rowHeight(number)

数据默认行高。

非必填

## rowSeriesNumber(IRowSeriesNumber)

行号配置。

非必填

{{ use: row-series-number(
    prefix = '###',
) }}


## overscrollBehavior('auto' | 'none') = 'auto'

滚动行为配置。
- 'auto': 和浏览器滚动行为一致，表格滚动到顶部/底部时触发浏览器默认行为。
- 'none': 表格滚动到顶部/底部时，不再触发父容器滚动。

非必填

## scrollStyle(IScrollStyle)

滚动条样式。

非必填

具体可以参考ListTable中的配置：[具体配置](./ListTable#theme.scrollStyle)

## pixelRatio(number)

像素比率。

非必填
