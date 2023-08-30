{{ target: pivot-header-title }}

${prefix} title(true|string) = true

Display the header title. The default is true, and the content displayed is a combination of the dimension names of each level, such as 'Region|Province'.

${prefix} headerType(string)

Header type can be specified as `'text'|'image'|'link'`.

${prefix} headerStyle(TODO)

Header cell style, configuration items are slightly different based on the headerType. Configuration items for each headerStyle can be found at:

- For headerType 'text', refer to [headerStyle](url TODO corresponding to the dimension)
- For headerType 'link', refer to [headerStyle](url)
- For headerType 'image', refer to [headerStyle](url)