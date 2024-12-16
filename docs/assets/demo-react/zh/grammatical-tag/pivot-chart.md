---
category: examples
group: grammatical-tag
title: 透视组合图
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-chart.png
order: 1-1
link: Developer_Ecology/react
---

# 透视组合图

PivotTable&PivotChart 接受的 props 属性与 option 一致，语义化子组件如下：

- PivotColumnDimension: 列上的维度配置，同 option 中的 columns 的定义一致 [api](../../option/PivotTable-columns-text#headerType)
- PivotRowDimension: 行上的维度配置，同 option 中的 rows 的定义一致 [api](../../option/PivotTable-rows-text#headerType)
- PivotIndicator: 指标配置，同 option 中的 indicators 的定义一致 [api](../../option/PivotTable-indicators-text#cellType)
- PivotColumnHeaderTitle: 列表头标题配置，同 option 中的 columnHeaderTitle 的定义一致 [api](../../option/PivotTable#rowHeaderTitle)
- PivotRowHeaderTitle: 行头标题配置，同 option 中的 rowHeaderTitle 的定义一致 [api](../../option/PivotTable#columnHeaderTitle)
- PivotCorner: 角头配置，同 option 中的 corner 的定义一致 [api](../../option/PivotTable#corner)

## 代码演示

```javascript livedemo template=vtable-react
// import * as ReactVTable from '@visactor/react-vtable';
// import VChart from '@visactor/vchart';

ReactVTable.register.chartModule('vchart', VChart);
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
  .then(res => res.json())
  .then(data => {
    const root = ReactDom.createRoot(document.getElementById(CONTAINER_ID));
    root.render(
      <ReactVTable.PivotChart
        records={data}
        indicatorsAsCol={false}
        defaultRowHeight={200}
        defaultHeaderRowHeight={50}
        defaultColWidth={280}
        defaultHeaderColWidth={100}
      >
        <ReactVTable.PivotColumnDimension dimensionKey={'Region'} title={'Region'} />
        <ReactVTable.PivotRowDimension dimensionKey={'Order Year'} title={'Order Year'} />
        <ReactVTable.PivotRowDimension dimensionKey={'Ship Mode'} title={'Ship Mode'} />
        <ReactVTable.PivotIndicator
          indicatorKey={'Quantity'}
          title={'Quantity'}
          width={'auto'}
          cellType={'chart'}
          chartModule={'vchart'}
          chartSpec={{
            // type: 'common',
            stack: true,
            type: 'bar',
            data: {
              id: 'data',
              fields: {
                //设置xField数据的顺序
                'Sub-Category': {
                  sortIndex: 0,
                  domain: [
                    'Chairs',
                    'Tables',
                    'Bookcases',
                    'Furnishings',

                    'Binders',
                    'Art',
                    'Storage',
                    'Appliances',
                    'Envelopes',
                    'Fasteners',
                    'Paper',
                    'Labels',
                    'Supplies',
                    'Accessories',
                    'Phones',
                    'Copiers',
                    'Machines'
                  ]
                },
                'Segment-Indicator': {
                  //设置seriesField数据的顺序 应该设置20001的顺序的 但是按照图例的顺序设置后堆叠效果和3.X不一致
                  sortIndex: 1,
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
                  ]
                  // lockStatisticsByDomain:  true
                }
              }
            },
            xField: ['Sub-Category'],
            yField: 'Quantity',
            seriesField: 'Segment-Indicator',
            axes: [
              { orient: 'left', visible: true, label: { visible: true } },
              { orient: 'bottom', visible: true }
            ],
            bar: {
              state: {
                selected: {
                  fill: 'yellow'
                },
                selected_reverse: {
                  // fill: '#ddd'
                  opacity: 0.2
                }
              }
            },
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
          }}
          style={{
            padding: 1
          }}
        />
        <ReactVTable.PivotIndicator
          indicatorKey={'Sales'}
          title={'Sales'}
          width={'auto'}
          cellType={'chart'}
          chartModule={'vchart'}
          chartSpec={{
            type: 'common',
            series: [
              {
                type: 'bar',
                data: {
                  id: 'data1',
                  fields: {
                    //设置xField数据的顺序
                    'Sub-Category': {
                      sortIndex: 0,
                      domain: [
                        'Chairs',
                        'Tables',
                        'Bookcases',
                        'Furnishings',

                        'Binders',
                        'Art',
                        'Storage',
                        'Appliances',
                        'Envelopes',
                        'Fasteners',
                        'Paper',
                        'Labels',
                        'Supplies',
                        'Accessories',
                        'Phones',
                        'Copiers',
                        'Machines'
                      ]
                    },
                    'Segment-Indicator': {
                      //设置seriesField数据的顺序 应该设置20001的顺序的 但是按照图例的顺序设置后堆叠效果和3.X不一致
                      sortIndex: 1,
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
                      ]
                      // lockStatisticsByDomain:  true
                    }
                  }
                },
                stack: true,
                xField: ['Sub-Category'],
                yField: 'Sales',
                seriesField: 'Segment-Indicator',
                bar: {
                  state: {
                    selected: {
                      fill: 'yellow'
                    },
                    selected_reverse: {
                      // fill: '#ddd'
                      opacity: 0.2
                    }
                  }
                }
              },
              {
                type: 'line',
                data: {
                  id: 'data2',
                  fields: {
                    //设置xField数据的顺序
                    'Sub-Category': {
                      sortIndex: 0,
                      domain: [
                        'Chairs',
                        'Tables',
                        'Bookcases',
                        'Furnishings',

                        'Binders',
                        'Art',
                        'Storage',
                        'Appliances',
                        'Envelopes',
                        'Fasteners',
                        'Paper',
                        'Labels',
                        'Supplies',

                        'Phones',
                        'Accessories',
                        'Machines',
                        'Copiers'
                      ]
                    },
                    'Segment-Indicator': {
                      //设置seriesField数据的顺序 应该设置20001的顺序的 但是按照图例的顺序设置后堆叠效果和3.X不一致
                      sortIndex: 1,
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
                      ]
                      // lockStatisticsByDomain:  true
                    }
                  }
                },
                stack: false,
                xField: ['Sub-Category'],
                yField: 'Profit',
                seriesField: 'Segment-Indicator',
                line: {
                  state: {
                    selected: {
                      lineWidth: 3
                    },
                    selected_reverse: {
                      lineWidth: 1
                    }
                  }
                },
                point: {
                  state: {
                    selected: {
                      fill: 'yellow'
                    },
                    selected_reverse: {
                      fill: '#ddd'
                    }
                  }
                }
              }
            ],
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
            // axes: [
            //   { orient: 'left', visible: true, label: { visible: true } },
            //   { orient: 'bottom', visible: true }
            // ]
          }}
          style={{
            padding: 1
          }}
        />
      </ReactVTable.PivotChart>
    );
  });

// release openinula instance, do not copy
window.customRelease = () => {
  root.unmount();
};
```
