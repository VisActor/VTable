---
category: examples
group: Interaction
title: 右键菜单
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/context-menu.png
order: 4-6
---

# 右键菜单

右键弹出菜单, 如需根据点击下拉菜单的项目来继续操作，可以监听事件dropdownmenu_click。

## 关键配置

- `menu.contextMenuItems` 配置点击右键后出现的相关功能下拉菜单

## 代码演示

```javascript livedemo template=vtable

  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_list100.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
    {
        "field": "230517143221027",
        "caption": "Order ID",
        "width": "auto"
    },
    {
        "field": "230517143221030",
        "caption": "Customer ID",
        "width": "auto"
    },
    {
        "field": "230517143221032",
        "caption": "Product Name",
        "width": "auto"
    },
    {
        "field": "230517143221023",
        "caption": "Category",
        "width": "auto"
    },
    {
        "field": "230517143221034",
        "caption": "Sub-Category",
        "width": "auto"
    },
    {
        "field": "230517143221037",
        "caption": "Region",
        "width": "auto"
    },
    {
        "field": "230517143221024",
        "caption": "City",
        "width": "auto"
    },
    {
        "field": "230517143221029",
        "caption": "Order Date",
        "width": "auto"
    },
    {
        "field": "230517143221042",
        "caption": "Quantity",
        "width": "auto"
    },
    {
        "field": "230517143221040",
        "caption": "Sales",
        "width": "auto"
    },
    {
        "field": "230517143221041",
        "caption": "Profit",
        "width": "auto"
    }
];

const option = {
  parentElement: document.getElementById(CONTAINER_ID),
  records:data,
  columns,
  widthMode:'standard',
  menu:{
    contextMenuItems:["复制单元格内容",'查询详情']
  },
};
const tableInstance = new VTable.ListTable(option);
window['tableInstance'] = tableInstance;


tableInstance.listen('dropdownmenu_click', (args) => {
  console.log('dropdownmenu_click',args);
})
    })
```

## 相关教程

[性能优化](link)
