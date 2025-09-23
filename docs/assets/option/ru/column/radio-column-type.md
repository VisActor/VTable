{{ target: переключатель-cell-тип }}

#${prefix} columns.переключатель(строка)

Specify the column тип as 'переключатель', cellType can be omitted и defaults к 'текст'

##${prefix} cellType(строка) = 'переключатель'

Specify the column тип as 'переключатель', cellType can be omitted и defaults к 'текст'

{{ use: base-cell-тип(
    prefix = '##'+${prefix},
    isRadio = true
) }}

##${prefix} checked(логический|функция) = false

**Configuration item exclusive к переключатель тип**

Whether the флажок is в the checked state, setting here means specifying the флажок state из the entire column. If there is a corresponding state в the record данные entry, the state в the данные will be used первый.

##${prefix} отключить(логический|функция) = false

**Configuration item exclusive к переключатель тип**

Whether the флажок is в a отключен interactive state

##${prefix} radioCheckType('cell' | 'column') = 'column'

**Configuration item exclusive к переключатель тип**

 The only range из the переключатель Кнопка, the по умолчанию значение is `column`:

  * `column`: The переключатель Кнопка is the only one selected в a column
  * `cell`: The переключатель Кнопка is uniquely selected в a cell

##${prefix} radioDirectionInCell('vertical' | 'horizontal') = 'vertical'

**Configuration item exclusive к переключатель тип**

When there are multiple переключатель Кнопка boxes в a переключатель Кнопка тип cell, the direction в which the переключатель Кнопка boxes are arranged. The по умолчанию значение is `vertical`:

  * `vertical`: The переключатель Кнопкаs are arranged vertically
  * `horizontal`: horizontal arrangement из переключатель Кнопкаs

