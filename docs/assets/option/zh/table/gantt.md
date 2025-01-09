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

## tasksShowMode(TasksShowMode)

任务条展示模式。使用枚举类型`TasksShowMode`进行配置

非必填

- `TasksShowMode.Tasks_Separate`: 每一个任务节点用单独一行来展示，父任务占用一行，子任务分别占用一行。这是默认的显示效果！
- `TasksShowMode.Sub_Tasks_Separate`: 省去父任务节点不展示，且所有子任务的节点分别用一行展示。
- `TasksShowMode.Sub_Tasks_Inline`: 省去父任务节点不展示，并把所有子任务的节点都放到同一行来展示。
- `TasksShowMode.Sub_Tasks_Arrange`: 省去父任务节点不展示，且所有子任务会维持 records 中的数据顺序布局，并保证节点不重叠展示。
- `TasksShowMode.Sub_Tasks_Compact`: 省去父任务节点不展示，且所有子任务会按照日期早晚的属性来布局，并保证节点不重叠的紧凑型展示。

## taskKeyField(string)

数据条目可唯一标识的字段名, 默认为'id'

非必填

## dependency(Object)

设置依赖线关系及样式

非必填

{{ use: common-gantt-dependency-line(prefix = '###')}}

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

具体可以参考 ListTable 中的配置：[具体配置](./ListTable#theme.scrollStyle)

## pixelRatio(number)

像素比率。

非必填

## dateFormat(string)

新建排期的日期格式，日期数据将被添加到数据 record 中日期字段值中，默认为'yyyy-mm-dd'。

非必填

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

绘制范围外的 canvas 上填充的颜色，默认为'#fff'，同时也适配到左侧表格的背景色。

非必填

## eventOptions(Object)

事件触发相关问题设置，具体配置项：

### preventDefaultContextMenu(boolean) = true

阻止鼠标右键的默认行为

非必填
