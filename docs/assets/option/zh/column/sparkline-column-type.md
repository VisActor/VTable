{{ target: sparkline-cell-type }}

#${prefix} columns.sparkline(string)

指定该列或该行单元格类型为'sparkline'，cellType 缺省的话会被默认为'text'

##${prefix} cellType(string) = 'sparkline'

指定该列或该行单元格类型为'sparkline'，cellType 缺省的话会被默认为'text'

{{ use: base-cell-type(
    prefix = '##'+${prefix}
) }}

##${prefix} sparklineSpec(SparklineSpec|Function)

**sparkline 类型专属配置项**

配置迷你图图表的具体 spec 配置项

```
sparklineSpec?: SparklineSpec | ((arg0: CellInfo) => SparklineSpec);
```

sparklineSpec 具体配置项：TODO

{{ use: sparkline-spec(
    prefix = '##'+${prefix}
) }}
