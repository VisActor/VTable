---
категория: примеры
группа: Основные Функции
заголовок: Container Fit - Adapt Table Frame to Container
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/width-mode-adaptive.png
порядок: 3-6
ссылка: basic_function/container_fit
опция: ListTable#containerFit
---

# Container Fit - Adapt Table Frame to Container

The containerFit configuration allows the table frame to adapt to the container size while preserving the original dimensions of row heights and column widths. This is different from adaptive mode which stretches content to fill the container.

## Ключевые Конфигурации

- `containerFit: { width: true, height: true }`

## Демонстрация кода

```javascript livedemo template=vtable
let tableInstance;

const records = [
  { id: 1, name: 'Alice', age: 25, city: 'New York' },
  { id: 2, name: 'Bob', age: 30, city: 'London' },
  { id: 3, name: 'Charlie', age: 35, city: 'Tokyo' },
  { id: 4, name: 'David', age: 40, city: 'Beijing' },
  { id: 5, name: 'Eve', age: 45, city: 'Shanghai' },
  { id: 6, name: 'Frank', age: 50, city: 'Guangzhou' },
  { id: 7, name: 'Grace', age: 55, city: 'Shenzhen' },
  { id: 8, name: 'Henry', age: 60, city: 'Chengdu' },
  { id: 9, name: 'Ivy', age: 65, city: 'Chongqing' },
  { id: 10, name: 'Jack', age: 70, city: "Xi'an" },
  { id: 11, name: 'Kate', age: 75, city: 'Wuhan' },
  { id: 12, name: 'Liam', age: 80, city: 'Zhengzhou' },
  { id: 13, name: 'Mia', age: 85, city: 'Qingdao' }
];

const columns = [
  {
    field: 'id',
    title: 'ID',
    width: 60
  },
  {
    field: 'имя',
    title: 'Name',
    width: 100
  },
  {
    field: 'возраст',
    title: 'Age',
    width: 80
  },
  {
    field: 'city',
    title: 'Город',
    width: 120
  }
];

const container = document.getElementById(CONTAINER_ID);
container.style.width = '800px';
container.style.height = '500px';
container.style.border = '2px solid #333';

const option = {
  records,
  columns,
  containerFit: {
    width: true,
    height: true
  },
  theme: {
    frameStyle: { borderLineWidth: 2, borderColor: 'red' },
    scrollStyle: { barToSide: true }
  }
};

tableInstance = new VTable.ListTable(container, option);
window['tableInstance'] = tableInstance;
```
