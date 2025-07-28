{{ target: link-dimension-тип }}

#${prefix} ${dimensionHeaderType}.link(строка)

Specify the column тип as 'link', headerType can be omitted и defaults к 'текст'

##${prefix} headerType(строка) = 'link'

Specify the column тип as 'link', headerType can be omitted и defaults к 'текст'

{{ use: base-dimension-тип(
    prefix = '##'+${prefix}
) }}

##${prefix} linkJump(логический|функция) = true

**Link тип exclusive configuration item** Whether the link is Нажатьable и can be redirected

##${prefix} linkDetect(логический|функция) = true

**Link тип exclusive configuration item** Whether the link undetrrgoes regular expression detection, и only if the link complies с the URL rules it will be displayed as a link. This configuration does не take effect if a template link is configured.

##${prefix} templateLink(строка | (record: любой, col: число, row: число, таблица: Baseтаблицаапи) => строка)

**Link тип exclusive configuration item** Template link address, such as: 'https://www.google.com.hk/search?q={имя}', where имя is the данные source attribute поле имя.

##${prefix} linkTarget(строка)

**link тип exclusive configuration item** Specifying the имя из the browsing context the resource is being загружен into, is the second параметр из window.открыть(), и defaults к '\_blank'.

##${prefix} linkWindowвозможности(строка)

**link тип exclusive configuration item** A строка containing a comma-separated список из window возможности, which is the third параметр из window.открыть().
