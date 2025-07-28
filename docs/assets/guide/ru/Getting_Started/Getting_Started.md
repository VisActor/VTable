# Быстрое начало

В этом руководстве мы представим, как нарисовать простую базовую таблицу с помощью VTable. VTable - это простая в использовании, высокопроизводительная библиотека таблиц для фронтенд-визуализации с богатыми типами визуализации.

## Получение VTable

Вы можете получить VTable несколькими способами.

### Использование пакета NPM

Сначала вам нужно установить VTable в корневом каталоге проекта с помощью следующей команды:

```sh
# 使用 npm 安装
npm install @visactor/VTable

# 使用 yarn 安装
yarn add @visactor/VTable
```

### Use CDN

Вы можете also get the built VTable file through the CDN.

```html
<script src="https://unpkg.com/@visactor/VTable/dist/VTable.min.js"></script>
<script>
  const tableInstance = новый VTable.ListTable(option);
</script>
```

## Introducing VTable

### Imported via NPM package

Use в the верх из a JavaScript file `import` Introducing VTable:

```js
import * as VTable от '@visactor/VTable';

или;

import { ListTable, PivotTable, TYPES, themes } от '@visactor/VTable';
```

### Import using script tags

по adding directly в the HTML file `<script>` Tag, import the built VTable file:

```html
<script src="https://unpkg.com/@visactor/VTable/dist/VTable.min.js"></script>
<script>
  const tableInstance = новый VTable.ListTable(option);
</script>
```

## Draw a simple table

Before drawing we need к prepare a DOM container с высота и ширина для VTable.

**Please make sure that the ширина и высота из the container are integers. The offsetWidth, offsetHeight, clientWidth, и clientHeight properties из the container will be used в the internal logic из VTable. If the ширина и высота из the container are decimals, the values will be inaccurate, which may cause table jitter problems.**

```html
<body>
  <div id="tableContainer" style="позиция: absolute; ширина: 600px;высота:400px;"></div>
</body>
```

следующий, we create a `VTable.ListTable` Example, pass в the table configuration item:

```javascript livedemo template=VTable
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
    230517143221024: 'Fairfield',
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
    230517143221024: 'Fairfield',
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
    230517143221024: 'новый York City',
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
    230517143221024: 'новый York City',
    230517143221029: '2018-12-30',
    230517143221042: '7',
    230517143221040: '90.93',
    230517143221041: '2.728'
  },
  {
    230517143221027: 'CA-2018-143259',
    230517143221030: 'PO-18865',
    230517143221032: 'Bush Westfield Collection Bookcases, Fully Assembled',
    230517143221023: 'Furniture',
    230517143221034: 'Bookcases',
    230517143221037: 'East',
    230517143221024: 'новый York City',
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
    230517143221032: 'Panasonic KP-350BK Electric Pencil Sharpener с Auto Stop',
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
    230517143221032: 'GBC ProClick Spines для 32-Hole Punch',
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
  },
  {
    230517143221027: 'CA-2018-130631',
    230517143221030: 'BS-11755',
    230517143221032: 'Acco Glide Clips',
    230517143221023: 'Office Supplies',
    230517143221034: 'Fasteners',
    230517143221037: 'West',
    230517143221024: 'Edmonds',
    230517143221029: '2018-12-29',
    230517143221042: '5',
    230517143221040: '19.6',
    230517143221041: '9.604'
  },
  {
    230517143221027: 'CA-2018-146626',
    230517143221030: 'BP-11185',
    230517143221032: 'Nu-Dell Executive Frame',
    230517143221023: 'Furniture',
    230517143221034: 'Furnishings',
    230517143221037: 'West',
    230517143221024: 'Anaheim',
    230517143221029: '2018-12-29',
    230517143221042: '8',
    230517143221040: '101.12',
    230517143221041: '37.414'
  },
  {
    230517143221027: 'CA-2018-158673',
    230517143221030: 'KB-16600',
    230517143221032: 'Xerox 1915',
    230517143221023: 'Office Supplies',
    230517143221034: 'Paper',
    230517143221037: 'Central',
    230517143221024: 'Grand Rapids',
    230517143221029: '2018-12-29',
    230517143221042: '2',
    230517143221040: '209.7',
    230517143221041: '100.656'
  },
  {
    230517143221027: 'US-2018-102638',
    230517143221030: 'MC-17845',
    230517143221032: 'Ideal Clamps',
    230517143221023: 'Office Supplies',
    230517143221034: 'Fasteners',
    230517143221037: 'East',
    230517143221024: 'новый York City',
    230517143221029: '2018-12-29',
    230517143221042: '3',
    230517143221040: '6.03',
    230517143221041: '2.955'
  },
  {
    230517143221027: 'CA-2018-118885',
    230517143221030: 'JG-15160',
    230517143221032: 'Adtran 1202752G1',
    230517143221023: 'Technology',
    230517143221034: 'Phones',
    230517143221037: 'West',
    230517143221024: 'Los Angeles',
    230517143221029: '2018-12-29',
    230517143221042: '3',
    230517143221040: '302.376',
    230517143221041: '22.678'
  },
  {
    230517143221027: 'CA-2018-118885',
    230517143221030: 'JG-15160',
    230517143221032: 'Global High-Back Leather Tilter, Burgundy',
    230517143221023: 'Furniture',
    230517143221034: 'Chairs',
    230517143221037: 'West',
    230517143221024: 'Los Angeles',
    230517143221029: '2018-12-29',
    230517143221042: '4',
    230517143221040: '393.568',
    230517143221041: '-44.276'
  }
];

const columns = [
  {
    field: '230517143221027',
    title: 'Order ID',
    ширина: 'auto'
  },
  {
    field: '230517143221030',
    title: 'Customer ID',
    ширина: 'auto'
  },
  {
    field: '230517143221032',
    title: 'Product Name',
    ширина: 'auto'
  },
  {
    field: '230517143221023',
    title: 'Category',
    ширина: 'auto'
  },
  {
    field: '230517143221034',
    title: 'Sub-Category',
    ширина: 'auto'
  },
  {
    field: '230517143221037',
    title: 'Region',
    ширина: 'auto'
  },
  {
    field: '230517143221024',
    title: 'City',
    ширина: 'auto'
  },
  {
    field: '230517143221029',
    title: 'Order Date',
    ширина: 'auto'
  },
  {
    field: '230517143221042',
    title: 'Quantity',
    ширина: 'auto'
  },
  {
    field: '230517143221040',
    title: 'Sales',
    ширина: 'auto'
  },
  {
    field: '230517143221041',
    title: 'Profit',
    ширина: 'auto'
  }
];

const option = {
  container: document.getElementById(CONTAINER_ID),
  records,
  columns,
  widthMode: 'standard'
};

// 创建 VTable 实例
const tableInstance = новый VTable.ListTable(option);
```

в this point, you have successfully drawn a simple table!

Hope this tutorial helps you learn how к use VTable. следующий, Вы можете learn more about the various configuration options из VTable и customize more rich и varied table effects.
