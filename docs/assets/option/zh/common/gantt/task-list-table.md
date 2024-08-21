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
  } & Omit<
    //ListTable表格可配置的属性
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
这里配置的内容对应左侧任务信息表格，该表格是一个完整的ListTable的实例。所以可以看到除了上述个别配置项外和ListTable中的配置基本一致，具体可以参考[ListTable](./ListTable)

不需要在taskListTable这里定义（在外层option定义）的配置项有： 
```
['container', 'records', 'rowSeriesNumber', 'overscrollBehavior', 'pixelRatio'];
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

