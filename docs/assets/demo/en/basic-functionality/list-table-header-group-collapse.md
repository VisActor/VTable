---
category: examples
group: Basic Features
title: List Table - Header Group Collapse
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/list-table-header-group.png
link: table-type/list-table
option: ListTable-columns-text#columns
---

# List Table - Header Group Collapse

Configure columns as a nested multi-layer structure to achieve multi-layer header grouping effects. Enable tree-style expansion and collapse functionality through `headerHierarchyType: 'grid-tree'`, and set the default expansion level with `headerExpandLevel`.

## Key Configurations

- columns
- `headerHierarchyType` Set hierarchy display to `grid-tree` to enable tree-style expand/collapse
- `headerExpandLevel` Configure default expansion level (defaults to 1)

## Code demo

```javascript livedemo template=vtable
let tableInstance;
const records = [
  {
    id: 1,
    name: 'name.1',
    name_1: 'name_1.1',
    name_2: 'name_2.1',
    name_2_1: 'name_2_1.1',
    name_2_2: 'name_2_2.1'
  },
  {
    id: 2,
    name: 'name.2',
    name_1: 'name_1.2',
    name_2: 'name_2.2',
    name_2_1: 'name_2_1.2',
    name_2_2: 'name_2_2.2'
  },
  {
    id: 3,
    name: 'name.3',
    name_1: 'name_1.3',
    name_2: 'name_2.3',
    name_2_1: 'name_2_1.3',
    name_2_2: 'name_2_2.3'
  },
  {
    id: 4,
    name: 'name.4',
    name_1: 'name_1.4',
    name_2: 'name_2.4',
    name_2_1: 'name_2_1.4',
    name_2_2: 'name_2_2.4'
  },
  {
    id: 5,
    name: 'name.5',
    name_1: 'name_1.5',
    name_2: 'name_2.5',
    name_2_1: 'name_2_1.5',
    name_2_2: 'name_2_2.5'
  }
];

const columns = [
  {
    field: 'id',
    title: 'ID',
    width: 100
  },
  {
    field: 'name',
    title: 'Name',
    columns: [
      {
        field: 'name_1',
        title: 'Name_1',
        width: 120
      },
      {
        field: 'name_2',
        title: 'Name_2',
        width: 150,
        columns: [
          {
            field: 'name_2_1',
            title: 'Name_2_1',
            width: 150
          },
          {
            field: 'name_2_2',
            title: 'Name_2_2',
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
  headerHierarchyType: 'grid-tree',
  headerExpandLevel: 3,
  widthMode: 'standard',
  autoWrapText: true,
  autoRowHeight: true,
  defaultColWidth: 150
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
```
