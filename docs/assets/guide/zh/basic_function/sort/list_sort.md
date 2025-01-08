# 基本表格排序功能

在数据分析过程中，排序（ 排序 ）功能对数据的组织和协助分析非常重要。通过排序，用户可以快速将关心的数据排列在前面，提高数据查找和分析的效率，同时也能快速发现数据中的异常点和规律。

VTable 提供了丰富的排序功能，用户可以轻松地按需开启、自定义排序规则、设定初始排序状态等。

## 开启排序

要使用 VTable 的排序功能，需要先对表格列进行配置。在 `columns` 中，每一列的配置项需要根据 cellType（列类型）进行设置。在本教程中，我们主要关注排序相关的配置。

以下是一个开启排序功能的例子：

```js
const listTable = new ListTable({
  // ...其它配置项
  columns: [
    {
      title: '姓名',
      field: 'name',
      cellType: 'text',
      sort: true // 使用内置默认排序逻辑
    },
    {
      title: '年龄',
      field: 'age',
      cellType: 'text',
      sort: (v1, v2, order) => {
        // 使用自定义排序逻辑
        if (order === 'desc') {
          return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
        }
        return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
      }
    }
  ]
});
```

在上述代码中，`sort` 为 `true`，表示该列支持排序，并使用内置的排序规则。

## 排序规则设置

VTable 允许用户自定义排序规则。如自定义排序规则，需要将 `sort` 设置为一个函数。该函数接收两个参数 `a` 和 `b`，表示需要比较的两个值。函数返回值为负数时，`a` 排在 `b` 前面；返回值为正数时，`a` 排在 `b` 后面；返回值为 0 时，`a` 和 `b` 的相对位置不变。

以下是一个自定义排序规则的例子：

```js
const listTable = new ListTable(document.getElementById(CONTAINER_ID), {
  // ...其它配置项
  columns: [
    {
      title: '姓名',
      field: 'name',
      cellType: 'text',
      sort: (a, b) => a.localeCompare(b)
    },
    {
      title: '年龄',
      field: 'age',
      cellType: 'text',
      sort: (a, b) => parseInt(a) - parseInt(b)
    }
  ]
});
```

在上述代码中，`姓名` 列使用 `localeCompare` 函数进行排序，以保证中文字符的正确排序结果；`年龄` 列根据数字大小进行排序。

## 多列排序

当启用 `multipleSort` 选项时，VTable 允许按多列排序。此功能允许用户按多列对表中的数据进行排序，从而根据多个条件提供更详细的数据视图。要启用多列排序，请在 `ListTable` 配置中配置 `multipleSort` 选项。

`multipleSort` 选项是布尔类型，可以按如下方式设置：

```ts
ListTable({
  // ...其他配置项
  columns: [
    // ...色谱柱配置
  ],
  multipleSort: true
});
```

如果启用，用户在单击列标题中的排序图标时，可以添加其他排序条件，而无需删除之前的排序。

例子：

```javascript livedemo template=vtable
const records = [
  { name: 'Bill', age: 18 },
  { name: 'Alex', age: 31 },
  { name: 'Bob', age: 31 },
  { name: 'Bruce', age: 22 },
  { name: 'Anna', age: 22 },
  { name: 'Martha', age: 45 },
  { name: 'Steve', age: 29 },
  { name: 'John', age: 31 },
  { name: 'Kate', age: 18 },
  { name: 'Lisa', age: 22 }
];

const columns = [
  {
    field: 'name',
    title: '姓名',
    width: 'auto',
    sort: true
  },
  {
    field: 'age',
    title: '年龄',
    width: 'auto',
    sort: true
  }
];

const option = {
  records,
  columns,
  widthMode: 'standard',
  multipleSort: true
};

// 创建 VTable 实例
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window.tableInstance = tableInstance;
```

## 初始排序状态

VTable 支持为表格设定初始排序状态。要设置初始排序状态，可以在 `ListTable` 配置项中使用 `sortState` 配置。`sortState` 类型为 `SortState` 或 `SortState[]`。其中，`SortState` 定义如下：

```ts
SortState {
  /** 排序依据字段 */
  field: string;
  /** 排序规则 */
  order: 'desc' | 'asc' | 'normal';
}
```

以下是一个设置初始排序状态的例子：

```js
const tableInstance = new ListTable({
  // ...其它配置项
  columns: [
    // ...列配置
  ],
  sortState: [
    {
      field: 'age',
      order: 'desc'
    }
  ]
});
```

在上述代码中，表格的初始排序状态为按照年龄降序排列。

## 排序状态设置接口(更改排序)

VTable 提供 `updateSortState` 属性用于设置排序状态。
接口说明：

```
  /**
   * 更新排序状态
   * @param sortState 要设置的排序状态
   * @param executeSort 是否执行内部排序逻辑，设置false将只更新图标状态不执行数据排序
   */
  updateSortState(sortState: SortState[] | SortState | null, executeSort: boolean = true)
```

当需要修改排序状态时，可以直接调用该接口。例如：

```js
tableInstance.updateSortState({
  field: 'name',
  order: 'asc'
});
```

通过使用 `updateSortState` 接口，用户可以在任意时刻动态调整表格的排序状态，以满足实时分析需求。

## 禁用内部排序

在某些场景下，排序逻辑的执行并不期望由 VTable 来执行，如：后端负责排序。

可以按照如下配置和流程来使用：

1. 配置 `sort` 为 false；

2. 如果需要显示排序按钮，配置 `sortState` 为 true；

3. 通过监听事件 `sort_click`事件来得知用户点击了排序按钮，注意这个事件回调函数需要返回 false 来禁止 VTable 内部的排序逻辑：

```
tableInstance.on('sort_click', args => {
    .....
    return false; //return false代表不执行内部排序逻辑
  });
```

4. 监听排序按钮点击后，执行业务层的排序逻辑。排序完成后需要 `setRecords` 将数据更新到表格。
   注意：

- setRecords 接口调用时需将第二个参数 option 中的 sortState 设置为 null，这样就清除了内部排序状态（否则 setRecords 调用时 vtable 会按上次设置过的排序状态对数据进行排序）

5. 如果需要对应切换排序图标的状态则需要配合接口`updateSortState`，注意接口的第二个参数需设置为 false，这样可以只切换排序图标而不执行 vtable 的排序逻辑.

示例：

```javascript livedemo template=vtable
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
    230517143221024: 'Fairfield',
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
    230517143221024: 'Fairfield',
    230517143221029: '2018-12-30',
    230517143221042: '2',
    230517143221040: '13.904',
    230517143221041: '4.519'
  },
  {
    230517143221027: 'CA-2018-80',
    230517143221030: 'PO-18865',
    230517143221032: 'Wilson Jones Legal Size Ring Binders',
    230517143221023: 'Office Supplies',
    230517143221034: 'Binders',
    230517143221037: 'East',
    230517143221024: 'New York City',
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
    230517143221024: 'New York City',
    230517143221029: '2018-12-30',
    230517143221042: '7',
    230517143221040: '90.93',
    230517143221041: '2.728'
  },
  {
    230517143221027: 'CA-2018-40',
    230517143221030: 'PO-18865',
    230517143221032: 'Bush Westfield Collection Bookcases, Fully Assembled',
    230517143221023: 'Furniture',
    230517143221034: 'Bookcases',
    230517143221037: 'East',
    230517143221024: 'New York City',
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
    230517143221032: 'Global Leather and Oak Executive Chair, Black',
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
    230517143221032: 'Panasonic KP-350BK Electric Pencil Sharpener with Auto Stop',
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
    230517143221032: 'GBC ProClick Spines for 32-Hole Punch',
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
    field: '230517143221027',
    title: 'Order ID',
    width: 'auto',
    sort: false,
    showSort: true
  },
  {
    field: '230517143221030',
    title: 'Customer ID',
    width: 'auto',
    showSort: true
  },
  {
    field: '230517143221032',
    title: 'Product Name',
    width: 'auto'
  },
  {
    field: '230517143221023',
    title: 'Category',
    width: 'auto'
  },
  {
    field: '230517143221034',
    title: 'Sub-Category',
    width: 'auto'
  },
  {
    field: '230517143221037',
    title: 'Region',
    width: 'auto'
  },
  {
    field: '230517143221024',
    title: 'City',
    width: 'auto'
  },
  {
    field: '230517143221029',
    title: 'Order Date',
    width: 'auto'
  },
  {
    field: '230517143221042',
    title: 'Quantity',
    width: 'auto'
  },
  {
    field: '230517143221040',
    title: 'Sales',
    width: 'auto'
  },
  {
    field: '230517143221041',
    title: 'Profit',
    width: 'auto'
  }
];

const option = {
  records,
  columns,
  widthMode: 'standard'
};

// 创建 VTable 实例
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window.tableInstance = tableInstance;
let clickCount = 0;
tableInstance.on('sort_click', args => {
  clickCount++;
  const sortState = clickCount % 3 === 0 ? 'desc' : clickCount % 3 === 1 ? 'asc' : 'normal';
  sortRecords(args.field, sortState)
    .then(records => {
      debugger;
      tableInstance.setRecords(records, { sortState: null });
      tableInstance.updateSortState(
        {
          field: args.field,
          order: sortState
        },
        false
      );
    })
    .catch(e => {
      throw e;
    });
  return false; //return false代表不执行内部排序逻辑
});
function sortRecords(field, sort) {
  const promise = new Promise((resolve, reject) => {
    records.sort((a, b) => {
      return sort === 'asc' ? b[field].localeCompare(a[field]) : a[field].localeCompare(b[field]);
    });
    resolve(records);
  });
  return promise;
}
```

## 替换默认的排序图标

如果不希望使用内部的图标，可以使用图标自定义功能来替换，接参考教程：https://www.visactor.io/vtable/guide/custom_define/custom_icon

以下是一个替换排序图标的例子：

注意： `name`和`funcType`的配置

```
VTable.register.icon("frozenCurrent", {
  type: "svg",
  svg: "/sort.svg",
  width: 22,
  height: 22,
  name: "sort_normal",
  positionType: VTable.TYPES.IconPosition.left,
  marginRight: 0,
  funcType: VTable.TYPES.IconFuncTypeEnum.sort,
  hover: {
    width: 22,
    height: 22,
    bgColor: "rgba(101, 117, 168, 0.1)",
  },
  cursor: "pointer",
});
```

## 隐藏排序图标

我们提供了`showSort`配置来隐藏排序图标，但可以正常执行排序逻辑

以下是一个隐藏排序图标的例子：

```js
const listTable = new ListTable({
  // ...其它配置项
  columns: [
    {
      title: '姓名',
      field: 'name',
      cellType: 'text',
      showSort: false,
      sort: true // 使用内置默认排序逻辑
    },
    {
      title: '年龄',
      field: 'age',
      cellType: 'text',
      showSort: false,
      sort: (v1, v2, order) => {
        // 使用自定义排序逻辑
        if (order === 'desc') {
          return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
        }
        return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
      }
    }
  ]
});
```

## 预排序

在大数据量的情况下，首次排序可能会耗时较长，可以通过预排序来提升排序功能的性能。通过 setSortedIndexMap 方法，设置预排序的数据字段和排序顺序。

```js
interface ISortedMapItem {
  asc?: (number | number[])[];
  desc?: (number | number[])[];
  normal?: (number | number[])[];
}

const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
tableInstance.setSortedIndexMap(field, filedMap as ISortedMapItem);
```
