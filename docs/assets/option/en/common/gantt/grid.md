{{ target: common-gantt-grid }}

The IGrid definition is as follows:

```
export interface IGrid {
  backgroundColor?: string;
  /** 需要按数据行设置不同背景色 */
  horizontalBackgroundColor?: string[] | ((args: GridHorizontalLineStyleArgumentType) => string);
  /** 需要按日期列设置不同背景色 */
  verticalBackgroundColor?: string[] | ((args: GridVerticalLineStyleArgumentType) => string);
  /** 周末背景色 */
  weekendBackgroundColor?: string;
  /** 垂直间隔线样式 */
  verticalLine?: ILineStyle | ((args: GridVerticalLineStyleArgumentType) => ILineStyle);
  /** 水平间隔线样式 */
  horizontalLine?: ILineStyle | ((args: GridHorizontalLineStyleArgumentType) => ILineStyle);
  /** 竖线依赖的日期刻度。默认为timelineHeader中scales中的最小时间粒度 */
  verticalLineDependenceOnTimeScale?: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'hour' | 'minute' | 'second';
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


export type GridHorizontalLineStyleArgumentType = {
  /** 横线是第几条线 也代表了左侧表格的body行号 */
  index: number;
  ganttInstance: Gantt;
};

```

${prefix} backgroundColor(string)

Background color of the grid line area

Optional

${prefix} weekendBackgroundColor(string)

Optional

${prefix} horizontalBackgroundColor(string)

Requires setting different background colors horizontally by data rows.

Optional

${prefix} verticalBackgroundColor(string)

Requires setting different background colors vertically by date columns.

Optional

${prefix} verticalLine(ILineStyle | Function)

Vertical interval line style

Optional

{{ use: common-gantt-line-style }}

${prefix} horizontalLine(ILineStyle | Function)

Horizontal interval line style

Optional

{{ use: common-gantt-line-style }}

${prefix} verticalLineDependenceOnTimeScale('day' | 'week' | 'month' | 'quarter' | 'year' | 'hour' | 'minute' | 'second')

The vertical line depends on the date scale. The default is the smallest time scale in the timelineHeader.scales. If set to 'week', the vertical line will be drawn according to the week.

Optional
