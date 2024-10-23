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
        col_58: '公司',
        col_59: 681967.69,
        col_57: 9152793.35,
        col_56: 11581,
        col_55: 681967.69
      },
      {
        col_58: '消费者',
        col_59: 1053092.69,
        col_57: 8025072.24,
        col_56: 19173,
        col_55: 1053092.69
      },
      {
        col_58: '小型企业',
        col_59: 412478.55,
        col_57: 2891088.53,
        col_56: 6780,
        col_55: 412478.55
      }
    ],
    columns: [
      {
        dimensionKey: 'col_58',
        title: '细分',
        headerStyle: {
          cursor: 'pointer'
        },
        disableHeaderHover: false
      }
    ],
    rows: [],
    indicators: [
      {
        indicatorKey: 'col_57',
        title: '销售额',
        width: 50,
        cellType: 'chart',
        chartModule: 'vchart',
        disableHeaderHover: true,
        chartSpec: {
          axes: [
            {
              title: {
                visible: true,
                text: '销售额'
              },
              // seriesId: ['col_57','col_59'],
              orient: 'left',
              range: { min: 0 },
              type: 'linear',
              innerOffset: {
                left: 4,
                right: 4,
                top: 4,
                bottom: 4
              }
            }
          ],
          type: 'scatter',
          data: {
            id: 'col_57'
          },
          scatter: {
            state: {
              selected_reverse: {
                fillOpacity: 0.2
              }
            }
          },
          xField: 'col_56',
          yField: 'col_57',
          size: 6,
          color: {
            type: 'ordinal',
            range: ['#1763FF']
          }
        },
        style: {
          padding: 1
        }
      },
      {
        indicatorKey: 'col_59',
        title: '利润',
        width: 50,
        cellType: 'chart',
        chartModule: 'vchart',
        disableHeaderHover: true,
        chartSpec: {
          axes: [
            {
              title: {
                visible: true,
                text: '利润'
              },
              // seriesId: ['col_57','col_59'],
              orient: 'left',
              range: { min: 0 },
              type: 'linear',
              innerOffset: {
                left: 4,
                right: 4,
                top: 4,
                bottom: 4
              }
            }
          ],
          type: 'scatter',
          data: {
            id: 'col_59'
          },
          scatter: {
            state: {
              selected_reverse: {
                fillOpacity: 0.2
              }
            }
          },
          xField: 'col_56',
          yField: 'col_59',
          line: {
            state: {
              selected_reverse: {
                fill: '#ddd',
                fillOpacity: 0.2
              }
            },
            style: {
              lineWidth: 3
            }
          },
          point: {
            state: {
              selected_reverse: {
                fill: '#ddd',
                fillOpacity: 0.2
              }
            },
            style: {
              size: 8,
              cursor: 'pointer'
            }
          },
          area: {
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

          scales: [
            {
              id: 'col_59',
              type: 'ordinal',
              range: ['#1763FF']
            }
          ],
          markLine: []
        },
        style: {
          padding: 1
        }
      }
    ],
    axes: [
      {
        title: {
          visible: true,
          text: 'ooo'
        },
        // seriesId: ['col_57','col_59'],
        range: { min: 0 },
        orient: 'bottom',
        label: { visible: true },
        type: 'linear',
        innerOffset: {
          left: 4,
          right: 4,
          top: 4,
          bottom: 4
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
        borderLineWidth: [1, 0, 1, 1],
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
