---
category: examples
group: table-type list-table
title: 基本表格
cover:
---

# 基本表格

在该示例中，配置了tooltip.isShowOverflowTextTooltip为true，超长显示不了被省略的文字被hover时将提示出来。
同时通过监听`mouseenter_cell`事件，鼠标移入符合提示条件【第一列订单号】的单元格时，调用接口showTooltip来显示提示信息。

## 关键配置

-`tooltip.isShowOverflowTextTooltip` 开启超长省略文字的提示

-`showTooltip` 显示tooltip的调用接口

## 代码演示

```ts
// <script type='text/javascript' src='../sales.js'></script>
// import { menus } from './menu';
  fetch('../mock-data/North_American_Superstore_list100.json')
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
        "width": "200"
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
    parentElement: document.getElementById(Table_CONTAINER_DOM_ID),
    records:data,
    columns,
    widthMode:'standard',
    tooltip:{
      isShowOverflowTextTooltip: true,
    }
  };
  const tableInstance = new VTable.ListTable(option);
  window['tableInstance'] = tableInstance;
  tableInstance.listen('mouseenter_cell', (args) => {
        const { col, row, targetIcon } = args;
        if(col===0&&row>=1){
          const rect = tableInstance.getVisibleCellRangeRelativeRect({ col, row });
          tableInstance.showTooltip(col, row, {
            content: '订单号：'+tableInstance.getCellValue(col,row),
            referencePosition: { rect, placement: VTable.TYPES.Placement.right }, //TODO
            className: 'defineTooltip',
            style: {
              bgColor: 'black',
              color: 'white',
              font: 'normal normal normal 14px/1 STKaiti',
              arrowMark: true,
            },
          });
        }
    });
})
```

## 相关教程

[性能优化](link)
