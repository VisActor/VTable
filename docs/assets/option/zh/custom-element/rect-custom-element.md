{{ target: rect-custom-element }}

${prefix} type (string) ='rect'

**必填**

元素类型，此处为矩形。

{{ use: base-custom-element(
    prefix = ${prefix},
) }}

${prefix} width (number | string | ((value: string) => number | string))

**必填**

矩形宽度，可以是数字、字符串或返回数字或字符串的函数。

${prefix} height (number | string | ((value: string) => number | string))

**必填**

矩形高度，可以是数字、字符串或返回数字或字符串的函数。

${prefix} stroke (string | ((value: string) => string))

矩形描边颜色，可以是字符串或返回字符串的函数。

${prefix} fill (string | ((value: string) => string))

矩形填充颜色，可以是字符串或返回字符串的函数。

${prefix} radius (number | string | ((value: string) => number | string))

矩形圆角半径，可以是数字、字符串或返回数字或字符串的函数。