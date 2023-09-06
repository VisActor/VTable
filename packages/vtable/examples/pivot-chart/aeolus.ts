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
        dimensionKey: '230904155605115',
        value: '公司'
      },
      {
        dimensionKey: '230904155605115',
        value: '小型企业'
      },
      {
        dimensionKey: '230904155605115',
        value: '消费者'
      }
    ],
    rowTree: [
      {
        dimensionKey: ' ',
        value: ''
      }
    ],
    columns: [
      {
        dimensionKey: '230904155605115',
        dimensionTitle: '细分'
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
        hover: true,
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
          text: '超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long',
          style: {
            fontSize: 12,
            fill: '#363839',
            fontWeight: 'normal'
          }
        },
        sampling: false,
        label: {
          visible: true,
          space: 8,
          flush: true,
          style: {
            fontSize: 12,
            maxLineWidth: 174,
            fill: '#6F6F6F',
            angle: 0,
            fontWeight: 'normal'
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
        caption: '',
        width: 'auto',
        columnType: 'chart',
        chartModule: 'vchart',
        style: {
          padding: 1
        },
        chartSpec: {
          type: 'bar',
          xField: ['230904155605059', '10001'],
          yField: ['10002'],
          direction: 'vertical',
          seriesField: '20001',
          padding: 0,
          color: {
            field: '20001',
            type: 'ordinal',
            range: ['#2E62F1', '#4DC36A'],
            specified: {},
            domain: ['销售额', '利润']
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
          background: 'rgba(255, 255, 255, 0)',
          barWidth: '75%',
          animation: false,
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
                text: '超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long超级Long',
                style: {
                  fontSize: 12,
                  fill: '#363839',
                  fontWeight: 'normal'
                }
              },
              sampling: false,
              label: {
                visible: true,
                space: 8,
                flush: true,
                style: {
                  fontSize: 12,
                  maxLineWidth: 174,
                  fill: '#6F6F6F',
                  angle: 0,
                  fontWeight: 'normal'
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
          data: {
            id: 'data'
          }
        }
      }
    ],
    indicatorsAsCol: false,
    records: [
      {
        '10001': '销售额',
        '10002': '469341.68548202515',
        '10003': '230904155605053',
        '20001': '销售额',
        '230904155605053': '469341.68548202515',
        '230904155605059': '西南',
        '230904155605115': '公司'
      },
      {
        '10001': '利润',
        '10002': '30208.023854598403',
        '10003': '230904155605056',
        '20001': '利润',
        '230904155605056': '30208.023854598403',
        '230904155605059': '西南',
        '230904155605115': '公司'
      },
      {
        '10001': '销售额',
        '10002': '1454715.804889679',
        '10003': '230904155605053',
        '20001': '销售额',
        '230904155605053': '1454715.804889679',
        '230904155605059': '华东',
        '230904155605115': '公司'
      },
      {
        '10001': '利润',
        '10002': '186383.42677396536',
        '10003': '230904155605056',
        '20001': '利润',
        '230904155605056': '186383.42677396536',
        '230904155605059': '华东',
        '230904155605115': '公司'
      },
      {
        '10001': '销售额',
        '10002': '253458.18463516235',
        '10003': '230904155605053',
        '20001': '销售额',
        '230904155605053': '253458.18463516235',
        '230904155605059': '西北',
        '230904155605115': '公司'
      },
      {
        '10001': '利润',
        '10002': '44090.564069509506',
        '10003': '230904155605056',
        '20001': '利润',
        '230904155605056': '44090.564069509506',
        '230904155605059': '西北',
        '230904155605115': '公司'
      },
      {
        '10001': '销售额',
        '10002': '804769.4678850174',
        '10003': '230904155605053',
        '20001': '销售额',
        '230904155605053': '804769.4678850174',
        '230904155605059': '华北',
        '230904155605115': '公司'
      },
      {
        '10001': '利润',
        '10002': '166445.20906487107',
        '10003': '230904155605056',
        '20001': '利润',
        '230904155605056': '166445.20906487107',
        '230904155605059': '华北',
        '230904155605115': '公司'
      },
      {
        '10001': '销售额',
        '10002': '1335665.32513237',
        '10003': '230904155605053',
        '20001': '销售额',
        '230904155605053': '1335665.32513237',
        '230904155605059': '中南',
        '230904155605115': '公司'
      },
      {
        '10001': '利润',
        '10002': '197862.08459425718',
        '10003': '230904155605056',
        '20001': '利润',
        '230904155605056': '197862.08459425718',
        '230904155605059': '中南',
        '230904155605115': '公司'
      },
      {
        '10001': '销售额',
        '10002': '834842.828546524',
        '10003': '230904155605053',
        '20001': '销售额',
        '230904155605053': '834842.828546524',
        '230904155605059': '地区-dongbei',
        '230904155605115': '公司'
      },
      {
        '10001': '利润',
        '10002': '56978.326416149735',
        '10003': '230904155605056',
        '20001': '利润',
        '230904155605056': '56978.326416149735',
        '230904155605059': '地区-dongbei',
        '230904155605115': '公司'
      },
      {
        '10001': '销售额',
        '10002': '103523.30778121948',
        '10003': '230904155605053',
        '20001': '销售额',
        '230904155605053': '103523.30778121948',
        '230904155605059': '西北',
        '230904155605115': '小型企业'
      },
      {
        '10001': '利润',
        '10002': '5439.727965354919',
        '10003': '230904155605056',
        '20001': '利润',
        '230904155605056': '5439.727965354919',
        '230904155605059': '西北',
        '230904155605115': '小型企业'
      },
      {
        '10001': '销售额',
        '10002': '942432.3721942902',
        '10003': '230904155605053',
        '20001': '销售额',
        '230904155605053': '942432.3721942902',
        '230904155605059': '华东',
        '230904155605115': '小型企业'
      },
      {
        '10001': '利润',
        '10002': '109774.25205981731',
        '10003': '230904155605056',
        '20001': '利润',
        '230904155605056': '109774.25205981731',
        '230904155605059': '华东',
        '230904155605115': '小型企业'
      },
      {
        '10001': '销售额',
        '10002': '743813.0075492859',
        '10003': '230904155605053',
        '20001': '销售额',
        '230904155605053': '743813.0075492859',
        '230904155605059': '中南',
        '230904155605115': '小型企业'
      },
      {
        '10001': '利润',
        '10002': '147234.50668483973',
        '10003': '230904155605056',
        '20001': '利润',
        '230904155605056': '147234.50668483973',
        '230904155605059': '中南',
        '230904155605115': '小型企业'
      },
      {
        '10001': '销售额',
        '10002': '156479.9320793152',
        '10003': '230904155605053',
        '20001': '销售额',
        '230904155605053': '156479.9320793152',
        '230904155605059': '西南',
        '230904155605115': '小型企业'
      },
      {
        '10001': '利润',
        '10002': '13248.031875252724',
        '10003': '230904155605056',
        '20001': '利润',
        '230904155605056': '13248.031875252724',
        '230904155605059': '西南',
        '230904155605115': '小型企业'
      },
      {
        '10001': '销售额',
        '10002': '522739.03513240814',
        '10003': '230904155605053',
        '20001': '销售额',
        '230904155605053': '522739.03513240814',
        '230904155605059': '地区-dongbei',
        '230904155605115': '小型企业'
      },
      {
        '10001': '利润',
        '10002': '64188.91547188163',
        '10003': '230904155605056',
        '20001': '利润',
        '230904155605056': '64188.91547188163',
        '230904155605059': '地区-dongbei',
        '230904155605115': '小型企业'
      },
      {
        '10001': '销售额',
        '10002': '422100.9874534607',
        '10003': '230904155605053',
        '20001': '销售额',
        '230904155605053': '422100.9874534607',
        '230904155605059': '华北',
        '230904155605115': '小型企业'
      },
      {
        '10001': '利润',
        '10002': '72593.22689580917',
        '10003': '230904155605056',
        '20001': '利润',
        '230904155605056': '72593.22689580917',
        '230904155605059': '华北',
        '230904155605115': '小型企业'
      },
      {
        '10001': '销售额',
        '10002': '1220430.5587997437',
        '10003': '230904155605053',
        '20001': '销售额',
        '230904155605053': '1220430.5587997437',
        '230904155605059': '华北',
        '230904155605115': '消费者'
      },
      {
        '10001': '利润',
        '10002': '192014.78153175116',
        '10003': '230904155605056',
        '20001': '利润',
        '230904155605056': '192014.78153175116',
        '230904155605059': '华北',
        '230904155605115': '消费者'
      },
      {
        '10001': '销售额',
        '10002': '458058.10551834106',
        '10003': '230904155605053',
        '20001': '销售额',
        '230904155605053': '458058.10551834106',
        '230904155605059': '西北',
        '230904155605115': '消费者'
      },
      {
        '10001': '利润',
        '10002': '49023.18348328769',
        '10003': '230904155605056',
        '20001': '利润',
        '230904155605056': '49023.18348328769',
        '230904155605059': '西北',
        '230904155605115': '消费者'
      },
      {
        '10001': '销售额',
        '10002': '1323985.6108589172',
        '10003': '230904155605053',
        '20001': '销售额',
        '230904155605053': '1323985.6108589172',
        '230904155605059': '地区-dongbei',
        '230904155605115': '消费者'
      },
      {
        '10001': '利润',
        '10002': '121024.26733334363',
        '10003': '230904155605056',
        '20001': '利润',
        '230904155605056': '121024.26733334363',
        '230904155605059': '地区-dongbei',
        '230904155605115': '消费者'
      },
      {
        '10001': '销售额',
        '10002': '2287358.2651634216',
        '10003': '230904155605053',
        '20001': '销售额',
        '230904155605053': '2287358.2651634216',
        '230904155605059': '华东',
        '230904155605115': '消费者'
      },
      {
        '10001': '利润',
        '10002': '311061.0042088777',
        '10003': '230904155605056',
        '20001': '利润',
        '230904155605056': '311061.0042088777',
        '230904155605059': '华东',
        '230904155605115': '消费者'
      },
      {
        '10001': '销售额',
        '10002': '2057936.7624292374',
        '10003': '230904155605053',
        '20001': '销售额',
        '230904155605053': '2057936.7624292374',
        '230904155605059': '中南',
        '230904155605115': '消费者'
      },
      {
        '10001': '利润',
        '10002': '325788.7225390896',
        '10003': '230904155605056',
        '20001': '利润',
        '230904155605056': '325788.7225390896',
        '230904155605059': '中南',
        '230904155605115': '消费者'
      },
      {
        '10001': '销售额',
        '10002': '677302.8914031982',
        '10003': '230904155605053',
        '20001': '销售额',
        '230904155605053': '677302.8914031982',
        '230904155605059': '西南',
        '230904155605115': '消费者'
      },
      {
        '10001': '利润',
        '10002': '54180.67230556905',
        '10003': '230904155605056',
        '20001': '利润',
        '230904155605056': '54180.67230556905',
        '230904155605059': '西南',
        '230904155605115': '消费者'
      }
    ],
    defaultHeaderRowHeight: 30,
    defaultHeaderColWidth: 'auto',
    indicatorTitle: ' ',
    corner: {
      titleOnDimension: 'row'
    },
    autoWrapText: true,
    title: {
      text: '细分',
      align: 'center',
      orient: 'top',
      textStyle: {
        fontSize: 20,
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
        fontSize: 20,
        color: '#333333',
        textAlign: 'center',
        borderLineWidth: [0, 0, 1, 1],
        padding: [2, 0, 5, 0],
        hover: {
          cellBgColor: 'rgba(20, 20, 20, 0.08)'
        }
      },
      rowHeaderStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        fontSize: 20,
        color: '#333333',
        padding: 0,
        borderLineWidth: [1, 1, 0, 0],
        hover: {
          cellBgColor: 'rgba(20, 20, 20, 0.08)'
        }
      },
      cornerHeaderStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        textAlign: 'center',
        fontSize: 20,
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
        borderColor: 'rgba(0,4,20,0.2)',
        borderLineWidth: [1, 0, 1, 1],
        hover: {
          cellBgColor: 'rgba(20, 20, 20, 0.08)'
        }
      },
      bottomFrozenStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        borderLineWidth: [1, 1, 0, 1]
      },
      selectionStyle: {
        cellBgColor: '',
        cellBorderColor: ''
      },
      frameStyle: {
        borderLineWidth: 0
      }
    },
    legends: {
      id: 'legend',
      orient: 'right',
      position: 'start',
      layoutType: 'normal-inline',
      visible: true,
      hover: false,
      maxCol: 1,
      title: {
        textStyle: {
          fontSize: 12,
          fill: '#6F6F6F'
        }
      },
      item: {
        spaceRow: 0,
        spaceCol: 0,
        padding: {
          top: 4,
          bottom: 4,
          left: 4,
          right: 22
        },
        background: {
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
            symbolType: 'square'
          }
        }
      },
      pager: {
        textStyle: {},
        handler: {
          style: {},
          state: {
            disable: {}
          }
        }
      },
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
      ],
      padding: [0, 0, 16, 16]
    },
    hash: '89ef1941f8e7ec291668e86d549db9e7'
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
