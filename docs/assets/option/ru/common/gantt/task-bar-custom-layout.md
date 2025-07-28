{{ target: common-гантт-task-bar-пользовательский-макет }}
Task bar пользовательский rendering, the corresponding тип is ITaskBarпользовательскиймакет, the specific configuration items are as follows:

```
export тип TaskBarпользовательскиймакетArgumentType = {
  ширина: число;
  высота: число;
  index: число;
  startDate: Date;
  endDate: Date;
  taskDays: число;
  progress: число;
  taskRecord: любой;
  ганттInstance: гантт;
};
export тип ITaskBarпользовательскиймакет = (args: TaskBarпользовательскиймакетArgumentType) => ITaskBarпользовательскиймакетObj;
export тип ITaskBarпользовательскиймакетObj = {
  rootContainer: VRender.Group;
  renderDefaultBar?: логический; // 默认false
  renderDefaultResizeиконка?: логический; // 默认false
  renderDefaultText?: логический; // 默认false
};
```