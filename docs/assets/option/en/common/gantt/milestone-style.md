{{ target: common-gantt-task-bar-milestone-style }}

The definition of IMilestoneStyle is:

```
export interface IMilestoneStyle {
  /** Milestone border color */
  borderColor?: string;
  /** Milestone border width */
  borderLineWidth?: number;
  /** Milestone fill color */
  fillColor?: string;
  /** Milestone square corner radius */
  cornerRadius?: number;
  /** The milestone is a square by default, and this width configures the length of the square edge */
  width?: number;
  /** The milestone label. Supports either a fixed string or a template string */
  labelText?: ITaskBarLabelText;
  /** Milestone Text Style */
  labelTextStyle:{
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    padding?: number | number[];
  }
  /** Position of text relative to milestone */
  textOrient?: 'left' | 'top' | 'right' | 'bottom';
}
```
