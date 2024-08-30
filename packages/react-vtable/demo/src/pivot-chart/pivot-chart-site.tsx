import * as ReactVTable from '../../../src';
import data from '../../data/North_American_Superstore_Pivot_Chart_data.json';
import VChart from '@visactor/vchart';

ReactVTable.register.chartModule('vchart', VChart);
export default function App() {
  return (
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
}
