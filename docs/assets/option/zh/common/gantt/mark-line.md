{{ target: common-gantt-mark-line }}

IMarkLine具体定义：

```
export interface IMarkLine {
  date: string;
  style?: ILineStyle;
  /** 标记线显示在日期列下的位置 默认为'left' */
  position?: 'left' | 'right' | 'middle';
  /** 自动将日期范围内 包括改标记线 */
  scrollToMarkLine?: boolean;
}
```

${prefix} date(string)

指定日期

必填

${prefix} style(ILineStyle)

标记线样式

非必填

{{ use: common-gantt-line-style }}

${prefix} position('left' | 'right' | 'middle')

标记线显示在日期列下的位置 默认为'left'

非必填

${prefix} scrollToMarkLine(boolean)

自动将日期范围内，包括改标记线。如果设置了true的标记线不在显示范围内，则会自动滚动到显示范围内。

默认为true。如果markLine是个数组，且其中有多个scrollToMarkLine为true的标记线，只会认准其中第一个设置为true的标记线。

如果都未设置值，则默认第一个为true。

非必填

