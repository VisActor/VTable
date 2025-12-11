{{ target: sparkline-cell-тип }}

#${prefix} columns.sparkline(строка)

Specify the column тип as 'sparkline', cellType can be omitted и defaults к 'текст'

##${prefix} cellType(строка) = 'sparkline'

Specify the column тип as 'sparkline', cellType can be omitted и defaults к 'текст'

{{ use: base-cell-тип(
    prefix = '##'+${prefix}
) }}

##${prefix} sparklineSpec(SparklineSpec | функция)

**Sparkline тип exclusive configuration item**

Configure the specific spec configuration item из the mini график


```
sparklineSpec?: SparklineSpec | ((arg0: CellInfo) => SparklineSpec);
```

Specific sparklineSpec configuration items: TODO

{{ use: sparkline-spec(
    prefix = '##'+${prefix}
) }}