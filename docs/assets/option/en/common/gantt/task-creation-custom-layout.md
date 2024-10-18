{{ target: common-gantt-task-creation-custom-layout }}
Taskbar custom rendering, the corresponding type of ITaskCreationCustomLayout, specific configuration items as follows:

```
export type TaskCreationCustomLayoutArgumentType = {
  width: number;
  height: number;
  index: number;
  ganttInstance: Gantt;
};
export type ITaskCreationCustomLayoutObj = {
  rootContainer: Group;
};
export type ITaskCreationCustomLayout = (args: TaskCreationCustomLayoutArgumentType) => ITaskCreationCustomLayoutObj;
```
