/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
export function createTable() {
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/test-demo-data/pivot-chart-demo-3w.json')
    .then(res => res.json())
    .then(data => {
      const columns: (VTable.IDimension | string)[] = [
        {
          dimensionKey: '230417171050031',
          title: '国家',
          headerStyle: {
            color: 'red'
          }
        },
        '230717170834056',
        '230417171050028'
        // '230417170554008'
      ];
      const rows = [
        {
          dimensionKey: '230718152836009',
          title: '邮寄方式',
          headerStyle: {
            color: 'red',
            textStick: true
          }
        },
        '230718152836012'
      ];
      const indicators: VTable.TYPES.IIndicator[] = [
        {
          indicatorKey: '230713183656009',
          title: '数量',
          width: 'auto',
          cellType: 'chart',
          chartModule: 'vchart',
          chartSpec: {
            // type: 'common',
            stack: true,
            type: 'bar',
            data: {
              id: 'data'
            },
            // brush: {
            //   brushType: 'rect',
            //   brushLinkSeriesIndex: [1, 2],
            //   inBrush: {
            //     colorAlpha: 1
            //   },
            //   outOfBrush: {
            //     colorAlpha: 0.2
            //   }
            // },
            xField: ['230417170554008'],
            yField: '230713183656009',
            seriesField: '230717170834024',
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
                domain: ['公司', '小型企业', '消费者'],
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
          indicatorKey: '230417171050025',
          title: '销售额 & 利润',
          cellType: 'chart',
          chartModule: 'vchart',
          chartSpec: {
            type: 'common',
            series: [
              {
                type: 'bar',
                stack: true,
                xField: ['230417170554008'],
                yField: '230713152555009',
                seriesField: '230717170834024',
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
                data: {
                  id: 'data1'
                }
              },
              {
                type: 'line',
                stack: false,
                xField: ['230417170554008'],
                yField: '230417171050025',
                seriesField: '230717170834024',
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
                },
                data: {
                  id: 'data2'
                }
              }
            ],
            axes: [
              { orient: 'left', visible: true, label: { visible: true } },
              { orient: 'bottom', visible: true }
            ],
            scales: [
              {
                id: 'color',
                type: 'ordinal',
                domain: ['公司', '小型企业', '消费者'],
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
          indicatorKey: '230707112948009',
          title: '折扣',
          width: 'auto',
          cellType: 'chart',
          chartModule: 'vchart',
          chartSpec: {
            // type: 'common',
            stack: false,
            type: 'area',
            data: {
              id: 'data'
            },
            xField: ['230417170554008'],
            yField: '230707112948009',
            seriesField: '230717170834024',
            axes: [
              { orient: 'left', visible: true, label: { visible: true } },
              { orient: 'bottom', visible: true }
            ],
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
            },
            area: {
              state: {
                selected: {
                  opacity: 1
                },
                selected_reverse: {
                  opacity: 0.2
                }
              }
            },
            scales: [
              {
                id: 'color',
                type: 'ordinal',
                domain: ['公司', '小型企业', '消费者'],
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
        }
      ];
      const option: VTable.PivotTableConstructorOptions = {
        rows,
        columns,
        indicators,
        indicatorsAsCol: false,
        container: document.getElementById(CONTAINER_ID),
        records: data,
        defaultRowHeight: 200,
        defaultHeaderRowHeight: 50,
        defaultColWidth: 280,
        defaultHeaderColWidth: 100,
        indicatorTitle: '指标',
        corner: {
          titleOnDimension: 'row',
          headerStyle: {
            autoWrapText: true
          }
        },
        theme: VTable.themes.ARCO.extends({
          selectionStyle: {
            cellBgColor: ''
          }
        })
      };

      const tableInstance = new VTable.PivotChart(option);
      tableInstance.onVChartEvent('click', args => {
        console.log('onVChartEvent click', args);
      });
      tableInstance.onVChartEvent('mouseover', args => {
        console.log('onVChartEvent mouseover', args);
      });
      window.tableInstance = tableInstance;

      bindDebugTool(tableInstance.scenegraph.stage as any, {
        customGrapicKeys: ['role', 'row']
      });
    });
}
