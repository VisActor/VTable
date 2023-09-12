/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';

const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
export function createTable() {
  const option = {
    rowTree: [
      {
        dimensionKey: '',
        value: ''
      }
    ],
    columnTree: [
      {
        dimensionKey: '',
        value: ''
      }
    ],
    rows: [],
    columns: [],
    defaultRowHeight: 200,
    defaultHeaderRowHeight: 30,
    defaultColWidth: 280,
    defaultHeaderColWidth: [80, 50],
    indicatorTitle: 'indicator',
    corner: {
      titleOnDimension: 'row',
      headerStyle: {
        autoWrapText: true,
        padding: 0
      }
    },
    widthMode: 'adaptive',
    heightMode: 'adaptive',
    autoWrapText: true,
    seriesField: '20001',
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
          text: '类别',
          style: {
            fontSize: 12,
            fill: '#363839',
            fontWeight: 'normal'
          }
        },
        label: {
          visible: true,
          style: {
            fontSize: 12,
            fill: '#6F6F6F',
            angle: 0,
            fontWeight: 'normal'
          },
          minGap: 4,
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
        }
      }
    ],
    records: {
      '0': [
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010002': '5734340.8279953',
          '230810121242018': '5734340.8279953',
          '230810121242024': '家具'
        },
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010002': '4865589.799788475',
          '230810121242018': '4865589.799788475',
          '230810121242024': '办公用品'
        },
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010002': '5469023.505149841',
          '230810121242018': '5469023.505149841',
          '230810121242024': '技术'
        }
      ],
      '1': [
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '110002': '638735.6293110773',
          '230810121242021': '638735.6293110773',
          '230810121242024': '家具'
        },
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '110002': '757640.3536444083',
          '230810121242021': '757640.3536444083',
          '230810121242024': '办公用品'
        },
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '110002': '751162.94417274',
          '230810121242021': '751162.94417274',
          '230810121242024': '技术'
        }
      ]
    },
    indicatorsAsCol: true,
    indicators: [
      {
        indicatorKey: '0',
        width: 'auto',
        caption: 'caption',
        columnType: 'chart',
        chartModule: 'vchart',
        chartSpec: {
          type: 'bar',
          xField: ['010002'],
          yField: ['230810121242024', '10001'],
          stack: false,
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
            smartInvert: false
          },
          area: {
            style: {
              curveType: {
                type: 'ordinal',
                field: '20001',
                range: ['linear'],
                domain: ['销售额', '利润']
              }
            }
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
                range: [8],
                domain: ['销售额', '利润']
              },
              fill: {
                field: '20001',
                type: 'ordinal',
                range: ['#2E62F1', '#4DC36A'],
                specified: {},
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
          direction: 'horizontal',
          axes: [
            {
              id: '0',
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
                visible: true,
                text: '销售额',
                style: {
                  fontSize: 12,
                  fill: '#363839',
                  fontWeight: 'normal'
                }
              },
              label: {
                visible: true,
                style: {
                  fontSize: 12,
                  fill: '#6F6F6F',
                  angle: 0,
                  fontWeight: 'normal'
                }
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
            sortIndex: 0,
            id: 'data',
            fields: {
              '10001': {
                alias: '指标名称 '
              },
              '20001': {
                alias: '图例项 ',
                domain: ['销售额', '利润'],
                lockStatisticsByDomain: true
              },
              '110002': {
                alias: '指标值 '
              },
              '010002': {
                alias: '指标值 '
              },
              '230810121242018': {
                alias: '销售额'
              },
              '230810121242021': {
                alias: '利润'
              },
              '230810121242024': {
                alias: '类别',
                domain: ['办公用品', '技术', '家具'],
                lockStatisticsByDomain: true,
                sortIndex: 0
              }
            }
          },
          seriesField: '20001',
          color: {
            field: '20001',
            type: 'ordinal',
            range: ['#2E62F1', '#4DC36A'],
            specified: {},
            domain: ['销售额', '利润']
          }
        }
      },
      {
        indicatorKey: '1',
        width: 'auto',
        caption: 'caption',
        columnType: 'chart',
        chartModule: 'vchart',
        chartSpec: {
          type: 'line',
          xField: ['110002'],
          yField: ['230810121242024', '10001'],
          stack: false,
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
            smartInvert: false
          },
          area: {
            style: {
              curveType: {
                type: 'ordinal',
                field: '20001',
                range: ['linear'],
                domain: ['销售额', '利润']
              }
            }
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
                range: [8],
                domain: ['销售额', '利润']
              },
              fill: {
                field: '20001',
                type: 'ordinal',
                range: ['#2E62F1', '#4DC36A'],
                specified: {},
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
          direction: 'horizontal',
          axes: [
            {
              id: '1',
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
                visible: true,
                text: '利润',
                style: {
                  fontSize: 12,
                  fill: '#363839',
                  fontWeight: 'normal'
                }
              },
              label: {
                visible: true,
                style: {
                  fontSize: 12,
                  fill: '#6F6F6F',
                  angle: 0,
                  fontWeight: 'normal'
                }
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
            sortIndex: 1,
            id: 'data',
            fields: {
              '10001': {
                alias: '指标名称 '
              },
              '20001': {
                alias: '图例项 ',
                domain: ['销售额', '利润'],
                lockStatisticsByDomain: true
              },
              '110002': {
                alias: '指标值 '
              },
              '010002': {
                alias: '指标值 '
              },
              '230810121242018': {
                alias: '销售额'
              },
              '230810121242021': {
                alias: '利润'
              },
              '230810121242024': {
                alias: '类别',
                domain: ['办公用品', '技术', '家具'],
                lockStatisticsByDomain: true,
                sortIndex: 0
              }
            }
          },
          seriesField: '20001',
          color: {
            field: '20001',
            type: 'ordinal',
            range: ['#2E62F1', '#4DC36A'],
            specified: {},
            domain: ['销售额', '利润']
          }
        }
      }
    ],
    theme: {
      bodyStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        borderLineWidth: [0, 0, 2, 0],
        padding: [0, 0, 1, 0]
      },
      headerStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        fontSize: 12,
        color: '#333333',
        textAlign: 'center',
        borderLineWidth: 0,
        hover: {
          cellBgColor: 'rgba(20, 20, 20, 0.08)'
        }
      },
      rowHeaderStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        fontSize: 12,
        color: '#333333',
        borderLineWidth: 0,
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
          cellBgColor: ''
        }
      },
      bottomFrozenStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        borderLineWidth: 0,
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
    legends: {
      id: 'legend',
      orient: 'bottom',
      position: 'middle',
      layoutType: 'normal',
      visible: true,
      hover: false,
      maxRow: 1,
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
      padding: [16, 0, 0, 0]
    },
    hash: 'cc764d3439655437e6ac84d62e55ec37'
  };
  const option2 = {
    rowTree: [
      {
        dimensionKey: '',
        value: ''
      }
    ],
    columnTree: [
      {
        dimensionKey: '',
        value: ''
      }
    ],
    rows: [],
    columns: [],
    defaultRowHeight: 200,
    defaultHeaderRowHeight: 30,
    defaultColWidth: 280,
    defaultHeaderColWidth: [80, 50],
    indicatorTitle: 'indicator',
    corner: {
      titleOnDimension: 'row',
      headerStyle: {
        autoWrapText: true,
        padding: 0
      }
    },
    widthMode: 'adaptive',
    heightMode: 'adaptive',
    autoWrapText: true,
    seriesField: '20001',
    axes: [
      {
        type: 'band',
        tick: {
          visible: false
        },
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
            stroke: '#989999'
          }
        },
        title: {
          visible: false,
          text: '类别',
          style: {
            fontSize: 12,
            fill: '#363839',
            fontWeight: 'normal'
          }
        },
        label: {
          visible: true,
          style: {
            fontSize: 12,
            fill: '#6F6F6F',
            angle: 0,
            fontWeight: 'normal'
          },
          minGap: 4,
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
        }
      }
    ],
    records: {
      '0': [
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010002': '5734340.8279953',
          '230810121242018': '5734340.8279953',
          '230810121242024': '家具'
        },
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010002': '4865589.799788475',
          '230810121242018': '4865589.799788475',
          '230810121242024': '办公用品'
        },
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010002': '5469023.505149841',
          '230810121242018': '5469023.505149841',
          '230810121242024': '技术'
        }
      ],
      '1': [
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '110002': '638735.6293110773',
          '230810121242021': '638735.6293110773',
          '230810121242024': '家具'
        },
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '110002': '757640.3536444083',
          '230810121242021': '757640.3536444083',
          '230810121242024': '办公用品'
        },
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '110002': '751162.94417274',
          '230810121242021': '751162.94417274',
          '230810121242024': '技术'
        }
      ]
    },
    indicatorsAsCol: true,
    indicators: [
      {
        indicatorKey: '0',
        width: 'auto',
        caption: 'caption',
        columnType: 'chart',
        chartModule: 'vchart',
        chartSpec: {
          type: 'bar',
          xField: ['010002'],
          yField: ['230810121242024', '10001'],
          stack: false,
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
            smartInvert: false
          },
          area: {
            style: {
              curveType: {
                type: 'ordinal',
                field: '20001',
                range: ['linear'],
                domain: ['销售额', '利润']
              }
            }
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
                range: [8],
                domain: ['销售额', '利润']
              },
              fill: {
                field: '20001',
                type: 'ordinal',
                range: ['#2E62F1', '#4DC36A'],
                specified: {},
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
          direction: 'horizontal',
          axes: [
            {
              id: '0',
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
                visible: true,
                text: '销售额',
                style: {
                  fontSize: 12,
                  fill: '#363839',
                  fontWeight: 'normal'
                }
              },
              label: {
                visible: true,
                style: {
                  fontSize: 12,
                  fill: '#6F6F6F',
                  angle: 0,
                  fontWeight: 'normal'
                }
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
            sortIndex: 0,
            id: 'data',
            fields: {
              '10001': {
                alias: '指标名称 '
              },
              '20001': {
                alias: '图例项 ',
                domain: ['销售额', '利润'],
                lockStatisticsByDomain: true
              },
              '110002': {
                alias: '指标值 '
              },
              '010002': {
                alias: '指标值 '
              },
              '230810121242018': {
                alias: '销售额'
              },
              '230810121242021': {
                alias: '利润'
              },
              '230810121242024': {
                alias: '类别',
                domain: ['办公用品', '技术', '家具'],
                lockStatisticsByDomain: true,
                sortIndex: 0
              }
            }
          },
          seriesField: '20001',
          color: {
            field: '20001',
            type: 'ordinal',
            range: ['#2E62F1', '#4DC36A'],
            specified: {},
            domain: ['销售额', '利润']
          }
        }
      },
      {
        indicatorKey: '1',
        width: 'auto',
        caption: 'caption',
        columnType: 'chart',
        chartModule: 'vchart',
        chartSpec: {
          type: 'line',
          xField: ['110002'],
          yField: ['230810121242024', '10001'],
          stack: false,
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
            smartInvert: false
          },
          area: {
            style: {
              curveType: {
                type: 'ordinal',
                field: '20001',
                range: ['linear'],
                domain: ['销售额', '利润']
              }
            }
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
                range: [8],
                domain: ['销售额', '利润']
              },
              fill: {
                field: '20001',
                type: 'ordinal',
                range: ['#2E62F1', '#4DC36A'],
                specified: {},
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
          direction: 'horizontal',
          axes: [
            {
              id: '1',
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
                visible: true,
                text: '利润',
                style: {
                  fontSize: 12,
                  fill: '#363839',
                  fontWeight: 'normal'
                }
              },
              label: {
                visible: true,
                style: {
                  fontSize: 12,
                  fill: '#6F6F6F',
                  angle: 0,
                  fontWeight: 'normal'
                }
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
            sortIndex: 1,
            id: 'data',
            fields: {
              '10001': {
                alias: '指标名称 '
              },
              '20001': {
                alias: '图例项 ',
                domain: ['销售额', '利润'],
                lockStatisticsByDomain: true
              },
              '110002': {
                alias: '指标值 '
              },
              '010002': {
                alias: '指标值 '
              },
              '230810121242018': {
                alias: '销售额'
              },
              '230810121242021': {
                alias: '利润'
              },
              '230810121242024': {
                alias: '类别',
                domain: ['办公用品', '技术', '家具'],
                lockStatisticsByDomain: true,
                sortIndex: 0
              }
            }
          },
          seriesField: '20001',
          color: {
            field: '20001',
            type: 'ordinal',
            range: ['#2E62F1', '#4DC36A'],
            specified: {},
            domain: ['销售额', '利润']
          }
        }
      }
    ],
    theme: {
      bodyStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        borderLineWidth: [0, 0, 2, 0],
        padding: [0, 0, 1, 0]
      },
      headerStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        fontSize: 12,
        color: '#333333',
        textAlign: 'center',
        borderLineWidth: 0,
        hover: {
          cellBgColor: 'rgba(20, 20, 20, 0.08)'
        }
      },
      rowHeaderStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        fontSize: 12,
        color: '#333333',
        borderLineWidth: 0,
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
          cellBgColor: ''
        }
      },
      bottomFrozenStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        borderLineWidth: 0,
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
    legends: {
      id: 'legend',
      orient: 'bottom',
      position: 'middle',
      layoutType: 'normal',
      visible: true,
      hover: false,
      maxRow: 1,
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
      padding: [16, 0, 0, 0]
    },
    hash: 'cc764d3439655437e6ac84d62e55ec37'
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
