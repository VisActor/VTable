{{ target: common-option-secondary }}

#${prefix} ширинаMode('standard' | 'adaptive' | 'автоширина') = 'standard'

таблица column ширина calculation mode, can be 'standard' (standard mode), 'adaptive' (container ширина adaptive mode) или 'автоширина' (автоmatic ширина mode), по умолчанию is 'standard'.

- 'standard': Use the ширина specified по the ширина property as the column ширина.
- 'adaptive': Use the ширина из the таблица container к allocate column ширина.
- 'автоширина': Calculate column ширина автоmatically based на the ширина из the column header и body cells content, ignoring the ширина property settings.

#${prefix} высотаMode('standard' | 'adaptive' | 'автовысота') = 'standard'

The calculation mode из таблица row высота, which can be 'standard' (standard mode), 'adaptive' (adaptive container высота mode) или 'автовысота' (автоmatic row высота mode), the по умолчанию is 'standard'.

- 'standard': use `defaultRowвысота` и `defaultHeaderRowвысота` as row высота.
- 'adaptive': Use the высота из the container к assign the высота из каждый row.
- 'автовысота': автоmatically calculate line высота based на content, based на fontSize и lineвысота(шрифт высота)，include заполнение. The related collocation setting item `автоWrapText` автоmatically wraps the line, и the line высота can be calculated according к the content из the multi-line текст after the line wrap.

#${prefix} ширинаAdaptiveMode('only-body' | 'все') = 'only-body'

The ширина adaptation strategy в adaptive mode, the по умолчанию is 'only-body'.

- 'only-body': Only the columns в the body part participate в the ширина adaptation calculation, и the ширина из the header part remains unchanged.
- 'все': все columns participate в ширина adaptation calculation.

#${prefix} высотаAdaptiveMode('only-body' | 'все') = 'only-body'

The высота adapтаблица strategy в adaptive mode, по умолчанию is 'only-body'.

- 'only-body': Only the rows в the body part participate в the высота adaptation calculation, и the высота из the header part remains unchanged.
- 'все': все columns participate в the высота adaptation calculation.

#${prefix} автовысотаInAdaptiveMode(логический) = true

When the adaptive mode is configured, the по умолчанию значение is true, that is, the length из the container is equal к the высота из the stretched row based на the calculation из the высота из каждый row. If you do не need к calculate the row высота, set it к false if the по умолчанию row высота is used

#${prefix} columnширинаComputeMode('normal' | 'only-header' | 'only-body') = 'normal'

When calculating the content ширина, the limited area participates в the calculation:

- 'only-header': Only the header content is calculated.
- 'only-body': Only the body cell content is calculated.
- 'normal': Normal calculation, that is, calculating the header и body cell contents.

#${prefix} containerFit(объект)

Configuration для adapting the таблица frame к the container dimensions while preserving content размер.

```javascript
containerFit: {
  ширина: true,   // логический
  высота: true   // логический
}
```

- `ширина`: Whether к adapt the таблица frame ширина к the container ширина
- `высота`: Whether к adapt the таблица frame высота к the container высота

Unlike adaptive mode (`ширинаMode: 'adaptive'` или `высотаMode: 'adaptive'`) which stretches content к fill the container, `containerFit` maintains the original content dimensions и fills remaining space appropriately.

#${prefix} автоWrapText(логический) = false

Whether к автоmatically wrap текст

#${prefix} автоFillширина(логический) = false
The configuration item автоFillширина is used к control whether к автоmatically fill the container ширина. Different от the effect из `adaptive` adaptive container из ширина mode `ширинаMode`, автоFillширина controls that only when the число из columns is small, the таблица can автоmatically fill the ширина из the container, but when the число из columns exceeds the container, according к the actual situation A прокрутка bar can appear к set the column ширина.

#${prefix} автоFillвысота(логический) = false
The configuration item автоFillвысота is used к control whether к автоmatically fill the container высота. Different от the effect из `adaptive` adaptive container из высота mode `высотаMode`, автоFillвысота controls that only when the число из rows is small, the таблица can автоmatically fill the высота из the container, but when the число из rows exceeds the container, according к the actual situation A прокрутка bar can appear к set the row высота.

#${prefix} maxCharactersNumber(число) = 200

The maximum число из characters that can be displayed в a cell, по умолчанию is 200

#${prefix} maxOperaтаблицаRecordCount(число)

Maximum число из operable records, such as the maximum число из данные entries that can be copied в a copy operation

#${prefix} limitMaxавтоширина(логический|число) = 450

Specify the maximum column ширина when calculating column ширина, which can be логический или a specific значение. по умолчанию is 450.

#${prefix} limitMinширина(логический|число) = 10

Minimum column ширина limit. If set к true, the column ширина will be limited к a minimum из 10px when dragging к change the column ширина. If set к false, there will be no limit. или set it directly к некоторые numeric значение. по умолчанию is 10px.

#${prefix} frozenColCount(число) = 0

The число из frozen columns

#${prefix} frozenRowCount(число) = 0

The число из frozen columns(including the header)

#${prefix} rightFrozenColCount(число) = 0

Freeze Columns право

#${prefix} bottomFrozenRowCount(число) = 0

число из frozen rows в the низ

#${prefix} maxFrozenширина(число | строка) = '80%'

Maximum freezing ширина, fixed значение или percentвозраст. по умолчанию is '80%'

#${prefix} unfreezeAllOnExceedsMaxширина(логический) = true

Whether к defrost after the maximum freezing ширина is exceeded. The по умолчанию значение is true

#${prefix} allowFrozenColCount(число) = 0

Allow the число из frozen columns, indicating how many columns will показать the frozen operation Кнопка (effective для базовый таблицаs)

#${prefix} showFrozenиконка(логический) = true

Whether к показать the fixed column pin иконка, effective для базовый таблицаs

#${prefix} defaultRowвысота(число|'авто') = 40

по умолчанию row высота.

- 'авто': The по умолчанию row высота calculated based на the row высота. Combined с defaultHeaderRowвысота, it can achieve the effect из автоmatic row высота calculation для the header или body part.
- Specific значение: Set a specific row высота.

#${prefix} defaultHeaderRowвысота(массив|число)

The по умолчанию row высота из the column header can be set row по row. If не set, the defaultRowвысота значение will be used as the row высота из the таблица header.

Specific definition:

```
defaultHeaderRowвысота?: (число | 'авто') | (число | 'авто')[];
```

#${prefix} defaultColширина(число) = 80

Column ширина по умолчанию значение

#${prefix} defaultHeaderColширина(массив|число)

The по умолчанию column ширина из the row header can be set column по column. If не set, the значение из defaultColширина will be used as the column ширина и высота из the header.

Specific definition:

```
/** The по умолчанию column ширина из the row header can be set column по column. If не, defaultColширина is used */
defaultHeaderColширина?: (число | 'авто') | (число | 'авто')[];
```

#${prefix} keyboardOptions(объект)

Shortcut key функция settings, specific configuration items:

##${prefix} selectAllOnCtrlA(логический) = false
включить the shortcut key выбрать все.
Supports `логический` или specific configuration тип `SelectAllOnCtrlAOption`.

```
export интерфейс SelectAllOnCtrlAOption {
disableHeaderSelect?: логический; //Whether к отключить header selection when the shortcut key is used к выбрать все.
disableRowSeriesNumberSelect?: логический; //Whether к отключить the selection из row sequence numbers when the shortcut key is used к выбрать все.
}
```

##${prefix} copySelected(логический) = false

включить shortcut key к copy, consistent с the browser's shortcut key.

##${prefix} pasteValueToCell(логический) = false

включить shortcut key к paste, consistent с the browser's shortcut key.Paste takes effect only для cells с an editor configured

##${prefix} moveFocusCellOnTab(логический) = true
включить tab key interaction. The по умолчанию is true. Turn на the tab key к move the selected cell. If you are currently editing a cell, moving к the следующий cell is also в the editing state.

##${prefix} moveFocusCellOnEnter(логический) = false
включить enter key interaction. по умолчанию is false. Press enter key к выбрать следующий cell. Mutually exclusive с editCellOnEnter. If set к true в the same time, it takes precedence over editCellOnEnter.

##${prefix} editCellOnEnter(логический) = true
включить enter key interaction. по умолчанию is true. If the selected cell is ediтаблица, enter cell editing.

##${prefix} moveEditCellOnArrowKeys(логический) = false
по по умолчанию, it is не включен, that is, false. If this configuration is включен, if the cell is currently being edited, the arrow keys can move к the следующий cell и enter the editing state, instead из moving the cursor из the строка в the edit текст. The up, down, лево, и право arrow keys к switch the selected cell are не affected по this configuration.

##${prefix} moveEditCellOnArrowKeys(логический) = false

The по умолчанию is не включен, which is false.

If this configuration is turned на, if you are currently editing a cell, the arrow keys can move к the следующий cell и enter the editing state, instead из moving the cursor к edit the строка within the текст.

Switching the selected cells с the up, down, лево и право arrow keys is не affected по this configuration.

##${prefix} ctrlMultiSelect(логический) = true

Whether к включить ctrl multi-выбрать. по умолчанию is true.

#${prefix} событиеOptions(объект)

Issue settings related к событие triggering, specific configuration items:

##${prefix} prсобытиеDefaultContextменю(логический) = true
prсобытие the по умолчанию behavior из the право mouse Кнопка

##${prefix} contextменюReturnAllSelectedCells(логический) = true

Whether к возврат все selected cells information к the user в the contextменю событие параметр. по умолчанию is true. If you do не need it, it is best к set it к false.

#${prefix} excelOptions(объект)

Align excel advanced capabilities

##${prefix} fillHandle(логический) = false

Fill handle, when set к true, when a cell is selected, the fill handle will be displayed на the lower право side из the cell. Вы можете перетаскивание the fill handle к edit the значение из the cell. или double-Нажать the fill handle к change the значение из the cell you want к edit.

#${prefix} навести(объект)

навести interaction configuration, specific configuration items as follows:

##${prefix} highlightMode('cross'|'column'|'row'|'cell') = 'cross'

навести interaction response mode: cross, entire column, entire row, или single cell.

##${prefix} disableHover(логический) = false

Do не respond к mouse навести interaction.

##${prefix} disableHeaderHover(логический) = false

Separately set the header не к respond к mouse навести interaction.

#${prefix} выбрать(объект)

Cell selection interaction configuration, specific configuration items as follows:

##${prefix} highlightMode ('cross' | 'column' | 'row' | 'cell') = 'cell'

Highlight range mode: cross, whole column, whole row или single cell. по умолчанию is `cell`

##${prefix} headerSelectMode ('inline' | 'cell' | 'body') = 'inline'

When Нажатьing на a header cell, whether the entire row или column needs к be selected along с the body.

Possible values:

'inline': Нажатьing a row header selects the entire row, и selecting a column header selects the entire column;

'cell': выбрать only the currently Нажатьed header cell;

'body': Do не выбрать the таблица header. Нажатьing a row header selects все body cells в the row. Нажатьing a column header selects все body cells в the column.

##${prefix} cornerHeaderSelectMode ('inline' | 'cell' | 'body' | 'все') = 'все'

When Нажатьing на the corner header cell, the selection mode к be applied.

Possible values:

'inline': Нажатьing the corner header selects the entire column;

'cell': выбрать only the currently Нажатьed corner header cell;

'body': Нажатьing the corner header selects все body cells;

'все': Нажатьing the corner header selects the entire таблица.

##${prefix} disableSelect (логический | ((col: число, row: число, таблица: Baseтаблицаапи) => логический)) = false

Do не respond к mouse выбрать interaction.

##${prefix} disableHeaderSelect (логический) = false

Separately set the header не к respond к mouse выбрать interaction.

##${prefix} blankAreaНажатьDeselect(логический) = false

Whether к отмена the selection when Нажатьing the blank area.

##${prefix} outsideНажатьDeselect(логический) = true

Whether к отмена the selection when Нажатьing outside the таблица.

##${prefix} disableDragSelect(логический) = true

Whether к отключить dragging selection.

##${prefix} highlightInRange(логический) = false

Will the entire row или column be highlighted when выбрать в multiple rows или columns.

##${prefix} makeSelectCellVisible(логический) = true

Whether к make the selected cell видимый, по умолчанию is true.

#${prefix} тема(объект)

{{ use: common-тема(
  prefix = '#' + ${prefix},
) }}

#${prefix} меню(объект)

Configuration related к the отпускание-down меню. Disappearance timing: автоmatically disappears after Нажатьing the area outside the меню. Specific configuration items as follows:

##${prefix} renderMode('canvas' | 'html') = 'html'

меню rendering method, html is currently more complete, по умолчанию using html rendering method.

##${prefix} defaultHeaderменюItems(менюсписокItem[]|функция)

Global settings для built-в отпускание-down менюs, тип is `менюсписокItem[] | ((args:{col:число,row:число,таблица:Baseтаблицаапи})=>менюсписокItem[])`.

Currently only valid для базовый таблицаs, it will включить the по умолчанию отпускание-down меню функция для каждый header cell.

{{ use: common-меню-список-item() }}

##${prefix} contextменюItems(массив|функция)

право-Нажать меню. Declaration тип:

```
менюсписокItem[] | ((поле: строка, row: число, col: число, таблица?: Baseтаблицаапи) => менюсписокItem[]);
```

{{ use: common-меню-список-item() }}

##${prefix} dropDownменюHighlight(массив)

Set the selected state из the меню. Declaration тип is `DropDownменюHighlightInfo[]`.
.DropDownменюHighlightInfo is defined as follows:

```
{
  /** Set the column число из the cell с the отпускание-down status */
  col?: число;
  /** Set the row число из the cell с the отпускание-down status */
  row?: число;
  /** Set the поле имя corresponding к the отпускание-down status, или set dimension information для сводный таблицаs */
  поле?: строка | IDimensionInfo[];
  /** Specify the key значение из the отпускание-down меню item */
  менюKey?: строка;
}
```

{{ use: common-IDimensionInfo()}}

#${prefix} title(объект)

{{ use: common-title(
  prefix = '#' + ${prefix},
) }}

#${prefix} emptyTip(объект)

таблица empty данные prompt.

Вы можете directly configure `логический` или `IEmptyTip` тип objects. The по умолчанию значение is false, which means no prompt information is displayed.

The IEmptyTip тип is defined as follows:

{{ use: common-emptyTip(
prefix = '#' + ${prefix},
) }}

#${prefix} Подсказка(объект)

Подсказка related configuration. Specific configuration items are as follows:

##${prefix} renderMode ('html') = 'html'

Html is currently more complete, по умолчанию using html rendering method. Currently does не support canvas scheme, will support later.

##${prefix} isShowOverflowTextПодсказка (логический)

Whether к display overflow текст content Подсказка when hovering over the cell. Temporarily, renderMode needs к be configured as html к display, и canvas has не been developed yet.

##${prefix} overflowTextПодсказкаDisappearDelay (число)

The overflow текст Подсказка delays disappearance time. If you need к delay disappearance so that the mouse can move к the Подсказка content, Вы можете configure this configuration item.

##${prefix} confine (логический) = true

Whether к confine the Подсказка box within the canvas area, по умолчанию is включен. It is valid для renderMode:"html".

#${prefix} легендаs

легенда configuration, currently providing three types из легендаs, имяly discrete легенда (`'discrete'`), continuous цвет легенда (`'цвет'`), и continuous размер легенда (`'размер'`).

{{ use: компонент-легенда-discrete(
  prefix = ${prefix}
)}}

{{ use: компонент-легенда-цвет(
  prefix = ${prefix}
) }}

{{ use: компонент-легенда-размер(
  prefix = ${prefix}
) }}

#${prefix} axes
Specifically the same as the axis configuration из Vграфик, it can support [linear axis](https://visactor.io/vграфик/option/barграфик#axes-linear.тип), [discrete axis](https://visactor.io/vграфик/ option/barграфик#axes-band.тип) и [time axis](https://visactor.io/vграфик/option/barграфик#axes-time.тип).

Supports axis configuration в four directions. по по умолчанию, the upper axis is в the последний row из the column header, the lower axis is в the frozen row в the низ из the таблица, the лево axis is в the последний column из the row header, и the upper axis is в the rightmost fixed column из the header. If axes из a certain orientation are also configured в the spec из the indicator, the priority в the spec is higher.

пример:

```
{
  axes: [
      {
        orient: 'низ'
      },
      {
        orient: 'лево',
        заголовок: {
          видимый: true
        }
      },
      {
        orient: 'право',
        видимый: true,
        grid: {
          видимый: false
        }
      }
    ]
}
```

#${prefix} пользовательскийRender(функция|объект)

пользовательский rendering в функция или объект form. тип: `IпользовательскийRenderFuc | IпользовательскийRenderObj`.

Where IпользовательскийRenderFuc is defined as:

```
 тип IпользовательскийRenderFuc = (args: пользовательскийRenderFunctionArg) => IпользовательскийRenderObj;
```

{{ use: common-пользовательскийRenderFunctionArg() }}

{{ use: common-пользовательский-render-объект(
  prefix = '##' + ${prefix},
) }}

## overscrollBehavior(строка) = 'авто'

таблица scrolling behavior, can be set: 'авто'|'никто', the по умолчанию значение is 'авто'.

```
'авто': Trigger the browser's по умолчанию behavior when the таблица scrolls к the верх или низ;
'никто': don't triggers the browser's по умолчанию behavior when the таблица scrolls к the верх или низ;
```

#${prefix} пользовательскийMergeCell(функция|объект)
пользовательскийize cell merging rules. When the incoming row и column numbers are within the target area, the merging rules are returned:

- текст: Merge текст в cells
- range: merged range
- style: style из merged cells
  пример:

```
  пользовательскийMergeCell: (col, row, таблица) => {
    if (col > 0 && col < 8 && row > 7 && row < 11) {
      возврат {
        текст: 'merge текст',
        range: {
          начало: {
            col: 1,
            row: 8
          },
          конец: {
            col: 7,
            row: 10
          }
        },
        style: {
          bgColor: '#ccc'
        }
      };
    }
  }

```

`пользовательскийMergeCell` can also be configured as an массив из merge rules. каждый item в the массив is a merge rule. The configuration из the rule is the same as the возврат значение из the `пользовательскийMergeCell` обратный вызов функция.

#${prefix} пользовательскийCellStyle(массив)

```
{
   пользовательскийCellStyle: {id: строка;style: ColumnStyleOption | ((styleArg: StylePropertyFunctionArg) => ColumnStyleOption)}[]
}
```

пользовательский cell style

- id: the unique id из the пользовательский style
- style: пользовательский cell style, which is the same as the `style` configuration в `column`. The final rendering effect is the fusion из the original style из the cell и the пользовательский style.

#${prefix} пользовательскийCellStyleArrangement(массив)

```
{
  пользовательскийCellStyleArrangement:
  {
    cellPosition: {
      row?: число;
      col?: число;
      range?: {
        начало: {row: число; col: число};
        конец: {row: число; col: число}
      }
  };
  пользовательскийStyleId: строка}[]
}
```

пользовательский cell style assignment

- cellPosition: cell позиция information, supports configuration из single cells и cell areas
  - Single cell: `{ row: число, column: число }`
  - Cell range: `{ range: { начало: { row: число, column: число }, конец: { row: число, column: число} } }`
- пользовательскийStyleId: пользовательский style id, the same as the id defined when регистрацияing the пользовательский style

#${prefix} rowSeriesNumber(IRowSeriesNumber)

set row serial число.
{{ use: row-series-число(
    prefix = '###',
) }}

#${prefix} editor (строка|объект|функция)

Global configuration cell editor

```
editor?: строка | IEditor | ((args: BaseCellInfo & { таблица: Baseтаблицаапи }) => строка | IEditor);
```

Among them, IEditor is the editor интерфейс defined в @visactor/vтаблица-editors. для details, please refer к the source код: https://github.com/VisActor/Vтаблица/blob/main/packвозрастs/vтаблица-editors/src/types.ts .

#${prefix} headerEditor (строка|объект|функция)

** `сводныйграфик` does не support setting this configuration item. **
Global configuration таблица header display title title editor

```
headerEditor?: строка | IEditor | ((args: BaseCellInfo & { таблица: Baseтаблицаапи }) => строка | IEditor);
```

#${prefix} editCellTrigger('doubleНажать' | 'Нажать' | 'апи' |'keydown') = 'doubleНажать'

The trigger timing для entering the editing state.

```

/** Edit triggering time: double Нажать событие | single Нажать событие | апи к manually начало editing | keydown событие. по умолчанию is double Нажать 'doubleНажать' */
editCellTrigger?:'doubleНажать' | 'Нажать' | 'апи' | 'keydown' | ('doubleНажать' | 'Нажать' | 'апи' | 'keydown')[];
```

#${prefix} plugins(IVтаблицаPlugin[])

Configure plugins. для details, please refer к the tutorial [Нажать here](../guide/plugin/usвозраст)

```
plugins?: IVтаблицаPlugin[];
```

#${prefix} enableLineBreak(логический) = false

Whether к включить line break, the по умолчанию is false.

#${prefix} clearDOM(логический) = true

Whether к clear the container DOM.

#${prefix} canvasширина(число | 'авто')

Sets the ширина из the canvas directly. If 'авто' is set, the canvas will be stretched based на the таблица content.

If не set, the размер из the таблица will be determined based на the container's ширина и высота.

#${prefix} canvasвысота(число | 'авто')

Sets the высота из the canvas directly. If 'авто' is set, the canvas will be stretched based на the таблица content.

If не set, the размер из the таблица will be determined based на the container's ширина и высота.

#${prefix} maxCanvasширина(число)

The maximum ширина из the таблица canvas. Only effective when canvasширина is set к 'авто'.

#${prefix} maxCanvasвысота(число)

The maximum высота из the таблица canvas. Only effective when canvasвысота is set к 'авто'.

#${prefix} animationAppear(логический|объект|)

таблица entry animation configuration.

```
animationAppear?: логический | {
  тип?: 'все' | 'one-по-one';
  direction?: 'row' | 'column';
  duration?: число;
  delay?: число;
};
```

Вы можете configure true к включить the по умолчанию animation, или Вы можете configure the animation parameters:

- `тип` The тип из the entry animation, currently supports `все` и `one-по-one`, и the по умолчанию is `one-по-one`
- `direction` The direction из the entry animation, currently supports `row` и `column`, и the по умолчанию is `row`
- `duration` The duration из a single animation, в milliseconds, для `one-по-one`, it is the duration из one animation, и the по умолчанию is 500
- `delay` The delay из the animation, в milliseconds; для `one-по-one`, it is the time difference between the two animations, для `все`, it is the delay из все animations, и the по умолчанию is 0

#${prefix} formatCopyValue((значение: строка) => строка)

Format the значение when copying.

#${prefix} изменение размера(объект)

Resizing lineвысота/columnширина interaction configuration, specific configuration items as follows:

#${prefix} columnResizeMode(строка) = 'все'

Mouse навести over the cell право граница can перетаскивание и adjust column ширина. This operation can trigger Следующий range:

- 'все' The entire column, including header и body cells, can adjust column ширина
- 'никто' отключить adjustment
- 'header' Only adjusтаблица в header cells
- 'body' Only adjusтаблица в body cells

#${prefix} rowResizeMode(строка) = 'никто'

Mouse навести over the cell низ граница can перетаскивание и adjust row высота. This operation can trigger Следующий range:

- 'все' The entire row, including header и body cells, can adjust row высота
- 'никто' отключить adjustment
- 'header' Only adjusтаблица в header cells
- 'body' Only adjusтаблица в body cells

##${prefix} disableDblНажатьавтоResizeColширина(логический) = false

отключить авто изменение размера column ширина when double tapping the column граница line

columnResizeType(строка)

Only affects в сводныйтаблица/сводныйChard The range из effects when adjusting column ширина, configurable options:

- `column`: Adjusting the column ширина only adjusts the текущий column
- `indicator`: When adjusting the column ширина, the corresponding columns из the same indicator will be adjusted
- `indicatorGroup`: Adjust the ширина из все indicator columns under the same parent dimension
- `все`: все column ширинаs are adjusted

##${prefix} rowResizeType(строка)

Only affects в сводныйтаблица/сводныйChard Adjust the effective range из row высота, configurable items:

- `row`: adjust the row высота only adjust the текущий row
- `indicator`: rows corresponding к the same indicator will be adjusted when the row высота is adjusted
- `indicatorGroup`: Adjust the высота из все indicator rows under the same parent dimension
- `все`: все row высотаs are adjusted

#${prefix} dragOrder(объект)

#${prefix} dragOrder(объект)

Configuration для dragging к move positions.

##${prefix} dragHeaderMode(строка) = 'никто'

Controls the switch для dragging the таблица header к move positions. After selecting a cell, dragging the cell с the mouse can trigger the move. The range из interchangeable cells can be limited:

- 'все' все таблица headers can be interchanged
- 'никто' Cannot be interchanged
- 'column' Only column headers can be interchanged
- 'row' Only row headers can be interchanged

##${prefix} frozenColDragHeaderMode(строка) = 'fixedFrozenCount'

The rule для dragging the таблица header к move positions для the frozen part. The по умолчанию is fixedFrozenCount. Only effective для списоктаблица тип settings!

- "отключен" (prohibit adjusting frozen column positions): Do не allow таблица headers из other columns к move into frozen columns, nor allow frozen columns к move out. Frozen columns remain unchanged.
- "adjustFrozenCount" (adjust the число из frozen columns according к the interaction results): Allow таблица headers из other columns к move into frozen columns и frozen columns к move out, и adjust the число из frozen columns according к the dragging action. When the таблица headers из other columns are dragged into the frozen column позиция, the число из frozen columns increases; when the таблица headers из other columns are dragged out из the frozen column позиция, the число из frozen columns decreases.
- "fixedFrozenCount" (can adjust frozen columns и keep the число из frozen columns unchanged): Allow freely dragging таблица headers из other columns into или out из frozen column positions while keeping the число из frozen columns unchanged.

##${prefix} validateDragOrderOnEnd(функция)

Validate when the перетаскивание к move позиция ends.

```
validateDragOrderOnEnd?: (source: CellAddress, target: CellAddress) => логический;
```

