{{ target: link-cell-тип }}

#${prefix} columns.link(строка)

Specify the column тип as 'link', cellType can be omitted и defaults к 'текст'

##${prefix} cellType(строка) = 'link'

Specify the column тип as 'link', cellType can be omitted и defaults к 'текст'

{{ use: base-cell-тип(
    prefix = '##'+${prefix}
) }}

##${prefix} linkJump(логический|функция) = true

**link тип exclusive configuration item** Whether the link can be Нажатьed к jump

##${prefix} linkDetect(логический|функция) = true

**link тип exclusive configuration item** Whether the link undergoes regular detection, и displays as link only if the link conforms к the url rules. This configuration does не take effect if a template link is configured.

##${prefix} templateLink(строка | (record: любой, col: число, row: число, таблица: Baseтаблицаапи) => строка)

**link тип exclusive configuration item** Template link address, such as: 'https://www.google.com.hk/search?q={имя}', where имя is the attribute поле имя из the данные source.

##${prefix} linkTarget(строка)

**link тип exclusive configuration item** Specifying the имя из the browsing context the resource is being загружен into, is the second параметр из window.открыть(), и defaults к '\_blank'.

##${prefix} linkWindowвозможности(строка)

**link тип exclusive configuration item** A строка containing a comma-separated список из window возможности, which is the third параметр из window.открыть().
