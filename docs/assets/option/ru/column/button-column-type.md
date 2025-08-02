{{ target: Кнопка-cell-тип }}

#${prefix} columns.Кнопка(строка)

Specifies the cell тип из this column или row as 'Кнопка'. If cellType is не specified, it defaults к 'текст'

##${prefix} cellType(строка) = 'Кнопка'

Specifies the cell тип из this column или row as 'Кнопка'. If cellType is не specified, it defaults к 'текст'

{{ use: base-cell-тип(
    prefix = '##'+${prefix},
    isКнопка = true
) }}

##${prefix} текст(строка)

The Кнопка текст content

##${prefix} отключить(логический|функция) = false

Determines whether the Кнопка is в a отключен state (prсобытиеing interaction)
