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
    columnTree: [],
    rowTree: [
      {
        dimensionKey: '220919101116786',
        value: '业务标签'
      },
      {
        dimensionKey: '220919101116786',
        value: '语言标签'
      },
      {
        dimensionKey: '220919101116786',
        value: '平台工具标签'
      },
      {
        dimensionKey: '220919101116786',
        value: '垂类知识标签'
      }
    ],
    columns: [],
    rows: [
      {
        dimensionKey: '220919101116786',
        title: '一级标签'
      }
    ],
    axes: [
      {
        id: 'dimensionAxis',
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
        id: 'measureAxisLeft',
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
          visible: false,
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
        expand: {
          max: 0.027
        },
        zero: true,
        nice: true,
        seriesId: 'mainSeries'
      },
      {
        id: 'measureAxisRight',
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
          visible: false,
          style: {
            zIndex: 150,
            stroke: '#DADCDD',
            lineWidth: 1,
            lineDash: [4, 2]
          }
        },
        orient: 'right',
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
          text: '认证率',
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
        expand: {
          max: 0.027
        },
        zero: true,
        nice: true,
        seriesId: 'subSeries',
        sync: {
          axisId: 'measureAxisLeft',
          zeroAlign: true
        }
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
          type: 'common',
          region: [
            {
              clip: true
            }
          ],
          series: [
            {
              id: 'mainSeries',
              type: 'bar',
              xField: ['221118151931009', '10001'],
              yField: '10011',
              zIndex: 200,
              seriesField: '20001',
              data: {
                id: 'mainSeriesData',
                values: [],
                fields: {
                  '10001': {
                    alias: '指标名称 '
                  },
                  '10011': {
                    alias: '指标值(主轴) '
                  },
                  '10012': {
                    alias: '指标值(次轴) '
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
                  '220919101116786': {
                    alias: '一级标签'
                  },
                  '221118151931009': {
                    alias: '一级部门',
                    domain: ['自建', 'BPO', 'OSP', '校企', '产业园'],
                    sortIndex: 0,
                    lockStatisticsByDomain: true
                  }
                }
              },
              stackInverse: true,
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
              line: {
                style: {
                  curveType: {
                    type: 'ordinal',
                    field: '20001',
                    range: ['linear'],
                    domain: ['认证人数', '认证率']
                  },
                  lineWidth: {
                    type: 'ordinal',
                    field: '20001',
                    range: [3],
                    domain: ['认证人数', '认证率']
                  },
                  lineDash: {
                    type: 'ordinal',
                    field: '20001',
                    range: [[0, 0]],
                    domain: ['认证人数', '认证率']
                  }
                }
              },
              area: {
                style: {
                  fillOpacity: 0.35
                },
                visible: true
              },
              point: {
                style: {
                  shape: {
                    type: 'ordinal',
                    field: '20001',
                    range: ['circle'],
                    domain: ['认证人数', '认证率']
                  },
                  size: {
                    type: 'ordinal',
                    field: '20001',
                    range: [7.0898154036220635],
                    domain: ['认证人数', '认证率']
                  },
                  stroke: {
                    field: '20001',
                    type: 'ordinal',
                    range: ['#6690F2', '#70D6A3'],
                    specified: {},
                    domain: ['认证人数', '认证率']
                  },
                  strokeOpacity: {
                    type: 'ordinal',
                    field: '20001',
                    range: [1],
                    domain: ['认证人数', '认证率']
                  },
                  fillOpacity: {
                    type: 'ordinal',
                    field: '20001',
                    range: [1],
                    domain: ['认证人数', '认证率']
                  }
                },
                state: {
                  hover: {
                    lineWidth: 2,
                    fillOpacity: 1,
                    strokeOpacity: 1,
                    scaleX: 1.5,
                    scaleY: 1.5
                  }
                }
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
              invalidType: 'break',
              seriesMark: 'line',
              region: [
                {
                  clip: true
                }
              ],
              background: 'rgba(255, 255, 255, 0)',
              animation: false
            },
            {
              id: 'subSeries',
              type: 'line',
              xField: '221118151931009',
              yField: '10012',
              zIndex: 300,
              seriesField: '20001',
              data: {
                id: 'subSeriesData',
                values: [],
                fields: {
                  '10001': {
                    alias: '指标名称 '
                  },
                  '10011': {
                    alias: '指标值(主轴) '
                  },
                  '10012': {
                    alias: '指标值(次轴) '
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
                  '220919101116786': {
                    alias: '一级标签'
                  },
                  '221118151931009': {
                    alias: '一级部门',
                    domain: ['自建', 'BPO', 'OSP', '校企', '产业园'],
                    sortIndex: 0,
                    lockStatisticsByDomain: true
                  }
                }
              },
              stackInverse: true,
              label: {
                visible: true,
                offset: 0,
                overlap: {
                  hideOnHit: true,
                  avoidBaseMark: false,
                  strategy: [
                    {
                      type: 'position',
                      position: ['top', 'bottom']
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
                  fill: '#363839',
                  stroke: 'rgba(255, 255, 255, 0.8)',
                  lineWidth: 1,
                  strokeOpacity: 1
                },
                position: 'top',
                smartInvert: false
              },
              line: {
                style: {
                  curveType: {
                    type: 'ordinal',
                    field: '20001',
                    range: ['linear'],
                    domain: ['认证人数', '认证率']
                  },
                  lineWidth: {
                    type: 'ordinal',
                    field: '20001',
                    range: [3],
                    domain: ['认证人数', '认证率']
                  },
                  lineDash: {
                    type: 'ordinal',
                    field: '20001',
                    range: [[0, 0]],
                    domain: ['认证人数', '认证率']
                  }
                }
              },
              area: {
                style: {
                  fillOpacity: 0.35
                },
                visible: true
              },
              point: {
                style: {
                  shape: {
                    type: 'ordinal',
                    field: '20001',
                    range: ['circle'],
                    domain: ['认证人数', '认证率']
                  },
                  size: {
                    type: 'ordinal',
                    field: '20001',
                    range: [7.0898154036220635],
                    domain: ['认证人数', '认证率']
                  },
                  stroke: {
                    field: '20001',
                    type: 'ordinal',
                    range: ['#6690F2', '#70D6A3'],
                    specified: {},
                    domain: ['认证人数', '认证率']
                  },
                  strokeOpacity: {
                    type: 'ordinal',
                    field: '20001',
                    range: [1],
                    domain: ['认证人数', '认证率']
                  },
                  fillOpacity: {
                    type: 'ordinal',
                    field: '20001',
                    range: [1],
                    domain: ['认证人数', '认证率']
                  }
                },
                state: {
                  hover: {
                    lineWidth: 2,
                    fillOpacity: 1,
                    strokeOpacity: 1,
                    scaleX: 1.5,
                    scaleY: 1.5
                  }
                }
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
              invalidType: 'break',
              seriesMark: 'line',
              region: [
                {
                  clip: true
                }
              ],
              background: 'rgba(255, 255, 255, 0)',
              animation: false
            }
          ],
          padding: 0,
          labelLayout: 'region',
          data: {
            id: 'data',
            fields: {
              '10001': {
                alias: '指标名称 '
              },
              '10011': {
                alias: '指标值(主轴) '
              },
              '10012': {
                alias: '指标值(次轴) '
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
              '220919101116786': {
                alias: '一级标签'
              },
              '221118151931009': {
                alias: '一级部门',
                domain: ['自建', 'BPO', 'OSP', '校企', '产业园'],
                sortIndex: 0,
                lockStatisticsByDomain: true
              }
            }
          },
          stackInverse: true,
          axes: [
            {
              id: 'dimensionAxis',
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
              id: 'measureAxisLeft',
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
                visible: false,
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
              // "expand": {
              //     "max": 0.027
              // },
              zero: true,
              nice: true,
              seriesId: 'mainSeries'
            },
            {
              id: 'measureAxisRight',
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
                visible: false,
                style: {
                  zIndex: 150,
                  stroke: '#DADCDD',
                  lineWidth: 1,
                  lineDash: [4, 2]
                }
              },
              orient: 'right',
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
                text: '认证率',
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
              // "expand": {
              //     "max": 0.027
              // },
              zero: true,
              nice: true,
              seriesId: 'subSeries',
              sync: {
                axisId: 'measureAxisLeft',
                zeroAlign: true
              }
            }
          ],
          seriesField: '20001',
          color: {
            field: '20001',
            type: 'ordinal',
            range: ['#6690F2', '#70D6A3'],
            specified: {},
            domain: ['认证人数', '认证率']
          },
          tooltip: {
            handler: {}
          },
          crosshair: {
            xField: {
              visible: true
            },
            gridZIndex: 100
          },
          background: 'rgba(255, 255, 255, 0)'
        }
      }
    ],
    indicatorsAsCol: false,
    records: [
      {
        '10001': '认证人数',
        '10003': '220919101116764',
        '10011': '955',
        '20001': '认证人数',
        '220919101116764': '955',
        '220919101116786': '业务标签',
        '221118151931009': '自建'
      },
      {
        '10001': '认证人数',
        '10003': '220919101116764',
        '10011': '2926',
        '20001': '认证人数',
        '220919101116764': '2926',
        '220919101116786': '业务标签',
        '221118151931009': 'BPO'
      },
      {
        '10001': '认证人数',
        '10003': '220919101116764',
        '10011': '3620',
        '20001': '认证人数',
        '220919101116764': '3620',
        '220919101116786': '业务标签',
        '221118151931009': 'OSP'
      },
      {
        '10001': '认证人数',
        '10003': '220919101116764',
        '10011': '765',
        '20001': '认证人数',
        '220919101116764': '765',
        '220919101116786': '业务标签',
        '221118151931009': '校企'
      },
      {
        '10001': '认证人数',
        '10003': '220919101116764',
        '10011': '791',
        '20001': '认证人数',
        '220919101116764': '791',
        '220919101116786': '业务标签',
        '221118151931009': '产业园'
      },
      {
        '10001': '认证率',
        '10003': '220919101116771',
        '10012': '0.9705284552845529',
        '20001': '认证率',
        '220919101116771': '0.9705284552845529',
        '220919101116786': '业务标签',
        '221118151931009': '自建'
      },
      {
        '10001': '认证率',
        '10003': '220919101116771',
        '10012': '0.906162898730257',
        '20001': '认证率',
        '220919101116771': '0.906162898730257',
        '220919101116786': '业务标签',
        '221118151931009': 'BPO'
      },
      {
        '10001': '认证率',
        '10003': '220919101116771',
        '10012': '0.5045296167247387',
        '20001': '认证率',
        '220919101116771': '0.5045296167247387',
        '220919101116786': '业务标签',
        '221118151931009': 'OSP'
      },
      {
        '10001': '认证率',
        '10003': '220919101116771',
        '10012': '0.47752808988764045',
        '20001': '认证率',
        '220919101116771': '0.47752808988764045',
        '220919101116786': '业务标签',
        '221118151931009': '校企'
      },
      {
        '10001': '认证率',
        '10003': '220919101116771',
        '10012': '0.7997977755308392',
        '20001': '认证率',
        '220919101116771': '0.7997977755308392',
        '220919101116786': '业务标签',
        '221118151931009': '产业园'
      },
      {
        '10001': '认证人数',
        '10003': '220919101116764',
        '10011': '769',
        '20001': '认证人数',
        '220919101116764': '769',
        '220919101116786': '语言标签',
        '221118151931009': '自建'
      },
      {
        '10001': '认证人数',
        '10003': '220919101116764',
        '10011': '2788',
        '20001': '认证人数',
        '220919101116764': '2788',
        '220919101116786': '语言标签',
        '221118151931009': 'BPO'
      },
      {
        '10001': '认证人数',
        '10003': '220919101116764',
        '10011': '4006',
        '20001': '认证人数',
        '220919101116764': '4006',
        '220919101116786': '语言标签',
        '221118151931009': 'OSP'
      },
      {
        '10001': '认证人数',
        '10003': '220919101116764',
        '10011': '1025',
        '20001': '认证人数',
        '220919101116764': '1025',
        '220919101116786': '语言标签',
        '221118151931009': '校企'
      },
      {
        '10001': '认证人数',
        '10003': '220919101116764',
        '10011': '815',
        '20001': '认证人数',
        '220919101116764': '815',
        '220919101116786': '语言标签',
        '221118151931009': '产业园'
      },
      {
        '10001': '认证率',
        '10003': '220919101116771',
        '10012': '0.7807106598984772',
        '20001': '认证率',
        '220919101116771': '0.7807106598984772',
        '220919101116786': '语言标签',
        '221118151931009': '自建'
      },
      {
        '10001': '认证率',
        '10003': '220919101116771',
        '10012': '0.8612913191226444',
        '20001': '认证率',
        '220919101116771': '0.8612913191226444',
        '220919101116786': '语言标签',
        '221118151931009': 'BPO'
      },
      {
        '10001': '认证率',
        '10003': '220919101116771',
        '10012': '0.5080532656943564',
        '20001': '认证率',
        '220919101116771': '0.5080532656943564',
        '220919101116786': '语言标签',
        '221118151931009': 'OSP'
      },
      {
        '10001': '认证率',
        '10003': '220919101116771',
        '10012': '0.5694444444444444',
        '20001': '认证率',
        '220919101116771': '0.5694444444444444',
        '220919101116786': '语言标签',
        '221118151931009': '校企'
      },
      {
        '10001': '认证率',
        '10003': '220919101116771',
        '10012': '0.8240647118301314',
        '20001': '认证率',
        '220919101116771': '0.8240647118301314',
        '220919101116786': '语言标签',
        '221118151931009': '产业园'
      },
      {
        '10001': '认证人数',
        '10003': '220919101116764',
        '10011': '814',
        '20001': '认证人数',
        '220919101116764': '814',
        '220919101116786': '平台工具标签',
        '221118151931009': '自建'
      },
      {
        '10001': '认证人数',
        '10003': '220919101116764',
        '10011': '2852',
        '20001': '认证人数',
        '220919101116764': '2852',
        '220919101116786': '平台工具标签',
        '221118151931009': 'BPO'
      },
      {
        '10001': '认证人数',
        '10003': '220919101116764',
        '10011': '7600',
        '20001': '认证人数',
        '220919101116764': '7600',
        '220919101116786': '平台工具标签',
        '221118151931009': 'OSP'
      },
      {
        '10001': '认证人数',
        '10003': '220919101116764',
        '10011': '1664',
        '20001': '认证人数',
        '220919101116764': '1664',
        '220919101116786': '平台工具标签',
        '221118151931009': '校企'
      },
      {
        '10001': '认证人数',
        '10003': '220919101116764',
        '10011': '983',
        '20001': '认证人数',
        '220919101116764': '983',
        '220919101116786': '平台工具标签',
        '221118151931009': '产业园'
      },
      {
        '10001': '认证率',
        '10003': '220919101116771',
        '10012': '0.8107569721115537',
        '20001': '认证率',
        '220919101116771': '0.8107569721115537',
        '220919101116786': '平台工具标签',
        '221118151931009': '自建'
      },
      {
        '10001': '认证率',
        '10003': '220919101116771',
        '10012': '0.8810627123880136',
        '20001': '认证率',
        '220919101116771': '0.8810627123880136',
        '220919101116786': '平台工具标签',
        '221118151931009': 'BPO'
      },
      {
        '10001': '认证率',
        '10003': '220919101116771',
        '10012': '0.9365372766481824',
        '20001': '认证率',
        '220919101116771': '0.9365372766481824',
        '220919101116786': '平台工具标签',
        '221118151931009': 'OSP'
      },
      {
        '10001': '认证率',
        '10003': '220919101116771',
        '10012': '0.922906267332224',
        '20001': '认证率',
        '220919101116771': '0.922906267332224',
        '220919101116786': '平台工具标签',
        '221118151931009': '校企'
      },
      {
        '10001': '认证率',
        '10003': '220919101116771',
        '10012': '0.9909274193548387',
        '20001': '认证率',
        '220919101116771': '0.9909274193548387',
        '220919101116786': '平台工具标签',
        '221118151931009': '产业园'
      },
      {
        '10001': '认证人数',
        '10003': '220919101116764',
        '10011': '793',
        '20001': '认证人数',
        '220919101116764': '793',
        '220919101116786': '垂类知识标签',
        '221118151931009': '自建'
      },
      {
        '10001': '认证人数',
        '10003': '220919101116764',
        '10011': '2380',
        '20001': '认证人数',
        '220919101116764': '2380',
        '220919101116786': '垂类知识标签',
        '221118151931009': 'BPO'
      },
      {
        '10001': '认证人数',
        '10003': '220919101116764',
        '10011': '2561',
        '20001': '认证人数',
        '220919101116764': '2561',
        '220919101116786': '垂类知识标签',
        '221118151931009': 'OSP'
      },
      {
        '10001': '认证人数',
        '10003': '220919101116764',
        '10011': '516',
        '20001': '认证人数',
        '220919101116764': '516',
        '220919101116786': '垂类知识标签',
        '221118151931009': '校企'
      },
      {
        '10001': '认证人数',
        '10003': '220919101116764',
        '10011': '754',
        '20001': '认证人数',
        '220919101116764': '754',
        '220919101116786': '垂类知识标签',
        '221118151931009': '产业园'
      },
      {
        '10001': '认证率',
        '10003': '220919101116771',
        '10012': '0.8058943089430894',
        '20001': '认证率',
        '220919101116771': '0.8058943089430894',
        '220919101116786': '垂类知识标签',
        '221118151931009': '自建'
      },
      {
        '10001': '认证率',
        '10003': '220919101116771',
        '10012': '0.737527114967462',
        '20001': '认证率',
        '220919101116771': '0.737527114967462',
        '220919101116786': '垂类知识标签',
        '221118151931009': 'BPO'
      },
      {
        '10001': '认证率',
        '10003': '220919101116771',
        '10012': '0.36455516014234873',
        '20001': '认证率',
        '220919101116771': '0.36455516014234873',
        '220919101116786': '垂类知识标签',
        '221118151931009': 'OSP'
      },
      {
        '10001': '认证率',
        '10003': '220919101116771',
        '10012': '0.3512593601089176',
        '20001': '认证率',
        '220919101116771': '0.3512593601089176',
        '220919101116786': '垂类知识标签',
        '221118151931009': '校企'
      },
      {
        '10001': '认证率',
        '10003': '220919101116771',
        '10012': '0.7631578947368421',
        '20001': '认证率',
        '220919101116771': '0.7631578947368421',
        '220919101116786': '垂类知识标签',
        '221118151931009': '产业园'
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
    defaultHeaderColWidth: [80, 'auto'],
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
    hash: 'c2e370f7634066977ad14aad97816cf1'
  };
  const tableInstance = new VTable.PivotChart(document.getElementById(CONTAINER_ID), option);
  // tableInstance.onVChartEvent('click', args => {
  //   console.log('listenChart click', args);
  // });
  // tableInstance.onVChartEvent('mouseover', args => {
  //   console.log('listenChart mouseover', args);
  // });
  window.tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });

  window.update = () => {
    delete option.title;
    tableInstance.updateOption(option);
  };
}
