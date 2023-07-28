---
category: examples
group: Component
title: tooltip
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/tooltip.png
order: 8-1
---

# tooltip

在该示例中，配置了tooltip.isShowOverflowTextTooltip为true，超长显示不了被省略的文字被hover时将提示出来。
同时通过监听`mouseenter_cell`事件，鼠标移入符合提示条件【第一列订单号】的单元格时，调用接口showTooltip来显示提示信息。

## 关键配置

-`tooltip.isShowOverflowTextTooltip` 开启超长省略文字的提示

-`showTooltip` 显示tooltip的调用接口

## 代码演示

```javascript livedemo template=vtable

  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
    {
        "field": "Order ID",
        "caption": "Order ID",
        "width": "auto"
    },
    {
        "field": "Customer ID",
        "caption": "Customer ID",
        "width": "auto"
    },
    {
        "field": "Product Name",
        "caption": "Product Name",
        "width": "200"
    },
    {
        "field": "Category",
        "caption": "Category",
        "width": "auto"
    },
    {
        "field": "Sub-Category",
        "caption": "Sub-Category",
        "width": "auto"
    },
    {
        "field": "Region",
        "caption": "Region",
        "width": "auto"
    },
    {
        "field": "City",
        "caption": "City",
        "width": "auto"
    },
    {
        "field": "Order Date",
        "caption": "Order Date",
        "width": "auto"
    },
    {
        "field": "Quantity",
        "caption": "Quantity",
        "width": "auto"
    },
    {
        "field": "Sales",
        "caption": "Sales",
        "width": "auto"
    },
    {
        "field": "Profit",
        "caption": "Profit",
        "width": "auto"
    }
];

  const option = {
    parentElement: document.getElementById(CONTAINER_ID),
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

## 相关教程

[性能优化](link)
