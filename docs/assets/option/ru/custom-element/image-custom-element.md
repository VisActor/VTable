{{ target: image-custom-element }}

${prefix} type (string) ='image'

**Required**

The element type, which is an image in this case.

{{ use: base-custom-element(
    prefix = ${prefix},
) }}

${prefix} src (string | ((value: string) => string))

**Required**

The URL of the image, which can be a string or a function that returns a string.

${prefix} width (number | string | ((value: string) => number | string))

**Required**

The width of the image, which can be a number, a string, or a function that returns a number or a string.

${prefix} height (number | string | ((value: string) => number | string))

**Required**

The height of the image, which can be a number, a string, or a function that returns a number or a string.

${prefix} hover (Object)

The effect when the mouse hovers over the image.

#${prefix} x (number | string)

The x-coordinate of the hover effect.

#${prefix} y (number | string)

The y-coordinate of the hover effect.

#${prefix} width (number | string | ((value: string) => number | string))

The width of the hover effect, which can be a number, a string, or a function that returns a number or a string.

#${prefix} height (number | string | ((value: string) => number | string))

The height of the hover effect, which can be a number, a string, or a function that returns a number or a string.

#${prefix} bgColor (string)

The background color of the hover effect.

#${prefix} radius (number)

The border radius of the hover effect.

${prefix} shape ('circle' | 'square')

The shape of the image, which can be a circle or a square. If not specified, the default shape is a square.