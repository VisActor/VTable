{{ target: gantt }}
# Gantt

Gantt chart configuration, corresponding type is GanttConstructorOptions, specific configuration items are as follows:

## records(Array)

Data collection.

Optional

## taskListTable(Object)

Configuration related to the task list table on the left.

Optional

{{ use: common-gantt-task-list-table(prefix = '###') }}

## timelineHeader(Object)

Time scale configuration.
```
  {
    backgroundColor?: string;
    colWidth?: number;
    /** Vertical line style */
    verticalLine?: ILineStyle;
    /** Horizontal line style */
    horizontalLine?: ILineStyle;
    scales: ITimelineScale[];
  }
```
### backgroundColor(string)

Time scale background color.

### colWidth(number)

Column width.

### verticalLine(ILineStyle)

Vertical line style.

{{ use: common-gantt-line-style }}

### horizontalLine(ILineStyle)

Horizontal line style.

{{ use: common-gantt-line-style }}

### scales(Array<ITimelineScale>)

Time scale configuration array.

{{ use: common-gantt-timeline-scale( prefix = '####') }}

## taskBar(Object)

Set task bar style.

Optional

{{ use: common-gantt-task-bar(prefix = '###')}}

## grid(IGrid)

Grid style.

Optional

{{ use: common-gantt-grid(prefix = '###') }}

## markLine(boolean | IMarkLine | Array<IMarkLine>)

Mark line configuration. If set to true, today will be automatically marked.

Optional

{{use: common-gantt-mark-line(prefix = '###')}}

## frame(Object)

Configuration of the entire outer frame and horizontal and vertical dividing lines.

Optional

{{ use: common-gantt-frame(prefix = '###') }}

## minDate(string)

Specify the minimum date for the entire Gantt chart.

Optional

## maxDate(string)

Specify the maximum date for the entire Gantt chart. If not set, the default rule is used.

Optional

## headerRowHeight(number)

Default row height for the top header section. If you want to configure according to the header level, please configure it in timelineHeader.scale.

Optional

## rowHeight(number)

Default row height for data.

Optional

## rowSeriesNumber(IRowSeriesNumber)

Row number configuration.

Optional

{{ use: row-series-number(
    prefix = '###',
) }}

## overscrollBehavior('auto' | 'none') = 'auto'

Scroll behavior configuration.
- 'auto': Consistent with browser scroll behavior, triggers the browser's default behavior when the table scrolls to the top/bottom.
- 'none': When the table scrolls to the top/bottom, it no longer triggers the parent container to scroll.

Optional

## scrollStyle(IScrollStyle)

Scrollbar style.

Optional

For specific reference, see the configuration in ListTable: [Specific configuration](./ListTable#theme.scrollStyle)

## pixelRatio(number)

Pixel ratio.

Optional
