{{ target: component-legend-color }}

#${prefix} legends.color(Object)

Continuous color legend configuration.

**TODO: Add discrete legend illustration**

##${prefix} type(string) = 'color'

**Required**, used to declare the color legend type, the value is `'color'`.

{{ use: component-base-legend(
  prefix = '#' + ${prefix} 
) }}

{{
  use: component-continuous-legend(
    prefix = '#' + ${prefix} 
  )
}}

##${prefix}  colors(string[])

**Required**,  The color range of the color legend, which is an array composed of a set of color strings, such as `['#2ec7c9','#b6a2de','#5ab1ef]`.

##${prefix}  value([number, number])

**Required**, The numerical range displayed by the color legend, which is an array composed of two numbers, the start data and the end data, such as `[0, 100]`.

##${prefix}  max(number)

**Required**, the maximum value of the color legend.

##${prefix}  min(number)

**Required**, the minimum value of the color legend.