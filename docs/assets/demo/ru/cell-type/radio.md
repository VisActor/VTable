---
category: examples
group: Cell Type
title: Radio Type
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/radio.png
link: cell_type/radio
option: ListTable-columns-checkbox#cellType
---

# Radio Type

Demonstrate multiple ways to use radio

## Critical Configuration

cellType: 'radio';

## Code demo

```javascript livedemo template=vtable
const records = [
  {
    productName: 'aaaa',
    price: 20,
    radio1: 'radio info',
    radio2: true,
    radio3: {
      text: 'column radio a',
      checked: false,
      disable: false
    },
    radio4: ['cell radio 1', 'cell radio 2'],
    radio5: [
      { text: 'cell radio 1', checked: true, disable: false },
      { text: 'cell radio 2', checked: false, disable: false }
    ]
  },
  {
    productName: 'bbbb',
    price: 18,
    radio1: 'radio info',
    radio2: true,
    radio3: {
      text: 'column radio b',
      checked: false,
      disable: false
    },
    radio4: ['cell radio 1', 'cell radio 2'],
    radio5: [
      { text: 'cell radio 1', checked: false, disable: false },
      { text: 'cell radio 2', checked: true, disable: false }
    ]
  },
  {
    productName: 'cccc',
    price: 16,
    radio1: 'radio info',
    radio2: true,
    radio3: {
      text: 'column radio c',
      checked: false,
      disable: false
    },
    radio4: ['cell radio 1', 'cell radio 2'],
    radio5: [
      { text: 'cell radio 1', checked: true, disable: false },
      { text: 'cell radio 2', checked: false, disable: false }
    ]
  },
  {
    productName: 'dddd',
    price: 14,
    radio1: 'radio info',
    radio2: true,
    radio3: {
      text: 'column radio d',
      checked: false,
      disable: false
    },
    radio4: ['cell radio 1', 'cell radio 2'],
    radio5: [
      { text: 'cell radio 1', checked: false, disable: true },
      { text: 'cell radio 2', checked: true, disable: false }
    ]
  },
  {
    productName: 'eeee',
    price: 12,
    radio1: 'radio info',
    radio2: true,
    radio3: {
      text: 'column radio e',
      checked: false,
      disable: false
    },
    radio4: ['cell radio 1', 'cell radio 2'],
    radio5: [
      { text: 'cell radio 1', checked: true, disable: false },
      { text: 'cell radio 2', checked: false, disable: false }
    ]
  },
  {
    productName: 'ffff',
    price: 10,
    radio1: 'radio info',
    radio2: true,
    radio3: {
      text: 'column radio f',
      checked: false,
      disable: false
    },
    radio4: ['cell radio 1', 'cell radio 2'],
    radio5: [
      { text: 'cell radio 1', checked: false, disable: false },
      { text: 'cell radio 2', checked: true, disable: false }
    ]
  },
  {
    productName: 'gggg',
    price: 10,
    radio1: 'radio info',
    radio2: true,
    radio3: {
      text: 'column radio g',
      checked: false,
      disable: false
    },
    radio4: ['cell radio 1', 'cell radio 2'],
    radio5: [
      { text: 'cell radio 1', checked: true, disable: false },
      { text: 'cell radio 2', checked: false, disable: false }
    ]
  }
];

const columns = [
  {
    field: 'isCheck',
    title: '',
    width: 50,
    cellType: 'radio'
  },
  {
    field: 'productName',
    title: 'product name',
    width: 160
  },
  {
    field: 'price',
    title: 'price',
    width: 120
  },
  {
    field: 'radio1',
    title: 'column radio disable',
    width: 200,
    cellType: 'radio',
    disable: true,
    checked: args => {
      if (args.row === 3) return true;
    }
  },
  {
    field: 'radio3',
    title: 'column radio data config',
    width: 230,
    cellType: 'radio'
  },
  {
    field: 'radio4',
    title: 'cell radio',
    width: 140,
    cellType: 'radio',
    style: {
      spaceBetweenRadio: 4
    }
  },
  {
    field: 'radio5',
    title: 'cell radio data config',
    width: 240,
    radioDirectionInCell: 'horizontal',
    radioCheckType: 'cell',
    cellType: 'radio',
    style: {
      spaceBetweenRadio: 8
    }
  }
];
const option = {
  records,
  columns,
  heightMode: 'autoHeight'
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
```
