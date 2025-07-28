---
title: VTable usage issue: How to set the border style around cells separately</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question title

How to set the border style around cells separately</br>


## Problem description

How to set the border styles around cells separately to achieve a border with only upper and lower cell borders, without left and right borders.</br>


## Solution

The cell styles in the table, whether in the column style or theme, support configuring the cell border-related configurations as arrays, representing the border styles in the top, right, bottom, and left directions, respectively</br>


## Code example

```
const option = {
  columns: [
    {
      // ...
      style: {
        cellBorderLineWidth: [1, 0, 1, 0]
        // ...
      }
    }
  ]
  // ...
}</br>
```
## Results show

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/KH5zbH7raowoagxDdRscq9R6nNd.gif' alt='' width='1698' height='1082'>



Complete sample code (you can try pasting it into the [editor ](https%3A%2F%2Fwww.visactor.io%2Fvtable%2Fdemo%2Ftable-type%2Flist-table-tree)):</br>
```
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: 'Order ID',
        title: 'Order ID',
        width: 'auto'
      },
      {
        field: 'Customer ID',
        title: 'Customer ID',
        width: 'auto'
      },
      {
        field: 'Product Name',
        title: 'Product Name',
        width: 'auto'
      },
      {
        field: 'Category',
        title: 'Category',
        width: 'auto'
      },
      {
        field: 'Sub-Category',
        title: 'Sub-Category',
        width: 'auto'
      },
      {
        field: 'Region',
        title: 'Region',
        width: 'auto'
      },
      {
        field: 'City',
        title: 'City',
        width: 'auto'
      },
      {
        field: 'Order Date',
        title: 'Order Date',
        width: 'auto'
      },
      {
        field: 'Quantity',
        title: 'Quantity',
        width: 'auto'
      },
      {
        field: 'Sales',
        title: 'Sales',
        width: 'auto'
      },
      {
        field: 'Profit',
        title: 'Profit',
        width: 'auto'
      }
    ];

    const option = {
      records: data,
      columns,
      widthMode: 'standard',
      theme: {
        headerStyle: {
          borderLineWidth: [1, 0, 1, 0]
        },
        bodyStyle: {
          borderLineWidth: [1, 0, 1, 0]
        }
      }
      // theme: VTable.themes.SIMPLIFY
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });</br>
```
## Related Documents

Related api: https://www.visactor.io/vtable/option/ListTable#theme.bodyStyle.borderColor</br>
github：https://github.com/VisActor/VTable</br>



