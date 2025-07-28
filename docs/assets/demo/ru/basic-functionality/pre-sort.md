---
category: examples
group: Basic Features
title: Pre Sort
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pre-sort.png
order: 3-2
link: basic_function/sort/list_sort
---

# Pre Sort

In the case of large amounts of data, the first sorting may take a long time, and pre-sorting can be used to improve the performance of the sorting function.

## Key Configurations

Set the pre-sorted data fields and sort order through the `setSortedIndexMap` method.

```
setSortedIndexMap: (field: FieldDef, filedMap: ISortedMapItem) => void;

interface ISortedMapItem {
  asc?: (number | number[])[];
  desc?: (number | number[])[];
  normal?: (number | number[])[];
}
```

## Code Demo

```javascript livedemo template=vtable
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/test-demo-data/pre-sort.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: 'id',
        title: 'ID',
        width: 80,
        sort: true
      },
      {
        field: 'email1',
        title: 'email(pre-sorted)',
        width: 250,
        sort: true
      },
      {
        field: 'hobbies',
        title: 'hobbies(unsorted)',
        width: 200,
        sort: true
      },
      {
        field: 'birthday',
        title: 'birthday',
        width: 120
      },
      {
        field: 'sex',
        title: 'sex',
        width: 100
      },
      {
        field: 'tel',
        title: 'telephone',
        width: 150
      },
      {
        field: 'work',
        title: 'job',
        width: 200
      },
      {
        field: 'city',
        title: 'city',
        width: 150
      }
    ];
    const option = {
      records: data.data,
      columns
    };
    const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;

    data.sort.forEach(item => {
      tableInstance.setSortedIndexMap(item.key, item.value);
    });
  });
```
