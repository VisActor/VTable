/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
export function createTable() {
  const theme = {
    bodyStyle: {
      borderColor: 'gray',
      borderLineWidth: [1, 0, 0, 1]
    },
    headerStyle: {
      borderColor: 'red',
      bgColor: 'rgba(220, 210, 200, 0.2)',
      borderLineWidth: [0, 0, 0, 1],
      hover: {
        cellBgColor: '#CCE0FF'
      }
    },
    rowHeaderStyle: {
      borderColor: 'red',
      bgColor: 'rgba(220, 210, 200, 0.2)',
      borderLineWidth: [1, 0, 1, 0],
      hover: {
        cellBgColor: ''
      }
    },
    cornerHeaderStyle: {
      borderColor: 'gray',
      bgColor: 'rgba(220, 210, 200, 0.2)',
      borderLineWidth: [0, 0, 1, 0],
      hover: {
        cellBgColor: ''
      }
    },
    cornerRightTopCellStyle: {
      borderColor: 'gray',
      bgColor: 'rgba(220, 210, 200, 0.2)',
      borderLineWidth: [0, 0, 1, 1],
      hover: {
        cellBgColor: ''
      }
    },
    cornerLeftBottomCellStyle: {
      borderColor: 'gray',
      bgColor: 'rgba(220, 210, 200, 0.2)',
      borderLineWidth: [1, 1, 0, 0],
      hover: {
        cellBgColor: ''
      }
    },
    cornerRightBottomCellStyle: {
      borderColor: 'gray',
      bgColor: 'rgba(220, 210, 200, 0.2)',
      borderLineWidth: [1, 0, 0, 1],
      hover: {
        cellBgColor: ''
      }
    },
    rightFrozenStyle: {
      borderColor: 'gray',
      bgColor: 'rgba(220, 210, 200, 0.2)',
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
    },
    underlayBackgroundColor: '#ddd'
    // axisStyle: {
    //   defaultAxisStyle: {
    //     title: {
    //       style: {
    //         fill: 'red'
    //       }
    //     }
    //   },
    //   leftAxisStyle: {
    //     label: {
    //       style: {
    //         fill: 'yellow'
    //       }
    //     }
    //   }
    // }
  };
  const option: VTable.PivotChartConstructorOptions = {
    rows: [],
    columns: [],
    indicators: [
      {
        indicatorKey: 'line1',
        cellType: 'chart',
        chartModule: 'vchart',
        chartSpec: {
          type: 'heatmap',
          direction: 'vertical',
          xField: '__Dim_X__',
          yField: '__Dim_Y__',
          seriesField: '__Dim_ColorId__',
          valueField: '__MeaValue__line1',
          padding: 0,
          axes: [
            {
              type: 'band',
              orient: 'left',
              bandPadding: 0
            },
            {
              type: 'band',
              orient: 'bottom',
              bandPadding: 0
            }
          ],
          region: [
            {
              clip: true
            }
          ],
          animation: true,
          background: 'transparent',
          data: {
            id: 'line1',
            fields: {
              __Dim_Angle__: {
                sortIndex: 0
              },
              __Dim_X__: {
                sortIndex: 0
              },
              __Dim_ColorId__: {
                sortIndex: 0
              }
            }
          },
          color: {
            type: 'linear',
            range: ['#C2CEFF', '#5766EC'],
            domain: [
              {
                dataId: 'line1',
                fields: ['__Dim_Color__']
              }
            ]
          },
          label: {
            visible: true,
            layout: {},
            style: {},
            smartInvert: true,
            overlap: {
              hideOnHit: true,
              clampForce: true
            }
          },
          tooltip: {
            visible: true,
            mark: {
              title: {
                visible: false
              },
              content: [
                {
                  visible: true,
                  hasShape: true,
                  shapeType: 'rectRound'
                },
                {
                  visible: true,
                  hasShape: true,
                  shapeType: 'rectRound'
                }
              ]
            },
            dimension: {
              visible: false
            }
          },
          cell: {
            style: {
              shape: 'rect',
              stroke: '#ffffff',
              lineWidth: 1,
              fill: {
                field: '__Dim_Color__',
                scale: 'color'
              }
            }
          }
        },
        style: {
          padding: [1, 1, 0, 1]
        }
      },
      {
        indicatorKey: 'line2',
        cellType: 'chart',
        chartModule: 'vchart',
        chartSpec: {
          type: 'heatmap',
          direction: 'vertical',
          xField: '__Dim_X__',
          yField: '__Dim_Y1__',
          seriesField: '__Dim_ColorId__',
          valueField: '__MeaValue__line2',
          padding: 0,
          axes: [
            {
              type: 'band',
              orient: 'left',
              bandPadding: 0
            },
            {
              type: 'band',
              orient: 'bottom',
              bandPadding: 0
            }
          ],
          region: [
            {
              clip: true
            }
          ],
          animation: true,
          background: 'transparent',
          data: {
            id: 'line2',
            fields: {
              __Dim_Angle__: {
                sortIndex: 0
              },
              __Dim_X__: {
                sortIndex: 0
              },
              __Dim_ColorId__: {
                sortIndex: 0
              }
            }
          },
          color: {
            type: 'linear',
            range: ['#C2CEFF', '#5766EC'],
            domain: [
              {
                dataId: 'line2',
                fields: ['__Dim_Color__']
              }
            ]
          },
          label: {
            visible: true,
            layout: {},
            style: {},
            smartInvert: true,
            overlap: {
              hideOnHit: true,
              clampForce: true
            }
          },
          tooltip: {
            visible: true,
            mark: {
              title: {
                visible: false
              },
              content: [
                {
                  visible: true,
                  hasShape: true,
                  shapeType: 'rectRound'
                },
                {
                  visible: true,
                  hasShape: true,
                  shapeType: 'rectRound'
                }
              ]
            },
            dimension: {
              visible: false
            }
          },
          cell: {
            style: {
              shape: 'rect',
              stroke: '#ffffff',
              lineWidth: 1,
              fill: {
                field: '__Dim_Color__',
                scale: 'color'
              }
            }
          }
        },
        style: {
          padding: [1, 1, 0, 1]
        }
      }
    ],
    records: {
      line1: [
        {
          date: '2019',
          profit: 10000,
          __OriginalData__: {
            date: '2019',
            profit: 10000,
            sales: 200000
          },
          sales: 200000,
          __MeaId__: 'sales',
          __MeaName__: '销售额',
          __MeaValue__line1: 200000,
          __Dim_Color__: 200000,
          __Dim_ColorId__: 'sales',
          __Dim_X__: '2019',
          __Dim_Y__: '销售额',
          __Dim_Detail__: '销售额'
        },
        {
          date: '2020',
          profit: 20000,
          __OriginalData__: {
            date: '2020',
            profit: 20000,
            sales: 400000
          },
          sales: 400000,
          __MeaId__: 'sales',
          __MeaName__: '销售额',
          __MeaValue__line1: 400000,
          __Dim_Color__: 400000,
          __Dim_ColorId__: 'sales',
          __Dim_X__: '2020',
          __Dim_Y__: '销售额',
          __Dim_Detail__: '销售额'
        }
      ],
      line2: [
        {
          date: '2019',
          sales: 200000,
          __OriginalData__: {
            date: '2019',
            profit: 10000,
            sales: 200000
          },
          profit: 10000,
          __MeaId__: 'profit',
          __MeaName__: '利润',
          __MeaValue__line2: 10000,
          __Dim_Color__: 200000,
          __Dim_ColorId__: 'sales',
          __Dim_X__: '2019',
          __Dim_Y1__: '利润',
          __Dim_Detail__: '利润'
        },
        {
          date: '2020',
          sales: 400000,
          __OriginalData__: {
            date: '2020',
            profit: 20000,
            sales: 400000
          },
          profit: 20000,
          __MeaId__: 'profit',
          __MeaName__: '利润',
          __MeaValue__line2: 20000,
          __Dim_Color__: 400000,
          __Dim_ColorId__: 'sales',
          __Dim_X__: '2020',
          __Dim_Y1__: '利润',
          __Dim_Detail__: '利润'
        }
      ]
    },
    widthMode: 'adaptive',
    heightMode: 'adaptive',
    indicatorsAsCol: false,

    legends: {
      visible: true,
      type: 'color',
      orient: 'right',
      position: 'start',
      colors: ['#C2CEFF', '#5766EC'],
      value: [1000000, 200000],
      min: 1000000,
      max: 200000,
      maxWidth: '30%',
      handlerText: {
        visible: true,
        style: {
          fill: '#646A73',
          fontSize: 12,
          fontWeight: 400
        }
      }
    }
  };

  const tableInstance = new VTable.PivotChart(document.getElementById(CONTAINER_ID), option);
  tableInstance.onVChartEvent('click', args => {
    console.log('onVChartEvent click', args);
  });
  tableInstance.onVChartEvent('mouseover', args => {
    console.log('onVChartEvent mouseover', args);
  });
  window.tableInstance = tableInstance;
  const { LEGEND_CHANGE } = VTable.ListTable.EVENT_TYPE;
  tableInstance.on(LEGEND_CHANGE, args => {
    console.log('LEGEND_CHANGE', args);
    const maxValue = args.value[1];
    const minValue = args.value[0];
    tableInstance.updateFilterRules([
      {
        filterFunc: (record: any) => {
          console.log('updateFilterRules', record);
          if (record['230417171050011'] >= minValue && record['230417171050011'] <= maxValue) {
            return true;
          }
          return false;
        }
      }
    ]);
  });
  bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });

  window.update = () => {
    theme.cornerLeftBottomCellStyle.borderColor = 'red';
    tableInstance.updateTheme(theme);
  };
}
