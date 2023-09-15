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
        dimensionKey: '230915155004018',
        value: '办公用品'
      },
      {
        dimensionKey: '230915155004018',
        value: '家具'
      },
      {
        dimensionKey: '230915155004018',
        value: '技术'
      }
    ],
    rowTree: [
      {
        dimensionKey: 0,
        value: ''
      }
    ],
    columns: [
      {
        dimensionKey: '230915155004018',
        title: '类别'
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
          text: '子类别',
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
            fontWeight: 'normal'
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
            }
          }
        },
        paddingInner: [0.15, 0.1],
        paddingOuter: [0.075, 0.075]
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
        title: '',
        width: 'auto',
        cellType: 'chart',
        chartModule: 'vchart',
        style: {
          padding: [1, 1, 0, 1]
        },
        chartSpec: {
          type: 'bar',
          xField: ['230915154448017', '20001'],
          yField: ['10002'],
          direction: 'vertical',
          sortDataByAxis: true,
          seriesField: '20001',
          padding: 0,
          labelLayout: 'region',
          data: {
            id: 'data'
          },
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
                text: '子类别',
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
                  fontWeight: 'normal'
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
                  }
                }
              },
              paddingInner: [0.15, 0.1],
              paddingOuter: [0.075, 0.075]
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
            range: ['#2E62F1'],
            specified: {},
            domain: ['利润']
          },
          label: {
            visible: true,
            overlap: {
              hideOnHit: true,
              avoidBaseMark: false,
              strategy: [
                {
                  type: 'position',
                  position: ['outside', 'top', 'bottom', 'left', 'right']
                }
              ],
              clampForce: true
            },
            style: {
              fontSize: 12,
              fontWeight: 'normal',
              zIndex: 100,
              fill: '#363839',
              stroke: 'rgba(255, 255, 255, 0.8)',
              lineWidth: 2,
              strokeOpacity: 1
            },
            position: 'outside',
            smartInvert: false
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
    records: [
      {
        '10001': '利润',
        '10002': '72505.02035200596',
        '10003': '230915155004013',
        '20001': '利润',
        '230915154448017': '信封',
        '230915155004013': '72505.02035200596',
        '230915155004018': '办公用品'
      },
      {
        '10001': '利润',
        '10002': '316843.37965106964',
        '10003': '230915155004013',
        '20001': '利润',
        '230915154448017': '收纳具',
        '230915155004013': '316843.37965106964',
        '230915155004018': '办公用品'
      },
      {
        '10001': '利润',
        '10002': '40576.34017910063',
        '10003': '230915155004013',
        '20001': '利润',
        '230915154448017': '用品',
        '230915155004013': '40576.34017910063',
        '230915155004018': '办公用品'
      },
      {
        '10001': '利润',
        '10002': '61622.26008081436',
        '10003': '230915155004013',
        '20001': '利润',
        '230915154448017': '纸张',
        '230915155004013': '61622.26008081436',
        '230915155004018': '办公用品'
      },
      {
        '10001': '利润',
        '10002': '18628.98805011809',
        '10003': '230915155004013',
        '20001': '利润',
        '230915154448017': '系固件',
        '230915155004013': '18628.98805011809',
        '230915155004018': '办公用品'
      },
      {
        '10001': '利润',
        '10002': '23945.739994108677',
        '10003': '230915155004013',
        '20001': '利润',
        '230915154448017': '标签',
        '230915155004013': '23945.739994108677',
        '230915155004018': '办公用品'
      },
      {
        '10001': '利润',
        '10002': '-18266.891820274293',
        '10003': '230915155004013',
        '20001': '利润',
        '230915154448017': '美术',
        '230915155004013': '-18266.891820274293',
        '230915155004018': '办公用品'
      },
      {
        '10001': '利润',
        '10002': '42758.4918590039',
        '10003': '230915155004013',
        '20001': '利润',
        '230915154448017': '装订机',
        '230915155004013': '42758.4918590039',
        '230915155004018': '办公用品'
      },
      {
        '10001': '利润',
        '10002': '199027.02529846132',
        '10003': '230915155004013',
        '20001': '利润',
        '230915154448017': '器具',
        '230915155004013': '199027.02529846132',
        '230915155004018': '办公用品'
      },
      {
        '10001': '利润',
        '10002': '-133405.67106357217',
        '10003': '230915155004013',
        '20001': '利润',
        '230915154448017': '桌子',
        '230915155004013': '-133405.67106357217',
        '230915155004018': '家具'
      },
      {
        '10001': '利润',
        '10002': '325836.72820635885',
        '10003': '230915155004013',
        '20001': '利润',
        '230915154448017': '椅子',
        '230915155004013': '325836.72820635885',
        '230915155004018': '家具'
      },
      {
        '10001': '利润',
        '10002': '85167.71222690493',
        '10003': '230915155004013',
        '20001': '利润',
        '230915154448017': '用具',
        '230915155004013': '85167.71222690493',
        '230915155004018': '家具'
      },
      {
        '10001': '利润',
        '10002': '361136.8599413857',
        '10003': '230915155004013',
        '20001': '利润',
        '230915154448017': '书架',
        '230915155004013': '361136.8599413857',
        '230915155004018': '家具'
      },
      {
        '10001': '利润',
        '10002': '252897.25975105166',
        '10003': '230915155004013',
        '20001': '利润',
        '230915154448017': '复印机',
        '230915155004013': '252897.25975105166',
        '230915155004018': '技术'
      },
      {
        '10001': '利润',
        '10002': '223349.64341315627',
        '10003': '230915155004013',
        '20001': '利润',
        '230915154448017': '电话',
        '230915155004013': '223349.64341315627',
        '230915155004018': '技术'
      },
      {
        '10001': '利润',
        '10002': '144110.62463903427',
        '10003': '230915155004013',
        '20001': '利润',
        '230915154448017': '设备',
        '230915155004013': '144110.62463903427',
        '230915155004018': '技术'
      },
      {
        '10001': '利润',
        '10002': '130805.41636949778',
        '10003': '230915155004013',
        '20001': '利润',
        '230915154448017': '配件',
        '230915155004013': '130805.41636949778',
        '230915155004018': '技术'
      }
    ],
    defaultHeaderColWidth: ['auto'],
    indicatorTitle: '',
    autoWrapText: true,
    legends: {
      type: 'discrete',
      id: 'legend',
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
          label: '利润',
          shape: {
            fill: '#2E62F1',
            symbolType: 'square'
          }
        }
      ]
    },
    indicatorsAsCol: false,
    corner: {
      titleOnDimension: 'row'
    },
    title: {
      text: '类别',
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
    hash: 'd50422279a2a24ba91ee247133253ad3'
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
