{{ target: common-gantt-grid }}

IGrid定义如下：
```
export interface IGrid {
  backgroundColor?: string;
  verticalLine?: ILineStyle;
  horizontalLine?: ILineStyle;
}
```

${prefix} backgroundColor(string)

网格线区域背景颜色

非必填

${prefix} verticalLine(ILineStyle)

垂直间隔线样式

非必填

{{ use: common-gantt-line-style }}

${prefix} horizontalLine(ILineStyle)

水平间隔线样式

非必填

{{ use: common-gantt-line-style }}