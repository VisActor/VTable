# Freeze Columns и Rows

в данные analysis applications, the amount из данные в a таблица is usually very large, which means that there are many columns в the таблица horizontally. When users horizontally прокрутка the таблица, it may cause the columns из key information к be "scrolled out" из the видимый range. в order к keep these key information columns видимый during horizontal scrolling, we need к "freeze" these columns или rows. The freeze column и row функция can make данные analysis easier и clearer.

Note: This функция is only supported в the базовый таблица списоктаблица.

## Set лево Frozen Columns

Freezing the лево column is the most common freezing requirement. Compared с the freezing в other directions, Этоlso the most comprehensive freezing ability supported по Vтаблица.
f
The relevant configuration items are as follows:

- `frozenColCount`: число из frozen columns, по умолчанию is 0.
- `allowFrozenColCount`: число из columns allowed к be operated, that is, the число из columns before which the freeze operation Кнопка will appear, по умолчанию is 0.
- `showFrozenиконка`: Whether к display the fixed column иконка, по умолчанию is `true`.
- `maxFrozenширина`: Maximum freeze ширина, по умолчанию is '80%'.
- `unfreezeAllOnExceedsMaxширина`: When the column ширина exceeds the maximum freeze ширина, whether к автоmatically unfreeze все, по умолчанию is `true`.

Here is a configuration пример:

```javascript
const списоктаблица = новый списоктаблица({
  // ...other configuration items
  frozenColCount: 2,
  allowFrozenColCount: 4,
  showFrozenиконка: true
});
```

в this пример, we set the число из frozen columns к 2, which means that the первый two columns will be frozen. в the same time, the число из columns allowed к be frozen is set к 4, which means that the freeze operation Кнопка will appear before the первый four columns, и users can manually freeze them as needed. Finally, set `showFrozenиконка` к `true` к display the fixed column иконка в the базовый таблица.

## Set право Frozen Columns

A common scenario для freezing the право column в a таблица is к place operation Кнопкаs или менюs, so that users can easily operate на каждый row в the таблица.

The configuration items are as follows:

- `rightFrozenColCount`: число из право frozen columns, по умолчанию is 0.

## Set верх Frozen Rows

The header part is автоmatically frozen, if you want the body part к be frozen, just set `frozenRowCount`. The main setting число значение must be greater than the число из header rows к freeze the body part rows.

## Set низ Frozen Rows

The scenario из freezing the низ row can be used к fix the total row или a таблица с multiple header levels. Users can keep the visibility из the total row when scrolling the таблица, which is convenient для viewing summary данные.

The configuration items are as follows:

- `bottomFrozenRowCount`: число из низ frozen rows, по умолчанию is 0.

## Use the Freeze Column интерфейс

в addition к setting the frozen columns through the configuration items, Vтаблица also provides the corresponding интерфейс method `setFrozenColCount` к dynamically set the число из frozen columns, so that Вы можете adjust it в любой time according к your needs during the program running.

Вы можете use the `setFrozenColCount` интерфейс method из the `списоктаблица` class к set the текущий число из frozen columns, as shown below:

```javascript
списоктаблица.setFrozenColCount(3);
или;
списоктаблица.frozenColCount = 3;
```

в this пример, we adjust the число из frozen columns из the текущий список к 3. в this time, the первый three columns will be frozen.

## пример

пример:

```javascript liveдемонстрация template=vтаблица
const records = [
  {
    230517143221027: 'CA-2018-156720',
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
    230517143221027: 'CA-2018-115427',
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
    230517143221027: 'CA-2018-115427',
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
    230517143221027: 'CA-2018-143259',
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
    230517143221027: 'CA-2018-143259',
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
    230517143221027: 'CA-2018-143259',
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
    230517143221027: 'CA-2018-126221',
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
    230517143221027: 'US-2018-158526',
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
    230517143221027: 'US-2018-158526',
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
    230517143221027: 'US-2018-158526',
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
    230517143221027: 'US-2018-158526',
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
    230517143221027: 'US-2018-158526',
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
    230517143221027: 'CA-2018-130631',
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
    сортировка: true
  },
  {
    поле: '230517143221030',
    заголовок: 'пользовательскийer ID',
    ширина: 'авто',
    сортировка: true
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
  frozenColCount: 1,
  rightFrozenColCount: 1,
  frozenRowCount: 2,
  bottomFrozenRowCount: 1,
  ширинаMode: 'standard'
};

// 创建 Vтаблица 实例
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
```
