---
category: examples
group: Component
title: legend
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/legend.png
order: 8-t
---

# legend

在该示例中，按类别维度值对单元格的背景色进行映射生产图例项，并且监听了图例项的点击事件来对单元格内容进行高亮。

## 关键配置

- `legend` 配置表格图例，具体可参考：https://www.visactor.io/vtable/option/ListTable#legend

## 代码演示

```javascript livedemo template=vtable

  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
    .then((res) => res.json())
    .then((data) => {
      const categorys=['Office Supplies','Technology','Furniture'];
      const colorToCategory = [ '#ff7f0e', '#e377c2', '#2ca02c'] ;

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
        "width": "auto",
        style:{
          bgColor(args){
           const index= categorys.indexOf(args.value);
           return colorToCategory[index];
          }
        }
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
    records:data,
    columns,
    widthMode:'standard',
    tooltip:{
      isShowOverflowTextTooltip: true,
    },
    legends: {
      data: [
        {
          label: 'Office Supplies',
          shape: {
            fill: '#ff7f0e',
            symbolType: 'circle'
          }
        },
        {
          label: 'Technology',
          shape: {
            fill: '#e377c2',
            symbolType: 'square'
          }
        },
        {
          label: 'Furniture',
          shape: {
            fill: '#2ca02c',
            symbolType: 'circle'
          }
        }
      ],
      orient: 'top',
      position: 'start',
      maxRow: 1,
      padding: 10
    }
  };
  const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
  window['tableInstance'] = tableInstance;
  const { LEGEND_ITEM_CLICK } = VTable.ListTable.EVENT_TYPE;
  tableInstance.on(LEGEND_ITEM_CLICK, args => {
    console.log('LEGEND_ITEM_CLICK', args);
    const highlightCategorys=args.value;
    option.theme=VTable.themes.DEFAULT.extends({
      bodyStyle:{
        color(args){
          const {row,col}=args;
          const record=tableInstance.getRecordByRowCol(col,row);
          if(highlightCategorys.indexOf(record['Category'])>=0)
          return 'black';
          else
          return '#e5dada';
        }
      }
    });
    tableInstance.updateOption(option)
  });
})
```

## 相关教程

[性能优化](link)
