在本文中，我们将介绍如何在 ListTable 中使用表格转置功能。

## 表格转置的概念和作用

表格转置是一种将行和列进行对调的操作，即原来的行变成列，原来的列变成行。通过表格转置，我们可以改变数据的展示方式，使之更符合我们的需求和分析视角。

## 示例

在 ListTable 中，我们可以通过设置 `transpose `参数来启用表格转置功能。
``` javascript livedemo template=vtable
const option = {
    columns : [
        {
            "field": "订单 ID",
            "title": "订单 ID",
            "sort": true,
            "width":'auto'
        },
        {
            "field": "邮寄方式",
            "title": "邮寄方式"
        },
        {
            "field": "类别",
            "title": "类别"
        },
        {
            "field": "子类别",
            "title": "子类别"
        },
        {
            "field": "销售额",
            "title": "销售额"
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
        // ...
    ],
    defaultColWidth:160,
    defaultHeaderColWidth:120,
    transpose:true
}
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
```

在上面的示例中，通过将 `transpose` 参数设置为 `true`，启用了表格转置功能。请根据实际情况和需求，灵活运用表格转置来展示和分析您的数据。
