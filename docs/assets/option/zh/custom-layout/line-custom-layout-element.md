{{ target: line-custom-layout-element }}

{{ use: base-custom-layout-element(
    prefix = ${prefix},
) }}

${prefix}points ({x: number, y: number}[]) 

**必填**

组成line的点坐标。

${prefix}lineWidth (number)

描边宽度。

${prefix}stroke (string)

描边颜色。