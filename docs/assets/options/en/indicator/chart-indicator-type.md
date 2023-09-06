{{ target: chart-indicator-type }}

#${prefix} indicators.chart(string)

Specify the column type as 'chart', cellType can be omitted and defaults to 'text'

##${prefix} cellType(string) = 'chart'

Specify the column type as 'chart', cellType can be omitted and defaults to 'text'

##${prefix} chartModule(string)

**Exclusive configuration options for chart type**

Corresponding to the name of the injected chart library component, the injection method can refer to [tutorial](/tutorials/cell_type/chart). Currently only supports injecting VChart charting library!

##${prefix} chartSpec(any|Function)

**Exclusive configuration options for chart type**

Corresponds to the chart library's spec, where value corresponds to the provided records

{{ use: base-indicator-type(
    prefix = '##'+${prefix}
) }}
