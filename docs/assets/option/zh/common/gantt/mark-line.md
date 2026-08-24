{{ target: common-gantt-mark-line }}

IMarkLine 具体定义：

```
export interface IMarkLine {
  date: string;
  style?: IMarkLineStyle | ((args: IMarkLineStyleArgumentType) => IMarkLineStyle);
  /** 标记线显示在日期列下的位置 默认为'left' */
  position?: 'left' | 'right' | 'middle' | 'date';
  /** 自动将日期范围内包括该标记线 */
  scrollToMarkLine?: boolean;
  content?: string; // markLine中内容
  /** markLine中内容的样式 */
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

指定日期

必填

${prefix} style(IMarkLineStyle | (args: IMarkLineStyleArgumentType) => IMarkLineStyle)

标记线样式

非必填

{{ use: common-gantt-line-style }}

`style` 支持配置为函数，函数会在标记线刷新时重新执行，例如缩放时间轴后会基于最新时间轴尺寸重新计算样式。

`style.lineWidth` 也支持配置为函数，可用于根据当前缩放状态动态计算标记线宽度。

函数参数说明：

```
export type IMarkLineStyleArgumentType = {
  date: Date; // 标记线对应日期
  dateIndex: number; // 标记线所在日期单元格索引
  dateX: number; // 标记线在时间轴坐标系中的 x 坐标
  cellStartX: number; // 标记线所在日期单元格起始 x 坐标
  cellWidth: number; // 标记线所在日期单元格当前宽度
  timelineColWidth: number; // 当前缩放或时间刻度下的时间轴列宽
  millisecondsPerPixel: number; // 当前每像素代表的毫秒数
};
```

示例：

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

标记线显示在日期列下的位置 默认为'left'

'date' 则根据具体时间定位

非必填

${prefix} scrollToMarkLine(boolean)

自动将日期范围内，包括改标记线。如果设置了 true 的标记线不在显示范围内，则会自动滚动到显示范围内。

默认为 true。如果 markLine 是个数组，且其中有多个 scrollToMarkLine 为 true 的标记线，只会认准其中第一个设置为 true 的标记线。

如果都未设置值，则默认第一个为 true。

非必填

${prefix} contentStyle

markLine 中内容的样式

非必填

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
