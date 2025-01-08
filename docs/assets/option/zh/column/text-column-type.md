{{ target: text-cell-type }}

#${prefix} columns.text(string)

指定该列或该行单元格类型为'text'，cellType 缺省的话会被默认为'text'

##${prefix} cellType(string) = 'text'

指定该列或该行单元格类型为'text'，cellType 缺省的话会被默认为'text'

{{ use: base-cell-type(
    prefix = '##'+${prefix}
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

**text 类型专属配置项** 是否对相同内容合并单元格

可参考示例：[mergeCell](../demo/basic-functionality/merge)
