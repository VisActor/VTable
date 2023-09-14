{{ target: icon-custom-element }}

${prefix} type (string) ='icon'

**Required**

Element type, which is an icon in this case.

{{ use: base-custom-element(
    prefix = ${prefix},
) }}

${prefix} svg (string | ((value: string) => string))

**Required**

The SVG string of the icon, it can be a string or a function returning a string.

${prefix} width (number | string | ((value: string) => number | string))

**Required**

Icon width, it can be a number, a string or a function returning a number or a string.

${prefix} height (number | string | ((value: string) => number | string))

**Required**

Icon height, it can be a number, a string or a function returning a number or a string.

${prefix} hover (Object)

Effects when the mouse hovers over it.

#${prefix} x (number | string)

The x coordinate of the hover effect.

#${prefix} y (number | string)

The y coordinate of the hover effect.

#${prefix} width (number | string | ((value: string) => number | string))

The width of the hover effect, it can be a number, a string or a function returning a number or a string.

#${prefix} height (number | string | ((value: string) => number | string))

The height of the hover effect, it can be a number, a string or a function returning a number or a string.

#${prefix} bgColor (string)

Background color of the mouse hover effect.

#${prefix} radius (number)

Border radius of the mouse hover effect.