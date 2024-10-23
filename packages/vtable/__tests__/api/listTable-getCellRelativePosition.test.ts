// @ts-nocheck
// 有问题可对照demo unitTestListTable
import records from '../data/marketsales.json';
import { ListTable } from '../../src';
import { createDiv } from '../dom';
global.__VERSION__ = 'none';
describe('listTable getCellRect test', () => {
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
    }
  ];
  const option = {
    columns: [...columns, ...columns, ...columns, ...columns],
    defaultColWidth: 150,
    allowFrozenColCount: 5,
    frozenColCount: 1,
    bottomFrozenRowCount: 2,
    rightFrozenColCount: 2
  };

  option.container = containerDom;
  option.records = records;
  const listTable = new ListTable(option);
  test('listTable getCellAtRelativePosition init', () => {
    expect(listTable.getCellAtRelativePosition(100, 220)).toEqual({
      row: 5,
      col: 0,
      rect: {
        left: 0,
        right: 151,
        top: 200,
        bottom: 240,
        width: 151,
        height: 40
      }
    });

    expect(listTable.getCellAtRelativePosition(800, 220)).toEqual({
      row: 5,
      col: 14,
      rect: {
        top: 200,
        bottom: 240,
        height: 40
      }
    });

    expect(listTable.getCellAtRelativePosition(400, 220)).toEqual({
      row: 5,
      col: 2,
      rect: {
        left: 301,
        right: 451,
        top: 200,
        bottom: 240,
        width: 150,
        height: 40
      }
    });

    expect(listTable.getCellAtRelativePosition(100, 740)).toEqual({
      row: 38,
      col: 0,
      rect: {
        left: 0,
        right: 151,
        width: 151
      }
    });

    expect(listTable.getCellAtRelativePosition(800, 740)).toEqual({
      row: 38,
      col: 14,
      rect: {}
    });

    expect(listTable.getCellAtRelativePosition(400, 740)).toEqual({
      row: 38,
      col: 2,
      rect: {
        left: 301,
        right: 451,
        width: 150
      }
    });

    expect(listTable.getCellAtRelativePosition(100, 20)).toEqual({
      row: 0,
      col: 0,
      rect: {
        left: 0,
        right: 151,
        top: 0,
        bottom: 40,
        width: 151,
        height: 40
      }
    });

    expect(listTable.getCellAtRelativePosition(800, 20)).toEqual({
      row: 0,
      col: 14,
      rect: {
        top: 0,
        bottom: 40,
        height: 40
      }
    });

    expect(listTable.getCellAtRelativePosition(400, 20)).toEqual({
      row: 0,
      col: 2,
      rect: {
        left: 301,
        right: 451,
        top: 0,
        bottom: 40,
        width: 150,
        height: 40
      }
    });
  });

  test('listTable getCellAtRelativePosition scroll', () => {
    listTable.scrollLeft = 500;
    listTable.scrollTop = 500;
    expect(listTable.getCellAtRelativePosition(100, 220)).toEqual({
      row: 17,
      col: 0,
      rect: {
        left: 0,
        right: 151,
        top: 680,
        bottom: 720,
        width: 151,
        height: 40
      }
    });

    expect(listTable.getCellAtRelativePosition(800, 220)).toEqual({
      row: 17,
      col: 14,
      rect: {
        top: 680,
        bottom: 720,
        height: 40
      }
    });

    expect(listTable.getCellAtRelativePosition(400, 220)).toEqual({
      row: 17,
      col: 5,
      rect: {
        left: 752,
        right: 902,
        top: 680,
        bottom: 720,
        width: 150,
        height: 40
      }
    });

    expect(listTable.getCellAtRelativePosition(100, 740)).toEqual({
      row: 38,
      col: 0,
      rect: {
        left: 0,
        right: 151,
        width: 151
      }
    });

    expect(listTable.getCellAtRelativePosition(800, 740)).toEqual({
      row: 38,
      col: 14,
      rect: {}
    });

    expect(listTable.getCellAtRelativePosition(400, 740)).toEqual({
      row: 38,
      col: 5,
      rect: {
        left: 752,
        right: 902,
        width: 150
      }
    });

    expect(listTable.getCellAtRelativePosition(100, 20)).toEqual({
      row: 0,
      col: 0,
      rect: {
        left: 0,
        right: 151,
        top: 0,
        bottom: 40,
        width: 151,
        height: 40
      }
    });

    expect(listTable.getCellAtRelativePosition(800, 20)).toEqual({
      row: 0,
      col: 14,
      rect: {
        top: 0,
        bottom: 40,
        height: 40
      }
    });

    expect(listTable.getCellAtRelativePosition(400, 20)).toEqual({
      row: 0,
      col: 5,
      rect: {
        left: 752,
        right: 902,
        top: 0,
        bottom: 40,
        width: 150,
        height: 40
      }
    });
  });
});
