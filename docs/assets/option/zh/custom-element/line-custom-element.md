{{ target: line-custom-element }}

${prefix} type (string) ='line'

**必填**

元素类型，此处为线。

{{ use: base-custom-element(
    prefix = ${prefix},
) }}

${prefix} points ({x: number, y: number}[] | ((value: string) => {x: number, y: number}[]))

**必填**

组成line的点坐标。

${prefix} lineWidth (number | ((value: string) => number))

线描边宽度。

${prefix} stroke (string | ((value: string) => string))

线描边颜色。
