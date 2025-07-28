{{ target: common-gantt-task-bar-custom-layout }}
Task bar custom rendering, the corresponding type is ITaskBarCustomLayout, the specific configuration items are as follows:

```
export type TaskBarCustomLayoutArgumentType = {
  width: number;
  height: number;
  index: number;
  startDate: Date;
  endDate: Date;
  taskDays: number;
  progress: number;
  taskRecord: any;
  ganttInstance: Gantt;
};
export type ITaskBarCustomLayout = (args: TaskBarCustomLayoutArgumentType) => ITaskBarCustomLayoutObj;
export type ITaskBarCustomLayoutObj = {
  rootContainer: VRender.Group;
  renderDefaultBar?: boolean; // 默认false
  renderDefaultResizeIcon?: boolean; // 默认false
  renderDefaultText?: boolean; // 默认false
};
```