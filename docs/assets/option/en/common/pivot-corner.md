{{ target: pivot-corner-define }}

${prefix} titleOnDimension(string) ='row'

Corner header content display based on:

- 'column' The column dimension name is used as the corner header cell content
- 'row' The row dimension name is used as the corner header cell content
- 'none' The corner header cell content is empty
- 'all' means the header cell content is the concatenation of the row dimension name and the column dimension name

${prefix} customRender(Function|Object)
Custom rendering for body corner header cell, in function or object form. The type is: `ICustomRenderFuc | ICustomRenderObj`.

[demo link](../demo/custom-render/complex-corner)

${prefix} customLayout(Function)

Custom layout element definition for body cell, suitable for complex layout content.

```
(args: CustomRenderFunctionArg) => ICustomLayoutObj;
```

${prefix} headerType(string)

Header type, can be set to `'text'|'image'|'link'`.

${prefix} headerStyle(TODO)

Header cell style, the configuration items vary slightly depending on the headerType. The configuration items for each headerStyle can be found at:

- For headerType 'text', refer to [headerStyle](../option/PivotTable-columns-text#headerStyle.bgColor)
- For headerType 'link', refer to [headerStyle](../option/PivotTable-columns-link#headerStyle.bgColor)
- For headerType 'image', refer to [headerStyle](../option/PivotTable-columns-image#headerStyle.bgColor)
