{{ target: row-series-number }}

${prefix} title(string)

行序号标题，默认为空

${prefix} width(number|number)

行序号宽度可配置 number 或者'auto'。（默认使用 defaultColWidth，该默认值为 80）

${prefix} format(Function)

行序号格式化函数，默认为空，通过该配置可以将数值类型的序号转换为自定义序号，如使用 a,b,c...

${prefix} cellType('text')

行序号单元格类型，默认为`text`。其他格式待定

${prefix} dragOrder(boolean)

是否可拖拽行序号顺序，默认为 false。如果设置为 true，会显示拖拽位置的图标，交互在该图标上可以拖拽来换位。如果需要替换该图标可以自行配置。可参考教程：https://visactor.io/vtable/guide/custom_define/custom_icon 中重置功能图标的章节。

${prefix} headerStyle(IStyleOption|Function)

表头单元格样式，可参考： [headerStyle](../option/PivotTable-columns-text#headerStyle.bgColor)

${prefix} style

body 单元格样式，可参考：[style](../option/ListTable-columns-text#style.bgColor)

${prefix} disableColumnResize(boolean)

是否禁止列宽调整，默认为 false