{{ target: image-custom-layout-element }}

{{ use: base-custom-layout-element(
    prefix = ${prefix},
) }}

${prefix} width (number)

**必填**

图片的宽度。

${prefix} height (number)

**必填**

图片的高度。

${prefix} src (string)

图片的 URL。

${prefix} shape ('circle' | 'square')

图片的形状，可以是 'circle'（圆形）或 'square'（正方形），默认为 'square'。