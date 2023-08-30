# Table sorting function

In the process of data analytics, the sorting (sorting) function is very important for the organization and analysis of data. By sorting, users can quickly arrange the data they care about in front, improve the efficiency of data search and analysis, and quickly find outliers and patterns in the data.

VTable provides rich sorting functions, users can easily open on demand, customize sorting rules, set initial sorting status, etc.

## Enable sorting

To use the sorting function of VTable, you need to configure the table columns first. exist `columns` The configuration items for each column need to be set according to columnType (column type). In this tutorial, we mainly focus on sorting-related configurations.

Here is an example of enabling sorting:

```js
const listTable = new ListTable({
  // ...其它配置项
  columns: [
    {
      title: '姓名',
      field: 'name',
      columnType: 'text',
      sort: true,
    },
    {
      title: '年龄',
      field: 'age',
      columnType: 'text',
      sort: (v1, v2, order) => {
          if (order === 'desc') {
            return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
          }
          return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
        },
    },
  ],
});
```

In the above code,`sort` for `true`, indicating that the column supports sorting and uses the built-in collation.

## 3. Sorting Settings

VTable allows users to customize collations. To specify a collation, you need to `sort` Set as a function. The function takes two arguments `a` and `b`, representing two values to compare. When the function returns a negative value,`a` line up in `b` Front; when the return value is positive,`a` line up in `b` Later; when the return value is 0,`a` and `b` The relative position remains unchanged.

Here is an example of a custom collation:

```js
const listTable = new ListTable({
  // ...其它配置项
  columns: [
    {
      title: '姓名',
      field: 'name',
      columnType: 'text',
      sort: (a, b) => a.localeCompare(b),
    },
    {
      title: '年龄',
      field: 'age',
      columnType: 'text',
      sort: (a, b) => parseInt(a) - parseInt(b),
    },
  ],
});
```

In the above code,`姓名` Column usage `localeCompare` The function sorts to ensure the correct sorting result of Chinese characters;`年龄` Columns are sorted by number size.

## 4. Initial sorting state

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
      order: 'desc',
    },
  ],
});
```

In the above code, the initial sorting state of the table is in descending order by age.

## 5. Sort state setting interface

VTable provides `sortState` Properties are used to set the sorting state. This interface can be called directly when the sorting state needs to be modified. E.g:

```js
listTable.sortState = [
  {
    field: 'name',
    order: 'asc',
  },
];
```

If you need to reset the sorting state, you can `sortState` Set to `null`For example:

```js
listTable.sortState = null;
```

By using `sortState` Interface, users can dynamically adjust the sorting state of the table at any time to meet the needs of real-time analysis.
