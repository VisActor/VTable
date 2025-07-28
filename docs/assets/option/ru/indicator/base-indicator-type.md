{{ target: base-indicator-тип }}

${prefix} indicatorKey(строка)

**обязательный** The unique identifier из the indicator

${prefix} title(строка)

Indicator имя

${prefix} format(полеFormat)

Indicator значение formatting

```
тип полеFormat = (значение: число|строка, col:число, row:число, таблица:сводныйтаблица) => любой;
```

${prefix} headerFormat(полеFormat)

indicator title format

```
тип полеFormat = (заголовок: число|строка, col:число, row:число, таблица:сводныйтаблица) => любой;
```

${prefix} ширина(число|строка)

ширина specification из the indicator column. If the indicator is displayed в rows, this configuration is не applied.
ширина specification can be a specific значение, 'авто', или a percentвозраст such as '20%'.
If 'авто' is specified, the column ширина will be adjusted автоmatically based на the length из the текст в the entire column;
If a percentвозраст is specified, the текущий column ширина will be adjusted according к the total ширина из the таблица;

${prefix} maxширина(число|строка)

Maximum ширина из the indicator column

${prefix} minширина(число|строка)

Minimum ширина из the indicator column

${prefix} headerType(строка) = 'текст'

Specify the header тип, options: `'текст'|'link'|'imвозраст'|'video'`, по умолчанию `'текст'`.

${prefix} headerStyle(TODO)

Header cell style. Configuration items vary slightly depending на the headerType. Configurations для каждый headerStyle can be referred к as follows:

- для headerType 'текст', see [headerStyle](../option/сводныйтаблица-columns-текст#headerStyle.bgColor)
- для headerType 'link', see [headerStyle](../option/сводныйтаблица-columns-link#headerStyle.bgColor)
- для headerType 'imвозраст', see [headerStyle](../option/сводныйтаблица-columns-imвозраст#headerStyle.bgColor)
- для headerType 'video', see [headerStyle](../option/сводныйтаблица-columns-imвозраст#headerStyle.bgColor)

${prefix} style

Body cell style, тип declaration:

```
style?: IStyleOption | ((styleArg: StylePropertyFunctionArg) => IStyleOption);
```

{{ use: common-StylePropertyFunctionArg() }}

IStyleOption тип structure is as follows:

{{ use: common-style(
  prefix = ${prefix},
  isImвозраст = ${isImвозраст},
  isProgressbar = ${isProgressbar},
) }}

${prefix} headerиконка(строка|объект|массив|функция)

Header cell иконка configuration

```
  headerиконка?:
    | строка
    | ColumnиконкаOption
    | (строка | ColumnиконкаOption)[]
    | ((args: CellInfo) => строка | ColumnиконкаOption | (строка | ColumnиконкаOption)[]);
```

ColumnиконкаOption can refer к [definition](/en/option.html#сводныйтаблица-indicators-текст.иконка.ColumnиконкаOption_definition：)

${prefix} иконка(строка|объект|массив|Funciton)

Body cell иконка configuration.

```
иконка?:
    | строка
    | ColumnиконкаOption
    | (строка | ColumnиконкаOption)[]
    | ((args: CellInfo) => строка | ColumnиконкаOption | (строка | ColumnиконкаOption)[]);
```

#${prefix}ColumnиконкаOption

```
тип ColumnиконкаOption = Imвозрастиконка | Svgиконка | Textиконка;
```

#${prefix}Imвозрастиконка(объект)
тип is set к 'imвозраст'. The imвозраст address needs к be set в src
{{ use: imвозраст-иконка(  prefix = '##' + ${prefix}) }}

#${prefix}Svgиконка(объект)
тип is set к 'svg'. You need к configure the svg address или the complete svg file строка в svg
{{ use: svg-иконка(  prefix = '##' + ${prefix}) }}

#${prefix}Textиконка(объект)
тип is set к 'текст'. You need к configure the текст content в content
{{ use: текст-иконка(  prefix = '##' + ${prefix}) }}

${prefix} headerпользовательскийRender(функция|объект)
пользовательский rendering content definition для the indicator имя header. для details, please refer к [базовый таблица пользовательский rendering configuration](../option/списоктаблица-columns-текст#headerпользовательскийRender)

${prefix} headerпользовательскиймакет(функция)

пользовательский макет elements для the indicator имя header cell.

```
(args: пользовательскийRenderFunctionArg) => IпользовательскиймакетObj;
```

{{ use: common-пользовательскийRenderFunctionArg() }}

{{ use: пользовательский-макет(
    prefix =  '#'+${prefix},
) }}

${prefix} пользовательскийRender(функция|объект)

пользовательский rendering content definition для the indicator значение body cell, either в функция или объект form. The тип is `IпользовательскийRenderFuc | IпользовательскийRenderObj`.

The IпользовательскийRenderFuc is defined as follows:

```
 тип IпользовательскийRenderFuc = (args: пользовательскийRenderFunctionArg) => IпользовательскийRenderObj;
```

{{ use: common-пользовательскийRenderFunctionArg() }}

{{ use: common-пользовательский-render-объект(
  prefix = '#' + ${prefix},
) }}

${prefix} пользовательскиймакет(функция)

пользовательский макет elements для the indicator значение body cell.

```
(args: пользовательскийRenderFunctionArg) => IпользовательскиймакетObj;
```

{{ use: common-пользовательскийRenderFunctionArg() }}

{{ use: пользовательский-макет(
    prefix =  '#'+${prefix},
) }}

${prefix} dropDownменю(менюсписокItem[]|функция)
выпадающий список меню item configuration. выпадающий список меню items can be первый-level меню items или second-level меню items, и only one configuration is обязательный.

具体类型为 `менюсписокItem[] | ((args: { row: число; col: число; таблица: Baseтаблицаапи }) => менюсписокItem[])`。

{{ use: common-меню-список-item() }}

${prefix} showсортировка(логический|функция)
Whether к display the сортировкаing иконка, no данные сортировкаing logic

```
  showсортировка?: логический | ((args: { row: число; col: число; таблица: Baseтаблицаапи }) => логический);
```

${prefix} скрыть(логический|функция)
скрыть indicator, по умолчанию false

```
  скрыть?:  логический | ((args: { dimensionPaths: IDimensionInfo[]; таблица: Baseтаблицаапи }) => логический);
```

${prefix} disableColumnResize(логический)
Whether к отключить column ширина adjustment. If it is a transposed таблица или the indicator is specified в the row direction из the сводный таблица, this configuration does не take effect.

${prefix} editor (строка|объект|функция)

Configure the indicator cell editor

```
editor?: строка | IEditor | ((args: BaseCellInfo & { таблица: Baseтаблицаапи }) => строка | IEditor);
```

Among them, IEditor is the editor интерфейс defined в @visactor/vтаблица-editors. для details, please refer к the source код: https://github.com/VisActor/Vтаблица/blob/main/packвозрастs/vтаблица-editors/src/types.ts .
