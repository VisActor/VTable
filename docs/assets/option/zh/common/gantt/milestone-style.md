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
  /** 里程碑展示文字。可以配置固定文本 或者 字符串模版 */
  labelText?: ITaskBarLabelText;
  /** 里程碑文字样式 */
  labelTextStyle:{
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    padding?: number | number[];
  }
  /** 文字相对于里程碑的位置 */
  textOrient?: 'left' | 'top' | 'right' | 'bottom';
}
```
