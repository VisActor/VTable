{{ target: common-gantt-task-bar-label-text-style }}

The definition of ITaskBarLabelTextStyle is:
```
export interface ITaskBarLabelTextStyle {
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  textAlign?: 'center' | 'end' | 'left' | 'right' | 'start'; // Sets the horizontal alignment of the text within the cell
  textOverflow?: string;
  textBaseline?: 'alphabetic' | 'bottom' | 'middle' | 'top'; // Sets the vertical alignment of the text within the cell
  padding?: number | number[];
}
```
