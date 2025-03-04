---
category: examples
group: Cell Type
title: 按钮类型
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/button.png
link: cell_type/button
option: ListTable-columns-button#cellType
---

# 按钮类型

展示按钮类型的多种使用方式

## 关键配置

cellType: 'button';

## 代码演示

```javascript livedemo template=vtable
const records = [
  { productName: 'Apple', price: 20 },
  { productName: 'Banana', price: 18 },
  { productName: 'Cherry', price: 16 },
  { productName: 'Date', price: 14 },
  { productName: 'Elderberry', price: 12 },
  { productName: 'Fig', price: 10 },
  { productName: 'Grape', price: 10 }
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
    field: 'button',
    title: 'button',
    width: 'auto',
    cellType: 'button',
    text: 'Select',
    style: {
      color: '#FFF'
    }
  },
  {
    field: 'button1',
    title: 'disabled button',
    width: 'auto',
    cellType: 'button',
    disable: true,
    text: 'Disabled Select',
    style: {
      color: '#FFF'
    }
  }
];
const option = {
  records,
  columns,
  defaultRowHeight: 60
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;

tableInstance.on(VTable.ListTable.EVENT_TYPE.BUTTON_CLICK, e => {
  alert(`${VTable.ListTable.EVENT_TYPE.BUTTON_CLICK}, ${e.col}, ${e.row}`);
});
```
