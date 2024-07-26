/* eslint-disable prettier/prettier */
// @ts-nocheck
// 有问题可对照demo unitTestPivotTable
import records from '../data/marketsales.json';
import { PivotTable } from '../../src';
import { register } from '../../src';
import { InputEditor } from '@visactor/vtable-editors';
import { createDiv } from '../dom';
global.__VERSION__ = 'none';
const input_editor = new InputEditor({});
register.editor('input', input_editor);
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
    headerEditor: 'input',
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
  test('pivotTable change_cell_value args', () => {
    let count = 0;
    pivotTable.on('change_cell_value', arg => {
      if (count === 0) {
        expect(arg).toEqual({
          col: 0,
          row: 0,
          rawValue: '地区',
          currentValue: '地区',
          changedValue: '1'
        });
      } else {
        expect(arg).toEqual({
          col: 0,
          row: 1,
          rawValue: '地区',
          currentValue: '地区',
          changedValue: '1'
        });
      }
      count++;
    });
    pivotTable.changeCellValues(0, 0, [['1'], ['1']]);
  });
});
