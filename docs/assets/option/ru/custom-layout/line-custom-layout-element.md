{{ target: line-custom-layout-element }}

{{ use: base-custom-layout-element(
    prefix = ${prefix},
) }}

${prefix}points ({x: number, y: number}[]) 

**必填**

The coordinates of the points that make up the line.

${prefix}lineWidth (number)

Stroke width.

${prefix}stroke (string)

Stroke color.