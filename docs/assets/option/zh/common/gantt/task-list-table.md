{{ target: common-gantt-task-list-table }}
具体类型定义如下：
```
/** 左侧任务信息表格相关配置 */
  taskListTable?: {
    /** 左侧任务列表信息占用的宽度。如果设置为'auto'表示将所有列完全展示 */
    tableWidth?: 'auto' | number;
    /** 左侧任务列表 最小宽度 */
    minTableWidth?: number;
    /** 左侧任务列表 最大宽度 */
    maxTableWidth?: number;
  } & Omit<      //ListTable表格可配置的属性
    ListTableConstructorOptions,
    | 'container'
    | 'records'
    | 'defaultHeaderRowHeight'
    | 'defaultRowHeight'
    | 'overscrollBehavior'
    | 'rowSeriesNumber'
    | 'scrollStyle'
    | 'pixelRatio'
    | 'title'
  >;
```
这里配置的内容对应左侧任务信息表格，该表格是一个完整的ListTable的实例。所以可以看到除了增加了表格宽度的配置项外，以及Omit的几项配置外和ListTable中的配置基本一致，具体可以参考[ListTable](./ListTable)

Omit指定的不需要在taskListTable这里定义（在外层option定义）的配置项有： 
```
['container', 'records', 'rowSeriesNumber', 'overscrollBehavior', 'pixelRatio'];
```

同时需要注意ListTable的主题theme.frameStyle关于外边框的配置，因为甘特图的配置项中已经定义frame了，所以这里有个覆盖的逻辑：
```
left_listTable_options.theme.frameStyle = Object.assign({}, this.ganttOptions.outerFrameStyle, {
          cornerRadius: [
            this.ganttOptions.outerFrameStyle?.cornerRadius ?? 0,
            0,
            0,
            this.ganttOptions.outerFrameStyle?.cornerRadius ?? 0
          ],
          borderLineWidth: [
            this.ganttOptions.outerFrameStyle?.borderLineWidth ?? 0,
            0,
            this.ganttOptions.outerFrameStyle?.borderLineWidth ?? 0,
            this.ganttOptions.outerFrameStyle?.borderLineWidth ?? 0
          ]
        });
```

另外ListTable的主题theme.scrollStyle滚动条的配置，也会根据甘特图的配置项有个覆盖逻辑：

```
left_listTable_options.theme.scrollStyle = Object.assign(
  {}, 
  this.options.taskListTable.theme.scrollStyle, 
  this.ganttOptions.scrollStyle, 
  {
    verticalVisible: 'none'
  })
```

${prefix} columns(ColumnsDefine)

定义任务信息表格的列信息

非必填

重要配置项，具体可以参考ListTable中columns的配置：[具体配置](./ListTable-columns-text#cellType)

${prefix} tableWidth('auto' | number)

左侧任务列表信息占用的宽度。如果设置为'auto'表示将所有列完全展示

非必填

${prefix} minTableWidth(number)

左侧任务列表最小宽度

非必填

${prefix} maxTableWidth(number)

左侧任务列表最大宽度

非必填

