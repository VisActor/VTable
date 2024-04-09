/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
export function createTable() {
  const option = {
    indicatorsAsCol: false,
    records: [
      {
        col_390: 6,
        col_389: '2023-12-25'
      },
      {
        col_390: 59,
        col_389: '2023-12-26'
      },
      {
        col_390: 29,
        col_389: '2023-12-28'
      },
      {
        col_390: 82,
        col_389: '2023-12-29'
      },
      {
        col_390: 107,
        col_389: '2023-12-30'
      },
      {
        col_391: -519.51,
        col_389: '2023-12-25'
      },
      {
        col_391: -2258.9,
        col_389: '2023-12-26'
      },
      {
        col_391: 1185.49,
        col_389: '2023-12-28'
      },
      {
        col_391: 7282.13,
        col_389: '2023-12-29'
      },
      {
        col_391: 610.28,
        col_389: '2023-12-30'
      }
    ],
    columns: [],
    rows: [],
    indicators: [
      {
        indicatorKey: 'col_390',
        title: '数量',
        width: 50,
        cellType: 'chart',
        chartModule: 'vchart',
        disableHeaderHover: true,
        chartSpec: {
          type: 'common',
          series: [
            {
              id: 'col_390',
              type: 'bar',
              data: {
                id: 'col_390'
              },
              bar: {
                state: {
                  selected_reverse: {
                    fill: '#ddd',
                    fillOpacity: 0.2
                  }
                },
                style: {
                  cursor: 'pointer'
                }
              },
              barMinWidth: 1,
              barMaxWidth: 30,
              barMinHeight: 1,
              xField: 'col_389',
              yField: 'col_390'
            }
          ],
          axes: [
            {
              orient: 'left',
              min: 0,
              seriesId: ['col_390']
            },
            {
              orient: 'right',
              visible: false,
              label: {
                visible: false
              },
              seriesId: ['col_390']
            }
          ],
          scales: [
            {
              id: 'col_390',
              type: 'ordinal',
              range: ['#1763FF']
            }
          ],
          markLine: [
            {
              y1: 'sum',
              x: '2023-12-25',
              y: '10%',
              x1: '2023-12-30',
              autoRange: true,
              relativeSeriesIndex: 0,
              startSymbol: {
                visible: true,
                style: {
                  symbolType: 'triangleDown',
                  size: 8
                }
              },
              endSymbol: {
                visible: false
              },
              line: {
                style: {
                  stroke: '#000',
                  lineDash: [5],
                  lineWidth: 2
                }
              },
              label: {
                visible: true,
                position: 'insideStartTop',
                labelBackground: {
                  visible: false
                },
                style: {
                  fill: '#909090',
                  fontSize: 14
                }
              }
            }
          ]
        },
        style: {
          padding: 1
        }
      }
    ],
    corner: {
      titleOnDimension: 'row',
      disableHeaderHover: true
    },
    widthMode: 'autoWidth',
    heightMode: 'autoHeight',
    defaultRowHeight: 200,
    defaultHeaderRowHeight: 50,
    defaultColWidth: 280,
    defaultHeaderColWidth: 120,
    autoFillWidth: true,
    autoFillHeight: true,
    tooltip: {
      confine: false
    },
    hover: {
      disableAxisHover: true
    },
    theme: {
      underlayBackgroundColor: 'rgba(255, 255, 255, 0)',
      defaultStyle: {
        fontSize: 14,
        fontFamily: '微软雅黑',
        fontWeight: '400',
        borderColor: '#CBCBCB',
        color: '#666666',
        bgColor: '#FFFFFF',
        borderLineWidth: [0, 0, 0, 0],
        frameStyle: {
          borderLineWidth: 0,
          borderColor: '#CBCBCB'
        },
        cellBgColor: '',
        cellBorderColor: ''
      },
      headerStyle: {
        fontSize: 12,
        fontFamily: '微软雅黑',
        fontWeight: '400',
        borderColor: '#CBCBCB',
        color: '#666666',
        bgColor: '#FFFFFF',
        borderLineWidth: [0, 0, 1, 1],
        frameStyle: {
          borderLineWidth: 0,
          borderColor: '#CBCBCB'
        },
        cellBgColor: '',
        cellBorderColor: ''
      },
      rowHeaderStyle: {
        fontSize: 12,
        fontFamily: '微软雅黑',
        fontWeight: '400',
        borderColor: '#CBCBCB',
        color: '#666666',
        bgColor: '#FFFFFF',
        borderLineWidth: [1, 1, 0, 0],
        frameStyle: {
          borderLineWidth: 0,
          borderColor: '#CBCBCB'
        },
        cellBgColor: '',
        cellBorderColor: ''
      },
      cornerHeaderStyle: {
        fontSize: 12,
        fontFamily: '微软雅黑',
        fontWeight: '400',
        borderColor: '#CBCBCB',
        color: '#666666',
        bgColor: '#FFFFFF',
        borderLineWidth: [0, 1, 1, 0],
        frameStyle: {
          borderLineWidth: 0,
          borderColor: '#CBCBCB'
        },
        cellBgColor: '',
        cellBorderColor: ''
      },
      cornerRightTopCellStyle: {
        fontSize: 12,
        fontFamily: '微软雅黑',
        fontWeight: '400',
        borderColor: '#CBCBCB',
        color: '#666666',
        bgColor: '#FFFFFF',
        borderLineWidth: [0, 0, 1, 0],
        frameStyle: {
          borderLineWidth: 0,
          borderColor: '#CBCBCB'
        },
        cellBgColor: '',
        cellBorderColor: ''
      },
      cornerLeftBottomCellStyle: {
        fontSize: 12,
        fontFamily: '微软雅黑',
        fontWeight: '400',
        borderColor: '#CBCBCB',
        color: '#666666',
        bgColor: '#FFFFFF',
        borderLineWidth: [1, 1, 0, 0],
        frameStyle: {
          borderLineWidth: 0,
          borderColor: '#CBCBCB'
        },
        cellBgColor: '',
        cellBorderColor: ''
      },
      cornerRightBottomCellStyle: {
        fontSize: 12,
        fontFamily: '微软雅黑',
        fontWeight: '400',
        borderColor: '#CBCBCB',
        color: '#666666',
        bgColor: '#FFFFFF',
        borderLineWidth: [1, 0, 0, 0],
        frameStyle: {
          borderLineWidth: 0,
          borderColor: '#CBCBCB'
        },
        cellBgColor: '',
        cellBorderColor: ''
      },
      rightFrozenStyle: {
        fontSize: 12,
        fontFamily: '微软雅黑',
        fontWeight: '400',
        borderColor: '#CBCBCB',
        color: '#666666',
        bgColor: '#FFFFFF',
        borderLineWidth: [1, 0, 0, 1],
        frameStyle: {
          borderLineWidth: 0,
          borderColor: '#CBCBCB'
        },
        cellBgColor: '',
        cellBorderColor: ''
      },
      bottomFrozenStyle: {
        fontSize: 12,
        fontFamily: '微软雅黑',
        fontWeight: '400',
        borderColor: '#CBCBCB',
        color: '#666666',
        bgColor: '#FFFFFF',
        borderLineWidth: [1, 0, 0, 1],
        frameStyle: {
          borderLineWidth: 0,
          borderColor: '#CBCBCB'
        },
        cellBgColor: '',
        cellBorderColor: ''
      },
      selectionStyle: {
        fontSize: 14,
        fontFamily: '微软雅黑',
        fontWeight: '400',
        borderColor: '#CBCBCB',
        color: '#666666',
        bgColor: '#FFFFFF',
        borderLineWidth: [0, 0, 0, 0],
        frameStyle: {
          borderLineWidth: 0,
          borderColor: '#CBCBCB'
        },
        cellBgColor: '',
        cellBorderColor: ''
      },
      bodyStyle: {
        fontSize: 12,
        fontFamily: '微软雅黑',
        fontWeight: '400',
        borderColor: '#CBCBCB',
        color: '#666666',
        bgColor: '#FFFFFF',
        borderLineWidth: [0, 0, 1, 1],
        frameStyle: {
          borderLineWidth: 0,
          borderColor: '#CBCBCB'
        },
        cellBgColor: '',
        cellBorderColor: ''
      },
      frameStyle: {
        borderLineWidth: 0,
        borderColor: '#CBCBCB'
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

  bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });

  window.update = () => {
    theme.cornerLeftBottomCellStyle.borderColor = 'red';
    tableInstance.updateTheme(theme);
  };
}
