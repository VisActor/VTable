{{ target: component-legend-size }}

#${prefix}  legends.size(string)

连续型尺寸图例配置。

**TODO: 补充离散图例图示**

##${prefix}  type(string) = 'size'

**必填**，用于声明尺寸图例类型，值为 `'size'`。

{{ use: component-base-legend(
  prefix = '#' + ${prefix} 
) }}

{{
  use: component-continuous-legend(
    prefix = '#' + ${prefix} 
  )
}}

##${prefix}  sizeBackground(Object)

**仅生效于尺寸图例，即 `type: 'size'`**，尺寸图例背景样式配置。

##${prefix}  sizeRange([number, number])

**必填**，指定图例的size像素区间范围，如：`[0, 50]`。

##${prefix}  value([number, number])

**必填**，指定数据范围，如：`[0, 100]`。

##${prefix}  max(number)

**必填**，指定最大数据范围。

##${prefix}  min(number)

**必填**，指定最小数据范围。