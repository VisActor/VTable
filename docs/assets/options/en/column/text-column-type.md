{{ target: text-column-type }}

#${prefix} columns.text(string)

Specify the column type as 'text', cellType can be omitted and defaults to 'text'

##${prefix} cellType(string) = 'text'

Specify the column type as 'text', cellType can be omitted and defaults to 'text'

{{ use: base-column-type(
    prefix = '##' + ${prefix}
) }}

##${prefix} mergeCell(boolean) = false

**Exclusive configuration item for text type** Merge cells with the same content

You can refer to the example: [TODO](url)