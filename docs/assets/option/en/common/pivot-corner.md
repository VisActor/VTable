{{ target: pivot-corner-define }}

${prefix} titleOnDimension(string) ='row'

Corner header content display based on:

- 'column' The column dimension name is used as the corner header cell content
- 'row' The row dimension name is used as the corner header cell content
- 'none' The corner header cell content is empty
- 'all' means the header cell content is the concatenation of the row dimension name and the column dimension name

${prefix} headerType(string)

Header type, can be set to `'text'|'image'|'link'`.

${prefix} headerStyle(TODO)

Header cell style, the configuration items vary slightly depending on the headerType. The configuration items for each headerStyle can be found at:

- For headerType 'text', refer to [headerStyle](../option/PivotTable-columns-text#headerStyle.bgColor)
- For headerType 'link', refer to [headerStyle](../option/PivotTable-columns-link#headerStyle.bgColor)
- For headerType 'image', refer to [headerStyle](../option/PivotTable-columns-image#headerStyle.bgColor)
