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

## tasksShowMode(TasksShowMode)

Task bar display mode. It is configured using the enumeration type `TasksShowMode`.

Optional

- `TasksShowMode.Tasks_Separate`: Each task node is displayed in a separate row, with the parent task occupying one row and child tasks occupying one row each. This is the default display effect!
- `TasksShowMode.Sub_Tasks_Separate`: The parent task node is omitted and not displayed, and all child task nodes are displayed in separate rows.
- `TasksShowMode.Sub_Tasks_Inline`: The parent task node is omitted and not displayed, and all child task nodes are placed in the same row for display.
- `TasksShowMode.Sub_Tasks_Arrange`: The parent task node is omitted and not displayed, and all child tasks will maintain the data order in the records and ensure that the nodes are displayed without overlapping.
- `TasksShowMode.Sub_Tasks_Compact`: The parent task node is omitted and not displayed, and all child tasks will be arranged according to the date attribute and ensure a compact display without overlapping nodes.

## taskKeyField(string)

The field name that uniquely identifies the data entry, default is 'id'

Not required

## dependency(Object)

Set dependency line relationship and style

Not required

{{ use: common-gantt-dependency-line(prefix = '###')}}

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

## dateFormat(string)

The date format of the new schedule. The date data will be added to the date field value in the data record. The default value is 'yyyy-mm-dd'.

Not required

```
dateFormat?:
| 'yyyy-mm-dd'
| 'dd-mm-yyyy'
| 'mm/dd/yyyy'
| 'yyyy/mm/dd'
| 'dd/mm/yyyy'
| 'yyyy.mm.dd'
| 'dd.mm.yyyy'
| 'mm.dd.yyyy';
```

## underlayBackgroundColor(string)

The fill color of the canvas outside the drawing range is '#fff' by default, and it also matches the background color of the table on the left.

Not required

## eventOptions(IEventOptions)

Settings related to event triggering, specific configuration items:

### preventDefaultContextMenu(boolean) = true

Prevent the default behavior of the right mouse button

Optional
