/* eslint-disable prettier/prettier */
// @ts-nocheck
// 有问题可对照demo unitTestPivotTable
import records from './data/marketsales.json';
import { PivotTable } from '../src';
import { createDiv } from './dom';
global.__VERSION__ = 'none';
describe('pivotTable init test', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '500px';
  containerDom.style.height = '500px';

  const rowTree = [
    {
      dimensionKey: '地区',
      value: '东北',
      children: [
        {
          dimensionKey: '省/自治区',
          value: '吉林'
        },
        {
          dimensionKey: '省/自治区',
          value: '辽宁'
        },
        {
          dimensionKey: '省/自治区',
          value: '黑龙江'
        }
      ]
    },
    {
      dimensionKey: '地区',
      value: '中南',
      children: [
        {
          dimensionKey: '省/自治区',
          value: '广东'
        },
        {
          dimensionKey: '省/自治区',
          value: '广西'
        },
        {
          dimensionKey: '省/自治区',
          value: '河南'
        },
        {
          dimensionKey: '省/自治区',
          value: '海南'
        },
        {
          dimensionKey: '省/自治区',
          value: '湖北'
        },
        {
          dimensionKey: '省/自治区',
          value: '湖南'
        }
      ]
    },
    {
      dimensionKey: '地区',
      value: '华东',
      children: [
        {
          dimensionKey: '省/自治区',
          value: '上海'
        },
        {
          dimensionKey: '省/自治区',
          value: '安徽'
        },
        {
          dimensionKey: '省/自治区',
          value: '山东'
        },
        {
          dimensionKey: '省/自治区',
          value: '江苏'
        },
        {
          dimensionKey: '省/自治区',
          value: '江西'
        },
        {
          dimensionKey: '省/自治区',
          value: '浙江'
        },
        {
          dimensionKey: '省/自治区',
          value: '福建'
        }
      ]
    },
    {
      dimensionKey: '地区',
      value: '华北',
      children: [
        {
          dimensionKey: '省/自治区',
          value: '内蒙古'
        },
        {
          dimensionKey: '省/自治区',
          value: '北京'
        },
        {
          dimensionKey: '省/自治区',
          value: '天津'
        },
        {
          dimensionKey: '省/自治区',
          value: '山西'
        },
        {
          dimensionKey: '省/自治区',
          value: '河北'
        }
      ]
    },
    {
      dimensionKey: '地区',
      value: '西北',
      children: [
        {
          dimensionKey: '省/自治区',
          value: '宁夏'
        },
        {
          dimensionKey: '省/自治区',
          value: '新疆'
        },
        {
          dimensionKey: '省/自治区',
          value: '甘肃'
        },
        {
          dimensionKey: '省/自治区',
          value: '陕西'
        },
        {
          dimensionKey: '省/自治区',
          value: '青海'
        }
      ]
    },
    {
      dimensionKey: '地区',
      value: '西南',
      children: [
        {
          dimensionKey: '省/自治区',
          value: '云南'
        },
        {
          dimensionKey: '省/自治区',
          value: '四川'
        },
        {
          dimensionKey: '省/自治区',
          value: '海南'
        },
        {
          dimensionKey: '省/自治区',
          value: '西藏自治区'
        },
        {
          dimensionKey: '省/自治区',
          value: '贵州'
        },
        {
          dimensionKey: '省/自治区',
          value: '重庆'
        }
      ]
    }
  ];
  const columnTree = [
    {
      dimensionKey: '子类别',
      value: '书架',
      children: [
        {
          indicatorKey: '利润'
        },
        {
          indicatorKey: '销售额'
        }
      ]
    },
    {
      dimensionKey: '子类别',
      value: '信封',
      children: [
        {
          indicatorKey: '利润'
        },
        {
          indicatorKey: '销售额'
        }
      ]
    },
    {
      dimensionKey: '子类别',
      value: '器具',
      children: [
        {
          indicatorKey: '利润'
        },
        {
          indicatorKey: '销售额'
        }
      ]
    },
    {
      dimensionKey: '子类别',
      value: '复印机',
      children: [
        {
          indicatorKey: '利润'
        },
        {
          indicatorKey: '销售额'
        }
      ]
    },
    {
      dimensionKey: '子类别',
      value: '收纳具',
      children: [
        {
          indicatorKey: '利润'
        },
        {
          indicatorKey: '销售额'
        }
      ]
    },
    {
      dimensionKey: '子类别',
      value: '标签',
      children: [
        {
          indicatorKey: '利润'
        },
        {
          indicatorKey: '销售额'
        }
      ]
    },
    {
      dimensionKey: '子类别',
      value: '桌子',
      children: [
        {
          indicatorKey: '利润'
        },
        {
          indicatorKey: '销售额'
        }
      ]
    },
    {
      dimensionKey: '子类别',
      value: '椅子',
      children: [
        {
          indicatorKey: '利润'
        },
        {
          indicatorKey: '销售额'
        }
      ]
    },
    {
      dimensionKey: '子类别',
      value: '用具',
      children: [
        {
          indicatorKey: '利润'
        },
        {
          indicatorKey: '销售额'
        }
      ]
    },
    {
      dimensionKey: '子类别',
      value: '用品',
      children: [
        {
          indicatorKey: '利润'
        },
        {
          indicatorKey: '销售额'
        }
      ]
    },
    {
      dimensionKey: '子类别',
      value: '电话',
      children: [
        {
          indicatorKey: '利润'
        },
        {
          indicatorKey: '销售额'
        }
      ]
    },
    {
      dimensionKey: '子类别',
      value: '系固件',
      children: [
        {
          indicatorKey: '利润'
        },
        {
          indicatorKey: '销售额'
        }
      ]
    },
    {
      dimensionKey: '子类别',
      value: '纸张',
      children: [
        {
          indicatorKey: '利润'
        },
        {
          indicatorKey: '销售额'
        }
      ]
    },
    {
      dimensionKey: '子类别',
      value: '美术',
      children: [
        {
          indicatorKey: '利润'
        },
        {
          indicatorKey: '销售额'
        }
      ]
    },
    {
      dimensionKey: '子类别',
      value: '装订机',
      children: [
        {
          indicatorKey: '利润'
        },
        {
          indicatorKey: '销售额'
        }
      ]
    },
    {
      dimensionKey: '子类别',
      value: '设备',
      children: [
        {
          indicatorKey: '利润'
        },
        {
          indicatorKey: '销售额'
        }
      ]
    },
    {
      dimensionKey: '子类别',
      value: '配件',
      children: [
        {
          indicatorKey: '利润'
        },
        {
          indicatorKey: '销售额'
        }
      ]
    }
  ];
  const rows = [
    {
      dimensionKey: '地区',
      title: '地区',
      headerStyle: {
        textStick: true,
        color: 'red',
        bgColor: 'yellow'
      },
      width: 'auto',
      showSort: false
    },
    {
      dimensionKey: '省/自治区',
      title: '省/自治区',
      width: 'auto',
      showSort: false,
      headerStyle: {
        textStick: true,
        color: 'red',
        bgColor: 'yellow',
        marked(arg) {
          const cellHeaderPaths = arg.table.getCellHeaderPaths(arg.col, arg.row);
          if (cellHeaderPaths.rowHeaderPaths[1].value === '辽宁') {
            return true;
          }
          return false;
        }
      }
    }
  ];
  const columns = [
    {
      dimensionKey: '子类别',
      title: '子类别',
      headerStyle: {
        textStick: true
      },
      showSort: false
    }
  ];
  const indicators = [
    {
      indicatorKey: '利润',
      title: '利润',
      width: 'auto',
      style: {
        borderColor: 'red',
        bgColor(arg) {
          if (Number(Math.ceil(arg.row)) % 2 === 1) {
            return 'gray';
          }
          return '#f6d7b8';
        }
      }
    },
    {
      indicatorKey: '销售额',
      title: '销售额',
      width: 'auto'
    }
  ];
  const option = {
    rowTree,
    columnTree,
    rows,
    columns,
    indicators,
    corner: {
      titleOnDimension: 'row'
    },
    showColumnHeader: true,
    showRowHeader: true,
    hideIndicatorName: false,
    defaultColWidth: 150,
    heightMode: 'autoHeight',
    autoWrapText: true,
    dragHeaderMode: 'all'
  };

  option.container = containerDom;
  option.records = records;
  const pivotTable = new PivotTable(option);

  test('pivotTable init', () => {
    expect(pivotTable.frozenColCount).toBe(2);
  });
  test('pivotTable rowHeaderLevelCount', () => {
    expect(pivotTable.rowHeaderLevelCount).toBe(2);
  });
  test('pivotTable API getCellStyle', () => {
    expect(pivotTable.getCellStyle(1, 3)).toEqual({
      textAlign: 'left',
      textBaseline: 'middle',
      bgColor: 'yellow',
      color: 'red',
      lineHeight: 16,
      autoWrapText: true,
      lineClamp: 'auto',
      textOverflow: 'ellipsis',
      borderColor: '#E1E4E8',
      borderLineWidth: 1,
      borderLineDash: [],
      fontFamily: 'Arial,sans-serif',
      fontSize: 16,
      fontStyle: undefined,
      fontVariant: undefined,
      fontWeight: 'bold',
      lineThrough: false,
      lineThroughLineWidth: undefined,
      // lineThroughDash: undefined,
      underline: false,
      underlineDash: undefined,
      underlineOffset: undefined,
      padding: [10, 16, 10, 16],
      _linkColor: '#3772ff',
      _strokeArrayColor: undefined,
      _strokeArrayWidth: undefined
    });
  });
  test('pivotTable API getCellStyle', () => {
    expect(pivotTable.getCellStyle(2, 3)).toEqual({
      textAlign: 'left',
      textBaseline: 'middle',
      bgColor: 'gray',
      color: '#000',
      lineHeight: 14,
      autoWrapText: true,
      lineClamp: 'auto',
      textOverflow: 'ellipsis',
      borderColor: 'red',
      borderLineWidth: 1,
      borderLineDash: [],
      fontFamily: 'Arial,sans-serif',
      fontSize: 14,
      fontStyle: undefined,
      fontVariant: undefined,
      fontWeight: undefined,
      lineThrough: false,
      lineThroughLineWidth: undefined,
      // lineThroughDash: undefined,
      underline: false,
      underlineDash: undefined,
      underlineOffset: undefined,
      padding: [10, 16, 10, 16],
      _linkColor: '#3772ff',
      _strokeArrayColor: undefined,
      _strokeArrayWidth: undefined
    });
  });
  test('pivotTable getCellRange', () => {
    expect(pivotTable.getCellRange(0, 6)).toEqual({
      end: { col: 0, row: 10 },
      start: { col: 0, row: 5 }
    });
  });
  test('pivotTable getCellRange', () => {
    expect(pivotTable.getCellRange(4, 0)).toEqual({
      end: { col: 5, row: 0 },
      start: { col: 4, row: 0 }
    });
  });

  test('pivotTable API getCellHeaderPaths', () => {
    expect(pivotTable.getCellHeaderPaths(2, 4)).toEqual({
      colHeaderPaths: [
        {
          dimensionKey: '子类别',
          value: '书架',
          indicatorKey: undefined
        },
        {
          indicatorKey: '利润',
          value: '利润',
          dimensionKey: undefined
        }
      ],
      rowHeaderPaths: [
        {
          dimensionKey: '地区',
          value: '东北',
          indicatorKey: undefined
        },
        {
          dimensionKey: '省/自治区',
          value: '黑龙江',
          indicatorKey: undefined
        }
      ],
      cellLocation: 'body'
    });
  });

  test('pivotTable API getCellAddressByHeaderPaths', () => {
    expect(
      pivotTable.getCellAddressByHeaderPaths({
        colHeaderPaths: [
          {
            dimensionKey: '子类别',
            value: '书架',
            children: [
              {
                indicatorKey: '利润',
                level: 1,
                startIndex: 0,
                startInTotal: 0,
                id: 2,
                size: 1
              },
              {
                indicatorKey: '销售额',
                level: 1,
                startIndex: 1,
                startInTotal: 1,
                id: 3,
                size: 1
              }
            ],
            level: 0,
            startIndex: 0,
            startInTotal: 0,
            id: 1,
            size: 2
          },
          {
            indicatorKey: '利润',
            level: 1,
            startIndex: 0,
            startInTotal: 0,
            id: 2,
            size: 1
          }
        ],
        rowHeaderPaths: [
          {
            dimensionKey: '地区',
            value: '东北',
            children: [
              {
                dimensionKey: '省/自治区',
                value: '吉林',
                level: 1,
                startIndex: 0,
                startInTotal: 0,
                id: 53,
                size: 1
              },
              {
                dimensionKey: '省/自治区',
                value: '辽宁',
                level: 1,
                startIndex: 1,
                startInTotal: 1,
                id: 54,
                size: 1
              },
              {
                dimensionKey: '省/自治区',
                value: '黑龙江',
                level: 1,
                startIndex: 2,
                startInTotal: 2,
                id: 55,
                size: 1
              }
            ],
            level: 0,
            startIndex: 0,
            startInTotal: 0,
            id: 52,
            size: 3
          },
          {
            dimensionKey: '省/自治区',
            value: '黑龙江',
            level: 1,
            startIndex: 2,
            startInTotal: 2,
            id: 55,
            size: 1
          }
        ]
      })
    ).toEqual({ col: 2, row: 4 });
  });
  test('pivotTable dragHeader interaction', () => {
    pivotTable.selectCell(2, 1);
    pivotTable.stateManager.startMoveCol(2, 1, 230, 60);
    pivotTable.stateManager.updateMoveCol(3, 1, 320, 60);
    pivotTable.stateManager.endMoveCol();
    expect(pivotTable.getCellValue(3, 1)).toEqual('利润');
  });
  test('pivotTable updateOption hideIndicatorName&format', () => {
    indicators[0].format = rec => {
      return rec?.['利润'] ?? '0' + '元';
    };
    const option1 = {
      rowTree,
      columnTree,
      rows,
      columns,
      indicators,
      corner: {
        titleOnDimension: 'row'
      },
      showColumnHeader: true,
      showRowHeader: true,
      hideIndicatorName: true,
      defaultColWidth: 150,
      heightMode: 'autoHeight',
      autoWrapText: true
    };
    pivotTable.updateOption(option1);
    expect(pivotTable.getCellValue(6, 6)).toEqual('0元');
    expect(pivotTable.getCellOriginValue(6, 4)).toEqual(550.2);
    expect(pivotTable.getCellOriginRecord(6, 4)).toEqual([
      {
        '行 ID': '5',
        '订单 ID': 'CN-2018-2975416',
        订单日期: '2018/5/31',
        发货日期: '2018/6/2',
        邮寄方式: '二级',
        '客户 ID': '万兰-15730',
        客户名称: '万兰',
        细分: '消费者',
        城市: '汕头',
        '省/自治区': '广东',
        '国家/地区': '中国',
        地区: '中南',
        '产品 ID': '办公用-器具-10003452',
        类别: '办公用品',
        子类别: '器具',
        产品名称: 'KitchenAid 搅拌机, 黑色',
        销售额: '1375.92',
        数量: '3',
        折扣: '0',
        利润: '550.2'
      }
    ]);
    pivotTable.release();
  });
});
