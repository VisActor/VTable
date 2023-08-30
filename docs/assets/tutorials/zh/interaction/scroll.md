# 表格滚动

在数据分析的过程中，通常会遇到大量的数据展示在表中。为了能够同时展示更多的数据内容提供更好的数据查询体，滚动功能就显得尤为重要。通过滚动，用户可以快速地在表格中查找到所需的内容，并进行后续的分析与处理。

## 滚动性能优势

VTable 底层基于canvas进行渲染，每次更新只会绘制可视区域内容，确保即使在处理大数据时仍能流畅地滚动。

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a2c7623458257d1562627090d.gif)

## 滚动样式

VTable 提供了丰富的滚动样式配置项，用户可以按照自己的需求来定制现滚动条样式。通过 ListTable.theme.scrollStyle 配置滚动条样式，以下为滚动样式配置的详细内容：

*   scrollRailColor： 配置滚动条轨道的颜色。
*   scrollSliderColor：配置滚动条滑块的颜色。
*   width：配置滚动条宽度。
*   visible：配置滚动条是否可见，可配值：'always' | 'scrolling' | 'none' | 'focus'，分别对应：常驻显示|滚动时显示|显示|聚焦在画布上时。默认为‘scrolling’。
*   hoverOn ：指定滚动条是悬浮在容器上，还是独立于容器。默认为true即悬浮于容器上。

下面我们通过示例来展示这些配置的效果：

```javascript livedemo   template=vtable
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
          "width": "auto"
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
    records:data,
    columns,
    widthMode:'standard',
        theme: {
      scrollStyle: {
          visible:'always',
          scrollSliderColor:'purple',
          scrollRailColor:'#bac3cc',
          hoverOn:false
        }
      }
  };
  const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
  window['tableInstance'] = tableInstance;
})


```

## 横向滚动

VTable 支持在按住 Shift 键时进行横向滚动，或者直接拖拽横向滚动条，以便用户更方便地浏览表格数据。当然，如果您的电脑有触摸板，可以直接在触摸板上直接左右滑动来实现横向滚动。

## 滚动接口

VTable 提供了scrollToCell接口，用于滚到指定的单元格位置。该方法接受 cellAddr 参数用于指定要滚动到的单元位置。示例代码如下：

```javascript
table.scrollToCell({ row:20 , col: 10 });
```

在上示例中，我们将滚动到行号为20，列号为 10 的单元格位置。
