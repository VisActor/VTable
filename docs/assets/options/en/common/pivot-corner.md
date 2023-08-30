{{ target: pivot-corner-define }}

${prefix} titleOnDimension(string) ='row'

Corner header content display based on:
- 'column' The column dimension name is used as the corner header cell content
- 'row' The row dimension name is used as the corner header cell content
- 'none' The corner header cell content is empty

${prefix} headerType(string)

Header type, can be set to `'text'|'image'|'link'`.

${prefix} headerStyle(TODO)

Header cell style, the configuration items vary slightly depending on the headerType. The configuration items for each headerStyle can be found at:

- For headerType 'text', refer to [headerStyle](url TODO use the corresponding one in dimension)
- For headerType 'link', refer to [headerStyle](url)
- For headerType 'image', refer to [headerStyle](url)