/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
export function createTable() {
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
    .then(res => res.json())
    .then(data => {
      const columns: (VTable.IDimension | string)[] = [
        {
          dimensionKey: 'Region',
          title: '',
          headerStyle: {
            textStick: true
          }
        },
        'Category'
      ];
      const rows: (VTable.IDimension | string)[] = [
        {
          dimensionKey: 'Order Year',
          title: 'Order Year',
          headerStyle: {
            textBaseline: 'top',
            textStick: true
          }
        },
        'Ship Mode'
      ];
      const indicators: VTable.TYPES.IChartIndicator[] = [
        {
          indicatorKey: 'Quantity',
          title: 'Quantity',
          width: 'auto',
          cellType: 'chart',
          chartModule: 'vchart',
          chartSpec: {
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
          },
          style: {
            padding: 1
          }
        },
        {
          indicatorKey: 'Sales',
          title: 'Sales & Profit',
          cellType: 'chart',
          chartModule: 'vchart',
          chartSpec: {
            type: 'common',
            series: [
              {
                type: 'bar',
                barWidth: 20,
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
          },
          style: {
            padding: 1
          }
        }
      ];
      const option: VTable.PivotTableConstructorOptions = {
        rows,
        columns,
        indicators,
        indicatorsAsCol: false,
        records: data,
        defaultRowHeight: 131,
        defaultHeaderRowHeight: 50,
        defaultColWidth: 280,
        defaultHeaderColWidth: 80,
        indicatorTitle: 'indicator',
        autoWrapText: true,
        resize: {
          columnResizeType: 'indicator'
        },
        // widthMode:'adaptive',
        // heightMode:'adaptive',
        corner: {
          titleOnDimension: 'row',
          headerStyle: {
            autoWrapText: true
          }
        },
        theme: {
          bodyStyle: {
            borderColor: 'gray',
            borderLineWidth: [1, 0, 0, 1]
          },
          headerStyle: {
            borderColor: 'gray',
            borderLineWidth: [0, 0, 1, 1],
            hover: {
              cellBgColor: '#CCE0FF'
            }
          },
          rowHeaderStyle: {
            borderColor: 'gray',
            borderLineWidth: [1, 1, 0, 0],
            hover: {
              cellBgColor: '#CCE0FF'
            }
          },
          cornerHeaderStyle: {
            borderColor: 'gray',
            borderLineWidth: [0, 1, 1, 0],
            hover: {
              cellBgColor: ''
            }
          },
          cornerRightTopCellStyle: {
            borderColor: 'gray',
            borderLineWidth: [0, 0, 1, 1],
            hover: {
              cellBgColor: ''
            }
          },
          cornerLeftBottomCellStyle: {
            borderColor: 'gray',
            borderLineWidth: [1, 1, 0, 0],
            hover: {
              cellBgColor: ''
            }
          },
          cornerRightBottomCellStyle: {
            borderColor: 'gray',
            borderLineWidth: [1, 0, 0, 1],
            hover: {
              cellBgColor: ''
            }
          },
          rightFrozenStyle: {
            borderColor: 'gray',
            borderLineWidth: [1, 0, 1, 1],
            hover: {
              cellBgColor: ''
            }
          },
          bottomFrozenStyle: {
            borderColor: 'gray',
            borderLineWidth: [1, 1, 0, 1],
            hover: {
              cellBgColor: ''
            }
          },
          selectionStyle: {
            cellBgColor: '',
            cellBorderColor: ''
          },
          frameStyle: {
            borderLineWidth: 0
          }
        },
        renderChartAsync: true
      };

      const tableInstance = new VTable.PivotChart(document.getElementById(CONTAINER_ID)!, option);
      tableInstance.onVChartEvent('click', args => {
        console.log('onVChartEvent click', args);
      });
      tableInstance.onVChartEvent('mouseover', args => {
        console.log('onVChartEvent mouseover', args);
      });
      window.tableInstance = tableInstance;
    });
}
