{{ target: график-indicator-тип }}

#${prefix} indicators.график(строка)

Specify the column тип as 'график', cellType can be omitted и defaults к 'текст'

##${prefix} cellType(строка) = 'график'

Specify the column тип as 'график', cellType can be omitted и defaults к 'текст'

##${prefix} графикModule(строка)

**Exclusive configuration options для график тип**

Corresponding к the имя из the injected график library компонент, the injection method can refer к [tutorial](../../guide/cell_type/график). Currently only supports injecting Vграфик графикing library!

##${prefix} графикSpec(любой|функция)

**Exclusive configuration options для график тип**

Set the spec из the график, или set it к a функция that returns a different spec. The данные displayed в the график is provided по records.

{{ use: base-indicator-тип(
    prefix = '##'+${prefix}
) }}

##${prefix} noданныеRenderNothing(логический) = false

Do не render the график when there is no данные. Defaults к false
