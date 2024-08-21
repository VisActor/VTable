{{ target: common-gantt-task-bar }}

${prefix} startDateField(string)

任务开始日期对应的数据字段名  默认按'startDate'取records中的字段值

非必填

${prefix} endDateField(string)

任务结束日期对应的数据字段名  默认按'endDate'取records中的字段值

非必填

${prefix} progressField(string)

任务进度对应的数据字段名

非必填

${prefix} labelText(ITaskBarLabelText)

任务条展示文字。可以配置固定文本 或者 字符串模版\`$\{fieldName\}\`，模版中可以使用字段名，如\`$\{title\}+已完成$\{progress\}\`，\`$\{startDate\}-$\{endDate\}\`。

非必填

${prefix} labelTextStyle(ITaskBarLabelTextStyle)

任务条文字样式

{{ use: common-gantt-task-bar-label-text-style }}

非必填

${prefix} barStyle(ITaskBarStyle)

任务条样式

非必填

{{ use: common-gantt-task-bar-style }}


${prefix} customLayout(ITaskBarCustomLayout)

自定义布局渲染

非必填

{{ use: common-gantt-task-bar-custom-layout }}

${prefix} resizable(boolean) = true

任务条是否可调整大小。默认为true

非必填

${prefix} moveable(boolean) = true

任务条是否可移动。默认为true

非必填

${prefix} hoverBarStyle(ITaskBarStyle & { barOverlayColor?: string })

任务条hover时的样式

非必填

${prefix} selectionBarStyle(ITaskBarStyle & { barOverlayColor?: string })

任务条选择时的样式

非必填