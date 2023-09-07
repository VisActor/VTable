{{ target: arc-custom-element }}

${prefix} type (string) ='arc'

**Required**

Element type, here is an arc.

{{ use: base-custom-element(
    prefix = ${prefix},
) }}

${prefix} radius (number | string | ((value: string) => number | string))

**Required**

Arc radius, can be a number, a string, or a function that returns a number or string.

${prefix} startAngle (number | ((value: string) => number))

Arc starting angle, can be a number or a function that returns a number.

${prefix} endAngle (number | ((value: string) => number))

Arc ending angle, can be a number or a function that returns a number.

${prefix} stroke (string | ((value: string) => string))

Arc stroke color, can be a string or a function that returns a string.

${prefix} fill (string | ((value: string) => string))

Arc fill color, can be a string or a function that returns a string.