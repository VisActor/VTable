---
category: examples
group: table-type
title: 基本表格
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/list-table.png
order: 1-1
link: '../guide/table_type/List_table/list_table_define_and_generate'
option: ListTable-columns-text#cellType
---

# 基本表格

基本表格

## 关键配置

-`ListTable`

## 代码演示

```javascript livedemo template=vtable
// please use "import {ListTable} from '@visactor/react-vtable'" in your code;
const {ListTable} = ReactVTable; // just for visactor website

let  tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
    .then((res) => res.json())
    .then((data) => {
const columns =[
    {
        "field": "Order ID",
        "title": "Order ID",
        "width": "auto"
    },
    {
        "field": "Customer ID",
        "title": "Customer ID",
        "width": "auto"
    },
    {
        "field": "Product Name",
        "title": "Product Name",
        "width": "auto"
    },
    {
        "field": "Category",
        "title": "Category",
        "width": "auto"
    },
    {
        "field": "Sub-Category",
        "title": "Sub-Category",
        "width": "auto"
    },
    {
        "field": "Region",
        "title": "Region",
        "width": "auto"
    },
    {
        "field": "City",
        "title": "City",
        "width": "auto"
    },
    {
        "field": "Order Date",
        "title": "Order Date",
        "width": "auto"
    },
    {
        "field": "Quantity",
        "title": "Quantity",
        "width": "auto"
    },
    {
        "field": "Sales",
        "title": "Sales",
        "width": "auto"
    },
    {
        "field": "Profit",
        "title": "Profit",
        "width": "auto"
    }
];
const option = {
  records:data,
  columns,
  widthMode:'standard'
};
// tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
// window['tableInstance'] = tableInstance;
const root = ReactDom.createRoot(
  document.getElementById('live-demo-additional-container')
);
root.render(<ListTable option={option}/>);
customRelease = () => {
  root.unmount();
}
    })

```

