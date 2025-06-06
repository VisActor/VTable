{{ target: common-gantt-mark-line }}

IMarkLine specific definition:

```
export interface IMarkLine {
  date: string;
  style?: ILineStyle;
  /** The position where the mark line is displayed under the date column. Default is 'left' */
  position?: 'left' | 'right' | 'middle' | 'date';
  /** Automatically include the mark line within the date range */
  scrollToMarkLine?: boolean;
  content?: string; // markLine content
  /** markLine content style */
  contentStyle?: {
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    backgroundColor?: string;
    cornerRadius?: string;
  }
}
```

${prefix} date(string)

Specify date

Required

${prefix} style(ILineStyle)

Mark line style

Optional

{{ use: common-gantt-line-style }}

${prefix} position('left' | 'right' | 'middle' | 'date')

The position where the mark line is displayed under the date column. Default is 'left'

'date 'is located based on the specific time

Optional

${prefix} scrollToMarkLine(boolean)

Automatically include the mark line within the date range. If set to true and the mark line is not within the display range, it will automatically scroll to the display range.

Default is true. If markLine is an array and multiple mark lines have scrollToMarkLine set to true, only the first one set to true will be recognized.

If no value is set, the first one is defaulted to true.

Optional

${prefix} contentStyle

markLine content style

Optional

```
export type IContentStyle = {
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    backgroundColor?: string;
    cornerRadius?: string;
};
```
