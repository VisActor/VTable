{{ target: common-gantt-task-bar-label-text-style }}

ITaskBarLabelTextStyle 的定义为：

```
export interface ITaskBarLabelTextStyle {
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  textAlign?: 'center' | 'end' | 'left' | 'right' | 'start'; // 设置单元格内文字的水平对齐方式
  textOverflow?: string;
  textBaseline?: 'alphabetic' | 'bottom' | 'middle' | 'top'; // 设置单元格内文字的垂直对齐方式
  padding?: number | number[];
  /** 相对于任务条文字方位位置，可选值：'left', 'top', 'right', 'bottom'，分别代表左、上、右、下四个方向 */
  orient?: 'left' | 'top' | 'right' | 'bottom';
  /** 只有当文本在 taskbar 中容纳不下时，会根据该方位将文本显示在任务条旁边。当配置 orient 时，该配置无效 */
  orientHandleWithOverflow?: 'left' | 'top' | 'right' | 'bottom';
}
```
