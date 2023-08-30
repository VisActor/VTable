{{ target: sparkline-column-type }}

#${prefix} columns.sparkline(string)

Specify the column type as 'sparkline', columnType can be omitted and defaults to 'text'

##${prefix} columnType(string) = 'sparkline'

Specify the column type as 'sparkline', columnType can be omitted and defaults to 'text'

{{ use: base-column-type(
    prefix = '##'+${prefix}
) }}

##${prefix} sparklineSpec(SparklineSpec | Function)

**Sparkline type exclusive configuration item**

Configure the specific spec configuration item of the mini chart


```
sparklineSpec?: SparklineSpec | ((arg0: CellInfo) => SparklineSpec);
```

Specific sparklineSpec configuration items: TODO

{{ use: sparkline-spec(
    prefix = '##'+${prefix}
) }}