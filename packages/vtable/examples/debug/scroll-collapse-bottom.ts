import * as VTable from '../../src';

export function createTable() {
  const dom = document.querySelector('#vTable') as HTMLElement;
  dom.style.width = '800px';
  dom.style.height = '400px';
  const PivotGrid = VTable.PivotTable;
  const rowTree = [
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
  ];
  const columnTree = [
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
  ];
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/test-demo-data/supermarket-flat.json')
    .then(res => res.json())
    .then(data => {
      const option = {
        records: data,
        menu: {
          contextMenuItems: ['复制单元格内容', '查询详情']
        },
        rowTree: [
          ...rowTree,
          ...rowTree,
          ...rowTree,
          ...rowTree,
          ...rowTree,
          ...rowTree,
          ...rowTree,
          ...rowTree,
          ...rowTree,
          ...rowTree,
          ...rowTree,
          ...rowTree,
          ...rowTree,
          ...rowTree,
          ...rowTree,
          ...rowTree,
          ...rowTree,
          ...rowTree,
          ...rowTree,
          ...rowTree,
          ...rowTree,
          ...rowTree,
          ...rowTree,
          ...rowTree
        ],
        columnTree: [
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree,
          ...columnTree
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
              textAlign: 'left',
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
              textAlign: 'left',
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
        // heightMode: 'autoHeight',
        autoWrapText: true,
        widthMode: 'standard',
        columnHierarchyType: 'grid-tree',
        rowHierarchyType: 'grid-tree',
        rowExpandLevel: 2,
        columnExpandLevel: 1,
        rowHierarchyIndent: 20,
        theme: VTable.themes.ARCO,
        dragHeaderMode: 'all'
      };

      const instance = new PivotGrid(dom, option);
      window.tableInstance = instance;
      const { PIVOT_SORT_CLICK } = VTable.PivotTable.EVENT_TYPE;
      instance.on(PIVOT_SORT_CLICK, e => {
        const order = e.order === 'asc' ? 'desc' : e.order === 'desc' ? 'normal' : 'asc';
        instance.updatePivotSortState([{ dimensions: e.dimensionInfo, order }]);
      });
      window.reproduceScrollCollapseBottom = () => {
        instance.setScrollTop(Number.MAX_SAFE_INTEGER);
        const before = {
          scrollTop: instance.scrollTop,
          maxScrollTop: Math.max(0, instance.getAllRowsHeight() - instance.scenegraph.height)
        };
        const visibleRange = instance.getBodyVisibleRowRange();
        let targetRow = -1;
        for (let row = visibleRange.rowStart; row <= visibleRange.rowEnd; row++) {
          if (instance.getCellValue(0, row) === '餐饮' && instance.getHierarchyState(0, row) === 'expand') {
            targetRow = row;
            break;
          }
        }
        if (targetRow >= 0) {
          instance.toggleHierarchyState(0, targetRow);
        }
        const maxScrollTop = Math.max(0, instance.getAllRowsHeight() - instance.scenegraph.height);
        const after = {
          scrollTop: instance.scrollTop,
          maxScrollTop,
          diff: maxScrollTop - instance.scrollTop,
          targetRow
        };
        // eslint-disable-next-line no-console
        console.log('scroll-collapse-bottom', { before, after });
        return { before, after };
      };
    });
}
