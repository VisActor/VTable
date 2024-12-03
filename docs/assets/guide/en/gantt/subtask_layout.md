# Gantt Chart Task Bar Layout Modes

In the Gantt chart, the layout mode of the task bar determines the display effect of the task bar. The Gantt chart provides the following several task bar layout modes:

- `Tasks_Separate`: Each task node is displayed in a separate row, with the parent task occupying one row and the subtasks occupying separate rows respectively. This is the default display effect.
- `Sub_Tasks_Separate`: The parent task node is omitted and not displayed, and all subtask nodes are displayed in separate rows.
- `Sub_Tasks_Inline`: The parent task node is omitted and not displayed, and all subtask nodes are placed in the same row.
- `Sub_Tasks_Arrange`: The parent task node is omitted and not displayed, and all subtasks will maintain the data order in the records for layout, ensuring that the nodes do not overlap.
- `Sub_Tasks_Compact`: The parent task node is omitted and not displayed, and all subtasks will be laid out according to the date attribute from earliest to latest, ensuring a compact display without node overlap.

Among these layout modes, except for the default `Tasks_Separate` mode, the other modes only display the task bars of subtasks.

# Configuration Method

The configuration method for the Gantt chart task bar layout mode is as follows:

```
import * as VTableGantt from '@visactor/vtable-gantt';
const options={
    ...
    tasksShowMode: VTableGantt.TYPES.TasksShowMode.Sub_Tasks_Compact,
    ...
}
```

# Example Display

The following shows the effects of different task bar layout patterns, such as the following data:

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

`Tasks_Separate` is the default display effect, that is, each task node is displayed in a separate row.

The display effect using the above data is: the parent task `id: 0` occupies one row, and the subtasks `id: 1~4` occupy one row respectively. The layout effect is as follows:

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-task-separate.png)

## Sub_Tasks_Separate

`Sub_Tasks_Separate` omits the parent task node and does not display it, and places all subtask nodes in separate rows.

The display effect using the above data is: the parent task `id: 0` only shows the task name in the first column, and the subtasks `id: 1~4` occupy one row respectively (note that there is no row separator here). The layout effect is as follows:

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-sub-task-separate.png)

## Sub_Tasks_Inline

`Sub_Tasks_Inline` omits the parent task node and does not display it, and places all subtask nodes in the same row.

The display effect using the above data is: the parent task `id: 0` only shows the task name in the first column, and the subtasks `id: 1~4` are all displayed in the same row. The layout effect is as follows:

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-sub-task-inline.png)

## Sub_Tasks_Arrange

`Sub_Tasks_Arrange` omits the parent task node and does not display it, and all subtasks will maintain the data order in the records for layout, ensuring that the nodes do not overlap.

The display effect using the above data is: the parent task `id: 0` only shows the task name in the first column, and the subtasks `id: 1~4` will maintain the data order in the records for layout, ensuring that the nodes do not overlap. The layout effect is as follows:

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-sub-task-arrange.png)

## Sub_Tasks_Compact

`Sub_Tasks_Compact` omits the parent task node and does not display it, and all subtasks will be laid out according to the date attribute from earliest to latest, ensuring a compact display without node overlap.

The display effect using the above data is: the parent task `id: 0` only shows the task name in the first column, and the subtasks `id: 1~4` will be laid out according to the `start` date from earliest to latest, ensuring a compact display without node overlap. The layout effect is as follows:

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-sub-task-compact.png)

**Note: The difference between `Sub_Tasks_Compact` and `Sub_Tasks_Arrange` is that for `Arrange`, the data order in the records will not be changed, but the layout is not the most compact. For `Compact`, the data order in the records will be changed, but the layout is the most compact, and when the position of the task is moved, re-layout will be triggered.**
