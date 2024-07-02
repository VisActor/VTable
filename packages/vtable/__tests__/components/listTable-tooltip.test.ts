// @ts-nocheck
// 有问题可对照demo unitTestListTable
import records from '../data/marketsales.json';
import { ListTable } from '../../src';
import * as VTable from '../../src/index';
import { createDiv } from '../dom';
global.__VERSION__ = 'none';
describe('listTable-tooltip init test', () => {
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
    allowFrozenColCount: 5
  };

  option.container = containerDom;
  option.records = records;
  const listTable = new ListTable(option);
  test('listTable-tooltip getCell', () => {
    const col = 0;
    const row = 2;
    const rect = listTable.getVisibleCellRangeRelativeRect({ col, row });
    listTable.showTooltip(col, row, {
      content: 'Order ID：' + listTable.getCellValue(col, row),
      referencePosition: { rect, placement: VTable.TYPES.Placement.right }, //TODO
      className: 'defineTooltip',
      style: {
        bgColor: 'black',
        color: 'white',
        font: 'normal bold normal 14px/1 STKaiti',
        arrowMark: true
      }
    });

    expect(listTable.internalProps.tooltipHandler._attachInfo.range).toStrictEqual({
      start: {
        col: 0,
        row: 2
      },
      end: {
        col: 0,
        row: 2
      }
    });
  });
  // setTimeout(() => {
  //   listTable.release();
  // }, 1000);
});
