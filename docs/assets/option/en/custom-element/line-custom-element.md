{{ target: line-custom-element }}

${prefix} type (string) ='line'

**必填**

Element type, here is an line.

{{ use: base-custom-element(
    prefix = ${prefix},
) }}

${prefix} points ({x: number, y: number}[] | ((value: string) => {x: number, y: number}[]))

**必填**

The coordinates of the points that make up the line.

${prefix} lineWidth (number | ((value: string) => number))

stroke width.

${prefix} stroke (string | ((value: string) => string))

stroke color.
