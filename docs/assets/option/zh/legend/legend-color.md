{{ target: component-legend-color }}

#${prefix}  legends.color(string)

连续型颜色图例配置。

**TODO: 补充离散图例图示**

##${prefix}  type(string) = 'color'

**必填**，用于声明颜色图例类型，值为 `'color'`。

{{ use: component-base-legend(
  prefix = '#' + ${prefix} 
) }}

{{
  use: component-continuous-legend(
    prefix = '#' + ${prefix} 
  )
}}

##${prefix}  colors(string[])

**必填**，指定颜色的数组，如：`['#2ec7c9','#b6a2de','#5ab1ef]`。

##${prefix}  value([number, number])

**必填**，指定图例当然范围状态，如：`[50, 100]`。

##${prefix}  max(number)

**必填**，指定图例数据范围的最大值。

##${prefix}  min(number)

**必填**，指定图例数据范围的最小值。