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
        dimensionKey: '231016182255023',
        value: '公司'
      },
      {
        dimensionKey: '231016182255023',
        value: '小型企业'
      },
      {
        dimensionKey: '231016182255023',
        value: '消费者'
      }
    ],
    rowTree: [],
    columns: [
      {
        dimensionKey: '231016182255023',
        title: '细分'
      }
    ],
    rows: [],
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
          text: '地区',
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
            direction: 'horizontal'
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
          visible: true,
          text: '销售额',
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
        nice: true,
        seriesId: ['mainSeries', 'subSeries']
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
          visible: true,
          text: '利润',
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
        nice: true,
        seriesId: ['mainSeries', 'subSeries'],
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
          series: [
            {
              id: 'mainSeries',
              type: 'bar',
              xField: ['231016182255020', '10001'],
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
                    domain: ['销售额', '利润'],
                    sortIndex: 0,
                    lockStatisticsByDomain: true
                  },
                  '231016182255014': {
                    alias: '销售额'
                  },
                  '231016182255017': {
                    alias: '利润'
                  },
                  '231016182255020': {
                    alias: '地区'
                  },
                  '231016182255023': {
                    alias: '细分'
                  }
                }
              },
              stackInverse: true,
              label: {
                visible: false,
                overlap: {
                  hideOnHit: true,
                  avoidBaseMark: false,
                  strategy: [
                    {
                      type: 'moveY',
                      offset: [
                        -20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1,
                        2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
                      ]
                    },
                    {
                      type: 'moveX',
                      offset: [
                        -20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1,
                        2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
                      ]
                    }
                  ],
                  clampForce: true
                },
                style: {
                  fontSize: 12,
                  fontWeight: 'normal',
                  zIndex: 400,
                  fill: null,
                  strokeOpacity: 1
                },
                position: 'inside',
                smartInvert: false
              },
              line: {
                style: {
                  curveType: {
                    type: 'ordinal',
                    field: '20001',
                    range: ['linear'],
                    domain: ['销售额', '利润']
                  },
                  lineWidth: {
                    type: 'ordinal',
                    field: '20001',
                    range: [3],
                    domain: ['销售额', '利润']
                  },
                  lineDash: {
                    type: 'ordinal',
                    field: '20001',
                    range: [[0, 0]],
                    domain: ['销售额', '利润']
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
                    domain: ['销售额', '利润']
                  },
                  size: {
                    type: 'ordinal',
                    field: '20001',
                    range: [7.0898154036220635],
                    domain: ['销售额', '利润']
                  },
                  stroke: {
                    field: '20001',
                    type: 'ordinal',
                    range: ['#2E62F1', '#4DC36A'],
                    specified: {},
                    domain: ['销售额', '利润']
                  },
                  strokeOpacity: {
                    type: 'ordinal',
                    field: '20001',
                    range: [1],
                    domain: ['销售额', '利润']
                  },
                  fillOpacity: {
                    type: 'ordinal',
                    field: '20001',
                    range: [1],
                    domain: ['销售额', '利润']
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
              seriesMark: 'point',
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
              xField: '231016182255020',
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
                    domain: ['销售额', '利润'],
                    sortIndex: 0,
                    lockStatisticsByDomain: true
                  },
                  '231016182255014': {
                    alias: '销售额'
                  },
                  '231016182255017': {
                    alias: '利润'
                  },
                  '231016182255020': {
                    alias: '地区'
                  },
                  '231016182255023': {
                    alias: '细分'
                  }
                }
              },
              stackInverse: true,
              label: {
                visible: false,
                overlap: {
                  hideOnHit: true,
                  avoidBaseMark: false,
                  strategy: [
                    {
                      type: 'moveY',
                      offset: [
                        -20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1,
                        2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
                      ]
                    },
                    {
                      type: 'moveX',
                      offset: [
                        -20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1,
                        2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
                      ]
                    }
                  ],
                  clampForce: true
                },
                style: {
                  fontSize: 12,
                  fontWeight: 'normal',
                  zIndex: 400,
                  fill: null,
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
                    domain: ['销售额', '利润']
                  },
                  lineWidth: {
                    type: 'ordinal',
                    field: '20001',
                    range: [3],
                    domain: ['销售额', '利润']
                  },
                  lineDash: {
                    type: 'ordinal',
                    field: '20001',
                    range: [[0, 0]],
                    domain: ['销售额', '利润']
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
                    domain: ['销售额', '利润']
                  },
                  size: {
                    type: 'ordinal',
                    field: '20001',
                    range: [7.0898154036220635],
                    domain: ['销售额', '利润']
                  },
                  stroke: {
                    field: '20001',
                    type: 'ordinal',
                    range: ['#2E62F1', '#4DC36A'],
                    specified: {},
                    domain: ['销售额', '利润']
                  },
                  strokeOpacity: {
                    type: 'ordinal',
                    field: '20001',
                    range: [1],
                    domain: ['销售额', '利润']
                  },
                  fillOpacity: {
                    type: 'ordinal',
                    field: '20001',
                    range: [1],
                    domain: ['销售额', '利润']
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
              seriesMark: 'point',
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
                domain: ['销售额', '利润'],
                sortIndex: 0,
                lockStatisticsByDomain: true
              },
              '231016182255014': {
                alias: '销售额'
              },
              '231016182255017': {
                alias: '利润'
              },
              '231016182255020': {
                alias: '地区'
              },
              '231016182255023': {
                alias: '细分'
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
                text: '地区',
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
                  direction: 'horizontal'
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
                visible: true,
                text: '销售额',
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
              zero: true,
              nice: true,
              seriesId: ['mainSeries', 'subSeries']
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
                visible: true,
                text: '利润',
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
              zero: true,
              nice: true,
              seriesId: ['mainSeries', 'subSeries'],
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
            range: ['#2E62F1', '#4DC36A'],
            specified: {},
            domain: ['销售额', '利润']
          },
          tooltip: {
            handler: {}
          },
          crosshair: {
            xField: {
              visible: true
            },
            gridZIndex: 100
          }
        }
      }
    ],
    indicatorsAsCol: false,
    records: [
      {
        '10001': '销售额',
        '10003': '231016182255014',
        '10011': '469341.68548202515',
        '20001': '销售额',
        '231016182255014': '469341.68548202515',
        '231016182255020': '西南',
        '231016182255023': '公司'
      },
      {
        '10001': '销售额',
        '10003': '231016182255014',
        '10011': '1335665.32513237',
        '20001': '销售额',
        '231016182255014': '1335665.32513237',
        '231016182255020': '中南',
        '231016182255023': '公司'
      },
      {
        '10001': '销售额',
        '10003': '231016182255014',
        '10011': '253458.18463516235',
        '20001': '销售额',
        '231016182255014': '253458.18463516235',
        '231016182255020': '西北',
        '231016182255023': '公司'
      },
      {
        '10001': '销售额',
        '10003': '231016182255014',
        '10011': '804769.4678850174',
        '20001': '销售额',
        '231016182255014': '804769.4678850174',
        '231016182255020': '华北',
        '231016182255023': '公司'
      },
      {
        '10001': '销售额',
        '10003': '231016182255014',
        '10011': '1454715.804889679',
        '20001': '销售额',
        '231016182255014': '1454715.804889679',
        '231016182255020': '华东',
        '231016182255023': '公司'
      },
      {
        '10001': '销售额',
        '10003': '231016182255014',
        '10011': '834842.828546524',
        '20001': '销售额',
        '231016182255014': '834842.828546524',
        '231016182255020': '地区-dongbei',
        '231016182255023': '公司'
      },
      {
        '10001': '利润',
        '10003': '231016182255017',
        '10012': '30208.023854598403',
        '20001': '利润',
        '231016182255017': '30208.023854598403',
        '231016182255020': '西南',
        '231016182255023': '公司'
      },
      {
        '10001': '利润',
        '10003': '231016182255017',
        '10012': '197862.08459425718',
        '20001': '利润',
        '231016182255017': '197862.08459425718',
        '231016182255020': '中南',
        '231016182255023': '公司'
      },
      {
        '10001': '利润',
        '10003': '231016182255017',
        '10012': '44090.564069509506',
        '20001': '利润',
        '231016182255017': '44090.564069509506',
        '231016182255020': '西北',
        '231016182255023': '公司'
      },
      {
        '10001': '利润',
        '10003': '231016182255017',
        '10012': '166445.20906487107',
        '20001': '利润',
        '231016182255017': '166445.20906487107',
        '231016182255020': '华北',
        '231016182255023': '公司'
      },
      {
        '10001': '利润',
        '10003': '231016182255017',
        '10012': '186383.42677396536',
        '20001': '利润',
        '231016182255017': '186383.42677396536',
        '231016182255020': '华东',
        '231016182255023': '公司'
      },
      {
        '10001': '利润',
        '10003': '231016182255017',
        '10012': '56978.326416149735',
        '20001': '利润',
        '231016182255017': '56978.326416149735',
        '231016182255020': '地区-dongbei',
        '231016182255023': '公司'
      },
      {
        '10001': '销售额',
        '10003': '231016182255014',
        '10011': '522739.03513240814',
        '20001': '销售额',
        '231016182255014': '522739.03513240814',
        '231016182255020': '地区-dongbei',
        '231016182255023': '小型企业'
      },
      {
        '10001': '销售额',
        '10003': '231016182255014',
        '10011': '743813.0075492859',
        '20001': '销售额',
        '231016182255014': '743813.0075492859',
        '231016182255020': '中南',
        '231016182255023': '小型企业'
      },
      {
        '10001': '销售额',
        '10003': '231016182255014',
        '10011': '103523.30778121948',
        '20001': '销售额',
        '231016182255014': '103523.30778121948',
        '231016182255020': '西北',
        '231016182255023': '小型企业'
      },
      {
        '10001': '销售额',
        '10003': '231016182255014',
        '10011': '942432.3721942902',
        '20001': '销售额',
        '231016182255014': '942432.3721942902',
        '231016182255020': '华东',
        '231016182255023': '小型企业'
      },
      {
        '10001': '销售额',
        '10003': '231016182255014',
        '10011': '422100.9874534607',
        '20001': '销售额',
        '231016182255014': '422100.9874534607',
        '231016182255020': '华北',
        '231016182255023': '小型企业'
      },
      {
        '10001': '销售额',
        '10003': '231016182255014',
        '10011': '156479.9320793152',
        '20001': '销售额',
        '231016182255014': '156479.9320793152',
        '231016182255020': '西南',
        '231016182255023': '小型企业'
      },
      {
        '10001': '利润',
        '10003': '231016182255017',
        '10012': '64188.91547188163',
        '20001': '利润',
        '231016182255017': '64188.91547188163',
        '231016182255020': '地区-dongbei',
        '231016182255023': '小型企业'
      },
      {
        '10001': '利润',
        '10003': '231016182255017',
        '10012': '147234.50668483973',
        '20001': '利润',
        '231016182255017': '147234.50668483973',
        '231016182255020': '中南',
        '231016182255023': '小型企业'
      },
      {
        '10001': '利润',
        '10003': '231016182255017',
        '10012': '5439.727965354919',
        '20001': '利润',
        '231016182255017': '5439.727965354919',
        '231016182255020': '西北',
        '231016182255023': '小型企业'
      },
      {
        '10001': '利润',
        '10003': '231016182255017',
        '10012': '109774.25205981731',
        '20001': '利润',
        '231016182255017': '109774.25205981731',
        '231016182255020': '华东',
        '231016182255023': '小型企业'
      },
      {
        '10001': '利润',
        '10003': '231016182255017',
        '10012': '72593.22689580917',
        '20001': '利润',
        '231016182255017': '72593.22689580917',
        '231016182255020': '华北',
        '231016182255023': '小型企业'
      },
      {
        '10001': '利润',
        '10003': '231016182255017',
        '10012': '13248.031875252724',
        '20001': '利润',
        '231016182255017': '13248.031875252724',
        '231016182255020': '西南',
        '231016182255023': '小型企业'
      },
      {
        '10001': '销售额',
        '10003': '231016182255014',
        '10011': '2057936.7624292374',
        '20001': '销售额',
        '231016182255014': '2057936.7624292374',
        '231016182255020': '中南',
        '231016182255023': '消费者'
      },
      {
        '10001': '销售额',
        '10003': '231016182255014',
        '10011': '677302.8914031982',
        '20001': '销售额',
        '231016182255014': '677302.8914031982',
        '231016182255020': '西南',
        '231016182255023': '消费者'
      },
      {
        '10001': '销售额',
        '10003': '231016182255014',
        '10011': '2287358.2651634216',
        '20001': '销售额',
        '231016182255014': '2287358.2651634216',
        '231016182255020': '华东',
        '231016182255023': '消费者'
      },
      {
        '10001': '销售额',
        '10003': '231016182255014',
        '10011': '458058.10551834106',
        '20001': '销售额',
        '231016182255014': '458058.10551834106',
        '231016182255020': '西北',
        '231016182255023': '消费者'
      },
      {
        '10001': '销售额',
        '10003': '231016182255014',
        '10011': '1323985.6108589172',
        '20001': '销售额',
        '231016182255014': '1323985.6108589172',
        '231016182255020': '地区-dongbei',
        '231016182255023': '消费者'
      },
      {
        '10001': '销售额',
        '10003': '231016182255014',
        '10011': '1220430.5587997437',
        '20001': '销售额',
        '231016182255014': '1220430.5587997437',
        '231016182255020': '华北',
        '231016182255023': '消费者'
      },
      {
        '10001': '利润',
        '10003': '231016182255017',
        '10012': '325788.7225390896',
        '20001': '利润',
        '231016182255017': '325788.7225390896',
        '231016182255020': '中南',
        '231016182255023': '消费者'
      },
      {
        '10001': '利润',
        '10003': '231016182255017',
        '10012': '54180.67230556905',
        '20001': '利润',
        '231016182255017': '54180.67230556905',
        '231016182255020': '西南',
        '231016182255023': '消费者'
      },
      {
        '10001': '利润',
        '10003': '231016182255017',
        '10012': '311061.0042088777',
        '20001': '利润',
        '231016182255017': '311061.0042088777',
        '231016182255020': '华东',
        '231016182255023': '消费者'
      },
      {
        '10001': '利润',
        '10003': '231016182255017',
        '10012': '49023.18348328769',
        '20001': '利润',
        '231016182255017': '49023.18348328769',
        '231016182255020': '西北',
        '231016182255023': '消费者'
      },
      {
        '10001': '利润',
        '10003': '231016182255017',
        '10012': '121024.26733334363',
        '20001': '利润',
        '231016182255017': '121024.26733334363',
        '231016182255020': '地区-dongbei',
        '231016182255023': '消费者'
      },
      {
        '10001': '利润',
        '10003': '231016182255017',
        '10012': '192014.78153175116',
        '20001': '利润',
        '231016182255017': '192014.78153175116',
        '231016182255020': '华北',
        '231016182255023': '消费者'
      }
    ],
    defaultHeaderColWidth: ['auto'],
    indicatorTitle: '',
    autoWrapText: true,
    legends: {
      type: 'discrete',
      id: 'legend-discrete',
      orient: 'bottom',
      position: 'middle',
      layoutType: 'normal',
      visible: true,
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
      padding: [16, 0, 0, 0],
      data: [
        {
          label: '销售额',
          shape: {
            fill: '#2E62F1',
            symbolType: 'square'
          }
        },
        {
          label: '利润',
          shape: {
            fill: '#4DC36A',
            symbolType: 'square'
          }
        }
      ]
    },
    corner: {
      titleOnDimension: 'row'
    },
    title: {
      text: '细分',
      align: 'center',
      orient: 'top',
      padding: [3, 0, 5, 0],
      textStyle: {
        fontSize: 12,
        fill: '#333333',
        fontWeight: 'bold'
      }
    },
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
    hash: '1dcb9dc2d848ceaf060295843bfceeaf'
  };
  const tableInstance = new VTable.PivotChart(document.getElementById(CONTAINER_ID), option);
  // tableInstance.listenChart('click', args => {
  //   console.log('listenChart click', args);
  // });
  // tableInstance.listenChart('mouseover', args => {
  //   console.log('listenChart mouseover', args);
  // });
  window.tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, {});
}
