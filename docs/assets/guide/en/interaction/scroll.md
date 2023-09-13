# Table scrolling

In the process of data analytics, a large amount of data is usually displayed in the table. In order to display more data content at the same time and provide a better data query body, the scrolling function is particularly important. By scrolling, users can quickly find the desired content in the table and perform subsequent analysis and processing.

## Rolling performance advantage

The underlying layer of VTable is rendered based on canvas, and only the visual Region content is drawn with each update, ensuring smooth scrolling even when working with big data.

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a2c7623458257d1562627090d.gif)

## Scroll style

VTable provides rich scroll style configuration items, and users can customize the current scroll bar style according to their own needs. Configure the scroll bar style through ListTable.theme.scrollStyle. The following are the details of the scroll style configuration:

*   scrollRailColor: Configure the color of the scrollbar track.
*   scrollSliderColor: Configure the color of the scroll bar slider.
*   Width: Configure the scroll bar width.
*   Visible: Configure whether the scroll bar is visible, and can be configured with values: 'always' | 'scrolling' | 'none' | 'focus', which correspond to: resident display | display when scrolling | display | focus on the canvas. Default is'scrolling '.
*   hoverOn: Specifies whether the scroll bar is suspended on the container or independent of the container. The default is true to float on the container.

Below we show the effect of these configurations with an example:

```javascript livedemo  template=vtable
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
        theme: {
      scrollStyle: {
          visible:'always',
          scrollSliderColor:'purple',
          scrollRailColor:'#bac3cc',
          hoverOn:false
        }
      }
  };
  tableInstance =  new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
  window['tableInstance'] = tableInstance;
})
```

## Scroll horizontally

VTable supports horizontal scrolling while holding down the Shift key, or directly dragging the horizontal scroll bar to make it easier for users to browse table data. Of course, if your computer has a touchpad, you can swipe left and right directly on the touchpad to achieve horizontal scrolling.

## scroll interface

VTable provides the scrollToCell interface for scrolling to the specified cell location. The method accepts the cellAddr parameter to specify the cell location to scroll to. Example code is as follows:

```javascript
table.scrollToCell({ row:20 , col: 10 });
```

In the above example, we will scroll to the cell position with row number 20 and column number 10.
