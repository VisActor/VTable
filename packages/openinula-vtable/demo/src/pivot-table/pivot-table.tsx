import { PivotTable } from '../../../src';

function generatePivotDataSource(num, colCount) {
  const array = new Array(num);
  for (let i = 0; i < num; i++) {
    const data = new Array(colCount);
    for (let j = 0; j < colCount; j++) {
      data[j] = i + j;
    }
    array[i] = data;
  }
  return array;
}
const DEFAULT_BAR_COLOR = data => {
  const num = (data.percentile ?? 0) * 100;
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

function App() {
  const records = generatePivotDataSource(19, 18);

  const option = {
    columnHeaderTitle: {
      title: true,
      headerStyle: {
        textStick: true
      }
    },
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
          textAlign: 'center',
          borderColor: 'blue',
          color: 'pink',
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
        format(rec) {
          return `${rec.dataValue}%`;
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
            return `rgb(${100 + 100 * (1 - (data.percentile ?? 0))},${100 + 100 * (1 - (data.percentile ?? 0))},${
              255 * (1 - (data.percentile ?? 0))
            })`;
          },
          barColor: 'transparent'
        },
        cellType: 'progressbar',
        showSort: true
        // headerType: 'MULTILINETEXT',
      },
      {
        indicatorKey: '2',
        title: '利润',
        format(rec) {
          // if (rec.rowDimensions[0].value === '东北') return `${rec.dataValue}%`;
          return rec.dataValue;
        },
        cellType: 'progressbar',
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
                indicatorKey: '1',
                value: '销售额'
              },
              {
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
                indicatorKey: '1',
                value: '销售额'
              },
              {
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
    rowTree: [
      {
        dimensionKey: '类别',
        value: '办公用品',
        children: [
          { dimensionKey: '子类别', value: '电脑' },
          { dimensionKey: '子类别', value: '装订机' },
          { dimensionKey: '子类别', value: '签字笔' },
          { dimensionKey: '子类别', value: '标签' },
          { dimensionKey: '子类别', value: '收纳柜' },
          { dimensionKey: '子类别', value: '纸张' },
          { dimensionKey: '子类别', value: '电灯' }
        ]
      },
      {
        dimensionKey: '类别',
        value: '家具',
        children: [
          { dimensionKey: '子类别', value: '衣柜' },
          { dimensionKey: '子类别', value: '沙发' },
          { dimensionKey: '子类别', value: '餐桌' },
          { dimensionKey: '子类别', value: '椅子' },
          { dimensionKey: '子类别', value: '桌子' }
        ]
      },
      {
        dimensionKey: '类别',
        value: '餐饮',
        children: [
          { dimensionKey: '子类别', value: '锅具' },
          {
            dimensionKey: '子类别',
            value: '油盐酱醋'
          },
          { dimensionKey: '子类别', value: '米面' }
        ]
      },
      {
        dimensionKey: '类别',
        value: '技术',
        children: [
          { dimensionKey: '子类别', value: '设备' },
          { dimensionKey: '子类别', value: '配件' },
          { dimensionKey: '子类别', value: '电话' },
          { dimensionKey: '子类别', value: '复印机' }
        ]
      }
    ],
    corner: {
      titleOnDimension: 'column',
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
    indicatorTitle: '指标名称',
    indicatorsAsCol: false,
    records,
    // showFrozenIcon: false, //显示VTable内置冻结列图标
    // allowFrozenColCount: 2,
    widthMode: 'autoWidth', // 宽度模式：standard 标准模式； adaptive 自动填满容器
    defaultRowHeight: 80,
    // resize: {
    // columnResizeType: 'indicator', // 'column' | 'indicator' | 'all'
    // },
    tooltip: {
      isShowOverflowTextTooltip: true
    }
  };

  return <PivotTable option={option} />;
}

export default App;
