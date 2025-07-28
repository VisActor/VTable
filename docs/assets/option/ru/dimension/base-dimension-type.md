{{ target: base-dimension-тип }}

${prefix} dimensionKey(строка)

**обязательный** Unique identifier из the dimension, corresponding к the поле имя из the данныеset

${prefix} title(строка)

**обязательный** Dimension имя, the angle header can be configured к display the dimension имя

${prefix} headerFormat(полеFormat)

Format из the dimension значение

```
тип полеFormat = (заголовок: число|строка, col:число, row:число, таблица:сводныйтаблица) => любой;
```

${prefix} ширина(число|строка)

This property takes effect when the dimension serves as a row header и represents the ширина из the dimension cell.
The column ширина can be specified as a specific число, 'авто', или a percentвозраст like '20%'.
If 'авто' is specified, the column ширина will be adjusted автоmatically according к the length из the whole column текст;
If a percentвозраст is specified, the текущий column ширина will be adjusted according к the total ширина из the таблица;

${prefix} maxширина(число|строка)

This property takes effect when the dimension serves as a row header и represents the maximum ширина из the dimension cell

${prefix} minширина(число|строка)

This property takes effect when the dimension serves as a row header и represents the minimum ширина из the dimension cell

${prefix} headerStyle(IStyleOption|функция)

Header cell style, тип declaration:

```
headerStyle?: IStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption);
```

{{ use: common-StylePropertyFunctionArg() }}

IStyleOption тип structure is as follows:

{{ use: common-style(
  prefix = ${prefix},
  isImвозраст = ${isImвозраст},
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

ColumnиконкаOption specific configuration: https://visactor.io/vтаблица/option/списоктаблица-columns-текст#иконка

${prefix} description(строка|функция)
Description information для header навести, displayed as a Подсказка

```
 description?: строка | ((args: CellInfo) => строка);
```

${prefix} cornerDescription(строка)

Description information для навести, displayed as a Подсказка

${prefix} headerпользовательскийRender(функция|объект)

пользовательский rendering функция для header cells, Вы можете specify the rendering method для headers. для details, please refer к [базовый таблица пользовательский rendering configuration](../option/списоктаблица-columns-текст#headerпользовательскийRender)

${prefix} headerпользовательскиймакет(функция)

пользовательский макет element definition для header cells, this пользовательскийization is suiтаблица для cells с complex content макетs.

```
(args: пользовательскийRenderFunctionArg) => IпользовательскиймакетObj;
```

{{ use: common-пользовательскийRenderFunctionArg() }}

{{ use: пользовательский-макет(
    prefix =  '#'+${prefix},
) }}

${prefix} dropDownменю(менюсписокItem[]|функция)
выпадающий список меню item configuration. выпадающий список меню items can be верх-level меню items или second-level меню items, и only one configuration is обязательный.

具体类型为 `менюсписокItem[] | ((args: { row: число; col: число; таблица: Baseтаблицаапи }) => менюсписокItem[])`。

{{ use: common-меню-список-item() }}

${prefix} cornerDropDownменю(массив)
Angle header cell display отпускание-down Кнопка и отпускание-down меню item configuration. выпадающий список меню items can be верх-level меню items или second-level меню items, и only one configuration is обязательный. The specific тип is менюсписокItem[].

${prefix} cornerHeaderиконка(строка|объект|массив|функция)

сводный таблица corner cell иконка configuration

```
cornerHeaderиконка?:
| строка
| ColumnиконкаOption
| (строка | ColumnиконкаOption)[]
| ((args: CellInfo) => строка | ColumnиконкаOption | (строка | ColumnиконкаOption)[]);
```

для the specific configuration из ColumnиконкаOption, please refer к: https://visactor.io/vтаблица/option/списоктаблица-columns-текст#иконка

${prefix} dragHeader(логический)
Whether the header can be dragged

${prefix} drillDown(логический)
Display drill-down иконка, Нажатьing it will trigger a corresponding событие

${prefix} drillUp(логический)
Display drill-up иконка, Нажатьing it will trigger a corresponding событие

${prefix} showсортировка(логический|функция)
Whether the dimension значение cell displays the сортировка иконка. Нажатьing it does не have данные сортировкаing logic.

```
  showсортировка?: логический | ((args: { row: число; col: число; таблица: Baseтаблицаапи }) => логический);
```

${prefix} сортировка(логический)
Whether the corresponding dimension header cell displays the сортировка иконка.

сортировкаing rules:

If the сортировкаing rules для this dimension are configured в данныеConfig.сортировкаRules, the данные is сортировкаed according к the rules в данныеConfig.сортировкаRules.

If the сортировкаing rules для the dimension are не configured в данныеConfig.сортировкаRules, the по умолчанию is к use the natural сортировкаing из the dimension значение строка.

${prefix} showсортировкаInCorner(логический)

Whether к display сортировкаing в the dimension имя cell в the corner header. Нажатьing it does не have данные сортировкаing logic
