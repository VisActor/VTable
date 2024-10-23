# 透视组合图表简介

透视组合图是一种数据可视化技术，它将相同类型的图表按照一定的规则进行排列组合，形成一个大的图表，每个小图表呈现一部分数据。透视组合图常用于将大量数据分组展示，以便更好地观察和比较不同数据之间的关系。
透视组合图的优点在于它可以同时呈现多个数据维度，使得用户可以更全面地了解数据之间的关系。此外，透视组合图还可以通过调整子图表的排列方式和大小，使得用户可以更方便地比较不同数据之间的差异。

# 应用场景

透视组合图在数据可视化中有许多应用场景，以下是其中的一些例子：

1. 大数据集合的可视化：透视组合图可以用来可视化大数据集合，通过将数据按照一定的规则进行排列组合，将数据分组展示，使得用户可以更好地理解数据之间的关系。
2. 多维数据的可视化：透视组合图可以用来可视化多维数据。通过将数据按照不同的属性进行分组，并将每个分组的数据以一定的形式呈现，使得用户可以同时观察多个维度的数据。
3. 数据的比较和分析：透视组合图可以用来比较和分析数据。通过将数据按照不同的属性进行分组，并将每个分组的数据以一定的形式呈现，使得用户可以更方便地比较和分析不同数据之间的差异和关系。
4. 数据探索和发现：透视组合图可以用来探索和发现数据中的规律和趋势。通过将数据按照不同的属性进行分组，并将每个分组的数据以一定的形式呈现，使得用户可以更全面地了解数据之间的关系，从而发现数据中的规律和趋势。
5. 数据报告和展示：透视组合图可以用来展示数据报告。通过将数据按照不同的属性进行分组，并将每个分组的数据以一定的形式呈现，可以使得数据报告更加易于理解和呈现。

# 透视组合图的结构

结构可对比[**透视表**](../table_type/Pivot_table/pivot_table_overview)。相比透视表，透视组合图除了有列表头，行标头，角表头，body 之外，还可以配置[**坐标轴组件**](../components/axes)，四个方向分别对应上轴，下周，左轴，右轴，同时还可以单独配置[**图例组件**](../components/legend)。
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/c0de7ff0a101bd4cb25c8170f.png)

具体相关配置如下：

```
{
    rows: [
       {
          dimensionKey: 'Order Year',
          title: 'Order Year',
          headerStyle: {
            textBaseline:'top',
            textStick: true
          }
        },
        'Ship Mode'
    ],
    columns: [
        {
          dimensionKey: 'Region',
          title: '',
          headerStyle: {
            textStick: true
          }
        },
        'Category'
    ],
    indicators: [
      {
        indicatorKey: 'Quantity',
        title: 'Quantity',
        cellType:'chart',
        chartModule:'vchart',
        chartSpec:{} //对应vchart的spec，具体可参考vchart官网
      },
      {
        indicatorKey: 'Sales',
        title: 'Sales & Profit',
        cellType:'chart',
        chartModule:'vchart',
        chartSpec:{} //对应vchart的spec，具体可参考vchart官网
      }
    ],
    axes: [
      {
        orient: 'bottom'
      },
      {
        orient: 'left',
        title: {
          visible: true
        }
      },
      {
        orient: 'right',
        visible: true,
        grid: {
          visible: false
        }
      }
    ],
    legends: {
      data: [
        {
          label: '公司-数量',
          shape: {
            fill: '#2E62F1',
            symbolType: 'circle'
          }
        },
        {
          label: '小型企业-数量',
          shape: {
            fill: '#4DC36A',
            symbolType: 'square'
          }
        },
        ...
      ],
      orient: 'bottom',
      position: 'start',
      maxRow: 1,
      padding: [50, 0, 0, 0]
    },
    records:[
      {
        "Segment-Indicator": "Consumer-Quantity",
        "Region": "Central",
        "Category": "Furniture",
        "Quantity": "16",
        "Sub-Category": "Chairs",
        "Order Year": "2015",
        "Segment": "Consumer",
        "Ship Mode": "First Class"
      },
      {
        "Segment-Indicator": "Consumer-Quantity",
        "Region": "Central",
        "Category": "Furniture",
        "Quantity": "4",
        "Sub-Category": "Tables",
        "Order Year": "2015",
        "Segment": "Consumer",
        "Ship Mode": "First Class"
      },
      {
        "Segment-Indicator": "Corporate-Quantity",
        "Region": "Central",
        "Category": "Furniture",
        "Quantity": "2",
        "Sub-Category": "Bookcases",
        "Order Year": "2015",
        "Segment": "Corporate",
        "Ship Mode": "First Class"
      },
      ...
   ]
}
```

对应上面透视组合图的示意图结构：

- rows 配置了行标头对应的维度`Order Year`和`Ship Mode`；
- columns 配置了列表头对应的维度`Region`和`Category`；
- indicators 配置了要分析的指标数据`Quantity`, `Sales`, `Profit`；
  - `Quantity`对应上图中的指标 1，用了柱状图表展示趋势；
  - `Sales` 和 `Profit` 对应上图中的指标 2 和指标 3，用组合双轴图展示两个指标的数据情况。
  - 需要在 `indicator`的具体配置中设置`cellType:'chart', chartModule:'vchart'`，来指明要配置图表渲染类型，并指明注册的图表库名称为`vchart`。
  - 具体的 chartSpec 配置可参考[VChart 官网](https://visactor.io/vchart/option/barChart)
- indicatorAsCol 配置指标在行头还是列头，需要注意的是：
  - 如果为 true 也就是指标在列头，则对应图表的展示方位 direction 为`horizontal`横向展示；
  - 如果为 false 也就是指标在行头，则对应图表的展示方位 direction 为`vertical`纵向展示；
- legends 配置图例样式；
  ![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/ffc3a9b5518762d274121ff07.png)
- axes 配置轴全局的样式，指标配置中 chartSpec 中如已配置 axes 则优先使用 chartSpec 中的配置。

# 图表库注册

在使用之前需要先注入使用的图表库组件：

```
import VChart from '@visactor/vchart';
VTable.register.chartModule('vchart', VChart);
```

# 图表事件

想要监听 chart 图表的事件，可以使用 onVChartEvent 实现，vtable 做了简单的事件代理，支持的事件类型及回调还是都统一和 vchart 一致，具体可参考[VChart 事件](https://visactor.io/vchart/api/API/event)

```
     tableInstance.onVChartEvent('click', args => {
        console.log('onVChartEvent click', args);
      });
      tableInstance.onVChartEvent('mouseover', args => {
        console.log('onVChartEvent mouseover', args);
      });
```

# 图例配置及图例联动

如何实现表格图例和 chart 的联动效果？

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/legend-chart.gif)

## 图例配置

可以参考表格[图例教程](../components/legend)来配置显示在表格外部的图例。
上述图片中的配置如下：

```
     legends: {
      orient: 'bottom',
      type: 'discrete',
      data: [
        {
          label: 'Consumer-Quantity',
          shape: {
            fill: '#2E62F1',
            symbolType: 'circle'
          }
        },
        {
          label: 'Consumer-Quantity',
          shape: {
            fill: '#4DC36A',
            symbolType: 'square'
          }
        },
         {
          label: 'Home Office-Quantity',
          shape: {
            fill: '#FF8406',
            symbolType: 'square'
          }
        },
        {
          label: 'Consumer-Sales',
          shape: {
            fill: '#FFCC00',
            symbolType: 'square'
          }
        },
        {
          label: 'Consumer-Sales',
          shape: {
            fill: '#4F44CF',
            symbolType: 'square'
          }
        },
         {
          label: 'Home Office-Sales',
          shape: {
            fill: '#5AC8FA',
            symbolType: 'square'
          }
        },
        {
          label: 'Consumer-Profit',
          shape: {
            fill: '#003A8C',
            symbolType: 'square'
          }
        },
        {
          label: 'Consumer-Profit',
          shape: {
            fill: '#B08AE2',
            symbolType: 'square'
          }
        },
         {
          label: 'Home Office-Profit',
          shape: {
            fill: '#FF6341',
            symbolType: 'square'
          }
        }
      ]
    }
```

该配置中配置了图例的每一项的颜色和形状，以及 lable 值。

因为这个配置中需要明确设置色值，所以在配置图表的 spec 中也需要指定颜色映射规则。可参考[color 的配置方式](https://visactor.io/vchart/option/barChart#color).

在上图示例中我们在 chartSpec 中加入了如下配置，以保证 chart 图中颜色和 legend 图例的颜色保持一致：

```
scales: [
              {
                id: 'color',
                type: 'ordinal',
                domain: [
                  'Consumer-Quantity',
                  'Corporate-Quantity',
                  'Home Office-Quantity',
                  'Consumer-Sales',
                  'Corporate-Sales',
                  'Home Office-Sales',
                  'Consumer-Profit',
                  'Corporate-Profit',
                  'Home Office-Profit'
                ],
                range: [
                  '#2E62F1',
                  '#4DC36A',
                  '#FF8406',
                  '#FFCC00',
                  '#4F44CF',
                  '#5AC8FA',
                  '#003A8C',
                  '#B08AE2',
                  '#FF6341',
                  '#98DD62',
                  '#07A199',
                  '#87DBDD'
                ]
              }
            ]
```

## 图例联动

通过事件`LEGEND_ITEM_CLICK`来监听图例项点击，调用 VTable 的接口`updateFilterRules`来处理数据展示过滤掉的图表。

```
      const { LEGEND_ITEM_CLICK } = VTable.ListTable.EVENT_TYPE;
      tableInstance.on(LEGEND_ITEM_CLICK, args => {
        console.log('LEGEND_ITEM_CLICK', args);
        tableInstance.updateFilterRules([
          {
            filterKey: 'Segment-Indicator',
            filteredValues: args.value
          }
        ]);
      });
```
