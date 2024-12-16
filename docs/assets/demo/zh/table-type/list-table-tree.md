---
category: examples
group: table-type
title: 基本表格树形展示
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/list-tree.png
order: 1-2
link: table_type/List_table/tree_list
option: ListTable-columns-text#tree
---

# 基本表格树形展示

基本表格树形展示，开启某一列的 tree 模式，同时配合数据源的树形结构 children。

## 关键配置

- tree:true 在某一列上设置开启树形展示

## 代码演示

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
