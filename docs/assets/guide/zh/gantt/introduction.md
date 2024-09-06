# 甘特图 (Gantt Chart) 介绍与使用教程
甘特图是一种项目管理工具，用于展示项目计划、任务进度和时间安排。它通过条形图的形式直观地展示任务的开始和结束时间，帮助项目管理者有效地跟踪和管理项目进度。其中每个任务在图中显示为一个条形，条形的长度表示任务的持续时间，位置表示任务的开始和结束时间。

VTable-Gantt 是一款基于 VTable表格组件及canvas渲染器VRender 构建的强大甘特图绘制工具，能够帮助开发者轻松创建和管理甘特图

## 甘特图的组成部分
左侧任务列表：显示项目的任务列表，通常在图的左侧。

顶部时间轴：显示项目的时间范围，通常在图的顶部或底部。

任务条：表示每个任务的开始和结束时间。

网格线：用于分隔时间轴和任务条，使图表更加清晰。

标记线：用于标记重要时间点。

分割线：用于分隔任务列表和时间轴，使图表更加清晰。

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-structure.png)

**注意：左侧的任务信息表在实现中对应的是一个完整的ListTable。挂在ganttInstable.listTableInstance中，所以对应ListTable的接口及事件都是可以通过listTableInstance来直接使用的，同时如果想要排查左侧表格的问题也可以直接将listTableInstance.options取出查看是否符合预期**
 <div style="width: 50%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-guide-leftListTable.png" />
    <p>left table</p>
  </div>

## 甘特图的主要能力

### 多列信息展示
甘特图整个结构的左侧是一个完整的表格容器，所以可支持丰富的列信息展示，具体配置可参考[配置](../../option/Gantt#taskListTable)

### 自定义渲染

自定义渲染需要了解VRender的图元属性，具体可以参考[自定义渲染教程](../../guide/gantt/gantt_customLayout)

#### 任务条的自定义渲染
通过 `taskBar.customLayout` 配置项，可以自定义任务条的渲染方式。

#### 日期表头自定义渲染

通过 `timelineHeader.scales.customLayout` 配置项，可以自定义日期表头的渲染方式。

#### 左侧任务信息表格自定义渲染

通过 `taskListTable.columns.customLayout` 定义每一列单元格的自定义渲染 或者 通过`taskListTable.customLayout` 全局定义每个单元格的自定义渲染。


### 支持不同的日期刻度粒度

通常的业务场景中，可能需要涉及多层时间刻度的展示，VTable-Gantt支持五种时间粒度：`'day' | 'week' | 'month' | 'quarter' | 'year'`。

通过 `timelineHeader.scales.unit` 配置项，可以设置日期刻度的行高和时间单位（如天、周、月等）。

### 日期表头样式

通过 `timelineHeader.scales.style` 配置项，可以自定义日期表头的样式。

通过 `timelineHeader.scales.rowHeight` 配置项，可以设置日期刻度的行高。

### 外边框

表格的边框可能与内部的网格线在样式上有一定的不同，可以通过 `frame.outerFrameStyle` 配置项，可以自定义甘特图的外边框。

### 横纵分割线

同时支持表头和body的横向分割线，及左侧信息表和右侧任务列表的分割线。通过 `frame.horizontalSplitLine` 配置项，可以自定义水平分割线的样式。`frame.verticalSplitLine` 配置项，可以自定义垂直分割线的样式。

### 标记线

在gantt甘特图中通常需要标记一些重要的日期，我们通过配置项markLine来配置该效果。通过`markLine.date`来指定重点日期，通过 `markLine.style` 配置项，可以自定义标记线的样式。如果需要将该日期在初始化时一定要展示出来可以设置`markLine.scrollToMarkLine`为`true`。

### 容器网格线

通过 `grid` 配置项，可以自定义右侧任务条背景网格线的样式。包括背景色、横纵方向的线宽、线型等。

### 交互

#### 任务条的拖拽

通过 `taskBar.moveable` 配置项，可以设置任务条是否可拖拽。

#### 任务条的调整大小

通过 `taskBar.resizable` 配置项，可以设置任务条是否可调整大小。

#### 调整左侧表格宽度

通过 `frame.verticalSplitLineMoveable` 配置为true，可以设置分割线可拖拽。

#### 编辑任务信息

通过`ListTable`的编辑能力，可以同步更新数据到任务条。

开启编辑能力需要先提前注册好编辑器到VTable中，因为这里的编辑能力实际是借助的`ListTable`的编辑能力。

#### 调整数据顺序

开启拖拽换位能力同`ListTable`的配置需要在配置中添加`rowSeriesNumber`，即有了行序号，用`rowSeriesNumber.style`和`headerStyle`中可以配置该列的样式，开启换位的话将`rowSeriesNumber.dragOrder`设置为true。`VTable-Gantt`在监听有移位事件时将顺序同步到任务条区域显示。

## 借助表格的能力
甘特图是基于VTable的ListTable实现的，看上去相当于一个拼接形式，左侧是任务信息表格，右侧是任务条列表。

那么taskListTable 是 vtable-gantt 组件中最重要的配置项之一，它用于配置左侧任务列表表格的布局和样式，对应到一个完整的ListTable的配置。在甘特图实例中也存在这样一个ListTable的实例，可以直接获取左侧表格的实例，进行操作。

获取表格实例的方式如下：
```javascript
const ganttInstance =new Gantt(containerDom, options);
// 获取左侧表格实例
const tableInstance = ganttInstance.taskListTableInstance;
```
VTableGantt内部借助这个表格实例tableInstance实现的能力有：

1. 借助这个间接获取的tableInstance可以监听事件或者调用ListTable支持接口。具体可以参考ListTable的[文档](../../api)
2. 借助ListTable的编辑能力，实现了甘特图数据编辑能力。
3. 借助ListTable的排序能力，实现了甘特图数据排序能力。ListTable的[参考教程](../../guide/basic_function/sort/list_sort)。
4. 借助ListTable的树形结构能力，实现了甘特图父子关系的数据。ListTable的[参考教程](../../guide/table_type/List_table/tree_list)。

## vtable-gantt主要配置
在 vtable-gantt 组件中，支持的主要配置包括：

1. 数据配置records

2. 任务条配置 taskBar

    1. 自定义渲染: 通过 customLayout 配置项，可以自定义任务条的渲染方式。
    2. 样式配置: 通过 barStyle 和 hoverBarStyle 等配置项，可以设置任务条的颜色、宽度、圆角、边框等样式。
    3. 文字样式: 通过 labelText 配置显示的文字内容信息， labelTextStyle 配置样式，文字样式包括字体、颜色、对齐方式等。
    4. 交互配置: 通过 resizable 和 moveable 配置项，可以设置任务条是否可调整大小和移动。
    5. 交互样式: 通过 hoverBarStyle 配置项，可以设置任务条悬浮时的样式。
3. 日期表头配置 timelineHeader
    1. 自定义渲染: 通过 customLayout 配置项，可以自定义日期表头的渲染方式。
    2. 样式配置: 通过 style 配置项，可以设置表头的文字样式，包括字体大小、颜色、对齐方式等。
4. 时间刻度配置 timelineHeader.scales
    1. 行高和时间单位: 通过 rowHeight 和 unit 配置项，可以设置时间刻度的行高和时间单位（如天、周、月等）。
    2. 步长和周起始日: 通过 step 和 startOfWeek 配置项，可以设置时间刻度的步长和一周的起始日。
    3. 日期格式化: 通过 format 配置项，可以自定义日期的显示格式。
5. 网格线配置grid
    1. 样式配置: 通过 verticalLine 和 horizontalLine 配置项，可以设置网格线的颜色、宽度、虚线样式等。
    2. 背景颜色: 通过 backgroundColor 配置项，可以设置网格线的背景颜色。
6. 任务列表表格配置 taskListTable (左侧任务信息列表 对应ListTable的配置，需要可以参考[配置](../../option/Gantt#taskListTable))
    1. 左侧表格整体宽度：通过 tableWidth 配置项，可以设置任务列表表格的整体宽度。
    2. 列信息: 通过 columns，可以定义任务信息表格的列信息和各列宽度。
    3. 样式配置: 通过 theme.headerStyle 和 theme.bodyStyle 配置项，可以设置表头和表体的样式。
    4. 宽度限制: 通过 minTableWidth 和 maxTableWidth 配置项，可以设置任务列表的最小和最大宽度。
7. 分割线配置 frame
    1. 外边框配置: 通过 outerFrameStyle 配置项，可以设置外边框的颜色、宽度等。
    2. 分割线样式配置: 通过 verticalSplitLine 和 horizontalSplitLine 配置项，可以设置分割线的颜色、宽度、虚线样式等。
    3. 拖拽左侧表格宽度: 通过verticalSplitLineMoveable 配置项，可以设置分割线是否可拖拽。通过 verticalSplitLineHighlight 配置项，可以设置列调整宽度时的高亮线样式。
8. 标记线配置 markLine
    1. 日期配置: 通过 date 配置项，可以设置标记线的日期。
    2. 样式配置: 通过 style 配置项，可以设置标记线的颜色、宽度、虚线样式等。
    3. 标记线位置: 通过 position 配置项，可以设置标记线的位置。
    4. 标记线默认显示到中间: 通过 scrollToMarkLine 配置项，可以设置标记线是否默认显示到中间。

这些能力使得 vtable-gantt 组件在任务管理和项目规划中具有高度的可定制性和灵活性，能够满足不同场景下的需求。

## 总结
甘特图是项目管理中非常重要的工具，通过直观的图形展示项目的进度和时间安排，帮助项目管理者更好地规划和控制项目。通过合理配置甘特图的各项参数，可以满足不同项目的需求，提高项目管理的效率。

希望这篇教程能帮助你更好地理解和使用甘特图。如果有任何问题或建议，欢迎交流讨论。