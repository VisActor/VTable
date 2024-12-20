{{ target: common-gantt-grid }}

IGrid 定义如下：

```
export interface IGrid {
  backgroundColor?: string;
  verticalLine?: ILineStyle | ((args: GridVerticalLineStyleArgumentType) => ILineStyle);
  horizontalLine?: ILineStyle | ((args: GridHorizontalLineStyleArgumentType) => ILineStyle);
}

export type GridVerticalLineStyleArgumentType = {
  /** The vertical line is what line */
  index: number;
  /** The current date belongs to the number of the date scale. Such as quarter date in fourth quarter return 4。 */
  dateIndex: number;
  /** If it is a vertical line, date represents the specific point in time to which the divider points */
  date?: Date;
  ganttInstance: Gantt;
};
```

${prefix} backgroundColor(string)

网格线区域背景颜色

非必填

${prefix} verticalLine(ILineStyle | Function)

垂直间隔线样式

非必填

{{ use: common-gantt-line-style }}

${prefix} horizontalLine(ILineStyle | Function)

水平间隔线样式

非必填

{{ use: common-gantt-line-style }}
