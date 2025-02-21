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

${prefix} headerIcon(string|Object|Array)

Table header cell icon configuration. The configurable types are:

```
string | ColumnIconOption | (string | ColumnIconOption)[];
```

For detailed configuration of ColumnIconOption, please refer to [Definition](./ListTable-columns-text#icon.ColumnIconOption)

${prefix} icon(string|Object|Array|Funciton)

Body cell icon configuration.

```
icon?:
| string
| ColumnIconOption
| (string | ColumnIconOption)[]
| ((args: CellInfo) => string | ColumnIconOption | (string | ColumnIconOption)[]);
```

#${prefix}ColumnIconOption

```
type ColumnIconOption = ImageIcon | SvgIcon | TextIcon;
```

#${prefix}ImageIcon(Object)
type is set to 'image'. The image address needs to be set in src
{{ use: image-icon( prefix = '##' + ${prefix}) }}

#${prefix}SvgIcon(Object)
type is set to 'svg'. You need to configure the svg address or the complete svg file string in svg
{{ use: svg-icon( prefix = '##' + ${prefix}) }}

#${prefix}TextIcon(Object)
type is set to 'text'. You need to configure the text content in content
{{ use: text-icon( prefix = '##' + ${prefix}) }}

${prefix} headerCustomLayout(Function)
The header cell custom layout element definition, this custom form is suitable for cells with complex content layout.

```
(args: CustomRenderFunctionArg) => ICustomLayoutObj;
```

{{ use: common-CustomRenderFunctionArg() }}

{{ use: custom-layout(
prefix = '#'+${prefix},
) }}

${prefix} customLayout(Function)

The body cell custom layout element definition is suitable for cells with complex content layout.

Defined as the following function:

```
(args: CustomRenderFunctionArg) => ICustomLayoutObj;
```

{{ use: common-CustomRenderFunctionArg() }}

{{ use: custom-layout(
prefix = '#'+${prefix},
) }}
