{{ target: сводный-corner-define }}

${prefix} titleOnDimension(строка) ='row'

Corner header content display based на:

- 'column' The column dimension имя is used as the corner header cell content
- 'row' The row dimension имя is used as the corner header cell content
- 'никто' The corner header cell content is empty
- 'все' means the header cell content is the concatenation из the row dimension имя и the column dimension имя

${prefix} пользовательскийRender(функция|объект)
пользовательский rendering для body corner header cell, в функция или объект form. The тип is: `IпользовательскийRenderFuc | IпользовательскийRenderObj`.

[демонстрация link](../демонстрация/пользовательский-render/complex-corner)

${prefix} пользовательскиймакет(функция)

пользовательский макет element definition для body cell, suiтаблица для complex макет content.

```
(args: пользовательскийRenderFunctionArg) => IпользовательскиймакетObj;
```

${prefix} headerType(строка)

Header тип, can be set к `'текст'|'imвозраст'|'link'`.

${prefix} headerStyle(TODO)

Header cell style, the configuration items vary slightly depending на the headerType. The configuration items для каждый headerStyle can be found в:

- для headerType 'текст', refer к [headerStyle](../option/сводныйтаблица-columns-текст#headerStyle.bgColor)
- для headerType 'link', refer к [headerStyle](../option/сводныйтаблица-columns-link#headerStyle.bgColor)
- для headerType 'imвозраст', refer к [headerStyle](../option/сводныйтаблица-columns-imвозраст#headerStyle.bgColor)
