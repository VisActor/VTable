{{ target: common-gantt-dependency-line }}

具体定义：

```
{
  links: ITaskLink[];
  linkLineStyle?: ILineStyle;
  linkCreatable?: boolean;
  linkSelectable?: boolean;
  linkDeletable?: boolean;
  linkSelectedLineStyle?: ITaskLinkSelectedStyle;
  /** 创建关联线的操作点 */
  linkCreatePointStyle?: IPointStyle;
  /** 创建关联线的操作点响应状态效果 */
  linkCreatingPointStyle?: IPointStyle;
  /** 创建关联线的操作线样式 */
  linkCreatingLineStyle?: ILineStyle;
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

${prefix} linkCreatable(boolean)
依赖线是否可创建，默认为 false。如果为 true，当点击任务条时，会出现创建依赖线的操作点。

非必填

${prefix} linkSelectable(boolean)
依赖线是否可选择，默认为 true

非必填

${prefix} linkSelectedLineStyle(ITaskLinkSelectedStyle)

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

${prefix} linkCreatePointStyle(IPointStyle)

点击任务条出现的创建依赖线的操作点样式

非必填

{{ use: common-gantt-point-style }}

${prefix} linkCreatingPointStyle(IPointStyle)

创建依赖线时的操作点响应状态效果

非必填

{{ use: common-gantt-point-style }}

${prefix} linkCreatingLineStyle(ILineStyle)

创建依赖线时的操作线样式

非必填

{{ use: common-gantt-line-style }}
