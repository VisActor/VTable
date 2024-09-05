{{ target: common-gantt-task-bar-custom-layout }}
任务条自定义渲染，对应的类型为 ITaskBarCustomLayout，具体配置项如下：

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