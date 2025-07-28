{{ target: common-гантт-dependency-line }}

Specific definition:

```
{
  links: ITaskLink[];
  linkLineStyle?: ILineStyle;
  linkCreaтаблица?: логический;
  linkSelecтаблица?: логический;
  linkDeleтаблица?: логический;
  linkSelectedLineStyle?: ITaskLinkSelectedStyle;
  /** Create an operation point для the association line */
  linkCreatePointStyle?: IPointStyle;
  /** Create the operating point response status effect из the association line */
  linkCreatingPointStyle?: IPointStyle;
  /** Create an operation line style для the association line */
  linkCreatingLineStyle?: ILineStyle;
}
```

${prefix} links(ITaskLink[])

Specifies the direct dependency из the task, массив тип, и the массив elements are из ITaskLink тип.

обязательный

ITaskLink is defined as:

```
export тип ITaskLink = {
  /** тип */
  тип: DependencyType;
  /** начало task ID. массив для better tree search */
  linkedFromTaskKey?: строка | число | (строка | число)[];
  /** конец task ID. массив для better tree search */
  linkedToTaskKey?: строка | число | (строка | число)[];
  /** Line style */
  linkLineStyle?: ILineStyle;
};
```

The DependencyType enumeration тип is defined as:

```
export enum DependencyType {
FinishToStart = 'finish_to_start',
StartToStart = 'start_to_start',
FinishToFinish = 'finish_to_finish',
StartToFinish = 'start_to_finish'
}
```

${prefix} linkLineStyle(ILineStyle)

Dependency line style

не обязательный

{{ use: common-гантт-line-style }}

${prefix} linkCreaтаблица(логический)
Whether the dependency line can be created, the по умолчанию значение is false. If true, when Нажатьing the task bar, an operation point для creating a dependency line will appear.

не обязательный

${prefix} linkDeleтаблица(логический)
Whether the dependency line can be deleted, the по умолчанию значение is false.

не обязательный

${prefix} linkSelecтаблица(логический)
Whether the dependency line is selecтаблица, the по умолчанию is true

не обязательный

${prefix} linkSelectedLineStyle(ITaskLinkSelectedStyle)

Dependency line selection style

не обязательный

```
export тип ITaskLinkSelectedStyle = ILineStyle & {
shadowBlur?: число; //Shadow ширина
shadowOffset?: число; //Offset
shadowColor?: строка; //shadow цвет
};
```

{{ use: common-гантт-line-style }}

${prefix} linkCreatePointStyle(IPointStyle)

Нажать the task bar к create a dependency line operation point style

не обязательный

{{ use: common-гантт-point-style }}

${prefix} linkCreatingPointStyle(IPointStyle)

Operation point response state effect when creating dependency lines

не обязательный

{{ use: common-гантт-point-style }}

${prefix} linkCreatingLineStyle(ILineStyle)

The style из the action line when creating a dependency line

не обязательный

{{ use: common-гантт-line-style }}
