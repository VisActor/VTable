{{ target: common-gantt-dependency-line }}

Specific definition:

```
{
  links: ITaskLink[];
  linkLineStyle?: ILineStyle;
  linkCreatable?: boolean;
  linkSelectable?: boolean;
  linkDeletable?: boolean;
  linkSelectedLineStyle?: ITaskLinkSelectedStyle;
  /** Create an operation point for the association line */
  linkCreatePointStyle?: IPointStyle;
  /** Create the operating point response status effect of the association line */
  linkCreatingPointStyle?: IPointStyle;
  /** Create an operation line style for the association line */
  linkCreatingLineStyle?: ILineStyle;
}
```

${prefix} links(ITaskLink[])

Specifies the direct dependency of the task, array type, and the array elements are of ITaskLink type.

Required

ITaskLink is defined as:

```
export type ITaskLink = {
/** Dependency type */
type: DependencyType;
linkedFromTaskKey?: string | number;
linkedToTaskKey?: string | number;
};
```

The DependencyType enumeration type is defined as:

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

Not required

{{ use: common-gantt-line-style }}

${prefix} linkCreatable(boolean)
Whether the dependency line can be created, the default value is false. If true, when clicking the task bar, an operation point for creating a dependency line will appear.

Not required

${prefix} linkSelectable(boolean)
Whether the dependency line is selectable, the default is true

Not required

${prefix} linkSelectedLineStyle(ITaskLinkSelectedStyle)

Dependency line selection style

Not required

```
export type ITaskLinkSelectedStyle = ILineStyle & {
shadowBlur?: number; //Shadow width
shadowOffset?: number; //Offset
shadowColor?: string; //shadow color
};
```

{{ use: common-gantt-line-style }}

${prefix} linkCreatePointStyle(IPointStyle)

Click the task bar to create a dependency line operation point style

Not required

{{ use: common-gantt-point-style }}

${prefix} linkCreatingPointStyle(IPointStyle)

Operation point response state effect when creating dependency lines

Not required

{{ use: common-gantt-point-style }}

${prefix} linkCreatingLineStyle(ILineStyle)

The style of the action line when creating a dependency line

Not required

{{ use: common-gantt-line-style }}
