{{ target: текст-indicator-тип }}

#${prefix} indicators.текст(строка)

Specifies the column тип as 'текст'，cellType can be omitted и defaults к 'текст'

##${prefix} cellType(строка) = 'текст'

Specifies the column тип as 'текст'，cellType can be omitted и defaults к 'текст'

{{ use: base-indicator-тип(
    prefix = '##'+${prefix}
) }}