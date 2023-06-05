---
category: examples
group: table-type list-table
title: 基本表格
cover:
---

# 基本表格

选中单元格 配置选中效果

## 关键配置

 - `VTable.register.icon`  注册自定义的icon 可以配合columns[x].icon或者columns[x].headerIcon 使用。或者重置内部的图标

内置功能图标名称具体有：
`
'sort_upward',
'sort_downward',
'sort_normal',
'pin',
'pined',
'pinedCurrent',
'dropdownIcon',
'dropdownIcon_hover',
'expand',
'collapse',
`
## 代码演示

```ts

VTable.register.icon('pined',{
      type: 'svg',
      svg:
       'http://' + window.location.host + "/mock-data/pined.svg",
      width: 22,
      height: 22,
      name: 'pined',
      funcType: VTable.TYPES.IconFuncTypeEnum.pin,
      positionType: VTable.TYPES.IconPosition.right,
      marginRight: 0,
      hover: {
        width: 22,
        height: 22,
        bgColor: 'rgba(101, 117, 168, 0.1)',
      },
      cursor: 'pointer',
    }
  );
  VTable.register.icon('pinedCurrent',{
      type: 'svg',
      svg:
        'http://' + window.location.host + "/mock-data/pinedCurrent.svg",
      width: 22,
      height: 22,
      name: 'pinedCurrent',
      funcType: VTable.TYPES.IconFuncTypeEnum.pin,
      positionType: VTable.TYPES.IconPosition.right,
      marginRight: 0,
      hover: {
        width: 22,
        height: 22,
        bgColor: 'rgba(101, 117, 168, 0.1)',
      },
      cursor: 'pointer',
    }
  );


VTable.register.icon('pin',{
      type: 'svg',
      svg:
        'http://' + window.location.host + "/mock-data/pin.svg",
      width: 22,
      height: 22,
      name: 'pin',
      funcType: VTable.TYPES.IconFuncTypeEnum.pin,
      positionType: VTable.TYPES.IconPosition.right,
      marginRight: 0,
      hover: {
        width: 22,
        height: 22,
        bgColor: 'rgba(101, 117, 168, 0.1)',
      },
      cursor: 'pointer',
    }
  );
  
  VTable.register.icon('order',{
      type: 'svg',
      svg:
        'http://' + window.location.host + "/mock-data/order.svg",
      width: 22,
      height: 22,
      name: 'order',
      positionType: VTable.TYPES.IconPosition.left,
      marginRight: 0,
      hover: {
        width: 22,
        height: 22,
        bgColor: 'rgba(101, 117, 168, 0.1)',
      },
      cursor: 'pointer',
    }
  );
// <script type='text/javascript' src='../sales.js'></script>
// import { menus } from './menu';
  fetch('../mock-data/North_American_Superstore_list100.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
    {
        "field": "230517143221027",
        "caption": "Order ID",
        "width": "auto",
        icon: 'order'
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
      field: '2234',
      caption: 'single line',
      width:120,
      icon: [
          {
            name: 'edit',
            type: 'svg',
            marginLeft: 10,
            color: 'blue',
            positionType: VTable.TYPES.IconPosition.left,
            width:20,
            height:20,
            svg:'http://' + window.location.host + "/mock-data/edit.svg",
            tooltip: {
              style: { arrowMark: true },
              // 气泡框，按钮的的解释信息
              title: '编辑',
              placement: VTable.TYPES.Placement.right,
            },
          },
          {
            name: 'delete',
            type: 'svg',
            marginLeft: 20,
            color: 'blue',
            positionType: VTable.TYPES.IconPosition.left,
            width:20,
            height:20,
            svg:'http://' + window.location.host + "/mock-data/delete.svg",
            tooltip: {
              style: { arrowMark: true },
              // 气泡框，按钮的的解释信息
              title: '删除',
              placement: VTable.TYPES.Placement.right,
            },
          }
        ],
    }
];

const option = {
  parentElement: document.getElementById(Table_CONTAINER_DOM_ID),
  records:data,
  columns,
  widthMode:'standard',
  allowFrozenColCount: 3,
  frozenColCount: 1,
};
const tableInstance = new VTable.ListTable(option);
window['tableInstance'] = tableInstance;
    })
```

## 相关教程

[性能优化](link)
