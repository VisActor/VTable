{{ target: common-gantt-dependency-line }}

具体定义：

```
{
    links: ITaskLink[];
    linkLineStyle?: ILineStyle;
    linkLineCreatable?: boolean;
    linkLineSelectable?: boolean;
    linkLineSelectedStyle?: ILineStyle & {
      shadowBlur?: number; //阴影宽度
      shadowOffset?: number; //偏移
      shadowColor?: string; //阴影颜色
    };
  }
```

${prefix} links(ITaskLink[])

指定任务直接的依赖关系，数组类型，数组元素为 ITaskLink 类型。

必填

ITaskLink 的定义为：

```
export type ITaskLink = {
  /** 依赖的类型 */
  type: DependencyType;
  linkedFromTaskKey?: string | number;
  linkedToTaskKey?: string | number;
};
```

DependencyType 枚举类型定义为：

```
export enum DependencyType {
  FinishToStart = 'finish_to_start',
  StartToStart = 'start_to_start',
  FinishToFinish = 'finish_to_finish',
  StartToFinish = 'start_to_finish'
}
```

${prefix} linkLineStyle(ILineStyle)

依赖线样式

非必填

{{ use: common-gantt-line-style }}

${prefix} linkLineCreatable(boolean)
依赖线是否可创建，默认为 false

非必填

${prefix} linkLineSelectable(boolean)
依赖线是否可选择，默认为 true

非必填

${prefix} linkLineSelectedStyle(ITaskLinkSelectedStyle)

依赖线选中样式

非必填

```
export type ITaskLinkSelectedStyle = ILineStyle & {
  shadowBlur?: number; //阴影宽度
  shadowOffset?: number; //偏移
  shadowColor?: string; //阴影颜色
};
```

{{ use: common-gantt-line-style }}
