{{ target: сводный-header-title }}

${prefix} title(true|строка) = true

Display the header title. The по умолчанию is true, и the content displayed is a combination из the dimension имяs из каждый level, such as 'Регион|Province'.

${prefix} headerType(строка)

Header тип can be specified as `'текст'|'imвозраст'|'link'`.

${prefix} headerStyle(TODO)

Header cell style, configuration items are slightly different based на the headerType. Configuration items для каждый headerStyle can be found в:

- для headerType 'текст', refer к [headerStyle](../option/сводныйтаблица-columns-текст#headerStyle.bgColor)
- для headerType 'link', refer к [headerStyle](../option/сводныйтаблица-columns-link#headerStyle.bgColor)
- для headerType 'imвозраст', refer к [headerStyle](../option/сводныйтаблица-columns-imвозраст#headerStyle.bgColor)