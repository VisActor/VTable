{{ target: common-gantt-mark-line }}

IMarkLine specific definition:

```
export interface IMarkLine {
  date: string;
  style?: IMarkLineStyle | ((args: IMarkLineStyleArgumentType) => IMarkLineStyle);
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

export type IMarkLineStyle = Omit<ILineStyle, 'lineWidth'> & {
  lineWidth?: number | ((args: IMarkLineStyleArgumentType) => number);
};

export type IMarkLineStyleArgumentType = {
  date: Date;
  dateIndex: number;
  dateX: number;
  cellStartX: number;
  cellWidth: number;
  timelineColWidth: number;
  millisecondsPerPixel: number;
};
```

${prefix} date(string)

Specify date

Required

${prefix} style(IMarkLineStyle | (args: IMarkLineStyleArgumentType) => IMarkLineStyle)

Mark line style

Optional

{{ use: common-gantt-line-style }}

`style` can be configured as a function. The function is re-executed whenever the mark line refreshes, such as after timeline zooming, so the style can be recalculated from the latest timeline size.

`style.lineWidth` also supports a function value, which can be used to dynamically calculate the mark line width based on the current zoom state.

Function arguments:

```
export type IMarkLineStyleArgumentType = {
  date: Date; // The mark line date
  dateIndex: number; // The date cell index where the mark line is located
  dateX: number; // The mark line x position in the timeline coordinate system
  cellStartX: number; // The start x position of the date cell containing the mark line
  cellWidth: number; // The current width of the date cell containing the mark line
  timelineColWidth: number; // The current timeline column width after zoom or scale changes
  millisecondsPerPixel: number; // Current milliseconds represented by one pixel
};
```

Example:

```javascript
markLine: [
  {
    date: '2024-07-17',
    style: {
      lineWidth: ({ timelineColWidth }) => Math.max(1, Math.round(timelineColWidth / 20)),
      lineColor: 'blue',
      lineDash: [8, 4]
    }
  }
]
```

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
