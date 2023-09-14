{{ target: circle-custom-element }}

${prefix} type (string) ='circle'

**Required**

Element type, in this case, a circle.

{{ use: base-custom-element(
    prefix = ${prefix},
) }}

${prefix} radius (number | string | ((value: string) => number | string))

**Required**

Circle radius, can be a number, string, or a function that returns a number or string.

${prefix} stroke (string | ((value: string) => string))

Circle stroke color, can be a string or a function that returns a string.

${prefix} fill (string | ((value: string) => string))

Circle fill color, can be a string or a function that returns a string.