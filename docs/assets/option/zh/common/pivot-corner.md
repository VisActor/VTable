{{ target: pivot-corner-define }}

${prefix} titleOnDimension(string) ='row'

角头标题显示内容依据：

- 'column' 列维度名称作为角头单元格内容
- 'row' 行维度名称作为角头单元格内容
- 'none' 角头单元格内容为空
- 'all' 角头单元格内容为行维度名称和列维度名称的拼接

${prefix} customRender(Function|Object)
自定义表格左上角区域的单元格, 参数: `ICustomRenderFuc | ICustomRenderObj`.

[demo](../demo/custom-render/complex-corner)

${prefix} customLayout(Function)

自定义表格左上角布局元素定义，适用于复杂布局内容，可实现斜线表头等需求。

```
(args: CustomRenderFunctionArg) => ICustomLayoutObj;
```

${prefix} headerType(string)

表头类型，可指为`'text'|'image'|'link'`。

${prefix} headerStyle(TODO)

表头单元格样式，配置项根据 headerType 不同有略微差别。每种 headerStyle 的配置项可参考：

- headerType 为'text'，对应[headerStyle](../option/PivotTable-columns-text#headerStyle.bgColor)
- headerType 为'link'，对应[headerStyle](../option/PivotTable-columns-link#headerStyle.bgColor)
- headerType 为'image'，对应[headerStyle](../option/PivotTable-columns-image#headerStyle.bgColor)
