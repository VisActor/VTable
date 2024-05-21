{{ target: row-series-number }}

${prefix} title(string)

Row serial number title, empty by default

${prefix} width(number|number)

The row number width can be configured with number or 'auto'. (Default uses defaultColWidth, which defaults to 80)

${prefix} format(Function)

Row serial number formatting function, empty by default. Through this configuration, you can convert numerical type serial numbers into custom serial numbers, such as using a, b, c...

${prefix} cellType('text')

Row number cell type, default is `text`. Other formats to be determined

${prefix} dragOrder(boolean)

Whether the row serial number sequence can be dragged. The default is false. If set to true, the icon at the dragging position will be displayed, and you can drag and drop on the icon to change its position. If you need to replace the icon, you can configure it yourself. Please refer to the tutorial: https://visactor.io/vtable/guide/custom_define/custom_icon for the chapter on resetting function icons.

${prefix} headerStyle(IStyleOption|Function)

Table header cell style, please refer to: [headerStyle](../option/PivotTable-columns-text#headerStyle.bgColor)

${prefix} style

Body cell style, please refer to: [style](../option/ListTable-columns-text#style.bgColor)

${prefix} disableColumnResize(boolean)

Whether to disable row serial number width adjustment.The default is false.