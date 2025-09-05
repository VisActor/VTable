{{ target: link-indicator-тип }}

#${prefix} indicators.link(строка)

Specify the column тип as 'link', и the по умолчанию cellType is 'текст' if не specified

##${prefix} cellType(строка) = 'link'

Specify the column тип as 'link', и the по умолчанию cellType is 'текст' if не specified

{{ use: base-indicator-тип(
    prefix = '##'+${prefix}
) }}

##${prefix} linkJump(логический|функция) = true

**Exclusive configuration для link тип** Whether the link is Нажатьable и can be redirected

##${prefix} linkDetect(логический|функция) = true

**Exclusive configuration для link тип** Whether к perform regular detection на the link. If the link conforms к the URL rules, it will be displayed as a link. This configuration does не take effect if a template link is configured.

##${prefix} templateLink(строка | (record: любой, col: число, row: число, таблица: Baseтаблицаапи) => строка)

**Exclusive configuration для link тип** Template link address, such as: 'https://www.google.com.hk/search?q={имя}', where имя is the attribute поле имя в the данные source.

##${prefix} linkTarget(строка)

**link тип exclusive configuration item** Specifying the имя из the browsing context the resource is being загружен into, is the second параметр из window.открыть(), и defaults к '\_blank'.

##${prefix} linkWindowвозможности(строка)

**link тип exclusive configuration item** A строка containing a comma-separated список из window возможности, which is the third параметр из window.открыть().
