
{{ target: pivot-header-title }}

${prefix} title(true|string) = true

显示表头标题。默认为true，显示内容则由各级的维度名称组合而成，如'地区|省份'。

${prefix} headerType(string)

表头类型，可指为`'text'|'image'|'link'`。

${prefix} headerStyle(TODO)

表头单元格样式，配置项根据headerType不同有略微差别。每种headerStyle的配置项可参考：

- headerType为'text'，对应[headerStyle](../option/PivotTable-columns-text#headerStyle.bgColor)
- headerType为'link'，对应[headerStyle](../option/PivotTable-columns-link#headerStyle.bgColor)
- headerType为'image'，对应[headerStyle](../option/PivotTable-columns-image#headerStyle.bgColor)