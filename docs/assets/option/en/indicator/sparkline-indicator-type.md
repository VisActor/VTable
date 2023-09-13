{{ target: sparkline-indicator-type }}

#${prefix} indicators.sparkline(string)

Specify the column type as 'sparkline', cellType can be omitted with default value 'text'


##${prefix} cellType(string) = 'sparkline'

Specify the column type as 'sparkline', cellType can be omitted with default value 'text'

{{ use: base-indicator-type(
    prefix = '##'+${prefix}
) }}

##${prefix} sparklineSpec(SparklineSpec|Function)

**Sparkline type exclusive configuration**

Configure the specific spec for the sparkline chart


```
sparklineSpec?: SparklineSpec | ((arg0: CellInfo) => SparklineSpec);
```

Specific configuration items for sparklineSpec: TODO

{{ use: sparkline-spec(
    prefix = '##'+${prefix}
) }}