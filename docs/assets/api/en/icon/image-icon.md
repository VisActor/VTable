{{ target: image-icon }}

${prefix} type ('image')
The content type of the icon is 'image'.

${prefix} src (string)
Image URL

${prefix} shape ('circle' | 'square')
Image cropping shape

${prefix} isGif (boolean)
whether it is a gif image

{{ use: base-icon(
    prefix = ${prefix}
) }}