# 甘特图任务条布局模式

在 Gantt 中，任务条的布局模式决定了任务条的显示效果。可以通过`tasksShowMode`配置项设置，Gantt 提供了以下几种任务条布局模式：

- `Tasks_Separate`: 每一个任务节点用单独一行来展示，父任务占用一行，子任务分别占用一行。这是默认的显示效果!
- `Sub_Tasks_Separate`: 省去父任务节点不展示，且所有子任务的节点分别用一行展示。（仅支持一层子任务的展示。）
- `Sub_Tasks_Inline`: 省去父任务节点不展示，并把所有子任务的节点都放到同一行来展示。（仅支持一层子任务的展示。）
- `Sub_Tasks_Arrange`: 省去父任务节点不展示，且所有子任务会维持 records 中的数据顺序布局，并保证节点不重叠展示。（仅支持一层子任务的展示。）
- `Sub_Tasks_Compact`: 省去父任务节点不展示，且所有子任务会按照日期早晚的属性来布局，并保证节点不重叠的紧凑型展示。（仅支持一层子任务的展示。）
- `Project_Sub_Tasks_Inline`: 针对设置了`type`为`project`的任务，会按照`Sub_Tasks_Inline`的模式来展示（非展开情况下）。其他type不是`project`的任务仍然则按照`Tasks_Separate`的模式来展示。（不限制子任务的层级。）


# 配置方式

Gantt 任务条布局模式的配置方式如下：

```
import * as VTableGantt from '@visactor/vtable-gantt';
const options={
    ...
    tasksShowMode: VTableGantt.TYPES.TasksShowMode.Sub_Tasks_Compact,
    ...
}
```

# 示例展示

下面分别展示不同的任务条布局模式的效果，以下面的一份数据为例：

```
const options={
  ...
  records:[
    {
      id: 0,
      name: 'Planning',
      start: '2024-11-15',
      end: '2024-11-21',
      children: [
        {
          id: 1,
          name: 'Michael Smith',
          start: '2024-11-15',
          end: '2024-11-17',
          avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/wolf.jpg'
        },
        {
          id: 2,
          name: 'Emily',
          start: '2024-11-17',
          end: '2024-11-18',
          avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
        },
        {
          id: 3,
          name: 'Rramily',
          start: '2024-11-19',
          end: '2024-11-20',
          avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
        },
        {
          id: 4,
          name: 'Lichael Join',
          start: '2024-11-18',
          end: '2024-11-19',
          avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/wolf.jpg'
        }
      ]
    },
    ...
  ]
}
```

## Tasks_Separate

这种模式下：
- 父任务占用一行
- 每个子任务分别占用一行
- 适合需要清晰展示每个任务的层次结构的场景

利用上面数据的展示效果为：父任务`id: 0`占用一行，子任务`id: 1~4`分别占用一行。布局效果如下：

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-task-separate.png)

## Sub_Tasks_Separate

这种模式下：
- 父任务节点不显示
- 每个子任务分别占用一行
- 适合只关注具体子任务情况而非分组的场景

利用上面数据的展示效果为：父任务`id: 0`只在第一列展示了任务名称，子任务`id: 1~4`分别占用一行（注意这里没有行分割线）。布局效果如下：

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-sub-task-separate.png)

## Sub_Tasks_Inline

这种模式下：
- 父任务节点不显示
- 所有子任务显示在同一行上
- 适合需要紧凑展示相关子任务的场景

利用上面数据的展示效果为：父任务`id: 0`只在第一列展示了任务名称，子任务`id: 1~4`都在同一行展示。布局效果如下：

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-sub-task-inline.png)

## Sub_Tasks_Arrange

`Sub_Tasks_Arrange`省去父任务节点不展示，且所有子任务会维持 records 中的数据顺序布局，并保证节点不重叠展示。

这种模式下：
- 父任务节点不显示
- 子任务按照数据中的顺序排列
- 自动调整布局避免任务条重叠
- 适合需要保持原始数据顺序的场景

利用上面数据的展示效果为：父任务`id: 0`只在第一列展示了任务名称，子任务`id: 1~4`会按照 records 中的数据顺序布局，并保证节点不重叠展示。布局效果如下：

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-sub-task-arrange.png)

## Sub_Tasks_Compact

`Sub_Tasks_Compact`省去父任务节点不展示，且所有子任务会按照日期早晚的属性来布局，并保证节点不重叠的紧凑型展示。

这种模式下：
- 父任务节点不显示
- 子任务按照开始日期排序
- 自动调整布局实现最紧凑的展示
- 适合需要最大化利用空间的场景

利用上面数据的展示效果为：父任务`id: 0`只在第一列展示了任务名称，子任务`id: 1~4`会按照日期`start`早晚的属性来布局，并保证节点不重叠的紧凑型展示。布局效果如下：

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-sub-task-compact.png)

**注意：`Sub_Tasks_Compact`和`Sub_Tasks_Arrange`的区别在于`Arrange`的话，不会改变 records 中的数据顺序，但是布局不是最紧密的。而`Compact`的话，会改变 records 中的数据顺序，但是布局是最紧密的，且当移动任务的位置时都会触发重新布局**

## Project_Sub_Tasks_Inline

这种模式下：
- 仅项目类型的任务特殊处理，其他任务正常显示
- 当项目任务折叠时，子任务会内联显示在项目任务行上
- 当项目任务展开时，子任务按照常规树形结构显示
- 通过`projectSubTasksExpandable`配置控制是否支持展开/折叠功能
- 适合需要区别对待项目任务和普通任务的场景

利用上面数据的展示效果为：当项目任务`id: 0`是折叠状态时，子任务`id: 1~4`会内联显示在项目任务行上，当项目任务`id: 0`是展开状态时，子任务`id: 1~4`按照常规树形结构显示。布局效果如下：

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-project-sub-tasks-inline.gif)
