{{ target: common-gantt-mark-line }}

IMarkLine 具体定义：

```
export interface IMarkLine {
  date: string;
  style?: ILineStyle;
  /** 标记线显示在日期列下的位置 默认为'left' */
  position?: 'left' | 'right' | 'middle';
  /** 自动将日期范围内 包括改标记线 */
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
