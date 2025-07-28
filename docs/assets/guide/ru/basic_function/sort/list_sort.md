# списоктаблица сортировкаing функция

в the process из данные analytics, the сортировкаing (сортировкаing) функция is very important для the organization и analysis из данные. по сортировкаing, users can quickly arrange the данные they care about в front, improve the efficiency из данные search и analysis, и quickly find outliers и patterns в the данные.

Vтаблица provides rich сортировкаing functions, users can easily открыть на demand, пользовательскийize сортировкаing rules, set initial сортировкаing status, etc.

## включить сортировкаing

к use the сортировкаing функция из Vтаблица, you need к configure the таблица columns первый. exist `columns` The configuration items для каждый column need к be set according к cellType (column тип). в this tutorial, we mainly фокус на сортировкаing-related configurations.

Here is an пример из enabling сортировкаing:

```js
const списоктаблица = новый списоктаблица({
  // ...other configuration items
  columns: [
    {
      заголовок: 'имя',
      поле: 'имя',
      cellType: 'текст',
      сортировка: true
    },
    {
      заголовок: 'возраст',
      поле: 'возраст',
      cellType: 'текст',
      сортировка: (v1, v2, order) => {
        if (order === 'desc') {
          возврат v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
        }
        возврат v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
      }
    }
  ]
});
```

в the above код,`сортировка` для `true`, indicating that the column supports сортировкаing и uses the built-в collation.

## сортировкаing Settings

Vтаблица allows users к пользовательскийize collations. к specify a collation, you need к `сортировка` Set as a функция. The функция takes two arguments `a` и `b`, representing two values к compare. When the функция returns a negative значение,`a` line up в `b` Front; when the возврат значение is positive,`a` line up в `b` Later; when the возврат значение is 0,`a` и `b` The relative позиция remains unchanged.

Here is an пример из a пользовательский collation:

```js
const списоктаблица = новый списоктаблица({
  // ...other configuration items
  columns: [
    {
      заголовок: 'имя',
      поле: 'имя',
      cellType: 'текст',
      сортировка: (a, b) => a.localeCompare(b)
    },
    {
      заголовок: 'возраст',
      поле: 'возраст',
      cellType: 'текст',
      сортировка: (a, b) => parseInt(a) - parseInt(b)
    }
  ]
});
```

в the above код,`имя` Column usвозраст `localeCompare` The функция сортировкаs к ensure the correct сортировкаing result из Chinese characters;`возраст` Columns are сортировкаed по число размер.

## Multiple column сортировкаing

Vтаблица allows сортировкаing по multiple columns when the `multipleсортировка` option is включен. This feature allows users к сортировка данные в the таблица по more than one column, providing a more detailed view из данные based на multiple criteria. к включить multi-column сортировкаing, configure the `multipleсортировка` option в the `списоктаблица` configuration.

The `multipleсортировка` option is a логический тип и can be set as follows:

```ts
списоктаблица({
  // ...other configuration items
  columns: [
    // ...column configurations
  ],
  multipleсортировка: true
});
```

If включен, users, when Нажатьing на the сортировка иконка в the column headers, can add additional сортировка criteria без removing the предыдущий сортировка.

пример:

```javascript liveдемонстрация template=vтаблица
const records = [
  { имя: 'Bill', возраст: 18 },
  { имя: 'Alex', возраст: 31 },
  { имя: 'Bob', возраст: 31 },
  { имя: 'Bruce', возраст: 22 },
  { имя: 'Anna', возраст: 22 },
  { имя: 'Martha', возраст: 45 },
  { имя: 'Steve', возраст: 29 },
  { имя: 'John', возраст: 31 },
  { имя: 'Kate', возраст: 18 },
  { имя: 'Lisa', возраст: 22 }
];

const columns = [
  {
    поле: 'имя',
    заголовок: 'имя',
    ширина: 'авто',
    сортировка: true
  },
  {
    поле: 'возраст',
    заголовок: 'возраст',
    ширина: 'авто',
    сортировка: true
  }
];

const option = {
  records,
  columns,
  ширинаMode: 'standard',
  multipleсортировка: true
};

// 创建 Vтаблица 实例
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window.таблицаInstance = таблицаInstance;
```

## Initial сортировкаing state

Vтаблица supports setting the initial сортировкаing state для the таблица. к set the initial сортировкаing state, Вы можете `списоктаблица` Used в configuration items `сортировкаState` Configure.`сортировкаState` тип is `сортировкаState` или `сортировкаState[]`Among them,`сортировкаState` Defined as follows:

```ts
сортировкаState {
  /** сортировка по поле */
  поле: строка;
  /** сортировкаing rules */
  порядок: 'desc' | 'asc' | 'normal';
}
```

Here is an пример из setting the initial сортировка state:

```js
const списоктаблица = новый списоктаблица({
  // ...other configuration items
  columns: [
    // ...column configuration
  ],
  сортировкаState: [
    {
      поле: 'возраст',
      порядок: 'desc'
    }
  ]
});
```

в the above код, the initial сортировкаing state из the таблица is в descending order по возраст.

## сортировка state setting интерфейс(update сортировка rule)

Vтаблица provides the `updateсортировкаState` property для setting the сортировкаing state.
интерфейс Description:

```
  /**
   * Update сортировка status
   * @param сортировкаState The сортировкаing state к be set
   * @param executeсортировка Whether к execute internal сортировкаing logic, setting false will only update the иконка status и не perform данные сортировкаing
   */
  updateсортировкаState(сортировкаState: сортировкаState[] | сортировкаState | null, executeсортировка: логический = true)
```

When you need к modify the сортировкаing status, Вы можете call this интерфейс directly. для пример:

```js
таблицаInstance.updateсортировкаState({
  поле: 'имя',
  порядок: 'asc'
});
```

по using the `updateсортировкаState` интерфейс, users can dynamically adjust the сортировкаing state из the таблица в любой time к meet real-time analysis needs.

## отключить internal сортировкаing

в некоторые scenarios, the execution из сортировкаing logic is не expected к be performed по Vтаблица, для пример: the backend is responsible для сортировкаing.

Вы можете use Следующий configuration и process:

1. Set `сортировка` к false;

2. If you need к display the сортировка Кнопка, set `сортировкаState` к true;

3. Use the `сортировка_Нажать` событие к know that the user has Нажатьed the сортировка Кнопка. Note that the событие обратный вызов функция needs к возврат false к отключить the internal сортировкаing logic из Vтаблица:

```
таблицаInstance.на('сортировка_Нажать', args => {
    .....
    возврат false; //returning false means не executing the internal сортировкаing logic
  });
```

4. After списокening к the сортировка Кнопка Нажать, execute the business layer's сортировкаing logic. After the сортировкаing is completed, you need к use `setRecords` к update the данные к the таблица.
   Note:

- When calling the setRecords интерфейс, the сортировкаState в the second параметр option needs к be set к null, which clears the internal сортировкаing state (otherwise, when the setRecords is called, vтаблица will сортировка the данные according к the последний set сортировкаing state)

5. If you need к correspondingly switch the status из the сортировка иконка, you need к use the `updateсортировкаState` интерфейс, note that the second параметр из the интерфейс needs к be set к false, so that Вы можете only switch the сортировка иконка без executing the vтаблица's сортировкаing logic.

пример:

```javascript liveдемонстрация template=vтаблица
const records = [
  {
    230517143221027: 'CA-2018-10',
    230517143221030: 'JM-15580',
    230517143221032: 'Bagged Rubber Bands',
    230517143221023: 'Office Supplies',
    230517143221034: 'Fasteners',
    230517143221037: 'West',
    230517143221024: 'Loveland',
    230517143221029: '2018-12-30',
    230517143221042: '3',
    230517143221040: '3.024',
    230517143221041: '-0.605'
  },
  {
    230517143221027: 'CA-2018-70',
    230517143221030: 'EB-13975',
    230517143221032: 'GBC Binding covers',
    230517143221023: 'Office Supplies',
    230517143221034: 'Binders',
    230517143221037: 'West',
    230517143221024: 'Fairполе',
    230517143221029: '2018-12-30',
    230517143221042: '2',
    230517143221040: '20.72',
    230517143221041: '6.475'
  },
  {
    230517143221027: 'CA-2018-30',
    230517143221030: 'EB-13975',
    230517143221032: 'Cardinal Slant-D Ring Binder, Heavy Gauge Vinyl',
    230517143221023: 'Office Supplies',
    230517143221034: 'Binders',
    230517143221037: 'West',
    230517143221024: 'Fairполе',
    230517143221029: '2018-12-30',
    230517143221042: '2',
    230517143221040: '13.904',
    230517143221041: '4.519'
  },
  {
    230517143221027: 'CA-2018-80',
    230517143221030: 'PO-18865',
    230517143221032: 'Wilson Jones Legal размер Ring Binders',
    230517143221023: 'Office Supplies',
    230517143221034: 'Binders',
    230517143221037: 'East',
    230517143221024: 'новый York Город',
    230517143221029: '2018-12-30',
    230517143221042: '3',
    230517143221040: '52.776',
    230517143221041: '19.791'
  },
  {
    230517143221027: 'CA-2018-20',
    230517143221030: 'PO-18865',
    230517143221032: 'Gear Head AU3700S Headset',
    230517143221023: 'Technology',
    230517143221034: 'Phones',
    230517143221037: 'East',
    230517143221024: 'новый York Город',
    230517143221029: '2018-12-30',
    230517143221042: '7',
    230517143221040: '90.93',
    230517143221041: '2.728'
  },
  {
    230517143221027: 'CA-2018-40',
    230517143221030: 'PO-18865',
    230517143221032: 'Bush Westполе Collection Boхорошоcases, Fully Assembled',
    230517143221023: 'Furniture',
    230517143221034: 'Boхорошоcases',
    230517143221037: 'East',
    230517143221024: 'новый York Город',
    230517143221029: '2018-12-30',
    230517143221042: '4',
    230517143221040: '323.136',
    230517143221041: '12.118'
  },
  {
    230517143221027: 'CA-2018-60',
    230517143221030: 'CC-12430',
    230517143221032: 'Eureka The Boss Plus 12-Amp Hard Box Upright Vacuum, Red',
    230517143221023: 'Office Supplies',
    230517143221034: 'Appliances',
    230517143221037: 'Central',
    230517143221024: 'Columbus',
    230517143221029: '2018-12-30',
    230517143221042: '2',
    230517143221040: '209.3',
    230517143221041: '56.511'
  },
  {
    230517143221027: 'US-2018-50',
    230517143221030: 'KH-16360',
    230517143221032: 'Harbour Creations Steel Folding Chair',
    230517143221023: 'Furniture',
    230517143221034: 'Chairs',
    230517143221037: 'South',
    230517143221024: 'Louisville',
    230517143221029: '2018-12-29',
    230517143221042: '3',
    230517143221040: '258.75',
    230517143221041: '77.625'
  },
  {
    230517143221027: 'US-2018-90',
    230517143221030: 'KH-16360',
    230517143221032: 'Global Leather и Oak Executive Chair, Black',
    230517143221023: 'Furniture',
    230517143221034: 'Chairs',
    230517143221037: 'South',
    230517143221024: 'Louisville',
    230517143221029: '2018-12-29',
    230517143221042: '1',
    230517143221040: '300.98',
    230517143221041: '87.284'
  },
  {
    230517143221027: 'US-2018-10',
    230517143221030: 'KH-16360',
    230517143221032: 'Panasonic KP-350BK Electric Pencil Sharpener с авто Stop',
    230517143221023: 'Office Supplies',
    230517143221034: 'Art',
    230517143221037: 'South',
    230517143221024: 'Louisville',
    230517143221029: '2018-12-29',
    230517143221042: '1',
    230517143221040: '34.58',
    230517143221041: '10.028'
  },
  {
    230517143221027: 'US-2018-40',
    230517143221030: 'KH-16360',
    230517143221032: 'GBC ProНажать Spines для 32-Hole Punch',
    230517143221023: 'Office Supplies',
    230517143221034: 'Binders',
    230517143221037: 'South',
    230517143221024: 'Louisville',
    230517143221029: '2018-12-29',
    230517143221042: '1',
    230517143221040: '12.53',
    230517143221041: '5.889'
  },
  {
    230517143221027: 'US-2018-30',
    230517143221030: 'KH-16360',
    230517143221032: 'DMI Arturo Collection Mission-style Design Wood Chair',
    230517143221023: 'Furniture',
    230517143221034: 'Chairs',
    230517143221037: 'South',
    230517143221024: 'Louisville',
    230517143221029: '2018-12-29',
    230517143221042: '8',
    230517143221040: '1207.84',
    230517143221041: '314.038'
  },
  {
    230517143221027: 'CA-2018-99',
    230517143221030: 'BS-11755',
    230517143221032: 'Hand-Finished Solid Wood Document Frame',
    230517143221023: 'Furniture',
    230517143221034: 'Furnishings',
    230517143221037: 'West',
    230517143221024: 'Edmonds',
    230517143221029: '2018-12-29',
    230517143221042: '2',
    230517143221040: '68.46',
    230517143221041: '20.538'
  }
];

const columns = [
  {
    поле: '230517143221027',
    заголовок: 'ID Заказа',
    ширина: 'авто',
    сортировка: false,
    showсортировка: true
  },
  {
    поле: '230517143221030',
    заголовок: 'пользовательскийer ID',
    ширина: 'авто',
    showсортировка: true
  },
  {
    поле: '230517143221032',
    заголовок: 'Product имя',
    ширина: 'авто'
  },
  {
    поле: '230517143221023',
    заголовок: 'Категория',
    ширина: 'авто'
  },
  {
    поле: '230517143221034',
    заголовок: 'Sub-Категория',
    ширина: 'авто'
  },
  {
    поле: '230517143221037',
    заголовок: 'Регион',
    ширина: 'авто'
  },
  {
    поле: '230517143221024',
    заголовок: 'Город',
    ширина: 'авто'
  },
  {
    поле: '230517143221029',
    заголовок: 'Дата Заказа',
    ширина: 'авто'
  },
  {
    поле: '230517143221042',
    заголовок: 'Количество',
    ширина: 'авто'
  },
  {
    поле: '230517143221040',
    заголовок: 'Продажи',
    ширина: 'авто'
  },
  {
    поле: '230517143221041',
    заголовок: 'Прибыль',
    ширина: 'авто'
  }
];

const option = {
  records,
  columns,
  ширинаMode: 'standard'
};

// 创建 Vтаблица 实例
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window.таблицаInstance = таблицаInstance;
let НажатьCount = 0;
таблицаInstance.на('сортировка_Нажать', args => {
  НажатьCount++;
  const сортировкаState = НажатьCount % 3 === 0 ? 'desc' : НажатьCount % 3 === 1 ? 'asc' : 'normal';
  сортировкаRecords(args.поле, сортировкаState)
    .then(records => {
      таблицаInstance.setRecords(records, { сортировкаState: null });
      таблицаInstance.updateсортировкаState(
        {
          поле: args.поле,
          порядок: сортировкаState
        },
        false
      );
    })
    .catch(e => {
      throw e;
    });
  возврат false; //возврат false代表不执行内部排序逻辑
});
функция сортировкаRecords(поле, сортировка) {
  const promise = новый Promise((resolve, reject) => {
    records.сортировка((a, b) => {
      возврат сортировка === 'asc' ? b[поле].localeCompare(a[поле]) : a[поле].localeCompare(b[поле]);
    });
    resolve(records);
  });
  возврат promise;
}
```

## Replace the по умолчанию сортировка иконка

If you do не want к use the internal иконка, Вы можете use the иконка пользовательскийization функция к replace it. Follow the reference tutorial: https://www.visactor.io/vтаблица/guide/пользовательский_define/пользовательский_иконка

Here is an пример из replacing the сортировка иконка:

Note: Configuration из `имя` и `funcType`

```
Vтаблица.регистрация.иконка("frozenCurrent", {
  тип: "svg",
  svg: "/сортировка.svg",
  ширина: 22,
  высота: 22,
  имя: "сортировка_normal",
  positionType: Vтаблица.TYPES.иконкаPosition.лево,
  marginRight: 0,
  funcType: Vтаблица.TYPES.иконкаFuncTypeEnum.сортировка,
  навести: {
    ширина: 22,
    высота: 22,
    bgColor: "rgba(101, 117, 168, 0.1)",
  },
  cursor: "pointer",
});
```

## скрыть сортировка иконка

We provide `showсортировка` configuration к скрыть the сортировкаing иконка, but the сортировкаing logic can be executed normally

Here is an пример из hiding the сортировка иконка:

```js
const списоктаблица = новый списоктаблица({
  // ...Other configuration items
  columns: [
    {
      заголовок: 'имя',
      поле: 'имя',
      cellType: 'текст',
      showсортировка: false,
      сортировка: true // Use built-в по умолчанию сортировкаing logic
    },
    {
      заголовок: 'возраст',
      поле: 'возраст',
      cellType: 'текст',
      showсортировка: false,
      сортировка: (v1, v2, order) => {
        // Use пользовательский сортировкаing logic
        if (order === 'desc') {
          возврат v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
        }
        возврат v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
      }
    }
  ]
});
```

## Pre сортировка

в the case из large amounts из данные, the первый сортировкаing may take a long time, и pre-сортировкаing can be used к improve the Производительность из the сортировкаing функция. Set the pre-сортировкаed данные полеs и сортировка order through the `setсортировкаedIndexMap` method.

```js
интерфейс IсортировкаedMапиtem {
  asc?: (число | число[])[];
  desc?: (число | число[])[];
  normal?: (число | число[])[];
}

const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID),option);
таблицаInstance.setсортировкаedIndexMap(поле, filedMap as IсортировкаedMапиtem);
```
