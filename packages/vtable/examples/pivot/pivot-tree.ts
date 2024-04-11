import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/test-demo-data/supermarket-flat.json')
    .then(res => res.json())
    .then(data => {
      const option: VTable.PivotTableConstructorOptions = {
        container: document.getElementById(CONTAINER_ID),
        records: data,
        menu: {
          contextMenuItems: ['复制单元格内容', '查询详情']
        },
        rowTree: [
          {
            dimensionKey: '220524114340021',
            value: '办公用品',
            // hierarchyState: 'collapse',
            children: [
              {
                dimensionKey: '220524114340022',
                value: '公司',
                // hierarchyState: 'expand',//设置默认展开
                children: [
                  {
                    dimensionKey: '220524114340023',
                    value: '一级',
                    children: [
                      {
                        dimensionKey: '2205241143400232',
                        value: '一级'
                      },
                      {
                        dimensionKey: '2205241143400232',
                        value: '二级'
                      },
                      {
                        dimensionKey: '2205241143400232',
                        value: '三级'
                      }
                    ]
                  },
                  {
                    dimensionKey: '220524114340023',
                    value: '二级',
                    children: [
                      {
                        dimensionKey: '2205241143400232',
                        value: '一级'
                      },
                      {
                        dimensionKey: '2205241143400232',
                        value: '二级'
                      },
                      {
                        dimensionKey: '2205241143400232',
                        value: '三级'
                      }
                    ]
                  },
                  {
                    dimensionKey: '220524114340023',
                    value: '三级'
                  }
                ]
              },
              {
                dimensionKey: '220524114340022',
                value: '消费者',
                children: [
                  {
                    dimensionKey: '220524114340023',
                    value: '一级1'
                    // hierarchyState: 'expand',
                  },
                  {
                    dimensionKey: '220524114340023',
                    value: '二级1'
                  },
                  {
                    dimensionKey: '220524114340023',
                    value: '三级1'
                  }
                ]
              },
              {
                dimensionKey: '220524114340022',
                value: '小型企业'
              }
            ]
          },
          {
            dimensionKey: '220524114340021',
            //title: '220524114340021',
            value: '家具',
            children: [
              {
                dimensionKey: '220524114340022',
                value: '公司1'
                // hierarchyState: 'expand',
              },
              {
                dimensionKey: '220524114340022',
                value: '消费者1'
              },
              {
                dimensionKey: '220524114340022',
                value: '小型企业1'
              }
            ]
          },
          {
            dimensionKey: '220524114340021',
            //title: '220524114340021',
            value: '餐饮',
            children: [
              {
                dimensionKey: '220524114340022',
                value: '公司2'
                // hierarchyState: 'expand',
              },
              {
                dimensionKey: '220524114340022',
                value: '消费者2'
              },
              {
                dimensionKey: '220524114340022',
                value: '小型企业2'
              }
            ]
          },
          {
            dimensionKey: '220524114340021',
            //title: '220524114340021',
            value: '技术',
            children: [
              {
                dimensionKey: '220524114340022',
                value: '公司3'
                // hierarchyState: 'expand',
              },
              {
                dimensionKey: '220524114340022',
                value: '消费者3'
              },
              {
                dimensionKey: '220524114340022',
                value: '小型企业3'
              }
            ]
          }
        ],
        columnTree: [
          {
            dimensionKey: '220524114340020',
            value: '东北',
            children: [
              {
                dimensionKey: '220524114340031',
                value: '黑龙江',
                children: [
                  {
                    indicatorKey: '220524114340013',
                    value: '销售额'
                  },
                  {
                    indicatorKey: '220524114340014',
                    value: '利润'
                  }
                ]
              },
              {
                dimensionKey: '220524114340031',
                value: '吉林',
                children: [
                  {
                    indicatorKey: '220524114340013',
                    value: '销售额'
                  },
                  {
                    indicatorKey: '220524114340014',
                    value: '利润'
                  }
                ]
              },
              {
                dimensionKey: '220524114340031',
                value: '辽宁',
                children: [
                  {
                    indicatorKey: '220524114340013',
                    value: '销售额'
                  },
                  {
                    indicatorKey: '220524114340014',
                    value: '利润'
                  }
                ]
              }
            ]
          },
          {
            dimensionKey: '220524114340020',
            value: '华北',
            children: [
              {
                dimensionKey: '220524114340031',
                value: '内蒙古',
                children: [
                  {
                    indicatorKey: '220524114340013',
                    value: '销售额'
                  },
                  {
                    indicatorKey: '220524114340014',
                    value: '利润'
                  }
                ]
              },
              {
                dimensionKey: '220524114340031',
                value: '北京',
                children: [
                  {
                    indicatorKey: '220524114340013',
                    value: '销售额'
                  },
                  {
                    indicatorKey: '220524114340014',
                    value: '利润'
                  }
                ]
              },
              {
                dimensionKey: '220524114340031',
                value: '天津',
                children: [
                  {
                    indicatorKey: '220524114340013',
                    value: '销售额'
                  },
                  {
                    indicatorKey: '220524114340014',
                    value: '利润'
                  }
                ]
              }
            ]
          },
          {
            dimensionKey: '220524114340020',
            value: '中南',
            children: [
              {
                dimensionKey: '220524114340031',
                value: '广东',
                children: [
                  {
                    indicatorKey: '220524114340013',
                    value: '销售额'
                  },
                  {
                    indicatorKey: '220524114340014',
                    value: '利润'
                  }
                ]
              },
              {
                dimensionKey: '220524114340031',
                value: '广西',
                children: [
                  {
                    indicatorKey: '220524114340013',
                    value: '销售额'
                  },
                  {
                    indicatorKey: '220524114340014',
                    value: '利润'
                  }
                ]
              },
              {
                dimensionKey: '220524114340031',
                value: '湖南',
                children: [
                  {
                    indicatorKey: '220524114340013',
                    value: '销售额'
                  },
                  {
                    indicatorKey: '220524114340014',
                    value: '利润'
                  }
                ]
              }
            ]
          }
        ],
        rows: [
          {
            dimensionKey: '220524114340021',
            title: '类别-细分-邮寄方式',
            headerFormat(value) {
              return `${value}`;
            },
            width: 200,
            headerStyle: {
              cursor: 'help',
              textAlign: 'center',
              borderColor: 'blue',
              color: 'purple',
              // textBaseline: 'top',
              textStick: true,
              bgColor: '#6cd26f'
            }
          },
          {
            dimensionKey: '220524114340022',
            title: '子类别',
            headerStyle: {
              textAlign: 'left',
              color: 'blue',
              bgColor: '#45b89f'
            }
            // headerType: 'MULTILINETEXT',
          },
          {
            dimensionKey: '220524114340023',
            title: '邮寄方式',
            headerStyle: {
              textAlign: 'left',
              color: 'white',
              bgColor: '#6699ff'
            }
            // headerType: 'MULTILINETEXT',
          }
        ],
        columns: [
          {
            dimensionKey: '220524114340020',
            title: '地区',
            headerFormat(value) {
              return `${value}地区`;
            },
            headerStyle: {
              textAlign: 'right',
              borderColor: 'blue',
              color: 'yellow',
              textStick: true,
              bgColor(arg) {
                if (
                  arg.cellHeaderPaths.colHeaderPaths &&
                  'value' in arg.cellHeaderPaths.colHeaderPaths[0] &&
                  arg.cellHeaderPaths.colHeaderPaths[0].value === '东北'
                ) {
                  return '#bd422a';
                }
                if (
                  arg.cellHeaderPaths.colHeaderPaths &&
                  'value' in arg.cellHeaderPaths.colHeaderPaths[0] &&
                  arg.cellHeaderPaths.colHeaderPaths[0].value === '华北'
                ) {
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
            dimensionKey: '220524114340031',
            title: '省份'
          }
        ],
        indicators: [
          {
            indicatorKey: '220524114340013',
            title: '销售额',
            width: 'auto',
            format(value, col, row, table) {
              // if (rec.rowDimensions[0].value === '东北') return `${rec.dataValue}%`;
              if (!value) {
                return '--';
              }
              return Math.floor(parseFloat(value));
            },
            headerStyle: {
              color: 'red',
              bgColor(arg) {
                if (
                  arg.cellHeaderPaths.colHeaderPaths &&
                  'value' in arg.cellHeaderPaths.colHeaderPaths[0] &&
                  arg.cellHeaderPaths.colHeaderPaths[0].value === '东北'
                ) {
                  return '#bd422a';
                }
                if (
                  arg.cellHeaderPaths.colHeaderPaths &&
                  'value' in arg.cellHeaderPaths.colHeaderPaths[0] &&
                  arg.cellHeaderPaths.colHeaderPaths[0].value === '华北'
                ) {
                  return '#ff9900';
                }
                return 'gray';
              }
            }
            // headerType: 'MULTILINETEXT',
          },
          {
            indicatorKey: '220524114340014',
            title: '利润',
            format(value) {
              // if (rec.rowDimensions[0].value === '东北') return `${rec.dataValue}%`;
              if (!value) {
                return '--';
              }
              return Math.floor(parseFloat(value));
            },
            width: 'auto',
            headerStyle: {
              bgColor(arg) {
                if (
                  arg.cellHeaderPaths.colHeaderPaths &&
                  'value' in arg.cellHeaderPaths.colHeaderPaths[0] &&
                  arg.cellHeaderPaths.colHeaderPaths[0].value === '东北'
                ) {
                  return '#bd422a';
                }
                if (
                  arg.cellHeaderPaths.colHeaderPaths &&
                  'value' in arg.cellHeaderPaths.colHeaderPaths[0] &&
                  arg.cellHeaderPaths.colHeaderPaths[0].value === '华北'
                ) {
                  return '#ff9900';
                }
                return 'gray';
              }
            }
          }
        ],
        corner: {
          titleOnDimension: 'row',
          headerStyle: {
            textAlign: 'center',
            borderColor: 'red',
            color: 'red',
            underline: true,
            fontSize: 16,
            fontWeight: 'bold',
            fontFamily: 'sans-serif'
          }
        },
        heightMode: 'autoHeight',
        autoWrapText: true,
        widthMode: 'standard',
        rowHierarchyType: 'tree',
        rowExpandLevel: 2,
        rowHierarchyIndent: 20,
        theme: VTable.themes.ARCO,
        dragHeaderMode: 'all'
      };
      const tableInstance = new PivotTable(option);
      // 只为了方便控制太调试用，不要拷贝
      window.tableInstance = tableInstance;
    })
    // eslint-disable-next-line no-console
    .catch(e => console.log(e));
}
