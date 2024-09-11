{{ target: common-gantt-timeline-header-style }}

ITimelineHeaderStyle的定义为：

```
export interface ITimelineHeaderStyle {
  padding?: number | number[];
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  strokeColor?: string;
  textAlign?: 'center' | 'end' | 'left' | 'right' | 'start'; // 设置单元格内文字的水平对齐方式
  textOverflow?: string;
  textBaseline?: 'alphabetic' | 'bottom' | 'middle' | 'top'; // 设置单元格内文字的垂直对齐方式
  textStick?: boolean;
}
```