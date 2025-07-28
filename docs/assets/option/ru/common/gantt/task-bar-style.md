{{ target: common-гантт-task-bar-style }}

The definition из ITaskBarStyle is:

```
export интерфейс ITaskBarStyle {
  /** The цвет из the task bar */
  barColor?: строка;
  /** The цвет из the completed part из the task bar */
  completedBarColor?: строка;
  /** The ширина из the task bar */
  ширина?: число;
  /** The corner radius из the task bar */
  cornerRadius?: число;
  /** The граница ширина из the task bar */
  borderLineширина?: число;
  /** The граница цвет из the task bar */
  borderColor?: строка;
  / ** The minimum размер из the task bar, when the ширина из the task bar is calculated к be too small, it can ensure that the task bar can be displayed normally */
  minSize?: число;
}
```
