import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';
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
export function createTable() {
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
    .then(res => res.json())
    .then(data => {
      const option = {
        rows: ['Order Year', 'Region', 'Segment', 'Ship Mode'],
        columns: ['Category', 'Sub-Category'],
        indicators: ['Sales', 'Profit'],
        enableDataAnalysis: true,
        indicatorTitle: '指标名称',
        indicatorsAsCol: false,
        rowHierarchyType: 'grid-tree',
        columnHierarchyType: 'grid-tree',
        corner: { titleOnDimension: 'row' },
        dataConfig: {
          totals: {
            row: {
              showGrandTotals: true,
              showSubTotals: true,
              subTotalsDimensions: ['Order Year', 'Region', 'Segment'],
              grandTotalLabel: '行总计',
              subTotalLabel: '小计'
            },
            column: {
              showGrandTotals: true,
              showSubTotals: true,
              subTotalsDimensions: ['Category'],
              grandTotalLabel: '列总计',
              subTotalLabel: '小计'
            }
          }
        },
        records: data,
        widthMode: 'autoWidth' // 宽度模式：standard 标准模式； adaptive 自动填满容器
      };

      const tableInstance = new PivotTable(document.getElementById(CONTAINER_ID), option);
      // 只为了方便控制太调试用，不要拷贝
      window.tableInstance = tableInstance;
    })
    // eslint-disable-next-line no-console
    .catch(e => console.log(e));
}
