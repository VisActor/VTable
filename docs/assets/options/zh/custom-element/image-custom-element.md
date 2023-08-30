{{ target: image-custom-element }}

${prefix} type (string) ='image'

**必填**

元素类型，此处为图像。

{{ use: base-custom-element(
    prefix = ${prefix},
) }}

${prefix} src (string | ((value: string) => string))

**必填**

图像的 URL，可以是字符串或返回字符串的函数。

${prefix} width (number | string | ((value: string) => number | string))

**必填**

图像宽度，可以是数字、字符串或返回数字或字符串的函数。

${prefix} height (number | string | ((value: string) => number | string))

**必填**

图像高度，可以是数字、字符串或返回数字或字符串的函数。

${prefix} hover (Object)

鼠标悬停时的效果。

#${prefix} x (number | string)

悬停效果的 x 坐标。

#${prefix} y (number | string)

悬停效果的 y 坐标。

#${prefix} width (number | string | ((value: string) => number | string))

悬停效果的宽度，可以是数字、字符串或返回数字或字符串的函数。

#${prefix} height (number | string | ((value: string) => number | string))

悬停效果的高度，可以是数字、字符串或返回数字或字符串的函数。

#${prefix} bgColor (string)

鼠标悬停效果的背景颜色。

#${prefix} radius (number)

鼠标悬停效果的边框圆角半径。

${prefix} shape ('circle' | 'square')

图像的形状，可以是圆形或正方形。如果未指定，则为正方形。