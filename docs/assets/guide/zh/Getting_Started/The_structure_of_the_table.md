## 总体构成

表格由五部分组成，分别是行表头、列表头、角表头、body数据单元格、框架 如下图所示：
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a222eb3ecfe32db85220dda05.png)
如果是基本表格的话只有行表头或者列表头，没有角表头。

## 表头

表头是表格的重要组成部分，根据位置的不同又分为：行表头，列表头及角表头。

*   行表头显示在表格左侧，主要显示行维度信息的描述
*   列表头位于表格顶部，主要展示列维度信息的描述
*   角头位于表格左上角，一般描述行或者列的维度名称

如果是透视表行表头展示内容由rowTree维度树决定，列表头由columnTree维度树决定。
如下定义一个行维度树的结构：

    rowTree: [
      {
        dimensionKey:Category',
        value: '办公用品',
        children: [
          {
            dimensionKey: 'Sub Category',
            value: 'Binders',
          }
        ]
      }
    ]

如果是基本表格，表头内容是由columns中配置的title决定。至于是显示在行表头还是列表头位置，需要看transpose是否设置了转置。如下简单配置：

     columns: [
       {
            "field": "Category",
            "title": "Category",
             "headerStyle": {
              color: 'red',
            },
        },
        {
            "field": "Sub Category",
            "title": "Sub-Category",
        }
    ]

在透视表中可配置corner来设置角头的显示内容和样式等，配置如下：

    corner: {
       titleOnDimension: 'row', //角头标题显示内容依据为行维度名称
       headerStyle://设置角表头单元格样式
       {
          textAlign: 'center', // 文本居中显示
          bgColor: '#f5f5f5', // 背景颜色
          borderColor: '#ccc' // 边框颜色
        }
    }

## body单元格

body数据单元格是表格最主要的显示数据的部分，展示了表格内的详细数据。我们可以通过一些配置项来改变这些数据单元格的显示内容、样式、排列方式和列宽等，以满足各种需求。

透视表的设置主要集中在indicators配置项上，如下配置了数据条形式的数据格式，与此同时style中配置了数据条bar的相应样式：

    indicators: [
          {
            indicatorKey: 'sales',
            title: '销售额',
            cellType: 'progressbar',
            format(value) {
              return `${value}%`;
            },
            style: {
              barHeight: '100%',
              barBgColor: data => {
                return `rgb(${100 + 100 * (1 - (data.percentile ?? 0))},${100 + 100 * (1 - (data.percentile ?? 0))},${
                  255 * (1 - (data.percentile ?? 0))
                })`;
              },
              barColor: 'transparent'
            },
          },
        ...
    ]

基本表格的body配置主要体现在columns配置项中的field，cellType及style上：

    columns:[
        {
            "field": "230517143221027",
            "title": "Order ID",
            "cellType": "link",
            "style": {
                "color": 'yellow',
            }
        },
        {
            "field": "230517143221030",
            "title": "Customer ID",
            "cellType": "image",
        },
    ]

## 表格边框

我们可以通过theme.frameStyle选项来配置表格整体外边框样式:

    theme:{
        frameStyle: {
          borderColor: '#666', // 边框颜色
          borderLineWidth: 2    // 边框宽度
        }
    }

上面配置了边框的粗细颜色，外边框也支持阴影。配置完成后，表格将显示相应的框架样式。

除了可以配置表格外边框外，每个表格的构成部分也可以设置单独的边框，如**角头边框**，**列表头边框**，**行表头边框**和**body边框**。下面以配置body边框为例：
```
theme:{
    bodyStyle:{
        frameStyle: {
          borderColor: 'purple', // 边框颜色
          borderLineWidth: 2    // 边框宽度
        }
    }
}
```
效果如下：
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/b42a7699efcd4dfa8b8aa3a00.png)