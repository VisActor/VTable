
{{ target: pivot-corner-define }}

${prefix} titleOnDimension(string) ='row'

角头标题显示内容依据：
- 'column' 列维度名称作为角头单元格内容
- 'row' 行维度名称作为角头单元格内容
- 'none' 角头单元格内容为空

${prefix} headerType(string)

表头类型，可指为`'text'|'image'|'link'`。

${prefix} headerStyle(TODO)

表头单元格样式，配置项根据headerType不同有略微差别。每种headerStyle的配置项可参考：

- headerType为'text'，对应[headerStyle](../option/PivotTable-columns-text#headerStyle.bgColor)
- headerType为'link'，对应[headerStyle](../option/PivotTable-columns-link#headerStyle.bgColor)
- headerType为'image'，对应[headerStyle](../option/PivotTable-columns-image#headerStyle.bgColor)