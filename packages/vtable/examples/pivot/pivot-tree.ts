import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const PivotTable = VTable.PivotTable;
const Table_CONTAINER_DOM_ID = 'vTable';

export function createTable() {
  fetch(window.location.origin + '/pivot/supermarket-flat.json')
    .then(res => res.json())
    .then(data => {
      const option: VTable.PivotTableConstructorOptions = {
        parentElement: document.getElementById(Table_CONTAINER_DOM_ID),
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
                    value: '一级'
                  },
                  {
                    dimensionKey: '220524114340023',
                    value: '二级'
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
                    value: '一级'
                    // hierarchyState: 'expand',
                  },
                  {
                    dimensionKey: '220524114340023',
                    value: '二级'
                  },
                  {
                    dimensionKey: '220524114340023',
                    value: '三级'
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
            //dimensionTitle: '220524114340021',
            value: '家具',
            children: [
              {
                dimensionKey: '220524114340022',
                value: '公司'
                // hierarchyState: 'expand',
              },
              {
                dimensionKey: '220524114340022',
                value: '消费者'
              },
              {
                dimensionKey: '220524114340022',
                value: '小型企业'
              }
            ]
          },
          {
            dimensionKey: '220524114340021',
            //dimensionTitle: '220524114340021',
            value: '餐饮',
            children: [
              {
                dimensionKey: '220524114340022',
                value: '公司'
                // hierarchyState: 'expand',
              },
              {
                dimensionKey: '220524114340022',
                value: '消费者'
              },
              {
                dimensionKey: '220524114340022',
                value: '小型企业'
              }
            ]
          },
          {
            dimensionKey: '220524114340021',
            //dimensionTitle: '220524114340021',
            value: '技术',
            children: [
              {
                dimensionKey: '220524114340022',
                value: '公司'
                // hierarchyState: 'expand',
              },
              {
                dimensionKey: '220524114340022',
                value: '消费者'
              },
              {
                dimensionKey: '220524114340022',
                value: '小型企业'
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
            dimensionTitle: '类别-细分-邮寄方式',
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
            dimensionTitle: '子类别',
            headerStyle: {
              textAlign: 'left',
              color: 'blue',
              bgColor: '#45b89f'
            }
            // headerType: 'MULTILINETEXT',
          },
          {
            dimensionKey: '220524114340023',
            dimensionTitle: '邮寄方式',
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
            dimensionTitle: '地区',
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
            dimensionTitle: '省份'
          },
          {
            indicatorKey: '220524114340014',
            dimensionTitle: '指标名称',
            headerStyle: {
              textAlign: 'left',
              borderColor: 'white',
              textStick: true
            }
          }
        ],
        indicators: [
          {
            indicatorKey: '220524114340013',
            caption: '销售额',
            width: 'auto',
            format(record) {
              // if (rec.rowDimensions[0].value === '东北') return `${rec.dataValue}%`;
              if (!record?.['220524114340013']) {
                return '--';
              }
              return Math.floor(parseFloat(record?.['220524114340013']));
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
            caption: '利润',
            format(record) {
              // if (rec.rowDimensions[0].value === '东北') return `${rec.dataValue}%`;
              if (!record?.['220524114340014']) {
                return '--';
              }
              return Math.floor(parseFloat(record?.['220524114340014']));
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
        widthMode: 'standard',
        rowHierarchyType: 'tree',
        rowExpandLevel: 2,
        rowHierarchyIndent: 20,
        theme: VTable.themes.ARCO
      };
      const tableInstance = new PivotTable(option);
      // 只为了方便控制太调试用，不要拷贝
      (window as any).tableInstance = tableInstance;

      bindDebugTool(tableInstance.scenegraph.stage as any, {
        customGrapicKeys: ['role', '_updateTag']
      });
    })
    // eslint-disable-next-line no-console
    .catch(e => console.log(e));
}
