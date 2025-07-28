{{ target: image-icon }}

${prefix} тип ('image')
Тип содержимого иконки - 'image'.

${prefix} src (строка)
URL изображения

${prefix} shape ('circle' | 'square')
Форма обрезки изображения

${prefix} isGif (логический)
является ли gif-изображением

{{ use: base-icon(
    prefix = ${prefix}
) }}