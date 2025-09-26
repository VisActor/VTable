// 该 case 主要测试 主从表和CellType为text，image，video，progressbar，sparkline，link，chart的适配

import * as VTable from '@visactor/vtable';
import VChart from '@visactor/vchart';
import { MasterDetailPlugin } from '../../src';

const CONTAINER_ID = 'vTable';

// 注册 VChart 模块用于 chart 单元格
VTable.register.chartModule('vchart', VChart);

// 为每条记录生成示例 children 数据
const attachChildren = (records: unknown[]): unknown[] =>
  Array.isArray(records)
    ? records.map((rec: unknown, idx: number) => ({
        ...(rec as Record<string, unknown>),
        children: new Array(1 + (idx % 3)).fill(0).map((_, i) => ({
          taskName: `任务 ${i + 1}`,
          progress: Math.floor(((i + 1) * 30) % 100)
        }))
      }))
    : (records as unknown[]);

// 原始数据
const rawData = [
  { '230517143221027': 'CA-2018-156720' },
  { '230517143221027': 'CA-2018-115427' },
  { '230517143221027': 'CA-2018-115427' },
  { '230517143221027': 'CA-2018-143259' },
  { '230517143221027': 'CA-2018-143259' },
  { '230517143221027': 'CA-2018-143259' },
  { '230517143221027': 'CA-2018-126221' },
  { '230517143221027': 'US-2018-158526' },
  { '230517143221027': 'US-2018-158526' },
  { '230517143221027': 'US-2018-158526' }
];

export function createTable() {
  const data = rawData;
  const withThumb = (data || []).map((rec: unknown, idx: number) => ({
    thumbnail: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/pigeon.jpeg',
    // demo video 字段，用于展示 video 类型列
    demoVideo: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    // demoProgress 字段，用于展示 progressbar 列（0-100）
    demoProgress: Math.floor(Math.random() * 50),
    // demoSparkline 字段，用于展示 sparkline（趋势）
    demoSparkline: Array.from({ length: 5 }, () => Math.floor(Math.random() * 100)),
    // demoLink 字段，用于展示 link 列（指向指定示例页面）
    demoLink: 'https://visactor.com/vtable/example',
    // QoQ 字段，用于展示环比百分比（可能正负）
    QoQ: Math.floor(Math.random() * 41) - 20,
    // 添加复选框初始值字段，方便演示 checkbox 类型列
    isCheck: idx % 2 === 0, // 第一列简单示例：偶数行默认选中
    check: {
      text: idx % 3 === 0 ? 'checked' : 'unchecked',
      checked: idx % 3 === 0,
      disable: idx % 5 === 0
    },
    // 按钮示例字段（可用于按钮点击事件中识别行或渲染）
    button: 'Select',
    button1: 'Disabled Select',
    // 三种开关字段示例：普通、禁用、以及带自定义显示文本的开关
    switch0: idx % 2 === 0,
    switch1: false,
    switch: idx % 2 === 0,
    // 为 radio5 提供对象数组，使单元格内渲染多个单选项
    radio5: [
      { text: 'cell radio 1', checked: idx % 2 === 0, disable: false },
      { text: 'cell radio 2', checked: idx % 2 !== 0, disable: false }
    ],
    // VChart 图表数据字段
    id: idx + 1,
    // linearProgress 进度条数据
    progress: [
      {
        value: Math.random() * 0.8 + 0.1, // 0.1-0.9 随机值
        label: `${Math.floor((Math.random() * 0.8 + 0.1) * 100)}%`,
        goal: Math.random() * 0.6 + 0.3 // 0.3-0.9 随机目标值
      }
    ],
    areaChart: [
      { x: '0', type: 'A', y: 100 * (idx + 1) },
      { x: '1', type: 'A', y: '707' },
      { x: '2', type: 'A', y: '832' },
      { x: '3', type: 'A', y: '726' },
      { x: '4', type: 'A', y: '756' },
      { x: '5', type: 'A', y: '777' },
      { x: '6', type: 'A', y: '689' },
      { x: '7', type: 'A', y: '795' },
      { x: '8', type: 'A', y: '889' },
      { x: '9', type: 'A', y: '757' },
      { x: '0', type: 'B', y: '773' },
      { x: '1', type: 'B', y: '785' },
      { x: '2', type: 'B', y: '635' },
      { x: '3', type: 'B', y: '813' },
      { x: '4', type: 'B', y: '678' },
      { x: '5', type: 'B', y: 796 + 100 * (idx + 1) },
      { x: '6', type: 'B', y: '652' },
      { x: '7', type: 'B', y: '623' },
      { x: '8', type: 'B', y: '649' },
      { x: '9', type: 'B', y: '630' }
    ],
    lineChart: [
      { x: '0', type: 'A', y: 100 * (idx + 1) },
      { x: '1', type: 'A', y: '707' },
      { x: '2', type: 'A', y: '832' },
      { x: '3', type: 'A', y: '726' },
      { x: '4', type: 'A', y: '756' },
      { x: '5', type: 'A', y: '777' },
      { x: '6', type: 'A', y: '689' },
      { x: '7', type: 'A', y: '795' },
      { x: '8', type: 'A', y: '889' },
      { x: '9', type: 'A', y: '757' },
      { x: '0', type: 'B', y: 500 },
      { x: '1', type: 'B', y: '785' },
      { x: '2', type: 'B', y: '635' },
      { x: '3', type: 'B', y: '813' },
      { x: '4', type: 'B', y: '678' },
      { x: '5', type: 'B', y: '796' },
      { x: '6', type: 'B', y: '652' },
      { x: '7', type: 'B', y: '623' },
      { x: '8', type: 'B', y: '649' },
      { x: '9', type: 'B', y: '630' }
    ],
    barChart: [
      { x: '0', type: 'A', y: 100 * (idx + 1) },
      { x: '1', type: 'A', y: '707' },
      { x: '2', type: 'A', y: '832' },
      { x: '3', type: 'A', y: '726' },
      { x: '4', type: 'A', y: '756' },
      { x: '5', type: 'A', y: '777' },
      { x: '6', type: 'A', y: '689' },
      { x: '7', type: 'A', y: '795' },
      { x: '8', type: 'A', y: '889' },
      { x: '9', type: 'A', y: '757' },
      { x: '0', type: 'B', y: 500 },
      { x: '1', type: 'B', y: '785' },
      { x: '2', type: 'B', y: '635' },
      { x: '3', type: 'B', y: '813' },
      { x: '4', type: 'B', y: '678' },
      { x: '5', type: 'B', y: '796' },
      { x: '6', type: 'B', y: '652' },
      { x: '7', type: 'B', y: '623' },
      { x: '8', type: 'B', y: '649' },
      { x: '9', type: 'B', y: '630' }
    ],
    scatterChart: [
      { x: '0', type: 'A', y: 100 * (idx + 1) },
      { x: '1', type: 'A', y: '707' },
      { x: '2', type: 'A', y: '832' },
      { x: '3', type: 'A', y: '726' },
      { x: '4', type: 'A', y: '756' },
      { x: '5', type: 'A', y: '777' },
      { x: '6', type: 'A', y: '689' },
      { x: '7', type: 'A', y: '795' },
      { x: '8', type: 'A', y: '889' },
      { x: '9', type: 'A', y: '757' },
      { x: '0', type: 'B', y: 500 },
      { x: '1', type: 'B', y: '785' },
      { x: '2', type: 'B', y: '635' },
      { x: '3', type: 'B', y: '813' },
      { x: '4', type: 'B', y: '678' },
      { x: '5', type: 'B', y: '796' },
      { x: '6', type: 'B', y: '652' },
      { x: '7', type: 'B', y: '623' },
      { x: '8', type: 'B', y: '649' },
      { x: '9', type: 'B', y: '630' }
    ],
    ...(rec as Record<string, unknown>)
  }));
  const recordsWithChildren = attachChildren(withThumb || []);

  // 子表配置
  const masterDetailPlugin = new MasterDetailPlugin({
    id: 'master-detail-celltype-demo',
    detailTableOptions: {
      columns: [
        { field: 'isCheck', title: '', width: 60, headerType: 'checkbox', cellType: 'checkbox' },
        { field: 'isCheck2', title: '', width: 60, cellType: 'checkbox' },
        { field: 'taskName', title: '任务', width: 200, cellType: 'text' },
        { field: 'progress', title: '进度', width: 160, cellType: 'progressbar' }
      ],
      defaultRowHeight: 32,
      defaultHeaderRowHeight: 32,
      style: { margin: 8, height: 160 },
      theme: VTable.themes.BRIGHT
    }
  });

  // 主表列定义
  const columns: VTable.TYPES.ColumnsDefine = [
    // 添加整表级复选框列（带表头复选框）
    { field: '230517143221027', cellType: 'text', title: 'Order ID', width: 'auto' },
    { field: 'isCheck', title: '', width: 60, headerType: 'checkbox', cellType: 'checkbox' },
    { field: 'isCheck2', title: '', width: 60, headerType: 'checkbox', cellType: 'checkbox' },
    { field: 'thumbnail', title: '图片', width: 120, cellType: 'image' },
    { field: 'demoVideo', title: '视频', width: 240, cellType: 'video' },
    {
      field: 'demoProgress',
      title: '进度',
      cellType: 'progressbar',
      width: 200,
      fieldFormat() {
        return '';
      },
      barType: 'negative',
      min: -20,
      max: 60,
      style: {
        barHeight: 20,
        barBottom: '50%'
      }
    },
    // 以下为不同形式的 progressbar 示例（基于你的样例）
    {
      field: 'demoProgress',
      title: '进度 - 文本显示',
      cellType: 'progressbar',
      width: 200,
      fieldFormat(rec: { demoProgress?: number }) {
        if (typeof rec.demoProgress === 'number') {
          return rec.demoProgress + '%';
        }
        return rec.demoProgress as unknown as string;
      }
    },
    {
      field: 'demoProgress',
      title: '进度 - 背景渐变',
      cellType: 'progressbar',
      width: 200,
      style: {
        barHeight: '100%',
        barBgColor: args => {
          const percentile = args.percentile || 0;
          const greenValue = 255 * (1 - percentile);
          return `rgb(${200 + 50 * (1 - percentile)},${greenValue},${greenValue})`;
        },
        barColor: 'transparent'
      }
    },
    {
      field: 'demoProgress',
      title: '进度 - 自定义色且显示柱状',
      cellType: 'progressbar',
      width: 200,
      fieldFormat() {
        return '';
      },
      min: -20,
      max: 60,
      style: {
        showBar: true,
        barColor: args => {
          const percentile = args.percentile || 0;
          const greenValue = 255 * (1 - percentile);
          return `rgb(${200 + 50 * (1 - percentile)},${greenValue},${greenValue})`;
        },
        barHeight: 20,
        barBottom: '30%'
      }
    },
    {
      field: 'demoProgress',
      title: '进度 - 负值轴样式',
      cellType: 'progressbar',
      width: 200,
      fieldFormat() {
        return '';
      },
      barType: 'negative',
      min: -20,
      max: 60,
      style: {
        barHeight: 20,
        barBottom: '30%'
      }
    },
    {
      field: 'demoProgress',
      title: '进度 - 负值无轴',
      cellType: 'progressbar',
      width: 200,
      barType: 'negative_no_axis',
      min: -20,
      max: 60,
      style: {
        textAlign: 'right',
        barHeight: 20,
        barBottom: '30%',
        barBgColor: 'rgba(217,217,217,0.3)'
      }
    },
    {
      field: 'demoProgress',
      title: '进度 - 仅文字（隐藏柱状）',
      cellType: 'progressbar',
      width: 200,
      barType: 'negative_no_axis',
      min: -20,
      max: 60,
      style: {
        showBar: false
      }
    },
    { field: 'demoSparkline', title: '趋势', width: 160, cellType: 'sparkline' },
    // linearProgress 进度图表列
    {
      field: 'progress',
      title: 'Schedule Progress',
      width: 300,
      cellType: 'chart',
      chartModule: 'vchart',
      style: {
        padding: 1
      },
      chartSpec: {
        type: 'linearProgress',
        progress: {
          style: {
            fill: '#32a645',
            lineCap: ''
          }
        },
        data: {
          id: 'id0'
        },
        direction: 'horizontal',
        xField: 'value',
        yField: 'label',
        seriesField: 'type',
        cornerRadius: 20,
        bandWidth: 12,
        padding: 10,
        axes: [
          {
            orient: 'right',
            type: 'band',
            domainLine: { visible: false },
            tick: { visible: false },
            label: {
              formatMethod: val => val,
              style: {
                fontSize: 14,
                fontWeight: 'bold',
                fill: '#32a645'
              }
            },
            maxWidth: '60%' // 配置坐标轴的最大空间
          },
          {
            orient: 'bottom',
            label: { visible: true, inside: true },
            type: 'linear',
            visible: false,
            grid: {
              visible: false
            }
          }
        ],
        extensionMark: [
          {
            type: 'rule',
            dataId: 'id0',
            visible: true,
            style: {
              x: (datum, ctx, elements, dataView) => {
                return ctx.valueToX([datum.goal]);
              },
              y: (datum, ctx, elements, dataView) => {
                return ctx.valueToY([datum.label]) - 5;
              },
              x1: (datum, ctx, elements, dataView) => {
                return ctx.valueToX([datum.goal]);
              },
              y1: (datum, ctx, elements, dataView) => {
                return ctx.valueToY([datum.label]) + 5;
              },
              stroke: 'red',
              lineWidth: 2
            }
          },
          {
            type: 'symbol',
            dataId: 'id0',
            visible: true,
            style: {
              symbolType: 'triangleDown',
              x: (datum, ctx, elements, dataView) => {
                return ctx.valueToX([datum.goal]);
              },
              y: (datum, ctx, elements, dataView) => {
                return ctx.valueToY([datum.label]) - 10;
              },
              size: 15,
              scaleY: 0.5,
              fill: 'red'
            }
          }
        ]
      }
    },
    // VChart 图表列定义
    {
      field: 'id',
      title: 'id',
      sort: true,
      width: 80,
      style: {
        textAlign: 'left',
        bgColor: '#ea9999'
      }
    },
    {
      field: 'areaChart',
      title: 'multiple vchart type',
      width: '320',
      cellType: 'chart',
      chartModule: 'vchart',
      chartSpec(args) {
        if (args.row % 3 === 2) {
          return {
            type: 'area',
            data: {
              id: 'data'
            },
            xField: 'x',
            yField: 'y',
            seriesField: 'type',
            point: {
              style: {
                fillOpacity: 1,
                stroke: '#000',
                strokeWidth: 4
              },
              state: {
                hover: {
                  fillOpacity: 0.5,
                  stroke: 'blue',
                  strokeWidth: 2
                },
                selected: {
                  fill: 'red'
                }
              }
            },
            area: {
              style: {
                fillOpacity: 0.3,
                stroke: '#000',
                strokeWidth: 4
              },
              state: {
                hover: {
                  fillOpacity: 1
                },
                selected: {
                  fill: 'red',
                  fillOpacity: 1
                }
              }
            },
            line: {
              state: {
                hover: {
                  stroke: 'red'
                },
                selected: {
                  stroke: 'yellow'
                }
              }
            },
            axes: [
              {
                orient: 'left',
                range: {
                  min: 0
                }
              },
              {
                orient: 'bottom',
                label: {
                  visible: true
                },
                type: 'band'
              }
            ],
            legends: [
              {
                visible: true,
                orient: 'bottom'
              }
            ]
          };
        } else if (args.row % 3 === 1) {
          return {
            type: 'common',
            series: [
              {
                type: 'line',
                data: {
                  id: 'data'
                },
                xField: 'x',
                yField: 'y',
                seriesField: 'type',
                line: {
                  state: {
                    hover: {
                      strokeWidth: 4
                    },
                    selected: {
                      stroke: 'red'
                    },
                    hover_reverse: {
                      stroke: '#ddd'
                    }
                  }
                },
                point: {
                  state: {
                    hover: {
                      fill: 'red'
                    },
                    selected: {
                      fill: 'yellow'
                    },
                    hover_reverse: {
                      fill: '#ddd'
                    }
                  }
                },
                legends: [
                  {
                    visible: true,
                    orient: 'bottom'
                  }
                ]
              }
            ],
            axes: [
              {
                orient: 'left',
                range: {
                  min: 0
                }
              },
              {
                orient: 'bottom',
                label: {
                  visible: true
                },
                type: 'band'
              }
            ],
            legends: [
              {
                visible: true,
                orient: 'bottom'
              }
            ]
          };
        }
        return {
          type: 'pie',
          data: { id: 'data1' },
          categoryField: 'y',
          valueField: 'x'
        };
      }
    },
    {
      field: 'lineChart',
      title: 'vchart line',
      width: '320',
      cellType: 'chart',
      chartModule: 'vchart',
      chartSpec: {
        type: 'common',
        series: [
          {
            type: 'line',
            data: {
              id: 'data'
            },
            xField: 'x',
            yField: 'y',
            seriesField: 'type',
            line: {
              state: {
                hover: {
                  strokeWidth: 4
                },
                selected: {
                  stroke: 'red'
                },
                hover_reverse: {
                  stroke: '#ddd'
                }
              }
            },
            point: {
              state: {
                hover: {
                  fill: 'red'
                },
                selected: {
                  fill: 'yellow'
                },
                hover_reverse: {
                  fill: '#ddd'
                }
              }
            },
            legends: [
              {
                visible: true,
                orient: 'bottom'
              }
            ]
          }
        ],
        axes: [
          {
            orient: 'left',
            range: {
              min: 0
            }
          },
          {
            orient: 'bottom',
            label: {
              visible: true
            },
            type: 'band'
          }
        ],
        legends: [
          {
            visible: true,
            orient: 'bottom'
          }
        ]
      }
    },
    {
      field: 'barChart',
      title: 'vchart bar',
      width: '320',
      cellType: 'chart',
      chartModule: 'vchart',
      chartSpec: {
        type: 'common',
        series: [
          {
            type: 'bar',
            data: {
              id: 'data'
            },
            xField: 'x',
            yField: 'y',
            seriesField: 'type',
            bar: {
              state: {
                hover: {
                  fill: 'green'
                },
                selected: {
                  fill: 'orange'
                },
                hover_reverse: {
                  fill: '#ccc'
                }
              }
            }
          }
        ],
        axes: [
          {
            orient: 'left',
            range: {
              min: 0
            }
          },
          {
            orient: 'bottom',
            label: {
              visible: true
            },
            type: 'band'
          }
        ]
      }
    },
    {
      field: 'scatterChart',
      title: 'vchart scatter',
      width: '320',
      cellType: 'chart',
      chartModule: 'vchart',
      chartSpec: {
        type: 'common',
        series: [
          {
            type: 'scatter',
            data: {
              id: 'data'
            },
            xField: 'x',
            yField: 'y',
            seriesField: 'type'
          }
        ],
        axes: [
          {
            orient: 'left',
            range: {
              min: 0
            }
          },
          {
            orient: 'bottom',
            label: {
              visible: true
            },
            type: 'band'
          }
        ]
      }
    },
    {
      field: 'areaChart',
      title: 'vchart area',
      width: '320',
      cellType: 'chart',
      chartModule: 'vchart',
      chartSpec: {
        type: 'common',
        series: [
          {
            type: 'area',
            data: {
              id: 'data'
            },
            xField: 'x',
            yField: 'y',
            seriesField: 'type',
            point: {
              style: {
                fillOpacity: 1,
                stroke: '#000',
                strokeWidth: 4
              },
              state: {
                hover: {
                  fillOpacity: 0.5,
                  stroke: 'blue',
                  strokeWidth: 2
                },
                selected: {
                  fill: 'red'
                }
              }
            },
            area: {
              style: {
                fillOpacity: 0.3,
                stroke: '#000',
                strokeWidth: 4
              },
              state: {
                hover: {
                  fillOpacity: 1
                },
                selected: {
                  fill: 'red',
                  fillOpacity: 1
                }
              }
            },
            line: {
              state: {
                hover: {
                  stroke: 'red'
                },
                selected: {
                  stroke: 'yellow'
                }
              }
            }
          }
        ],
        axes: [
          {
            orient: 'left',
            range: {
              min: 0
            }
          },
          {
            orient: 'bottom',
            label: {
              visible: true
            },
            type: 'band'
          }
        ],
        legends: [
          {
            visible: true,
            orient: 'bottom'
          }
        ]
      }
    },
    // 开关列示例：普通、禁用和自定义文本
    {
      field: 'switch0',
      title: 'switch',
      width: 'auto',
      cellType: 'switch',
      checkedText: 'on',
      uncheckedText: 'off',
      style: {
        color: '#FFF'
      }
    },
    {
      field: 'switch1',
      title: 'disabled switch',
      width: 'auto',
      cellType: 'switch',
      checkedText: 'on',
      uncheckedText: 'off',
      style: {
        color: '#FFF'
      },
      disable: true
    },
    {
      field: 'switch',
      title: 'custom switch',
      width: 'auto',
      cellType: 'switch',
      style: {
        color: '#FFF'
      },
      checkedText: args => {
        return 'on' + args.row;
      },
      uncheckedText: args => {
        return 'off' + args.row;
      }
    },
    // 单元格内单选（对象数组）示例
    {
      field: 'radio5',
      title: 'cell radio data config',
      width: 240,
      radioDirectionInCell: 'horizontal',
      radioCheckType: 'cell',
      cellType: 'radio',
      style: {
        spaceBetweenRadio: 8
      }
    },
    // 绑定到 records 中的 check 字段（对象格式），作为单元格复选框示例
    { field: 'check', title: '复选项', width: 120, cellType: 'checkbox' },
    // Link 列，指向 visactor 示例页面
    {
      field: 'demoLink',
      title: '链接',
      width: 220,
      cellType: 'link',
      // option: 打开新窗口（如果渲染器支持 target）
      style: {
        textAlign: 'left'
      }
    },
    {
      field: 'QoQ',
      title: 'count Quarter-over-Quarter',
      fieldFormat(rec: { QoQ?: number }) {
        return `${rec.QoQ ?? ''}%`;
      },
      style: {
        textAlign: 'center'
      },
      icon(args) {
        const { dataValue } = args as { dataValue: number };
        if (dataValue > 0) {
          return '↑';
        }
        if (dataValue < 0) {
          return '↓';
        }
        return '';
      },
      width: 150
    },
    // 按钮列示例：普通按钮和禁用按钮
    {
      field: 'button',
      title: 'button',
      width: 'auto',
      cellType: 'button',
      text: 'Select',
      style: {
        color: '#FFF'
      }
    },
    {
      field: 'button1',
      title: 'disabled button',
      width: 'auto',
      cellType: 'button',
      disable: true,
      text: 'Disabled Select',
      style: {
        color: '#FFF'
      }
    }
  ];

  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records: recordsWithChildren,
    columns,
    defaultRowHeight: 120,
    rowResizeMode: 'all',
    plugins: [masterDetailPlugin]
  };

  const tableInstance = new VTable.ListTable(option);

  setTimeout(() => {
    tableInstance.toggleHierarchyState(0, 2);
  }, 100);

  return tableInstance;
}
