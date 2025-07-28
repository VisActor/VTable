{{ target: график-cell-тип }}

#${prefix} columns.график(строка)

Specify the column тип as 'график', the cellType can be omitted и defaults к 'текст'

##${prefix} cellType(строка) = 'график'

Specify the column тип as 'график', the cellType can be omitted и defaults к 'текст'

{{ use: base-cell-тип(
    prefix = '##'+${prefix},
) }}

##${prefix} графикModule(строка)

**график тип exclusive configuration options**

Corresponding к the injected график library компонент имя

##${prefix} графикSpec(любой|функция)

**график тип exclusive configuration options**

Set the spec из the график, или set it к a функция that returns a different spec. The данные displayed в the график is provided по records.

##${prefix} noданныеRenderNothing(логический) = false

Do не render the график when there is no данные. Defaults к false
