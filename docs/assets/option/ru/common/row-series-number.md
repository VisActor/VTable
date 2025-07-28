{{ target: row-series-число }}

${prefix} title(строка)

Row serial число title, empty по по умолчанию

${prefix} ширина(число|число)

The row число ширина can be configured с число или 'авто'. (по умолчанию uses defaultColширина, which defaults к 80)

${prefix} format(функция)

Row serial число formatting функция, empty по по умолчанию. Through this configuration, Вы можете convert numerical тип serial numbers into пользовательский serial numbers, such as using a, b, c...

${prefix} cellType('текст')

Row число cell тип, по умолчанию is `текст`. Other formats к be determined

${prefix} dragOrder(логический)

Whether the row serial число sequence can be dragged. The по умолчанию is false. If set к true, the иконка в the dragging позиция will be displayed, и Вы можете перетаскивание и отпускание на the иконка к change its позиция. If you need к replace the иконка, Вы можете configure it yourself. Please refer к the tutorial: https://visactor.io/vтаблица/guide/пользовательский_define/пользовательский_иконка для the chapter на resetting функция иконкаs.

${prefix} headerStyle(IStyleOption|функция)

таблица header cell style, please refer к: [headerStyle](../option/сводныйтаблица-columns-текст#headerStyle.bgColor)

${prefix} style

Body cell style, please refer к: [style](../option/списоктаблица-columns-текст#style.bgColor)

${prefix} disableColumnResize(логический)

Whether к отключить row serial число ширина adjustment.The по умолчанию is false.

${prefix} headerиконка(строка|объект|массив)

таблица header cell иконка configuration. The configurable types are:

```
строка | ColumnиконкаOption | (строка | ColumnиконкаOption)[];
```

для detailed configuration из ColumnиконкаOption, please refer к [Definition](./списоктаблица-columns-текст#иконка.ColumnиконкаOption)

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
{{ use: imвозраст-иконка( prefix = '##' + ${prefix}) }}

#${prefix}Svgиконка(объект)
тип is set к 'svg'. You need к configure the svg address или the complete svg file строка в svg
{{ use: svg-иконка( prefix = '##' + ${prefix}) }}

#${prefix}Textиконка(объект)
тип is set к 'текст'. You need к configure the текст content в content
{{ use: текст-иконка( prefix = '##' + ${prefix}) }}

${prefix} headerпользовательскиймакет(функция)
The header cell пользовательский макет element definition, this пользовательский form is suiтаблица для cells с complex content макет.

```
(args: пользовательскийRenderFunctionArg) => IпользовательскиймакетObj;
```

{{ use: common-пользовательскийRenderFunctionArg() }}

{{ use: пользовательский-макет(
prefix = '#'+${prefix},
) }}

${prefix} пользовательскиймакет(функция)

The body cell пользовательский макет element definition is suiтаблица для cells с complex content макет.

Defined as Следующий функция:

```
(args: пользовательскийRenderFunctionArg) => IпользовательскиймакетObj;
```

{{ use: common-пользовательскийRenderFunctionArg() }}

{{ use: пользовательский-макет(
prefix = '#'+${prefix},
) }}
