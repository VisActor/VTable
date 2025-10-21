{{ target: common-gantt-task-bar }}

${prefix} startDateField(string)

任务开始日期对应的数据字段名 默认按'startDate'取 records 中的字段值

非必填

${prefix} endDateField(string)

任务结束日期对应的数据字段名 默认按'endDate'取 records 中的字段值

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

${prefix} barStyle(ITaskBarStyle|Function)

任务条样式, 可以配置函数，根据情况返回不同的样式.

非必填

```
 /** 任务条样式 */
barStyle?: ITaskBarStyle | ((args: TaskBarInteractionArgumentType) => ITaskBarStyle);

//其中 TaskBarInteractionArgumentType 的定义为：
export type TaskBarInteractionArgumentType = {
  taskRecord: any;
  index: number;
  subIndex?: number;
  startDate: Date;
  endDate: Date;
  ganttInstance: Gantt;
};
```

{{ use: common-gantt-task-bar-style }}

${prefix} milestoneStyle(ITaskBarStyle)

里程碑样式

非必填

{{ use: common-gantt-task-bar-milestone-style }}

${prefix} customLayout(ITaskBarCustomLayout)

自定义布局渲染

非必填

{{ use: common-gantt-task-bar-custom-layout }}

${prefix} resizable(boolean | [ boolean, boolean ] | Function) = true

任务条是否可调整大小。默认为 true

非必填

```
 /** 任务条是否可调整大小。 配置函数可以 根据情况来返回是否可调整大小 */
    resizable?:
      | boolean
      | [boolean, boolean]
      | ((interactionArgs: TaskBarInteractionArgumentType) => boolean | [boolean, boolean]);


//其中：
export type TaskBarInteractionArgumentType = {
  taskRecord: any;
  index: number;
  startDate: Date;
  endDate: Date;
  ganttInstance: Gantt;
};
```

${prefix} moveable(boolean | Function) = true

任务条是否可移动。默认为 true

非必填

```
moveable?: boolean | ((interactionArgs: TaskBarInteractionArgumentType) => boolean);

//其中：
export type TaskBarInteractionArgumentType = {
  taskRecord: any;
  index: number;
  startDate: Date;
  endDate: Date;
  ganttInstance: Gantt;
};
```

${prefix} progressAdjustable(boolean | Function) = true

任务进度是否可调整。默认为 true。设置为 true 时，用户可以拖拽任务条上的进度控制柄来调整进度百分比。设置为 false 时，进度控制柄将被隐藏，禁止进度调整。

非必填

```
progressAdjustable?: boolean | ((interactionArgs: TaskBarInteractionArgumentType) => boolean);

//其中：
export type TaskBarInteractionArgumentType = {
  taskRecord: any;
  index: number;
  startDate: Date;
  endDate: Date;
  ganttInstance: Gantt;
};
```

**注意：** 只有当任务定义了进度字段时，进度调整功能才可用。里程碑任务无法调整进度。

${prefix} moveToExtendDateRange(boolean) = true

任务条拖拽超出当前日期范围时自动扩展日期范围, 默认为 true

${prefix} hoverBarStyle(ITaskBarHoverStyle)

任务条 hover 时的样式

非必填

```
export type ITaskBarHoverStyle = {
  /** 任务条的圆角 */
  cornerRadius?: number;
  barOverlayColor?: string;
};
```

${prefix} selectedBarStyle(ITaskBarSelectedStyle)

任务条选择时的样式

非必填

```
export type ITaskBarSelectedStyle = {
  shadowBlur?: number; //阴影宽度
  shadowOffsetX?: number; //x方向偏移
  shadowOffsetY?: number; //Y方向偏移
  shadowColor?: string; //阴影颜色
  borderColor?: string; //边框颜色
  borderLineWidth?: number;
};
```

${prefix} selectable(boolean)

务条是否可选择，默认为 true

非必填

${prefix} scheduleCreatable(boolean | Function) = true

数据没有排期时，可通过创建任务条排期。当 tasksShowMode 为 TasksShowMode.Tasks_Separate 或 TasksShowMode.Sub_Tasks_Separate 时 `scheduleCreatable` 默认为 true，其他情况即当 tasksShowMode 为 TasksShowMode.Sub_Tasks_Inline 或 TasksShowMode.Sub_Tasks_Arrange 或 TasksShowMode.Sub_Tasks_Compact 时 `scheduleCreatable` 默认为 false

非必填

```
scheduleCreatable?: boolean | ((interactionArgs: TaskBarInteractionArgumentType) => boolean);

//其中：
export type TaskBarInteractionArgumentType = {
  taskRecord: any;
  index: number;
  startDate: Date;
  endDate: Date;
  ganttInstance: Gantt;
};
```

${prefix} scheduleCreation(Object)

针对没有分配日期的任务，可以显示出创建按钮

非必填

#${prefix} buttonStyle(Object)

新建任务条按钮的样式，可以配置的样式有：

```
{
  lineColor?: string;
  lineWidth?: number;
  lineDash?: number[];
  cornerRadius?: number;
  backgroundColor?: string;
};
```

非必填

#${prefix} customLayout(ICreationCustomLayout)

任务条创建按钮的自定义渲染

非必填

{{ use: common-gantt-task-creation-custom-layout }}

${prefix} maxWidth(number)

任务条创建按钮的最大宽度

非必填

${prefix} minWidth(number)

任务条创建按钮的最小宽度

非必填

${prefix} clip(boolean)

是否裁剪掉溢出 taskBar 的部分，默认为 true

非必填
