{{ target: circle-custom-element }}

${prefix} type (string) ='circle'

**必填**

元素类型，此处为圆形。

{{ use: base-custom-element(
    prefix = ${prefix},
) }}

${prefix} radius (number | string | ((value: string) => number | string))

**必填**

圆形半径，可以是数字、字符串或返回数字或字符串的函数。

${prefix} stroke (string | ((value: string) => string))

圆形描边颜色，可以是字符串或返回字符串的函数。

${prefix} fill (string | ((value: string) => string))

圆形填充颜色，可以是字符串或返回字符串的函数。