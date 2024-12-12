---
category: examples
group: Cell Type
title: 复选框类型
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/checkbox-demo.png
link: cell_type/checkbox
option: ListTable-columns-checkbox#cellType
---

# 复选框类型

展示复选框类型的多种使用方式

## 关键配置

cellType: 'checkbox';

## 代码演示

```javascript livedemo template=vtable
const records = [
  { productName: 'aaaa', price: 20, check: { text: 'unchecked', checked: false, disable: false } },
  { productName: 'bbbb', price: 18, check: { text: 'checked', checked: true, disable: false } },
  { productName: 'cccc', price: 16, check: { text: 'disable', checked: true, disable: true } },
  { productName: 'cccc', price: 14, check: { text: 'disable', checked: false, disable: true } },
  { productName: 'eeee', price: 12, check: { text: 'checked', checked: false, disable: false } },
  { productName: 'ffff', price: 10, check: { text: 'checked', checked: false, disable: false } },
  { productName: 'gggg', price: 10, check: { text: 'checked', checked: false, disable: false } }
];

const columns = [
  {
    field: 'isCheck',
    title: '',
    width: 60,
    headerType: 'checkbox',
    cellType: 'checkbox'
  },
  {
    field: 'productName',
    title: 'productName',
    width: 120
  },
  {
    field: 'price',
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
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
```
