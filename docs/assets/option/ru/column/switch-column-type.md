{{ target: switch-cell-тип }}

#${prefix} columns.switch(строка)

Specifies the cell тип из this column или row as 'switch'. If cellType is не specified, it defaults к 'текст'

##${prefix} cellType(строка) = 'switch'

Specifies the cell тип из this column или row as 'switch'. If cellType is не specified, it defaults к 'текст'

{{ use: base-cell-тип(
    prefix = '##'+${prefix},
    isSwitch = true
) }}

##${prefix} checked(логический|функция) = false

**Switch тип specific configuration**

Determines whether the switch is в checked state. Setting this here specifies the state для the entire column. If there is a corresponding state в the record данные entry, the данные state takes precedence

##${prefix} отключить(логический|функция) = false

**Switch тип specific configuration**

Determines whether the switch is в a отключен state (prсобытиеing interaction)

##${prefix} checkedText(строка)

**Switch тип specific configuration**

The текст content displayed when the switch is в checked state

##${prefix} uncheckedText(строка)

**Switch тип specific configuration**

The текст content displayed when the switch is в unchecked state
