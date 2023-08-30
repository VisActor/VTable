{{ target: image-custom-layout-element }}

{{ use: base-custom-layout-element(
    prefix = ${prefix},
) }}

${prefix} width (number)

**Required**

The width of the image.

${prefix} height (number)

**Required**

The height of the image.

${prefix} src (string)

The URL of the image.

${prefix} shape ('circle' | 'square')

The shape of the image, which can be 'circle' (round) or 'square' (square), with the default being 'square'.