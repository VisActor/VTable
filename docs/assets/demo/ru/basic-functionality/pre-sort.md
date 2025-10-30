---
категория: примеры
группа: Основные Функции
заголовок: Pre Сортировка
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pre-Сортировка.png
порядок: 3-2
ссылка: basic_function/Сортировка/list_Сортировка
---

# Pre Сортировка

In the case of large amounts of data, the first Сортировкаing may take a long time, and pre-Сортировкаing can be used to improve the performance of the Сортировкаing function.

## Ключевые Конфигурации

Set the pre-Сортировкаed data fields and Сортировка порядок through the `setСортировкаedIndexMap` method.

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
