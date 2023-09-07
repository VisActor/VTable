在本节中，我们将介绍基本表格的核心配置项，帮助您了解表格的基本用法。我们将提供简单的示例演示，以帮助您快速上手。更复杂的配置和高级功能将在后续的章节中详细介绍和讲解。

## 核心配置

以下是基本表格的重点配置项及其说明：

*   `container`：表格的容器 DOM 元素，dom容器需要提前设置好宽高。这里非必填，可以放到初始化函数的第一个参数中如`new VTable.ListTable(container, option);`
*   `records`：表格的数据，以数组形式表示。
*   `columns`：表格列的配置，每一列需要分别设置配置项，包括列类型、宽度、标题等。支持的列类型有：'text'、'link'、'image'、'video'、'sparkline'、'progressbar'、'chart'。每种列类型的配置项略有差别，请根据所需类型灵活添加特有配置，可参考[文档](../../guide/cell_type/cellType)。
*  `frozenColCount`：指定冻结列数。
*   `transpose`：是否转置表格，默认为 false。
*   `showHeader`：是否显示表头，默认为 true。
*   `pagination`：分页配置，包括总记录数、每页记录数、当前页码等。
*   `sortState`：排序状态，用于指定排序依据字段和排序规则。
*   `theme`：表格主题，可以是内置主题或自定义主题。
*   `widthMode`：表格列宽度的计算模式。

## 示例：创建一个简单的基本表格

下面是一个简单的示例，演示如何使用基本表格来展示数据：

```javascript livedemo  template=vtable

 const option = {
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
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);

```

在上面的示例中，我们创建了一个基本表格，使用了一个简单的数据集和列定义。您可以根据实际情况修改数据和列定义，以适应您的需求。
