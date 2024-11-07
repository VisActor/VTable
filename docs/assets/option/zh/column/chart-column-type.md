{{ target: chart-cell-type }}

#${prefix} columns.chart(string)

指定该列或该行单元格类型为'chart'，cellType 缺省的话会被默认为'text'

##${prefix} cellType(string) = 'chart'

指定该列或该行单元格类型为'chart'，cellType 缺省的话会被默认为'text'

{{ use: base-cell-type(
    prefix = '##'+${prefix},
) }}

##${prefix} chartModule(string)

**chart 类型专属配置项**

对应注入的图表库组件名称

##${prefix} chartSpec(any|Function)

**chart 类型专属配置项**

设置图表的 spec，或者设置成函数返回不同的 spec。其中显示在图表的数据是对应在 records 中提供。

##${prefix} noDataRenderNothing(boolean) = false

没有数据时不渲染图表 默认为 false
