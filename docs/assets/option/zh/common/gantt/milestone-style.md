{{ target: common-gantt-task-bar-milestone-style }}

IMilestoneStyle 的定义为：

```
export interface IMilestoneStyle {
  /** 里程碑边框颜色 */
  borderColor?: string;
  /** 里程碑边框宽度 */
  borderLineWidth?: number;
  /** 里程碑填充颜色 */
  fillColor?: string;
  /** 里程碑正方形圆角 */
  cornerRadius?: number;
  /** 里程碑默认是个正方形，这个width配置正方形的边长 */
  width?: number;
}
```
