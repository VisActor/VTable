{{ target: chart-indicator-type }}

#${prefix} indicators.chart(string)

Specify the column type as 'chart', cellType can be omitted and defaults to 'text'

##${prefix} cellType(string) = 'chart'

Specify the column type as 'chart', cellType can be omitted and defaults to 'text'

##${prefix} chartModule(string)

**Exclusive configuration options for chart type**

Corresponding to the name of the injected chart library component, the injection method can refer to [tutorial](../../guide/cell_type/chart). Currently only supports injecting VChart charting library!

##${prefix} chartSpec(any|Function)

**Exclusive configuration options for chart type**

Set the spec of the chart, or set it to a function that returns a different spec. The data displayed in the chart is provided by records.

{{ use: base-indicator-type(
    prefix = '##'+${prefix}
) }}

##${prefix} noDataRenderNothing(boolean) = false

Do not render the chart when there is no data. Defaults to false
