# переключатель Кнопка тип

переключатель Кнопка тип cells are suiтаблица для users к выбрать one из multiple items в the таблица. переключатель Кнопка тип cells are widely used в many applications, including task manвозрастment, данные filtering, permission settings, etc.

The advantвозрастs из переключатель Кнопка cells в таблицаs are as follows:

1. The use из переключатель Кнопка тип cells is very intuitive и flexible. Users can выбрать an option в a column или cell к perform specific actions или filter данные according к their needs. This interaction method enables users к control their operations more finely, improving user experience и efficiency.
2. переключатель Кнопка тип cells usually use different иконкаs или colors к indicate selected и unselected states, providing visual feedback. This way the user can easily identify which options have been selected и which have не.

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/переключатель.png)

## Introduction к the exclusive configuration items из переключатель переключатель Кнопка

The unique configuration items из the переключатель переключатель Кнопка тип в the configuration are as follows:

1. `checked`: Whether the cell is selected. The по умолчанию значение is false. Configuration functions are supported. Different cell configurations are different.
2. `отключить`: Whether the cell переключатель Кнопка can be Нажать-отключен. The по умолчанию значение is false. It supports configuration functions и has different configurations для different cells.
3. `radioCheckType`: The only range из the переключатель Кнопка, the по умолчанию значение is `column`:

    * `column`: The переключатель Кнопка is the only one selected в a column
    * `cell`: The переключатель Кнопка is uniquely selected в a cell

4. `radioDirectionInCell`: When there are multiple переключатель Кнопка boxes в a переключатель Кнопка тип cell, the direction в which the переключатель Кнопка boxes are arranged. The по умолчанию значение is `vertical`:

    * `vertical`: The переключатель Кнопкаs are arranged vertically
    * `horizontal`: horizontal arrangement из переключатель Кнопкаs

пример:
```javascript
{
   headerType: 'переключатель', //Specify the header cell к be displayed as a переключатель Кнопка
   cellType: 'переключатель',//Specify the body cell к be displayed as a переключатель Кнопка
   поле: 'check',
   checked: (args) => { if (args.row === 3) возврат true },
   отключен: false,
   radioCheckType: 'column',
   radioDirectionInCell: 'vertical',
}
```

## Introduction к the exclusive данные тип из переключатель переключатель Кнопка

The данные corresponding к переключатель supports `логический` `строка` `объект`, или an массив composed из `строка` `объект`. в this case, multiple переключатель Кнопка boxes will be displayed в the cell; if the значение is не set, the по умолчанию is false.

1. Among the three types, it is more common к set the `логический` тип. для пример, the check поле is set as follows:
```
const columns=[
   {
     headerType: 'переключатель', //Specify the header cell к be displayed as a переключатель Кнопка
     cellType: 'переключатель',//Specify the body cell к be displayed as a переключатель Кнопка
     поле: 'check',
   }
]
const records = [
   {
     product: 'a',
     check: true
   },
   {
      product: 'b',
     check: false
   },
   {
      product: 'c',
     check: false
   }
]
```

2. If set к `строка` тип, the текст will be displayed на the право side из the переключатель box, и the переключатель Кнопка will be unselected по по умолчанию. для пример, the product поле is set as follows:
```
const columns=[
   {
     headerType: 'переключатель', //Specify the header cell к be displayed as a переключатель Кнопка
     cellType: 'переключатель',//Specify the body cell к be displayed as a переключатель Кнопка
     поле: 'product',
   }
]
const records = [
   {
     product: 'a',
   },
   {
      product: 'b',
   },
   {
      product: 'c',
   }
]
```

3. If каждый state из the данные item is different, Вы можете set the объект объект.

The объект объект supports configuring Следующий свойства:

* текст: The текст displayed в the переключатель Кнопка из this cell
* checked: Whether the cell переключатель Кнопка is selected
* отключить: Whether the cell переключатель Кнопка is отключен

пример:
```javasxript
const records = [
   {
     percent: '100%',
     check: {
       текст: 'unchecked',
       checked: false,
       отключить: false
     }
   },
   {
     percent: '80%',
     check: {
       текст: 'checked',
       checked: true,
       отключить: false
     }
   }
];
```

`checked` и `отключить` support configuration в both данные и `column`. The priority из configuration в данные is higher than the configuration в `column`.

## Get the данные selection status through the интерфейс

Get the selected status из все переключатель данные under a certain поле:

Note: The order corresponds к the original incoming данные records и does не correspond к the status значение из the row displayed в the таблица.
```
getRadioState(поле?: строка | число): число | Record<число, логический | число>
```

Get the переключатель status из a certain cell:

Note: If a cell contains multiple переключатель Кнопка boxes, the возврат значение is число, which refers к the index из the selected переключатель в the cell, otherwise the возврат значение is логический.
```
getCellRadioState(col: число, row: число): логический | число
```


Through the above introduction, you have learned how к use the переключатель переключатель Кнопка тип к display данные в the Vтаблица таблица. I hope it will be helpful к you.