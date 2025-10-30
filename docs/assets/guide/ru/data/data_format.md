# данные sources и formats

в order к better display и analyze данные, we need к understand the format и meaning из tabular данные в Vтаблица. следующий we will discuss the данные forms из two таблица types в Vтаблица: the базовый таблица (списоктаблица) данные source, и the сводныйтаблица (сводныйтаблица) данные source.

## данные format form

в Vтаблица, the main данные format we need к deal с is a JSON массив. для пример, Следующий is JSON данные taking human information as an пример:

```json
[
  { "имя": "zhang_san", "возраст": 20, "sex": "", "phone": "123456789", "address": "beijing haidian" },
  { "имя": "li_si", "возраст": 30, "sex": "female", "phone": "23456789", "address": "beijing chaoyang" },
  { "имя": "wang_wu", "возраст": 40, "sex": "male", "phone": "3456789", "address": "beijing fengtai" }
]
```

в the same time: the данные structure из two-dimensional массив can also support setting.

следующий we will describe how к apply this данные к базовый таблицаs и сводный таблицаs, respectively.

## базовый tabular данные

### JSON данные

в a базовый таблица, данные is presented в units из behavior, и каждый row contains multiple полеs (columns). для пример: имя, возраст, пол, и address. каждый объект в the данные item will correspond к a row.

Creating a базовый таблица based на the above JSON данные should configure the corresponding [`списоктаблицаConstructorOptions`](../../option/списоктаблица#container) Assign, и will `records` Configure as a данные source.

пример:

```javascript liveдемонстрация  template=vтаблица
const option = {
  columns: [
    {
      поле: 'имя',
      заголовок: 'имя',
      сортировка: true,
      ширина: 'авто'
    },
    {
      поле: 'возраст',
      заголовок: 'возраст'
    },
    {
      поле: 'sex',
      заголовок: 'sex'
    },
    {
      поле: 'phone',
      заголовок: 'phone'
    },
    {
      поле: 'address',
      заголовок: 'address'
    }
  ],
  records: [
    { имя: 'zhang_san', возраст: 20, sex: 'female', phone: '123456789', address: 'beijing haidian' },
    { имя: 'li_si', возраст: 30, sex: 'female', phone: '23456789', address: 'beijing chaoyang' },
    { имя: 'wang_wu', возраст: 40, sex: 'male', phone: '3456789', address: 'beijing fengtai' }
  ]
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
```

### Two-dimensional массив structure

If you use a two-dimensional массив as the данные source, Вы можете run it as follows:

```javascript liveдемонстрация  template=vтаблица
const option = {
  columns: [
    {
      поле: '0',
      заголовок: 'имя',
      сортировка: true,
      ширина: 'авто'
    },
    {
      поле: '1',
      заголовок: 'возраст'
    },
    {
      поле: '2',
      заголовок: 'sex'
    },
    {
      поле: '3',
      заголовок: 'phone'
    },
    {
      поле: '4',
      заголовок: 'address'
    }
  ],
  records: [
    ['zhang_san', 20, 'female', '123456789', 'beijing haidian'],
    ['li_si', 30, 'female', '23456789', 'beijing chaoyang'],
    ['wang_wu', 40, 'male', '3456789', 'beijing fengtai']
  ]
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
```

### Special usвозраст из multi-level данные

A данные source с a multi-level данные structure can be implemented по setting `records` к `[{}]`.
like:

```
records:
[
  {
    id: "7981",
    details:
    productимя:'fff'
  }
]
```

details is an объект в the данные entry. в the данные source, the corresponding значение can be obtained through `details.имя`.

You need к configure the above multi-level objects в columns like this:

```
const columns = [
  {
    "поле": ['details','productимя'],
    "title": "Order productимя",
    "ширина": "авто"
  },
]
```

The effect is as follows:

<div style="ширина: 50%; текст-align: центр;">
<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/список-record-obj.png" />
</div>

## сводный таблица данные

The main purpose из сводный таблицаs is к display и analyze данные в multiple Dimensions. When configuring сводный таблицаs, we need к specify grouping (row и column) Dimensions и Metirc Dimensions. для пример, we can group данные по пол и calculate the число из people и averвозраст возраст для каждый.

Its configuration item is [`сводныйтаблицаConstructorOptions`](https://visactor.io/vтаблица/option/сводныйтаблица)Similar к the базовый таблица, we первый use JSON данные as the данные source для the сводный таблицаNote: This данные is the result данныеset after aggregated analysis

```json
[
  { "возраст": 30, "sex": "male", "Город": "北京", "income": 430 },
  { "возраст": 30, "sex": "female", "Город": "上海", "income": 440 },
  { "возраст": 30, "sex ": "male", "Город": "深圳", "income": 420 },
  { "возраст": 25, "sex": "male", "Город": "北京", "income": 400 },
  { "возраст": 25, "sex": "female", "Город": "上海", "income": 400 },
  { "возраст": 25, "sex ": "male", "Город": "深圳", "income": 380 }
]
```

пример:

```javascript liveдемонстрация template=vтаблица
const option = {
  container: document.getElementById(CONTAINER_ID),
  indicatorsAsCol: false,
  rowTree: [
    {
      dimensionKey: 'Город',
      значение: 'beijing',
      children: [
        {
          indicatorKey: 'income',
          значение: 'income'
        }
      ]
    },
    {
      dimensionKey: 'Город',
      значение: 'shanghai',
      children: [
        {
          indicatorKey: 'income'
        }
      ]
    },
    {
      dimensionKey: 'Город',
      значение: 'shenzhen',
      children: [
        {
          indicatorKey: 'income'
        }
      ]
    }
  ],
  columnTree: [
    {
      dimensionKey: 'sex',
      значение: 'male',
      children: [
        {
          dimensionKey: 'возраст',
          значение: '30'
        },
        {
          dimensionKey: 'возраст',
          значение: '25'
        }
      ]
    },
    {
      dimensionKey: 'sex',
      значение: 'female',
      children: [
        {
          dimensionKey: 'возраст',
          значение: '30'
        },
        {
          dimensionKey: 'возраст',
          значение: '25'
        }
      ]
    }
  ],
  indicators: [
    {
      indicatorKey: 'income',
      заголовок: 'income'
    }
  ],
  records: [
    { возраст: 30, sex: 'male', Город: 'beijing', income: 400 },
    { возраст: 30, sex: 'female', Город: 'shanghai', income: 410 },
    { возраст: 30, 'sex ': 'female', Город: 'shenzhen', income: 420 },
    { возраст: 25, sex: 'male', Город: 'beijing', income: 430 },
    { возраст: 30, 'sex ': 'male', Город: 'shenzhen', income: 440 },
    { возраст: 25, sex: 'male', Город: 'shanghai', income: 450 },
    { возраст: 25, sex: 'female', Город: 'shanghai', income: 460 },
    { возраст: 25, 'sex ': 'male', Город: 'shenzhen', income: 470 }
  ],
  defaultHeaderColширина: 100
};
const таблицаInstance = новый Vтаблица.сводныйтаблица(option);
```

в the same time, the records данные format also supports cell-по-cell corresponding configuration:

```
records:[
    [430,650,657,325,456,500],
    [300,550,557,425,406,510],
    [430,450,607,455,560,400]
]

```

пример из setting up records с a two-dimensional массив:

```javascript liveдемонстрация template=vтаблица
const option = {
  container: document.getElementById(CONTAINER_ID),
  rowTree: [
    {
      dimensionKey: 'Город',
      значение: 'beijing',
      children: [
        {
          indicatorKey: 'income'
        }
      ]
    },
    {
      dimensionKey: 'Город',
      значение: 'shanghai',
      children: [
        {
          indicatorKey: 'income'
        }
      ]
    },
    {
      dimensionKey: 'Город',
      значение: 'shenzhen',
      children: [
        {
          indicatorKey: 'income'
        }
      ]
    }
  ],
  columnTree: [
    {
      dimensionKey: 'sex',
      значение: 'male',
      children: [
        {
          dimensionKey: 'возраст',
          значение: '30'
        },
        {
          dimensionKey: 'возраст',
          значение: '25'
        }
      ]
    },
    {
      dimensionKey: 'sex',
      значение: 'female',
      children: [
        {
          dimensionKey: 'возраст',
          значение: '30'
        },
        {
          dimensionKey: 'возраст',
          значение: '25'
        }
      ]
    }
  ],
  indicators: [
    {
      indicatorKey: 'income',
      заголовок: 'income'
    }
  ],
  records: [
    [430, 650, 657, 325],
    [300, 550, 557, 425],
    [430, 450, 607, 455]
  ],
  defaultHeaderColширина: 100
};
const таблицаInstance = новый Vтаблица.сводныйтаблица(option);
```

## данные интерфейс

### Reset данные

Вы можете use setRecords к change таблица данные. Please check the апи Документация для details.

### adding данные

Вы можете use `addRecords` или `addRecord` к add таблица данные. Please check the апи Документация для details.

### delete данные

таблица данные can be deleted using `deleteRecords`. Please check the апи Документация для details.

### change the данные

таблица данные can be modified using `updateRecords`. Please check the апи Документация для details.

```javascript
  /**
   * 修改数据 支持多条数据
   * @param records 修改数据条目
   * @param recordIndexs 对应修改数据的索引
   * 基本表格中显示在body中的索引，即要修改的是body部分的第几行数据；
   * 如果是树形结构的话 recordIndexs 为数组，数组中每个元素为данные的原始数据索引；
   */
  updateRecords(records: любой[], recordIndexs: (число | число[])[])
```

или Вы можете modify a certain данные поле using the `changeCellValue` или `changeCellValues` интерфейс.

### Tree structure данные update

в the tree (group) structure, the данные update is passed в `recordIndex` as an массив, representing the index из the данные в the таблица body. в addition, в the case из сортировкаing, `recordIndex` is the original данные structure, и it may не be consistent с the hierarchical order displayed в the таблица. Therefore, в the tree (group) structure таблица, please use the `getRecordIndexByCell` интерфейс к get the correct `recordIndex`, и then use the `updateRecords` интерфейс к update the данные.

```javascript
const recordIndex = таблицаInstance.getRecordIndexByCell(col, row);
таблицаInstance.updateRecords([newRecord], [recordIndex]);
```

## Empty данные prompt

If the данные source is не passed, или an empty массив is passed, Вы можете configure emptyTip к display an empty данные prompt.

Both the prompt messвозраст и the иконка are configurable.

Configuration reference: https://visactor.io/vтаблица/option/списоктаблица#emptyTip

пример reference: https://visactor.io/vтаблица/демонстрация/компонент/emptyTip

## summarize

в this tutorial, we learned how к use tabular данные в Vтаблица. We первый learned what данные means в таблицаs, и the данные formats из two таблицаs в Vтаблица (базовый таблица и сводный таблица). в order к help you better understand the correspondence between данные formats и таблицаs, we discussed the correspondence between базовый таблицаs и сводный таблицаs respectively.
