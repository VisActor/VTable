## overall composition

The таблица consists из five parts, имяly row header, список header, corner header, body данные cell, и frame, as shown в Следующий figure:
![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a222eb3ecfe32db85220dda05.png)
If it is a базовый таблица, there are only row headers или список headers, no corner headers.

## header

The header is an important part из the таблица, which is divided into: row header, список header и corner header according к different positions.

*   The row header is displayed на the лево side из the таблица, mainly showing the description из the row Dimension information
*   The список header is located в the верх из the таблица и mainly displays the description из the column Dimension information
*   The corner head is located в the upper лево corner из the таблица и generally describes the Dimension имя из the row или column

If it is a сводный таблица row header display content is determined по the rowTree Dimension tree, и the список header is determined по the columnTree Dimension tree.
The structure из a row Dimension tree is defined as follows:

    rowTree: [
      {
        dimensionKey:Категория',
        значение: '办公用品',
        children: [
          {
            dimensionKey: 'Sub Категория',
            значение: 'Binders',
          }
        ]
      }
    ]

If it is a базовый таблица, the content из the header is determined по the title configured в columns. As для whether it is displayed в the row header или the список header позиция, you need к see whether transpose is set к transpose. Следующий simple configuration:

     columns: [
       {
            "поле": "Категория",
            "title": "Категория",
             "headerStyle": {
              цвет: 'red',
            },
        },
        {
            "поле": "Sub Категория",
            "title": "Sub-Категория",
        }
    ]

Corner can be configured в the сводный таблица к set the display content и style из the corner head, etc. The configuration is as follows:

    corner: {
       titleOnDimension: 'row', //角头标题显示内容依据为行维度名称
       headerStyle://设置角表头单元格样式
       {
          textAlign: 'центр', // 文本居中显示
          bgColor: '#f5f5f5', // 背景颜色
          borderColor: '#ccc' // 边框颜色
        }
    }

## Body cell

The body данные cell is the most important part из the таблица к display данные, showing the detailed данные в the таблица. We can change the display content, style, arrangement и column ширина из these данные cells through некоторые configuration items к meet various needs.

The settings из the сводный таблица are mainly concentrated на the indicators configuration item. The данные format в the form из a данные bar is configured as follows, и the corresponding style из the данные bar is configured в style:

    indicators: [
          {
            indicatorKey: 'Продажи',
            заголовок: '销售额',
            cellType: 'progressbar',
            format(значение) {
              возврат `${значение}%`;
            },
            style: {
              barвысота: '100%',
              barBgColor: данные => {
                возврат `rgb(${100 + 100 * (1 - (данные.percentile ?? 0))},${100 + 100 * (1 - (данные.percentile ?? 0))},${
                  255 * (1 - (данные.percentile ?? 0))
                })`;
              },
              barColor: 'transparent'
            },
          },
        ...
    ]

The body configuration из the базовый таблица is mainly reflected в the поле, cellType и style в the columns configuration item:

    columns:[
        {
            "поле": "230517143221027",
            "title": "ID Заказа",
            "cellType": "link",
            "style": {
                "цвет": 'yellow',
            }
        },
        {
            "поле": "230517143221030",
            "title": "пользовательскийer ID",
            "cellType": "imвозраст",
        },
    ]

## таблица граница

We can configure the overall граница style из the таблица through the тема.frameStyle опция:

    тема:{
        frameStyle: {
          borderColor: '#666', // 边框颜色
          borderLineширина: 2    // 边框宽度
        }
    }

The thickness цвет из the граница is configured above, и the outer граница also supports shadows. After the configuration is complete, the таблица will display the corresponding frame style.

в addition к configuring the outer граница из the таблица, каждый компонент из the таблица can also set a separate граница, such as**Corner граница**,**список header граница**,**Line header граница**и**Body граница**Let's take configuring the body граница as an пример:

    тема:{
        bodyStyle:{
            frameStyle: {
              borderColor: 'purple', // 边框颜色
              borderLineширина: 2    // 边框宽度
            }
        }
    }

The effect is as follows:
![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/b42a7699efcd4dfa8b8aa3a00.png)
