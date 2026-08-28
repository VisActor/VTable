# Gantt Mark Line

VTable-Gantt component supports adding mark lines on the Gantt chart, which can be used to represent important time nodes of the entire project.

## Configuration

markLine supports (boolean | IMarkLine | Array<IMarkLine>) type,

- boolean: Whether to display the mark line, the default is false. When the mark line configuration is false, the mark line is not displayed.
- IMarkLine: Single mark line configuration
- Array<IMarkLine>: Multiple mark line configurations

The configuration items of IMarkLine are as follows:

```javascript
export interface IMarkLine {
  date: string;
  style?: IMarkLineStyle | ((args: IMarkLineStyleArgumentType) => IMarkLineStyle);
  /** The position of the mark line under the date column. The default is 'left'. */
  position?: 'left' | 'right' | 'middle' | 'date';
  /** Automatically scroll the date range to include this mark line. */
  scrollToMarkLine?: boolean;
  content?: string; // markLine content
  /** The style of the content in the markLine. */
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

## Mark Line Style

The configuration example of the mark line style is as follows:

```javascript
const ganttOptions = {
  markLine: [
    {
      date: '2024-01-01',
      style: {
        lineColor: 'red',
        lineWidth: 1,
      },
    },
    {
      date: '2024-01-02',
      style: {
        lineColor: 'blue',
        lineWidth: 2,
      },
    },
  ],
};
```

When the mark line width needs to change with timeline zooming, configure `style.lineWidth` as a function. The function is re-executed whenever the mark line refreshes, and its argument includes the current timeline column width, cell width, and milliseconds-per-pixel ratio:

```javascript
const ganttOptions = {
  markLine: [
    {
      date: '2024-07-17',
      content: 'Dynamic width',
      style: {
        lineWidth: ({ timelineColWidth }) => Math.max(1, Math.round(timelineColWidth / 20)),
        lineColor: 'blue',
        lineDash: [8, 4]
      }
    }
  ]
};
```

You can also configure the whole `style` as a function:

```javascript
const ganttOptions = {
  markLine: [
    {
      date: '2024-07-17',
      style: ({ millisecondsPerPixel }) => ({
        lineWidth: millisecondsPerPixel > 86400000 ? 1 : 3,
        lineColor: 'red'
      })
    }
  ]
};
```

## Mark Line Position

The position configuration of markLine supports 'left' | 'right' | 'middle' | 'date' four types,

- 'left': The mark line is displayed on the left of the date column
- 'right': The mark line is displayed on the right of the date column
- 'middle': The mark line is displayed in the middle of the date column
- 'date': The mark line is displayed in the position of the date column

## Mark Line Content and Style

The content configuration of markLine supports string type,

- string: Mark line content

The content style configuration of markLine supports ITaskBarLabelTextStyle type,

- ITaskBarLabelTextStyle: Mark line content style

Example:

```javascript
const ganttOptions = {
  markLine: [
    {
      date: '2024-01-01',
      content: '项目启动',
      contentStyle: {
        color: 'red',
        fontSize: '16px',
        fontWeight: 'bold',
      },
    },
  ],
};  
```

## Whether the Gantt chart automatically scrolls to the mark line position

The scroll configuration of markLine supports boolean type,

- boolean: Whether to automatically scroll to the mark line

Example:

```javascript
const ganttOptions = {
  markLine: [
    {
      date: '2024-01-01',
      scrollToMarkLine: true,
    },
  ],
};
```
Normally, if the date '2024-01-01' is outside the display range of the Gantt chart, when the `scrollToMarkLine: true` configuration is set, the Gantt chart will automatically scroll to the mark line position.
