---
category: examples
group: Cell Type
title: 开关类型
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/switch.png
link: cell_type/switch
option: ListTable-columns-switch#cellType
---

# 开关类型

展示开关类型的多种使用方式

## 关键配置

cellType: 'switch';

## 代码演示

```javascript livedemo template=vtable
const records = [
  { productName: 'Apple', price: 20, switch: true },
  { productName: 'Banana', price: 18, switch: false },
  { productName: 'Cherry', price: 16, switch: true },
  { productName: 'Date', price: 14, switch: false },
  { productName: 'Elderberry', price: 12, switch: true },
  { productName: 'Fig', price: 10, switch: false },
  { productName: 'Grape', price: 10, switch: true }
];

const columns = [
  {
    field: 'productName',
    title: 'name',
    width: 120
  },
  {
    field: 'price',
    title: 'price',
    width: 120
  },
  {
    field: 'switch0',
    title: 'switch',
    width: 'auto',
    cellType: 'switch',
    checkedText: 'on',
    uncheckedText: 'off',
    style: {
      color: '#FFF'
    }
  },
  {
    field: 'switch1',
    title: 'disabled switch',
    width: 'auto',
    cellType: 'switch',
    checkedText: 'on',
    uncheckedText: 'off',
    style: {
      color: '#FFF'
    },
    disable: true
  },
  {
    field: 'switch',
    title: 'custom switch',
    width: 'auto',
    cellType: 'switch',
    style: {
      color: '#FFF'
    },
    checkedText: args => {
      return 'on' + args.row;
    },
    uncheckedText: args => {
      return 'off' + args.row;
    }
  }
];
const option = {
  records,
  columns
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
```
