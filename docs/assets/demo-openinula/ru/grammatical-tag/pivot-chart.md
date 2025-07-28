---
категория: примеры
группа: грамматический-тег
заголовок: сводная диаграмма
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-chart.png
порядок: 1-1
ссылка: Developer_Ecology/openinula
---

# сводная диаграмма

The props attributes accepted by PivotTable&PivotChart are consistent with опцияs. The semantic sub-компонентs are as follows:

- PivotColumnDimension: The dimension configuration on the column is consistent with the definition of columns in опция [api](../../опция/PivotTable-columns-text#headerType)
- PivotRowDimension: The dimension configuration on the row is consistent with the definition of rows in опция [api](../../опция/PivotTable-rows-text#headerType)
- PivotIndicator: indicator configuration, consistent with the definition of indicators in опция [api](../../опция/PivotTable-indicators-text#cellType)
- PivotColumnHeaderTitle: column header заголовок configuration, consistent with the definition of columnHeaderTitle in опция [api](../../опция/PivotTable#rowHeaderTitle)
- PivotRowHeaderTitle: row header заголовок configuration, consistent with the definition of rowHeaderTitle in опция [api](../../опция/PivotTable#columnHeaderTitle)
- PivotCorner: Corner configuration, consistent with the definition of corner in опция [api](../../опция/PivotTable#corner)

## демонстрация кода

```javascript livedemo template=vtable-openinula
// import * as InulaVTable from '@visactor/openinula-vtable';
// import VChart from '@visactor/vchart';

InulaVTable.VTable.register.chartModule('vchart', VChart);
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
  .then(res => res.json())
  .then(data => {
    const root = document.getElementById(CONTAINER_ID);
    Inula.render(
      <InulaVTable.PivotChart
        records={data}
        indicatorsAsCol={false}
        defaultRowHeight={200}
        defaultHeaderRowHeight={50}
        defaultColWidth={280}
        defaultHeaderColWidth={100}
      >
        <InulaVTable.PivotColumnDimension dimensionKey={'Регион'} title={'Регион'} />
        <InulaVTable.PivotRowDimension dimensionKey={'Order Year'} title={'Order Year'} />
        <InulaVTable.PivotRowDimension dimensionKey={'Ship Mode'} title={'Ship Mode'} />
        <InulaVTable.PivotIndicator
          indicatorKey={'Количество'}
          title={'Количество'}
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
                'Подкатегория': {
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
                    'Consumer-Количество',
                    'Corporate-Количество',
                    'Home Office-Количество',
                    'Consumer-Продажи',
                    'Corporate-Продажи',
                    'Home Office-Продажи',
                    'Consumer-Прибыль',
                    'Corporate-Прибыль',
                    'Home Office-Прибыль'
                  ]
                  // lockStatisticsByDomain:  true
                }
              }
            },
            xField: ['Подкатегория'],
            yField: 'Количество',
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
                  'Consumer-Количество',
                  'Corporate-Количество',
                  'Home Office-Количество',
                  'Consumer-Продажи',
                  'Corporate-Продажи',
                  'Home Office-Продажи',
                  'Consumer-Прибыль',
                  'Corporate-Прибыль',
                  'Home Office-Прибыль'
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
        <InulaVTable.PivotIndicator
          indicatorKey={'Продажи'}
          title={'Продажи'}
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
                    'Подкатегория': {
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
                        'Consumer-Количество',
                        'Corporate-Количество',
                        'Home Office-Количество',
                        'Consumer-Продажи',
                        'Corporate-Продажи',
                        'Home Office-Продажи',
                        'Consumer-Прибыль',
                        'Corporate-Прибыль',
                        'Home Office-Прибыль'
                      ]
                      // lockStatisticsByDomain:  true
                    }
                  }
                },
                stack: true,
                xField: ['Подкатегория'],
                yField: 'Продажи',
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
                    'Подкатегория': {
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
                        'Consumer-Количество',
                        'Corporate-Количество',
                        'Home Office-Количество',
                        'Consumer-Продажи',
                        'Corporate-Продажи',
                        'Home Office-Продажи',
                        'Consumer-Прибыль',
                        'Corporate-Прибыль',
                        'Home Office-Прибыль'
                      ]
                      // lockStatisticsByDomain:  true
                    }
                  }
                },
                stack: false,
                xField: ['Подкатегория'],
                yField: 'Прибыль',
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
                  'Consumer-Количество',
                  'Corporate-Количество',
                  'Home Office-Количество',
                  'Consumer-Продажи',
                  'Corporate-Продажи',
                  'Home Office-Продажи',
                  'Consumer-Прибыль',
                  'Corporate-Прибыль',
                  'Home Office-Прибыль'
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
      </InulaVTable.PivotChart>,
      root
    );
  });

// release openinula instance, do not copy
window.customRelease = () => {
  Inula.unmountComponentAtNode(root);
};
```
