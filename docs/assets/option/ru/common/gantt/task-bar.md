{{ target: common-гантт-task-bar }}

${prefix} startDateполе(строка)

The данные поле имя corresponding к the task начало date. по по умолчанию, the поле значение в records is taken as 'startDate'.

необязательный

${prefix} endDateполе(строка)

The данные поле имя corresponding к the task конец date. по по умолчанию, the поле значение в records is taken as 'endDate'.

необязательный

${prefix} progressполе(строка)

The данные поле имя corresponding к the task progress.

необязательный

${prefix} labelText(ITaskBarLabelText)

The текст displayed на the task bar. Вы можете configure fixed текст или строка templates \`$\{полеимя\}\`. поле имяs can be used в the template, such as \`$\{title\}+completed$\{progress\}\`, \`$\{startDate\}-$\{endDate\}\`.

необязательный

${prefix} labelTextStyle(ITaskBarLabelTextStyle)

The style из the текст на the task bar.

{{ use: common-гантт-task-bar-label-текст-style }}

необязательный

${prefix} barStyle(ITaskBarStyle|функция)

необязательный

The style из the task bar, Вы можете configure the функция к возврат different styles based на the situation.

```
barStyle?: ITaskBarStyle | ((args: TaskBarInteractionArgumentType) => ITaskBarStyle);

// TaskBarInteractionArgumentType definition:
export тип TaskBarInteractionArgumentType = {
  taskRecord: любой;
  index: число;
  subIndex?: число;
  startDate: Date;
  endDate: Date;
  ганттInstance: гантт;
};
```


{{ use: common-гантт-task-bar-style }}

${prefix} milestoneStyle(ITaskBarStyle)

milestone style

необязательный

{{ use: common-гантт-task-bar-milestone-style }}

${prefix} пользовательскиймакет(ITaskBarпользовательскиймакет)

пользовательский макет rendering.

необязательный

{{ use: common-гантт-task-bar-пользовательский-макет }}

${prefix} resizable(логический | [ логический, логический ] | функция) = true

Whether the task bar can be resized. The по умолчанию is true.

необязательный

```
 /** Whether the task bar can be resized. The configuration функция can возврат whether the размер can be resized depending на the situation */
    resizable?:
      | логический
      | [логический, логический]
      | ((interactionArgs: TaskBarInteractionArgumentType) => логический | [логический, логический]);

export тип TaskBarInteractionArgumentType = {
  taskRecord: любой;
  index: число;
  startDate: Date;
  endDate: Date;
  ганттInstance: гантт;
};
```

${prefix} moveable(логический | функция) = true

Whether the task bar can be moved. The по умолчанию is true.

необязательный

```
moveable?: логический | ((interactionArgs: TaskBarInteractionArgumentType) => логический);

export тип TaskBarInteractionArgumentType = {
  taskRecord: любой;
  index: число;
  startDate: Date;
  endDate: Date;
  ганттInstance: гантт;
};
```

${prefix} moveToExtendDateRange(логический) = true

Whether к move the task bar к the extended date range. The по умолчанию is true.

${prefix} hoverBarStyle(ITaskBarHoverStyle)

Taskbar навести style

не обязательный

```
export тип ITaskBarHoverStyle = {
/** Rounded corners из the task bar */
cornerRadius?: число;
barOverlayColor?: строка;
};
```

${prefix} selectedBarStyle(ITaskBarSelectedStyle)

The style из the taskbar when selected

не обязательный

```
export тип ITaskBarSelectedStyle = {
shadowBlur?: число; //Shadow ширина
shadowOffsetX?: число; //Offset в x direction
shadowOffsetY?: число; //Y direction offset
shadowColor?: строка; //shadow цвет
borderColor?: строка; //граница цвет
borderLineширина?: число;
};
```

${prefix} selecтаблица(логический)

Whether the service clause is необязательный, the по умолчанию is true

не обязательный

${prefix} scheduleCreaтаблица(логический | функция) = true

When there is no scheduling данные, scheduling can be done по creating a task bar. When `tasksShowMode` is `TasksShowMode.Tasks_Separate` или `TasksShowMode.Sub_Tasks_Separate`, `scheduleCreaтаблица` defaults к `true`, otherwise, when `tasksShowMode` is `TasksShowMode.Sub_Tasks_Inline`, `TasksShowMode.Sub_Tasks_Arrange`, или `TasksShowMode.Sub_Tasks_Compact`, `scheduleCreaтаблица` defaults к `false`.

необязательный

```
scheduleCreaтаблица?: логический | ((interactionArgs: TaskBarInteractionArgumentType) => логический);

export тип TaskBarInteractionArgumentType = {
  taskRecord: любой;
  index: число;
  startDate: Date;
  endDate: Date;
  ганттInstance: гантт;
};
```

${prefix} scheduleCreation(объект)

для tasks без assigned dates, Вы можете display the create Кнопка.

необязательный

#${prefix} КнопкаStyle(объект)

The style из the новый task bar Кнопка can be configured, и the styles that can be configured are:

```
{
  lineColor?: строка;
  lineширина?: число;
  lineDash?: число[];
  cornerRadius?: число;
  backgroundColor?: строка;
};
```

необязательный

#${prefix} пользовательскиймакет(ICreationпользовательскиймакет)

пользовательский rendering из the task bar creation Кнопка.

необязательный

{{ use: common-гантт-task-creation-пользовательский-макет }}

${prefix} maxширина(число)

The maximum ширина из the task bar creation Кнопка.

необязательный

${prefix} minширина(число)

The minimum ширина из the task bar creation Кнопка.

необязательный
