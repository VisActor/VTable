---
category: examples
group: table-type
title: List Table Tree
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/list-tree.png
order: 1-2
link: table_type/List_table/tree_list
option: ListTable-columns-text#tree
---

# Basic table tree display

Basic table tree display, open the tree mode of a certain column, and cooperate with the tree structure children of the data source.

## Key Configurations

- Tree: true Set on a column to turn on tree display

## Code demo

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/company_struct.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: 'group',
        title: 'department',
        width: 'auto',
        tree: true,
        fieldFormat(rec) {
          return rec['department'] ?? rec['group'] ?? rec['name'];
        }
      },
      {
        field: 'total_children',
        title: 'memebers count',
        width: 'auto',
        fieldFormat(rec) {
          if (rec?.['position']) {
            return `position:  ${rec['position']}`;
          } else return rec?.['total_children'];
        }
      },
      {
        field: 'monthly_expense',
        title: 'monthly expense',
        width: 'auto',
        fieldFormat(rec) {
          if (rec?.['salary']) {
            return `salary:  ${rec['salary']}`;
          } else return rec?.['monthly_expense'];
        }
      },
      {
        field: 'new_hires_this_month',
        title: 'new hires this month',
        width: 'auto'
      },
      {
        field: 'resignations_this_month',
        title: 'resignations this month',
        width: 'auto'
      },
      {
        field: 'complaints_and_suggestions',
        title: 'recived complaints counts',
        width: 'auto'
      }
    ];

    const option = {
      records: data,
      columns,
      widthMode: 'standard'
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
