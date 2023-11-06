/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';

const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
export function createTable() {
  const option = {
    widthMode: 'adaptive',
    heightMode: 'adaptive',
    columnTree: [
      {
        dimensionKey: '231106164950110',
        value: 'BPO'
      },
      {
        dimensionKey: '231106164950110',
        value: 'OSP'
      },
      {
        dimensionKey: '231106164950110',
        value: '产业园'
      },
      {
        dimensionKey: '231106164950110',
        value: '校企'
      },
      {
        dimensionKey: '231106164950110',
        value: '自建'
      }
    ],
    rowTree: [],
    columns: [
      {
        dimensionKey: '231106164950110',
        title: '一级部门'
      }
    ],
    rows: [],
    axes: [
      {
        type: 'band',
        tick: {
          visible: false
        },
        grid: {
          visible: false,
          style: {
            zIndex: 150,
            stroke: '#DADCDD',
            lineWidth: 1,
            lineDash: [4, 2]
          }
        },
        orient: 'bottom',
        visible: true,
        domainLine: {
          visible: true,
          style: {
            lineWidth: 1,
            stroke: '#989999'
          }
        },
        title: {
          visible: false,
          space: 5,
          text: '一级部门',
          style: {
            fontSize: 12,
            fill: '#363839',
            fontWeight: 'normal'
          }
        },
        sampling: false,
        zIndex: 200,
        label: {
          visible: true,
          space: 4,
          style: {
            fontSize: 12,
            fill: '#6F6F6F',
            angle: 0,
            fontWeight: 'normal',
            direction: 'horizontal',
            maxLineWidth: 174
          },
          autoHide: true,
          autoHideMethod: 'greedy',
          flush: true
        },
        hover: true,
        background: {
          visible: true,
          state: {
            hover: {
              fillOpacity: 0.08,
              fill: '#141414'
            },
            hover_reverse: {
              fillOpacity: 0.08,
              fill: '#141414'
            }
          }
        },
        paddingInner: [0.15, 0.1],
        paddingOuter: [0.075, 0.1]
      },
      {
        type: 'linear',
        tick: {
          visible: false,
          tickMode: 'd3',
          style: {
            stroke: 'rgba(255, 255, 255, 0)'
          }
        },
        niceType: 'accurateFirst',
        zIndex: 200,
        grid: {
          visible: true,
          style: {
            zIndex: 150,
            stroke: '#DADCDD',
            lineWidth: 1,
            lineDash: [4, 2]
          }
        },
        orient: 'left',
        visible: true,
        domainLine: {
          visible: true,
          style: {
            lineWidth: 1,
            stroke: 'rgba(255, 255, 255, 0)'
          }
        },
        title: {
          visible: false,
          text: '认证人数',
          space: 8,
          style: {
            fontSize: 12,
            fill: '#363839',
            fontWeight: 'normal'
          }
        },
        sampling: false,
        label: {
          visible: true,
          space: 6,
          flush: true,
          padding: 0,
          style: {
            fontSize: 12,
            maxLineWidth: 174,
            fill: '#6F6F6F',
            angle: 0,
            fontWeight: 'normal',
            dy: -1,
            direction: 'horizontal'
          },
          autoHide: true,
          autoHideMethod: 'greedy'
        },
        hover: true,
        background: {
          visible: true,
          state: {
            hover: {
              fillOpacity: 0.08,
              fill: '#141414'
            },
            hover_reverse: {
              fillOpacity: 0.08,
              fill: '#141414'
            }
          }
        },
        zero: true,
        nice: true
      }
    ],
    indicators: [
      {
        indicatorKey: '10002',
        title: '',
        width: 'auto',
        cellType: 'chart',
        chartModule: 'vchart',
        style: {
          padding: [1, 1, 0, 1]
        },
        chartSpec: {
          type: 'bar',
          xField: ['221118151931009', '10001'],
          yField: ['10002'],
          direction: 'vertical',
          sortDataByAxis: true,
          seriesField: '20001',
          padding: 0,
          labelLayout: 'region',
          data: {
            id: 'data',
            fields: {
              '10001': {
                alias: '指标名称 '
              },
              '10002': {
                alias: '指标值 '
              },
              '20001': {
                alias: '图例项 ',
                domain: ['认证人数', '认证率'],
                sortIndex: 0,
                lockStatisticsByDomain: true
              },
              '220919101116764': {
                alias: '认证人数'
              },
              '220919101116771': {
                alias: '认证率'
              },
              '221118151931009': {
                alias: '一级部门',
                domain: ['自建', 'BPO', 'OSP', '校企', '产业园'],
                sortIndex: 0,
                lockStatisticsByDomain: true
              },
              '231106164950110': {
                alias: '一级部门'
              }
            }
          },
          stackInverse: true,
          axes: [
            {
              type: 'band',
              tick: {
                visible: false
              },
              grid: {
                visible: false,
                style: {
                  zIndex: 150,
                  stroke: '#DADCDD',
                  lineWidth: 1,
                  lineDash: [4, 2]
                }
              },
              orient: 'bottom',
              visible: true,
              domainLine: {
                visible: true,
                style: {
                  lineWidth: 1,
                  stroke: '#989999'
                }
              },
              title: {
                visible: false,
                space: 5,
                text: '一级部门',
                style: {
                  fontSize: 12,
                  fill: '#363839',
                  fontWeight: 'normal'
                }
              },
              sampling: false,
              zIndex: 200,
              label: {
                visible: true,
                space: 4,
                style: {
                  fontSize: 12,
                  fill: '#6F6F6F',
                  angle: 0,
                  fontWeight: 'normal',
                  direction: 'horizontal',
                  maxLineWidth: 174
                },
                autoHide: true,
                autoHideMethod: 'greedy',
                flush: true
              },
              hover: false,
              background: {
                visible: true,
                state: {
                  hover: {
                    fillOpacity: 0.08,
                    fill: '#141414'
                  },
                  hover_reverse: {
                    fillOpacity: 0.08,
                    fill: '#141414'
                  }
                }
              },
              paddingInner: [0.15, 0.1],
              paddingOuter: [0.075, 0.1]
            },
            {
              type: 'linear',
              tick: {
                visible: false,
                tickMode: 'd3',
                style: {
                  stroke: 'rgba(255, 255, 255, 0)'
                },
                tickCount: args => {
                  const { axisLength, labelStyle } = args ?? {};
                  const density = 0.2;
                  const tickCount = Math.ceil((axisLength / ((labelStyle?.fontSize ?? 12) * 1.5)) * density);
                  return tickCount < 2 ? 2 : tickCount;
                }
              },
              niceType: 'accurateFirst',
              zIndex: 200,
              grid: {
                visible: true,
                style: {
                  zIndex: 150,
                  stroke: '#DADCDD',
                  lineWidth: 1,
                  lineDash: [4, 2]
                }
              },
              orient: 'left',
              visible: true,
              domainLine: {
                visible: true,
                style: {
                  lineWidth: 1,
                  stroke: 'rgba(255, 255, 255, 0)'
                }
              },
              title: {
                visible: false,
                text: '认证人数',
                space: 8,
                style: {
                  fontSize: 12,
                  fill: '#363839',
                  fontWeight: 'normal'
                }
              },
              sampling: false,
              label: {
                visible: true,
                space: 6,
                flush: true,
                padding: 0,
                style: {
                  fontSize: 30,
                  maxLineWidth: 174,
                  fill: '#6F6F6F',
                  angle: 0,
                  fontWeight: 'normal',
                  dy: -1,
                  direction: 'horizontal'
                },
                autoHide: true,
                autoHideMethod: 'greedy'
              },
              hover: false,
              background: {
                visible: true,
                state: {
                  hover: {
                    fillOpacity: 0.08,
                    fill: '#141414'
                  },
                  hover_reverse: {
                    fillOpacity: 0.08,
                    fill: '#141414'
                  }
                }
              },
              zero: true,
              nice: true
            }
          ],
          color: {
            field: '20001',
            type: 'ordinal',
            range: ['#6690F2', '#70D6A3'],
            specified: {},
            domain: ['认证人数', '认证率']
          },
          label: {
            visible: true,
            offset: 0,
            overlap: {
              hideOnHit: true,
              avoidBaseMark: false,
              strategy: [
                {
                  type: 'position',
                  position: []
                },
                {
                  type: 'moveY',
                  offset: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
                },
                {
                  type: 'moveX',
                  offset: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
                }
              ],
              clampForce: true
            },
            style: {
              fontSize: 12,
              fontWeight: 'normal',
              zIndex: 400,
              fill: null,
              lineWidth: 1,
              strokeOpacity: 1
            },
            position: 'inside',
            smartInvert: {
              fillStrategy: 'invertBase',
              strokeStrategy: 'similarBase',
              outsideEnable: true
            }
          },
          tooltip: {
            handler: {}
          },
          hover: {
            enable: true
          },
          select: {
            enable: true
          },
          bar: {
            state: {
              hover: {
                cursor: 'pointer',
                fillOpacity: 0.8,
                stroke: '#58595B',
                lineWidth: 1,
                zIndex: 500
              },
              selected: {
                cursor: 'pointer',
                fillOpacity: 1,
                stroke: '#58595B',
                lineWidth: 1
              },
              selected_reverse: {
                fillOpacity: 0.3,
                strokeWidth: 0.3
              }
            }
          },
          region: [
            {
              clip: true
            }
          ],
          background: 'rgba(255, 255, 255, 0)',
          animation: false
        }
      }
    ],
    indicatorsAsCol: false,
    records: [
      {
        '10001': '认证人数',
        '10002': '3163',
        '10003': '220919101116764',
        '20001': '认证人数',
        '220919101116764': '3163',
        '221118151931009': 'BPO',
        '231106164950110': 'BPO'
      },
      {
        '10001': '认证率',
        '10002': '0.9771393265369169',
        '10003': '220919101116771',
        '20001': '认证率',
        '220919101116771': '0.9771393265369169',
        '221118151931009': 'BPO',
        '231106164950110': 'BPO'
      },
      {
        '10001': '认证人数',
        '10002': '7697',
        '10003': '220919101116764',
        '20001': '认证人数',
        '220919101116764': '7697',
        '221118151931009': 'OSP',
        '231106164950110': 'OSP'
      },
      {
        '10001': '认证率',
        '10002': '0.9479064039408867',
        '10003': '220919101116771',
        '20001': '认证率',
        '220919101116771': '0.9479064039408867',
        '221118151931009': 'OSP',
        '231106164950110': 'OSP'
      },
      {
        '10001': '认证人数',
        '10002': '983',
        '10003': '220919101116764',
        '20001': '认证人数',
        '220919101116764': '983',
        '221118151931009': '产业园',
        '231106164950110': '产业园'
      },
      {
        '10001': '认证率',
        '10002': '0.9909274193548387',
        '10003': '220919101116771',
        '20001': '认证率',
        '220919101116771': '0.9909274193548387',
        '221118151931009': '产业园',
        '231106164950110': '产业园'
      },
      {
        '10001': '认证人数',
        '10002': '1683',
        '10003': '220919101116764',
        '20001': '认证人数',
        '220919101116764': '1683',
        '221118151931009': '校企',
        '231106164950110': '校企'
      },
      {
        '10001': '认证率',
        '10002': '0.9313779745434422',
        '10003': '220919101116771',
        '20001': '认证率',
        '220919101116771': '0.9313779745434422',
        '221118151931009': '校企',
        '231106164950110': '校企'
      },
      {
        '10001': '认证人数',
        '10002': '965',
        '10003': '220919101116764',
        '20001': '认证人数',
        '220919101116764': '965',
        '221118151931009': '自建',
        '231106164950110': '自建'
      },
      {
        '10001': '认证率',
        '10002': '0.9611553784860558',
        '10003': '220919101116771',
        '20001': '认证率',
        '220919101116771': '0.9611553784860558',
        '221118151931009': '自建',
        '231106164950110': '自建'
      }
    ],
    indicatorTitle: '',
    autoWrapText: true,
    legends: {
      type: 'discrete',
      visible: true,
      id: 'legend-discrete',
      orient: 'top',
      position: 'middle',
      layoutType: 'normal',
      maxRow: 1,
      title: {
        textStyle: {
          fontSize: 12,
          fill: '#6F6F6F'
        }
      },
      layoutLevel: 50,
      item: {
        focus: true,
        focusIconStyle: {
          size: 14
        },
        maxWidth: 400,
        spaceRow: 0,
        spaceCol: 0,
        padding: {
          top: 1,
          bottom: 1,
          left: 1,
          right: 1
        },
        background: {
          visible: false,
          style: {
            fillOpacity: 0.001
          }
        },
        label: {
          style: {
            fontSize: 12,
            fill: '#6F6F6F'
          }
        },
        shape: {
          style: {
            lineWidth: 0,
            symbolType: 'square'
          }
        }
      },
      pager: {
        layout: 'horizontal',
        padding: 0,
        textStyle: {},
        space: 0,
        handler: {
          preShape: 'triangleLeft',
          nextShape: 'triangleRight',
          style: {},
          state: {
            disable: {}
          }
        }
      },
      padding: [0, 0, 16, 0],
      data: [
        {
          label: '认证人数',
          shape: {
            fill: '#6690F2',
            symbolType: 'square'
          }
        },
        {
          label: '认证率',
          shape: {
            fill: '#70D6A3',
            symbolType: 'square'
          }
        }
      ]
    },
    corner: {
      titleOnDimension: 'row'
    },
    defaultHeaderColWidth: ['auto'],
    theme: {
      bodyStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        borderLineWidth: [1, 0, 0, 1],
        padding: 1
      },
      headerStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        fontSize: 12,
        color: '#333333',
        textAlign: 'center',
        borderLineWidth: [0, 0, 1, 1],
        padding: [4, 0, 4, 0],
        hover: {
          cellBgColor: '#eceded'
        }
      },
      rowHeaderStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        fontSize: 12,
        color: '#333333',
        padding: [0, 0, 0, 4],
        borderLineWidth: [1, 1, 0, 0],
        hover: {
          cellBgColor: '#eceded'
        }
      },
      cornerHeaderStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        textAlign: 'center',
        fontSize: 12,
        color: '#333333',
        fontWeight: 'bold',
        borderLineWidth: [0, 1, 1, 0],
        padding: 0,
        hover: {
          cellBgColor: ''
        }
      },
      cornerRightTopCellStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        borderLineWidth: [0, 0, 1, 1],
        padding: 0,
        hover: {
          cellBgColor: ''
        }
      },
      cornerLeftBottomCellStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        borderLineWidth: [1, 0, 0, 0],
        hover: {
          cellBgColor: ''
        }
      },
      cornerRightBottomCellStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        borderLineWidth: [1, 0, 0, 1],
        hover: {
          cellBgColor: ''
        }
      },
      rightFrozenStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        borderLineWidth: [1, 0, 1, 1],
        hover: {
          cellBgColor: '#eceded'
        }
      },
      bottomFrozenStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        borderLineWidth: [1, 0, 0, 1],
        padding: 0,
        hover: {
          cellBgColor: '#eceded'
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
    hash: 'c75441de48e0655606078ce17831b3a6'
  };
  const tableInstance = new VTable.PivotChart(document.getElementById(CONTAINER_ID), option);
  // tableInstance.onVChartEvent('click', args => {
  //   console.log('listenChart click', args);
  // });
  // tableInstance.onVChartEvent('mouseover', args => {
  //   console.log('listenChart mouseover', args);
  // });
  window.tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, {});
}
