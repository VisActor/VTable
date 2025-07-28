{{ target: common-gantt-timeline-header-style }}

The definition of ITimelineHeaderStyle is:

```
export interface ITimelineHeaderStyle {
  padding?: number | number[];
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  strokeColor?: string;
  textAlign?: 'center' | 'end' | 'left' | 'right' | 'start'; // Sets the horizontal alignment of the text within the cell
  textOverflow?: string;
  textBaseline?: 'alphabetic' | 'bottom' | 'middle' | 'top'; // Sets the vertical alignment of the text within the cell
  textStick?: boolean;
}
```
