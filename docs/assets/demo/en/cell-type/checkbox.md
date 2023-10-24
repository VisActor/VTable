---
category: examples
group: Cell Type
title: Checkbox Type
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/checkbox.png
order: 2-2
link: '../guide/cell_type/checkbox'
---

# Data Bar Type

Demonstrate multiple ways to use checkbox

## Critical Configuration

cellType: 'checkbox';

## Code Demo

```javascript livedemo template=vtable

const records = [
    { percent: '100%', value: 20, check: { text: 'unchecked', checked: false, disable: false } },
    { percent: '80%', value: 18, check: { text: 'checked', checked: true, disable: false } },
    { percent: '60%', value: 16, check: { text: 'disable', checked: true, disable: true } },
    { percent: '40%', value: 14, check: { text: 'disable', checked: false, disable: true } },
    { percent: '20%', value: 12, check: { text: 'checked', checked: false, disable: false } },
    { percent: '0%', value: 10, check: { text: 'checked', checked: false, disable: false } },
    { percent: '0%', value: -10, check: { text: 'checked', checked: false, disable: false } }
  ];

const columns = [
 {
    field: 'percent',
    title: 'percent',
    width: 120
  },
  {
    field: 'percent',
    title: 'checkbox',
    width: 120,
    cellType: 'checkbox',
    disable: true,
    checked: true
  },
  {
    field: 'check',
    title: 'checkbox',
    width: 120,
    cellType: 'checkbox'
    // disable: true
  }
];
const option = {
  records,
  columns
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;
```
