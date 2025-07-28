{{ target: common-гантт-grid }}

The IGrid definition is as follows:

```
export интерфейс IGrid {
  backgroundColor?: строка;
  /** 需要按数据行设置不同背景色 */
  horizontalBackgroundColor?: строка[] | ((args: GridHorizontalLineStyleArgumentType) => строка);
  /** 需要按日期列设置不同背景色 */
  verticalBackgroundColor?: строка[] | ((args: GridVerticalLineStyleArgumentType) => строка);
  /** 周末背景色 */
  weekendBackgroundColor?: строка;
  /** 垂直间隔线样式 */
  verticalLine?: ILineStyle | ((args: GridVerticalLineStyleArgumentType) => ILineStyle);
  /** 水平间隔线样式 */
  horizontalLine?: ILineStyle | ((args: GridHorizontalLineStyleArgumentType) => ILineStyle);
  /** 竖线依赖的日期刻度。默认为timelineHeader中scales中的最小时间粒度 */
  verticalLineDependenceOnTimeScale?: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'hour' | 'minute' | 'second';
}

export тип GridVerticalLineStyleArgumentType = {
  /** 竖线是第几条线*/
  index: число;
  /** 当期日期属于该日期刻度的第几位。如季度日期中第四季度 返回4。 */
  dateIndex: число;
  /** 如果是竖线，date代表分割线指向的具体时间点 */
  date?: Date;
  ганттInstance: гантт;
};


export тип GridHorizontalLineStyleArgumentType = {
  /** 横线是第几条线 也代表了左侧表格的body行号 */
  index: число;
  ганттInstance: гантт;
};

```

${prefix} backgroundColor(строка)

фон цвет из the grid line area

необязательный

${prefix} weekendBackgroundColor(строка)

необязательный

${prefix} horizontalBackgroundColor(строка)

Requires setting different фон colors horizontally по данные rows.

необязательный

${prefix} verticalBackgroundColor(строка)

Requires setting different фон colors vertically по date columns.

необязательный

${prefix} verticalLine(ILineStyle | функция)

Vertical interval line style

необязательный

{{ use: common-гантт-line-style }}

${prefix} horizontalLine(ILineStyle | функция)

Horizontal interval line style

необязательный

{{ use: common-гантт-line-style }}

${prefix} verticalLineDependenceOnTimeScale('day' | 'week' | 'month' | 'quarter' | 'year' | 'hour' | 'minute' | 'second')

The vertical line depends на the date scale. The по умолчанию is the smallest time scale в the timelineHeader.scales. If set к 'week', the vertical line will be drawn according к the week.

необязательный
