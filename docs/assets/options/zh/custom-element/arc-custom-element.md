{{ target: arc-custom-element }}

${prefix} type (string) ='arc'

**必填**

元素类型，此处为圆弧。

{{ use: base-custom-element(
    prefix = ${prefix},
) }}

${prefix} radius (number | string | ((value: string) => number | string))

**必填**

圆弧半径，可以是数字、字符串或返回数字或字符串的函数。

${prefix} startAngle (number | ((value: string) => number))

圆弧起始角度，可以是数字或返回数字的函数。

${prefix} endAngle (number | ((value: string) => number))

圆弧结束角度，可以是数字或返回数字的函数。

${prefix} stroke (string | ((value: string) => string))

圆弧描边颜色，可以是字符串或返回字符串的函数。

${prefix} fill (string | ((value: string) => string))

圆弧填充颜色，可以是字符串或返回字符串的函数。