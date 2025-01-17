# Data sources and formats

In order to better display and analyze data, we need to understand the format and meaning of tabular data in VTable. Next we will discuss the data forms of two table types in VTable: the basic table (ListTable) data source, and the pivottable (PivotTable) data source.

## Data format form

In VTable, the main data format we need to deal with is a JSON array. For example, the following is JSON data taking human information as an example:

```json
[
  { "name": "zhang_san", "age": 20, "sex": "", "phone": "123456789", "address": "beijing haidian" },
  { "name": "li_si", "age": 30, "sex": "female", "phone": "23456789", "address": "beijing chaoyang" },
  { "name": "wang_wu", "age": 40, "sex": "male", "phone": "3456789", "address": "beijing fengtai" }
]
```

At the same time: the data structure of two-dimensional array can also support setting.

Next we will describe how to apply this data to basic tables and pivot tables, respectively.

## Basic tabular data

### JSON data

In a basic table, data is presented in units of behavior, and each row contains multiple fields (columns). For example: name, age, gender, and address. Each object in the data item will correspond to a row.

Creating a basic table based on the above JSON data should configure the corresponding [`ListTableConstructorOptions`](../../option/ListTable#container) Assign, and will `records` Configure as a data source.

Example:

```javascript livedemo  template=vtable
const option = {
  columns: [
    {
      field: 'name',
      title: 'name',
      sort: true,
      width: 'auto'
    },
    {
      field: 'age',
      title: 'age'
    },
    {
      field: 'sex',
      title: 'sex'
    },
    {
      field: 'phone',
      title: 'phone'
    },
    {
      field: 'address',
      title: 'address'
    }
  ],
  records: [
    { name: 'zhang_san', age: 20, sex: 'female', phone: '123456789', address: 'beijing haidian' },
    { name: 'li_si', age: 30, sex: 'female', phone: '23456789', address: 'beijing chaoyang' },
    { name: 'wang_wu', age: 40, sex: 'male', phone: '3456789', address: 'beijing fengtai' }
  ]
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
```

### Two-dimensional array structure

If you use a two-dimensional array as the data source, you can run it as follows:

```javascript livedemo  template=vtable
const option = {
  columns: [
    {
      field: '0',
      title: 'name',
      sort: true,
      width: 'auto'
    },
    {
      field: '1',
      title: 'age'
    },
    {
      field: '2',
      title: 'sex'
    },
    {
      field: '3',
      title: 'phone'
    },
    {
      field: '4',
      title: 'address'
    }
  ],
  records: [
    ['zhang_san', 20, 'female', '123456789', 'beijing haidian'],
    ['li_si', 30, 'female', '23456789', 'beijing chaoyang'],
    ['wang_wu', 40, 'male', '3456789', 'beijing fengtai']
  ]
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
```

### Special usage of multi-level data

A data source with a multi-level data structure can be implemented by setting `records` to `[{}]`.
like:

```
records:
[
  {
    id: "7981",
    details:
    productName:'fff'
  }
]
```

details is an object in the data entry. In the data source, the corresponding value can be obtained through `details.name`.

You need to configure the above multi-level objects in columns like this:

```
const columns = [
  {
    "field": ['details','productName'],
    "title": "Order productName",
    "width": "auto"
  },
]
```

The effect is as follows:

<div style="width: 50%; text-align: center;">
<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/list-record-obj.png" />
</div>

## Pivot Table Data

The main purpose of pivot tables is to display and analyze data in multiple Dimensions. When configuring pivot tables, we need to specify grouping (row and column) Dimensions and Metirc Dimensions. For example, we can group data by gender and calculate the number of people and average age for each.

Its configuration item is [`PivotTableConstructorOptions`](https://visactor.io/vtable/option/PivotTable)Similar to the basic table, we first use JSON data as the data source for the pivot tableNote: This data is the result dataset after aggregated analysis

```json
[
  { "age": 30, "sex": "male", "city": "北京", "income": 430 },
  { "age": 30, "sex": "female", "city": "上海", "income": 440 },
  { "age": 30, "sex ": "male", "city": "深圳", "income": 420 },
  { "age": 25, "sex": "male", "city": "北京", "income": 400 },
  { "age": 25, "sex": "female", "city": "上海", "income": 400 },
  { "age": 25, "sex ": "male", "city": "深圳", "income": 380 }
]
```

Example:

```javascript livedemo template=vtable
const option = {
  container: document.getElementById(CONTAINER_ID),
  indicatorsAsCol: false,
  rowTree: [
    {
      dimensionKey: 'city',
      value: 'beijing',
      children: [
        {
          indicatorKey: 'income',
          value: 'income'
        }
      ]
    },
    {
      dimensionKey: 'city',
      value: 'shanghai',
      children: [
        {
          indicatorKey: 'income'
        }
      ]
    },
    {
      dimensionKey: 'city',
      value: 'shenzhen',
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
      value: 'male',
      children: [
        {
          dimensionKey: 'age',
          value: '30'
        },
        {
          dimensionKey: 'age',
          value: '25'
        }
      ]
    },
    {
      dimensionKey: 'sex',
      value: 'female',
      children: [
        {
          dimensionKey: 'age',
          value: '30'
        },
        {
          dimensionKey: 'age',
          value: '25'
        }
      ]
    }
  ],
  indicators: [
    {
      indicatorKey: 'income',
      title: 'income'
    }
  ],
  records: [
    { age: 30, sex: 'male', city: 'beijing', income: 400 },
    { age: 30, sex: 'female', city: 'shanghai', income: 410 },
    { age: 30, 'sex ': 'female', city: 'shenzhen', income: 420 },
    { age: 25, sex: 'male', city: 'beijing', income: 430 },
    { age: 30, 'sex ': 'male', city: 'shenzhen', income: 440 },
    { age: 25, sex: 'male', city: 'shanghai', income: 450 },
    { age: 25, sex: 'female', city: 'shanghai', income: 460 },
    { age: 25, 'sex ': 'male', city: 'shenzhen', income: 470 }
  ],
  defaultHeaderColWidth: 100
};
const tableInstance = new VTable.PivotTable(option);
```

At the same time, the records data format also supports cell-by-cell corresponding configuration:

```
records:[
    [430,650,657,325,456,500],
    [300,550,557,425,406,510],
    [430,450,607,455,560,400]
]

```

Example of setting up records with a two-dimensional array:

```javascript livedemo template=vtable
const option = {
  container: document.getElementById(CONTAINER_ID),
  rowTree: [
    {
      dimensionKey: 'city',
      value: 'beijing',
      children: [
        {
          indicatorKey: 'income'
        }
      ]
    },
    {
      dimensionKey: 'city',
      value: 'shanghai',
      children: [
        {
          indicatorKey: 'income'
        }
      ]
    },
    {
      dimensionKey: 'city',
      value: 'shenzhen',
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
      value: 'male',
      children: [
        {
          dimensionKey: 'age',
          value: '30'
        },
        {
          dimensionKey: 'age',
          value: '25'
        }
      ]
    },
    {
      dimensionKey: 'sex',
      value: 'female',
      children: [
        {
          dimensionKey: 'age',
          value: '30'
        },
        {
          dimensionKey: 'age',
          value: '25'
        }
      ]
    }
  ],
  indicators: [
    {
      indicatorKey: 'income',
      title: 'income'
    }
  ],
  records: [
    [430, 650, 657, 325],
    [300, 550, 557, 425],
    [430, 450, 607, 455]
  ],
  defaultHeaderColWidth: 100
};
const tableInstance = new VTable.PivotTable(option);
```

## Data interface

### Reset data

You can use setRecords to change table data. Please check the api documentation for details.

### adding data

You can use `addRecords` or `addRecord` to add table data. Please check the api documentation for details.

### delete data

Table data can be deleted using `deleteRecords`. Please check the api documentation for details.

### change the data

Table data can be modified using `updateRecords`. Please check the api documentation for details.

Or you can modify a certain data field using the `changeCellValue` or `changeCellValues` interface.

### Tree structure data update

In the tree (group) structure, the data update is passed in `recordIndex` as an array, representing the index of each node from the root node. In addition, in the case of sorting, `recordIndex` is the original data structure, and it may not be consistent with the hierarchical order displayed in the table. Therefore, in the tree (group) structure table, please use the `getRecordIndexByCell` interface to get the correct `recordIndex`, and then use the `updateRecords` interface to update the data.

```javascript
const recordIndex = tableInstance.getRecordIndexByCell(col, row);
tableInstance.updateRecords([newRecord], [recordIndex]);
```

## Empty data prompt

If the data source is not passed, or an empty array is passed, you can configure emptyTip to display an empty data prompt.

Both the prompt message and the icon are configurable.

Configuration reference: https://visactor.io/vtable/option/ListTable#emptyTip

Example reference: https://visactor.io/vtable/demo/component/emptyTip

## summarize

In this tutorial, we learned how to use tabular data in VTable. We first learned what data means in tables, and the data formats of two tables in VTable (basic table and pivot table). In order to help you better understand the correspondence between data formats and tables, we discussed the correspondence between basic tables and pivot tables respectively.
