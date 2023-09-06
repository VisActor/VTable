{{ target: rect-custom-element }}

${prefix} type (string) ='rect'

**Required**

Element type, in this case, a rectangle.

{{ use: base-custom-element(
    prefix = ${prefix},
) }}

${prefix} width (number | string | ((value: string) => number | string))

**Required**

Rectangle width, can be a number, string, or a function that returns a number or string.

${prefix} height (number | string | ((value: string) => number | string))

**Required**

Rectangle height, can be a number, string, or a function that returns a number or string.

${prefix} stroke (string | ((value: string) => string))

Rectangle stroke color, can be a string or a function that returns a string.

${prefix} fill (string | ((value: string) => string))

Rectangle fill color, can be a string or a function that returns a string.

${prefix} radius (number | string | ((value: string) => number | string))

Rectangle corner radius, can be a number, string, or a function that returns a number or string.