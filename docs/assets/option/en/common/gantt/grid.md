{{ target: common-gantt-grid }}

The IGrid definition is as follows:

```
export interface IGrid {
  backgroundColor?: string;
  verticalLine?: ILineStyle | ((args: GridVerticalLineStyleArgumentType) => ILineStyle);
  horizontalLine?: ILineStyle | ((args: GridHorizontalLineStyleArgumentType) => ILineStyle);
}

export type GridVerticalLineStyleArgumentType = {
  /** 竖线是第几条线*/
  index: number;
  /** 当期日期属于该日期刻度的第几位。如季度日期中第四季度 返回4。 */
  dateIndex: number;
  /** 如果是竖线，date代表分割线指向的具体时间点 */
  date?: Date;
  ganttInstance: Gantt;
};

```

${prefix} backgroundColor(string)

Background color of the grid line area

Optional

${prefix} verticalLine(ILineStyle | Function)

Vertical interval line style

Optional

{{ use: common-gantt-line-style }}

${prefix} horizontalLine(ILineStyle | Function)

Horizontal interval line style

Optional

{{ use: common-gantt-line-style }}
