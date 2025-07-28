{{ target: флажок-cell-тип }}

#${prefix} columns.флажок(строка)

Specify the column тип as 'флажок', cellType can be omitted и defaults к 'текст'

##${prefix} cellType(строка) = 'флажок'

Specify the column тип as 'флажок', cellType can be omitted и defaults к 'текст'

{{ use: base-cell-тип(
    prefix = '##'+${prefix},
    isCheckbox = true
) }}

##${prefix} checked(логический|функция) = false

**Configuration item exclusive к флажок тип**

Whether the флажок is в the checked state, setting here means specifying the флажок state из the entire column. If there is a corresponding state в the record данные entry, the state в the данные will be used первый.

If headerType is set к `флажок`, the status из the header флажок will depend на this setting. If this setting is empty, it will depend на the checked status из каждый piece из данные.

##${prefix} отключить(логический|функция) = false

**Configuration item exclusive к флажок тип**

Whether the флажок is в a отключен interactive state
