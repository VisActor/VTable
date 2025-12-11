# иконка use

в Vтаблица, we can use the пользовательский иконка функция к improve the readability и visual effect из the таблица. This tutorial will mainly introduce how к use the иконка, how к регистрация it, и how к reset the функция иконка.

## Define иконка

We can configure the cell иконкаs displayed в the header и body through иконка и headerиконка respectively:

- `headerиконка` Header cell иконка configuration, which can help us set the иконка style из the header. Configuration items are based на `ColumnиконкаOption` The тип is defined, и Вы можете refer к the given configuration для details.

- `иконка` The иконка used к configure the body cell.

The specific configuration content is an объект из тип `ColumnиконкаOption`. Вы можете also pass a пользовательский функция к dynamically set the иконка style из the cell. для the specific definition из ColumnиконкаOption, please refer к: https://visactor.io/vтаблица/option/списоктаблица-columns-текст#иконка

### Header иконка configuration пример

первый, let's loхорошо в a use `headerиконка` Simple пример из.

```javascript
const таблицаInstance = новый Vтаблица.списоктаблица({
  columns: [
    {
      поле: 'orderID',
      заголовок: '订单编号',
      headerиконка: {
        тип: 'svg', //指定svg格式图标，其他还支持path，imвозраст
        svg: `<svg xmlns="http://www.w3.org/2000/svg" ширина="12" высота="12" viewBox="0 0 12 12" fill="никто">
        <path d="M1.29609 1C0.745635 1 0.444871 1.64195 0.797169 2.06491L4.64953 6.68988V9.81861C4.64953 9.89573 4.69727 9.9648 4.76942 9.99205L7.11236 10.877C7.27164 10.9372 7.4419 10.8195 7.4419 10.6492V6.68988L11.2239 2.06012C11.5703 1.63606 11.2685 1 10.721 1H1.29609Z" strхорошоe="#141414" strхорошоe-opaГород="0.65" strхорошоe-ширина="1.18463" strхорошоe-linejoin="round"/>
        </svg>`,
        ширина: 20,
        высота: 20,
        имя: 'filter', //定义图标的名称，在内部会作为缓存的key值
        positionType: Vтаблица.TYPES.иконкаPosition.absoluteRight, // 指定位置，可以在文本的前后，或者在绝对定位在单元格的左侧右侧
        visibleTime: 'mouseenter_cell', // 显示时机， 'always' | 'mouseenter_cell' | 'Нажать_cell'
        навести: {
          // 热区大小
          ширина: 26,
          высота: 26,
          bgColor: 'rgba(22,44,66,0.5)'
        },
        Подсказка: {
          style: { arrowMark: false },
          // 气泡框，按钮的的解释信息
          заголовок: '过滤',
          placement: Vтаблица.TYPES.Placement.право
        }
      }
    }
  ]
});
```

в this пример, we create a поле called "Order число" для the список header и configure it с a поле called `filter` иконка.

The same configuration method can be used к use иконкаs в the row и column headers из сводный таблицаs.

### Cell иконка configuration пример

следующий, let's loхорошо в a use `иконка` Simple пример из.

```javascript
const таблицаInstance = новый Vтаблица.списоктаблица({
  columns: [
    {
      поле: 'orderID',
      заголовок: '订单编号',
      иконка: {
        тип: 'imвозраст',
        src: 'avatar', // src从records中поле位avator的字段中取值
        имя: 'Avatar',
        shape: 'circle',
        //定义文本内容行内图标，第一个字符展示
        ширина: 30, // необязательный
        высота: 30,
        positionType: Vтаблица.TYPES.иконкаPosition.contentLeft,
        marginRight: 20,
        marginLeft: 0,
        cursor: 'pointer'
      }
    }
  ]
});
```

в this пример, we configure a cell имяd `Avatar` иконка. The role из this иконка is к display the avatar picture, и the значение из the picture src is obtained от the поле из the avator из records.

[online демонстрация](../../демонстрация/пользовательский-render/пользовательский-иконка)

## How к регистрация the иконка и use it after registration

в Vтаблица, through `регистрация.иконка` Method, we can регистрация пользовательский иконкаs и use them в the таблица. If you want к replace the built-в функция иконкаs, Вы можете also do so по регистрацияing.

[Registration интерфейс Method Usвозраст Introduction](../../апи/регистрация#иконка)

### пример: регистрация an иконка имяd order

Suppose we need к регистрация a `order` иконка, the код is as follows:

```javascript
Vтаблица.регистрация.иконка('order', {
  тип: 'svg',
  svg: 'http://' + window.location.host + '/mock-данные/order.svg',
  ширина: 22,
  высота: 22,
  имя: 'order',
  positionType: Vтаблица.TYPES.иконкаPosition.лево,
  marginRight: 0,
  навести: {
    ширина: 22,
    высота: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)'
  },
  cursor: 'pointer'
});
```

### How к use it after registration

After registration is complete, we can, в the column definition из the таблица, pass `headerиконка` и `иконка` Property references this иконка.

```javascript
const таблицаInstance = новый Vтаблица.сводныйтаблица({
  columns: [
    {
      поле: 'orderID',
      заголовок: '订单编号',
      headerиконка: 'order',
      иконка: 'order'
    }
  ]
});
```

в addition, the регистрацияed иконка can also be found в `пользовательскиймакет` Used в.

## Reset функция иконка

для built-в functional иконкаs, such as pin, сортировка, etc., we can replace them по re-регистрацияing the иконка из the same имя. It should be noted that when re-регистрацияing the иконка, be sure к configure `funcType` свойства к ensure that иконкаs can be replaced correctly.

### пример: Replacing the frozen freeze иконка

Suppose we need к replace the relevant иконка из the built-в frozen функция, the код is as follows:

```javascript
Vтаблица.регистрация.иконка('freeze', {
  тип: 'svg',
  svg: 'http://' + window.location.host + '/mock-данные/freeze.svg',
  ширина: 22,
  высота: 22,
  имя: 'freeze',
  positionType: Vтаблица.TYPES.иконкаPosition.лево,
  marginRight: 0,
  funcType: Vтаблица.TYPES.иконкаFuncTypeEnum.frozen,
  навести: {
    ширина: 22,
    высота: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)'
  },
  cursor: 'pointer'
});

Vтаблица.регистрация.иконка('frozen', {
  тип: 'svg',
  svg: 'http://' + window.location.host + '/mock-данные/frozen.svg',
  ширина: 22,
  высота: 22,
  имя: 'frozen',
  positionType: Vтаблица.TYPES.иконкаPosition.лево,
  marginRight: 0,
  funcType: Vтаблица.TYPES.иконкаFuncTypeEnum.frozen,
  навести: {
    ширина: 22,
    высота: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)'
  },
  cursor: 'pointer'
});

Vтаблица.регистрация.иконка('frozenCurrent', {
  тип: 'svg',
  svg: 'http://' + window.location.host + '/mock-данные/frozenCurrent.svg',
  ширина: 22,
  высота: 22,
  имя: 'frozenCurrent',
  positionType: Vтаблица.TYPES.иконкаPosition.лево,
  marginRight: 0,
  funcType: Vтаблица.TYPES.иконкаFuncTypeEnum.frozen,
  навести: {
    ширина: 22,
    высота: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)'
  },
  cursor: 'pointer'
});
```

The effect after replacement is as follows: https://visactor.io/vтаблица/демонстрация/пользовательский-render/пользовательский-иконка

в the same way, we can replace other functional иконкаs. Several иконкаs related к internal functions are built into Vтаблица, such as сортировкаing, fixed columns, отпускание-down меню иконкаs, развернуть folding иконкаs, etc.

The built-в иконка file address: https://github.com/VisActor/Vтаблица/blob/39eaa851d6a5415b9c7bba746d23ca173ccf675f/packвозрастs/vтаблица/src/иконкаs.ts.

The список из resetтаблица internal иконкаs is as follows:

| Functions                      | Configure funcType                        | Configure имя   | иконка description                                                    |
| :----------------------------- | :---------------------------------------- | :--------------- | :------------------------------------------------------------------ |
| сортировка                           | Vтаблица. TYPES. иконкаFuncTypeEnum.сортировка      | "сортировка_normal"    | сортировка функция иконка, normal unсортировкаed status                          |
| сортировка                           | Vтаблица. TYPES. иконкаFuncTypeEnum.сортировка      | "сортировка_upward"    | сортировка функция иконкаs, ascending status                               |
| сортировка                           | Vтаблица. TYPES. иконкаFuncTypeEnum.сортировка      | "сортировка_downward"  | сортировка функция иконкаs, descending status                              |
| Fixed Column                   | Vтаблица. TYPES. иконкаFuncTypeEnum.frozen    | "freeze"         | Fixed Column функция иконка, Fixed State                             |
| Fixed Columns                  | Vтаблица. TYPES. иконкаFuncTypeEnum.frozen    | "frozen"         | Fixed Columns функция иконка, Fixed Status                           |
| Fixed Columns                  | Vтаблица. TYPES. иконкаFuncTypeEnum.frozen    | "frozenCurrent"  | Fixed Columns функция иконка, Frozen When Columns                    |
| Imвозраст или video address invalid | Vтаблица. TYPES. иконкаFuncTypeEnum.damвозрастPic | "damвозраст_pic"     | Multimedia resource parsing failed                                  |
| Tree Structure Folding         | Vтаблица. TYPES. иконкаFuncTypeEnum.свернуть  | "свернуть"       | Tree Structure Folded State                                         |
| Tree Structure развернуть          | Vтаблица. TYPES. иконкаFuncTypeEnum.развернуть    | "развернуть"         | Tree Structure развернуть State                                         |
| Tree Structure Folding         | Vтаблица. TYPES. иконкаFuncTypeEnum.свернуть  | "свернуть"       | Tree Structure Folded State                                         |
| отпускание-down меню                 | Vтаблица. TYPES. иконкаFuncTypeEnum.выпадающий список  | "downward"       | отпускание-down иконка normal status                                        |
| выпадающий список меню                  | Vтаблица. TYPES. иконкаFuncTypeEnum.выпадающий список  | "downward_hover" | выпадающий список иконка навести status                                          |
| Row перетаскивание и отпускание              | Vтаблица.TYPES.иконкаFuncTypeEnum.dragReorder | "dragReorder"    | перетаскивание и отпускание row order, видимый when rowSeriesNumber is configured |

**It should be noted**: The built-в графикs в the список have their own special functions и can be reset, but they cannot be configured в the definition из headerиконка или иконка! Следующий incorrect usвозраст:

```
  columns: [
    {
      поле: 'Продажи',
      заголовок: 'Продажи',
      ширина: 'авто',
      сортировка: true,
      headerиконка: 'развернуть' // развернуть is an internal keyword. If you need к use it, please регистрация other имяs к replace headerиконка.
    },
  ]
```

**в the same time, the иконкаs регистрацияed в your own business do не need к configure `funcType`.**

в this point, the tutorial на how к use иконкаs в Vтаблица, регистрация и replace функция иконкаs is все introduced. I hope this tutorial can help you better understand и use Vтаблица, и create a more beautiful и practical данные lake visualization таблица
