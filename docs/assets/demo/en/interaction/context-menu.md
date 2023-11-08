---
category: examples
group: Interaction
title: Right click menu
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/context-menu.png
order: 4-6
link: '../guide/components/dropdown'
option: ListTable#menu.contextMenuItems
---

# Right click menu

Right-click pop-up menu, if you need to click on the drop-down menu to continue the operation, you can listen to the event dropdownmenu\_click.

## Key Configurations

*   `menu.contextMenuItems` Configure the relevant function drop-down menu that appears after right-clicking

## Code demo

```javascript livedemo template=vtable

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
  widthMode:'standard',
  menu:{
    contextMenuItems:["复制单元格内容",'查询详情']
  },
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;


tableInstance.on('dropdown_menu_click', (args) => {
  console.log('dropdown_menu_click',args);
})
    })
```
