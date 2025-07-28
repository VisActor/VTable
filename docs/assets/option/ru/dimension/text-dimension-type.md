{{ target: текст-dimension-тип }}

#${prefix} ${dimensionHeaderType}.текст(строка)

Specify the column тип as 'текст', headerType can be omitted и the по умолчанию is 'текст'

##${prefix} headerType(строка) = 'текст'

Specify the column тип as 'текст', headerType can be omitted и the по умолчанию is 'текст'

{{ use: base-dimension-тип(
    prefix = '##'+${prefix}
) }}