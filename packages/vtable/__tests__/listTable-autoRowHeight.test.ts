// @ts-nocheck
// 有问题可对照demo unitTestListTable
import records from './marketsales.json';
import { ListTable } from '../src/ListTable';
import { createDiv, removeDom } from './dom';
global.__VERSION__ = 'none';
describe('listTable init test', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '500px';
  containerDom.style.height = '500px';

  const option = {
    columns: [
      {
        field: '订单 ID',
        caption: '订单 ID',
        sort: true,
        width: 'auto'
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
    ],
    defaultColWidth: 150,
    allowFrozenColCount: 5,
    autoRowHeight: true,
    autoWrapText: true
  };

  option.parentElement = containerDom;
  option.records = records;
  const listTable = new ListTable(option);
  // listTable.computeColsWidth();
  // listTable.computeRowsHeight();
  test('listTable init', () => {
    expect(listTable.frozenColCount).toBe(0);
  });

  test('listTable column width', () => {
    expect(listTable.getColWidth(0)).toBe(162);
  });

  test('listTable row Height', () => {
    expect(listTable.getRowHeight(1)).toBe(34);
  });

  test('listTable API getCellStyle', () => {
    console.log('ffffff:', listTable.getCellStyle(3, 3));
    expect(listTable.getCellStyle(3, 3)).toEqual({
      textAlign: 'left',
      textBaseline: 'middle',
      bgColor: '#FAF9FB',
      color: '#000',
      fontSize: 14,
      fontFamily: 'sans-serif',
      lineHeight: 14,
      autoWrapText: true,
      lineClamp: 'auto',
      textOverflow: 'ellipsis',
      borderColor: '#E1E4E8',
      borderLineWidth: 1,
      borderLineDash: [],
      fontStyle: undefined,
      fontVariant: undefined,
      fontWeight: null,
      lineThrough: undefined,
      lineThroughDash: undefined,
      underline: undefined,
      underlineDash: undefined
    });
  });

  test('listTable API getCellAddress', () => {
    expect(listTable.getCellAddress(record => record['客户名称'] === '万兰', '客户名称')).toEqual({
      row: 5,
      col: 3
    });
  });
  test('listTable API getCellValue', () => {
    expect(listTable.getCellValue(3, 5)).toEqual('万兰');
  });

  test('listTable API getCellType', () => {
    expect(listTable.getCellType(5, 3)).toEqual('body');
    expect(listTable.getCellType(5, 0)).toEqual('columnHeader');
  });
});
