// @ts-nocheck
// 有问题可对照demo unitTestListTable
import records from '../data/marketsales.json';
import { ListTable } from '../../src';
import { createDiv } from '../dom';
global.__VERSION__ = 'none';
describe('listTable init test', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '1000px';
  containerDom.style.height = '800px';
  const columns = [
    {
      field: '订单 ID',
      caption: '订单 ID',
      sort: true,
      width: 'auto',
      description: '这是订单的描述信息',
      style: {
        fontFamily: 'Arial',
        fontSize: 14
      }
    },
    {
      field: '订单日期',
      caption: '订单日期'
    },
    {
      field: '发货日期',
      caption: '发货日期'
    },
    {
      field: '客户名称',
      caption: '客户名称',
      style: {
        padding: [10, 0, 10, 60]
      }
    },
    {
      field: '邮寄方式',
      caption: '邮寄方式'
    },
    {
      field: '省/自治区',
      caption: '省/自治区'
    },
    {
      field: '产品名称',
      caption: '产品名称'
    },
    {
      field: '类别',
      caption: '类别'
    },
    {
      field: '子类别',
      caption: '子类别'
    },
    {
      field: '销售额',
      caption: '销售额'
    },
    {
      field: '数量',
      caption: '数量'
    },
    {
      field: '折扣',
      caption: '折扣'
    },
    {
      field: '利润',
      caption: '利润'
    }
  ];
  const option = {
    columns,
    defaultColWidth: 150,
    frozenColCount: 2,
    rightFrozenColCount: 2,
    bottomFrozenRowCount: 2
  };

  option.container = containerDom;
  option.records = records;
  const listTable = new ListTable(option);
  test('listTable cellIsInVisualView', () => {
    expect(listTable.cellIsInVisualView(3, 0)).toBe(true);
    expect(listTable.cellIsInVisualView(0, 3)).toBe(true);
    expect(listTable.cellIsInVisualView(5, 3)).toBe(false);
    expect(listTable.cellIsInVisualView(4, 3)).toBe(false);
    expect(listTable.cellIsInVisualView(3, 3)).toBe(true);
    expect(listTable.cellIsInVisualView(3, 39)).toBe(true);
    expect(listTable.cellIsInVisualView(3, 38)).toBe(true);

    expect(listTable.cellIsInVisualView(12, 3)).toBe(true);
    expect(listTable.cellIsInVisualView(11, 3)).toBe(true);
    expect(listTable.cellIsInVisualView(10, 3)).toBe(false);

    expect(listTable.cellIsInVisualView(3, 37)).toBe(false);
  });

  test('listTable scroll cellIsInVisualView', () => {
    listTable.scrollTop = 100;
    listTable.scrollLeft = 100;
    expect(listTable.cellIsInVisualView(3, 5)).toBe(true);
    expect(listTable.cellIsInVisualView(2, 5)).toBe(false);
    expect(listTable.cellIsInVisualView(5, 5)).toBe(false);
    expect(listTable.cellIsInVisualView(4, 5)).toBe(true);
    expect(listTable.cellIsInVisualView(12, 5)).toBe(true);

    expect(listTable.cellIsInVisualView(3, 19)).toBe(true);
    expect(listTable.cellIsInVisualView(3, 20)).toBe(false);
    expect(listTable.cellIsInVisualView(2, 19)).toBe(false);

    expect(listTable.cellIsInVisualView(3, 39)).toBe(true);
    expect(listTable.cellIsInVisualView(3, 38)).toBe(true);
  });
});
