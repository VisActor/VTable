{{ target: common-gantt-task-creation-custom-layout }}
任务条自定义渲染，对应的类型为 ITaskCreationCustomLayout，具体配置项如下：

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
