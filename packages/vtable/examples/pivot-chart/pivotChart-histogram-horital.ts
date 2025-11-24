/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
export function createTable() {
  const option = {
    chartDimensionLinkage: {
      showTooltip: true,
      heightLimitToShowTooltipForLastRow: 60,
      widthLimitToShowTooltipForLastColumn: 90,
      labelHoverOnAxis: {
        left: {
          visible: true,
          background: {
            visible: true,
            style: {
              fill: '#364159'
            }
          },
          textStyle: {
            fill: '#ffffff'
          }
        }
      }
    },
    animation: true,
    rows: [
      {
        dimensionKey: 'color',
        title: 'color'
      }
    ],
    columns: [
      {
        dimensionKey: 'shape',
        title: 'shape'
      }
    ],
    indicators: [
      {
        indicatorKey: 'v',
        title: 'v',
        cellType: 'chart',
        chartModule: 'vchart',
        chartSpec: {
          direction: 'horizontal',
          type: 'histogram',
          yField: '__BinStart__',
          y2Field: '__BinEnd__',
          xField: '__MeaValue__',
          padding: 0,
          region: [
            {
              clip: true
            }
          ],
          legends: {
            visible: false
          },
          barGap: 2,
          animation: true,
          color: {
            type: 'ordinal',
            domain: ['v'],
            range: [
              '#8D72F6',
              '#5766EC',
              '#66A3FE',
              '#51D5E6',
              '#4EC0B3',
              '#F9DF90',
              '#F9AD71',
              '#ED8888',
              '#E9A0C3',
              '#D77DD3'
            ]
          },
          background: 'transparent',
          data: {
            id: 'v',
            fields: {}
          },
          large: false,
          largeThreshold: null,
          progressiveStep: 400,
          progressiveThreshold: null,
          axes: [
            {
              visible: true,
              type: 'linear',
              base: 10,
              orient: 'bottom',
              nice: true,
              zero: true,
              inverse: false,
              label: {
                space: 8,
                visible: true,
                style: {
                  fill: '#BCC1CB',
                  angle: 0,
                  fontSize: 12,
                  fontWeight: 400
                }
              },
              title: {
                visible: false,
                text: '',
                style: {
                  fill: '#606773',
                  fontSize: 12,
                  fontWeight: 400
                }
              },
              tick: {
                visible: false,
                tickSize: 4,
                inside: false,
                style: {
                  stroke: '#21252C'
                }
              },
              grid: {
                visible: true,
                style: {
                  lineWidth: 0.5,
                  stroke: '#F0F1F6',
                  lineDash: [4, 2]
                }
              },
              domainLine: {
                visible: false
              },
              innerOffset: {
                right: 12
              }
            },
            {
              visible: true,
              type: 'linear',
              base: 10,
              orient: 'left',
              nice: true,
              zero: true,
              inverse: false,
              label: {
                space: 8,
                visible: true,
                style: {
                  fill: '#BCC1CB',
                  angle: 0,
                  fontSize: 12,
                  fontWeight: 400
                }
              },
              title: {
                visible: false,
                text: '',
                style: {
                  fill: '#606773',
                  fontSize: 12,
                  fontWeight: 400
                }
              },
              tick: {
                visible: false,
                tickSize: 4,
                inside: false,
                style: {
                  stroke: '#21252C'
                }
              },
              grid: {
                visible: true,
                style: {
                  lineWidth: 0.5,
                  stroke: '#F0F1F6',
                  lineDash: [4, 2]
                }
              },
              domainLine: {
                visible: false
              },
              innerOffset: {
                top: 12
              }
            },
            {
              visible: true,
              orient: 'right',
              type: 'linear',
              base: 10,
              zero: true,
              domainLine: {
                visible: false
              },
              grid: {
                visible: false
              },
              tick: {
                visible: false,
                tickSize: 4,
                inside: false,
                style: {
                  stroke: '#21252C'
                }
              },
              title: {
                visible: false,
                text: 'ECDF',
                style: {
                  fill: '#606773',
                  fontSize: 12,
                  fontWeight: 400
                }
              },
              label: {
                space: 8,
                visible: true,
                style: {
                  fill: '#BCC1CB',
                  angle: 0,
                  fontSize: 12,
                  fontWeight: 400
                }
              }
            }
          ],
          label: {
            visible: true,
            style: {
              stroke: '#fff'
            },
            smartInvert: false,
            overlap: {
              hideOnHit: true,
              clampForce: true
            }
          },
          tooltip: {
            style: {
              panel: {
                padding: 7,
                border: {
                  radius: 12,
                  width: 1,
                  color: '#e3e5e8'
                },
                backgroundColor: '#fff'
              },
              keyLabel: {
                lineHeight: 12,
                fontSize: 12,
                fontColor: '#606773'
              },
              valueLabel: {
                lineHeight: 12,
                fontSize: 12,
                fontColor: '#21252c',
                fontWeight: 'medium'
              },
              titleLabel: {
                fontSize: 12,
                lineHeight: 12,
                fontColor: '#21252c',
                fontWeight: 'bold'
              }
            },
            visible: true,
            mark: {
              title: {
                visible: false
              },
              content: [
                {
                  visible: true,
                  hasShape: true,
                  shapeType: 'rectRound',
                  key: 'color'
                },
                {
                  visible: true,
                  hasShape: true,
                  shapeType: 'rectRound',
                  key: 'shape'
                },
                [
                  {
                    visible: true,
                    hasShape: true,
                    shapeType: 'rectRound'
                  }
                ]
              ]
            },
            dimension: {
              title: {
                visible: false
              },
              content: [
                {
                  visible: true,
                  hasShape: true,
                  shapeType: 'rectRound',
                  key: 'color'
                },
                {
                  visible: true,
                  hasShape: true,
                  shapeType: 'rectRound',
                  key: 'shape'
                },
                [
                  {
                    visible: true,
                    hasShape: true,
                    shapeType: 'rectRound'
                  }
                ]
              ]
            }
          },
          bar: {
            style: {
              visible: true,
              fillOpacity: 1,
              lineWidth: 1
            },
            state: {
              hover: {
                fillOpacity: 0.6
              }
            }
          },
          crosshair: {
            yField: {
              visible: true,
              line: {
                type: 'rect',
                style: {
                  lineWidth: 0,
                  opacity: 0.2,
                  fill: '#3641594d'
                }
              },
              label: {
                visible: true,
                labelBackground: {
                  visible: true,
                  style: {
                    fill: '#364159'
                  }
                },
                style: {
                  fill: '#ffffff'
                }
              }
            }
          },
          customMark: [
            {
              type: 'group',
              interactive: false,
              zIndex: 500,
              name: 'ecdfRegressionLine-0',
              style: {},
              children: [
                {
                  type: 'line',
                  interactive: false,
                  zIndex: 500,
                  style: {
                    lineWidth: 2,
                    stroke: 'red'
                  }
                }
              ]
            }
          ]
        },
        style: {
          padding: [1, 1, 0, 1]
        }
      }
    ],
    records: {
      v: [
        {
          __BinStart__: 2,
          __BinEnd__: 3,
          __BinCount__: 0,
          __MeaId__: 'v',
          color: 'red',
          shape: 'circle',
          __BinPercentage__: 0.1111111111111111,
          __MeaName__: 'v',
          __MeaValue__: 0,
          v: 0,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 1,
          __BinEnd__: 2,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'red',
          shape: 'circle',
          __BinPercentage__: 0.1111111111111111,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 3,
          __BinEnd__: 4,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'red',
          shape: 'circle',
          __BinPercentage__: 0.1111111111111111,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 4,
          __BinEnd__: 5,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'red',
          shape: 'circle',
          __BinPercentage__: 0.1111111111111111,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 5,
          __BinEnd__: 6,
          __BinCount__: 2,
          __MeaId__: 'v',
          color: 'red',
          shape: 'circle',
          __BinPercentage__: 0.2222222222222222,
          __MeaName__: 'v',
          __MeaValue__: 2,
          v: 2,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 6,
          __BinEnd__: 7,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'red',
          shape: 'circle',
          __BinPercentage__: 0.1111111111111111,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 7,
          __BinEnd__: 8,
          __BinCount__: 2,
          __MeaId__: 'v',
          color: 'red',
          shape: 'circle',
          __BinPercentage__: 0.2222222222222222,
          __MeaName__: 'v',
          __MeaValue__: 2,
          v: 2,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 10,
          __BinEnd__: 11,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'red',
          shape: 'circle',
          __BinPercentage__: 0.1111111111111111,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 2,
          __BinEnd__: 3,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'blue',
          shape: 'circle',
          __BinPercentage__: 0.125,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 3,
          __BinEnd__: 4,
          __BinCount__: 2,
          __MeaId__: 'v',
          color: 'blue',
          shape: 'circle',
          __BinPercentage__: 0.25,
          __MeaName__: 'v',
          __MeaValue__: 2,
          v: 2,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 4,
          __BinEnd__: 5,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'blue',
          shape: 'circle',
          __BinPercentage__: 0.125,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 5,
          __BinEnd__: 6,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'blue',
          shape: 'circle',
          __BinPercentage__: 0.125,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 7,
          __BinEnd__: 8,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'blue',
          shape: 'circle',
          __BinPercentage__: 0.125,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 9,
          __BinEnd__: 10,
          __BinCount__: 2,
          __MeaId__: 'v',
          color: 'blue',
          shape: 'circle',
          __BinPercentage__: 0.25,
          __MeaName__: 'v',
          __MeaValue__: 2,
          v: 2,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 1,
          __BinEnd__: 2,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'red',
          shape: 'triangle',
          __BinPercentage__: 0.125,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 2,
          __BinEnd__: 3,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'red',
          shape: 'triangle',
          __BinPercentage__: 0.125,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 3,
          __BinEnd__: 4,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'red',
          shape: 'triangle',
          __BinPercentage__: 0.125,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 4,
          __BinEnd__: 5,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'red',
          shape: 'triangle',
          __BinPercentage__: 0.125,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 5,
          __BinEnd__: 6,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'red',
          shape: 'triangle',
          __BinPercentage__: 0.125,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 7,
          __BinEnd__: 8,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'red',
          shape: 'triangle',
          __BinPercentage__: 0.125,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 8,
          __BinEnd__: 9,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'red',
          shape: 'triangle',
          __BinPercentage__: 0.125,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 9,
          __BinEnd__: 10,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'red',
          shape: 'triangle',
          __BinPercentage__: 0.125,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 2,
          __BinEnd__: 3,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'blue',
          shape: 'triangle',
          __BinPercentage__: 0.125,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 3,
          __BinEnd__: 4,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'blue',
          shape: 'triangle',
          __BinPercentage__: 0.125,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 4,
          __BinEnd__: 5,
          __BinCount__: 2,
          __MeaId__: 'v',
          color: 'blue',
          shape: 'triangle',
          __BinPercentage__: 0.25,
          __MeaName__: 'v',
          __MeaValue__: 2,
          v: 2,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 5,
          __BinEnd__: 6,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'blue',
          shape: 'triangle',
          __BinPercentage__: 0.125,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 7,
          __BinEnd__: 8,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'blue',
          shape: 'triangle',
          __BinPercentage__: 0.125,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 8,
          __BinEnd__: 9,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'blue',
          shape: 'triangle',
          __BinPercentage__: 0.125,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        },
        {
          __BinStart__: 9,
          __BinEnd__: 10,
          __BinCount__: 1,
          __MeaId__: 'v',
          color: 'blue',
          shape: 'triangle',
          __BinPercentage__: 0.125,
          __MeaName__: 'v',
          __MeaValue__: 1,
          v: 1,
          __Dim_Color__: 'v',
          __Dim_Detail__: 'v',
          __Dim_ColorId__: 'v'
        }
      ]
    },
    widthMode: 'standard',
    autoFillWidth: true,
    defaultHeaderColWidth: 'auto',
    defaultColWidth: 200,
    heightMode: 'standard',
    autoFillHeight: true,
    defaultRowHeight: 100,
    defaultHeaderRowHeight: 'auto',
    indicatorsAsCol: true,
    select: {
      highlightMode: 'cell',
      headerSelectMode: 'inline'
    },
    hover: {
      highlightMode: 'cross'
    },
    tooltip: {
      isShowOverflowTextTooltip: true
    },
    corner: {
      titleOnDimension: 'row'
    },
    animationAppear: {
      duration: 600,
      type: 'all',
      direction: 'row'
    },
    theme: {
      underlayBackgroundColor: 'rgba(0,0,0,0)',
      bodyStyle: {
        borderColor: '#e3e5eb',
        color: '#141414',
        bgColor: 'rgba(0,0,0,0)',
        hover: {
          cellBgColor: 'transparent'
        }
      },
      headerStyle: {
        borderColor: '#e3e5eb',
        fontSize: 12,
        color: '#21252c',
        textAlign: 'center',
        bgColor: 'transparent',
        hover: {
          cellBgColor: '#D9DDE4',
          inlineRowBgColor: '#D9DDE455',
          inlineColumnBgColor: '#D9DDE455'
        }
      },
      rowHeaderStyle: {
        borderColor: '#e3e5eb',
        fontSize: 12,
        color: '#21252c',
        padding: [0, 12, 0, 4],
        bgColor: 'transparent',
        hover: {
          cellBgColor: '#D9DDE4',
          inlineRowBgColor: '#D9DDE455',
          inlineColumnBgColor: '#D9DDE455'
        }
      },
      cornerHeaderStyle: {
        borderColor: '#e3e5eb',
        textAlign: 'center',
        fontSize: 12,
        color: '#21252c',
        padding: [0, 12, 0, 4],
        fontWeight: 'bold',
        borderLineWidth: [0, 1, 1, 0],
        bgColor: 'transparent',
        frameStyle: {
          borderColor: '#e3e5eb'
        },
        hover: {
          cellBgColor: '#D9DDE4',
          inlineRowBgColor: '#D9DDE455',
          inlineColumnBgColor: '#D9DDE455'
        }
      },
      cornerLeftBottomCellStyle: {
        borderColor: '#e3e5eb',
        borderLineWidth: [0, 0, 0, 0],
        bgColor: 'transparent',
        frameStyle: {
          borderColor: '#e3e5eb',
          borderLineWidth: [1, 0, 0, 0]
        },
        hover: {
          cellBgColor: '#D9DDE4'
        }
      },
      cornerRightTopCellStyle: {
        borderColor: '#e3e5eb',
        borderLineWidth: [0, 0, 1, 1],
        frameStyle: {
          borderColor: '#e3e5eb',
          borderLineWidth: 0
        },
        bgColor: 'transparent',
        hover: {
          cellBgColor: '#D9DDE4'
        }
      },
      rightFrozenStyle: {
        borderColor: '#e3e5eb',
        bgColor: 'transparent',
        frameStyle: {
          borderLineWidth: 0
        },
        hover: {
          borderLineWidth: 0,
          cellBgColor: '#D9DDE4'
        }
      },
      cornerRightBottomCellStyle: {
        borderColor: '#e3e5eb',
        bgColor: 'transparent',
        borderLineWidth: [1, 0, 0, 1],
        frameStyle: {
          borderColor: '#e3e5eb',
          borderLineWidth: [1, 0, 0, 1]
        },
        hover: {
          cellBgColor: '#D9DDE4'
        }
      },
      bottomFrozenStyle: {
        borderColor: '#e3e5eb',
        borderLineWidth: [1, 0, 0, 1],
        bgColor: 'transparent',
        hover: {
          cellBgColor: '#D9DDE4'
        }
      },
      selectionStyle: {
        cellBgColor: '',
        cellBorderColor: ''
      },
      frameStyle: {
        borderColor: '#e3e5eb',
        cornerRadius: 0,
        borderLineWidth: 0
      }
    },
    title: {
      text: 'shape',
      align: 'center',
      orient: 'top',
      padding: [2, 0, 0, 0],
      textStyle: {
        fontSize: 12,
        fill: '#21252c',
        fontWeight: 'bold'
      }
    },
    legends: {
      padding: 0,
      visible: false,
      type: 'discrete',
      orient: 'right',
      position: 'start',
      maxCol: 1,
      maxRow: 1,
      data: [
        {
          label: 'v',
          shape: {
            outerBorder: {
              stroke: '#8D72F6',
              distance: 3,
              lineWidth: 1
            },
            fill: '#8D72F6'
          }
        }
      ],
      item: {
        focus: true,
        maxWidth: '30%',
        focusIconStyle: {
          size: 14,
          fill: '#606773',
          fontWeight: 400
        },
        shape: {
          space: 6,
          style: {
            symbolType: 'rectRound',
            size: 8
          }
        },
        label: {
          style: {
            fontSize: 12,
            fill: '#606773',
            fontWeight: 400
          }
        },
        background: {
          state: {
            selectedHover: {
              fill: '#606773',
              fillOpacity: 0.05
            }
          }
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

  bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });

  window.update = () => {
    theme.cornerLeftBottomCellStyle.borderColor = 'red';
    tableInstance.updateTheme(theme);
  };
}
