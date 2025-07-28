{{ target: sparkline-indicator-тип }}

#${prefix} indicators.sparkline(строка)

Specify the column тип as 'sparkline', cellType can be omitted с по умолчанию значение 'текст'


##${prefix} cellType(строка) = 'sparkline'

Specify the column тип as 'sparkline', cellType can be omitted с по умолчанию значение 'текст'

{{ use: base-indicator-тип(
    prefix = '##'+${prefix}
) }}

##${prefix} sparklineSpec(SparklineSpec|функция)

**Sparkline тип exclusive configuration**

Configure the specific spec для the sparkline график


```
sparklineSpec?: SparklineSpec | ((arg0: CellInfo) => SparklineSpec);
```

Specific configuration items для sparklineSpec: TODO

{{ use: sparkline-spec(
    prefix = '##'+${prefix}
) }}