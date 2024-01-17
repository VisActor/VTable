/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
export function createTable() {
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
    .then(res => res.json())
    .then(data => {
      const columns = [
        {
          dimensionKey: 'Region',
          title: 'Region',
          headerStyle: {
            textStick: true
          }
        },
        'Category'
      ];
      const rows = [
        {
          dimensionKey: 'Order Year',
          title: 'Order Year',
          headerStyle: {
            textStick: true
          }
        },
        'Ship Mode'
      ];
      const indicators = [
        {
          indicatorKey: 'Quantity',
          title: 'Quantity',
          cellType: 'chart',
          chartModule: 'vchart',
          chartSpec: {
            // type: 'common',
            stack: true,
            type: 'pie',
            data: {
              id: 'data',
              fields: {
                'Segment-Indicator': {
                  sortIndex: 1,
                  domain: ['Consumer-Quantity', 'Corporate-Quantity', 'Home Office-Quantity']
                }
              }
            },
            categoryField: 'Segment-Indicator',
            valueField: 'Quantity',
            scales: [
              {
                id: 'color',
                type: 'ordinal',
                domain: ['Consumer-Quantity', 'Corporate-Quantity', 'Home Office-Quantity'],
                range: ['#2E62F1', '#4DC36A', '#FF8406']
              }
            ]
          },
          style: {
            padding: 1
          }
        }
      ];
      const option = {
        hideIndicatorName: true,
        rows,
        columns,
        indicators,
        records: data,
        defaultRowHeight: 200,
        defaultHeaderRowHeight: 50,
        defaultColWidth: 280,
        defaultHeaderColWidth: 100,
        indicatorTitle: '指标',
        autoWrapText: true,
        widthMode: 'adaptive',
        heightMode: 'adaptive',
        corner: {
          titleOnDimension: 'row',
          headerStyle: {
            autoWrapText: true
          }
        },
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
              label: 'Corporate-Quantity',
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
            }
          ]
        },
        // theme: {
        //   bodyStyle: {
        //     borderColor: 'gray',
        //     borderLineWidth: [1, 0, 0, 1]
        //   },
        //   headerStyle: {
        //     borderColor: 'gray',
        //     borderLineWidth: [0, 0, 1, 1],
        //     hover: {
        //       cellBgColor: '#CCE0FF'
        //     }
        //   },
        //   rowHeaderStyle: {
        //     borderColor: 'gray',
        //     borderLineWidth: [1, 1, 0, 0],
        //     hover: {
        //       cellBgColor: '#CCE0FF'
        //     }
        //   },
        //   cornerHeaderStyle: {
        //     borderColor: 'gray',
        //     borderLineWidth: [0, 1, 1, 0],
        //     hover: {
        //       cellBgColor: ''
        //     }
        //   },
        //   cornerRightTopCellStyle: {
        //     borderColor: 'gray',
        //     borderLineWidth: [0, 0, 1, 1],
        //     hover: {
        //       cellBgColor: ''
        //     }
        //   },
        //   cornerLeftBottomCellStyle: {
        //     borderColor: 'gray',
        //     borderLineWidth: [1, 1, 0, 0],
        //     hover: {
        //       cellBgColor: ''
        //     }
        //   },
        //   cornerRightBottomCellStyle: {
        //     borderColor: 'gray',
        //     borderLineWidth: [1, 0, 0, 1],
        //     hover: {
        //       cellBgColor: ''
        //     }
        //   },
        //   rightFrozenStyle: {
        //     borderColor: 'gray',
        //     borderLineWidth: [1, 0, 1, 1],
        //     hover: {
        //       cellBgColor: ''
        //     }
        //   },
        //   bottomFrozenStyle: {
        //     borderColor: 'gray',
        //     borderLineWidth: [1, 1, 0, 1],
        //     hover: {
        //       cellBgColor: ''
        //     }
        //   },
        //   selectionStyle: {
        //     cellBgColor: '',
        //     cellBorderColor: ''
        //   },
        //   frameStyle: {
        //     borderLineWidth: 0
        //   }
        // },
        pagination: {
          currentPage: 0,
          perPageCount: 8
        }
      };

      const tableInstance = new VTable.PivotChart(document.getElementById(CONTAINER_ID), option);
      window.table = tableInstance;
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
    });
}
