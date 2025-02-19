import * as VTable from '../../src';
import { generatePivotDataSource } from '../util/pivot-data';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const option = {
    allowRangePaste: true,
    columnTree: [
      {
        dimensionKey: '地区',
        //title: '地区',
        value: '东北22'
      },
      {
        dimensionKey: '地区',
        //title: '地区',
        value: '东北',
        children: [
          {
            dimensionKey: '邮寄方式',
            //title: '邮寄方式',
            value: '一级',
            children: [
              {
                //title: '指标名称',
                indicatorKey: '1',
                value: '销售额'
              },
              {
                //title: '指标名称',
                indicatorKey: '2',
                value: '利润'
              }
            ]
          },
          {
            dimensionKey: '邮寄方式',
            //title: '邮寄方式',
            value: '二级',
            children: [
              {
                //title: '指标名称',
                indicatorKey: '1',
                value: '销售额'
              },
              {
                //title: '指标名称',
                indicatorKey: '2',
                value: '利润'
              }
            ]
          },
          {
            dimensionKey: '邮寄方式',
            //title: '邮寄方式',
            value: '三级',
            children: [
              {
                //title: '指标名称',
                indicatorKey: '1',
                value: '销售额'
              },
              {
                //title: '指标名称',
                indicatorKey: '2',
                value: '利润'
              }
            ]
          }
        ]
      },
      {
        dimensionKey: '地区',
        //title: '地区',
        value: '华北',
        children: [
          {
            dimensionKey: '邮寄方式',
            //title: '邮寄方式',
            value: '一级',
            children: [
              {
                //title: '指标名称',
                indicatorKey: '1',
                value: '销售额'
              },
              {
                //title: '指标名称',
                indicatorKey: '2',
                value: '利润'
              }
            ]
          },
          {
            dimensionKey: '邮寄方式',
            //title: '邮寄方式',
            value: '二级',
            children: [
              {
                //title: '指标名称',
                indicatorKey: '1',
                value: '销售额'
              },
              {
                //title: '指标名称',
                indicatorKey: '2',
                value: '利润'
              }
            ]
          },
          {
            dimensionKey: '邮寄方式',
            //title: '邮寄方式',
            value: '三级',
            children: [
              {
                //title: '指标名称',
                indicatorKey: '1',
                value: '销售额'
              },
              {
                //title: '指标名称',
                indicatorKey: '2',
                value: '利润'
              }
            ]
          }
        ]
      },
      {
        dimensionKey: '地区',
        //title: '地区',
        value: '中南',
        children: [
          {
            dimensionKey: '邮寄方式',
            //title: '邮寄方式',
            value: '一级',
            children: [
              {
                //title: '指标名称',
                indicatorKey: '1',
                value: '销售额'
              },
              {
                //title: '指标名称',
                indicatorKey: '2',
                value: '利润'
              }
            ]
          },
          {
            dimensionKey: '邮寄方式',
            //title: '邮寄方式',
            value: '二级',
            children: [
              {
                //title: '指标名称',
                indicatorKey: '1',
                value: '销售额'
              },
              {
                //title: '指标名称',
                indicatorKey: '2',
                value: '利润'
              }
            ]
          },
          {
            dimensionKey: '邮寄方式',
            //title: '邮寄方式',
            value: '三级',
            children: [
              {
                //title: '指标名称',
                indicatorKey: '1',
                value: '销售额'
              },
              {
                //title: '指标名称',
                indicatorKey: '2',
                value: '利润'
              }
            ]
          }
        ]
      }
    ],
    rowTree: [
      {
        dimensionKey: '类别',
        //title: '类别',
        value: '办公用品',
        children: [
          {
            dimensionKey: '子类别', //title: '子类别',
            value: '电脑'
          },
          {
            dimensionKey: '子类别',
            //title: '子类别',
            value: '装订机'
          },
          {
            dimensionKey: '子类别',
            //title: '子类别',
            value: '签字笔'
          },
          {
            dimensionKey: '子类别', //title: '子类别',
            value: '标签'
          },
          {
            dimensionKey: '子类别',
            //title: '子类别',
            value: '收纳柜'
          },
          {
            dimensionKey: '子类别', //title: '子类别',
            value: '纸张'
          },
          {
            dimensionKey: '子类别', //title: '子类别',
            value: '电灯'
          }
        ]
      },
      {
        dimensionKey: '类别',
        //title: '类别',
        value: '家具',
        children: [
          {
            dimensionKey: '子类别', //title: '子类别',
            value: '衣柜'
          },
          {
            dimensionKey: '子类别', //title: '子类别',
            value: '沙发'
          },
          {
            dimensionKey: '子类别', //title: '子类别',
            value: '餐桌'
          },
          {
            dimensionKey: '子类别', //title: '子类别',
            value: '椅子'
          },
          {
            dimensionKey: '子类别', //title: '子类别',
            value: '桌子'
          }
        ]
      },
      {
        dimensionKey: '类别',
        //title: '类别',
        value: '餐饮',
        children: [
          {
            dimensionKey: '子类别', //title: '子类别',
            value: '锅具'
          },
          {
            dimensionKey: '子类别',
            //title: '子类别',
            value: '油盐酱醋'
          },
          {
            dimensionKey: '子类别', //title: '子类别',
            value: '米面'
          }
        ]
      },
      {
        dimensionKey: '类别',
        //title: '类别',
        value: '技术',
        children: [
          {
            dimensionKey: '子类别', //title: '子类别',
            value: '设备'
          },
          {
            dimensionKey: '子类别', //title: '子类别',
            value: '配件'
          },
          {
            dimensionKey: '子类别', //title: '子类别',
            value: '电话'
          },
          {
            dimensionKey: '子类别',
            //title: '子类别',
            value: '复印机'
          }
        ]
      }
    ],
    corner: {
      titleOnDimension: 'column'
    },
    columnHeaderTitle: {
      title: true,
      headerType: 'text',
      headerStyle: { autoWrapText: true, textAlign: 'center' }
    },
    rowHeaderTitle: {
      title: '自定义表头',
      headerType: 'text',
      headerStyle: { autoWrapText: true }
    },
    rows: [
      {
        dimensionKey: '类别',
        title: '类别',
        cornerDescription: '这是类别维度的提示信息',
        drillUp: true,
        // width: 'auto',
        width: 60,
        minWidth: 40,
        maxWidth: 200
      },
      {
        dimensionKey: '子类别',
        title: '子类别'
        // headerType: 'multilinetext',
      }
    ],
    columns: [
      {
        dimensionKey: '地区',
        title: '地区',
        description(args) {
          if (args.dataValue === '东北') {
            return '东北东北的提示';
          }
          return args.value;
        },
        cornerDescription: '这是地区维度的提示信息',
        headerFormat(value) {
          return `${value}地区`;
        },
        drillDown: true
      },
      {
        dimensionKey: '邮寄方式',
        title: '邮寄方式11',
        showSort(args) {
          const { col, row, table } = args;
          if (col % 3 === 0) {
            return true;
          }
          return false;
        },
        headerFormat(value) {
          return `${value}邮寄方式`;
        },
        // width: 'auto',
        width: 100,
        minWidth: 60,
        maxWidth: 300,
        drillUp: false
      }
    ],
    indicators: [
      {
        showSort(args) {
          const { col, row, table } = args;
          if (col % 3 === 0) {
            return true;
          }
          return false;
        },
        indicatorKey: '1',
        title: '销售额',
        format(value) {
          return `${value}%`;
        },
        maxWidth: 200,
        minWidth: 10,
        cellType: 'progressbar'
      },
      {
        showSort: false,
        indicatorKey: '2',
        title: '利润',
        format(value) {
          // if (rec.rowDimensions[0].value === '东北') return `${rec.dataValue}%`;
          return value;
        },
        cellType: 'progressbar'
      }
    ],
    records: generatePivotDataSource(19, 18),
    frozenColCount: 0, //冻结列
    defaultRowHeight: 80,
    defaultHeaderColWidth: [40, 80, 100],
    // allowFrozenColCount: 5,//最多允许冻结的列数，设置5列显示冻结图标
    enableColumnResizeOnAllRows: true, //是否可以在所有行上调整列宽
    disableColumnResize: false, //关闭调整列宽
    showFrozenIcon: false, //显示VTable内置冻结列图标
    pagination: {
      //分页配置
      perPageCount: 5,
      currentPage: 0
    },
    padding: { top: 10, bottom: 10, left: 10, right: 20 }, //整体表格的内边距 与parentElement的定位
    hover: {
      highlightMode: 'cross'
    },
    widthMode: 'standard', // 宽度模式：standard 标准模式； adaptive 自动填满容器
    // heightMode: 'autoHeight',
    autoWrapText: true,
    resize: {
      columnResizeType: 'indicator', // 'column' | 'indicator' | 'all'
      columnResizeMode: 'header'
    },
    pivotSortState: [
      {
        dimensions: [
          {
            dimensionKey: '地区',
            value: '东北',
            isPivotCorner: false,
            indicatorKey: undefined
          },
          {
            dimensionKey: '邮寄方式',
            value: '二级',
            isPivotCorner: false,
            indicatorKey: undefined
          }
        ],
        order: 'desc'
      },
      {
        dimensions: [
          {
            dimensionKey: '地区',
            value: '华北',
            isPivotCorner: false,
            indicatorKey: undefined
          },
          {
            dimensionKey: '邮寄方式',
            value: '二级',
            isPivotCorner: false,
            indicatorKey: undefined
          },
          {
            indicatorKey: '1',
            value: '销售额',
            isPivotCorner: false
          }
        ],
        order: 'asc'
      }
    ],
    // tooltip: {
    //   isShowOverflowTextTooltip: true,
    // },
    dragHeaderMode: 'all',
    keyboardOptions: {
      selectAllOnCtrlA: true,
      copySelected: true
    },
    indicatorTitle: 'zhibiaomingc'
  };
  option.container = document.getElementById(CONTAINER_ID);
  const instance = new PivotTable(option);
  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
  instance.on('copy_data', e => {
    console.log('copy_data', e);
  });

  // VTable.bindDebugTool(instance.scenegraph.stage as any, {
  //   customGrapicKeys: ['role', '_updateTag']
  // });
}
