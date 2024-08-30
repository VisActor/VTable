{{ target: common-gantt-task-list-table }}
The specific type definitions are as follows:
```
/** Configuration related to the left task information table */
  taskListTable?: {
    /** The width occupied by the left task list information. If set to 'auto', all columns will be fully displayed */
    tableWidth?: 'auto' | number;
    /** Minimum width of the left task list */
    minTableWidth?: number;
    /** Maximum width of the left task list */
    maxTableWidth?: number;
  } & Omit<      // Configurable properties of the ListTable
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
The content configured here corresponds to the left task information table, which is a complete instance of ListTable. Therefore, in addition to the configuration items for table width, the configurations are basically consistent with those in ListTable except for the items omitted. For details, please refer to [ListTable](./ListTable)

The items specified by Omit that do not need to be defined here in taskListTable (defined in the outer option) are:
```
['container', 'records', 'rowSeriesNumber', 'overscrollBehavior', 'pixelRatio'];
```

Also, note the configuration of the outer border in the theme.frameStyle of ListTable, because the frame has already been defined in the Gantt chart configuration, so there is an override logic here:
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

In addition, the configuration of the scrollbar in the theme.scrollStyle of ListTable will also have an override logic based on the Gantt chart configuration items:

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

Define the column information of the task information table

Optional

Important configuration items, for details, please refer to the columns configuration in ListTable: [Detailed configuration](./ListTable-columns-text#cellType)

${prefix} tableWidth('auto' | number)

The width occupied by the left task list information. If set to 'auto', all columns will be fully displayed

Optional

${prefix} minTableWidth(number)

Minimum width of the left task list

Optional

${prefix} maxTableWidth(number)

Maximum width of the left task list

Optional
