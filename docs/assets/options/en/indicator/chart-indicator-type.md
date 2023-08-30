{{ target: chart-indicator-type }}

#${prefix} indicators.chart(string)

Specify the column type as 'chart', columnType can be omitted and defaults to 'text'

##${prefix} columnType(string) = 'chart'

Specify the column type as 'chart', columnType can be omitted and defaults to 'text'

##${prefix} chartModule(string)

**Exclusive configuration options for chart type**

Corresponds to the injected chart library component name

##${prefix} chartSpec(any|Function)

**Exclusive configuration options for chart type**

Corresponds to the chart library's spec, where value corresponds to the provided records

{{ use: base-indicator-type(
    prefix = '##'+${prefix}
) }}
