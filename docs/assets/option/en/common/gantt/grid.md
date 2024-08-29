{{ target: common-gantt-grid }}

The IGrid definition is as follows:
```
export interface IGrid {
  backgroundColor?: string;
  verticalLine?: ILineStyle;
  horizontalLine?: ILineStyle;
}
```

${prefix} backgroundColor(string)

Background color of the grid line area

Optional

${prefix} verticalLine(ILineStyle)

Vertical interval line style

Optional

{{ use: common-gantt-line-style }}

${prefix} horizontalLine(ILineStyle)

Horizontal interval line style

Optional

{{ use: common-gantt-line-style }}
