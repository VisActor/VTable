{{ target: common-gantt-task-bar-style }}

ITaskBarStyle 的定义为：

```
export interface ITaskBarStyle {
  /** 任务条的颜色 */
  barColor?: string;
  /** 已完成部分任务条的颜色 */
  completedBarColor?: string;
  /** 任务条的宽度 */
  width?: number;
  /** 任务条的圆角 */
  cornerRadius?: number;
  /** 任务条的边框 */
  borderLineWidth?: number;
  /** 边框颜色 */
  borderColor?: string;
  /** 任务条最小尺寸，当任务条计算宽度过小时，可以保证任务条可以正常展示 */
  minSize?: number;
}
```
