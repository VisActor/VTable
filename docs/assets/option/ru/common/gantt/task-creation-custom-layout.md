{{ target: common-гантт-task-creation-пользовательский-макет }}
Taskbar пользовательский rendering, the corresponding тип из ITaskCreationпользовательскиймакет, specific configuration items as follows:

```
export тип TaskCreationпользовательскиймакетArgumentType = {
  ширина: число;
  высота: число;
  index: число;
  ганттInstance: гантт;
};
export тип ITaskCreationпользовательскиймакетObj = {
  rootContainer: Group;
};
export тип ITaskCreationпользовательскиймакет = (args: TaskCreationпользовательскиймакетArgumentType) => ITaskCreationпользовательскиймакетObj;
```
