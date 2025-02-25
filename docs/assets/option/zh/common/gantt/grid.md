{{ target: common-gantt-grid }}

IGrid 定义如下：

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
  /** The vertical line is what line */
  index: number;
  /** The current date belongs to the number of the date scale. Such as quarter date in fourth quarter return 4。 */
  dateIndex: number;
  /** If it is a vertical line, date represents the specific point in time to which the divider points */
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

网格线区域背景颜色

非必填

${prefix} weekendBackgroundColor(string)

周末背景颜色。仅当 scale 为 `day` 时生效。

非必填

${prefix} horizontalBackgroundColor(string)

需要横向按数据行设置不同背景色

非必填

${prefix} verticalBackgroundColor(string)

需要纵向按日期列设置不同背景色

非必填

${prefix} verticalLine(ILineStyle | Function)

垂直间隔线样式

非必填

{{ use: common-gantt-line-style }}

${prefix} horizontalLine(ILineStyle | Function)

水平间隔线样式

非必填

{{ use: common-gantt-line-style }}

${prefix} verticalLineDependenceOnTimeScale('day' | 'week' | 'month' | 'quarter' | 'year' | 'hour' | 'minute' | 'second')

竖线依赖的日期刻度。默认为timelineHeader中scales中的最小时间粒度。如设置为'week'，则竖线将根据周来绘制。

非必填
