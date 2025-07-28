# выбрать cell

## Mouse Нажать selection

When using Vтаблица для данные analytics, individual cells can be selected с a mouse Нажать. Once a cell is selected, Вы можете manipulate the cell или get the corresponding данные. по по умолчанию, Vтаблица allows Нажать-к-выбрать cells.

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/48c337ece11d289fc4644a20d.png)

As shown above, after Нажатьing на cell (2,3), the cell is selected.

Нажатьing на the header cell will выбрать the entire row или column по по умолчанию. If you only want к выбрать the текущий cell, Вы можете set `выбрать.headerSelectMode` к `'cell'`, или if you only want к выбрать cells в the body, Вы можете set `выбрать.headerSelectMode` к `'body'`.

## Mouse box selection

в addition к Нажатьing на a single cell, Vтаблица also supports mouse box selection, which can выбрать multiple cells по dragging the mouse. This feature allows the user к выбрать multiple cells в once (Hold down ctrl или shift к make multiple selections). по по умолчанию, Vтаблица has mouse box selection turned на.

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/eb08aeafba39ab34c8a08c60f.png)

As shown в the imвозраст above, the user selects multiple cells по dragging the mouse.

## Call интерфейс selection

A certain business scenario, such as linkвозраст selection с other modules, is не a manual mouse-triggered selection. The selection can be completed с the help из the интерфейс.

### Single cell selection

Usвозраст is as follows:

```
// выбрать cells в 4 columns и 5 rows
таблицаInstance.selectCell(4,5);
```

### Cell range selected

Call the интерфейс selectCells, the usвозраст is as follows:

```
// Two ranges в the таблица: от column 1, row 2 к column 4, row 2 и от column 3, row 5 к column 7, row 8
таблицаInstance.selectCells([{начало:{col:1,row:2},конец:{col:4,row:2}},{начало:{col:3,row:5},конец:{col:7 ,row:8}}]);
```

### Clear текущий selection

call апи `clearSelected`.

## выбрать style

When one или more cells are selected, Vтаблица applies specific styles к включить the user к identify the selected cells. can be passed `тема.selectionStyle` Configure the selected style.

для пример, к set the фон цвет из the selected cell к purple, Вы можете configure it like this:

```javascript
const = новый Vтаблица.списоктаблица({
  тема: {
    selectionStyle: {
        cellBorderLineширина: 2,
        cellBorderColor: '#9900ff',
        cellBgColor: 'rgba(153,0,255,0.2)',
    }
  }
});
```

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a2c7623458257d15626270909.png)

As shown в the imвозраст above, the фон цвет из the selected cell is purple.

## выбрать и highlight the entire row и column

Нажатьing a cell may require highlighting the entire row или column, which can be achieved through Следующий configuration:

```
  выбрать: {
    highlightMode: 'cross' // can be configured as 'cross' или 'row' или 'column'
  }
```

Note: If you выбрать multiple cells, the highlight effect will disappear.

The highlighting style can be configured в the style.

Global configuration: в `тема.selectionStyle`, the specific configuration method is:

```
тема:{
  selectionStyle:{
    inlineRowBgColor: 'rgb(160,207,245)',
    inlineColumnBgColor: 'rgb(160,207,245)'
  }
}
```

Вы можете also configure headerStyle и bodyStyle separately. The specific configuration method is:

```
тема:{
  headerStyle: {
    выбрать: {
      inlineRowBgColor: 'rgb(0,207,245)',
      inlineColumnBgColor: 'rgb(0,207,245)'
    }
  },
  bodyStyle: {
    выбрать: {
      inlineRowBgColor: 'rgb(0,207,245)',
      inlineColumnBgColor: 'rgb(0,207,245)'
    }
  }
}
```

## Choose к copy cell contents

Vтаблица provides a copy shortcut функция, users can set `keyboardOptions.copySelected` для `true`, к включить the shortcut copy функция:

```javascript
const таблица = новый Vтаблица.списоктаблица({
  keyboardOptions: {
    copySelected: true
  }
});
```

After enabling shortcut keys, users can use the browser's built-в copy shortcut keys (such as Ctrl+C, Cmd+C) к copy the selected cell content. Vтаблица maintains two copy formats:

```
новый ClipboardItem({
'текст/html': новый Blob([данныеHTML], { тип: 'текст/html' }),
'текст/plain': новый Blob([данные], { тип: 'текст/plain' })
})
```

для specific implementation logic, please refer к the код logic https://github.com/VisActor/Vтаблица/blob/develop/packвозрастs/vтаблица/src/событие/списокener/container-dom.ts

**Copy other related content:**

1. There is also an событие called `copy_данные` к match the copying из content. This событие will be triggered when copying и возврат the content copied к the clipboard.

2. If you want к obtain the selected content as the copy content through the интерфейс, Вы можете call the интерфейс `getCopyValue`.

3. в addition, we provide the configuration item `formatCopyValue` к format the copied content. для пример, if you want к add a suffix `"Copy content от XXXX"` к the copied content

## открыть выбрать все

When operating на таблица данные, the user may want к shortcut все the contents из the таблица. The открыть выбрать все функция allows the user к выбрать все the contents из the таблица в once по holding down the Ctrl key и pressing the A key. It should be noted that this функция is turned off по по умолчанию, и the выбрать все функция is turned на с Следующий configuration:

```
    keyboardOptions: {
        selectAllOnCtrlA?: логический | SelectAllOnCtrlAOption;
    }
```

If you do не want к выбрать the таблица header или row число column в the same time, Вы можете configure it according к `SelectAllOnCtrlAOption`.

## отключить выбрать Interaction

в некоторые cases, you may не want the user к выбрать a cell `выбрать` Configuration disables selection interaction.

для пример, к отключить selection interactions для все cells, Вы можете `выбрать.disableSelect` Set к `true`:

```javascript
const таблица новый Vтаблица.списоктаблица({
  выбрать: {
    disableSelect: true
  }
});
```

к отключить the selection из header cells, Вы можете `выбрать.disableHeaderSelect` Set к `true`:

```javascript
const таблица = новый Vтаблица.списоктаблица({
  выбрать: {
    disableHeaderSelect: true
  }
});
```

After disabling selection interaction, the user cannot выбрать cells по Нажатьing или dragging the mouse.

There are special needs that do не want users к be able к выбрать certain columns в the таблица. для this requirement, Vтаблица provides a configuration item column.disableSelect и disableHeaderSelect на the column, which allows us к prohibit the selection из a certain column \[сводныйтаблица does не have this configuration].

So far, we have introduced the cell selection functions из Vтаблица, including mouse Нажать selection, mouse box selection, disabling interaction selection, selecting styles, и choosing к copy cell content. по mastering these functions, Вы можете more easily perform данные analytics и processing в Vтаблица.
