{{ target: common-gantt-task-bar-style }}

The definition of ITaskBarStyle is:

```
export interface ITaskBarStyle {
  /** The color of the task bar */
  barColor?: string;
  /** The color of the completed part of the task bar */
  completedBarColor?: string;
  /** The width of the task bar */
  width?: number;
  /** The corner radius of the task bar */
  cornerRadius?: number;
  /** The border width of the task bar */
  borderLineWidth?: number;
  /** The border color of the task bar */
  borderColor?: string;
}
```
