# Column width adjustment

In practical applications, the data lengths in tables tend to vary, and columns with longer data may affect the layout of other columns. In order to better display the data, we need to adjust the column width according to the data content. VTable provides column width adjustment function, so that users can easily adjust the column width of the table according to their needs.
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a2c7623458257d1562627090b.gif)

## Adjust column width switch

We can set it up. `columnResizeMode` To enable or disable column width adjustment. This configuration item has the following optional values:

*   'All ': The column width can be adjusted for the entire column including the cells at the header and body
*   'None ': disable adjusting column width
*   'Header ': The column width can only be adjusted in the header of the table
*   'Body ': column width can only be adjusted in body cells

## Adjust column width interaction effect configuration

When making column width adjustment, we can customize the style of the column width marker line. exist `theme.columnResize` Object, we can set the following configuration items:

*   lineColor: the color of the line
*   bgColor: the color of the background line
*   lineWidth: the line width of the line
*   Width: the width of the background line

```javascript
{
    theme:
    {
        columnResize : {
            lineColor: 'blue',
            bgColor: 'red',
            lineWidth: 1,
            width: 5
        }
    }
}
```

In this way we can see an interaction effect similar to the following:

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/0a2e223bdcd7410c08f6a6a0d.png)

## Adjust column width limit

In actual projects, we may need to limit the column width to a certain extent. Although we can drag and drop the column width, we cannot reduce or increase it indefinitely. At this time, we can limit the minimum and maximum column widths of each column by setting columns.minWidth and columns.maxWidth.

    columns: [
      {
        ...
        minWidth: '50px',
        maxWidth: '200px  },
      {
        ...
        minWidth: '100px',
        maxWidth: '300px'
      }
    ];

Once set, the column width will not exceed the set range when dragged to adjust.

## sample code

Based on the above configuration, we can implement a simple VTable example showing how to adjust the column width:

```javascript livedemo  template=vtable
const myVTable = new ListTable({
  parentElement:  document.getElementById(CONTAINER_ID),
  columnResizeMode: 'header',
  columns : [
        {
            "field": "订单 ID",
            "caption": "订单 ID",
            "sort": true,
            "width":'auto',
        },
        {
            "field": "邮寄方式",
            "caption": "邮寄方式"
        },
        {
            "field": "类别",
            "caption": "类别"
        },
        {
            "field": "子类别",
            "caption": "子类别"
        },
        {
            "field": "销售额",
            "caption": "销售额"
        },
    ],
    "records": [
        {
            "订单 ID": "CN-2019-1973789",
            "邮寄方式": "标准级",
            "类别": "办公用品",
            "子类别": "信封",
            "销售额": "125.44"
        },
        {
            "订单 ID": "CN-2019-1973789",
            "邮寄方式": "标准级",
            "类别": "办公用品",
            "子类别": "装订机",
            "销售额": "31.92",
        },
    ],
  theme: VTable.themes.BRIGHT.extends({
    columnResize: {
      lineColor: 'blue',
      bgColor: 'lightgray',
      lineWidth: 2,
      width: 10
    }
  })
});
```

So far, this tutorial has completed the explanation of how to adjust and configure the width in VTable, I hope it will be helpful to you.
