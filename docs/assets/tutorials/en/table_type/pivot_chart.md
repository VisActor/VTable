# Introduction to Perspective Combination Charts

Perspective combination chart is a data lake visualization technology, which arranges and combines charts of the same type according to certain rules to form a large chart, and each small chart presents a part of the data. Perspective combination charts are often used to group and display large amounts of data in order to better observe and compare the relationship between different data.
The advantage of the perspective combination chart is that it can present multiple data Dimensions at the same time, so that users can understand the relationship between the data more comprehensively. In addition, the perspective combination chart can also make it easier for users to compare the differences between different data by adjusting the arrangement and size of the subcharts.

# Application Scenario

There are many application scenarios for perspective composite graphs in data lake visualization. Here are some examples of them:

1.  Visualization of big data collections: Perspective combination diagrams can be used to visualize big data collections. By arranging and combining data according to certain rules, data groups are displayed, so that users can better understand the relationship between data.
2.  Visualization of multidimensional data: Perspective combination charts can be used to visualize multidimensional data. By grouping data according to different attributes and presenting each grouped data in a certain form, users can observe data in multiple Dimensions at the same time.
3.  Comparison and analysis of data: Perspective combination charts can be used to compare and analyze data. By grouping data according to different attributes, and presenting the data of each grouping in a certain form, users can more easily compare and analyze the differences and relationships between different data.
4.  Data Exploration and Discovery: Perspective composite diagrams can be used to explore and discover patterns and trends in data. By grouping data according to different attributes and presenting each grouped data in a certain form, users can gain a more comprehensive understanding of the relationship between data, thereby discovering patterns and trends in data.
5.  Data reporting and presentation: Perspective composite diagrams can be used to present data reports. Data reports can be made easier to understand and present by grouping data according to different attributes and presenting each grouped data in a certain form.

# Structure of Perspective Composite Diagram

Structure is comparable[Pivot Table](https://visactor.io/vtable/guide/table_type/Pivot_table/pivot_table_overview)Compared with the pivot table, in addition to the list header, row header, corner header, and body, the pivot combination diagram can also configure the coordinate axis component. The four directions correspond to the upper axis, next week, left axis, and right axis respectively. At the same time, the legend component can also be configured separately.
![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/c0de7ff0a101bd4cb25c8170f.png)

configuration item
The following configuration details:

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

Corresponding to the schematic structure of the perspective combination diagram above:

*   Rows configures the Dimension'Order Year 'and'Ship Mode' corresponding to the row header;
*   Columns configures the Dimension'Region 'and'Category' corresponding to the list header;
*   Indicators configure the Metirc data'Quantity ',' Sales', 'Profit' to be analyzed; Quantity corresponds to Metirc 1 in the figure above, and a histogram is used to show the trend; Sales and Profit correspond to Metirc 2 and Metirc 3 in the figure above, using a combined biaxial graph to show the data of the two Metircs.
*   IndicatorAsCol configures Metirc in the row header or column header, it should be noted that:
    *   If true, that is, Metirc is in the column header, the display direction of the corresponding chart is'horizontal 'horizontal display;
    *   If it is false, that is, Metirc is at the head of the row, then the display direction of the corresponding chart is'vertical '.
*   Legends configuration legend style;
    ![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/ffc3a9b5518762d274121ff07.png)
*   Axes configures the global style of the axis. If axes have been configured in chartSpec in the Metirc configuration, the configuration in chartSpec will be used first.

# Chart Events

If you want to listen to the events of the chart chart, you can use listenChart to implement it. Vtable makes a simple event proxy. The supported event types and callbacks are still the same as those of vchart. For details, please refer to[VChart event](https://visactor.io/vchart/api/API/event)

         tableInstance.listenChart('click', args => {
            console.log('listenChart click', args);
          });
          tableInstance.listenChart('mouseover', args => {
            console.log('listenChart mouseover', args);
          });
