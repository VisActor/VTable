---
category: examples
group: Component
title: tooltip
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/tooltip.png
link: '../guide/components/tooltip'
option: ListTable#tooltip.isShowOverflowTextTooltip
---

# tooltip

在该示例中，配置了tooltip.isShowOverflowTextTooltip为true，超长显示不了被省略的文字被hover时将提示出来。
同时通过监听`mouseenter_cell`事件，鼠标移入符合提示条件【第一列订单号】的单元格时，调用接口showTooltip来显示提示信息。

## 关键配置

-`tooltip.isShowOverflowTextTooltip` 开启超长省略文字的提示

-`showTooltip` 显示tooltip的调用接口

## 代码演示

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
        "width": "200"
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
    tooltip:{
      isShowOverflowTextTooltip: true,
    }
  };
  tableInstance =  new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
  window['tableInstance'] = tableInstance;
  tableInstance.on('mouseenter_cell', (args) => {
        const { col, row, targetIcon } = args;
        if(col===0&&row>=1){
          const rect = tableInstance.getVisibleCellRangeRelativeRect({ col, row });
          tableInstance.showTooltip(col, row, {
            content: 'Order ID：'+tableInstance.getCellValue(col,row),
            referencePosition: { rect, placement: VTable.TYPES.Placement.right }, //TODO
            className: 'defineTooltip',
            style: {
              bgColor: 'black',
              color: 'white',
              font: 'normal bold normal 14px/1 STKaiti',
              arrowMark: true,
            },
          });
        }
    });
})
```
