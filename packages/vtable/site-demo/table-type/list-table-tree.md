---
category: examples
group: table-type list-table
title: 基本表格
cover:
---

# 基本表格

基本表格

## 关键配置


## 代码演示

```ts
  fetch('../mock-data/company_struct.json')
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
  parentElement: document.getElementById(Table_CONTAINER_DOM_ID),
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
