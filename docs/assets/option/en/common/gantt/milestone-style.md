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
}
