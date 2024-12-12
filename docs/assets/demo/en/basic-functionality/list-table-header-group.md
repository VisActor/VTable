---
category: examples
group: Basic Features
title: List Table - Header Group
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/list-table-header-group.png
link: table-type/list-table
option: ListTable-columns-text#columns
---

# List Table - Header Group

Configure columns as a nested multi-layer structure to achieve multi-layer header grouping effects

## Key Configurations

- columns

## Code demo

```javascript livedemo template=vtable
let tableInstance;
const records = [
  {
    id: 1,
    name1: 'a1',
    name2: 'a2',
    name3: 'a3'
  },
  {
    id: 2,
    name1: 'b1',
    name2: 'b2',
    name3: 'b3'
  },
  {
    id: 3,
    name1: 'c1',
    name2: 'c2',
    name3: 'c3'
  },
  {
    id: 4,
    name1: 'd1',
    name2: 'd2',
    name3: 'd3'
  },
  {
    id: 5,
    name1: 'e1',
    name2: 'e2',
    name3: 'e3'
  }
];

const columns = [
  {
    field: 'id',
    title: 'ID',
    width: 100
  },
  {
    title: 'Name',
    columns: [
      {
        field: 'name1',
        title: 'name1',
        width: 100
      },
      {
        title: 'name-level-2',
        width: 150,
        columns: [
          {
            field: 'name2',
            title: 'name2',
            width: 100
          },
          {
            title: 'name3',
            field: 'name3',
            width: 150
          }
        ]
      }
    ]
  }
];

const option = {
  records,
  columns,
  widthMode: 'standard',
  autoWrapText: true,
  autoRowHeight: true,
  defaultColWidth: 150
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
```
