// @ts-nocheck
// 有问题可对照demo unitTestListTable
import records from './data/marketsales.json';
import { ListTable } from '../src';
import { createDiv } from './dom';
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
    allowFrozenColCount: 5
  };

  option.container = containerDom;
  option.records = records;
  const listTable = new ListTable(option);
  test('listTable getCellValue', () => {
    expect(listTable.getCellValue(6, 3)).toBe('Cardinal 孔加固材料, 回收');
  });
  test('listTable getCellOverflowText', () => {
    expect(listTable.getCellOverflowText(6, 3)).toBe('Cardinal 孔加固材料, 回收');
  });
  test('listTable getHeaderDescription', () => {
    expect(listTable.getHeaderDescription(0, 0)).toBe('这是订单的描述信息');
  });
  test('listTable setScrollTop getScrollTop', () => {
    listTable.setScrollTop(100);
    expect(listTable.getScrollTop()).toBe(100);
  });
  test('listTable setScrollLeft getScrollLeft', () => {
    listTable.setScrollLeft(100);
    expect(listTable.getScrollLeft()).toBe(100);
  });
  test('listTable scrollToCell', () => {
    listTable.scrollToCell({ col: 4, row: 28 });
    expect(listTable.getScrollLeft()).toBe(601);
    expect(listTable.getScrollTop()).toBe(802);
  });
  test('listTable updateTheme', () => {
    listTable.heightMode = 'autoHeight';
    listTable.updateTheme({
      bodyStyle: {
        fontFamily: 'Calibri',
        fontSize: 28,
        color: 'red'
      }
    });
    listTable.scrollToCell({ col: 6, row: 16 });

    expect(listTable.getScrollLeft()).toBe(901);
    expect(listTable.getScrollTop()).toBe(720);
    expect(listTable.getCellStyle(6, 16)).toStrictEqual({
      strokeColor: undefined,
      textAlign: 'left',
      textBaseline: 'middle',
      bgColor: '#FFF',
      color: 'red',
      fontFamily: 'Calibri',
      fontSize: 28,
      fontStyle: undefined,
      fontVariant: undefined,
      fontWeight: undefined,
      lineHeight: 28,
      autoWrapText: false,
      lineClamp: 'auto',
      textOverflow: 'ellipsis',
      borderColor: '#000',
      borderLineWidth: 1,
      borderLineDash: [],
      underline: false,
      underlineDash: undefined,
      underlineOffset: undefined,
      underlineWidth: undefined,
      lineThrough: false,
      lineThroughLineWidth: undefined,
      padding: [10, 16, 10, 16],
      _linkColor: '#3772ff',
      _strokeArrayColor: undefined,
      _strokeArrayWidth: undefined
    });
  });
  test('listTable updateOption records&autoWidth&widthMode', () => {
    columns.shift();
    const recordDeleted = records.slice(10, 30);
    const option1 = {
      columns,
      records: recordDeleted,
      defaultColWidth: 150,
      allowFrozenColCount: 5,
      heightMode: 'autoHeight',
      autoWrapText: true,
      widthMode: 'autoWidth',
      limitMaxAutoWidth: 170,
      dragHeaderMode: 'all'
    };
    listTable.updateOption(option1);
    expect(listTable.rowCount).toBe(21);
    expect(listTable.colCount).toBe(12);
    expect(listTable.getScrollTop()).toBe(0);
    expect(listTable.getColWidth(0)).toBe(122);
    expect(listTable.getColWidth(5)).toBe(170);
  });
  test('listTable selectCell', () => {
    listTable.selectCell(4, 5);
    expect(listTable.stateManager?.select.ranges).toEqual([
      {
        start: {
          col: 4,
          row: 5
        },
        end: {
          col: 4,
          row: 5
        }
      }
    ]);
    const scrollTop = listTable.scrollTop;
    listTable.selectCells([
      { start: { col: 1, row: 3 }, end: { col: 4, row: 6 } },
      { start: { col: 0, row: 4 }, end: { col: 7, row: 4 } },
      { start: { col: 4, row: 36 }, end: { col: 7, row: 36 } }
    ]);

    expect(listTable.stateManager?.select.ranges).toEqual([
      { start: { col: 1, row: 3 }, end: { col: 4, row: 6 }, skipBodyMerge: true },
      { start: { col: 0, row: 4 }, end: { col: 7, row: 4 }, skipBodyMerge: true },
      { start: { col: 4, row: 36 }, end: { col: 7, row: 36 }, skipBodyMerge: true }
    ]);
    expect(listTable.getScrollTop()).toBe(scrollTop);
  });
  test('listTable measureTextWidth', () => {
    const measureTextWdith = listTable.measureText("家里方大化工撒个福建师大看哈 fdsfgj! *-+&5%#.,'.，。、", {
      fontFamily: 'Arial',
      fontSize: 15,
      fontWeight: 'bold'
    });
    expect(measureTextWdith).toEqual({
      fontBoundingBoxAscent: 14,
      fontBoundingBoxDescent: 3,
      width: 390.0501427283655,
      height: 15
    });
  });
  // test('listTable API getAllCells', () => {
  //   expect(JSON.parse(JSON.stringify(listTable.getCellInfo(5, 5)))).toEqual({
  //     col: 5,
  //     row: 5,
  //     field: '省/自治区',
  //     cellHeaderPaths: {
  //       colHeaderPaths: [
  //         {
  //           field: '省/自治区'
  //         }
  //       ],
  //       rowHeaderPaths: []
  //     },
  //     caption: '省/自治区',
  //     cellType: 'text',
  //     originData: {
  //       '行 ID': '5',
  //       '订单 ID': 'CN-2018-2975416',
  //       订单日期: '2018/5/31',
  //       发货日期: '2018/6/2',
  //       邮寄方式: '二级',
  //       '客户 ID': '万兰-15730',
  //       客户名称: '万兰',
  //       细分: '消费者',
  //       城市: '汕头',
  //       '省/自治区': '广东',
  //       '国家/地区': '中国',
  //       地区: '中南',
  //       '产品 ID': '办公用-器具-10003452',
  //       类别: '办公用品',
  //       子类别: '器具',
  //       产品名称: 'KitchenAid 搅拌机, 黑色',
  //       销售额: '1375.92',
  //       数量: '3',
  //       折扣: '0',
  //       利润: '550.2'
  //     },
  //     cellRange: {
  //       bounds: {
  //         x1: 762,
  //         y1: 200,
  //         x2: 912,
  //         y2: 240
  //       }
  //     },
  //     value: '广东',
  //     dataValue: '广东',
  //     cellType: 'body',
  //     scaleRatio: 1
  //   });
  // });
  // setTimeout(() => {
  //   listTable.release();
  // }, 1000);
});
