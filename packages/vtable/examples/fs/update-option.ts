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
        dimensionKey: ' ',
        value: ''
      }
    ],
    rowTree: [
      {
        dimensionKey: '230810121539014',
        value: '东北'
      },
      {
        dimensionKey: '230810121539014',
        value: '中南'
      },
      {
        dimensionKey: '230810121539014',
        value: '华东'
      },
      {
        dimensionKey: '230810121539014',
        value: '华北'
      },
      {
        dimensionKey: '230810121539014',
        value: '西北'
      },
      {
        dimensionKey: '230810121539014',
        value: '西南'
      }
    ],
    columns: [],
    rows: [
      {
        dimensionKey: '230810121539014',
        title: '地区'
      }
    ],
    indicators: [
      {
        indicatorKey: '0',
        width: 'auto',
        title: 'title',
        cellType: 'chart',
        chartModule: 'vchart',
        chartSpec: {
          type: 'common',
          axes: [
            {
              id: 'main-0',
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
              sync: {
                axisId: 'sub-0',
                zeroAlign: true
                // "tickAlign": true
              }
            },
            {
              id: 'sub-0',
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
              zero: true
              // "sync": {
              //   "axisId": "main-0",
              //   "zeroAlign": true,
              //   "tickAlign": true
              // }
            }
          ],
          zeroAlign: true,
          series: [
            {
              type: 'bar',
              yField: '010011',
              xField: ['230810121242024'],
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
                    domain: ['销售额', '利润', '数量']
                  }
                }
              },
              line: {
                style: {
                  curveType: {
                    type: 'ordinal',
                    field: '20001',
                    range: ['linear'],
                    domain: ['销售额', '利润', '数量']
                  },
                  lineWidth: {
                    type: 'ordinal',
                    field: '20001',
                    range: [3],
                    domain: ['销售额', '利润', '数量']
                  },
                  lineDash: {
                    type: 'ordinal',
                    field: '20001',
                    range: [[0, 0]],
                    domain: ['销售额', '利润', '数量']
                  }
                }
              },
              point: {
                style: {
                  shape: {
                    type: 'ordinal',
                    field: '20001',
                    range: ['circle'],
                    domain: ['销售额', '利润', '数量']
                  },
                  size: {
                    type: 'ordinal',
                    field: '20001',
                    range: [8],
                    domain: ['销售额', '利润', '数量']
                  },
                  fill: {
                    field: '20001',
                    type: 'ordinal',
                    range: ['#2E62F1', '#4DC36A', '#FF8406'],
                    specified: {},
                    domain: ['销售额', '利润', '数量']
                  },
                  stroke: {
                    field: '20001',
                    type: 'ordinal',
                    range: ['#2E62F1', '#4DC36A', '#FF8406'],
                    specified: {},
                    domain: ['销售额', '利润', '数量']
                  },
                  strokeOpacity: {
                    type: 'ordinal',
                    field: '20001',
                    range: [1],
                    domain: ['销售额', '利润', '数量']
                  },
                  fillOpacity: {
                    type: 'ordinal',
                    field: '20001',
                    range: [1],
                    domain: ['销售额', '利润', '数量']
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
              stack: false,
              direction: 'vertical',
              data: {
                sortIndex: 0,
                id: 'main-data',
                fields: {
                  '10001': {
                    alias: '指标名称 '
                  },
                  '20001': {
                    alias: '图例项 ',
                    domain: ['销售额', '利润', '数量'],
                    lockStatisticsByDomain: true
                  },
                  '110002': {
                    alias: '指标值 '
                  },
                  '010011': {
                    alias: '指标值(主轴) '
                  },
                  '010012': {
                    alias: '指标值(次轴) '
                  },
                  '230810121242018': {
                    alias: '销售额'
                  },
                  '230810121242021': {
                    alias: '利润'
                  },
                  '230810121242024': {
                    alias: '类别',
                    sortIndex: 0
                  },
                  '230810121242060': {
                    alias: '数量'
                  },
                  '230810121539014': {
                    alias: '地区'
                  }
                }
              }
            },
            {
              type: 'line',
              yField: '010012',
              xField: ['230810121242024'],
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
                    domain: ['销售额', '利润', '数量']
                  }
                }
              },
              line: {
                style: {
                  curveType: {
                    type: 'ordinal',
                    field: '20001',
                    range: ['linear'],
                    domain: ['销售额', '利润', '数量']
                  },
                  lineWidth: {
                    type: 'ordinal',
                    field: '20001',
                    range: [3],
                    domain: ['销售额', '利润', '数量']
                  },
                  lineDash: {
                    type: 'ordinal',
                    field: '20001',
                    range: [[0, 0]],
                    domain: ['销售额', '利润', '数量']
                  }
                }
              },
              point: {
                style: {
                  shape: {
                    type: 'ordinal',
                    field: '20001',
                    range: ['circle'],
                    domain: ['销售额', '利润', '数量']
                  },
                  size: {
                    type: 'ordinal',
                    field: '20001',
                    range: [8],
                    domain: ['销售额', '利润', '数量']
                  },
                  fill: {
                    field: '20001',
                    type: 'ordinal',
                    range: ['#2E62F1', '#4DC36A', '#FF8406'],
                    specified: {},
                    domain: ['销售额', '利润', '数量']
                  },
                  stroke: {
                    field: '20001',
                    type: 'ordinal',
                    range: ['#2E62F1', '#4DC36A', '#FF8406'],
                    specified: {},
                    domain: ['销售额', '利润', '数量']
                  },
                  strokeOpacity: {
                    type: 'ordinal',
                    field: '20001',
                    range: [1],
                    domain: ['销售额', '利润', '数量']
                  },
                  fillOpacity: {
                    type: 'ordinal',
                    field: '20001',
                    range: [1],
                    domain: ['销售额', '利润', '数量']
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
              stack: false,
              direction: 'vertical',
              data: {
                sortIndex: 0,
                id: 'sub-data',
                fields: {
                  '10001': {
                    alias: '指标名称 '
                  },
                  '20001': {
                    alias: '图例项 ',
                    domain: ['销售额', '利润', '数量'],
                    lockStatisticsByDomain: true
                  },
                  '110002': {
                    alias: '指标值 '
                  },
                  '010011': {
                    alias: '指标值(主轴) '
                  },
                  '010012': {
                    alias: '指标值(次轴) '
                  },
                  '230810121242018': {
                    alias: '销售额'
                  },
                  '230810121242021': {
                    alias: '利润'
                  },
                  '230810121242024': {
                    alias: '类别',
                    sortIndex: 0
                  },
                  '230810121242060': {
                    alias: '数量'
                  },
                  '230810121539014': {
                    alias: '地区'
                  }
                }
              }
            }
          ],
          seriesField: '20001',
          color: {
            field: '20001',
            type: 'ordinal',
            range: ['#2E62F1', '#4DC36A', '#FF8406'],
            specified: {},
            domain: ['销售额', '利润', '数量']
          }
        }
      },
      {
        indicatorKey: '1',
        width: 'auto',
        title: 'title',
        cellType: 'chart',
        chartModule: 'vchart',
        chartSpec: {
          type: 'line',
          xField: ['230810121242024', '10001'],
          yField: ['110002'],
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
                domain: ['销售额', '利润', '数量']
              }
            }
          },
          line: {
            style: {
              curveType: {
                type: 'ordinal',
                field: '20001',
                range: ['linear'],
                domain: ['销售额', '利润', '数量']
              },
              lineWidth: {
                type: 'ordinal',
                field: '20001',
                range: [3],
                domain: ['销售额', '利润', '数量']
              },
              lineDash: {
                type: 'ordinal',
                field: '20001',
                range: [[0, 0]],
                domain: ['销售额', '利润', '数量']
              }
            }
          },
          point: {
            style: {
              shape: {
                type: 'ordinal',
                field: '20001',
                range: ['circle'],
                domain: ['销售额', '利润', '数量']
              },
              size: {
                type: 'ordinal',
                field: '20001',
                range: [8],
                domain: ['销售额', '利润', '数量']
              },
              fill: {
                field: '20001',
                type: 'ordinal',
                range: ['#2E62F1', '#4DC36A', '#FF8406'],
                specified: {},
                domain: ['销售额', '利润', '数量']
              },
              stroke: {
                field: '20001',
                type: 'ordinal',
                range: ['#2E62F1', '#4DC36A', '#FF8406'],
                specified: {},
                domain: ['销售额', '利润', '数量']
              },
              strokeOpacity: {
                type: 'ordinal',
                field: '20001',
                range: [1],
                domain: ['销售额', '利润', '数量']
              },
              fillOpacity: {
                type: 'ordinal',
                field: '20001',
                range: [1],
                domain: ['销售额', '利润', '数量']
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
          direction: 'vertical',
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
                text: '数量',
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
                domain: ['销售额', '利润', '数量'],
                lockStatisticsByDomain: true
              },
              '110002': {
                alias: '指标值 '
              },
              '010011': {
                alias: '指标值(主轴) '
              },
              '010012': {
                alias: '指标值(次轴) '
              },
              '230810121242018': {
                alias: '销售额'
              },
              '230810121242021': {
                alias: '利润'
              },
              '230810121242024': {
                alias: '类别',
                sortIndex: 0
              },
              '230810121242060': {
                alias: '数量'
              },
              '230810121539014': {
                alias: '地区'
              }
            }
          },
          seriesField: '20001',
          color: {
            field: '20001',
            type: 'ordinal',
            range: ['#2E62F1', '#4DC36A', '#FF8406'],
            specified: {},
            domain: ['销售额', '利润', '数量']
          }
        }
      }
    ],
    indicatorsAsCol: false,
    records: {
      '0': [
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010011': '824673.0542612076',
          '230810121242018': '824673.0542612076',
          '230810121242024': '办公用品',
          '230810121539014': '东北'
        },
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010011': '936196.0161590576',
          '230810121242018': '936196.0161590576',
          '230810121242024': '技术',
          '230810121539014': '东北'
        },
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010011': '920698.4041175842',
          '230810121242018': '920698.4041175842',
          '230810121242024': '家具',
          '230810121539014': '东北'
        },
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '010012': '86067.63242470473',
          '230810121242021': '86067.63242470473',
          '230810121242024': '办公用品',
          '230810121539014': '东北'
        },
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '010012': '83431.23610076308',
          '230810121242021': '83431.23610076308',
          '230810121242024': '技术',
          '230810121539014': '东北'
        },
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '010012': '72692.64069590718',
          '230810121242021': '72692.64069590718',
          '230810121242024': '家具',
          '230810121539014': '东北'
        },
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010011': '1270911.2654294968',
          '230810121242018': '1270911.2654294968',
          '230810121242024': '办公用品',
          '230810121539014': '中南'
        },
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010011': '1399928.2008514404',
          '230810121242018': '1399928.2008514404',
          '230810121242024': '家具',
          '230810121539014': '中南'
        },
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010011': '1466575.628829956',
          '230810121242018': '1466575.628829956',
          '230810121242024': '技术',
          '230810121539014': '中南'
        },
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '010012': '219815.48459594697',
          '230810121242021': '219815.48459594697',
          '230810121242024': '办公用品',
          '230810121539014': '中南'
        },
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '010012': '199582.20107278973',
          '230810121242021': '199582.20107278973',
          '230810121242024': '家具',
          '230810121539014': '中南'
        },
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '010012': '251487.62814944983',
          '230810121242021': '251487.62814944983',
          '230810121242024': '技术',
          '230810121539014': '中南'
        },
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010011': '1599653.7198867798',
          '230810121242018': '1599653.7198867798',
          '230810121242024': '技术',
          '230810121539014': '华东'
        },
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010011': '1676224.1276245117',
          '230810121242018': '1676224.1276245117',
          '230810121242024': '家具',
          '230810121539014': '华东'
        },
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010011': '1408628.5947360992',
          '230810121242018': '1408628.5947360992',
          '230810121242024': '办公用品',
          '230810121539014': '华东'
        },
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '010012': '228179.5603364408',
          '230810121242021': '228179.5603364408',
          '230810121242024': '技术',
          '230810121539014': '华东'
        },
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '010012': '163453.42999391258',
          '230810121242021': '163453.42999391258',
          '230810121242024': '家具',
          '230810121539014': '华东'
        },
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '010012': '215585.69271230698',
          '230810121242021': '215585.69271230698',
          '230810121242024': '办公用品',
          '230810121539014': '华东'
        },
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010011': '745813.5155878067',
          '230810121242018': '745813.5155878067',
          '230810121242024': '办公用品',
          '230810121539014': '华北'
        },
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010011': '781743.5634155273',
          '230810121242018': '781743.5634155273',
          '230810121242024': '技术',
          '230810121539014': '华北'
        },
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010011': '919743.9351348877',
          '230810121242018': '919743.9351348877',
          '230810121242024': '家具',
          '230810121539014': '华北'
        },
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '010012': '137265.85579952598',
          '230810121242021': '137265.85579952598',
          '230810121242024': '办公用品',
          '230810121539014': '华北'
        },
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '010012': '144986.8839621544',
          '230810121242021': '144986.8839621544',
          '230810121242024': '技术',
          '230810121539014': '华北'
        },
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '010012': '148800.47773075104',
          '230810121242021': '148800.47773075104',
          '230810121242024': '家具',
          '230810121539014': '华北'
        },
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010011': '316212.42824935913',
          '230810121242018': '316212.42824935913',
          '230810121242024': '家具',
          '230810121539014': '西北'
        },
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010011': '267870.7928543091',
          '230810121242018': '267870.7928543091',
          '230810121242024': '办公用品',
          '230810121539014': '西北'
        },
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010011': '230956.3768310547',
          '230810121242018': '230956.3768310547',
          '230810121242024': '技术',
          '230810121539014': '西北'
        },
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '010012': '24903.787846319377',
          '230810121242021': '24903.787846319377',
          '230810121242024': '家具',
          '230810121539014': '西北'
        },
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '010012': '49633.47177379578',
          '230810121242021': '49633.47177379578',
          '230810121242024': '办公用品',
          '230810121539014': '西北'
        },
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '010012': '24016.215898036957',
          '230810121242021': '24016.215898036957',
          '230810121242024': '技术',
          '230810121539014': '西北'
        },
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010011': '453898.2000274658',
          '230810121242018': '453898.2000274658',
          '230810121242024': '技术',
          '230810121539014': '西南'
        },
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010011': '347692.57691955566',
          '230810121242018': '347692.57691955566',
          '230810121242024': '办公用品',
          '230810121539014': '西南'
        },
        {
          '10001': '销售额',
          '10003': '230810121242018',
          '20001': '销售额',
          '010011': '501533.7320175171',
          '230810121242018': '501533.7320175171',
          '230810121242024': '家具',
          '230810121539014': '西南'
        },
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '010012': '19061.419725894928',
          '230810121242021': '19061.419725894928',
          '230810121242024': '技术',
          '230810121539014': '西南'
        },
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '010012': '49272.21633812785',
          '230810121242021': '49272.21633812785',
          '230810121242024': '办公用品',
          '230810121539014': '西南'
        },
        {
          '10001': '利润',
          '10003': '230810121242021',
          '20001': '利润',
          '010012': '29303.0919713974',
          '230810121242021': '29303.0919713974',
          '230810121242024': '家具',
          '230810121539014': '西南'
        }
      ],
      '1': [
        {
          '10001': '数量',
          '10003': '230810121242060',
          '20001': '数量',
          '110002': '3622',
          '230810121242024': '办公用品',
          '230810121242060': '3622',
          '230810121539014': '东北'
        },
        {
          '10001': '数量',
          '10003': '230810121242060',
          '20001': '数量',
          '110002': '1371',
          '230810121242024': '技术',
          '230810121242060': '1371',
          '230810121539014': '东北'
        },
        {
          '10001': '数量',
          '10003': '230810121242060',
          '20001': '数量',
          '110002': '1470',
          '230810121242024': '家具',
          '230810121242060': '1470',
          '230810121539014': '东北'
        },
        {
          '10001': '数量',
          '10003': '230810121242060',
          '20001': '数量',
          '110002': '5590',
          '230810121242024': '办公用品',
          '230810121242060': '5590',
          '230810121539014': '中南'
        },
        {
          '10001': '数量',
          '10003': '230810121242060',
          '20001': '数量',
          '110002': '2023',
          '230810121242024': '家具',
          '230810121242060': '2023',
          '230810121539014': '中南'
        },
        {
          '10001': '数量',
          '10003': '230810121242060',
          '20001': '数量',
          '110002': '2087',
          '230810121242024': '技术',
          '230810121242060': '2087',
          '230810121539014': '中南'
        },
        {
          '10001': '数量',
          '10003': '230810121242060',
          '20001': '数量',
          '110002': '2183',
          '230810121242024': '技术',
          '230810121242060': '2183',
          '230810121539014': '华东'
        },
        {
          '10001': '数量',
          '10003': '230810121242060',
          '20001': '数量',
          '110002': '2517',
          '230810121242024': '家具',
          '230810121242060': '2517',
          '230810121539014': '华东'
        },
        {
          '10001': '数量',
          '10003': '230810121242060',
          '20001': '数量',
          '110002': '6341',
          '230810121242024': '办公用品',
          '230810121242060': '6341',
          '230810121539014': '华东'
        },
        {
          '10001': '数量',
          '10003': '230810121242060',
          '20001': '数量',
          '110002': '3020',
          '230810121242024': '办公用品',
          '230810121242060': '3020',
          '230810121539014': '华北'
        },
        {
          '10001': '数量',
          '10003': '230810121242060',
          '20001': '数量',
          '110002': '927',
          '230810121242024': '技术',
          '230810121242060': '927',
          '230810121539014': '华北'
        },
        {
          '10001': '数量',
          '10003': '230810121242060',
          '20001': '数量',
          '110002': '1199',
          '230810121242024': '家具',
          '230810121242060': '1199',
          '230810121539014': '华北'
        },
        {
          '10001': '数量',
          '10003': '230810121242060',
          '20001': '数量',
          '110002': '468',
          '230810121242024': '家具',
          '230810121242060': '468',
          '230810121539014': '西北'
        },
        {
          '10001': '数量',
          '10003': '230810121242060',
          '20001': '数量',
          '110002': '970',
          '230810121242024': '办公用品',
          '230810121242060': '970',
          '230810121539014': '西北'
        },
        {
          '10001': '数量',
          '10003': '230810121242060',
          '20001': '数量',
          '110002': '347',
          '230810121242024': '技术',
          '230810121242060': '347',
          '230810121539014': '西北'
        },
        {
          '10001': '数量',
          '10003': '230810121242060',
          '20001': '数量',
          '110002': '727',
          '230810121242024': '技术',
          '230810121242060': '727',
          '230810121539014': '西南'
        },
        {
          '10001': '数量',
          '10003': '230810121242060',
          '20001': '数量',
          '110002': '1858',
          '230810121242024': '办公用品',
          '230810121242060': '1858',
          '230810121539014': '西南'
        },
        {
          '10001': '数量',
          '10003': '230810121242060',
          '20001': '数量',
          '110002': '814',
          '230810121242024': '家具',
          '230810121242060': '814',
          '230810121539014': '西南'
        }
      ]
    },
    defaultHeaderRowHeight: 50,
    indicatorTitle: ' ',
    corner: {
      titleOnDimension: 'row'
    },
    axes: [{ orient: 'bottom', visible: true, title: { visible: true, text: 'aaa' } }],
    autoWrapText: true,
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
        hover: {
          cellBgColor: 'rgba(20, 20, 20, 0.08)'
        }
      },
      rowHeaderStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        fontSize: 12,
        color: '#333333',
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
        hover: {
          cellBgColor: ''
        }
      },
      cornerRightTopCellStyle: {
        borderColor: 'rgba(0,4,20,0.2)',
        borderLineWidth: [0, 0, 1, 1],
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
        borderLineWidth: [1, 0, 1, 1]
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
      orient: 'top',
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
        },
        {
          label: '数量',
          shape: {
            fill: '#FF8406',
            symbolType: 'square'
          }
        }
      ],
      padding: [16, 0, 0, 0]
    },
    title: {
      text: 'title',
      align: 'center',
      orient: 'top',
      textStyle: {
        fontSize: 12,
        fill: '#333333',
        fontWeight: 'bold'
      }
    },
    hash: '92b01dab92f6715a50c38888c7444e59'
  };
  option.container = document.getElementById(CONTAINER_ID);

  const tableInstance = new VTable.PivotChart(option);

  window.tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage as any, {
    customGrapicKeys: ['role', '_updateTag']
  });

  window.updateOption = () => {
    const newOption = {
      widthMode: 'adaptive',
      heightMode: 'adaptive',
      columnTree: [
        {
          dimensionKey: ' ',
          value: ''
        }
      ],
      rowTree: [
        {
          dimensionKey: '230810121539014',
          value: '东北'
        },
        {
          dimensionKey: '230810121539014',
          value: '中南'
        },
        {
          dimensionKey: '230810121539014',
          value: '华东'
        },
        {
          dimensionKey: '230810121539014',
          value: '华北'
        },
        {
          dimensionKey: '230810121539014',
          value: '西北'
        },
        {
          dimensionKey: '230810121539014',
          value: '西南'
        }
      ],
      columns: [],
      rows: [
        {
          dimensionKey: '230810121539014',
          title: '地区'
        }
      ],
      indicators: [
        {
          indicatorKey: '0',
          width: 'auto',
          title: 'title',
          cellType: 'chart',
          chartModule: 'vchart',
          chartSpec: {
            type: 'common',
            axes: [
              {
                id: 'main-0',
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
                sync: {
                  axisId: 'sub-0',
                  zeroAlign: true,
                  tickAlign: true
                }
              },
              {
                id: 'sub-0',
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
                sync: {
                  axisId: 'main-0',
                  zeroAlign: true,
                  tickAlign: true
                }
              }
            ],
            zeroAlign: true,
            series: [
              {
                type: 'bar',
                yField: '010011',
                xField: ['230810121242024'],
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
                      domain: ['销售额', '利润', '数量']
                    }
                  }
                },
                line: {
                  style: {
                    curveType: {
                      type: 'ordinal',
                      field: '20001',
                      range: ['linear'],
                      domain: ['销售额', '利润', '数量']
                    },
                    lineWidth: {
                      type: 'ordinal',
                      field: '20001',
                      range: [3],
                      domain: ['销售额', '利润', '数量']
                    },
                    lineDash: {
                      type: 'ordinal',
                      field: '20001',
                      range: [[0, 0]],
                      domain: ['销售额', '利润', '数量']
                    }
                  }
                },
                point: {
                  style: {
                    shape: {
                      type: 'ordinal',
                      field: '20001',
                      range: ['circle'],
                      domain: ['销售额', '利润', '数量']
                    },
                    size: {
                      type: 'ordinal',
                      field: '20001',
                      range: [8],
                      domain: ['销售额', '利润', '数量']
                    },
                    fill: {
                      field: '20001',
                      type: 'ordinal',
                      range: ['#2E62F1', '#4DC36A', '#FF8406'],
                      specified: {},
                      domain: ['销售额', '利润', '数量']
                    },
                    stroke: {
                      field: '20001',
                      type: 'ordinal',
                      range: ['#2E62F1', '#4DC36A', '#FF8406'],
                      specified: {},
                      domain: ['销售额', '利润', '数量']
                    },
                    strokeOpacity: {
                      type: 'ordinal',
                      field: '20001',
                      range: [1],
                      domain: ['销售额', '利润', '数量']
                    },
                    fillOpacity: {
                      type: 'ordinal',
                      field: '20001',
                      range: [1],
                      domain: ['销售额', '利润', '数量']
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
                stack: false,
                direction: 'vertical',
                data: {
                  sortIndex: 0,
                  id: 'main-data',
                  fields: {
                    '10001': {
                      alias: '指标名称 '
                    },
                    '20001': {
                      alias: '图例项 ',
                      domain: ['销售额', '利润', '数量'],
                      lockStatisticsByDomain: true
                    },
                    '110002': {
                      alias: '指标值 '
                    },
                    '010011': {
                      alias: '指标值(主轴) '
                    },
                    '010012': {
                      alias: '指标值(次轴) '
                    },
                    '230810121242018': {
                      alias: '销售额'
                    },
                    '230810121242021': {
                      alias: '利润'
                    },
                    '230810121242024': {
                      alias: '类别',
                      sortIndex: 0
                    },
                    '230810121242060': {
                      alias: '数量'
                    },
                    '230810121539014': {
                      alias: '地区'
                    }
                  }
                }
              },
              {
                type: 'line',
                yField: '010012',
                xField: ['230810121242024'],
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
                      domain: ['销售额', '利润', '数量']
                    }
                  }
                },
                line: {
                  style: {
                    curveType: {
                      type: 'ordinal',
                      field: '20001',
                      range: ['linear'],
                      domain: ['销售额', '利润', '数量']
                    },
                    lineWidth: {
                      type: 'ordinal',
                      field: '20001',
                      range: [3],
                      domain: ['销售额', '利润', '数量']
                    },
                    lineDash: {
                      type: 'ordinal',
                      field: '20001',
                      range: [[0, 0]],
                      domain: ['销售额', '利润', '数量']
                    }
                  }
                },
                point: {
                  style: {
                    shape: {
                      type: 'ordinal',
                      field: '20001',
                      range: ['circle'],
                      domain: ['销售额', '利润', '数量']
                    },
                    size: {
                      type: 'ordinal',
                      field: '20001',
                      range: [8],
                      domain: ['销售额', '利润', '数量']
                    },
                    fill: {
                      field: '20001',
                      type: 'ordinal',
                      range: ['#2E62F1', '#4DC36A', '#FF8406'],
                      specified: {},
                      domain: ['销售额', '利润', '数量']
                    },
                    stroke: {
                      field: '20001',
                      type: 'ordinal',
                      range: ['#2E62F1', '#4DC36A', '#FF8406'],
                      specified: {},
                      domain: ['销售额', '利润', '数量']
                    },
                    strokeOpacity: {
                      type: 'ordinal',
                      field: '20001',
                      range: [1],
                      domain: ['销售额', '利润', '数量']
                    },
                    fillOpacity: {
                      type: 'ordinal',
                      field: '20001',
                      range: [1],
                      domain: ['销售额', '利润', '数量']
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
                stack: false,
                direction: 'vertical',
                data: {
                  sortIndex: 0,
                  id: 'sub-data',
                  fields: {
                    '10001': {
                      alias: '指标名称 '
                    },
                    '20001': {
                      alias: '图例项 ',
                      domain: ['销售额', '利润', '数量'],
                      lockStatisticsByDomain: true
                    },
                    '110002': {
                      alias: '指标值 '
                    },
                    '010011': {
                      alias: '指标值(主轴) '
                    },
                    '010012': {
                      alias: '指标值(次轴) '
                    },
                    '230810121242018': {
                      alias: '销售额'
                    },
                    '230810121242021': {
                      alias: '利润'
                    },
                    '230810121242024': {
                      alias: '类别',
                      sortIndex: 0
                    },
                    '230810121242060': {
                      alias: '数量'
                    },
                    '230810121539014': {
                      alias: '地区'
                    }
                  }
                }
              }
            ],
            seriesField: '20001',
            color: {
              field: '20001',
              type: 'ordinal',
              range: ['#2E62F1', '#4DC36A', '#FF8406'],
              specified: {},
              domain: ['销售额', '利润', '数量']
            }
          }
        },
        {
          indicatorKey: '1',
          width: 'auto',
          title: 'title',
          cellType: 'chart',
          chartModule: 'vchart',
          chartSpec: {
            type: 'line',
            xField: ['230810121242024', '10001'],
            yField: ['110002'],
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
                  domain: ['销售额', '利润', '数量']
                }
              }
            },
            line: {
              style: {
                curveType: {
                  type: 'ordinal',
                  field: '20001',
                  range: ['linear'],
                  domain: ['销售额', '利润', '数量']
                },
                lineWidth: {
                  type: 'ordinal',
                  field: '20001',
                  range: [3],
                  domain: ['销售额', '利润', '数量']
                },
                lineDash: {
                  type: 'ordinal',
                  field: '20001',
                  range: [[0, 0]],
                  domain: ['销售额', '利润', '数量']
                }
              }
            },
            point: {
              style: {
                shape: {
                  type: 'ordinal',
                  field: '20001',
                  range: ['circle'],
                  domain: ['销售额', '利润', '数量']
                },
                size: {
                  type: 'ordinal',
                  field: '20001',
                  range: [8],
                  domain: ['销售额', '利润', '数量']
                },
                fill: {
                  field: '20001',
                  type: 'ordinal',
                  range: ['#2E62F1', '#4DC36A', '#FF8406'],
                  specified: {},
                  domain: ['销售额', '利润', '数量']
                },
                stroke: {
                  field: '20001',
                  type: 'ordinal',
                  range: ['#2E62F1', '#4DC36A', '#FF8406'],
                  specified: {},
                  domain: ['销售额', '利润', '数量']
                },
                strokeOpacity: {
                  type: 'ordinal',
                  field: '20001',
                  range: [1],
                  domain: ['销售额', '利润', '数量']
                },
                fillOpacity: {
                  type: 'ordinal',
                  field: '20001',
                  range: [1],
                  domain: ['销售额', '利润', '数量']
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
            direction: 'vertical',
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
                  text: '数量',
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
                  domain: ['销售额', '利润', '数量'],
                  lockStatisticsByDomain: true
                },
                '110002': {
                  alias: '指标值 '
                },
                '010011': {
                  alias: '指标值(主轴) '
                },
                '010012': {
                  alias: '指标值(次轴) '
                },
                '230810121242018': {
                  alias: '销售额'
                },
                '230810121242021': {
                  alias: '利润'
                },
                '230810121242024': {
                  alias: '类别',
                  sortIndex: 0
                },
                '230810121242060': {
                  alias: '数量'
                },
                '230810121539014': {
                  alias: '地区'
                }
              }
            },
            seriesField: '20001',
            color: {
              field: '20001',
              type: 'ordinal',
              range: ['#2E62F1', '#4DC36A', '#FF8406'],
              specified: {},
              domain: ['销售额', '利润', '数量']
            }
          }
        }
      ],
      indicatorsAsCol: false,
      records: {
        '0': [
          {
            '10001': '销售额',
            '10003': '230810121242018',
            '20001': '销售额',
            '010011': '824673.0542612076',
            '230810121242018': '824673.0542612076',
            '230810121242024': '办公用品',
            '230810121539014': '东北'
          },
          {
            '10001': '销售额',
            '10003': '230810121242018',
            '20001': '销售额',
            '010011': '936196.0161590576',
            '230810121242018': '936196.0161590576',
            '230810121242024': '技术',
            '230810121539014': '东北'
          },
          {
            '10001': '销售额',
            '10003': '230810121242018',
            '20001': '销售额',
            '010011': '920698.4041175842',
            '230810121242018': '920698.4041175842',
            '230810121242024': '家具',
            '230810121539014': '东北'
          },
          {
            '10001': '利润',
            '10003': '230810121242021',
            '20001': '利润',
            '010012': '86067.63242470473',
            '230810121242021': '86067.63242470473',
            '230810121242024': '办公用品',
            '230810121539014': '东北'
          },
          {
            '10001': '利润',
            '10003': '230810121242021',
            '20001': '利润',
            '010012': '83431.23610076308',
            '230810121242021': '83431.23610076308',
            '230810121242024': '技术',
            '230810121539014': '东北'
          },
          {
            '10001': '利润',
            '10003': '230810121242021',
            '20001': '利润',
            '010012': '72692.64069590718',
            '230810121242021': '72692.64069590718',
            '230810121242024': '家具',
            '230810121539014': '东北'
          },
          {
            '10001': '销售额',
            '10003': '230810121242018',
            '20001': '销售额',
            '010011': '1270911.2654294968',
            '230810121242018': '1270911.2654294968',
            '230810121242024': '办公用品',
            '230810121539014': '中南'
          },
          {
            '10001': '销售额',
            '10003': '230810121242018',
            '20001': '销售额',
            '010011': '1399928.2008514404',
            '230810121242018': '1399928.2008514404',
            '230810121242024': '家具',
            '230810121539014': '中南'
          },
          {
            '10001': '销售额',
            '10003': '230810121242018',
            '20001': '销售额',
            '010011': '1466575.628829956',
            '230810121242018': '1466575.628829956',
            '230810121242024': '技术',
            '230810121539014': '中南'
          },
          {
            '10001': '利润',
            '10003': '230810121242021',
            '20001': '利润',
            '010012': '219815.48459594697',
            '230810121242021': '219815.48459594697',
            '230810121242024': '办公用品',
            '230810121539014': '中南'
          },
          {
            '10001': '利润',
            '10003': '230810121242021',
            '20001': '利润',
            '010012': '199582.20107278973',
            '230810121242021': '199582.20107278973',
            '230810121242024': '家具',
            '230810121539014': '中南'
          },
          {
            '10001': '利润',
            '10003': '230810121242021',
            '20001': '利润',
            '010012': '251487.62814944983',
            '230810121242021': '251487.62814944983',
            '230810121242024': '技术',
            '230810121539014': '中南'
          },
          {
            '10001': '销售额',
            '10003': '230810121242018',
            '20001': '销售额',
            '010011': '1599653.7198867798',
            '230810121242018': '1599653.7198867798',
            '230810121242024': '技术',
            '230810121539014': '华东'
          },
          {
            '10001': '销售额',
            '10003': '230810121242018',
            '20001': '销售额',
            '010011': '1676224.1276245117',
            '230810121242018': '1676224.1276245117',
            '230810121242024': '家具',
            '230810121539014': '华东'
          },
          {
            '10001': '销售额',
            '10003': '230810121242018',
            '20001': '销售额',
            '010011': '1408628.5947360992',
            '230810121242018': '1408628.5947360992',
            '230810121242024': '办公用品',
            '230810121539014': '华东'
          },
          {
            '10001': '利润',
            '10003': '230810121242021',
            '20001': '利润',
            '010012': '228179.5603364408',
            '230810121242021': '228179.5603364408',
            '230810121242024': '技术',
            '230810121539014': '华东'
          },
          {
            '10001': '利润',
            '10003': '230810121242021',
            '20001': '利润',
            '010012': '163453.42999391258',
            '230810121242021': '163453.42999391258',
            '230810121242024': '家具',
            '230810121539014': '华东'
          },
          {
            '10001': '利润',
            '10003': '230810121242021',
            '20001': '利润',
            '010012': '215585.69271230698',
            '230810121242021': '215585.69271230698',
            '230810121242024': '办公用品',
            '230810121539014': '华东'
          },
          {
            '10001': '销售额',
            '10003': '230810121242018',
            '20001': '销售额',
            '010011': '745813.5155878067',
            '230810121242018': '745813.5155878067',
            '230810121242024': '办公用品',
            '230810121539014': '华北'
          },
          {
            '10001': '销售额',
            '10003': '230810121242018',
            '20001': '销售额',
            '010011': '781743.5634155273',
            '230810121242018': '781743.5634155273',
            '230810121242024': '技术',
            '230810121539014': '华北'
          },
          {
            '10001': '销售额',
            '10003': '230810121242018',
            '20001': '销售额',
            '010011': '919743.9351348877',
            '230810121242018': '919743.9351348877',
            '230810121242024': '家具',
            '230810121539014': '华北'
          },
          {
            '10001': '利润',
            '10003': '230810121242021',
            '20001': '利润',
            '010012': '137265.85579952598',
            '230810121242021': '137265.85579952598',
            '230810121242024': '办公用品',
            '230810121539014': '华北'
          },
          {
            '10001': '利润',
            '10003': '230810121242021',
            '20001': '利润',
            '010012': '144986.8839621544',
            '230810121242021': '144986.8839621544',
            '230810121242024': '技术',
            '230810121539014': '华北'
          },
          {
            '10001': '利润',
            '10003': '230810121242021',
            '20001': '利润',
            '010012': '148800.47773075104',
            '230810121242021': '148800.47773075104',
            '230810121242024': '家具',
            '230810121539014': '华北'
          },
          {
            '10001': '销售额',
            '10003': '230810121242018',
            '20001': '销售额',
            '010011': '316212.42824935913',
            '230810121242018': '316212.42824935913',
            '230810121242024': '家具',
            '230810121539014': '西北'
          },
          {
            '10001': '销售额',
            '10003': '230810121242018',
            '20001': '销售额',
            '010011': '267870.7928543091',
            '230810121242018': '267870.7928543091',
            '230810121242024': '办公用品',
            '230810121539014': '西北'
          },
          {
            '10001': '销售额',
            '10003': '230810121242018',
            '20001': '销售额',
            '010011': '230956.3768310547',
            '230810121242018': '230956.3768310547',
            '230810121242024': '技术',
            '230810121539014': '西北'
          },
          {
            '10001': '利润',
            '10003': '230810121242021',
            '20001': '利润',
            '010012': '24903.787846319377',
            '230810121242021': '24903.787846319377',
            '230810121242024': '家具',
            '230810121539014': '西北'
          },
          {
            '10001': '利润',
            '10003': '230810121242021',
            '20001': '利润',
            '010012': '49633.47177379578',
            '230810121242021': '49633.47177379578',
            '230810121242024': '办公用品',
            '230810121539014': '西北'
          },
          {
            '10001': '利润',
            '10003': '230810121242021',
            '20001': '利润',
            '010012': '24016.215898036957',
            '230810121242021': '24016.215898036957',
            '230810121242024': '技术',
            '230810121539014': '西北'
          },
          {
            '10001': '销售额',
            '10003': '230810121242018',
            '20001': '销售额',
            '010011': '453898.2000274658',
            '230810121242018': '453898.2000274658',
            '230810121242024': '技术',
            '230810121539014': '西南'
          },
          {
            '10001': '销售额',
            '10003': '230810121242018',
            '20001': '销售额',
            '010011': '347692.57691955566',
            '230810121242018': '347692.57691955566',
            '230810121242024': '办公用品',
            '230810121539014': '西南'
          },
          {
            '10001': '销售额',
            '10003': '230810121242018',
            '20001': '销售额',
            '010011': '501533.7320175171',
            '230810121242018': '501533.7320175171',
            '230810121242024': '家具',
            '230810121539014': '西南'
          },
          {
            '10001': '利润',
            '10003': '230810121242021',
            '20001': '利润',
            '010012': '19061.419725894928',
            '230810121242021': '19061.419725894928',
            '230810121242024': '技术',
            '230810121539014': '西南'
          },
          {
            '10001': '利润',
            '10003': '230810121242021',
            '20001': '利润',
            '010012': '49272.21633812785',
            '230810121242021': '49272.21633812785',
            '230810121242024': '办公用品',
            '230810121539014': '西南'
          },
          {
            '10001': '利润',
            '10003': '230810121242021',
            '20001': '利润',
            '010012': '29303.0919713974',
            '230810121242021': '29303.0919713974',
            '230810121242024': '家具',
            '230810121539014': '西南'
          }
        ],
        '1': [
          {
            '10001': '数量',
            '10003': '230810121242060',
            '20001': '数量',
            '110002': '3622',
            '230810121242024': '办公用品',
            '230810121242060': '3622',
            '230810121539014': '东北'
          },
          {
            '10001': '数量',
            '10003': '230810121242060',
            '20001': '数量',
            '110002': '1371',
            '230810121242024': '技术',
            '230810121242060': '1371',
            '230810121539014': '东北'
          },
          {
            '10001': '数量',
            '10003': '230810121242060',
            '20001': '数量',
            '110002': '1470',
            '230810121242024': '家具',
            '230810121242060': '1470',
            '230810121539014': '东北'
          },
          {
            '10001': '数量',
            '10003': '230810121242060',
            '20001': '数量',
            '110002': '5590',
            '230810121242024': '办公用品',
            '230810121242060': '5590',
            '230810121539014': '中南'
          },
          {
            '10001': '数量',
            '10003': '230810121242060',
            '20001': '数量',
            '110002': '2023',
            '230810121242024': '家具',
            '230810121242060': '2023',
            '230810121539014': '中南'
          },
          {
            '10001': '数量',
            '10003': '230810121242060',
            '20001': '数量',
            '110002': '2087',
            '230810121242024': '技术',
            '230810121242060': '2087',
            '230810121539014': '中南'
          },
          {
            '10001': '数量',
            '10003': '230810121242060',
            '20001': '数量',
            '110002': '2183',
            '230810121242024': '技术',
            '230810121242060': '2183',
            '230810121539014': '华东'
          },
          {
            '10001': '数量',
            '10003': '230810121242060',
            '20001': '数量',
            '110002': '2517',
            '230810121242024': '家具',
            '230810121242060': '2517',
            '230810121539014': '华东'
          },
          {
            '10001': '数量',
            '10003': '230810121242060',
            '20001': '数量',
            '110002': '6341',
            '230810121242024': '办公用品',
            '230810121242060': '6341',
            '230810121539014': '华东'
          },
          {
            '10001': '数量',
            '10003': '230810121242060',
            '20001': '数量',
            '110002': '3020',
            '230810121242024': '办公用品',
            '230810121242060': '3020',
            '230810121539014': '华北'
          },
          {
            '10001': '数量',
            '10003': '230810121242060',
            '20001': '数量',
            '110002': '927',
            '230810121242024': '技术',
            '230810121242060': '927',
            '230810121539014': '华北'
          },
          {
            '10001': '数量',
            '10003': '230810121242060',
            '20001': '数量',
            '110002': '1199',
            '230810121242024': '家具',
            '230810121242060': '1199',
            '230810121539014': '华北'
          },
          {
            '10001': '数量',
            '10003': '230810121242060',
            '20001': '数量',
            '110002': '468',
            '230810121242024': '家具',
            '230810121242060': '468',
            '230810121539014': '西北'
          },
          {
            '10001': '数量',
            '10003': '230810121242060',
            '20001': '数量',
            '110002': '970',
            '230810121242024': '办公用品',
            '230810121242060': '970',
            '230810121539014': '西北'
          },
          {
            '10001': '数量',
            '10003': '230810121242060',
            '20001': '数量',
            '110002': '347',
            '230810121242024': '技术',
            '230810121242060': '347',
            '230810121539014': '西北'
          },
          {
            '10001': '数量',
            '10003': '230810121242060',
            '20001': '数量',
            '110002': '727',
            '230810121242024': '技术',
            '230810121242060': '727',
            '230810121539014': '西南'
          },
          {
            '10001': '数量',
            '10003': '230810121242060',
            '20001': '数量',
            '110002': '1858',
            '230810121242024': '办公用品',
            '230810121242060': '1858',
            '230810121539014': '西南'
          },
          {
            '10001': '数量',
            '10003': '230810121242060',
            '20001': '数量',
            '110002': '814',
            '230810121242024': '家具',
            '230810121242060': '814',
            '230810121539014': '西南'
          }
        ]
      },
      defaultHeaderRowHeight: 18,
      indicatorTitle: ' ',
      corner: {
        titleOnDimension: 'row'
      },
      autoWrapText: true,
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
          hover: {
            cellBgColor: 'rgba(20, 20, 20, 0.08)'
          }
        },
        rowHeaderStyle: {
          borderColor: 'rgba(0,4,20,0.2)',
          fontSize: 12,
          color: '#333333',
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
          hover: {
            cellBgColor: ''
          }
        },
        cornerRightTopCellStyle: {
          borderColor: 'rgba(0,4,20,0.2)',
          borderLineWidth: [0, 0, 1, 1],
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
          borderLineWidth: [1, 0, 1, 1]
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
          },
          {
            label: '数量',
            shape: {
              fill: '#FF8406',
              symbolType: 'square'
            }
          }
        ],
        padding: [16, 0, 0, 0]
      },
      title: {
        text: '',
        align: 'center',
        orient: 'top',
        textStyle: {
          fontSize: 12,
          fill: '#333333',
          fontWeight: 'bold'
        }
      },
      hash: '92b01dab92f6715a50c38888c7444e59'
    };

    tableInstance.updateOption(newOption);
  };
  window.updateOption1 = () => {
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
      data: [
        {
          id: 'data',
          values: [
            [
              {
                '10001': '销售额',
                '10003': '230808211907009',
                '20001': '销售额',
                '010002': '815039.5979347229',
                '230804193430032': '西北',
                '230808211907009': '815039.5979347229'
              },
              {
                '10001': '销售额',
                '10003': '230808211907009',
                '20001': '销售额',
                '010002': '4137415.0951108932',
                '230804193430032': '中南',
                '230808211907009': '4137415.0951108932'
              },
              {
                '10001': '销售额',
                '10003': '230808211907009',
                '20001': '销售额',
                '010002': '2681567.4745378494',
                '230804193430032': '东北',
                '230808211907009': '2681567.4745378494'
              },
              {
                '10001': '销售额',
                '10003': '230808211907009',
                '20001': '销售额',
                '010002': '1303124.5089645386',
                '230804193430032': '西南',
                '230808211907009': '1303124.5089645386'
              },
              {
                '10001': '销售额',
                '10003': '230808211907009',
                '20001': '销售额',
                '010002': '4684506.442247391',
                '230804193430032': '华东',
                '230808211907009': '4684506.442247391'
              },
              {
                '10001': '销售额',
                '10003': '230808211907009',
                '20001': '销售额',
                '010002': '2447301.0141382217',
                '230804193430032': '华北',
                '230808211907009': '2447301.0141382217'
              }
            ],
            [
              {
                '10001': '销售额',
                '10003': '230810113357011',
                '20001': '销售额',
                '110002': '815039.5979347229',
                '230804193430032': '西北',
                '230810113357011': '815039.5979347229'
              },
              {
                '10001': '销售额',
                '10003': '230810113357011',
                '20001': '销售额',
                '110002': '4137415.0951108932',
                '230804193430032': '中南',
                '230810113357011': '4137415.0951108932'
              },
              {
                '10001': '销售额',
                '10003': '230810113357011',
                '20001': '销售额',
                '110002': '2681567.4745378494',
                '230804193430032': '东北',
                '230810113357011': '2681567.4745378494'
              },
              {
                '10001': '销售额',
                '10003': '230810113357011',
                '20001': '销售额',
                '110002': '1303124.5089645386',
                '230804193430032': '西南',
                '230810113357011': '1303124.5089645386'
              },
              {
                '10001': '销售额',
                '10003': '230810113357011',
                '20001': '销售额',
                '110002': '4684506.442247391',
                '230804193430032': '华东',
                '230810113357011': '4684506.442247391'
              },
              {
                '10001': '销售额',
                '10003': '230810113357011',
                '20001': '销售额',
                '110002': '2447301.0141382217',
                '230804193430032': '华北',
                '230810113357011': '2447301.0141382217'
              }
            ],
            [
              {
                '10001': '数量',
                '10003': '230810114507011',
                '20001': '数量',
                '210002': '1785',
                '230804193430032': '西北',
                '230810114507011': '1785'
              },
              {
                '10001': '数量',
                '10003': '230810114507011',
                '20001': '数量',
                '210002': '9700',
                '230804193430032': '中南',
                '230810114507011': '9700'
              },
              {
                '10001': '数量',
                '10003': '230810114507011',
                '20001': '数量',
                '210002': '6463',
                '230804193430032': '东北',
                '230810114507011': '6463'
              },
              {
                '10001': '数量',
                '10003': '230810114507011',
                '20001': '数量',
                '210002': '3399',
                '230804193430032': '西南',
                '230810114507011': '3399'
              },
              {
                '10001': '数量',
                '10003': '230810114507011',
                '20001': '数量',
                '210002': '11041',
                '230804193430032': '华东',
                '230810114507011': '11041'
              },
              {
                '10001': '数量',
                '10003': '230810114507011',
                '20001': '数量',
                '210002': '5146',
                '230804193430032': '华北',
                '230810114507011': '5146'
              }
            ],
            [
              {
                '10001': '折扣',
                '10003': '230810114507014',
                '20001': '折扣',
                '310002': '53.40000084042549',
                '230804193430032': '西北',
                '230810114507014': '53.40000084042549'
              },
              {
                '10001': '折扣',
                '10003': '230810114507014',
                '20001': '折扣',
                '310002': '232.15000347048044',
                '230804193430032': '中南',
                '230810114507014': '232.15000347048044'
              },
              {
                '10001': '折扣',
                '10003': '230810114507014',
                '20001': '折扣',
                '310002': '234.75000359117985',
                '230804193430032': '东北',
                '230810114507014': '234.75000359117985'
              },
              {
                '10001': '折扣',
                '10003': '230810114507014',
                '20001': '折扣',
                '310002': '134.2000020891428',
                '230804193430032': '西南',
                '230810114507014': '134.2000020891428'
              },
              {
                '10001': '折扣',
                '10003': '230810114507014',
                '20001': '折扣',
                '310002': '331.10000520944595',
                '230804193430032': '华东',
                '230810114507014': '331.10000520944595'
              },
              {
                '10001': '折扣',
                '10003': '230810114507014',
                '20001': '折扣',
                '310002': '74.10000109672546',
                '230804193430032': '华北',
                '230810114507014': '74.10000109672546'
              }
            ],
            [
              {
                '10001': '利润',
                '10003': '230810114507017',
                '20001': '利润',
                '410002': '98553.47551815212',
                '230804193430032': '西北',
                '230810114507017': '98553.47551815212'
              },
              {
                '10001': '利润',
                '10003': '230810114507017',
                '20001': '利润',
                '410002': '670885.3138181865',
                '230804193430032': '中南',
                '230810114507017': '670885.3138181865'
              },
              {
                '10001': '利润',
                '10003': '230810114507017',
                '20001': '利润',
                '410002': '242191.509221375',
                '230804193430032': '东北',
                '230810114507017': '242191.509221375'
              },
              {
                '10001': '利润',
                '10003': '230810114507017',
                '20001': '利润',
                '410002': '97636.72803542018',
                '230804193430032': '西南',
                '230810114507017': '97636.72803542018'
              },
              {
                '10001': '利润',
                '10003': '230810114507017',
                '20001': '利润',
                '410002': '607218.6830426604',
                '230804193430032': '华东',
                '230810114507017': '607218.6830426604'
              },
              {
                '10001': '利润',
                '10003': '230810114507017',
                '20001': '利润',
                '410002': '431053.2174924314',
                '230804193430032': '华北',
                '230810114507017': '431053.2174924314'
              }
            ]
          ],
          fields: {
            '10001': {
              alias: '指标名称 '
            },
            '20001': {
              alias: '图例项 ',
              domain: ['销售额', '数量', '折扣', '利润'],
              lockStatisticsByDomain: true
            },
            '110002': {
              alias: '指标值 '
            },
            '210002': {
              alias: '指标值 '
            },
            '310002': {
              alias: '指标值 '
            },
            '410002': {
              alias: '指标值 '
            },
            '010002': {
              alias: '指标值 '
            },
            '230804193430032': {
              alias: '地区',
              domain: ['东北', '华北', '华东', '西北', '西南', '中南'],
              lockStatisticsByDomain: true,
              sortIndex: 0
            },
            '230808211907009': {
              alias: '销售额'
            },
            '230810113357011': {
              alias: '销售额'
            },
            '230810114507011': {
              alias: '数量'
            },
            '230810114507014': {
              alias: '折扣'
            },
            '230810114507017': {
              alias: '利润'
            }
          }
        }
      ],
      seriesField: '20001',
      color: {
        field: '20001',
        type: 'ordinal',
        range: ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00'],
        specified: {},
        domain: ['销售额', '数量', '折扣', '利润']
      },
      label: {
        visible: true,
        overlap: {
          hideOnHit: true,
          clampForce: true
        },
        style: {
          fontSize: 12,
          fontWeight: 'normal',
          fill: '#363839',
          stroke: 'rgba(255, 255, 255, 0.8)',
          lineWidth: 2,
          strokeOpacity: 1
        },
        position: 'outside',
        smartInvert: false
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
              stroke: '#f5222d',
              lineWidth: 5,
              lineDash: [5, 5]
            }
          },
          orient: 'bottom',
          visible: true,
          domainLine: {
            visible: true,
            style: {
              lineWidth: 1,
              stroke: '#eeb641'
            }
          },
          title: {
            visible: true,
            text: '地区',
            style: {
              fontSize: 12,
              fill: '#eeb641',
              fontWeight: 'normal'
            }
          },
          label: {
            visible: true,
            style: {
              fontSize: 12,
              fill: '#eeb641',
              angle: 45,
              fontWeight: 'normal'
            },
            minGap: 4,
            flush: false
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
      line: {
        style: {
          curveType: {
            type: 'ordinal',
            field: '20001',
            range: ['linear'],
            domain: ['销售额', '数量', '折扣', '利润']
          },
          lineWidth: {
            type: 'ordinal',
            field: '20001',
            range: [3],
            domain: ['销售额', '数量', '折扣', '利润']
          },
          lineDash: {
            type: 'ordinal',
            field: '20001',
            range: [[0, 0]],
            domain: ['销售额', '数量', '折扣', '利润']
          }
        }
      },
      area: {
        style: {
          curveType: {
            type: 'ordinal',
            field: '20001',
            range: ['linear'],
            domain: ['销售额', '数量', '折扣', '利润']
          }
        }
      },
      point: {
        style: {
          shape: {
            type: 'ordinal',
            field: '20001',
            range: ['circle'],
            domain: ['销售额', '数量', '折扣', '利润']
          },
          size: {
            type: 'ordinal',
            field: '20001',
            range: [8],
            domain: ['销售额', '数量', '折扣', '利润']
          },
          fill: {
            field: '20001',
            type: 'ordinal',
            range: ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00'],
            specified: {},
            domain: ['销售额', '数量', '折扣', '利润']
          },
          stroke: {
            field: '20001',
            type: 'ordinal',
            range: ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00'],
            specified: {},
            domain: ['销售额', '数量', '折扣', '利润']
          },
          strokeOpacity: {
            type: 'ordinal',
            field: '20001',
            range: [1],
            domain: ['销售额', '数量', '折扣', '利润']
          },
          fillOpacity: {
            type: 'ordinal',
            field: '20001',
            range: [1],
            domain: ['销售额', '数量', '折扣', '利润']
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
      records: {
        '0': [
          {
            '10001': '销售额',
            '10003': '230808211907009',
            '20001': '销售额',
            '010002': '815039.5979347229',
            '230804193430032': '西北',
            '230808211907009': '815039.5979347229'
          },
          {
            '10001': '销售额',
            '10003': '230808211907009',
            '20001': '销售额',
            '010002': '4137415.0951108932',
            '230804193430032': '中南',
            '230808211907009': '4137415.0951108932'
          },
          {
            '10001': '销售额',
            '10003': '230808211907009',
            '20001': '销售额',
            '010002': '2681567.4745378494',
            '230804193430032': '东北',
            '230808211907009': '2681567.4745378494'
          },
          {
            '10001': '销售额',
            '10003': '230808211907009',
            '20001': '销售额',
            '010002': '1303124.5089645386',
            '230804193430032': '西南',
            '230808211907009': '1303124.5089645386'
          },
          {
            '10001': '销售额',
            '10003': '230808211907009',
            '20001': '销售额',
            '010002': '4684506.442247391',
            '230804193430032': '华东',
            '230808211907009': '4684506.442247391'
          },
          {
            '10001': '销售额',
            '10003': '230808211907009',
            '20001': '销售额',
            '010002': '2447301.0141382217',
            '230804193430032': '华北',
            '230808211907009': '2447301.0141382217'
          }
        ],
        '1': [
          {
            '10001': '销售额',
            '10003': '230810113357011',
            '20001': '销售额',
            '110002': '815039.5979347229',
            '230804193430032': '西北',
            '230810113357011': '815039.5979347229'
          },
          {
            '10001': '销售额',
            '10003': '230810113357011',
            '20001': '销售额',
            '110002': '4137415.0951108932',
            '230804193430032': '中南',
            '230810113357011': '4137415.0951108932'
          },
          {
            '10001': '销售额',
            '10003': '230810113357011',
            '20001': '销售额',
            '110002': '2681567.4745378494',
            '230804193430032': '东北',
            '230810113357011': '2681567.4745378494'
          },
          {
            '10001': '销售额',
            '10003': '230810113357011',
            '20001': '销售额',
            '110002': '1303124.5089645386',
            '230804193430032': '西南',
            '230810113357011': '1303124.5089645386'
          },
          {
            '10001': '销售额',
            '10003': '230810113357011',
            '20001': '销售额',
            '110002': '4684506.442247391',
            '230804193430032': '华东',
            '230810113357011': '4684506.442247391'
          },
          {
            '10001': '销售额',
            '10003': '230810113357011',
            '20001': '销售额',
            '110002': '2447301.0141382217',
            '230804193430032': '华北',
            '230810113357011': '2447301.0141382217'
          }
        ],
        '2': [
          {
            '10001': '数量',
            '10003': '230810114507011',
            '20001': '数量',
            '210002': '1785',
            '230804193430032': '西北',
            '230810114507011': '1785'
          },
          {
            '10001': '数量',
            '10003': '230810114507011',
            '20001': '数量',
            '210002': '9700',
            '230804193430032': '中南',
            '230810114507011': '9700'
          },
          {
            '10001': '数量',
            '10003': '230810114507011',
            '20001': '数量',
            '210002': '6463',
            '230804193430032': '东北',
            '230810114507011': '6463'
          },
          {
            '10001': '数量',
            '10003': '230810114507011',
            '20001': '数量',
            '210002': '3399',
            '230804193430032': '西南',
            '230810114507011': '3399'
          },
          {
            '10001': '数量',
            '10003': '230810114507011',
            '20001': '数量',
            '210002': '11041',
            '230804193430032': '华东',
            '230810114507011': '11041'
          },
          {
            '10001': '数量',
            '10003': '230810114507011',
            '20001': '数量',
            '210002': '5146',
            '230804193430032': '华北',
            '230810114507011': '5146'
          }
        ],
        '3': [
          {
            '10001': '折扣',
            '10003': '230810114507014',
            '20001': '折扣',
            '310002': '53.40000084042549',
            '230804193430032': '西北',
            '230810114507014': '53.40000084042549'
          },
          {
            '10001': '折扣',
            '10003': '230810114507014',
            '20001': '折扣',
            '310002': '232.15000347048044',
            '230804193430032': '中南',
            '230810114507014': '232.15000347048044'
          },
          {
            '10001': '折扣',
            '10003': '230810114507014',
            '20001': '折扣',
            '310002': '234.75000359117985',
            '230804193430032': '东北',
            '230810114507014': '234.75000359117985'
          },
          {
            '10001': '折扣',
            '10003': '230810114507014',
            '20001': '折扣',
            '310002': '134.2000020891428',
            '230804193430032': '西南',
            '230810114507014': '134.2000020891428'
          },
          {
            '10001': '折扣',
            '10003': '230810114507014',
            '20001': '折扣',
            '310002': '331.10000520944595',
            '230804193430032': '华东',
            '230810114507014': '331.10000520944595'
          },
          {
            '10001': '折扣',
            '10003': '230810114507014',
            '20001': '折扣',
            '310002': '74.10000109672546',
            '230804193430032': '华北',
            '230810114507014': '74.10000109672546'
          }
        ],
        '4': [
          {
            '10001': '利润',
            '10003': '230810114507017',
            '20001': '利润',
            '410002': '98553.47551815212',
            '230804193430032': '西北',
            '230810114507017': '98553.47551815212'
          },
          {
            '10001': '利润',
            '10003': '230810114507017',
            '20001': '利润',
            '410002': '670885.3138181865',
            '230804193430032': '中南',
            '230810114507017': '670885.3138181865'
          },
          {
            '10001': '利润',
            '10003': '230810114507017',
            '20001': '利润',
            '410002': '242191.509221375',
            '230804193430032': '东北',
            '230810114507017': '242191.509221375'
          },
          {
            '10001': '利润',
            '10003': '230810114507017',
            '20001': '利润',
            '410002': '97636.72803542018',
            '230804193430032': '西南',
            '230810114507017': '97636.72803542018'
          },
          {
            '10001': '利润',
            '10003': '230810114507017',
            '20001': '利润',
            '410002': '607218.6830426604',
            '230804193430032': '华东',
            '230810114507017': '607218.6830426604'
          },
          {
            '10001': '利润',
            '10003': '230810114507017',
            '20001': '利润',
            '410002': '431053.2174924314',
            '230804193430032': '华北',
            '230810114507017': '431053.2174924314'
          }
        ]
      },
      indicatorsAsCol: false,
      indicators: [
        {
          indicatorKey: '0',
          width: 'auto',
          title: 'title',
          cellType: 'chart',
          chartModule: 'vchart',
          chartSpec: {
            type: 'bar',
            xField: ['230804193430032', '10001'],
            yField: ['010002'],
            stack: false,
            label: {
              visible: true,
              overlap: {
                hideOnHit: true,
                clampForce: true
              },
              style: {
                fontSize: 12,
                fontWeight: 'normal',
                fill: '#363839',
                stroke: 'rgba(255, 255, 255, 0.8)',
                lineWidth: 2,
                strokeOpacity: 1
              },
              position: 'outside',
              smartInvert: false
            },
            area: {
              style: {
                curveType: {
                  type: 'ordinal',
                  field: '20001',
                  range: ['linear'],
                  domain: ['销售额', '数量', '折扣', '利润']
                }
              }
            },
            line: {
              style: {
                curveType: {
                  type: 'ordinal',
                  field: '20001',
                  range: ['linear'],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                lineWidth: {
                  type: 'ordinal',
                  field: '20001',
                  range: [3],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                lineDash: {
                  type: 'ordinal',
                  field: '20001',
                  range: [[0, 0]],
                  domain: ['销售额', '数量', '折扣', '利润']
                }
              }
            },
            point: {
              style: {
                shape: {
                  type: 'ordinal',
                  field: '20001',
                  range: ['circle'],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                size: {
                  type: 'ordinal',
                  field: '20001',
                  range: [8],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                fill: {
                  field: '20001',
                  type: 'ordinal',
                  range: ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00'],
                  specified: {},
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                stroke: {
                  field: '20001',
                  type: 'ordinal',
                  range: ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00'],
                  specified: {},
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                strokeOpacity: {
                  type: 'ordinal',
                  field: '20001',
                  range: [1],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                fillOpacity: {
                  type: 'ordinal',
                  field: '20001',
                  range: [1],
                  domain: ['销售额', '数量', '折扣', '利润']
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
            direction: 'vertical',
            axes: [
              {
                id: '0',
                type: 'linear',
                tick: {
                  visible: false,
                  style: {
                    stroke: '#f5222d'
                  }
                },
                niceType: 'accurateFirst',
                grid: {
                  visible: false,
                  style: {
                    stroke: '#f5222d',
                    lineWidth: 5,
                    lineDash: [5, 5]
                  }
                },
                orient: 'left',
                visible: true,
                domainLine: {
                  visible: true,
                  style: {
                    lineWidth: 1,
                    stroke: '#f5222d'
                  }
                },
                title: {
                  visible: true,
                  text: '销售额',
                  style: {
                    fontSize: 10,
                    fill: '#f5222d',
                    fontWeight: 'normal'
                  }
                },
                label: {
                  visible: true,
                  style: {
                    fontSize: 14,
                    fill: '#f5222d',
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
                  domain: ['销售额', '数量', '折扣', '利润'],
                  lockStatisticsByDomain: true
                },
                '110002': {
                  alias: '指标值 '
                },
                '210002': {
                  alias: '指标值 '
                },
                '310002': {
                  alias: '指标值 '
                },
                '410002': {
                  alias: '指标值 '
                },
                '010002': {
                  alias: '指标值 '
                },
                '230804193430032': {
                  alias: '地区',
                  domain: ['东北', '华北', '华东', '西北', '西南', '中南'],
                  lockStatisticsByDomain: true,
                  sortIndex: 0
                },
                '230808211907009': {
                  alias: '销售额'
                },
                '230810113357011': {
                  alias: '销售额'
                },
                '230810114507011': {
                  alias: '数量'
                },
                '230810114507014': {
                  alias: '折扣'
                },
                '230810114507017': {
                  alias: '利润'
                }
              }
            },
            seriesField: '20001',
            color: {
              field: '20001',
              type: 'ordinal',
              range: ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00'],
              specified: {},
              domain: ['销售额', '数量', '折扣', '利润']
            }
          }
        },
        {
          indicatorKey: '1',
          width: 'auto',
          title: 'title',
          cellType: 'chart',
          chartModule: 'vchart',
          chartSpec: {
            type: 'line',
            xField: ['230804193430032', '10001'],
            yField: ['110002'],
            stack: false,
            label: {
              visible: true,
              overlap: {
                hideOnHit: true,
                clampForce: true
              },
              style: {
                fontSize: 12,
                fontWeight: 'normal',
                fill: '#363839',
                stroke: 'rgba(255, 255, 255, 0.8)',
                lineWidth: 2,
                strokeOpacity: 1
              },
              position: 'outside',
              smartInvert: false
            },
            area: {
              style: {
                curveType: {
                  type: 'ordinal',
                  field: '20001',
                  range: ['linear'],
                  domain: ['销售额', '数量', '折扣', '利润']
                }
              }
            },
            line: {
              style: {
                curveType: {
                  type: 'ordinal',
                  field: '20001',
                  range: ['linear'],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                lineWidth: {
                  type: 'ordinal',
                  field: '20001',
                  range: [3],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                lineDash: {
                  type: 'ordinal',
                  field: '20001',
                  range: [[0, 0]],
                  domain: ['销售额', '数量', '折扣', '利润']
                }
              }
            },
            point: {
              style: {
                shape: {
                  type: 'ordinal',
                  field: '20001',
                  range: ['circle'],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                size: {
                  type: 'ordinal',
                  field: '20001',
                  range: [8],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                fill: {
                  field: '20001',
                  type: 'ordinal',
                  range: ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00'],
                  specified: {},
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                stroke: {
                  field: '20001',
                  type: 'ordinal',
                  range: ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00'],
                  specified: {},
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                strokeOpacity: {
                  type: 'ordinal',
                  field: '20001',
                  range: [1],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                fillOpacity: {
                  type: 'ordinal',
                  field: '20001',
                  range: [1],
                  domain: ['销售额', '数量', '折扣', '利润']
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
            direction: 'vertical',
            axes: [
              {
                id: '1',
                type: 'linear',
                tick: {
                  visible: false,
                  style: {
                    stroke: '#f5222d'
                  }
                },
                niceType: 'accurateFirst',
                grid: {
                  visible: false,
                  style: {
                    stroke: '#f5222d',
                    lineWidth: 5,
                    lineDash: [5, 5]
                  }
                },
                orient: 'left',
                visible: true,
                domainLine: {
                  visible: true,
                  style: {
                    lineWidth: 1,
                    stroke: '#f5222d'
                  }
                },
                title: {
                  visible: true,
                  text: '销售额',
                  style: {
                    fontSize: 10,
                    fill: '#f5222d',
                    fontWeight: 'normal'
                  }
                },
                label: {
                  visible: true,
                  style: {
                    fontSize: 14,
                    fill: '#f5222d',
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
                  domain: ['销售额', '数量', '折扣', '利润'],
                  lockStatisticsByDomain: true
                },
                '110002': {
                  alias: '指标值 '
                },
                '210002': {
                  alias: '指标值 '
                },
                '310002': {
                  alias: '指标值 '
                },
                '410002': {
                  alias: '指标值 '
                },
                '010002': {
                  alias: '指标值 '
                },
                '230804193430032': {
                  alias: '地区',
                  domain: ['东北', '华北', '华东', '西北', '西南', '中南'],
                  lockStatisticsByDomain: true,
                  sortIndex: 0
                },
                '230808211907009': {
                  alias: '销售额'
                },
                '230810113357011': {
                  alias: '销售额'
                },
                '230810114507011': {
                  alias: '数量'
                },
                '230810114507014': {
                  alias: '折扣'
                },
                '230810114507017': {
                  alias: '利润'
                }
              }
            },
            seriesField: '20001',
            color: {
              field: '20001',
              type: 'ordinal',
              range: ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00'],
              specified: {},
              domain: ['销售额', '数量', '折扣', '利润']
            }
          }
        },
        {
          indicatorKey: '2',
          width: 'auto',
          title: 'title',
          cellType: 'chart',
          chartModule: 'vchart',
          chartSpec: {
            type: 'line',
            xField: ['230804193430032', '10001'],
            yField: ['210002'],
            stack: false,
            label: {
              visible: true,
              overlap: {
                hideOnHit: true,
                clampForce: true
              },
              style: {
                fontSize: 12,
                fontWeight: 'normal',
                fill: '#363839',
                stroke: 'rgba(255, 255, 255, 0.8)',
                lineWidth: 2,
                strokeOpacity: 1
              },
              position: 'outside',
              smartInvert: false
            },
            area: {
              style: {
                curveType: {
                  type: 'ordinal',
                  field: '20001',
                  range: ['linear'],
                  domain: ['销售额', '数量', '折扣', '利润']
                }
              }
            },
            line: {
              style: {
                curveType: {
                  type: 'ordinal',
                  field: '20001',
                  range: ['linear'],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                lineWidth: {
                  type: 'ordinal',
                  field: '20001',
                  range: [3],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                lineDash: {
                  type: 'ordinal',
                  field: '20001',
                  range: [[0, 0]],
                  domain: ['销售额', '数量', '折扣', '利润']
                }
              }
            },
            point: {
              style: {
                shape: {
                  type: 'ordinal',
                  field: '20001',
                  range: ['circle'],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                size: {
                  type: 'ordinal',
                  field: '20001',
                  range: [8],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                fill: {
                  field: '20001',
                  type: 'ordinal',
                  range: ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00'],
                  specified: {},
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                stroke: {
                  field: '20001',
                  type: 'ordinal',
                  range: ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00'],
                  specified: {},
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                strokeOpacity: {
                  type: 'ordinal',
                  field: '20001',
                  range: [1],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                fillOpacity: {
                  type: 'ordinal',
                  field: '20001',
                  range: [1],
                  domain: ['销售额', '数量', '折扣', '利润']
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
            direction: 'vertical',
            axes: [
              {
                id: '2',
                type: 'linear',
                tick: {
                  visible: false,
                  style: {
                    stroke: '#f5222d'
                  }
                },
                niceType: 'accurateFirst',
                grid: {
                  visible: false,
                  style: {
                    stroke: '#f5222d',
                    lineWidth: 5,
                    lineDash: [5, 5]
                  }
                },
                orient: 'left',
                visible: true,
                domainLine: {
                  visible: true,
                  style: {
                    lineWidth: 1,
                    stroke: '#f5222d'
                  }
                },
                title: {
                  visible: true,
                  text: '数量',
                  style: {
                    fontSize: 10,
                    fill: '#f5222d',
                    fontWeight: 'normal'
                  }
                },
                label: {
                  visible: true,
                  style: {
                    fontSize: 14,
                    fill: '#f5222d',
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
              sortIndex: 2,
              id: 'data',
              fields: {
                '10001': {
                  alias: '指标名称 '
                },
                '20001': {
                  alias: '图例项 ',
                  domain: ['销售额', '数量', '折扣', '利润'],
                  lockStatisticsByDomain: true
                },
                '110002': {
                  alias: '指标值 '
                },
                '210002': {
                  alias: '指标值 '
                },
                '310002': {
                  alias: '指标值 '
                },
                '410002': {
                  alias: '指标值 '
                },
                '010002': {
                  alias: '指标值 '
                },
                '230804193430032': {
                  alias: '地区',
                  domain: ['东北', '华北', '华东', '西北', '西南', '中南'],
                  lockStatisticsByDomain: true,
                  sortIndex: 0
                },
                '230808211907009': {
                  alias: '销售额'
                },
                '230810113357011': {
                  alias: '销售额'
                },
                '230810114507011': {
                  alias: '数量'
                },
                '230810114507014': {
                  alias: '折扣'
                },
                '230810114507017': {
                  alias: '利润'
                }
              }
            },
            seriesField: '20001',
            color: {
              field: '20001',
              type: 'ordinal',
              range: ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00'],
              specified: {},
              domain: ['销售额', '数量', '折扣', '利润']
            }
          }
        },
        {
          indicatorKey: '3',
          width: 'auto',
          title: 'title',
          cellType: 'chart',
          chartModule: 'vchart',
          chartSpec: {
            type: 'line',
            xField: ['230804193430032', '10001'],
            yField: ['310002'],
            stack: false,
            label: {
              visible: true,
              overlap: {
                hideOnHit: true,
                clampForce: true
              },
              style: {
                fontSize: 12,
                fontWeight: 'normal',
                fill: '#363839',
                stroke: 'rgba(255, 255, 255, 0.8)',
                lineWidth: 2,
                strokeOpacity: 1
              },
              position: 'outside',
              smartInvert: false
            },
            area: {
              style: {
                curveType: {
                  type: 'ordinal',
                  field: '20001',
                  range: ['linear'],
                  domain: ['销售额', '数量', '折扣', '利润']
                }
              }
            },
            line: {
              style: {
                curveType: {
                  type: 'ordinal',
                  field: '20001',
                  range: ['linear'],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                lineWidth: {
                  type: 'ordinal',
                  field: '20001',
                  range: [3],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                lineDash: {
                  type: 'ordinal',
                  field: '20001',
                  range: [[0, 0]],
                  domain: ['销售额', '数量', '折扣', '利润']
                }
              }
            },
            point: {
              style: {
                shape: {
                  type: 'ordinal',
                  field: '20001',
                  range: ['circle'],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                size: {
                  type: 'ordinal',
                  field: '20001',
                  range: [8],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                fill: {
                  field: '20001',
                  type: 'ordinal',
                  range: ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00'],
                  specified: {},
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                stroke: {
                  field: '20001',
                  type: 'ordinal',
                  range: ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00'],
                  specified: {},
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                strokeOpacity: {
                  type: 'ordinal',
                  field: '20001',
                  range: [1],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                fillOpacity: {
                  type: 'ordinal',
                  field: '20001',
                  range: [1],
                  domain: ['销售额', '数量', '折扣', '利润']
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
            direction: 'vertical',
            axes: [
              {
                id: '3',
                type: 'linear',
                tick: {
                  visible: false,
                  style: {
                    stroke: '#f5222d'
                  }
                },
                niceType: 'accurateFirst',
                grid: {
                  visible: false,
                  style: {
                    stroke: '#f5222d',
                    lineWidth: 5,
                    lineDash: [5, 5]
                  }
                },
                orient: 'left',
                visible: true,
                domainLine: {
                  visible: true,
                  style: {
                    lineWidth: 1,
                    stroke: '#f5222d'
                  }
                },
                title: {
                  visible: true,
                  text: '折扣',
                  style: {
                    fontSize: 10,
                    fill: '#f5222d',
                    fontWeight: 'normal'
                  }
                },
                label: {
                  visible: true,
                  style: {
                    fontSize: 14,
                    fill: '#f5222d',
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
              sortIndex: 3,
              id: 'data',
              fields: {
                '10001': {
                  alias: '指标名称 '
                },
                '20001': {
                  alias: '图例项 ',
                  domain: ['销售额', '数量', '折扣', '利润'],
                  lockStatisticsByDomain: true
                },
                '110002': {
                  alias: '指标值 '
                },
                '210002': {
                  alias: '指标值 '
                },
                '310002': {
                  alias: '指标值 '
                },
                '410002': {
                  alias: '指标值 '
                },
                '010002': {
                  alias: '指标值 '
                },
                '230804193430032': {
                  alias: '地区',
                  domain: ['东北', '华北', '华东', '西北', '西南', '中南'],
                  lockStatisticsByDomain: true,
                  sortIndex: 0
                },
                '230808211907009': {
                  alias: '销售额'
                },
                '230810113357011': {
                  alias: '销售额'
                },
                '230810114507011': {
                  alias: '数量'
                },
                '230810114507014': {
                  alias: '折扣'
                },
                '230810114507017': {
                  alias: '利润'
                }
              }
            },
            seriesField: '20001',
            color: {
              field: '20001',
              type: 'ordinal',
              range: ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00'],
              specified: {},
              domain: ['销售额', '数量', '折扣', '利润']
            }
          }
        },
        {
          indicatorKey: '4',
          width: 'auto',
          title: 'title',
          cellType: 'chart',
          chartModule: 'vchart',
          chartSpec: {
            type: 'line',
            xField: ['230804193430032', '10001'],
            yField: ['410002'],
            stack: false,
            label: {
              visible: true,
              overlap: {
                hideOnHit: true,
                clampForce: true
              },
              style: {
                fontSize: 12,
                fontWeight: 'normal',
                fill: '#363839',
                stroke: 'rgba(255, 255, 255, 0.8)',
                lineWidth: 2,
                strokeOpacity: 1
              },
              position: 'outside',
              smartInvert: false
            },
            area: {
              style: {
                curveType: {
                  type: 'ordinal',
                  field: '20001',
                  range: ['linear'],
                  domain: ['销售额', '数量', '折扣', '利润']
                }
              }
            },
            line: {
              style: {
                curveType: {
                  type: 'ordinal',
                  field: '20001',
                  range: ['linear'],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                lineWidth: {
                  type: 'ordinal',
                  field: '20001',
                  range: [3],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                lineDash: {
                  type: 'ordinal',
                  field: '20001',
                  range: [[0, 0]],
                  domain: ['销售额', '数量', '折扣', '利润']
                }
              }
            },
            point: {
              style: {
                shape: {
                  type: 'ordinal',
                  field: '20001',
                  range: ['circle'],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                size: {
                  type: 'ordinal',
                  field: '20001',
                  range: [8],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                fill: {
                  field: '20001',
                  type: 'ordinal',
                  range: ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00'],
                  specified: {},
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                stroke: {
                  field: '20001',
                  type: 'ordinal',
                  range: ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00'],
                  specified: {},
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                strokeOpacity: {
                  type: 'ordinal',
                  field: '20001',
                  range: [1],
                  domain: ['销售额', '数量', '折扣', '利润']
                },
                fillOpacity: {
                  type: 'ordinal',
                  field: '20001',
                  range: [1],
                  domain: ['销售额', '数量', '折扣', '利润']
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
            direction: 'vertical',
            axes: [
              {
                id: '4',
                type: 'linear',
                tick: {
                  visible: false,
                  style: {
                    stroke: '#f5222d'
                  }
                },
                niceType: 'accurateFirst',
                grid: {
                  visible: false,
                  style: {
                    stroke: '#f5222d',
                    lineWidth: 5,
                    lineDash: [5, 5]
                  }
                },
                orient: 'left',
                visible: true,
                domainLine: {
                  visible: true,
                  style: {
                    lineWidth: 1,
                    stroke: '#f5222d'
                  }
                },
                title: {
                  visible: true,
                  text: '利润',
                  style: {
                    fontSize: 10,
                    fill: '#f5222d',
                    fontWeight: 'normal'
                  }
                },
                label: {
                  visible: true,
                  style: {
                    fontSize: 14,
                    fill: '#f5222d',
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
              sortIndex: 4,
              id: 'data',
              fields: {
                '10001': {
                  alias: '指标名称 '
                },
                '20001': {
                  alias: '图例项 ',
                  domain: ['销售额', '数量', '折扣', '利润'],
                  lockStatisticsByDomain: true
                },
                '110002': {
                  alias: '指标值 '
                },
                '210002': {
                  alias: '指标值 '
                },
                '310002': {
                  alias: '指标值 '
                },
                '410002': {
                  alias: '指标值 '
                },
                '010002': {
                  alias: '指标值 '
                },
                '230804193430032': {
                  alias: '地区',
                  domain: ['东北', '华北', '华东', '西北', '西南', '中南'],
                  lockStatisticsByDomain: true,
                  sortIndex: 0
                },
                '230808211907009': {
                  alias: '销售额'
                },
                '230810113357011': {
                  alias: '销售额'
                },
                '230810114507011': {
                  alias: '数量'
                },
                '230810114507014': {
                  alias: '折扣'
                },
                '230810114507017': {
                  alias: '利润'
                }
              }
            },
            seriesField: '20001',
            color: {
              field: '20001',
              type: 'ordinal',
              range: ['#2E62F1', '#4DC36A', '#FF8406', '#FFCC00'],
              specified: {},
              domain: ['销售额', '数量', '折扣', '利润']
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
        orient: 'top',
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
            label: '数量',
            shape: {
              fill: '#4DC36A',
              symbolType: 'square'
            }
          },
          {
            label: '折扣',
            shape: {
              fill: '#FF8406',
              symbolType: 'square'
            }
          },
          {
            label: '利润',
            shape: {
              fill: '#FFCC00',
              symbolType: 'square'
            }
          }
        ],
        padding: [16, 0, 0, 0]
      },
      hash: '8fe5b28c5a94245f3018b557592e857a'
    };

    tableInstance.updateOption(option);
  };
}
