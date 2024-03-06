# Table sorting function

In the process of data analytics, the sorting (sorting) function is very important for the organization and analysis of data. By sorting, users can quickly arrange the data they care about in front, improve the efficiency of data search and analysis, and quickly find outliers and patterns in the data.

VTable provides rich sorting functions, users can easily open on demand, customize sorting rules, set initial sorting status, etc.

**Note**: This tutorial is only for the basic table ListTable. The pivot table sorting tutorial can be asynchronously accessed: https://visactor.io/vtable/guide/table_type/Pivot_table/pivot_table_dataAnalysis

## Enable sorting

To use the sorting function of VTable, you need to configure the table columns first. exist `columns` The configuration items for each column need to be set according to cellType (column type). In this tutorial, we mainly focus on sorting-related configurations.

Here is an example of enabling sorting:

```js
const listTable = new ListTable({
  // ...其它配置项
  columns: [
    {
      title: '姓名',
      field: 'name',
      cellType: 'text',
      sort: true
    },
    {
      title: '年龄',
      field: 'age',
      cellType: 'text',
      sort: (v1, v2, order) => {
        if (order === 'desc') {
          return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
        }
        return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
      }
    }
  ]
});
```

In the above code,`sort` for `true`, indicating that the column supports sorting and uses the built-in collation.

## Sorting Settings

VTable allows users to customize collations. To specify a collation, you need to `sort` Set as a function. The function takes two arguments `a` and `b`, representing two values to compare. When the function returns a negative value,`a` line up in `b` Front; when the return value is positive,`a` line up in `b` Later; when the return value is 0,`a` and `b` The relative position remains unchanged.

Here is an example of a custom collation:

```js
const listTable = new ListTable({
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

In the above code,`姓名` Column usage `localeCompare` The function sorts to ensure the correct sorting result of Chinese characters;`年龄` Columns are sorted by number size.

## Initial sorting state

VTable supports setting the initial sorting state for the table. To set the initial sorting state, you can `ListTable` Used in configuration items `sortState` Configure.`sortState` Type is `SortState` or `SortState[]`Among them,`SortState` Defined as follows:

```ts
SortState {
  /** 排序依据字段 */
  field: string;
  /** 排序规则 */
  order: 'desc' | 'asc' | 'normal';
}
```

Here is an example of setting the initial sort state:

```js
const listTable = new ListTable({
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

In the above code, the initial sorting state of the table is in descending order by age.

## Sort state setting interface(update sort rule)

VTable provides the `updateSortState` property for setting the sorting state.
Interface Description:

```
  /**
   * Update sort status
   * @param sortState The sorting state to be set
   * @param executeSort Whether to execute internal sorting logic, setting false will only update the icon status and not perform data sorting
   */
  updateSortState(sortState: SortState[] | SortState | null, executeSort: boolean = true)
```

When you need to modify the sorting status, you can call this interface directly. For example:

```js
tableInstance.updateSortState({
  field: 'name',
  order: 'asc'
});
```

By using the `updateSortState` interface, users can dynamically adjust the sorting state of the table at any time to meet real-time analysis needs.

## Disable internal sorting

In some scenarios, the execution of sorting logic is not expected to be performed by VTable, for example: the backend is responsible for sorting.

You can disable VTable's default sorting behavior by listening to events:

```
tableInstance.on('sort_click', args => {
    .....
    return false; //return false means that internal sorting logic is not executed
  });
```

After the sorting is completed, setRecords is required to update the data to the table. If you need to switch the sorting icon, you need to cooperate with the interface `updateSortState` and use the second parameter of the interface to be set to false to switch only the sorting icon.

- When calling the setRecords interface, you need to set the second parameter's sortState set to null to clear the internal sorting state (otherwise, when setRecords is called, the data will be sorted according to the last set sorting state)

Example:

```javascript livedemo template=vtable
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
    230517143221027: 'CA-2018-143259',
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
    230517143221027: 'CA-2018-143259',
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
    230517143221027: 'US-2018-158526',
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
    230517143221027: 'US-2018-158526',
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
    field: '230517143221027',
    title: 'Order ID',
    width: 'auto',
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
const clickCount = 0;
tableInstance.on('sort_click', args => {
  const sortState = clickCount % 3 === 0 ? 'desc' : clickCount % 3 === 1 ? 'asc' : 'normal';
  sortRecords(args.field, sortState)
    .then(records => {
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

## Replace the default sort icon

If you do not want to use the internal icon, you can use the icon customization function to replace it. Follow the reference tutorial: https://www.visactor.io/vtable/guide/custom_define/custom_icon

Here is an example of replacing the sort icon:

Note: Configuration of `name` and `funcType`

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

## Hide sort icon

We provide `showSort` configuration to hide the sorting icon, but the sorting logic can be executed normally

Here is an example of hiding the sort icon:

```js
const listTable = new ListTable({
  // ...Other configuration items
  columns: [
    {
      title: 'name',
      field: 'name',
      cellType: 'text',
      showSort: false,
      sort: true // Use built-in default sorting logic
    },
    {
      title: 'Age',
      field: 'age',
      cellType: 'text',
      showSort: false,
      sort: (v1, v2, order) => {
        // Use custom sorting logic
        if (order === 'desc') {
          return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
        }
        return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
      }
    }
  ]
});
```
