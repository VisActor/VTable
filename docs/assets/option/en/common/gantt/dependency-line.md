{{ target: common-gantt-dependency-line }}

Specific definition:

```
{
links: ITaskLink[];
linkLineStyle?: ILineStyle;
linkLineCreatable?: boolean;
linkLineSelectable?: boolean;
linkLineSelectedStyle?: ILineStyle & {
shadowBlur?: number; //Shadow width
shadowOffset?: number; //Offset
shadowColor?: string; //shadow color
};
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

${prefix} linkLineCreatable(boolean)
Whether the dependency line can be created, the default value is false

Not required

${prefix} linkLineSelectable(boolean)
Whether the dependency line is selectable, the default is true

Not required

${prefix} linkLineSelectedStyle(ITaskLinkSelectedStyle)

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
