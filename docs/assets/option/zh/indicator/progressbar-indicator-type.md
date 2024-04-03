{{ target: progressbar-indicator-type }}

#${prefix} indicators.progressbar(string)

指定列类型为'progressbar'，cellType 缺省的话会被默认为'text'

##${prefix} cellType(string) = 'progressbar'

指定列类型为'progressbar'，cellType 缺省的话会被默认为'text'

{{ use: base-indicator-type(
    prefix = '##'+${prefix},
    isProgressbar = true,
) }}

##${prefix} min(number|Function) = 0

**progressbar 类型专属配置项**

进度条展示范围的最最小数据，支持通过函数动态获取

##${prefix} max(number|Function) = 100

**progressbar 类型专属配置项**

进度条展示范围的最最小数据，支持通过函数动态获取

##${prefix} barType(string) = 'default'

**progressbar 类型专属配置项**

进度条类型 默认 default。

- default：由 min 到 max 的进度条

- negative：考虑 min 为负值，进度条会以 0 为分割，显示正负两个方向的进度条

- negative_no_axis：展示与 negative 相同，没有 0 值坐标轴

##${prefix} dependField(string)

**progressbar 类型专属配置项**

进度图依赖的数据，如果需要单元格展示的文字和进度图使用的数据字段不同，在 dependField 里配置进度图使用的数据字段
