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
        dimensionKey: '230907193703050',
        value: '公司'
      },
      {
        dimensionKey: '230907193703050',
        value: '小型企业'
      },
      {
        dimensionKey: '230907193703050',
        value: '消费者'
      }
    ],
    columns: [],
    rows: [
      {
        dimensionKey: '230907193703050',
        title: '细分'
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
          yField: [
            '230907193703040'
            // "10001"
          ],
          xField: ['10002'],
          direction: 'horizontal',
          seriesField: '20001',
          padding: 0,
          data: {
            id: 'data'
          },
          percent: true,
          stack: true,
          axes: [
            {
              type: 'band',
              tick: {
                visible: false
              },
              grid: {
                visible: false,
                style: {
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
                text: '地区',
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
                style: {
                  fontSize: 12,
                  fill: '#6F6F6F',
                  angle: 0,
                  fontWeight: 'normal'
                },
                autoHide: true,
                autoHideMethod: 'greedy',
                flush: true
              },
              hover: false,
              background: {
                visible: false,
                state: {
                  hover: {
                    fillOpacity: 0.08,
                    fill: '#141414'
                  }
                }
              },
              paddingInner: [0.15, 0],
              paddingOuter: [0.075, 0]
            },
            {
              type: 'linear',
              tick: {
                visible: false,
                style: {
                  stroke: 'rgba(255, 255, 255, 0)'
                }
              },
              niceType: 'accurateFirst',
              grid: {
                visible: true,
                style: {
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
                space: 6,
                flush: true,
                padding: 0,
                style: {
                  fontSize: 12,
                  maxLineWidth: 174,
                  fill: '#6F6F6F',
                  angle: 0,
                  fontWeight: 'normal',
                  dy: -1
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
            range: ['#2E62F1', '#4DC36A'],
            specified: {},
            domain: ['利润', '销售额-存在空']
          },
          label: {
            visible: false,
            overlap: {
              hideOnHit: true,
              clampForce: true
            },
            style: {
              fontSize: 12,
              fontWeight: 'normal',
              fill: null,
              strokeOpacity: 1
            },
            position: 'inside',
            smartInvert: {
              fillStrategy: 'invertBase',
              strokeStrategy: 'similarBase'
            }
          },
          // "tooltip": {
          //     "handler": {}
          // },
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
          background: 'rgba(255, 255, 255, 0)',
          // "barWidth": "75%",
          animation: false
        }
      }
    ],
    indicatorsAsCol: true,
    records: [
      {
        '10001': '利润',
        '10002': '30208.023854598403',
        '10003': '230907193703037',
        '20001': '利润',
        '230907193703037': '30208.023854598403',
        '230907193703040': '西南',
        '230907193703050': '公司'
      },
      {
        '10001': '销售额-存在空',
        '10002': '469341.68548202515',
        '10003': '230907193703043',
        '20001': '销售额-存在空',
        '230907193703040': '西南',
        '230907193703043': '469341.68548202515',
        '230907193703050': '公司'
      },
      {
        '10001': '利润',
        '10002': '197862.08459425718',
        '10003': '230907193703037',
        '20001': '利润',
        '230907193703037': '197862.08459425718',
        '230907193703040': '中南',
        '230907193703050': '公司'
      },
      {
        '10001': '销售额-存在空',
        '10002': '1335665.32513237',
        '10003': '230907193703043',
        '20001': '销售额-存在空',
        '230907193703040': '中南',
        '230907193703043': '1335665.32513237',
        '230907193703050': '公司'
      },
      {
        '10001': '利润',
        '10002': '44090.564069509506',
        '10003': '230907193703037',
        '20001': '利润',
        '230907193703037': '44090.564069509506',
        '230907193703040': '西北',
        '230907193703050': '公司'
      },
      {
        '10001': '销售额-存在空',
        '10002': '253458.18463516235',
        '10003': '230907193703043',
        '20001': '销售额-存在空',
        '230907193703040': '西北',
        '230907193703043': '253458.18463516235',
        '230907193703050': '公司'
      },
      {
        '10001': '利润',
        '10002': '166445.20906487107',
        '10003': '230907193703037',
        '20001': '利润',
        '230907193703037': '166445.20906487107',
        '230907193703040': '华北',
        '230907193703050': '公司'
      },
      {
        '10001': '销售额-存在空',
        '10002': null,
        '10003': '230907193703043',
        '20001': '销售额-存在空',
        '230907193703040': '华北',
        '230907193703043': null,
        '230907193703050': '公司'
      },
      {
        '10001': '利润',
        '10002': '186383.42677396536',
        '10003': '230907193703037',
        '20001': '利润',
        '230907193703037': '186383.42677396536',
        '230907193703040': '华东',
        '230907193703050': '公司'
      },
      {
        '10001': '销售额-存在空',
        '10002': '1454715.804889679',
        '10003': '230907193703043',
        '20001': '销售额-存在空',
        '230907193703040': '华东',
        '230907193703043': '1454715.804889679',
        '230907193703050': '公司'
      },
      {
        '10001': '利润',
        '10002': '56978.326416149735',
        '10003': '230907193703037',
        '20001': '利润',
        '230907193703037': '56978.326416149735',
        '230907193703040': '地区-dongbei',
        '230907193703050': '公司'
      },
      {
        '10001': '销售额-存在空',
        '10002': '834842.828546524',
        '10003': '230907193703043',
        '20001': '销售额-存在空',
        '230907193703040': '地区-dongbei',
        '230907193703043': '834842.828546524',
        '230907193703050': '公司'
      },
      {
        '10001': '利润',
        '10002': '64188.91547188163',
        '10003': '230907193703037',
        '20001': '利润',
        '230907193703037': '64188.91547188163',
        '230907193703040': '地区-dongbei',
        '230907193703050': '小型企业'
      },
      {
        '10001': '销售额-存在空',
        '10002': '522739.03513240814',
        '10003': '230907193703043',
        '20001': '销售额-存在空',
        '230907193703040': '地区-dongbei',
        '230907193703043': '522739.03513240814',
        '230907193703050': '小型企业'
      },
      {
        '10001': '利润',
        '10002': '147234.50668483973',
        '10003': '230907193703037',
        '20001': '利润',
        '230907193703037': '147234.50668483973',
        '230907193703040': '中南',
        '230907193703050': '小型企业'
      },
      {
        '10001': '销售额-存在空',
        '10002': '743813.0075492859',
        '10003': '230907193703043',
        '20001': '销售额-存在空',
        '230907193703040': '中南',
        '230907193703043': '743813.0075492859',
        '230907193703050': '小型企业'
      },
      {
        '10001': '利润',
        '10002': '5439.727965354919',
        '10003': '230907193703037',
        '20001': '利润',
        '230907193703037': '5439.727965354919',
        '230907193703040': '西北',
        '230907193703050': '小型企业'
      },
      {
        '10001': '销售额-存在空',
        '10002': '103523.30778121948',
        '10003': '230907193703043',
        '20001': '销售额-存在空',
        '230907193703040': '西北',
        '230907193703043': '103523.30778121948',
        '230907193703050': '小型企业'
      },
      {
        '10001': '利润',
        '10002': '109774.25205981731',
        '10003': '230907193703037',
        '20001': '利润',
        '230907193703037': '109774.25205981731',
        '230907193703040': '华东',
        '230907193703050': '小型企业'
      },
      {
        '10001': '销售额-存在空',
        '10002': '942432.3721942902',
        '10003': '230907193703043',
        '20001': '销售额-存在空',
        '230907193703040': '华东',
        '230907193703043': '942432.3721942902',
        '230907193703050': '小型企业'
      },
      {
        '10001': '利润',
        '10002': '72593.22689580917',
        '10003': '230907193703037',
        '20001': '利润',
        '230907193703037': '72593.22689580917',
        '230907193703040': '华北',
        '230907193703050': '小型企业'
      },
      {
        '10001': '销售额-存在空',
        '10002': null,
        '10003': '230907193703043',
        '20001': '销售额-存在空',
        '230907193703040': '华北',
        '230907193703043': null,
        '230907193703050': '小型企业'
      },
      {
        '10001': '利润',
        '10002': '13248.031875252724',
        '10003': '230907193703037',
        '20001': '利润',
        '230907193703037': '13248.031875252724',
        '230907193703040': '西南',
        '230907193703050': '小型企业'
      },
      {
        '10001': '销售额-存在空',
        '10002': '156479.9320793152',
        '10003': '230907193703043',
        '20001': '销售额-存在空',
        '230907193703040': '西南',
        '230907193703043': '156479.9320793152',
        '230907193703050': '小型企业'
      },
      {
        '10001': '利润',
        '10002': '325788.7225390896',
        '10003': '230907193703037',
        '20001': '利润',
        '230907193703037': '325788.7225390896',
        '230907193703040': '中南',
        '230907193703050': '消费者'
      },
      {
        '10001': '销售额-存在空',
        '10002': '2057936.7624292374',
        '10003': '230907193703043',
        '20001': '销售额-存在空',
        '230907193703040': '中南',
        '230907193703043': '2057936.7624292374',
        '230907193703050': '消费者'
      },
      {
        '10001': '利润',
        '10002': '54180.67230556905',
        '10003': '230907193703037',
        '20001': '利润',
        '230907193703037': '54180.67230556905',
        '230907193703040': '西南',
        '230907193703050': '消费者'
      },
      {
        '10001': '销售额-存在空',
        '10002': '677302.8914031982',
        '10003': '230907193703043',
        '20001': '销售额-存在空',
        '230907193703040': '西南',
        '230907193703043': '677302.8914031982',
        '230907193703050': '消费者'
      },
      {
        '10001': '利润',
        '10002': '311061.0042088777',
        '10003': '230907193703037',
        '20001': '利润',
        '230907193703037': '311061.0042088777',
        '230907193703040': '华东',
        '230907193703050': '消费者'
      },
      {
        '10001': '销售额-存在空',
        '10002': '2287358.2651634216',
        '10003': '230907193703043',
        '20001': '销售额-存在空',
        '230907193703040': '华东',
        '230907193703043': '2287358.2651634216',
        '230907193703050': '消费者'
      },
      {
        '10001': '利润',
        '10002': '49023.18348328769',
        '10003': '230907193703037',
        '20001': '利润',
        '230907193703037': '49023.18348328769',
        '230907193703040': '西北',
        '230907193703050': '消费者'
      },
      {
        '10001': '销售额-存在空',
        '10002': '458058.10551834106',
        '10003': '230907193703043',
        '20001': '销售额-存在空',
        '230907193703040': '西北',
        '230907193703043': '458058.10551834106',
        '230907193703050': '消费者'
      },
      {
        '10001': '利润',
        '10002': '121024.26733334363',
        '10003': '230907193703037',
        '20001': '利润',
        '230907193703037': '121024.26733334363',
        '230907193703040': '地区-dongbei',
        '230907193703050': '消费者'
      },
      {
        '10001': '销售额-存在空',
        '10002': '1323985.6108589172',
        '10003': '230907193703043',
        '20001': '销售额-存在空',
        '230907193703040': '地区-dongbei',
        '230907193703043': '1323985.6108589172',
        '230907193703050': '消费者'
      },
      {
        '10001': '利润',
        '10002': '192014.78153175116',
        '10003': '230907193703037',
        '20001': '利润',
        '230907193703037': '192014.78153175116',
        '230907193703040': '华北',
        '230907193703050': '消费者'
      },
      {
        '10001': '销售额-存在空',
        '10002': null,
        '10003': '230907193703043',
        '20001': '销售额-存在空',
        '230907193703040': '华北',
        '230907193703043': null,
        '230907193703050': '消费者'
      }
    ],
    defaultHeaderRowHeight: 18,
    defaultHeaderColWidth: [80, 'auto'],
    indicatorTitle: '',
    autoWrapText: true,
    legends: {
      type: 'discrete',
      id: 'legend',
      orient: 'right',
      position: 'start',
      layoutType: 'normal',
      visible: true,
      maxCol: 1,
      title: {
        textStyle: {
          fontSize: 12,
          fill: '#6F6F6F'
        }
      },
      layoutLevel: 60,
      item: {
        focus: true,
        focusIconStyle: {
          size: 14
        },
        maxWidth: 333,
        spaceRow: 0,
        spaceCol: 0,
        padding: {
          top: 1,
          bottom: 2,
          left: 3,
          right: 2
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
        padding: {
          left: -18
        },
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
      padding: [0, 0, 16, 16],
      data: [
        {
          label: '利润',
          shape: {
            fill: '#2E62F1',
            symbolType: 'square'
          }
        },
        {
          label: '销售额-存在空',
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
          cellBgColor: 'rgba(20, 20, 20, 0.08)'
        }
      },
      rowHeaderStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        fontSize: 12,
        color: '#333333',
        padding: [0, 0, 0, 4],
        borderLineWidth: [1, 1, 0, 0],
        hover: {
          cellBgColor: 'rgba(20, 20, 20, 0.08)'
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
        borderLineWidth: [1, 1, 0, 0],
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
        borderColor: 'borderColor',
        borderLineWidth: [1, 0, 1, 1],
        hover: {
          cellBgColor: 'rgba(20, 20, 20, 0.08)'
        }
      },
      bottomFrozenStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        borderLineWidth: [1, 0, 0, 1],
        padding: 0,
        hover: {
          cellBgColor: 'rgba(20, 20, 20, 0.08)'
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
    hash: '69ad9626eb145c04c9ee17d647bfb134'
  };

  const tableInstance = new VTable.PivotChart(document.getElementById(CONTAINER_ID), option);
  // tableInstance.onVChartEvent('click', args => {
  //   console.log('onVChartEvent click', args);
  // });
  // tableInstance.onVChartEvent('mouseover', args => {
  //   console.log('onVChartEvent mouseover', args);
  // });
  window.tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, {});
}
