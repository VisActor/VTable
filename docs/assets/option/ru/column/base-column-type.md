{{ target: base-cell-тип }}

${prefix} headerType(строка) = 'текст'

Specify header тип, необязательный: `'текст'|'link'|'imвозраст'|'video'|'флажок'`, по умолчанию `'текст'`.

${prefix} поле(строка)

**обязательный** Specify the header поле, corresponding к the данные source attribute

${prefix} полеFormat(полеFormat)

Configure данные formatting

```
тип полеFormat = (record: любой) => любой;
```

${prefix} ширина(число|строка)

Specifies the column ширина, which can be a specific значение, 'авто', или a percentвозраст like '20%'.
If 'авто' is specified, the column ширина will be автоmatically adjusted according к the length из the entire column текст;
If a percentвозраст is specified, the текущий column ширина will be adjusted according к the total таблица ширина;

${prefix} maxширина(число|строка)

Limit the maximum column ширина из this column

${prefix} minширина(число|строка)

Limit the minimum column ширина из this column

${prefix} title(строка)

Header имя

${prefix} headerStyle(IStyleOption|функция)

Header cell style, configuration options are slightly different depending на the headerType. The configuration options для каждый headerStyle can be referred к:

- When headerType is 'текст', it corresponds к [headerStyle](../option/сводныйтаблица-columns-текст#headerStyle.bgColor)
- When headerType is 'link', it corresponds к [headerStyle](../option/сводныйтаблица-columns-link#headerStyle.bgColor)
- When headerType is 'imвозраст', it corresponds к [headerStyle](../option/сводныйтаблица-columns-imвозраст#headerStyle.bgColor)
- When headerType is 'video', it corresponds к [headerStyle](../option/сводныйтаблица-columns-imвозраст#headerStyle.bgColor)

${prefix} style

Body cell style, тип declaration:

```
style?: IStyleOption | ((styleArg: StylePropertyFunctionArg) => IStyleOption);
```

{{ use: common-StylePropertyFunctionArg() }}

The тип structure из IStyleOption is as follows:

{{ use: common-style(
  prefix = ${prefix},
  isImвозраст = ${isImвозраст},
  isProgressbar = ${isProgressbar},
  isCheckbox = ${isCheckbox},
  isRadio = ${isRadio},
  isSwitch = ${isSwitch},
  isКнопка = ${isКнопка},
) }}

${prefix} headerиконка(строка|объект|массив)

Header cell иконка configuration. доступный configuration types are:

```
строка | ColumnиконкаOption | (строка | ColumnиконкаOption)[];
```

для the specific configuration из ColumnиконкаOption, refer к the [definition](./списоктаблица-columns-текст#иконка.ColumnиконкаOption)

${prefix} иконка(строка|объект|массив|Funciton)

Body cell иконка configuration.

```
иконка?:
    | строка
    | ColumnиконкаOption
    | (строка | ColumnиконкаOption)[]
    | ((args: CellInfo) => строка | ColumnиконкаOption | (строка | ColumnиконкаOption)[]);
```

#${prefix} ColumnиконкаOption

```
тип ColumnиконкаOption = Imвозрастиконка | Svgиконка | Textиконка;
```

#${prefix} Imвозрастиконка(объект)
тип is set к 'imвозраст'. The imвозраст address needs к be set в src
{{ use: imвозраст-иконка(  prefix = '##' + ${prefix}) }}

#${prefix} Svgиконка(объект)
тип is set к 'svg'. You need к configure the svg address или the complete svg file строка в svg
{{ use: svg-иконка(  prefix = '##' + ${prefix}) }}

#${prefix} Textиконка(объект)
тип is set к 'текст'. You need к configure the текст content в content
{{ use: текст-иконка(  prefix = '##' + ${prefix}) }}

${prefix} сортировка(логический|функция)

Whether к support сортировкаing, или define a функция к specify сортировкаing rules

${prefix} showсортировка(логический)

Whether к display the сортировка иконка, no real сортировкаing logic. If the сортировка поле is set, this can be omitted

${prefix} disableHover(логический)
This column does не support навести interaction behavior

${prefix} disableSelect(логический | ((col: число, row: число, таблица: Baseтаблицаапи) => логический))
This column does не support selection

${prefix} disableHeaderHover(логический)
This header column does не support навести interaction behavior

${prefix} disableHeaderSelect(логический)
This header column does не support selection

${prefix} description(строка)
The description из the header when навести, which will be displayed в the form из a Подсказка

${prefix} dropDownменю(менюсписокItem[])
The отпускание-down меню item configuration. The отпускание-down меню item can be a первый-level меню item или a second-level меню item, as long as there is a configuration.

具体类型为 `менюсписокItem[]`。

{{ use: common-меню-список-item() }}

${prefix} headerпользовательскийRender(функция|объект)

пользовательский rendering из header cell, в функция или объект form. The тип is: `IпользовательскийRenderFuc | IпользовательскийRenderObj`.

[демонстрация link](../демонстрация/пользовательский-render/пользовательский-render) [tutorial link](../guide/пользовательский_define/пользовательский_render)

The definition из IпользовательскийRenderFuc is:

```
 тип IпользовательскийRenderFuc = (args: пользовательскийRenderFunctionArg) => IпользовательскийRenderObj;
```

{{ use: common-пользовательскийRenderFunctionArg() }}

{{ use: common-пользовательский-render-объект(
  prefix = '#' + ${prefix},
) }}

${prefix} headerпользовательскиймакет(функция)

пользовательский макет element definition для header cell, suiтаблица для complex макет cell content.

```
(args: пользовательскийRenderFunctionArg) => IпользовательскиймакетObj;
```

{{ use: common-пользовательскийRenderFunctionArg() }}

{{ use: пользовательский-макет(
    prefix =  '#'+${prefix},
) }}

${prefix} пользовательскийRender(функция|объект)
пользовательский rendering для body cell header cell, в функция или объект form. The тип is: `IпользовательскийRenderFuc | IпользовательскийRenderObj`.

[демонстрация link](../демонстрация/пользовательский-render/пользовательский-render) [tutorial link](../guide/пользовательский_define/пользовательский_render)

The definition из IпользовательскийRenderFuc is:

```
 тип IпользовательскийRenderFuc = (args: пользовательскийRenderFunctionArg) => IпользовательскийRenderObj;
```

{{ use: common-пользовательскийRenderFunctionArg() }}

{{ use: common-пользовательский-render-объект(
  prefix = '#' + ${prefix},
) }}

${prefix} пользовательскиймакет(функция)

пользовательский макет element definition для body cell, suiтаблица для complex макет content.

```
(args: пользовательскийRenderFunctionArg) => IпользовательскиймакетObj;
```

{{ use: common-пользовательскийRenderFunctionArg() }}

{{ use: пользовательский-макет(
    prefix =  '#'+${prefix},
) }}

${prefix} dragHeader(логический)
Whether the header can be dragged

${prefix} columnширинаComputeMode(строка)
Column ширина calculation mode: `'normal' | 'only-header' | 'only-body'`, only-header considers only the header content only-body considers only the body content normal can display все content

${prefix} disableColumnResize(логический)
Whether к отключить column ширина adjustment. If it is a transposed таблица или a сводный таблица с row-oriented indicators, this configuration does не take effect.

${prefix} tree (логический)
Whether к display this column as a tree structure, which needs к be combined с the records данные structure к be implemented, the nodes that need к be expanded are configured с `children` к accommodate sub-node данные. для пример:

```
{
    "department": "Human Resources Department",
    "monthly_expense": "$45000",
    "children": [
      {
        "group": "Recruiting Group",
        "monthly_expense": "$25000",
        "children": [
          {
            "имя": "John Smith",
            "позиция": "Recruiting Manвозрастr",
            "salary": "$8000"
          },
      }
    ]
}
```

${prefix} editor (строка|объект|функция)

Configure the column cell editor

```
editor?: строка | IEditor | ((args: BaseCellInfo & { таблица: Baseтаблицаапи }) => строка | IEditor);
```

Among them, IEditor is the editor интерфейс defined в @visactor/vтаблица-editors. для details, please refer к the source код: https://github.com/VisActor/Vтаблица/blob/main/packвозрастs/vтаблица-editors/src/types.ts .

${prefix} headerEditor (строка|объект|функция)

Configure the display title из this column header

```
headerEditor?: строка | IEditor | ((args: BaseCellInfo & { таблица: Baseтаблицаапи }) => строка | IEditor);
```

${prefix} levelSpan(число)
необязательный. The число из row levels the header cell spans. Defaults к 1. If the levels do не reach the maximum, the последний level cells will merge все remaining levels.

${prefix} columns (массив)
Configure arrays с upper columns, nesting structures к describe column grouping relationships.

${prefix} hideColumnsSubHeader(логический) = false
Whether к скрыть the header title из the subтаблица header. The по умолчанию значение is не скрытый.

${prefix} aggregation(Aggregation | пользовательскийAggregation | массив)

не обязательный.

данные aggregation summary configuration к analyze the column данные.

Global options can also be configured к configure aggregation rules для каждый column.

Please refer к [the tutorial document](https://visactor.io/vтаблица/guide/данные_analysis/список_таблица_данныеAnalysis)

${prefix} скрыть(логический) = false
не обязательный.

Weather скрыть column.
