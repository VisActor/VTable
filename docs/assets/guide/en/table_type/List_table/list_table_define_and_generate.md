In this section, we will introduce the core configuration items of the basic table to help you understand the basic usage of the table. We will provide a simple example demonstration to help you get started quickly. More complex configurations and advanced features will be introduced and explained in detail in subsequent chapters.

## Core configuration

The following are the Key Configurations items of the basic table and their descriptions:

*   `container`: The container DOM element of the table, which needs to have width and height.
*   `records`: The data of the table, represented as an array.
*   `columns`: Configuration of table columns, each column needs to set configuration items separately, including column type, width, title, etc. Supported column types are: 'text', 'link', 'image', 'video', 'sparkline', 'progressbar', 'chart'. The configuration items for each column type are slightly different, please flexibly add specific configurations according to the required type, you can refer to[Document](../../guide/cell_type/cellType).
*   `frozenColCount`: Specifies the number of frozen columns.
*   `transpose`: Whether to transpose the table, the default is false.
*   `showHeader`: Whether to display the header, the default is true.
*   `pagination`: Paging configuration, including the total number of records, the number of records per page, the current page number, etc.
*   `sortState`: Sort state, which specifies the sort by field and sort rule.
*   `theme`: Table Theme, which can be a built-in Theme or a custom Theme.
*   `widthMode`: The calculation mode of the table column width.

## Example: Create a simple basic table

Here is a simple example of how to use a basic table to present data:

```javascript livedemo  template=vtable

 const option = {
    container: document.getElementById(CONTAINER_ID),
    columns : [
        {
            "field": "订单 ID",
            "title": "订单 ID",
            "sort": true,
            "width":'auto',
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
}
const tableInstance = new ListTable(option);

```

In the above example, we created a basic table using a simple dataset and column definition. You can modify the data and column definitions to suit your needs.
