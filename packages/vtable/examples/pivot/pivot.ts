import * as VTable from '../../src';
const CONTAINER_ID = 'vTable';

export function createTable() {
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_data.json')
    .then(res => res.json())
    .then(data => {
      const DEFAULT_BAR_COLOR = data => {
        const num = (data.rate ?? 0) * 100;
        if (num > 80) {
          return '#20a8d8';
        }
        if (num > 50) {
          return '#4dbd74';
        }
        if (num > 20) {
          return '#ffc107';
        }
        return '#f86c6b';
      };

      const records = [];
      const theme = {
        underlayBackgroundColor: '#F6F6F6',
        defaultStyle: {
          borderColor: '#000',
          color: '#000',
          bgColor: '#F6F6F6'
        },
        headerStyle: {
          bgColor: '#F5F6FA',
          frameStyle: {
            borderColor: '#00ffff',
            borderLineWidth: 2
          }
        },
        selectionStyle: {
          cellBgColor: 'rgba(130,178,245, 0.2)',
          cellBorderColor: '#003fff',
          cellBorderLineWidth: 2
        },
        rowHeaderStyle: {
          bgColor: '#F3F8FF',
          frameStyle: {
            borderColor: '#ff00ff',
            borderLineWidth: 2
          }
        },
        cornerHeaderStyle: {
          bgColor: '#CCE0FF',
          fontSize: 20,
          fontFamily: 'sans-serif',
          frameStyle: {
            borderColor: '#00ff00',
            borderLineWidth: 2
          }
        },
        bodyStyle: {
          hover: {
            cellBgColor: '#CCE0FF',
            inlineRowBgColor: '#F3F8FF',
            inlineColumnBgColor: '#F3F8FF'
          },
          frameStyle: {
            borderColor: '#ffff00',
            borderLineWidth: 5
          }
        },
        frameStyle: {
          borderColor: '#000',
          borderLineWidth: 1,
          borderLineDash: []
        },
        columnResizer: {
          lineWidth: 1,
          lineColor: '#416EFF',
          bgColor: '#D9E2FF',
          width: 3
        },
        frozenColumnLine: {
          shadow: {
            width: 24,
            startColor: 'rgba(00, 24, 47, 0.06)',
            endColor: 'rgba(00, 24, 47, 0)'
          }
        },
        menuStyle: {
          color: '#000',
          highlightColor: '#2E68CF',
          font: '12px sans-serif',
          highlightFont: '12px sans-serif',
          hoverBgColor: '#EEE'
        }
      };
      const option = {
        emptyTip: true,
        columns: [
          {
            dimensionKey: '地区',
            title: '地区',
            headerFormat(value) {
              return `${value}地区`;
            },
            description(args) {
              return args.value;
            },
            cornerDescription: '地区维度',
            headerStyle: {
              textAlign: 'right',
              borderColor: 'blue',
              color: 'gray',
              textStick: true,
              bgColor(arg) {
                if (arg.cellHeaderPaths.colHeaderPaths && arg.cellHeaderPaths.colHeaderPaths[0].value === '东北') {
                  return '#bd422a';
                }
                if (arg.cellHeaderPaths.colHeaderPaths && arg.cellHeaderPaths.colHeaderPaths[0].value === '华北') {
                  return '#ff9900';
                }
                return 'gray';
              }
            },
            // 指标菜单
            dropDownMenu: ['升序排序I', '降序排序I', '冻结列I'],
            // corner菜单
            cornerDropDownMenu: ['升序排序C', '降序排序C', '冻结列C'],
            drillDown: true
          },
          {
            dimensionKey: '邮寄方式',
            title: '邮寄方式11',
            headerFormat(value) {
              return `${value}邮寄方式`;
            },
            headerStyle: {
              textAlign: 'left',
              borderColor: 'blue',
              color: 'pink',
              // lineHeight: '2em',
              fontSize: 16,
              fontStyle: 'bold',
              fontFamily: 'sans-serif',
              underline: true,
              textStick: true,
              bgColor(arg) {
                if (arg.cellHeaderPaths.colHeaderPaths && arg.cellHeaderPaths.colHeaderPaths[0].value === '东北') {
                  return '#bd422a';
                }
                if (arg.cellHeaderPaths.colHeaderPaths && arg.cellHeaderPaths.colHeaderPaths[0].value === '华北') {
                  return '#ff9900';
                }
                return 'gray';
              }
            },
            drillUp: false
          }
        ],
        rows: [
          {
            dimensionKey: '类别',
            title: '类别',
            drillUp: true,
            width: 'auto',
            headerStyle: {
              textAlign: 'center',
              borderColor: 'blue',
              color: 'purple',
              textBaseline: 'top',
              textStick: true,
              bgColor: '#6cd26f'
            }
          },
          {
            dimensionKey: '子类别',
            title: '子类别',
            headerStyle: {
              textAlign: 'center',
              color: 'blue',
              bgColor: '#45b89f'
            },
            width: 'auto',
            dropDownMenu: ['升序排序I', '降序排序I', '冻结列I']
            // headerType: 'MULTILINETEXT',
          }
        ],
        indicators: [
          {
            indicatorKey: '1',
            title: '销售额',
            format(value) {
              return `${value}%`;
            },
            headerStyle: {
              color: 'red',
              bgColor(arg) {
                if (arg.cellHeaderPaths.colHeaderPaths && arg.cellHeaderPaths.colHeaderPaths[0].value === '东北') {
                  return '#bd422a';
                }
                if (arg.cellHeaderPaths.colHeaderPaths && arg.cellHeaderPaths.colHeaderPaths[0].value === '华北') {
                  return '#ff9900';
                }
                return 'gray';
              }
            },
            style: {
              barHeight: '100%',
              // barBgColor: '#aaa',
              // barColor: '#444',
              barBgColor: data => {
                return `rgb(${100 + 100 * (1 - (data.rate ?? 0))},${100 + 100 * (1 - (data.rate ?? 0))},${
                  255 * (1 - (data.rate ?? 0))
                })`;
              },
              barColor: 'transparent'
            },
            columnType: 'progressbar',
            showSort: true
            // headerType: 'MULTILINETEXT',
          },
          {
            indicatorKey: '2',
            title: '利润',
            columnType: 'progressbar',
            style: {
              barHeight: '50%',
              barBottom: 20,
              barColor: DEFAULT_BAR_COLOR
            },
            showSort: true,
            dropDownMenu: ['利润升序排序I', '利润降序排序I', '利润冻结列I']
          }
        ],
        columnTree: [
          {
            dimensionKey: '地区',
            value: '东北',
            children: [
              {
                dimensionKey: '邮寄方式',
                value: '一级',
                children: [
                  {
                    // dimensionKey: '指标名称',
                    indicatorKey: '1',
                    value: '销售额'
                  },
                  {
                    // dimensionKey: '指标名称',
                    indicatorKey: '2',
                    value: '利润'
                  }
                ]
              },
              {
                dimensionKey: '邮寄方式',
                value: '二级',
                children: [
                  {
                    // dimensionKey: '指标名称',
                    indicatorKey: '1',
                    value: '销售额'
                  },
                  {
                    // dimensionKey: '指标名称',
                    indicatorKey: '2',
                    value: '利润'
                  }
                ]
              },
              {
                dimensionKey: '邮寄方式',
                value: '三级',
                children: [
                  {
                    // dimensionKey: '指标名称',
                    indicatorKey: '1',
                    value: '销售额'
                  },
                  {
                    // dimensionKey: '指标名称',
                    indicatorKey: '2',
                    value: '利润'
                  }
                ]
              }
            ]
          },
          {
            dimensionKey: '地区',
            value: '华北',
            children: [
              {
                dimensionKey: '邮寄方式',
                value: '一级',
                children: [
                  {
                    // dimensionKey: '指标名称',
                    indicatorKey: '1',
                    value: '销售额'
                  },
                  {
                    // dimensionKey: '指标名称',
                    indicatorKey: '2',
                    value: '利润'
                  }
                ]
              },
              {
                dimensionKey: '邮寄方式',
                value: '二级',
                children: [
                  {
                    // dimensionKey: '指标名称',
                    indicatorKey: '1',
                    value: '销售额'
                  },
                  {
                    // dimensionKey: '指标名称',
                    indicatorKey: '2',
                    value: '利润'
                  }
                ]
              },
              {
                dimensionKey: '邮寄方式',
                value: '三级',
                children: [
                  {
                    // dimensionKey: '指标名称',
                    indicatorKey: '1',
                    value: '销售额'
                  },
                  {
                    // dimensionKey: '指标名称',
                    indicatorKey: '2',
                    value: '利润'
                  }
                ]
              }
            ]
          },
          {
            dimensionKey: '地区',
            value: '中南',
            children: [
              {
                dimensionKey: '邮寄方式',
                value: '一级',
                children: [
                  {
                    // dimensionKey: '指标名称',
                    indicatorKey: '1',
                    value: '销售额'
                  },
                  {
                    // dimensionKey: '指标名称',
                    indicatorKey: '2',
                    value: '利润'
                  }
                ]
              },
              {
                dimensionKey: '邮寄方式',
                value: '二级',
                children: [
                  {
                    // dimensionKey: '指标名称',
                    indicatorKey: '1',
                    value: '销售额'
                  },
                  {
                    // dimensionKey: '指标名称',
                    indicatorKey: '2',
                    value: '利润'
                  }
                ]
              },
              {
                dimensionKey: '邮寄方式',
                value: '三级',
                children: [
                  {
                    // dimensionKey: '指标名称',
                    indicatorKey: '1',
                    value: '销售额'
                  },
                  {
                    // dimensionKey: '指标名称',
                    indicatorKey: '2',
                    value: '利润'
                  }
                ]
              }
            ]
          }
        ],
        corner: {
          titleOnDimension: 'row',
          headerStyle: {
            textAlign: 'center',
            borderColor: 'red',
            color: 'yellow',
            underline: true,
            fontSize: 16,
            fontStyle: 'bold',
            fontFamily: 'sans-serif'
            // lineHeight: '20px'
          }
        },
        columnHeaderTitle: {
          title: true,
          headerStyle: {
            textStick: true
          }
        },
        indicatorTitle: '指标名称',
        // indicatorsAsCol: false,
        records,
        theme,
        showPin: false, //显示xTable内置冻结列图标
        allowFrozenColCount: 2,
        widthMode: 'autoWidth', // 宽度模式：standard 标准模式； adaptive 自动填满容器
        defaultRowHeight: 80,
        columnResizeType: 'indicator', // 'column' | 'indicator' | 'all'
        tooltip: {
          isShowOverflowTextTooltip: true
        }
      };

      const tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
      // 只为了方便控制太调试用，不要拷贝
      window.tableInstance = tableInstance;
      tableInstance.on('mouseenter_cell', args => {
        const { col, row } = args;
        const rect = tableInstance.getVisibleCellRangeRelativeRect({ col, row });
        tableInstance.showTooltip(col, row, {
          content: '你好！',
          position: {
            x: rect.left,
            y: rect.bottom
          },
          referencePosition: { rect, placement: VTable.TYPES.Placement.right }, //TODO
          className: 'defineTooltip',
          style: {
            bgColor: 'black',
            color: 'white',
            fontSize: 14,
            fontFamily: 'STKaiti',
            arrowMark: true
          }
        });
      });
      tableInstance.on('change_cell_value', arg => {
        console.log(arg);
      });
    })
    // eslint-disable-next-line no-console
    .catch(e => console.log(e));
}
