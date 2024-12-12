---
category: examples
group: Basic Features
title: 预排序
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pre-sort.png
order: 3-2
link: basic_function/sort/list_sort
---

# 预排序

在大数据量的情况下，首次排序可能会耗时较长，可以通过预排序来提升排序功能的性能。

## 关键配置

通过`setSortedIndexMap`方法，设置预排序的数据字段和排序顺序。

```
setSortedIndexMap: (field: FieldDef, filedMap: ISortedMapItem) => void;

interface ISortedMapItem {
  asc?: (number | number[])[];
  desc?: (number | number[])[];
  normal?: (number | number[])[];
}
```

## 代码演示

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
