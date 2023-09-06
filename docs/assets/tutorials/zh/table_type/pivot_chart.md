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
结构可对比[透视表](https://visactor.io/vtable/tutorials/table_type/Pivot_table/pivot_table_overview)。相比透视表，透视组合图除了有列表头，行标头，角表头，body之外，还可以配置坐标轴组件，四个方向分别对应上轴，下周，左轴，右轴，同时还可以单独配置图例组件。
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/c0de7ff0a101bd4cb25c8170f.png)

配置项
如下一份配置详情：
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
- rows配置了行标头对应的维度'Order Year'和'Ship Mode'；
- columns配置了列表头对应的维度'Region'和'Category'；
- indicators配置了要分析的指标数据'Quantity', 'Sales', 'Profit'；Quantity对应上图中的指标1，用了柱状图表展示趋势；Sales和Profit对应上图中的指标2和指标3，用组合双轴图展示两个指标的数据情况。
- indicatorAsCol配置指标在行头还是列头，需要注意的是：
  - 如果为true也就是指标在列头，则对应图表的展示方位direction为'horizontal'横向展示；
  - 如果为false也就是指标在行头，则对应图表的展示方位direction为'vertical'宗向展示；
- legends配置图例样式；
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/ffc3a9b5518762d274121ff07.png)
- axes配置轴全局的样式，指标配置中chartSpec中如已配置axes则优先使用chartSpec中的配置。
# 图表事件
想要监听chart图表的事件，可以使用listenChart实现，vtable做了简单的事件代理，支持的事件类型及回调还是都统一和vchart一致，具体可参考[VChart事件](https://visactor.io/vchart/api/API/event)
```    
     tableInstance.listenChart('click', args => {
        console.log('listenChart click', args);
      });
      tableInstance.listenChart('mouseover', args => {
        console.log('listenChart mouseover', args);
      });
```