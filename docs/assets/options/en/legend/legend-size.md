{{ target: component-legend-size }}

#${prefix} legends.size(Object)

Continuous size legend configuration.

**TODO: Add discrete legend illustration**

##${prefix} type(string) = 'size'

**Required**, for declaring the size legend type, the value is `'size'`.

{{ use: component-base-legend(
  prefix = '#' + ${prefix} 
) }}

{{
  use: component-continuous-legend(
    prefix = '#' + ${prefix} 
  )
}}

##${prefix} sizeBackground(Object)

**Effective only for size legends, i.e. `type: 'size'`**, size legend background style configuration.

##${prefix}  sizeRange([number, number])

**Required**, the shape range of the shape legend, which is an array consisting of two numbers, the start size and the end size, such as `[0, 50]`。

##${prefix}  value([number, number])

**Required**The numerical range displayed by the shape legend, which is an array composed of two numbers, the start data and the end data, such as `[0, 100]`。

##${prefix}  max(number)

**Required**, the maximum value of the shape legend.

##${prefix}  min(number)

**Required**, the minimum value of the shape legend.