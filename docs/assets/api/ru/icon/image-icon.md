{{ target: image-icon }}

${prefix} type ('image')
Тип содержимого иконки - 'image'.

${prefix} src (string)
URL изображения

${prefix} shape ('circle' | 'square')
Форма обрезки изображения

${prefix} isGif (boolean)
является ли gif-изображением

{{ use: base-icon(
    prefix = ${prefix}
) }}