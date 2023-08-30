{{ target: chart-indicator-type }}

#${prefix} indicators.chart(string)

指定列类型为'chart'，columnType 缺省的话会被默认为'text'

##${prefix} columnType(string) = 'chart'

指定列类型为'chart'，columnType 缺省的话会被默认为'text'

##${prefix} chartModule(string)

**chart 类型专属配置项**

对应注入的图表库组件名称，注入方式可以参考[教程](TODO)。目前仅支持注入 VChart 图表库！

##${prefix} chartSpec(any|Function)

**chart 类型专属配置项**

对应图表库的 spec，其中图表所需数据会对应在 records 中提供。

{{ use: base-indicator-type(
    prefix = '##'+${prefix}
) }}
