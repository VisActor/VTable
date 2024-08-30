{{ target: common-gantt-task-bar }}

${prefix} startDateField(string)

The data field name corresponding to the task start date. By default, the field value in records is taken as 'startDate'.

Optional

${prefix} endDateField(string)

The data field name corresponding to the task end date. By default, the field value in records is taken as 'endDate'.

Optional

${prefix} progressField(string)

The data field name corresponding to the task progress.

Optional

${prefix} labelText(ITaskBarLabelText)

The text displayed on the task bar. You can configure fixed text or string templates \`$\{fieldName\}\`. Field names can be used in the template, such as \`$\{title\}+completed$\{progress\}\`, \`$\{startDate\}-$\{endDate\}\`.

Optional

${prefix} labelTextStyle(ITaskBarLabelTextStyle)

The style of the text on the task bar.

{{ use: common-gantt-task-bar-label-text-style }}

Optional

${prefix} barStyle(ITaskBarStyle)

The style of the task bar.

Optional

{{ use: common-gantt-task-bar-style }}

${prefix} customLayout(ITaskBarCustomLayout)

Custom layout rendering.

Optional

{{ use: common-gantt-task-bar-custom-layout }}

${prefix} resizable(boolean) = true

Whether the task bar can be resized. The default is true.

Optional

${prefix} moveable(boolean) = true

Whether the task bar can be moved. The default is true.

Optional

${prefix} hoverBarStyle(ITaskBarStyle & { barOverlayColor?: string })

The style of the task bar when hovered.

Optional

${prefix} selectionBarStyle(ITaskBarStyle & { barOverlayColor?: string })

The style of the task bar when selected.

Optional
