// @ts-nocheck
// 有问题可对照demo unitTestListTable
import { ListTable } from '../../src';
import * as VTable from '../../src/index';
import { createDiv } from '../dom';
global.__VERSION__ = 'none';
describe('listTable-tree-update-date init test', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '1000px';
  containerDom.style.height = '800px';

  const data = [
    {
      类别: '办公用品',
      销售额: '129.696',
      数量: '2',
      利润: '60.704',
      children: [
        {
          类别: '信封', // 对应原子类别
          销售额: '125.44',
          数量: '2',
          利润: '42.56',
          children: [
            {
              类别: '黄色信封',
              销售额: '125.44',
              数量: '2',
              利润: '42.56'
            },
            {
              类别: '白色信封',
              销售额: '1375.92',
              数量: '3',
              利润: '550.2'
            }
          ]
        },
        {
          类别: '器具', // 对应原子类别
          销售额: '1375.92',
          数量: '3',
          利润: '550.2',
          children: [
            {
              类别: '订书机',
              销售额: '125.44',
              数量: '2',
              利润: '42.56'
            },
            {
              类别: '计算器',
              销售额: '1375.92',
              数量: '3',
              利润: '550.2'
            }
          ]
        }
      ]
    },
    {
      类别: '技术',
      销售额: '229.696',
      数量: '20',
      利润: '90.704',
      children: [
        {
          类别: '设备', // 对应原子类别
          销售额: '225.44',
          数量: '5',
          利润: '462.56'
        },
        {
          类别: '配件', // 对应原子类别
          销售额: '375.92',
          数量: '8',
          利润: '550.2'
        },
        {
          类别: '复印机', // 对应原子类别
          销售额: '425.44',
          数量: '7',
          利润: '34.56'
        },
        {
          类别: '电话', // 对应原子类别
          销售额: '175.92',
          数量: '6',
          利润: '750.2'
        }
      ]
    },
    {
      类别: '家具',
      销售额: '129.696',
      数量: '2',
      利润: '-60.704',
      children: [
        {
          类别: '桌子', // 对应原子类别
          销售额: '125.44',
          数量: '2',
          利润: '42.56',
          children: [
            {
              类别: '黄色桌子',
              销售额: '125.44',
              数量: '2',
              利润: '42.56'
            },
            {
              类别: '白色桌子',
              销售额: '1375.92',
              数量: '3',
              利润: '550.2'
            }
          ]
        },
        {
          类别: '椅子', // 对应原子类别
          销售额: '1375.92',
          数量: '3',
          利润: '550.2',
          children: [
            {
              类别: '老板椅',
              销售额: '125.44',
              数量: '2',
              利润: '42.56'
            },
            {
              类别: '沙发椅',
              销售额: '1375.92',
              数量: '3',
              利润: '550.2'
            }
          ]
        }
      ]
    }
  ];
  const option: VTable.ListTableConstructorOptions = {
    container: containerDom,
    columns: [
      {
        field: '类别',
        tree: true,
        title: '类别',
        width: 'auto',
        sort: true
      },
      {
        field: '销售额',
        title: '销售额',
        width: 'auto',
        sort: true
        // tree: true,
      },
      {
        field: '利润',
        title: '利润',
        width: 'auto',
        sort: true
      }
    ],
    showFrozenIcon: true, //显示VTable内置冻结列图标
    widthMode: 'standard',
    records: JSON.parse(JSON.stringify(data)),

    hierarchyIndent: 20,
    hierarchyExpandLevel: Infinity,

    theme: VTable.themes.BRIGHT,
    defaultRowHeight: 32,
    select: {
      disableDragSelect: true
    }
  };

  const listTable = new ListTable(containerDom, option);

  test('delete', () => {
    expect(listTable.getRecordIndexByCell(0, 4)).toEqual([0, 0, 1]);
    listTable.deleteRecords([[0, 0, 1]]);
    expect(listTable.getRecordIndexByCell(0, 4)).toEqual([0, 1]);
  });

  test('add', () => {
    listTable.addRecords(
      [
        {
          类别: '0黄色信封0',
          销售额: '1125.44',
          数量: '1',
          利润: '142.56'
        }
      ],
      [0, 0, 0]
    );
    expect(listTable.getRecordIndexByCell(0, 3)).toEqual([0, 0, 0]);
    expect(listTable.getRecordIndexByCell(0, 4)).toEqual([0, 0, 1]);
    expect(listTable.getRecordByCell(0, 3)).toEqual({
      类别: '0黄色信封0',
      销售额: '1125.44',
      数量: '1',
      利润: '142.56'
    });
  });

  test('update', () => {
    listTable.updateRecords(
      [
        {
          类别: '0黄色信封',
          销售额: '125.44',
          数量: '2',
          利润: '42.56'
        }
      ],
      [[0, 0, 0]]
    );
    expect(listTable.getRecordByCell(0, 3)).toEqual({
      类别: '0黄色信封',
      销售额: '125.44',
      数量: '2',
      利润: '42.56'
    });
  });

  test('delete', () => {
    expect(listTable.getRecordIndexByCell(0, 4)).toEqual([0, 0, 1]);
    listTable.deleteRecords([[0, 0, 1]]);
    expect(listTable.getRecordIndexByCell(0, 4)).toEqual([0, 1]);
  });

  test('sort-delete', () => {
    listTable.updateOption(option);
    listTable.updateSortState({ field: '类别', order: 'desc' });
    expect(listTable.getRecordIndexByCell(0, 2)).toEqual([1, 1]);
    listTable.deleteRecords([[1, 1]]);
    expect(listTable.getRecordIndexByCell(0, 2)).toEqual([1, 0]);
  });

  test('sort-add', () => {
    listTable.addRecords(
      [
        {
          类别: '0000',
          销售额: '1125.44',
          数量: '1',
          利润: '142.56'
        }
      ],
      [1, 0]
    );
    expect(listTable.getRecordByCell(0, 5)).toEqual({
      类别: '0000',
      销售额: '1125.44',
      数量: '1',
      利润: '142.56'
    });
  });

  test('sort-update', () => {
    listTable.updateRecords(
      [
        {
          类别: '1设备',
          销售额: '1125.44',
          数量: '1',
          利润: '142.56'
        }
      ],
      [[1, 1]]
    );
    expect(listTable.getRecordByCell(0, 4)).toEqual({
      类别: '1设备',
      销售额: '1125.44',
      数量: '1',
      利润: '142.56'
    });
  });

  test('changed-value-cache-update', () => {
    option.records = JSON.parse(JSON.stringify(data));
    listTable.updateOption(option);
    listTable.changeCellValue(0, 3, 'hsxf');

    expect(listTable.getRawFieldData('类别', 0, 3)).toEqual('黄色信封');
    expect(listTable.getCellOriginValue(0, 3)).toEqual('hsxf');

    listTable.addRecords(
      [
        {
          类别: '0黄色信封0',
          销售额: '1125.44',
          数量: '1',
          利润: '142.56'
        }
      ],
      [0, 0, 0]
    );

    expect(listTable.getRawFieldData('类别', 0, 3)).toEqual('0黄色信封0');
    expect(listTable.getRawFieldData('类别', 0, 4)).toEqual('黄色信封');
    expect(listTable.getCellOriginValue(0, 4)).toEqual('hsxf');
  });
});
