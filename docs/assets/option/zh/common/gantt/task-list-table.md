{{ target: common-gantt-task-list-table }}

${prefix} columns(ColumnsDefine)

定义任务信息表格的列信息

非必填

具体可以参考ListTable中columns的配置：[具体配置](./ListTable-columns-text#cellType)

${prefix} width('auto' | number)

左侧任务列表信息占用的宽度。如果设置为'auto'表示将所有列完全展示

非必填

${prefix} colWidth(number)

列宽度

非必填

${prefix} headerStyle(ITableStyle)

表头样式

非必填

具体可以参考ListTable中theme的配置：[具体配置](./ListTable#theme.headerStyle)

${prefix} bodyStyle(ITableStyle)

表体样式

非必填

具体可以参考ListTable中theme的配置：[具体配置](./ListTable#theme.bodyStyle)

${prefix} minWidth(number)

左侧任务列表最小宽度

非必填

${prefix} maxWidth(number)

左侧任务列表最大宽度

非必填

${prefix} rightFrozenColCount(number)

右侧冻结列数

非必填