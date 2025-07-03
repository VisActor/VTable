---
category: examples
group: Basic Features
title: 基本表格表头分组与折叠
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/list-table-header-hierarchy-tree.gif
link: table-type/list-table
option: ListTable-columns-text#columns
---

# 基本表格表头分组与折叠

将 columns 配置为嵌套多层结构来实现多层表头分组效果，可通过配置 `headerHierarchyType: 'grid-tree'` 开启树形的展开和折叠，并通过 `headerExpandLevel` 来设置默认展开层级。

## 关键配置

- columns
- `headerHierarchyType` 将层级展示设置为 `grid-tree`，开启树形的展开和折叠功能
- `headerExpandLevel` 设置默认展开层级，默认为`1`

## 代码演示

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
