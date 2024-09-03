import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';

const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);

export function createTable() {
  const option: VTable.ListTableConstructorOptions = {
    columnTree: [
      {
        dimensionKey: '231010163651321',
        value: '技术'
      }
    ],
    rowTree: [
      {
        dimensionKey: '231010163651318',
        value: '消费者'
      },
      {
        dimensionKey: '231010163651318',
        value: '公司'
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
            stroke: '#425271',
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
            stroke: '#4C5C79'
          }
        },
        title: {
          visible: false,
          space: 5,
          text: '地区',
          style: {
            fontSize: 12,
            fill: '#E2E5EC',
            fontWeight: 'normal'
          }
        },
        maxHeight: null,
        autoIndent: false,
        sampling: false,
        zIndex: 200,
        label: {
          visible: true,
          space: 4,
          style: {
            fontSize: 12,
            fill: '#BBC2D0',
            angle: 0,
            fontWeight: 'normal',
            direction: 'horizontal',
            maxLineWidth: 174
          },
          autoHide: true,
          autoHideMethod: 'greedy',
          flush: true,
          lastVisible: true
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
        paddingInner: 0.36249999999999993,
        paddingOuter: 0.175
      },
      {
        type: 'linear',
        tick: {
          visible: false,
          style: {
            stroke: '#4C5C79'
          }
        },
        niceType: 'accurateFirst',
        zIndex: 200,
        grid: {
          visible: true,
          style: {
            zIndex: 150,
            stroke: '#425271',
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
            stroke: '#4C5C79'
          }
        },
        title: {
          visible: true,
          text: '销售额',
          space: 8,
          style: {
            fontSize: 12,
            fill: '#E2E5EC',
            fontWeight: 'normal'
          }
        },
        autoIndent: false,
        sampling: false,
        label: {
          visible: true,
          space: 6,
          flush: true,
          padding: 0,
          style: {
            fontSize: 12,
            maxLineWidth: 174,
            fill: '#BBC2D0',
            angle: 0,
            fontWeight: 'normal',
            dy: 0,
            direction: 'horizontal'
          },
          autoHide: true,
          autoHideMethod: 'greedy'
        },
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
        innerOffset: {
          top: 4.4311346272637895
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
          type: 'line',
          xField: ['221228222525158'],
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
                domain: ['销售额', '数量1', '利润'],
                sortIndex: 0,
                lockStatisticsByDomain: true
              },
              '221228222525158': {
                alias: '地区'
              },
              '221228222525159': {
                alias: '销售额'
              },
              '221228222525160': {
                alias: '数量1'
              },
              '231010163651302': {
                alias: '利润'
              },
              '231010163651318': {
                alias: '细分'
              },
              '231010163651321': {
                alias: '类别'
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
                  stroke: '#425271',
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
                  stroke: '#4C5C79'
                }
              },
              title: {
                visible: false,
                space: 5,
                text: '地区',
                style: {
                  fontSize: 12,
                  fill: '#E2E5EC',
                  fontWeight: 'normal'
                }
              },
              maxHeight: null,
              autoIndent: false,
              sampling: false,
              zIndex: 200,
              label: {
                visible: true,
                space: 4,
                style: {
                  fontSize: 12,
                  fill: '#BBC2D0',
                  angle: 0,
                  fontWeight: 'normal',
                  direction: 'horizontal',
                  maxLineWidth: 174
                },
                autoHide: true,
                autoHideMethod: 'greedy',
                flush: true,
                lastVisible: true
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
              paddingInner: 0.36249999999999993,
              paddingOuter: 0.175
            },
            {
              type: 'linear',
              tick: {
                visible: false,
                style: {
                  stroke: '#4C5C79'
                }
              },
              niceType: 'accurateFirst',
              zIndex: 200,
              grid: {
                visible: true,
                style: {
                  zIndex: 150,
                  stroke: '#425271',
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
                  stroke: '#4C5C79'
                }
              },
              title: {
                visible: true,
                text: '销售额',
                space: 8,
                style: {
                  fontSize: 12,
                  fill: '#E2E5EC',
                  fontWeight: 'normal'
                }
              },
              autoIndent: false,
              sampling: false,
              label: {
                visible: true,
                space: 6,
                flush: true,
                padding: 0,
                style: {
                  fontSize: 12,
                  maxLineWidth: 174,
                  fill: '#BBC2D0',
                  angle: 0,
                  fontWeight: 'normal',
                  dy: 0,
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
              innerOffset: {
                top: 4.4311346272637895
              },
              zero: true,
              nice: true
            }
          ],
          color: {
            field: '20001',
            type: 'ordinal',
            range: ['#207BFE', '#00CFFF', '#FC7703'],
            specified: {},
            domain: ['销售额', '数量1', '利润']
          },
          label: {
            visible: true,
            offset: 3,
            overlap: {
              hideOnHit: true,
              avoidBaseMark: false,
              strategy: [
                {
                  type: 'position',
                  position: ['top', 'bottom']
                }
              ],
              clampForce: true
            },
            style: {
              fontSize: 12,
              fontWeight: 'normal',
              zIndex: 400,
              lineHeight: '100%',
              boundsPadding: [1, 0, 0, 0],
              fill: '#FDFDFE',
              strokeOpacity: 0
            },
            position: 'top',
            smartInvert: false
          },
          tooltip: {
            handler: {}
          },
          point: {
            style: {
              shape: {
                type: 'ordinal',
                field: '20001',
                range: ['circle'],
                domain: ['销售额', '数量1', '利润']
              },
              size: {
                type: 'ordinal',
                field: '20001',
                range: [7.0898154036220635],
                domain: ['销售额', '数量1', '利润']
              },
              fill: {
                field: '20001',
                type: 'ordinal',
                range: ['#207BFE', '#00CFFF', '#FC7703'],
                specified: {},
                domain: ['销售额', '数量1', '利润']
              },
              stroke: {
                field: '20001',
                type: 'ordinal',
                range: ['#207BFE', '#00CFFF', '#FC7703'],
                specified: {},
                domain: ['销售额', '数量1', '利润']
              },
              strokeOpacity: {
                type: 'ordinal',
                field: '20001',
                range: [1],
                domain: ['销售额', '数量1', '利润']
              },
              fillOpacity: {
                type: 'ordinal',
                field: '20001',
                range: [1],
                domain: ['销售额', '数量1', '利润']
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
          line: {
            style: {
              curveType: {
                type: 'ordinal',
                field: '20001',
                range: ['linear'],
                domain: ['销售额', '数量1', '利润']
              },
              lineWidth: {
                type: 'ordinal',
                field: '20001',
                range: [2],
                domain: ['销售额', '数量1', '利润']
              },
              lineDash: {
                type: 'ordinal',
                field: '20001',
                range: [[0, 0]],
                domain: ['销售额', '数量1', '利润']
              }
            }
          },
          seriesMark: 'line',
          markOverlap: true,
          region: [
            {
              clip: true
            }
          ],
          background: '#000',
          area: {
            style: {
              curveType: {
                type: 'ordinal',
                field: '20001',
                range: ['linear'],
                domain: ['销售额', '数量1', '利润']
              }
            }
          },
          invalidType: 'break',
          // animation: true,
          crosshair: {
            xField: {
              visible: true,
              line: {
                type: 'rect',
                style: {
                  fillOpacity: 0.2,
                  fill: '#b2bacf'
                }
              }
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
        '10002': '778688.5532531738',
        '10003': '221228222525159',
        '20001': '销售额',
        '221228222525158': '华东',
        '221228222525159': '778688.5532531738',
        '231010163651318': '消费者',
        '231010163651321': '家具'
      },
      {
        '10001': '数量1',
        '10002': '1191',
        '10003': '221228222525160',
        '20001': '数量1',
        '221228222525158': '华东',
        '221228222525160': '1191',
        '231010163651318': '消费者',
        '231010163651321': '家具'
      },
      {
        '10001': '利润',
        '10002': '73741.23496370018',
        '10003': '231010163651302',
        '20001': '利润',
        '221228222525158': '华东',
        '231010163651302': '73741.23496370018',
        '231010163651318': '消费者',
        '231010163651321': '家具'
      },
      {
        '10001': '销售额',
        '10002': '666800.10496521',
        '10003': '221228222525159',
        '20001': '销售额',
        '221228222525158': 'Data',
        '221228222525159': '666800.10496521',
        '231010163651318': '消费者',
        '231010163651321': '家具'
      },
      {
        '10001': '数量1',
        '10002': '1030',
        '10003': '221228222525160',
        '20001': '数量1',
        '221228222525158': 'Data',
        '221228222525160': '1030',
        '231010163651318': '消费者',
        '231010163651321': '家具'
      },
      {
        '10001': '利润',
        '10002': '78238.42597603053',
        '10003': '231010163651302',
        '20001': '利润',
        '221228222525158': 'Data',
        '231010163651302': '78238.42597603053',
        '231010163651318': '消费者',
        '231010163651321': '家具'
      },
      {
        '10001': '销售额',
        '10002': '477446.30152893066',
        '10003': '221228222525159',
        '20001': '销售额',
        '221228222525158': '华北',
        '221228222525159': '477446.30152893066',
        '231010163651318': '消费者',
        '231010163651321': '家具'
      },
      {
        '10001': '数量1',
        '10002': '661',
        '10003': '221228222525160',
        '20001': '数量1',
        '221228222525158': '华北',
        '221228222525160': '661',
        '231010163651318': '消费者',
        '231010163651321': '家具'
      },
      {
        '10001': '利润',
        '10002': '72239.82569980621',
        '10003': '231010163651302',
        '20001': '利润',
        '221228222525158': '华北',
        '231010163651302': '72239.82569980621',
        '231010163651318': '消费者',
        '231010163651321': '家具'
      },
      {
        '10001': '销售额',
        '10002': '770952.9238891602',
        '10003': '221228222525159',
        '20001': '销售额',
        '221228222525158': '华东',
        '221228222525159': '770952.9238891602',
        '231010163651318': '消费者',
        '231010163651321': '技术'
      },
      {
        '10001': '数量1',
        '10002': '1049',
        '10003': '221228222525160',
        '20001': '数量1',
        '221228222525158': '华东',
        '221228222525160': '1049',
        '231010163651318': '消费者',
        '231010163651321': '技术'
      },
      {
        '10001': '利润',
        '10002': '120711.16437235475',
        '10003': '231010163651302',
        '20001': '利润',
        '221228222525158': '华东',
        '231010163651302': '120711.16437235475',
        '231010163651318': '消费者',
        '231010163651321': '技术'
      },
      {
        '10001': '销售额',
        '10002': '733898.7623443604',
        '10003': '221228222525159',
        '20001': '销售额',
        '221228222525158': 'Data',
        '221228222525159': '733898.7623443604',
        '231010163651318': '消费者',
        '231010163651321': '技术'
      },
      {
        '10001': '数量1',
        '10002': '1037',
        '10003': '221228222525160',
        '20001': '数量1',
        '221228222525158': 'Data',
        '221228222525160': '1037',
        '231010163651318': '消费者',
        '231010163651321': '技术'
      },
      {
        '10001': '利润',
        '10002': '127501.50028061867',
        '10003': '231010163651302',
        '20001': '利润',
        '221228222525158': 'Data',
        '231010163651302': '127501.50028061867',
        '231010163651318': '消费者',
        '231010163651321': '技术'
      },
      {
        '10001': '销售额',
        '10002': '737716.7880210876',
        '10003': '221228222525159',
        '20001': '销售额',
        '221228222525158': '华东',
        '221228222525159': '737716.7880210876',
        '231010163651318': '消费者',
        '231010163651321': 'Data-数据平台-质量保障-数据产品'
      },
      {
        '10001': '数量1',
        '10002': '3326',
        '10003': '221228222525160',
        '20001': '数量1',
        '221228222525158': '华东',
        '221228222525160': '3326',
        '231010163651318': '消费者',
        '231010163651321': 'Data-数据平台-质量保障-数据产品'
      },
      {
        '10001': '利润',
        '10002': '116608.60487282276',
        '10003': '231010163651302',
        '20001': '利润',
        '221228222525158': '华东',
        '231010163651302': '116608.60487282276',
        '231010163651318': '消费者',
        '231010163651321': 'Data-数据平台-质量保障-数据产品'
      },
      {
        '10001': '销售额',
        '10002': '657237.895119667',
        '10003': '221228222525159',
        '20001': '销售额',
        '221228222525158': 'Data',
        '221228222525159': '657237.895119667',
        '231010163651318': '消费者',
        '231010163651321': 'Data-数据平台-质量保障-数据产品'
      },
      {
        '10001': '数量1',
        '10002': '2802',
        '10003': '221228222525160',
        '20001': '数量1',
        '221228222525158': 'Data',
        '221228222525160': '2802',
        '231010163651318': '消费者',
        '231010163651321': 'Data-数据平台-质量保障-数据产品'
      },
      {
        '10001': '利润',
        '10002': '120048.79628244042',
        '10003': '231010163651302',
        '20001': '利润',
        '221228222525158': 'Data',
        '231010163651302': '120048.79628244042',
        '231010163651318': '消费者',
        '231010163651321': 'Data-数据平台-质量保障-数据产品'
      },
      {
        '10001': '销售额',
        '10002': '522924.6672515869',
        '10003': '221228222525159',
        '20001': '销售额',
        '221228222525158': '华东',
        '221228222525159': '522924.6672515869',
        '231010163651318': '公司',
        '231010163651321': '家具'
      },
      {
        '10001': '数量1',
        '10002': '765',
        '10003': '221228222525160',
        '20001': '数量1',
        '221228222525158': '华东',
        '221228222525160': '765',
        '231010163651318': '公司',
        '231010163651321': '家具'
      },
      {
        '10001': '利润',
        '10002': '58642.38694477081',
        '10003': '231010163651302',
        '20001': '利润',
        '221228222525158': '华东',
        '231010163651302': '58642.38694477081',
        '231010163651318': '公司',
        '231010163651321': '家具'
      },
      {
        '10001': '销售额',
        '10002': '515530.62297058105',
        '10003': '221228222525159',
        '20001': '销售额',
        '221228222525158': '华东',
        '221228222525159': '515530.62297058105',
        '231010163651318': '公司',
        '231010163651321': '技术'
      },
      {
        '10001': '数量1',
        '10002': '745',
        '10003': '221228222525160',
        '20001': '数量1',
        '221228222525158': '华东',
        '221228222525160': '745',
        '231010163651318': '公司',
        '231010163651321': '技术'
      },
      {
        '10001': '利润',
        '10002': '71961.62391850352',
        '10003': '231010163651302',
        '20001': '利润',
        '221228222525158': '华东',
        '231010163651302': '71961.62391850352',
        '231010163651318': '公司',
        '231010163651321': '技术'
      },
      {
        '10001': '销售额',
        '10002': '483256.1157836914',
        '10003': '221228222525159',
        '20001': '销售额',
        '221228222525158': 'Data',
        '221228222525159': '483256.1157836914',
        '231010163651318': '公司',
        '231010163651321': '技术'
      },
      {
        '10001': '数量1',
        '10002': '707',
        '10003': '221228222525160',
        '20001': '数量1',
        '221228222525158': 'Data',
        '221228222525160': '707',
        '231010163651318': '公司',
        '231010163651321': '技术'
      },
      {
        '10001': '利润',
        '10002': '70554.73583430052',
        '10003': '231010163651302',
        '20001': '利润',
        '221228222525158': 'Data',
        '231010163651302': '70554.73583430052',
        '231010163651318': '公司',
        '231010163651321': '技术'
      }
    ],
    indicatorTitle: '',
    autoWrapText: true,
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
          fill: '#E2E5EC'
        }
      },
      layoutLevel: 30,
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
            fill: '#E2E5EC'
          }
        },
        shape: {
          style: {
            lineWidth: 0,
            symbolType: 'circle',
            fillOpacity: 1,
            size: 10
          }
        }
      },
      pager: {
        layout: 'horizontal',
        padding: 0,
        textStyle: {
          fill: '#FDFDFE'
        },
        space: 0,
        handler: {
          preShape: 'triangleLeft',
          nextShape: 'triangleRight',
          style: {
            fill: '#BBC2D0'
          },
          state: {
            disable: {
              fill: '#566582'
            }
          }
        }
      },
      alignSelf: 'start',
      padding: [16, 0, 0, 0],
      data: [
        {
          label: '销售额',
          shape: {
            fill: '#207BFE',
            stroke: '#207BFE',
            symbolType: 'square'
          }
        },
        {
          label: '数量1',
          shape: {
            fill: '#00CFFF',
            stroke: '#00CFFF',
            symbolType: 'square'
          }
        },
        {
          label: '利润',
          shape: {
            fill: '#FC7703',
            stroke: '#FC7703',
            symbolType: 'square'
          }
        }
      ]
    },
    tooltip: {
      isShowOverflowTextTooltip: true
    },
    eventOptions: {
      preventDefaultContextMenu: false
    },
    columns: [
      {
        dimensionKey: '231010163651321',
        title: '类别'
      }
    ],
    rows: [
      {
        dimensionKey: '231010163651318',
        title: '细分'
      }
    ],
    corner: {
      titleOnDimension: 'row'
    },
    title: {
      text: '类别',
      align: 'center',
      orient: 'top',
      padding: [2, 0, 0, 0],
      textStyle: {
        fontSize: 12,
        fill: '#E2E5EC',
        fontWeight: 'bold'
      }
    },
    defaultHeaderColWidth: [80, 'auto'],
    theme: {
      underlayBackgroundColor: 'rgba(0,0,0)',
      bodyStyle: {
        borderColor: '#4C5C79',
        borderLineWidth: [1, 0, 0, 1],
        bgColor: 'rgba(0,0,0)',
        padding: 1
      },
      headerStyle: {
        borderColor: '#4C5C79',
        fontSize: 12,
        color: '#E2E5EC',
        textAlign: 'center',
        borderLineWidth: [0, 0, 1, 1],
        padding: [4, 0, 4, 0],
        bgColor: '#000',
        hover: {
          cellBgColor: '#000'
        }
      },
      rowHeaderStyle: {
        borderColor: '#4C5C79',
        fontSize: 12,
        color: '#E2E5EC',
        padding: [0, 0, 0, 4],
        borderLineWidth: [1, 1, 0, 0],
        bgColor: '#000',
        hover: {
          cellBgColor: '#000'
        }
      },
      cornerHeaderStyle: {
        borderColor: '#4C5C79',
        textAlign: 'center',
        fontSize: 12,
        color: '#E2E5EC',
        fontWeight: 'bold',
        borderLineWidth: [0, 1, 1, 0],
        padding: 0,
        bgColor: '#000',
        hover: {
          cellBgColor: ''
        }
      },
      cornerRightTopCellStyle: {
        borderColor: '#4C5C79',
        borderLineWidth: [0, 0, 1, 1],
        padding: 0,
        bgColor: '#000',
        hover: {
          cellBgColor: ''
        }
      },
      cornerLeftBottomCellStyle: {
        borderColor: '#4C5C79',
        borderLineWidth: [1, 0, 0, 0],
        bgColor: '#000',
        hover: {
          cellBgColor: ''
        }
      },
      cornerRightBottomCellStyle: {
        borderColor: '#4C5C79',
        borderLineWidth: [1, 0, 0, 1],
        bgColor: '#000',
        hover: {
          cellBgColor: ''
        }
      },
      rightFrozenStyle: {
        borderColor: '#4C5C79',
        borderLineWidth: [1, 0, 1, 1],
        bgColor: '#000',
        hover: {
          cellBgColor: 'rgba(178,186,207, 0.2)'
        }
      },
      bottomFrozenStyle: {
        borderColor: '#4C5C79',
        borderLineWidth: [1, 0, 0, 1],
        padding: 0,
        bgColor: '#000',
        hover: {
          cellBgColor: 'rgba(178,186,207, 0.2)'
        }
      },
      selectionStyle: {
        cellBgColor: '',
        cellBorderColor: ''
      },
      frameStyle: {
        borderLineWidth: 0,
        bgColor: '#000'
      }
    },
    heightMode: 'adaptive',
    widthMode: 'adaptive',
    hash: '419ce6366f324b90c475a63150f321d2'
  };

  const tableInstance = new VTable.PivotChart(document.getElementById(CONTAINER_ID), option);
  window.tableInstance = tableInstance;
}
