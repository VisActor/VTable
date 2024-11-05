{{ target: chart-cell-type }}

#${prefix} columns.chart(string)

Specify the column type as 'chart', the cellType can be omitted and defaults to 'text'

##${prefix} cellType(string) = 'chart'

Specify the column type as 'chart', the cellType can be omitted and defaults to 'text'

{{ use: base-cell-type(
    prefix = '##'+${prefix},
) }}

##${prefix} chartModule(string)

**Chart type exclusive configuration options**

Corresponding to the injected chart library component name

##${prefix} chartSpec(any|Function)

**Chart type exclusive configuration options**

Set the spec of the chart, or set it to a function that returns a different spec. The data displayed in the chart is provided by records.

##${prefix} noDataRenderNothing(boolean) = false

Do not render the chart when there is no data. Defaults to false
