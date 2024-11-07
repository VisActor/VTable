{{ target: chart-indicator-type }}

#${prefix} indicators.chart(string)

指定列类型为'chart'，cellType 缺省的话会被默认为'text'

##${prefix} cellType(string) = 'chart'

指定列类型为'chart'，cellType 缺省的话会被默认为'text'

##${prefix} chartModule(string)

**chart 类型专属配置项**

对应注入的图表库组件名称，注入方式可以参考[教程](../../guide/cell_type/chart)。目前仅支持注入 VChart 图表库！

##${prefix} chartSpec(any|Function)

**chart 类型专属配置项**

设置图表的 spec，或者设置成函数返回不同的 spec。其中显示在图表的数据由 records 提供。

{{ use: base-indicator-type(
    prefix = '##'+${prefix}
) }}

##${prefix} noDataRenderNothing(boolean) = false

没有数据时不渲染图表 默认为 false
