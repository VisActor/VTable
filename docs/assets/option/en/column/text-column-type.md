{{ target: text-cell-type }}

#${prefix} columns.text(string)

Specify the column type as 'text', cellType can be omitted and defaults to 'text'

##${prefix} cellType(string) = 'text'

Specify the column type as 'text', cellType can be omitted and defaults to 'text'

{{ use: base-cell-type(
    prefix = '##' + ${prefix}
) }}

##${prefix} mergeCell(Boolean|Function)

```
type MergeCellOption = Boolean | ((v1: unknown, v2: unknown, {
    source: {
      col: number;
      row: number;
    };
    target: {
      col: number;
      row: number;
    };
    table: Table;
  }) => boolean);
```
**Exclusive configuration item for text type** Merge cells with the same content

You can refer to the example: [mergeCell](../demo/basic-functionality/merge)
