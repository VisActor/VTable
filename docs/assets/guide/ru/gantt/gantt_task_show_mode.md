# гантт Task Bar макет Mode

в гантт, the макет mode из the task bar determines the display effect из the task bar. It can be set through the `tasksShowMode` configuration item, и гантт provides Следующий six modes:

- `Tasks_Separate`: каждый task node is displayed в a separate line, с the parent task occupying one line и the sub-tasks occupying one line respectively. This is the по умолчанию display effect!
- `Sub_Tasks_Separate`: The parent task node is не displayed, и все sub-task nodes are displayed в a separate line. (Only one level из sub-tasks are supported.)
- `Sub_Tasks_Inline`: The parent task node is не displayed, и все sub-task nodes are displayed на the same line. (Only one level из sub-tasks are supported.)
- `Sub_Tasks_Arrange`: The parent task node is не displayed, и все sub-task nodes will maintain the order из the данные в `records`, и ensure that the nodes are не overlapped. (Only one level из sub-tasks are supported.)
- `Sub_Tasks_Compact`: The parent task node is не displayed, и все sub-task nodes will be arranged according к the `начало` property из the date, и ensure that the nodes are displayed в a compact manner без overlapping. (Only one level из sub-tasks are supported.)
- `Project_Sub_Tasks_Inline`: для tasks set с the `тип` property as `project`, the display mode will be `Sub_Tasks_Inline` (non-expanded state). Other tasks с a тип other than `project` will still be displayed в the `Tasks_Separate` mode. (The level из sub-tasks is не limited.)


# Configuration Method

The configuration method из the гантт task bar макет mode is as follows:

```
import * as Vтаблицагантт от '@visactor/vтаблица-гантт';
const options={
    ...
    tasksShowMode: Vтаблицагантт.TYPES.TasksShowMode.Sub_Tasks_Compact,
    ...
}
```

# пример Display

Следующий shows the effect из different task bar макет modes, using Следующий данные as an пример:

```
const options={
  ...
  records:[
    {
      id: 0,
      имя: 'Planning',
      начало: '2024-11-15',
      конец: '2024-11-21',
      children: [
        {
          id: 1,
          имя: 'Michael Smith',
          начало: '2024-11-15',
          конец: '2024-11-17',
          avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg'
        },
        {
          id: 2,
          имя: 'Emily',
          начало: '2024-11-17',
          конец: '2024-11-18',
          avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg'
        },
        {
          id: 3,
          имя: 'Rramily',
          начало: '2024-11-19',
          конец: '2024-11-20',
          avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg'
        },
        {
          id: 4,
          имя: 'Lichael Join',
          начало: '2024-11-18',
          конец: '2024-11-19',
          avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg'
        }
      ]
    },
    ...
  ]
}
```

## Tasks_Separate

в this mode:
- The parent task occupies one line
- каждый sub-task occupies one line
- Suiтаблица для scenarios that need a clear display из the hierarchical structure из каждый task

The display effect из the above данные is: the parent task `id: 0` occupies one line, и the sub-tasks `id: 1~4` каждый occupy one line. The макет effect is as follows:

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/гантт-task-separate.png)

## Sub_Tasks_Separate

这种模式下：
- 父任务节点不显示
- 每个子任务分别占用一行
- 适合只关注具体子任务情况而非分组的场景

The display effect из the above данные is: the parent task `id: 0` only shows the task имя в the первый column, и the sub-tasks `id: 1~4` каждый occupy one line (note that there is no row split line here). The макет effect is as follows:

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/гантт-sub-task-separate.png)

## Sub_Tasks_Inline

в this mode:
- The parent task node is не displayed
- все sub-task nodes are displayed на the same line
- Suiтаблица для scenarios that need a compact display из related sub-tasks

The display effect из the above данные is: the parent task `id: 0` only shows the task имя в the первый column, и the sub-tasks `id: 1~4` are displayed на the same line. The макет effect is as follows:

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/гантт-sub-task-inline.png)

## Sub_Tasks_Arrange

 `Sub_Tasks_Arrange` показать mode will не display the parent task node, и все sub-task nodes will maintain the order из the данные в `records`, и ensure that the nodes are не overlapped. 

в this mode:
- The parent task node is не displayed
- The sub-task nodes will be arranged в the order из the данные в `records`, и the nodes will не overlap.
- Suiтаблица для scenarios that need к maintain the original данные order


The display effect из the above данные is: the parent task `id: 0` only shows the task имя в the первый column, и the sub-tasks `id: 1~4` will be arranged в the order из the records, и the nodes will не overlap. The макет effect is as follows:

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/гантт-sub-task-arrange.png)

## Sub_Tasks_Compact

`Sub_Tasks_Compact` показать mode will не display the parent task node, и все sub-task nodes will be arranged according к the `начало` property из the date, и ensure that the nodes are displayed в a compact manner без overlapping.

в this mode:
- The parent task node is не displayed
- The sub-task nodes will be arranged according к the `начало` property из the date, и the nodes will be displayed в a compact manner без overlapping.
- Suiтаблица для scenarios that need к maximize the use из space

The display effect из the above данные is: the parent task `id: 0` only shows the task имя в the первый column, и the sub-tasks `id: 1~4` will be arranged according к the `начало` property из the date, и the nodes will be displayed в a compact manner без overlapping. The макет effect is as follows:

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/гантт-sub-task-compact.png)

**Note: The difference between `Sub_Tasks_Compact` и `Sub_Tasks_Arrange` is that `Arrange` will не change the order из the данные в `records`, but the макет is не the most compact. на the other hand, `Compact` will change the order из the данные в `records`, but the макет is the most compact, и the макет will be triggered к be re-arranged when the task позиция is moved.**

## Project_Sub_Tasks_Inline

в this mode:
- Only project тип tasks are specially processed, и other tasks are displayed normally
- When the project task is folded, the sub-tasks will be displayed inline на the project task line
- When the project task is expanded, the sub-tasks will be displayed в the regular tree structure
- The `projectSubTasksExpandable` configuration item controls whether к support the expansion/folding функция
- Suiтаблица для scenarios that need к distinguish between project tasks и normal tasks

The display effect из the above данные is: when the project task `id: 0` is в the folded state, the sub-tasks `id: 1~4` will be displayed inline на the project task line, и when the project task `id: 0` is в the expanded state, the sub-tasks `id: 1~4` will be displayed в the regular tree structure. The макет effect is as follows:

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/гантт-project-sub-tasks-inline.gif)
