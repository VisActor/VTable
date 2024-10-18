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

${prefix} hoverBarStyle(ITaskBarHoverStyle)

Taskbar hover style

Not required

```
export type ITaskBarHoverStyle = {
/** Rounded corners of the task bar */
cornerRadius?: number;
barOverlayColor?: string;
};
```

${prefix} selectedBarStyle(ITaskBarSelectedStyle)

The style of the taskbar when selected

Not required

```
export type ITaskBarSelectedStyle = {
shadowBlur?: number; //Shadow width
shadowOffsetX?: number; //Offset in x direction
shadowOffsetY?: number; //Y direction offset
shadowColor?: string; //shadow color
borderColor?: string; //Border color
borderLineWidth?: number;
};
```

${prefix} selectable(boolean)

Whether the service clause is optional, the default is true

Not required

${prefix} scheduleCreatable(boolean) = true

When there is no schedule, you can create a task bar schedule by clicking on the create button. The default is true.

Optional

${prefix} scheduleCreation(Object)

For tasks without assigned dates, you can display the create button.

Optional

#${prefix} buttonStyle(Object)

The style of the new task bar button can be configured, and the styles that can be configured are:

```
{
  lineColor?: string;
  lineWidth?: number;
  lineDash?: number[];
  cornerRadius?: number;
  backgroundColor?: string;
};
```

Optional

#${prefix} customLayout(ICreationCustomLayout)

Custom rendering of the task bar creation button.

Optional

{{ use: common-gantt-task-creation-custom-layout }}
