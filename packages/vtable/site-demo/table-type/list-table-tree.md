---
category: examples
group: table-type
title: 基本表格树形展示
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/list-tree.png
order: 1-2
---

# 基本表格树形展示

基本表格树形展示，开启某一列的tree模式，同时配合数据源的树形结构children。

## 关键配置

- tree:true 在某一列上设置开启树形展示
## 代码演示

```javascript livedemo template=vtable
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/company_struct.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
    {
        "field": "group",
        "caption": "department",
        "width": "auto",
         tree: true,
         fieldFormat(rec){
            return rec['department']??rec['group']??rec['name'];
         }
    },
    {
        "field": "total_children",
        "caption": "memebers count",
        "width": "auto",
        fieldFormat(rec){
          if(rec?.['position']){
            return `position:  ${rec['position']}`
          }else
          return rec?.['total_children'];
        }
    },
    {
        "field": "monthly_expense",
        "caption": "monthly expense",
        "width": "auto",
        fieldFormat(rec){
          if(rec?.['salary']){
            return `salary:  ${rec['salary']}`
          }else
          return rec?.['monthly_expense'];
        }
    },
    {
        "field": "new_hires_this_month",
        "caption": "new hires this month",
        "width": "auto"
    },
    {
        "field": "resignations_this_month",
        "caption": "resignations this month",
        "width": "auto"
    },
    {
        "field": "complaints_and_suggestions",
        "caption": "recived complaints counts",
        "width": "auto"
    },
   
];

const option = {
  parentElement: document.getElementById(CONTAINER_ID),
  records:data,
  columns,
  widthMode:'standard',

};
const tableInstance = new VTable.ListTable(option);
window['tableInstance'] = tableInstance;
    })
```

## 相关教程

[性能优化](link)
