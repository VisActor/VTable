In this article, we will describe how to use the table transpose feature in ListTable.

## The concept and function of table transpose

Table transpose is an operation that swaps rows and columns, that is, the original rows become columns, and the original columns become rows. Through table transpose, we can change the way the data is presented to better suit our needs and analysis perspectives.

## example

In ListTable, we can set `transpose `Parameters to enable the table transpose feature.

```javascript livedemo template=vtable
const option = {
    container: document.getElementById(CONTAINER_ID),
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
const tableInstance = new ListTable(option);
```

In the above example, by `transpose` Parameters are set to `true`, the table transpose function is enabled. Please flexibly use table transpose to display and analyze your data according to the actual situation and needs.
