{{ target: image-icon }}

${prefix} type ('image')
icon内容类型为 'image'。

${prefix} src (string)
图片地址

${prefix} shape ('circle' | 'square')
图片裁切形状

${prefix} isGif (boolean)
是否是gif图片

{{ use: base-icon(
    prefix = ${prefix}
) }}