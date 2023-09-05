{{ target: chart-column-type }}

#${prefix} columns.chart(string)

指定列类型为'chart'，cellType 缺省的话会被默认为'text'

##${prefix} cellType(string) = 'chart'

指定列类型为'chart'，cellType 缺省的话会被默认为'text'

{{ use: base-column-type(
    prefix = '##'+${prefix},
) }}

##${prefix} chartModule(string)

**chart 类型专属配置项**

对应注入的图表库组件名称

##${prefix} chartSpec(any|Function)

**chart 类型专属配置项**

对应图表库的 spec 其中 value 对应在 records 中提供
