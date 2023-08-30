{{ target: chart-column-type }}

#${prefix} columns.chart(string)

Specify the column type as 'chart', the columnType can be omitted and defaults to 'text'

##${prefix} columnType(string) = 'chart'

Specify the column type as 'chart', the columnType can be omitted and defaults to 'text'

{{ use: base-column-type(
    prefix = '##'+${prefix},
) }}

##${prefix} chartModule(string)

**Chart type exclusive configuration options**

Corresponding to the injected chart library component name

##${prefix} chartSpec(any|Function)

**Chart type exclusive configuration options**

Corresponding to the chart library's spec, the value is provided in the records
