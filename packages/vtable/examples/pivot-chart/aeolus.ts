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
    rowTree: [],
    columnTree: [],
    rows: [],
    columns: [],
    defaultHeaderRowHeight: 'auto',
    indicatorTitle: ' ',
    autoWrapText: true,
    corner: {
      titleOnDimension: 'row'
    },
    title: {
      text: '',
      align: 'center',
      orient: 'top',
      padding: [3, 0, 5, 0],
      textStyle: {
        fontSize: 12,
        fill: '#333333',
        fontWeight: 'bold'
      }
    },
    defaultHeaderColWidth: ['auto'],
    padding: 0,
    labelLayout: 'region',
    data: [
      {
        id: 'data',
        values: [
          [
            {
              '10001': '利润',
              '10003': '231106113423022',
              '20001': '利润',
              '010002': '276281.10993189365',
              '231106113423022': '276281.10993189365',
              '231106113553015': '一级 ------- ------- ------- ------- -------'
            },
            {
              '10001': '利润',
              '10003': '231106113423022',
              '20001': '利润',
              '010002': '134374.30981696397',
              '231106113423022': '134374.30981696397',
              '231106113553015': '当日'
            },
            {
              '10001': '利润',
              '10003': '231106113423022',
              '20001': '利润',
              '010002': '1260994.3519947156',
              '231106113423022': '1260994.3519947156',
              '231106113553015': '标准级'
            },
            {
              '10001': '利润',
              '10003': '231106113423022',
              '20001': '利润',
              '010002': '475889.1553846523',
              '231106113423022': '475889.1553846523',
              '231106113553015': '二级'
            }
          ],
          [
            {
              '10001': '销售额',
              '10003': '231106122744013',
              '20001': '销售额',
              '110002': '2403392.6722841263',
              '231106113553015': '一级 ------- ------- ------- ------- -------',
              '231106122744013': '2403392.6722841263'
            },
            {
              '10001': '销售额',
              '10003': '231106122744013',
              '20001': '销售额',
              '110002': '827490.930524826',
              '231106113553015': '当日',
              '231106122744013': '827490.930524826'
            },
            {
              '10001': '销售额',
              '10003': '231106122744013',
              '20001': '销售额',
              '110002': '9339292.830370903',
              '231106113553015': '标准级',
              '231106122744013': '9339292.830370903'
            },
            {
              '10001': '销售额',
              '10003': '231106122744013',
              '20001': '销售额',
              '110002': '3498777.6997537613',
              '231106113553015': '二级',
              '231106122744013': '3498777.6997537613'
            }
          ]
        ],
        fields: {
          '10001': {
            alias: '指标名称 '
          },
          '20001': {
            alias: '图例项 ',
            domain: ['利润', '销售额'],
            sortIndex: 0,
            lockStatisticsByDomain: true
          },
          '110002': {
            alias: '指标值 '
          },
          '010002': {
            alias: '指标值 '
          },
          '231106113423022': {
            alias: '利润'
          },
          '231106113553015': {
            alias: '邮寄方式',
            domain: ['标准级', '当日', '二级', '一级 ------- ------- ------- ------- -------'],
            sortIndex: 0,
            lockStatisticsByDomain: true
          },
          '231106122744013': {
            alias: '销售额'
          }
        }
      }
    ],
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
        orient: 'left',
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
          text: '邮寄方式',
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
          space: 8,
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
      }
    ],
    legends: {
      type: 'discrete',
      visible: true,
      id: 'legend-discrete',
      orient: 'bottom',
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
      padding: [16, 0, 0, 0],
      data: [
        {
          label: '利润',
          shape: {
            fill: '#f5222d',
            symbolType: 'square'
          }
        },
        {
          label: '销售额',
          shape: {
            fill: '#4DC36A',
            symbolType: 'square'
          }
        }
      ]
    },
    records: {
      '0': [
        {
          '10001': '利润',
          '10003': '231106113423022',
          '20001': '利润',
          '010002': '276281.10993189365',
          '231106113423022': '276281.10993189365',
          '231106113553015': '一级 ------- ------- ------- ------- -------'
        },
        {
          '10001': '利润',
          '10003': '231106113423022',
          '20001': '利润',
          '010002': '134374.30981696397',
          '231106113423022': '134374.30981696397',
          '231106113553015': '当日'
        },
        {
          '10001': '利润',
          '10003': '231106113423022',
          '20001': '利润',
          '010002': '1260994.3519947156',
          '231106113423022': '1260994.3519947156',
          '231106113553015': '标准级'
        },
        {
          '10001': '利润',
          '10003': '231106113423022',
          '20001': '利润',
          '010002': '475889.1553846523',
          '231106113423022': '475889.1553846523',
          '231106113553015': '二级'
        }
      ],
      '1': [
        {
          '10001': '销售额',
          '10003': '231106122744013',
          '20001': '销售额',
          '110002': '2403392.6722841263',
          '231106113553015': '一级 ------- ------- ------- ------- -------',
          '231106122744013': '2403392.6722841263'
        },
        {
          '10001': '销售额',
          '10003': '231106122744013',
          '20001': '销售额',
          '110002': '827490.930524826',
          '231106113553015': '当日',
          '231106122744013': '827490.930524826'
        },
        {
          '10001': '销售额',
          '10003': '231106122744013',
          '20001': '销售额',
          '110002': '9339292.830370903',
          '231106113553015': '标准级',
          '231106122744013': '9339292.830370903'
        },
        {
          '10001': '销售额',
          '10003': '231106122744013',
          '20001': '销售额',
          '110002': '3498777.6997537613',
          '231106113553015': '二级',
          '231106122744013': '3498777.6997537613'
        }
      ]
    },
    indicatorsAsCol: true,
    indicators: [
      {
        indicatorKey: '0',
        width: 'auto',
        title: '',
        cellType: 'chart',
        chartModule: 'vchart',
        chartSpec: {
          type: 'line',
          xField: ['010002'],
          yField: ['231106113553015'],
          direction: 'horizontal',
          seriesField: '20001',
          axes: [
            {
              id: '0',
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
              orient: 'bottom',
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
                space: 4,
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
              nice: true
            }
          ],
          data: {
            id: 'data',
            fields: {
              '10001': {
                alias: '指标名称 '
              },
              '20001': {
                alias: '图例项 ',
                domain: ['利润', '销售额'],
                sortIndex: 0,
                lockStatisticsByDomain: true
              },
              '110002': {
                alias: '指标值 '
              },
              '010002': {
                alias: '指标值 '
              },
              '231106113423022': {
                alias: '利润'
              },
              '231106113553015': {
                alias: '邮寄方式',
                domain: ['标准级', '当日', '二级', '一级 ------- ------- ------- ------- -------'],
                sortIndex: 0,
                lockStatisticsByDomain: true
              },
              '231106122744013': {
                alias: '销售额'
              }
            }
          },
          stackInverse: false,
          background: 'rgba(255, 255, 255, 0)',
          region: [
            {
              clip: true
            }
          ],
          color: {
            field: '20001',
            type: 'ordinal',
            range: ['#2E62F1', '#4DC36A'],
            specified: {
              利润: '#f5222d',
              销售额: '#4DC36A',
              undefined: '#FF8406'
            },
            domain: ['利润', '销售额']
          },
          tooltip: {
            handler: {}
          },
          line: {
            style: {
              curveType: {
                type: 'ordinal',
                field: '20001',
                range: ['linear'],
                domain: ['利润', '销售额']
              },
              lineWidth: {
                type: 'ordinal',
                field: '20001',
                range: [3],
                domain: ['利润', '销售额']
              },
              lineDash: {
                type: 'ordinal',
                field: '20001',
                range: [[0, 0]],
                domain: ['利润', '销售额']
              }
            }
          },
          area: {
            style: {
              curveType: {
                type: 'ordinal',
                field: '20001',
                range: ['linear'],
                domain: ['利润', '销售额']
              }
            }
          },
          point: {
            style: {
              shape: {
                type: 'ordinal',
                field: '20001',
                range: ['circle'],
                domain: ['利润', '销售额']
              },
              size: {
                type: 'ordinal',
                field: '20001',
                range: [7.0898154036220635],
                domain: ['利润', '销售额']
              },
              fill: {
                field: '20001',
                type: 'ordinal',
                range: ['#2E62F1', '#4DC36A'],
                specified: {
                  利润: '#f5222d',
                  销售额: '#4DC36A',
                  undefined: '#FF8406'
                },
                domain: ['利润', '销售额']
              },
              stroke: {
                field: '20001',
                type: 'ordinal',
                range: ['#2E62F1', '#4DC36A'],
                specified: {
                  利润: '#f5222d',
                  销售额: '#4DC36A',
                  undefined: '#FF8406'
                },
                domain: ['利润', '销售额']
              },
              strokeOpacity: {
                type: 'ordinal',
                field: '20001',
                range: [1],
                domain: ['利润', '销售额']
              },
              fillOpacity: {
                type: 'ordinal',
                field: '20001',
                range: [1],
                domain: ['利润', '销售额']
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
          invalidType: 'break',
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
          animation: false,
          label: {
            visible: false,
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
              fill: '#363839',
              stroke: 'rgba(255, 255, 255, 0.8)',
              lineWidth: 1,
              strokeOpacity: 1
            },
            position: 'top',
            smartInvert: false
          }
        }
      },
      {
        indicatorKey: '1',
        width: 'auto',
        title: '',
        cellType: 'chart',
        chartModule: 'vchart',
        chartSpec: {
          type: 'line',
          xField: ['110002'],
          yField: ['231106113553015'],
          direction: 'horizontal',
          seriesField: '20001',
          axes: [
            {
              id: '1',
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
              orient: 'bottom',
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
                space: 4,
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
              nice: true
            }
          ],
          data: {
            id: 'data',
            fields: {
              '10001': {
                alias: '指标名称 '
              },
              '20001': {
                alias: '图例项 ',
                domain: ['利润', '销售额'],
                sortIndex: 0,
                lockStatisticsByDomain: true
              },
              '110002': {
                alias: '指标值 '
              },
              '010002': {
                alias: '指标值 '
              },
              '231106113423022': {
                alias: '利润'
              },
              '231106113553015': {
                alias: '邮寄方式',
                domain: ['标准级', '当日', '二级', '一级 ------- ------- ------- ------- -------'],
                sortIndex: 0,
                lockStatisticsByDomain: true
              },
              '231106122744013': {
                alias: '销售额'
              }
            }
          },
          stackInverse: false,
          background: 'rgba(255, 255, 255, 0)',
          region: [
            {
              clip: true
            }
          ],
          color: {
            field: '20001',
            type: 'ordinal',
            range: ['#2E62F1', '#4DC36A'],
            specified: {
              利润: '#f5222d',
              销售额: '#4DC36A',
              undefined: '#FF8406'
            },
            domain: ['利润', '销售额']
          },
          tooltip: {
            handler: {}
          },
          line: {
            style: {
              curveType: {
                type: 'ordinal',
                field: '20001',
                range: ['linear'],
                domain: ['利润', '销售额']
              },
              lineWidth: {
                type: 'ordinal',
                field: '20001',
                range: [3],
                domain: ['利润', '销售额']
              },
              lineDash: {
                type: 'ordinal',
                field: '20001',
                range: [[0, 0]],
                domain: ['利润', '销售额']
              }
            }
          },
          area: {
            style: {
              curveType: {
                type: 'ordinal',
                field: '20001',
                range: ['linear'],
                domain: ['利润', '销售额']
              }
            }
          },
          point: {
            style: {
              shape: {
                type: 'ordinal',
                field: '20001',
                range: ['circle'],
                domain: ['利润', '销售额']
              },
              size: {
                type: 'ordinal',
                field: '20001',
                range: [7.0898154036220635],
                domain: ['利润', '销售额']
              },
              fill: {
                field: '20001',
                type: 'ordinal',
                range: ['#2E62F1', '#4DC36A'],
                specified: {
                  利润: '#f5222d',
                  销售额: '#4DC36A',
                  undefined: '#FF8406'
                },
                domain: ['利润', '销售额']
              },
              stroke: {
                field: '20001',
                type: 'ordinal',
                range: ['#2E62F1', '#4DC36A'],
                specified: {
                  利润: '#f5222d',
                  销售额: '#4DC36A',
                  undefined: '#FF8406'
                },
                domain: ['利润', '销售额']
              },
              strokeOpacity: {
                type: 'ordinal',
                field: '20001',
                range: [1],
                domain: ['利润', '销售额']
              },
              fillOpacity: {
                type: 'ordinal',
                field: '20001',
                range: [1],
                domain: ['利润', '销售额']
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
          invalidType: 'break',
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
          animation: false,
          label: {
            visible: false,
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
              fill: '#363839',
              stroke: 'rgba(255, 255, 255, 0.8)',
              lineWidth: 1,
              strokeOpacity: 1
            },
            position: 'top',
            smartInvert: false
          }
        }
      }
    ],
    animation: false,
    theme: {
      bodyStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        borderLineWidth: [0, 0, 0, 2],
        padding: [0, 0, 0, 1]
      },
      headerStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        fontSize: 12,
        color: '#333333',
        textAlign: 'center',
        borderLineWidth: 0,
        hover: {
          cellBgColor: '#eceded'
        }
      },
      rowHeaderStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        fontSize: 12,
        color: '#333333',
        borderLineWidth: 0,
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
        borderLineWidth: [0, 0, 0, 0],
        hover: {
          cellBgColor: ''
        }
      },
      cornerRightTopCellStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        borderLineWidth: 0,
        hover: {
          cellBgColor: ''
        }
      },
      cornerLeftBottomCellStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        borderLineWidth: 0,
        hover: {
          cellBgColor: ''
        }
      },
      cornerRightBottomCellStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        borderLineWidth: 0,
        hover: {
          cellBgColor: ''
        }
      },
      rightFrozenStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        borderLineWidth: 0,
        hover: {
          cellBgColor: '#eceded'
        }
      },
      bottomFrozenStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        borderLineWidth: 0,
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
    hash: '8050d48480842c6c0453b222e17ba769'
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
